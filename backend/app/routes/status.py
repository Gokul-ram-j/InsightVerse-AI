from fastapi import APIRouter
from app.services.job_repository import get_job  # ✅ fetch from MongoDB

router = APIRouter(prefix="/api/status", tags=["Status"])


@router.get("/{job_id}")
def get_job_status(job_id: str):
    job = get_job(job_id)

    if not job:
        return {
            "status": "PROCESSING"
        }

    return job
