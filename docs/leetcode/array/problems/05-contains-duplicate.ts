/**
 * Contains Duplicate
 *
 * Problem: https://leetcode.com/problems/contains-duplicate/
 *
 * Given an integer array nums, return true if any value appears at least twice
 * in the array, and return false if every element is distinct.
 *
 * Example 1:
 * Input: nums = [1,2,3,1]
 * Output: true
 *
 * Example 2:
 * Input: nums = [1,2,3,4]
 * Output: false
 *
 * Example 3:
 * Input: nums = [1,1,1,3,3,4,3,2,4,2]
 * Output: true
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^9 <= nums[i] <= 10^9
 *
 * Solution Approaches:
 * 1. Using Set/HashSet
 * 2. Using Map/HashMap
 * 3. Sorting approach
 * 4. Brute force (not recommended for large arrays)
 * 5. Using Array methods
 *
 * Time Complexity: O(n) for Set/Map approach, O(n log n) for sorting
 * Space Complexity: O(n) for Set/Map approach, O(1) for sorting (in-place)
 */

/**
 * Contains Duplicate - Set Solution
 *
 * Giải pháp sử dụng Set cho bài toán Kiểm tra phần tử trùng lặp
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}

/**
 * Alternative Solution: Map Approach
 *
 * Giải pháp thay thế: Sử dụng Map
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicateMap(nums: number[]): boolean {
  const frequencyMap = new Map<number, number>();

  for (const num of nums) {
    const count = frequencyMap.get(num) || 0;
    if (count > 0) {
      return true;
    }
    frequencyMap.set(num, count + 1);
  }

  return false;
}

/**
 * Solution: Sorting Approach
 *
 * Giải pháp: Phương pháp sắp xếp
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicateSorting(nums: number[]): boolean {
  // Create a copy to avoid modifying the original array
  const sortedNums = [...nums].sort((a, b) => a - b);

  for (let i = 1; i < sortedNums.length; i++) {
    if (sortedNums[i] === sortedNums[i - 1]) {
      return true;
    }
  }

  return false;
}

/**
 * Solution: Brute Force Approach (Not recommended for large arrays)
 *
 * Giải pháp: Vét cạn (Không khuyến nghị cho mảng lớn)
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicateBruteForce(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Solution: Using Array methods
 *
 * Giải pháp: Sử dụng các phương thức của Array
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicateArrayMethods(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}

/**
 * Solution with Frequency Count
 *
 * Giải pháp với đếm tần suất xuất hiện
 *
 * @param nums - Array of integers
 * @returns Object with result and frequency map
 */
function containsDuplicateWithFrequency(nums: number[]): {
  hasDuplicates: boolean;
  frequencyMap: Map<number, number>;
  duplicates: number[];
} {
  const frequencyMap = new Map<number, number>();
  const duplicates: number[] = [];

  for (const num of nums) {
    const count = frequencyMap.get(num) || 0;
    frequencyMap.set(num, count + 1);

    if (count === 1) {
      duplicates.push(num);
    }
  }

  return {
    hasDuplicates: duplicates.length > 0,
    frequencyMap,
    duplicates: [...new Set(duplicates)], // Remove duplicates from duplicates array
  };
}

/**
 * Solution with Performance Tracking
 *
 * Giải pháp với theo dõi hiệu suất
 *
 * @param nums - Array of integers
 * @returns Object with result and performance metrics
 */
function containsDuplicateWithPerformance(nums: number[]): {
  result: boolean;
  performance: {
    setTime: number;
    mapTime: number;
    sortingTime: number;
    arrayMethodsTime: number;
  };
} {
  const start1 = performance.now();
  const result1 = containsDuplicate(nums);
  const setTime = performance.now() - start1;

  const start2 = performance.now();
  const result2 = containsDuplicateMap(nums);
  const mapTime = performance.now() - start2;

  const start3 = performance.now();
  const result3 = containsDuplicateSorting(nums);
  const sortingTime = performance.now() - start3;

  const start4 = performance.now();
  const result4 = containsDuplicateArrayMethods(nums);
  const arrayMethodsTime = performance.now() - start4;

  // All results should be the same
  const result = result1;

  return {
    result,
    performance: {
      setTime,
      mapTime,
      sortingTime,
      arrayMethodsTime,
    },
  };
}

/**
 * Solution for Finding All Duplicates
 *
 * Giải pháp tìm tất cả các phần tử trùng lặp
 *
 * @param nums - Array of integers
 * @returns Array of all duplicate elements
 */
function findAllDuplicates(nums: number[]): number[] {
  const frequencyMap = new Map<number, number>();
  const duplicates: number[] = [];

  for (const num of nums) {
    const count = frequencyMap.get(num) || 0;
    frequencyMap.set(num, count + 1);

    if (count === 1) {
      duplicates.push(num);
    }
  }

  return duplicates;
}

/**
 * Solution for Finding First Duplicate
 *
 * Giải pháp tìm phần tử trùng lặp đầu tiên
 *
 * @param nums - Array of integers
 * @returns First duplicate element or -1 if no duplicates
 */
function findFirstDuplicate(nums: number[]): number {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      return num;
    }
    seen.add(num);
  }

  return -1;
}

/**
 * Solution with Memory Optimization (for very large arrays)
 *
 * Giải pháp tối ưu bộ nhớ (cho mảng rất lớn)
 *
 * @param nums - Array of integers
 * @returns True if array contains duplicates, false otherwise
 */
function containsDuplicateMemoryOptimized(nums: number[]): boolean {
  // For very large arrays, we can use a more memory-efficient approach
  // by processing in chunks or using bit manipulation for small integers

  if (nums.length <= 1) return false;

  // If all numbers are small integers (0-1000), we can use a boolean array
  const min = Math.min(...nums);
  const max = Math.max(...nums);

  if (max - min < 10000) {
    const seen = new Array(max - min + 1).fill(false);

    for (const num of nums) {
      const index = num - min;
      if (seen[index]) {
        return true;
      }
      seen[index] = true;
    }
    return false;
  }

  // Fall back to Set for large ranges
  return containsDuplicate(nums);
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function comparePerformance(nums: number[]): void {
  console.log(`Array length: ${nums.length}`);
  console.log("=".repeat(50));

  const start1 = performance.now();
  const result1 = containsDuplicate(nums);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = containsDuplicateMap(nums);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = containsDuplicateSorting(nums);
  const time3 = performance.now() - start3;

  const start4 = performance.now();
  const result4 = containsDuplicateArrayMethods(nums);
  const time4 = performance.now() - start4;

  const start5 = performance.now();
  const result5 = containsDuplicateMemoryOptimized(nums);
  const time5 = performance.now() - start5;

  console.log(`Result: ${result1}`);
  console.log(`Set approach: ${time1.toFixed(4)}ms`);
  console.log(`Map approach: ${time2.toFixed(4)}ms`);
  console.log(`Sorting approach: ${time3.toFixed(4)}ms`);
  console.log(`Array methods: ${time4.toFixed(4)}ms`);
  console.log(`Memory optimized: ${time5.toFixed(4)}ms`);

  // Only run brute force for small arrays
  if (nums.length <= 1000) {
    const start6 = performance.now();
    const result6 = containsDuplicateBruteForce(nums);
    const time6 = performance.now() - start6;
    console.log(`Brute force: ${time6.toFixed(4)}ms`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Contains Duplicate Tests / Kiểm thử phần tử trùng lặp");
  console.log("=".repeat(50));

  const testCases = [
    { input: [1, 2, 3, 1], expected: true },
    { input: [1, 2, 3, 4], expected: false },
    { input: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2], expected: true },
    { input: [1], expected: false },
    { input: [], expected: false },
    { input: [1, 1], expected: true },
    { input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], expected: false },
    { input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1], expected: true },
    { input: [0, 0, 0, 0], expected: true },
    { input: [-1, -1, 0, 1], expected: true },
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result1 = containsDuplicate(testCase.input);
    const result2 = containsDuplicateMap(testCase.input);
    const result3 = containsDuplicateSorting(testCase.input);
    const result4 = containsDuplicateArrayMethods(testCase.input);
    const result5 = containsDuplicateMemoryOptimized(testCase.input);

    const allCorrect =
      result1 === testCase.expected &&
      result2 === testCase.expected &&
      result3 === testCase.expected &&
      result4 === testCase.expected &&
      result5 === testCase.expected;

    if (allCorrect) {
      console.log(`✅ [${testCase.input.join(", ")}] = ${result1}`);
      passed++;
    } else {
      console.log(
        `❌ [${testCase.input.join(", ")}]: expected ${
          testCase.expected
        }, got ${result1}`
      );
      failed++;
    }
  }

  console.log(`\nTest Results / Kết quả kiểm thử:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${testCases.length}`);

  // Test frequency analysis
  console.log("\nFrequency Analysis Example / Ví dụ phân tích tần suất:");
  const frequencyResult = containsDuplicateWithFrequency([
    1, 2, 3, 1, 4, 2, 5, 1,
  ]);
  console.log(`Input: [1, 2, 3, 1, 4, 2, 5, 1]`);
  console.log(`Has duplicates: ${frequencyResult.hasDuplicates}`);
  console.log(`Duplicates: [${frequencyResult.duplicates.join(", ")}]`);
  console.log("Frequency map:");
  frequencyResult.frequencyMap.forEach((count, num) => {
    console.log(`  ${num}: ${count} times`);
  });

  // Test performance
  console.log("\nPerformance Test / Kiểm thử hiệu suất:");
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  const largeArrayWithDuplicates = [...largeArray, 5000]; // Add a duplicate
  comparePerformance(largeArray);
  console.log("\nWith duplicates:");
  comparePerformance(largeArrayWithDuplicates);
}

// Uncomment to run tests
// runTests();

export {
  containsDuplicate,
  containsDuplicateMap,
  containsDuplicateSorting,
  containsDuplicateBruteForce,
  containsDuplicateArrayMethods,
  containsDuplicateWithFrequency,
  containsDuplicateWithPerformance,
  findAllDuplicates,
  findFirstDuplicate,
  containsDuplicateMemoryOptimized,
  comparePerformance,
  runTests,
};
