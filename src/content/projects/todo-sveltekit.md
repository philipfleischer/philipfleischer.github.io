---
title: "Full-Stack Todo App"
subtitle: "Full-stack Todo application built with SvelteKit and PostgreSQL, featuring Prisma ORM, optimistic UI updates, and production deployment on Vercel with Neon serverless Postgres."
image: "/img/Todo-Preview.png"
tags: ["SvelteKit", "Svelte 5", "Vite", "PostgreSQL", "Prisma ORM", "Neon", "Vercel", "TypeScript", "Full-Stack"]
topics: ["Full-Stack / Web"]
featured: true
links:
  - label: "GitHub Repo"
    url: "https://github.com/philipfleischer/TODO"
  - label: "Live Demo"
    url: "https://todo-of7e.vercel.app/"
---

A modern full-stack Todo application — designed as a realistic deployment example using current tooling rather than a simple UI demo. The stack combines SvelteKit's server-side routing, Prisma's type-safe database access layer, and Neon's serverless PostgreSQL.

## What makes this interesting

SvelteKit collocates your UI and your API in the same project — `+page.server.ts` files run on the server and can directly query the database, no separate backend required. This is the same pattern used in large-scale production apps at companies that use SvelteKit.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Svelte 5 + SvelteKit |
| API layer | SvelteKit server routes |
| ORM | Prisma v7 |
| Database | PostgreSQL via Neon (serverless) |
| Deployment | Vercel (serverless functions) |

## Features
- **Full CRUD** for todos — create, read, update, delete with persistence
- **Optimistic UI updates** — UI responds instantly without waiting for the DB round trip
- Server-side database access via Prisma (no exposed credentials client-side)
- Production-ready Vercel deployment with automatic migrations on deploy

## Production deployment flow

```bash
prisma generate && prisma migrate deploy && npm run build
```

This single command generates the Prisma client, runs any pending migrations against Neon, and builds the Svelte app. Vercel runs this on every deployment.

## Why Prisma over raw SQL
Prisma generates TypeScript types from your schema automatically — so if you rename a column in `schema.prisma`, TypeScript catches every call site that breaks. For a solo developer maintaining a project over time, this removes an entire class of silent runtime errors.

## Architecture
```
src/
  lib/server/
    prisma.ts      ← singleton Prisma client
    todos.ts       ← all database access logic
  routes/
    +page.svelte   ← UI
    +page.ts       ← load function (data fetching)
    todos/[uid]/   ← REST-style API routes
prisma/
  schema.prisma    ← database schema
  migrations/      ← version-controlled migrations
```
