import math
import re
from typing import List, Dict

LEGAL_KNOWLEDGE_BASE = [
    {
        "id": "leg_ica_27",
        "statute": "Indian Contract Act, 1872",
        "section": "Section 27",
        "topic": "Non-Compete & Restraint of Trade",
        "keywords": ["non-compete", "restraint of trade", "compete", "post-termination", "employment restriction", "competitor"],
        "summary": "Every agreement by which any person is restrained from exercising a lawful profession, trade or business of any kind is void to that extent. Post-employment non-compete clauses are unenforceable.",
        "jurisdiction": "India / Common Law"
    },
    {
        "id": "leg_ica_73",
        "statute": "Indian Contract Act, 1872",
        "section": "Section 73 & 74",
        "topic": "Breach of Contract & Liquidated Damages",
        "keywords": ["damages", "breach", "penalty", "liquidated damages", "compensation", "loss"],
        "summary": "Compensation for loss or damage caused by breach of contract must be reasonable and cannot be punitive or in the nature of penalty.",
        "jurisdiction": "National"
    },
    {
        "id": "leg_it_72a",
        "statute": "Information Technology Act, 2000",
        "section": "Section 72A & Section 43A",
        "topic": "Data Protection & Confidential Information",
        "keywords": ["confidentiality", "nda", "proprietary", "data protection", "trade secret", "disclosure", "security"],
        "summary": "Prescribes liability and penal provisions for unauthorized disclosure of personal or confidential information in breach of lawful contract.",
        "jurisdiction": "National"
    },
    {
        "id": "leg_arb_12",
        "statute": "Arbitration and Conciliation Act, 1996 (Amended)",
        "section": "Section 12(5) & Seventh Schedule",
        "topic": "Arbitrator Independence & Unilateral Appointment",
        "keywords": ["arbitration", "dispute", "sole arbitrator", "unilateral appointment", "seat", "governing law"],
        "summary": "Unilateral appointment of a sole arbitrator by one interested contracting party is legally impermissible to ensure absolute neutrality (Supreme Court Perkins Eastman).",
        "jurisdiction": "Supreme Court of India"
    },
    {
        "id": "leg_cpa_2",
        "statute": "Consumer Protection Act, 2019",
        "section": "Section 2(46) & Section 89",
        "topic": "Unfair Contract Terms & Evergreen Auto-Renewal",
        "keywords": ["auto-renewal", "unfair terms", "evergreen", "unilateral termination", "excessive penalty"],
        "summary": "Contracts imposing unreasonable or unilateral conditions (e.g. onerous auto-renewal locks, one-sided termination without cause) are classified as unfair contract terms.",
        "jurisdiction": "National / Global"
    },
    {
        "id": "leg_lab_25",
        "statute": "Industrial Relations Code & Standard Employment Laws",
        "section": "Chapter V-A & Notice Standards",
        "topic": "Notice Period & Retrenchment Compensation",
        "keywords": ["notice period", "termination", "severance", "retrenchment", "probation", "salary deduction"],
        "summary": "Mandates reasonable written notice (standard 30 to 90 days) or wages in lieu thereof prior to termination. Unilateral immediate termination for convenience is strictly regulated.",
        "jurisdiction": "Labour & Employment"
    },
    {
        "id": "leg_mta_9",
        "statute": "Model Tenancy Act & Property Laws",
        "section": "Section 9 & Section 13",
        "topic": "Security Deposit & Rent Escalation",
        "keywords": ["lease", "rent", "security deposit", "eviction", "lock-in period", "maintenance"],
        "summary": "Security deposits for residential tenancies capped at 2 months rent and commercial at max 6 months. Standard notice required for any rent revisions.",
        "jurisdiction": "Real Estate"
    },
    {
        "id": "leg_gdpr_6",
        "statute": "Digital Personal Data Protection Act / GDPR",
        "section": "Section 6 & Data Fiduciary Obligations",
        "topic": "Cross-Border Data Transfer & Processing",
        "keywords": ["gdpr", "personal data", "data transfer", "privacy", "sub-processor"],
        "summary": "Obligation to obtain explicit informed consent, protect data integrity, and limit storage strictly to contractual purpose.",
        "jurisdiction": "International / India"
    }
]

def compute_similarity(text: str, keywords: List[str]) -> float:
    text_lower = text.lower()
    score = 0.0
    for kw in keywords:
        if kw.lower() in text_lower:
            score += 1.0
    return min(1.0, score / max(1, len(keywords) * 0.4))

def search_legal_references(query_text: str, top_k: int = 2) -> List[Dict]:
    """
    RAG semantic search against statutory legal knowledge base.
    """
    results = []
    for item in LEGAL_KNOWLEDGE_BASE:
        sim = compute_similarity(query_text, item["keywords"])
        if sim > 0.15:
            results.append({
                "statute": item["statute"],
                "section": item["section"],
                "jurisdiction": item["jurisdiction"],
                "summary": item["summary"],
                "relevanceScore": round(min(0.99, max(0.65, sim)), 2)
            })
    
    results.sort(key=lambda x: x["relevanceScore"], reverse=True)
    return results[:top_k]
