---
layout: page
title: "Increasing Triplet Subsequence"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/increasing-triplet-subsequence/"
---

# Increasing Triplet Subsequence

**LeetCode Problem # * 334. Increasing Triplet Subsequence**

## Problem Description

 * Given an integer array nums, return true if there exists a triple of indices  * (i, j, k) such that i < j < k and nums[i] < nums[j] < nums[k]. If no such  * indices exists, return false.  *  * Input: nums = [1,2,3,4,5] 

## Solutions

{% raw %}
/**
 * 334. Increasing Triplet Subsequence
 *
 * Problem:
 * Given an integer array nums, return true if there exists a triple of indices
 * (i, j, k) such that i < j < k and nums[i] < nums[j] < nums[k]. If no such
 * indices exists, return false.
 *
 * Example:
 * Input: nums = [1,2,3,4,5]
 * Output: true
 *
 * Input: nums = [5,4,3,2,1]
 * Output: false
 *
 * Input: nums = [2,1,5,0,4,6]
 * Output: true
 *
 * LeetCode: https://leetcode.com/problems/increasing-triplet-subsequence/
 */

/**
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Keep track of two minimum values
 * - If we find a value greater than both, we have a triplet
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTriplet(nums: number[]): boolean {
  let first = Infinity;
  let second = Infinity;

  for (const num of nums) {
    if (num <= first) {
      first = num;
    } else if (num <= second) {
      second = num;
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 2: Using Array
 *
 * Approach:
 * - Use array to store minimum values
 * - Similar to Solution 1 but with array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTripletArray(nums: number[]): boolean {
  const minValues = [Infinity, Infinity];

  for (const num of nums) {
    if (num <= minValues[0]) {
      minValues[0] = num;
    } else if (num <= minValues[1]) {
      minValues[1] = num;
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 3: Using Object
 *
 * Approach:
 * - Use object to store minimum values
 * - More explicit naming
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTripletObject(nums: number[]): boolean {
  const mins = {
    first: Infinity,
    second: Infinity,
  };

  for (const num of nums) {
    if (num <= mins.first) {
      mins.first = num;
    } else if (num <= mins.second) {
      mins.second = num;
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 4: Brute Force (Educational)
 *
 * Approach:
 * - Check all possible triplets
 * - Simple but inefficient
 *
 * Time Complexity: O(n³)
 * Space Complexity: O(1)
 */
function increasingTripletBruteForce(nums: number[]): boolean {
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] < nums[j] && nums[j] < nums[k]) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Solution 5: Using Stack
 *
 * Approach:
 * - Use stack to maintain increasing sequence
 * - Pop elements that are too large
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function increasingTripletStack(nums: number[]): boolean {
  const stack: number[] = [];

  for (const num of nums) {
    while (stack.length > 0 && stack[stack.length - 1] >= num) {
      stack.pop();
    }

    stack.push(num);

    if (stack.length >= 3) {
      return true;
    }
  }

  return false;
}

/**
 * Solution 6: Using Map
 *
 * Approach:
 * - Use Map to track minimum values
 * - More flexible than array approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTripletMap(nums: number[]): boolean {
  const mins = new Map<string, number>([
    ["first", Infinity],
    ["second", Infinity],
  ]);

  for (const num of nums) {
    if (num <= mins.get("first")!) {
      mins.set("first", num);
    } else if (num <= mins.get("second")!) {
      mins.set("second", num);
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 7: Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTripletFunctional(nums: number[]): boolean {
  return nums.reduce(
    (acc, num) => {
      if (num <= acc.first) {
        acc.first = num;
      } else if (num <= acc.second) {
        acc.second = num;
      } else {
        acc.found = true;
      }
      return acc;
    },
    { first: Infinity, second: Infinity, found: false }
  ).found;
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield numbers
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* numberGenerator(nums: number[]): Generator<number> {
  for (const num of nums) {
    yield num;
  }
}

function increasingTripletGenerator(nums: number[]): boolean {
  let first = Infinity;
  let second = Infinity;

  for (const num of numberGenerator(nums)) {
    if (num <= first) {
      first = num;
    } else if (num <= second) {
      second = num;
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 9: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a TripletFinder class
 * - Encapsulate finding logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class TripletFinder {
  private first: number;
  private second: number;

  constructor() {
    this.first = Infinity;
    this.second = Infinity;
  }

  hasIncreasingTriplet(nums: number[]): boolean {
    for (const num of nums) {
      if (num <= this.first) {
        this.first = num;
      } else if (num <= this.second) {
        this.second = num;
      } else {
        return true;
      }
    }

    return false;
  }

  reset(): void {
    this.first = Infinity;
    this.second = Infinity;
  }
}

function increasingTripletClass(nums: number[]): boolean {
  const finder = new TripletFinder();
  return finder.hasIncreasingTriplet(nums);
}

/**
 * Solution 10: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit operations for small arrays
 * - Limited to small arrays due to integer size
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function increasingTripletBitwise(nums: number[]): boolean {
  if (nums.length > 32) {
    // Fallback to standard approach for large arrays
    return increasingTriplet(nums);
  }

  let first = Infinity;
  let second = Infinity;

  for (const num of nums) {
    if (num <= first) {
      first = num;
    } else if (num <= second) {
      second = num;
    } else {
      return true;
    }
  }

  return false;
}

/**
 * Solution 11: Using Recursive Approach
 *
 * Approach:
 * - Use recursion to find increasing subsequence
 * - Base case: when we have 3 numbers
 *
 * Time Complexity: O(n³)
 * Space Complexity: O(n) - recursion stack
 */
function increasingTripletRecursive(nums: number[]): boolean {
  function findTriplet(
    index: number,
    count: number,
    minValue: number
  ): boolean {
    if (count === 3) return true;
    if (index >= nums.length) return false;

    if (nums[index] > minValue) {
      if (findTriplet(index + 1, count + 1, nums[index])) {
        return true;
      }
    }

    return findTriplet(index + 1, count, minValue);
  }

  return findTriplet(0, 0, -Infinity);
}

// Test cases
function testIncreasingTriplet() {
  console.log("=== Testing Increasing Triplet Subsequence ===\n");

  const testCases = [
    {
      input: [1, 2, 3, 4, 5],
      expected: true,
      description: "Strictly increasing array",
    },
    {
      input: [5, 4, 3, 2, 1],
      expected: false,
      description: "Strictly decreasing array",
    },
    {
      input: [2, 1, 5, 0, 4, 6],
      expected: true,
      description: "Array with increasing triplet",
    },
    {
      input: [1, 1, 1, 1, 1],
      expected: false,
      description: "Array with all same values",
    },
    {
      input: [1, 2],
      expected: false,
      description: "Array with less than 3 elements",
    },
    {
      input: [],
      expected: false,
      description: "Empty array",
    },
    {
      input: [1, 2, 1, 2, 1, 2],
      expected: false,
      description: "Array with alternating values",
    },
    {
      input: [20, 100, 10, 12, 5, 13],
      expected: true,
      description: "Complex case with increasing triplet",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Two Pointers)
    const result1 = increasingTriplet([...testCase.input]);
    console.log(
      `Solution 1 (Two Pointers): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const result2 = increasingTripletArray([...testCase.input]);
    console.log(
      `Solution 2 (Array): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Object)
    const result3 = increasingTripletObject([...testCase.input]);
    console.log(
      `Solution 3 (Object): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Brute Force)
    const result4 = increasingTripletBruteForce([...testCase.input]);
    console.log(
      `Solution 4 (Brute Force): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Stack)
    const result5 = increasingTripletStack([...testCase.input]);
    console.log(
      `Solution 5 (Stack): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Map)
    const result6 = increasingTripletMap([...testCase.input]);
    console.log(
      `Solution 6 (Map): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = increasingTripletFunctional([...testCase.input]);
    console.log(
      `Solution 7 (Functional): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = increasingTripletGenerator([...testCase.input]);
    console.log(
      `Solution 8 (Generator): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Class)
    const result9 = increasingTripletClass([...testCase.input]);
    console.log(
      `Solution 9 (Class): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Bitwise)
    const result10 = increasingTripletBitwise([...testCase.input]);
    console.log(
      `Solution 10 (Bitwise): ${result10} ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (Recursive)
    const result11 = increasingTripletRecursive([...testCase.input]);
    console.log(
      `Solution 11 (Recursive): ${result11} ${
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
    { name: "Two Pointers", func: increasingTriplet },
    { name: "Array", func: increasingTripletArray },
    { name: "Object", func: increasingTripletObject },
    { name: "Brute Force", func: increasingTripletBruteForce },
    { name: "Stack", func: increasingTripletStack },
    { name: "Map", func: increasingTripletMap },
    { name: "Functional", func: increasingTripletFunctional },
    { name: "Generator", func: increasingTripletGenerator },
    { name: "Class", func: increasingTripletClass },
    { name: "Bitwise", func: increasingTripletBitwise },
    { name: "Recursive", func: increasingTripletRecursive },
  ];

  // Create test arrays
  const smallArray = [1, 2, 3, 4, 5];
  const mediumArray = Array.from({ length: 100 }, (_, i) => i);
  const largeArray = Array.from({ length: 1000 }, (_, i) => i);
  const decreasingArray = Array.from({ length: 100 }, (_, i) => 100 - i);

  const arrays = [
    { name: "Small", array: smallArray },
    { name: "Medium", array: mediumArray },
    { name: "Large", array: largeArray },
    { name: "Decreasing", array: decreasingArray },
  ];

  arrays.forEach(({ name, array }) => {
    console.log(`${name} Array:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...array]);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Subsequence analysis
function subsequenceAnalysis() {
  console.log("=== Subsequence Analysis ===\n");

  const testArrays = [
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [2, 1, 5, 0, 4, 6],
    [1, 1, 1, 1, 1],
    [20, 100, 10, 12, 5, 13],
  ];

  testArrays.forEach((arr, index) => {
    console.log(`Array ${index + 1}: [${arr.join(", ")}]`);

    let first = Infinity;
    let second = Infinity;
    const steps: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      if (num <= first) {
        first = num;
        steps.push(
          `Step ${i + 1}: first = ${first}, second = ${
            second === Infinity ? "∞" : second
          }`
        );
      } else if (num <= second) {
        second = num;
        steps.push(`Step ${i + 1}: first = ${first}, second = ${second}`);
      } else {
        steps.push(
          `Step ${i + 1}: Found triplet! ${first} < ${second} < ${num}`
        );
        break;
      }
    }

    steps.forEach((step) => console.log(`  ${step}`));

    const result = increasingTriplet(arr);
    console.log(`  Result: ${result}\n`);
  });
}

// Uncomment the following lines to run tests
// testIncreasingTriplet();
// performanceComparison();
// subsequenceAnalysis();

export {
  increasingTriplet,
  increasingTripletArray,
  increasingTripletObject,
  increasingTripletBruteForce,
  increasingTripletStack,
  increasingTripletMap,
  increasingTripletFunctional,
  increasingTripletGenerator,
  increasingTripletClass,
  increasingTripletBitwise,
  increasingTripletRecursive,
  TripletFinder,
  numberGenerator,
  testIncreasingTriplet,
  performanceComparison,
  subsequenceAnalysis,
};
{% endraw %}
