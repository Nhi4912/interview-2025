#!/usr/bin/env ts-node

/**
 * Build search indices for all locales
 *
 * Usage:
 *   npm run build:search-index
 *   or
 *   ts-node scripts/build-search-index.ts
 */

import { searchIndexBuilder } from "../src/lib/search/SearchIndexBuilder";

async function main() {
  console.log("Starting search index build...\n");

  try {
    // Build indices for both English and Vietnamese
    await searchIndexBuilder.buildAllIndices("public/search-indices");

    console.log("\n✅ Search index build completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Search index build failed:", error);
    process.exit(1);
  }
}

main();
