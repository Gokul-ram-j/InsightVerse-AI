def summary_prompt(context: str, length: str):
    return f"""
Generate a {length} summary of the content below.

CONTENT:
{context}

OUTPUT RULES:
- Plain text only
- No markdown
- No headings
- Student-friendly
"""


def quiz_prompt(context: str, difficulty: str, quiz_type: str, count: int = 10):
    if quiz_type == "short_answer":
        return f"""
Generate {count} short-answer questions.

Difficulty: {difficulty}

CONTENT:
{context}

OUTPUT FORMAT (STRICT JSON):
[
  {{
    "question": "",
    "answer": ""
  }}
]

RULES:
- Academic tone
- No markdown
- No extra text
"""

    if quiz_type == "mcq":
        return f"""
Generate {count} multiple choice questions.

Difficulty: {difficulty}

CONTENT:
{context}

OUTPUT FORMAT (STRICT JSON):
[
  {{
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }}
]

RULES:
- One correct answer
- No markdown
- No extra text
"""

    if quiz_type == "true_false":
      return f"""
  Generate {count} true/false statements.

  CONTENT:
  {context}

  OUTPUT FORMAT (STRICT JSON):
  [
    {{
      "statement": "",
      "answer": true
    }}
  ]

  RULES:
  - Each item must be a clear declarative statement
  - Do NOT use questions or question marks
  - No words like what, why, how, when, which
  - Factual and verifiable from the content
  - No markdown
  - No extra text
  """

