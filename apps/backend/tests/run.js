/**
 * Simple test runner that executes all *.test.js files in tests/unit/.
 *
 * Uses Node.js built-in test infrastructure (no external dependencies).
 * Each test file must exit with code 1 if any assertions fail.
 *
 * Usage: node tests/run.js
 */

import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const unitDir = join(__dirname, 'unit');

const testFiles = readdirSync(unitDir)
  .filter((f) => f.endsWith('.test.js'))
  .map((f) => join(unitDir, f));

let allPassed = true;

for (const file of testFiles) {
  const result = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (result.status !== 0) {
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n[test runner] Some tests failed.\n');
  process.exit(1);
} else {
  console.log('\n[test runner] All tests passed.\n');
}
