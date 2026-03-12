---
layout: page
title: "LRU Cache"
difficulty: Easy
category: Others
tags: [Others, Hash Table]
leetcode_url: "https://leetcode.com/problems/lru-cache/"
---

# LRU Cache



## Problem Description

 *  * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.  *  * Implement the LRUCache class:  * - LRUCache(int capacity) Initialize the LRU cache with positive size capacity. 

## Solutions

{% raw %}
/**
 * LRU Cache
 *
 * Problem: https://leetcode.com/problems/lru-cache/
 *
 * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
 *
 * Implement the LRUCache class:
 * - LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
 * - int get(int key) Return the value of the key if the key exists, otherwise return -1.
 * - void put(int key, int value) Update the value of the key if the key exists. Otherwise,
 *   add the key-value pair to the cache. If the number of keys exceeds the capacity from
 *   this operation, evict the least recently used key.
 *
 * The functions get and put must each run in O(1) average time complexity.
 *
 * Example 1:
 * Input:
 * ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
 * [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
 * Output: [null, null, null, 1, null, -1, null, -1, 3, 4]
 *
 * Explanation:
 * LRUCache lRUCache = new LRUCache(2);
 * lRUCache.put(1, 1); // cache is {1=1}
 * lRUCache.put(2, 2); // cache is {1=1, 2=2}
 * lRUCache.get(1);    // return 1
 * lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
 * lRUCache.get(2);    // returns -1 (not found)
 * lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
 * lRUCache.get(1);    // return -1 (not found)
 * lRUCache.get(3);    // return 3
 * lRUCache.get(4);    // return 4
 *
 * Constraints:
 * - 1 <= capacity <= 3000
 * - 0 <= key <= 10^4
 * - 0 <= value <= 10^5
 * - At most 2 * 10^5 calls will be made to get and put.
 *
 * Solution Approaches:
 * 1. HashMap + Doubly Linked List
 * 2. Using Map (built-in LRU behavior in some languages)
 * 3. Array-based implementation (for small capacity)
 * 4. With eviction statistics
 *
 * Time Complexity: O(1) for get and put operations
 * Space Complexity: O(capacity)
 */

/**
 * Doubly Linked List Node
 */
class ListNode {
  key: number;
  value: number;
  prev: ListNode | null;
  next: ListNode | null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * LRU Cache - HashMap + Doubly Linked List Implementation
 *
 * LRU Cache - Triển khai HashMap + Doubly Linked List
 *
 * This approach uses a HashMap for O(1) lookups and a doubly linked list
 * to maintain the order of recently used items
 */
class LRUCache {
  private capacity: number;
  private cache: Map<number, ListNode>;
  private head: ListNode;
  private tail: ListNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();

    // Initialize dummy head and tail nodes
    this.head = new ListNode(0, 0);
    this.tail = new ListNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Get value by key
   * Lấy giá trị theo khóa
   */
  get(key: number): number {
    const node = this.cache.get(key);

    if (!node) {
      return -1;
    }

    // Move to front (most recently used)
    this.moveToFront(node);

    return node.value;
  }

  /**
   * Put key-value pair
   * Đặt cặp khóa-giá trị
   */
  put(key: number, value: number): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      // Update existing node
      existingNode.value = value;
      this.moveToFront(existingNode);
    } else {
      // Create new node
      const newNode = new ListNode(key, value);
      this.cache.set(key, newNode);
      this.addToFront(newNode);

      // Check capacity and evict if necessary
      if (this.cache.size > this.capacity) {
        this.evictLRU();
      }
    }
  }

  /**
   * Move node to front of list (most recently used)
   * Di chuyển node lên đầu danh sách (sử dụng gần đây nhất)
   */
  private moveToFront(node: ListNode): void {
    // Remove from current position
    this.removeNode(node);
    // Add to front
    this.addToFront(node);
  }

  /**
   * Add node to front of list
   * Thêm node vào đầu danh sách
   */
  private addToFront(node: ListNode): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  /**
   * Remove node from list
   * Xóa node khỏi danh sách
   */
  private removeNode(node: ListNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  /**
   * Evict least recently used item
   * Loại bỏ phần tử ít được sử dụng nhất
   */
  private evictLRU(): void {
    const lruNode = this.tail.prev!;
    this.removeNode(lruNode);
    this.cache.delete(lruNode.key);
  }

  /**
   * Get current size of cache
   * Lấy kích thước hiện tại của cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if cache is full
   * Kiểm tra xem cache có đầy không
   */
  isFull(): boolean {
    return this.cache.size >= this.capacity;
  }

  /**
   * Get all keys in order of usage (most recent first)
   * Lấy tất cả khóa theo thứ tự sử dụng (gần đây nhất trước)
   */
  getKeysInOrder(): number[] {
    const keys: number[] = [];
    let current = this.head.next;

    while (current && current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }

    return keys;
  }

  /**
   * Get cache statistics
   * Lấy thống kê cache
   */
  getStats(): { size: number; capacity: number; usage: number } {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      usage: (this.cache.size / this.capacity) * 100,
    };
  }
}

/**
 * Alternative Implementation: Using Map (built-in LRU behavior)
 *
 * Triển khai thay thế: Sử dụng Map (hành vi LRU có sẵn)
 */
class LRUCacheMap {
  private capacity: number;
  private cache: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): number {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first key)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  size(): number {
    return this.cache.size;
  }

  isFull(): boolean {
    return this.cache.size >= this.capacity;
  }
}

/**
 * Implementation with Eviction Statistics
 *
 * Triển khai với thống kê loại bỏ
 */
class LRUCacheWithStats extends LRUCache {
  private evictionCount: number;
  private hitCount: number;
  private missCount: number;
  private evictionHistory: Array<{ key: number; timestamp: number }>;

  constructor(capacity: number) {
    super(capacity);
    this.evictionCount = 0;
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionHistory = [];
  }

  get(key: number): number {
    const result = super.get(key);

    if (result === -1) {
      this.missCount++;
    } else {
      this.hitCount++;
    }

    return result;
  }

  put(key: number, value: number): void {
    const wasFull = this.isFull();
    const hadKey = this.get(key) !== -1;

    super.put(key, value);

    // Track eviction if cache was full and we added a new key
    if (wasFull && !hadKey) {
      this.evictionCount++;
      this.evictionHistory.push({ key, timestamp: Date.now() });
    }
  }

  /**
   * Get cache performance statistics
   * Lấy thống kê hiệu suất cache
   */
  getPerformanceStats(): {
    hitCount: number;
    missCount: number;
    hitRate: number;
    evictionCount: number;
    evictionHistory: Array<{ key: number; timestamp: number }>;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate =
      totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
      evictionCount: this.evictionCount,
      evictionHistory: [...this.evictionHistory],
    };
  }

  /**
   * Clear performance statistics
   * Xóa thống kê hiệu suất
   */
  clearStats(): void {
    this.evictionCount = 0;
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionHistory = [];
  }
}

/**
 * Implementation with TTL (Time To Live)
 *
 * Triển khai với TTL (Thời gian sống)
 */
class LRUCacheWithTTL extends LRUCache {
  private ttl: number; // Time to live in milliseconds
  private timestamps: Map<number, number>;

  constructor(capacity: number, ttl: number = 60000) {
    // Default 1 minute
    super(capacity);
    this.ttl = ttl;
    this.timestamps = new Map();
  }

  get(key: number): number {
    const timestamp = this.timestamps.get(key);

    if (timestamp && Date.now() - timestamp > this.ttl) {
      // Key has expired, remove it
      this.timestamps.delete(key);
      return -1;
    }

    const result = super.get(key);

    if (result !== -1) {
      // Update timestamp
      this.timestamps.set(key, Date.now());
    }

    return result;
  }

  put(key: number, value: number): void {
    super.put(key, value);
    this.timestamps.set(key, Date.now());
  }

  /**
   * Clean up expired entries
   * Dọn dẹp các mục đã hết hạn
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now - timestamp > this.ttl) {
        this.timestamps.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Get TTL statistics
   * Lấy thống kê TTL
   */
  getTTLStats(): {
    ttl: number;
    activeEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let expiredCount = 0;

    for (const timestamp of this.timestamps.values()) {
      if (now - timestamp > this.ttl) {
        expiredCount++;
      }
    }

    return {
      ttl: this.ttl,
      activeEntries: this.timestamps.size - expiredCount,
      expiredEntries: expiredCount,
    };
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareLRUImplementations(
  operations: Array<{ type: "get" | "put"; key: number; value?: number }>
): void {
  console.log(
    "LRU Cache Implementation Performance Comparison / So sánh hiệu suất triển khai LRU Cache"
  );
  console.log("=".repeat(80));

  const implementations = [
    { name: "Doubly Linked List", cache: new LRUCache(100) },
    { name: "Map-based", cache: new LRUCacheMap(100) },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "get":
          impl.cache.get(op.key);
          break;
        case "put":
          impl.cache.put(op.key, op.value!);
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Final size: ${impl.cache.size()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("LRU Cache Tests / Kiểm thử LRU Cache");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const cache1 = new LRUCache(2);
  cache1.put(1, 1);
  cache1.put(2, 2);
  console.log(`get(1): ${cache1.get(1)}`); // Expected: 1
  cache1.put(3, 3);
  console.log(`get(2): ${cache1.get(2)}`); // Expected: -1
  cache1.put(4, 4);
  console.log(`get(1): ${cache1.get(1)}`); // Expected: -1
  console.log(`get(3): ${cache1.get(3)}`); // Expected: 3
  console.log(`get(4): ${cache1.get(4)}`); // Expected: 4

  // Test 2: Performance tracking
  console.log("\nTest 2: Performance tracking / Theo dõi hiệu suất");
  const perfCache = new LRUCacheWithStats(3);

  perfCache.put(1, 1);
  perfCache.put(2, 2);
  perfCache.put(3, 3);
  perfCache.get(1); // Hit
  perfCache.get(4); // Miss
  perfCache.put(4, 4); // Evicts 2
  perfCache.get(2); // Miss (evicted)

  const stats = perfCache.getPerformanceStats();
  console.log(`Hit count: ${stats.hitCount}`);
  console.log(`Miss count: ${stats.missCount}`);
  console.log(`Hit rate: ${stats.hitRate.toFixed(2)}%`);
  console.log(`Eviction count: ${stats.evictionCount}`);

  // Test 3: TTL cache
  console.log("\nTest 3: TTL cache / Cache với TTL");
  const ttlCache = new LRUCacheWithTTL(3, 1000); // 1 second TTL

  ttlCache.put(1, 1);
  ttlCache.put(2, 2);
  console.log(`get(1): ${ttlCache.get(1)}`); // Expected: 1

  // Wait for TTL to expire (simulate)
  setTimeout(() => {
    console.log(`get(1) after TTL: ${ttlCache.get(1)}`); // Expected: -1
    console.log(`TTL stats: ${JSON.stringify(ttlCache.getTTLStats())}`);
  }, 1100);

  // Test 4: Cache statistics
  console.log("\nTest 4: Cache statistics / Thống kê cache");
  const statCache = new LRUCache(5);

  for (let i = 1; i <= 7; i++) {
    statCache.put(i, i * 10);
  }

  console.log(`Size: ${statCache.size()}`);
  console.log(`Is full: ${statCache.isFull()}`);
  console.log(`Keys in order: [${statCache.getKeysInOrder().join(", ")}]`);
  console.log(`Stats: ${JSON.stringify(statCache.getStats())}`);

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "put" as const, key: 1, value: 1 },
    { type: "put" as const, key: 2, value: 2 },
    { type: "get" as const, key: 1 },
    { type: "put" as const, key: 3, value: 3 },
    { type: "get" as const, key: 2 },
    { type: "put" as const, key: 4, value: 4 },
    { type: "get" as const, key: 1 },
    { type: "get" as const, key: 3 },
    { type: "get" as const, key: 4 },
  ];

  compareLRUImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  LRUCache,
  LRUCacheMap,
  LRUCacheWithStats,
  LRUCacheWithTTL,
  ListNode,
  compareLRUImplementations,
  runTests,
};
{% endraw %}
