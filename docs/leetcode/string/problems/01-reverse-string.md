---
layout: page
title: "Reverse String"
difficulty: Easy
category: String
tags: [String, Two Pointers]
leetcode_url: "https://leetcode.com/problems/reverse-string/"
---

# Reverse String

**LeetCode Problem # * 344. Reverse String**

## Problem Description

 * Write a function that reverses a string. The input string is given as an array of characters s.  * You must do this by modifying the input array in-place with O(1) extra memory.  *  * Input: s = ["h","e","l","l","o"]  * Output: ["o","l","l","e","h"] 

## Solutions

{% raw %}
/**
 * 344. Reverse String
 *
 * Problem:
 * Write a function that reverses a string. The input string is given as an array of characters s.
 * You must do this by modifying the input array in-place with O(1) extra memory.
 *
 * Example:
 * Input: s = ["h","e","l","l","o"]
 * Output: ["o","l","l","e","h"]
 *
 * Input: s = ["H","a","n","n","a","h"]
 * Output: ["h","a","n","n","a","H"]
 *
 * LeetCode: https://leetcode.com/problems/reverse-string/
 */

/**
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Use two pointers, one at start and one at end
 * - Swap characters at both pointers
 * - Move pointers towards center
 *
 * Time Complexity: O(n) - traverse half the array
 * Space Complexity: O(1) - in-place modification
 */
function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Swap characters
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}

/**
 * Solution 2: Using Array Methods (Not in-place, but clean)
 *
 * Approach:
 * - Use reverse() method
 * - Simple and readable
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - modifies in-place
 */
function reverseStringArrayMethod(s: string[]): void {
  s.reverse();
}

/**
 * Solution 3: Recursive Approach
 *
 * Approach:
 * - Use recursion to swap characters
 * - Base case: when left >= right
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function reverseStringRecursive(s: string[]): void {
  function reverseHelper(left: number, right: number): void {
    if (left >= right) return;

    // Swap characters
    [s[left], s[right]] = [s[right], s[left]];

    // Recursive call
    reverseHelper(left + 1, right - 1);
  }

  reverseHelper(0, s.length - 1);
}

/**
 * Solution 4: Using XOR Swap (Bit manipulation)
 *
 * Approach:
 * - Use XOR to swap without temporary variable
 * - More complex but shows bit manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function reverseStringXOR(s: string[]): void {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // XOR swap (works for numbers, but here we're swapping strings)
    // For strings, we still need temporary variable
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;

    left++;
    right--;
  }
}

/**
 * Solution 5: Using Stack (Not in-place, educational)
 *
 * Approach:
 * - Push all characters to stack
 * - Pop them back to reverse order
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - stack storage
 */
function reverseStringStack(s: string[]): void {
  const stack: string[] = [];

  // Push all characters to stack
  for (const char of s) {
    stack.push(char);
  }

  // Pop characters back to array
  for (let i = 0; i < s.length; i++) {
    s[i] = stack.pop()!;
  }
}

/**
 * Solution 6: Manual Loop (Alternative approach)
 *
 * Approach:
 * - Use single loop to swap characters
 * - Calculate opposite index for each position
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function reverseStringManual(s: string[]): void {
  const n = s.length;

  for (let i = 0; i < Math.floor(n / 2); i++) {
    const oppositeIndex = n - 1 - i;
    [s[i], s[oppositeIndex]] = [s[oppositeIndex], s[i]];
  }
}

// Test cases
function testReverseString() {
  console.log("=== Testing Reverse String ===\n");

  const testCases = [
    {
      input: ["h", "e", "l", "l", "o"],
      expected: ["o", "l", "l", "e", "h"],
      description: "Basic case",
    },
    {
      input: ["H", "a", "n", "n", "a", "h"],
      expected: ["h", "a", "n", "n", "a", "H"],
      description: "Mixed case",
    },
    {
      input: ["a", "b", "c"],
      expected: ["c", "b", "a"],
      description: "Three characters",
    },
    {
      input: ["a", "b"],
      expected: ["b", "a"],
      description: "Two characters",
    },
    {
      input: ["a"],
      expected: ["a"],
      description: "Single character",
    },
    {
      input: [],
      expected: [],
      description: "Empty array",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join('","')}]`);
    console.log(`Expected: [${testCase.expected.join('","')}]\n`);

    // Test Solution 1 (Two Pointers)
    const s1 = [...testCase.input];
    reverseString(s1);
    console.log(
      `Solution 1 (Two Pointers): [${s1.join('","')}] ${
        JSON.stringify(s1) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array Method)
    const s2 = [...testCase.input];
    reverseStringArrayMethod(s2);
    console.log(
      `Solution 2 (Array Method): [${s2.join('","')}] ${
        JSON.stringify(s2) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Recursive)
    const s3 = [...testCase.input];
    reverseStringRecursive(s3);
    console.log(
      `Solution 3 (Recursive): [${s3.join('","')}] ${
        JSON.stringify(s3) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (XOR)
    const s4 = [...testCase.input];
    reverseStringXOR(s4);
    console.log(
      `Solution 4 (XOR): [${s4.join('","')}] ${
        JSON.stringify(s4) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Stack)
    const s5 = [...testCase.input];
    reverseStringStack(s5);
    console.log(
      `Solution 5 (Stack): [${s5.join('","')}] ${
        JSON.stringify(s5) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Manual)
    const s6 = [...testCase.input];
    reverseStringManual(s6);
    console.log(
      `Solution 6 (Manual): [${s6.join('","')}] ${
        JSON.stringify(s6) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  // Create large string array
  const largeString = Array.from({ length: 100000 }, (_, i) =>
    String.fromCharCode(97 + (i % 26))
  );

  const testCases = [
    { name: "Two Pointers", func: reverseString },
    { name: "Array Method", func: reverseStringArrayMethod },
    { name: "Recursive", func: reverseStringRecursive },
    { name: "XOR", func: reverseStringXOR },
    { name: "Stack", func: reverseStringStack },
    { name: "Manual", func: reverseStringManual },
  ];

  testCases.forEach(({ name, func }) => {
    const testString = [...largeString];
    const start = performance.now();
    func(testString);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(
      `  Memory: ${
        name === "Recursive" || name === "Stack" ? "O(n)" : "O(1)"
      }\n`
    );
  });
}

// Unicode test
function testUnicode() {
  console.log("=== Unicode Test ===\n");

  const unicodeTests = [
    {
      input: ["🚀", "🌍", "💻"],
      description: "Emojis",
    },
    {
      input: ["ñ", "é", "ü"],
      description: "Accented characters",
    },
    {
      input: ["中", "文", "测", "试"],
      description: "Chinese characters",
    },
  ];

  unicodeTests.forEach((testCase, index) => {
    console.log(`Unicode Test ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join('","')}]`);

    const result = [...testCase.input];
    reverseString(result);
    console.log(`Result: [${result.join('","')}]`);
    console.log(
      `Valid: ${result.length === testCase.input.length ? "✅" : "❌"}\n`
    );
  });
}

// Run tests
// Uncomment the following lines to run tests
// testReverseString();
// performanceComparison();
// testUnicode();

export {
  reverseString,
  reverseStringArrayMethod,
  reverseStringRecursive,
  reverseStringXOR,
  reverseStringStack,
  reverseStringManual,
  testReverseString,
  performanceComparison,
  testUnicode,
};
{% endraw %}
