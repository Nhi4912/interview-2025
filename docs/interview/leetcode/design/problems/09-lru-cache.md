---
layout: page
title: "LRU Cache"
difficulty: Easy
category: Design
tags: [Design, Hash Table]
leetcode_url: "https://leetcode.com/problems/lru-cache/"
---

# LRU Cache

**LeetCode Problem # * 146. LRU Cache**

## Problem Description

LeetCode problem solution with multiple approaches and explanations.

## Solutions

{% raw %}
/**
 * 146. LRU Cache
 * 
 * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
 * 
 * Implement the LRUCache class:
 * - LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
 * - int get(int key) Return the value of the key if the key exists, otherwise return -1.
 * - void put(int key, int value) Update the value of the key if the key exists. 
 *   Otherwise, add the key-value pair to the cache. If the number of keys exceeds 
 *   the capacity from this operation, evict the least recently used key.
 * 
 * The functions get and put must each run in O(1) average time complexity.
 * 
 * Example 1:
 * Input
 * ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
 * [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
 * Output
 * [null, null, null, 1, null, -1, null, -1, 3, 4]
 * 
 * Explanation
 * LRUCache lRUCache = new LRUCache(2);
 * lRUCache.put(1, 1); // cache is {1=1}
 * lRUCache.put(2, 2); // cache is {1=1, 2=2}
 * lRUCache.get(1);    // return 1
 * lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
 * lRUCache.get(2);    // returns -1 (not found)
 * lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {3=3, 4=4}
 * lRUCache.get(1);    // return -1 (not found)
 * lRUCache.get(3);    // return 3
 * lRUCache.get(4);    // return 4
 * 
 * Constraints:
 * - 1 <= capacity <= 3000
 * - 0 <= key <= 10^4
 * - 0 <= value <= 10^5
 * - At most 2 * 10^5 calls will be made to get and put.
 */

// Solution 1: HashMap + Doubly Linked List
// Time: O(1) for both get and put, Space: O(capacity)
class ListNode {
    key: number;
    value: number;
    prev: ListNode | null;
    next: ListNode | null;
    
    constructor(key: number = 0, value: number = 0) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

export class LRUCache1 {
    private capacity: number;
    private cache: Map<number, ListNode>;
    private head: ListNode;
    private tail: ListNode;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        
        // Create dummy head and tail nodes
        this.head = new ListNode();
        this.tail = new ListNode();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    private addToHead(node: ListNode): void {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next!.prev = node;
        this.head.next = node;
    }
    
    private removeNode(node: ListNode): void {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }
    
    private moveToHead(node: ListNode): void {
        this.removeNode(node);
        this.addToHead(node);
    }
    
    private removeTail(): ListNode {
        const last = this.tail.prev!;
        this.removeNode(last);
        return last;
    }
    
    get(key: number): number {
        const node = this.cache.get(key);
        if (!node) return -1;
        
        // Move accessed node to head (most recently used)
        this.moveToHead(node);
        return node.value;
    }
    
    put(key: number, value: number): void {
        const node = this.cache.get(key);
        
        if (node) {
            // Update existing node
            node.value = value;
            this.moveToHead(node);
        } else {
            // Add new node
            const newNode = new ListNode(key, value);
            
            if (this.cache.size >= this.capacity) {
                // Remove least recently used node
                const tail = this.removeTail();
                this.cache.delete(tail.key);
            }
            
            this.cache.set(key, newNode);
            this.addToHead(newNode);
        }
    }
}

// Solution 2: Using JavaScript Map (maintains insertion order)
// Time: O(1) for both get and put, Space: O(capacity)
export class LRUCache2 {
    private capacity: number;
    private cache: Map<number, number>;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key: number): number {
        if (!this.cache.has(key)) return -1;
        
        // Move to end (most recently used)
        const value = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    put(key: number, value: number): void {
        if (this.cache.has(key)) {
            // Update existing key
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove least recently used (first key)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, value);
    }
}

// Solution 3: Array-based implementation
// Time: O(n) for both get and put, Space: O(capacity)
export class LRUCache3 {
    private capacity: number;
    private cache: Array<[number, number]>;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = [];
    }
    
    private findIndex(key: number): number {
        for (let i = 0; i < this.cache.length; i++) {
            if (this.cache[i][0] === key) return i;
        }
        return -1;
    }
    
    get(key: number): number {
        const index = this.findIndex(key);
        if (index === -1) return -1;
        
        // Move to end (most recently used)
        const [k, v] = this.cache.splice(index, 1)[0];
        this.cache.push([k, v]);
        return v;
    }
    
    put(key: number, value: number): void {
        const index = this.findIndex(key);
        
        if (index !== -1) {
            // Update existing key
            this.cache.splice(index, 1);
        } else if (this.cache.length >= this.capacity) {
            // Remove least recently used (first element)
            this.cache.shift();
        }
        
        this.cache.push([key, value]);
    }
}

// Solution 4: Two-way mapping approach
// Time: O(1) for both get and put, Space: O(capacity)
export class LRUCache4 {
    private capacity: number;
    private keyToValue: Map<number, number>;
    private keyToTime: Map<number, number>;
    private timeToKey: Map<number, number>;
    private currentTime: number;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.keyToValue = new Map();
        this.keyToTime = new Map();
        this.timeToKey = new Map();
        this.currentTime = 0;
    }
    
    private updateTime(key: number): void {
        // Remove old time mapping
        const oldTime = this.keyToTime.get(key);
        if (oldTime !== undefined) {
            this.timeToKey.delete(oldTime);
        }
        
        // Add new time mapping
        this.keyToTime.set(key, this.currentTime);
        this.timeToKey.set(this.currentTime, key);
        this.currentTime++;
    }
    
    get(key: number): number {
        if (!this.keyToValue.has(key)) return -1;
        
        this.updateTime(key);
        return this.keyToValue.get(key)!;
    }
    
    put(key: number, value: number): void {
        if (this.keyToValue.has(key)) {
            // Update existing key
            this.keyToValue.set(key, value);
            this.updateTime(key);
        } else {
            // Add new key
            if (this.keyToValue.size >= this.capacity) {
                // Find and remove LRU key
                let minTime = Infinity;
                let lruKey = -1;
                
                for (const [k, time] of this.keyToTime) {
                    if (time < minTime) {
                        minTime = time;
                        lruKey = k;
                    }
                }
                
                // Remove LRU key
                this.keyToValue.delete(lruKey);
                this.keyToTime.delete(lruKey);
                this.timeToKey.delete(minTime);
            }
            
            this.keyToValue.set(key, value);
            this.updateTime(key);
        }
    }
}

// Solution 5: Using Set for order tracking
// Time: O(1) for both get and put, Space: O(capacity)
export class LRUCache5 {
    private capacity: number;
    private values: Map<number, number>;
    private usage: Set<number>;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.values = new Map();
        this.usage = new Set();
    }
    
    get(key: number): number {
        if (!this.values.has(key)) return -1;
        
        // Update usage order
        this.usage.delete(key);
        this.usage.add(key);
        
        return this.values.get(key)!;
    }
    
    put(key: number, value: number): void {
        if (this.values.has(key)) {
            // Update existing key
            this.values.set(key, value);
            this.usage.delete(key);
            this.usage.add(key);
        } else {
            // Add new key
            if (this.values.size >= this.capacity) {
                // Remove least recently used
                const lruKey = this.usage.values().next().value;
                this.values.delete(lruKey);
                this.usage.delete(lruKey);
            }
            
            this.values.set(key, value);
            this.usage.add(key);
        }
    }
}

// Test cases
export function testLRUCache() {
    console.log("Testing LRU Cache:");
    
    const implementations = [
        { name: "HashMap + Doubly Linked List", LRUCache: LRUCache1 },
        { name: "JavaScript Map", LRUCache: LRUCache2 },
        { name: "Array-based", LRUCache: LRUCache3 },
        { name: "Two-way Mapping", LRUCache: LRUCache4 },
        { name: "Set for Usage", LRUCache: LRUCache5 }
    ];
    
    implementations.forEach(impl => {
        console.log(`\n${impl.name}:`);
        
        const cache = new impl.LRUCache(2);
        
        // Test case 1
        cache.put(1, 1);
        cache.put(2, 2);
        console.log(`  get(1): ${cache.get(1)} (expected: 1)`);
        cache.put(3, 3);
        console.log(`  get(2): ${cache.get(2)} (expected: -1)`);
        cache.put(4, 4);
        console.log(`  get(1): ${cache.get(1)} (expected: -1)`);
        console.log(`  get(3): ${cache.get(3)} (expected: 3)`);
        console.log(`  get(4): ${cache.get(4)} (expected: 4)`);
    });
}

/**
 * Key Insights:
 * 
 * 1. **Core Requirements**:
 *    - O(1) time complexity for both get and put
 *    - Fixed capacity with LRU eviction
 *    - Most recently used items should be easily accessible
 * 
 * 2. **Data Structure Choice**:
 *    - HashMap: O(1) key lookup
 *    - Doubly Linked List: O(1) insertion/deletion at any position
 *    - Combination provides O(1) for all operations
 * 
 * 3. **Doubly Linked List Advantages**:
 *    - O(1) insertion at head (most recent)
 *    - O(1) deletion at tail (least recent)
 *    - O(1) node removal from middle (when accessing)
 * 
 * 4. **Implementation Details**:
 *    - Dummy head/tail nodes simplify edge cases
 *    - HashMap stores key → node mapping
 *    - Move accessed nodes to head
 *    - Remove from tail when capacity exceeded
 * 
 * 5. **Alternative Approaches**:
 *    - JavaScript Map: Maintains insertion order
 *    - Array-based: O(n) but simple implementation
 *    - Two-way mapping: Complex but demonstrates concept
 * 
 * 6. **Interview Strategy**:
 *    - Start with requirements analysis
 *    - Discuss time complexity constraints
 *    - Explain data structure choice
 *    - Implement step by step
 *    - Handle edge cases
 * 
 * 7. **Edge Cases**:
 *    - Capacity of 1
 *    - Accessing non-existent keys
 *    - Updating existing keys
 *    - Multiple accesses to same key
 * 
 * 8. **Common Mistakes**:
 *    - Forgetting to update access order on get
 *    - Incorrect linked list pointer manipulation
 *    - Not handling capacity overflow
 *    - Using wrong data structure (losing O(1) property)
 * 
 * 9. **Big Tech Variations**:
 *    - LFU (Least Frequently Used) Cache
 *    - TTL (Time To Live) Cache
 *    - Multi-level caches
 *    - Thread-safe implementations
 * 
 * 10. **Follow-up Questions**:
 *     - Implement LFU cache
 *     - Add TTL functionality
 *     - Make it thread-safe
 *     - Optimize for specific access patterns
 *     - Handle cache statistics
 * 
 * 11. **Performance Considerations**:
 *     - Memory usage vs access speed
 *     - Cache hit/miss ratios
 *     - Eviction policy efficiency
 *     - Concurrent access handling
 * 
 * 12. **Real-world Applications**:
 *     - CPU caches
 *     - Database buffer pools
 *     - Web browser caches
 *     - Operating system page replacement
 *     - CDN caching strategies
 */
{% endraw %}
