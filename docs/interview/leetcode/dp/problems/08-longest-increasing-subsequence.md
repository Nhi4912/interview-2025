---
layout: page
title: "Longest Increasing Subsequence"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Hash Table, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/longest-increasing-subsequence/"
---

# Longest Increasing Subsequence



## Problem Description

 *  * Given an integer array nums, return the length of the longest strictly increasing subsequence.  *  * A subsequence is a sequence that can be derived from an array by deleting some or no elements  * without changing the order of the remaining elements. 

## Solutions

{% raw %}
/**
 * Longest Increasing Subsequence
 *
 * Problem: https://leetcode.com/problems/longest-increasing-subsequence/
 *
 * Given an integer array nums, return the length of the longest strictly increasing subsequence.
 *
 * A subsequence is a sequence that can be derived from an array by deleting some or no elements
 * without changing the order of the remaining elements.
 *
 * Example 1:
 * Input: nums = [10,9,2,5,3,7,101,18]
 * Output: 4
 * Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
 *
 * Example 2:
 * Input: nums = [0,1,0,3,2,3]
 * Output: 4
 *
 * Example 3:
 * Input: nums = [7,7,7,7,7,7,7]
 * Output: 1
 *
 * Constraints:
 * - 1 <= nums.length <= 2500
 * - -10^4 <= nums[i] <= 10^4
 *
 * Solution Approach:
 * 1. Dynamic Programming: O(n²) solution
 * 2. Binary Search with Patience Sorting: O(n log n) solution
 * 3. Track the length of LIS ending at each position
 * 4. Use binary search to find insertion position for optimization
 *
 * Time Complexity: O(n log n) for optimal solution
 * Space Complexity: O(n)
 */

/**
 * Longest Increasing Subsequence - Dynamic Programming
 *
 * Giải pháp Quy hoạch động cho bài toán Dãy con tăng dài nhất
 *
 * @param nums - Mảng số nguyên
 * @returns Độ dài của dãy con tăng dài nhất
 */
function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const dp = new Array(nums.length).fill(1);
  let maxLength = 1;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}

/**
 * Optimal Solution: Binary Search with Patience Sorting
 *
 * Giải pháp tối ưu: Tìm kiếm nhị phân với sắp xếp kiên nhẫn
 *
 * @param nums - Mảng số nguyên
 * @returns Độ dài của dãy con tăng dài nhất
 */
function lengthOfLISOptimal(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const num of nums) {
    // Tìm vị trí chèn bằng binary search
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    if (left === tails.length) {
      tails.push(num);
    } else {
      tails[left] = num;
    }
  }

  return tails.length;
}

/**
 * Solution with Subsequence Reconstruction
 *
 * Giải pháp với tái tạo dãy con
 *
 * @param nums - Mảng số nguyên
 * @returns Object chứa độ dài và dãy con tăng dài nhất
 */
function lengthOfLISWithSubsequence(nums: number[]): {
  length: number;
  subsequence: number[];
} {
  if (nums.length === 0) return { length: 0, subsequence: [] };

  const dp = new Array(nums.length).fill(1);
  const prev = new Array(nums.length).fill(-1);
  let maxLength = 1;
  let maxIndex = 0;

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndex = i;
    }
  }

  // Tái tạo dãy con
  const subsequence: number[] = [];
  let currentIndex = maxIndex;

  while (currentIndex !== -1) {
    subsequence.unshift(nums[currentIndex]);
    currentIndex = prev[currentIndex];
  }

  return { length: maxLength, subsequence };
}

/**
 * Recursive Solution with Memoization
 *
 * Giải pháp đệ quy với ghi nhớ
 *
 * @param nums - Mảng số nguyên
 * @returns Độ dài của dãy con tăng dài nhất
 */
function lengthOfLISRecursive(nums: number[]): number {
  const memo = new Map<string, number>();

  function lisHelper(index: number, prevIndex: number): number {
    if (index >= nums.length) return 0;

    const key = `${index},${prevIndex}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let include = 0;
    if (prevIndex === -1 || nums[index] > nums[prevIndex]) {
      include = 1 + lisHelper(index + 1, index);
    }

    const exclude = lisHelper(index + 1, prevIndex);
    const result = Math.max(include, exclude);

    memo.set(key, result);
    return result;
  }

  return lisHelper(0, -1);
}

/**
 * Solution with All LIS
 *
 * Giải pháp với tất cả dãy con tăng dài nhất
 *
 * @param nums - Mảng số nguyên
 * @returns Object chứa độ dài và tất cả dãy con tăng dài nhất
 */
function lengthOfLISWithAllSubsequences(nums: number[]): {
  length: number;
  subsequences: number[][];
} {
  if (nums.length === 0) return { length: 0, subsequences: [] };

  const dp = new Array(nums.length).fill(1);
  const prev: number[][] = new Array(nums.length).fill(null).map(() => []);
  let maxLength = 1;
  let maxIndices: number[] = [];

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        if (dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = [j];
        } else if (dp[j] + 1 === dp[i]) {
          prev[i].push(j);
        }
      }
    }

    if (dp[i] > maxLength) {
      maxLength = dp[i];
      maxIndices = [i];
    } else if (dp[i] === maxLength) {
      maxIndices.push(i);
    }
  }

  // Tái tạo tất cả dãy con
  const subsequences: number[][] = [];

  function reconstruct(index: number, current: number[]): void {
    if (prev[index].length === 0) {
      subsequences.push([...current, nums[index]]);
      return;
    }

    for (const prevIndex of prev[index]) {
      reconstruct(prevIndex, [...current, nums[index]]);
    }
  }

  for (const maxIndex of maxIndices) {
    reconstruct(maxIndex, []);
  }

  return { length: maxLength, subsequences };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Longest Increasing Subsequence Tests ===");
  console.log("=== Kiểm thử bài toán Dãy con tăng dài nhất ===\n");

  const testCases = [
    {
      name: "Example 1: Standard case",
      input: [10, 9, 2, 5, 3, 7, 101, 18],
      expected: 4,
      description: "LIS: [2,3,7,101] with length 4",
    },
    {
      name: "Example 2: Multiple LIS",
      input: [0, 1, 0, 3, 2, 3],
      expected: 4,
      description: "LIS: [0,1,2,3] with length 4",
    },
    {
      name: "Example 3: All same elements",
      input: [7, 7, 7, 7, 7, 7, 7],
      expected: 1,
      description: "LIS: [7] with length 1",
    },
    {
      name: "Single element",
      input: [5],
      expected: 1,
      description: "LIS: [5] with length 1",
    },
    {
      name: "Strictly increasing",
      input: [1, 2, 3, 4, 5],
      expected: 5,
      description: "LIS: [1,2,3,4,5] with length 5",
    },
    {
      name: "Strictly decreasing",
      input: [5, 4, 3, 2, 1],
      expected: 1,
      description: "LIS: [5] with length 1",
    },
    {
      name: "Empty array",
      input: [],
      expected: 0,
      description: "Empty array has LIS length 0",
    },
    {
      name: "Large numbers",
      input: [10000, 9999, 9998, 9997, 9996],
      expected: 1,
      description: "LIS: [10000] with length 1",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = lengthOfLIS(testCase.input);
    const passed = result === testCase.expected;

    console.log(`Result: ${result}`);
    console.log(`Status: ${passed ? "✅ PASSED" : "❌ FAILED"}`);

    if (passed) {
      passedTests++;
    } else {
      console.log(`Expected: ${testCase.expected}, Got: ${result}`);
    }

    console.log("---");
  }

  console.log(`\nTest Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(
    `Tóm tắt kiểm thử: ${passedTests}/${totalTests} bài kiểm thử đã qua`
  );

  // Test with subsequence reconstruction
  console.log("\n=== Testing with Subsequence Reconstruction ===");
  console.log("=== Kiểm thử với tái tạo dãy con ===\n");

  const testArray = [10, 9, 2, 5, 3, 7, 101, 18];
  const resultWithSubsequence = lengthOfLISWithSubsequence(testArray);

  console.log(`Array: [${testArray.join(", ")}]`);
  console.log(`LIS Length: ${resultWithSubsequence.length}`);
  console.log(`LIS: [${resultWithSubsequence.subsequence.join(", ")}]`);

  // Test with all subsequences
  console.log("\n=== Testing with All Subsequences ===");
  console.log("=== Kiểm thử với tất cả dãy con ===\n");

  const testArray2 = [0, 1, 0, 3, 2, 3];
  const resultWithAll = lengthOfLISWithAllSubsequences(testArray2);

  console.log(`Array: [${testArray2.join(", ")}]`);
  console.log(`LIS Length: ${resultWithAll.length}`);
  console.log(`Number of LIS: ${resultWithAll.subsequences.length}`);
  console.log("All LIS:");
  resultWithAll.subsequences.forEach((subseq, index) => {
    console.log(`  ${index + 1}. [${subseq.join(", ")}]`);
  });

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeArray = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 10000)
  );

  console.log("Testing with large input (1,000 elements)...");
  console.log("Kiểm thử với đầu vào lớn (1,000 phần tử)...");

  const start1 = performance.now();
  const result1 = lengthOfLIS(largeArray);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = lengthOfLISOptimal(largeArray);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = lengthOfLISRecursive(largeArray);
  const time3 = performance.now() - start3;

  console.log(`DP (O(n²)): ${time1.toFixed(4)}ms, Result: ${result1}`);
  console.log(
    `Binary Search (O(n log n)): ${time2.toFixed(4)}ms, Result: ${result2}`
  );
  console.log(`Recursive: ${time3.toFixed(4)}ms, Result: ${result3}`);
  console.log(
    `Results match: ${
      result1 === result2 && result2 === result3 ? "✅ Yes" : "❌ No"
    }`
  );

  // Test edge cases
  console.log("\n=== Edge Cases Testing ===");
  console.log("=== Kiểm thử trường hợp đặc biệt ===\n");

  const edgeCases = [
    { name: "All negative", array: [-5, -4, -3, -2, -1] },
    { name: "Alternating", array: [1, -1, 1, -1, 1] },
    { name: "Single element", array: [42] },
    { name: "Two elements increasing", array: [1, 2] },
    { name: "Two elements decreasing", array: [2, 1] },
  ];

  for (const edgeCase of edgeCases) {
    const result = lengthOfLIS(edgeCase.array);
    console.log(
      `${edgeCase.name}: [${edgeCase.array.join(", ")}] -> ${result}`
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  lengthOfLIS,
  lengthOfLISOptimal,
  lengthOfLISWithSubsequence,
  lengthOfLISRecursive,
  lengthOfLISWithAllSubsequences,
};
{% endraw %}
