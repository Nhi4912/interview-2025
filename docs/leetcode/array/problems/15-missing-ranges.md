---
layout: page
title: "Missing Range"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Hash Table, Binary Search]
leetcode_url: "https://leetcode.com/problems/missing-range/"
---

# Missing Range

**LeetCode Problem # * 163. Missing Ranges**

## Problem Description

 * You are given an inclusive range [lower, upper] and a sorted unique integer  * array nums, where all elements are in the inclusive range.  *  * A number x is considered missing if x is in the range [lower, upper] and x is  * not in nums. 

## Solutions

{% raw %}
/**
 * 163. Missing Ranges
 *
 * Problem:
 * You are given an inclusive range [lower, upper] and a sorted unique integer
 * array nums, where all elements are in the inclusive range.
 *
 * A number x is considered missing if x is in the range [lower, upper] and x is
 * not in nums.
 *
 * Return the shortest sorted list of ranges that exactly covers all the missing
 * numbers. That is, no element of nums is included in any of the ranges, and each
 * missing number is covered by one of the ranges.
 *
 * Example:
 * Input: nums = [0,1,3,50,75], lower = 0, upper = 99
 * Output: ["2","4->49","51->74","76->99"]
 *
 * Input: nums = [-1], lower = -1, upper = -1
 * Output: []
 *
 * LeetCode: https://leetcode.com/problems/missing-ranges/
 */

/**
 * Solution 1: Linear Scan (Optimal)
 *
 * Approach:
 * - Scan through the array and check gaps between numbers
 * - Handle edge cases for lower and upper bounds
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - excluding result space
 */
function findMissingRanges(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];

  // Handle empty array
  if (nums.length === 0) {
    if (lower <= upper) {
      result.push(formatRange(lower, upper));
    }
    return result;
  }

  // Check range before first number
  if (lower < nums[0]) {
    result.push(formatRange(lower, nums[0] - 1));
  }

  // Check ranges between numbers
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] > 1) {
      result.push(formatRange(nums[i] + 1, nums[i + 1] - 1));
    }
  }

  // Check range after last number
  if (nums[nums.length - 1] < upper) {
    result.push(formatRange(nums[nums.length - 1] + 1, upper));
  }

  return result;
}

/**
 * Solution 2: Using Array Methods
 *
 * Approach:
 * - Use array methods to process the array
 * - More functional approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function findMissingRangesArray(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];

  // Add bounds to array for easier processing
  const extendedNums = [lower - 1, ...nums, upper + 1];

  // Find gaps between consecutive numbers
  for (let i = 0; i < extendedNums.length - 1; i++) {
    const start = extendedNums[i] + 1;
    const end = extendedNums[i + 1] - 1;

    if (start <= end) {
      result.push(formatRange(start, end));
    }
  }

  return result;
}

/**
 * Solution 3: Using Map
 *
 * Approach:
 * - Use Map to track existing numbers
 * - Check each number in range
 *
 * Time Complexity: O(upper - lower)
 * Space Complexity: O(n)
 */
function findMissingRangesMap(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];
  const numSet = new Map<number, boolean>();

  // Add all numbers to map
  for (const num of nums) {
    numSet.set(num, true);
  }

  let start = lower;
  let end = lower;

  // Scan through the range
  for (let i = lower; i <= upper; i++) {
    if (!numSet.has(i)) {
      end = i;
    } else {
      if (start <= end) {
        result.push(formatRange(start, end));
      }
      start = i + 1;
      end = i + 1;
    }
  }

  // Handle last range
  if (start <= end) {
    result.push(formatRange(start, end));
  }

  return result;
}

/**
 * Solution 4: Using Set
 *
 * Approach:
 * - Use Set to track existing numbers
 * - Similar to Map approach but with Set
 *
 * Time Complexity: O(upper - lower)
 * Space Complexity: O(n)
 */
function findMissingRangesSet(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];
  const numSet = new Set(nums);

  let start = lower;
  let end = lower;

  // Scan through the range
  for (let i = lower; i <= upper; i++) {
    if (!numSet.has(i)) {
      end = i;
    } else {
      if (start <= end) {
        result.push(formatRange(start, end));
      }
      start = i + 1;
      end = i + 1;
    }
  }

  // Handle last range
  if (start <= end) {
    result.push(formatRange(start, end));
  }

  return result;
}

/**
 * Solution 5: Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function findMissingRangesFunctional(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  if (nums.length === 0) {
    return lower <= upper ? [formatRange(lower, upper)] : [];
  }

  const extendedNums = [lower - 1, ...nums, upper + 1];

  return extendedNums
    .slice(0, -1)
    .map((num, i) => [num + 1, extendedNums[i + 1] - 1])
    .filter(([start, end]) => start <= end)
    .map(([start, end]) => formatRange(start, end));
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield missing ranges
 * - Memory efficient for large ranges
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* missingRangesGenerator(
  nums: number[],
  lower: number,
  upper: number
): Generator<string> {
  if (nums.length === 0) {
    if (lower <= upper) {
      yield formatRange(lower, upper);
    }
    return;
  }

  // Check range before first number
  if (lower < nums[0]) {
    yield formatRange(lower, nums[0] - 1);
  }

  // Check ranges between numbers
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] > 1) {
      yield formatRange(nums[i] + 1, nums[i + 1] - 1);
    }
  }

  // Check range after last number
  if (nums[nums.length - 1] < upper) {
    yield formatRange(nums[nums.length - 1] + 1, upper);
  }
}

function findMissingRangesWithGenerator(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  return Array.from(missingRangesGenerator(nums, lower, upper));
}

/**
 * Solution 7: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a MissingRangesFinder class
 * - Encapsulate finding logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class MissingRangesFinder {
  private nums: number[];
  private lower: number;
  private upper: number;

  constructor(nums: number[], lower: number, upper: number) {
    this.nums = nums;
    this.lower = lower;
    this.upper = upper;
  }

  findMissingRanges(): string[] {
    const result: string[] = [];

    if (this.nums.length === 0) {
      if (this.lower <= this.upper) {
        result.push(this.formatRange(this.lower, this.upper));
      }
      return result;
    }

    // Check range before first number
    if (this.lower < this.nums[0]) {
      result.push(this.formatRange(this.lower, this.nums[0] - 1));
    }

    // Check ranges between numbers
    for (let i = 0; i < this.nums.length - 1; i++) {
      if (this.nums[i + 1] - this.nums[i] > 1) {
        result.push(this.formatRange(this.nums[i] + 1, this.nums[i + 1] - 1));
      }
    }

    // Check range after last number
    if (this.nums[this.nums.length - 1] < this.upper) {
      result.push(
        this.formatRange(this.nums[this.nums.length - 1] + 1, this.upper)
      );
    }

    return result;
  }

  private formatRange(start: number, end: number): string {
    return start === end ? start.toString() : `${start}->${end}`;
  }
}

function findMissingRangesClass(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const finder = new MissingRangesFinder(nums, lower, upper);
  return finder.findMissingRanges();
}

/**
 * Solution 8: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to track current position and next number
 * - More explicit control over the process
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function findMissingRangesTwoPointers(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];
  let current = lower;
  let index = 0;

  while (current <= upper) {
    if (index < nums.length && nums[index] === current) {
      current++;
      index++;
    } else {
      let end = current;
      while (end <= upper && (index >= nums.length || nums[index] > end)) {
        end++;
      }
      result.push(formatRange(current, end - 1));
      current = end;
    }
  }

  return result;
}

/**
 * Solution 9: Using Binary Search (Educational)
 *
 * Approach:
 * - Use binary search to find missing ranges
 * - More complex but shows binary search application
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(1)
 */
function findMissingRangesBinarySearch(
  nums: number[],
  lower: number,
  upper: number
): string[] {
  const result: string[] = [];

  // Find first missing number
  let start = lower;
  while (start <= upper) {
    const found = binarySearch(nums, start);
    if (found) {
      start++;
    } else {
      break;
    }
  }

  if (start > upper) return result;

  // Find ranges
  let end = start;
  while (end <= upper) {
    const found = binarySearch(nums, end);
    if (found) {
      result.push(formatRange(start, end - 1));
      start = end + 1;
      while (start <= upper && binarySearch(nums, start)) {
        start++;
      }
      end = start;
    } else {
      end++;
    }
  }

  if (start <= upper) {
    result.push(formatRange(start, upper));
  }

  return result;
}

function binarySearch(nums: number[], target: number): boolean {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return true;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}

// Helper functions
function formatRange(start: number, end: number): string {
  return start === end ? start.toString() : `${start}->${end}`;
}

// Test cases
function testMissingRanges() {
  console.log("=== Testing Missing Ranges ===\n");

  const testCases = [
    {
      nums: [0, 1, 3, 50, 75],
      lower: 0,
      upper: 99,
      expected: ["2", "4->49", "51->74", "76->99"],
      description: "Standard case with multiple ranges",
    },
    {
      nums: [-1],
      lower: -1,
      upper: -1,
      expected: [],
      description: "Single number matching bounds",
    },
    {
      nums: [],
      lower: 1,
      upper: 1,
      expected: ["1"],
      description: "Empty array with single number range",
    },
    {
      nums: [],
      lower: -3,
      upper: -1,
      expected: ["-3->-1"],
      description: "Empty array with negative range",
    },
    {
      nums: [1, 3, 5, 7],
      lower: 0,
      upper: 9,
      expected: ["0", "2", "4", "6", "8->9"],
      description: "Alternating numbers",
    },
    {
      nums: [1, 2, 3, 4, 5],
      lower: 1,
      upper: 5,
      expected: [],
      description: "No missing numbers",
    },
    {
      nums: [1, 2, 3, 4, 5],
      lower: 0,
      upper: 6,
      expected: ["0", "6"],
      description: "Missing numbers at bounds",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: nums = [${testCase.nums.join(", ")}], lower = ${
        testCase.lower
      }, upper = ${testCase.upper}`
    );
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Linear Scan)
    const result1 = findMissingRanges(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 1 (Linear Scan): [${result1.join(", ")}] ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Array Methods)
    const result2 = findMissingRangesArray(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 2 (Array Methods): [${result2.join(", ")}] ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Map)
    const result3 = findMissingRangesMap(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 3 (Map): [${result3.join(", ")}] ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Set)
    const result4 = findMissingRangesSet(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 4 (Set): [${result4.join(", ")}] ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Functional)
    const result5 = findMissingRangesFunctional(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 5 (Functional): [${result5.join(", ")}] ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = findMissingRangesWithGenerator(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 6 (Generator): [${result6.join(", ")}] ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Class)
    const result7 = findMissingRangesClass(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 7 (Class): [${result7.join(", ")}] ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Two Pointers)
    const result8 = findMissingRangesTwoPointers(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 8 (Two Pointers): [${result8.join(", ")}] ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Binary Search)
    const result9 = findMissingRangesBinarySearch(
      [...testCase.nums],
      testCase.lower,
      testCase.upper
    );
    console.log(
      `Solution 9 (Binary Search): [${result9.join(", ")}] ${
        JSON.stringify(result9) === JSON.stringify(testCase.expected)
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
    { name: "Linear Scan", func: findMissingRanges },
    { name: "Array Methods", func: findMissingRangesArray },
    { name: "Map", func: findMissingRangesMap },
    { name: "Set", func: findMissingRangesSet },
    { name: "Functional", func: findMissingRangesFunctional },
    { name: "Generator", func: findMissingRangesWithGenerator },
    { name: "Class", func: findMissingRangesClass },
    { name: "Two Pointers", func: findMissingRangesTwoPointers },
    { name: "Binary Search", func: findMissingRangesBinarySearch },
  ];

  // Create test cases
  const smallCase = { nums: [0, 1, 3, 50, 75], lower: 0, upper: 99 };
  const mediumCase = {
    nums: Array.from({ length: 100 }, (_, i) => i * 2),
    lower: 0,
    upper: 200,
  };
  const largeCase = {
    nums: Array.from({ length: 1000 }, (_, i) => i * 3),
    lower: 0,
    upper: 3000,
  };

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...testCase.nums], testCase.lower, testCase.upper);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${result.length} ranges)`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testMissingRanges();
// performanceComparison();

export {
  findMissingRanges,
  findMissingRangesArray,
  findMissingRangesMap,
  findMissingRangesSet,
  findMissingRangesFunctional,
  findMissingRangesWithGenerator,
  findMissingRangesClass,
  findMissingRangesTwoPointers,
  findMissingRangesBinarySearch,
  MissingRangesFinder,
  missingRangesGenerator,
  formatRange,
  binarySearch,
  testMissingRanges,
  performanceComparison,
};
{% endraw %}
