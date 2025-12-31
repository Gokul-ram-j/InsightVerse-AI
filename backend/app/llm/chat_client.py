import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

OLLAMA_URL = "http://localhost:11434/api/generate"
CHAT_MODEL = "mistral"

session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=3,
    status_forcelist=[500, 502, 503, 504],
)
session.mount("http://", HTTPAdapter(max_retries=retries))


def run_chat_llm(prompt: str) -> str:
    response = session.post(
        OLLAMA_URL,
        json={
            "model": CHAT_MODEL,
            "prompt": prompt,
            "stream": False,
        },
        timeout=600
    )

    response.raise_for_status()
    return response.json()["response"]
