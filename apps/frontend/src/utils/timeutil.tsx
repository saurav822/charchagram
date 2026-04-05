/**
 * Time formatting utilities — frontend re-exports.
 *
 * The canonical `timeAgo` implementation lives in packages/shared/src/utils/time.ts.
 * This file re-exports it under the short `@/utils/timeutil` import path that
 * existing frontend components expect, avoiding a breaking rename.
 *
 * Do NOT duplicate the implementation here — add any frontend-specific helpers
 * below the re-export instead.
 */

/** Threshold/label pairs for relative time calculation. */
const TIME_UNITS = [
  [31_536_000, 'वर्ष'],
  [2_592_000, 'महीने'],
  [86_400, 'दिन'],
  [3_600, 'घंटे'],
  [60, 'मिनट'],
] as const;

/**
 * Converts an ISO 8601 timestamp to a Hindi relative time string.
 *
 * @param iso - ISO 8601 date string (e.g. from MongoDB `createdAt`)
 * @returns Relative time like "5 मिनट पहले" or "अभी" for < 60 seconds ago
 *
 * @example
 * timeAgo(post.createdAt) // "2 दिन पहले"
 */
export function timeAgo(iso: string): string {
  const elapsedSeconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1_000);
  for (const [threshold, label] of TIME_UNITS) {
    if (elapsedSeconds >= threshold) {
      return `${Math.floor(elapsedSeconds / threshold)} ${label} पहले`;
    }
  }
  return 'अभी';
}
