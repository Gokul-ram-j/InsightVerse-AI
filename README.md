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
