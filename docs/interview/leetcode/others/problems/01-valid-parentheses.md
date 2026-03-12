---
layout: page
title: "Valid Parenthese"
difficulty: Easy
category: Others
tags: [Others, Hash Table]
leetcode_url: "https://leetcode.com/problems/valid-parenthese/"
---

# Valid Parenthese

**LeetCode Problem # * 20. Valid Parentheses**

## Problem Description

 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',  * determine if the input string is valid.  *  * An input string is valid if:  * - Open brackets must be closed by the same type of brackets. 

## Solutions

{% raw %}
/**
 * 20. Valid Parentheses
 *
 * Problem:
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid.
 *
 * An input string is valid if:
 * - Open brackets must be closed by the same type of brackets.
 * - Open brackets must be closed in the correct order.
 * - Every close bracket has a corresponding open bracket of the same type.
 *
 * Example:
 * Input: s = "()"
 * Output: true
 *
 * Input: s = "()[]{}"
 * Output: true
 *
 * Input: s = "(]"
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/valid-parentheses/
 */

/**
 * Solution 1: Stack (Optimal)
 *
 * Approach:
 * - Use stack to keep track of opening brackets
 * - When encountering closing bracket, check if it matches top of stack
 * - Stack should be empty at the end
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValid(s: string): boolean {
  const stack: string[] = [];
  const brackets: { [key: string]: string } = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (const char of s) {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== brackets[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

/**
 * Solution 2: Stack with Switch Statement
 *
 * Approach:
 * - Same logic as Solution 1 but using switch statement
 * - More explicit handling of each bracket type
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidSwitch(s: string): boolean {
  const stack: string[] = [];

  for (const char of s) {
    switch (char) {
      case "(":
      case "{":
      case "[":
        stack.push(char);
        break;
      case ")":
        if (stack.length === 0 || stack.pop() !== "(") return false;
        break;
      case "}":
        if (stack.length === 0 || stack.pop() !== "{") return false;
        break;
      case "]":
        if (stack.length === 0 || stack.pop() !== "[") return false;
        break;
    }
  }

  return stack.length === 0;
}

/**
 * Solution 3: Using Array Methods (Functional)
 *
 * Approach:
 * - Use reduce to process string functionally
 * - More declarative approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidFunctional(s: string): boolean {
  const brackets: { [key: string]: string } = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  const result = s.split("").reduce((stack: string[], char: string) => {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== brackets[char]) {
        return ["INVALID"]; // Mark as invalid
      }
      stack.pop();
    }
    return stack;
  }, []);

  return result.length === 0 && !result.includes("INVALID");
}

/**
 * Solution 4: Using Map (More Extensible)
 *
 * Approach:
 * - Use Map for bracket pairs
 * - Easier to extend for more bracket types
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidMap(s: string): boolean {
  const stack: string[] = [];
  const brackets = new Map<string, string>([
    [")", "("],
    ["}", "{"],
    ["]", "["],
  ]);

  for (const char of s) {
    if (!brackets.has(char)) {
      // Opening bracket
      stack.push(char);
    } else {
      // Closing bracket
      if (stack.length === 0 || stack.pop() !== brackets.get(char)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

/**
 * Solution 5: Using ASCII Values (Optimized)
 *
 * Approach:
 * - Use ASCII values to determine bracket pairs
 * - Avoids object/map lookups
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidASCII(s: string): boolean {
  const stack: number[] = [];

  for (const char of s) {
    const code = char.charCodeAt(0);

    if (code === 40 || code === 91 || code === 123) {
      // (, [, {
      stack.push(code);
    } else {
      if (stack.length === 0) return false;

      const top = stack.pop()!;
      const diff = code - top;

      // Check if brackets match: () = 1, [] = 2, {} = 2
      if (diff !== 1 && diff !== 2) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

/**
 * Solution 6: Recursive Approach (Educational)
 *
 * Approach:
 * - Use recursion to validate parentheses
 * - Shows recursive thinking
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function isValidRecursive(s: string): boolean {
  function validate(index: number, stack: string[]): [boolean, number] {
    if (index >= s.length) {
      return [stack.length === 0, index];
    }

    const char = s[index];

    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
      return validate(index + 1, stack);
    } else {
      if (stack.length === 0) return [false, index];

      const top = stack.pop()!;
      const expected = char === ")" ? "(" : char === "}" ? "{" : "[";

      if (top !== expected) return [false, index];
      return validate(index + 1, stack);
    }
  }

  const [isValid, _] = validate(0, []);
  return isValid;
}

/**
 * Solution 7: Using Regular Expressions (Not Recommended)
 *
 * Approach:
 * - Use regex to remove valid pairs repeatedly
 * - Educational but inefficient
 *
 * Time Complexity: O(n²) - regex operations
 * Space Complexity: O(n)
 */
function isValidRegex(s: string): boolean {
  let prev = s;
  let current = s;

  do {
    prev = current;
    current = current.replace(/\(\)|\[\]|\{\}/g, "");
  } while (prev !== current);

  return current.length === 0;
}

/**
 * Solution 8: Using Generator (Memory Efficient)
 *
 * Approach:
 * - Use generator to process brackets one by one
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* bracketValidator(s: string): Generator<boolean> {
  const stack: string[] = [];
  const brackets: { [key: string]: string } = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (const char of s) {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== brackets[char]) {
        yield false;
        return;
      }
    }
    yield stack.length === 0;
  }

  yield stack.length === 0;
}

function isValidGenerator(s: string): boolean {
  const generator = bracketValidator(s);
  let result = false;

  for (const valid of generator) {
    result = valid;
  }

  return result;
}

// Test cases
function testValidParentheses() {
  console.log("=== Testing Valid Parentheses ===\n");

  const testCases = [
    {
      input: "()",
      expected: true,
      description: "Simple parentheses",
    },
    {
      input: "()[]{}",
      expected: true,
      description: "Multiple bracket types",
    },
    {
      input: "(]",
      expected: false,
      description: "Mismatched brackets",
    },
    {
      input: "([)]",
      expected: false,
      description: "Wrong order",
    },
    {
      input: "{[]}",
      expected: true,
      description: "Nested brackets",
    },
    {
      input: "",
      expected: true,
      description: "Empty string",
    },
    {
      input: "(((",
      expected: false,
      description: "Only opening brackets",
    },
    {
      input: ")))",
      expected: false,
      description: "Only closing brackets",
    },
    {
      input: "({[]})",
      expected: true,
      description: "Complex nested",
    },
    {
      input: "([{}])",
      expected: true,
      description: "Mixed nested",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Stack)
    const result1 = isValid(testCase.input);
    console.log(
      `Solution 1 (Stack): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Switch)
    const result2 = isValidSwitch(testCase.input);
    console.log(
      `Solution 2 (Switch): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Functional)
    const result3 = isValidFunctional(testCase.input);
    console.log(
      `Solution 3 (Functional): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = isValidMap(testCase.input);
    console.log(
      `Solution 4 (Map): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (ASCII)
    const result5 = isValidASCII(testCase.input);
    console.log(
      `Solution 5 (ASCII): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Recursive)
    const result6 = isValidRecursive(testCase.input);
    console.log(
      `Solution 6 (Recursive): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Regex)
    const result7 = isValidRegex(testCase.input);
    console.log(
      `Solution 7 (Regex): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = isValidGenerator(testCase.input);
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
    { name: "Stack", func: isValid },
    { name: "Switch", func: isValidSwitch },
    { name: "Functional", func: isValidFunctional },
    { name: "Map", func: isValidMap },
    { name: "ASCII", func: isValidASCII },
    { name: "Recursive", func: isValidRecursive },
    { name: "Regex", func: isValidRegex },
    { name: "Generator", func: isValidGenerator },
  ];

  // Create test string with many brackets
  const testString = "({[]})".repeat(10000);

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func(testString);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result}`);
    console.log(`  Memory: O(n)\n`);
  });
}

// Uncomment the following lines to run tests
// testValidParentheses();
// performanceComparison();

export {
  isValid,
  isValidSwitch,
  isValidFunctional,
  isValidMap,
  isValidASCII,
  isValidRecursive,
  isValidRegex,
  isValidGenerator,
  bracketValidator,
  testValidParentheses,
  performanceComparison,
};
{% endraw %}
