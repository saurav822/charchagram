/**
 * Language detection utilities.
 *
 * CharchaGram supports multilingual content — primarily Hindi (Devanagari)
 * and English.  These helpers are used to adapt UI rendering (e.g. font
 * size, direction, spell-check) based on the detected script.
 */

/** Unicode range for Devanagari script: U+0900 – U+097F */
const DEVANAGARI_RANGE = /[\u0900-\u097F]/;

/**
 * Returns true if the text contains at least one Devanagari character.
 *
 * @param text - Any string to test
 */
export function isDevanagariText(text: string): boolean {
  return DEVANAGARI_RANGE.test(text);
}

/**
 * Returns true if the text contains at least one ASCII letter (a–z, A–Z).
 *
 * @param text - Any string to test
 */
export function isEnglishText(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}
