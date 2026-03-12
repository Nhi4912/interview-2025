/**
 * 242. Valid Anagram
 *
 * Problem:
 * Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a different word
 * or phrase, typically using all the original letters exactly once.
 *
 * Example:
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 *
 * Input: s = "rat", t = "car"
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/valid-anagram/
 */

/**
 * Solution 1: Hash Map (Optimal)
 *
 * Approach:
 * - Use hash map to count frequency of characters in both strings
 * - Compare character frequencies
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - fixed size alphabet
 */
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const frequency = new Map<string, number>();

  // Count characters in s
  for (const char of s) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  // Decrement counts for characters in t
  for (const char of t) {
    const count = frequency.get(char);
    if (!count) return false;
    frequency.set(char, count - 1);
  }

  return true;
}

/**
 * Solution 2: Array (Fixed size)
 *
 * Approach:
 * - Use array of size 26 for lowercase letters
 * - More efficient for ASCII characters
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isAnagramArray(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const frequency = new Array(26).fill(0);

  // Count characters in s
  for (const char of s) {
    frequency[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Decrement counts for characters in t
  for (const char of t) {
    const index = char.charCodeAt(0) - "a".charCodeAt(0);
    frequency[index]--;
    if (frequency[index] < 0) return false;
  }

  return true;
}

/**
 * Solution 3: Sort and Compare
 *
 * Approach:
 * - Sort both strings and compare
 * - Simple but less efficient
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
function isAnagramSort(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const sortedS = s.split("").sort().join("");
  const sortedT = t.split("").sort().join("");

  return sortedS === sortedT;
}

/**
 * Solution 4: Using Object (Hash table)
 *
 * Approach:
 * - Use plain object as hash table
 * - Simple implementation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isAnagramObject(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const frequency: { [key: string]: number } = {};

  // Count characters in s
  for (const char of s) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // Decrement counts for characters in t
  for (const char of t) {
    if (!frequency[char]) return false;
    frequency[char]--;
  }

  return true;
}

/**
 * Solution 5: Using Set (Incorrect but educational)
 *
 * Approach:
 * - This approach is INCORRECT for anagram detection
 * - Shows common mistake of using Set for frequency problems
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isAnagramSet(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const setS = new Set(s);
  const setT = new Set(t);

  return setS.size === setT.size && [...setS].every((char) => setT.has(char));
}

/**
 * Solution 6: Using Reduce (Functional)
 *
 * Approach:
 * - Use functional programming approach
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isAnagramFunctional(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const frequencyS = s
    .split("")
    .reduce((acc: { [key: string]: number }, char: string) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});

  const frequencyT = t
    .split("")
    .reduce((acc: { [key: string]: number }, char: string) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});

  return JSON.stringify(frequencyS) === JSON.stringify(frequencyT);
}

/**
 * Solution 7: Using Counter Class (Object-oriented)
 *
 * Approach:
 * - Create a Counter class to handle frequency counting
 * - More structured approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Counter {
  private counts: Map<string, number> = new Map();

  constructor(items: string) {
    for (const item of items) {
      this.add(item);
    }
  }

  add(item: string): void {
    this.counts.set(item, (this.counts.get(item) || 0) + 1);
  }

  equals(other: Counter): boolean {
    if (this.counts.size !== other.counts.size) return false;

    for (const [key, value] of this.counts) {
      if (other.counts.get(key) !== value) return false;
    }

    return true;
  }
}

function isAnagramCounter(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const counterS = new Counter(s);
  const counterT = new Counter(t);

  return counterS.equals(counterT);
}

/**
 * Solution 8: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield characters
 * - Memory efficient for large strings
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* characterGenerator(str: string): Generator<string> {
  for (const char of str) {
    yield char;
  }
}

function isAnagramGenerator(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const frequency = new Map<string, number>();

  // Count characters in s
  for (const char of characterGenerator(s)) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  // Decrement counts for characters in t
  for (const char of characterGenerator(t)) {
    const count = frequency.get(char);
    if (!count) return false;
    frequency.set(char, count - 1);
  }

  return true;
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
function isAnagramBitwise(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  if (s.length > 32) {
    // Fallback to standard approach for large strings
    return isAnagram(s, t);
  }

  let sBits = 0;
  let tBits = 0;

  for (const char of s) {
    const bit = 1 << (char.charCodeAt(0) - "a".charCodeAt(0));
    sBits |= bit;
  }

  for (const char of t) {
    const bit = 1 << (char.charCodeAt(0) - "a".charCodeAt(0));
    tBits |= bit;
  }

  return sBits === tBits;
}

// Test cases
function testValidAnagram() {
  console.log("=== Testing Valid Anagram ===\n");

  const testCases = [
    {
      s: "anagram",
      t: "nagaram",
      expected: true,
      description: "Valid anagram",
    },
    {
      s: "rat",
      t: "car",
      expected: false,
      description: "Not an anagram",
    },
    {
      s: "",
      t: "",
      expected: true,
      description: "Empty strings",
    },
    {
      s: "a",
      t: "a",
      expected: true,
      description: "Single character",
    },
    {
      s: "ab",
      t: "ba",
      expected: true,
      description: "Two characters",
    },
    {
      s: "abc",
      t: "cba",
      expected: true,
      description: "Three characters",
    },
    {
      s: "hello",
      t: "world",
      expected: false,
      description: "Different lengths",
    },
    {
      s: "silent",
      t: "listen",
      expected: true,
      description: "Common anagram pair",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: s = "${testCase.s}", t = "${testCase.t}"`);
    console.log(`Expected: ${testCase.expected}\n`);

    // Test Solution 1 (Hash Map)
    const result1 = isAnagram(testCase.s, testCase.t);
    console.log(
      `Solution 1 (Hash Map): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const result2 = isAnagramArray(testCase.s, testCase.t);
    console.log(
      `Solution 2 (Array): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Sort)
    const result3 = isAnagramSort(testCase.s, testCase.t);
    console.log(
      `Solution 3 (Sort): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Object)
    const result4 = isAnagramObject(testCase.s, testCase.t);
    console.log(
      `Solution 4 (Object): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Set) - Note: This is incorrect for frequency problems
    const result5 = isAnagramSet(testCase.s, testCase.t);
    console.log(
      `Solution 5 (Set): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      } (Note: Incorrect for frequency)`
    );

    // Test Solution 6 (Functional)
    const result6 = isAnagramFunctional(testCase.s, testCase.t);
    console.log(
      `Solution 6 (Functional): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Counter)
    const result7 = isAnagramCounter(testCase.s, testCase.t);
    console.log(
      `Solution 7 (Counter): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Generator)
    const result8 = isAnagramGenerator(testCase.s, testCase.t);
    console.log(
      `Solution 8 (Generator): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Bitwise)
    const result9 = isAnagramBitwise(testCase.s, testCase.t);
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
    { name: "Hash Map", func: isAnagram },
    { name: "Array", func: isAnagramArray },
    { name: "Sort", func: isAnagramSort },
    { name: "Object", func: isAnagramObject },
    { name: "Set", func: isAnagramSet },
    { name: "Functional", func: isAnagramFunctional },
    { name: "Counter", func: isAnagramCounter },
    { name: "Generator", func: isAnagramGenerator },
    { name: "Bitwise", func: isAnagramBitwise },
  ];

  // Create test strings
  const smallS = "anagram";
  const smallT = "nagaram";
  const largeS = "a".repeat(1000) + "b".repeat(1000);
  const largeT = "b".repeat(1000) + "a".repeat(1000);

  const stringPairs = [
    { name: "Small", s: smallS, t: smallT },
    { name: "Large", s: largeS, t: largeT },
  ];

  stringPairs.forEach(({ name, s, t }) => {
    console.log(`${name} Strings:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(s, t);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Anagram analysis
function anagramAnalysis() {
  console.log("=== Anagram Analysis ===\n");

  const testPairs = [
    { s: "anagram", t: "nagaram" },
    { s: "silent", t: "listen" },
    { s: "hello", t: "world" },
    { s: "abc", t: "cba" },
  ];

  testPairs.forEach(({ s, t }, index) => {
    console.log(`Pair ${index + 1}: "${s}" vs "${t}"`);

    const frequencyS = new Map<string, number>();
    const frequencyT = new Map<string, number>();

    // Count frequencies
    for (const char of s) {
      frequencyS.set(char, (frequencyS.get(char) || 0) + 1);
    }

    for (const char of t) {
      frequencyT.set(char, (frequencyT.get(char) || 0) + 1);
    }

    console.log("Character frequencies:");
    console.log(`  S: ${JSON.stringify(Object.fromEntries(frequencyS))}`);
    console.log(`  T: ${JSON.stringify(Object.fromEntries(frequencyT))}`);

    const isAnagramResult = isAnagram(s, t);
    console.log(`  Is anagram: ${isAnagramResult}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testValidAnagram();
// performanceComparison();
// anagramAnalysis();

export {
  isAnagram,
  isAnagramArray,
  isAnagramSort,
  isAnagramObject,
  isAnagramSet,
  isAnagramFunctional,
  isAnagramCounter,
  isAnagramGenerator,
  isAnagramBitwise,
  Counter,
  characterGenerator,
  testValidAnagram,
  performanceComparison,
  anagramAnalysis,
};
