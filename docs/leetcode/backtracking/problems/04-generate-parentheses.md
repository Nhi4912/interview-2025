---
layout: page
title: "Generate Parenthese"
difficulty: Hard
category: Backtracking
tags: [Backtracking, Hash Table]
leetcode_url: "https://leetcode.com/problems/generate-parenthese/"
---

# Generate Parenthese

**LeetCode Problem # * 22. Generate Parentheses**

## Problem Description

 * Given n pairs of parentheses, write a function to generate all combinations  * of well-formed parentheses.  *  * Input: n = 3  * Output: ["((()))","(()())","(())()","()(())","()()()"] 

## Solutions

{% raw %}
/**
 * 22. Generate Parentheses
 *
 * Problem:
 * Given n pairs of parentheses, write a function to generate all combinations
 * of well-formed parentheses.
 *
 * Example:
 * Input: n = 3
 * Output: ["((()))","(()())","(())()","()(())","()()()"]
 *
 * Input: n = 1
 * Output: ["()"]
 *
 * LeetCode: https://leetcode.com/problems/generate-parentheses/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to generate valid parentheses
 * - Track open and close counts
 * - Only add closing parenthesis if open > close
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(n) - recursion stack
 */
function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  function backtrack(current: string, open: number, close: number) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return result;
}

/**
 * Solution 2: Recursive with String Building
 *
 * Approach:
 * - Build strings incrementally
 * - More explicit string manipulation
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(n) - recursion stack
 */
function generateParenthesisRecursive(n: number): string[] {
  const result: string[] = [];

  function generate(current: string, left: number, right: number) {
    if (left === 0 && right === 0) {
      result.push(current);
      return;
    }

    if (left > 0) {
      generate(current + "(", left - 1, right);
    }

    if (right > left) {
      generate(current + ")", left, right - 1);
    }
  }

  generate("", n, n);
  return result;
}

/**
 * Solution 3: Using Array Methods
 *
 * Approach:
 * - Use array methods to build combinations
 * - More functional programming style
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisArray(n: number): string[] {
  if (n === 0) return [""];
  if (n === 1) return ["()"];

  const result: string[] = [];

  for (let i = 0; i < n; i++) {
    const left = generateParenthesisArray(i);
    const right = generateParenthesisArray(n - 1 - i);

    for (const l of left) {
      for (const r of right) {
        result.push("(" + l + ")" + r);
      }
    }
  }

  return result;
}

/**
 * Solution 4: Using Stack Simulation
 *
 * Approach:
 * - Simulate stack operations
 * - Track stack depth
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(n) - recursion stack
 */
function generateParenthesisStack(n: number): string[] {
  const result: string[] = [];

  function backtrack(current: string, stack: number) {
    if (current.length === 2 * n) {
      if (stack === 0) {
        result.push(current);
      }
      return;
    }

    // Add opening parenthesis
    if (stack < n) {
      backtrack(current + "(", stack + 1);
    }

    // Add closing parenthesis
    if (stack > 0) {
      backtrack(current + ")", stack - 1);
    }
  }

  backtrack("", 0);
  return result;
}

/**
 * Solution 5: Using Set
 *
 * Approach:
 * - Use Set to avoid duplicates
 * - More explicit duplicate handling
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisSet(n: number): string[] {
  const result = new Set<string>();

  function backtrack(current: string, open: number, close: number) {
    if (current.length === 2 * n) {
      result.add(current);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return Array.from(result);
}

/**
 * Solution 6: Using Map
 *
 * Approach:
 * - Use Map to track valid combinations
 * - More explicit state tracking
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisMap(n: number): string[] {
  const result = new Map<string, boolean>();

  function backtrack(current: string, open: number, close: number) {
    if (current.length === 2 * n) {
      result.set(current, true);
      return;
    }

    if (open < n) {
      backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      backtrack(current + ")", open, close + 1);
    }
  }

  backtrack("", 0, 0);
  return Array.from(result.keys());
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield valid parentheses
 * - Memory efficient for large n
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(n)
 */
function* generateParenthesisGenerator(n: number): Generator<string> {
  function* generate(
    current: string,
    open: number,
    close: number
  ): Generator<string> {
    if (current.length === 2 * n) {
      yield current;
      return;
    }

    if (open < n) {
      yield* generate(current + "(", open + 1, close);
    }

    if (close < open) {
      yield* generate(current + ")", open, close + 1);
    }
  }

  yield* generate("", 0, 0);
}

function generateParenthesisWithGenerator(n: number): string[] {
  return Array.from(generateParenthesisGenerator(n));
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a ParenthesisGenerator class
 * - Encapsulate the generation logic
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
class ParenthesisGenerator {
  private n: number;
  private result: string[];

  constructor(n: number) {
    this.n = n;
    this.result = [];
  }

  generate(): string[] {
    this.result = [];
    this.backtrack("", 0, 0);
    return this.result;
  }

  private backtrack(current: string, open: number, close: number): void {
    if (current.length === 2 * this.n) {
      this.result.push(current);
      return;
    }

    if (open < this.n) {
      this.backtrack(current + "(", open + 1, close);
    }

    if (close < open) {
      this.backtrack(current + ")", open, close + 1);
    }
  }

  getResult(): string[] {
    return [...this.result];
  }
}

function generateParenthesisClass(n: number): string[] {
  const generator = new ParenthesisGenerator(n);
  return generator.generate();
}

/**
 * Solution 9: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisFunctional(n: number): string[] {
  if (n === 0) return [""];
  if (n === 1) return ["()"];

  return Array.from({ length: n }, (_, i) => {
    const left = generateParenthesisFunctional(i);
    const right = generateParenthesisFunctional(n - 1 - i);

    return left.flatMap((l) => right.map((r) => "(" + l + ")" + r));
  }).flat();
}

/**
 * Solution 10: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisStackIterative(n: number): string[] {
  const result: string[] = [];
  const stack: { current: string; open: number; close: number }[] = [
    { current: "", open: 0, close: 0 },
  ];

  while (stack.length > 0) {
    const { current, open, close } = stack.pop()!;

    if (current.length === 2 * n) {
      result.push(current);
      continue;
    }

    if (close < open) {
      stack.push({ current: current + ")", open, close: close + 1 });
    }

    if (open < n) {
      stack.push({ current: current + "(", open: open + 1, close });
    }
  }

  return result;
}

/**
 * Solution 11: Using Dynamic Programming
 *
 * Approach:
 * - Use DP to build solutions incrementally
 * - Cache intermediate results
 *
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
function generateParenthesisDP(n: number): string[] {
  const dp: string[][] = Array(n + 1)
    .fill(null)
    .map(() => []);
  dp[0] = [""];
  dp[1] = ["()"];

  for (let i = 2; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      const left = dp[j];
      const right = dp[i - 1 - j];

      for (const l of left) {
        for (const r of right) {
          dp[i].push("(" + l + ")" + r);
        }
      }
    }
  }

  return dp[n];
}

// Test cases
function testGenerateParenthesis() {
  console.log("=== Testing Generate Parentheses ===\n");

  const testCases = [
    {
      input: 1,
      expected: ["()"],
      description: "Single pair",
    },
    {
      input: 2,
      expected: ["(())", "()()"],
      description: "Two pairs",
    },
    {
      input: 3,
      expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
      description: "Three pairs",
    },
    {
      input: 0,
      expected: [""],
      description: "Zero pairs",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = generateParenthesis(testCase.input);
    console.log(
      `Solution 1 (Backtracking): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Recursive)
    const result2 = generateParenthesisRecursive(testCase.input);
    console.log(
      `Solution 2 (Recursive): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Array Methods)
    const result3 = generateParenthesisArray(testCase.input);
    console.log(
      `Solution 3 (Array Methods): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Stack)
    const result4 = generateParenthesisStack(testCase.input);
    console.log(
      `Solution 4 (Stack): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Set)
    const result5 = generateParenthesisSet(testCase.input);
    console.log(
      `Solution 5 (Set): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Map)
    const result6 = generateParenthesisMap(testCase.input);
    console.log(
      `Solution 6 (Map): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = generateParenthesisWithGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = generateParenthesisClass(testCase.input);
    console.log(
      `Solution 8 (Class): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const result9 = generateParenthesisFunctional(testCase.input);
    console.log(
      `Solution 9 (Functional): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Stack Iterative)
    const result10 = generateParenthesisStackIterative(testCase.input);
    console.log(
      `Solution 10 (Stack Iterative): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Dynamic Programming)
    const result11 = generateParenthesisDP(testCase.input);
    console.log(
      `Solution 11 (Dynamic Programming): ${JSON.stringify(result11)} ${
        JSON.stringify(result11.sort()) ===
        JSON.stringify(testCase.expected.sort())
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
    { name: "Backtracking", func: generateParenthesis },
    { name: "Recursive", func: generateParenthesisRecursive },
    { name: "Array Methods", func: generateParenthesisArray },
    { name: "Stack", func: generateParenthesisStack },
    { name: "Set", func: generateParenthesisSet },
    { name: "Map", func: generateParenthesisMap },
    { name: "Generator", func: generateParenthesisWithGenerator },
    { name: "Class", func: generateParenthesisClass },
    { name: "Functional", func: generateParenthesisFunctional },
    { name: "Stack Iterative", func: generateParenthesisStackIterative },
    { name: "Dynamic Programming", func: generateParenthesisDP },
  ];

  // Create test cases
  const smallCase = 3;
  const mediumCase = 4;
  const largeCase = 5;

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case (n = ${testCase}):`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${
          result.length
        } combinations)`
      );
    });

    console.log("");
  });
}

// Parentheses analysis
function parenthesesAnalysis() {
  console.log("=== Parentheses Analysis ===\n");

  const testValues = [0, 1, 2, 3, 4];

  testValues.forEach((n) => {
    console.log(`n = ${n}:`);
    const result = generateParenthesis(n);
    console.log(
      `Combinations: ${result.length} (Catalan number C(${n}) = ${catalanNumber(
        n
      )})`
    );
    console.log(`Result: ${JSON.stringify(result)}`);
    console.log("");
  });
}

function catalanNumber(n: number): number {
  if (n <= 1) return 1;

  let result = 1;
  for (let i = 0; i < n; i++) {
    result = (result * 2 * (2 * i + 1)) / (i + 2);
  }
  return result;
}

// Uncomment the following lines to run tests
// testGenerateParenthesis();
// performanceComparison();
// parenthesesAnalysis();

export {
  generateParenthesis,
  generateParenthesisRecursive,
  generateParenthesisArray,
  generateParenthesisStack,
  generateParenthesisSet,
  generateParenthesisMap,
  generateParenthesisWithGenerator,
  generateParenthesisClass,
  generateParenthesisFunctional,
  generateParenthesisStackIterative,
  generateParenthesisDP,
  ParenthesisGenerator,
  generateParenthesisGenerator,
  testGenerateParenthesis,
  performanceComparison,
  parenthesesAnalysis,
  catalanNumber,
};
{% endraw %}
