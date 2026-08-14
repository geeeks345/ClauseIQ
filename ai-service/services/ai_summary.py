import re


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def _contains_any(text: str, patterns: list[str]) -> bool:
    return any(pattern in text for pattern in patterns)


def _analyze_clause_category(clause_text: str, reason: str) -> str:
    text = _normalize(clause_text)
    reason_text = _normalize(reason)

    if _contains_any(
        text,
        [
            "intellectual property",
            "inventions",
            "works of authorship",
            "sole property",
        ],
    ):
        return "intellectual_property"

    if _contains_any(
        text,
        [
            "non-solicitation",
            "non solicitation",
            "solicit any employee",
            "solicit any customer",
        ],
    ):
        return "non_solicitation"

    if "non-compete" in text or "non compete" in text:
        return "non_compete"

    if "confidential" in text:
        return "confidentiality"

    if "terminat" in text:
        return "termination"

    if _contains_any(
        text,
        [
            "indemnify",
            "indemnification",
            "indemnity",
        ],
    ):
        return "indemnification"

    if _contains_any(
        text,
        [
            "liability",
            "liable",
            "damages",
        ],
    ):
        return "liability"

    if _contains_any(
        text,
        [
            "governing law",
            "jurisdiction",
        ],
    ):
        return "governing_law"

    if "renewal" in text or "auto-renew" in text:
        return "renewal"

    if "compensation" in text or "salary" in text:
        return "compensation"

    if "notice period" in reason_text:
        return "notice_period"

    return "general"


def _extract_duration(text: str) -> str | None:
    match = re.search(
        r"\b(\d+)\s*(day|days|month|months|year|years)\b",
        text,
    )

    if not match:
        return None

    return f"{match.group(1)} {match.group(2)}"


def generate_clause_explanation(
    clause_text: str,
    risk_level: str,
    reason: str,
) -> dict:
    """
    Generate a category-aware explanation.

    This is still deterministic.
    It is intentionally structured so that an LLM/RAG
    layer can replace it later.
    """

    text = _normalize(clause_text)

    category = _analyze_clause_category(
        clause_text,
        reason,
    )

    duration = _extract_duration(text)

    if category == "intellectual_property":

        plain_english = (
            "This clause determines who owns intellectual "
            "property created by the employee during employment."
        )

        why_it_matters = (
            "Broad ownership language can transfer rights over "
            "employee-created inventions, software, documents, "
            "or other work to the company."
        )

        recommendation = (
            "Check whether the ownership applies only to work "
            "created within the employee's job duties and whether "
            "pre-existing intellectual property is excluded."
        )

    elif category == "non_solicitation":

        duration_text = (
            f" The restriction lasts for {duration}."
            if duration
            else ""
        )

        plain_english = (
            "This clause restricts the employee from soliciting "
            "certain employees or customers."
            + duration_text
        )

        why_it_matters = (
            "The restriction can limit the employee's ability to "
            "work with former colleagues or customers after leaving "
            "the company."
        )

        recommendation = (
            "Check the restricted people, activities, geographic "
            "scope, and duration of the restriction."
        )

    elif category == "non_compete":

        plain_english = (
            "This clause restricts the employee from engaging "
            "in specified competitive activities."
        )

        why_it_matters = (
            "A non-compete can limit where and how the employee "
            "can work after leaving the company."
        )

        recommendation = (
            "Check the duration, geographic scope, restricted "
            "activities, and applicable legal requirements."
        )

    elif category == "confidentiality":

        plain_english = (
            "This clause requires the employee to protect "
            "confidential or proprietary company information."
        )

        if "after the term" in text or "after termination" in text:
            why_it_matters = (
                "The confidentiality obligation continues after "
                "the employment relationship ends."
            )
        else:
            why_it_matters = (
                "The employee may face restrictions on using or "
                "disclosing protected company information."
            )

        recommendation = (
            "Check what information is considered confidential, "
            "the permitted exceptions, and how long the obligation "
            "continues."
        )

    elif category == "termination":

        plain_english = (
            "This clause defines when and how either party can "
            "end the employment agreement."
        )

        if "without cause" in text:
            why_it_matters = (
                "The agreement allows termination without requiring "
                "a specific reason."
            )
        elif "immediately" in text:
            why_it_matters = (
                "The agreement provides a circumstance where "
                "employment can be terminated immediately."
            )
        else:
            why_it_matters = (
                "The termination terms determine the conditions "
                "under which the employment relationship can end."
            )

        recommendation = (
            "Check termination rights, notice requirements, "
            "termination-for-cause conditions, and payments "
            "owed after termination."
        )

    elif category == "indemnification":

        plain_english = (
            "This clause requires one party to cover specified "
            "losses, claims, or liabilities involving the other party."
        )

        why_it_matters = (
            "Broad indemnification language can create significant "
            "financial exposure."
        )

        recommendation = (
            "Check the scope of covered claims, exclusions, "
            "financial limits, and whether liability is capped."
        )

    elif category == "liability":

        plain_english = (
            "This clause defines responsibility for losses, "
            "damages, or other liabilities."
        )

        why_it_matters = (
            "Broad or uncapped liability can expose a party to "
            "substantial financial consequences."
        )

        recommendation = (
            "Check whether liability is capped and identify any "
            "exceptions to the limitation."
        )

    elif category == "governing_law":

        plain_english = (
            "This clause determines which jurisdiction's laws "
            "will govern the agreement."
        )

        why_it_matters = (
            "The governing law can affect how contractual disputes "
            "are interpreted and resolved."
        )

        recommendation = (
            "Check whether the selected jurisdiction is appropriate "
            "for the parties and transaction."
        )

    elif category == "renewal":

        plain_english = (
            "This clause controls whether the agreement continues "
            "or renews after its initial term."
        )

        why_it_matters = (
            "Automatic renewal can extend contractual obligations "
            "if the required cancellation notice is missed."
        )

        recommendation = (
            "Check the renewal period, cancellation deadline, "
            "and notice requirements."
        )

    elif category == "compensation":

        plain_english = (
            "This clause describes compensation or employment benefits."
        )

        why_it_matters = (
            "Compensation terms determine salary, bonuses, benefits, "
            "and other financial rights under the agreement."
        )

        recommendation = (
            "Check salary, bonus conditions, benefits, payment timing, "
            "and any discretionary terms."
        )

    else:

        if risk_level == "high":
            plain_english = (
                "This clause contains significant contractual "
                "risk indicators that require careful review."
            )

            why_it_matters = (
                "The identified terms may create material legal, "
                "financial, or operational exposure."
            )

            recommendation = (
                "Review the specific obligations and consider "
                "negotiating clearer limitations or protections."
            )

        elif risk_level == "medium":
            plain_english = (
                "This clause contains terms that warrant "
                "additional review."
            )

            why_it_matters = (
                "The identified terms may create meaningful "
                "obligations depending on the surrounding agreement."
            )

            recommendation = (
                "Review the scope, duration, obligations, and "
                "consequences before accepting the clause."
            )

        else:
            plain_english = (
                "No significant predefined risk indicators were "
                "detected in this clause."
            )

            why_it_matters = (
                "The current rule-based analysis did not identify "
                "a significant risk pattern."
            )

            recommendation = (
                "Review the clause together with the surrounding "
                "agreement before final approval."
            )

    return {
        "category": category,
        "plain_english": plain_english,
        "why_it_matters": why_it_matters,
        "recommendation": recommendation,
    }


def generate_full_summary(
    scored_clauses: list[dict],
) -> str:
    """
    Generate a structured contract-level summary.
    """

    if not scored_clauses:
        return "No clauses were available for analysis."

    high_count = sum(
        1
        for clause in scored_clauses
        if clause.get("risk_level") == "high"
    )

    medium_count = sum(
        1
        for clause in scored_clauses
        if clause.get("risk_level") == "medium"
    )

    low_count = sum(
        1
        for clause in scored_clauses
        if clause.get("risk_level") == "low"
    )

    total = len(scored_clauses)

    if high_count > 0:
        overall = (
            "The contract contains high-risk clauses that "
            "require careful review before approval."
        )
    elif medium_count > 0:
        overall = (
            "The contract contains clauses that require "
            "additional review before approval."
        )
    else:
        overall = (
            "The analysis did not identify significant "
            "predefined risk indicators."
        )

    return (
        f"{overall} "
        f"The analysis identified {total} clauses: "
        f"{high_count} high-risk, "
        f"{medium_count} medium-risk, and "
        f"{low_count} low-risk."
    )