import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

from pypdf import PdfReader
import chromadb
from chromadb.config import Settings as ChromaSettings

# Import local settings
# Allow running directly or as module
try:
    from app.config import settings
except ImportError:
    # If run directly from app/rag/ or project root
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from app.config import settings

# Metadata mapping for known public legal PDFs
DEFAULT_META_MAPPING = {
    "drugs_and_cosmetics": {
        "title": "Drugs and Cosmetics Act, 1940 & Rules 1945",
        "organization": "Ministry of Ayush / CDSCO",
        "url": "https://indiacode.nic.in/handle/123456789/2384"
    },
    "biological_diversity": {
        "title": "Biological Diversity Act, 2002 & Amendment Act 2023",
        "organization": "National Biodiversity Authority (NBA)",
        "url": "https://nbaindia.org/act/"
    },
    "patents_act": {
        "title": "The Patents Act, 1970 (Section 3(p) & TK Guidelines)",
        "organization": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
        "url": "https://ipindia.gov.in/patents.htm"
    },
    "ayurveda_aahar": {
        "title": "Food Safety and Standards (Ayurveda Aahar) Regulations, 2022",
        "organization": "Food Safety and Standards Authority of India (FSSAI)",
        "url": "https://fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Ayurveda_Aahar_09_05_2022.pdf"
    },
    "tkdl_guidelines": {
        "title": "Traditional Knowledge Digital Library (TKDL) Prior Art Standards",
        "organization": "CSIR-TKDL & Ministry of Ayush",
        "url": "https://www.tkdl.res.in"
    },
    "fda_botanical": {
        "title": "US FDA Guidance for Industry: Botanical Drug Development",
        "organization": "US Food and Drug Administration (FDA) CDER",
        "url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/botanical-drug-development-guidance-industry"
    },
    "eu_thmpd": {
        "title": "EU Directive 2004/24/EC - Traditional Herbal Medicinal Products (THMPD)",
        "organization": "European Medicines Agency (EMA) / HMPC",
        "url": "https://www.ema.europa.eu/en/human-regulatory/herbal-products"
    }
}


def get_chroma_client() -> chromadb.PersistentClient:
    """Initializes or connects to persistent ChromaDB."""
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
    return chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)


def get_or_create_collection(client: chromadb.PersistentClient):
    """Retrieves or creates the vector collection."""
    return client.get_or_create_collection(
        name=settings.COLLECTION_NAME,
        metadata={"description": "Authoritative Ayurvedic IP & Regulatory Knowledge Base"}
    )


def extract_metadata_for_file(pdf_path: Path, jurisdiction: str) -> Dict[str, str]:
    """Derives metadata from filename, path, or PDF properties."""
    stem = pdf_path.stem.lower()
    meta = {
        "title": pdf_path.stem.replace("_", " ").title(),
        "organization": "Ministry of Ayush" if jurisdiction == "India" else "International Regulatory Authority",
        "jurisdiction": jurisdiction,
        "url": "https://indiacode.nic.in" if jurisdiction == "India" else "https://www.wipo.int"
    }
    
    # Match against known legal corpus signatures
    for key, mapped in DEFAULT_META_MAPPING.items():
        if key in stem:
            meta["title"] = mapped["title"]
            meta["organization"] = mapped["organization"]
            meta["url"] = mapped["url"]
            break
            
    return meta


def split_text_into_chunks(text: str, chunk_size: int = 700, chunk_overlap: int = 100) -> List[str]:
    """Splits a page text into overlapping semantic chunks."""
    cleaned = re.sub(r'\s+', ' ', text).strip()
    if not cleaned:
        return []
    
    if len(cleaned) <= chunk_size:
        return [cleaned]
        
    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + chunk_size
        chunk = cleaned[start:end]
        
        # Try to break at a sentence boundary if possible
        if end < len(cleaned):
            last_period = max(chunk.rfind('. '), chunk.rfind('; '), chunk.rfind('\n'))
            if last_period != -1 and last_period > chunk_size // 2:
                chunk = chunk[:last_period + 1]
                start += last_period + 1
            else:
                start += chunk_size - chunk_overlap
        else:
            start += chunk_size
            
        chunk_clean = chunk.strip()
        if len(chunk_clean) > 40:  # skip trivial fragments
            chunks.append(chunk_clean)
            
    return chunks


def generate_gemini_embeddings(texts: List[str], api_key: str, model_name: str = "text-embedding-004") -> Optional[List[List[float]]]:
    """Generates embeddings using Google GenAI SDK if API key is available."""
    if not api_key:
        return None
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        # Batch in sets of 20 to avoid exceeding request payloads
        all_embeddings: List[List[float]] = []
        batch_size = 20
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            result = client.models.embed_content(
                model=model_name,
                contents=batch,
            )
            for emb in result.embeddings:
                all_embeddings.append(emb.values)
        return all_embeddings
    except Exception as e:
        print(f"[Warning] Gemini API embedding failed ({e}). Falling back to local vector representation.")
        return None


def ingest_pdfs_from_directory(dir_path: str, jurisdiction: str, collection) -> int:
    """Reads all PDFs in a directory, chunks them, and adds to ChromaDB."""
    directory = Path(dir_path)
    if not directory.exists():
        print(f"[Info] Directory does not exist: {dir_path}. Creating it.")
        directory.mkdir(parents=True, exist_ok=True)
        return 0

    pdf_files = list(directory.glob("*.pdf"))
    if not pdf_files:
        print(f"[Notice] No PDF files found in {dir_path}")
        return 0

    total_chunks_added = 0
    all_chunks: List[str] = []
    all_metadatas: List[Dict[str, Any]] = []
    all_ids: List[str] = []

    print(f"\n--- Processing {len(pdf_files)} PDF(s) in {jurisdiction} [{dir_path}] ---")
    
    for pdf_path in pdf_files:
        print(f"Reading: {pdf_path.name}")
        base_meta = extract_metadata_for_file(pdf_path, jurisdiction)
        
        try:
            reader = PdfReader(str(pdf_path))
            for page_idx, page in enumerate(reader.pages):
                page_number_str = str(page_idx + 1)
                text = page.extract_text() or ""
                chunks = split_text_into_chunks(text)
                
                for chunk_idx, chunk in enumerate(chunks):
                    chunk_id = f"{pdf_path.stem}_p{page_number_str}_c{chunk_idx}"
                    metadata = {
                        "title": base_meta["title"],
                        "organization": base_meta["organization"],
                        "jurisdiction": jurisdiction,
                        "page": page_number_str,
                        "url": base_meta["url"],
                        "source_file": pdf_path.name
                    }
                    all_ids.append(chunk_id)
                    all_chunks.append(chunk)
                    all_metadatas.append(metadata)
        except Exception as e:
            print(f"Error reading {pdf_path.name}: {e}")

    if not all_chunks:
        return 0

    print(f"Extracted {len(all_chunks)} chunks for {jurisdiction}. Indexing into ChromaDB...")
    
    # Attempt embedding generation with Gemini
    embeddings = generate_gemini_embeddings(all_chunks, settings.GOOGLE_API_KEY, settings.EMBEDDING_MODEL)
    
    batch_size = 50
    for i in range(0, len(all_chunks), batch_size):
        b_ids = all_ids[i:i + batch_size]
        b_docs = all_chunks[i:i + batch_size]
        b_meta = all_metadatas[i:i + batch_size]
        
        if embeddings and len(embeddings) == len(all_chunks):
            b_emb = embeddings[i:i + batch_size]
            collection.upsert(ids=b_ids, documents=b_docs, metadatas=b_meta, embeddings=b_emb)
        else:
            # Upsert without embeddings; Chroma will use its internal default
            collection.upsert(ids=b_ids, documents=b_docs, metadatas=b_meta)
            
        total_chunks_added += len(b_ids)

    print(f"Successfully indexed {total_chunks_added} chunks for {jurisdiction}.")
    return total_chunks_added


def run_ingestion():
    """Main ingestion coordinator."""
    print("=" * 60)
    print("IP-SAKTI Sahayak: Regulatory Knowledge Base Ingestion")
    print("=" * 60)
    
    client = get_chroma_client()
    collection = get_or_create_collection(client)
    
    initial_count = collection.count()
    print(f"Current chunks in ChromaDB: {initial_count}")
    
    india_added = ingest_pdfs_from_directory(settings.DATA_DIR_INDIA, "India", collection)
    intl_added = ingest_pdfs_from_directory(settings.DATA_DIR_INTERNATIONAL, "International", collection)
    
    final_count = collection.count()
    print("\nIngestion Summary:")
    print(f"- India chunks added: {india_added}")
    print(f"- International chunks added: {intl_added}")
    print(f"- Total chunks in database: {final_count}")
    print("=" * 60)


if __name__ == "__main__":
    run_ingestion()
