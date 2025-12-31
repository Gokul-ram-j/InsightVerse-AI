from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router
from app.routes.ingest import router as ingest_router
from app.routes.status import router as status_router
from app.routes.chat import router as chat_router   
app = FastAPI(
    title="InsightVerse AI Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(ingest_router)
app.include_router(status_router)
app.include_router(chat_router)
@app.get("/")
def health():
    return {"status": "ok"}
