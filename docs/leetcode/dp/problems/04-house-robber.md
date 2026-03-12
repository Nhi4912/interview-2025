---
layout: page
title: "House Robber"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Hash Table]
leetcode_url: "https://leetcode.com/problems/house-robber/"
---

# House Robber



## Problem Description

 *  * You are a professional robber planning to rob houses along a street. Each house has  * a certain amount of money stashed, the only constraint stopping you from robbing each  * of them is that adjacent houses have security systems connected and it will automatically  * contact the police if two adjacent houses were broken into on the same night. 

## Solutions

{% raw %}
/**
 * House Robber
 *
 * Problem: https://leetcode.com/problems/house-robber/
 *
 * You are a professional robber planning to rob houses along a street. Each house has
 * a certain amount of money stashed, the only constraint stopping you from robbing each
 * of them is that adjacent houses have security systems connected and it will automatically
 * contact the police if two adjacent houses were broken into on the same night.
 *
 * Given an integer array nums representing the amount of money of each house, return the
 * maximum amount of money you can rob tonight without alerting the police.
 *
 * Example 1:
 * Input: nums = [1,2,3,1]
 * Output: 4
 * Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
 * Total amount you can rob = 1 + 3 = 4.
 *
 * Example 2:
 * Input: nums = [2,7,9,3,1]
 * Output: 12
 * Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
 * Total amount you can rob = 2 + 9 + 1 = 12.
 *
 * Constraints:
 * - 1 <= nums.length <= 100
 * - 0 <= nums[i] <= 400
 *
 * Solution Approach:
 * 1. Dynamic Programming with state machine
 * 2. At each house, we have two choices: rob or don't rob
 * 3. If we rob current house, we can't rob previous house
 * 4. If we don't rob current house, we can take max of previous states
 *
 * Time Complexity: O(n) where n is the length of nums array
 * Space Complexity: O(1) as we only use a constant amount of extra space
 */

/**
 * House Robber - Dynamic Programming Solution
 *
 * Giải pháp Quy hoạch động cho bài toán Cướp nhà
 *
 * @param nums - Mảng số tiền trong mỗi ngôi nhà
 * @returns Số tiền tối đa có thể cướp được
 */
function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return Math.max(nums[0], nums[1]);

  // prev2: tổng tiền tối đa cách 2 nhà trước
  // prev1: tổng tiền tối đa cách 1 nhà trước
  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    // Tại nhà hiện tại, chúng ta có 2 lựa chọn:
    // 1. Cướp nhà hiện tại + tổng tiền cách 2 nhà trước
    // 2. Không cướp nhà hiện tại, lấy tổng tiền cách 1 nhà trước
    const current = Math.max(prev2 + nums[i], prev1);

    // Cập nhật trạng thái
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

/**
 * Alternative Solution: Using Array for DP
 *
 * Giải pháp thay thế: Sử dụng mảng cho DP
 *
 * @param nums - Mảng số tiền trong mỗi ngôi nhà
 * @returns Số tiền tối đa có thể cướp được
 */
function robWithArray(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  const dp = new Array(nums.length).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }

  return dp[nums.length - 1];
}

/**
 * Recursive Solution with Memoization
 *
 * Giải pháp đệ quy với ghi nhớ
 *
 * @param nums - Mảng số tiền trong mỗi ngôi nhà
 * @returns Số tiền tối đa có thể cướp được
 */
function robRecursive(nums: number[]): number {
  const memo = new Map<number, number>();

  function robHelper(index: number): number {
    if (index >= nums.length) return 0;
    if (memo.has(index)) return memo.get(index)!;

    // Cướp nhà hiện tại hoặc không cướp
    const result = Math.max(
      nums[index] + robHelper(index + 2), // Cướp nhà hiện tại
      robHelper(index + 1) // Không cướp nhà hiện tại
    );

    memo.set(index, result);
    return result;
  }

  return robHelper(0);
}

/**
 * Solution with House Selection Tracking
 *
 * Giải pháp với theo dõi việc chọn nhà
 *
 * @param nums - Mảng số tiền trong mỗi ngôi nhà
 * @returns Object chứa tổng tiền và danh sách nhà được chọn
 */
function robWithSelection(nums: number[]): {
  maxMoney: number;
  selectedHouses: number[];
} {
  if (nums.length === 0) return { maxMoney: 0, selectedHouses: [] };
  if (nums.length === 1) return { maxMoney: nums[0], selectedHouses: [0] };

  const dp = new Array(nums.length).fill(0);
  const selected = new Array(nums.length).fill(false);

  dp[0] = nums[0];
  selected[0] = true;

  if (nums[1] > nums[0]) {
    dp[1] = nums[1];
    selected[1] = true;
    selected[0] = false;
  } else {
    dp[1] = nums[0];
  }

  for (let i = 2; i < nums.length; i++) {
    const robCurrent = dp[i - 2] + nums[i];
    const skipCurrent = dp[i - 1];

    if (robCurrent > skipCurrent) {
      dp[i] = robCurrent;
      selected[i] = true;
      selected[i - 1] = false;
    } else {
      dp[i] = skipCurrent;
      selected[i] = false;
    }
  }

  const selectedHouses: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (selected[i]) {
      selectedHouses.push(i);
    }
  }

  return { maxMoney: dp[nums.length - 1], selectedHouses };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== House Robber Tests ===");
  console.log("=== Kiểm thử bài toán Cướp nhà ===\n");

  const testCases = [
    {
      name: "Example 1: Four houses",
      input: [1, 2, 3, 1],
      expected: 4,
      description: "Rob houses 0 and 2: 1 + 3 = 4",
    },
    {
      name: "Example 2: Five houses",
      input: [2, 7, 9, 3, 1],
      expected: 12,
      description: "Rob houses 0, 2, and 4: 2 + 9 + 1 = 12",
    },
    {
      name: "Single house",
      input: [5],
      expected: 5,
      description: "Only one house to rob",
    },
    {
      name: "Two houses",
      input: [3, 7],
      expected: 7,
      description: "Rob the house with more money",
    },
    {
      name: "All same amount",
      input: [2, 2, 2, 2],
      expected: 4,
      description: "Rob houses 0 and 2: 2 + 2 = 4",
    },
    {
      name: "Alternating amounts",
      input: [1, 3, 1, 3, 1],
      expected: 6,
      description: "Rob houses 1 and 3: 3 + 3 = 6",
    },
    {
      name: "Large amounts",
      input: [100, 200, 300, 400],
      expected: 600,
      description:
        "Rob houses 0 and 2: 100 + 300 = 400, or houses 1 and 3: 200 + 400 = 600",
    },
    {
      name: "Zero amounts",
      input: [0, 0, 0, 0],
      expected: 0,
      description: "No money to rob",
    },
    {
      name: "One large amount",
      input: [1, 1000, 1, 1],
      expected: 1000,
      description: "Rob house 1: 1000",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = rob(testCase.input);
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

  // Test with selection tracking
  console.log("\n=== Testing with Selection Tracking ===");
  console.log("=== Kiểm thử với theo dõi việc chọn nhà ===\n");

  const testArray = [2, 7, 9, 3, 1];
  const resultWithSelection = robWithSelection(testArray);

  console.log(`Array: [${testArray.join(", ")}]`);
  console.log(`Max Money: ${resultWithSelection.maxMoney}`);
  console.log(
    `Selected Houses: [${resultWithSelection.selectedHouses.join(", ")}]`
  );
  console.log(
    `Selected Values: [${resultWithSelection.selectedHouses
      .map((i) => testArray[i])
      .join(", ")}]`
  );

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeInput = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 400)
  );

  console.log("Testing with large input (1,000 elements)...");
  console.log("Kiểm thử với dữ liệu lớn (1,000 phần tử)...");

  const start1 = performance.now();
  const result1 = rob(largeInput);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = robWithArray(largeInput);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = robRecursive(largeInput);
  const time3 = performance.now() - start3;

  console.log(`DP with variables: ${time1.toFixed(4)}ms`);
  console.log(`DP with array: ${time2.toFixed(4)}ms`);
  console.log(`Recursive with memo: ${time3.toFixed(4)}ms`);
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

export { rob, robWithArray, robRecursive, robWithSelection };
{% endraw %}
