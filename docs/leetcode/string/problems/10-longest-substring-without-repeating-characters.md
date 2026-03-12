---
layout: page
title: "Longest Substring Without Repeating Character"
difficulty: Hard
category: String
tags: [String, Two Pointers, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-without-repeating-character/"
---

# Longest Substring Without Repeating Character

**LeetCode Problem # * 3. Longest Substring Without Repeating Characters**

## Problem Description

 * Given a string s, find the length of the longest substring without repeating characters.  *  * Input: s = "abcabcbb"  * Output: 3  * Explanation: The answer is "abc", with the length of 3. 

## Solutions

{% raw %}
/**
 * 3. Longest Substring Without Repeating Characters
 *
 * Problem:
 * Given a string s, find the length of the longest substring without repeating characters.
 *
 * Example:
 * Input: s = "abcabcbb"
 * Output: 3
 * Explanation: The answer is "abc", with the length of 3.
 *
 * Input: s = "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 *
 * Input: s = "pwwkew"
 * Output: 3
 * Explanation: The answer is "wke", with the length of 3.
 *
 * LeetCode: https://leetcode.com/problems/longest-substring-without-repeating-characters/
 */

/**
 * Solution 1: Sliding Window with Set (Optimal)
 *
 * Approach:
 * - Use sliding window technique with two pointers
 * - Use Set to track characters in current window
 * - Expand window when no duplicates, shrink when duplicates found
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n)) where m is charset size
 */
function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set<string>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }

    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Solution 2: Sliding Window with Map
 *
 * Approach:
 * - Use Map to store character positions
 * - More efficient for finding duplicate positions
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstringMap(s: string): number {
  const charMap = new Map<string, number>();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    if (charMap.has(s[right])) {
      left = Math.max(left, charMap.get(s[right])! + 1);
    }

    charMap.set(s[right], right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Solution 3: Using Array for Character Tracking
 *
 * Approach:
 * - Use array to track character positions
 * - Assume ASCII characters (128 or 256 size array)
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - fixed size array
 */
function lengthOfLongestSubstringArray(s: string): number {
  const charIndex = new Array(128).fill(-1);
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const charCode = s[right].charCodeAt(0);

    if (charIndex[charCode] >= left) {
      left = charIndex[charCode] + 1;
    }

    charIndex[charCode] = right;
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Solution 4: Brute Force with Set
 *
 * Approach:
 * - Check all possible substrings
 * - Use Set to check for duplicates
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstringBruteForce(s: string): number {
  let maxLength = 0;

  for (let i = 0; i < s.length; i++) {
    const charSet = new Set<string>();
    let currentLength = 0;

    for (let j = i; j < s.length; j++) {
      if (charSet.has(s[j])) {
        break;
      }
      charSet.add(s[j]);
      currentLength++;
    }

    maxLength = Math.max(maxLength, currentLength);
  }

  return maxLength;
}

/**
 * Solution 5: Using Object as Hash Map
 *
 * Approach:
 * - Use JavaScript object as hash map
 * - More familiar for JavaScript developers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstringObject(s: string): number {
  const charMap: { [key: string]: number } = {};
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    if (s[right] in charMap && charMap[s[right]] >= left) {
      left = charMap[s[right]] + 1;
    }

    charMap[s[right]] = right;
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a LongestSubstringFinder class
 * - Encapsulate the finding logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
class LongestSubstringFinder {
  private charMap: Map<string, number>;

  constructor() {
    this.charMap = new Map();
  }

  findLength(s: string): number {
    this.charMap.clear();
    let maxLength = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
      if (this.charMap.has(s[right])) {
        left = Math.max(left, this.charMap.get(s[right])! + 1);
      }

      this.charMap.set(s[right], right);
      maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
  }

  getCharMap(): Map<string, number> {
    return new Map(this.charMap);
  }
}

function lengthOfLongestSubstringClass(s: string): number {
  const finder = new LongestSubstringFinder();
  return finder.findLength(s);
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield substring lengths
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
function* lengthOfLongestSubstringGenerator(s: string): Generator<number> {
  const charMap = new Map<string, number>();
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    if (charMap.has(s[right])) {
      left = Math.max(left, charMap.get(s[right])! + 1);
    }

    charMap.set(s[right], right);
    yield right - left + 1;
  }
}

function lengthOfLongestSubstringWithGenerator(s: string): number {
  let maxLength = 0;
  for (const length of lengthOfLongestSubstringGenerator(s)) {
    maxLength = Math.max(maxLength, length);
  }
  return maxLength;
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstringFunctional(s: string): number {
  return s.split("").reduce((acc, char, index) => {
    const charMap = new Map<string, number>();
    let left = 0;
    let maxLength = 0;

    for (let i = 0; i <= index; i++) {
      if (charMap.has(s[i])) {
        left = Math.max(left, charMap.get(s[i])! + 1);
      }
      charMap.set(s[i], i);
      maxLength = Math.max(maxLength, i - left + 1);
    }

    return Math.max(acc, maxLength);
  }, 0);
}

/**
 * Solution 9: Using Two Pointers with Array
 *
 * Approach:
 * - Use two pointers with array tracking
 * - More explicit pointer manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function lengthOfLongestSubstringTwoPointers(s: string): number {
  const charIndex = new Array(128).fill(-1);
  let maxLength = 0;
  let start = 0;
  let end = 0;

  while (end < s.length) {
    const charCode = s[end].charCodeAt(0);

    if (charIndex[charCode] >= start) {
      start = charIndex[charCode] + 1;
    }

    charIndex[charCode] = end;
    maxLength = Math.max(maxLength, end - start + 1);
    end++;
  }

  return maxLength;
}

/**
 * Solution 10: Using Bit Manipulation (for small alphabets)
 *
 * Approach:
 * - Use bit manipulation for character tracking
 * - Efficient for small character sets
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function lengthOfLongestSubstringBitwise(s: string): number {
  let maxLength = 0;
  let left = 0;
  let charBits = 0;

  for (let right = 0; right < s.length; right++) {
    const charCode = s[right].charCodeAt(0) - "a".charCodeAt(0);
    const bit = 1 << charCode;

    while (charBits & bit) {
      const leftCharCode = s[left].charCodeAt(0) - "a".charCodeAt(0);
      charBits &= ~(1 << leftCharCode);
      left++;
    }

    charBits |= bit;
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Solution 11: Using Queue-like Approach
 *
 * Approach:
 * - Use array as queue to maintain current substring
 * - Remove characters from front when duplicates found
 *
 * Time Complexity: O(n)
 * Space Complexity: O(min(m, n))
 */
function lengthOfLongestSubstringQueue(s: string): number {
  const queue: string[] = [];
  let maxLength = 0;

  for (const char of s) {
    const index = queue.indexOf(char);
    if (index !== -1) {
      queue.splice(0, index + 1);
    }
    queue.push(char);
    maxLength = Math.max(maxLength, queue.length);
  }

  return maxLength;
}

// Test cases
function testLengthOfLongestSubstring() {
  console.log(
    "=== Testing Longest Substring Without Repeating Characters ===\n"
  );

  const testCases = [
    {
      input: "abcabcbb",
      expected: 3,
      description: "Multiple repeating characters",
    },
    {
      input: "bbbbb",
      expected: 1,
      description: "All same characters",
    },
    {
      input: "pwwkew",
      expected: 3,
      description: "Mixed repeating characters",
    },
    {
      input: "",
      expected: 0,
      description: "Empty string",
    },
    {
      input: "a",
      expected: 1,
      description: "Single character",
    },
    {
      input: "abcdef",
      expected: 6,
      description: "No repeating characters",
    },
    {
      input: "dvdf",
      expected: 3,
      description: "Repeating character in middle",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Sliding Window with Set)
    const result1 = lengthOfLongestSubstring(testCase.input);
    console.log(
      `Solution 1 (Sliding Window with Set): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Sliding Window with Map)
    const result2 = lengthOfLongestSubstringMap(testCase.input);
    console.log(
      `Solution 2 (Sliding Window with Map): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Array)
    const result3 = lengthOfLongestSubstringArray(testCase.input);
    console.log(
      `Solution 3 (Array): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Brute Force)
    const result4 = lengthOfLongestSubstringBruteForce(testCase.input);
    console.log(
      `Solution 4 (Brute Force): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Object)
    const result5 = lengthOfLongestSubstringObject(testCase.input);
    console.log(
      `Solution 5 (Object): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Class)
    const result6 = lengthOfLongestSubstringClass(testCase.input);
    console.log(
      `Solution 6 (Class): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = lengthOfLongestSubstringWithGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = lengthOfLongestSubstringFunctional(testCase.input);
    console.log(
      `Solution 8 (Functional): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Two Pointers)
    const result9 = lengthOfLongestSubstringTwoPointers(testCase.input);
    console.log(
      `Solution 9 (Two Pointers): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Bitwise)
    const result10 = lengthOfLongestSubstringBitwise(testCase.input);
    console.log(
      `Solution 10 (Bitwise): ${result10} ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (Queue)
    const result11 = lengthOfLongestSubstringQueue(testCase.input);
    console.log(
      `Solution 11 (Queue): ${result11} ${
        result11 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Sliding Window with Set", func: lengthOfLongestSubstring },
    { name: "Sliding Window with Map", func: lengthOfLongestSubstringMap },
    { name: "Array", func: lengthOfLongestSubstringArray },
    { name: "Brute Force", func: lengthOfLongestSubstringBruteForce },
    { name: "Object", func: lengthOfLongestSubstringObject },
    { name: "Class", func: lengthOfLongestSubstringClass },
    { name: "Generator", func: lengthOfLongestSubstringWithGenerator },
    { name: "Functional", func: lengthOfLongestSubstringFunctional },
    { name: "Two Pointers", func: lengthOfLongestSubstringTwoPointers },
    { name: "Bitwise", func: lengthOfLongestSubstringBitwise },
    { name: "Queue", func: lengthOfLongestSubstringQueue },
  ];

  // Create test cases
  const smallCase = "abcabcbb";
  const mediumCase = "abcdefghijklmnopqrstuvwxyz";
  const largeCase = "a".repeat(1000) + "b".repeat(1000) + "c".repeat(1000);

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${result})`
      );
    });

    console.log("");
  });
}

// Substring analysis
function substringAnalysis() {
  console.log("=== Substring Analysis ===\n");

  const testCases = ["abcabcbb", "bbbbb", "pwwkew", "abcdef", "dvdf", "anviaj"];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(`String: "${testCase}"`);
    const result = lengthOfLongestSubstring(testCase);
    console.log(`Longest substring length: ${result}`);

    // Find the actual substring
    const charMap = new Map<string, number>();
    let maxLength = 0;
    let left = 0;
    let maxLeft = 0;

    for (let right = 0; right < testCase.length; right++) {
      if (charMap.has(testCase[right])) {
        left = Math.max(left, charMap.get(testCase[right])! + 1);
      }
      charMap.set(testCase[right], right);

      if (right - left + 1 > maxLength) {
        maxLength = right - left + 1;
        maxLeft = left;
      }
    }

    const substring = testCase.substring(maxLeft, maxLeft + maxLength);
    console.log(`Longest substring: "${substring}"`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testLengthOfLongestSubstring();
// performanceComparison();
// substringAnalysis();

export {
  lengthOfLongestSubstring,
  lengthOfLongestSubstringMap,
  lengthOfLongestSubstringArray,
  lengthOfLongestSubstringBruteForce,
  lengthOfLongestSubstringObject,
  lengthOfLongestSubstringClass,
  lengthOfLongestSubstringWithGenerator,
  lengthOfLongestSubstringFunctional,
  lengthOfLongestSubstringTwoPointers,
  lengthOfLongestSubstringBitwise,
  lengthOfLongestSubstringQueue,
  LongestSubstringFinder,
  lengthOfLongestSubstringGenerator,
  testLengthOfLongestSubstring,
  performanceComparison,
  substringAnalysis,
};
{% endraw %}
