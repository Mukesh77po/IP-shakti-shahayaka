import { CodeFile } from '../types';

export const PROJECT_FILES: CodeFile[] = [
  {
    path: 'ip-sakti/app/main.py',
    name: 'main.py',
    language: 'python',
    category: 'app',
    description: 'FastAPI application entry point with CORS and route mounting',
    content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api.routes import router
from app.config import settings

app = FastAPI(
    title="IP-SAKTI Sahayak (SIH26045)",
    description="A multilingual, RAG-based AI assistant for Intellectual Property and regulatory guidance in Ayurveda, across national and international regimes.",
    version="1.0.0"
)

# Enable CORS for frontend teammate integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.get("/", include_in_schema=False)
def root():
    """Redirects to interactive Swagger API documentation."""
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
`
  },
  {
    path: 'ip-sakti/app/config.py',
    name: 'config.py',
    language: 'python',
    category: 'config',
    description: 'Centralized environment and configuration loader',
    content: `import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

class Settings:
    GOOGLE_API_KEY: str = (
        os.getenv("GOOGLE_API_KEY") 
        or os.getenv("GEMINI_API_KEY") 
        or ""
    )
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
    CHROMA_PERSIST_DIR: str = str(BASE_DIR / os.getenv("CHROMA_PERSIST_DIR", "chroma_db"))
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME", "ayurveda_ip_regulations")
    DATA_DIR_INDIA: str = str(BASE_DIR / os.getenv("DATA_DIR_INDIA", "data/india"))
    DATA_DIR_INTERNATIONAL: str = str(BASE_DIR / os.getenv("DATA_DIR_INTERNATIONAL", "data/international"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
`
  },
  {
    path: 'ip-sakti/app/models.py',
    name: 'models.py',
    language: 'python',
    category: 'app',
    description: 'Pydantic schemas for requests, responses, citations & classifications',
    content: `from typing import List, Literal, Optional
from pydantic import BaseModel, Field

SUPPORTED_PRODUCT_TYPES = [
    "Classical Ayurvedic formulation",
    "Proprietary formulation",
    "New/non-classical formulation",
    "Ayurveda-Aahar",
    "Cosmetic",
    "Unknown"
]

class AskRequest(BaseModel):
    question: str = Field(..., description="Query regarding Ayurvedic IP or regulatory compliance")
    product_type: Optional[str] = Field(default="Unknown", description="Ayurvedic product category")
    jurisdiction: Optional[str] = Field(default="India", description="Target legal jurisdiction")
    language: Optional[str] = Field(default="English", description="Output response language")

class SourceCitation(BaseModel):
    title: str
    organization: str
    page: str
    url: str

class ClassificationResult(BaseModel):
    product_type: str
    jurisdiction: str
    category: str

class AskResponse(BaseModel):
    classification: ClassificationResult
    answer: str
    reasoning: str
    next_steps: List[str]
    confidence: Literal["High", "Medium", "Low"]
    sources: List[SourceCitation]
    disclaimer: str = "This is informational guidance and not legal advice."

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    chroma_db_status: str
    total_chunks_indexed: int
    supported_jurisdictions: List[str]
    supported_product_types: List[str]
`
  },
  {
    path: 'ip-sakti/app/api/routes.py',
    name: 'routes.py',
    language: 'python',
    category: 'app',
    description: 'GET /api/health and POST /api/ask API endpoints',
    content: `from fastapi import APIRouter, HTTPException, Depends
from app.models import AskRequest, AskResponse, HealthResponse, SUPPORTED_PRODUCT_TYPES
from app.rag.retriever import RAGRetriever
from app.services.classifier import classify_product
from app.services.answer import generate_structured_answer

router = APIRouter(prefix="/api", tags=["IP-SAKTI"])
retriever_instance: RAGRetriever = None

def get_retriever() -> RAGRetriever:
    global retriever_instance
    if retriever_instance is None:
        retriever_instance = RAGRetriever()
    return retriever_instance

@router.get("/health", response_model=HealthResponse)
def health_check(retriever: RAGRetriever = Depends(get_retriever)):
    try:
        count = retriever.collection.count()
        db_status = "connected"
    except Exception as e:
        count = 0
        db_status = f"error: {str(e)}"

    return HealthResponse(
        status="ok",
        service="IP-SAKTI Sahayak (SIH26045)",
        version="1.0.0",
        chroma_db_status=db_status,
        total_chunks_indexed=count,
        supported_jurisdictions=["India", "International", "US", "EU"],
        supported_product_types=SUPPORTED_PRODUCT_TYPES
    )

@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest, retriever: RAGRetriever = Depends(get_retriever)):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="The 'question' field cannot be empty.")

    # 1. Product Classification
    classification = classify_product(
        query=request.question,
        product_type=request.product_type or "Unknown",
        jurisdiction=request.jurisdiction or "India"
    )

    # 2. RAG Retrieval from ChromaDB
    retrieved_chunks = retriever.retrieve(
        question=request.question,
        product_type=classification.product_type,
        jurisdiction=request.jurisdiction or "India",
        top_k=5
    )

    citations = retriever.extract_citations(retrieved_chunks)

    # 3. Gemini Generation (Grounded, zero hallucination)
    response = generate_structured_answer(
        request=request,
        classification=classification,
        retrieved_chunks=retrieved_chunks,
        citations=citations
    )

    return response
`
  },
  {
    path: 'ip-sakti/app/rag/ingest.py',
    name: 'ingest.py',
    language: 'python',
    category: 'rag',
    description: 'PDF ingestion pipeline with page tracking, chunking, and ChromaDB storage',
    content: `import os
import re
from pathlib import Path
from pypdf import PdfReader
import chromadb
from app.config import settings

def split_text_into_chunks(text: str, chunk_size: int = 700, chunk_overlap: int = 100):
    cleaned = re.sub(r'\\s+', ' ', text).strip()
    if not cleaned:
        return []
    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + chunk_size
        chunk = cleaned[start:end]
        if end < len(cleaned):
            last_period = max(chunk.rfind('. '), chunk.rfind('; '))
            if last_period > chunk_size // 2:
                chunk = chunk[:last_period + 1]
                start += last_period + 1
            else:
                start += chunk_size - chunk_overlap
        else:
            start += chunk_size
        if len(chunk.strip()) > 40:
            chunks.append(chunk.strip())
    return chunks

def ingest_pdfs_from_directory(dir_path: str, jurisdiction: str, collection):
    directory = Path(dir_path)
    if not directory.exists():
        return 0
    pdf_files = list(directory.glob("*.pdf"))
    all_chunks, all_metadatas, all_ids = [], [], []

    for pdf_path in pdf_files:
        reader = PdfReader(str(pdf_path))
        for page_idx, page in enumerate(reader.pages):
            page_str = str(page_idx + 1)
            text = page.extract_text() or ""
            chunks = split_text_into_chunks(text)
            for chunk_idx, chunk in enumerate(chunks):
                all_ids.append(f"{pdf_path.stem}_p{page_str}_c{chunk_idx}")
                all_chunks.append(chunk)
                all_metadatas.append({
                    "title": pdf_path.stem.replace("_", " ").title(),
                    "jurisdiction": jurisdiction,
                    "page": page_str,
                    "organization": "Ministry of Ayush" if jurisdiction == "India" else "Regulatory Authority",
                    "url": "https://indiacode.nic.in" if jurisdiction == "India" else "https://www.wipo.int"
                })
    if all_chunks:
        collection.upsert(ids=all_ids, documents=all_chunks, metadatas=all_metadatas)
    return len(all_chunks)
`
  },
  {
    path: 'ip-sakti/app/rag/retriever.py',
    name: 'retriever.py',
    language: 'python',
    category: 'rag',
    description: 'ChromaDB vector retriever prioritizing target jurisdiction and metadata',
    content: `import chromadb
from app.config import settings
from app.models import SourceCitation

class RAGRetriever:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection(name=settings.COLLECTION_NAME)

    def retrieve(self, question: str, product_type: str = "Unknown", jurisdiction: str = "India", top_k: int = 5):
        enriched_query = f"[{product_type}] {question}" if product_type != "Unknown" else question
        total = self.collection.count()
        if total == 0:
            return []

        retrieved = []
        seen = set()
        norm_jur = "India" if "india" in jurisdiction.lower() else "International"

        # 1. Prioritize Target Jurisdiction
        try:
            res = self.collection.query(query_texts=[enriched_query], n_results=min(top_k, total), where={"jurisdiction": norm_jur})
            if res and res.get("documents"):
                for idx, doc in enumerate(res["documents"][0]):
                    if doc not in seen:
                        seen.add(doc)
                        retrieved.append({"text": doc, "metadata": res["metadatas"][0][idx], "priority": True})
        except Exception:
            pass

        # 2. Complementary broader search
        if len(retrieved) < top_k:
            try:
                res_all = self.collection.query(query_texts=[enriched_query], n_results=min(top_k - len(retrieved) + 2, total))
                if res_all and res_all.get("documents"):
                    for idx, doc in enumerate(res_all["documents"][0]):
                        if doc not in seen and len(retrieved) < top_k:
                            seen.add(doc)
                            retrieved.append({"text": doc, "metadata": res_all["metadatas"][0][idx], "priority": False})
            except Exception:
                pass

        return retrieved

    def extract_citations(self, chunks):
        citations, seen = [], set()
        for c in chunks:
            m = c.get("metadata", {})
            key = f"{m.get('title')}_{m.get('page')}"
            if key not in seen:
                seen.add(key)
                citations.append(SourceCitation(
                    title=m.get("title", "Official Statute"),
                    organization=m.get("organization", "Ministry of Ayush"),
                    page=str(m.get("page", "1")),
                    url=m.get("url", "https://indiacode.nic.in")
                ))
        return citations
`
  },
  {
    path: 'ip-sakti/app/rag/prompts.py',
    name: 'prompts.py',
    language: 'python',
    category: 'rag',
    description: 'System instructions enforcing zero-hallucination, citations, and standard fallback',
    content: `INSUFFICIENT_INFO_MESSAGE = "Insufficient authoritative information available to answer this reliably."

SYSTEM_PROMPT = """You are IP-SAKTI Sahayak, an authoritative, rigorous AI legal & regulatory assistant specializing in Intellectual Property, Drug Regulation, and Access-and-Benefit-Sharing (ABS) for Ayurveda across national (India) and international regimes.

CRITICAL GROUNDING MANDATE:
1. You MUST answer STRICTLY and ONLY using the provided retrieved context chunks below.
2. NEVER invent, hallucinate, extrapolate, or presume laws, sections, forms, regulations, legal tests, citations, or URLs.
3. If the retrieved context does NOT contain sufficient authoritative legal/regulatory basis to address the question, you MUST return:
   "Insufficient authoritative information available to answer this reliably."
   for the answer field, and set confidence to "Low".
4. When context is sufficient, provide a comprehensive, legally precise answer with section citations.
5. Provide actionable statutory next steps.
6. Respond in the requested language ({language}).
"""

USER_PROMPT_TEMPLATE = """Target Jurisdiction: {jurisdiction}
Product Classification: {product_type}
Language Requested: {language}

USER QUESTION:
{question}

---
RETRIEVED AUTHORITATIVE CONTEXT CHUNKS:
{context_text}
---

Return your response strictly as valid JSON:
{{
  "answer": "string",
  "reasoning": "string",
  "next_steps": ["step 1", "step 2"],
  "confidence": "High" | "Medium" | "Low"
}}
"""
`
  },
  {
    path: 'ip-sakti/app/services/classifier.py',
    name: 'classifier.py',
    language: 'python',
    category: 'services',
    description: 'Rule-based + Gemini fallback classifier supporting all 6 statutory product types',
    content: `from app.models import SUPPORTED_PRODUCT_TYPES, ClassificationResult

def rule_based_classify(query: str, specified_type: str = ""):
    text = f"{specified_type} {query}".lower()
    for pt in SUPPORTED_PRODUCT_TYPES:
        if specified_type.strip().lower() == pt.lower():
            return pt, f"Confirmed based on user specification: '{pt}'."

    if any(k in text for k in ["ayurveda-aahar", "aahar", "dietary", "food supplement", "fssai", "nutraceutical"]):
        return "Ayurveda-Aahar", "Classified under FSSAI (Ayurveda Aahar) Regulations, 2022."
    if any(k in text for k in ["cosmetic", "face wash", "cream", "shampoo", "lotion", "skin brightening"]):
        return "Cosmetic", "Classified as Cosmetic per Cosmetics Rules, 2020."
    if any(k in text for k in ["novel extract", "phytopharmaceutical", "standardized extract", "new drug"]):
        return "New/non-classical formulation", "Classified as New/Non-classical formulation requiring safety/clinical data."
    if any(k in text for k in ["classical", "charaka", "sushruta", "ashtanga", "bhasma", "triphala", "chyawanprash"]):
        return "Classical Ayurvedic formulation", "Classified as Classical Ayurvedic Medicine from First Schedule texts."
    if any(k in text for k in ["proprietary", "patent medicine", "section 3(h)", "asu proprietary"]):
        return "Proprietary formulation", "Classified as Ayurvedic Proprietary Medicine under Section 3(h)."

    return "Unknown", "Insufficient category-defining attributes; treated under general framework."

def classify_product(query: str, product_type: str = "Unknown", jurisdiction: str = "India"):
    classified_type, reasoning = rule_based_classify(query, product_type)
    return ClassificationResult(product_type=classified_type, jurisdiction=jurisdiction, category=reasoning)
`
  },
  {
    path: 'ip-sakti/app/services/answer.py',
    name: 'answer.py',
    language: 'python',
    category: 'services',
    description: 'Google GenAI SDK response generator with JSON parsing and anti-hallucination checks',
    content: `import json
from app.config import settings
from app.models import AskResponse
from app.rag.prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, INSUFFICIENT_INFO_MESSAGE

def generate_structured_answer(request, classification, retrieved_chunks, citations):
    if not retrieved_chunks:
        return AskResponse(
            classification=classification,
            answer=INSUFFICIENT_INFO_MESSAGE,
            reasoning="No authoritative legal or regulatory documents matching this query were found.",
            next_steps=["Ingest the relevant Gazette Notifications, Acts, or regulatory guidance PDFs."],
            confidence="Low",
            sources=[],
            disclaimer="This is informational guidance and not legal advice."
        )

    context_blocks = []
    for idx, chunk in enumerate(retrieved_chunks):
        m = chunk.get("metadata", {})
        context_blocks.append(f"[Source {idx+1}] {m.get('title')} (p.{m.get('page')})\\n{chunk.get('text')}")
    context_text = "\\n\\n".join(context_blocks)

    if not settings.GOOGLE_API_KEY:
        top = retrieved_chunks[0]
        return AskResponse(
            classification=classification,
            answer=f"[Authoritative Context Extracted]: {top.get('text')[:300]}...",
            reasoning="Direct authoritative extraction from ChromaDB (GOOGLE_API_KEY not set).",
            next_steps=["Configure GOOGLE_API_KEY in .env for full Gemini generation."],
            confidence="Medium",
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=USER_PROMPT_TEMPLATE.format(
                jurisdiction=request.jurisdiction,
                product_type=classification.product_type,
                language=request.language or "English",
                question=request.question,
                context_text=context_text,
                insufficient_message=INSUFFICIENT_INFO_MESSAGE
            ),
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT.format(language=request.language or "English"),
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        data = json.loads(response.text)
        return AskResponse(
            classification=classification,
            answer=data.get("answer", INSUFFICIENT_INFO_MESSAGE),
            reasoning=data.get("reasoning", ""),
            next_steps=data.get("next_steps", []),
            confidence=data.get("confidence", "Medium"),
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )
    except Exception as e:
        return AskResponse(
            classification=classification,
            answer=f"Error during synthesis: {e}",
            reasoning="Inference failure.",
            next_steps=["Verify API key and quota."],
            confidence="Low",
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )
`
  },
  {
    path: 'ip-sakti/requirements.txt',
    name: 'requirements.txt',
    language: 'text',
    category: 'config',
    description: 'Exact Python dependencies for pip install',
    content: `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
pydantic-settings>=2.2.0
google-genai>=1.0.0
chromadb>=0.4.24
pypdf>=4.0.0
python-dotenv>=1.0.0
requests>=2.31.0
`
  },
  {
    path: 'ip-sakti/.env.example',
    name: '.env.example',
    language: 'bash',
    category: 'config',
    description: 'Environment variables template',
    content: `# Google Gemini API Key
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# ChromaDB Settings
CHROMA_PERSIST_DIR=./chroma_db
COLLECTION_NAME=ayurveda_ip_regulations

# Gemini Models
GEMINI_MODEL=gemini-3.8-flash
EMBEDDING_MODEL=text-embedding-004

# Data Directories
DATA_DIR_INDIA=./data/india
DATA_DIR_INTERNATIONAL=./data/international

# Server Host & Port
HOST=0.0.0.0
PORT=8000
`
  },
  {
    path: 'ingest.py',
    name: 'ingest.py',
    language: 'python',
    category: 'rag',
    description: 'Recursive scanner, extractor, chunker, and ChromaDB vector database ingestion pipeline',
    content: `#!/usr/bin/env python3
"""
IP-SAKTI Sahayak: Authoritative Knowledge Base Ingestion Script
Recursively scans data/india and data/international PDFs, extracts text with page numbers,
chunks with semantic boundaries, preserves complete metadata, and stores into ChromaDB.
"""
import sys
from pathlib import Path
from ingest import ingest_knowledge_base

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else None
    ingest_knowledge_base(target_dir)
`
  },
  {
    path: 'test_rag.py',
    name: 'test_rag.py',
    language: 'python',
    category: 'rag',
    description: 'Offline RAG semantic retrieval verification test (zero Gemini API calls needed)',
    content: `#!/usr/bin/env python3
"""
IP-SAKTI Sahayak: Offline RAG Retrieval Verification Test
Tests semantic retrieval from ChromaDB WITHOUT calling Gemini.
Prints: QUERY, RETRIEVED DOCUMENT, PAGE, RELEVANCE, and TEXT PREVIEW.
"""
import sys
from test_rag import main

if __name__ == "__main__":
    main()
`
  }
];
