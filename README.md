# Portfolio Chatbot

An AI-powered portfolio assistant that helps recruiters explore my professional background through natural conversations.

Instead of browsing through a resume, recruiters can directly ask questions about my skills, projects, education, and experience.

Live Link : https://portfolio-chatbot-alpha.vercel.app/
### Features
- AI-powered resume-based conversations.
- Supports multiple PDF resumes.
- Streaming AI responses.
- Chat history and stop generation.
- Resume parsing with caching.
- ChatGPT-inspired user interface.

### Tech Stack
- **Frontend:** React.js, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI
- **AI:** Groq API
- **Tools:** Git, GitHub, Uvicorn, PyPDF

### Project Structure
```text
portfolio-chatbot/
├── backend/
│   ├── data/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Getting Started

**1. Clone the repository**
```bash
git clone <your-repository-url>
cd portfolio-chatbot
```

**2. Setup Backend**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_api_key
```

Start the backend:
```bash
python -m uvicorn main:app --reload --port 8000
```

**3. Setup Frontend**

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### How It Works
1. Reads and extracts information from resume PDFs.
2. Builds a structured professional profile using Groq.
3. Caches the extracted profile.
4. Answers recruiter questions using the available resume information.
5. Streams responses directly to the frontend.

**Built with React, FastAPI and Groq.**
