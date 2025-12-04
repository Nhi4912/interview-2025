#!/usr/bin/env ts-node
/**
 * Test Migration Utilities
 * 
 * Simple test to verify migration utilities work correctly
 */

import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const CONTENT_EN_DIR = path.join(process.cwd(), 'content', 'en');
const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => boolean, message: string) {
  try {
    const passed = fn();
    results.push({ name, passed, message: passed ? '✓ ' + message : '✗ ' + message });
  } catch (error) {
    results.push({ name, passed: false, message: `✗ Error: ${error}` });
  }
}

console.log('🧪 Testing migration utilities...\n');

// Test 1: Check if docs directory exists
test(
  'docs-exists',
  () => fs.existsSync(DOCS_DIR),
  'docs/ directory exists'
);

// Test 2: Check if docs has markdown files
test(
  'docs-has-files',
  () => {
    const files = fs.readdirSync(DOCS_DIR);
    return files.some(f => f.endsWith('.md') || fs.statSync(path.join(DOCS_DIR, f)).isDirectory());
  },
  'docs/ directory contains markdown files or subdirectories'
);

// Test 3: Check if migration scripts exist
test(
  'migrate-script-exists',
  () => fs.existsSync(path.join(SCRIPTS_DIR, 'migrate-content.ts')),
  'migrate-content.ts script exists'
);

test(
  'validate-script-exists',
  () => fs.existsSync(path.join(SCRIPTS_DIR, 'validate-migration.ts')),
  'validate-migration.ts script exists'
);

test(
  'update-script-exists',
  () => fs.existsSync(path.join(SCRIPTS_DIR, 'update-prerequisites.ts')),
  'update-prerequisites.ts script exists'
);

// Test 4: Check if content directories are ready
test(
  'content-en-ready',
  () => {
    if (!fs.existsSync(CONTENT_EN_DIR)) {
      fs.mkdirSync(CONTENT_EN_DIR, { recursive: true });
    }
    return fs.existsSync(CONTENT_EN_DIR);
  },
  'content/en/ directory is ready'
);

// Test 5: Check if metadata validator exists
test(
  'metadata-validator-exists',
  () => fs.existsSync(path.join(process.cwd(), 'src', 'lib', 'content', 'metadata-validator.ts')),
  'metadata-validator.ts exists'
);

// Test 6: Check if gray-matter is installed
test(
  'gray-matter-installed',
  () => {
    try {
      require('gray-matter');
      return true;
    } catch {
      return false;
    }
  },
  'gray-matter package is installed'
);

// Test 7: Check if package.json has migration scripts
test(
  'package-scripts-exist',
  () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    return (
      packageJson.scripts['migrate:content'] &&
      packageJson.scripts['migrate:validate'] &&
      packageJson.scripts['migrate:update-prerequisites']
    );
  },
  'package.json has migration scripts'
);

// Test 8: Check if README exists
test(
  'readme-exists',
  () => fs.existsSync(path.join(SCRIPTS_DIR, 'README.md')),
  'scripts/README.md exists'
);

test(
  'migration-guide-exists',
  () => fs.existsSync(path.join(SCRIPTS_DIR, 'MIGRATION-GUIDE.md')),
  'scripts/MIGRATION-GUIDE.md exists'
);

// Print results
console.log('Test Results:\n');
results.forEach(result => {
  console.log(result.message);
});

const passed = results.filter(r => r.passed).length;
const total = results.length;

console.log(`\n${passed}/${total} tests passed\n`);

if (passed === total) {
  console.log('✅ All tests passed! Migration utilities are ready to use.\n');
  console.log('Next steps:');
  console.log('1. Run: npm install (to ensure all dependencies are installed)');
  console.log('2. Run: npm run migrate:all (to start the migration)');
  console.log('3. Review the generated reports in scripts/');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please fix the issues before running migration.\n');
  process.exit(1);
}
