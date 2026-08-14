import re


def segment_clauses(text: str) -> list[str]:
    """
    Splits contract text into meaningful clauses.

    Handles:
    - 1.
    - 1.1
    - 1.1.1
    - Article 3
    - Section 4

    Section headings such as:

        5. Intellectual Property

    are merged with their first actual sub-clause:

        5.1 All inventions...

    instead of being treated as separate clauses.
    """

    if not text or not text.strip():
        return []

    # --------------------------------------------------
    # Normalize line endings
    # --------------------------------------------------

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # --------------------------------------------------
    # Clause numbering
    #
    # Matches:
    # 1.
    # 1.1
    # 1.1.1
    # Article 3
    # Section 4
    # --------------------------------------------------

    clause_pattern = re.compile(
        r"(?m)"
        r"^\s*"
        r"("
        r"\d+(?:\.\d+)*\.?"
        r"|Article\s+\d+"
        r"|Section\s+\d+"
        r")"
        r"\s+"
    )

    matches = list(
        clause_pattern.finditer(text)
    )

    if len(matches) < 2:
        paragraphs = [
            clean_clause(p)
            for p in text.split("\n\n")
            if p.strip()
        ]

        return paragraphs

    raw_clauses = []

    # --------------------------------------------------
    # First split
    # --------------------------------------------------

    for i, match in enumerate(matches):

        start = match.start()

        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(text)

        clause_text = text[start:end].strip()

        if clause_text:
            raw_clauses.append(
                clean_clause(clause_text)
            )

    # --------------------------------------------------
    # Merge section headings
    # --------------------------------------------------

    clauses = []

    for clause in raw_clauses:

        if not clauses:
            clauses.append(clause)
            continue

        current_number = extract_clause_number(
            clause
        )

        previous_number = extract_clause_number(
            clauses[-1]
        )

        # --------------------------------------------------
        # Detect heading:
        #
        # 5. Intellectual Property
        #
        # followed by:
        #
        # 5.1 All inventions...
        # --------------------------------------------------

        if (
            current_number
            and previous_number
            and is_subclause(
                current_number,
                previous_number
            )
        ):
            previous_text = clauses[-1]

            if looks_like_section_heading(
                previous_text,
                previous_number
            ):
                clauses[-1] = (
                    previous_text
                    + " "
                    + clause
                )

                continue

        clauses.append(clause)

    return clauses


def extract_clause_number(
    clause_text: str,
) -> str | None:
    """
    Extract the leading clause number.

    Examples:

        5. Intellectual Property
        -> 5

        5.1 All inventions...
        -> 5.1

        5.1.1 Something...
        -> 5.1.1
    """

    match = re.match(
        r"^\s*(\d+(?:\.\d+)*\.?)\s+",
        clause_text,
    )

    if not match:
        return None

    return match.group(1).rstrip(".")


def is_subclause(
    current_number: str,
    previous_number: str,
) -> bool:
    """
    Returns True when current_number is a direct
    or nested sub-clause of previous_number.

    Example:

        previous = 5
        current  = 5.1

        True

    Example:

        previous = 5
        current  = 6

        False
    """

    previous_parts = previous_number.split(".")
    current_parts = current_number.split(".")

    if len(current_parts) <= len(previous_parts):
        return False

    return current_parts[
        :len(previous_parts)
    ] == previous_parts


def looks_like_section_heading(
    clause_text: str,
    clause_number: str | None,
) -> bool:
    """
    Determines whether a clause looks like a section
    heading rather than an actual contractual clause.

    Example:

        5. Intellectual Property

    -> True

    Example:

        5.1 All inventions created by the employee...

    -> False
    """

    if not clause_number:
        return False

    match = re.match(
        r"^\s*\d+(?:\.\d+)*\.?\s+(.+)$",
        clause_text,
    )

    if not match:
        return False

    heading_text = match.group(1).strip()

    # A numbered top-level heading normally contains
    # relatively short text.
    words = heading_text.split()

    if len(words) > 10:
        return False

    # Common indicators that this is a heading.
    heading_patterns = [
        r"^intellectual property$",
        r"^confidentiality$",
        r"^termination$",
        r"^compensation$",
        r"^benefits$",
        r"^non[- ]?solicitation$",
        r"^non[- ]?compete$",
        r"^governing law$",
        r"^dispute resolution$",
        r"^indemnification$",
        r"^liability$",
        r"^employment$",
        r"^duties$",
        r"^general provisions$",
        r"^miscellaneous$",
    ]

    for pattern in heading_patterns:

        if re.match(
            pattern,
            heading_text,
            re.IGNORECASE,
        ):
            return True

    # Short title-like phrases are also likely headings.
    if (
        len(words) <= 5
        and not re.search(
            r"\b(shall|must|will|required|agrees|agreed|may|is|are)\b",
            heading_text,
            re.IGNORECASE,
        )
    ):
        return True

    return False


def clean_clause(
    clause_text: str,
) -> str:
    """
    Removes extra whitespace and normalizes
    a single clause.
    """

    return re.sub(
        r"\s+",
        " ",
        clause_text,
    ).strip()