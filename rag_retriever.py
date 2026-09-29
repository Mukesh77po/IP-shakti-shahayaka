import sys
import json
import re
import chromadb
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


CHROMA_PATH = "./chroma_db"
COLLECTION_NAME = "ayurveda_ip_regulations"

MIN_RELEVANCE = 0.62


# ---------------------------------------------------------
# 1. QUERY CLASSIFICATION
# ---------------------------------------------------------

def classify_query(question: str, product_type: str = "") -> str:
    """
    Deterministic classification before vector retrieval.
    This prevents statute-specific questions from being
    routed to the wrong regulatory category.
    """

    q = question.lower().strip()

    # Patent / Traditional Knowledge
    patent_patterns = [
        r"\bpatent\b",
        r"\bpatents\b",
        r"\bpatentability\b",
        r"\bpatentable\b",
        r"\bprior art\b",
        r"\bnovelty\b",
        r"\binventive step\b",
        r"\bsection\s*3\s*\([a-z]\)\b",
        r"\bsection\s*4\b",
        r"\bsection\s*10\b",
        r"\bsection\s*25\b",
        r"\btraditional knowledge\b",
        r"\btkdl\b",
    ]

    if any(re.search(pattern, q) for pattern in patent_patterns):
        return "Patent Law & Traditional Knowledge"

    # Trademark
    trademark_patterns = [
        r"\btrademark\b",
        r"\btrade mark\b",
        r"\bbrand name\b",
        r"\bword mark\b",
        r"\blogo\b",
        r"\bsection\s*9\b",
        r"\bsection\s*11\b",
    ]

    if any(re.search(pattern, q) for pattern in trademark_patterns):
        return "Trade Marks & Brand Protection"

    # Biodiversity / ABS
    biodiversity_patterns = [
        r"\bbiodiversity\b",
        r"\bbiological resource\b",
        r"\bbiological resources\b",
        r"\baccess and benefit sharing\b",
        r"\babs\b",
        r"\bnba\b",
        r"\bstate biodiversity board\b",
        r"\bbenefit sharing\b",
    ]

    if any(re.search(pattern, q) for pattern in biodiversity_patterns):
        return "Biodiversity & Access Benefit Sharing (ABS)"

    # Food / Ayurveda Aahara
    food_patterns = [
        r"\bayurveda aahara\b",
        r"\bayurveda ahara\b",
        r"\bfood safety\b",
        r"\bfssai\b",
        r"\bnutraceutical\b",
        r"\bfood product\b",
    ]

    if any(re.search(pattern, q) for pattern in food_patterns):
        return "Food Safety & Ayurveda Aahara"

    # Drugs / Cosmetics / AYUSH regulation
    drug_patterns = [
        r"\bdrugs and cosmetics\b",
        r"\bayush\b",
        r"\bdrug license\b",
        r"\bmanufacturing license\b",
        r"\bcosmetic\b",
        r"\bmedicine license\b",
        r"\bmanufacture\b",
    ]

    if any(re.search(pattern, q) for pattern in drug_patterns):
        return "Ayurvedic Drugs & Cosmetics Regulation"

    # Product context fallback
    product = product_type.lower()

    if "patent" in product:
        return "Patent Law & Traditional Knowledge"

    if "trademark" in product or "brand" in product:
        return "Trade Marks & Brand Protection"

    if "biodiversity" in product or "abs" in product:
        return "Biodiversity & Access Benefit Sharing (ABS)"

    if "food" in product or "aahara" in product:
        return "Food Safety & Ayurveda Aahara"

    return "Ayurvedic Drugs & Cosmetics Regulation"


# ---------------------------------------------------------
# 2. CATEGORY BOOST
# ---------------------------------------------------------

def category_boost(category: str, title: str, query_category: str) -> float:
    """
    Boost documents belonging to the category selected by
    deterministic query classification.
    """

    text = f"{category} {title}".lower()
    target = query_category.lower()

    # Strong category match
    if target == "patent law & traditional knowledge":
        if any(x in text for x in [
            "patent",
            "traditional knowledge",
            "tkdl",
            "patents act"
        ]):
            return 0.20

        if any(x in text for x in [
            "trade mark",
            "trademark",
            "food",
            "fssai",
            "biodiversity"
        ]):
            return -0.15

    elif target == "trade marks & brand protection":
        if any(x in text for x in [
            "trade mark",
            "trademark",
            "brand"
        ]):
            return 0.20

        if any(x in text for x in [
            "patent",
            "biodiversity",
            "fssai"
        ]):
            return -0.15

    elif target == "biodiversity & access benefit sharing (abs)":
        if any(x in text for x in [
            "biodiversity",
            "biological diversity",
            "access benefit",
            "abs",
            "nba"
        ]):
            return 0.20

        if any(x in text for x in [
            "patent",
            "trade mark",
            "fssai"
        ]):
            return -0.15

    elif target == "food safety & ayurveda aahara":
        if any(x in text for x in [
            "food",
            "fssai",
            "ayurveda aahara",
            "aahara"
        ]):
            return 0.20

    elif target == "ayurvedic drugs & cosmetics regulation":
        if any(x in text for x in [
            "drugs and cosmetics",
            "ayurvedic drugs",
            "ayush",
            "cosmetic"
        ]):
            return 0.20

    return 0.0

    # ---------------------------------------------------------
    # First try jurisdiction-filtered retrieval
    # ---------------------------------------------------------
    if where_filter:
        try:
            results = collection.query(
                query_texts=[enriched_query],
                n_results=min(top_k, total_docs),
                where=where_filter
            )
        except Exception as error:
            print(
                f"Jurisdiction-filtered retrieval failed: {error}",
                file=sys.stderr
            )
            results = None

    # ---------------------------------------------------------
    # If filtered retrieval failed or returned nothing,
    # search entire collection
    # ---------------------------------------------------------
    if (
        not results
        or not results.get("documents")
        or not results["documents"][0]
    ):
        results = collection.query(
            query_texts=[enriched_query],
            n_results=min(top_k, total_docs)
        )

    retrieved = []

    # ---------------------------------------------------------
    # Convert ChromaDB results into clean objects
    # ---------------------------------------------------------
    if results and results.get("documents"):

        documents = results["documents"][0]

        metadatas = (
            results.get("metadatas", [[]])[0]
            if results.get("metadatas")
            else []
        )

        distances = (
            results.get("distances", [[]])[0]
            if results.get("distances")
            else []
        )

        for i, document in enumerate(documents):

            metadata = (
                metadatas[i]
                if i < len(metadatas)
                else {}
            )

            distance = (
                distances[i]
                if i < len(distances)
                else 1.0
            )

            # Chroma distance → relevance score
            relevance = max(
                0.0,
                min(
                    1.0,
                    1.0 - (distance / 2.0)
                )
            )

            retrieved.append({
                "title": metadata.get(
                    "title",
                    "Unknown statutory document"
                ),

                "filename": metadata.get(
                    "filename",
                    "N/A"
                ),

                "organization": metadata.get(
                    "organization",
                    "Regulatory Authority"
                ),

                "jurisdiction": metadata.get(
                    "jurisdiction",
                    "N/A"
                ),

                "category": metadata.get(
                    "category",
                    "N/A"
                ),

                "page": metadata.get(
                    "page",
                    1
                ),

                "source_url": metadata.get(
                    "source_url",
                    metadata.get(
                        "url",
                        "N/A"
                    )
                ),

                "relevance": round(
                    relevance,
                    4
                ),

                "distance": round(
                    distance,
                    4
                ),

                "text": document
            })

    # ---------------------------------------------------------
    # Remove weak semantic matches
    # ---------------------------------------------------------
    retrieved = [
        item
        for item in retrieved
        if item["relevance"] >= MIN_RELEVANCE
    ]

    # ---------------------------------------------------------
    # Query-aware reranking
    # ---------------------------------------------------------
    for item in retrieved:

        boost = category_boost(
            query,
            item
        )

        item["rerank_score"] = round(
            item["relevance"] + boost,
            4
        )

    # ---------------------------------------------------------
    # Sort highest rerank score first
    # ---------------------------------------------------------
    retrieved.sort(
        key=lambda item: item["rerank_score"],
        reverse=True
    )

    # ---------------------------------------------------------
    # Remove internal rerank score from API output
    # ---------------------------------------------------------
    for item in retrieved:
        item.pop(
            "rerank_score",
            None
        )

    return retrieved


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "results": [],
            "evidence_status": "insufficient"
        }))
        return

    question = sys.argv[1]
    product_type = sys.argv[2] if len(sys.argv) > 2 else ""
    jurisdiction = sys.argv[3] if len(sys.argv) > 3 else "India"
    top_k = int(sys.argv[4]) if len(sys.argv) > 4 else 5

    # -----------------------------------------------------
    # CLASSIFY BEFORE RETRIEVAL
    # -----------------------------------------------------

    query_category = classify_query(
        question,
        product_type
    )

    # Add classification to the semantic query
        # -----------------------------------------------------
    # STATUTE-AWARE QUERY ENRICHMENT
    # -----------------------------------------------------

    q_lower = question.lower()

    if (
        "section 3(p)" in q_lower
        or "section 3 (p)" in q_lower
        or "patents act" in q_lower
        or "patent act" in q_lower
    ):
        enriched_query = (
            "The Patents Act, 1970. "
            "Section 3(p). "
            "Patent Law & Traditional Knowledge. "
            "Traditional Knowledge Digital Library TKDL. "
            f"{question}"
        )

    elif (
        "section 9" in q_lower
        or "section 11" in q_lower
        or "trade marks act" in q_lower
        or "trademark act" in q_lower
    ):
        enriched_query = (
            "The Trade Marks Act, 1999. "
            "Trade Marks & Brand Protection. "
            f"{question}"
        )

    elif (
        "section 7" in q_lower
        or "biodiversity" in q_lower
        or "biological diversity" in q_lower
        or "biological resource" in q_lower
    ):
        enriched_query = (
            "The Biological Diversity Act. "
            "The Biological Diversity (Amendment) Act, 2023. "
            "Biodiversity & Access Benefit Sharing ABS. "
            f"{question}"
        )

    else:
        enriched_query = (
            f"{query_category}. "
            f"{product_type}. "
            f"{question}"
        )
    # -----------------------------------------------------
    # CHROMA
    # -----------------------------------------------------

    client = chromadb.PersistentClient(
        path=CHROMA_PATH
    )

    collection = client.get_collection(
        COLLECTION_NAME,
        embedding_function=DefaultEmbeddingFunction()
    )

    # -----------------------------------------------------
    # JURISDICTION FILTER
    # -----------------------------------------------------

    try:
        query_result = collection.query(
            query_texts=[enriched_query],
            n_results=top_k,
            where={"jurisdiction": jurisdiction}
        )

        if not query_result.get("documents") or not query_result["documents"][0]:
            query_result = collection.query(
                query_texts=[enriched_query],
                n_results=top_k
            )

    except Exception:
        query_result = collection.query(
            query_texts=[enriched_query],
            n_results=top_k
        )

    documents = query_result.get("documents", [[]])[0]
    metadatas = query_result.get("metadatas", [[]])[0]
    distances = query_result.get("distances", [[]])[0]

    results = []

    # -----------------------------------------------------
    # SCORE + RERANK
    # -----------------------------------------------------

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):
        relevance = max(
            0.0,
            min(
                1.0,
                1.0 - (distance / 2.0)
            )
        )

        if relevance < MIN_RELEVANCE:
            continue

        metadata = metadata or {}

        title = metadata.get("title", "")
        category = metadata.get("category", "")

        boost = category_boost(
            category,
            title,
            query_category
        )

        rerank_score = relevance + boost

        results.append({
            "title": title,
            "organization": metadata.get("organization", ""),
            "page": metadata.get("page"),
            "url": metadata.get("url", ""),
            "category": category,
            "content": document,
            "relevance": relevance,
            "rerank_score": rerank_score
        })

    results.sort(
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    # Remove internal reranking score
    for result in results:
        result.pop("rerank_score", None)

    # -----------------------------------------------------
    # OUTPUT
    # -----------------------------------------------------

    output = json.dumps({
    "query": question,
    "query_category": query_category,
    "product_type": product_type,
    "jurisdiction": jurisdiction,
    "results": results[:top_k]
}, ensure_ascii=False)

    print(output)

if __name__ == "__main__":
    main()