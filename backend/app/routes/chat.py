from fastapi import APIRouter
from pydantic import BaseModel
from app.vector_db.client import vector_db
from app.llm.chat_client import run_chat_llm

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    jobId: str
    question: str


@router.post("")
def chat(payload: ChatRequest):
    question = payload.question.strip()

    # 1️⃣ Retrieve context
    docs = vector_db.search(question, top_k=5)

    if not docs:
        return {
            "answer": "This question is not related to the content you uploaded."
        }

    context = "\n\n".join(d["text"] for d in docs)

    # 2️⃣ Controlled prompt
    prompt = f"""
You are an AI assistant that answers questions ONLY using the given context.

CONTEXT:
{context}

QUESTION:
{question}

RULES:
- Answer strictly from the context
- If the answer is not present, say:
  "This question is not related to the content you uploaded."
- Be concise and factual
"""

    answer = run_chat_llm(prompt)

    return {
        "answer": answer.strip()
    }
