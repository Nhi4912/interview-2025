/**
 * Best Time to Buy and Sell Stock
 *
 * Problem: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 *
 * You are given an array prices where prices[i] is the price of a given stock on the ith day.
 * You want to maximize your profit by choosing a single day to buy one stock and choosing
 * a different day in the future to sell that stock.
 *
 * Return the maximum profit you can achieve from this transaction. If you cannot achieve
 * any profit, return 0.
 *
 * Example 1:
 * Input: prices = [7,1,5,3,6,4]
 * Output: 5
 * Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
 * Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
 *
 * Example 2:
 * Input: prices = [7,6,4,3,1]
 * Output: 0
 * Explanation: In this case, no transactions are done and the max profit = 0.
 *
 * Constraints:
 * - 1 <= prices.length <= 10^5
 * - 0 <= prices[i] <= 10^4
 *
 * Solution Approach:
 * 1. One Pass Algorithm (Kadane's Algorithm variant)
 * 2. Keep track of minimum price seen so far
 * 3. Calculate potential profit at each step
 * 4. Update maximum profit if current profit is higher
 *
 * Time Complexity: O(n) where n is the length of prices array
 * Space Complexity: O(1) as we only use a constant amount of extra space
 */

/**
 * Best Time to Buy and Sell Stock - One Pass Solution
 *
 * Thuật toán một lần duyệt (biến thể của thuật toán Kadane)
 *
 * @param prices - Mảng giá cổ phiếu theo ngày
 * @returns Lợi nhuận tối đa có thể đạt được
 */
function maxProfit(prices: number[]): number {
  if (prices.length < 2) return 0;

  let minPrice = prices[0]; // Giá thấp nhất đã thấy
  let maxProfit = 0; // Lợi nhuận tối đa

  for (let i = 1; i < prices.length; i++) {
    // Cập nhật giá thấp nhất nếu tìm thấy giá thấp hơn
    minPrice = Math.min(minPrice, prices[i]);

    // Tính lợi nhuận tiềm năng nếu bán tại ngày hiện tại
    const currentProfit = prices[i] - minPrice;

    // Cập nhật lợi nhuận tối đa nếu lợi nhuận hiện tại cao hơn
    maxProfit = Math.max(maxProfit, currentProfit);
  }

  return maxProfit;
}

/**
 * Alternative Solution: Two Pointers Approach
 *
 * Giải pháp thay thế: Sử dụng hai con trỏ
 *
 * @param prices - Mảng giá cổ phiếu theo ngày
 * @returns Lợi nhuận tối đa có thể đạt được
 */
function maxProfitTwoPointers(prices: number[]): number {
  if (prices.length < 2) return 0;

  let buy = 0; // Con trỏ mua
  let sell = 1; // Con trỏ bán
  let maxProfit = 0;

  while (sell < prices.length) {
    const profit = prices[sell] - prices[buy];

    if (profit > 0) {
      // Có lợi nhuận, cập nhật maxProfit
      maxProfit = Math.max(maxProfit, profit);
    } else {
      // Không có lợi nhuận, di chuyển con trỏ mua
      buy = sell;
    }

    sell++;
  }

  return maxProfit;
}

/**
 * Brute Force Solution (for comparison)
 *
 * Giải pháp vét cạn (để so sánh)
 *
 * @param prices - Mảng giá cổ phiếu theo ngày
 * @returns Lợi nhuận tối đa có thể đạt được
 */
function maxProfitBruteForce(prices: number[]): number {
  let maxProfit = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      const profit = prices[j] - prices[i];
      maxProfit = Math.max(maxProfit, profit);
    }
  }

  return maxProfit;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Best Time to Buy and Sell Stock Tests ===");
  console.log("=== Kiểm thử bài toán Mua bán cổ phiếu ===\n");

  const testCases = [
    {
      name: "Example 1: Normal case with profit",
      input: [7, 1, 5, 3, 6, 4],
      expected: 5,
      description: "Buy at 1, sell at 6 = profit of 5",
    },
    {
      name: "Example 2: No profit possible",
      input: [7, 6, 4, 3, 1],
      expected: 0,
      description: "Prices only decrease, no profit possible",
    },
    {
      name: "Single day",
      input: [5],
      expected: 0,
      description: "Cannot buy and sell on same day",
    },
    {
      name: "Two days - profit",
      input: [3, 8],
      expected: 5,
      description: "Buy at 3, sell at 8 = profit of 5",
    },
    {
      name: "Two days - no profit",
      input: [8, 3],
      expected: 0,
      description: "Price decreases, no profit",
    },
    {
      name: "All same prices",
      input: [5, 5, 5, 5],
      expected: 0,
      description: "No price difference, no profit",
    },
    {
      name: "Large profit at end",
      input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      expected: 9,
      description: "Buy at 1, sell at 10 = profit of 9",
    },
    {
      name: "Large profit at beginning",
      input: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      expected: 0,
      description: "Prices only decrease, no profit",
    },
    {
      name: "Profit in middle",
      input: [3, 2, 6, 5, 0, 3],
      expected: 4,
      description: "Buy at 2, sell at 6 = profit of 4",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = maxProfit(testCase.input);
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

  // Performance comparison / So sánh hiệu suất
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeInput = Array.from({ length: 10000 }, (_, i) =>
    Math.floor(Math.random() * 1000)
  );

  console.log("Testing with large input (10,000 elements)...");
  console.log("Kiểm thử với dữ liệu lớn (10,000 phần tử)...");

  const start1 = performance.now();
  const result1 = maxProfit(largeInput);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = maxProfitTwoPointers(largeInput);
  const time2 = performance.now() - start2;

  console.log(`One Pass Solution: ${time1.toFixed(4)}ms`);
  console.log(`Two Pointers Solution: ${time2.toFixed(4)}ms`);
  console.log(`Results match: ${result1 === result2 ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { maxProfit, maxProfitTwoPointers, maxProfitBruteForce };
