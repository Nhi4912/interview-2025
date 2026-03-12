---
layout: page
title: "Unique Path"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Hash Table]
leetcode_url: "https://leetcode.com/problems/unique-paths/"
---

# Unique Path



## Problem Description

 *  * There is a robot on an m x n grid. The robot is initially located at the top-left corner  * (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]).  * The robot can only move either down or right at any point in time.  * 

## Solutions

{% raw %}
/**
 * Unique Paths
 *
 * Problem: https://leetcode.com/problems/unique-paths/
 *
 * There is a robot on an m x n grid. The robot is initially located at the top-left corner
 * (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]).
 * The robot can only move either down or right at any point in time.
 *
 * Given the two integers m and n, return the number of possible unique paths that the robot
 * can take to reach the bottom-right corner.
 *
 * Example 1:
 * Input: m = 3, n = 7
 * Output: 28
 *
 * Example 2:
 * Input: m = 3, n = 2
 * Output: 3
 * Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
 * 1. Right -> Down -> Down
 * 2. Down -> Down -> Right
 * 3. Down -> Right -> Down
 *
 * Constraints:
 * - 1 <= m, n <= 100
 *
 * Solution Approach:
 * 1. Dynamic Programming with 2D grid
 * 2. Each cell represents number of paths to reach that cell
 * 3. Paths to cell = paths from left + paths from top
 * 4. Can be optimized to use 1D array
 *
 * Time Complexity: O(m * n) where m and n are grid dimensions
 * Space Complexity: O(min(m, n)) with optimization
 */

/**
 * Unique Paths - Dynamic Programming Solution
 *
 * Giải pháp Quy hoạch động cho bài toán Đường đi duy nhất
 *
 * @param m - Số hàng của lưới
 * @param n - Số cột của lưới
 * @returns Số đường đi duy nhất từ góc trên-trái đến góc dưới-phải
 */
function uniquePaths(m: number, n: number): number {
  if (m === 1 || n === 1) return 1;

  // Sử dụng mảng 1D để tối ưu không gian
  const dp = new Array(n).fill(1);

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] = dp[j] + dp[j - 1];
    }
  }

  return dp[n - 1];
}

/**
 * Alternative Solution: Using 2D Array
 *
 * Giải pháp thay thế: Sử dụng mảng 2D
 *
 * @param m - Số hàng của lưới
 * @param n - Số cột của lưới
 * @returns Số đường đi duy nhất từ góc trên-trái đến góc dưới-phải
 */
function uniquePaths2D(m: number, n: number): number {
  const dp = Array(m)
    .fill(null)
    .map(() => Array(n).fill(0));

  // Khởi tạo hàng đầu tiên và cột đầu tiên
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let j = 0; j < n; j++) {
    dp[0][j] = 1;
  }

  // Điền bảng DP
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * Mathematical Solution: Using Combination Formula
 *
 * Giải pháp toán học: Sử dụng công thức tổ hợp
 *
 * @param m - Số hàng của lưới
 * @param n - Số cột của lưới
 * @returns Số đường đi duy nhất từ góc trên-trái đến góc dưới-phải
 */
function uniquePathsMath(m: number, n: number): number {
  // Công thức: C(m+n-2, m-1) = (m+n-2)! / ((m-1)! * (n-1)!)
  const totalSteps = m + n - 2;
  const downSteps = m - 1;

  let result = 1;
  for (let i = 1; i <= downSteps; i++) {
    result = (result * (totalSteps - downSteps + i)) / i;
  }

  return Math.round(result);
}

/**
 * Recursive Solution with Memoization
 *
 * Giải pháp đệ quy với ghi nhớ
 *
 * @param m - Số hàng của lưới
 * @param n - Số cột của lưới
 * @returns Số đường đi duy nhất từ góc trên-trái đến góc dưới-phải
 */
function uniquePathsRecursive(m: number, n: number): number {
  const memo = new Map<string, number>();

  function uniquePathsHelper(row: number, col: number): number {
    // Base case: đã đến đích
    if (row === m - 1 && col === n - 1) {
      return 1;
    }

    // Base case: vượt ra ngoài lưới
    if (row >= m || col >= n) {
      return 0;
    }

    const key = `${row},${col}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    // Đường đi = đi xuống + đi sang phải
    const result =
      uniquePathsHelper(row + 1, col) + uniquePathsHelper(row, col + 1);
    memo.set(key, result);

    return result;
  }

  return uniquePathsHelper(0, 0);
}

/**
 * Solution with Path Visualization
 *
 * Giải pháp với hiển thị đường đi
 *
 * @param m - Số hàng của lưới
 * @param n - Số cột của lưới
 * @returns Object chứa số đường đi và một số đường đi mẫu
 */
function uniquePathsWithVisualization(
  m: number,
  n: number
): {
  totalPaths: number;
  samplePaths: string[];
} {
  const totalPaths = uniquePaths(m, n);
  const samplePaths: string[] = [];

  // Tạo một số đường đi mẫu (tối đa 5 đường đi)
  function generateSamplePaths(
    row: number,
    col: number,
    path: string,
    count: number
  ) {
    if (count >= 5) return;

    if (row === m - 1 && col === n - 1) {
      samplePaths.push(path);
      return;
    }

    if (row < m - 1) {
      generateSamplePaths(row + 1, col, path + "D", count + 1);
    }

    if (col < n - 1) {
      generateSamplePaths(row, col + 1, path + "R", count + 1);
    }
  }

  generateSamplePaths(0, 0, "", 0);

  return { totalPaths, samplePaths };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Unique Paths Tests ===");
  console.log("=== Kiểm thử bài toán Đường đi duy nhất ===\n");

  const testCases = [
    {
      name: "Example 1: 3x7 grid",
      m: 3,
      n: 7,
      expected: 28,
      description: "3 rows, 7 columns",
    },
    {
      name: "Example 2: 3x2 grid",
      m: 3,
      n: 2,
      expected: 3,
      description: "3 rows, 2 columns",
    },
    {
      name: "1x1 grid",
      m: 1,
      n: 1,
      expected: 1,
      description: "Single cell",
    },
    {
      name: "1x5 grid",
      m: 1,
      n: 5,
      expected: 1,
      description: "Single row",
    },
    {
      name: "5x1 grid",
      m: 5,
      n: 1,
      expected: 1,
      description: "Single column",
    },
    {
      name: "2x2 grid",
      m: 2,
      n: 2,
      expected: 2,
      description: "2x2 grid has 2 paths",
    },
    {
      name: "3x3 grid",
      m: 3,
      n: 3,
      expected: 6,
      description: "3x3 grid has 6 paths",
    },
    {
      name: "Large grid",
      m: 7,
      n: 3,
      expected: 28,
      description: "7x3 grid (same as 3x7)",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Grid: ${testCase.m}x${testCase.n}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = uniquePaths(testCase.m, testCase.n);
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

  // Test with visualization
  console.log("\n=== Testing with Visualization ===");
  console.log("=== Kiểm thử với hiển thị đường đi ===\n");

  const testGrid = { m: 3, n: 3 };
  const resultWithViz = uniquePathsWithVisualization(testGrid.m, testGrid.n);

  console.log(`Grid: ${testGrid.m}x${testGrid.n}`);
  console.log(`Total Paths: ${resultWithViz.totalPaths}`);
  console.log(`Sample Paths:`);
  resultWithViz.samplePaths.forEach((path, index) => {
    console.log(`  ${index + 1}. ${path}`);
  });

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const testSize = { m: 10, n: 10 };

  console.log(`Testing with ${testSize.m}x${testSize.n} grid...`);
  console.log(`Kiểm thử với lưới ${testSize.m}x${testSize.n}...`);

  const start1 = performance.now();
  const result1 = uniquePaths(testSize.m, testSize.n);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = uniquePaths2D(testSize.m, testSize.n);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = uniquePathsMath(testSize.m, testSize.n);
  const time3 = performance.now() - start3;

  const start4 = performance.now();
  const result4 = uniquePathsRecursive(testSize.m, testSize.n);
  const time4 = performance.now() - start4;

  console.log(`1D DP: ${time1.toFixed(4)}ms`);
  console.log(`2D DP: ${time2.toFixed(4)}ms`);
  console.log(`Math: ${time3.toFixed(4)}ms`);
  console.log(`Recursive: ${time4.toFixed(4)}ms`);
  console.log(
    `Results match: ${
      result1 === result2 && result2 === result3 && result3 === result4
        ? "✅ Yes"
        : "❌ No"
    }`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  uniquePaths,
  uniquePaths2D,
  uniquePathsMath,
  uniquePathsRecursive,
  uniquePathsWithVisualization,
};
{% endraw %}
