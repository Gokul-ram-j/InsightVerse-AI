import json
import re
from app.vector_db.client import vector_db
from app.llm.client import run_llm
from app.llm.prompts import (
    summary_prompt,
    quiz_prompt,
)


# -------------------------
# JSON HELPERS (for quiz only)
# -------------------------

def clean_json_string(raw: str) -> str:
    raw = re.sub(r"```json|```", "", raw)
    raw = re.sub(r"//.*", "", raw)
    raw = re.sub(r",\s*([}\]])", r"\1", raw)
    return raw.strip()


def repair_missing_commas(raw: str) -> str:
    raw = re.sub(
        r'("statement"\s*:\s*"[^"]+")\s*\n\s*("answer"\s*:\s*(true|false))',
        r'\1,\n\2',
        raw,
        flags=re.IGNORECASE
    )
    return raw


def extract_json(llm_output: str):
    try:
        return json.loads(llm_output)
    except Exception:
        cleaned = clean_json_string(llm_output)
        cleaned = repair_missing_commas(cleaned)
        return json.loads(cleaned)


def ensure_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        return [value]
    return []


# -------------------------
# 🔥 NEW: STICKY NOTES EXTRACTOR
# -------------------------

def extract_sticky_notes(raw: str):
    """
    Extract short revision notes safely from LLM output
    (NO JSON parsing)
    """
    notes = []

    # Remove code fences
    raw = re.sub(r"```.*?```", "", raw, flags=re.DOTALL)

    # Extract "note": "..."
    notes.extend(re.findall(r'"note"\s*:\s*"([^"]+)"', raw))

    # Extract standalone quoted strings
    notes.extend(re.findall(r'^\s*"([^"]+)"\s*,?\s*$', raw, flags=re.MULTILINE))

    # Extract bullet-like lines
    for line in raw.splitlines():
        line = line.strip("•- ").strip()
        if 5 <= len(line.split()) <= 20:
            notes.append(line)

    # Clean + dedupe
    final_notes = []
    for n in notes:
        n = n.strip()
        if n and n not in final_notes:
            final_notes.append(n)

    return final_notes


# -------------------------
# MAIN GENERATOR
# -------------------------

def generate_outputs(payload):
    query = payload.query
    services = payload.services

    docs = vector_db.search(query, top_k=5)
    context = "\n\n".join(d["text"] for d in docs)

    outputs = {}

    # -------------------------
    # SUMMARY
    # -------------------------
    if services.get("summary"):
        outputs["summary"] = {}
        for summary_type in services["summary"]:
            prompt = summary_prompt(context, summary_type)
            outputs["summary"][summary_type] = run_llm(prompt).strip()

    # -------------------------
    # QUIZ (STRICT JSON)
    # -------------------------
    if services.get("quiz") and services["quiz"].get("types"):
        difficulty = services["quiz"]["difficulty"]
        outputs["quiz"] = {"difficulty": difficulty}

        for quiz_type in services["quiz"]["types"]:
            try:
                prompt = quiz_prompt(context, difficulty, quiz_type)
                parsed = extract_json(run_llm(prompt))
                outputs["quiz"][quiz_type] = ensure_list(parsed)
            except Exception as e:
                print(f"[WARN] Quiz failed: {quiz_type}", e)
                outputs["quiz"][quiz_type] = []

    # -------------------------
    # CONCEPT
    # -------------------------
    if services.get("concept"):
        outputs["concept"] = {}
        for mode in services["concept"]:
            prompt = concept_prompt(context, mode)
            outputs["concept"][mode] = run_llm(prompt).strip()

    # -------------------------
    # 🔥 FLASHCARDS (Sticky Notes – OPTIMISTIC)
    # -------------------------
    if services.get("flashcards") is True:
        try:
            prompt = flashcards_prompt(context)
            llm_response = run_llm(prompt)

            notes = extract_sticky_notes(llm_response)

            outputs["flashcards"] = [{"note": n} for n in notes]

        except Exception as e:
            print("[WARN] Flashcards failed", e)
            outputs["flashcards"] = []

    return outputs
