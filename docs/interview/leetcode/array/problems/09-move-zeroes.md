---
layout: page
title: "Move Zeroe"
difficulty: Easy
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/move-zeroe/"
---

# Move Zeroe

**LeetCode Problem # * 283. Move Zeroes**

## Problem Description

 * Given an integer array nums, move all 0's to the end of it while maintaining  * the relative order of the non-zero elements.  *  * Note that you must do this in-place without making a copy of the array.  * 

## Solutions

{% raw %}
/**
 * 283. Move Zeroes
 *
 * Problem:
 * Given an integer array nums, move all 0's to the end of it while maintaining
 * the relative order of the non-zero elements.
 *
 * Note that you must do this in-place without making a copy of the array.
 *
 * Example:
 * Input: nums = [0,1,0,3,12]
 * Output: [1,3,12,0,0]
 *
 * Input: nums = [0]
 * Output: [0]
 *
 * LeetCode: https://leetcode.com/problems/move-zeroes/
 */

/**
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Use two pointers: one for writing position, one for reading
 * - Move non-zero elements to front, fill remaining with zeros
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroes(nums: number[]): void {
  let writeIndex = 0;

  // Move all non-zero elements to the front
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  // Fill remaining positions with zeros
  for (let i = writeIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
}

/**
 * Solution 2: Swap Approach
 *
 * Approach:
 * - Use two pointers and swap non-zero elements
 * - Maintain relative order by swapping
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroesSwap(nums: number[]): void {
  let nonZeroIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // Swap current element with element at nonZeroIndex
      [nums[nonZeroIndex], nums[i]] = [nums[i], nums[nonZeroIndex]];
      nonZeroIndex++;
    }
  }
}

/**
 * Solution 3: Using Filter and Fill
 *
 * Approach:
 * - Filter non-zero elements and fill remaining with zeros
 * - More functional approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroesFilter(nums: number[]): void {
  const nonZeros = nums.filter((num) => num !== 0);
  const zeroCount = nums.length - nonZeros.length;

  // Copy non-zero elements back
  for (let i = 0; i < nonZeros.length; i++) {
    nums[i] = nonZeros[i];
  }

  // Fill with zeros
  for (let i = nonZeros.length; i < nums.length; i++) {
    nums[i] = 0;
  }
}

/**
 * Solution 4: Using Reduce (Functional)
 *
 * Approach:
 * - Use reduce to collect non-zero elements
 * - Fill remaining positions with zeros
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroesReduce(nums: number[]): void {
  const nonZeros = nums.reduce((acc: number[], num: number) => {
    if (num !== 0) acc.push(num);
    return acc;
  }, []);

  // Copy non-zero elements back
  for (let i = 0; i < nonZeros.length; i++) {
    nums[i] = nonZeros[i];
  }

  // Fill with zeros
  for (let i = nonZeros.length; i < nums.length; i++) {
    nums[i] = 0;
  }
}

/**
 * Solution 5: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield non-zero elements
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* nonZeroGenerator(nums: number[]): Generator<number> {
  for (const num of nums) {
    if (num !== 0) {
      yield num;
    }
  }
}

function moveZeroesGenerator(nums: number[]): void {
  const nonZeros = Array.from(nonZeroGenerator(nums));

  // Copy non-zero elements back
  for (let i = 0; i < nonZeros.length; i++) {
    nums[i] = nonZeros[i];
  }

  // Fill with zeros
  for (let i = nonZeros.length; i < nums.length; i++) {
    nums[i] = 0;
  }
}

/**
 * Solution 6: Using Array Methods (One-liner)
 *
 * Approach:
 * - Use array methods to achieve the result
 * - Simple but less efficient
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function moveZeroesArrayMethods(nums: number[]): void {
  const nonZeros = nums.filter((num) => num !== 0);
  const zeros = new Array(nums.length - nonZeros.length).fill(0);
  const result = [...nonZeros, ...zeros];

  // Copy back to original array
  for (let i = 0; i < nums.length; i++) {
    nums[i] = result[i];
  }
}

/**
 * Solution 7: Using Queue (Educational)
 *
 * Approach:
 * - Use queue to store non-zero elements
 * - Dequeue and fill array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function moveZeroesQueue(nums: number[]): void {
  const queue: number[] = [];

  // Enqueue non-zero elements
  for (const num of nums) {
    if (num !== 0) {
      queue.push(num);
    }
  }

  // Fill array with non-zero elements
  for (let i = 0; i < queue.length; i++) {
    nums[i] = queue[i];
  }

  // Fill remaining with zeros
  for (let i = queue.length; i < nums.length; i++) {
    nums[i] = 0;
  }
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a ZeroMover class
 * - Encapsulate the logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class ZeroMover {
  private nums: number[];

  constructor(nums: number[]) {
    this.nums = nums;
  }

  moveZeroes(): void {
    let writeIndex = 0;

    // Move all non-zero elements to the front
    for (let i = 0; i < this.nums.length; i++) {
      if (this.nums[i] !== 0) {
        this.nums[writeIndex] = this.nums[i];
        writeIndex++;
      }
    }

    // Fill remaining positions with zeros
    for (let i = writeIndex; i < this.nums.length; i++) {
      this.nums[i] = 0;
    }
  }

  getArray(): number[] {
    return [...this.nums];
  }
}

function moveZeroesClass(nums: number[]): void {
  const mover = new ZeroMover(nums);
  mover.moveZeroes();
}

/**
 * Solution 9: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit operations to track non-zero positions
 * - Limited to small arrays due to integer size
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function moveZeroesBitwise(nums: number[]): void {
  if (nums.length > 32) {
    // Fallback to standard approach for large arrays
    moveZeroes(nums);
    return;
  }

  let nonZeroMask = 0;

  // Create mask of non-zero positions
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nonZeroMask |= 1 << i;
    }
  }

  // Reconstruct array
  let writeIndex = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nonZeroMask & (1 << i)) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  // Fill with zeros
  for (let i = writeIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// Test cases
function testMoveZeroes() {
  console.log("=== Testing Move Zeroes ===\n");

  const testCases = [
    {
      input: [0, 1, 0, 3, 12],
      expected: [1, 3, 12, 0, 0],
      description: "Standard case with multiple zeros",
    },
    {
      input: [0],
      expected: [0],
      description: "Single zero",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5],
      description: "No zeros",
    },
    {
      input: [0, 0, 0, 0],
      expected: [0, 0, 0, 0],
      description: "All zeros",
    },
    {
      input: [1, 0, 0, 0, 2],
      expected: [1, 2, 0, 0, 0],
      description: "Zeros in middle",
    },
    {
      input: [0, 0, 1, 2, 3],
      expected: [1, 2, 3, 0, 0],
      description: "Zeros at beginning",
    },
    {
      input: [1, 2, 3, 0, 0],
      expected: [1, 2, 3, 0, 0],
      description: "Zeros at end",
    },
    {
      input: [],
      expected: [],
      description: "Empty array",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Two Pointers)
    const nums1 = [...testCase.input];
    moveZeroes(nums1);
    console.log(
      `Solution 1 (Two Pointers): [${nums1.join(", ")}] ${
        JSON.stringify(nums1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Swap)
    const nums2 = [...testCase.input];
    moveZeroesSwap(nums2);
    console.log(
      `Solution 2 (Swap): [${nums2.join(", ")}] ${
        JSON.stringify(nums2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Filter)
    const nums3 = [...testCase.input];
    moveZeroesFilter(nums3);
    console.log(
      `Solution 3 (Filter): [${nums3.join(", ")}] ${
        JSON.stringify(nums3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Reduce)
    const nums4 = [...testCase.input];
    moveZeroesReduce(nums4);
    console.log(
      `Solution 4 (Reduce): [${nums4.join(", ")}] ${
        JSON.stringify(nums4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Generator)
    const nums5 = [...testCase.input];
    moveZeroesGenerator(nums5);
    console.log(
      `Solution 5 (Generator): [${nums5.join(", ")}] ${
        JSON.stringify(nums5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Array Methods)
    const nums6 = [...testCase.input];
    moveZeroesArrayMethods(nums6);
    console.log(
      `Solution 6 (Array Methods): [${nums6.join(", ")}] ${
        JSON.stringify(nums6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Queue)
    const nums7 = [...testCase.input];
    moveZeroesQueue(nums7);
    console.log(
      `Solution 7 (Queue): [${nums7.join(", ")}] ${
        JSON.stringify(nums7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const nums8 = [...testCase.input];
    moveZeroesClass(nums8);
    console.log(
      `Solution 8 (Class): [${nums8.join(", ")}] ${
        JSON.stringify(nums8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Bitwise)
    const nums9 = [...testCase.input];
    moveZeroesBitwise(nums9);
    console.log(
      `Solution 9 (Bitwise): [${nums9.join(", ")}] ${
        JSON.stringify(nums9) === JSON.stringify(testCase.expected)
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
    { name: "Two Pointers", func: moveZeroes },
    { name: "Swap", func: moveZeroesSwap },
    { name: "Filter", func: moveZeroesFilter },
    { name: "Reduce", func: moveZeroesReduce },
    { name: "Generator", func: moveZeroesGenerator },
    { name: "Array Methods", func: moveZeroesArrayMethods },
    { name: "Queue", func: moveZeroesQueue },
    { name: "Class", func: moveZeroesClass },
    { name: "Bitwise", func: moveZeroesBitwise },
  ];

  // Create test arrays
  const smallArray = [0, 1, 0, 3, 12];
  const largeArray = Array.from({ length: 10000 }, (_, i) =>
    i % 3 === 0 ? 0 : i
  );
  const allZerosArray = new Array(1000).fill(0);

  const arrays = [
    { name: "Small", array: smallArray },
    { name: "Large", array: largeArray },
    { name: "All Zeros", array: allZerosArray },
  ];

  arrays.forEach(({ name, array }) => {
    console.log(`${name} Array:`);

    testCases.forEach(({ name: funcName, func }) => {
      const testArray = [...array];
      const start = performance.now();
      func(testArray);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms`);
    });

    console.log("");
  });
}

// Zero distribution analysis
function zeroDistributionAnalysis() {
  console.log("=== Zero Distribution Analysis ===\n");

  const testArrays = [
    [0, 1, 0, 3, 12],
    [1, 0, 0, 0, 2],
    [0, 0, 1, 2, 3],
    [1, 2, 3, 0, 0],
    [0, 0, 0, 0],
    [1, 2, 3, 4, 5],
  ];

  testArrays.forEach((arr, index) => {
    console.log(`Array ${index + 1}: [${arr.join(", ")}]`);

    const zeroCount = arr.filter((num) => num === 0).length;
    const nonZeroCount = arr.length - zeroCount;

    console.log(
      `  Zeros: ${zeroCount} (${((zeroCount / arr.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `  Non-zeros: ${nonZeroCount} (${(
        (nonZeroCount / arr.length) *
        100
      ).toFixed(1)}%)`
    );

    const result = [...arr];
    moveZeroes(result);
    console.log(`  Result: [${result.join(", ")}]`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testMoveZeroes();
// performanceComparison();
// zeroDistributionAnalysis();

export {
  moveZeroes,
  moveZeroesSwap,
  moveZeroesFilter,
  moveZeroesReduce,
  moveZeroesGenerator,
  moveZeroesArrayMethods,
  moveZeroesQueue,
  moveZeroesClass,
  moveZeroesBitwise,
  ZeroMover,
  nonZeroGenerator,
  testMoveZeroes,
  performanceComparison,
  zeroDistributionAnalysis,
};
{% endraw %}
