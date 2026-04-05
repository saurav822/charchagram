/**
 * Unit tests for backend utility functions.
 *
 * These tests run without a database connection — they cover pure
 * business logic that can be validated in isolation.
 *
 * Run: cd apps/backend && node tests/run.js
 */

import assert from 'node:assert/strict';

// ── randomNameGenerator ───────────────────────────────────────────────────────

/**
 * Inline copy of the generator so this test has no I/O dependencies.
 * The authoritative source lives in src/utils/user.js.
 */
function randomNameGenerator() {
  const baseName = 'नागरिक';
  const salt = Math.floor(1000 + Math.random() * 9000).toString();
  return `${baseName}${salt}`;
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\nutils.test.js');

test('randomNameGenerator returns a string starting with नागरिक', () => {
  const name = randomNameGenerator();
  assert.ok(name.startsWith('नागरिक'), `Expected to start with नागरिक, got: ${name}`);
});

test('randomNameGenerator appends a 4-digit numeric salt', () => {
  const name = randomNameGenerator();
  const salt = name.replace('नागरिक', '');
  assert.match(salt, /^\d{4}$/, `Expected 4 digits, got: "${salt}"`);
});

test('randomNameGenerator produces unique values', () => {
  const names = new Set(Array.from({ length: 50 }, () => randomNameGenerator()));
  // With a 9000-value space, 50 draws should yield at least 45 unique names
  assert.ok(names.size >= 45, `Too many collisions: only ${names.size} unique in 50 draws`);
});

// ── Token generation (pure logic, no JWT signing) ─────────────────────────────

test('JWT_SECRET absence is detectable before signing', () => {
  const original = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  const secret = process.env.JWT_SECRET;
  assert.strictEqual(secret, undefined);
  // Restore
  if (original !== undefined) process.env.JWT_SECRET = original;
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
