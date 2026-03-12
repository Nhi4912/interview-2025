---
layout: page
title: "Plus One"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/plus-one/"
---

# Plus One

**LeetCode Problem # * 66. Plus One**

## Problem Description

 * You are given a large integer represented as an integer array digits, where each  * digits[i] is the ith digit of the integer. The digits are ordered from most  * significant to least significant in left-to-right order. The large integer does  * not contain any leading 0's.  * 

## Solutions

{% raw %}
/**
 * 66. Plus One
 *
 * Problem:
 * You are given a large integer represented as an integer array digits, where each
 * digits[i] is the ith digit of the integer. The digits are ordered from most
 * significant to least significant in left-to-right order. The large integer does
 * not contain any leading 0's.
 *
 * Increment the large integer by one and return the resulting array of digits.
 *
 * Example:
 * Input: digits = [1,2,3]
 * Output: [1,2,4]
 *
 * Input: digits = [4,3,2,1]
 * Output: [4,3,2,2]
 *
 * Input: digits = [9]
 * Output: [1,0]
 *
 * LeetCode: https://leetcode.com/problems/plus-one/
 */

/**
 * Solution 1: Simple Addition with Carry (Optimal)
 *
 * Approach:
 * - Start from the end and add 1
 * - Handle carry by setting digit to 0 and continuing
 * - If carry remains, insert 1 at beginning
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - in-place modification
 */
function plusOne(digits: number[]): number[] {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }

  // If we reach here, all digits were 9
  return [1, ...digits];
}

/**
 * Solution 2: Using Array Methods (Functional)
 *
 * Approach:
 * - Convert to number, add 1, convert back to array
 * - Simple but may overflow for large numbers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function plusOneFunctional(digits: number[]): number[] {
  const num = BigInt(digits.join("")) + BigInt(1);
  return num.toString().split("").map(Number);
}

/**
 * Solution 3: Recursive Approach
 *
 * Approach:
 * - Use recursion to handle carry
 * - Base case: when no carry remains
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function plusOneRecursive(digits: number[]): number[] {
  function addOne(index: number): number[] {
    if (index < 0) {
      return [1, ...digits];
    }

    if (digits[index] < 9) {
      digits[index]++;
      return digits;
    }

    digits[index] = 0;
    return addOne(index - 1);
  }

  return addOne(digits.length - 1);
}

/**
 * Solution 4: Using Reduce (Functional)
 *
 * Approach:
 * - Use reduce to process digits from right to left
 * - Handle carry in accumulator
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function plusOneReduce(digits: number[]): number[] {
  const result = digits.reduceRight(
    (acc, digit) => {
      const sum = digit + acc.carry;
      return {
        digits: [sum % 10, ...acc.digits],
        carry: Math.floor(sum / 10),
      };
    },
    { digits: [], carry: 1 }
  );

  return result.carry > 0 ? [result.carry, ...result.digits] : result.digits;
}

/**
 * Solution 5: Using Map and Reverse
 *
 * Approach:
 * - Reverse array, process, reverse back
 * - Alternative way to handle carry
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function plusOneMap(digits: number[]): number[] {
  const reversed = [...digits].reverse();
  let carry = 1;

  const result = reversed.map((digit, index) => {
    if (index === 0) {
      const sum = digit + carry;
      carry = Math.floor(sum / 10);
      return sum % 10;
    }
    if (carry === 0) {
      return digit;
    }
    const sum = digit + carry;
    carry = Math.floor(sum / 10);
    return sum % 10;
  });

  if (carry > 0) {
    result.push(carry);
  }

  return result.reverse();
}

/**
 * Solution 6: Using Generator (Memory Efficient)
 *
 * Approach:
 * - Use generator to yield digits
 * - Memory efficient for large numbers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* plusOneGenerator(digits: number[]): Generator<number> {
  let carry = 1;

  for (let i = digits.length - 1; i >= 0; i--) {
    const sum = digits[i] + carry;
    yield sum % 10;
    carry = Math.floor(sum / 10);
  }

  if (carry > 0) {
    yield carry;
  }
}

function plusOneWithGenerator(digits: number[]): number[] {
  return Array.from(plusOneGenerator(digits)).reverse();
}

/**
 * Solution 7: Using Bit Manipulation (Educational)
 *
 * Approach:
 * - Use bit operations to handle addition
 * - More complex but shows bit manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function plusOneBitwise(digits: number[]): number[] {
  const result: number[] = [];
  let carry = 1;

  for (let i = digits.length - 1; i >= 0; i--) {
    const digit = digits[i];
    const sum = digit + carry;

    // Extract last 4 bits (0-9 range)
    const newDigit = sum & 0xf;
    carry = (sum >> 4) & 0x1;

    result.unshift(newDigit);
  }

  if (carry > 0) {
    result.unshift(carry);
  }

  return result;
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a BigNumber class to handle large integers
 * - More structured approach for complex operations
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class BigNumber {
  private digits: number[];

  constructor(digits: number[]) {
    this.digits = [...digits];
  }

  addOne(): number[] {
    for (let i = this.digits.length - 1; i >= 0; i--) {
      if (this.digits[i] < 9) {
        this.digits[i]++;
        return this.digits;
      }
      this.digits[i] = 0;
    }

    return [1, ...this.digits];
  }

  getDigits(): number[] {
    return [...this.digits];
  }
}

function plusOneClass(digits: number[]): number[] {
  const bigNum = new BigNumber(digits);
  return bigNum.addOne();
}

// Test cases
function testPlusOne() {
  console.log("=== Testing Plus One ===\n");

  const testCases = [
    {
      input: [1, 2, 3],
      expected: [1, 2, 4],
      description: "Simple addition",
    },
    {
      input: [4, 3, 2, 1],
      expected: [4, 3, 2, 2],
      description: "No carry",
    },
    {
      input: [9],
      expected: [1, 0],
      description: "Single digit with carry",
    },
    {
      input: [9, 9, 9],
      expected: [1, 0, 0, 0],
      description: "Multiple nines",
    },
    {
      input: [1, 9, 9],
      expected: [2, 0, 0],
      description: "Partial carry",
    },
    {
      input: [0],
      expected: [1],
      description: "Single zero",
    },
    {
      input: [1, 0, 0, 0],
      expected: [1, 0, 0, 1],
      description: "Large number",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Simple Addition)
    const result1 = plusOne([...testCase.input]);
    console.log(
      `Solution 1 (Simple): [${result1.join(", ")}] ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Functional)
    const result2 = plusOneFunctional([...testCase.input]);
    console.log(
      `Solution 2 (Functional): [${result2.join(", ")}] ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Recursive)
    const result3 = plusOneRecursive([...testCase.input]);
    console.log(
      `Solution 3 (Recursive): [${result3.join(", ")}] ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Reduce)
    const result4 = plusOneReduce([...testCase.input]);
    console.log(
      `Solution 4 (Reduce): [${result4.join(", ")}] ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Map)
    const result5 = plusOneMap([...testCase.input]);
    console.log(
      `Solution 5 (Map): [${result5.join(", ")}] ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = plusOneWithGenerator([...testCase.input]);
    console.log(
      `Solution 6 (Generator): [${result6.join(", ")}] ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Bitwise)
    const result7 = plusOneBitwise([...testCase.input]);
    console.log(
      `Solution 7 (Bitwise): [${result7.join(", ")}] ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = plusOneClass([...testCase.input]);
    console.log(
      `Solution 8 (Class): [${result8.join(", ")}] ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Simple Addition", func: plusOne },
    { name: "Functional", func: plusOneFunctional },
    { name: "Recursive", func: plusOneRecursive },
    { name: "Reduce", func: plusOneReduce },
    { name: "Map", func: plusOneMap },
    { name: "Generator", func: plusOneWithGenerator },
    { name: "Bitwise", func: plusOneBitwise },
    { name: "Class", func: plusOneClass },
  ];

  // Create test arrays
  const smallArray = [1, 2, 3, 4, 5];
  const largeArray = Array.from({ length: 1000 }, (_, i) => i % 10);
  const ninesArray = Array.from({ length: 100 }, () => 9);

  const arrays = [
    { name: "Small", array: smallArray },
    { name: "Large", array: largeArray },
    { name: "All Nines", array: ninesArray },
  ];

  arrays.forEach(({ name, array }) => {
    console.log(`${name} Array:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...array]);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${
          result.length
        })`
      );
    });

    console.log("");
  });
}

// Carry demonstration
function carryDemo() {
  console.log("=== Carry Demonstration ===\n");

  const examples = [[1, 2, 3], [9, 9, 9], [1, 9, 9], [9]];

  examples.forEach((digits) => {
    console.log(`Input: [${digits.join(", ")}]`);

    let carry = 1;
    const result: number[] = [];

    for (let i = digits.length - 1; i >= 0; i--) {
      const sum = digits[i] + carry;
      result.unshift(sum % 10);
      carry = Math.floor(sum / 10);
      console.log(
        `  Digit ${i}: ${digits[i]} + ${carry} = ${sum} (digit: ${
          sum % 10
        }, carry: ${Math.floor(sum / 10)})`
      );
    }

    if (carry > 0) {
      result.unshift(carry);
      console.log(`  Final carry: ${carry}`);
    }

    console.log(`Result: [${result.join(", ")}]\n`);
  });
}

// Uncomment the following lines to run tests
// testPlusOne();
// performanceComparison();
// carryDemo();

export {
  plusOne,
  plusOneFunctional,
  plusOneRecursive,
  plusOneReduce,
  plusOneMap,
  plusOneWithGenerator,
  plusOneGenerator,
  plusOneBitwise,
  plusOneClass,
  BigNumber,
  testPlusOne,
  performanceComparison,
  carryDemo,
};
{% endraw %}
