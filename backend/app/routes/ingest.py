from fastapi import APIRouter, BackgroundTasks, Request
from app.schemas.ingest import UploadDataRequest
from app.services.dispatcher import dispatch_extraction
from app.services.job_repository import create_job  # ✅ NEW
from slowapi import Limiter
from slowapi.util import get_remote_address
import uuid
import hashlib
import json

# -------------------------
# Rate limiter
# -------------------------
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/upload", tags=["Upload"])

# -------------------------
# In-memory job cache (idempotency)
# -------------------------
JOB_CACHE = {}  # request_hash -> job_id


def compute_request_hash(payload: UploadDataRequest) -> str:
    """
    Creates a stable hash for the incoming request
    """
    raw = json.dumps(payload.dict(), sort_keys=True).encode()
    return hashlib.sha256(raw).hexdigest()


@router.post("/data")
@limiter.limit("1/5seconds")  # 🚦 prevent spam clicks
async def upload_data(
    request: Request,
    payload: UploadDataRequest,
    background_tasks: BackgroundTasks
):
    # 1️⃣ Compute request hash (idempotency key)
    request_hash = compute_request_hash(payload)

    # 2️⃣ If job already exists, return existing jobId
    if request_hash in JOB_CACHE:
        return {
            "success": True,
            "jobId": JOB_CACHE[request_hash],
            "status": "PROCESSING",
            "message": "Job already in progress"
        }

    # 3️⃣ Create new jobId
    job_id = str(uuid.uuid4())
    JOB_CACHE[request_hash] = job_id

    # 4️⃣ CREATE JOB RECORD IN DB (IMPORTANT)
    create_job(
        job_id=job_id,
        payload=payload.dict()
    )

    # 5️⃣ Run extraction in background
    background_tasks.add_task(
        dispatch_extraction,
        job_id,
        payload
    )

    return {
        "success": True,
        "jobId": job_id,
        "status": "PROCESSING"
    }
