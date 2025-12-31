import logging
from typing import List
from io import BytesIO
from zipfile import ZipFile

from docx import Document
from PIL import Image
import pytesseract

from app.vector_db.client import vector_db
from app.services.minio_service import get_file_bytes

logger = logging.getLogger(__name__)


# ===============================
# MAIN ENTRY POINT
# ===============================
async def process_docx(job_id: str, payload):
    """
    1. Load DOCX from MinIO
    2. Extract text (OCR images supported)
    3. Chunk text
    4. Store chunks in vector DB
    """

    logger.info(f"[DOCX] Job {job_id} started")

    docx_bytes = await load_docx_from_minio(payload.fileUrl)
    full_text = extract_text_from_docx(docx_bytes)

    chunks = chunk_text(full_text)

    store_chunks_in_vector_db(
        job_id=job_id,
        chunks=chunks,
        metadata={
            "source": "docx",
            "fileName": payload.fileUrl.split("/")[-1],
            "userId": getattr(payload, "userId", None),
            "sourceType": getattr(payload, "sourceType", "FILE"),
        },
    )

    logger.info(
        f"[DOCX] Job {job_id} completed | {len(chunks)} chunks stored"
    )


# ===============================
# LOAD DOCX FROM MINIO
# ===============================
async def load_docx_from_minio(file_url: str) -> bytes:
    bucket, object_name = parse_s3_url(file_url)
    return get_file_bytes(bucket, object_name)


def parse_s3_url(url: str):
    """
    s3://docs/myfile.docx -> (docs, myfile.docx)
    """
    if not url.startswith("s3://"):
        raise ValueError("Invalid MinIO URL")

    path = url.replace("s3://", "")
    bucket, object_name = path.split("/", 1)
    return bucket, object_name


# ===============================
# DOCX TEXT EXTRACTION (OCR SAFE)
# ===============================
def extract_text_from_docx(docx_bytes: bytes) -> str:
    """
    Extract text from DOCX including OCR from embedded images
    """

    extracted_blocks: List[str] = []

    # -----------------------
    # 1️⃣ Normal text
    # -----------------------
    doc = Document(BytesIO(docx_bytes))
    for p in doc.paragraphs:
        text = p.text.strip()
        if text:
            extracted_blocks.append(text)

    # -----------------------
    # 2️⃣ OCR images
    # -----------------------
    with ZipFile(BytesIO(docx_bytes)) as zip_file:
        for name in zip_file.namelist():
            if name.startswith("word/media/"):
                try:
                    image_bytes = zip_file.read(name)
                    img = Image.open(BytesIO(image_bytes))
                    ocr_text = pytesseract.image_to_string(img).strip()

                    if ocr_text:
                        extracted_blocks.append(ocr_text)

                except Exception:
                    continue  # ignore unreadable images

    # -----------------------
    # 3️⃣ Normalize whitespace
    # -----------------------
    final_text = "\n\n".join(extracted_blocks)
    final_text = " ".join(final_text.split())

    return final_text


# ===============================
# TEXT CHUNKING
# ===============================
def chunk_text(text: str) -> List[str]:
    """
    Paragraph-based chunking
    """

    return [
        p.strip()
        for p in text.split("\n\n")
        if len(p.strip()) > 80
    ]


# ===============================
# STORE IN VECTOR DB
# ===============================
def store_chunks_in_vector_db(
    job_id: str,
    chunks: List[str],
    metadata: dict,
):
    records = []

    for idx, chunk in enumerate(chunks):
        records.append({
            "id": f"{job_id}_chunk_{idx}",
            "text": chunk,
            "metadata": {
                **metadata,
                "chunk_index": idx,
            },
        })

    vector_db.add_documents(records)
