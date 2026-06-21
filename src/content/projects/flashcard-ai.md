---
title: "AI Learning Assistant (Flash-Card)"
subtitle: "Full-stack MERN application that transforms PDFs into interactive study experiences with AI chat, auto-generated flashcards, quizzes, summaries, and progress tracking."
image: "/img/Flashcard_pic.png"
tags: ["MongoDB", "Express", "React", "Node.js", "JWT Auth", "Google Gemini API", "REST API", "Tailwind CSS", "AI Integration", "Full-Stack"]
topics: ["AI / ML", "Full-Stack / Web"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Flash-Card"
---

A full-stack learning assistant that turns PDFs into interactive study material — **AI chat**, **summaries**, **concept explanations**, **auto-generated flashcards**, and **quizzes with results analytics** — all in one application.

Built to demonstrate end-to-end product development: authentication, file handling, REST API design, database modeling, AI integration, and a production-quality frontend.

## Key Features

### Document management
- Upload and manage PDF study documents (metadata + file size tracking)
- Embedded in-app PDF viewer for reading while studying

### AI Study Tools (Google Gemini API)
- Context-aware chat about document content — ask questions, get explanations
- One-click document summaries
- Topic/concept explainer that extracts and clarifies ideas from the uploaded document

### Flashcards
- Auto-generated flashcard sets from document content using Gemini
- Review tracking (last reviewed timestamp + review count per card)
- Star/favourite system for cards you want to return to
- Flip-card UX with a dedicated flashcards review page

### Quizzes
- Generate multiple-choice quizzes with configurable number of questions
- Progress UI with navigation between questions
- Detailed results view: score breakdown, correct answers, and AI-generated explanations

### Auth & Profile
- JWT-based authentication (register/login with protected routes)
- All data scoped to user ID on the backend — no cross-user access

## Tech Stack

**Frontend:** React + React Router, Tailwind CSS, Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js + Express, MongoDB + Mongoose, JWT Auth, Multer (file uploads), Google Gemini API

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/documents` | List documents |
| POST | `/api/documents/upload` | Upload PDF |
| GET | `/api/flashcards/:documentId` | Flashcards for document |
| POST | `/api/ai/chat` | Ask questions about document |
| POST | `/api/ai/summary` | Generate summary |
| POST | `/api/ai/flashcards` | Auto-generate flashcard set |
| POST | `/api/ai/quiz` | Generate quiz |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers |
| GET | `/api/quizzes/:id/results` | Detailed quiz results |

## What this project demonstrates
- Full-stack MERN with real product-level features
- Database modeling: documents, quizzes, flashcards, user progress as separate collections
- REST API design with protected endpoints and proper HTTP semantics
- File upload pipeline: Multer → disk storage → PDF content extraction
- AI feature integration with structured prompts, streaming, and UI flows tied to the response
- Responsive component-based frontend architecture with loading/error states
