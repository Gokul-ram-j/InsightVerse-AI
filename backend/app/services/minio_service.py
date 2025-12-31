from minio import Minio
from datetime import timedelta
from app.core.config import (
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_SECURE
)

SUPPORTED_TYPES = {
    "video/mp4": "videos",
    "application/pdf": "pdfs",
    "application/msword": "docs",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docs",
}

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_SECURE
)


# =========================
# EXISTING FUNCTIONS
# =========================
def get_bucket(content_type: str):
    return SUPPORTED_TYPES.get(content_type)


def generate_presigned_url(bucket: str, filename: str):
    return minio_client.presigned_put_object(
        bucket_name=bucket,
        object_name=filename,
        expires=timedelta(minutes=10)
    )


# =========================
# ✅ NEW: FILE RETRIEVAL
# =========================
def get_file_bytes(bucket: str, object_name: str) -> bytes:
    """
    Download object from MinIO and return raw bytes
    """
    response = minio_client.get_object(bucket, object_name)
    data = response.read()
    response.close()
    return data
