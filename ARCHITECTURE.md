# Architecture Decision Record — CharchaGram

This document explains the *why* behind key architectural decisions.  It is
meant to be read alongside the code, not instead of it.

---

## 1. Monorepo with npm Workspaces

**Decision:** Single repository, three npm workspaces (`apps/frontend`,
`apps/backend`, `packages/shared`).

**Rationale:**

- The frontend and backend share a large surface area of types (User, Post,
  Blog, Constituency).  A monorepo eliminates type drift — when the API
  response shape changes, TypeScript surfaces the breakage immediately in the
  frontend.
- `npm workspaces` requires no additional tooling (no Turborepo, no Nx) while
  still enabling shared `node_modules` hoisting and workspace cross-references.
- A single `npm run dev` command makes onboarding frictionless.

**Trade-off:** Larger single clone.  Mitigated by the `.gitignore` which
excludes `node_modules`, build artefacts, and large data files.

---

## 2. Separate Frontend and Backend Runtimes

**Decision:** Next.js PWA and Express server are separate processes, not a
Next.js API routes setup.

**Rationale:**

- The backend serves multiple clients (web, potential mobile app).  Embedding
  it inside Next.js API routes would couple deployment to Vercel.
- The backend is deployed to Google Cloud Run (stateless containers); the
  frontend to Vercel (edge CDN).  Separate deployments allow independent
  scaling.
- Express gives full control over middleware order, CORS policy, and JWT
  cookie configuration — features that are awkward in Next.js API routes.

---

## 3. JWT in HTTP-only Cookies + Bearer Header Fallback

**Decision:** The login endpoint sets `jwtToken` as an HTTP-only cookie.
The `AxiosConfig` component also stores the token in `localStorage` and sends
it as a `Bearer` header on every request.

**Rationale:**

- HTTP-only cookies protect against XSS token theft in browser contexts.
- The Bearer header fallback supports non-browser clients (Postman, scripts)
  and the case where cookies are blocked by browser privacy settings.
- `sameSite: 'none'` + `secure: true` is required for cross-origin cookies
  (frontend on Vercel, backend on Cloud Run) in production.

**Security note:** The `localStorage` copy is less secure than the cookie.
A future improvement would remove the `localStorage` path and rely solely on
the HTTP-only cookie.

---

## 4. Constituency as the Primary Scope

**Decision:** Every Post is anchored to a Constituency.  Users also belong to
a Constituency.  Most API queries are constituency-scoped.

**Rationale:**

- Bihar has 243 assembly constituencies.  Scoping content geographically
  ensures citizens see relevant local issues, not a national firehose.
- MongoDB compound indexes on `(constituency, createdAt)` make constituency-
  scoped feed queries fast even at scale.

---

## 5. Zod Validation on the Backend

**Decision:** Backend request bodies are validated with Zod schemas before
touching the database.

**Rationale:**

- Express doesn't validate request bodies by default.  Without Zod, a missing
  `name` field on `/api/users/create` would produce a cryptic Mongoose error
  rather than a structured 400 response.
- Zod schemas double as documentation: the shape of `createUserSchema` in
  `server.js` is the canonical contract for POST `/api/users/create`.
- `zod` is already a dependency — no additional tooling required.

---

## 6. Shared Types in `packages/shared`

**Decision:** All types that cross the HTTP boundary live in
`@charchagram/shared`, not duplicated in each app.

**Rationale:**

- The original codebase had `src/types/` in the frontend and implicit JS
  objects on the backend.  Any field rename required manual updates in two
  places, with no compile-time check.
- Moving types to a shared package means a backend model change that affects
  the API response will fail the frontend TypeScript build immediately.
- The shared package also houses pure utilities (`timeAgo`, `isDevanagariText`)
  that were previously copied between apps.

---

## 7. Progressive Web App (PWA)

**Decision:** The frontend is a PWA with a service worker and manifest.

**Rationale:**

- A significant portion of India's internet users access the web via low-end
  Android devices on mobile data.  A PWA provides an installable, offline-
  capable experience without requiring an app store.
- The service worker caches static assets so repeat visits are fast even on
  poor connectivity.

---

## 8. Morgan HTTP Logging + Centralised Error Handler

**Decision:** `morgan('combined')` logs all requests; a global error handler
middleware formats all unhandled errors.

**Rationale:**

- Consistent log format (Apache Combined Log) is parseable by log aggregators
  (Datadog, Cloud Logging) without custom parsers.
- Centralised error handling ensures Mongoose validation errors and duplicate-
  key errors always produce a structured JSON response, never an unhandled
  exception that crashes the process.

---

## 9. Hardcoded Credentials Removed

**Decision:** All secrets (MongoDB URI, JWT secret, API keys) are loaded
exclusively from environment variables.  No fallback to hardcoded values.

**Rationale:**

- The original codebase had a MongoDB Atlas connection string with credentials
  hardcoded in `src/config/db.js`.  This is a critical security vulnerability:
  any public GitHub push would expose the credentials.
- Failing loudly at startup (`process.exit(1)`) when `MONGO_URI` is absent is
  safer than silently failing later when the first DB query arrives.

---

## 10. Data Backup via S3 / DigitalOcean Spaces

**Decision:** The `src/dataBackup/` module uses the AWS SDK to dump MongoDB
data to object storage on a scheduled basis.

**Rationale:**

- MongoDB Atlas free-tier provides limited backup retention.  Exporting to S3-
  compatible storage (DigitalOcean Spaces) provides an independent, cheap
  backup without additional managed services.
- The backup script is invoked manually or via a cron job (`npm run backup`),
  keeping it out of the hot request path.
