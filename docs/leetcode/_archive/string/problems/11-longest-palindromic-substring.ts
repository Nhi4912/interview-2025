/**
 * 5. Longest Palindromic Substring
 *
 * Problem:
 * Given a string s, return the longest palindromic substring in s.
 *
 * Example:
 * Input: s = "babad"
 * Output: "bab"
 * Explanation: "aba" is also a valid answer.
 *
 * Input: s = "cbbd"
 * Output: "bb"
 *
 * Input: s = "a"
 * Output: "a"
 *
 * LeetCode: https://leetcode.com/problems/longest-palindromic-substring/
 */

/**
 * Solution 1: Expand Around Center (Optimal)
 *
 * Approach:
 * - For each character, expand around it to find palindromes
 * - Handle both odd and even length palindromes
 * - Keep track of the longest palindrome found
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function longestPalindrome(s: string): string {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  function expandAroundCenter(left: number, right: number): number {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    // Check odd length palindromes
    const len1 = expandAroundCenter(i, i);
    // Check even length palindromes
    const len2 = expandAroundCenter(i, i + 1);

    const maxLen = Math.max(len1, len2);

    if (maxLen > maxLength) {
      start = i - Math.floor((maxLen - 1) / 2);
      maxLength = maxLen;
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 2: Dynamic Programming
 *
 * Approach:
 * - Use DP table to track palindrome substrings
 * - dp[i][j] = true if s[i...j] is palindrome
 * - Fill table diagonally
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n²)
 */
function longestPalindromeDP(s: string): string {
  if (s.length < 2) return s;

  const n = s.length;
  const dp = Array(n)
    .fill(null)
    .map(() => Array(n).fill(false));

  let start = 0;
  let maxLength = 1;

  // All single characters are palindromes
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // Check for 2-character palindromes
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i + 1]) {
      dp[i][i + 1] = true;
      start = i;
      maxLength = 2;
    }
  }

  // Check for palindromes of length > 2
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;

      if (s[i] === s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;

        if (len > maxLength) {
          start = i;
          maxLength = len;
        }
      }
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 3: Manacher's Algorithm
 *
 * Approach:
 * - Use Manacher's algorithm for linear time complexity
 * - Transform string to handle even length palindromes
 * - Use palindrome radius array
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function longestPalindromeManacher(s: string): string {
  if (s.length < 2) return s;

  // Transform string to handle even length palindromes
  const transformed = "#" + s.split("").join("#") + "#";
  const n = transformed.length;
  const p = new Array(n).fill(0);

  let center = 0;
  let right = 0;

  for (let i = 0; i < n; i++) {
    if (i < right) {
      const mirror = 2 * center - i;
      p[i] = Math.min(right - i, p[mirror]);
    }

    // Expand around current center
    let left = i - (p[i] + 1);
    let r = i + (p[i] + 1);

    while (left >= 0 && r < n && transformed[left] === transformed[r]) {
      p[i]++;
      left--;
      r++;
    }

    // Update center and right boundary
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
  }

  // Find the longest palindrome
  let maxLen = 0;
  let centerIndex = 0;

  for (let i = 0; i < n; i++) {
    if (p[i] > maxLen) {
      maxLen = p[i];
      centerIndex = i;
    }
  }

  const start = Math.floor((centerIndex - maxLen) / 2);
  return s.substring(start, start + maxLen);
}

/**
 * Solution 4: Brute Force
 *
 * Approach:
 * - Check all possible substrings
 * - Verify if each substring is palindrome
 *
 * Time Complexity: O(n³)
 * Space Complexity: O(1)
 */
function longestPalindromeBruteForce(s: string): string {
  if (s.length < 2) return s;

  let maxLength = 1;
  let start = 0;

  function isPalindrome(str: string): boolean {
    let left = 0;
    let right = str.length - 1;

    while (left < right) {
      if (str[left] !== str[right]) {
        return false;
      }
      left++;
      right--;
    }
    return true;
  }

  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      const substring = s.substring(i, j + 1);

      if (isPalindrome(substring) && substring.length > maxLength) {
        maxLength = substring.length;
        start = i;
      }
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a PalindromeFinder class
 * - Encapsulate the finding logic
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
class PalindromeFinder {
  private s: string;

  constructor(s: string) {
    this.s = s;
  }

  findLongest(): string {
    if (this.s.length < 2) return this.s;

    let start = 0;
    let maxLength = 1;

    for (let i = 0; i < this.s.length; i++) {
      const len1 = this.expandAroundCenter(i, i);
      const len2 = this.expandAroundCenter(i, i + 1);

      const maxLen = Math.max(len1, len2);

      if (maxLen > maxLength) {
        start = i - Math.floor((maxLen - 1) / 2);
        maxLength = maxLen;
      }
    }

    return this.s.substring(start, start + maxLength);
  }

  private expandAroundCenter(left: number, right: number): number {
    while (
      left >= 0 &&
      right < this.s.length &&
      this.s[left] === this.s[right]
    ) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  getString(): string {
    return this.s;
  }
}

function longestPalindromeClass(s: string): string {
  const finder = new PalindromeFinder(s);
  return finder.findLongest();
}

/**
 * Solution 6: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield palindrome lengths
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function* longestPalindromeGenerator(
  s: string
): Generator<{ start: number; length: number }> {
  if (s.length < 2) {
    yield { start: 0, length: s.length };
    return;
  }

  function expandAroundCenter(left: number, right: number): number {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(i, i);
    const len2 = expandAroundCenter(i, i + 1);

    const maxLen = Math.max(len1, len2);
    const start = i - Math.floor((maxLen - 1) / 2);

    yield { start, length: maxLen };
  }
}

function longestPalindromeWithGenerator(s: string): string {
  let maxLength = 0;
  let start = 0;

  for (const { start: currentStart, length } of longestPalindromeGenerator(s)) {
    if (length > maxLength) {
      maxLength = length;
      start = currentStart;
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function longestPalindromeFunctional(s: string): string {
  if (s.length < 2) return s;

  const expandAroundCenter = (left: number, right: number): number => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  };

  const results = s.split("").map((_, i) => {
    const len1 = expandAroundCenter(i, i);
    const len2 = expandAroundCenter(i, i + 1);
    const maxLen = Math.max(len1, len2);
    const start = i - Math.floor((maxLen - 1) / 2);
    return { start, length: maxLen };
  });

  const maxResult = results.reduce((max, current) =>
    current.length > max.length ? current : max
  );

  return s.substring(maxResult.start, maxResult.start + maxResult.length);
}

/**
 * Solution 8: Using Two Pointers with Optimization
 *
 * Approach:
 * - Use two pointers with early termination
 * - Optimize by checking palindrome property
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function longestPalindromeTwoPointers(s: string): string {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  for (let i = 0; i < s.length; i++) {
    // Skip duplicates to optimize
    let left = i;
    let right = i;

    while (right + 1 < s.length && s[right] === s[right + 1]) {
      right++;
    }

    i = right; // Skip the duplicates in next iteration

    // Expand around center
    while (left > 0 && right + 1 < s.length && s[left - 1] === s[right + 1]) {
      left--;
      right++;
    }

    const length = right - left + 1;
    if (length > maxLength) {
      start = left;
      maxLength = length;
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 9: Using Recursion
 *
 * Approach:
 * - Use recursive approach to find palindromes
 * - Memoize results to avoid recomputation
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(n²)
 */
function longestPalindromeRecursive(s: string): string {
  if (s.length < 2) return s;

  const memo = new Map<string, boolean>();

  function isPalindrome(left: number, right: number): boolean {
    const key = `${left},${right}`;

    if (memo.has(key)) {
      return memo.get(key)!;
    }

    if (left >= right) {
      memo.set(key, true);
      return true;
    }

    const result = s[left] === s[right] && isPalindrome(left + 1, right - 1);
    memo.set(key, result);
    return result;
  }

  let start = 0;
  let maxLength = 1;

  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      if (isPalindrome(i, j) && j - i + 1 > maxLength) {
        start = i;
        maxLength = j - i + 1;
      }
    }
  }

  return s.substring(start, start + maxLength);
}

/**
 * Solution 10: Using Sliding Window
 *
 * Approach:
 * - Use sliding window technique
 * - Check palindrome property for each window
 *
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function longestPalindromeSlidingWindow(s: string): string {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  function isPalindrome(left: number, right: number): boolean {
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    return true;
  }

  // Try different window sizes
  for (let windowSize = s.length; windowSize >= 2; windowSize--) {
    for (let i = 0; i <= s.length - windowSize; i++) {
      const j = i + windowSize - 1;

      if (isPalindrome(i, j)) {
        return s.substring(i, j + 1);
      }
    }
  }

  return s[0];
}

// Test cases
function testLongestPalindrome() {
  console.log("=== Testing Longest Palindromic Substring ===\n");

  const testCases = [
    {
      input: "babad",
      expected: "bab",
      description: "Multiple palindromes",
    },
    {
      input: "cbbd",
      expected: "bb",
      description: "Even length palindrome",
    },
    {
      input: "a",
      expected: "a",
      description: "Single character",
    },
    {
      input: "",
      expected: "",
      description: "Empty string",
    },
    {
      input: "racecar",
      expected: "racecar",
      description: "Full string palindrome",
    },
    {
      input: "abcde",
      expected: "a",
      description: "No palindromes longer than 1",
    },
    {
      input: "aaa",
      expected: "aaa",
      description: "All same characters",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: "${testCase.expected}"\n`);

    // Test Solution 1 (Expand Around Center)
    const result1 = longestPalindrome(testCase.input);
    console.log(
      `Solution 1 (Expand Around Center): "${result1}" ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Dynamic Programming)
    const result2 = longestPalindromeDP(testCase.input);
    console.log(
      `Solution 2 (Dynamic Programming): "${result2}" ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Manacher's Algorithm)
    const result3 = longestPalindromeManacher(testCase.input);
    console.log(
      `Solution 3 (Manacher's Algorithm): "${result3}" ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Brute Force)
    const result4 = longestPalindromeBruteForce(testCase.input);
    console.log(
      `Solution 4 (Brute Force): "${result4}" ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = longestPalindromeClass(testCase.input);
    console.log(
      `Solution 5 (Class): "${result5}" ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = longestPalindromeWithGenerator(testCase.input);
    console.log(
      `Solution 6 (Generator): "${result6}" ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = longestPalindromeFunctional(testCase.input);
    console.log(
      `Solution 7 (Functional): "${result7}" ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Two Pointers)
    const result8 = longestPalindromeTwoPointers(testCase.input);
    console.log(
      `Solution 8 (Two Pointers): "${result8}" ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Recursive)
    const result9 = longestPalindromeRecursive(testCase.input);
    console.log(
      `Solution 9 (Recursive): "${result9}" ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Sliding Window)
    const result10 = longestPalindromeSlidingWindow(testCase.input);
    console.log(
      `Solution 10 (Sliding Window): "${result10}" ${
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
    { name: "Expand Around Center", func: longestPalindrome },
    { name: "Dynamic Programming", func: longestPalindromeDP },
    { name: "Manacher's Algorithm", func: longestPalindromeManacher },
    { name: "Brute Force", func: longestPalindromeBruteForce },
    { name: "Class", func: longestPalindromeClass },
    { name: "Generator", func: longestPalindromeWithGenerator },
    { name: "Functional", func: longestPalindromeFunctional },
    { name: "Two Pointers", func: longestPalindromeTwoPointers },
    { name: "Recursive", func: longestPalindromeRecursive },
    { name: "Sliding Window", func: longestPalindromeSlidingWindow },
  ];

  // Create test cases
  const smallCase = "babad";
  const mediumCase = "racecar";
  const largeCase = "a".repeat(100) + "b" + "a".repeat(100);

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

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${
          result.length
        })`
      );
    });

    console.log("");
  });
}

// Palindrome analysis
function palindromeAnalysis() {
  console.log("=== Palindrome Analysis ===\n");

  const testCases = ["babad", "cbbd", "racecar", "aaa", "abcde", "abba"];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(`String: "${testCase}"`);
    const result = longestPalindrome(testCase);
    console.log(`Longest palindrome: "${result}" (length: ${result.length})`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testLongestPalindrome();
// performanceComparison();
// palindromeAnalysis();

export {
  longestPalindrome,
  longestPalindromeDP,
  longestPalindromeManacher,
  longestPalindromeBruteForce,
  longestPalindromeClass,
  longestPalindromeWithGenerator,
  longestPalindromeFunctional,
  longestPalindromeTwoPointers,
  longestPalindromeRecursive,
  longestPalindromeSlidingWindow,
  PalindromeFinder,
  longestPalindromeGenerator,
  testLongestPalindrome,
  performanceComparison,
  palindromeAnalysis,
};
