import re


HIGH_RISK_PATTERNS = {
    "unlimited liability": 35,
    "uncapped liability": 35,
    "unlimited damages": 35,
    "unlimited indemnification": 35,
    "unlimited indemnity": 35,
    "indemnify": 20,
    "indemnification": 20,
    "indemnity": 20,
    "non-compete": 25,
    "non compete": 25,
    "waive all claims": 30,
    "waiver of all claims": 30,
    "irrevocable": 15,
    "perpetual": 15,
}

MEDIUM_RISK_PATTERNS = {
    "non-solicitation": 15,
    "non solicitation": 15,
    "confidentiality": 8,
    "intellectual property": 8,
    "termination": 8,
    "governing law": 5,
    "jurisdiction": 5,
    "penalty": 12,
    "liquidated damages": 12,
    "automatic renewal": 15,
    "auto-renew": 15,
    "renewal": 6,
    "late payment": 8,
    "notice period": 8,
    "ownership": 6,
}


def _normalize_text(text: str) -> str:
    """
    Normalize whitespace and lowercase clause text.
    """

    return re.sub(r"\s+", " ", text.lower()).strip()


def _contains(text: str, pattern: str) -> bool:
    """
    Check whether a normalized pattern exists in normalized text.
    """

    return pattern in text


def _extract_durations(text: str) -> list[int]:
    """
    Extract durations such as:

    12 months
    twelve months
    2 years
    90 days
    """

    durations = []

    numeric_matches = re.findall(
        r"\b(\d+)\s*(day|days|month|months|year|years)\b",
        text,
    )

    for value, unit in numeric_matches:
        value = int(value)

        if "year" in unit:
            value *= 12

        elif "day" in unit:
            value = value / 30

        durations.append(value)

    return durations


def _score_duration(text: str) -> tuple[int, list[str]]:
    """
    Evaluate unusually long contractual restrictions.
    """

    score = 0
    reasons = []

    durations = _extract_durations(text)

    if not durations:
        return score, reasons

    max_months = max(durations)

    if max_months >= 24:
        score += 20
        reasons.append(
            "Long contractual restriction or obligation of "
            "24 months or more detected."
        )

    elif max_months >= 12:
        score += 10
        reasons.append(
            "Contractual restriction or obligation lasting "
            "12 months or more detected."
        )

    return score, reasons


def _score_non_solicitation(text: str) -> tuple[int, list[str]]:
    """
    Analyze non-solicitation restrictions.
    """

    if (
        "non-solicitation" not in text
        and "non solicitation" not in text
        and "solicit" not in text
    ):
        return 0, []

    score = 15

    reasons = [
        "Non-solicitation restriction detected."
    ]

    duration_score, duration_reasons = _score_duration(text)

    score += duration_score
    reasons.extend(duration_reasons)

    if "employee or customer" in text:
        score += 5
        reasons.append(
            "Restriction applies to employees or customers."
        )

    if "competitive" in text or "competition" in text:
        score += 5
        reasons.append(
            "Restriction is connected to competitive business activity."
        )

    return score, reasons


def _score_termination(text: str) -> tuple[int, list[str]]:
    """
    Analyze termination provisions.
    """

    if "terminat" not in text:
        return 0, []

    score = 8
    reasons = [
        "Termination provision detected."
    ]

    if "without cause" in text:
        score += 10
        reasons.append(
            "Agreement permits termination without cause."
        )

    if "immediately" in text:
        score += 8
        reasons.append(
            "Immediate termination right detected."
        )

    notice_matches = re.findall(
        r"(\d+)\s*(day|days|month|months)\s*(?:'|’)?\s*(?:written\s*)?notice",
        text,
    )

    for value, unit in notice_matches:
        value = int(value)

        if "month" in unit:
            value *= 30

        if value <= 14:
            score += 10
            reasons.append(
                "Short termination notice period detected."
            )

            break

    return score, reasons


def _score_ip(text: str) -> tuple[int, list[str]]:
    """
    Analyze intellectual-property ownership language.
    """

    if "intellectual property" not in text:
        return 0, []

    score = 8
    reasons = [
        "Intellectual-property provision detected."
    ]

    if (
        "sole property" in text
        or "owned by the company" in text
        or "ownership" in text
    ):
        score += 10
        reasons.append(
            "Broad intellectual-property ownership language detected."
        )

    if (
        "all inventions" in text
        or "works of authorship" in text
    ):
        score += 5
        reasons.append(
            "Provision covers broad categories of employee-created work."
        )

    return score, reasons


def _score_confidentiality(text: str) -> tuple[int, list[str]]:
    """
    Analyze confidentiality provisions.
    """

    if "confidential" not in text:
        return 0, []

    score = 8
    reasons = [
        "Confidentiality obligation detected."
    ]

    if "after the term" in text or "after termination" in text:
        score += 5
        reasons.append(
            "Confidentiality obligations continue after employment."
        )

    if "perpetual" in text or "indefinitely" in text:
        score += 10
        reasons.append(
            "Potentially indefinite confidentiality obligation detected."
        )

    return score, reasons


def _score_general_patterns(text: str) -> tuple[int, list[str]]:
    """
    Evaluate general risk indicators.
    """

    score = 0
    reasons = []

    for pattern, points in HIGH_RISK_PATTERNS.items():

        # Handle specialized patterns elsewhere.
        if pattern in {
            "indemnify",
            "indemnification",
            "indemnity",
            "non-compete",
            "non compete",
            "irrevocable",
            "perpetual",
        }:
            continue

        if _contains(text, pattern):
            score += points
            reasons.append(
                f"High-risk indicator detected: {pattern}"
            )

    for pattern, points in MEDIUM_RISK_PATTERNS.items():

        if pattern in {
            "non-solicitation",
            "non solicitation",
            "confidentiality",
            "intellectual property",
            "termination",
        }:
            continue

        if _contains(text, pattern):
            score += points
            reasons.append(
                f"Medium-risk indicator detected: {pattern}"
            )

    return score, reasons


def _risk_level(score: int) -> str:
    """
    Convert numerical score to risk category.
    """

    if score >= 50:
        return "high"

    if score >= 20:
        return "medium"

    return "low"


def score_clause(clause_text: str) -> dict:
    """
    Analyze one clause.
    """

    text = _normalize_text(clause_text)

    score = 0
    reasons = []

    general_score, general_reasons = _score_general_patterns(text)
    score += general_score
    reasons.extend(general_reasons)

    duration_score, duration_reasons = _score_duration(text)

    # Duration alone should not make a normal clause high-risk.
    score += duration_score
    reasons.extend(duration_reasons)

    non_solicitation_score, non_solicitation_reasons = (
        _score_non_solicitation(text)
    )

    score += non_solicitation_score
    reasons.extend(non_solicitation_reasons)

    termination_score, termination_reasons = _score_termination(text)

    score += termination_score
    reasons.extend(termination_reasons)

    ip_score, ip_reasons = _score_ip(text)

    score += ip_score
    reasons.extend(ip_reasons)

    confidentiality_score, confidentiality_reasons = (
        _score_confidentiality(text)
    )

    score += confidentiality_score
    reasons.extend(confidentiality_reasons)

    # Special high-risk indicators.
    if "non-compete" in text or "non compete" in text:
        score += 25
        reasons.append(
            "Non-compete restriction detected."
        )

    if (
        "irrevocable" in text
        and "waiver" in text
    ):
        score += 15
        reasons.append(
            "Irrevocable waiver language detected."
        )

    if (
        "perpetual" in text
        and (
            "license" in text
            or "assignment" in text
            or "obligation" in text
        )
    ):
        score += 15
        reasons.append(
            "Potentially perpetual contractual obligation detected."
        )

    score = min(score, 100)

    level = _risk_level(score)

    if reasons:
        reason = " ".join(reasons)
    else:
        reason = (
            "No predefined significant risk indicators "
            "were detected."
        )

    return {
        "clause_text": clause_text,
        "risk_score": score,
        "risk_level": level,
        "reason": reason,
    }


def score_all_clauses(clauses: list[str]) -> list[dict]:
    """
    Analyze all clauses in a contract.
    """

    return [
        score_clause(clause)
        for clause in clauses
        if clause and clause.strip()
    ]