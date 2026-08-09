import fitz  # PyMuPDF

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts all text from a PDF file and returns it as a single string.
    """
    text = ""
    doc = fitz.open(file_path)
    for page_num in range(len(doc)):
        page = doc[page_num]
        text += page.get_text()
    doc.close()
    return text.strip()


def extract_text_by_page(file_path: str) -> list[str]:
    """
    Extracts text page-by-page, returning a list of strings (one per page).
    """
    pages = []
    doc = fitz.open(file_path)
    for page_num in range(len(doc)):
        page = doc[page_num]
        pages.append(page.get_text().strip())
    doc.close()
    return pages