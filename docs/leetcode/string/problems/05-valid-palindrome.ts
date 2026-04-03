/**
 * 125. Valid Palindrome
 *
 * Problem:
 * A phrase is a palindrome if, after converting all uppercase letters into lowercase
 * letters and removing all non-alphanumeric characters, it reads the same forward
 * and backward. Alphanumeric characters include letters and numbers.
 *
 * Given a string s, return true if it is a palindrome, or false otherwise.
 *
 * Example:
 * Input: s = "A man, a plan, a canal: Panama"
 * Output: true
 *
 * Input: s = "race a car"
 * Output: false
 *
 * Input: s = " "
 * Output: true
 *
 * LeetCode: https://leetcode.com/problems/valid-palindrome/
 */

/**
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Use two pointers from start and end
 * - Skip non-alphanumeric characters
 * - Compare characters (case-insensitive)
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip non-alphanumeric characters from left
    while (left < right && !isAlphanumeric(s[left])) {
      left++;
    }

    // Skip non-alphanumeric characters from right
    while (left < right && !isAlphanumeric(s[right])) {
      right--;
    }

    // Compare characters (case-insensitive)
    if (toLowerCase(s[left]) !== toLowerCase(s[right])) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}

/**
 * Solution 2: Filter and Compare
 *
 * Approach:
 * - Filter out non-alphanumeric characters
 * - Convert to lowercase
 * - Compare with reversed string
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeFilter(s: string): boolean {
  const filtered = s
    .split("")
    .filter((char) => isAlphanumeric(char))
    .join("")
    .toLowerCase();

  return filtered === filtered.split("").reverse().join("");
}

/**
 * Solution 3: Using Regular Expression
 *
 * Approach:
 * - Use regex to remove non-alphanumeric characters
 * - Convert to lowercase and compare
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeRegex(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return cleaned === cleaned.split("").reverse().join("");
}

/**
 * Solution 4: Recursive Approach
 *
 * Approach:
 * - Use recursion to check palindrome
 * - Base case: empty string or single character
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function isPalindromeRecursive(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  function checkPalindrome(str: string): boolean {
    if (str.length <= 1) return true;

    if (str[0] !== str[str.length - 1]) return false;

    return checkPalindrome(str.slice(1, -1));
  }

  return checkPalindrome(cleaned);
}

/**
 * Solution 5: Using Stack
 *
 * Approach:
 * - Push first half to stack
 * - Compare with second half
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeStack(s: string): boolean {
  const cleaned = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const stack: string[] = [];
  const mid = Math.floor(cleaned.length / 2);

  // Push first half to stack
  for (let i = 0; i < mid; i++) {
    stack.push(cleaned[i]);
  }

  // Compare with second half
  const start = cleaned.length % 2 === 0 ? mid : mid + 1;
  for (let i = start; i < cleaned.length; i++) {
    if (stack.pop() !== cleaned[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Solution 6: Using Array Methods (Functional)
 *
 * Approach:
 * - Use functional programming approach
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isPalindromeFunctional(s: string): boolean {
  const cleaned = s
    .toLowerCase()
    .split("")
    .filter((char) => /[a-z0-9]/.test(char));

  return cleaned.join("") === cleaned.reverse().join("");
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield characters
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* alphanumericGenerator(s: string): Generator<string> {
  for (const char of s) {
    if (isAlphanumeric(char)) {
      yield toLowerCase(char);
    }
  }
}

function isPalindromeGenerator(s: string): boolean {
  const chars = Array.from(alphanumericGenerator(s));
  return chars.join("") === chars.reverse().join("");
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a PalindromeChecker class
 * - Encapsulate validation logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class PalindromeChecker {
  private s: string;

  constructor(s: string) {
    this.s = s;
  }

  isValid(): boolean {
    let left = 0;
    let right = this.s.length - 1;

    while (left < right) {
      while (left < right && !this.isAlphanumeric(this.s[left])) {
        left++;
      }

      while (left < right && !this.isAlphanumeric(this.s[right])) {
        right--;
      }

      if (this.toLowerCase(this.s[left]) !== this.toLowerCase(this.s[right])) {
        return false;
      }

      left++;
      right--;
    }

    return true;
  }

  private isAlphanumeric(char: string): boolean {
    return /[a-zA-Z0-9]/.test(char);
  }

  private toLowerCase(char: string): string {
    return char.toLowerCase();
  }
}

function isPalindromeClass(s: string): boolean {
  const checker = new PalindromeChecker(s);
  return checker.isValid();
}

/**
 * Solution 9: Using Bit Manipulation (Limited use case)
 *
 * Approach:
 * - Use bit operations for ASCII characters
 * - Limited to small strings due to integer size
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isPalindromeBitwise(s: string): boolean {
  if (s.length > 64) {
    // Fallback to standard approach for large strings
    return isPalindrome(s);
  }

  let leftBits = 0;
  let rightBits = 0;
  let leftCount = 0;
  let rightCount = 0;

  const mid = Math.floor(s.length / 2);

  // Process left half
  for (let i = 0; i < mid; i++) {
    if (isAlphanumeric(s[i])) {
      const char = toLowerCase(s[i]);
      leftBits |= 1 << (char.charCodeAt(0) - "a".charCodeAt(0));
      leftCount++;
    }
  }

  // Process right half
  const start = s.length % 2 === 0 ? mid : mid + 1;
  for (let i = start; i < s.length; i++) {
    if (isAlphanumeric(s[i])) {
      const char = toLowerCase(s[i]);
      rightBits |= 1 << (char.charCodeAt(0) - "a".charCodeAt(0));
      rightCount++;
    }
  }

  return leftBits === rightBits && leftCount === rightCount;
}

// Helper functions
function isAlphanumeric(char: string): boolean {
  return /[a-zA-Z0-9]/.test(char);
}

function toLowerCase(char: string): string {
  return char.toLowerCase();
}

// Test cases
function testValidPalindrome() {
  console.log("=== Testing Valid Palindrome ===\n");

  const testCases = [
    {
      input: "A man, a plan, a canal: Panama",
      expected: true,
      description: "Complex palindrome with punctuation",
    },
    {
      input: "race a car",
      expected: false,
      description: "Not a palindrome",
    },
    {
      input: " ",
      expected: true,
      description: "Single space",
    },
    {
      input: "",
      expected: true,
      description: "Empty string",
    },
    {
      input: "racecar",
      expected: true,
      description: "Simple palindrome",
    },
    {
      input: "12321",
      expected: true,
      description: "Numeric palindrome",
    },
    {
      input: "A1b2C3c2b1a",
      expected: true,
      description: "Alphanumeric palindrome",
    },
    {
      input: "hello world",
      expected: false,
      description: "Regular text",
    },
    {
      input: ".,",
      expected: true,
      description: "Only punctuation",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Two Pointers)
    const result1 = isPalindrome(testCase.input);
    console.log(
      `Solution 1 (Two Pointers): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Filter)
    const result2 = isPalindromeFilter(testCase.input);
    console.log(
      `Solution 2 (Filter): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Regex)
    const result3 = isPalindromeRegex(testCase.input);
    console.log(
      `Solution 3 (Regex): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Recursive)
    const result4 = isPalindromeRecursive(testCase.input);
    console.log(
      `Solution 4 (Recursive): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Stack)
    const result5 = isPalindromeStack(testCase.input);
    console.log(
      `Solution 5 (Stack): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = isPalindromeFunctional(testCase.input);
    console.log(
      `Solution 6 (Functional): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = isPalindromeGenerator(testCase.input);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = isPalindromeClass(testCase.input);
    console.log(
      `Solution 8 (Class): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Bitwise)
    const result9 = isPalindromeBitwise(testCase.input);
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
    { name: "Two Pointers", func: isPalindrome },
    { name: "Filter", func: isPalindromeFilter },
    { name: "Regex", func: isPalindromeRegex },
    { name: "Recursive", func: isPalindromeRecursive },
    { name: "Stack", func: isPalindromeStack },
    { name: "Functional", func: isPalindromeFunctional },
    { name: "Generator", func: isPalindromeGenerator },
    { name: "Class", func: isPalindromeClass },
    { name: "Bitwise", func: isPalindromeBitwise },
  ];

  // Create test strings
  const shortString = "A man, a plan, a canal: Panama";
  const longString = "A man, a plan, a canal: Panama".repeat(1000);
  const nonPalindrome = "This is not a palindrome at all";

  const strings = [
    { name: "Short", string: shortString },
    { name: "Long", string: longString },
    { name: "Non-Palindrome", string: nonPalindrome },
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

// Character analysis
function characterAnalysis() {
  console.log("=== Character Analysis ===\n");

  const testStrings = [
    "A man, a plan, a canal: Panama",
    "race a car",
    "12321",
    ".,!@#$%",
    "aA1bB2cC3",
  ];

  testStrings.forEach((str, index) => {
    console.log(`String ${index + 1}: "${str}"`);

    const alphanumeric = str.split("").filter((char) => isAlphanumeric(char));
    const nonAlphanumeric = str
      .split("")
      .filter((char) => !isAlphanumeric(char));

    console.log(
      `  Alphanumeric: [${alphanumeric.join(", ")}] (${alphanumeric.length})`
    );
    console.log(
      `  Non-alphanumeric: [${nonAlphanumeric.join(", ")}] (${
        nonAlphanumeric.length
      })`
    );

    const cleaned = str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    console.log(`  Cleaned: "${cleaned}"`);

    const isPalindromeResult = isPalindrome(str);
    console.log(`  Is palindrome: ${isPalindromeResult}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testValidPalindrome();
// performanceComparison();
// characterAnalysis();

export {
  isPalindrome,
  isPalindromeFilter,
  isPalindromeRegex,
  isPalindromeRecursive,
  isPalindromeStack,
  isPalindromeFunctional,
  isPalindromeGenerator,
  isPalindromeClass,
  isPalindromeBitwise,
  PalindromeChecker,
  alphanumericGenerator,
  isAlphanumeric,
  toLowerCase,
  testValidPalindrome,
  performanceComparison,
  characterAnalysis,
};
