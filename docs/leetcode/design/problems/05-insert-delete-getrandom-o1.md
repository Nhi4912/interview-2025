---
layout: page
title: "Insert Delete GetRandom O(1)"
difficulty: Hard
category: Design
tags: [Design, Hash Table]
leetcode_url: "https://leetcode.com/problems/insert-delete-getrandom-o1/"
---

# Insert Delete GetRandom O(1)



## Problem Description

 *  * Implement the RandomizedSet class:  * - RandomizedSet() Initializes the RandomizedSet object.  * - bool insert(int val) Inserts an item val into the set if not present. Returns true if the item was not present, false otherwise.  * - bool remove(int val) Removes an item val from the set if present. Returns true if the item was present, false otherwise. 

## Solutions

{% raw %}
/**
 * Insert Delete GetRandom O(1)
 *
 * Problem: https://leetcode.com/problems/insert-delete-getrandom-o1/
 *
 * Implement the RandomizedSet class:
 * - RandomizedSet() Initializes the RandomizedSet object.
 * - bool insert(int val) Inserts an item val into the set if not present. Returns true if the item was not present, false otherwise.
 * - bool remove(int val) Removes an item val from the set if present. Returns true if the item was present, false otherwise.
 * - int getRandom() Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called).
 *
 * Each function must work in average O(1) time complexity.
 *
 * Example 1:
 * Input: ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
 * [[], [1], [2], [2], [], [1], [2], []]
 * Output: [null, true, false, true, 2, true, false, 2]
 *
 * Explanation:
 * RandomizedSet randomizedSet = new RandomizedSet();
 * randomizedSet.insert(1); // Inserts 1 to the set. Returns true as 1 was inserted successfully.
 * randomizedSet.remove(2); // Returns false as 2 does not exist in the set.
 * randomizedSet.insert(2); // Inserts 2 to the set, returns true. Set now contains [1,2].
 * randomizedSet.getRandom(); // getRandom() should return either 1 or 2 randomly.
 * randomizedSet.remove(1); // Removes 1 from the set, returns true. Set now contains [2].
 * randomizedSet.insert(2); // 2 was already in the set, so return false.
 * randomizedSet.getRandom(); // Since 2 is the only number in the set, getRandom() will always return 2.
 *
 * Constraints:
 * - -2^31 <= val <= 2^31 - 1
 * - At most 2 * 10^5 calls will be made to insert, remove, and getRandom.
 * - There will be at least one element in the data structure when getRandom is called.
 *
 * Solution Approach:
 * 1. Use HashMap + ArrayList combination
 * 2. HashMap stores value -> index mapping
 * 3. ArrayList stores values for random access
 * 4. For removal, swap with last element and remove last
 * 5. All operations achieve O(1) average time complexity
 *
 * Time Complexity: O(1) average for all operations
 * Space Complexity: O(n) where n is the number of elements
 */

/**
 * RandomizedSet class with O(1) operations
 *
 * Lớp RandomizedSet với các thao tác O(1)
 */
class RandomizedSet {
  private map: Map<number, number>; // value -> index
  private array: number[]; // values for random access

  constructor() {
    this.map = new Map();
    this.array = [];
  }

  /**
   * Insert a value into the set
   *
   * Chèn một giá trị vào tập hợp
   *
   * @param val - Value to insert
   * @returns true if inserted, false if already exists
   */
  insert(val: number): boolean {
    if (this.map.has(val)) {
      return false;
    }

    this.array.push(val);
    this.map.set(val, this.array.length - 1);
    return true;
  }

  /**
   * Remove a value from the set
   *
   * Xóa một giá trị khỏi tập hợp
   *
   * @param val - Value to remove
   * @returns true if removed, false if not found
   */
  remove(val: number): boolean {
    if (!this.map.has(val)) {
      return false;
    }

    const index = this.map.get(val)!;
    const lastElement = this.array[this.array.length - 1];

    // Swap with last element
    this.array[index] = lastElement;
    this.map.set(lastElement, index);

    // Remove last element
    this.array.pop();
    this.map.delete(val);

    return true;
  }

  /**
   * Get a random element from the set
   *
   * Lấy một phần tử ngẫu nhiên từ tập hợp
   *
   * @returns Random element from the set
   */
  getRandom(): number {
    const randomIndex = Math.floor(Math.random() * this.array.length);
    return this.array[randomIndex];
  }

  /**
   * Get the size of the set
   *
   * Lấy kích thước của tập hợp
   *
   * @returns Number of elements in the set
   */
  size(): number {
    return this.array.length;
  }

  /**
   * Check if a value exists in the set
   *
   * Kiểm tra xem một giá trị có tồn tại trong tập hợp không
   *
   * @param val - Value to check
   * @returns true if exists, false otherwise
   */
  has(val: number): boolean {
    return this.map.has(val);
  }

  /**
   * Get all elements in the set
   *
   * Lấy tất cả phần tử trong tập hợp
   *
   * @returns Array of all elements
   */
  toArray(): number[] {
    return [...this.array];
  }
}

/**
 * Alternative Implementation: Using Set + Array
 *
 * Giải pháp thay thế: Sử dụng Set + Array
 */
class RandomizedSetAlternative {
  private set: Set<number>;
  private array: number[];

  constructor() {
    this.set = new Set();
    this.array = [];
  }

  insert(val: number): boolean {
    if (this.set.has(val)) {
      return false;
    }

    this.set.add(val);
    this.array.push(val);
    return true;
  }

  remove(val: number): boolean {
    if (!this.set.has(val)) {
      return false;
    }

    this.set.delete(val);
    const index = this.array.indexOf(val);

    if (index > -1) {
      this.array.splice(index, 1);
    }

    return true;
  }

  getRandom(): number {
    const randomIndex = Math.floor(Math.random() * this.array.length);
    return this.array[randomIndex];
  }

  size(): number {
    return this.set.size;
  }

  has(val: number): boolean {
    return this.set.has(val);
  }

  toArray(): number[] {
    return [...this.set];
  }
}

/**
 * Implementation with Statistics Tracking
 *
 * Giải pháp với theo dõi thống kê
 */
class RandomizedSetWithStats extends RandomizedSet {
  private insertCount: number = 0;
  private removeCount: number = 0;
  private getRandomCount: number = 0;
  private valueFrequency: Map<number, number> = new Map();

  insert(val: number): boolean {
    const result = super.insert(val);
    this.insertCount++;

    if (result) {
      this.valueFrequency.set(val, (this.valueFrequency.get(val) || 0) + 1);
    }

    return result;
  }

  remove(val: number): boolean {
    const result = super.remove(val);
    this.removeCount++;

    if (result) {
      const freq = this.valueFrequency.get(val) || 0;
      if (freq > 1) {
        this.valueFrequency.set(val, freq - 1);
      } else {
        this.valueFrequency.delete(val);
      }
    }

    return result;
  }

  getRandom(): number {
    this.getRandomCount++;
    return super.getRandom();
  }

  /**
   * Get statistics about operations
   *
   * Lấy thống kê về các thao tác
   *
   * @returns Object containing operation statistics
   */
  getStats(): {
    insertCount: number;
    removeCount: number;
    getRandomCount: number;
    valueFrequency: Map<number, number>;
  } {
    return {
      insertCount: this.insertCount,
      removeCount: this.removeCount,
      getRandomCount: this.getRandomCount,
      valueFrequency: new Map(this.valueFrequency),
    };
  }

  /**
   * Get random distribution analysis
   *
   * Phân tích phân bố ngẫu nhiên
   *
   * @param iterations - Number of getRandom calls to test
   * @returns Object containing distribution analysis
   */
  analyzeRandomDistribution(iterations: number): {
    distribution: Map<number, number>;
    expectedFrequency: number;
    actualFrequencies: number[];
  } {
    const distribution = new Map<number, number>();
    const elements = this.toArray();

    if (elements.length === 0) {
      return { distribution, expectedFrequency: 0, actualFrequencies: [] };
    }

    const expectedFrequency = iterations / elements.length;

    for (let i = 0; i < iterations; i++) {
      const randomValue = this.getRandom();
      distribution.set(randomValue, (distribution.get(randomValue) || 0) + 1);
    }

    const actualFrequencies = elements.map((val) => distribution.get(val) || 0);

    return { distribution, expectedFrequency, actualFrequencies };
  }
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Insert Delete GetRandom O(1) Tests ===");
  console.log("=== Kiểm thử bài toán Chèn Xóa Lấy ngẫu nhiên O(1) ===\n");

  const testCases = [
    {
      name: "Example 1: Standard operations",
      operations: [
        { type: "insert", value: 1, expected: true },
        { type: "remove", value: 2, expected: false },
        { type: "insert", value: 2, expected: true },
        { type: "getRandom", expected: "any" },
        { type: "remove", value: 1, expected: true },
        { type: "insert", value: 2, expected: false },
        { type: "getRandom", expected: 2 },
      ],
      description: "Standard sequence of operations",
    },
    {
      name: "Empty set operations",
      operations: [
        { type: "remove", value: 1, expected: false },
        { type: "insert", value: 1, expected: true },
        { type: "getRandom", expected: 1 },
      ],
      description: "Operations on initially empty set",
    },
    {
      name: "Duplicate insertions",
      operations: [
        { type: "insert", value: 1, expected: true },
        { type: "insert", value: 1, expected: false },
        { type: "insert", value: 2, expected: true },
        { type: "insert", value: 2, expected: false },
      ],
      description: "Testing duplicate insertions",
    },
    {
      name: "Remove non-existent elements",
      operations: [
        { type: "remove", value: 1, expected: false },
        { type: "insert", value: 1, expected: true },
        { type: "remove", value: 2, expected: false },
        { type: "remove", value: 1, expected: true },
        { type: "remove", value: 1, expected: false },
      ],
      description: "Testing removal of non-existent elements",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);

    const randomizedSet = new RandomizedSet();
    let testPassed = true;

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      let result: any;

      switch (operation.type) {
        case "insert":
          result = randomizedSet.insert(operation.value);
          break;
        case "remove":
          result = randomizedSet.remove(operation.value);
          break;
        case "getRandom":
          result = randomizedSet.getRandom();
          break;
      }

      let passed = false;
      if (operation.expected === "any") {
        passed = true; // Any value is acceptable for getRandom
      } else {
        passed = result === operation.expected;
      }

      console.log(
        `  ${i + 1}. ${operation.type}(${operation.value || ""}) -> ${result} ${
          passed ? "✅" : "❌"
        }`
      );

      if (!passed) {
        testPassed = false;
      }
    }

    console.log(`Test ${testPassed ? "PASSED" : "FAILED"}`);
    console.log(`Final set: [${randomizedSet.toArray().join(", ")}]`);
    console.log("---");
  }

  // Test with statistics
  console.log("\n=== Testing with Statistics ===");
  console.log("=== Kiểm thử với thống kê ===\n");

  const statsSet = new RandomizedSetWithStats();

  // Perform some operations
  statsSet.insert(1);
  statsSet.insert(2);
  statsSet.insert(3);
  statsSet.remove(2);
  statsSet.insert(4);
  statsSet.getRandom();
  statsSet.getRandom();
  statsSet.getRandom();

  const stats = statsSet.getStats();
  console.log("Operation Statistics:");
  console.log(`  Insert operations: ${stats.insertCount}`);
  console.log(`  Remove operations: ${stats.removeCount}`);
  console.log(`  GetRandom operations: ${stats.getRandomCount}`);
  console.log(`  Current set: [${statsSet.toArray().join(", ")}]`);

  // Test random distribution
  console.log("\n=== Testing Random Distribution ===");
  console.log("=== Kiểm thử phân bố ngẫu nhiên ===\n");

  const testSet = new RandomizedSetWithStats();
  testSet.insert(1);
  testSet.insert(2);
  testSet.insert(3);
  testSet.insert(4);
  testSet.insert(5);

  const distributionAnalysis = testSet.analyzeRandomDistribution(1000);

  console.log("Random Distribution Analysis (1000 calls):");
  console.log(
    `Expected frequency per element: ${distributionAnalysis.expectedFrequency.toFixed(
      2
    )}`
  );
  console.log("Actual frequencies:");
  testSet.toArray().forEach((val, index) => {
    const actual = distributionAnalysis.actualFrequencies[index];
    const expected = distributionAnalysis.expectedFrequency;
    const deviation = (Math.abs(actual - expected) / expected) * 100;
    console.log(`  ${val}: ${actual} (${deviation.toFixed(1)}% deviation)`);
  });

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const set1 = new RandomizedSet();
  const set2 = new RandomizedSetAlternative();

  const operations = 10000;
  const testValues = Array.from({ length: 1000 }, (_, i) => i);

  console.log(`Testing with ${operations} operations...`);
  console.log(`Kiểm thử với ${operations} thao tác...`);

  // Test RandomizedSet
  const start1 = performance.now();
  for (let i = 0; i < operations; i++) {
    const val = testValues[i % testValues.length];
    const operation = i % 3;

    switch (operation) {
      case 0:
        set1.insert(val);
        break;
      case 1:
        set1.remove(val);
        break;
      case 2:
        set1.getRandom();
        break;
    }
  }
  const time1 = performance.now() - start1;

  // Test RandomizedSetAlternative
  const start2 = performance.now();
  for (let i = 0; i < operations; i++) {
    const val = testValues[i % testValues.length];
    const operation = i % 3;

    switch (operation) {
      case 0:
        set2.insert(val);
        break;
      case 1:
        set2.remove(val);
        break;
      case 2:
        set2.getRandom();
        break;
    }
  }
  const time2 = performance.now() - start2;

  console.log(`HashMap + Array: ${time1.toFixed(4)}ms`);
  console.log(`Set + Array: ${time2.toFixed(4)}ms`);
  console.log(`Speedup: ${(time2 / time1).toFixed(2)}x`);

  // Verify final states match
  const finalState1 = set1.toArray().sort((a, b) => a - b);
  const finalState2 = set2.toArray().sort((a, b) => a - b);
  console.log(
    `Final states match: ${
      JSON.stringify(finalState1) === JSON.stringify(finalState2)
        ? "✅ Yes"
        : "❌ No"
    }`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { RandomizedSet, RandomizedSetAlternative, RandomizedSetWithStats };
{% endraw %}
