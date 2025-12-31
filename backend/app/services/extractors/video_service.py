import logging
import os
import tempfile
from typing import List

import cv2
import pytesseract
from PIL import Image
from moviepy.editor import VideoFileClip
from faster_whisper import WhisperModel

from app.vector_db.client import vector_db
from app.services.minio_service import get_file_bytes

logger = logging.getLogger(__name__)

# -------------------------------
# Whisper model (multilingual → EN)
# -------------------------------
whisper_model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

# -------------------------------
# MAIN ENTRY POINT
# -------------------------------
async def process_video(job_id: str, payload):
    """
    1. Load video from MinIO
    2. Extract audio
    3. Transcribe + translate to English
    4. Extract visual text via OCR
    5. Merge → chunk → store in vector DB
    """

    logger.info(f"[VIDEO] Job {job_id} started")

    video_bytes = await load_video_from_minio(payload.fileUrl)

    with tempfile.TemporaryDirectory() as tmpdir:
        video_path = os.path.join(tmpdir, "video.mp4")
        audio_path = os.path.join(tmpdir, "audio.wav")

        # Save video locally
        with open(video_path, "wb") as f:
            f.write(video_bytes)

        # 1️⃣ Extract audio
        extract_audio(video_path, audio_path)

        # 2️⃣ Audio → text (any language → English)
        audio_text = transcribe_audio(audio_path)

        # 3️⃣ Visual OCR from frames
        visual_texts = extract_frames(video_path)

    # 4️⃣ Merge all knowledge
    full_text = audio_text + " " + " ".join(visual_texts)

    chunks = chunk_text(full_text)

    store_chunks_in_vector_db(
        job_id=job_id,
        chunks=chunks,
        metadata={
            "source": "video",
            "fileName": payload.fileUrl.split("/")[-1],
            "userId": getattr(payload, "userId", None),
            "sourceType": getattr(payload, "sourceType", "FILE"),
            "content_type": "audio+visual",
        },
    )

    logger.info(
        f"[VIDEO] Job {job_id} completed | {len(chunks)} chunks stored"
    )


# ===============================
# LOAD VIDEO FROM MINIO
# ===============================
async def load_video_from_minio(file_url: str) -> bytes:
    bucket, object_name = parse_s3_url(file_url)
    return get_file_bytes(bucket, object_name)


def parse_s3_url(url: str):
    """
    s3://videos/myfile.mp4 -> (videos, myfile.mp4)
    """
    if not url.startswith("s3://"):
        raise ValueError("Invalid MinIO URL")

    path = url.replace("s3://", "")
    bucket, object_name = path.split("/", 1)
    return bucket, object_name


# ===============================
# AUDIO EXTRACTION
# ===============================
def extract_audio(video_path: str, audio_path: str):
    clip = VideoFileClip(video_path)
    clip.audio.write_audiofile(
        audio_path,
        codec="pcm_s16le",
        fps=16000,
        logger=None
    )
    clip.close()


# ===============================
# TRANSCRIPTION (AUTO → ENGLISH)
# ===============================
def transcribe_audio(audio_path: str) -> str:
    segments, info = whisper_model.transcribe(
        audio_path,
        task="translate",  # 🔥 auto language → English
        beam_size=5
    )

    logger.info(f"[VIDEO] Detected language: {info.language}")

    texts = [
        seg.text.strip()
        for seg in segments
        if seg.text.strip()
    ]

    return " ".join(texts)


# ===============================
# VISUAL OCR FROM FRAMES
# ===============================
def extract_frames(
    video_path: str,
    every_n_seconds: int = 5
) -> List[str]:
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 25  # safe fallback

    frame_interval = int(fps * every_n_seconds)

    texts = []
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            img = Image.fromarray(
                cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            )
            text = pytesseract.image_to_string(img).strip()
            if len(text) > 40:
                texts.append(text)

        frame_count += 1

    cap.release()
    return texts


# ===============================
# CHUNKING (RAG FRIENDLY)
# ===============================
def chunk_text(text: str) -> List[str]:
    sentences = [
        s.strip()
        for s in text.split(". ")
        if len(s.strip()) > 100
    ]
    return sentences


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
