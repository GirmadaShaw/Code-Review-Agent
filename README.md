
# Code Review Agent

An AI-powered code review assistant that automatically analyzes source code and provides actionable feedback on security, maintainability, and best practices.

Deployed Links: 

For Backend:   https://code-review-agent-j2r6.onrender.com/

For Frontend: https://code-review-agent-dusky.vercel.app/

---

## 🚀 Overview

The Code Review Agent automatically fetches pull requests (PRs) from a repository, extracts the PR description and diff, sends a well-formatted prompt to the `gemini-flash-1.5b` model (with tooling where applicable), and receives a structured response that summarizes the PR and produces line-level review comments. The system can post those comments back to the repository as inline PR comments with a single click, and stores review metadata in Google Sheets for auditing and analytics.

---

## 🔧 Key Components

- **Frontend**: Next.js + Tailwind CSS, Monaco Editor for in-browser editing and live review display. Provides UI for:
  - Viewing PR summary and per-line comments
  - Uploading files for one-off reviews
  - Writing code in the editor and requesting a review
  - Triggering "Post inline comments" action (creates GitHub/GitLab PR comments)
- **Backend**: Node.js + Express. Responsibilities:
  - Fetch repositories and PRs using the Git provider API (GitHub/GitLab)
  - Build a deterministic prompt (includes PR description and diff) and send it to `gemini-flash-1.5b` via the configured Gemini API and tooling layer
  - Parse the structured response from the model and return JSON to the frontend
  - Post inline comments back to the PR using provider APIs when the user clicks the action button
  - Persist review records to Google Sheets (used as a lightweight audit log / dataset)
- **Storage/Audit**: Google Sheets (service account) for storing review results, timestamps, reviewer ID (agent), PR id, and summary fields.
- **Model**: `gemini-flash-1.5b` — used because it is fast and suitable for code-focused analysis with tooling. (Adjustable in `.env`.)

---
## ⚙️ Why this Tech Stack


### Next.js + Tailwind CSS (Frontend)
- **Modern developer experience**: Next.js provides hybrid rendering (SSR/SSG), routing, and fast builds, perfect for a responsive code review dashboard.
- **UI productivity**: Tailwind CSS offers utility-first styling, allowing rapid prototyping of diff viewers, file trees, and comment overlays without writing heavy CSS.
- **Editor integration**: Easy integration with Monaco Editor for in-browser code editing and PR diff visualization.


### Node.js + Express (Backend)
- **Lightweight and performant**: Node.js handles concurrent API calls to GitHub/GitLab efficiently, ideal for fetching diffs and posting inline comments.
- **Ecosystem**: Rich NPM ecosystem supports diff parsers, GitHub/GitLab SDKs, and Google Sheets integration.
- **JSON-first**: Native JSON handling simplifies receiving/parsing model outputs and serving them to the frontend.


### Gemini (gemini-flash-1.5b)
- **Optimized for code**: Trained with strong reasoning over source code and security-sensitive patterns.
- **Fast responses**: `gemini-flash-1.5b` is lightweight yet powerful, ensuring reviews return quickly enough to be used in real-time CI/CD pipelines.
- **Tooling support**: Works seamlessly with structured prompts and enforced JSON schemas, critical for generating reliable inline comments.
- **Scalability**: Handles multi-language input (Python, JS, Java, etc.) and is extensible to new languages.


Together, this stack balances **developer velocity**, **scalability**, and **AI power**, making it the best choice for building an AI-powered code review system that integrates tightly with modern development workflows.

---

## 🔐 Environment variables

```env

#For Backend
PORT=8000
GITHUB_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-1.5-flash
SHEET_ID=your_sheet_id
GOOGLE_PROJECT_ID=your_gcp_project_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_gcp_client_email


#For Frontend
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret

```

---

## 📥 Installation & Setup

```bash
# Clone repo
git clone https://github.com/GirmadaShaw/Code-Review-Agent.git
cd Code-Review-Agent

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Run backend
cd backend
npm run build ; npm start ;

# Run frontend
cd ../frontend
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)
Backend: [http://localhost:8000](http://localhost:8000)

---

## 📥 Utilities

* **Upload a code file** for review.
* **Write code in the editor** and get live AI feedback.

---

## 📜 License

MIT License.


