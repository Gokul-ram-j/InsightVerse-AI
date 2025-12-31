from app.services.extractors.pdf_service import process_pdf
from app.services.extractors.docx_service import process_docx
from app.services.extractors.video_service import process_video
from app.services.extractors.link_service import process_link
from app.services.generate_service import trigger_generation


async def dispatch_extraction(job_id: str, payload):
    print(f"\n[DISPATCHER] Job {job_id} started")
    print(f"[DISPATCHER] SourceType: {payload.sourceType}")

    # -------------------------
    # 1️⃣ INGEST → VECTOR DB
    # -------------------------
    if payload.sourceType == "FILE":
        file_type = payload.fileType

        if file_type == "application/pdf":
            await process_pdf(job_id, payload)

        elif file_type in (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ):
            await process_docx(job_id, payload)

        elif file_type.startswith("video/"):
            await process_video(job_id, payload)

        else:
            raise ValueError(f"Unsupported file type: {file_type}")

    elif payload.sourceType == "LINK":
        await process_link(job_id, payload)

    else:
        raise ValueError(f"Unsupported sourceType: {payload.sourceType}")

    # -------------------------
    # 2️⃣ AUTO GENERATION
    # -------------------------
    if getattr(payload, "services", None):
        await trigger_generation(job_id, payload)

    print(f"[DISPATCHER] Job {job_id} completed\n")
