from fastapi import APIRouter, HTTPException, Depends
import chromadb

from app.config import settings
from app.models import (
    AskRequest, 
    AskResponse, 
    HealthResponse,
    SUPPORTED_PRODUCT_TYPES
)
from app.rag.retriever import RAGRetriever
from app.services.classifier import classify_product
from app.services.answer import generate_structured_answer

router = APIRouter(prefix="/api", tags=["IP-SAKTI"])

# Global RAG Retriever instance
retriever_instance: RAGRetriever = None

def get_retriever() -> RAGRetriever:
    global retriever_instance
    if retriever_instance is None:
        retriever_instance = RAGRetriever()
    return retriever_instance


@router.get("/health", response_model=HealthResponse)
def health_check(retriever: RAGRetriever = Depends(get_retriever)):
    """
    Health check endpoint reporting service status and ChromaDB collection metrics.
    """
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
def ask_question(
    request: AskRequest,
    retriever: RAGRetriever = Depends(get_retriever)
):
    """
    RAG-grounded legal and regulatory guidance endpoint for Ayurveda IP across national & international regimes.
    
    Architecture Execution:
    1. Product Classification
    2. RAG Retrieval (with Jurisdiction prioritization)
    3. Gemini Grounded Answer Generation with strict source citations
    """
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

    # Extract clean citations from retrieved chunks
    citations = retriever.extract_citations(retrieved_chunks)

    # 3. Gemini Generation (Grounded, zero hallucination)
    response = generate_structured_answer(
        request=request,
        classification=classification,
        retrieved_chunks=retrieved_chunks,
        citations=citations
    )

    return response
