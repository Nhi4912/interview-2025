/**
 * 28. Implement strStr()
 *
 * Problem:
 * Implement strStr().
 *
 * Return the index of the first occurrence of needle in haystack, or -1 if
 * needle is not part of haystack.
 *
 * Clarification:
 * What should we return when needle is an empty string? This is a great question
 * to ask during an interview.
 *
 * For the purpose of this problem, we will return 0 when needle is an empty string.
 * This is consistent to C's strstr() and Java's indexOf().
 *
 * Example:
 * Input: haystack = "hello", needle = "ll"
 * Output: 2
 *
 * Input: haystack = "aaaaa", needle = "bba"
 * Output: -1
 *
 * Input: haystack = "", needle = ""
 * Output: 0
 *
 * LeetCode: https://leetcode.com/problems/implement-strstr/
 */

/**
 * Solution 1: Built-in indexOf (Simple)
 *
 * Approach:
 * - Use JavaScript's built-in indexOf method
 * - Simple but not educational for interviews
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(1)
 */
function strStr(haystack: string, needle: string): number {
  return haystack.indexOf(needle);
}

/**
 * Solution 2: Brute Force (Naive)
 *
 * Approach:
 * - Check each possible starting position
 * - Compare substring with needle
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(1)
 */
function strStrBruteForce(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) {
      j++;
    }
    if (j === m) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 3: KMP Algorithm (Optimal)
 *
 * Approach:
 * - Use KMP algorithm for efficient string matching
 * - Precompute failure function
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(m)
 */
function strStrKMP(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  // Compute failure function
  const failure = computeFailureFunction(needle);

  let i = 0; // index for haystack
  let j = 0; // index for needle

  while (i < n) {
    if (needle[j] === haystack[i]) {
      i++;
      j++;
    }

    if (j === m) {
      return i - j;
    } else if (i < n && needle[j] !== haystack[i]) {
      if (j !== 0) {
        j = failure[j - 1];
      } else {
        i++;
      }
    }
  }

  return -1;
}

function computeFailureFunction(pattern: string): number[] {
  const m = pattern.length;
  const failure = new Array(m).fill(0);

  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      failure[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = failure[len - 1];
      } else {
        failure[i] = 0;
        i++;
      }
    }
  }

  return failure;
}

/**
 * Solution 4: Boyer-Moore Algorithm
 *
 * Approach:
 * - Use Boyer-Moore algorithm for efficient string matching
 * - Bad character rule and good suffix rule
 *
 * Time Complexity: O(n * m) worst case, O(n/m) best case
 * Space Complexity: O(k) where k is alphabet size
 */
function strStrBoyerMoore(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  // Bad character table
  const badChar = new Map<string, number>();
  for (let i = 0; i < m - 1; i++) {
    badChar.set(needle[i], m - 1 - i);
  }

  let i = m - 1;
  while (i < n) {
    let j = m - 1;
    let k = i;

    while (j >= 0 && haystack[k] === needle[j]) {
      k--;
      j--;
    }

    if (j === -1) {
      return k + 1;
    }

    const shift = badChar.get(haystack[i]) || m;
    i += shift;
  }

  return -1;
}

/**
 * Solution 5: Rabin-Karp Algorithm
 *
 * Approach:
 * - Use rolling hash for string matching
 * - Hash-based comparison
 *
 * Time Complexity: O(n + m) average case
 * Space Complexity: O(1)
 */
function strStrRabinKarp(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  if (n < m) return -1;

  const base = 256;
  const mod = 101; // Prime number

  // Compute hash for needle
  let needleHash = 0;
  for (let i = 0; i < m; i++) {
    needleHash = (needleHash * base + needle.charCodeAt(i)) % mod;
  }

  // Compute hash for first window of haystack
  let haystackHash = 0;
  for (let i = 0; i < m; i++) {
    haystackHash = (haystackHash * base + haystack.charCodeAt(i)) % mod;
  }

  // Power for rolling hash
  let power = 1;
  for (let i = 0; i < m - 1; i++) {
    power = (power * base) % mod;
  }

  // Check first window
  if (haystackHash === needleHash && haystack.substring(0, m) === needle) {
    return 0;
  }

  // Check remaining windows
  for (let i = m; i < n; i++) {
    haystackHash =
      (haystackHash - ((haystack.charCodeAt(i - m) * power) % mod) + mod) % mod;
    haystackHash = (haystackHash * base + haystack.charCodeAt(i)) % mod;

    if (
      haystackHash === needleHash &&
      haystack.substring(i - m + 1, i + 1) === needle
    ) {
      return i - m + 1;
    }
  }

  return -1;
}

/**
 * Solution 6: Using Sliding Window
 *
 * Approach:
 * - Use sliding window technique
 * - Compare substrings directly
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(1)
 */
function strStrSlidingWindow(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  for (let i = 0; i <= n - m; i++) {
    const window = haystack.substring(i, i + m);
    if (window === needle) {
      return i;
    }
  }

  return -1;
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield possible positions
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(1)
 */
function* possiblePositions(
  haystack: string,
  needle: string
): Generator<number> {
  if (needle === "") {
    yield 0;
    return;
  }

  const n = haystack.length;
  const m = needle.length;

  for (let i = 0; i <= n - m; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      if (haystack[i + j] !== needle[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      yield i;
    }
  }
}

function strStrGenerator(haystack: string, needle: string): number {
  const positions = possiblePositions(haystack, needle);
  const first = positions.next();
  return first.done ? -1 : first.value;
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a StringMatcher class
 * - Encapsulate matching logic
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(1)
 */
class StringMatcher {
  private haystack: string;
  private needle: string;

  constructor(haystack: string, needle: string) {
    this.haystack = haystack;
    this.needle = needle;
  }

  findFirstOccurrence(): number {
    if (this.needle === "") return 0;

    const n = this.haystack.length;
    const m = this.needle.length;

    for (let i = 0; i <= n - m; i++) {
      if (this.matchesAt(i)) {
        return i;
      }
    }

    return -1;
  }

  private matchesAt(startIndex: number): boolean {
    for (let i = 0; i < this.needle.length; i++) {
      if (this.haystack[startIndex + i] !== this.needle[i]) {
        return false;
      }
    }
    return true;
  }
}

function strStrClass(haystack: string, needle: string): number {
  const matcher = new StringMatcher(haystack, needle);
  return matcher.findFirstOccurrence();
}

/**
 * Solution 9: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n * m)
 * Space Complexity: O(n)
 */
function strStrFunctional(haystack: string, needle: string): number {
  if (needle === "") return 0;

  const n = haystack.length;
  const m = needle.length;

  const positions = Array.from({ length: n - m + 1 }, (_, i) => i).filter(
    (i) => haystack.substring(i, i + m) === needle
  );

  return positions.length > 0 ? positions[0] : -1;
}

// Test cases
function testStrStr() {
  console.log("=== Testing Implement strStr() ===\n");

  const testCases = [
    {
      haystack: "hello",
      needle: "ll",
      expected: 2,
      description: "Standard case",
    },
    {
      haystack: "aaaaa",
      needle: "bba",
      expected: -1,
      description: "No match",
    },
    {
      haystack: "",
      needle: "",
      expected: 0,
      description: "Empty strings",
    },
    {
      haystack: "hello",
      needle: "",
      expected: 0,
      description: "Empty needle",
    },
    {
      haystack: "",
      needle: "hello",
      expected: -1,
      description: "Empty haystack",
    },
    {
      haystack: "mississippi",
      needle: "issip",
      expected: 4,
      description: "Complex case",
    },
    {
      haystack: "a",
      needle: "a",
      expected: 0,
      description: "Single character match",
    },
    {
      haystack: "abc",
      needle: "abcd",
      expected: -1,
      description: "Needle longer than haystack",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: haystack = "${testCase.haystack}", needle = "${testCase.needle}"`
    );
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Built-in)
    const result1 = strStr(testCase.haystack, testCase.needle);
    console.log(
      `Solution 1 (Built-in): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Brute Force)
    const result2 = strStrBruteForce(testCase.haystack, testCase.needle);
    console.log(
      `Solution 2 (Brute Force): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (KMP)
    const result3 = strStrKMP(testCase.haystack, testCase.needle);
    console.log(
      `Solution 3 (KMP): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Boyer-Moore)
    const result4 = strStrBoyerMoore(testCase.haystack, testCase.needle);
    console.log(
      `Solution 4 (Boyer-Moore): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Rabin-Karp)
    const result5 = strStrRabinKarp(testCase.haystack, testCase.needle);
    console.log(
      `Solution 5 (Rabin-Karp): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Sliding Window)
    const result6 = strStrSlidingWindow(testCase.haystack, testCase.needle);
    console.log(
      `Solution 6 (Sliding Window): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = strStrGenerator(testCase.haystack, testCase.needle);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = strStrClass(testCase.haystack, testCase.needle);
    console.log(
      `Solution 8 (Class): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const result9 = strStrFunctional(testCase.haystack, testCase.needle);
    console.log(
      `Solution 9 (Functional): ${result9} ${
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
    { name: "Built-in", func: strStr },
    { name: "Brute Force", func: strStrBruteForce },
    { name: "KMP", func: strStrKMP },
    { name: "Boyer-Moore", func: strStrBoyerMoore },
    { name: "Rabin-Karp", func: strStrRabinKarp },
    { name: "Sliding Window", func: strStrSlidingWindow },
    { name: "Generator", func: strStrGenerator },
    { name: "Class", func: strStrClass },
    { name: "Functional", func: strStrFunctional },
  ];

  // Create test cases
  const shortCase = { haystack: "hello world", needle: "world" };
  const mediumCase = { haystack: "a".repeat(1000) + "b", needle: "ab" };
  const longCase = { haystack: "a".repeat(10000) + "b", needle: "ab" };

  const cases = [
    { name: "Short", case: shortCase },
    { name: "Medium", case: mediumCase },
    { name: "Long", case: longCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase.haystack, testCase.needle);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testStrStr();
// performanceComparison();

export {
  strStr,
  strStrBruteForce,
  strStrKMP,
  strStrBoyerMoore,
  strStrRabinKarp,
  strStrSlidingWindow,
  strStrGenerator,
  strStrClass,
  strStrFunctional,
  StringMatcher,
  possiblePositions,
  computeFailureFunction,
  testStrStr,
  performanceComparison,
};
