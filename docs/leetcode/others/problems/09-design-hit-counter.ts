/**
 * Design Hit Counter
 *
 * Problem: https://leetcode.com/problems/design-hit-counter/
 *
 * Design a hit counter which counts the number of hits received in the past 5 minutes
 * (i.e., the past 300 seconds).
 *
 * Your system should accept a timestamp parameter (in seconds granularity), and you
 * may assume that calls are being made to the system in chronological order (i.e.,
 * timestamp is monotonically increasing). You may also assume that the earliest
 * timestamp starts at 1.
 *
 * Implement the HitCounter class:
 * - HitCounter() Initializes the object of the hit counter system.
 * - void hit(int timestamp) Records a hit that happened at timestamp (in seconds).
 *   Several hits may happen at the same timestamp.
 * - int getHits(int timestamp) Returns the number of hits in the past 5 minutes
 *   from timestamp (i.e., the past 300 seconds).
 *
 * Example 1:
 * Input:
 * ["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]
 * [[], [1], [2], [3], [4], [300], [300], [301]]
 * Output: [null, null, null, null, 3, null, 4, 3]
 *
 * Explanation:
 * HitCounter hitCounter = new HitCounter();
 * hitCounter.hit(1);       // hit at timestamp 1.
 * hitCounter.hit(2);       // hit at timestamp 2.
 * hitCounter.hit(3);       // hit at timestamp 3.
 * hitCounter.getHits(4);   // get hits at timestamp 4, return 3.
 * hitCounter.getHits(300); // get hits at timestamp 300, return 4.
 * hitCounter.getHits(301); // get hits at timestamp 301, return 3.
 *
 * Constraints:
 * - 1 <= timestamp <= 2 * 10^9
 * - All the calls are being made to the system in chronological order (i.e., timestamp is monotonically increasing).
 * - At most 300 calls will be made to hit and getHits.
 *
 * Follow up: What if the number of hits per second could be very large? Does your design scale?
 *
 * Solution Approaches:
 * 1. Array-based approach with sliding window
 * 2. Queue-based approach
 * 3. HashMap-based approach for sparse data
 * 4. With statistics and monitoring
 * 5. Scalable approach for high-frequency hits
 *
 * Time Complexity: O(1) for hit, O(300) for getHits in worst case
 * Space Complexity: O(300) for the sliding window
 */

/**
 * HitCounter - Array-based Implementation
 *
 * HitCounter - Triển khai dựa trên Array
 *
 * This approach uses an array to store hits for each second in the sliding window
 */
class HitCounter {
  private hits: number[];
  private times: number[];
  private windowSize: number;

  constructor() {
    this.hits = new Array(300).fill(0);
    this.times = new Array(300).fill(0);
    this.windowSize = 300;
  }

  /**
   * Record a hit at the given timestamp
   * Ghi lại một hit tại timestamp đã cho
   */
  hit(timestamp: number): void {
    const index = timestamp % this.windowSize;

    if (this.times[index] !== timestamp) {
      this.hits[index] = 1;
      this.times[index] = timestamp;
    } else {
      this.hits[index]++;
    }
  }

  /**
   * Get the number of hits in the past 5 minutes
   * Lấy số lượng hits trong 5 phút qua
   */
  getHits(timestamp: number): number {
    let totalHits = 0;

    for (let i = 0; i < this.windowSize; i++) {
      if (timestamp - this.times[i] < this.windowSize) {
        totalHits += this.hits[i];
      }
    }

    return totalHits;
  }

  /**
   * Get current statistics
   * Lấy thống kê hiện tại
   */
  getStats(timestamp: number): {
    totalHits: number;
    activeSeconds: number;
    averageHitsPerSecond: number;
  } {
    let totalHits = 0;
    let activeSeconds = 0;

    for (let i = 0; i < this.windowSize; i++) {
      if (timestamp - this.times[i] < this.windowSize) {
        totalHits += this.hits[i];
        if (this.hits[i] > 0) {
          activeSeconds++;
        }
      }
    }

    const averageHitsPerSecond =
      activeSeconds > 0 ? totalHits / activeSeconds : 0;

    return {
      totalHits,
      activeSeconds,
      averageHitsPerSecond,
    };
  }
}

/**
 * Alternative Implementation: Queue-based Approach
 *
 * Triển khai thay thế: Phương pháp dựa trên Queue
 */
class HitCounterQueue {
  private queue: number[];
  private windowSize: number;

  constructor() {
    this.queue = [];
    this.windowSize = 300;
  }

  hit(timestamp: number): void {
    this.queue.push(timestamp);
  }

  getHits(timestamp: number): number {
    // Remove timestamps outside the window
    while (
      this.queue.length > 0 &&
      timestamp - this.queue[0] >= this.windowSize
    ) {
      this.queue.shift();
    }

    return this.queue.length;
  }

  /**
   * Get hits for a specific time range
   * Lấy hits cho một khoảng thời gian cụ thể
   */
  getHitsInRange(startTime: number, endTime: number): number {
    return this.queue.filter(
      (timestamp) => timestamp >= startTime && timestamp <= endTime
    ).length;
  }

  /**
   * Get peak hits in the window
   * Lấy số hits cao nhất trong cửa sổ
   */
  getPeakHits(timestamp: number): number {
    const windowStart = timestamp - this.windowSize + 1;
    const hitsInWindow = this.queue.filter(
      (t) => t >= windowStart && t <= timestamp
    );

    if (hitsInWindow.length === 0) return 0;

    // Count hits per second and find the maximum
    const hitsPerSecond = new Map<number, number>();
    for (const hit of hitsInWindow) {
      hitsPerSecond.set(hit, (hitsPerSecond.get(hit) || 0) + 1);
    }

    return Math.max(...hitsPerSecond.values());
  }
}

/**
 * Implementation with HashMap for Sparse Data
 *
 * Triển khai với HashMap cho dữ liệu thưa
 */
class HitCounterHashMap {
  private hits: Map<number, number>;
  private windowSize: number;

  constructor() {
    this.hits = new Map();
    this.windowSize = 300;
  }

  hit(timestamp: number): void {
    this.hits.set(timestamp, (this.hits.get(timestamp) || 0) + 1);
  }

  getHits(timestamp: number): number {
    let totalHits = 0;
    const windowStart = timestamp - this.windowSize + 1;

    // Clean up old entries and count hits
    for (const [time, count] of this.hits.entries()) {
      if (time >= windowStart && time <= timestamp) {
        totalHits += count;
      } else if (time < windowStart) {
        this.hits.delete(time);
      }
    }

    return totalHits;
  }

  /**
   * Get detailed hit distribution
   * Lấy phân bố hits chi tiết
   */
  getHitDistribution(timestamp: number): Map<number, number> {
    const distribution = new Map<number, number>();
    const windowStart = timestamp - this.windowSize + 1;

    for (const [time, count] of this.hits.entries()) {
      if (time >= windowStart && time <= timestamp) {
        distribution.set(time, count);
      }
    }

    return distribution;
  }
}

/**
 * Implementation with Statistics and Monitoring
 *
 * Triển khai với thống kê và giám sát
 */
class HitCounterWithStats extends HitCounter {
  private totalHitsRecorded: number;
  private getHitsCalls: number;
  private operationHistory: Array<{
    operation: string;
    timestamp: number;
    result?: number;
  }>;

  constructor() {
    super();
    this.totalHitsRecorded = 0;
    this.getHitsCalls = 0;
    this.operationHistory = [];
  }

  hit(timestamp: number): void {
    super.hit(timestamp);
    this.totalHitsRecorded++;

    this.operationHistory.push({
      operation: "hit",
      timestamp,
    });
  }

  getHits(timestamp: number): number {
    const result = super.getHits(timestamp);
    this.getHitsCalls++;

    this.operationHistory.push({
      operation: "getHits",
      timestamp,
      result,
    });

    return result;
  }

  /**
   * Get performance statistics
   * Lấy thống kê hiệu suất
   */
  getPerformanceStats(): {
    totalHitsRecorded: number;
    getHitsCalls: number;
    averageHitsPerCall: number;
    recentActivity: Array<{
      operation: string;
      timestamp: number;
      result?: number;
    }>;
  } {
    const averageHitsPerCall =
      this.getHitsCalls > 0 ? this.totalHitsRecorded / this.getHitsCalls : 0;

    return {
      totalHitsRecorded: this.totalHitsRecorded,
      getHitsCalls: this.getHitsCalls,
      averageHitsPerCall,
      recentActivity: this.operationHistory.slice(-10), // Last 10 operations
    };
  }

  /**
   * Get hit rate over time
   * Lấy tỷ lệ hits theo thời gian
   */
  getHitRate(timestamp: number, windowSize: number = 60): number {
    const windowStart = timestamp - windowSize + 1;
    let hitsInWindow = 0;

    for (let i = 0; i < 300; i++) {
      if (
        timestamp - this.times[i] < windowSize &&
        this.times[i] >= windowStart
      ) {
        hitsInWindow += this.hits[i];
      }
    }

    return hitsInWindow / windowSize; // hits per second
  }
}

/**
 * Scalable Implementation for High-Frequency Hits
 *
 * Triển khai có thể mở rộng cho hits tần số cao
 */
class ScalableHitCounter {
  private buckets: Map<number, number>;
  private bucketSize: number;
  private windowSize: number;

  constructor(bucketSize: number = 1) {
    this.buckets = new Map();
    this.bucketSize = bucketSize; // Size of each bucket in seconds
    this.windowSize = 300;
  }

  hit(timestamp: number): void {
    const bucket = Math.floor(timestamp / this.bucketSize);
    this.buckets.set(bucket, (this.buckets.get(bucket) || 0) + 1);
  }

  getHits(timestamp: number): number {
    let totalHits = 0;
    const currentBucket = Math.floor(timestamp / this.bucketSize);
    const startBucket = Math.floor(
      (timestamp - this.windowSize + 1) / this.bucketSize
    );

    // Clean up old buckets and count hits
    for (const [bucket, count] of this.buckets.entries()) {
      if (bucket >= startBucket && bucket <= currentBucket) {
        totalHits += count;
      } else if (bucket < startBucket) {
        this.buckets.delete(bucket);
      }
    }

    return totalHits;
  }

  /**
   * Get bucket statistics
   * Lấy thống kê bucket
   */
  getBucketStats(timestamp: number): {
    totalBuckets: number;
    activeBuckets: number;
    averageHitsPerBucket: number;
    maxHitsInBucket: number;
  } {
    const currentBucket = Math.floor(timestamp / this.bucketSize);
    const startBucket = Math.floor(
      (timestamp - this.windowSize + 1) / this.bucketSize
    );

    let totalHits = 0;
    let activeBuckets = 0;
    let maxHits = 0;

    for (const [bucket, count] of this.buckets.entries()) {
      if (bucket >= startBucket && bucket <= currentBucket) {
        totalHits += count;
        activeBuckets++;
        maxHits = Math.max(maxHits, count);
      }
    }

    return {
      totalBuckets: this.buckets.size,
      activeBuckets,
      averageHitsPerBucket: activeBuckets > 0 ? totalHits / activeBuckets : 0,
      maxHitsInBucket: maxHits,
    };
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareHitCounterImplementations(
  operations: Array<{ type: "hit" | "getHits"; timestamp: number }>
): void {
  console.log(
    "Hit Counter Implementation Performance Comparison / So sánh hiệu suất triển khai Hit Counter"
  );
  console.log("=".repeat(90));

  const implementations = [
    { name: "Array-based", counter: new HitCounter() },
    { name: "Queue-based", counter: new HitCounterQueue() },
    { name: "HashMap", counter: new HitCounterHashMap() },
    { name: "Scalable", counter: new ScalableHitCounter(5) }, // 5-second buckets
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "hit":
          impl.counter.hit(op.timestamp);
          break;
        case "getHits":
          impl.counter.getHits(op.timestamp);
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Hit Counter Tests / Kiểm thử Hit Counter");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const counter1 = new HitCounter();
  counter1.hit(1);
  counter1.hit(2);
  counter1.hit(3);
  console.log(`getHits(4): ${counter1.getHits(4)}`); // Expected: 3
  counter1.hit(300);
  console.log(`getHits(300): ${counter1.getHits(300)}`); // Expected: 4
  console.log(`getHits(301): ${counter1.getHits(301)}`); // Expected: 3

  // Test 2: Statistics tracking
  console.log("\nTest 2: Statistics tracking / Theo dõi thống kê");
  const statCounter = new HitCounterWithStats();

  for (let i = 1; i <= 100; i++) {
    statCounter.hit(i);
  }

  for (let i = 50; i <= 150; i += 10) {
    statCounter.getHits(i);
  }

  const stats = statCounter.getPerformanceStats();
  console.log(`Total hits recorded: ${stats.totalHitsRecorded}`);
  console.log(`Get hits calls: ${stats.getHitsCalls}`);
  console.log(`Average hits per call: ${stats.averageHitsPerCall.toFixed(2)}`);

  // Test 3: Queue-based counter
  console.log("\nTest 3: Queue-based counter / Counter dựa trên Queue");
  const queueCounter = new HitCounterQueue();

  for (let i = 1; i <= 10; i++) {
    queueCounter.hit(i);
  }

  console.log(`getHits(10): ${queueCounter.getHits(10)}`);
  console.log(`getHits(310): ${queueCounter.getHits(310)}`); // Should be 0
  console.log(`Peak hits: ${queueCounter.getPeakHits(10)}`);

  // Test 4: Scalable counter
  console.log("\nTest 4: Scalable counter / Counter có thể mở rộng");
  const scalableCounter = new ScalableHitCounter(10); // 10-second buckets

  for (let i = 1; i <= 100; i++) {
    scalableCounter.hit(i);
  }

  const bucketStats = scalableCounter.getBucketStats(100);
  console.log(`Total buckets: ${bucketStats.totalBuckets}`);
  console.log(`Active buckets: ${bucketStats.activeBuckets}`);
  console.log(
    `Average hits per bucket: ${bucketStats.averageHitsPerBucket.toFixed(2)}`
  );
  console.log(`Max hits in bucket: ${bucketStats.maxHitsInBucket}`);

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "hit" as const, timestamp: 1 },
    { type: "hit" as const, timestamp: 2 },
    { type: "hit" as const, timestamp: 3 },
    { type: "getHits" as const, timestamp: 4 },
    { type: "hit" as const, timestamp: 300 },
    { type: "getHits" as const, timestamp: 300 },
    { type: "getHits" as const, timestamp: 301 },
  ];

  compareHitCounterImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  HitCounter,
  HitCounterQueue,
  HitCounterHashMap,
  HitCounterWithStats,
  ScalableHitCounter,
  compareHitCounterImplementations,
  runTests,
};
