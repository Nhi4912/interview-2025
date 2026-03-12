---
layout: page
title: "Permutation"
difficulty: Hard
category: Backtracking
tags: [Backtracking, Hash Table]
leetcode_url: "https://leetcode.com/problems/permutation/"
---

# Permutation

**LeetCode Problem # * 46. Permutations**

## Problem Description

 * Given an array nums of distinct integers, return all the possible permutations.  * You can return the answer in any order.  *  * Input: nums = [1,2,3]  * Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] 

## Solutions

{% raw %}
/**
 * 46. Permutations
 *
 * Problem:
 * Given an array nums of distinct integers, return all the possible permutations.
 * You can return the answer in any order.
 *
 * Example:
 * Input: nums = [1,2,3]
 * Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * Input: nums = [0,1]
 * Output: [[0,1],[1,0]]
 *
 * Input: nums = [1]
 * Output: [[1]]
 *
 * LeetCode: https://leetcode.com/problems/permutations/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use recursive backtracking to generate all permutations
 * - Use a visited array to track used elements
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n) - recursion stack
 */
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const visited = new Array(nums.length).fill(false);

  function backtrack(current: number[]) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (!visited[i]) {
        visited[i] = true;
        current.push(nums[i]);
        backtrack(current);
        current.pop();
        visited[i] = false;
      }
    }
  }

  backtrack([]);
  return result;
}

/**
 * Solution 2: Swap-based Backtracking
 *
 * Approach:
 * - Use swapping to generate permutations
 * - Swap elements in place to avoid extra space
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(1) - excluding result space
 */
function permuteSwap(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number) {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }

    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }

  backtrack(0);
  return result;
}

/**
 * Solution 3: Iterative Approach
 *
 * Approach:
 * - Build permutations incrementally
 * - Insert each element at all possible positions
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n!)
 */
function permuteIterative(nums: number[]): number[][] {
  if (nums.length === 0) return [];
  if (nums.length === 1) return [nums];

  let result: number[][] = [[nums[0]]];

  for (let i = 1; i < nums.length; i++) {
    const newResult: number[][] = [];

    for (const perm of result) {
      for (let j = 0; j <= perm.length; j++) {
        const newPerm = [...perm.slice(0, j), nums[i], ...perm.slice(j)];
        newResult.push(newPerm);
      }
    }

    result = newResult;
  }

  return result;
}

/**
 * Solution 4: Using Array Methods
 *
 * Approach:
 * - Use array methods to generate permutations
 * - More functional programming style
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n!)
 */
function permuteArray(nums: number[]): number[][] {
  if (nums.length === 0) return [];
  if (nums.length === 1) return [nums];

  const result: number[][] = [];

  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];
    const remaining = [...nums.slice(0, i), ...nums.slice(i + 1)];
    const perms = permuteArray(remaining);

    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }

  return result;
}

/**
 * Solution 5: Using Set
 *
 * Approach:
 * - Use Set to track used elements
 * - More explicit tracking of used elements
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function permuteSet(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(current: number[], used: Set<number>) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (const num of nums) {
      if (!used.has(num)) {
        used.add(num);
        current.push(num);
        backtrack(current, used);
        current.pop();
        used.delete(num);
      }
    }
  }

  backtrack([], new Set());
  return result;
}

/**
 * Solution 6: Using Map
 *
 * Approach:
 * - Use Map to track element frequencies
 * - Handle duplicates if needed
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function permuteMap(nums: number[]): number[][] {
  const result: number[][] = [];
  const freqMap = new Map<number, number>();

  // Count frequencies
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  function backtrack(current: number[]) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (const [num, count] of freqMap) {
      if (count > 0) {
        freqMap.set(num, count - 1);
        current.push(num);
        backtrack(current);
        current.pop();
        freqMap.set(num, count);
      }
    }
  }

  backtrack([]);
  return result;
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield permutations
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n)
 */
function* permuteGenerator(nums: number[]): Generator<number[]> {
  function* generatePermutations(
    current: number[],
    used: Set<number>
  ): Generator<number[]> {
    if (current.length === nums.length) {
      yield [...current];
      return;
    }

    for (const num of nums) {
      if (!used.has(num)) {
        used.add(num);
        current.push(num);
        yield* generatePermutations(current, used);
        current.pop();
        used.delete(num);
      }
    }
  }

  yield* generatePermutations([], new Set());
}

function permuteWithGenerator(nums: number[]): number[][] {
  return Array.from(permuteGenerator(nums));
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a PermutationGenerator class
 * - Encapsulate the generation logic
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n!)
 */
class PermutationGenerator {
  private nums: number[];
  private result: number[][];
  private visited: boolean[];

  constructor(nums: number[]) {
    this.nums = nums;
    this.result = [];
    this.visited = new Array(nums.length).fill(false);
  }

  generatePermutations(): number[][] {
    this.result = [];
    this.backtrack([]);
    return this.result;
  }

  private backtrack(current: number[]): void {
    if (current.length === this.nums.length) {
      this.result.push([...current]);
      return;
    }

    for (let i = 0; i < this.nums.length; i++) {
      if (!this.visited[i]) {
        this.visited[i] = true;
        current.push(this.nums[i]);
        this.backtrack(current);
        current.pop();
        this.visited[i] = false;
      }
    }
  }

  getPermutations(): number[][] {
    return [...this.result];
  }
}

function permuteClass(nums: number[]): number[][] {
  const generator = new PermutationGenerator(nums);
  return generator.generatePermutations();
}

/**
 * Solution 9: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n!)
 */
function permuteFunctional(nums: number[]): number[][] {
  if (nums.length === 0) return [];
  if (nums.length === 1) return [nums];

  return nums.flatMap((num, index) => {
    const remaining = [...nums.slice(0, index), ...nums.slice(index + 1)];
    return permuteFunctional(remaining).map((perm) => [num, ...perm]);
  });
}

/**
 * Solution 10: Using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Iterative approach with explicit stack
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(n!)
 */
function permuteStack(nums: number[]): number[][] {
  const result: number[][] = [];
  const stack: { current: number[]; used: Set<number> }[] = [
    { current: [], used: new Set() },
  ];

  while (stack.length > 0) {
    const { current, used } = stack.pop()!;

    if (current.length === nums.length) {
      result.push([...current]);
      continue;
    }

    for (let i = nums.length - 1; i >= 0; i--) {
      const num = nums[i];
      if (!used.has(num)) {
        const newUsed = new Set(used);
        newUsed.add(num);
        stack.push({ current: [...current, num], used: newUsed });
      }
    }
  }

  return result;
}

/**
 * Solution 11: Using Heap's Algorithm
 *
 * Approach:
 * - Use Heap's algorithm for generating permutations
 * - Non-recursive algorithm
 *
 * Time Complexity: O(n!)
 * Space Complexity: O(1) - excluding result space
 */
function permuteHeap(nums: number[]): number[][] {
  const result: number[][] = [];
  const arr = [...nums];
  const n = arr.length;

  // Generate all permutations using Heap's algorithm
  function generate(k: number) {
    if (k === 1) {
      result.push([...arr]);
      return;
    }

    generate(k - 1);

    for (let i = 0; i < k - 1; i++) {
      if (k % 2 === 0) {
        [arr[i], arr[k - 1]] = [arr[k - 1], arr[i]];
      } else {
        [arr[0], arr[k - 1]] = [arr[k - 1], arr[0]];
      }
      generate(k - 1);
    }
  }

  generate(n);
  return result;
}

// Test cases
function testPermute() {
  console.log("=== Testing Permutations ===\n");

  const testCases = [
    {
      input: [1, 2, 3],
      expected: [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ],
      description: "Three elements",
    },
    {
      input: [0, 1],
      expected: [
        [0, 1],
        [1, 0],
      ],
      description: "Two elements",
    },
    {
      input: [1],
      expected: [[1]],
      description: "Single element",
    },
    {
      input: [],
      expected: [],
      description: "Empty array",
    },
    {
      input: [1, 2, 3, 4],
      expected: [], // Will be calculated
      description: "Four elements",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);

    if (testCase.expected.length === 0) {
      // Calculate expected for 4 elements
      testCase.expected = permute([...testCase.input]);
    }

    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Backtracking)
    const result1 = permute([...testCase.input]);
    console.log(
      `Solution 1 (Backtracking): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Swap-based)
    const result2 = permuteSwap([...testCase.input]);
    console.log(
      `Solution 2 (Swap-based): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Iterative)
    const result3 = permuteIterative([...testCase.input]);
    console.log(
      `Solution 3 (Iterative): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Array Methods)
    const result4 = permuteArray([...testCase.input]);
    console.log(
      `Solution 4 (Array Methods): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Set)
    const result5 = permuteSet([...testCase.input]);
    console.log(
      `Solution 5 (Set): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Map)
    const result6 = permuteMap([...testCase.input]);
    console.log(
      `Solution 6 (Map): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = permuteWithGenerator([...testCase.input]);
    console.log(
      `Solution 7 (Generator): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = permuteClass([...testCase.input]);
    console.log(
      `Solution 8 (Class): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const result9 = permuteFunctional([...testCase.input]);
    console.log(
      `Solution 9 (Functional): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Stack)
    const result10 = permuteStack([...testCase.input]);
    console.log(
      `Solution 10 (Stack): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Heap's Algorithm)
    const result11 = permuteHeap([...testCase.input]);
    console.log(
      `Solution 11 (Heap's Algorithm): ${JSON.stringify(result11)} ${
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
    { name: "Backtracking", func: permute },
    { name: "Swap-based", func: permuteSwap },
    { name: "Iterative", func: permuteIterative },
    { name: "Array Methods", func: permuteArray },
    { name: "Set", func: permuteSet },
    { name: "Map", func: permuteMap },
    { name: "Generator", func: permuteWithGenerator },
    { name: "Class", func: permuteClass },
    { name: "Functional", func: permuteFunctional },
    { name: "Stack", func: permuteStack },
    { name: "Heap's Algorithm", func: permuteHeap },
  ];

  // Create test cases
  const smallCase = [1, 2, 3];
  const mediumCase = [1, 2, 3, 4];
  const largeCase = [1, 2, 3, 4, 5];

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...testCase]);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${
          result.length
        } permutations)`
      );
    });

    console.log("");
  });
}

// Permutation analysis
function permutationAnalysis() {
  console.log("=== Permutation Analysis ===\n");

  const testArrays = [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4]];

  testArrays.forEach((arr, index) => {
    console.log(`Array ${index + 1}: [${arr.join(", ")}]`);
    const result = permute(arr);
    console.log(
      `Permutations: ${result.length} (${arr.length}! = ${factorial(
        arr.length
      )})`
    );
    console.log(`Result: ${JSON.stringify(result)}`);
    console.log("");
  });
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Uncomment the following lines to run tests
// testPermute();
// performanceComparison();
// permutationAnalysis();

export {
  permute,
  permuteSwap,
  permuteIterative,
  permuteArray,
  permuteSet,
  permuteMap,
  permuteWithGenerator,
  permuteClass,
  permuteFunctional,
  permuteStack,
  permuteHeap,
  PermutationGenerator,
  permuteGenerator,
  testPermute,
  performanceComparison,
  permutationAnalysis,
  factorial,
};
{% endraw %}
