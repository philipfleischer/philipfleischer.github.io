---
title: "MERN Notes App"
subtitle: "Full-stack MERN notes application with clean REST API design, rate limiting, security hardening, and a modern responsive UI — deployed on Render."
image: "/img/Notes_preview.png"
tags: ["MERN", "React", "Node.js", "Express", "MongoDB", "REST API", "Rate Limiting", "Render", "Tailwind", "TypeScript"]
topics: ["Full-Stack / Web"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/Notes-Full_Stack"
  - label: "Live Demo"
    url: "https://notes-full-stack-w3s5.onrender.com/"
---

A production-ready full-stack notes application built to demonstrate real-world backend engineering and REST API best practices — not just "make it work," but make it work *correctly*.

## What makes this different from a tutorial project

The focus was on getting the HTTP semantics right: correct status codes, predictable endpoint structure, proper error handling, input validation, and rate limiting that actually protects the API. These are details that get skipped in most beginner tutorials.

## Features

### Backend (Node.js + Express)
- **RESTful API** with resource-oriented design (`/api/notes`, `/api/notes/:id`)
- **Full CRUD** — GET, POST, PUT, DELETE with proper HTTP verb semantics
- **HTTP status codes** — 200, 201, 400, 404, 429, 500 used correctly (not just `200` for everything)
- **Rate limiting** via `express-rate-limit` — IP-based throttle, HTTP 429 on abuse
- Input validation and structured error responses
- MongoDB + Mongoose: flexible schema, Mongoose validation

### Frontend (React)
- Component-based architecture with clear separation of concerns
- Service layer for API calls (not raw fetch scattered through components)
- Responsive, mobile-first design
- User-friendly CRUD: create, view, edit, delete notes with optimistic UI

## API Design

| Method | Endpoint | Status codes |
|--------|----------|-------------|
| GET | `/api/notes` | 200 |
| GET | `/api/notes/:id` | 200, 404 |
| POST | `/api/notes` | 201, 400 |
| PUT | `/api/notes/:id` | 200, 400, 404 |
| DELETE | `/api/notes/:id` | 200, 404 |

## Deployment

- Deployed on **Render** (backend) and **Render** (frontend static)
- MongoDB Atlas for database hosting
- Environment-based configuration — no secrets in code

## What this demonstrates
Understanding that a working API and a *good* API are different things. Rate limiting, proper HTTP semantics, structured error responses, and environment-based config are not optional in production — this project treats them as required.
