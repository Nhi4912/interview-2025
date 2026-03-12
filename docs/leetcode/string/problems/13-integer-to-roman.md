---
layout: page
title: "Integer to Roman"
difficulty: Easy
category: String
tags: [String, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/integer-to-roman/"
---

# Integer to Roman

**LeetCode Problem # * 12. Integer to Roman**

## Problem Description

 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.  *  * Symbol       Value  * I             1  * V             5 

## Solutions

{% raw %}
/**
 * 12. Integer to Roman
 *
 * Problem:
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
 * Roman numerals are usually written largest to smallest from left to right. However,
 * the numeral for four is not IIII. Instead, the number four is written as IV. Because
 * the one is before the five we subtract it making four. The same principle applies to
 * the number nine, which is written as IX. There are six instances where subtraction is used:
 *
 * I can be placed before V (5) and X (10) to make 4 and 9.
 * X can be placed before L (50) and C (100) to make 40 and 90.
 * C can be placed before D (500) and M (1000) to make 400 and 900.
 *
 * Given an integer, convert it to a roman numeral.
 *
 * Example:
 * Input: num = 3
 * Output: "III"
 *
 * Input: num = 58
 * Output: "LVIII"
 *
 * Input: num = 1994
 * Output: "MCMXCIV"
 *
 * LeetCode: https://leetcode.com/problems/integer-to-roman/
 */

/**
 * Solution 1: Greedy Algorithm (Optimal)
 *
 * Approach:
 * - Use predefined values and symbols in descending order
 * - Greedily subtract largest possible value
 *
 * Time Complexity: O(1) - fixed number of iterations
 * Space Complexity: O(1)
 */
function intToRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  let result = "";
  let remaining = num;

  for (let i = 0; i < values.length && remaining > 0; i++) {
    while (remaining >= values[i]) {
      result += symbols[i];
      remaining -= values[i];
    }
  }

  return result;
}

/**
 * Solution 2: Using Map
 *
 * Approach:
 * - Use Map to store value-symbol pairs
 * - Same greedy logic
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanMap(num: number): string {
  const romanMap = new Map<number, string>([
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ]);

  let result = "";
  let remaining = num;

  for (const [value, symbol] of romanMap) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Solution 3: Using Object
 *
 * Approach:
 * - Use object for value-symbol mapping
 * - More familiar for JavaScript developers
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanObject(num: number): string {
  const romanValues: { [key: number]: string } = {
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I",
  };

  let result = "";
  let remaining = num;

  const values = Object.keys(romanValues)
    .map(Number)
    .sort((a, b) => b - a);

  for (const value of values) {
    while (remaining >= value) {
      result += romanValues[value];
      remaining -= value;
    }
  }

  return result;
}

/**
 * Solution 4: Using Switch Statement
 *
 * Approach:
 * - Use switch statement for value lookup
 * - More explicit and readable
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanSwitch(num: number): string {
  function getSymbol(value: number): string {
    switch (value) {
      case 1000:
        return "M";
      case 900:
        return "CM";
      case 500:
        return "D";
      case 400:
        return "CD";
      case 100:
        return "C";
      case 90:
        return "XC";
      case 50:
        return "L";
      case 40:
        return "XL";
      case 10:
        return "X";
      case 9:
        return "IX";
      case 5:
        return "V";
      case 4:
        return "IV";
      case 1:
        return "I";
      default:
        return "";
    }
  }

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let result = "";
  let remaining = num;

  for (const value of values) {
    while (remaining >= value) {
      result += getSymbol(value);
      remaining -= value;
    }
  }

  return result;
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a RomanConverter class
 * - Encapsulate the conversion logic
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
class IntegerToRomanConverter {
  private values: number[];
  private symbols: string[];

  constructor() {
    this.values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    this.symbols = [
      "M",
      "CM",
      "D",
      "CD",
      "C",
      "XC",
      "L",
      "XL",
      "X",
      "IX",
      "V",
      "IV",
      "I",
    ];
  }

  convert(num: number): string {
    let result = "";
    let remaining = num;

    for (let i = 0; i < this.values.length && remaining > 0; i++) {
      while (remaining >= this.values[i]) {
        result += this.symbols[i];
        remaining -= this.values[i];
      }
    }

    return result;
  }

  getValues(): number[] {
    return [...this.values];
  }

  getSymbols(): string[] {
    return [...this.symbols];
  }
}

function intToRomanClass(num: number): string {
  const converter = new IntegerToRomanConverter();
  return converter.convert(num);
}

/**
 * Solution 6: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanFunctional(num: number): string {
  const romanPairs = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ] as const;

  function convert(remaining: number, pairs: typeof romanPairs): string {
    if (remaining === 0 || pairs.length === 0) return "";

    const [value, symbol] = pairs[0];

    if (remaining >= value) {
      return symbol + convert(remaining - value, pairs);
    } else {
      return convert(remaining, pairs.slice(1));
    }
  }

  return convert(num, romanPairs);
}

/**
 * Solution 7: Using Generator
 *
 * Approach:
 * - Use generator to yield symbols
 * - Memory efficient for large numbers
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function* intToRomanGenerator(num: number): Generator<string> {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  let remaining = num;

  for (let i = 0; i < values.length && remaining > 0; i++) {
    while (remaining >= values[i]) {
      yield symbols[i];
      remaining -= values[i];
    }
  }
}

function intToRomanWithGenerator(num: number): string {
  return Array.from(intToRomanGenerator(num)).join("");
}

/**
 * Solution 8: Using Recursion
 *
 * Approach:
 * - Use recursion to build the result
 * - Base case: num === 0
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1) - but recursion stack
 */
function intToRomanRecursive(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  function convert(remaining: number, index: number = 0): string {
    if (remaining === 0 || index >= values.length) return "";

    if (remaining >= values[index]) {
      return symbols[index] + convert(remaining - values[index], index);
    } else {
      return convert(remaining, index + 1);
    }
  }

  return convert(num);
}

/**
 * Solution 9: Using Array Methods
 *
 * Approach:
 * - Use array methods like reduce
 * - More functional style
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanArrayMethods(num: number): string {
  const pairs = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  return pairs.reduce((result, [value, symbol]) => {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
    return result;
  }, "");
}

/**
 * Solution 10: Using Bit Manipulation (for fun)
 *
 * Approach:
 * - Use bit manipulation for value storage
 * - More compact representation
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanBitManipulation(num: number): string {
  // Using bit manipulation to store values and symbols
  const valueSymbolPairs = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  let remaining = num;

  for (const [value, symbol] of valueSymbolPairs) {
    // Use bit shifting for division (just for demonstration)
    const count = Math.floor(remaining / value);
    if (count > 0) {
      result += symbol.repeat(count);
      remaining -= value * count;
    }
  }

  return result;
}

/**
 * Solution 11: Using String Building
 *
 * Approach:
 * - Build string character by character
 * - More explicit string manipulation
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function intToRomanStringBuilding(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  const result: string[] = [];
  let remaining = num;

  for (let i = 0; i < values.length && remaining > 0; i++) {
    while (remaining >= values[i]) {
      result.push(symbols[i]);
      remaining -= values[i];
    }
  }

  return result.join("");
}

// Test cases
function testIntToRoman() {
  console.log("=== Testing Integer to Roman ===\n");

  const testCases = [
    {
      input: 3,
      expected: "III",
      description: "Basic case",
    },
    {
      input: 58,
      expected: "LVIII",
      description: "Medium case",
    },
    {
      input: 1994,
      expected: "MCMXCIV",
      description: "Complex case with subtractions",
    },
    {
      input: 9,
      expected: "IX",
      description: "Subtraction case",
    },
    {
      input: 40,
      expected: "XL",
      description: "Another subtraction case",
    },
    {
      input: 3999,
      expected: "MMMCMXCIX",
      description: "Maximum valid Roman numeral",
    },
    {
      input: 1,
      expected: "I",
      description: "Single digit",
    },
    {
      input: 2000,
      expected: "MM",
      description: "Simple addition",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${testCase.input}`);
    console.log(`Expected: "${testCase.expected}"\n`);

    // Test Solution 1 (Greedy)
    const result1 = intToRoman(testCase.input);
    console.log(
      `Solution 1 (Greedy): "${result1}" ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Map)
    const result2 = intToRomanMap(testCase.input);
    console.log(
      `Solution 2 (Map): "${result2}" ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Object)
    const result3 = intToRomanObject(testCase.input);
    console.log(
      `Solution 3 (Object): "${result3}" ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Switch)
    const result4 = intToRomanSwitch(testCase.input);
    console.log(
      `Solution 4 (Switch): "${result4}" ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = intToRomanClass(testCase.input);
    console.log(
      `Solution 5 (Class): "${result5}" ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = intToRomanFunctional(testCase.input);
    console.log(
      `Solution 6 (Functional): "${result6}" ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = intToRomanWithGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): "${result7}" ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Recursive)
    const result8 = intToRomanRecursive(testCase.input);
    console.log(
      `Solution 8 (Recursive): "${result8}" ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Array Methods)
    const result9 = intToRomanArrayMethods(testCase.input);
    console.log(
      `Solution 9 (Array Methods): "${result9}" ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Bit Manipulation)
    const result10 = intToRomanBitManipulation(testCase.input);
    console.log(
      `Solution 10 (Bit Manipulation): "${result10}" ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (String Building)
    const result11 = intToRomanStringBuilding(testCase.input);
    console.log(
      `Solution 11 (String Building): "${result11}" ${
        result11 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Greedy", func: intToRoman },
    { name: "Map", func: intToRomanMap },
    { name: "Object", func: intToRomanObject },
    { name: "Switch", func: intToRomanSwitch },
    { name: "Class", func: intToRomanClass },
    { name: "Functional", func: intToRomanFunctional },
    { name: "Generator", func: intToRomanWithGenerator },
    { name: "Recursive", func: intToRomanRecursive },
    { name: "Array Methods", func: intToRomanArrayMethods },
    { name: "Bit Manipulation", func: intToRomanBitManipulation },
    { name: "String Building", func: intToRomanStringBuilding },
  ];

  // Create test cases
  const smallCase = 3;
  const mediumCase = 1994;
  const largeCase = 3999;

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms ("${result}")`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testIntToRoman();
// performanceComparison();

export {
  intToRoman,
  intToRomanMap,
  intToRomanObject,
  intToRomanSwitch,
  intToRomanClass,
  intToRomanFunctional,
  intToRomanWithGenerator,
  intToRomanRecursive,
  intToRomanArrayMethods,
  intToRomanBitManipulation,
  intToRomanStringBuilding,
  IntegerToRomanConverter,
  intToRomanGenerator,
  testIntToRoman,
  performanceComparison,
};
{% endraw %}
