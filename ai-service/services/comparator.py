from typing import Dict, Any
from services.clause_detector import segment_and_detect_clauses

def compare_two_contracts(text_a: str, text_b: str, title_a: str, title_b: str) -> Dict[str, Any]:
    """
    Side-by-side comparison engine detecting added, removed, and modified clauses.
    """
    analysis_a = segment_and_detect_clauses(text_a, title_a)
    analysis_b = segment_and_detect_clauses(text_b, title_b)

    clauses_a = {c["type"]: c for c in analysis_a["clauses"]}
    clauses_b = {c["type"]: c for c in analysis_b["clauses"]}

    types_a = set(clauses_a.keys())
    types_b = set(clauses_b.keys())

    added_types = types_b - types_a
    removed_types = types_a - types_b
    common_types = types_a & types_b

    added_clauses = []
    for t in added_types:
        c = clauses_b[t]
        added_clauses.append({
            "title": c["title"],
            "type": t,
            "risk": c["risk"],
            "description": f"New provision added in \"{title_b}\": {c['plainEnglish']}"
        })

    removed_clauses = []
    for t in removed_types:
        c = clauses_a[t]
        removed_clauses.append({
            "title": c["title"],
            "type": t,
            "risk": c["risk"],
            "description": f"Provision present in \"{title_a}\" was removed in \"{title_b}\": {c['plainEnglish']}"
        })

    modified_clauses = []
    for t in common_types:
        ca = clauses_a[t]
        cb = clauses_b[t]
        
        # Check risk or text difference
        if ca["risk"] != cb["risk"] or len(ca["originalText"]) != len(cb["originalText"]):
            risk_change = "Risk Increased" if (cb["risk"] in ["High", "Critical"] and ca["risk"] in ["Low", "Medium"]) else "Terms Revised"
            modified_clauses.append({
                "title": cb["title"],
                "type": t,
                "changeType": risk_change,
                "contractAValue": ca["originalText"][:160] + "...",
                "contractBValue": cb["originalText"][:160] + "...",
                "riskDelta": f"Risk changed from {ca['risk']} to {cb['risk']}"
            })

    score_a = analysis_a["overallRiskScore"]
    score_b = analysis_b["overallRiskScore"]
    risk_delta = score_b - score_a

    delta_str = f"+{risk_delta}% Risk" if risk_delta > 0 else f"{risk_delta}% Risk" if risk_delta < 0 else "Identical Risk Level"
    summary = (
        f"Comparison between \"{title_a}\" (Score: {score_a}/100) and \"{title_b}\" (Score: {score_b}/100): "
        f"Identified {len(added_clauses)} added provisions, {len(removed_clauses)} removed terms, "
        f"and {len(modified_clauses)} modified clauses. Net risk delta is {delta_str}."
    )

    return {
        "titleA": title_a,
        "titleB": title_b,
        "scoreA": score_a,
        "scoreB": score_b,
        "riskDelta": risk_delta,
        "summary": summary,
        "addedClauses": added_clauses,
        "removedClauses": removed_clauses,
        "modifiedClauses": modified_clauses
    }
