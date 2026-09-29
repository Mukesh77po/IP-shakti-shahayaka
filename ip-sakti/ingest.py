#!/usr/bin/env python3
"""
IP-SAKTI Sahayak: Authoritative Regulatory Knowledge Base Ingestion Script
==========================================================================
Scans all PDFs recursively inside data/ (or specified folder),
extracts text page-by-page preserving page numbers,
chunks the text with semantic boundaries,
preserves complete metadata (title, organization, jurisdiction, category, page, filename, source_url),
generates embeddings, and stores them in persistent ChromaDB.

Usage:
    python ingest.py
    python ingest.py /path/to/custom_data_dir
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

from pypdf import PdfReader
import chromadb
from chromadb.utils import embedding_functions

# -----------------------------------------------------------------------------
# Configuration & Paths
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
PERSIST_DIR = BASE_DIR / "chroma_db"
COLLECTION_NAME = "ayurveda_ip_regulations"

# Authoritative Metadata Registry for Legal & Regulatory Corpus
METADATA_CATALOG = {
    "wipo_treaty": {
        "title": "WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge (2024)",
        "organization": "World Intellectual Property Organization (WIPO)",
        "jurisdiction": "International",
        "category": "International IP & Genetic Resources",
        "source_url": "https://www.wipo.int/treaties/en/ip/gratk/"
    },
    "nagoya_protocol": {
        "title": "Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits (2010)",
        "organization": "Secretariat of the Convention on Biological Diversity (UNEP)",
        "jurisdiction": "International",
        "category": "Biodiversity & Access Benefit Sharing (ABS)",
        "source_url": "https://www.cbd.int/abs/text/"
    },
    "convention_on_biological_diversity": {
        "title": "Convention on Biological Diversity (CBD, 1992)",
        "organization": "Secretariat of the Convention on Biological Diversity (UNEP)",
        "jurisdiction": "International",
        "category": "International Treaties & Conventions",
        "source_url": "https://www.cbd.int/convention/text/"
    },
    "biological_diversity_amendment_act_2023": {
        "title": "The Biological Diversity (Amendment) Act, 2023 (Act No. 10 of 2023)",
        "organization": "National Biodiversity Authority (NBA) & Ministry of Law and Justice",
        "jurisdiction": "India",
        "category": "Biodiversity & Access Benefit Sharing (ABS)",
        "source_url": "https://nbaindia.org/act/"
    },
    "biological_diversity_act_2002": {
        "title": "The Biological Diversity Act, 2002 (Act No. 18 of 2003)",
        "organization": "National Biodiversity Authority (NBA)",
        "jurisdiction": "India",
        "category": "Biodiversity & Access Benefit Sharing (ABS)",
        "source_url": "https://indiacode.nic.in/handle/123456789/2046"
    },
    "patents_act_1970": {
        "title": "The Patents Act, 1970 (Section 3(p) & Traditional Knowledge Guidelines)",
        "organization": "Office of the Controller General of Patents, Designs and Trade Marks (IP India)",
        "jurisdiction": "India",
        "category": "Patent Law & Traditional Knowledge",
        "source_url": "https://ipindia.gov.in/patents.htm"
    },
    "drugs_and_cosmetics_act_1940": {
        "title": "The Drugs and Cosmetics Act, 1940 (Chapter IVA & First Schedule Authoritative Books)",
        "organization": "Ministry of Ayush & Central Drugs Standard Control Organisation (CDSCO)",
        "jurisdiction": "India",
        "category": "Ayurvedic Drugs & Cosmetics Regulation",
        "source_url": "https://indiacode.nic.in/handle/123456789/2384"
    },
    "drugs_and_magic_remedies": {
        "title": "The Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954",
        "organization": "Ministry of Health and Family Welfare",
        "jurisdiction": "India",
        "category": "Advertising & Objectionable Claims Regulation",
        "source_url": "https://indiacode.nic.in/handle/123456789/1547"
    },
    "ayurveda_aahar": {
        "title": "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        "organization": "Food Safety and Standards Authority of India (FSSAI) & Ministry of Ayush",
        "jurisdiction": "India",
        "category": "Food Safety & Ayurveda Aahara",
        "source_url": "https://fssai.gov.in/upload/uploadfiles/files/Gazette_Notification_Ayurveda_Aahar_09_05_2022.pdf"
    },
    "trade_marks_act": {
        "title": "The Trade Marks Act, 1999 (Act No. 47 of 1999)",
        "organization": "Trade Marks Registry / Office of the CGPDTM (IP India)",
        "jurisdiction": "India",
        "category": "Trade Marks & Brand Protection",
        "source_url": "https://indiacode.nic.in/handle/123456789/1993"
    },
    "geographical_indications": {
        "title": "The Geographical Indications of Goods (Registration and Protection) Act, 1999",
        "organization": "Geographical Indications Registry / Office of the CGPDTM (IP India)",
        "jurisdiction": "India",
        "category": "Geographical Indications (GI)",
        "source_url": "https://indiacode.nic.in/handle/123456789/1987"
    },
    "designs_act": {
        "title": "The Designs Act, 2000 (Act No. 16 of 2000)",
        "organization": "Patent & Designs Office / Office of the CGPDTM (IP India)",
        "jurisdiction": "India",
        "category": "Industrial Designs Protection",
        "source_url": "https://indiacode.nic.in/handle/123456789/1910"
    },
    "fda_botanical": {
        "title": "US FDA Guidance for Industry: Botanical Drug Development",
        "organization": "US Food and Drug Administration (FDA) CDER",
        "jurisdiction": "International",
        "category": "US FDA Botanical Guidance",
        "source_url": "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/botanical-drug-development-guidance-industry"
    },
    "eu_directive_2004_24": {
        "title": "EU Directive 2004/24/EC - Traditional Herbal Medicinal Products Directive (THMPD)",
        "organization": "European Medicines Agency (EMA) / European Parliament",
        "jurisdiction": "International",
        "category": "EU Traditional Herbal Directive",
        "source_url": "https://www.ema.europa.eu/en/human-regulatory/herbal-products"
    }
}


def resolve_metadata(pdf_path: Path) -> Dict[str, Any]:
    """
    Extracts and preserves complete metadata:
    - title
    - organization
    - jurisdiction
    - category
    - filename
    - source_url
    """
    stem = pdf_path.stem.lower()
    path_parts = [p.lower() for p in pdf_path.parts]

    # 1. Determine Jurisdiction
    if "india" in path_parts or "india" in stem:
        jurisdiction = "India"
    elif "international" in path_parts or "intl" in path_parts or "international" in stem:
        jurisdiction = "International"
    else:
        # Default based on name heuristics
        if any(term in stem for term in ["act", "india", "aahar", "patents", "ayurveda"]):
            jurisdiction = "India"
        else:
            jurisdiction = "International"

    # Default metadata
    clean_title = pdf_path.stem.replace("_", " ").replace("-", " ").title()
    meta = {
        "title": clean_title,
        "organization": "Ministry of Ayush / Regulatory Authority" if jurisdiction == "India" else "International Regulatory Body",
        "jurisdiction": jurisdiction,
        "category": "Ayurvedic IP & Regulations",
        "filename": pdf_path.name,
        "source_url": "https://indiacode.nic.in" if jurisdiction == "India" else "https://www.wipo.int"
    }

    # Match against authoritative catalog
    for key, item in METADATA_CATALOG.items():
        if key in stem:
            meta["title"] = item["title"]
            meta["organization"] = item["organization"]
            meta["jurisdiction"] = item["jurisdiction"]
            meta["category"] = item["category"]
            meta["source_url"] = item["source_url"]
            break

    return meta


def clean_page_text(text: str) -> str:
    """Normalizes whitespace and removes unprintable artifacts."""
    if not text:
        return ""
    # Normalize unicode spaces and consecutive blank lines
    text = re.sub(r'[\r\f\v]', '\n', text)
    text = re.sub(r'\t', ' ', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def chunk_page_text(text: str, chunk_size: int = 750, chunk_overlap: int = 120) -> List[str]:
    """
    Splits text from a specific page into semantic overlapping chunks.
    Respects sentence and paragraph boundaries to maintain legal coherence.
    """
    cleaned = clean_page_text(text)
    if not cleaned:
        return []

    if len(cleaned) <= chunk_size:
        return [cleaned]

    # Split into sentences or clauses
    raw_sentences = re.split(r'(?<=[.!?;\n])\s+', cleaned)
    sentences = [s.strip() for s in raw_sentences if s.strip()]

    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sent_len = len(sentence)
        if current_length + sent_len > chunk_size and current_chunk:
            combined = " ".join(current_chunk).strip()
            if len(combined) > 50:
                chunks.append(combined)

            # Keep overlapping context from trailing sentences
            overlap_sentences = []
            overlap_len = 0
            for prev in reversed(current_chunk):
                if overlap_len + len(prev) < chunk_overlap:
                    overlap_sentences.insert(0, prev)
                    overlap_len += len(prev)
                else:
                    break
            current_chunk = overlap_sentences
            current_length = sum(len(s) for s in current_chunk) + len(current_chunk)

        current_chunk.append(sentence)
        current_length += sent_len + 1

    if current_chunk:
        combined = " ".join(current_chunk).strip()
        if len(combined) > 40:
            chunks.append(combined)

    return chunks


def get_embedding_function():
    """
    Returns ChromaDB's ONNX-based all-MiniLM-L6-v2 embedding function.
    Runs locally, deterministically, fast, and does NOT call external Gemini API.
    """
    return embedding_functions.DefaultEmbeddingFunction()


def find_data_directory(user_specified_dir: Optional[str] = None) -> Path:
    """Locates the data directory containing PDFs."""
    if user_specified_dir:
        p = Path(user_specified_dir).resolve()
        if p.exists() and p.is_dir():
            return p
        print(f"[Warning] Specified data directory '{user_specified_dir}' not found. Falling back.")

    candidates = [
        BASE_DIR / "data",
        BASE_DIR / "ip-sakti" / "data",
        Path.cwd() / "data"
    ]
    for candidate in candidates:
        if candidate.exists() and candidate.is_dir():
            pdfs = list(candidate.rglob("*.pdf"))
            if pdfs:
                return candidate

    # Return default data dir (create if needed)
    default_dir = BASE_DIR / "data"
    default_dir.mkdir(parents=True, exist_ok=True)
    return default_dir


def ingest_knowledge_base(data_dir: Optional[str] = None):
    """
    Main ingestion pipeline:
    1. Scan all PDFs recursively.
    2. Extract text with page numbers.
    3. Chunk the documents.
    4. Preserve metadata: title, organization, jurisdiction, category, page, filename, source_url.
    5. Generate embeddings.
    6. Store in ChromaDB.
    """
    data_path = find_data_directory(data_dir)
    print("=" * 80)
    print("  IP-SAKTI Sahayak: Authoritative Knowledge Base Ingestion")
    print(f"  Scanning Directory: {data_path.resolve()}")
    print("=" * 80)

    # 1. Scan all PDFs recursively
    pdf_files = sorted(list(data_path.rglob("*.pdf")))
    if not pdf_files:
        print(f"[Error] No PDF files found recursively in '{data_path}'.")
        print("Please place authoritative PDFs inside data/india/ and data/international/.")
        sys.exit(1)

    print(f"\n[Step 1] Discovered {len(pdf_files)} authoritative PDF document(s):")
    for idx, pdf in enumerate(pdf_files, 1):
        try:
            rel = pdf.relative_to(data_path)
        except ValueError:
            rel = pdf.name
        print(f"  {idx:2d}. {rel}")

    # Initialize ChromaDB persistent client
    PERSIST_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(PERSIST_DIR))
    embed_fn = get_embedding_function()
    
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"description": "Authoritative Ayurvedic IP & Regulatory Knowledge Base"}
    )

    all_ids: List[str] = []
    all_documents: List[str] = []
    all_metadatas: List[Dict[str, Any]] = []

    total_pages_processed = 0
    document_summary = []

    print(f"\n[Step 2 & 3] Extracting text with page numbers & semantic chunking...")
    for pdf_file in pdf_files:
        meta_base = resolve_metadata(pdf_file)
        print(f"\n-> Processing: {pdf_file.name}")
        print(f"   Title:        {meta_base['title']}")
        print(f"   Organization: {meta_base['organization']}")
        print(f"   Jurisdiction: {meta_base['jurisdiction']}")
        print(f"   Category:     {meta_base['category']}")

        try:
            reader = PdfReader(str(pdf_file))
            num_pages = len(reader.pages)
            doc_chunks_count = 0

            for page_idx, page in enumerate(reader.pages):
                page_num = page_idx + 1  # 1-based page number
                raw_text = page.extract_text() or ""
                
                # Semantic chunking
                chunks = chunk_page_text(raw_text)
                for chunk_idx, chunk_content in enumerate(chunks):
                    clean_stem = re.sub(r'[^a-zA-Z0-9_]', '_', pdf_file.stem)
                    chunk_id = f"{clean_stem}_p{page_num}_c{chunk_idx}"

                    # 4. Preserve complete metadata
                    metadata = {
                        "title": meta_base["title"],
                        "organization": meta_base["organization"],
                        "jurisdiction": meta_base["jurisdiction"],
                        "category": meta_base["category"],
                        "page": int(page_num),
                        "filename": pdf_file.name,
                        "source_url": meta_base["source_url"],
                        # Backwards compatibility alias for app citations:
                        "url": meta_base["source_url"]
                    }

                    all_ids.append(chunk_id)
                    all_documents.append(chunk_content)
                    all_metadatas.append(metadata)
                    doc_chunks_count += 1

            total_pages_processed += num_pages
            document_summary.append({
                "filename": pdf_file.name,
                "title": meta_base["title"],
                "pages": num_pages,
                "chunks": doc_chunks_count,
                "jurisdiction": meta_base["jurisdiction"],
                "category": meta_base["category"]
            })
            print(f"   Extracted {num_pages} pages -> {doc_chunks_count} chunks.")

        except Exception as e:
            print(f"   [Error] Failed to process {pdf_file.name}: {e}")

    total_chunks = len(all_documents)
    if total_chunks == 0:
        print("[Warning] No text chunks could be extracted from the provided PDFs.")
        sys.exit(1)

    # 5 & 6. Generate embeddings and store into ChromaDB
    print(f"\n[Step 4, 5 & 6] Storing {total_chunks} chunks with embeddings into ChromaDB collection '{COLLECTION_NAME}'...")
    
    # Upsert in batches of 100 for memory stability and progress feedback
    batch_size = 100
    for i in range(0, total_chunks, batch_size):
        b_ids = all_ids[i:i + batch_size]
        b_docs = all_documents[i:i + batch_size]
        b_metas = all_metadatas[i:i + batch_size]
        
        collection.upsert(
            ids=b_ids,
            documents=b_docs,
            metadatas=b_metas
        )
        print(f"  Indexed chunks {i + 1} to {min(i + batch_size, total_chunks)} of {total_chunks}...")

    final_count = collection.count()
    print("\n" + "=" * 80)
    print("  INGESTION COMPLETE")
    print("=" * 80)
    print(f"  Total Documents Ingested: {len(document_summary)}")
    print(f"  Total Pages Processed:   {total_pages_processed}")
    print(f"  Total Chunks Created:     {total_chunks}")
    print(f"  ChromaDB Collection Size: {final_count}")
    print(f"  ChromaDB Persistence:    {PERSIST_DIR.resolve()}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else None
    ingest_knowledge_base(target_dir)
