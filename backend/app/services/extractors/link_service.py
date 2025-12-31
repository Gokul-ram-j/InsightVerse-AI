import logging
import requests
from bs4 import BeautifulSoup
from typing import List

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import subprocess
import tempfile
import os

from app.services.extractors.video_service import transcribe_audio
import re
from app.vector_db.client import vector_db

logger = logging.getLogger(__name__)

# -----------------------------------------------------
# Browser-like headers (prevents 403)
# -----------------------------------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


# =====================================================
# MAIN ENTRY POINT
# =====================================================
async def process_link(job_id: str, payload):
    """
    Supported:
    - Website URLs
    - YouTube video links
    """

    if not hasattr(payload, "fileUrl") or not hasattr(payload, "linkType"):
        raise ValueError("fileUrl and linkType are required for LINK ingestion")

    url = payload.fileUrl
    link_type = payload.linkType  # "website" | "youtube"

    logger.info(f"[LINK] Job {job_id} | Type: {link_type} | URL={url}")

    if link_type == "website":
        text = extract_website_text(url)

    elif link_type == "youtube":
        text = extract_youtube_text(url)

    else:
        raise ValueError("Only website and YouTube links are supported")

    chunks = chunk_text(text)

    store_in_vector_db(
        job_id=job_id,
        chunks=chunks,
        metadata={
            "source": "link",
            "url": url,
            "linkType": link_type,
            "sourceType": "LINK",
        },
    )

    logger.info(
        f"[LINK] Job {job_id} completed | {len(chunks)} chunks stored"
    )


# =====================================================
# WEBSITE EXTRACTION
# =====================================================
def extract_website_text(url: str) -> str:
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=20
    )

    if response.status_code == 403:
        raise ValueError(
            "Website blocked automated access (403). Try another URL."
        )

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Remove non-content elements
    for tag in soup([
        "script", "style", "nav",
        "footer", "header", "aside"
    ]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    text = normalize(text)

    if len(text) < 300:
        raise ValueError("Website contains insufficient readable content")

    return text


# =====================================================
# YOUTUBE EXTRACTION (SAFE METADATA ONLY)
# =====================================================

def extract_youtube_text(url: str) -> str:
    """
    Extracts:
    1. Transcript (any language → English)
    2. Audio (Whisper fallback)
    3. Metadata (title + description)
    """

    video_id = extract_video_id(url)

    texts = []

    # -------------------------
    # 1️⃣ TRANSCRIPT (BEST)
    # -------------------------
    try:
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=["en", "en-US"]
        )
        formatter = TextFormatter()
        transcript_text = formatter.format_transcript(transcript)
        texts.append(transcript_text)

    except Exception:
        print("[YT] Transcript unavailable, falling back to audio")

        # -------------------------
        # 2️⃣ AUDIO → WHISPER
        # -------------------------
        audio_text = extract_audio_with_whisper(url)
        if audio_text:
            texts.append(audio_text)

    # -------------------------
    # 3️⃣ METADATA (SUPPORT)
    # -------------------------
    meta_text = extract_youtube_metadata(url)
    if meta_text:
        texts.append(meta_text)

    final_text = normalize(" ".join(texts))

    if len(final_text) < 300:
        raise ValueError("Insufficient YouTube content extracted")

    return final_text


# Helpers for YouTube extraction
def extract_video_id(url: str) -> str:
    patterns = [
        r"v=([a-zA-Z0-9_-]{11})",
        r"youtu\.be/([a-zA-Z0-9_-]{11})"
    ]
    for p in patterns:
        match = re.search(p, url)
        if match:
            return match.group(1)
    raise ValueError("Invalid YouTube URL")

def extract_audio_with_whisper(url: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        audio_path = os.path.join(tmp, "audio.wav")

        # Download audio only
        subprocess.run(
            [
                "yt-dlp",
                "-f", "bestaudio",
                "--extract-audio",
                "--audio-format", "wav",
                "-o", audio_path,
                url,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )

        return transcribe_audio(audio_path)

def extract_youtube_metadata(url: str) -> str:
    response = requests.get(url, headers=HEADERS, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.title.string if soup.title else ""
    desc = soup.find("meta", {"name": "description"})
    description = desc["content"] if desc else ""

    return f"{title}\n{description}"


# =====================================================
# CHUNKING
# =====================================================
def chunk_text(text: str) -> List[str]:
    """
    Paragraph-based chunking
    """
    return [
        p.strip()
        for p in text.split(". ")
        if len(p.strip()) > 120
    ]


# =====================================================
# VECTOR DB STORAGE
# =====================================================
def store_in_vector_db(
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


# =====================================================
# NORMALIZATION
# =====================================================
def normalize(text: str) -> str:
    return " ".join(text.split())
