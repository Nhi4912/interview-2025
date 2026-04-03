/**
 * 14. Longest Common Prefix
 *
 * Problem:
 * Write a function to find the longest common prefix string amongst an array of strings.
 *
 * If there is no common prefix, return an empty string "".
 *
 * Example:
 * Input: strs = ["flower","flow","flight"]
 * Output: "fl"
 *
 * Input: strs = ["dog","racecar","car"]
 * Output: ""
 * Explanation: There is no common prefix among the input strings.
 *
 * LeetCode: https://leetcode.com/problems/longest-common-prefix/
 */

/**
 * Solution 1: Horizontal Scanning (Optimal)
 *
 * Approach:
 * - Compare each string with the first string
 * - Find the common prefix iteratively
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }

  return prefix;
}

/**
 * Solution 2: Vertical Scanning
 *
 * Approach:
 * - Compare characters at the same position across all strings
 * - Stop when characters don't match
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
function longestCommonPrefixVertical(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const firstStr = strs[0];

  for (let i = 0; i < firstStr.length; i++) {
    const char = firstStr[i];

    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== char) {
        return firstStr.substring(0, i);
      }
    }
  }

  return firstStr;
}

/**
 * Solution 3: Divide and Conquer
 *
 * Approach:
 * - Divide the array into two halves
 * - Find common prefix for each half
 * - Combine the results
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(m * log n) where m is the length of the shortest string
 */
function longestCommonPrefixDivideAndConquer(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  return divideAndConquer(strs, 0, strs.length - 1);
}

function divideAndConquer(strs: string[], left: number, right: number): string {
  if (left === right) {
    return strs[left];
  }

  const mid = Math.floor((left + right) / 2);
  const leftPrefix = divideAndConquer(strs, left, mid);
  const rightPrefix = divideAndConquer(strs, mid + 1, right);

  return commonPrefix(leftPrefix, rightPrefix);
}

function commonPrefix(str1: string, str2: string): string {
  const minLength = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return str1.substring(0, i);
    }
  }

  return str1.substring(0, minLength);
}

/**
 * Solution 4: Binary Search
 *
 * Approach:
 * - Use binary search on the length of the common prefix
 * - Check if a given length is valid for all strings
 *
 * Time Complexity: O(S * log m) where S is the sum of all characters and m is the minimum string length
 * Space Complexity: O(1)
 */
function longestCommonPrefixBinarySearch(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const minLength = Math.min(...strs.map((s) => s.length));
  let left = 0;
  let right = minLength;

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);

    if (isCommonPrefix(strs, mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }

  return strs[0].substring(0, left);
}

function isCommonPrefix(strs: string[], length: number): boolean {
  const prefix = strs[0].substring(0, length);

  for (let i = 1; i < strs.length; i++) {
    if (!strs[i].startsWith(prefix)) {
      return false;
    }
  }

  return true;
}

/**
 * Solution 5: Using Array Methods
 *
 * Approach:
 * - Use array methods to find common prefix
 * - More functional programming style
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
function longestCommonPrefixArray(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const firstStr = strs[0];
  const chars = firstStr.split("");

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (!strs.every((str) => str[i] === char)) {
      return firstStr.substring(0, i);
    }
  }

  return firstStr;
}

/**
 * Solution 6: Using Map
 *
 * Approach:
 * - Use Map to track character positions
 * - More explicit character tracking
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(n) where n is the number of strings
 */
function longestCommonPrefixMap(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const charMap = new Map<number, string>();
  const minLength = Math.min(...strs.map((s) => s.length));

  for (let i = 0; i < minLength; i++) {
    const char = strs[0][i];

    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== char) {
        return strs[0].substring(0, i);
      }
    }

    charMap.set(i, char);
  }

  return Array.from(charMap.values()).join("");
}

/**
 * Solution 7: Using Set
 *
 * Approach:
 * - Use Set to check for unique characters at each position
 * - If Set size > 1, characters don't match
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(n) where n is the number of strings
 */
function longestCommonPrefixSet(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const minLength = Math.min(...strs.map((s) => s.length));

  for (let i = 0; i < minLength; i++) {
    const charSet = new Set(strs.map((str) => str[i]));

    if (charSet.size > 1) {
      return strs[0].substring(0, i);
    }
  }

  return strs[0].substring(0, minLength);
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield characters
 * - Memory efficient for large strings
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
function* commonPrefixGenerator(strs: string[]): Generator<string> {
  if (strs.length === 0) return;

  const minLength = Math.min(...strs.map((s) => s.length));

  for (let i = 0; i < minLength; i++) {
    const char = strs[0][i];

    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== char) {
        return;
      }
    }

    yield char;
  }
}

function longestCommonPrefixGenerator(strs: string[]): string {
  return Array.from(commonPrefixGenerator(strs)).join("");
}

/**
 * Solution 9: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a PrefixFinder class
 * - Encapsulate the logic
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
class PrefixFinder {
  private strs: string[];

  constructor(strs: string[]) {
    this.strs = strs;
  }

  findLongestCommonPrefix(): string {
    if (this.strs.length === 0) return "";
    if (this.strs.length === 1) return this.strs[0];

    const firstStr = this.strs[0];

    for (let i = 0; i < firstStr.length; i++) {
      if (!this.isCommonCharAt(i, firstStr[i])) {
        return firstStr.substring(0, i);
      }
    }

    return firstStr;
  }

  private isCommonCharAt(index: number, char: string): boolean {
    return this.strs.every((str) => str[index] === char);
  }

  getStrings(): string[] {
    return [...this.strs];
  }
}

function longestCommonPrefixClass(strs: string[]): string {
  const finder = new PrefixFinder(strs);
  return finder.findLongestCommonPrefix();
}

/**
 * Solution 10: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(S) where S is the sum of all characters in all strings
 * Space Complexity: O(1)
 */
function longestCommonPrefixFunctional(strs: string[]): string {
  if (strs.length === 0) return "";
  if (strs.length === 1) return strs[0];

  const minLength = Math.min(...strs.map((s) => s.length));

  return strs[0]
    .split("")
    .slice(0, minLength)
    .findIndex((char, index) => !strs.every((str) => str[index] === char)) ===
    -1
    ? strs[0].substring(0, minLength)
    : strs[0].substring(
        0,
        strs[0]
          .split("")
          .slice(0, minLength)
          .findIndex((char, index) => !strs.every((str) => str[index] === char))
      );
}

// Test cases
function testLongestCommonPrefix() {
  console.log("=== Testing Longest Common Prefix ===\n");

  const testCases = [
    {
      input: ["flower", "flow", "flight"],
      expected: "fl",
      description: "Common prefix exists",
    },
    {
      input: ["dog", "racecar", "car"],
      expected: "",
      description: "No common prefix",
    },
    {
      input: ["interspecies", "interstellar", "interstate"],
      expected: "inters",
      description: "Long common prefix",
    },
    {
      input: ["throne", "throne"],
      expected: "throne",
      description: "Identical strings",
    },
    {
      input: ["a"],
      expected: "a",
      description: "Single string",
    },
    {
      input: [],
      expected: "",
      description: "Empty array",
    },
    {
      input: ["", "b"],
      expected: "",
      description: "Empty string in array",
    },
    {
      input: ["abc", "abc", "abc"],
      expected: "abc",
      description: "All strings identical",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.map((s) => `"${s}"`).join(", ")}]`);
    console.log(`Expected: "${testCase.expected}"\n`);

    // Test Solution 1 (Horizontal Scanning)
    const result1 = longestCommonPrefix([...testCase.input]);
    console.log(
      `Solution 1 (Horizontal Scanning): "${result1}" ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Vertical Scanning)
    const result2 = longestCommonPrefixVertical([...testCase.input]);
    console.log(
      `Solution 2 (Vertical Scanning): "${result2}" ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Divide and Conquer)
    const result3 = longestCommonPrefixDivideAndConquer([...testCase.input]);
    console.log(
      `Solution 3 (Divide and Conquer): "${result3}" ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Binary Search)
    const result4 = longestCommonPrefixBinarySearch([...testCase.input]);
    console.log(
      `Solution 4 (Binary Search): "${result4}" ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Array Methods)
    const result5 = longestCommonPrefixArray([...testCase.input]);
    console.log(
      `Solution 5 (Array Methods): "${result5}" ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Map)
    const result6 = longestCommonPrefixMap([...testCase.input]);
    console.log(
      `Solution 6 (Map): "${result6}" ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Set)
    const result7 = longestCommonPrefixSet([...testCase.input]);
    console.log(
      `Solution 7 (Set): "${result7}" ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = longestCommonPrefixGenerator([...testCase.input]);
    console.log(
      `Solution 8 (Generator): "${result8}" ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Class)
    const result9 = longestCommonPrefixClass([...testCase.input]);
    console.log(
      `Solution 9 (Class): "${result9}" ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Functional)
    const result10 = longestCommonPrefixFunctional([...testCase.input]);
    console.log(
      `Solution 10 (Functional): "${result10}" ${
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
    { name: "Horizontal Scanning", func: longestCommonPrefix },
    { name: "Vertical Scanning", func: longestCommonPrefixVertical },
    { name: "Divide and Conquer", func: longestCommonPrefixDivideAndConquer },
    { name: "Binary Search", func: longestCommonPrefixBinarySearch },
    { name: "Array Methods", func: longestCommonPrefixArray },
    { name: "Map", func: longestCommonPrefixMap },
    { name: "Set", func: longestCommonPrefixSet },
    { name: "Generator", func: longestCommonPrefixGenerator },
    { name: "Class", func: longestCommonPrefixClass },
    { name: "Functional", func: longestCommonPrefixFunctional },
  ];

  // Create test cases
  const smallCase = ["flower", "flow", "flight"];
  const mediumCase = [
    "interspecies",
    "interstellar",
    "interstate",
    "intercontinental",
  ];
  const largeCase = Array.from(
    { length: 100 },
    (_, i) => `prefix${i.toString().padStart(3, "0")}`
  );

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func([...testCase]);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms ("${result}")`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testLongestCommonPrefix();
// performanceComparison();

export {
  longestCommonPrefix,
  longestCommonPrefixVertical,
  longestCommonPrefixDivideAndConquer,
  longestCommonPrefixBinarySearch,
  longestCommonPrefixArray,
  longestCommonPrefixMap,
  longestCommonPrefixSet,
  longestCommonPrefixGenerator,
  longestCommonPrefixClass,
  longestCommonPrefixFunctional,
  PrefixFinder,
  commonPrefixGenerator,
  divideAndConquer,
  commonPrefix,
  isCommonPrefix,
  testLongestCommonPrefix,
  performanceComparison,
};
