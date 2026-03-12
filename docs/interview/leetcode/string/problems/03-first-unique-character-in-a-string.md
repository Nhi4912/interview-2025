---
layout: page
title: "First Unique Character in a String"
difficulty: Easy
category: String
tags: [String, Hash Table]
leetcode_url: "https://leetcode.com/problems/first-unique-character-in-a-string/"
---

# First Unique Character in a String

**LeetCode Problem # * 387. First Unique Character in a String**

## Problem Description

 * Given a string s, find the first non-repeating character in it and return its index.  * If it does not exist, return -1.  *  * Input: s = "leetcode"  * Output: 0 

## Solutions

{% raw %}
/**
 * 387. First Unique Character in a String
 *
 * Problem:
 * Given a string s, find the first non-repeating character in it and return its index.
 * If it does not exist, return -1.
 *
 * Example:
 * Input: s = "leetcode"
 * Output: 0
 *
 * Input: s = "loveleetcode"
 * Output: 2
 *
 * Input: s = "aabb"
 * Output: -1
 *
 * LeetCode: https://leetcode.com/problems/first-unique-character-in-a-string/
 */

/**
 * Solution 1: Hash Map (Optimal)
 *
 * Approach:
 * - Use hash map to count frequency of each character
 * - Scan string again to find first character with frequency 1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - fixed size alphabet
 */
function firstUniqChar(s: string): number {
  const frequency = new Map<string, number>();

  // Count frequency of each character
  for (const char of s) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  // Find first character with frequency 1
  for (let i = 0; i < s.length; i++) {
    if (frequency.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 2: Using Array (Fixed size)
 *
 * Approach:
 * - Use array of size 26 for lowercase letters
 * - More efficient for ASCII characters
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharArray(s: string): number {
  const frequency = new Array(26).fill(0);

  // Count frequency
  for (const char of s) {
    frequency[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Find first unique character
  for (let i = 0; i < s.length; i++) {
    if (frequency[s[i].charCodeAt(0) - "a".charCodeAt(0)] === 1) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 3: Using Object (Hash table)
 *
 * Approach:
 * - Use plain object as hash table
 * - Simple implementation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharObject(s: string): number {
  const frequency: { [key: string]: number } = {};

  // Count frequency
  for (const char of s) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // Find first unique character
  for (let i = 0; i < s.length; i++) {
    if (frequency[s[i]] === 1) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 4: Using indexOf and lastIndexOf
 *
 * Approach:
 * - Use built-in methods to check if character appears only once
 * - Simple but less efficient
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function firstUniqCharIndexOf(s: string): number {
  for (let i = 0; i < s.length; i++) {
    if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 5: Using Set (Two passes)
 *
 * Approach:
 * - Use Set to track seen characters
 * - Use another Set for duplicates
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharSet(s: string): number {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  // Find duplicates
  for (const char of s) {
    if (seen.has(char)) {
      duplicates.add(char);
    } else {
      seen.add(char);
    }
  }

  // Find first non-duplicate
  for (let i = 0; i < s.length; i++) {
    if (!duplicates.has(s[i])) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 6: Using Array Methods (Functional)
 *
 * Approach:
 * - Use functional programming approach
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharFunctional(s: string): number {
  const frequency = s
    .split("")
    .reduce((acc: { [key: string]: number }, char: string) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});

  return s.split("").findIndex((char) => frequency[char] === 1);
}

/**
 * Solution 7: Using Linked List (Queue approach)
 *
 * Approach:
 * - Use queue to maintain order of characters
 * - Remove duplicates from queue
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharQueue(s: string): number {
  const frequency = new Map<string, number>();
  const queue: Array<{ char: string; index: number }> = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const count = (frequency.get(char) || 0) + 1;
    frequency.set(char, count);

    if (count === 1) {
      queue.push({ char, index: i });
    }
  }

  // Find first character in queue with frequency 1
  for (const { char, index } of queue) {
    if (frequency.get(char) === 1) {
      return index;
    }
  }

  return -1;
}

/**
 * Solution 8: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit flags for ASCII characters
 * - Limited to 32-bit integers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function firstUniqCharBitwise(s: string): number {
  let seen = 0;
  let duplicates = 0;

  for (const char of s) {
    const bit = 1 << (char.charCodeAt(0) - "a".charCodeAt(0));

    if (seen & bit) {
      duplicates |= bit;
    } else {
      seen |= bit;
    }
  }

  for (let i = 0; i < s.length; i++) {
    const bit = 1 << (s[i].charCodeAt(0) - "a".charCodeAt(0));
    if (seen & bit && !(duplicates & bit)) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 9: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield characters with their indices
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* characterGenerator(
  s: string
): Generator<{ char: string; index: number }> {
  for (let i = 0; i < s.length; i++) {
    yield { char: s[i], index: i };
  }
}

function firstUniqCharGenerator(s: string): number {
  const frequency = new Map<string, number>();

  // Count frequency
  for (const { char } of characterGenerator(s)) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  // Find first unique character
  for (const { char, index } of characterGenerator(s)) {
    if (frequency.get(char) === 1) {
      return index;
    }
  }

  return -1;
}

// Test cases
function testFirstUniqChar() {
  console.log("=== Testing First Unique Character in a String ===\n");

  const testCases = [
    {
      input: "leetcode",
      expected: 0,
      description: "First character is unique",
    },
    {
      input: "loveleetcode",
      expected: 2,
      description: "Third character is unique",
    },
    {
      input: "aabb",
      expected: -1,
      description: "No unique characters",
    },
    {
      input: "a",
      expected: 0,
      description: "Single character",
    },
    {
      input: "",
      expected: -1,
      description: "Empty string",
    },
    {
      input: "abcabc",
      expected: -1,
      description: "All characters repeated",
    },
    {
      input: "z",
      expected: 0,
      description: "Single unique character",
    },
    {
      input: "dddccdbba",
      expected: 8,
      description: "Last character is unique",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Hash Map)
    const result1 = firstUniqChar(testCase.input);
    console.log(
      `Solution 1 (Hash Map): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const result2 = firstUniqCharArray(testCase.input);
    console.log(
      `Solution 2 (Array): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Object)
    const result3 = firstUniqCharObject(testCase.input);
    console.log(
      `Solution 3 (Object): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (indexOf)
    const result4 = firstUniqCharIndexOf(testCase.input);
    console.log(
      `Solution 4 (indexOf): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Set)
    const result5 = firstUniqCharSet(testCase.input);
    console.log(
      `Solution 5 (Set): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = firstUniqCharFunctional(testCase.input);
    console.log(
      `Solution 6 (Functional): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Queue)
    const result7 = firstUniqCharQueue(testCase.input);
    console.log(
      `Solution 7 (Queue): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Bitwise)
    const result8 = firstUniqCharBitwise(testCase.input);
    console.log(
      `Solution 8 (Bitwise): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Generator)
    const result9 = firstUniqCharGenerator(testCase.input);
    console.log(
      `Solution 9 (Generator): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Hash Map", func: firstUniqChar },
    { name: "Array", func: firstUniqCharArray },
    { name: "Object", func: firstUniqCharObject },
    { name: "indexOf", func: firstUniqCharIndexOf },
    { name: "Set", func: firstUniqCharSet },
    { name: "Functional", func: firstUniqCharFunctional },
    { name: "Queue", func: firstUniqCharQueue },
    { name: "Bitwise", func: firstUniqCharBitwise },
    { name: "Generator", func: firstUniqCharGenerator },
  ];

  // Create test strings
  const smallString = "leetcode";
  const largeString = "a".repeat(1000) + "b" + "a".repeat(1000);
  const noUniqueString = "aabbccddee";

  const strings = [
    { name: "Small", string: smallString },
    { name: "Large", string: largeString },
    { name: "No Unique", string: noUniqueString },
  ];

  strings.forEach(({ name, string }) => {
    console.log(`${name} String:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(string);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (result: ${result})`
      );
    });

    console.log("");
  });
}

// Character frequency analysis
function frequencyAnalysis() {
  console.log("=== Character Frequency Analysis ===\n");

  const testStrings = ["leetcode", "loveleetcode", "aabb", "dddccdbba"];

  testStrings.forEach((s) => {
    console.log(`String: "${s}"`);

    const frequency = new Map<string, number>();
    for (const char of s) {
      frequency.set(char, (frequency.get(char) || 0) + 1);
    }

    console.log("Character frequencies:");
    for (const [char, count] of frequency) {
      console.log(`  '${char}': ${count} time(s)`);
    }

    const uniqueChars = Array.from(frequency.entries())
      .filter(([_, count]) => count === 1)
      .map(([char, _]) => char);

    console.log(`Unique characters: [${uniqueChars.join(", ")}]`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testFirstUniqChar();
// performanceComparison();
// frequencyAnalysis();

export {
  firstUniqChar,
  firstUniqCharArray,
  firstUniqCharObject,
  firstUniqCharIndexOf,
  firstUniqCharSet,
  firstUniqCharFunctional,
  firstUniqCharQueue,
  firstUniqCharBitwise,
  firstUniqCharGenerator,
  characterGenerator,
  testFirstUniqChar,
  performanceComparison,
  frequencyAnalysis,
};
{% endraw %}
