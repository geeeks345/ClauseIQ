# ClauseIQ v1.0.0 — REST API Specification (`/api/v1`)

All endpoints are versioned under `/api/v1` and return standardized JSON responses:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-09-02T23:00:00.000Z"
}
```

---

## 🔐 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Create a new user account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "password": "password123",
    "company": "Apex Legal",
    "role": "user"
  }
  ```
- **Response `201`**: Returns user object and JWT bearer token.

### `POST /api/v1/auth/login`
Authenticate user with email and password.
- **Request Body**:
  ```json
  {
    "email": "jane@company.com",
    "password": "password123"
  }
  ```

### `GET /api/v1/auth/profile` *(Protected: Bearer Token)*
Retrieve authenticated user profile and analytics summary.

---

## 📄 2. Contract Management Endpoints

### `POST /api/v1/contracts/upload` *(Protected)*
Upload contract file (`.pdf`, `.docx`, `.txt`) with `multipart/form-data`.
- **Form Fields**: `file` (Binary), `title` (String), `contractType` (String).
- **Processing**: Triggers PyMuPDF parser, extracts page count & word count, saves metadata.

### `GET /api/v1/contracts` *(Protected)*
List all user contracts with pagination, search, and risk filters.
- **Query Params**: `search`, `risk` (`All`, `High`, `Medium`, `Low`), `type`, `page`, `limit`.

### `GET /api/v1/contracts/:id` *(Protected)*
Get single contract with latest analysis metadata.

### `PUT /api/v1/contracts/:id` *(Protected)*
Rename contract or update tags.

### `DELETE /api/v1/contracts/:id` *(Protected)*
Delete contract, physical uploaded file, and related AI analysis records.

---

## 🤖 3. AI Intelligence Endpoints

### `POST /api/v1/ai/analyze/:contractId` *(Protected)*
Dispatches contract text to Python AI Service. Returns:
- `overallRiskScore` (0–100)
- `riskLevel` (`Low`, `Medium`, `High`, `Critical`)
- `executiveSummary`
- `clauses` array (type, original text, plain English, risk, rationale, real-world example, recommendation, RAG statutory references, confidence score).

### `GET /api/v1/ai/analysis/:contractId` *(Protected)*
Fetch existing AI audit analysis for a contract.

### `POST /api/v1/ai/chat/:contractId` *(Protected)*
Interactive RAG Legal Assistant query grounded in contract clauses and statutory benchmarks.

### `POST /api/v1/ai/compare` *(Protected)*
Side-by-side contract diff comparison between `contractAId` and `contractBId`.
- **Response**: Added clauses, Removed clauses, Modified terms, and Risk Delta percentage.

---

## 📊 4. Reports & Exports

### `GET /api/v1/reports` *(Protected)*
List all analyzed contracts with export availability.

### `GET /api/v1/reports/pdf/:contractId` *(Protected)*
Streams formatted executive compliance PDF report generated via PDFKit.

### `GET /api/v1/reports/json/:contractId` *(Protected)*
Downloads complete structured JSON compliance export.

---

## 🔔 5. Notifications & Activity History

### `GET /api/v1/notifications` *(Protected)*
Get user alerts and unread counter.

### `PUT /api/v1/notifications/:id/read` *(Protected)*
Mark a notification as read.

### `GET /api/v1/history` *(Protected)*
Get full chronological activity audit trail.
