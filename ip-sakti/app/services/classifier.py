import json
import re
from typing import Dict, Tuple

from app.config import settings
from app.models import SUPPORTED_PRODUCT_TYPES, ClassificationResult
from app.rag.prompts import CLASSIFIER_PROMPT


def rule_based_classify(query: str, specified_type: str = "") -> Tuple[str, str]:
    """
    Fast, deterministic legal heuristic classifier based on Indian and International
    statutory categories (Drugs & Cosmetics Act First Schedule, Section 3(h),
    FSSAI Ayurveda-Aahar 2022, Cosmetics Rules 2020).
    """
    text = f"{specified_type} {query}".lower()
    
    # Check if user already provided an exact match
    for pt in SUPPORTED_PRODUCT_TYPES:
        if specified_type.strip().lower() == pt.lower():
            return pt, f"Confirmed based on user specification adhering to statutory category: '{pt}'."

    # 1. Ayurveda-Aahar (FSSAI Regulations 2022)
    if any(k in text for k in ["ayurveda-aahar", "ayurveda aahar", "aahar", "dietary", "food supplement", "fssai", "nutraceutical", "porridge", "herbal tea", "beverage", "snack"]):
        return "Ayurveda-Aahar", "Classified under Food Safety and Standards (Ayurveda Aahar) Regulations, 2022 for foods prepared per Ayurvedic authoritative principles."

    # 2. Cosmetic (Cosmetics Rules 2020 / Drugs & Cosmetics Act)
    if any(k in text for k in ["cosmetic", "face wash", "cream", "shampoo", "lotion", "skin brightening", "cleansing", "beautifying", "hair dye", "soap", "moisturizer"]):
        return "Cosmetic", "Classified as Cosmetic per Cosmetics Rules, 2020 and Drugs & Cosmetics Act (articles intended for cleansing or beautifying without therapeutic claims)."

    # 3. New/non-classical formulation (Phytopharmaceutical / Novel extract)
    if any(k in text for k in ["novel extract", "phytopharmaceutical", "standardized extract", "isolated fraction", "synthetic", "nanoparticle", "new drug", "non-classical", "modern chemical"]):
        return "New/non-classical formulation", "Classified as New/Non-classical formulation (involves novel extraction methods, phytopharmaceuticals, or uncodified ingredients requiring safety & clinical trials)."

    # 4. Classical Ayurvedic formulation (First Schedule texts)
    if any(k in text for k in ["classical", "charaka", "sushruta", "ashtanga", "sahasrayogam", "bhasma", "triphala", "chyawanprash", "taila", "arishta", "asava", "rasashastra", "first schedule"]):
        return "Classical Ayurvedic formulation", "Classified as Classical Ayurvedic Medicine manufactured exclusively according to formulas in First Schedule texts of Drugs and Cosmetics Act, 1940."

    # 5. Proprietary formulation (Section 3(h))
    if any(k in text for k in ["proprietary", "patent medicine", "section 3(h)", "asu proprietary", "custom blend", "proprietary formulation"]):
        return "Proprietary formulation", "Classified as Ayurvedic Proprietary Medicine under Section 3(h) of Drugs and Cosmetics Act (contains classical ingredients in non-classical proportions or dosages)."

    return "Unknown", "Insufficient category-defining attributes in query; treated under general regulatory framework."


def classify_product(query: str, product_type: str = "Unknown", jurisdiction: str = "India") -> ClassificationResult:
    """
    Classifies the product into one of the 6 statutory categories using
    rules, falling back to Gemini when ambiguous.
    """
    # 1. Try rule-based classification first
    classified_type, reasoning = rule_based_classify(query, product_type)
    
    # 2. If indeterminate and Gemini API key is available, use Gemini classifier
    if classified_type == "Unknown" and settings.GOOGLE_API_KEY:
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            prompt = CLASSIFIER_PROMPT.format(query=query, product_type=product_type)
            
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            
            data = json.loads(response.text)
            pt = data.get("product_type", "").strip()
            exp = data.get("category_explanation", "").strip()
            
            # Match returned type to allowed enum
            for valid in SUPPORTED_PRODUCT_TYPES:
                if valid.lower() in pt.lower():
                    classified_type = valid
                    reasoning = exp or f"Classified as {valid} via legal semantic evaluation."
                    break
        except Exception:
            # Fallback to current classification
            pass

    return ClassificationResult(
        product_type=classified_type,
        jurisdiction=jurisdiction,
        category=reasoning
    )
