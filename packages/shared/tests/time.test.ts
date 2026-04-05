/**
 * Unit tests for the timeAgo utility.
 *
 * These tests use Node's assert module and can be run with ts-node or after
 * compiling with tsc.  They are intentionally dependency-free.
 */

import assert from 'node:assert/strict';
import { timeAgo } from '../src/utils/time';

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function isoAgo(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: unknown) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${(err as Error).message}`);
    failed++;
  }
}

console.log('\ntime.test.ts');

test('returns "अभी" for < 60 seconds ago', () => {
  assert.strictEqual(timeAgo(isoAgo(30 * SECOND)), 'अभी');
});

test('returns minutes for 5 minutes ago', () => {
  assert.strictEqual(timeAgo(isoAgo(5 * MINUTE)), '5 मिनट पहले');
});

test('returns hours for 3 hours ago', () => {
  assert.strictEqual(timeAgo(isoAgo(3 * HOUR)), '3 घंटे पहले');
});

test('returns days for 2 days ago', () => {
  assert.strictEqual(timeAgo(isoAgo(2 * DAY)), '2 दिन पहले');
});

test('returns months for 2 months ago', () => {
  assert.strictEqual(timeAgo(isoAgo(2 * MONTH)), '2 महीने पहले');
});

test('returns years for 2 years ago', () => {
  assert.strictEqual(timeAgo(isoAgo(2 * YEAR)), '2 वर्ष पहले');
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
