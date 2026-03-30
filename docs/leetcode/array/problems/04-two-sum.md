---
layout: page
title: "Two Sum"
difficulty: Easy
category: Array
tags: [Array, Two Pointers, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/two-sum/"
---

# Two Sum / Tổng Hai Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 🔥 Tier 1 — Gặp >70% interviews
> **See also**: [3Sum](../../array/problems/12-3sum.md) | [Two Pointers Sorted](../../array/problems/28-two-pointers-sorted.md)

---

## 🧠 Intuition / Tư Duy

**Analogy / Liên tưởng:** Bạn có danh sách giá sản phẩm và cần tìm 2 sản phẩm có tổng giá đúng bằng budget. Cách ngu nhất: so sánh từng cặp (O(n²)). Cách thông minh: ghi nhớ "mình cần thêm bao nhiêu" vào sổ tay (HashMap) → khi gặp đúng số cần → xong.

**Pattern Recognition / Nhận dạng:**
- Signal: "two numbers that sum to target" → **Hash Map lookup**
- Key insight: thay vì tìm cặp (a, b) sao cho a+b=target, ta tìm complement = target - a
- Nếu array đã sorted → dùng **Two Pointers** (O(1) space). Nếu chưa sorted → **Hash Map** (O(n) time)

**Visual / Trực quan:**
```
nums = [2, 7, 11, 15], target = 9

Step 1: num=2, complement=9-2=7, map={} → 7 not in map → store {2:0}
Step 2: num=7, complement=9-7=2, map={2:0} → 2 IS in map! → return [0, 1] ✅

Map acts as "wish list": "I need 7" → later find 7 → match!
```

---

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.

```
Example 1: nums = [2,7,11,15], target = 9 → [0,1]
Example 2: nums = [3,2,4], target = 6 → [1,2]
Example 3: nums = [3,3], target = 6 → [0,1]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Hỏi constraints trước**: "Is the array sorted?" → nếu sorted, Two Pointers O(1) space
2. **Nói approach trước khi code**: "I'll use a hash map to store complements"
3. **Edge cases**: duplicate values `[3,3]`, negative numbers, single-pass vs two-pass
4. **Follow-up thường gặp**: "Can you do it in one pass?" → Yes, check then store in same loop
5. **Biến thể**: 3Sum, 4Sum, Two Sum II (sorted), Two Sum III (design class)

---

## Solutions

{% raw %}
/**
 * 1. Two Sum
 *
 * Problem:
 * Given an array of integers nums and an integer target, return indices of the two numbers
 * such that they add up to target. You may assume that each input would have exactly one
 * solution, and you may not use the same element twice.
 *
 * You can return the answer in any order.
 *
 * Example:
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
 *
 * Input: nums = [3,2,4], target = 6
 * Output: [1,2]
 *
 * LeetCode: https://leetcode.com/problems/two-sum/
 */

/**
 * Solution 1: Hash Map (Optimal)
 *
 * Approach:
 * - Use a hash map to store complements (target - current number)
 * - For each number, check if its complement exists in the map
 * - If found, return the indices
 *
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(n) - hash map storage
 */
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return []; // No solution found
}

/**
 * Solution 2: Brute Force (For comparison)
 *
 * Approach:
 * - Check every pair of numbers
 * - Return indices when sum equals target
 *
 * Time Complexity: O(n²) - nested loops
 * Space Complexity: O(1) - constant extra space
 */
function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }

  return []; // No solution found
}

/**
 * Solution 3: Two Pointers (Requires sorted array)
 *
 * Approach:
 * - Sort the array with original indices
 * - Use two pointers from start and end
 * - Move pointers based on sum comparison
 *
 * Time Complexity: O(n log n) - sorting dominates
 * Space Complexity: O(n) - need to store original indices
 */
function twoSumTwoPointers(nums: number[], target: number): number[] {
  // Create array with original indices
  const indexedNums = nums.map((num, index) => ({ num, index }));

  // Sort by values
  indexedNums.sort((a, b) => a.num - b.num);

  let left = 0;
  let right = indexedNums.length - 1;

  while (left < right) {
    const sum = indexedNums[left].num + indexedNums[right].num;

    if (sum === target) {
      return [indexedNums[left].index, indexedNums[right].index];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return []; // No solution found
}

/**
 * Solution 4: Using Object (Alternative to Map)
 *
 * Approach:
 * - Similar to hash map but using plain object
 * - Slightly different syntax but same logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function twoSumObject(nums: number[], target: number): number[] {
  const seen: { [key: number]: number } = {};

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (complement in seen) {
      return [seen[complement], i];
    }

    seen[nums[i]] = i;
  }

  return []; // No solution found
}

/**
 * Solution 5: Using Set (If we only need to check existence, not indices)
 *
 * Approach:
 * - Use Set to store seen numbers
 * - Check if complement exists
 * - Note: This version returns boolean, not indices
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function twoSumExists(nums: number[], target: number): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    const complement = target - num;

    if (seen.has(complement)) {
      return true;
    }

    seen.add(num);
  }

  return false;
}

/**
 * Solution 6: Recursive Approach (For educational purposes)
 *
 * Approach:
 * - Use recursion to find pairs
 * - Not efficient but shows recursive thinking
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n) - recursion stack
 */
function twoSumRecursive(nums: number[], target: number): number[] {
  function findPair(index: number, current: number): number[] {
    if (index >= nums.length) return [];

    // Check if current number forms a pair with any previous number
    for (let i = 0; i < index; i++) {
      if (nums[i] + nums[index] === target) {
        return [i, index];
      }
    }

    // Recursively check next number
    return findPair(index + 1, nums[index + 1]);
  }

  return findPair(1, nums[0]);
}

// Test cases
function testTwoSum() {
  console.log("=== Testing Two Sum ===\n");

  const testCases = [
    {
      nums: [2, 7, 11, 15],
      target: 9,
      expected: [0, 1],
      description: "Basic case",
    },
    {
      nums: [3, 2, 4],
      target: 6,
      expected: [1, 2],
      description: "Target in middle",
    },
    {
      nums: [3, 3],
      target: 6,
      expected: [0, 1],
      description: "Same numbers",
    },
    {
      nums: [1, 5, 8, 10, 13],
      target: 18,
      expected: [2, 4],
      description: "Larger numbers",
    },
    {
      nums: [-1, -2, -3, -4, -5],
      target: -8,
      expected: [2, 4],
      description: "Negative numbers",
    },
    {
      nums: [0, 4, 3, 0],
      target: 0,
      expected: [0, 3],
      description: "Zero target",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: nums = [${testCase.nums}], target = ${testCase.target}`
    );
    console.log(`Expected: [${testCase.expected}]\n`);

    // Test Solution 1 (Hash Map)
    const result1 = twoSum([...testCase.nums], testCase.target);
    console.log(
      `Solution 1 (Hash Map): [${result1}] ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Brute Force)
    const result2 = twoSumBruteForce([...testCase.nums], testCase.target);
    console.log(
      `Solution 2 (Brute Force): [${result2}] ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Two Pointers)
    const result3 = twoSumTwoPointers([...testCase.nums], testCase.target);
    console.log(
      `Solution 3 (Two Pointers): [${result3}] ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Object)
    const result4 = twoSumObject([...testCase.nums], testCase.target);
    console.log(
      `Solution 4 (Object): [${result4}] ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Exists)
    const result5 = twoSumExists([...testCase.nums], testCase.target);
    console.log(
      `Solution 5 (Exists): ${result5} ${result5 === true ? "✅" : "❌"}`
    );

    // Test Solution 6 (Recursive)
    const result6 = twoSumRecursive([...testCase.nums], testCase.target);
    console.log(
      `Solution 6 (Recursive): [${result6}] ${
        JSON.stringify(result6.sort()) ===
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

  // Create large array
  const largeNums = Array.from({ length: 100000 }, (_, i) => i);
  const target = 199998; // Sum of two large numbers

  const testCases = [
    { name: "Hash Map", func: twoSum },
    { name: "Brute Force", func: twoSumBruteForce },
    { name: "Two Pointers", func: twoSumTwoPointers },
    { name: "Object", func: twoSumObject },
  ];

  testCases.forEach(({ name, func }) => {
    const testNums = [...largeNums];
    const start = performance.now();
    const result = func(testNums, target);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: [${result}]`);
    console.log(`  Memory: ${name === "Brute Force" ? "O(1)" : "O(n)"}\n`);
  });
}

// Edge cases test
function testEdgeCases() {
  console.log("=== Edge Cases Test ===\n");

  const edgeCases = [
    {
      nums: [],
      target: 0,
      description: "Empty array",
    },
    {
      nums: [1],
      target: 2,
      description: "Single element",
    },
    {
      nums: [1, 2, 3, 4, 5],
      target: 100,
      description: "No solution",
    },
    {
      nums: [0, 0, 0, 0],
      target: 0,
      description: "All zeros",
    },
  ];

  edgeCases.forEach((testCase, index) => {
    console.log(`Edge Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: nums = [${testCase.nums}], target = ${testCase.target}`
    );

    const result = twoSum([...testCase.nums], testCase.target);
    console.log(`Result: [${result}]`);
    console.log(
      `Valid: ${result.length === 0 || result.length === 2 ? "✅" : "❌"}\n`
    );
  });
}

// Run tests
if (require.main === module) {
  testTwoSum();
  performanceComparison();
  testEdgeCases();
}

export {
  twoSum,
  twoSumBruteForce,
  twoSumTwoPointers,
  twoSumObject,
  twoSumExists,
  twoSumRecursive,
};
{% endraw %}
