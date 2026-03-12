/**
 * 17. Letter Combinations of a Phone Number
 *
 * Problem:
 * Given a string containing digits from 2-9 inclusive, return all possible letter combinations
 * that the number could represent. Return the answer in any order.
 *
 * A mapping of digit to letters (just like on the telephone buttons) is given below.
 * Note that 1 does not map to any letters.
 *
 * 2 -> "abc"
 * 3 -> "def"
 * 4 -> "ghi"
 * 5 -> "jkl"
 * 6 -> "mno"
 * 7 -> "pqrs"
 * 8 -> "tuv"
 * 9 -> "wxyz"
 *
 * Example:
 * Input: digits = "23"
 * Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
 *
 * Input: digits = ""
 * Output: []
 *
 * LeetCode: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
 */

/**
 * Solution 1: Backtracking (Optimal)
 *
 * Approach:
 * - Use backtracking to generate all combinations
 * - For each digit, try all possible letters
 * - Build combinations recursively
 *
 * Time Complexity: O(4^n * n) - 4^n combinations, n to build each string
 * Space Complexity: O(n) - recursion stack depth
 */
function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  const result: string[] = [];

  function backtrack(index: number, current: string): void {
    // Base case: if we've processed all digits
    if (index === digits.length) {
      result.push(current);
      return;
    }

    const digit = digits[index];
    const letters = digitToLetters[digit];

    // Try each letter for current digit
    for (const letter of letters) {
      backtrack(index + 1, current + letter);
    }
  }

  backtrack(0, "");
  return result;
}

/**
 * Solution 2: Iterative Approach
 *
 * Approach:
 * - Build combinations iteratively
 * - Start with empty string, add letters for each digit
 *
 * Time Complexity: O(4^n * n)
 * Space Complexity: O(4^n) - to store all combinations
 */
function letterCombinationsIterative(digits: string): string[] {
  if (digits.length === 0) return [];

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  let result: string[] = [""];

  for (const digit of digits) {
    const letters = digitToLetters[digit];
    const newResult: string[] = [];

    for (const combination of result) {
      for (const letter of letters) {
        newResult.push(combination + letter);
      }
    }

    result = newResult;
  }

  return result;
}

/**
 * Solution 3: Using Queue (BFS approach)
 *
 * Approach:
 * - Use queue to process combinations level by level
 * - Each level represents processing one more digit
 *
 * Time Complexity: O(4^n * n)
 * Space Complexity: O(4^n)
 */
function letterCombinationsQueue(digits: string): string[] {
  if (digits.length === 0) return [];

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  const queue: string[] = [""];

  for (const digit of digits) {
    const letters = digitToLetters[digit];
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift()!;

      for (const letter of letters) {
        queue.push(current + letter);
      }
    }
  }

  return queue;
}

/**
 * Solution 4: Using Array Methods (Functional approach)
 *
 * Approach:
 * - Use reduce to build combinations functionally
 * - More declarative but same logic as iterative
 *
 * Time Complexity: O(4^n * n)
 * Space Complexity: O(4^n)
 */
function letterCombinationsFunctional(digits: string): string[] {
  if (digits.length === 0) return [];

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  return digits.split("").reduce(
    (combinations: string[], digit: string) => {
      const letters = digitToLetters[digit];
      return combinations.flatMap((combination) =>
        letters.split("").map((letter) => combination + letter)
      );
    },
    [""]
  );
}

/**
 * Solution 5: Using Generator (Advanced)
 *
 * Approach:
 * - Use generator function to yield combinations
 * - Memory efficient for large inputs
 *
 * Time Complexity: O(4^n * n)
 * Space Complexity: O(n) - only current combination in memory
 */
function* letterCombinationsGenerator(digits: string): Generator<string> {
  if (digits.length === 0) return;

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  function* backtrack(index: number, current: string): Generator<string> {
    if (index === digits.length) {
      yield current;
      return;
    }

    const digit = digits[index];
    const letters = digitToLetters[digit];

    for (const letter of letters) {
      yield* backtrack(index + 1, current + letter);
    }
  }

  yield* backtrack(0, "");
}

function letterCombinationsWithGenerator(digits: string): string[] {
  return Array.from(letterCombinationsGenerator(digits));
}

/**
 * Solution 6: Using Bit Manipulation (Advanced)
 *
 * Approach:
 * - Use bit manipulation to generate combinations
 * - Each bit represents a letter choice
 *
 * Time Complexity: O(4^n * n)
 * Space Complexity: O(4^n)
 */
function letterCombinationsBitwise(digits: string): string[] {
  if (digits.length === 0) return [];

  const digitToLetters: { [key: string]: string } = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6": "mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz",
  };

  const result: string[] = [];
  const totalCombinations = digits
    .split("")
    .reduce((total, digit) => total * digitToLetters[digit].length, 1);

  for (let i = 0; i < totalCombinations; i++) {
    let combination = "";
    let temp = i;

    for (let j = digits.length - 1; j >= 0; j--) {
      const digit = digits[j];
      const letters = digitToLetters[digit];
      const letterIndex = temp % letters.length;
      combination = letters[letterIndex] + combination;
      temp = Math.floor(temp / letters.length);
    }

    result.push(combination);
  }

  return result;
}

// Test cases
function testLetterCombinations() {
  console.log("=== Testing Letter Combinations of a Phone Number ===\n");

  const testCases = [
    {
      input: "23",
      expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"],
      description: "Two digits",
    },
    {
      input: "",
      expected: [],
      description: "Empty string",
    },
    {
      input: "2",
      expected: ["a", "b", "c"],
      description: "Single digit",
    },
    {
      input: "9",
      expected: ["w", "x", "y", "z"],
      description: "Digit 9",
    },
    {
      input: "234",
      expected: [
        "adg",
        "adh",
        "adi",
        "aeg",
        "aeh",
        "aei",
        "afg",
        "afh",
        "afi",
        "bdg",
        "bdh",
        "bdi",
        "beg",
        "beh",
        "bei",
        "bfg",
        "bfh",
        "bfi",
        "cdg",
        "cdh",
        "cdi",
        "ceg",
        "ceh",
        "cei",
        "cfg",
        "cfh",
        "cfi",
      ],
      description: "Three digits",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Backtracking)
    const result1 = letterCombinations(testCase.input);
    console.log(
      `Solution 1 (Backtracking): [${result1.join(", ")}] ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Iterative)
    const result2 = letterCombinationsIterative(testCase.input);
    console.log(
      `Solution 2 (Iterative): [${result2.join(", ")}] ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Queue)
    const result3 = letterCombinationsQueue(testCase.input);
    console.log(
      `Solution 3 (Queue): [${result3.join(", ")}] ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Functional)
    const result4 = letterCombinationsFunctional(testCase.input);
    console.log(
      `Solution 4 (Functional): [${result4.join(", ")}] ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Generator)
    const result5 = letterCombinationsWithGenerator(testCase.input);
    console.log(
      `Solution 5 (Generator): [${result5.join(", ")}] ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Bitwise)
    const result6 = letterCombinationsBitwise(testCase.input);
    console.log(
      `Solution 6 (Bitwise): [${result6.join(", ")}] ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
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
    { name: "Backtracking", func: letterCombinations },
    { name: "Iterative", func: letterCombinationsIterative },
    { name: "Queue", func: letterCombinationsQueue },
    { name: "Functional", func: letterCombinationsFunctional },
    { name: "Generator", func: letterCombinationsWithGenerator },
    { name: "Bitwise", func: letterCombinationsBitwise },
  ];

  const testDigits = "234"; // 3 digits = 27 combinations

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func(testDigits);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result.length} combinations`);
    console.log(`  Memory: ${name === "Generator" ? "O(n)" : "O(4^n)"}\n`);
  });
}

// Memory usage analysis
function memoryAnalysis() {
  console.log("=== Memory Usage Analysis ===\n");

  const digits = ["2", "23", "234", "2345"];

  digits.forEach((digit) => {
    console.log(`Testing with "${digit}" (${digit.length} digits):`);

    const combinations = letterCombinations(digit);
    const expectedCombinations = digit.split("").reduce((total, d) => {
      const letterCount = d === "7" || d === "9" ? 4 : 3;
      return total * letterCount;
    }, 1);

    console.log(`  Expected combinations: ${expectedCombinations}`);
    console.log(`  Actual combinations: ${combinations.length}`);
    console.log(
      `  Memory usage: ~${combinations.length * digit.length} characters`
    );
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testLetterCombinations();
// performanceComparison();
// memoryAnalysis();

export {
  letterCombinations,
  letterCombinationsIterative,
  letterCombinationsQueue,
  letterCombinationsFunctional,
  letterCombinationsWithGenerator,
  letterCombinationsBitwise,
  letterCombinationsGenerator,
  testLetterCombinations,
  performanceComparison,
  memoryAnalysis,
};
