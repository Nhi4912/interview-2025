---
layout: page
title: "Merge Sorted Array"
difficulty: Easy
category: Sorting/Searching
tags: [Sorting/Searching, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/merge-sorted-array/"
---

# Merge Sorted Array

**LeetCode Problem # * 88. Merge Sorted Array**

## Problem Description

 * You are given two integer arrays nums1 and nums2, sorted in non-decreasing order,  * and two integers m and n, representing the number of elements in nums1 and nums2 respectively.  *  * Merge nums1 and nums2 into a single array sorted in non-decreasing order.  * The final sorted array should not be returned by the function, but instead be stored 

## Solutions

{% raw %}
/**
 * 88. Merge Sorted Array
 *
 * Problem:
 * You are given two integer arrays nums1 and nums2, sorted in non-decreasing order,
 * and two integers m and n, representing the number of elements in nums1 and nums2 respectively.
 *
 * Merge nums1 and nums2 into a single array sorted in non-decreasing order.
 * The final sorted array should not be returned by the function, but instead be stored
 * inside the array nums1. To accommodate this, nums1 has a length of m + n, where the
 * first m elements denote the elements that should be merged, and the last n elements
 * are set to 0 and should be ignored. nums2 has a length of n.
 *
 * Example:
 * Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
 * Output: [1,2,2,3,5,6]
 *
 * Input: nums1 = [1], m = 1, nums2 = [], n = 0
 * Output: [1]
 *
 * LeetCode: https://leetcode.com/problems/merge-sorted-array/
 */

/**
 * Solution 1: Merge from End (Optimal)
 *
 * Approach:
 * - Start from the end of both arrays
 * - Compare elements and place larger one at the end of nums1
 * - This avoids overwriting elements in nums1
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1) - in-place modification
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p1 = m - 1; // Pointer for nums1
  let p2 = n - 1; // Pointer for nums2
  let p = m + n - 1; // Pointer for merged array

  // Compare elements from end and place larger one
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }

  // If there are remaining elements in nums2, copy them
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }

  // Note: If there are remaining elements in nums1, they're already in place
}

/**
 * Solution 2: Merge from Start (Using Extra Space)
 *
 * Approach:
 * - Create a copy of nums1
 * - Merge into the copy, then copy back to nums1
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m) - extra space for copy
 */
function mergeWithExtraSpace(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  const nums1Copy = nums1.slice(0, m);
  let p1 = 0; // Pointer for nums1Copy
  let p2 = 0; // Pointer for nums2
  let p = 0; // Pointer for nums1

  while (p1 < m && p2 < n) {
    if (nums1Copy[p1] <= nums2[p2]) {
      nums1[p] = nums1Copy[p1];
      p1++;
    } else {
      nums1[p] = nums2[p2];
      p2++;
    }
    p++;
  }

  // Copy remaining elements from nums1Copy
  while (p1 < m) {
    nums1[p] = nums1Copy[p1];
    p1++;
    p++;
  }

  // Copy remaining elements from nums2
  while (p2 < n) {
    nums1[p] = nums2[p2];
    p2++;
    p++;
  }
}

/**
 * Solution 3: Using Array Methods (Not in-place)
 *
 * Approach:
 * - Use concat and sort methods
 * - Simple but not in-place
 *
 * Time Complexity: O((m + n) log(m + n)) - due to sorting
 * Space Complexity: O(m + n) - creates new array
 */
function mergeWithArrayMethods(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  const merged = nums1
    .slice(0, m)
    .concat(nums2)
    .sort((a, b) => a - b);

  for (let i = 0; i < merged.length; i++) {
    nums1[i] = merged[i];
  }
}

/**
 * Solution 4: Two Pointers with Gap Method
 *
 * Approach:
 * - Use gap method for merging
 * - More complex but shows different approach
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function mergeWithGap(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  // First, copy nums2 to the end of nums1
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }

  // Now merge using gap method
  let gap = Math.ceil((m + n) / 2);

  while (gap > 0) {
    let i = 0;
    let j = gap;

    while (j < m + n) {
      if (nums1[i] > nums1[j]) {
        [nums1[i], nums1[j]] = [nums1[j], nums1[i]];
      }
      i++;
      j++;
    }

    if (gap === 1) break;
    gap = Math.ceil(gap / 2);
  }
}

/**
 * Solution 5: Using Priority Queue (Overkill but educational)
 *
 * Approach:
 * - Use min heap to merge arrays
 * - Shows heap data structure usage
 *
 * Time Complexity: O((m + n) log(m + n))
 * Space Complexity: O(m + n)
 */
class MinHeap {
  private heap: number[] = [];

  insert(value: number): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  extractMin(): number {
    if (this.heap.length === 0) throw new Error("Heap is empty");

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return min;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;

      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild] < this.heap[smallest]
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild] < this.heap[smallest]
      ) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

function mergeWithHeap(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  const heap = new MinHeap();

  // Insert all elements into heap
  for (let i = 0; i < m; i++) {
    heap.insert(nums1[i]);
  }

  for (let i = 0; i < n; i++) {
    heap.insert(nums2[i]);
  }

  // Extract elements in sorted order
  for (let i = 0; i < m + n; i++) {
    nums1[i] = heap.extractMin();
  }
}

/**
 * Solution 6: Recursive Merge (Educational)
 *
 * Approach:
 * - Use recursion to merge arrays
 * - Shows recursive thinking
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m + n) - recursion stack
 */
function mergeRecursive(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
): void {
  function mergeHelper(p1: number, p2: number, p: number): void {
    if (p2 < 0) return; // nums2 is exhausted

    if (p1 >= 0 && nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      mergeHelper(p1 - 1, p2, p - 1);
    } else {
      nums1[p] = nums2[p2];
      mergeHelper(p1, p2 - 1, p - 1);
    }
  }

  mergeHelper(m - 1, n - 1, m + n - 1);
}

// Test cases
function testMergeSortedArray() {
  console.log("=== Testing Merge Sorted Array ===\n");

  const testCases = [
    {
      nums1: [1, 2, 3, 0, 0, 0],
      m: 3,
      nums2: [2, 5, 6],
      n: 3,
      expected: [1, 2, 2, 3, 5, 6],
      description: "Basic merge",
    },
    {
      nums1: [1],
      m: 1,
      nums2: [],
      n: 0,
      expected: [1],
      description: "Single element",
    },
    {
      nums1: [0],
      m: 0,
      nums2: [1],
      n: 1,
      expected: [1],
      description: "Empty nums1",
    },
    {
      nums1: [4, 5, 6, 0, 0, 0],
      m: 3,
      nums2: [1, 2, 3],
      n: 3,
      expected: [1, 2, 3, 4, 5, 6],
      description: "nums2 smaller than nums1",
    },
    {
      nums1: [1, 2, 3, 4, 5, 0, 0, 0],
      m: 5,
      nums2: [6, 7, 8],
      n: 3,
      expected: [1, 2, 3, 4, 5, 6, 7, 8],
      description: "nums2 larger than nums1",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: nums1 = [${testCase.nums1}], m = ${testCase.m}, nums2 = [${testCase.nums2}], n = ${testCase.n}`
    );
    console.log(`Expected: [${testCase.expected}]\n`);

    // Test Solution 1 (Merge from End)
    const nums1_1 = [...testCase.nums1];
    merge(nums1_1, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 1 (Merge from End): [${nums1_1}] ${
        JSON.stringify(nums1_1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Extra Space)
    const nums1_2 = [...testCase.nums1];
    mergeWithExtraSpace(nums1_2, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 2 (Extra Space): [${nums1_2}] ${
        JSON.stringify(nums1_2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Array Methods)
    const nums1_3 = [...testCase.nums1];
    mergeWithArrayMethods(nums1_3, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 3 (Array Methods): [${nums1_3}] ${
        JSON.stringify(nums1_3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Gap Method)
    const nums1_4 = [...testCase.nums1];
    mergeWithGap(nums1_4, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 4 (Gap Method): [${nums1_4}] ${
        JSON.stringify(nums1_4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Heap)
    const nums1_5 = [...testCase.nums1];
    mergeWithHeap(nums1_5, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 5 (Heap): [${nums1_5}] ${
        JSON.stringify(nums1_5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Recursive)
    const nums1_6 = [...testCase.nums1];
    mergeRecursive(nums1_6, testCase.m, testCase.nums2, testCase.n);
    console.log(
      `Solution 6 (Recursive): [${nums1_6}] ${
        JSON.stringify(nums1_6) === JSON.stringify(testCase.expected)
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
    { name: "Merge from End", func: merge },
    { name: "Extra Space", func: mergeWithExtraSpace },
    { name: "Array Methods", func: mergeWithArrayMethods },
    { name: "Gap Method", func: mergeWithGap },
    { name: "Heap", func: mergeWithHeap },
    { name: "Recursive", func: mergeRecursive },
  ];

  // Create large arrays
  const m = 50000;
  const n = 50000;
  const nums1 = Array.from({ length: m + n }, (_, i) => (i < m ? i * 2 : 0));
  const nums2 = Array.from({ length: n }, (_, i) => i * 2 + 1);

  testCases.forEach(({ name, func }) => {
    const testNums1 = [...nums1];
    const testNums2 = [...nums2];

    const start = performance.now();
    func(testNums1, m, testNums2, n);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(
      `  Memory: ${
        name === "Extra Space"
          ? "O(m)"
          : name === "Array Methods" || name === "Heap"
          ? "O(m+n)"
          : "O(1)"
      }\n`
    );
  });
}

// Uncomment the following lines to run tests
// testMergeSortedArray();
// performanceComparison();

export {
  merge,
  mergeWithExtraSpace,
  mergeWithArrayMethods,
  mergeWithGap,
  mergeWithHeap,
  mergeRecursive,
  MinHeap,
  testMergeSortedArray,
  performanceComparison,
};
{% endraw %}
