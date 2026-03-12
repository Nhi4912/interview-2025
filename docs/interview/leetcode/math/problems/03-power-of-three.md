---
layout: page
title: "Power of Three"
difficulty: Hard
category: Math
tags: [Math, Hash Table]
leetcode_url: "https://leetcode.com/problems/power-of-three/"
---

# Power of Three



## Problem Description

 *  * Given an integer n, return true if it is a power of three. Otherwise, return false.  * An integer n is a power of three, if there exists an integer x such that n == 3^x.  *  * Input: n = 27 

## Solutions

{% raw %}
/**
 * Power of Three
 *
 * Problem: https://leetcode.com/problems/power-of-three/
 *
 * Given an integer n, return true if it is a power of three. Otherwise, return false.
 * An integer n is a power of three, if there exists an integer x such that n == 3^x.
 *
 * Example 1:
 * Input: n = 27
 * Output: true
 * Explanation: 27 = 3^3
 *
 * Example 2:
 * Input: n = 0
 * Output: false
 * Explanation: There is no x where 3^x = 0.
 *
 * Example 3:
 * Input: n = -1
 * Output: false
 * Explanation: There is no x where 3^x = (-1).
 *
 * Constraints:
 * - -2^31 <= n <= 2^31 - 1
 *
 * Solution Approach:
 * 1. Iterative division: Keep dividing by 3 until we can't
 * 2. Mathematical approach: Use logarithm
 * 3. Bit manipulation: Check if it's the only set bit in base-3
 * 4. Precomputed approach: Use known powers of 3
 *
 * Time Complexity: O(log n) for iterative, O(1) for mathematical
 * Space Complexity: O(1) for all approaches
 */

/**
 * Power of Three - Iterative Division
 *
 * Giải pháp chia lặp cho bài toán Lũy thừa của 3
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns true nếu n là lũy thừa của 3, false nếu không
 */
function isPowerOfThree(n: number): boolean {
  if (n <= 0) return false;

  // Chia liên tiếp cho 3 cho đến khi không thể chia được nữa
  while (n % 3 === 0) {
    n = Math.floor(n / 3);
  }

  // Nếu kết quả cuối cùng là 1, thì n là lũy thừa của 3
  return n === 1;
}

/**
 * Alternative Solution: Mathematical Approach
 *
 * Giải pháp thay thế: Phương pháp toán học
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns true nếu n là lũy thừa của 3, false nếu không
 */
function isPowerOfThreeMath(n: number): boolean {
  if (n <= 0) return false;

  // Sử dụng logarit: n = 3^x => x = log3(n) = log(n) / log(3)
  const log3 = Math.log(n) / Math.log(3);

  // Kiểm tra xem log3 có phải là số nguyên không
  return Math.abs(log3 - Math.round(log3)) < 1e-10;
}

/**
 * Solution with Precomputed Powers
 *
 * Giải pháp với lũy thừa được tính trước
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns true nếu n là lũy thừa của 3, false nếu không
 */
function isPowerOfThreePrecomputed(n: number): boolean {
  if (n <= 0) return false;

  // Các lũy thừa của 3 trong phạm vi 32-bit integer
  const powersOfThree = new Set([
    1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683, 59049, 177147, 531441,
    1594323, 4782969, 14348907, 43046721, 129140163, 387420489, 1162261467,
  ]);

  return powersOfThree.has(n);
}

/**
 * Recursive Solution
 *
 * Giải pháp đệ quy
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns true nếu n là lũy thừa của 3, false nếu không
 */
function isPowerOfThreeRecursive(n: number): boolean {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 3 !== 0) return false;

  return isPowerOfThreeRecursive(Math.floor(n / 3));
}

/**
 * Solution with Power Generation
 *
 * Giải pháp với tạo lũy thừa
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns Object chứa kết quả và lũy thừa tương ứng
 */
function isPowerOfThreeWithExponent(n: number): {
  isPower: boolean;
  exponent: number | null;
} {
  if (n <= 0) return { isPower: false, exponent: null };
  if (n === 1) return { isPower: true, exponent: 0 };

  let exponent = 0;
  let current = n;

  while (current % 3 === 0) {
    current = Math.floor(current / 3);
    exponent++;
  }

  if (current === 1) {
    return { isPower: true, exponent: exponent };
  } else {
    return { isPower: false, exponent: null };
  }
}

/**
 * Solution with All Powers Generation
 *
 * Giải pháp với tạo tất cả lũy thừa
 *
 * @param maxPower - Lũy thừa tối đa cần tạo
 * @returns Mảng các lũy thừa của 3
 */
function generatePowersOfThree(maxPower: number): number[] {
  const powers: number[] = [];
  let power = 1;

  for (let i = 0; i <= maxPower; i++) {
    powers.push(power);
    power *= 3;

    // Kiểm tra overflow
    if (power > Number.MAX_SAFE_INTEGER) {
      break;
    }
  }

  return powers;
}

/**
 * Solution with Range Check
 *
 * Giải pháp với kiểm tra phạm vi
 *
 * @param n - Số nguyên cần kiểm tra
 * @returns true nếu n là lũy thừa của 3, false nếu không
 */
function isPowerOfThreeRange(n: number): boolean {
  if (n <= 0) return false;

  // Lũy thừa lớn nhất của 3 trong phạm vi 32-bit integer
  const maxPowerOfThree = 1162261467; // 3^19

  // Nếu n không chia hết cho maxPowerOfThree, thì n không phải lũy thừa của 3
  return maxPowerOfThree % n === 0;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Power of Three Tests ===");
  console.log("=== Kiểm thử bài toán Lũy thừa của 3 ===\n");

  const testCases = [
    {
      name: "Example 1: 27",
      input: 27,
      expected: true,
      description: "27 = 3^3",
    },
    {
      name: "Example 2: 0",
      input: 0,
      expected: false,
      description: "No power of 3 equals 0",
    },
    {
      name: "Example 3: -1",
      input: -1,
      expected: false,
      description: "No power of 3 equals -1",
    },
    {
      name: "1",
      input: 1,
      expected: true,
      description: "1 = 3^0",
    },
    {
      name: "3",
      input: 3,
      expected: true,
      description: "3 = 3^1",
    },
    {
      name: "9",
      input: 9,
      expected: true,
      description: "9 = 3^2",
    },
    {
      name: "2",
      input: 2,
      expected: false,
      description: "2 is not a power of 3",
    },
    {
      name: "4",
      input: 4,
      expected: false,
      description: "4 is not a power of 3",
    },
    {
      name: "6",
      input: 6,
      expected: false,
      description: "6 is not a power of 3",
    },
    {
      name: "Large power: 19683",
      input: 19683,
      expected: true,
      description: "19683 = 3^9",
    },
    {
      name: "Large non-power: 19684",
      input: 19684,
      expected: false,
      description: "19684 is not a power of 3",
    },
  ];

  let passedTests = 0;
  const totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: ${testCase.input}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Description: ${testCase.description}`);

    const result = isPowerOfThree(testCase.input);
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

  // Test with exponent tracking
  console.log("\n=== Testing with Exponent Tracking ===");
  console.log("=== Kiểm thử với theo dõi số mũ ===\n");

  const testNumbers = [1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683];

  for (const num of testNumbers) {
    const result = isPowerOfThreeWithExponent(num);
    console.log(
      `${num}: ${result.isPower ? `3^${result.exponent}` : "Not a power of 3"}`
    );
  }

  // Generate powers of 3
  console.log("\n=== Generated Powers of 3 ===");
  console.log("=== Các lũy thừa của 3 được tạo ===\n");

  const powers = generatePowersOfThree(10);
  console.log(`First 11 powers of 3: [${powers.join(", ")}]`);
  console.log(`Số lượng lũy thừa: ${powers.length}`);

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const testInputs = [
    1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683, 59049, 177147, 531441,
  ];

  console.log("Testing with various inputs...");
  console.log("Kiểm thử với các đầu vào khác nhau...");

  const start1 = performance.now();
  for (const input of testInputs) {
    isPowerOfThree(input);
  }
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  for (const input of testInputs) {
    isPowerOfThreeMath(input);
  }
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  for (const input of testInputs) {
    isPowerOfThreePrecomputed(input);
  }
  const time3 = performance.now() - start3;

  const start4 = performance.now();
  for (const input of testInputs) {
    isPowerOfThreeRange(input);
  }
  const time4 = performance.now() - start4;

  console.log(`Iterative: ${time1.toFixed(4)}ms`);
  console.log(`Mathematical: ${time2.toFixed(4)}ms`);
  console.log(`Precomputed: ${time3.toFixed(4)}ms`);
  console.log(`Range Check: ${time4.toFixed(4)}ms`);

  // Verify all methods give same results
  console.log("\nVerifying all methods give same results:");
  console.log("Xác minh tất cả phương pháp cho kết quả giống nhau:");

  let allMatch = true;
  for (const input of testInputs) {
    const r1 = isPowerOfThree(input);
    const r2 = isPowerOfThreeMath(input);
    const r3 = isPowerOfThreePrecomputed(input);
    const r4 = isPowerOfThreeRange(input);

    if (!(r1 === r2 && r2 === r3 && r3 === r4)) {
      console.log(`Mismatch at ${input}: ${r1}, ${r2}, ${r3}, ${r4}`);
      allMatch = false;
    }
  }

  console.log(`All results match: ${allMatch ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  isPowerOfThree,
  isPowerOfThreeMath,
  isPowerOfThreePrecomputed,
  isPowerOfThreeRecursive,
  isPowerOfThreeWithExponent,
  isPowerOfThreeRange,
  generatePowersOfThree,
};
{% endraw %}
