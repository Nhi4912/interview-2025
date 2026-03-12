/**
 * 49. Group Anagrams
 *
 * Problem:
 * Given an array of strings strs, group the anagrams together. You can return
 * the answer in any order.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a different
 * word or phrase, typically using all the original letters exactly once.
 *
 * Example:
 * Input: strs = ["eat","tea","tan","ate","nat","bat"]
 * Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
 *
 * Input: strs = [""]
 * Output: [[""]]
 *
 * Input: strs = ["a"]
 * Output: [["a"]]
 *
 * LeetCode: https://leetcode.com/problems/group-anagrams/
 */

/**
 * Solution 1: Sort-based Grouping (Optimal)
 *
 * Approach:
 * - Sort each string to get a canonical form
 * - Use sorted string as key in hash map
 * - Group strings with same sorted form
 *
 * Time Complexity: O(n * k * log k) where n is number of strings, k is max string length
 * Space Complexity: O(n * k)
 */
function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const sorted = str.split("").sort().join("");
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted)!.push(str);
  }

  return Array.from(groups.values());
}

/**
 * Solution 2: Character Count-based Grouping
 *
 * Approach:
 * - Count characters in each string
 * - Use character count array as key
 * - More efficient for long strings
 *
 * Time Complexity: O(n * k) where n is number of strings, k is max string length
 * Space Complexity: O(n * k)
 */
function groupAnagramsCount(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const count = new Array(26).fill(0);

    for (const char of str) {
      count[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    const key = count.join("#");
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(str);
  }

  return Array.from(groups.values());
}

/**
 * Solution 3: Using Object as Hash Map
 *
 * Approach:
 * - Use JavaScript object as hash map
 * - More familiar for JavaScript developers
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsObject(strs: string[]): string[][] {
  const groups: { [key: string]: string[] } = {};

  for (const str of strs) {
    const sorted = str.split("").sort().join("");
    if (!groups[sorted]) {
      groups[sorted] = [];
    }
    groups[sorted].push(str);
  }

  return Object.values(groups);
}

/**
 * Solution 4: Using Array Methods
 *
 * Approach:
 * - Use array methods for grouping
 * - More functional programming style
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsArray(strs: string[]): string[][] {
  return Object.values(
    strs.reduce((groups: { [key: string]: string[] }, str) => {
      const sorted = str.split("").sort().join("");
      groups[sorted] = groups[sorted] || [];
      groups[sorted].push(str);
      return groups;
    }, {})
  );
}

/**
 * Solution 5: Using Set for Uniqueness
 *
 * Approach:
 * - Use Set to track unique anagram groups
 * - More explicit uniqueness handling
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsSet(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  const uniqueKeys = new Set<string>();

  for (const str of strs) {
    const sorted = str.split("").sort().join("");
    uniqueKeys.add(sorted);

    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted)!.push(str);
  }

  return Array.from(uniqueKeys).map((key) => groups.get(key)!);
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an AnagramGrouper class
 * - Encapsulate the grouping logic
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(n * k)
 */
class AnagramGrouper {
  private groups: Map<string, string[]>;

  constructor() {
    this.groups = new Map();
  }

  group(strs: string[]): string[][] {
    this.groups.clear();

    for (const str of strs) {
      this.addToGroup(str);
    }

    return Array.from(this.groups.values());
  }

  private addToGroup(str: string): void {
    const key = this.getKey(str);
    if (!this.groups.has(key)) {
      this.groups.set(key, []);
    }
    this.groups.get(key)!.push(str);
  }

  private getKey(str: string): string {
    return str.split("").sort().join("");
  }

  getGroups(): Map<string, string[]> {
    return new Map(this.groups);
  }
}

function groupAnagramsClass(strs: string[]): string[][] {
  const grouper = new AnagramGrouper();
  return grouper.group(strs);
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield groups
 * - Memory efficient for large datasets
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(k) per group
 */
function* groupAnagramsGenerator(strs: string[]): Generator<string[]> {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const sorted = str.split("").sort().join("");
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    groups.get(sorted)!.push(str);
  }

  for (const group of groups.values()) {
    yield group;
  }
}

function groupAnagramsWithGenerator(strs: string[]): string[][] {
  return Array.from(groupAnagramsGenerator(strs));
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n * k * log k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsFunctional(strs: string[]): string[][] {
  const createKey = (str: string) => str.split("").sort().join("");

  return Object.values(
    strs.reduce((acc, str) => {
      const key = createKey(str);
      return { ...acc, [key]: [...(acc[key] || []), str] };
    }, {} as { [key: string]: string[] })
  );
}

/**
 * Solution 9: Using Bit Manipulation (for small alphabets)
 *
 * Approach:
 * - Use bit manipulation for character counting
 * - Efficient for small character sets
 *
 * Time Complexity: O(n * k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsBitwise(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    let key = 0;
    const charCount = new Array(26).fill(0);

    for (const char of str) {
      charCount[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Create a unique key using bit manipulation
    for (let i = 0; i < 26; i++) {
      key = key * 31 + charCount[i];
    }

    const keyStr = key.toString();
    if (!groups.has(keyStr)) {
      groups.set(keyStr, []);
    }
    groups.get(keyStr)!.push(str);
  }

  return Array.from(groups.values());
}

/**
 * Solution 10: Using Prime Number Multiplication
 *
 * Approach:
 * - Assign prime numbers to each character
 * - Multiply primes to create unique key
 * - Avoid sorting overhead
 *
 * Time Complexity: O(n * k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsPrime(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  // Assign prime numbers to each character
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101,
  ];

  for (const str of strs) {
    let key = 1;

    for (const char of str) {
      const index = char.charCodeAt(0) - "a".charCodeAt(0);
      key *= primes[index];
    }

    const keyStr = key.toString();
    if (!groups.has(keyStr)) {
      groups.set(keyStr, []);
    }
    groups.get(keyStr)!.push(str);
  }

  return Array.from(groups.values());
}

/**
 * Solution 11: Using Frequency Array as Key
 *
 * Approach:
 * - Use frequency array directly as key
 * - Convert array to string for Map key
 *
 * Time Complexity: O(n * k)
 * Space Complexity: O(n * k)
 */
function groupAnagramsFrequency(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const str of strs) {
    const freq = new Array(26).fill(0);

    for (const char of str) {
      freq[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    const key = freq.join(",");
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(str);
  }

  return Array.from(groups.values());
}

// Test cases
function testGroupAnagrams() {
  console.log("=== Testing Group Anagrams ===\n");

  const testCases = [
    {
      input: ["eat", "tea", "tan", "ate", "nat", "bat"],
      expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
      description: "Multiple anagram groups",
    },
    {
      input: [""],
      expected: [[""]],
      description: "Empty string",
    },
    {
      input: ["a"],
      expected: [["a"]],
      description: "Single character",
    },
    {
      input: ["abc", "cba", "bac", "cab", "acb", "bca"],
      expected: [["abc", "cba", "bac", "cab", "acb", "bca"]],
      description: "All anagrams",
    },
    {
      input: ["abc", "def", "ghi"],
      expected: [["abc"], ["def"], ["ghi"]],
      description: "No anagrams",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${JSON.stringify(testCase.input)}`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    // Test Solution 1 (Sort-based)
    const result1 = groupAnagrams([...testCase.input]);
    console.log(
      `Solution 1 (Sort-based): ${JSON.stringify(result1)} ${
        JSON.stringify(result1.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Count-based)
    const result2 = groupAnagramsCount([...testCase.input]);
    console.log(
      `Solution 2 (Count-based): ${JSON.stringify(result2)} ${
        JSON.stringify(result2.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Object)
    const result3 = groupAnagramsObject([...testCase.input]);
    console.log(
      `Solution 3 (Object): ${JSON.stringify(result3)} ${
        JSON.stringify(result3.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Array Methods)
    const result4 = groupAnagramsArray([...testCase.input]);
    console.log(
      `Solution 4 (Array Methods): ${JSON.stringify(result4)} ${
        JSON.stringify(result4.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Set)
    const result5 = groupAnagramsSet([...testCase.input]);
    console.log(
      `Solution 5 (Set): ${JSON.stringify(result5)} ${
        JSON.stringify(result5.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Class)
    const result6 = groupAnagramsClass([...testCase.input]);
    console.log(
      `Solution 6 (Class): ${JSON.stringify(result6)} ${
        JSON.stringify(result6.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = groupAnagramsWithGenerator([...testCase.input]);
    console.log(
      `Solution 7 (Generator): ${JSON.stringify(result7)} ${
        JSON.stringify(result7.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = groupAnagramsFunctional([...testCase.input]);
    console.log(
      `Solution 8 (Functional): ${JSON.stringify(result8)} ${
        JSON.stringify(result8.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Bitwise)
    const result9 = groupAnagramsBitwise([...testCase.input]);
    console.log(
      `Solution 9 (Bitwise): ${JSON.stringify(result9)} ${
        JSON.stringify(result9.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Prime)
    const result10 = groupAnagramsPrime([...testCase.input]);
    console.log(
      `Solution 10 (Prime): ${JSON.stringify(result10)} ${
        JSON.stringify(result10.sort()) ===
        JSON.stringify(testCase.expected.sort())
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Frequency)
    const result11 = groupAnagramsFrequency([...testCase.input]);
    console.log(
      `Solution 11 (Frequency): ${JSON.stringify(result11)} ${
        JSON.stringify(result11.sort()) ===
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
    { name: "Sort-based", func: groupAnagrams },
    { name: "Count-based", func: groupAnagramsCount },
    { name: "Object", func: groupAnagramsObject },
    { name: "Array Methods", func: groupAnagramsArray },
    { name: "Set", func: groupAnagramsSet },
    { name: "Class", func: groupAnagramsClass },
    { name: "Generator", func: groupAnagramsWithGenerator },
    { name: "Functional", func: groupAnagramsFunctional },
    { name: "Bitwise", func: groupAnagramsBitwise },
    { name: "Prime", func: groupAnagramsPrime },
    { name: "Frequency", func: groupAnagramsFrequency },
  ];

  // Create test cases
  const smallCase = ["eat", "tea", "tan", "ate", "nat", "bat"];
  const mediumCase = [
    "abc",
    "cba",
    "bac",
    "cab",
    "acb",
    "bca",
    "def",
    "fed",
    "ghi",
    "ihg",
  ];
  const largeCase = Array.from({ length: 100 }, (_, i) => `word${i % 10}`);

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

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${result.length} groups)`
      );
    });

    console.log("");
  });
}

// Anagram analysis
function anagramAnalysis() {
  console.log("=== Anagram Analysis ===\n");

  const testCases = [
    ["eat", "tea", "tan", "ate", "nat", "bat"],
    ["abc", "cba", "bac", "cab", "acb", "bca"],
    ["", "a", "aa", "aaa"],
    ["listen", "silent", "enlist", "tinsel"],
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(`Input: ${JSON.stringify(testCase)}`);
    const result = groupAnagrams(testCase);
    console.log(`Groups: ${result.length}`);
    console.log(`Result: ${JSON.stringify(result)}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testGroupAnagrams();
// performanceComparison();
// anagramAnalysis();

export {
  groupAnagrams,
  groupAnagramsCount,
  groupAnagramsObject,
  groupAnagramsArray,
  groupAnagramsSet,
  groupAnagramsClass,
  groupAnagramsWithGenerator,
  groupAnagramsFunctional,
  groupAnagramsBitwise,
  groupAnagramsPrime,
  groupAnagramsFrequency,
  AnagramGrouper,
  groupAnagramsGenerator,
  testGroupAnagrams,
  performanceComparison,
  anagramAnalysis,
};
