from fastapi import APIRouter
from pydantic import BaseModel
from app.services.minio_service import get_bucket, generate_presigned_url

router = APIRouter(prefix="/api/upload", tags=["Upload"])

class PresignRequest(BaseModel):
    filename: str
    contentType: str

@router.post("/presign") 
def presign_upload(data: PresignRequest):
    bucket = get_bucket(data.contentType)

    if not bucket:
        return {
            "success": False,
            "message": "Unsupported file format",
            "receivedType": data.contentType
        }

    upload_url = generate_presigned_url(bucket, data.filename)
    file_url = f"s3://{bucket}/{data.filename}"

    return {
        "success": True,
        "uploadUrl": upload_url,
        "fileUrl": file_url
    }
