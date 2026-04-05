/**
 * @module utils/user
 *
 * User-related utility functions for the CharchaGram backend.
 */

/**
 * Generates an anonymous but unique-looking display name for new citizens.
 *
 * Format: "नागरिक" + 4-digit numeric salt (e.g. "नागरिक4271").
 *
 * The base word "नागरिक" means "citizen" in Hindi — appropriate for the
 * platform's focus on civic participation.  The 4-digit salt (1000–9999)
 * gives a 9000-value space, which is sufficient to avoid collisions during
 * initial registration; the database unique index on `name` catches the
 * rare duplicate.
 *
 * @returns {string} An anonymous display name like "नागरिक4271"
 */
export function randomNameGenerator() {
  const baseName = 'नागरिक';
  const salt = Math.floor(1000 + Math.random() * 9000).toString();
  return `${baseName}${salt}`;
}
