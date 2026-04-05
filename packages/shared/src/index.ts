/**
 * @module @charchagram/shared
 *
 * Canonical source of truth for all types, interfaces, and constants shared
 * between the frontend (Next.js) and backend (Express) applications.
 *
 * Rule: if a shape crosses the HTTP boundary it belongs here — never
 * duplicated in individual app directories.
 */

// ── Domain entities ───────────────────────────────────────────────────────────
export * from './types/user';
export * from './types/constituency';
export * from './types/category';
export * from './types/post';
export * from './types/blog';

// ── Shared utilities ─────────────────────────────────────────────────────────
export * from './utils/time';
export * from './utils/language';

// ── Constants ─────────────────────────────────────────────────────────────────
export * from './constants';
