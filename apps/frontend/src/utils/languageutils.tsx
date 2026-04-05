/**
 * Script/language detection utilities.
 *
 * CharchaGram displays user-generated content in both Hindi (Devanagari)
 * and English.  These helpers let components adapt rendering — for example,
 * applying a larger font size for Devanagari characters, or enabling the
 * correct spell-checker language.
 *
 * The canonical implementations (with unit tests) live in
 * packages/shared/src/utils/language.ts.  This file is a thin wrapper that
 * adds the short `@/utils/languageutils` import path for frontend components.
 */

/** Unicode range for Devanagari script: U+0900 – U+097F */
const DEVANAGARI_RANGE = /[\u0900-\u097F]/;

/**
 * Returns `true` if the string contains at least one Devanagari character.
 *
 * Used to choose font rendering and text-align direction for post content.
 *
 * @param text - Any string to inspect
 *
 * @example
 * isDevanagariText('नमस्ते')    // true
 * isDevanagariText('Hello')     // false
 * isDevanagariText('Hello नमस्ते') // true
 */
export function isDevanagariText(text: string): boolean {
  return DEVANAGARI_RANGE.test(text);
}

/**
 * Returns `true` if the string contains at least one ASCII letter (a–z, A–Z).
 *
 * @param text - Any string to inspect
 *
 * @example
 * isEnglishText('Hello')     // true
 * isEnglishText('नमस्ते')    // false
 * isEnglishText('Hello 123') // true
 */
export function isEnglishText(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}
