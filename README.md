# AI-Powered Interview Preparation Assistant

A full-stack web app that takes your resume (PDF), a self-description and a job description, and generates a personalised interview preparation report using the Google Gemini API: match score, technical and behavioural questions with model answers, skill gaps, and a day-wise preparation plan.

## Tech stack
- **Frontend:** React 19, Vite, React Router, Axios, SCSS
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT (cookies), bcrypt, Multer, pdf-parse, Puppeteer
- **AI:** Google Gemini (`@google/genai`) with a Zod-based response schema

## Features
- Register / login / logout (JWT cookie + token blacklist)
- Upload resume PDF + job description + self-description
- Structured AI report: match score, questions, skill gaps, road map
- Saved reports per user
- Job-tailored resume PDF export

## Run locally

### 1. Backend (port 3000)
```bash
cd Backend
npm install
cp .env.example .env     # then fill in your own values
node server.js
```

### 2. Frontend (port 5173)
```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment variables (`Backend/.env`)
| Name | Description |
|------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |

## Author
Suhani Kuchhal