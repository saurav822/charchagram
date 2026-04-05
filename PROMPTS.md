# AI Prompts — CharchaGram Vibe Coding Log

This file documents the key AI prompts used during the development of
CharchaGram.  It serves as a transparency record of the vibe-coding process
and demonstrates authentic AI-assisted development.

---

## Initial Architecture & Planning

**Tool:** Claude (claude-sonnet-4-6)

> "I'm building a civic accountability platform for Bihar's constituencies. Users should be able to create constituency-scoped posts, comment on them, and vote in polls. Design a MongoDB schema and Express REST API structure for this."

*Outcome:* Generated the initial Mongoose schemas for `User`, `Post`,
`Comment`, `Category`, and `Constituency` with proper indexing on
`(constituency, createdAt)` for feed performance.

---

## Authentication System

**Tool:** Claude

> "Implement JWT authentication for an Express app where login is via phone number. The token should be stored as an HTTP-only cookie AND returned in the response body for Bearer header usage. Include refresh logic."

*Outcome:* `src/middleware/auth.js` — dual token resolution (cookie → Bearer fallback), `generateToken()` helper, and the `/login` endpoint in `server.js`.

---

## Next.js Axios Configuration

**Tool:** Claude

> "Create a React component that configures Axios defaults for a Next.js app. It should set the base URL from NEXT_PUBLIC_API_URL, add withCredentials, and inject a JWT from localStorage as a Bearer header on every request."

*Outcome:* `src/components/AxiosConfig.tsx` — runs as a useEffect in the root layout, zero render output.

---

## Constituency Context

**Tool:** Claude

> "Create a React Context that fetches the list of Bihar constituencies from the API on app load and makes it available throughout the component tree. Handle loading and error states."

*Outcome:* `src/contexts/ConstituencyContext.tsx` — provider wraps the entire app in `layout.tsx`.

---

## Monorepo Setup

**Tool:** Claude

> "Merge a Next.js 15 frontend and an Express 4 backend into a single npm workspaces monorepo. Extract shared TypeScript types into a @charchagram/shared package. Set up a single `npm run dev` command using concurrently. Add ESLint, Prettier, a Makefile, GitHub Actions CI, and unit tests."

*Outcome:* The current monorepo structure — `apps/frontend`, `apps/backend`, `packages/shared`, with 9 passing unit tests, CI pipeline, and this documentation.

---

## Security Hardening

**Tool:** Claude

> "Audit this Express server for security issues. The codebase has: a hardcoded MongoDB URI with credentials, verbose console.log statements printing JWT tokens, and a Firebase serviceAccountKey.json file. Fix all of these."

*Outcome:*
- Removed hardcoded MongoDB URI; `connectDB()` now exits if `MONGO_URI` is absent
- Removed all `console.log(secret)` and `console.log(token)` statements from `auth.js`
- `serviceAccountKey.json` excluded from the monorepo; added to `.gitignore`

---

## Shared Types Extraction

**Tool:** Claude

> "Extract all TypeScript interfaces from the Next.js frontend's src/types/ directory into a standalone @charchagram/shared package with proper JSDoc documentation. Include User, Post, Comment, Blog, Category, and Constituency types."

*Outcome:* `packages/shared/src/types/` — 5 type files with full JSDoc, no `any` types, proper import chains.

---

## Zod Validation

**Tool:** Claude

> "Add Zod validation to the Express backend's POST /api/users/create endpoint. Return structured 400 errors with field-level messages when validation fails."

*Outcome:* `createUserSchema` in `server.js` — validates `name`, `phoneNumber`, `email`, `ageBracket`, `gender` with descriptive error messages.

---

## Hindi Relative Time Utility

**Tool:** Claude

> "Write a TypeScript utility function that converts an ISO timestamp to a Hindi relative time string like '5 मिनट पहले' (5 minutes ago). Use a lookup table approach."

*Outcome:* `packages/shared/src/utils/time.ts` — `timeAgo()` with unit tests in `packages/shared/tests/time.test.ts`.

---

## PWA Manifest & Service Worker

**Tool:** Claude

> "Set up a Next.js 15 app as a Progressive Web App with a web manifest, service worker registration, and Apple touch icon support. Target low-bandwidth mobile users in India."

*Outcome:* `src/components/ServiceWorkerRegistration.tsx`, manifest in `public/manifest.json`, metadata in `layout.tsx`.

---

*This log was generated as part of the vibe coding competition entry for CharchaGram.*
