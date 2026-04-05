# CharchaGram

> **Where Local Voices Become Public Record** — a civic-tech platform that transforms citizen conversations into structured accountability, one constituency at a time.

**Live:** [www.charchagram.com](https://www.charchagram.com)

[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-orange?logo=anthropic)](https://claude.ai)
[![Powered by Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org)
[![Backend: Express](https://img.shields.io/badge/Backend-Express%204-green?logo=express)](https://expressjs.com)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![CI](https://github.com/saurav822/charchagram/actions/workflows/ci.yml/badge.svg)](https://github.com/saurav822/charchagram/actions)

---

## Table of Contents

1. [What is CharchaGram?](#what-is-charchagram)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Monorepo Structure](#monorepo-structure)
5. [Quick Start](#quick-start)
6. [Environment Variables](#environment-variables)
7. [Available Commands](#available-commands)
8. [API Overview](#api-overview)
9. [Contributing](#contributing)

---

## What is CharchaGram?

Every constituency has a story — roads that don't get repaired, hospitals that run out of medicine, schools without teachers. Most of the time, these stories stay within the neighbourhood, fade into frustration, and disappear without a trace.

**CharchaGram** changes that.

It is a **multilingual civic accountability platform** that gives citizens a structured, digital space to raise local concerns, discuss community issues, and hold elected representatives accountable — all anchored to their specific constituency so that every voice lands exactly where it matters.

### How it works

- **Post a concern** — residents share ground-level issues tied directly to their constituency, visible to neighbours, journalists, and decision-makers alike
- **Follow the conversation** — threaded comments let communities discuss, debate, and build collective narratives around local problems
- **Vote in polls** — quick opinion polls surface real-time community sentiment on decisions that affect daily life
- **Read the blogs** — long-form pieces from citizen journalists and community writers give depth and context to the numbers
- **Know your representative** — each constituency page surfaces the sitting member's background, vote share, experience, and department-wise work record so citizens can judge performance with facts, not rumour
- **Go beyond the ward** — a unified feed lets anyone read what's being discussed across all constituencies, turning local grievances into a wider public conversation

### Why it matters

Democracy works best when citizens are informed and heard. CharchaGram is built on the belief that the gap between a citizen's complaint and a representative's action can be closed — not by shouting louder, but by building a permanent, searchable, shareable public record of what was said, when, and by whom.

It is designed from the ground up for **low-bandwidth mobile users**, with a PWA that works on entry-level Android devices and Hindi-first UI that puts the language of the people front and centre.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser / PWA                            │
│               Next.js 15 (App Router, SSR + CSR)                 │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  React UI    │  │  Recoil     │  │  Axios (JWT Bearer +    │  │
│  │  Tailwind v4 │  │  State      │  │  HTTP-only cookie auth) │  │
│  └──────────────┘  └─────────────┘  └────────────┬────────────┘  │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │ HTTPS / REST
┌───────────────────────────────────────────────────▼──────────────┐
│                     Express 4 API Server                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Routes  │  │  Auth    │  │  Zod         │  │  Swagger    │  │
│  │  (REST)  │  │  (JWT)   │  │  Validation  │  │  /api-docs  │  │
│  └────┬─────┘  └──────────┘  └──────────────┘  └─────────────┘  │
│       │  Mongoose ODM                                             │
│  ┌────▼──────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas — Models: User, Post, Comment, Blog,       │   │
│  │                          Category, Constituency            │   │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

            ┌────────────────────────────────────┐
            │       @charchagram/shared           │
            │  Canonical TypeScript types +       │
            │  utils consumed by both apps        │
            └────────────────────────────────────┘
```

**Request flow:** Browser → Next.js (SSR/CSR) → Axios → Express → Mongoose → MongoDB Atlas

**Authentication:** Phone number + MSG91 OTP → JWT stored as HTTP-only cookie + `localStorage` fallback for Bearer auth.

---

## Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Frontend     | Next.js 15 (App Router), React 19, TypeScript |
| Styling      | Tailwind CSS v4                              |
| State        | Recoil (atoms), React Context                |
| HTTP Client  | Axios (interceptors for JWT injection)       |
| Backend      | Node.js 20 ESM, Express 4                   |
| Database     | MongoDB Atlas via Mongoose 8                 |
| Auth         | JWT (jsonwebtoken), HTTP-only cookies        |
| Validation   | Zod (backend), TypeScript strict (frontend)  |
| Docs         | Swagger / OpenAPI 3 (`/api-docs`)            |
| Security     | Helmet, CORS, cookie-parser, rate limiting   |
| Monorepo     | npm workspaces + concurrently                |
| CI           | GitHub Actions (lint → typecheck → test → build) |

---

## Monorepo Structure

```
charchagram/
├── apps/
│   ├── frontend/          # Next.js 15 PWA
│   │   ├── src/app/       # App Router pages
│   │   ├── src/components/
│   │   ├── src/contexts/
│   │   ├── src/types/     # Local types (extending @charchagram/shared)
│   │   └── src/utils/
│   └── backend/           # Express REST API
│       ├── src/config/    # DB connection, Swagger
│       ├── src/middleware/ # JWT auth
│       ├── src/models/    # Mongoose schemas
│       ├── src/routes/    # REST handlers
│       ├── src/utils/
│       └── tests/         # Unit tests (no DB required)
├── packages/
│   └── shared/            # @charchagram/shared — canonical types + utils
│       └── src/
│           ├── types/     # User, Post, Blog, Category, Constituency
│           ├── utils/     # timeAgo, language detection
│           └── constants.ts
├── .env.example           # Root env template
├── .github/workflows/ci.yml
├── eslint.config.mjs
├── .prettierrc
├── Makefile
└── package.json           # npm workspace root
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A MongoDB Atlas cluster (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/saurav822/charchagram.git
cd charchagram
npm install          # installs all workspaces
```

### 2. Configure environment

```bash
cp .env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
# Edit both files — at minimum set MONGO_URI and JWT_SECRET
```

### 3. Start both apps concurrently

```bash
npm run dev
# Frontend → http://localhost:3001
# Backend  → http://localhost:3000
# API docs → http://localhost:3000/api-docs
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full annotated list.

**Minimum required for local dev:**

| Variable             | Where            | Description                     |
|----------------------|------------------|---------------------------------|
| `MONGO_URI`          | `apps/backend`   | MongoDB Atlas connection string |
| `JWT_SECRET`         | `apps/backend`   | JWT signing secret (≥64 chars)  |
| `NEXT_PUBLIC_API_URL`| `apps/frontend`  | Backend base URL                |

---

## Available Commands

```bash
npm run dev          # Start both apps in watch mode
npm run build        # Production build (frontend)
npm run test         # Run all unit tests
npm run lint         # ESLint (frontend)
npm run typecheck    # TypeScript type check

# Or using Make
make dev
make test
make clean
```

---

## API Overview

| Method | Path                              | Auth | Description                    |
|--------|-----------------------------------|------|--------------------------------|
| `GET`  | `/health`                         | —    | Health check                   |
| `POST` | `/login`                          | —    | Phone login → JWT cookie       |
| `POST` | `/api/verify-otp`                 | —    | MSG91 OTP verification         |
| `POST` | `/api/auth/logout`                | —    | Clear JWT cookie               |
| `GET`  | `/api/auth/ping`                  | JWT  | Verify token                   |
| `GET`  | `/api/constituencies`             | —    | List constituencies            |
| `GET`  | `/api/posts`                      | —    | Paginated posts (by constituency)|
| `POST` | `/api/posts`                      | JWT  | Create post                    |
| `GET`  | `/api/blogs`                      | —    | Paginated blogs                |
| `POST` | `/api/blogs`                      | JWT  | Create blog                    |
| `GET`  | `/api/users/:id`                  | JWT  | Get user profile               |
| `GET`  | `/api-docs`                       | —    | Swagger interactive docs       |

Full documentation at `/api-docs` when the backend is running.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Run `make test` before pushing
4. Open a PR against `develop`

---

*Built with ❤️ and [Claude AI](https://claude.ai) for citizens who believe local conversations deserve a permanent stage.*
