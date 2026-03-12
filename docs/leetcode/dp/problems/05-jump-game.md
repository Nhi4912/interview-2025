---
layout: page
title: "Jump Game"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/jump-game/"
---

# Jump Game



## Problem Description

 *  * You are given an integer array nums. You are initially positioned at the array's first  * index, and each element in the array represents your maximum jump length at that position.  *  * Return true if you can reach the last index, or false otherwise. 

## Solutions

{% raw %}
/**
 * Jump Game
 *
 * Problem: https://leetcode.com/problems/jump-game/
 *
 * You are given an integer array nums. You are initially positioned at the array's first
 * index, and each element in the array represents your maximum jump length at that position.
 *
 * Return true if you can reach the last index, or false otherwise.
 *
 * Example 1:
 * Input: nums = [2,3,1,1,4]
 * Output: true
 * Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
 *
 * Example 2:
 * Input: nums = [3,2,1,0,4]
 * Output: false
 * Explanation: You will always arrive at index 3 no matter what. Its maximum jump length
 * is 0, which makes it impossible to reach the last index.
 *
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - 0 <= nums[i] <= 10^5
 *
 * Solution Approach:
 * 1. Greedy approach - track the maximum reachable position
 * 2. At each position, update the maximum reachable position
 * 3. If current position is beyond maximum reachable, return false
 * 4. If maximum reachable position >= last index, return true
 *
 * Time Complexity: O(n) where n is the length of nums array
 * Space Complexity: O(1) as we only use a constant amount of extra space
 */

/**
 * Jump Game - Greedy Solution
 *
 * Giải pháp tham lam cho bài toán Trò chơi nhảy
 *
 * @param nums - Mảng độ dài nhảy tối đa tại mỗi vị trí
 * @returns true nếu có thể đến được vị trí cuối cùng
 */
function canJump(nums: number[]): boolean {
  if (nums.length <= 1) return true;

  let maxReachable = 0; // Vị trí xa nhất có thể đến được

  for (let i = 0; i < nums.length; i++) {
    // Nếu vị trí hiện tại vượt quá vị trí có thể đến được
    if (i > maxReachable) {
      return false;
    }

    // Cập nhật vị trí xa nhất có thể đến được
    maxReachable = Math.max(maxReachable, i + nums[i]);

    // Nếu đã có thể đến được vị trí cuối cùng
    if (maxReachable >= nums.length - 1) {
      return true;
    }
  }

  return maxReachable >= nums.length - 1;
}

/**
 * Alternative Solution: Dynamic Programming (Bottom-up)
 *
 * Giải pháp thay thế: Quy hoạch động (từ dưới lên)
 *
 * @param nums - Mảng độ dài nhảy tối đa tại mỗi vị trí
 * @returns true nếu có thể đến được vị trí cuối cùng
 */
function canJumpDP(nums: number[]): boolean {
  if (nums.length <= 1) return true;

  const dp = new Array(nums.length).fill(false);
  dp[nums.length - 1] = true; // Vị trí cuối cùng luôn có thể đến được

  for (let i = nums.length - 2; i >= 0; i--) {
    const maxJump = nums[i];

    // Kiểm tra xem có thể nhảy đến vị trí nào từ vị trí hiện tại
    for (let j = 1; j <= maxJump && i + j < nums.length; j++) {
      if (dp[i + j]) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[0];
}

/**
 * Recursive Solution with Memoization
 *
 * Giải pháp đệ quy với ghi nhớ
 *
 * @param nums - Mảng độ dài nhảy tối đa tại mỗi vị trí
 * @returns true nếu có thể đến được vị trí cuối cùng
 */
function canJumpRecursive(nums: number[]): boolean {
  const memo = new Map<number, boolean>();

  function canJumpHelper(position: number): boolean {
    // Base case: đã đến vị trí cuối cùng
    if (position >= nums.length - 1) {
      return true;
    }

    // Kiểm tra memo
    if (memo.has(position)) {
      return memo.get(position)!;
    }

    const maxJump = nums[position];

    // Thử tất cả các bước nhảy có thể
    for (let jump = 1; jump <= maxJump; jump++) {
      if (canJumpHelper(position + jump)) {
        memo.set(position, true);
        return true;
      }
    }

    memo.set(position, false);
    return false;
  }

  return canJumpHelper(0);
}

/**
 * Solution with Path Tracking
 *
 * Giải pháp với theo dõi đường đi
 *
 * @param nums - Mảng độ dài nhảy tối đa tại mỗi vị trí
 * @returns Object chứa kết quả và đường đi (nếu có)
 */
function canJumpWithPath(nums: number[]): {
  canReach: boolean;
  path: number[];
} {
  if (nums.length <= 1) {
    return { canReach: true, path: [0] };
  }

  const dp = new Array(nums.length).fill(false);
  const path = new Array(nums.length).fill(-1);

  dp[nums.length - 1] = true;

  for (let i = nums.length - 2; i >= 0; i--) {
    const maxJump = nums[i];

    for (let j = 1; j <= maxJump && i + j < nums.length; j++) {
      if (dp[i + j]) {
        dp[i] = true;
        path[i] = i + j;
        break;
      }
    }
  }

  // Tạo đường đi nếu có thể đến được
  const resultPath: number[] = [];
  if (dp[0]) {
    let current = 0;
    while (current !== -1) {
      resultPath.push(current);
      current = path[current];
    }
  }

  return { canReach: dp[0], path: resultPath };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Jump Game Tests ===");
  console.log("=== Kiểm thử bài toán Trò chơi nhảy ===\n");

  const testCases = [
    {
      name: "Example 1: Can reach end",
      input: [2, 3, 1, 1, 4],
      expected: true,
      description:
        "Jump 1 step from index 0 to 1, then 3 steps to the last index",
    },
    {
      name: "Example 2: Cannot reach end",
      input: [3, 2, 1, 0, 4],
      expected: false,
      description: "Will always arrive at index 3, which has jump length 0",
    },
    {
      name: "Single element",
      input: [0],
      expected: true,
      description: "Already at the last index",
    },
    {
      name: "Two elements - can jump",
      input: [1, 0],
      expected: true,
      description: "Can jump 1 step to reach the end",
    },
    {
      name: "Two elements - cannot jump",
      input: [0, 1],
      expected: false,
      description: "Cannot jump from first position",
    },
    {
      name: "All zeros except last",
      input: [0, 0, 0, 1],
      expected: false,
      description: "Cannot move from any position",
    },
    {
      name: "Large jumps",
      input: [5, 0, 0, 0, 0],
      expected: true,
      description: "Can jump directly to the end",
    },
    {
      name: "Alternating jumps",
      input: [1, 0, 1, 0, 1],
      expected: true,
      description: "Can reach the end by jumping every other position",
    },
    {
      name: "Zero in middle",
      input: [2, 0, 0],
      expected: true,
      description: "Can jump over the zero",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = canJump(testCase.input);
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

  // Test with path tracking
  console.log("\n=== Testing with Path Tracking ===");
  console.log("=== Kiểm thử với theo dõi đường đi ===\n");

  const testArray = [2, 3, 1, 1, 4];
  const resultWithPath = canJumpWithPath(testArray);

  console.log(`Array: [${testArray.join(", ")}]`);
  console.log(`Can Reach: ${resultWithPath.canReach}`);
  if (resultWithPath.canReach) {
    console.log(`Path: [${resultWithPath.path.join(" -> ")}]`);
    console.log(
      `Jumps: [${resultWithPath.path
        .slice(1)
        .map((pos, i) => pos - resultWithPath.path[i])
        .join(", ")}]`
    );
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeInput = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 10)
  );

  console.log("Testing with large input (1,000 elements)...");
  console.log("Kiểm thử với dữ liệu lớn (1,000 phần tử)...");

  const start1 = performance.now();
  const result1 = canJump(largeInput);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = canJumpDP(largeInput);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = canJumpRecursive(largeInput);
  const time3 = performance.now() - start3;

  console.log(`Greedy: ${time1.toFixed(4)}ms`);
  console.log(`DP: ${time2.toFixed(4)}ms`);
  console.log(`Recursive: ${time3.toFixed(4)}ms`);
  console.log(
    `Results match: ${
      result1 === result2 && result2 === result3 ? "✅ Yes" : "❌ No"
    }`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { canJump, canJumpDP, canJumpRecursive, canJumpWithPath };
{% endraw %}
