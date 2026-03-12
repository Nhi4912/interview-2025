---
layout: page
title: "Design Phone Directory"
difficulty: Hard
category: Design
tags: [Design, Hash Table]
leetcode_url: "https://leetcode.com/problems/design-phone-directory/"
---

# Design Phone Directory



## Problem Description

 *  * Design a phone directory that initially contains all numbers from 0 to maxNumbers - 1.  * The directory should support the following operations:  *  * - get: Provide a number that is not assigned to anyone. 

## Solutions

{% raw %}
/**
 * Design Phone Directory
 *
 * Problem: https://leetcode.com/problems/design-phone-directory/
 *
 * Design a phone directory that initially contains all numbers from 0 to maxNumbers - 1.
 * The directory should support the following operations:
 *
 * - get: Provide a number that is not assigned to anyone.
 * - check: Check if a number is available or not.
 * - release: Recycle or release a number.
 *
 * Example:
 * // Initialize phone directory with 3 numbers (0, 1, 2).
 * PhoneDirectory directory = new PhoneDirectory(3);
 *
 * // It can return any available phone number. Here we assume it returns 0.
 * directory.get();      // return 0
 *
 * // Assume it returns 1.
 * directory.get();      // return 1
 *
 * // The number 2 is available, so return true.
 * directory.check(2);   // return true
 *
 * // It returns 2, the only number that is left.
 * directory.get();      // return 2
 *
 * // The number 2 is no longer available, so return false.
 * directory.check(2);   // return false
 *
 * // Release number 2 back to the pool.
 * directory.release(2); // return void
 *
 * // Number 2 is available again, return true.
 * directory.check(2);   // return true
 *
 * Constraints:
 * - 1 <= maxNumbers <= 10^4
 * - 0 <= number < maxNumbers
 * - At most 2 * 10^4 calls will be made to get, check, and release.
 *
 * Solution Approach:
 * 1. Use a Set to track available numbers
 * 2. Use a Set to track used numbers
 * 3. Alternative: Use a Queue for O(1) get operation
 * 4. Alternative: Use a boolean array for memory efficiency
 *
 * Time Complexity: O(1) average for all operations
 * Space Complexity: O(n) where n is maxNumbers
 */

/**
 * PhoneDirectory class using Sets
 *
 * Lớp PhoneDirectory sử dụng Sets
 */
class PhoneDirectory {
  private available: Set<number>;
  private used: Set<number>;
  private maxNumbers: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.available = new Set();
    this.used = new Set();

    // Initialize all numbers as available
    for (let i = 0; i < maxNumbers; i++) {
      this.available.add(i);
    }
  }

  /**
   * Get an available number
   *
   * Lấy một số có sẵn
   *
   * @returns Available number or -1 if none available
   */
  get(): number {
    if (this.available.size === 0) {
      return -1;
    }

    // Get the first available number
    const number = this.available.values().next().value;
    this.available.delete(number);
    this.used.add(number);

    return number;
  }

  /**
   * Check if a number is available
   *
   * Kiểm tra xem một số có sẵn không
   *
   * @param number - Number to check
   * @returns true if available, false otherwise
   */
  check(number: number): boolean {
    if (number < 0 || number >= this.maxNumbers) {
      return false;
    }

    return this.available.has(number);
  }

  /**
   * Release a number back to the pool
   *
   * Trả lại một số về pool
   *
   * @param number - Number to release
   */
  release(number: number): void {
    if (number < 0 || number >= this.maxNumbers) {
      return;
    }

    if (this.used.has(number)) {
      this.used.delete(number);
      this.available.add(number);
    }
  }

  /**
   * Get statistics about the directory
   *
   * Lấy thống kê về thư mục
   *
   * @returns Object containing statistics
   */
  getStats(): {
    totalNumbers: number;
    availableCount: number;
    usedCount: number;
    availableNumbers: number[];
    usedNumbers: number[];
  } {
    return {
      totalNumbers: this.maxNumbers,
      availableCount: this.available.size,
      usedCount: this.used.size,
      availableNumbers: Array.from(this.available).sort((a, b) => a - b),
      usedNumbers: Array.from(this.used).sort((a, b) => a - b),
    };
  }
}

/**
 * Alternative Implementation: Using Queue
 *
 * Giải pháp thay thế: Sử dụng Queue
 */
class PhoneDirectoryQueue {
  private queue: number[];
  private used: Set<number>;
  private maxNumbers: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.queue = [];
    this.used = new Set();

    // Initialize queue with all numbers
    for (let i = 0; i < maxNumbers; i++) {
      this.queue.push(i);
    }
  }

  get(): number {
    if (this.queue.length === 0) {
      return -1;
    }

    const number = this.queue.shift()!;
    this.used.add(number);

    return number;
  }

  check(number: number): boolean {
    if (number < 0 || number >= this.maxNumbers) {
      return false;
    }

    return !this.used.has(number);
  }

  release(number: number): void {
    if (number < 0 || number >= this.maxNumbers) {
      return;
    }

    if (this.used.has(number)) {
      this.used.delete(number);
      this.queue.push(number);
    }
  }

  getStats(): {
    totalNumbers: number;
    availableCount: number;
    usedCount: number;
    availableNumbers: number[];
    usedNumbers: number[];
  } {
    return {
      totalNumbers: this.maxNumbers,
      availableCount: this.queue.length,
      usedCount: this.used.size,
      availableNumbers: [...this.queue].sort((a, b) => a - b),
      usedNumbers: Array.from(this.used).sort((a, b) => a - b),
    };
  }
}

/**
 * Implementation with Boolean Array
 *
 * Giải pháp với mảng Boolean
 */
class PhoneDirectoryBoolean {
  private available: boolean[];
  private maxNumbers: number;
  private availableCount: number;

  constructor(maxNumbers: number) {
    this.maxNumbers = maxNumbers;
    this.available = new Array(maxNumbers).fill(true);
    this.availableCount = maxNumbers;
  }

  get(): number {
    if (this.availableCount === 0) {
      return -1;
    }

    // Find first available number
    for (let i = 0; i < this.maxNumbers; i++) {
      if (this.available[i]) {
        this.available[i] = false;
        this.availableCount--;
        return i;
      }
    }

    return -1;
  }

  check(number: number): boolean {
    if (number < 0 || number >= this.maxNumbers) {
      return false;
    }

    return this.available[number];
  }

  release(number: number): void {
    if (number < 0 || number >= this.maxNumbers) {
      return;
    }

    if (!this.available[number]) {
      this.available[number] = true;
      this.availableCount++;
    }
  }

  getStats(): {
    totalNumbers: number;
    availableCount: number;
    usedCount: number;
    availableNumbers: number[];
    usedNumbers: number[];
  } {
    const availableNumbers: number[] = [];
    const usedNumbers: number[] = [];

    for (let i = 0; i < this.maxNumbers; i++) {
      if (this.available[i]) {
        availableNumbers.push(i);
      } else {
        usedNumbers.push(i);
      }
    }

    return {
      totalNumbers: this.maxNumbers,
      availableCount: this.availableCount,
      usedCount: this.maxNumbers - this.availableCount,
      availableNumbers,
      usedNumbers,
    };
  }
}

/**
 * Implementation with Statistics Tracking
 *
 * Giải pháp với theo dõi thống kê
 */
class PhoneDirectoryWithStats extends PhoneDirectory {
  private getCount: number;
  private checkCount: number;
  private releaseCount: number;
  private totalGets: number;

  constructor(maxNumbers: number) {
    super(maxNumbers);
    this.getCount = 0;
    this.checkCount = 0;
    this.releaseCount = 0;
    this.totalGets = 0;
  }

  get(): number {
    this.getCount++;
    const result = super.get();
    if (result !== -1) {
      this.totalGets++;
    }
    return result;
  }

  check(number: number): boolean {
    this.checkCount++;
    return super.check(number);
  }

  release(number: number): void {
    this.releaseCount++;
    super.release(number);
  }

  /**
   * Get operation statistics
   *
   * Lấy thống kê thao tác
   *
   * @returns Object containing operation statistics
   */
  getOperationStats(): {
    getCount: number;
    checkCount: number;
    releaseCount: number;
    totalGets: number;
    successRate: number;
  } {
    return {
      getCount: this.getCount,
      checkCount: this.checkCount,
      releaseCount: this.releaseCount,
      totalGets: this.totalGets,
      successRate:
        this.getCount > 0 ? (this.totalGets / this.getCount) * 100 : 0,
    };
  }

  /**
   * Get detailed statistics
   *
   * Lấy thống kê chi tiết
   *
   * @returns Object containing detailed statistics
   */
  getDetailedStats(): {
    directory: {
      totalNumbers: number;
      availableCount: number;
      usedCount: number;
      availableNumbers: number[];
      usedNumbers: number[];
    };
    operations: {
      getCount: number;
      checkCount: number;
      releaseCount: number;
      totalGets: number;
      successRate: number;
    };
  } {
    return {
      directory: this.getStats(),
      operations: this.getOperationStats(),
    };
  }
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Design Phone Directory Tests ===");
  console.log("=== Kiểm thử bài toán Thiết kế Phone Directory ===\n");

  const testCases = [
    {
      name: "Example case",
      maxNumbers: 3,
      operations: [
        { type: "get", expected: 0 },
        { type: "get", expected: 1 },
        { type: "check", number: 2, expected: true },
        { type: "get", expected: 2 },
        { type: "check", number: 2, expected: false },
        { type: "release", number: 2 },
        { type: "check", number: 2, expected: true },
      ],
      description: "Standard phone directory operations",
    },
    {
      name: "Empty directory",
      maxNumbers: 1,
      operations: [
        { type: "get", expected: 0 },
        { type: "get", expected: -1 },
        { type: "check", number: 0, expected: false },
        { type: "release", number: 0 },
        { type: "check", number: 0, expected: true },
      ],
      description: "Testing with single number directory",
    },
    {
      name: "Invalid operations",
      maxNumbers: 2,
      operations: [
        { type: "check", number: -1, expected: false },
        { type: "check", number: 2, expected: false },
        { type: "release", number: -1 },
        { type: "release", number: 2 },
        { type: "get", expected: 0 },
        { type: "get", expected: 1 },
      ],
      description: "Testing invalid number operations",
    },
    {
      name: "Multiple releases",
      maxNumbers: 3,
      operations: [
        { type: "get", expected: 0 },
        { type: "get", expected: 1 },
        { type: "release", number: 0 },
        { type: "release", number: 1 },
        { type: "get", expected: 0 },
        { type: "get", expected: 1 },
        { type: "get", expected: 2 },
      ],
      description: "Testing multiple releases and re-gets",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Max numbers: ${testCase.maxNumbers}`);
    console.log(`Description: ${testCase.description}`);

    const directory = new PhoneDirectoryWithStats(testCase.maxNumbers);
    let testPassed = true;

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      let result: any;

      switch (operation.type) {
        case "get":
          result = directory.get();
          break;
        case "check":
          result = directory.check(operation.number);
          break;
        case "release":
          directory.release(operation.number);
          result = "void";
          break;
      }

      let passed = true;
      if (operation.type !== "release") {
        passed = result === operation.expected;
      }

      console.log(
        `  ${i + 1}. ${operation.type}(${
          operation.number || ""
        }) -> ${result} ${passed ? "✅" : "❌"}`
      );

      if (!passed) {
        testPassed = false;
        console.log(`    Expected: ${operation.expected}, Got: ${result}`);
      }
    }

    console.log(`Test ${testPassed ? "PASSED" : "FAILED"}`);

    // Show directory stats
    const stats = directory.getStats();
    console.log(
      `Directory: ${stats.availableCount}/${stats.totalNumbers} available, ${stats.usedCount} used`
    );

    // Show operation stats
    const opStats = directory.getOperationStats();
    console.log(
      `Operations: ${opStats.getCount} gets, ${opStats.checkCount} checks, ${opStats.releaseCount} releases`
    );

    console.log("---");
  }

  // Test different implementations
  console.log("\n=== Implementation Comparison ===");
  console.log("=== So sánh các giải pháp ===\n");

  const implementations = [
    { name: "Set-based", class: PhoneDirectory },
    { name: "Queue-based", class: PhoneDirectoryQueue },
    { name: "Boolean Array", class: PhoneDirectoryBoolean },
  ];

  for (const impl of implementations) {
    console.log(`Testing ${impl.name} implementation:`);
    const directory = new impl.class(5);

    console.log(`  get() -> ${directory.get()}`);
    console.log(`  get() -> ${directory.get()}`);
    console.log(`  check(2) -> ${directory.check(2)}`);
    console.log(`  release(0)`);
    directory.release(0);
    console.log(`  check(0) -> ${directory.check(0)}`);

    const stats = directory.getStats();
    console.log(
      `  Stats: ${stats.availableCount}/${stats.totalNumbers} available`
    );
    console.log("");
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const testSize = 1000;
  const operations = 5000;

  console.log(
    `Testing with ${testSize} numbers and ${operations} operations...`
  );
  console.log(`Kiểm thử với ${testSize} số và ${operations} thao tác...`);

  // Test Set-based implementation
  const start1 = performance.now();
  const setDir = new PhoneDirectory(testSize);
  for (let i = 0; i < operations; i++) {
    const op = i % 3;
    if (op === 0) {
      setDir.get();
    } else if (op === 1) {
      setDir.check(i % testSize);
    } else {
      setDir.release(i % testSize);
    }
  }
  const time1 = performance.now() - start1;

  // Test Queue-based implementation
  const start2 = performance.now();
  const queueDir = new PhoneDirectoryQueue(testSize);
  for (let i = 0; i < operations; i++) {
    const op = i % 3;
    if (op === 0) {
      queueDir.get();
    } else if (op === 1) {
      queueDir.check(i % testSize);
    } else {
      queueDir.release(i % testSize);
    }
  }
  const time2 = performance.now() - start2;

  // Test Boolean Array implementation
  const start3 = performance.now();
  const boolDir = new PhoneDirectoryBoolean(testSize);
  for (let i = 0; i < operations; i++) {
    const op = i % 3;
    if (op === 0) {
      boolDir.get();
    } else if (op === 1) {
      boolDir.check(i % testSize);
    } else {
      boolDir.release(i % testSize);
    }
  }
  const time3 = performance.now() - start3;

  console.log(`Set-based: ${time1.toFixed(4)}ms`);
  console.log(`Queue-based: ${time2.toFixed(4)}ms`);
  console.log(`Boolean Array: ${time3.toFixed(4)}ms`);

  // Test edge cases
  console.log("\n=== Edge Cases Testing ===");
  console.log("=== Kiểm thử trường hợp đặc biệt ===\n");

  // Test with very large directory
  const largeDir = new PhoneDirectoryWithStats(10000);
  console.log("Large directory (10,000 numbers) test:");

  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    largeDir.get();
  }
  const end = performance.now();

  console.log(`1000 get operations: ${(end - start).toFixed(4)}ms`);

  const detailedStats = largeDir.getDetailedStats();
  console.log(
    `Success rate: ${detailedStats.operations.successRate.toFixed(2)}%`
  );
  console.log(
    `Available: ${detailedStats.directory.availableCount}, Used: ${detailedStats.directory.usedCount}`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  PhoneDirectory,
  PhoneDirectoryQueue,
  PhoneDirectoryBoolean,
  PhoneDirectoryWithStats,
};
{% endraw %}
