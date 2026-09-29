from typing import List, Literal, Optional
from pydantic import BaseModel, Field

# Supported Product Classifications
SUPPORTED_PRODUCT_TYPES = [
    "Classical Ayurvedic formulation",
    "Proprietary formulation",
    "New/non-classical formulation",
    "Ayurveda-Aahar",
    "Cosmetic",
    "Unknown"
]

class AskRequest(BaseModel):
    question: str = Field(
        ..., 
        description="The query regarding Ayurvedic IP or regulatory compliance",
        example="Can I patent a classical formulation like Chyawanprash with added preservative?"
    )
    product_type: Optional[str] = Field(
        default="Unknown", 
        description="Ayurvedic product category or formulation type",
        example="Classical Ayurvedic formulation"
    )
    jurisdiction: Optional[str] = Field(
        default="India", 
        description="Target legal jurisdiction (e.g., India, US, EU, International)",
        example="India"
    )
    language: Optional[str] = Field(
        default="English", 
        description="Output language for the response (e.g., English, Hindi)",
        example="English"
    )

class SourceCitation(BaseModel):
    title: str = Field(..., description="Document or Act title")
    organization: str = Field(..., description="Authoritative issuing organization")
    page: str = Field(..., description="Page number or section")
    url: str = Field(..., description="Official authoritative source URL")

class ClassificationResult(BaseModel):
    product_type: str = Field(..., description="Classified or confirmed product type")
    jurisdiction: str = Field(..., description="Target jurisdiction evaluated")
    category: str = Field(..., description="Regulatory categorization explanation")

class AskResponse(BaseModel):
    classification: ClassificationResult
    answer: str = Field(..., description="Authoritative RAG-grounded answer or insufficiency notice")
    reasoning: str = Field(..., description="Legal rationale linking retrieved context to the conclusion")
    next_steps: List[str] = Field(default_factory=list, description="Actionable statutory next steps for applicant/innovator")
    confidence: Literal["High", "Medium", "Low"] = Field(..., description="Confidence level based on authoritative retrieval completeness")
    sources: List[SourceCitation] = Field(default_factory=list, description="Authoritative citations backing the answer")
    disclaimer: str = Field(
        default="This is informational guidance and not legal advice.",
        description="Mandatory legal disclaimer"
    )

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    chroma_db_status: str
    total_chunks_indexed: int
    supported_jurisdictions: List[str]
    supported_product_types: List[str]
