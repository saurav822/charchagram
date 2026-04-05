/**
 * Platform-wide constants shared between frontend and backend.
 *
 * Values here are intentionally non-secret (no keys, no URIs).
 * Secrets live exclusively in environment variables.
 */

// ── Bihar geography ───────────────────────────────────────────────────────────

/**
 * MongoDB ObjectId for the Bihar state document.
 * Used to scope constituency queries to Bihar across the application.
 */
export const BIHAR_STATE_ID = '68add9ef615f3037710afc91' as const;

// ── User profile enums ────────────────────────────────────────────────────────

/**
 * Age bracket options for user registration.
 *
 * Values MUST match the Mongoose UserSchema enum exactly:
 *   ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
 * Mismatches cause silent Mongoose validation failures on user update.
 */
export const AGE_GROUP_OPTIONS = [
  { value: '18-25', label: '18-25' },
  { value: '26-35', label: '26-35' },
  { value: '36-45', label: '36-45' },
  { value: '46-55', label: '46-55' },
  { value: '56-65', label: '56-65' },
  { value: '65+', label: '65+' },
] as const;

/** Union type derived from the options array — use for TypeScript type checking. */
export type AgeBracket = (typeof AGE_GROUP_OPTIONS)[number]['value'];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'पुरुष' },
  { value: 'female', label: 'महिला' },
  { value: 'other', label: 'अन्य' },
  { value: 'prefer not to say', label: 'प्राथमिकता नहीं' },
] as const;

// ── Pagination defaults ───────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 10 as const;
export const MAX_PAGE_SIZE = 100 as const;

// ── Content limits ────────────────────────────────────────────────────────────

export const MAX_TITLE_LENGTH = 200 as const;
export const MAX_NAME_LENGTH = 100 as const;
export const MIN_PHONE_LENGTH = 10 as const;
export const MAX_PHONE_LENGTH = 15 as const;
