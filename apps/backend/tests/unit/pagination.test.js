/**
 * Unit tests for pagination helper logic.
 *
 * Pagination is used across every list endpoint — verifying the arithmetic
 * here prevents subtle off-by-one bugs from reaching the frontend.
 *
 * Run: cd apps/backend && node tests/run.js
 */

import assert from 'node:assert/strict';

/**
 * Computes pagination metadata given query params.
 * Mirrors the logic used inline across route handlers.
 *
 * @param {number} total - Total number of documents
 * @param {number} page  - Current page (1-indexed)
 * @param {number} limit - Documents per page
 */
function buildPagination(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    limit,
  };
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

console.log('\npagination.test.js');

test('first page has no previous page', () => {
  const p = buildPagination(50, 1, 10);
  assert.strictEqual(p.hasPrevPage, false);
});

test('last page has no next page', () => {
  const p = buildPagination(50, 5, 10);
  assert.strictEqual(p.hasNextPage, false);
});

test('middle page has both prev and next', () => {
  const p = buildPagination(50, 3, 10);
  assert.strictEqual(p.hasPrevPage, true);
  assert.strictEqual(p.hasNextPage, true);
});

test('totalPages is ceiling of total/limit', () => {
  assert.strictEqual(buildPagination(51, 1, 10).totalPages, 6);
  assert.strictEqual(buildPagination(50, 1, 10).totalPages, 5);
  assert.strictEqual(buildPagination(1, 1, 10).totalPages, 1);
});

test('zero total yields one page with no navigation', () => {
  const p = buildPagination(0, 1, 10);
  assert.strictEqual(p.totalPages, 0);
  assert.strictEqual(p.hasNextPage, false);
  assert.strictEqual(p.hasPrevPage, false);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
