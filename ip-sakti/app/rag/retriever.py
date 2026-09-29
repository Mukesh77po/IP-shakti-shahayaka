import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

import chromadb

try:
    from app.config import settings
    from app.models import SourceCitation
except ImportError:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from app.config import settings
    from app.models import SourceCitation


class RAGRetriever:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection(name=settings.COLLECTION_NAME)

    def _get_query_embedding(self, query: str) -> Optional[List[float]]:
        """Optionally generates Gemini query embedding if configured."""
        if not settings.GOOGLE_API_KEY:
            return None
        try:
            from google import genai
            client = genai.Client(api_key=settings.GOOGLE_API_KEY)
            result = client.models.embed_content(
                model=settings.EMBEDDING_MODEL,
                contents=query,
            )
            return result.embeddings[0].values
        except Exception:
            return None

    def retrieve(
        self, 
        question: str, 
        product_type: str = "Unknown", 
        jurisdiction: str = "India", 
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieves the most authoritative legal and regulatory chunks.
        Strictly prioritizes documents matching the target jurisdiction.
        """
        # Formulate enriched query incorporating product context
        enriched_query = question
        if product_type and product_type != "Unknown":
            enriched_query = f"[{product_type}] {question}"

        query_emb = self._get_query_embedding(enriched_query)
        total_in_db = self.collection.count()
        if total_in_db == 0:
            return []

        retrieved_chunks: List[Dict[str, Any]] = []
        seen_texts = set()

        # Step 1: Priority Query strictly within target jurisdiction
        norm_jurisdiction = "India" if "india" in jurisdiction.lower() else "International"
        
        try:
            priority_where = {"jurisdiction": norm_jurisdiction}
            if query_emb:
                jurisdiction_results = self.collection.query(
                    query_embeddings=[query_emb],
                    n_results=min(top_k, total_in_db),
                    where=priority_where
                )
            else:
                jurisdiction_results = self.collection.query(
                    query_texts=[enriched_query],
                    n_results=min(top_k, total_in_db),
                    where=priority_where
                )

            if jurisdiction_results and jurisdiction_results.get("documents"):
                docs = jurisdiction_results["documents"][0]
                metas = jurisdiction_results["metadatas"][0] if jurisdiction_results.get("metadatas") else []
                distances = jurisdiction_results["distances"][0] if jurisdiction_results.get("distances") else []
                
                for idx, doc in enumerate(docs):
                    if doc not in seen_texts:
                        seen_texts.add(doc)
                        retrieved_chunks.append({
                            "text": doc,
                            "metadata": metas[idx] if idx < len(metas) else {},
                            "distance": distances[idx] if idx < len(distances) else 0.0,
                            "priority": True
                        })
        except Exception as e:
            # If where-clause yields no documents or index error, proceed to general query
            pass

        # Step 2: Complementary Query across all documents if needed to reach top_k
        if len(retrieved_chunks) < top_k:
            remaining = top_k - len(retrieved_chunks)
            try:
                if query_emb:
                    general_results = self.collection.query(
                        query_embeddings=[query_emb],
                        n_results=min(remaining + 2, total_in_db)
                    )
                else:
                    general_results = self.collection.query(
                        query_texts=[enriched_query],
                        n_results=min(remaining + 2, total_in_db)
                    )

                if general_results and general_results.get("documents"):
                    docs = general_results["documents"][0]
                    metas = general_results["metadatas"][0] if general_results.get("metadatas") else []
                    distances = general_results["distances"][0] if general_results.get("distances") else []
                    
                    for idx, doc in enumerate(docs):
                        if doc not in seen_texts and len(retrieved_chunks) < top_k:
                            seen_texts.add(doc)
                            retrieved_chunks.append({
                                "text": doc,
                                "metadata": metas[idx] if idx < len(metas) else {},
                                "distance": distances[idx] if idx < len(distances) else 0.0,
                                "priority": False
                            })
            except Exception:
                pass

        return retrieved_chunks

    def extract_citations(self, retrieved_chunks: List[Dict[str, Any]]) -> List[SourceCitation]:
        """Extracts unique authoritative source citations from retrieved chunks."""
        citations: List[SourceCitation] = []
        seen_keys = set()

        for chunk in retrieved_chunks:
            meta = chunk.get("metadata", {})
            title = meta.get("title", "Authoritative Regulatory Gazette")
            org = meta.get("organization", "Ministry of Ayush")
            page = str(meta.get("page", "1"))
            url = meta.get("source_url", meta.get("url", "https://indiacode.nic.in"))

            citation_key = f"{title}_{page}_{url}"
            if citation_key not in seen_keys:
                seen_keys.add(citation_key)
                citations.append(SourceCitation(
                    title=title,
                    organization=org,
                    page=page,
                    url=url
                ))

        return citations
