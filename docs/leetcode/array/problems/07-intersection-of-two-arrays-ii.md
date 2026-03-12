---
layout: page
title: "Intersection of Two Arrays II"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Hash Table, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/"
---

# Intersection of Two Arrays II

**LeetCode Problem # * 350. Intersection of Two Arrays II**

## Problem Description

 * Given two integer arrays nums1 and nums2, return an array of their intersection.  * Each element in the result must appear as many times as it shows in both arrays  * and you may return the result in any order.  *  * Input: nums1 = [1,2,2,1], nums2 = [2,2] 

## Solutions

{% raw %}
/**
 * 350. Intersection of Two Arrays II
 *
 * Problem:
 * Given two integer arrays nums1 and nums2, return an array of their intersection.
 * Each element in the result must appear as many times as it shows in both arrays
 * and you may return the result in any order.
 *
 * Example:
 * Input: nums1 = [1,2,2,1], nums2 = [2,2]
 * Output: [2,2]
 *
 * Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
 * Output: [4,9]
 *
 * LeetCode: https://leetcode.com/problems/intersection-of-two-arrays-ii/
 */

/**
 * Solution 1: Hash Map (Optimal)
 *
 * Approach:
 * - Use hash map to count frequency of elements in nums1
 * - Iterate through nums2 and check if element exists in map
 * - Decrement count and add to result if found
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(min(n, m))
 */
function intersect(nums1: number[], nums2: number[]): number[] {
  // Use the smaller array for the hash map to optimize space
  if (nums1.length > nums2.length) {
    return intersect(nums2, nums1);
  }

  const frequency = new Map<number, number>();
  const result: number[] = [];

  // Count frequency of elements in nums1
  for (const num of nums1) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  // Check elements in nums2
  for (const num of nums2) {
    const count = frequency.get(num);
    if (count && count > 0) {
      result.push(num);
      frequency.set(num, count - 1);
    }
  }

  return result;
}

/**
 * Solution 2: Sort and Two Pointers
 *
 * Approach:
 * - Sort both arrays
 * - Use two pointers to find common elements
 * - Add to result when elements match
 *
 * Time Complexity: O(n log n + m log m)
 * Space Complexity: O(1) - excluding sort space
 */
function intersectSort(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);

  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      result.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }

  return result;
}

/**
 * Solution 3: Using Object (Hash table)
 *
 * Approach:
 * - Use plain object as hash table
 * - Similar to Solution 1 but with object
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(min(n, m))
 */
function intersectObject(nums1: number[], nums2: number[]): number[] {
  if (nums1.length > nums2.length) {
    return intersectObject(nums2, nums1);
  }

  const frequency: { [key: number]: number } = {};
  const result: number[] = [];

  // Count frequency of elements in nums1
  for (const num of nums1) {
    frequency[num] = (frequency[num] || 0) + 1;
  }

  // Check elements in nums2
  for (const num of nums2) {
    if (frequency[num] && frequency[num] > 0) {
      result.push(num);
      frequency[num]--;
    }
  }

  return result;
}

/**
 * Solution 4: Binary Search (For large arrays)
 *
 * Approach:
 * - Sort one array and binary search in it
 * - Useful when one array is much larger than the other
 *
 * Time Complexity: O(n log m + m log m) where n < m
 * Space Complexity: O(1) - excluding sort space
 */
function intersectBinarySearch(nums1: number[], nums2: number[]): number[] {
  // Sort the larger array for binary search
  if (nums1.length > nums2.length) {
    return intersectBinarySearch(nums2, nums1);
  }

  nums2.sort((a, b) => a - b);
  const result: number[] = [];
  const used = new Set<number>();

  for (const num of nums1) {
    const index = binarySearch(nums2, num, used);
    if (index !== -1) {
      result.push(num);
      used.add(index);
    }
  }

  return result;
}

function binarySearch(
  arr: number[],
  target: number,
  used: Set<number>
): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      // Find the leftmost occurrence that hasn't been used
      let result = mid;
      while (
        result > 0 &&
        arr[result - 1] === target &&
        !used.has(result - 1)
      ) {
        result--;
      }
      if (!used.has(result)) {
        return result;
      }
      // Continue searching right if this position is used
      left = mid + 1;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/**
 * Solution 5: Using Array Methods (Functional)
 *
 * Approach:
 * - Use filter and includes methods
 * - Simple but inefficient for large arrays
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(min(n, m))
 */
function intersectFunctional(nums1: number[], nums2: number[]): number[] {
  const result: number[] = [];
  const nums2Copy = [...nums2];

  for (const num of nums1) {
    const index = nums2Copy.indexOf(num);
    if (index !== -1) {
      result.push(num);
      nums2Copy.splice(index, 1);
    }
  }

  return result;
}

/**
 * Solution 6: Using Set (Incorrect but educational)
 *
 * Approach:
 * - This approach is INCORRECT for this problem
 * - Shows common mistake of using Set for frequency problems
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(min(n, m))
 */
function intersectSet(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));

  return Array.from(intersection);
}

/**
 * Solution 7: Using Counter Class (Object-oriented)
 *
 * Approach:
 * - Create a Counter class to handle frequency counting
 * - More structured approach
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(min(n, m))
 */
class Counter {
  private counts: Map<number, number> = new Map();

  constructor(items: number[]) {
    for (const item of items) {
      this.add(item);
    }
  }

  add(item: number): void {
    this.counts.set(item, (this.counts.get(item) || 0) + 1);
  }

  get(item: number): number {
    return this.counts.get(item) || 0;
  }

  decrement(item: number): boolean {
    const count = this.counts.get(item);
    if (count && count > 0) {
      this.counts.set(item, count - 1);
      return true;
    }
    return false;
  }
}

function intersectCounter(nums1: number[], nums2: number[]): number[] {
  if (nums1.length > nums2.length) {
    return intersectCounter(nums2, nums1);
  }

  const counter = new Counter(nums1);
  const result: number[] = [];

  for (const num of nums2) {
    if (counter.decrement(num)) {
      result.push(num);
    }
  }

  return result;
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield intersection elements
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(min(n, m))
 */
function* intersectGenerator(
  nums1: number[],
  nums2: number[]
): Generator<number> {
  if (nums1.length > nums2.length) {
    yield* intersectGenerator(nums2, nums1);
    return;
  }

  const frequency = new Map<number, number>();

  // Count frequency of elements in nums1
  for (const num of nums1) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  // Yield elements from nums2 that exist in frequency map
  for (const num of nums2) {
    const count = frequency.get(num);
    if (count && count > 0) {
      frequency.set(num, count - 1);
      yield num;
    }
  }
}

function intersectWithGenerator(nums1: number[], nums2: number[]): number[] {
  return Array.from(intersectGenerator(nums1, nums2));
}

// Test cases
function testIntersection() {
  console.log("=== Testing Intersection of Two Arrays II ===\n");

  const testCases = [
    {
      nums1: [1, 2, 2, 1],
      nums2: [2, 2],
      expected: [2, 2],
      description: "Basic intersection with duplicates",
    },
    {
      nums1: [4, 9, 5],
      nums2: [9, 4, 9, 8, 4],
      expected: [4, 9],
      description: "Intersection with different frequencies",
    },
    {
      nums1: [1, 2, 3],
      nums2: [4, 5, 6],
      expected: [],
      description: "No intersection",
    },
    {
      nums1: [1, 1, 1],
      nums2: [1, 1],
      expected: [1, 1],
      description: "Multiple duplicates",
    },
    {
      nums1: [],
      nums2: [1, 2, 3],
      expected: [],
      description: "Empty first array",
    },
    {
      nums1: [1, 2, 3],
      nums2: [],
      expected: [],
      description: "Empty second array",
    },
    {
      nums1: [1, 2, 3, 4, 5],
      nums2: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5],
      description: "Identical arrays",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: nums1 = [${testCase.nums1.join(
        ", "
      )}], nums2 = [${testCase.nums2.join(", ")}]`
    );
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Hash Map)
    const result1 = intersect([...testCase.nums1], [...testCase.nums2]);
    console.log(
      `Solution 1 (Hash Map): [${result1.join(", ")}] ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Sort)
    const result2 = intersectSort([...testCase.nums1], [...testCase.nums2]);
    console.log(
      `Solution 2 (Sort): [${result2.join(", ")}] ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Object)
    const result3 = intersectObject([...testCase.nums1], [...testCase.nums2]);
    console.log(
      `Solution 3 (Object): [${result3.join(", ")}] ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Binary Search)
    const result4 = intersectBinarySearch(
      [...testCase.nums1],
      [...testCase.nums2]
    );
    console.log(
      `Solution 4 (Binary Search): [${result4.join(", ")}] ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Functional)
    const result5 = intersectFunctional(
      [...testCase.nums1],
      [...testCase.nums2]
    );
    console.log(
      `Solution 5 (Functional): [${result5.join(", ")}] ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Set) - Note: This is incorrect for frequency problems
    const result6 = intersectSet([...testCase.nums1], [...testCase.nums2]);
    console.log(
      `Solution 6 (Set): [${result6.join(", ")}] ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      } (Note: Incorrect for frequency)`
    );

    // Test Solution 7 (Counter)
    const result7 = intersectCounter([...testCase.nums1], [...testCase.nums2]);
    console.log(
      `Solution 7 (Counter): [${result7.join(", ")}] ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = intersectWithGenerator(
      [...testCase.nums1],
      [...testCase.nums2]
    );
    console.log(
      `Solution 8 (Generator): [${result8.join(", ")}] ${
        JSON.stringify(result8.sort()) ===
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
    { name: "Hash Map", func: intersect },
    { name: "Sort", func: intersectSort },
    { name: "Object", func: intersectObject },
    { name: "Binary Search", func: intersectBinarySearch },
    { name: "Functional", func: intersectFunctional },
    { name: "Counter", func: intersectCounter },
    { name: "Generator", func: intersectWithGenerator },
  ];

  // Create test arrays
  const nums1 = Array.from({ length: 10000 }, (_, i) => i % 1000);
  const nums2 = Array.from({ length: 10000 }, (_, i) => i % 1000);

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func([...nums1], [...nums2]);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result length: ${result.length}`);
    console.log(
      `  Memory: ${
        name === "Sort" || name === "Binary Search" ? "O(1)" : "O(min(n,m))"
      }\n`
    );
  });
}

// Uncomment the following lines to run tests
// testIntersection();
// performanceComparison();

export {
  intersect,
  intersectSort,
  intersectObject,
  intersectBinarySearch,
  intersectFunctional,
  intersectSet,
  intersectCounter,
  intersectWithGenerator,
  intersectGenerator,
  Counter,
  testIntersection,
  performanceComparison,
};
{% endraw %}
