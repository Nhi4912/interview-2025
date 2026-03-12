---
layout: page
title: "Rotate Array"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/rotate-array/"
---

# Rotate Array

**LeetCode Problem # * 189. Rotate Array**

## Problem Description

 * Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.  *  * Input: nums = [1,2,3,4,5,6,7], k = 3  * Output: [5,6,7,1,2,3,4]  * Explanation: 

## Solutions

{% raw %}
/**
 * 189. Rotate Array
 *
 * Problem:
 * Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.
 *
 * Example:
 * Input: nums = [1,2,3,4,5,6,7], k = 3
 * Output: [5,6,7,1,2,3,4]
 * Explanation:
 * rotate 1 steps to the right: [7,1,2,3,4,5,6]
 * rotate 2 steps to the right: [6,7,1,2,3,4,5]
 * rotate 3 steps to the right: [5,6,7,1,2,3,4]
 *
 * Input: nums = [-1,-100,3,99], k = 2
 * Output: [3,99,-1,-100]
 *
 * LeetCode: https://leetcode.com/problems/rotate-array/
 */

/**
 * Solution 1: Using Extra Array (Simple but not in-place)
 *
 * Approach:
 * - Create a new array to store the rotated elements
 * - Copy elements to their new positions
 * - Copy back to original array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - requires extra array
 */
function rotateWithExtraArray(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  // Handle cases where k > n
  k = k % n;
  if (k === 0) return;

  const rotated = new Array(n);

  // Copy elements to their new positions
  for (let i = 0; i < n; i++) {
    rotated[(i + k) % n] = nums[i];
  }

  // Copy back to original array
  for (let i = 0; i < n; i++) {
    nums[i] = rotated[i];
  }
}

/**
 * Solution 2: Juggling Algorithm (In-place)
 *
 * Approach:
 * - Move elements in groups of GCD(n, k)
 * - Use temporary variable to store elements during rotation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - in-place
 */
function rotateJuggling(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  k = k % n;
  if (k === 0) return;

  // Calculate GCD
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const cycles = gcd(n, k);

  for (let i = 0; i < cycles; i++) {
    let current = i;
    let prev = nums[i];

    do {
      const next = (current + k) % n;
      const temp = nums[next];
      nums[next] = prev;
      prev = temp;
      current = next;
    } while (current !== i);
  }
}

/**
 * Solution 3: Reverse Algorithm (Optimal - In-place)
 *
 * Approach:
 * - Reverse the entire array
 * - Reverse first k elements
 * - Reverse remaining n-k elements
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - in-place
 */
function rotateReverse(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  k = k % n;
  if (k === 0) return;

  // Reverse helper function
  const reverse = (start: number, end: number): void => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  // Reverse entire array
  reverse(0, n - 1);

  // Reverse first k elements
  reverse(0, k - 1);

  // Reverse remaining elements
  reverse(k, n - 1);
}

/**
 * Solution 4: Cyclic Replacements (In-place)
 *
 * Approach:
 * - Move each element to its final position in one go
 * - Use a temporary variable to store the element being moved
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - in-place
 */
function rotateCyclic(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  k = k % n;
  if (k === 0) return;

  let count = 0; // Number of elements moved

  for (let start = 0; count < n; start++) {
    let current = start;
    let prev = nums[start];

    do {
      const next = (current + k) % n;
      const temp = nums[next];
      nums[next] = prev;
      prev = temp;
      current = next;
      count++;
    } while (start !== current);
  }
}

/**
 * Solution 5: Using Array Methods (Not in-place, but clean)
 *
 * Approach:
 * - Use slice and concat to rotate the array
 * - More readable but not in-place
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - creates new arrays
 */
function rotateWithSlice(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  k = k % n;
  if (k === 0) return;

  const rotated = nums.slice(-k).concat(nums.slice(0, -k));

  // Copy back to original array
  for (let i = 0; i < n; i++) {
    nums[i] = rotated[i];
  }
}

/**
 * Solution 6: Brute Force (For comparison - not recommended)
 *
 * Approach:
 * - Rotate one step at a time
 * - Repeat k times
 *
 * Time Complexity: O(n * k)
 * Space Complexity: O(1) - in-place
 */
function rotateBruteForce(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;

  k = k % n;

  for (let i = 0; i < k; i++) {
    // Rotate by one step
    const last = nums[n - 1];
    for (let j = n - 1; j > 0; j--) {
      nums[j] = nums[j - 1];
    }
    nums[0] = last;
  }
}

// Test cases
function testRotateArray() {
  console.log("=== Testing Rotate Array ===\n");

  const testCases = [
    {
      input: [1, 2, 3, 4, 5, 6, 7],
      k: 3,
      expected: [5, 6, 7, 1, 2, 3, 4],
      description: "Basic rotation",
    },
    {
      input: [-1, -100, 3, 99],
      k: 2,
      expected: [3, 99, -1, -100],
      description: "Negative numbers",
    },
    {
      input: [1, 2, 3, 4, 5],
      k: 5,
      expected: [1, 2, 3, 4, 5],
      description: "Full rotation",
    },
    {
      input: [1, 2, 3],
      k: 0,
      expected: [1, 2, 3],
      description: "No rotation",
    },
    {
      input: [1],
      k: 10,
      expected: [1],
      description: "Single element",
    },
    {
      input: [],
      k: 5,
      expected: [],
      description: "Empty array",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input}], k = ${testCase.k}`);
    console.log(`Expected: [${testCase.expected}]\n`);

    // Test Solution 1 (Extra Array)
    const nums1 = [...testCase.input];
    rotateWithExtraArray(nums1, testCase.k);
    console.log(
      `Solution 1 (Extra Array): [${nums1}] ${
        JSON.stringify(nums1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Juggling)
    const nums2 = [...testCase.input];
    rotateJuggling(nums2, testCase.k);
    console.log(
      `Solution 2 (Juggling): [${nums2}] ${
        JSON.stringify(nums2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Reverse)
    const nums3 = [...testCase.input];
    rotateReverse(nums3, testCase.k);
    console.log(
      `Solution 3 (Reverse): [${nums3}] ${
        JSON.stringify(nums3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Cyclic)
    const nums4 = [...testCase.input];
    rotateCyclic(nums4, testCase.k);
    console.log(
      `Solution 4 (Cyclic): [${nums4}] ${
        JSON.stringify(nums4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Slice)
    const nums5 = [...testCase.input];
    rotateWithSlice(nums5, testCase.k);
    console.log(
      `Solution 5 (Slice): [${nums5}] ${
        JSON.stringify(nums5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Brute Force)
    const nums6 = [...testCase.input];
    rotateBruteForce(nums6, testCase.k);
    console.log(
      `Solution 6 (Brute Force): [${nums6}] ${
        JSON.stringify(nums6) === JSON.stringify(testCase.expected)
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

  // Create large array
  const largeArray = Array.from({ length: 100000 }, (_, i) => i);
  const k = 50000;

  const testCases = [
    { name: "Extra Array", func: rotateWithExtraArray },
    { name: "Juggling", func: rotateJuggling },
    { name: "Reverse", func: rotateReverse },
    { name: "Cyclic", func: rotateCyclic },
    { name: "Slice", func: rotateWithSlice },
  ];

  testCases.forEach(({ name, func }) => {
    const testArray = [...largeArray];
    const start = performance.now();
    func(testArray, k);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(
      `  Memory: ${
        name === "Extra Array" || name === "Slice" ? "O(n)" : "O(1)"
      }\n`
    );
  });
}

// Run tests
if (require.main === module) {
  testRotateArray();
  performanceComparison();
}

export {
  rotateWithExtraArray,
  rotateJuggling,
  rotateReverse,
  rotateCyclic,
  rotateWithSlice,
  rotateBruteForce,
};
{% endraw %}
