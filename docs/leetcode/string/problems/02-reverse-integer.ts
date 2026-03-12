/**
 * 7. Reverse Integer
 *
 * Problem:
 * Given a signed 32-bit integer x, return x with its digits reversed.
 * If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1],
 * then return 0.
 *
 * Example:
 * Input: x = 123
 * Output: 321
 *
 * Input: x = -123
 * Output: -321
 *
 * Input: x = 120
 * Output: 21
 *
 * LeetCode: https://leetcode.com/problems/reverse-integer/
 */

/**
 * Solution 1: Mathematical Approach (Optimal)
 *
 * Approach:
 * - Extract digits using modulo and division
 * - Build reversed number digit by digit
 * - Check for overflow at each step
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function reverse(x: number): number {
  let result = 0;
  const isNegative = x < 0;
  let num = Math.abs(x);

  while (num > 0) {
    const digit = num % 10;

    // Check for overflow before multiplying
    if (result > Math.floor((Math.pow(2, 31) - 1) / 10)) {
      return 0;
    }

    result = result * 10 + digit;
    num = Math.floor(num / 10);
  }

  return isNegative ? -result : result;
}

/**
 * Solution 2: String Conversion
 *
 * Approach:
 * - Convert to string, reverse, convert back
 * - Handle negative sign separately
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(log n)
 */
function reverseString(x: number): number {
  const isNegative = x < 0;
  const str = Math.abs(x).toString();
  const reversedStr = str.split("").reverse().join("");

  const result = parseInt(reversedStr);

  // Check for overflow
  if (result > Math.pow(2, 31) - 1) {
    return 0;
  }

  return isNegative ? -result : result;
}

/**
 * Solution 3: Using Array Methods
 *
 * Approach:
 * - Convert to array, reverse, join
 * - More functional approach
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(log n)
 */
function reverseArray(x: number): number {
  const isNegative = x < 0;
  const digits = Math.abs(x).toString().split("");
  const reversed = digits.reverse().join("");

  const result = parseInt(reversed);

  if (result > Math.pow(2, 31) - 1) {
    return 0;
  }

  return isNegative ? -result : result;
}

/**
 * Solution 4: Bit Manipulation (Advanced)
 *
 * Approach:
 * - Use bit operations to check overflow
 * - More efficient overflow detection
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function reverseBitwise(x: number): number {
  let result = 0;
  const isNegative = x < 0;
  let num = Math.abs(x);

  while (num > 0) {
    const digit = num % 10;

    // Check overflow using bit manipulation
    if (result > 0x7fffffff / 10) {
      return 0;
    }

    result = result * 10 + digit;
    num = Math.floor(num / 10);
  }

  return isNegative ? -result : result;
}

/**
 * Solution 5: Using BigInt (Modern JavaScript)
 *
 * Approach:
 * - Use BigInt to handle large numbers
 * - Convert back to number for result
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(log n)
 */
function reverseBigInt(x: number): number {
  const isNegative = x < 0;
  const str = Math.abs(x).toString();
  const reversedStr = str.split("").reverse().join("");

  const bigResult = BigInt(reversedStr);

  // Check if result fits in 32-bit signed integer
  if (bigResult > BigInt(0x7fffffff)) {
    return 0;
  }

  const result = Number(bigResult);
  return isNegative ? -result : result;
}

/**
 * Solution 6: Recursive Approach
 *
 * Approach:
 * - Use recursion to reverse digits
 * - Pass accumulated result as parameter
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(log n) - recursion stack
 */
function reverseRecursive(x: number): number {
  const isNegative = x < 0;
  const num = Math.abs(x);

  function reverseHelper(n: number, acc: number): number {
    if (n === 0) return acc;

    const digit = n % 10;

    // Check for overflow
    if (acc > Math.floor((Math.pow(2, 31) - 1) / 10)) {
      return 0;
    }

    return reverseHelper(Math.floor(n / 10), acc * 10 + digit);
  }

  const result = reverseHelper(num, 0);
  return isNegative ? -result : result;
}

/**
 * Solution 7: Using Math.log10 (Mathematical)
 *
 * Approach:
 * - Calculate number of digits using log
 * - Extract digits in reverse order
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
function reverseLog(x: number): number {
  if (x === 0) return 0;

  const isNegative = x < 0;
  let num = Math.abs(x);
  const numDigits = Math.floor(Math.log10(num)) + 1;
  let result = 0;

  for (let i = 0; i < numDigits; i++) {
    const digit = num % 10;

    if (result > Math.floor((Math.pow(2, 31) - 1) / 10)) {
      return 0;
    }

    result = result * 10 + digit;
    num = Math.floor(num / 10);
  }

  return isNegative ? -result : result;
}

/**
 * Solution 8: Using Generator (Educational)
 *
 * Approach:
 * - Use generator to yield digits
 * - Build result from yielded digits
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(log n)
 */
function* digitGenerator(n: number): Generator<number> {
  while (n > 0) {
    yield n % 10;
    n = Math.floor(n / 10);
  }
}

function reverseGenerator(x: number): number {
  if (x === 0) return 0;

  const isNegative = x < 0;
  const num = Math.abs(x);
  let result = 0;

  for (const digit of digitGenerator(num)) {
    if (result > Math.floor((Math.pow(2, 31) - 1) / 10)) {
      return 0;
    }
    result = result * 10 + digit;
  }

  return isNegative ? -result : result;
}

// Test cases
function testReverseInteger() {
  console.log("=== Testing Reverse Integer ===\n");

  const testCases = [
    {
      input: 123,
      expected: 321,
      description: "Positive number",
    },
    {
      input: -123,
      expected: -321,
      description: "Negative number",
    },
    {
      input: 120,
      expected: 21,
      description: "Ending with zero",
    },
    {
      input: 0,
      expected: 0,
      description: "Zero",
    },
    {
      input: 1,
      expected: 1,
      description: "Single digit",
    },
    {
      input: 1534236469,
      expected: 0,
      description: "Overflow case",
    },
    {
      input: -2147483648,
      expected: 0,
      description: "Min 32-bit integer",
    },
    {
      input: 2147483647,
      expected: 0,
      description: "Max 32-bit integer",
    },
    {
      input: 1000,
      expected: 1,
      description: "Multiple trailing zeros",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${testCase.input}`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Mathematical)
    const result1 = reverse(testCase.input);
    console.log(
      `Solution 1 (Mathematical): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (String)
    const result2 = reverseString(testCase.input);
    console.log(
      `Solution 2 (String): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Array)
    const result3 = reverseArray(testCase.input);
    console.log(
      `Solution 3 (Array): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Bitwise)
    const result4 = reverseBitwise(testCase.input);
    console.log(
      `Solution 4 (Bitwise): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (BigInt)
    const result5 = reverseBigInt(testCase.input);
    console.log(
      `Solution 5 (BigInt): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Recursive)
    const result6 = reverseRecursive(testCase.input);
    console.log(
      `Solution 6 (Recursive): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Log)
    const result7 = reverseLog(testCase.input);
    console.log(
      `Solution 7 (Log): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = reverseGenerator(testCase.input);
    console.log(
      `Solution 8 (Generator): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Mathematical", func: reverse },
    { name: "String", func: reverseString },
    { name: "Array", func: reverseArray },
    { name: "Bitwise", func: reverseBitwise },
    { name: "BigInt", func: reverseBigInt },
    { name: "Recursive", func: reverseRecursive },
    { name: "Log", func: reverseLog },
    { name: "Generator", func: reverseGenerator },
  ];

  const numbers = [123, 12345, 123456789, 1534236469, -123, -12345];

  numbers.forEach((num) => {
    console.log(`Testing with ${num}:`);

    testCases.forEach(({ name, func }) => {
      const start = performance.now();
      const result = func(num);
      const end = performance.now();

      console.log(`  ${name}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Overflow demonstration
function overflowDemo() {
  console.log("=== Overflow Demonstration ===\n");

  console.log("32-bit signed integer range:");
  console.log(`Min: ${-Math.pow(2, 31)}`);
  console.log(`Max: ${Math.pow(2, 31) - 1}\n`);

  const testNumbers = [
    1534236469, // Should overflow
    2147483647, // Max 32-bit integer
    -2147483648, // Min 32-bit integer
    1234567890, // Should not overflow
  ];

  testNumbers.forEach((num) => {
    const reversed = reverse(num);
    console.log(`${num} -> ${reversed} ${reversed === 0 ? "(overflow)" : ""}`);
  });
}

// Uncomment the following lines to run tests
// testReverseInteger();
// performanceComparison();
// overflowDemo();

export {
  reverse,
  reverseString,
  reverseArray,
  reverseBitwise,
  reverseBigInt,
  reverseRecursive,
  reverseLog,
  reverseGenerator,
  digitGenerator,
  testReverseInteger,
  performanceComparison,
  overflowDemo,
};
