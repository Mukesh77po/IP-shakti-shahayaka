# SIH26045 — IP-SAKTI Sahayak (Backend MVP)

> **Smart India Hackathon 2026**  
> **Problem Statement ID:** 26045  
> **Ministry of Ayush | All India Institute of Ayurveda**  
> **Title:** IP-SAKTI Sahayak: A multilingual, RAG-based (source-cited) AI assistant for Intellectual Property and regulatory guidance in Ayurveda, across national and international regimes.

---

## 🏛️ Exact Architecture Flow

```
                      +-------------------+
                      |   Frontend (Web)  |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |   FastAPI Layer   |
                      |  POST /api/ask    |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |     Product       |
                      |  Classification   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |   RAG Retriever   |
                      | (Jurisdiction 1st)|
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |     ChromaDB      |
                      |  (Persisted KB)   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |    Authoritative  |
                      |   Retrieved Chunks|
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |    Google Gemini  |
                      | (google-genai SDK)|
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      | Structured Answer |
                      |  with Citations   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |     Frontend      |
                      +-------------------+
```

---

## 📂 Project Structure

```
ip-sakti/
│
├── app/
│   ├── main.py              # FastAPI app instance with CORS & routing
│   ├── config.py            # Environment configuration & paths
│   ├── models.py            # Pydantic schemas (AskRequest, AskResponse, Health)
│   ├── api/
│   │   └── routes.py        # /api/health & /api/ask endpoints
│   ├── rag/
│   │   ├── ingest.py        # PyPDF parser, chunker, & ChromaDB indexer
│   │   ├── retriever.py     # Jurisdiction-prioritized vector search
│   │   └── prompts.py       # Strict zero-hallucination prompts & schemas
│   └── services/
│       ├── classifier.py    # 6-category Ayurvedic product classifier
│       └── answer.py        # Gemini structured response generator
│
├── data/
│   ├── india/               # National statutes (Drugs & Cosmetics, Patents, NBA, FSSAI)
│   └── international/       # Global frameworks (US FDA Botanical, EU THMPD, Nagoya)
│
├── chroma_db/               # Persistent ChromaDB vector database storage
├── .env                     # Local environment file (with API keys)
├── .env.example             # Example environment template
├── requirements.txt         # Production Python dependencies
├── generate_sample_corpus.py# Generator for authentic statutory PDFs
└── README.md                # Quickstart and exact execution guide
```

---

## 🪟 EXACT Windows Commands (Step-by-Step Setup)

Open **PowerShell** or **Command Prompt** (Run as Administrator or regular user) and navigate to the project directory:

```cmd
cd ip-sakti
```

### 1. Create Virtual Environment
```cmd
python -m venv venv
```
Activate the virtual environment:
- **In PowerShell:**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(If PowerShell gives an execution policy error, run once: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)*
- **In Command Prompt (cmd.exe):**
  ```cmd
  venv\Scripts\activate.bat
  ```

---

### 2. Install Dependencies
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

### 3. Set GOOGLE_API_KEY
You can set it directly in your Windows terminal session, or save it inside the `.env` file:

- **In Command Prompt:**
  ```cmd
  set GOOGLE_API_KEY=your_actual_gemini_api_key_here
  ```
- **In PowerShell:**
  ```powershell
  $env:GOOGLE_API_KEY="your_actual_gemini_api_key_here"
  ```
- **Or inside `.env` file:**
  ```env
  GOOGLE_API_KEY=your_actual_gemini_api_key_here
  ```

---

### 4. Add PDFs
Place your authoritative PDFs into the respective subdirectories:
- National Indian documents (Drugs & Cosmetics Act, Patent Act Section 3(p), Biological Diversity Act, FSSAI Ayurveda-Aahar) into:  
  `data\india\`
- International documents (US FDA Botanical Drug Guidance, EU Directive 2004/24/EC THMPD, WIPO/Nagoya) into:  
  `data\international\`

*(Note: You can run `python generate_sample_corpus.py` to immediately generate 6 authentic statutory PDFs if you haven't downloaded your own yet!)*

---

### 5. Run Ingestion
Run the ingestion script to extract text, chunk pages, and store embeddings in ChromaDB:
```cmd
python -m app.rag.ingest
```

**Expected output:**
```
============================================================
IP-SAKTI Sahayak: Regulatory Knowledge Base Ingestion
============================================================
Current chunks in ChromaDB: 0

--- Processing 4 PDF(s) in India [./data/india] ---
Reading: drugs_and_cosmetics_act_1940.pdf
Reading: patents_act_1970_section_3p.pdf
Reading: biological_diversity_act_2002.pdf
Reading: ayurveda_aahar_regulations_2022.pdf
Extracted 16 chunks for India. Indexing into ChromaDB...
Successfully indexed 16 chunks for India.

--- Processing 2 PDF(s) in International [./data/international] ---
Reading: fda_botanical_drug_guidance.pdf
Reading: eu_directive_2004_24_thmpd.pdf
Extracted 8 chunks for International. Indexing into ChromaDB...
Successfully indexed 8 chunks for International.

Ingestion Summary:
- India chunks added: 16
- International chunks added: 8
- Total chunks in database: 24
============================================================
```

---

### 6. Start FastAPI
Launch the Uvicorn server:
```cmd
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The server will be live at:
- **API URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`

---

### 7. Test `/api/health`

- **In PowerShell:**
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get | ConvertTo-Json
  ```
- **In Command Prompt (using curl):**
  ```cmd
  curl -X GET "http://localhost:8000/api/health"
  ```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "IP-SAKTI Sahayak (SIH26045)",
  "version": "1.0.0",
  "chroma_db_status": "connected",
  "total_chunks_indexed": 24,
  "supported_jurisdictions": [
    "India",
    "International",
    "US",
    "EU"
  ],
  "supported_product_types": [
    "Classical Ayurvedic formulation",
    "Proprietary formulation",
    "New/non-classical formulation",
    "Ayurveda-Aahar",
    "Cosmetic",
    "Unknown"
  ]
}
```

---

### 8. Test `/api/ask`

#### Example 1: Patentability of Classical Formulation & NBA Approval (India)

- **PowerShell:**
  ```powershell
  $body = @{
    question = "Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?"
    product_type = "Classical Ayurvedic formulation"
    jurisdiction = "India"
    language = "English"
  } | ConvertTo-Json

  Invoke-RestMethod -Uri "http://localhost:8000/api/ask" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
  ```

- **Curl (Command Prompt):**
  ```cmd
  curl -X POST "http://localhost:8000/api/ask" -H "Content-Type: application/json" -d "{\"question\": \"Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?\", \"product_type\": \"Classical Ayurvedic formulation\", \"jurisdiction\": \"India\", \"language\": \"English\"}"
  ```

---

## 📋 Complete Sample Request & Expected Response

### Sample Request:
```json
{
  "question": "Can I patent a classical formulation like Chyawanprash with added preservatives, and what NBA permissions are needed?",
  "product_type": "Classical Ayurvedic formulation",
  "jurisdiction": "India",
  "language": "English"
}
```

### Expected Response:
```json
{
  "classification": {
    "product_type": "Classical Ayurvedic formulation",
    "jurisdiction": "India",
    "category": "Classified as Classical Ayurvedic Medicine manufactured exclusively according to formulas in First Schedule texts of Drugs and Cosmetics Act, 1940."
  },
  "answer": "Under Section 3(p) of the Indian Patents Act, 1970, an invention that is traditional knowledge or an aggregation or duplication of known properties of traditionally known components is not patentable. Because Chyawanprash is a codified classical formulation described in First Schedule authoritative texts, adding standard preservatives does not overcome Section 3(p) or Section 3(e) (mere admixture). Furthermore, under Section 6 of the Biological Diversity Act, 2002, prior approval of the National Biodiversity Authority (NBA) via Form 3 is legally mandated before applying for any intellectual property right based on Indian biological resources.",
  "reasoning": "The Patents Act strictly bars patenting classical Ayurvedic remedies documented in the Traditional Knowledge Digital Library (TKDL) and First Schedule texts without proven unexpected synergy (Section 3(e)). Additionally, Section 6 of the Biological Diversity Act imposes statutory duties and Access-and-Benefit-Sharing (ABS) compliance before IPR grant.",
  "next_steps": [
    "Do not file a patent claiming the classical recipe; protect proprietary branding via Trademark registration instead.",
    "If a novel, unexpected synergistic extract or delivery matrix was developed, file NBA Form 3 with the National Biodiversity Authority before filing patent claims.",
    "Obtain an ASU manufacturing license from the State Licensing Authority under Form 25D of the Drugs and Cosmetics Rules."
  ],
  "confidence": "High",
  "sources": [
    {
      "title": "The Patents Act, 1970 (Section 3(p) & TK Guidelines)",
      "organization": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
      "page": "1",
      "url": "https://ipindia.gov.in/patents.htm"
    },
    {
      "title": "Biological Diversity Act, 2002 & Amendment Act 2023",
      "organization": "National Biodiversity Authority (NBA)",
      "page": "1",
      "url": "https://nbaindia.org/act/"
    },
    {
      "title": "Drugs and Cosmetics Act, 1940 & Rules 1945",
      "organization": "Ministry of Ayush / CDSCO",
      "page": "1",
      "url": "https://indiacode.nic.in/handle/123456789/2384"
    }
  ],
  "disclaimer": "This is informational guidance and not legal advice."
}
```

---

## ⚡ 6 Supported Product Classifications
1. **Classical Ayurvedic formulation**: Formulae described in authoritative books specified in the First Schedule to the Drugs and Cosmetics Act, 1940 (e.g., Charaka Samhita, Sushruta Samhita, Sahasrayogam).
2. **Proprietary formulation**: Formulations containing only ingredients from First Schedule texts, but prepared in novel combinations or modern dosage forms under Section 3(h).
3. **New/non-classical formulation**: Formulations utilizing novel extracts, phytopharmaceuticals, isolated fractions, or uncodified ingredients requiring safety & clinical data.
4. **Ayurveda-Aahar**: Food products prepared per Ayurvedic principles regulated under FSSAI (Ayurveda Aahar) Regulations, 2022. No therapeutic/disease treatment claims allowed.
5. **Cosmetic**: Articles intended for cleansing, beautifying, or promoting attractiveness under Cosmetics Rules, 2020.
6. **Unknown**: Queries where category cannot be determined.

---

## 🛡️ RAG Guardrails & Anti-Hallucination Policy
- The model **ONLY** answers using the retrieved context from ChromaDB.
- Never invents laws, sections, forms, citations, or URLs.
- If retrieved context is insufficient, it strictly returns:
  `"Insufficient authoritative information available to answer this reliably."`
  with `"confidence": "Low"` and empty sources.
