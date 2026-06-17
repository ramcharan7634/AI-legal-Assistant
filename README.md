<<<<<<< HEAD
# AI Legal Document Assistant

A full-stack AI-powered legal document assistant built with FastAPI and Next.js. This application provides legal risk analysis, document summarization, entity extraction, document generation, and a chat assistant.

## Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **AI Legal Risk Analyzer**: Analyze legal clauses for potential risks (Low/Medium/High)
- **PDF Upload & Analysis**: Upload PDF documents and get AI-powered analysis and summaries
- **Document Summarizer**: Generate concise summaries of legal documents
- **Entity Extraction**: Extract names, dates, money amounts, and organizations from legal text
- **Document Generator**: Generate Rental Agreements and NDAs
- **GenAI / LLM Chat Assistant**: Ask legal questions and get responses from a generative language model

## Tech Stack

### Backend
- FastAPI (Python 3.11)
- PostgreSQL (Render managed database)
- SQLAlchemy ORM
- Pydantic
- HuggingFace Transformers
- spaCy
- PyMuPDF
- JWT Authentication

### Frontend
- Next.js 14 (App Router)
- TailwindCSS
- Axios
- React Query
- Zustand (state management)

## Project Structure

```
ai-legal-assisstant/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── database/
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── risk_analysis.py
│   │   │   ├── document.py
│   │   │   └── chat_message.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── risk_analysis.py
│   │   │   ├── document.py
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   ├── risk_analyzer.py
│   │   │   ├── document_service.py
│   │   │   ├── summarizer.py
│   │   │   ├── entity_extractor.py
│   │   │   ├── document_generator.py
│   │   │   └── chat_assistant.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── risk.py
│   │   │   ├── document.py
│   │   │   ├── summarizer.py
│   │   │   ├── entities.py
│   │   │   ├── generator.py
│   │   │   └── chat.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   │   ├── risk/
│   │   │   ├── upload/
│   │   │   ├── summarize/
│   │   │   ├── entities/
│   │   │   ├── chat/
│   │   │   └── generator/
│   ├── components/
│   ├── lib/
│   ├── store/
│   └── package.json
│
└── README.md
```

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```
bash
cd backend
```

2. Create a virtual environment:
```
bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```
bash
# Create .env file
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/legal_assistant
SECRET_KEY=your-secret-key-here
```

5. Download spaCy model:
```
bash
python -m spacy download en_core_web_sm
```

6. Run the database migrations:
```
bash
alembic upgrade head
```

7. Start the backend server:
```
bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```
bash
cd frontend
```

2. Install dependencies:
```
bash
npm install
```

3. Set up environment variables:
```
bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```
bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

### Backend (Render)

1. Create a PostgreSQL database on Render
2. Push your code to GitHub
3. Create a new Web Service on Render
4. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: A secure random string
5. Set the build command: `pip install -r requirements.txt`
6. Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the project on Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
4. Deploy

## Usage

1. Register a new account at `/register`
2. Login at `/login`
3. Access the dashboard at `/dashboard`
4. Use the sidebar to navigate between features:
   - **Risk Analyzer**: Analyze legal clauses
   - **Upload PDF**: Upload and analyze documents
   - **Summarizer**: Generate document summaries
   - **Entity Extraction**: Extract legal entities
   - **Document Generator**: Create rental agreements or NDAs
   - **GenAI / LLM Chat Assistant**: Ask legal questions

## License

MIT
=======
# AI-legal-Assistant
>>>>>>> cd21245c45cfa544c544117ab4f27f503ad511e7
