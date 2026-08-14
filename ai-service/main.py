from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import uuid

from services.ai_summary import (
    generate_clause_explanation,
    generate_full_summary,
)

from services.pdf_extractor import extract_text_from_pdf
from services.clause_segmenter import segment_clauses
from services.risk_scorer import score_all_clauses


app = FastAPI(title="ClauseIQ AI Service")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def health_check():
    return {
        "status": "ClauseIQ AI Service is running"
    }


@app.post("/analyze")
async def analyze_contract(
    file: UploadFile = File(...)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported right now.",
        )

    temp_filename = f"{uuid.uuid4()}.pdf"
    temp_path = os.path.join(
        UPLOAD_DIR,
        temp_filename,
    )

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    try:

        # ==========================================
        # Step 1: Extract text
        # ==========================================

        extracted_text = extract_text_from_pdf(
            temp_path
        )

        if not extracted_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract any text from this PDF.",
            )

        # ==========================================
        # Step 2: Segment into clauses
        # ==========================================

        clauses = segment_clauses(
            extracted_text
        )

        if not clauses:
            raise HTTPException(
                status_code=422,
                detail="Could not identify any clauses in this document.",
            )

        # ==========================================
        # Step 3: Score clauses
        # ==========================================

        scored_clauses = score_all_clauses(
            clauses
        )

        # ==========================================
        # Step 4: Generate clause intelligence
        # ==========================================

        for clause in scored_clauses:

            explanation = generate_clause_explanation(
                clause["clause_text"],
                clause["risk_level"],
                clause["reason"],
            )

            clause["category"] = explanation["category"]

            clause["plain_english"] = (
                explanation["plain_english"]
            )

            clause["why_it_matters"] = (
                explanation["why_it_matters"]
            )

            clause["recommendation"] = (
                explanation["recommendation"]
            )

        # ==========================================
        # Step 5: Generate contract summary
        # ==========================================

        summary = generate_full_summary(
            scored_clauses
        )

        # ==========================================
        # Step 6: Return analysis
        # ==========================================

        return {
            "filename": file.filename,
            "character_count": len(extracted_text),
            "total_clauses": len(scored_clauses),
            "summary": summary,
            "clauses": scored_clauses,
        }

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)