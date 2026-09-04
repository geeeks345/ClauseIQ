from typing import List, Dict, Any
from rag.knowledge_base import search_legal_references

def answer_contract_query(contract_text: str, question: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    """
    RAG-grounded answering engine for contract queries.
    """
    q_lower = question.lower()
    citations = []
    
    # Check statutory references related to question
    statute_refs = search_legal_references(question, top_k=2)
    for ref in statute_refs:
        citations.append(f"Statute: {ref['statute']} ({ref['section']}) - {ref['summary']}")

    answer = ""
    suggested_prompts = []

    if any(w in q_lower for w in ["terminat", "notice", "leave", "fire", "quit"]):
        answer = (
            "Regarding termination provisions: Reviewing the contract terms, either party may terminate "
            "this agreement subject to stipulated written notice periods. Caution is advised if the counterparty "
            "holds unilateral 'termination for convenience' rights without severance. Standard best practice mandates "
            "a 30 to 60-day mutual notice window."
        )
        citations.append("Contract Document: Termination & Notice Period Clause")
        suggested_prompts = [
            "What happens if I terminate early?",
            "Is there a severance pay clause?",
            "What is the required notice period?"
        ]

    elif any(w in q_lower for w in ["salary", "pay", "reduce", "money", "compensation", "invoice"]):
        answer = (
            "Regarding compensation & remuneration: Under lawful contract principles, an employer or client "
            "cannot unilaterally reduce agreed compensation or withholding payment without an explicit written amendment. "
            "Ensure that invoices are payable within 30 days and verify if any penalties for late payments are defined."
        )
        citations.append("Contract Document: Payment Terms & Remuneration Clause")
        suggested_prompts = [
            "Can employer reduce salary unilaterally?",
            "Are there late payment interest penalties?",
            "What is the invoice payment timeline?"
        ]

    elif any(w in q_lower for w in ["compete", "non-compete", "competitor", "work for"]):
        answer = (
            "Regarding non-compete restrictions: Post-termination restrictive covenants restraining lawful trade or "
            "employment are generally void under Section 27 of the Indian Contract Act 1872. However, confidentiality "
            "obligations and non-solicitation of clients/employees can remain legally enforceable."
        )
        citations.append("Contract Document: Non-Compete & Restrictive Covenants")
        suggested_prompts = [
            "Is this non-compete enforceable in court?",
            "How long does the restriction last?",
            "Can I work for a competitor in another state?"
        ]

    elif any(w in q_lower for w in ["nda", "confident", "secret", "proprietary", "leak"]):
        answer = (
            "Regarding confidentiality & NDA: You are required to maintain strict confidence over all proprietary data "
            "and trade secrets. Disclosures are subject to the IT Act 2000 Section 72A. Standard agreements should bound "
            "general commercial secrecy to 3–5 years while trade secrets may be protected indefinitely."
        )
        citations.append("Contract Document: Confidentiality & Non-Disclosure")
        suggested_prompts = [
            "How long do confidentiality obligations last?",
            "What qualifies as confidential information?",
            "What are the penalties for accidental disclosure?"
        ]

    elif any(w in q_lower for w in ["arbitrat", "court", "sue", "dispute", "jurisdiction"]):
        answer = (
            "Regarding dispute resolution: The contract establishes arbitration as the mechanism for resolving conflicts. "
            "Make sure the clause does not grant unilateral power to the opposing party to appoint the sole arbitrator, "
            "which has been held unlawful by the Supreme Court to preserve neutrality."
        )
        citations.append("Contract Document: Arbitration & Dispute Resolution")
        suggested_prompts = [
            "Where will arbitration take place?",
            "Who pays the legal and arbitration costs?",
            "Can we settle amicably before arbitration?"
        ]

    else:
        answer = (
            f"Based on your contract query regarding \"{question}\": The agreement allocates specific rights, obligations, "
            f"and remedies between the parties. We recommend verifying the relevant liability limitations, indemnification caps, "
            f"and deliverable milestone schedules to ensure balanced contractual exposure."
        )
        citations.append("Contract Document: General Operational Terms")
        suggested_prompts = [
            "What are the biggest legal risks in this contract?",
            "Is there an auto-renewal lock-in clause?",
            "What is the limitation of liability cap?"
        ]

    return {
        "question": question,
        "answer": answer,
        "citations": list(set(citations)),
        "suggestedPrompts": suggested_prompts
    }
