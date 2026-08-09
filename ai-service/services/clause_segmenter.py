import re

def segment_clauses(text: str) -> list[str]:
    """
    Splits contract text into individual clauses.
    Uses common clause-numbering patterns (e.g. "1.", "2.1", "Article 3", "Section 4")
    as split points. Falls back to splitting by paragraph if no numbering is found.
    """
    if not text or not text.strip():
        return []

    clause_pattern = re.compile(
        r'(?:\n|^)\s*(?:\d+(?:\.\d+)*\.?|\(?[a-zA-Z]\)|Article\s+\d+|Section\s+\d+)\s+',
        re.MULTILINE
    )

    matches = list(clause_pattern.finditer(text))

    clauses = []

    if len(matches) >= 2:
        for i in range(len(matches)):
            start = matches[i].start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            clause_text = text[start:end].strip()
            if clause_text:
                clauses.append(clause_text)
    else:
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        clauses = paragraphs

    return clauses


def clean_clause(clause_text: str) -> str:
    """
    Removes extra whitespace and normalizes a single clause's text.
    """
    return re.sub(r'\s+', ' ', clause_text).strip()