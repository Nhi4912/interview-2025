---
layout: page
title: "Shuffle an Array"
difficulty: Easy
category: Design
tags: [Design, Hash Table]
leetcode_url: "https://leetcode.com/problems/shuffle-an-array/"
---

# Shuffle an Array



## Problem Description

 *  * Given an integer array nums, design an algorithm to randomly shuffle the array.  * All permutations of the array should be equally likely as a result of the shuffling.  *  * Implement the Solution class: 

## Solutions

{% raw %}
/**
 * Shuffle an Array
 *
 * Problem: https://leetcode.com/problems/shuffle-an-array/
 *
 * Given an integer array nums, design an algorithm to randomly shuffle the array.
 * All permutations of the array should be equally likely as a result of the shuffling.
 *
 * Implement the Solution class:
 * - Solution(int[] nums) Initializes the object with the integer array nums.
 * - int[] reset() Resets the array to its original configuration and returns it.
 * - int[] shuffle() Returns a random shuffling of the array.
 *
 * Example:
 * Input: ["Solution", "shuffle", "reset", "shuffle"]
 * [[[1, 2, 3]], [], [], []]
 * Output: [null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]
 *
 * Explanation:
 * Solution solution = new Solution([1, 2, 3]);
 * solution.shuffle();    // Shuffle the array [1,2,3] and return its result. Any permutation of [1,2,3] must be equally likely to be returned. Example: return [3, 1, 2]
 * solution.reset();      // Resets the array back to its original configuration [1,2,3]. Return [1, 2, 3]
 * solution.shuffle();    // Returns the random shuffling of array [1,2,3]. Example: return [1, 3, 2]
 *
 * Constraints:
 * - 1 <= nums.length <= 200
 * - -10^6 <= nums[i] <= 10^6
 * - All the elements of nums are unique.
 * - At most 5 * 10^4 calls will be made to reset and shuffle.
 *
 * Solution Approach:
 * 1. Store original array for reset functionality
 * 2. Use Fisher-Yates shuffle algorithm for unbiased shuffling
 * 3. Work on a copy of the array to avoid modifying original
 * 4. Ensure each permutation has equal probability
 *
 * Time Complexity: O(n) for shuffle, O(1) for reset
 * Space Complexity: O(n) to store original array
 */

/**
 * Solution class for Shuffle an Array
 *
 * Lớp giải pháp cho bài toán Xáo trộn mảng
 */
class Solution {
  private original: number[];
  private current: number[];

  constructor(nums: number[]) {
    this.original = [...nums];
    this.current = [...nums];
  }

  /**
   * Reset the array to its original configuration
   *
   * Đặt lại mảng về cấu hình ban đầu
   *
   * @returns Mảng ban đầu
   */
  reset(): number[] {
    this.current = [...this.original];
    return this.current;
  }

  /**
   * Shuffle the array using Fisher-Yates algorithm
   *
   * Xáo trộn mảng sử dụng thuật toán Fisher-Yates
   *
   * @returns Mảng đã được xáo trộn
   */
  shuffle(): number[] {
    // Reset to original before shuffling
    this.current = [...this.original];

    // Fisher-Yates shuffle algorithm
    for (let i = this.current.length - 1; i > 0; i--) {
      // Generate random index from 0 to i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at positions i and j
      [this.current[i], this.current[j]] = [this.current[j], this.current[i]];
    }

    return this.current;
  }
}

/**
 * Alternative Implementation: Using Array methods
 *
 * Giải pháp thay thế: Sử dụng các phương thức mảng
 */
class SolutionAlternative {
  private original: number[];

  constructor(nums: number[]) {
    this.original = [...nums];
  }

  reset(): number[] {
    return [...this.original];
  }

  shuffle(): number[] {
    // Create a copy and shuffle using sort with random comparison
    return [...this.original].sort(() => Math.random() - 0.5);
  }
}

/**
 * Implementation with Statistics Tracking
 *
 * Giải pháp với theo dõi thống kê
 */
class SolutionWithStats {
  private original: number[];
  private shuffleCount: number = 0;
  private permutationCounts: Map<string, number> = new Map();

  constructor(nums: number[]) {
    this.original = [...nums];
  }

  reset(): number[] {
    return [...this.original];
  }

  shuffle(): number[] {
    this.shuffleCount++;

    const shuffled = [...this.original];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Track permutation statistics
    const permutation = shuffled.join(",");
    this.permutationCounts.set(
      permutation,
      (this.permutationCounts.get(permutation) || 0) + 1
    );

    return shuffled;
  }

  getStats(): {
    shuffleCount: number;
    uniquePermutations: number;
    distribution: Map<string, number>;
  } {
    return {
      shuffleCount: this.shuffleCount,
      uniquePermutations: this.permutationCounts.size,
      distribution: new Map(this.permutationCounts),
    };
  }
}

/**
 * Test Fisher-Yates Algorithm Implementation
 *
 * Kiểm thử thuật toán Fisher-Yates
 */
function testFisherYates() {
  console.log("=== Fisher-Yates Algorithm Test ===");
  console.log("=== Kiểm thử thuật toán Fisher-Yates ===\n");

  const original = [1, 2, 3, 4, 5];
  const iterations = 10000;
  const permutationCounts = new Map<string, number>();

  console.log(`Original array: [${original.join(", ")}]`);
  console.log(`Testing ${iterations} shuffles...`);
  console.log(`Kiểm thử ${iterations} lần xáo trộn...\n`);

  for (let i = 0; i < iterations; i++) {
    const shuffled = [...original];

    // Fisher-Yates shuffle
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }

    const permutation = shuffled.join(",");
    permutationCounts.set(
      permutation,
      (permutationCounts.get(permutation) || 0) + 1
    );
  }

  console.log(`Unique permutations found: ${permutationCounts.size}`);
  console.log(`Expected permutations: ${factorial(original.length)}`);
  console.log(`Số hoán vị duy nhất tìm thấy: ${permutationCounts.size}`);
  console.log(`Số hoán vị mong đợi: ${factorial(original.length)}\n`);

  // Show distribution
  console.log("Permutation distribution (first 10):");
  console.log("Phân bố hoán vị (10 đầu tiên):");
  let count = 0;
  for (const [permutation, frequency] of permutationCounts) {
    if (count >= 10) break;
    const percentage = ((frequency / iterations) * 100).toFixed(2);
    console.log(`  [${permutation}]: ${frequency} times (${percentage}%)`);
    count++;
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Shuffle Array Tests ===");
  console.log("=== Kiểm thử bài toán Xáo trộn mảng ===\n");

  const testCases = [
    {
      name: "Example case",
      input: [1, 2, 3],
      description: "Basic 3-element array",
    },
    {
      name: "Single element",
      input: [5],
      description: "Array with single element",
    },
    {
      name: "Two elements",
      input: [10, 20],
      description: "Array with two elements",
    },
    {
      name: "Large array",
      input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      description: "Array with 10 elements",
    },
    {
      name: "Negative numbers",
      input: [-3, -2, -1, 0, 1, 2, 3],
      description: "Array with negative and positive numbers",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Description: ${testCase.description}`);

    const solution = new Solution(testCase.input);

    // Test reset
    const resetResult = solution.reset();
    console.log(`Reset: [${resetResult.join(", ")}]`);

    // Test shuffle multiple times
    console.log("Shuffle results:");
    console.log("Kết quả xáo trộn:");
    for (let i = 0; i < 5; i++) {
      const shuffleResult = solution.shuffle();
      console.log(`  ${i + 1}. [${shuffleResult.join(", ")}]`);
    }

    // Test reset again
    const resetAgain = solution.reset();
    console.log(`Reset again: [${resetAgain.join(", ")}]`);

    console.log("---");
  }

  // Test with statistics
  console.log("\n=== Testing with Statistics ===");
  console.log("=== Kiểm thử với thống kê ===\n");

  const statsSolution = new SolutionWithStats([1, 2, 3]);

  console.log("Performing 1000 shuffles...");
  console.log("Thực hiện 1000 lần xáo trộn...");

  for (let i = 0; i < 1000; i++) {
    statsSolution.shuffle();
  }

  const stats = statsSolution.getStats();
  console.log(`Total shuffles: ${stats.shuffleCount}`);
  console.log(`Unique permutations: ${stats.uniquePermutations}`);
  console.log(`Expected permutations: ${factorial(3)}`);

  console.log("\nPermutation distribution:");
  console.log("Phân bố hoán vị:");
  for (const [permutation, count] of stats.distribution) {
    const percentage = ((count / stats.shuffleCount) * 100).toFixed(2);
    console.log(`  [${permutation}]: ${count} times (${percentage}%)`);
  }

  // Test Fisher-Yates algorithm
  console.log("\n");
  testFisherYates();
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { Solution, SolutionAlternative, SolutionWithStats, testFisherYates };
{% endraw %}
