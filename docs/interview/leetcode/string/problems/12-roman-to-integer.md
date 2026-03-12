---
layout: page
title: "Roman to Integer"
difficulty: Hard
category: String
tags: [String, Hash Table]
leetcode_url: "https://leetcode.com/problems/roman-to-integer/"
---

# Roman to Integer



## Problem Description

 *  * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.  *  * Symbol       Value  * I             1 

## Solutions

{% raw %}
/**
 * Roman to Integer
 *
 * Problem: https://leetcode.com/problems/roman-to-integer/
 *
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
 *
 * Symbol       Value
 * I             1
 * V             5
 * X             10
 * L             50
 * C             100
 * D             500
 * M             1000
 *
 * For example, 2 is written as II in Roman numeral, just two one's added together.
 * 12 is written as XII, which is simply X + II. The number 27 is written as XXVII,
 * which is XX + V + II.
 *
 * Roman numerals are usually written largest to smallest from left to right.
 * However, the numeral for four is not IIII. Instead, the number four is written as IV.
 * Because the one is before the five we subtract it making four. The same principle
 * applies to the number nine, which is written as IX. There are six instances where
 * subtraction is used:
 *
 * I can be placed before V (5) and X (10) to make 4 and 9.
 * X can be placed before L (50) and C (100) to make 40 and 90.
 * C can be placed before D (500) and M (1000) to make 400 and 900.
 *
 * Given a roman numeral, convert it to an integer.
 *
 * Example 1:
 * Input: s = "III"
 * Output: 3
 * Explanation: III = 3.
 *
 * Example 2:
 * Input: s = "LVIII"
 * Output: 58
 * Explanation: L = 50, V = 5, III = 3.
 *
 * Example 3:
 * Input: s = "MCMXCIV"
 * Output: 1994
 * Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
 *
 * Constraints:
 * - 1 <= s.length <= 15
 * - s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
 * - It is guaranteed that s is a valid roman numeral in the range [1, 3999].
 *
 * Solution Approaches:
 * 1. Left-to-Right with subtraction rule
 * 2. Right-to-Left approach
 * 3. Using a mapping with special cases
 * 4. Recursive approach
 *
 * Time Complexity: O(n) where n is the length of the string
 * Space Complexity: O(1) for constant space usage
 */

/**
 * Roman to Integer - Left-to-Right Solution
 *
 * Giải pháp chuyển đổi số La Mã sang số nguyên - Từ trái sang phải
 *
 * @param s - Roman numeral string
 * @returns Integer value
 */
function romanToInt(s: string): number {
  const romanValues: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  let prevValue = 0;

  // Process from left to right
  for (let i = 0; i < s.length; i++) {
    const currentValue = romanValues[s[i]];

    // If current value is greater than previous, subtract previous
    if (currentValue > prevValue) {
      result += currentValue - 2 * prevValue;
    } else {
      result += currentValue;
    }

    prevValue = currentValue;
  }

  return result;
}

/**
 * Alternative Solution: Right-to-Left Approach
 *
 * Giải pháp thay thế: Phương pháp từ phải sang trái
 *
 * @param s - Roman numeral string
 * @returns Integer value
 */
function romanToIntRightToLeft(s: string): number {
  const romanValues: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  let maxValue = 0;

  // Process from right to left
  for (let i = s.length - 1; i >= 0; i--) {
    const currentValue = romanValues[s[i]];

    if (currentValue >= maxValue) {
      result += currentValue;
      maxValue = currentValue;
    } else {
      result -= currentValue;
    }
  }

  return result;
}

/**
 * Solution with Special Cases Mapping
 *
 * Giải pháp với bảng ánh xạ các trường hợp đặc biệt
 *
 * @param s - Roman numeral string
 * @returns Integer value
 */
function romanToIntWithSpecialCases(s: string): number {
  const specialCases: { [key: string]: number } = {
    IV: 4,
    IX: 9,
    XL: 40,
    XC: 90,
    CD: 400,
    CM: 900,
  };

  const romanValues: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  let i = 0;

  while (i < s.length) {
    // Check for special cases (two characters)
    if (i < s.length - 1) {
      const twoChar = s.substring(i, i + 2);
      if (specialCases[twoChar]) {
        result += specialCases[twoChar];
        i += 2;
        continue;
      }
    }

    // Single character
    result += romanValues[s[i]];
    i++;
  }

  return result;
}

/**
 * Recursive Solution
 *
 * Giải pháp đệ quy
 *
 * @param s - Roman numeral string
 * @returns Integer value
 */
function romanToIntRecursive(s: string): number {
  const romanValues: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  function helper(index: number): number {
    if (index >= s.length) return 0;

    const currentValue = romanValues[s[index]];

    // Check if next character forms a special case
    if (index < s.length - 1) {
      const nextValue = romanValues[s[index + 1]];
      if (currentValue < nextValue) {
        return nextValue - currentValue + helper(index + 2);
      }
    }

    return currentValue + helper(index + 1);
  }

  return helper(0);
}

/**
 * Solution with Validation
 *
 * Giải pháp với kiểm tra tính hợp lệ
 *
 * @param s - Roman numeral string
 * @returns Integer value with validation
 */
function romanToIntWithValidation(s: string): {
  result: number;
  isValid: boolean;
} {
  // Validation rules
  const validPatterns = [
    /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
  ];

  const isValid = validPatterns.some((pattern) => pattern.test(s));

  if (!isValid) {
    return { result: 0, isValid: false };
  }

  return { result: romanToInt(s), isValid: true };
}

/**
 * Solution with Detailed Breakdown
 *
 * Giải pháp với phân tích chi tiết
 *
 * @param s - Roman numeral string
 * @returns Object with result and breakdown
 */
function romanToIntWithBreakdown(s: string): {
  result: number;
  breakdown: Array<{ roman: string; value: number; explanation: string }>;
} {
  const breakdown: Array<{
    roman: string;
    value: number;
    explanation: string;
  }> = [];
  let result = 0;
  let i = 0;

  const romanValues: { [key: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  while (i < s.length) {
    const currentChar = s[i];
    const currentValue = romanValues[currentChar];

    // Check for subtraction cases
    if (i < s.length - 1) {
      const nextChar = s[i + 1];
      const nextValue = romanValues[nextChar];

      if (currentValue < nextValue) {
        const combinedValue = nextValue - currentValue;
        breakdown.push({
          roman: currentChar + nextChar,
          value: combinedValue,
          explanation: `${nextValue} - ${currentValue} = ${combinedValue}`,
        });
        result += combinedValue;
        i += 2;
        continue;
      }
    }

    // Regular case
    breakdown.push({
      roman: currentChar,
      value: currentValue,
      explanation: `Direct value: ${currentValue}`,
    });
    result += currentValue;
    i++;
  }

  return { result, breakdown };
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function comparePerformance(s: string): void {
  const testCases = [
    "I",
    "III",
    "IV",
    "IX",
    "LVIII",
    "MCMXCIV",
    "MMMCMXCIX", // 3999
  ];

  console.log("Performance Comparison / So sánh hiệu suất:");
  console.log("=".repeat(50));

  for (const testCase of testCases) {
    console.log(`\nInput: ${testCase}`);

    const start1 = performance.now();
    const result1 = romanToInt(testCase);
    const time1 = performance.now() - start1;

    const start2 = performance.now();
    const result2 = romanToIntRightToLeft(testCase);
    const time2 = performance.now() - start2;

    const start3 = performance.now();
    const result3 = romanToIntWithSpecialCases(testCase);
    const time3 = performance.now() - start3;

    const start4 = performance.now();
    const result4 = romanToIntRecursive(testCase);
    const time4 = performance.now() - start4;

    console.log(`Result: ${result1}`);
    console.log(`Left-to-Right: ${time1.toFixed(4)}ms`);
    console.log(`Right-to-Left: ${time2.toFixed(4)}ms`);
    console.log(`Special Cases: ${time3.toFixed(4)}ms`);
    console.log(`Recursive: ${time4.toFixed(4)}ms`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Roman to Integer Tests / Kiểm thử chuyển đổi số La Mã");
  console.log("=".repeat(50));

  const testCases = [
    { input: "I", expected: 1 },
    { input: "III", expected: 3 },
    { input: "IV", expected: 4 },
    { input: "V", expected: 5 },
    { input: "IX", expected: 9 },
    { input: "X", expected: 10 },
    { input: "XL", expected: 40 },
    { input: "L", expected: 50 },
    { input: "XC", expected: 90 },
    { input: "C", expected: 100 },
    { input: "CD", expected: 400 },
    { input: "D", expected: 500 },
    { input: "CM", expected: 900 },
    { input: "M", expected: 1000 },
    { input: "LVIII", expected: 58 },
    { input: "MCMXCIV", expected: 1994 },
    { input: "MMMCMXCIX", expected: 3999 },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result1 = romanToInt(testCase.input);
    const result2 = romanToIntRightToLeft(testCase.input);
    const result3 = romanToIntWithSpecialCases(testCase.input);
    const result4 = romanToIntRecursive(testCase.input);

    const allCorrect =
      result1 === testCase.expected &&
      result2 === testCase.expected &&
      result3 === testCase.expected &&
      result4 === testCase.expected;

    if (allCorrect) {
      console.log(`✅ ${testCase.input} = ${result1}`);
      passed++;
    } else {
      console.log(
        `❌ ${testCase.input}: expected ${testCase.expected}, got ${result1}`
      );
      failed++;
    }
  }

  console.log(`\nTest Results / Kết quả kiểm thử:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${testCases.length}`);

  // Test detailed breakdown
  console.log("\nDetailed Breakdown Example / Ví dụ phân tích chi tiết:");
  const breakdown = romanToIntWithBreakdown("MCMXCIV");
  console.log(`Input: MCMXCIV`);
  console.log(`Result: ${breakdown.result}`);
  console.log("Breakdown / Phân tích:");
  breakdown.breakdown.forEach((item, index) => {
    console.log(
      `  ${index + 1}. ${item.roman} = ${item.value} (${item.explanation})`
    );
  });

  // Test validation
  console.log("\nValidation Tests / Kiểm thử tính hợp lệ:");
  const validTest = romanToIntWithValidation("MCMXCIV");
  const invalidTest = romanToIntWithValidation("IIII"); // Invalid
  console.log(`Valid input: ${validTest.isValid}, Result: ${validTest.result}`);
  console.log(
    `Invalid input: ${invalidTest.isValid}, Result: ${invalidTest.result}`
  );
}

// Uncomment to run tests
// runTests();
// console.log("\n" + "=".repeat(50));
// comparePerformance("MCMXCIV");

export {
  romanToInt,
  romanToIntRightToLeft,
  romanToIntWithSpecialCases,
  romanToIntRecursive,
  romanToIntWithValidation,
  romanToIntWithBreakdown,
  comparePerformance,
  runTests,
};
{% endraw %}
