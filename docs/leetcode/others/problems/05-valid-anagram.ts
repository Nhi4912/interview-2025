/**
 * Valid Anagram
 *
 * Problem: https://leetcode.com/problems/valid-anagram/
 *
 * Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a different word
 * or phrase, typically using all the original letters exactly once.
 *
 * Example 1:
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 *
 * Example 2:
 * Input: s = "rat", t = "car"
 * Output: false
 *
 * Constraints:
 * - 1 <= s.length, t.length <= 5 * 10^4
 * - s and t consist of lowercase English letters.
 *
 * Follow up: What if the inputs contain Unicode characters? How would you adapt
 * your solution to such a case?
 *
 * Solution Approaches:
 * 1. Sorting approach
 * 2. Hash table/Map approach
 * 3. Array-based counting (for ASCII characters)
 * 4. Unicode-aware solution
 * 5. Bit manipulation (for specific cases)
 *
 * Time Complexity: O(n log n) for sorting, O(n) for hash table
 * Space Complexity: O(n) for hash table, O(1) for array counting
 */

/**
 * Valid Anagram - Sorting Solution
 *
 * Giải pháp sắp xếp cho bài toán Anagram hợp lệ
 *
 * @param s - First string
 * @param t - Second string
 * @returns True if strings are anagrams, false otherwise
 */
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  // Sort both strings and compare
  const sortedS = s.split("").sort().join("");
  const sortedT = t.split("").sort().join("");

  return sortedS === sortedT;
}

/**
 * Alternative Solution: Hash Table Approach
 *
 * Giải pháp thay thế: Phương pháp Hash Table
 *
 * @param s - First string
 * @param t - Second string
 * @returns True if strings are anagrams, false otherwise
 */
function isAnagramHashTable(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Map<string, number>();

  // Count characters in first string
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Decrement counts for second string
  for (const char of t) {
    const count = charCount.get(char);
    if (count === undefined || count === 0) {
      return false;
    }
    charCount.set(char, count - 1);
  }

  return true;
}

/**
 * Solution: Array-based Counting (for ASCII characters)
 *
 * Giải pháp: Đếm dựa trên mảng (cho ký tự ASCII)
 *
 * @param s - First string
 * @param t - Second string
 * @returns True if strings are anagrams, false otherwise
 */
function isAnagramArray(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Array(26).fill(0);

  // Count characters in first string
  for (const char of s) {
    charCount[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Decrement counts for second string
  for (const char of t) {
    const index = char.charCodeAt(0) - "a".charCodeAt(0);
    if (charCount[index] === 0) {
      return false;
    }
    charCount[index]--;
  }

  return true;
}

/**
 * Unicode-aware Solution
 *
 * Giải pháp hỗ trợ Unicode
 *
 * @param s - First string
 * @param t - Second string
 * @returns True if strings are anagrams, false otherwise
 */
function isAnagramUnicode(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Map<string, number>();

  // Count characters in first string
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Decrement counts for second string
  for (const char of t) {
    const count = charCount.get(char);
    if (count === undefined || count === 0) {
      return false;
    }
    charCount.set(char, count - 1);
  }

  return true;
}

/**
 * Solution with Detailed Analysis
 *
 * Giải pháp với phân tích chi tiết
 *
 * @param s - First string
 * @param t - Second string
 * @returns Object with result and analysis
 */
function isAnagramWithAnalysis(
  s: string,
  t: string
): {
  isAnagram: boolean;
  analysis: {
    lengthMatch: boolean;
    charFrequency: Map<string, { s: number; t: number; match: boolean }>;
    mismatchedChars: string[];
  };
} {
  const analysis = {
    lengthMatch: s.length === t.length,
    charFrequency: new Map<string, { s: number; t: number; match: boolean }>(),
    mismatchedChars: [] as string[],
  };

  if (!analysis.lengthMatch) {
    return { isAnagram: false, analysis };
  }

  // Count characters in both strings
  const sCount = new Map<string, number>();
  const tCount = new Map<string, number>();

  for (const char of s) {
    sCount.set(char, (sCount.get(char) || 0) + 1);
  }

  for (const char of t) {
    tCount.set(char, (tCount.get(char) || 0) + 1);
  }

  // Analyze character frequencies
  const allChars = new Set([...sCount.keys(), ...tCount.keys()]);

  for (const char of allChars) {
    const sFreq = sCount.get(char) || 0;
    const tFreq = tCount.get(char) || 0;
    const match = sFreq === tFreq;

    analysis.charFrequency.set(char, { s: sFreq, t: tFreq, match });

    if (!match) {
      analysis.mismatchedChars.push(char);
    }
  }

  const isAnagram = analysis.mismatchedChars.length === 0;

  return { isAnagram, analysis };
}

/**
 * Solution for Finding All Anagrams
 *
 * Giải pháp tìm tất cả các anagram
 *
 * @param s - Target string
 * @param t - String to find anagrams of
 * @returns Array of starting indices of anagrams
 */
function findAllAnagrams(s: string, t: string): number[] {
  if (s.length < t.length) return [];

  const result: number[] = [];
  const tCount = new Array(26).fill(0);
  const windowCount = new Array(26).fill(0);

  // Count characters in target string
  for (const char of t) {
    tCount[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Sliding window approach
  for (let i = 0; i < s.length; i++) {
    // Add current character to window
    windowCount[s.charCodeAt(i) - "a".charCodeAt(0)]++;

    // Remove character that's no longer in window
    if (i >= t.length) {
      windowCount[s.charCodeAt(i - t.length) - "a".charCodeAt(0)]--;
    }

    // Check if current window is an anagram
    if (i >= t.length - 1) {
      let isAnagram = true;
      for (let j = 0; j < 26; j++) {
        if (windowCount[j] !== tCount[j]) {
          isAnagram = false;
          break;
        }
      }
      if (isAnagram) {
        result.push(i - t.length + 1);
      }
    }
  }

  return result;
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareAnagramImplementations(
  testCases: Array<{ s: string; t: string }>
): void {
  console.log(
    "Anagram Implementation Performance Comparison / So sánh hiệu suất triển khai Anagram"
  );
  console.log("=".repeat(80));

  const implementations = [
    { name: "Sorting", func: isAnagram },
    { name: "Hash Table", func: isAnagramHashTable },
    { name: "Array Counting", func: isAnagramArray },
    { name: "Unicode", func: isAnagramUnicode },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const testCase of testCases) {
      impl.func(testCase.s, testCase.t);
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Test cases: ${testCases.length}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Valid Anagram Tests / Kiểm thử Anagram hợp lệ");
  console.log("=".repeat(50));

  const testCases = [
    { s: "anagram", t: "nagaram", expected: true },
    { s: "rat", t: "car", expected: false },
    { s: "", t: "", expected: true },
    { s: "a", t: "a", expected: true },
    { s: "a", t: "b", expected: false },
    { s: "ab", t: "ba", expected: true },
    { s: "abc", t: "cba", expected: true },
    { s: "hello", t: "world", expected: false },
    { s: "listen", t: "silent", expected: true },
    { s: "debit card", t: "bad credit", expected: true },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result1 = isAnagram(testCase.s, testCase.t);
    const result2 = isAnagramHashTable(testCase.s, testCase.t);
    const result3 = isAnagramArray(testCase.s, testCase.t);
    const result4 = isAnagramUnicode(testCase.s, testCase.t);

    const allCorrect =
      result1 === testCase.expected &&
      result2 === testCase.expected &&
      result3 === testCase.expected &&
      result4 === testCase.expected;

    if (allCorrect) {
      console.log(`✅ "${testCase.s}" vs "${testCase.t}" = ${result1}`);
      passed++;
    } else {
      console.log(
        `❌ "${testCase.s}" vs "${testCase.t}": expected ${testCase.expected}, got ${result1}`
      );
      failed++;
    }
  }

  console.log(`\nTest Results / Kết quả kiểm thử:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${testCases.length}`);

  // Test detailed analysis
  console.log("\nDetailed Analysis Example / Ví dụ phân tích chi tiết:");
  const analysis = isAnagramWithAnalysis("anagram", "nagaram");
  console.log(`Input: "anagram" vs "nagaram"`);
  console.log(`Is anagram: ${analysis.isAnagram}`);
  console.log(`Length match: ${analysis.analysis.lengthMatch}`);
  console.log("Character frequencies:");
  analysis.analysis.charFrequency.forEach((freq, char) => {
    console.log(`  '${char}': s=${freq.s}, t=${freq.t}, match=${freq.match}`);
  });

  // Test find all anagrams
  console.log("\nFind All Anagrams Example / Ví dụ tìm tất cả anagram:");
  const allAnagrams = findAllAnagrams("cbaebabacd", "abc");
  console.log(`Input: s="cbaebabacd", t="abc"`);
  console.log(`Anagram positions: [${allAnagrams.join(", ")}]`);

  // Test performance
  console.log("\nPerformance Test / Kiểm thử hiệu suất:");
  const perfTestCases = [
    { s: "anagram", t: "nagaram" },
    { s: "rat", t: "car" },
    { s: "listen", t: "silent" },
    { s: "debit card", t: "bad credit" },
    { s: "hello world", t: "world hello" },
  ];

  compareAnagramImplementations(perfTestCases);
}

// Uncomment to run tests
// runTests();

export {
  isAnagram,
  isAnagramHashTable,
  isAnagramArray,
  isAnagramUnicode,
  isAnagramWithAnalysis,
  findAllAnagrams,
  compareAnagramImplementations,
  runTests,
};
