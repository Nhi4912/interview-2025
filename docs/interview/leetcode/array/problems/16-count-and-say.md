---
layout: page
title: "Count and Say"
difficulty: Hard
category: Array
tags: [Array, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/count-and-say/"
---

# Count and Say

**LeetCode Problem # * 38. Count and Say**

## Problem Description

 * The count-and-say sequence is a sequence of digit strings defined by the recursive formula:  *  * countAndSay(1) = "1"  * countAndSay(n) is the way you would "say" the digit string from countAndSay(n-1),  * which is then converted into a different digit string. 

## Solutions

{% raw %}
/**
 * 38. Count and Say
 *
 * Problem:
 * The count-and-say sequence is a sequence of digit strings defined by the recursive formula:
 *
 * countAndSay(1) = "1"
 * countAndSay(n) is the way you would "say" the digit string from countAndSay(n-1),
 * which is then converted into a different digit string.
 *
 * To determine how you "say" a digit string, split it into the minimal number of
 * substrings such that each substring contains exactly one unique digit. Then for
 * each substring, say the number of digits, then say the digit. Finally, concatenate
 * every said digit.
 *
 * Example:
 * Input: n = 1
 * Output: "1"
 *
 * Input: n = 4
 * Output: "1211"
 * Explanation:
 * countAndSay(1) = "1"
 * countAndSay(2) = say "1" = one 1 = "11"
 * countAndSay(3) = say "11" = two 1's = "21"
 * countAndSay(4) = say "21" = one 2 + one 1 = "12" + "11" = "1211"
 *
 * LeetCode: https://leetcode.com/problems/count-and-say/
 */

/**
 * Solution 1: Iterative Approach (Optimal)
 *
 * Approach:
 * - Build the sequence iteratively from n=1 to n
 * - For each step, count consecutive digits and build the next string
 *
 * Time Complexity: O(n * 2^n) - each string can be up to 2^n length
 * Space Complexity: O(2^n)
 */
function countAndSay(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    let current = "";
    let count = 1;
    let digit = result[0];

    for (let j = 1; j < result.length; j++) {
      if (result[j] === digit) {
        count++;
      } else {
        current += count + digit;
        count = 1;
        digit = result[j];
      }
    }

    current += count + digit;
    result = current;
  }

  return result;
}

/**
 * Solution 2: Recursive Approach
 *
 * Approach:
 * - Use recursion to build the sequence
 * - Base case: n = 1 returns "1"
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(n) - recursion stack + O(2^n) for result
 */
function countAndSayRecursive(n: number): string {
  if (n === 1) return "1";

  const prev = countAndSayRecursive(n - 1);
  let result = "";
  let count = 1;
  let digit = prev[0];

  for (let i = 1; i < prev.length; i++) {
    if (prev[i] === digit) {
      count++;
    } else {
      result += count + digit;
      count = 1;
      digit = prev[i];
    }
  }

  result += count + digit;
  return result;
}

/**
 * Solution 3: Using Array Methods
 *
 * Approach:
 * - Use array methods to process the string
 * - More functional programming style
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayArray(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    const chars = result.split("");
    const groups: string[] = [];
    let currentGroup = chars[0];

    for (let j = 1; j < chars.length; j++) {
      if (chars[j] === chars[j - 1]) {
        currentGroup += chars[j];
      } else {
        groups.push(currentGroup);
        currentGroup = chars[j];
      }
    }
    groups.push(currentGroup);

    result = groups.map((group) => group.length + group[0]).join("");
  }

  return result;
}

/**
 * Solution 4: Using Map
 *
 * Approach:
 * - Use Map to track consecutive digits
 * - More explicit grouping
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayMap(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    const groups = new Map<string, number>();
    let currentDigit = result[0];
    let count = 1;

    for (let j = 1; j < result.length; j++) {
      if (result[j] === currentDigit) {
        count++;
      } else {
        groups.set(currentDigit, count);
        currentDigit = result[j];
        count = 1;
      }
    }
    groups.set(currentDigit, count);

    result = Array.from(groups.entries())
      .map(([digit, count]) => count + digit)
      .join("");
  }

  return result;
}

/**
 * Solution 5: Using Regular Expression
 *
 * Approach:
 * - Use regex to find consecutive digits
 * - More concise but less readable
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayRegex(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    result = result.replace(/(.)\1*/g, (match) => match.length + match[0]);
  }

  return result;
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield each step
 * - Memory efficient for large n
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function* countAndSayGenerator(n: number): Generator<string> {
  let result = "1";
  yield result;

  for (let i = 2; i <= n; i++) {
    let current = "";
    let count = 1;
    let digit = result[0];

    for (let j = 1; j < result.length; j++) {
      if (result[j] === digit) {
        count++;
      } else {
        current += count + digit;
        count = 1;
        digit = result[j];
      }
    }

    current += count + digit;
    result = current;
    yield result;
  }
}

function countAndSayWithGenerator(n: number): string {
  const generator = countAndSayGenerator(n);
  let result = "";

  for (const value of generator) {
    result = value;
  }

  return result;
}

/**
 * Solution 7: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a CountAndSay class
 * - Encapsulate the logic
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
class CountAndSayGenerator {
  private sequence: string[];

  constructor() {
    this.sequence = ["1"];
  }

  generate(n: number): string {
    while (this.sequence.length < n) {
      const last = this.sequence[this.sequence.length - 1];
      this.sequence.push(this.say(last));
    }

    return this.sequence[n - 1];
  }

  private say(s: string): string {
    let result = "";
    let count = 1;
    let digit = s[0];

    for (let i = 1; i < s.length; i++) {
      if (s[i] === digit) {
        count++;
      } else {
        result += count + digit;
        count = 1;
        digit = s[i];
      }
    }

    result += count + digit;
    return result;
  }

  getSequence(): string[] {
    return [...this.sequence];
  }
}

function countAndSayClass(n: number): string {
  const generator = new CountAndSayGenerator();
  return generator.generate(n);
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayFunctional(n: number): string {
  if (n === 1) return "1";

  const say = (s: string): string => {
    const groups = s.match(/(.)\1*/g) || [];
    return groups.map((group) => group.length + group[0]).join("");
  };

  return Array.from({ length: n - 1 }, (_, i) => i).reduce(
    (acc) => say(acc),
    "1"
  );
}

/**
 * Solution 9: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to count consecutive digits
 * - More explicit control over the process
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayTwoPointers(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    let current = "";
    let left = 0;
    let right = 0;

    while (right < result.length) {
      while (right < result.length && result[right] === result[left]) {
        right++;
      }

      current += right - left + result[left];
      left = right;
    }

    result = current;
  }

  return result;
}

/**
 * Solution 10: Using Stack
 *
 * Approach:
 * - Use stack to process consecutive digits
 * - Educational purpose
 *
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(2^n)
 */
function countAndSayStack(n: number): string {
  if (n === 1) return "1";

  let result = "1";

  for (let i = 2; i <= n; i++) {
    const stack: string[] = [];
    let current = "";

    for (const char of result) {
      if (stack.length === 0 || stack[stack.length - 1] === char) {
        stack.push(char);
      } else {
        current += stack.length + stack[0];
        stack.length = 0;
        stack.push(char);
      }
    }

    if (stack.length > 0) {
      current += stack.length + stack[0];
    }

    result = current;
  }

  return result;
}

// Test cases
function testCountAndSay() {
  console.log("=== Testing Count and Say ===\n");

  const testCases = [
    {
      input: 1,
      expected: "1",
      description: "Base case",
    },
    {
      input: 2,
      expected: "11",
      description: "Second term",
    },
    {
      input: 3,
      expected: "21",
      description: "Third term",
    },
    {
      input: 4,
      expected: "1211",
      description: "Fourth term",
    },
    {
      input: 5,
      expected: "111221",
      description: "Fifth term",
    },
    {
      input: 6,
      expected: "312211",
      description: "Sixth term",
    },
    {
      input: 7,
      expected: "13112221",
      description: "Seventh term",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: n = ${testCase.input}`);
    console.log(`Expected: "${testCase.expected}"\n`);

    // Test Solution 1 (Iterative)
    const result1 = countAndSay(testCase.input);
    console.log(
      `Solution 1 (Iterative): "${result1}" ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Recursive)
    const result2 = countAndSayRecursive(testCase.input);
    console.log(
      `Solution 2 (Recursive): "${result2}" ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Array Methods)
    const result3 = countAndSayArray(testCase.input);
    console.log(
      `Solution 3 (Array Methods): "${result3}" ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = countAndSayMap(testCase.input);
    console.log(
      `Solution 4 (Map): "${result4}" ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Regex)
    const result5 = countAndSayRegex(testCase.input);
    console.log(
      `Solution 5 (Regex): "${result5}" ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = countAndSayWithGenerator(testCase.input);
    console.log(
      `Solution 6 (Generator): "${result6}" ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Class)
    const result7 = countAndSayClass(testCase.input);
    console.log(
      `Solution 7 (Class): "${result7}" ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = countAndSayFunctional(testCase.input);
    console.log(
      `Solution 8 (Functional): "${result8}" ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Two Pointers)
    const result9 = countAndSayTwoPointers(testCase.input);
    console.log(
      `Solution 9 (Two Pointers): "${result9}" ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Stack)
    const result10 = countAndSayStack(testCase.input);
    console.log(
      `Solution 10 (Stack): "${result10}" ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Iterative", func: countAndSay },
    { name: "Recursive", func: countAndSayRecursive },
    { name: "Array Methods", func: countAndSayArray },
    { name: "Map", func: countAndSayMap },
    { name: "Regex", func: countAndSayRegex },
    { name: "Generator", func: countAndSayWithGenerator },
    { name: "Class", func: countAndSayClass },
    { name: "Functional", func: countAndSayFunctional },
    { name: "Two Pointers", func: countAndSayTwoPointers },
    { name: "Stack", func: countAndSayStack },
  ];

  const testValues = [5, 10, 15, 20];

  testValues.forEach((n) => {
    console.log(`n = ${n}:`);

    testCases.forEach(({ name, func }) => {
      const start = performance.now();
      const result = func(n);
      const end = performance.now();

      console.log(
        `  ${name}: ${(end - start).toFixed(2)}ms (length: ${result.length})`
      );
    });

    console.log("");
  });
}

// Sequence analysis
function sequenceAnalysis() {
  console.log("=== Count and Say Sequence Analysis ===\n");

  const generator = new CountAndSayGenerator();
  const sequence = generator.getSequence();

  console.log("First 10 terms of the sequence:");
  for (let i = 1; i <= 10; i++) {
    const term = generator.generate(i);
    console.log(`Term ${i}: "${term}" (length: ${term.length})`);
  }

  console.log("\nPattern Analysis:");
  console.log("- Each term describes the previous term");
  console.log("- The sequence grows exponentially");
  console.log("- Contains only digits 1, 2, and 3");
  console.log("- No digit appears more than 3 times consecutively");
}

// Uncomment the following lines to run tests
// testCountAndSay();
// performanceComparison();
// sequenceAnalysis();

export {
  countAndSay,
  countAndSayRecursive,
  countAndSayArray,
  countAndSayMap,
  countAndSayRegex,
  countAndSayWithGenerator,
  countAndSayClass,
  countAndSayFunctional,
  countAndSayTwoPointers,
  countAndSayStack,
  CountAndSayGenerator,
  countAndSayGenerator,
  testCountAndSay,
  performanceComparison,
  sequenceAnalysis,
};
{% endraw %}
