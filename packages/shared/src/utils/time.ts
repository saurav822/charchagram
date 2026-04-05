/**
 * Time formatting utilities.
 *
 * Uses Hindi units to match the platform's primary audience language (Hindi/Devanagari).
 * Returns relative time strings like "3 दिन पहले" (3 days ago).
 */

/** Unit tuples: [seconds_threshold, Hindi_label] */
const TIME_UNITS = [
  [31_536_000, 'वर्ष'],
  [2_592_000, 'महीने'],
  [86_400, 'दिन'],
  [3_600, 'घंटे'],
  [60, 'मिनट'],
] as const;

/**
 * Converts an ISO timestamp to a human-readable relative time string in Hindi.
 *
 * @param iso - ISO 8601 date string (e.g. from MongoDB `createdAt`)
 * @returns Relative time like "5 मिनट पहले", or "अभी" for < 60 seconds ago
 *
 * @example
 * timeAgo('2024-01-01T00:00:00Z') // "1 वर्ष पहले"
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
