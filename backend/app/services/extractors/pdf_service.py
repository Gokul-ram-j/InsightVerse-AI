import fitz  # PyMuPDF
import logging
from typing import List

import pytesseract
from PIL import Image

from app.vector_db.client import vector_db
from app.services.minio_service import get_file_bytes

# -------------------------------
# Windows: set tesseract path
# -------------------------------
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

logger = logging.getLogger(__name__)


# ===============================
# MAIN ENTRY POINT
# ===============================
async def process_pdf(job_id: str, payload):
    """
    1. Load PDF from MinIO using URL
    2. Extract text (OCR fallback supported)
    3. Chunk text
    4. Store chunks in vector DB
    """

    logger.info(f"[PDF] Job {job_id} started")

    pdf_bytes = await load_pdf_from_minio(payload.fileUrl)
    full_text = extract_text_from_pdf(pdf_bytes)

    chunks = chunk_text(full_text)

    store_chunks_in_vector_db(
    job_id=job_id,
    chunks=chunks,
    metadata={
        "source": "pdf",
        "fileName": payload.fileUrl.split("/")[-1],
        "userId": getattr(payload, "userId", None),
        "sourceType": getattr(payload, "sourceType", "FILE"),
    },
)


    logger.info(
        f"[PDF] Job {job_id} completed | {len(chunks)} chunks stored"
    )


# ===============================
# LOAD PDF FROM MINIO
# ===============================
async def load_pdf_from_minio(file_url: str) -> bytes:
    bucket, object_name = parse_s3_url(file_url)
    return get_file_bytes(bucket, object_name)


def parse_s3_url(url: str):
    """
    s3://pdfs/myfile.pdf -> (pdfs, myfile.pdf)
    """
    if not url.startswith("s3://"):
        raise ValueError("Invalid MinIO URL")

    path = url.replace("s3://", "")
    bucket, object_name = path.split("/", 1)
    return bucket, object_name


# ===============================
# PDF TEXT EXTRACTION (OCR SAFE)
# ===============================
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from PDF.
    Falls back to OCR for scanned pages.
    """

    extracted_pages = []

    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page_num, page in enumerate(doc):
            try:
                page_text = page.get_text().strip()

                if page_text:
                    extracted_pages.append(page_text)
                else:
                    logger.info(
                        f"[PDF][OCR] Running OCR on page {page_num + 1}"
                    )
                    ocr_text = ocr_page(page)
                    if ocr_text:
                        extracted_pages.append(ocr_text)

            except Exception as e:
                logger.warning(
                    f"[PDF] Failed page {page_num + 1}: {e}"
                )

    # Normalize whitespace
    final_text = "\n\n".join(extracted_pages)
    final_text = " ".join(final_text.split())

    return final_text


def ocr_page(page) -> str:
    """
    Perform OCR on a single PDF page using Tesseract
    """

    pix = page.get_pixmap(dpi=300)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

    text = pytesseract.image_to_string(img)
    return text.strip()


# ===============================
# TEXT CHUNKING (PARAGRAPH BASED)
# ===============================
def chunk_text(text: str) -> List[str]:
    """
    Split text into paragraph-based chunks
    """

    paragraphs = [
        p.strip()
        for p in text.split("\n\n")
        if len(p.strip()) > 80
    ]

    return paragraphs


# ===============================
# STORE IN VECTOR DB
# ===============================
def store_chunks_in_vector_db(
    job_id: str,
    chunks: List[str],
    metadata: dict,
):
    """
    Store text chunks in vector DB
    """

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
