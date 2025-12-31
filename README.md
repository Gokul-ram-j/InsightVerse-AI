# 🚀 About

InsightVerse AI is a full-stack, AI-powered learning and content intelligence platform designed to transform raw information into meaningful knowledge. It enables users to upload videos, PDFs, Word documents, audio files, or YouTube links and instantly generate concise summaries, structured key notes, and AI-driven quizzes with varying difficulty levels.

Built with a scalable SaaS architecture, InsightVerse AI leverages Generative AI and Retrieval-Augmented Generation (RAG) to accurately process and understand long-form and multi-modal content. The platform focuses on secure file handling, efficient content extraction, and sharable learning outputs, making it suitable for students, educators, professionals, and AI-driven learning systems.

InsightVerse AI aims to bridge the gap between information overload and effective learning by combining human-centric design with AI-powered intelligence.

---

# 🧰 Tools, Frameworks & Technologies Used

### 🌐 Frontend

* **Next.js** → Build fast, SEO-friendly web interface
* **React** → Component-based UI development
* **Tailwind CSS** → Responsive and modern UI styling

---

### 🧠 Backend (Core)

* **FastAPI** → Build high-performance REST APIs
* **Python** → Core backend language for AI, data processing, and APIs

---

### 📦 Backend Modules & Tools (Simple Mapping)

### File Ingestion

* **python-multipart** → Handle file uploads
* **requests** → Fetch external resources (URLs, YouTube pages)

---

### Content Extraction

* **PyPDF** → Load and extract text from PDF files
* **python-docx** → Extract content from Word documents
* **Whisper** → Convert audio/video speech to text
* **youtube-transcript-api** → Fetch YouTube video transcripts

---

### AI Processing & RAG

* **LangChain** → Orchestrate AI workflows
* **Sentence-Transformers** → Generate text embeddings
* **FAISS** → Store and search vector embeddings
* **OpenAI / LLM API** → Generate summaries, quizzes, and notes

---

### Quiz Generation

* **LLM Prompting** → Generate quizzes (Easy / Medium / Hard)
* **Structured Output Parsing** → Ensure clean, usable responses

---

### Storage & File Handling

* **MinIO (S3-compatible)** → Store uploaded files and outputs
* **boto3** → Interact with object storage buckets

---

### Background Processing

* **FastAPI BackgroundTasks** → Run long AI jobs asynchronously

---

### 🗄 Databases

* **MongoDB** → Store users, job metadata, AI outputs, and status
* **FAISS** → Vector database for semantic search and RAG

---

## ☁️ Cloud & DevOps

- **MinIO** → Object storage service (S3-compatible) running via Docker for secure and scalable file storage  
- **Git & GitHub** → Source control and collaborative development**Git & GitHub** → Version control and collaboration

---

## 🧩 Programming Languages & Usage

* **Python** → Backend APIs, AI pipelines, RAG, file processing
* **JavaScript / TypeScript** → Frontend logic and API calls

---

## 🗺 Frontend UI & Routing Map (Next.js App Router)

InsightVerse AI uses **Next.js App Router**, where the folder structure directly defines application routes.

---

## 🌐 Route Hierarchy (URL → Folder Mapping)

```
/
├── /                              → Home / Landing Page
│
├── /upload                        → Content upload page
│
├── /results/[jobId]               → Results dashboard (job-specific)
│   │
│   ├── /results/[jobId]/summary   → AI-generated summary
│   │   ├── /view                  → Summary detail view
│   │
│   ├── /results/[jobId]/quiz      → Quiz module
│   │   └── /play                  → Quiz play interface
│   │
│   └── /results/[jobId]/chat      → Context-aware AI chat
```

---

## 📁 Folder → Route Breakdown

### 🏠 Root & Global Layout

```
app/
├── layout.tsx          → Global layout (header, footer, providers)
├── page.tsx            → Home / Landing page
├── globals.css         → Global styles
└── favicon.ico         → App favicon
```

---

### 📤 Upload Flow

```
app/upload/
└── page.tsx            → /upload
```

**Purpose**

* File upload (PDF, audio, video)
* YouTube link input
* Triggers backend ingestion

---

### 📊 Results (Job-Based Routing)

```
app/results/[jobId]/
├── page.tsx            → /results/{jobId}
```

**Purpose**

* Job overview
* Entry point for summary, quiz, and chat

---

### 📝 Summary Module

```
app/results/[jobId]/summary/
├── page.tsx            → /results/{jobId}/summary
└── view/
    └── page.tsx        → /results/{jobId}/summary/view
```

**Purpose**

* Show AI-generated summary
* Expanded / detailed summary view

---

### 🧠 Quiz Module

```
app/results/[jobId]/quiz/
├── page.tsx            → /results/{jobId}/quiz
└── play/
    └── page.tsx        → /results/{jobId}/quiz/play
```

**Purpose**

* Quiz instructions & settings
* Interactive quiz gameplay

---

### 💬 Chat Module

```
app/results/[jobId]/chat/
└── page.tsx            → /results/{jobId}/chat
```

**Purpose**

* RAG-based contextual Q&A
* Uses FAISS + LLM context from job data

---

## 🔁 UI Navigation Flow

```
/ (Home)
   ↓
/upload
   ↓
(results generated)
   ↓
/results/{jobId}
   ├── summary
   │     └── view
   ├── quiz
   │     └── play
   └── chat
```

---

## 🧩 UI → Backend Interaction (Quick Map)

| UI Route           | Backend Interaction                    |
| ------------------ | -------------------------------------- |
| `/upload`          | `POST /api/upload`, `POST /api/ingest` |
| `/results/{jobId}` | `GET /api/status/{jobId}`              |
| `/summary`         | `GET /api/results/{jobId}`             |
| `/quiz/play`       | `POST /api/quiz/{jobId}`               |
| `/chat`            | `POST /api/chat`                       |

---

## Backend System Architecture & Execution Flow

![InsightVerse AI UI](./frontend/public/insightVerse%20AI.png)

Here is a **final, clean, copy-paste-ready setup configuration** for **InsightVerse AI**.
This is the **last consolidated version** — short, ordered, and clear.

You can place this under **“Setup & Configuration”** in your README.

---

# ⚙️ Setup Configuration — InsightVerse AI
---

## 1️⃣ Frontend Configuration (Next.js)

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

Runs at:

```
http://localhost:3000
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 2️⃣ Backend Configuration (FastAPI)

### Install & Run

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at:

```
http://localhost:8000
```

API Docs:

```
http://localhost:8000/docs
```

---

## 3️⃣ Database Configuration (MongoDB)

### Run MongoDB (Docker)

```bash
docker run -d \
  --name insightverse-mongo \
  -p 27017:27017 \
  mongo:6
```

---

## 4️⃣ Object Storage Configuration (MinIO)

### Run MinIO (Docker)

```bash
docker run -d \
  --name insightverse-minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  quay.io/minio/minio server /data --console-address ":9001"
```

### MinIO Console

```
http://localhost:9001
```

### Create Buckets

```
pdfs
docs
videos
```

---

## 5️⃣ Local LLM Configuration (Mistral via Ollama)

### Install Ollama

👉 [https://ollama.com](https://ollama.com)

### Pull & Run Mistral

```bash
ollama pull mistral
ollama run mistral
```

Runs at:

```
http://localhost:11434
```

---

## 6️⃣ Backend Environment Variables (`backend/.env`)

```env
# App
ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/insightverse

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_SECURE=false

MINIO_BUCKET_PDFS=pdfs
MINIO_BUCKET_DOCS=docs
MINIO_BUCKET_VIDEOS=videos

# Local LLM (Ollama + Mistral)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

---

## 🔁 Recommended Startup Order

1️⃣ MongoDB
2️⃣ MinIO
3️⃣ Ollama (Mistral)
4️⃣ Backend (FastAPI)
5️⃣ Frontend (Next.js)

---

## ✅ System Verification Checklist

* Frontend → `http://localhost:3000`
* Backend → `http://localhost:8000/docs`
* MinIO Console → `http://localhost:9001`
* Ollama → `http://localhost:11434`
* Upload file → stored in correct bucket
* Results → generated via local Mistral + FAISS

---

## 🏁 Final Note

InsightVerse AI runs **fully locally** with:

* FastAPI backend
* Next.js frontend
* MongoDB for metadata
* MinIO for file storage (bucket-based)
* FAISS for vector search
* **Mistral LLM via Ollama**

This setup is **production-ready, privacy-safe, and cost-free for LLM usage**.

---

