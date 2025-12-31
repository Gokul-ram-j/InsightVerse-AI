from datetime import datetime
from app.db.mongo import job_results_collection


def create_job(job_id: str, payload: dict):
    job_results_collection.insert_one({
        "_id": job_id,
        "status": "PROCESSING",
        "payload": payload,
        "result": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    })


def update_job_result(job_id: str, result: dict):
    job_results_collection.update_one(
        {"_id": job_id},
        {
            "$set": {
                "status": "COMPLETED",
                "result": result,
                "updatedAt": datetime.utcnow()
            }
        }
    )


def mark_job_error(job_id: str, error: str):
    job_results_collection.update_one(
        {"_id": job_id},
        {
            "$set": {
                "status": "ERROR",
                "error": error,
                "updatedAt": datetime.utcnow()
            }
        }
    )


def get_job(job_id: str):
    job = job_results_collection.find_one({"_id": job_id})
    if job:
        job.pop("_id")  # frontend doesn't need Mongo _id
    return job
