import os
import re
import fitz  # PyMuPDF

def extract_text_from_file(file_path: str, file_type: str, original_name: str = "") -> dict:
    """
    Extracts text and metadata from PDF, DOCX, and TXT files.
    """
    if not os.path.exists(file_path):
        return {
            "title": original_name or "Document",
            "text": "",
            "pages": 1,
            "wordCount": 0,
            "error": "File does not exist"
        }

    ext = file_type.lower().replace(".", "")
    text = ""
    pages = 1

    try:
        if ext == "pdf":
            doc = fitz.open(file_path)
            pages = max(1, len(doc))
            page_texts = []
            for i in range(pages):
                p = doc[i]
                page_texts.append(p.get_text("text"))
            doc.close()
            text = "\n\n".join(page_texts)

        elif ext == "docx":
            try:
                import docx
                doc = docx.Document(file_path)
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                text = "\n\n".join(paragraphs)
                pages = max(1, round(len(text.split()) / 400))
            except Exception as e:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
                pages = 1

        else:  # txt or default
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
            pages = max(1, round(len(text.split()) / 400))

    except Exception as e:
        print(f"[Parser Error] Failed to parse {file_path}: {e}")
        text = f"Error extracting text: {str(e)}"

    # Clean text
    clean_text = re.sub(r'\r\n', '\n', text)
    clean_text = re.sub(r'[ \t]+', ' ', clean_text)
    words = clean_text.split()

    doc_title = original_name.rsplit('.', 1)[0] if original_name else os.path.basename(file_path).rsplit('.', 1)[0]

    return {
        "title": doc_title,
        "text": clean_text.strip(),
        "pages": pages,
        "wordCount": len(words),
        "metadata": {
            "filePath": file_path,
            "fileType": ext,
            "originalName": original_name
        }
    }
