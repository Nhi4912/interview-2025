---
layout: page
title: "Fizz Buzz"
difficulty: Easy
category: Math
tags: [Math, Hash Table]
leetcode_url: "https://leetcode.com/problems/fizz-buzz/"
---

# Fizz Buzz

**LeetCode Problem # * 412. Fizz Buzz**

## Problem Description

 * Given an integer n, return a string array answer (1-indexed) where:  * - answer[i] == "FizzBuzz" if i is divisible by both 3 and 5.  * - answer[i] == "Fizz" if i is divisible by 3.  * - answer[i] == "Buzz" if i is divisible by 5.  * - answer[i] == i (as a string) if none of the above conditions are true. 

## Solutions

{% raw %}
/**
 * 412. Fizz Buzz
 *
 * Problem:
 * Given an integer n, return a string array answer (1-indexed) where:
 * - answer[i] == "FizzBuzz" if i is divisible by both 3 and 5.
 * - answer[i] == "Fizz" if i is divisible by 3.
 * - answer[i] == "Buzz" if i is divisible by 5.
 * - answer[i] == i (as a string) if none of the above conditions are true.
 *
 * Example:
 * Input: n = 3
 * Output: ["1","2","Fizz"]
 *
 * Input: n = 5
 * Output: ["1","2","Fizz","4","Buzz"]
 *
 * Input: n = 15
 * Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
 *
 * LeetCode: https://leetcode.com/problems/fizz-buzz/
 */

/**
 * Solution 1: Simple Conditional (Most Readable)
 *
 * Approach:
 * - Check each condition in order: FizzBuzz, Fizz, Buzz, number
 * - Use if-else statements for clarity
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - output array
 */
function fizzBuzz(n: number): string[] {
  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i.toString());
    }
  }

  return result;
}

/**
 * Solution 2: String Concatenation
 *
 * Approach:
 * - Build the result string by concatenating "Fizz" and "Buzz"
 * - More efficient than multiple conditions
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function fizzBuzzConcatenation(n: number): string[] {
  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    let str = "";

    if (i % 3 === 0) str += "Fizz";
    if (i % 5 === 0) str += "Buzz";

    result.push(str || i.toString());
  }

  return result;
}

/**
 * Solution 3: Using Map (Extensible)
 *
 * Approach:
 * - Use a map to store divisibility rules
 * - Easy to extend for more rules
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function fizzBuzzMap(n: number): string[] {
  const result: string[] = [];
  const rules = new Map<number, string>([
    [3, "Fizz"],
    [5, "Buzz"],
  ]);

  for (let i = 1; i <= n; i++) {
    let str = "";

    for (const [divisor, word] of rules) {
      if (i % divisor === 0) {
        str += word;
      }
    }

    result.push(str || i.toString());
  }

  return result;
}

/**
 * Solution 4: Using Array Methods (Functional)
 *
 * Approach:
 * - Use Array.from and map for functional approach
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function fizzBuzzFunctional(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const num = i + 1;
    let str = "";

    if (num % 3 === 0) str += "Fizz";
    if (num % 5 === 0) str += "Buzz";

    return str || num.toString();
  });
}

/**
 * Solution 5: Using Bit Manipulation (Advanced)
 *
 * Approach:
 * - Use bit flags to track divisibility
 * - More efficient for multiple conditions
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function fizzBuzzBitwise(n: number): string[] {
  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    let flags = 0;

    if (i % 3 === 0) flags |= 1; // Set bit 0
    if (i % 5 === 0) flags |= 2; // Set bit 1

    switch (flags) {
      case 0: // Neither divisible by 3 nor 5
        result.push(i.toString());
        break;
      case 1: // Divisible by 3 only
        result.push("Fizz");
        break;
      case 2: // Divisible by 5 only
        result.push("Buzz");
        break;
      case 3: // Divisible by both 3 and 5
        result.push("FizzBuzz");
        break;
    }
  }

  return result;
}

/**
 * Solution 6: Using Lookup Table (Optimized)
 *
 * Approach:
 * - Pre-compute results for numbers 1-15
 * - Use modulo 15 to get the pattern
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function fizzBuzzLookup(n: number): string[] {
  const lookup = [
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz",
  ];

  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    const index = (i - 1) % 15;
    result.push(lookup[index]);
  }

  return result;
}

/**
 * Solution 7: Using Generator (Memory Efficient)
 *
 * Approach:
 * - Use generator to yield results one by one
 * - Memory efficient for large n
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - only current result in memory
 */
function* fizzBuzzGenerator(n: number): Generator<string> {
  for (let i = 1; i <= n; i++) {
    let str = "";

    if (i % 3 === 0) str += "Fizz";
    if (i % 5 === 0) str += "Buzz";

    yield str || i.toString();
  }
}

function fizzBuzzWithGenerator(n: number): string[] {
  return Array.from(fizzBuzzGenerator(n));
}

/**
 * Solution 8: Using Class (Object-Oriented)
 *
 * Approach:
 * - Encapsulate logic in a class
 * - Good for extensibility and testing
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class FizzBuzzSolver {
  private rules: Array<{ divisor: number; word: string }>;

  constructor() {
    this.rules = [
      { divisor: 3, word: "Fizz" },
      { divisor: 5, word: "Buzz" },
    ];
  }

  solve(n: number): string[] {
    const result: string[] = [];

    for (let i = 1; i <= n; i++) {
      let str = "";

      for (const rule of this.rules) {
        if (i % rule.divisor === 0) {
          str += rule.word;
        }
      }

      result.push(str || i.toString());
    }

    return result;
  }

  addRule(divisor: number, word: string): void {
    this.rules.push({ divisor, word });
  }
}

function fizzBuzzClass(n: number): string[] {
  const solver = new FizzBuzzSolver();
  return solver.solve(n);
}

// Test cases
function testFizzBuzz() {
  console.log("=== Testing Fizz Buzz ===\n");

  const testCases = [
    {
      input: 3,
      expected: ["1", "2", "Fizz"],
      description: "Small number",
    },
    {
      input: 5,
      expected: ["1", "2", "Fizz", "4", "Buzz"],
      description: "Medium number",
    },
    {
      input: 15,
      expected: [
        "1",
        "2",
        "Fizz",
        "4",
        "Buzz",
        "Fizz",
        "7",
        "8",
        "Fizz",
        "Buzz",
        "11",
        "Fizz",
        "13",
        "14",
        "FizzBuzz",
      ],
      description: "Large number with FizzBuzz",
    },
    {
      input: 1,
      expected: ["1"],
      description: "Single number",
    },
    {
      input: 0,
      expected: [],
      description: "Zero",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Simple Conditional)
    const result1 = fizzBuzz(testCase.input);
    console.log(
      `Solution 1 (Simple): [${result1.join(", ")}] ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Concatenation)
    const result2 = fizzBuzzConcatenation(testCase.input);
    console.log(
      `Solution 2 (Concatenation): [${result2.join(", ")}] ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Map)
    const result3 = fizzBuzzMap(testCase.input);
    console.log(
      `Solution 3 (Map): [${result3.join(", ")}] ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Functional)
    const result4 = fizzBuzzFunctional(testCase.input);
    console.log(
      `Solution 4 (Functional): [${result4.join(", ")}] ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Bitwise)
    const result5 = fizzBuzzBitwise(testCase.input);
    console.log(
      `Solution 5 (Bitwise): [${result5.join(", ")}] ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Lookup)
    const result6 = fizzBuzzLookup(testCase.input);
    console.log(
      `Solution 6 (Lookup): [${result6.join(", ")}] ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = fizzBuzzWithGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): [${result7.join(", ")}] ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = fizzBuzzClass(testCase.input);
    console.log(
      `Solution 8 (Class): [${result8.join(", ")}] ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Simple", func: fizzBuzz },
    { name: "Concatenation", func: fizzBuzzConcatenation },
    { name: "Map", func: fizzBuzzMap },
    { name: "Functional", func: fizzBuzzFunctional },
    { name: "Bitwise", func: fizzBuzzBitwise },
    { name: "Lookup", func: fizzBuzzLookup },
    { name: "Generator", func: fizzBuzzWithGenerator },
    { name: "Class", func: fizzBuzzClass },
  ];

  const largeN = 100000;

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func(largeN);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result.length} elements`);
    console.log(`  Memory: ${name === "Generator" ? "O(1)" : "O(n)"}\n`);
  });
}

// Pattern analysis
function patternAnalysis() {
  console.log("=== Pattern Analysis ===\n");

  console.log("FizzBuzz Pattern (first 30 numbers):");
  const pattern = fizzBuzz(30);

  for (let i = 0; i < pattern.length; i++) {
    const num = i + 1;
    const result = pattern[i];
    console.log(`${num.toString().padStart(2)}: ${result}`);

    if ((i + 1) % 15 === 0) {
      console.log("---"); // Pattern repeats every 15 numbers
    }
  }

  console.log("\nPattern repeats every 15 numbers (LCM of 3 and 5)");
}

// Uncomment the following lines to run tests
// testFizzBuzz();
// performanceComparison();
// patternAnalysis();

export {
  fizzBuzz,
  fizzBuzzConcatenation,
  fizzBuzzMap,
  fizzBuzzFunctional,
  fizzBuzzBitwise,
  fizzBuzzLookup,
  fizzBuzzWithGenerator,
  fizzBuzzGenerator,
  fizzBuzzClass,
  FizzBuzzSolver,
  testFizzBuzz,
  performanceComparison,
  patternAnalysis,
};
{% endraw %}
