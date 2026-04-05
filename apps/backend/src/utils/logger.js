/**
 * @module logger
 *
 * Lightweight structured logger for the CharchaGram backend.
 *
 * Wraps console.* so that:
 *  - Every log line carries a UTC timestamp and severity label.
 *  - The call-site module can be identified via the `context` prefix.
 *  - In production, debug-level logs are suppressed.
 *  - It is trivial to swap this for a full logging library (Winston, Pino)
 *    in the future — callers only need to update this one file.
 *
 * Usage:
 *   import { createLogger } from '../utils/logger.js';
 *   const log = createLogger('user-route');
 *   log.info('User created', { userId: '...' });
 *   log.error('DB write failed', err);
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Formats a log entry as a single-line string.
 *
 * @param {'DEBUG'|'INFO'|'WARN'|'ERROR'} level
 * @param {string} context - Module/file identifier (e.g. 'user-route')
 * @param {string} message - Human-readable log message
 * @returns {string}
 */
function formatPrefix(level, context) {
  const ts = new Date().toISOString();
  return `[${ts}] [${level}] [${context}]`;
}

/**
 * Creates a context-scoped logger instance.
 *
 * @param {string} context - Label identifying the calling module (e.g. 'auth', 'post-route')
 * @returns {{ debug: Function, info: Function, warn: Function, error: Function }}
 */
export function createLogger(context) {
  return {
    /**
     * Debug-level log — suppressed in production.
     * @param {string} message
     * @param {...unknown} args
     */
    debug(message, ...args) {
      if (!IS_PRODUCTION) {
        console.debug(formatPrefix('DEBUG', context), message, ...args);
      }
    },

    /**
     * Informational log.
     * @param {string} message
     * @param {...unknown} args
     */
    info(message, ...args) {
      console.info(formatPrefix('INFO', context), message, ...args);
    },

    /**
     * Warning — non-fatal unexpected condition.
     * @param {string} message
     * @param {...unknown} args
     */
    warn(message, ...args) {
      console.warn(formatPrefix('WARN', context), message, ...args);
    },

    /**
     * Error — always logged, includes Error stack when provided.
     * @param {string} message
     * @param {unknown} [err] - Optional Error object
     * @param {...unknown} args
     */
    error(message, err, ...args) {
      const errMessage = err instanceof Error ? err.message : err;
      console.error(formatPrefix('ERROR', context), message, errMessage, ...args);
    },
  };
}

/** Pre-built logger for code that runs at module scope (no specific context). */
export const rootLogger = createLogger('app');
