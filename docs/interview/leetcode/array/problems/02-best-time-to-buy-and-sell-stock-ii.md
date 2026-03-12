---
layout: page
title: "Best Time to Buy and Sell Stock II"
difficulty: Hard
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/"
---

# Best Time to Buy and Sell Stock II

**LeetCode Problem # * 122. Best Time to Buy and Sell Stock II**

## Problem Description

 * You are given an integer array prices where prices[i] is the price of a given stock on the ith day.  * On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of  * the stock at any time. However, you can buy it then immediately sell it on the same day.  *  * Find and return the maximum profit you can achieve. 

## Solutions

{% raw %}
/**
 * 122. Best Time to Buy and Sell Stock II
 *
 * Problem:
 * You are given an integer array prices where prices[i] is the price of a given stock on the ith day.
 * On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of
 * the stock at any time. However, you can buy it then immediately sell it on the same day.
 *
 * Find and return the maximum profit you can achieve.
 *
 * Example:
 * Input: prices = [7,1,5,3,6,4]
 * Output: 7
 * Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
 * Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
 * Total profit is 4 + 3 = 7.
 *
 * Input: prices = [1,2,3,4,5]
 * Output: 4
 * Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
 * Total profit is 4.
 *
 * LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
 */

/**
 * Solution 1: Peak Valley Approach (Optimal)
 *
 * Approach:
 * - Find all peaks and valleys in the price array
 * - Buy at valleys and sell at peaks
 * - Sum up all the profits from each transaction
 *
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(1) - constant extra space
 */
function maxProfit(prices: number[]): number {
  if (prices.length <= 1) return 0;

  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    // If current price is higher than previous, add the difference to profit
    if (prices[i] > prices[i - 1]) {
      maxProfit += prices[i] - prices[i - 1];
    }
  }

  return maxProfit;
}

/**
 * Solution 2: Dynamic Programming Approach
 *
 * Approach:
 * - Use DP to track maximum profit with and without holding stock
 * - dp[i][0] = max profit on day i without holding stock
 * - dp[i][1] = max profit on day i with holding stock
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - DP array
 */
function maxProfitDP(prices: number[]): number {
  if (prices.length <= 1) return 0;

  const n = prices.length;
  const dp: number[][] = Array(n)
    .fill(0)
    .map(() => Array(2).fill(0));

  // Base case: day 0
  dp[0][0] = 0; // No stock held
  dp[0][1] = -prices[0]; // Bought stock on day 0

  for (let i = 1; i < n; i++) {
    // Not holding stock: either keep not holding or sell today
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);

    // Holding stock: either keep holding or buy today
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
  }

  return dp[n - 1][0]; // Final state should be not holding stock
}

/**
 * Solution 3: Optimized DP (Space Optimized)
 *
 * Approach:
 * - Same logic as DP but only keep track of previous state
 * - Reduces space complexity to O(1)
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function maxProfitDPOptimized(prices: number[]): number {
  if (prices.length <= 1) return 0;

  let notHold = 0; // Max profit without holding stock
  let hold = -prices[0]; // Max profit with holding stock

  for (let i = 1; i < prices.length; i++) {
    const prevNotHold = notHold;
    const prevHold = hold;

    // Not holding stock: either keep not holding or sell today
    notHold = Math.max(prevNotHold, prevHold + prices[i]);

    // Holding stock: either keep holding or buy today
    hold = Math.max(prevHold, prevNotHold - prices[i]);
  }

  return notHold; // Final state should be not holding stock
}

/**
 * Solution 4: Greedy with Local Minima and Maxima
 *
 * Approach:
 * - Find all local minima (buy points) and local maxima (sell points)
 * - Calculate profit for each buy-sell pair
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function maxProfitLocalExtrema(prices: number[]): number {
  if (prices.length <= 1) return 0;

  let maxProfit = 0;
  let buyPrice = prices[0];

  for (let i = 1; i < prices.length; i++) {
    // If price is going down, update buy price
    if (prices[i] < prices[i - 1]) {
      // Sell at previous price if we have a profit
      if (prices[i - 1] > buyPrice) {
        maxProfit += prices[i - 1] - buyPrice;
      }
      buyPrice = prices[i];
    }
  }

  // Check if we need to sell at the end
  if (prices[prices.length - 1] > buyPrice) {
    maxProfit += prices[prices.length - 1] - buyPrice;
  }

  return maxProfit;
}

/**
 * Solution 5: Brute Force (For comparison - not recommended)
 *
 * Approach:
 * - Try all possible combinations of buy and sell days
 * - Use recursion to explore all possibilities
 *
 * Time Complexity: O(2^n) - exponential
 * Space Complexity: O(n) - recursion stack
 */
function maxProfitBruteForce(prices: number[]): number {
  function calculateMaxProfit(index: number, holding: boolean): number {
    if (index >= prices.length) return 0;

    if (holding) {
      // Can sell or hold
      return Math.max(
        prices[index] + calculateMaxProfit(index + 1, false), // Sell
        calculateMaxProfit(index + 1, true) // Hold
      );
    } else {
      // Can buy or skip
      return Math.max(
        -prices[index] + calculateMaxProfit(index + 1, true), // Buy
        calculateMaxProfit(index + 1, false) // Skip
      );
    }
  }

  return calculateMaxProfit(0, false);
}

// Test cases
function testMaxProfit() {
  console.log("=== Testing Best Time to Buy and Sell Stock II ===\n");

  const testCases = [
    {
      input: [7, 1, 5, 3, 6, 4],
      expected: 7,
      description: "Multiple buy-sell opportunities",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: 4,
      description: "Consistently increasing prices",
    },
    {
      input: [7, 6, 4, 3, 1],
      expected: 0,
      description: "Consistently decreasing prices",
    },
    {
      input: [1, 2, 3, 2, 1],
      expected: 2,
      description: "Peak in the middle",
    },
    {
      input: [1],
      expected: 0,
      description: "Single day",
    },
    {
      input: [],
      expected: 0,
      description: "Empty array",
    },
    {
      input: [3, 3, 3, 3, 3],
      expected: 0,
      description: "Same price every day",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input}]`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Peak Valley)
    const result1 = maxProfit([...testCase.input]);
    console.log(
      `Solution 1 (Peak Valley): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (DP)
    const result2 = maxProfitDP([...testCase.input]);
    console.log(
      `Solution 2 (DP): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Optimized DP)
    const result3 = maxProfitDPOptimized([...testCase.input]);
    console.log(
      `Solution 3 (Optimized DP): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Local Extrema)
    const result4 = maxProfitLocalExtrema([...testCase.input]);
    console.log(
      `Solution 4 (Local Extrema): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Brute Force) - only for small arrays
    if (testCase.input.length <= 10) {
      const result5 = maxProfitBruteForce([...testCase.input]);
      console.log(
        `Solution 5 (Brute Force): ${result5} ${
          result5 === testCase.expected ? "✅" : "❌"
        }`
      );
    } else {
      console.log(`Solution 5 (Brute Force): Skipped (array too large)`);
    }

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  // Create large price array
  const largePrices = Array.from(
    { length: 100000 },
    (_, i) => Math.floor(Math.random() * 100) + 1
  );

  const testCases = [
    { name: "Peak Valley", func: maxProfit },
    { name: "DP", func: maxProfitDP },
    { name: "Optimized DP", func: maxProfitDPOptimized },
    { name: "Local Extrema", func: maxProfitLocalExtrema },
  ];

  testCases.forEach(({ name, func }) => {
    const testPrices = [...largePrices];
    const start = performance.now();
    const result = func(testPrices);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result} profit`);
    console.log(`  Memory: ${name === "DP" ? "O(n)" : "O(1)"}\n`);
  });
}

// Run tests
if (require.main === module) {
  testMaxProfit();
  performanceComparison();
}

export {
  maxProfit,
  maxProfitDP,
  maxProfitDPOptimized,
  maxProfitLocalExtrema,
  maxProfitBruteForce,
};
{% endraw %}
