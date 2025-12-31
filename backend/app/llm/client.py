# =====================================
# OLD OLLAMA IMPLEMENTATION (COMMENTED)
# =====================================

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "mistral"

session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=5,
    status_forcelist=[500, 502, 503, 504],
)
session.mount("http://", HTTPAdapter(max_retries=retries))

def run_llm(prompt: str) -> str:
    response = session.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
        },
        timeout=600
    )
    response.raise_for_status()
    return response.json()["response"]

