/**
 * Coin Change
 *
 * Problem: https://leetcode.com/problems/coin-change/
 *
 * You are given an integer array coins representing coins of different denominations
 * and an integer amount representing a total amount of money.
 *
 * Return the fewest number of coins that you need to make up that amount. If that
 * amount of money cannot be made up by any combination of the coins, return -1.
 *
 * You may assume that you have an infinite number of each kind of coin.
 *
 * Example 1:
 * Input: coins = [1,2,5], amount = 11
 * Output: 3
 * Explanation: 11 = 5 + 5 + 1
 *
 * Example 2:
 * Input: coins = [2], amount = 3
 * Output: -1
 *
 * Example 3:
 * Input: coins = [1], amount = 0
 * Output: 0
 *
 * Constraints:
 * - 1 <= coins.length <= 12
 * - 1 <= coins[i] <= 2^31 - 1
 * - 0 <= amount <= 10^4
 *
 * Solution Approach:
 * 1. Dynamic Programming with unbounded knapsack
 * 2. Create DP array where dp[i] = minimum coins needed for amount i
 * 3. For each amount, try all coin denominations
 * 4. Return dp[amount] or -1 if not possible
 *
 * Time Complexity: O(amount * number of coins)
 * Space Complexity: O(amount)
 */

/**
 * Coin Change - Dynamic Programming Solution
 *
 * Giải pháp Quy hoạch động cho bài toán Đổi tiền
 *
 * @param coins - Mảng các mệnh giá tiền xu
 * @param amount - Số tiền cần đổi
 * @returns Số lượng tiền xu ít nhất cần thiết, -1 nếu không thể đổi
 */
function coinChange(coins: number[], amount: number): number {
  if (amount === 0) return 0;
  if (coins.length === 0) return -1;

  // Khởi tạo mảng DP với giá trị vô cùng
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Số tiền 0 cần 0 đồng xu

  // Điền bảng DP
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * Alternative Solution: Recursive with Memoization
 *
 * Giải pháp thay thế: Đệ quy với ghi nhớ
 *
 * @param coins - Mảng các mệnh giá tiền xu
 * @param amount - Số tiền cần đổi
 * @returns Số lượng tiền xu ít nhất cần thiết, -1 nếu không thể đổi
 */
function coinChangeRecursive(coins: number[], amount: number): number {
  const memo = new Map<number, number>();

  function coinChangeHelper(target: number): number {
    if (target === 0) return 0;
    if (target < 0) return -1;

    if (memo.has(target)) {
      return memo.get(target)!;
    }

    let minCoins = Infinity;

    for (const coin of coins) {
      const result = coinChangeHelper(target - coin);
      if (result !== -1) {
        minCoins = Math.min(minCoins, result + 1);
      }
    }

    const finalResult = minCoins === Infinity ? -1 : minCoins;
    memo.set(target, finalResult);
    return finalResult;
  }

  return coinChangeHelper(amount);
}

/**
 * Solution with Coin Selection Tracking
 *
 * Giải pháp với theo dõi việc chọn tiền xu
 *
 * @param coins - Mảng các mệnh giá tiền xu
 * @param amount - Số tiền cần đổi
 * @returns Object chứa số lượng tiền xu và danh sách tiền xu được chọn
 */
function coinChangeWithSelection(
  coins: number[],
  amount: number
): {
  minCoins: number;
  selectedCoins: number[];
} {
  if (amount === 0) return { minCoins: 0, selectedCoins: [] };
  if (coins.length === 0) return { minCoins: -1, selectedCoins: [] };

  const dp = new Array(amount + 1).fill(Infinity);
  const coinUsed = new Array(amount + 1).fill(-1);

  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      const coin = coins[j];
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        coinUsed[i] = j;
      }
    }
  }

  if (dp[amount] === Infinity) {
    return { minCoins: -1, selectedCoins: [] };
  }

  // Tái tạo danh sách tiền xu được chọn
  const selectedCoins: number[] = [];
  let currentAmount = amount;

  while (currentAmount > 0) {
    const coinIndex = coinUsed[currentAmount];
    selectedCoins.push(coins[coinIndex]);
    currentAmount -= coins[coinIndex];
  }

  return { minCoins: dp[amount], selectedCoins };
}

/**
 * Greedy Solution (for specific cases)
 *
 * Giải pháp tham lam (cho trường hợp đặc biệt)
 *
 * @param coins - Mảng các mệnh giá tiền xu
 * @param amount - Số tiền cần đổi
 * @returns Số lượng tiền xu ít nhất cần thiết, -1 nếu không thể đổi
 */
function coinChangeGreedy(coins: number[], amount: number): number {
  if (amount === 0) return 0;

  // Sắp xếp coins theo thứ tự giảm dần
  const sortedCoins = [...coins].sort((a, b) => b - a);

  let remainingAmount = amount;
  let coinCount = 0;

  for (const coin of sortedCoins) {
    while (remainingAmount >= coin) {
      remainingAmount -= coin;
      coinCount++;
    }
  }

  return remainingAmount === 0 ? coinCount : -1;
}

/**
 * Solution with All Possible Combinations
 *
 * Giải pháp với tất cả tổ hợp có thể
 *
 * @param coins - Mảng các mệnh giá tiền xu
 * @param amount - Số tiền cần đổi
 * @returns Object chứa số lượng tối thiểu và tất cả tổ hợp có thể
 */
function coinChangeWithCombinations(
  coins: number[],
  amount: number
): {
  minCoins: number;
  combinations: number[][];
} {
  if (amount === 0) return { minCoins: 0, combinations: [[]] };
  if (coins.length === 0) return { minCoins: -1, combinations: [] };

  const dp = new Array(amount + 1).fill(Infinity);
  const combinations: number[][][] = new Array(amount + 1)
    .fill(null)
    .map(() => []);

  dp[0] = 0;
  combinations[0] = [[]];

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 <= dp[i]) {
        if (dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          combinations[i] = [];
        }

        for (const combo of combinations[i - coin]) {
          combinations[i].push([...combo, coin]);
        }
      }
    }
  }

  return {
    minCoins: dp[amount] === Infinity ? -1 : dp[amount],
    combinations: combinations[amount],
  };
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Coin Change Tests ===");
  console.log("=== Kiểm thử bài toán Đổi tiền ===\n");

  const testCases = [
    {
      name: "Example 1: Standard case",
      coins: [1, 2, 5],
      amount: 11,
      expected: 3,
      description: "11 = 5 + 5 + 1 (3 coins)",
    },
    {
      name: "Example 2: Impossible case",
      coins: [2],
      amount: 3,
      expected: -1,
      description: "Cannot make 3 with only 2-value coins",
    },
    {
      name: "Example 3: Zero amount",
      coins: [1],
      amount: 0,
      expected: 0,
      description: "Zero amount needs zero coins",
    },
    {
      name: "Single coin type",
      coins: [1],
      amount: 5,
      expected: 5,
      description: "Need 5 coins of value 1",
    },
    {
      name: "Large amount",
      coins: [1, 2, 5],
      amount: 100,
      expected: 20,
      description: "100 = 20 * 5 (20 coins)",
    },
    {
      name: "Empty coins array",
      coins: [],
      amount: 5,
      expected: -1,
      description: "No coins available",
    },
    {
      name: "Coins larger than amount",
      coins: [10, 20, 50],
      amount: 5,
      expected: -1,
      description: "All coins are larger than amount",
    },
    {
      name: "Perfect match",
      coins: [1, 3, 4],
      amount: 6,
      expected: 2,
      description: "6 = 3 + 3 (2 coins)",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Coins: [${testCase.coins.join(", ")}]`);
    console.log(`Amount: ${testCase.amount}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = coinChange(testCase.coins, testCase.amount);
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
  console.log("=== Kiểm thử với theo dõi việc chọn tiền xu ===\n");

  const testCoins = [1, 2, 5];
  const testAmount = 11;
  const resultWithSelection = coinChangeWithSelection(testCoins, testAmount);

  console.log(`Coins: [${testCoins.join(", ")}]`);
  console.log(`Amount: ${testAmount}`);
  console.log(`Min Coins: ${resultWithSelection.minCoins}`);
  console.log(
    `Selected Coins: [${resultWithSelection.selectedCoins.join(", ")}]`
  );
  console.log(
    `Sum: ${resultWithSelection.selectedCoins.reduce((a, b) => a + b, 0)}`
  );

  // Test with combinations
  console.log("\n=== Testing with All Combinations ===");
  console.log("=== Kiểm thử với tất cả tổ hợp ===\n");

  const resultWithCombinations = coinChangeWithCombinations(
    testCoins,
    testAmount
  );

  console.log(`Min Coins: ${resultWithCombinations.minCoins}`);
  console.log(
    `Number of combinations: ${resultWithCombinations.combinations.length}`
  );
  console.log("All combinations:");
  resultWithCombinations.combinations.forEach((combo, index) => {
    console.log(
      `  ${index + 1}. [${combo.join(", ")}] = ${combo.reduce(
        (a, b) => a + b,
        0
      )}`
    );
  });

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeCoins = [1, 2, 5, 10, 20, 50];
  const largeAmount = 1000;

  console.log("Testing with large input...");
  console.log("Kiểm thử với đầu vào lớn...");

  const start1 = performance.now();
  const result1 = coinChange(largeCoins, largeAmount);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = coinChangeRecursive(largeCoins, largeAmount);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = coinChangeGreedy(largeCoins, largeAmount);
  const time3 = performance.now() - start3;

  console.log(`DP: ${time1.toFixed(4)}ms, Result: ${result1}`);
  console.log(`Recursive: ${time2.toFixed(4)}ms, Result: ${result2}`);
  console.log(`Greedy: ${time3.toFixed(4)}ms, Result: ${result3}`);
  console.log(`Results match: ${result1 === result2 ? "✅ Yes" : "❌ No"}`);

  // Test greedy vs optimal
  console.log("\n=== Greedy vs Optimal Comparison ===");
  console.log("=== So sánh tham lam vs tối ưu ===\n");

  const testCases2 = [
    { coins: [1, 3, 4], amount: 6 },
    { coins: [1, 5, 10, 25], amount: 67 },
    { coins: [1, 2, 5], amount: 11 },
  ];

  for (const testCase of testCases2) {
    const optimal = coinChange(testCase.coins, testCase.amount);
    const greedy = coinChangeGreedy(testCase.coins, testCase.amount);

    console.log(
      `Coins: [${testCase.coins.join(", ")}], Amount: ${testCase.amount}`
    );
    console.log(`Optimal: ${optimal}, Greedy: ${greedy}`);
    console.log(
      `Greedy is optimal: ${optimal === greedy ? "✅ Yes" : "❌ No"}`
    );
    console.log("");
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  coinChange,
  coinChangeRecursive,
  coinChangeWithSelection,
  coinChangeGreedy,
  coinChangeWithCombinations,
};
