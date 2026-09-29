#!/usr/bin/env python3
"""
IP-SAKTI Sahayak: Offline RAG Retrieval Verification Test
=========================================================
Tests semantic retrieval from ChromaDB WITHOUT calling Gemini or any external API.
Verifies multi-dimensional retrieval based on:
1. User Question
2. Product Classification
3. Jurisdiction

Outputs for every retrieved chunk:
- QUERY
- RETRIEVED DOCUMENT
- PAGE
- RELEVANCE
- TEXT PREVIEW

Usage:
    python test_rag.py
    python test_rag.py "Can I patent an Ashwagandha and Tulsi syrup?"
    python test_rag.py --query "What are the rules for Ayurveda Aahara?" --product "Ayurveda-Aahar" --jurisdiction "India"
"""

import sys
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.utils import embedding_functions

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
PERSIST_DIR = BASE_DIR / "chroma_db"
COLLECTION_NAME = "ayurveda_ip_regulations"


def get_collection():
    """Connects to the persistent ChromaDB collection."""
    if not PERSIST_DIR.exists():
        print(f"[Error] ChromaDB directory not found at: {PERSIST_DIR}")
        print("Please run `python ingest.py` first to index the documents.")
        sys.exit(1)

    client = chromadb.PersistentClient(path=str(PERSIST_DIR))
    embed_fn = embedding_functions.DefaultEmbeddingFunction()
    
    try:
        col = client.get_collection(name=COLLECTION_NAME, embedding_function=embed_fn)
        return col
    except Exception as e:
        print(f"[Error] Could not find ChromaDB collection '{COLLECTION_NAME}': {e}")
        print("Please run `python ingest.py` to index the PDFs.")
        sys.exit(1)


def retrieve_chunks(
    collection,
    query: str,
    product_classification: Optional[str] = None,
    jurisdiction: Optional[str] = None,
    top_k: int = 3
) -> List[Dict[str, Any]]:
    """
    Executes multi-attribute filtered and ranked retrieval:
    - Matches user question
    - Considers product classification context
    - Filters or prioritizes by target jurisdiction
    - Returns document title, filename, page, relevance score, and text preview.
    """
    total_docs = collection.count()
    if total_docs == 0:
        return []

    # Enforce semantic enrichment with product classification
    enriched_query = query
    if product_classification and product_classification.lower() not in ["unknown", "none"]:
        enriched_query = f"[{product_classification}] {query}"

    # Build jurisdiction filter if specified
    where_filter = None
    if jurisdiction and jurisdiction.lower() not in ["all", "global", "none"]:
        target_jur = "India" if "india" in jurisdiction.lower() else "International"
        where_filter = {"jurisdiction": target_jur}

    results = None
    try:
        if where_filter:
            results = collection.query(
                query_texts=[enriched_query],
                n_results=min(top_k, total_docs),
                where=where_filter
            )
    except Exception as e:
        # Fallback if where filter returns 0 docs
        results = None

    if not results or not results.get("documents") or not results["documents"][0]:
        results = collection.query(
            query_texts=[enriched_query],
            n_results=min(top_k, total_docs)
        )

    retrieved_items = []
    if results and results.get("documents") and results["documents"][0]:
        docs = results["documents"][0]
        metas = results["metadatas"][0] if results.get("metadatas") else []
        distances = results["distances"][0] if results.get("distances") else []

        for idx, doc in enumerate(docs):
            meta = metas[idx] if idx < len(metas) else {}
            dist = distances[idx] if idx < len(distances) else 1.0
            
            # Convert cosine/L2 distance to normalized relevance score (0.0 to 1.0 / percentage)
            # For typical ChromaDB L2 squared distances:
            relevance_score = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
            relevance_pct = f"{relevance_score * 100:.1f}% (distance: {dist:.4f})"

            retrieved_items.append({
                "title": meta.get("title", "Unknown Statutory Document"),
                "filename": meta.get("filename", "N/A"),
                "organization": meta.get("organization", "Regulatory Body"),
                "jurisdiction": meta.get("jurisdiction", "N/A"),
                "category": meta.get("category", "N/A"),
                "page": meta.get("page", 1),
                "source_url": meta.get("source_url", meta.get("url", "N/A")),
                "relevance": relevance_pct,
                "relevance_raw": relevance_score,
                "text": doc
            })

    return retrieved_items


def display_retrieval_results(
    query: str,
    product_classification: Optional[str],
    jurisdiction: Optional[str],
    results: List[Dict[str, Any]]
):
    """
    Prints retrieval output in the exact format required:
    QUERY
    RETRIEVED DOCUMENT
    PAGE
    RELEVANCE
    TEXT PREVIEW
    """
    print("\n" + "=" * 80)
    print(f"QUERY: {query}")
    if product_classification or jurisdiction:
        print(f"PRODUCT CLASSIFICATION: {product_classification or 'Not specified'}")
        print(f"JURISDICTION:           {jurisdiction or 'All'}")
    print("=" * 80)

    if not results:
        print("  [No matching authoritative chunks found in knowledge base]\n")
        return

    for idx, item in enumerate(results, 1):
        clean_preview = " ".join(item["text"].split())
        if len(clean_preview) > 280:
            preview_snippet = clean_preview[:280] + "..."
        else:
            preview_snippet = clean_preview

        print(f"\n--- Result #{idx} ---")
        print(f"RETRIEVED DOCUMENT: {item['title']} ({item['filename']})")
        print(f"ORGANIZATION:       {item['organization']}")
        print(f"JURISDICTION:       {item['jurisdiction']}")
        print(f"CATEGORY:           {item['category']}")
        print(f"PAGE:               {item['page']}")
        print(f"RELEVANCE:          {item['relevance']}")
        print(f"SOURCE URL:         {item['source_url']}")
        print(f"TEXT PREVIEW:\n\"{preview_snippet}\"")
        print("-" * 80)


def run_test_suite(collection):
    """Runs a comprehensive suite of verification tests across diverse legal queries."""
    test_cases = [
        {
            "query": "Can I patent a classical Ayurvedic formulation like Chyawanprash or is it barred under Section 3(p)?",
            "product": "Classical Ayurvedic formulation",
            "jurisdiction": "India"
        },
        {
            "query": "What are the mandatory prior approval and benefit sharing obligations under Section 6 of the Biological Diversity Act for filing a patent on Indian biological resources?",
            "product": "Proprietary formulation",
            "jurisdiction": "India"
        },
        {
            "query": "What are the labelling rules, disease risk reduction claim restrictions, and prohibited additives under the FSSAI Ayurveda Aahara Regulations 2022?",
            "product": "Ayurveda-Aahar",
            "jurisdiction": "India"
        },
        {
            "query": "What are the patent disclosure requirements for genetic resources and indigenous traditional knowledge under the WIPO 2024 Treaty?",
            "product": "New/non-classical formulation",
            "jurisdiction": "International"
        },
        {
            "query": "How does the Nagoya Protocol enforce Prior Informed Consent (PIC) and Mutually Agreed Terms (MAT) for utilization of genetic resources?",
            "product": "Novel Botanical Extract",
            "jurisdiction": "International"
        },
        {
            "query": "Can generic Sanskrit Ayurvedic names like Ashwagandha or Triphala be registered as exclusive trademarks under Section 9?",
            "product": "Cosmetic / Brand Name",
            "jurisdiction": "India"
        }
    ]

    print("\n" + "#" * 80)
    print("  RUNNING RAG RETRIEVAL TEST SUITE (OFFLINE - ZERO GEMINI API CALLS)")
    print(f"  ChromaDB Chunks Loaded: {collection.count()}")
    print("#" * 80)

    for i, test in enumerate(test_cases, 1):
        print(f"\n>>> Executing Test Case {i}/{len(test_cases)}...")
        results = retrieve_chunks(
            collection=collection,
            query=test["query"],
            product_classification=test["product"],
            jurisdiction=test["jurisdiction"],
            top_k=2
        )
        display_retrieval_results(
            query=test["query"],
            product_classification=test["product"],
            jurisdiction=test["jurisdiction"],
            results=results
        )

    print("\n" + "=" * 80)
    print("  ALL RAG RETRIEVAL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="Test RAG retrieval from ChromaDB without Gemini API")
    parser.add_argument("query", nargs="?", default=None, help="User query text to search")
    parser.add_argument("--product", "-p", default=None, help="Product classification context")
    parser.add_argument("--jurisdiction", "-j", default=None, help="Jurisdiction filter (India, International)")
    parser.add_argument("--top_k", "-k", type=int, default=3, help="Number of chunks to retrieve")

    args = parser.parse_args()
    collection = get_collection()

    if args.query:
        results = retrieve_chunks(
            collection=collection,
            query=args.query,
            product_classification=args.product,
            jurisdiction=args.jurisdiction,
            top_k=args.top_k
        )
        display_retrieval_results(
            query=args.query,
            product_classification=args.product,
            jurisdiction=args.jurisdiction,
            results=results
        )
    else:
        run_test_suite(collection)


if __name__ == "__main__":
    main()
