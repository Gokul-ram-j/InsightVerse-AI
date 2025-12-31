import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Dict


class VectorDB:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dimension = 384

        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata_store: List[Dict] = []

    def add_documents(self, documents: List[Dict]):
        """
        documents = [
            {
              "id": str,
              "text": str,
              "metadata": dict
            }
        ]
        """
        if not documents:
            return

        texts = [doc["text"] for doc in documents]
        embeddings = self.model.encode(texts)

        self.index.add(embeddings)
        self.metadata_store.extend(documents)

    def search(self, query: str, top_k: int = 5):
        if self.index.ntotal == 0:
            return []

        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(query_embedding, top_k)

        results = []

        for idx in indices[0]:
            # 🔒 CRITICAL SAFETY CHECK
            if 0 <= idx < len(self.metadata_store):
                results.append(self.metadata_store[idx])

        return results


# ✅ SHARED INSTANCE (singleton)
vector_db = VectorDB()
