---
layout: page
title: "Design Hit Counter"
difficulty: Hard
category: Design
tags: [Design, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/design-hit-counter/"
---

# Design Hit Counter



## Problem Description

 *  * Design a hit counter which counts the number of hits received in the past 5 minutes (i.e., the past 300 seconds).  *  * Your system should accept a timestamp parameter (in seconds granularity), and you may assume that calls are being made to the system in chronological order (i.e., timestamp is monotonically increasing). You may also assume that the earliest timestamp starts at 1.  * 

## Solutions

{% raw %}
/**
 * Design Hit Counter
 *
 * Problem: https://leetcode.com/problems/design-hit-counter/
 *
 * Design a hit counter which counts the number of hits received in the past 5 minutes (i.e., the past 300 seconds).
 *
 * Your system should accept a timestamp parameter (in seconds granularity), and you may assume that calls are being made to the system in chronological order (i.e., timestamp is monotonically increasing). You may also assume that the earliest timestamp starts at 1.
 *
 * Implement the HitCounter class:
 * - HitCounter() Initializes the object of the hit counter system.
 * - void hit(int timestamp) Records a hit that happened at timestamp (in seconds). Several hits may happen at the same timestamp.
 * - int getHits(int timestamp) Returns the number of hits in the past 5 minutes from timestamp (i.e., the past 300 seconds).
 *
 * Example 1:
 * Input: ["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]
 * [[], [1], [2], [3], [4], [300], [300], [301]]
 * Output: [null, null, null, null, 3, null, 4, 3]
 *
 * Explanation:
 * HitCounter hitCounter = new HitCounter();
 * hitCounter.hit(1);       // hit at timestamp 1.
 * hitCounter.hit(2);       // hit at timestamp 2.
 * hitCounter.hit(3);       // hit at timestamp 3.
 * hitCounter.getHits(4);   // get hits at timestamp 4, return 3.
 * hitCounter.hit(300);     // hit at timestamp 300.
 * hitCounter.getHits(300); // get hits at timestamp 300, return 4.
 * hitCounter.getHits(301); // get hits at timestamp 301, return 3.
 *
 * Constraints:
 * - 1 <= timestamp <= 2 * 10^9
 * - All the calls are being made to the system in chronological order (i.e., timestamp is monotonically increasing).
 * - At most 300 calls will be made to hit and getHits.
 *
 * Solution Approach:
 * 1. Use a queue to store timestamps
 * 2. Remove expired timestamps (older than 300 seconds) when getting hits
 * 3. Alternative: Use circular buffer for better performance
 * 4. Alternative: Use sliding window with buckets
 *
 * Time Complexity: O(1) average for hit, O(k) for getHits where k is expired hits
 * Space Complexity: O(n) where n is the number of hits in the window
 */

/**
 * HitCounter class using Queue
 *
 * Lớp HitCounter sử dụng Queue
 */
class HitCounter {
  private queue: number[];

  constructor() {
    this.queue = [];
  }

  /**
   * Record a hit at the given timestamp
   *
   * Ghi lại một hit tại timestamp cho trước
   *
   * @param timestamp - Timestamp in seconds
   */
  hit(timestamp: number): void {
    this.queue.push(timestamp);
  }

  /**
   * Get number of hits in the past 5 minutes
   *
   * Lấy số lượng hits trong 5 phút qua
   *
   * @param timestamp - Current timestamp
   * @returns Number of hits in the past 300 seconds
   */
  getHits(timestamp: number): number {
    // Remove expired timestamps
    while (this.queue.length > 0 && this.queue[0] <= timestamp - 300) {
      this.queue.shift();
    }

    return this.queue.length;
  }

  /**
   * Get all hits in the window
   *
   * Lấy tất cả hits trong cửa sổ
   *
   * @param timestamp - Current timestamp
   * @returns Array of timestamps in the window
   */
  getHitsInWindow(timestamp: number): number[] {
    // Remove expired timestamps
    while (this.queue.length > 0 && this.queue[0] <= timestamp - 300) {
      this.queue.shift();
    }

    return [...this.queue];
  }
}

/**
 * Alternative Implementation: Using Circular Buffer
 *
 * Giải pháp thay thế: Sử dụng Circular Buffer
 */
class HitCounterCircular {
  private timestamps: number[];
  private hits: number[];
  private total: number;
  private lastTimestamp: number;

  constructor() {
    this.timestamps = new Array(300).fill(0);
    this.hits = new Array(300).fill(0);
    this.total = 0;
    this.lastTimestamp = 0;
  }

  hit(timestamp: number): void {
    this.update(timestamp);
    const index = timestamp % 300;

    if (this.timestamps[index] === timestamp) {
      this.hits[index]++;
    } else {
      this.timestamps[index] = timestamp;
      this.hits[index] = 1;
    }

    this.total++;
  }

  getHits(timestamp: number): number {
    this.update(timestamp);
    return this.total;
  }

  private update(timestamp: number): void {
    const diff = timestamp - this.lastTimestamp;

    if (diff >= 300) {
      // All previous hits are expired
      this.timestamps.fill(0);
      this.hits.fill(0);
      this.total = 0;
    } else {
      // Remove expired hits
      for (let i = 0; i < diff; i++) {
        const index = (this.lastTimestamp - i) % 300;
        if (this.timestamps[index] === this.lastTimestamp - i) {
          this.total -= this.hits[index];
          this.hits[index] = 0;
        }
      }
    }

    this.lastTimestamp = timestamp;
  }
}

/**
 * Implementation with Statistics
 *
 * Giải pháp với thống kê
 */
class HitCounterWithStats extends HitCounter {
  private hitCount: number;
  private getHitsCount: number;
  private totalHits: number;

  constructor() {
    super();
    this.hitCount = 0;
    this.getHitsCount = 0;
    this.totalHits = 0;
  }

  hit(timestamp: number): void {
    super.hit(timestamp);
    this.hitCount++;
    this.totalHits++;
  }

  getHits(timestamp: number): number {
    this.getHitsCount++;
    return super.getHits(timestamp);
  }

  /**
   * Get statistics about the hit counter
   *
   * Lấy thống kê về hit counter
   *
   * @returns Object containing statistics
   */
  getStats(): {
    totalHits: number;
    hitCalls: number;
    getHitsCalls: number;
    currentWindowSize: number;
  } {
    return {
      totalHits: this.totalHits,
      hitCalls: this.hitCount,
      getHitsCalls: this.getHitsCount,
      currentWindowSize: this.getHitsInWindow(Date.now() / 1000).length,
    };
  }

  /**
   * Get hit distribution in the current window
   *
   * Lấy phân bố hits trong cửa sổ hiện tại
   *
   * @param timestamp - Current timestamp
   * @returns Map of timestamp -> hit count
   */
  getHitDistribution(timestamp: number): Map<number, number> {
    const hits = this.getHitsInWindow(timestamp);
    const distribution = new Map<number, number>();

    for (const hit of hits) {
      distribution.set(hit, (distribution.get(hit) || 0) + 1);
    }

    return distribution;
  }
}

/**
 * Implementation with Sliding Window
 *
 * Giải pháp với cửa sổ trượt
 */
class HitCounterSlidingWindow {
  private window: number;
  private hits: Map<number, number>;

  constructor(windowSize: number = 300) {
    this.window = windowSize;
    this.hits = new Map();
  }

  hit(timestamp: number): void {
    this.hits.set(timestamp, (this.hits.get(timestamp) || 0) + 1);
  }

  getHits(timestamp: number): number {
    let count = 0;
    const startTime = timestamp - this.window + 1;

    // Remove expired entries and count hits
    for (const [time, hitCount] of this.hits.entries()) {
      if (time < startTime) {
        this.hits.delete(time);
      } else {
        count += hitCount;
      }
    }

    return count;
  }

  /**
   * Get hits in a specific time range
   *
   * Lấy hits trong một khoảng thời gian cụ thể
   *
   * @param start - Start timestamp
   * @param end - End timestamp
   * @returns Number of hits in the range
   */
  getHitsInRange(start: number, end: number): number {
    let count = 0;

    for (const [time, hitCount] of this.hits.entries()) {
      if (time >= start && time <= end) {
        count += hitCount;
      }
    }

    return count;
  }
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Design Hit Counter Tests ===");
  console.log("=== Kiểm thử bài toán Thiết kế Hit Counter ===\n");

  const testCases = [
    {
      name: "Example 1: Standard case",
      operations: [
        { type: "hit", timestamp: 1 },
        { type: "hit", timestamp: 2 },
        { type: "hit", timestamp: 3 },
        { type: "getHits", timestamp: 4, expected: 3 },
        { type: "hit", timestamp: 300 },
        { type: "getHits", timestamp: 300, expected: 4 },
        { type: "getHits", timestamp: 301, expected: 3 },
      ],
      description: "Standard hit counter operations",
    },
    {
      name: "Empty window",
      operations: [
        { type: "getHits", timestamp: 100, expected: 0 },
        { type: "hit", timestamp: 100 },
        { type: "getHits", timestamp: 100, expected: 1 },
        { type: "getHits", timestamp: 400, expected: 0 },
      ],
      description: "Testing empty window and expiration",
    },
    {
      name: "Multiple hits at same timestamp",
      operations: [
        { type: "hit", timestamp: 1 },
        { type: "hit", timestamp: 1 },
        { type: "hit", timestamp: 1 },
        { type: "getHits", timestamp: 1, expected: 3 },
        { type: "getHits", timestamp: 301, expected: 0 },
      ],
      description: "Multiple hits at the same timestamp",
    },
    {
      name: "Large timestamps",
      operations: [
        { type: "hit", timestamp: 1000000 },
        { type: "hit", timestamp: 1000001 },
        { type: "getHits", timestamp: 1000300, expected: 0 },
        { type: "getHits", timestamp: 1000002, expected: 2 },
      ],
      description: "Testing with large timestamp values",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Description: ${testCase.description}`);

    const hitCounter = new HitCounterWithStats();
    let testPassed = true;

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      let result: any;

      switch (operation.type) {
        case "hit":
          hitCounter.hit(operation.timestamp);
          console.log(`  ${i + 1}. hit(${operation.timestamp})`);
          break;
        case "getHits":
          result = hitCounter.getHits(operation.timestamp);
          const passed = result === operation.expected;
          console.log(
            `  ${i + 1}. getHits(${operation.timestamp}) -> ${result} ${
              passed ? "✅" : "❌"
            }`
          );

          if (!passed) {
            testPassed = false;
            console.log(`    Expected: ${operation.expected}, Got: ${result}`);
          }
          break;
      }
    }

    console.log(`Test ${testPassed ? "PASSED" : "FAILED"}`);

    // Show statistics
    const stats = hitCounter.getStats();
    console.log(
      `Stats: Total hits: ${stats.totalHits}, Hit calls: ${stats.hitCalls}, GetHits calls: ${stats.getHitsCalls}`
    );

    console.log("---");
  }

  // Test different implementations
  console.log("\n=== Implementation Comparison ===");
  console.log("=== So sánh các giải pháp ===\n");

  const testOperations = [
    { type: "hit", timestamp: 1 },
    { type: "hit", timestamp: 2 },
    { type: "hit", timestamp: 3 },
    { type: "getHits", timestamp: 4 },
    { type: "hit", timestamp: 300 },
    { type: "getHits", timestamp: 300 },
    { type: "getHits", timestamp: 301 },
  ];

  const implementations = [
    { name: "Queue", class: HitCounter },
    { name: "Circular Buffer", class: HitCounterCircular },
    { name: "Sliding Window", class: HitCounterSlidingWindow },
  ];

  for (const impl of implementations) {
    console.log(`Testing ${impl.name} implementation:`);
    const counter = new impl.class();

    for (const operation of testOperations) {
      if (operation.type === "hit") {
        counter.hit(operation.timestamp);
      } else {
        const result = counter.getHits(operation.timestamp);
        console.log(`  getHits(${operation.timestamp}) -> ${result}`);
      }
    }
    console.log("");
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  const largeTestSize = 10000;

  console.log(`Testing with ${largeTestSize} operations...`);
  console.log(`Kiểm thử với ${largeTestSize} thao tác...`);

  // Test Queue implementation
  const start1 = performance.now();
  const queueCounter = new HitCounter();
  for (let i = 0; i < largeTestSize; i++) {
    if (i % 3 === 0) {
      queueCounter.getHits(i);
    } else {
      queueCounter.hit(i);
    }
  }
  const time1 = performance.now() - start1;

  // Test Circular Buffer implementation
  const start2 = performance.now();
  const circularCounter = new HitCounterCircular();
  for (let i = 0; i < largeTestSize; i++) {
    if (i % 3 === 0) {
      circularCounter.getHits(i);
    } else {
      circularCounter.hit(i);
    }
  }
  const time2 = performance.now() - start2;

  // Test Sliding Window implementation
  const start3 = performance.now();
  const slidingCounter = new HitCounterSlidingWindow();
  for (let i = 0; i < largeTestSize; i++) {
    if (i % 3 === 0) {
      slidingCounter.getHits(i);
    } else {
      slidingCounter.hit(i);
    }
  }
  const time3 = performance.now() - start3;

  console.log(`Queue: ${time1.toFixed(4)}ms`);
  console.log(`Circular Buffer: ${time2.toFixed(4)}ms`);
  console.log(`Sliding Window: ${time3.toFixed(4)}ms`);

  // Test hit distribution
  console.log("\n=== Hit Distribution Analysis ===");
  console.log("=== Phân tích phân bố hits ===\n");

  const statsCounter = new HitCounterWithStats();

  // Simulate some hits
  for (let i = 1; i <= 10; i++) {
    statsCounter.hit(i);
    if (i % 3 === 0) {
      statsCounter.hit(i); // Double hits at multiples of 3
    }
  }

  const distribution = statsCounter.getHitDistribution(10);
  console.log("Hit distribution in window [1-10]:");
  for (const [timestamp, count] of distribution.entries()) {
    console.log(`  Timestamp ${timestamp}: ${count} hits`);
  }

  const stats = statsCounter.getStats();
  console.log(
    `\nOverall stats: ${stats.totalHits} total hits, ${stats.hitCalls} hit calls, ${stats.getHitsCalls} getHits calls`
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  HitCounter,
  HitCounterCircular,
  HitCounterWithStats,
  HitCounterSlidingWindow,
};
{% endraw %}
