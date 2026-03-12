---
layout: page
title: "Single Number"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/single-number/"
---

# Single Number

**LeetCode Problem # * 136. Single Number**

## Problem Description

 * Given a non-empty array of integers nums, every element appears twice except for one.  * Find that single one.  *  * You must implement a solution with a linear runtime complexity and use only constant extra space.  * 

## Solutions

{% raw %}
/**
 * 136. Single Number
 *
 * Problem:
 * Given a non-empty array of integers nums, every element appears twice except for one.
 * Find that single one.
 *
 * You must implement a solution with a linear runtime complexity and use only constant extra space.
 *
 * Example:
 * Input: nums = [2,2,1]
 * Output: 1
 *
 * Input: nums = [4,1,2,1,2]
 * Output: 4
 *
 * Input: nums = [1]
 * Output: 1
 *
 * LeetCode: https://leetcode.com/problems/single-number/
 */

/**
 * Solution 1: XOR Operation (Optimal)
 *
 * Approach:
 * - Use XOR operation: a ^ a = 0, a ^ 0 = a
 * - XOR all numbers, duplicates cancel out
 * - Result is the single number
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function singleNumber(nums: number[]): number {
  let result = 0;

  for (const num of nums) {
    result ^= num;
  }

  return result;
}

/**
 * Solution 2: Using Set
 *
 * Approach:
 * - Add numbers to set, remove if already present
 * - Remaining number is the single one
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function singleNumberSet(nums: number[]): number {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      seen.delete(num);
    } else {
      seen.add(num);
    }
  }

  return Array.from(seen)[0];
}

/**
 * Solution 3: Using Map (Frequency counting)
 *
 * Approach:
 * - Count frequency of each number
 * - Find number with frequency 1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function singleNumberMap(nums: number[]): number {
  const frequency = new Map<number, number>();

  for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  for (const [num, count] of frequency) {
    if (count === 1) {
      return num;
    }
  }

  return -1; // Should not reach here
}

/**
 * Solution 4: Using Array Methods (Functional)
 *
 * Approach:
 * - Use filter to find number that appears only once
 *
 * Time Complexity: O(n²) - includes() is O(n)
 * Space Complexity: O(1)
 */
function singleNumberFunctional(nums: number[]): number {
  return nums.find((num) => nums.indexOf(num) === nums.lastIndexOf(num))!;
}

/**
 * Solution 5: Using Sort
 *
 * Approach:
 * - Sort array and check adjacent elements
 * - Single number will not have a pair
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(1) - assuming in-place sort
 */
function singleNumberSort(nums: number[]): number {
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i += 2) {
    if (i === nums.length - 1 || nums[i] !== nums[i + 1]) {
      return nums[i];
    }
  }

  return -1; // Should not reach here
}

/**
 * Solution 6: Using Object (Hash table)
 *
 * Approach:
 * - Use object to track frequency
 * - Find key with value 1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function singleNumberObject(nums: number[]): number {
  const frequency: { [key: number]: number } = {};

  for (const num of nums) {
    frequency[num] = (frequency[num] || 0) + 1;
  }

  for (const num in frequency) {
    if (frequency[num] === 1) {
      return parseInt(num);
    }
  }

  return -1; // Should not reach here
}

/**
 * Solution 7: Using Math (Sum approach)
 *
 * Approach:
 * - Calculate sum of all unique numbers * 2
 * - Subtract sum of all numbers
 * - Result is the single number
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function singleNumberMath(nums: number[]): number {
  const uniqueSum = Array.from(new Set(nums)).reduce(
    (sum, num) => sum + num,
    0
  );
  const totalSum = nums.reduce((sum, num) => sum + num, 0);

  return 2 * uniqueSum - totalSum;
}

/**
 * Solution 8: Using Bit Manipulation with Loop
 *
 * Approach:
 * - Check each bit position
 * - Count 1s at each position
 * - If count is odd, that bit is set in result
 *
 * Time Complexity: O(32 * n) = O(n)
 * Space Complexity: O(1)
 */
function singleNumberBitwise(nums: number[]): number {
  let result = 0;

  for (let i = 0; i < 32; i++) {
    let count = 0;

    for (const num of nums) {
      if ((num >> i) & 1) {
        count++;
      }
    }

    if (count % 2 === 1) {
      result |= 1 << i;
    }
  }

  return result;
}

// Test cases
function testSingleNumber() {
  console.log("=== Testing Single Number ===\n");

  const testCases = [
    {
      input: [2, 2, 1],
      expected: 1,
      description: "Basic case",
    },
    {
      input: [4, 1, 2, 1, 2],
      expected: 4,
      description: "Single number in middle",
    },
    {
      input: [1],
      expected: 1,
      description: "Single element",
    },
    {
      input: [1, 1, 2, 2, 3],
      expected: 3,
      description: "Single number at end",
    },
    {
      input: [1, 2, 2, 1, 3],
      expected: 3,
      description: "Single number in middle",
    },
    {
      input: [0, 1, 0, 1, 99],
      expected: 99,
      description: "Large single number",
    },
    {
      input: [-1, -1, -2],
      expected: -2,
      description: "Negative numbers",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (XOR)
    const result1 = singleNumber(testCase.input);
    console.log(
      `Solution 1 (XOR): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Set)
    const result2 = singleNumberSet(testCase.input);
    console.log(
      `Solution 2 (Set): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Map)
    const result3 = singleNumberMap(testCase.input);
    console.log(
      `Solution 3 (Map): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Functional)
    const result4 = singleNumberFunctional(testCase.input);
    console.log(
      `Solution 4 (Functional): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Sort)
    const result5 = singleNumberSort([...testCase.input]);
    console.log(
      `Solution 5 (Sort): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Object)
    const result6 = singleNumberObject(testCase.input);
    console.log(
      `Solution 6 (Object): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Math)
    const result7 = singleNumberMath(testCase.input);
    console.log(
      `Solution 7 (Math): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Bitwise)
    const result8 = singleNumberBitwise(testCase.input);
    console.log(
      `Solution 8 (Bitwise): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "XOR", func: singleNumber },
    { name: "Set", func: singleNumberSet },
    { name: "Map", func: singleNumberMap },
    { name: "Functional", func: singleNumberFunctional },
    { name: "Sort", func: singleNumberSort },
    { name: "Object", func: singleNumberObject },
    { name: "Math", func: singleNumberMath },
    { name: "Bitwise", func: singleNumberBitwise },
  ];

  // Create test arrays
  const smallArray = Array.from({ length: 1000 }, (_, i) => Math.floor(i / 2));
  const largeArray = Array.from({ length: 100000 }, (_, i) =>
    Math.floor(i / 2)
  );

  const arrays = [
    { name: "Small (1000)", array: smallArray },
    { name: "Large (100000)", array: largeArray },
  ];

  arrays.forEach(({ name, array }) => {
    console.log(`${name}:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...array]);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// XOR properties demonstration
function xorPropertiesDemo() {
  console.log("=== XOR Properties Demonstration ===\n");

  const a = 5;
  const b = 3;

  console.log(`a = ${a}, b = ${b}`);
  console.log(`a ^ a = ${a ^ a} (should be 0)`);
  console.log(`a ^ 0 = ${a ^ 0} (should be ${a})`);
  console.log(`a ^ b ^ a = ${a ^ b ^ a} (should be ${b})`);
  console.log(`a ^ b ^ b = ${a ^ b ^ b} (should be ${a})`);

  console.log("\nThis is why XOR works for finding single number:");
  console.log("- Duplicates cancel out: a ^ a = 0");
  console.log("- Single number remains: 0 ^ single = single");
}

// Uncomment the following lines to run tests
// testSingleNumber();
// performanceComparison();
// xorPropertiesDemo();

export {
  singleNumber,
  singleNumberSet,
  singleNumberMap,
  singleNumberFunctional,
  singleNumberSort,
  singleNumberObject,
  singleNumberMath,
  singleNumberBitwise,
  testSingleNumber,
  performanceComparison,
  xorPropertiesDemo,
};
{% endraw %}
