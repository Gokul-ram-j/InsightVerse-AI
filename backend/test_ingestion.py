import asyncio
from types import SimpleNamespace

from app.services.extractors.link_service import process_link
from app.vector_db.client import vector_db


async def run_test():
    payload = SimpleNamespace(
        fileUrl="https://youtu.be/p5PKnqGyDaE?si=ObNsPEXV0DZus_5E",
        linkType="youtube",   # ✅ REQUIRED
        sourceType="LINK",
        userId="test_user",
    )

    job_id = "test_job_link_001"

    # 🌐 Run link ingestion
    await process_link(job_id, payload)

    # 🔎 Verify data exists in vector DB
    print("\n--- VECTOR DB TEST QUERY ---")
    results = vector_db.search("orange", top_k=3)

    for i, r in enumerate(results):
        print(f"\nResult {i + 1}:")
        print(r["text"])


if __name__ == "__main__":
    asyncio.run(run_test())
