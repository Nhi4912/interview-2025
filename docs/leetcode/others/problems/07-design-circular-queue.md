---
layout: page
title: "Design Circular Queue"
difficulty: Easy
category: Others
tags: [Others]
leetcode_url: "https://leetcode.com/problems/design-circular-queue/"
---

# Design Circular Queue



## Problem Description

 *  * Design your implementation of the circular queue. The circular queue is a linear  * data structure in which the operations are performed based on FIFO (First In First Out)  * principle and the last position is connected back to the first position to make a circle.  * It is also called "Ring Buffer". 

## Solutions

{% raw %}
/**
 * Design Circular Queue
 *
 * Problem: https://leetcode.com/problems/design-circular-queue/
 *
 * Design your implementation of the circular queue. The circular queue is a linear
 * data structure in which the operations are performed based on FIFO (First In First Out)
 * principle and the last position is connected back to the first position to make a circle.
 * It is also called "Ring Buffer".
 *
 * One of the benefits of the circular queue is that we can make use of the spaces in
 * front of the queue. In a normal queue, once the queue becomes full, we cannot insert
 * the next element even if there is a space in front of the queue. But using a circular
 * queue, we can use the space to store new values.
 *
 * Implementation the MyCircularQueue class:
 * - MyCircularQueue(k) Initializes the object with the size of the queue to be k.
 * - boolean enQueue(int value) Inserts an element into the circular queue. Return true
 *   if the operation is successful.
 * - boolean deQueue() Deletes an element from the circular queue. Return true if the
 *   operation is successful.
 * - int Front() Gets the front item from the queue. If the queue is empty, return -1.
 * - int Rear() Gets the last item from the queue. If the queue is empty, return -1.
 * - boolean isEmpty() Checks whether the circular queue is empty or not.
 * - boolean isFull() Checks whether the circular queue is full or not.
 *
 * You must solve the problem without using the built-in queue data structure in your
 * programming language.
 *
 * Example 1:
 * Input:
 * ["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
 * [[3], [1], [2], [3], [4], [], [], [], [4], []]
 * Output: [null, true, true, true, false, 3, true, true, true, 4]
 *
 * Explanation:
 * MyCircularQueue myCircularQueue = new MyCircularQueue(3);
 * myCircularQueue.enQueue(1); // return True
 * myCircularQueue.enQueue(2); // return True
 * myCircularQueue.enQueue(3); // return True
 * myCircularQueue.enQueue(4); // return False
 * myCircularQueue.Rear();     // return 3
 * myCircularQueue.isFull();   // return True
 * myCircularQueue.deQueue();  // return True
 * myCircularQueue.enQueue(4); // return True
 * myCircularQueue.Rear();     // return 4
 *
 * Constraints:
 * - 1 <= k <= 1000
 * - 0 <= value <= 1000
 * - At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull.
 *
 * Solution Approaches:
 * 1. Array-based implementation with front and rear pointers
 * 2. Array-based implementation with size tracking
 * 3. Linked list implementation
 * 4. With additional features and statistics
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(k) where k is the capacity
 */

/**
 * MyCircularQueue - Array-based Implementation with Front and Rear Pointers
 *
 * MyCircularQueue - Triển khai dựa trên Array với con trỏ Front và Rear
 *
 * This approach uses an array with front and rear pointers to track the queue state
 */
class MyCircularQueue {
  private queue: number[];
  private front: number;
  private rear: number;
  private capacity: number;
  private size: number;

  constructor(k: number) {
    this.queue = new Array(k);
    this.front = 0;
    this.rear = -1;
    this.capacity = k;
    this.size = 0;
  }

  /**
   * Insert an element into the circular queue
   * Chèn một phần tử vào circular queue
   */
  enQueue(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = value;
    this.size++;

    return true;
  }

  /**
   * Delete an element from the circular queue
   * Xóa một phần tử khỏi circular queue
   */
  deQueue(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    this.front = (this.front + 1) % this.capacity;
    this.size--;

    return true;
  }

  /**
   * Get the front item from the queue
   * Lấy phần tử đầu tiên từ queue
   */
  Front(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.queue[this.front];
  }

  /**
   * Get the last item from the queue
   * Lấy phần tử cuối cùng từ queue
   */
  Rear(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.queue[this.rear];
  }

  /**
   * Check if the queue is empty
   * Kiểm tra xem queue có rỗng không
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Check if the queue is full
   * Kiểm tra xem queue có đầy không
   */
  isFull(): boolean {
    return this.size === this.capacity;
  }

  /**
   * Get current size of the queue
   * Lấy kích thước hiện tại của queue
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Get the capacity of the queue
   * Lấy dung lượng của queue
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { queue: number[]; front: number; rear: number; size: number } {
    return {
      queue: [...this.queue],
      front: this.front,
      rear: this.rear,
      size: this.size,
    };
  }
}

/**
 * Alternative Implementation: Array-based with Size Tracking Only
 *
 * Triển khai thay thế: Dựa trên Array chỉ với theo dõi kích thước
 */
class MyCircularQueueSizeOnly {
  private queue: number[];
  private front: number;
  private size: number;
  private capacity: number;

  constructor(k: number) {
    this.queue = new Array(k);
    this.front = 0;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    const rear = (this.front + this.size) % this.capacity;
    this.queue[rear] = value;
    this.size++;

    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    this.front = (this.front + 1) % this.capacity;
    this.size--;

    return true;
  }

  Front(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.queue[this.front];
  }

  Rear(): number {
    if (this.isEmpty()) {
      return -1;
    }

    const rear = (this.front + this.size - 1) % this.capacity;
    return this.queue[rear];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  getSize(): number {
    return this.size;
  }
}

/**
 * Linked List Implementation
 *
 * Triển khai Linked List
 */
class CircularQueueNode {
  value: number;
  next: CircularQueueNode | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

class MyCircularQueueLinkedList {
  private head: CircularQueueNode | null;
  private tail: CircularQueueNode | null;
  private size: number;
  private capacity: number;

  constructor(k: number) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    const newNode = new CircularQueueNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode; // Circular reference
    } else {
      this.tail!.next = newNode;
      newNode.next = this.head;
      this.tail = newNode;
    }

    this.size++;
    return true;
  }

  deQueue(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head!.next;
      this.tail!.next = this.head;
    }

    this.size--;
    return true;
  }

  Front(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.head!.value;
  }

  Rear(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.tail!.value;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  getSize(): number {
    return this.size;
  }
}

/**
 * Implementation with Statistics and Monitoring
 *
 * Triển khai với thống kê và giám sát
 */
class MyCircularQueueWithStats extends MyCircularQueue {
  private enqueueCount: number;
  private dequeueCount: number;
  private overflowCount: number;
  private underflowCount: number;
  private operationHistory: Array<{
    operation: string;
    value?: number;
    timestamp: number;
    success: boolean;
  }>;

  constructor(k: number) {
    super(k);
    this.enqueueCount = 0;
    this.dequeueCount = 0;
    this.overflowCount = 0;
    this.underflowCount = 0;
    this.operationHistory = [];
  }

  enQueue(value: number): boolean {
    const success = super.enQueue(value);

    this.enqueueCount++;
    if (!success) {
      this.overflowCount++;
    }

    this.operationHistory.push({
      operation: "enQueue",
      value,
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  deQueue(): boolean {
    const success = super.deQueue();

    this.dequeueCount++;
    if (!success) {
      this.underflowCount++;
    }

    this.operationHistory.push({
      operation: "deQueue",
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  /**
   * Get queue statistics
   * Lấy thống kê queue
   */
  getStats(): {
    enqueueCount: number;
    dequeueCount: number;
    overflowCount: number;
    underflowCount: number;
    successRate: number;
    currentUtilization: number;
  } {
    const totalOperations = this.enqueueCount + this.dequeueCount;
    const successfulOperations =
      this.enqueueCount -
      this.overflowCount +
      this.dequeueCount -
      this.underflowCount;
    const successRate =
      totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;
    const utilization = (this.getSize() / this.getCapacity()) * 100;

    return {
      enqueueCount: this.enqueueCount,
      dequeueCount: this.dequeueCount,
      overflowCount: this.overflowCount,
      underflowCount: this.underflowCount,
      successRate,
      currentUtilization: utilization,
    };
  }

  /**
   * Get recent operation history
   * Lấy lịch sử thao tác gần đây
   */
  getRecentHistory(
    count: number = 10
  ): Array<{
    operation: string;
    value?: number;
    timestamp: number;
    success: boolean;
  }> {
    return this.operationHistory.slice(-count);
  }

  /**
   * Clear operation history
   * Xóa lịch sử thao tác
   */
  clearHistory(): void {
    this.operationHistory = [];
  }
}

/**
 * Implementation with Priority Queue Features
 *
 * Triển khai với tính năng Priority Queue
 */
class MyCircularQueueWithPriority extends MyCircularQueue {
  private priorities: number[];

  constructor(k: number) {
    super(k);
    this.priorities = new Array(k);
  }

  /**
   * Enqueue with priority
   * Enqueue với độ ưu tiên
   */
  enQueueWithPriority(value: number, priority: number): boolean {
    if (this.isFull()) {
      return false;
    }

    // Find position to insert based on priority
    let insertIndex = this.front;
    for (let i = 0; i < this.getSize(); i++) {
      const currentIndex = (this.front + i) % this.getCapacity();
      if (priority > this.priorities[currentIndex]) {
        insertIndex = currentIndex;
        break;
      }
    }

    // Shift elements to make space
    for (let i = this.getSize(); i > 0; i--) {
      const currentIndex = (this.front + i - 1) % this.getCapacity();
      const nextIndex = (this.front + i) % this.getCapacity();
      this.queue[nextIndex] = this.queue[currentIndex];
      this.priorities[nextIndex] = this.priorities[currentIndex];
    }

    // Insert at the correct position
    this.queue[insertIndex] = value;
    this.priorities[insertIndex] = priority;

    return true;
  }

  /**
   * Get element with highest priority
   * Lấy phần tử có độ ưu tiên cao nhất
   */
  getHighestPriority(): number {
    if (this.isEmpty()) {
      return -1;
    }

    let maxPriority = -1;
    let maxPriorityIndex = this.front;

    for (let i = 0; i < this.getSize(); i++) {
      const currentIndex = (this.front + i) % this.getCapacity();
      if (this.priorities[currentIndex] > maxPriority) {
        maxPriority = this.priorities[currentIndex];
        maxPriorityIndex = currentIndex;
      }
    }

    return this.queue[maxPriorityIndex];
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareCircularQueueImplementations(
  operations: Array<{
    type: "enQueue" | "deQueue" | "Front" | "Rear";
    value?: number;
  }>
): void {
  console.log(
    "Circular Queue Implementation Performance Comparison / So sánh hiệu suất triển khai Circular Queue"
  );
  console.log("=".repeat(90));

  const implementations = [
    { name: "Array with Pointers", queue: new MyCircularQueue(100) },
    { name: "Array Size Only", queue: new MyCircularQueueSizeOnly(100) },
    { name: "Linked List", queue: new MyCircularQueueLinkedList(100) },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "enQueue":
          impl.queue.enQueue(op.value!);
          break;
        case "deQueue":
          impl.queue.deQueue();
          break;
        case "Front":
          impl.queue.Front();
          break;
        case "Rear":
          impl.queue.Rear();
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Final size: ${impl.queue.getSize()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Circular Queue Tests / Kiểm thử Circular Queue");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const queue1 = new MyCircularQueue(3);
  console.log(`enQueue(1): ${queue1.enQueue(1)}`); // Expected: true
  console.log(`enQueue(2): ${queue1.enQueue(2)}`); // Expected: true
  console.log(`enQueue(3): ${queue1.enQueue(3)}`); // Expected: true
  console.log(`enQueue(4): ${queue1.enQueue(4)}`); // Expected: false
  console.log(`Rear(): ${queue1.Rear()}`); // Expected: 3
  console.log(`isFull(): ${queue1.isFull()}`); // Expected: true
  console.log(`deQueue(): ${queue1.deQueue()}`); // Expected: true
  console.log(`enQueue(4): ${queue1.enQueue(4)}`); // Expected: true
  console.log(`Rear(): ${queue1.Rear()}`); // Expected: 4

  // Test 2: Statistics tracking
  console.log("\nTest 2: Statistics tracking / Theo dõi thống kê");
  const statQueue = new MyCircularQueueWithStats(5);

  for (let i = 1; i <= 7; i++) {
    statQueue.enQueue(i);
  }

  for (let i = 0; i < 3; i++) {
    statQueue.deQueue();
  }

  const stats = statQueue.getStats();
  console.log(`Enqueue count: ${stats.enqueueCount}`);
  console.log(`Dequeue count: ${stats.dequeueCount}`);
  console.log(`Overflow count: ${stats.overflowCount}`);
  console.log(`Success rate: ${stats.successRate.toFixed(2)}%`);
  console.log(`Utilization: ${stats.currentUtilization.toFixed(2)}%`);

  // Test 3: State inspection
  console.log("\nTest 3: State inspection / Kiểm tra trạng thái");
  const stateQueue = new MyCircularQueue(4);
  stateQueue.enQueue(1);
  stateQueue.enQueue(2);

  console.log("Current state:");
  console.log(stateQueue.getState());

  stateQueue.deQueue();

  console.log("After dequeue:");
  console.log(stateQueue.getState());

  // Test 4: Performance comparison
  console.log("\nTest 4: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "enQueue" as const, value: 1 },
    { type: "enQueue" as const, value: 2 },
    { type: "enQueue" as const, value: 3 },
    { type: "Front" as const },
    { type: "Rear" as const },
    { type: "deQueue" as const },
    { type: "enQueue" as const, value: 4 },
    { type: "Front" as const },
    { type: "Rear" as const },
  ];

  compareCircularQueueImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  MyCircularQueue,
  MyCircularQueueSizeOnly,
  MyCircularQueueLinkedList,
  MyCircularQueueWithStats,
  MyCircularQueueWithPriority,
  CircularQueueNode,
  compareCircularQueueImplementations,
  runTests,
};
{% endraw %}
