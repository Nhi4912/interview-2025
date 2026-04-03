/**
 * 8. String to Integer (atoi)
 *
 * Problem:
 * Implement the myAtoi(string s) function, which converts a string to a 32-bit
 * signed integer (similar to C/C++'s atoi function).
 *
 * The algorithm for myAtoi(string s) is as follows:
 * 1. Read in and ignore any leading whitespace.
 * 2. Check if the next character (if not already at the end of the string) is '-' or '+'.
 *    Read this character in if it is either. This determines if the final result is
 *    negative or positive respectively. If neither is present, then the result is positive.
 * 3. Read in next the characters until the next non-digit character or the end of the
 *    input is reached. The rest of the string is ignored.
 * 4. Convert these digits into an integer (i.e. "123" -> 123, "0032" -> 32). If no
 *    digits were read, then the integer is 0. Change the sign as necessary (from step 2).
 * 5. If the integer is out of the 32-bit signed integer range [-2³¹, 2³¹ - 1], then
 *    clamp the integer so that it remains in the range. Specifically, integers less
 *    than -2³¹ should be clamped to -2³¹, and integers greater than 2³¹ - 1 should
 *    be clamped to 2³¹ - 1.
 * 6. Return the integer as the final result.
 *
 * Example:
 * Input: s = "42"
 * Output: 42
 *
 * Input: s = "   -42"
 * Output: -42
 *
 * Input: s = "4193 with words"
 * Output: 4193
 *
 * LeetCode: https://leetcode.com/problems/string-to-integer-atoi/
 */

/**
 * Solution 1: State Machine (Optimal)
 *
 * Approach:
 * - Use state machine to handle different parsing states
 * - Handle overflow carefully
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function myAtoi(s: string): number {
  let i = 0;
  let sign = 1;
  let result = 0;

  // Skip leading whitespace
  while (i < s.length && s[i] === " ") {
    i++;
  }

  if (i >= s.length) return 0;

  // Handle sign
  if (s[i] === "+" || s[i] === "-") {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  // Parse digits
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    const digit = parseInt(s[i]);

    // Check for overflow
    if (
      result > Math.floor(2147483647 / 10) ||
      (result === Math.floor(2147483647 / 10) && digit > 7)
    ) {
      return sign === 1 ? 2147483647 : -2147483648;
    }

    result = result * 10 + digit;
    i++;
  }

  return sign * result;
}

/**
 * Solution 2: Using Regular Expression
 *
 * Approach:
 * - Use regex to extract the number
 * - Simple but less efficient
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function myAtoiRegex(s: string): number {
  const match = s.trim().match(/^[+-]?\d+/);

  if (!match) return 0;

  const num = parseInt(match[0]);

  // Handle overflow
  if (num > 2147483647) return 2147483647;
  if (num < -2147483648) return -2147483648;

  return num;
}

/**
 * Solution 3: Using parseInt with Validation
 *
 * Approach:
 * - Use built-in parseInt with custom validation
 * - Handle edge cases manually
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function myAtoiParseInt(s: string): number {
  const trimmed = s.trim();

  if (!trimmed) return 0;

  // Check if starts with valid character
  const firstChar = trimmed[0];
  if (
    !["+", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
      firstChar
    )
  ) {
    return 0;
  }

  const num = parseInt(trimmed);

  if (isNaN(num)) return 0;

  // Handle overflow
  if (num > 2147483647) return 2147483647;
  if (num < -2147483648) return -2147483648;

  return num;
}

/**
 * Solution 4: Character by Character Parsing
 *
 * Approach:
 * - Parse character by character
 * - More explicit control over the process
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function myAtoiCharByChar(s: string): number {
  let i = 0;
  let sign = 1;
  let result = 0;

  // Skip whitespace
  while (i < s.length && s[i] === " ") {
    i++;
  }

  if (i >= s.length) return 0;

  // Handle sign
  if (s[i] === "+" || s[i] === "-") {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  // Parse digits
  while (i < s.length) {
    const char = s[i];

    if (char < "0" || char > "9") {
      break;
    }

    const digit = char.charCodeAt(0) - "0".charCodeAt(0);

    // Check for overflow
    if (result > 214748364 || (result === 214748364 && digit > 7)) {
      return sign === 1 ? 2147483647 : -2147483648;
    }

    result = result * 10 + digit;
    i++;
  }

  return sign * result;
}

/**
 * Solution 5: Using BigInt (Modern JavaScript)
 *
 * Approach:
 * - Use BigInt to handle large numbers
 * - Convert back to number with clamping
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function myAtoiBigInt(s: string): number {
  const trimmed = s.trim();

  if (!trimmed) return 0;

  const match = trimmed.match(/^[+-]?\d+/);

  if (!match) return 0;

  const bigNum = BigInt(match[0]);

  // Clamp to 32-bit signed integer range
  if (bigNum > BigInt(2147483647)) return 2147483647;
  if (bigNum < BigInt(-2147483648)) return -2147483648;

  return Number(bigNum);
}

/**
 * Solution 6: Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function myAtoiFunctional(s: string): number {
  const digits = s
    .trim()
    .split("")
    .reduce((acc: string[], char: string, index: number) => {
      if (index === 0 && (char === "+" || char === "-")) {
        acc.push(char);
      } else if (char >= "0" && char <= "9") {
        acc.push(char);
      } else {
        return acc;
      }
      return acc;
    }, [])
    .join("");

  if (!digits || digits === "+" || digits === "-") return 0;

  const num = parseInt(digits);

  if (isNaN(num)) return 0;

  // Clamp to 32-bit signed integer range
  return Math.max(-2147483648, Math.min(2147483647, num));
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield characters
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* characterGenerator(s: string): Generator<string> {
  for (const char of s) {
    yield char;
  }
}

function myAtoiGenerator(s: string): number {
  let sign = 1;
  let result = 0;
  let started = false;

  for (const char of characterGenerator(s)) {
    if (!started && char === " ") {
      continue;
    }

    if (!started && (char === "+" || char === "-")) {
      sign = char === "-" ? -1 : 1;
      started = true;
      continue;
    }

    if (char >= "0" && char <= "9") {
      started = true;
      const digit = parseInt(char);

      // Check for overflow
      if (
        result > Math.floor(2147483647 / 10) ||
        (result === Math.floor(2147483647 / 10) && digit > 7)
      ) {
        return sign === 1 ? 2147483647 : -2147483648;
      }

      result = result * 10 + digit;
    } else {
      break;
    }
  }

  return sign * result;
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an AtoiParser class
 * - Encapsulate parsing logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class AtoiParser {
  private s: string;
  private i: number;
  private sign: number;
  private result: number;

  constructor(s: string) {
    this.s = s;
    this.i = 0;
    this.sign = 1;
    this.result = 0;
  }

  parse(): number {
    this.skipWhitespace();
    this.parseSign();
    this.parseDigits();
    return this.sign * this.result;
  }

  private skipWhitespace(): void {
    while (this.i < this.s.length && this.s[this.i] === " ") {
      this.i++;
    }
  }

  private parseSign(): void {
    if (
      this.i < this.s.length &&
      (this.s[this.i] === "+" || this.s[this.i] === "-")
    ) {
      this.sign = this.s[this.i] === "-" ? -1 : 1;
      this.i++;
    }
  }

  private parseDigits(): void {
    while (
      this.i < this.s.length &&
      this.s[this.i] >= "0" &&
      this.s[this.i] <= "9"
    ) {
      const digit = parseInt(this.s[this.i]);

      // Check for overflow
      if (
        this.result > Math.floor(2147483647 / 10) ||
        (this.result === Math.floor(2147483647 / 10) && digit > 7)
      ) {
        this.result = this.sign === 1 ? 2147483647 : 2147483648;
        return;
      }

      this.result = this.result * 10 + digit;
      this.i++;
    }
  }
}

function myAtoiClass(s: string): number {
  const parser = new AtoiParser(s);
  return parser.parse();
}

/**
 * Solution 9: Using Bit Manipulation
 *
 * Approach:
 * - Use bit operations for overflow checking
 * - More efficient for certain operations
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function myAtoiBitwise(s: string): number {
  let i = 0;
  let sign = 1;
  let result = 0;

  // Skip whitespace
  while (i < s.length && s[i] === " ") {
    i++;
  }

  if (i >= s.length) return 0;

  // Handle sign
  if (s[i] === "+" || s[i] === "-") {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  // Parse digits
  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    const digit = s[i].charCodeAt(0) - "0".charCodeAt(0);

    // Check for overflow using bit operations
    if (result > 0x7fffffff / 10 || (result === 0x7fffffff / 10 && digit > 7)) {
      return sign === 1 ? 0x7fffffff : -0x80000000;
    }

    result = (result << 3) + (result << 1) + digit; // result * 10 + digit
    i++;
  }

  return sign * result;
}

// Test cases
function testMyAtoi() {
  console.log("=== Testing String to Integer (atoi) ===\n");

  const testCases = [
    {
      input: "42",
      expected: 42,
      description: "Simple positive number",
    },
    {
      input: "   -42",
      expected: -42,
      description: "Negative number with leading spaces",
    },
    {
      input: "4193 with words",
      expected: 4193,
      description: "Number with trailing text",
    },
    {
      input: "words and 987",
      expected: 0,
      description: "Text before number",
    },
    {
      input: "-91283472332",
      expected: -2147483648,
      description: "Overflow negative",
    },
    {
      input: "91283472332",
      expected: 2147483647,
      description: "Overflow positive",
    },
    {
      input: "",
      expected: 0,
      description: "Empty string",
    },
    {
      input: "   ",
      expected: 0,
      description: "Only spaces",
    },
    {
      input: "+1",
      expected: 1,
      description: "Explicit positive",
    },
    {
      input: "00000-42a1234",
      expected: 0,
      description: "Complex case",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (State Machine)
    const result1 = myAtoi(testCase.input);
    console.log(
      `Solution 1 (State Machine): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Regex)
    const result2 = myAtoiRegex(testCase.input);
    console.log(
      `Solution 2 (Regex): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (parseInt)
    const result3 = myAtoiParseInt(testCase.input);
    console.log(
      `Solution 3 (parseInt): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Char by Char)
    const result4 = myAtoiCharByChar(testCase.input);
    console.log(
      `Solution 4 (Char by Char): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (BigInt)
    const result5 = myAtoiBigInt(testCase.input);
    console.log(
      `Solution 5 (BigInt): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = myAtoiFunctional(testCase.input);
    console.log(
      `Solution 6 (Functional): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = myAtoiGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = myAtoiClass(testCase.input);
    console.log(
      `Solution 8 (Class): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Bitwise)
    const result9 = myAtoiBitwise(testCase.input);
    console.log(
      `Solution 9 (Bitwise): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "State Machine", func: myAtoi },
    { name: "Regex", func: myAtoiRegex },
    { name: "parseInt", func: myAtoiParseInt },
    { name: "Char by Char", func: myAtoiCharByChar },
    { name: "BigInt", func: myAtoiBigInt },
    { name: "Functional", func: myAtoiFunctional },
    { name: "Generator", func: myAtoiGenerator },
    { name: "Class", func: myAtoiClass },
    { name: "Bitwise", func: myAtoiBitwise },
  ];

  // Create test strings
  const shortString = "42";
  const mediumString = "   -12345 with words";
  const longString = "   " + "9".repeat(100) + " with lots of text";

  const strings = [
    { name: "Short", string: shortString },
    { name: "Medium", string: mediumString },
    { name: "Long", string: longString },
  ];

  strings.forEach(({ name, string }) => {
    console.log(`${name} String:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(string);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testMyAtoi();
// performanceComparison();

export {
  myAtoi,
  myAtoiRegex,
  myAtoiParseInt,
  myAtoiCharByChar,
  myAtoiBigInt,
  myAtoiFunctional,
  myAtoiGenerator,
  myAtoiClass,
  myAtoiBitwise,
  AtoiParser,
  characterGenerator,
  testMyAtoi,
  performanceComparison,
};
