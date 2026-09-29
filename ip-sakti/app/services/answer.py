import json
from typing import List, Dict, Any, Optional

from app.config import settings
from app.models import (
    AskRequest, 
    AskResponse, 
    ClassificationResult, 
    SourceCitation
)
from app.rag.prompts import (
    SYSTEM_PROMPT, 
    USER_PROMPT_TEMPLATE, 
    INSUFFICIENT_INFO_MESSAGE
)


def generate_structured_answer(
    request: AskRequest,
    classification: ClassificationResult,
    retrieved_chunks: List[Dict[str, Any]],
    citations: List[SourceCitation]
) -> AskResponse:
    """
    Generates an authoritative, source-grounded answer using Google Gemini API.
    Strictly forbids hallucinations. If context is insufficient, returns
    standard insufficiency notice.
    """
    # 1. Guard against empty retrieval
    if not retrieved_chunks:
        return AskResponse(
            classification=classification,
            answer=INSUFFICIENT_INFO_MESSAGE,
            reasoning="No authoritative legal or regulatory documents matching this query were found in the knowledge base.",
            next_steps=[
                "Verify whether the query relates to Indian (Ayush, CDSCO, NBA, FSSAI) or International (FDA, EMA) regimes.",
                "Ingest the relevant Gazette Notifications, Acts, or regulatory guidance PDFs into the data/ directory."
            ],
            confidence="Low",
            sources=[],
            disclaimer="This is informational guidance and not legal advice."
        )

    # 2. Build formatted context string with explicit document IDs and metadata
    context_blocks = []
    for idx, chunk in enumerate(retrieved_chunks):
        meta = chunk.get("metadata", {})
        doc_str = (
            f"[Source {idx + 1}]\n"
            f"Title: {meta.get('title', 'Official Statute')}\n"
            f"Organization: {meta.get('organization', 'Statutory Authority')}\n"
            f"Jurisdiction: {meta.get('jurisdiction', request.jurisdiction)} | Page: {meta.get('page', '1')}\n"
            f"URL: {meta.get('url', '')}\n"
            f"Content: {chunk.get('text', '').strip()}"
        )
        context_blocks.append(doc_str)

    context_text = "\n\n".join(context_blocks)

    # 3. Construct System and User Prompts
    language = request.language or "English"
    system_instruction = SYSTEM_PROMPT.format(language=language)
    user_prompt = USER_PROMPT_TEMPLATE.format(
        jurisdiction=request.jurisdiction or "India",
        product_type=classification.product_type,
        language=language,
        question=request.question,
        context_text=context_text,
        insufficient_message=INSUFFICIENT_INFO_MESSAGE
    )

    # 4. Check for Gemini API key
    if not settings.GOOGLE_API_KEY:
        # Fallback when testing without API key: return structured extraction from top chunk
        top_chunk = retrieved_chunks[0]
        meta = top_chunk.get("metadata", {})
        return AskResponse(
            classification=classification,
            answer=f"[Notice: GOOGLE_API_KEY not configured] Retrieved authoritative context from {meta.get('title', 'Corpus')} (Page {meta.get('page', '1')}): {top_chunk.get('text', '')[:350]}...",
            reasoning="Extracted directly from authoritative ChromaDB chunk because GOOGLE_API_KEY is not set.",
            next_steps=[
                "Set GOOGLE_API_KEY in .env to enable full Gemini reasoning and synthesis.",
                "Review the cited statutory document directly at the provided official portal."
            ],
            confidence="Medium",
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )

    # 5. Call Google GenAI SDK
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        response_text = response.text.strip()
        data = json.loads(response_text)

        raw_answer = data.get("answer", "").strip()
        raw_reasoning = data.get("reasoning", "").strip()
        raw_next_steps = data.get("next_steps", [])
        raw_confidence = data.get("confidence", "Medium")

        # Validate confidence enum
        if raw_confidence not in ["High", "Medium", "Low"]:
            raw_confidence = "Medium"

        # Check for insufficiency triggers
        if (
            INSUFFICIENT_INFO_MESSAGE.lower() in raw_answer.lower() 
            or "insufficient" in raw_answer.lower() and len(raw_answer) < 120
        ):
            return AskResponse(
                classification=classification,
                answer=INSUFFICIENT_INFO_MESSAGE,
                reasoning=raw_reasoning or "The retrieved authoritative texts do not contain sufficient specific provisions to resolve this query conclusively.",
                next_steps=raw_next_steps or [
                    "Consult the relevant statutory gazette directly.",
                    "Verify if specific jurisdictional rules or amendments apply."
                ],
                confidence="Low",
                sources=[],
                disclaimer="This is informational guidance and not legal advice."
            )

        return AskResponse(
            classification=classification,
            answer=raw_answer,
            reasoning=raw_reasoning,
            next_steps=raw_next_steps,
            confidence=raw_confidence,
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )

    except Exception as e:
        # Graceful recovery if Gemini API fails or returns invalid JSON
        print(f"[Error] Gemini API generation failed: {e}")
        return AskResponse(
            classification=classification,
            answer=f"Error generating synthesis via Gemini API: {str(e)}. Retrieved {len(retrieved_chunks)} relevant authoritative chunks.",
            reasoning="API communication or JSON decoding failure during inference.",
            next_steps=[
                "Verify your GOOGLE_API_KEY quota and model access.",
                "Review the cited authoritative sources below."
            ],
            confidence="Low",
            sources=citations,
            disclaimer="This is informational guidance and not legal advice."
        )
