import os
import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from parser.extractor import extract_text_from_file
from services.clause_detector import segment_and_detect_clauses
from services.chat_assistant import answer_contract_query
from services.comparator import compare_two_contracts
from rag.knowledge_base import search_legal_references

app = FastAPI(
    title="ClauseIQ AI Intelligence Service",
    description="Microservice for PDF/DOCX Parsing, Clause Detection, RAG Legal Search, and Contract Comparison",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ParseRequest(BaseModel):
    filePath: str
    fileType: str
    originalName: Optional[str] = ""

class AnalyzeRequest(BaseModel):
    contractId: Optional[str] = ""
    text: str
    title: Optional[str] = "Contract"
    contractType: Optional[str] = "Other"

class ChatRequest(BaseModel):
    contractText: Optional[str] = ""
    question: str
    conversationHistory: Optional[List[Dict[str, str]]] = []

class CompareRequest(BaseModel):
    contractAText: str
    contractBText: str
    contractATitle: Optional[str] = "Contract A"
    contractBTitle: Optional[str] = "Contract B"

class RAGSearchRequest(BaseModel):
    query: str
    topK: Optional[int] = 3


@app.get("/")
def root():
    return {
        "service": "ClauseIQ AI Service",
        "status": "online",
        "version": "1.0.0",
        "endpoints": ["/health", "/api/v1/ai/parse", "/api/v1/ai/analyze", "/api/v1/ai/chat", "/api/v1/ai/compare", "/api/v1/ai/rag"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "ClauseIQ-NLP-PyMuPDF-RAG",
        "version": "1.0.0"
    }

@app.post("/api/v1/ai/parse")
def parse_document(req: ParseRequest):
    try:
        result = extract_text_from_file(req.filePath, req.fileType, req.originalName)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/api/v1/ai/analyze")
def analyze_document(req: AnalyzeRequest):
    try:
        analysis = segment_and_detect_clauses(req.text, req.title, req.contractType)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/api/v1/ai/chat")
def chat_contract(req: ChatRequest):
    try:
        response = answer_contract_query(req.contractText, req.question, req.conversationHistory)
        return response
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/api/v1/ai/compare")
def compare_contracts_endpoint(req: CompareRequest):
    try:
        comparison = compare_two_contracts(
            req.contractAText,
            req.contractBText,
            req.contractATitle,
            req.contractBTitle
        )
        return comparison
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/api/v1/ai/rag")
def rag_search(req: RAGSearchRequest):
    try:
        results = search_legal_references(req.query, req.topK)
        return {"query": req.query, "references": results}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
