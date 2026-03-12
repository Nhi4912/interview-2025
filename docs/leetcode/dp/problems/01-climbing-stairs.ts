/**
 * 70. Climbing Stairs
 *
 * Problem:
 * You are climbing a staircase. It takes n steps to reach the top.
 * Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
 *
 * Example:
 * Input: n = 2
 * Output: 2
 * Explanation: There are two ways to climb to the top.
 * 1. 1 step + 1 step
 * 2. 2 steps
 *
 * Input: n = 3
 * Output: 3
 * Explanation: There are three ways to climb to the top.
 * 1. 1 step + 1 step + 1 step
 * 2. 1 step + 2 steps
 * 3. 2 steps + 1 step
 *
 * LeetCode: https://leetcode.com/problems/climbing-stairs/
 */

/**
 * Solution 1: Dynamic Programming (Optimal)
 *
 * Approach:
 * - Use DP array to store number of ways for each step
 * - dp[i] = dp[i-1] + dp[i-2] (Fibonacci sequence)
 * - Base cases: dp[0] = 1, dp[1] = 1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function climbStairs(n: number): number {
  if (n <= 1) return 1;

  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // Base case: 1 way to stay at ground
  dp[1] = 1; // Base case: 1 way to reach step 1

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * Solution 2: Space Optimized DP
 *
 * Approach:
 * - Same logic as Solution 1 but only keep track of last two values
 * - Reduces space complexity to O(1)
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function climbStairsOptimized(n: number): number {
  if (n <= 1) return 1;

  let prev = 1; // dp[0]
  let curr = 1; // dp[1]

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

/**
 * Solution 3: Recursive with Memoization
 *
 * Approach:
 * - Use recursion with memoization to avoid recalculating
 * - Top-down approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack + memo
 */
function climbStairsMemo(n: number): number {
  const memo = new Map<number, number>();

  function climbHelper(steps: number): number {
    if (steps <= 1) return 1;

    if (memo.has(steps)) {
      return memo.get(steps)!;
    }

    const result = climbHelper(steps - 1) + climbHelper(steps - 2);
    memo.set(steps, result);

    return result;
  }

  return climbHelper(n);
}

/**
 * Solution 4: Matrix Exponentiation (Advanced)
 *
 * Approach:
 * - Use matrix exponentiation for O(log n) time complexity
 * - Based on Fibonacci matrix formula
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function climbStairsMatrix(n: number): number {
  if (n <= 1) return 1;

  // Matrix multiplication helper
  function multiply(a: number[][], b: number[][]): number[][] {
    return [
      [
        a[0][0] * b[0][0] + a[0][1] * b[1][0],
        a[0][0] * b[0][1] + a[0][1] * b[1][1],
      ],
      [
        a[1][0] * b[0][0] + a[1][1] * b[1][0],
        a[1][0] * b[0][1] + a[1][1] * b[1][1],
      ],
    ];
  }

  // Matrix power helper
  function matrixPower(matrix: number[][], power: number): number[][] {
    if (power === 0)
      return [
        [1, 0],
        [0, 1],
      ];
    if (power === 1) return matrix;

    const half = matrixPower(matrix, Math.floor(power / 2));
    const squared = multiply(half, half);

    if (power % 2 === 0) {
      return squared;
    } else {
      return multiply(squared, matrix);
    }
  }

  const baseMatrix = [
    [1, 1],
    [1, 0],
  ];
  const resultMatrix = matrixPower(baseMatrix, n);

  return resultMatrix[0][0];
}

/**
 * Solution 5: Brute Force Recursion (For comparison)
 *
 * Approach:
 * - Simple recursion without memoization
 * - Shows the naive approach
 *
 * Time Complexity: O(2^n) - exponential
 * Space Complexity: O(n) - recursion stack
 */
function climbStairsBruteForce(n: number): number {
  if (n <= 1) return 1;

  return climbStairsBruteForce(n - 1) + climbStairsBruteForce(n - 2);
}

/**
 * Solution 6: Using Binet's Formula (Mathematical)
 *
 * Approach:
 * - Use closed-form formula for Fibonacci numbers
 * - Golden ratio approach
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function climbStairsBinet(n: number): number {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const psi = (1 - Math.sqrt(5)) / 2;

  return Math.round(
    (Math.pow(phi, n + 1) - Math.pow(psi, n + 1)) / Math.sqrt(5)
  );
}

// Test cases
function testClimbStairs() {
  console.log("=== Testing Climbing Stairs ===\n");

  const testCases = [
    {
      input: 1,
      expected: 1,
      description: "Single step",
    },
    {
      input: 2,
      expected: 2,
      description: "Two steps",
    },
    {
      input: 3,
      expected: 3,
      description: "Three steps",
    },
    {
      input: 4,
      expected: 5,
      description: "Four steps",
    },
    {
      input: 5,
      expected: 8,
      description: "Five steps",
    },
    {
      input: 6,
      expected: 13,
      description: "Six steps",
    },
    {
      input: 0,
      expected: 1,
      description: "Zero steps",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (DP)
    const result1 = climbStairs(testCase.input);
    console.log(
      `Solution 1 (DP): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Optimized DP)
    const result2 = climbStairsOptimized(testCase.input);
    console.log(
      `Solution 2 (Optimized DP): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Memoization)
    const result3 = climbStairsMemo(testCase.input);
    console.log(
      `Solution 3 (Memoization): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Matrix)
    const result4 = climbStairsMatrix(testCase.input);
    console.log(
      `Solution 4 (Matrix): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Brute Force) - only for small inputs
    if (testCase.input <= 20) {
      const result5 = climbStairsBruteForce(testCase.input);
      console.log(
        `Solution 5 (Brute Force): ${result5} ${
          result5 === testCase.expected ? "✅" : "❌"
        }`
      );
    } else {
      console.log(`Solution 5 (Brute Force): Skipped (input too large)`);
    }

    // Test Solution 6 (Binet's Formula)
    const result6 = climbStairsBinet(testCase.input);
    console.log(
      `Solution 6 (Binet's Formula): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "DP", func: climbStairs },
    { name: "Optimized DP", func: climbStairsOptimized },
    { name: "Memoization", func: climbStairsMemo },
    { name: "Matrix", func: climbStairsMatrix },
    { name: "Binet's Formula", func: climbStairsBinet },
  ];

  const largeN = 1000000;

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func(largeN);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result}`);
    console.log(
      `  Memory: ${
        name === "Optimized DP" ||
        name === "Matrix" ||
        name === "Binet's Formula"
          ? "O(1)"
          : "O(n)"
      }\n`
    );
  });
}

// Fibonacci sequence visualization
function fibonacciSequence() {
  console.log("=== Fibonacci Sequence (Climbing Stairs) ===\n");

  console.log("n | Ways to climb | Fibonacci number");
  console.log("--|---------------|------------------");

  for (let i = 0; i <= 10; i++) {
    const ways = climbStairsOptimized(i);
    console.log(`${i} | ${ways.toString().padStart(11)} | F(${i + 1})`);
  }

  console.log("\nNote: Ways to climb n steps = Fibonacci number F(n+1)");
}

// Uncomment the following lines to run tests
// testClimbStairs();
// performanceComparison();
// fibonacciSequence();

export {
  climbStairs,
  climbStairsOptimized,
  climbStairsMemo,
  climbStairsMatrix,
  climbStairsBruteForce,
  climbStairsBinet,
  testClimbStairs,
  performanceComparison,
  fibonacciSequence,
};
