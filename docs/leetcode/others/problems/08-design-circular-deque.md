---
layout: page
title: "Design Circular Deque"
difficulty: Easy
category: Others
tags: [Others]
leetcode_url: "https://leetcode.com/problems/design-circular-deque/"
---

# Design Circular Deque



## Problem Description

 *  * Design your implementation of the circular double-ended queue (deque).  * Your implementation should support the following operations:  *  * - MyCircularDeque(k): Constructor, set the size of the deque to be k. 

## Solutions

{% raw %}
/**
 * Design Circular Deque
 *
 * Problem: https://leetcode.com/problems/design-circular-deque/
 *
 * Design your implementation of the circular double-ended queue (deque).
 * Your implementation should support the following operations:
 *
 * - MyCircularDeque(k): Constructor, set the size of the deque to be k.
 * - insertFront(): Adds an item at the front of Deque. Return true if the operation is successful.
 * - insertLast(): Adds an item at the rear of Deque. Return true if the operation is successful.
 * - deleteFront(): Deletes an item from the front of Deque. Return true if the operation is successful.
 * - deleteLast(): Deletes an item from the rear of Deque. Return true if the operation is successful.
 * - getFront(): Gets the front item from the Deque. If the deque is empty, return -1.
 * - getRear(): Gets the last item from the Deque. If the deque is empty, return -1.
 * - isEmpty(): Checks whether Deque is empty or not.
 * - isFull(): Checks whether Deque is full or not.
 *
 * Example 1:
 * Input:
 * ["MyCircularDeque", "insertLast", "insertLast", "insertFront", "insertFront", "getRear", "isFull", "deleteLast", "insertFront", "getFront"]
 * [[3], [1], [2], [3], [4], [], [], [], [4], []]
 * Output: [null, true, true, true, false, 2, true, true, true, 4]
 *
 * Explanation:
 * MyCircularDeque circularDeque = new MyCircularDeque(3); // set the size to be 3
 * circularDeque.insertLast(1);			// return True
 * circularDeque.insertLast(2);			// return True
 * circularDeque.insertFront(3);			// return True
 * circularDeque.insertFront(4);			// return False, the queue is full
 * circularDeque.getRear();  			// return 2
 * circularDeque.isFull();				// return True
 * circularDeque.deleteLast();			// return True
 * circularDeque.insertFront(4);			// return True
 * circularDeque.getFront();				// return 4
 *
 * Constraints:
 * - 1 <= k <= 1000
 * - 0 <= value <= 1000
 * - At most 2000 calls will be made to insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, isFull.
 *
 * Solution Approaches:
 * 1. Array-based implementation with front and rear pointers
 * 2. Array-based implementation with size tracking
 * 3. Linked list implementation
 * 4. With additional features and monitoring
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(k) where k is the capacity
 */

/**
 * MyCircularDeque - Array-based Implementation
 *
 * MyCircularDeque - Triển khai dựa trên Array
 *
 * This approach uses an array with front and rear pointers to implement a circular deque
 */
class MyCircularDeque {
  private deque: number[];
  private front: number;
  private rear: number;
  private capacity: number;
  private size: number;

  constructor(k: number) {
    this.deque = new Array(k);
    this.front = 0;
    this.rear = 0;
    this.capacity = k;
    this.size = 0;
  }

  /**
   * Insert an item at the front of Deque
   * Chèn một phần tử vào đầu Deque
   */
  insertFront(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.front = (this.front - 1 + this.capacity) % this.capacity;
    }

    this.deque[this.front] = value;
    this.size++;

    return true;
  }

  /**
   * Insert an item at the rear of Deque
   * Chèn một phần tử vào cuối Deque
   */
  insertLast(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    if (this.isEmpty()) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.capacity;
    }

    this.deque[this.rear] = value;
    this.size++;

    return true;
  }

  /**
   * Delete an item from the front of Deque
   * Xóa một phần tử từ đầu Deque
   */
  deleteFront(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.size === 1) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.front = (this.front + 1) % this.capacity;
    }

    this.size--;
    return true;
  }

  /**
   * Delete an item from the rear of Deque
   * Xóa một phần tử từ cuối Deque
   */
  deleteLast(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.size === 1) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    }

    this.size--;
    return true;
  }

  /**
   * Get the front item from the Deque
   * Lấy phần tử đầu tiên từ Deque
   */
  getFront(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.deque[this.front];
  }

  /**
   * Get the last item from the Deque
   * Lấy phần tử cuối cùng từ Deque
   */
  getRear(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.deque[this.rear];
  }

  /**
   * Check if the deque is empty
   * Kiểm tra xem deque có rỗng không
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Check if the deque is full
   * Kiểm tra xem deque có đầy không
   */
  isFull(): boolean {
    return this.size === this.capacity;
  }

  /**
   * Get current size of the deque
   * Lấy kích thước hiện tại của deque
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Get the capacity of the deque
   * Lấy dung lượng của deque
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { deque: number[]; front: number; rear: number; size: number } {
    return {
      deque: [...this.deque],
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
class MyCircularDequeSizeOnly {
  private deque: number[];
  private front: number;
  private size: number;
  private capacity: number;

  constructor(k: number) {
    this.deque = new Array(k);
    this.front = 0;
    this.size = 0;
    this.capacity = k;
  }

  insertFront(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    this.front = (this.front - 1 + this.capacity) % this.capacity;
    this.deque[this.front] = value;
    this.size++;

    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    const rear = (this.front + this.size) % this.capacity;
    this.deque[rear] = value;
    this.size++;

    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    this.front = (this.front + 1) % this.capacity;
    this.size--;

    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    this.size--;
    return true;
  }

  getFront(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.deque[this.front];
  }

  getRear(): number {
    if (this.isEmpty()) {
      return -1;
    }

    const rear = (this.front + this.size - 1) % this.capacity;
    return this.deque[rear];
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
class DequeNode {
  value: number;
  prev: DequeNode | null;
  next: DequeNode | null;

  constructor(value: number) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class MyCircularDequeLinkedList {
  private head: DequeNode | null;
  private tail: DequeNode | null;
  private size: number;
  private capacity: number;

  constructor(k: number) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.capacity = k;
  }

  insertFront(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    const newNode = new DequeNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }

    this.size++;
    return true;
  }

  insertLast(value: number): boolean {
    if (this.isFull()) {
      return false;
    }

    const newNode = new DequeNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.size++;
    return true;
  }

  deleteFront(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head!.next;
      this.head!.prev = null;
    }

    this.size--;
    return true;
  }

  deleteLast(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail!.prev;
      this.tail!.next = null;
    }

    this.size--;
    return true;
  }

  getFront(): number {
    if (this.isEmpty()) {
      return -1;
    }

    return this.head!.value;
  }

  getRear(): number {
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
class MyCircularDequeWithStats extends MyCircularDeque {
  private insertFrontCount: number;
  private insertLastCount: number;
  private deleteFrontCount: number;
  private deleteLastCount: number;
  private operationHistory: Array<{
    operation: string;
    value?: number;
    timestamp: number;
    success: boolean;
  }>;

  constructor(k: number) {
    super(k);
    this.insertFrontCount = 0;
    this.insertLastCount = 0;
    this.deleteFrontCount = 0;
    this.deleteLastCount = 0;
    this.operationHistory = [];
  }

  insertFront(value: number): boolean {
    const success = super.insertFront(value);

    this.insertFrontCount++;

    this.operationHistory.push({
      operation: "insertFront",
      value,
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  insertLast(value: number): boolean {
    const success = super.insertLast(value);

    this.insertLastCount++;

    this.operationHistory.push({
      operation: "insertLast",
      value,
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  deleteFront(): boolean {
    const success = super.deleteFront();

    this.deleteFrontCount++;

    this.operationHistory.push({
      operation: "deleteFront",
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  deleteLast(): boolean {
    const success = super.deleteLast();

    this.deleteLastCount++;

    this.operationHistory.push({
      operation: "deleteLast",
      timestamp: Date.now(),
      success,
    });

    return success;
  }

  /**
   * Get deque statistics
   * Lấy thống kê deque
   */
  getStats(): {
    insertFrontCount: number;
    insertLastCount: number;
    deleteFrontCount: number;
    deleteLastCount: number;
    totalOperations: number;
    currentUtilization: number;
  } {
    const totalOperations =
      this.insertFrontCount +
      this.insertLastCount +
      this.deleteFrontCount +
      this.deleteLastCount;
    const utilization = (this.getSize() / this.getCapacity()) * 100;

    return {
      insertFrontCount: this.insertFrontCount,
      insertLastCount: this.insertLastCount,
      deleteFrontCount: this.deleteFrontCount,
      deleteLastCount: this.deleteLastCount,
      totalOperations,
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
 * Implementation with Priority Features
 *
 * Triển khai với tính năng ưu tiên
 */
class MyCircularDequeWithPriority extends MyCircularDeque {
  private priorities: number[];

  constructor(k: number) {
    super(k);
    this.priorities = new Array(k);
  }

  /**
   * Insert with priority at front
   * Chèn với độ ưu tiên ở đầu
   */
  insertFrontWithPriority(value: number, priority: number): boolean {
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
      this.deque[nextIndex] = this.deque[currentIndex];
      this.priorities[nextIndex] = this.priorities[currentIndex];
    }

    // Insert at the correct position
    this.deque[insertIndex] = value;
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

    return this.deque[maxPriorityIndex];
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareCircularDequeImplementations(
  operations: Array<{
    type:
      | "insertFront"
      | "insertLast"
      | "deleteFront"
      | "deleteLast"
      | "getFront"
      | "getRear";
    value?: number;
  }>
): void {
  console.log(
    "Circular Deque Implementation Performance Comparison / So sánh hiệu suất triển khai Circular Deque"
  );
  console.log("=".repeat(90));

  const implementations = [
    { name: "Array with Pointers", deque: new MyCircularDeque(100) },
    { name: "Array Size Only", deque: new MyCircularDequeSizeOnly(100) },
    { name: "Linked List", deque: new MyCircularDequeLinkedList(100) },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "insertFront":
          impl.deque.insertFront(op.value!);
          break;
        case "insertLast":
          impl.deque.insertLast(op.value!);
          break;
        case "deleteFront":
          impl.deque.deleteFront();
          break;
        case "deleteLast":
          impl.deque.deleteLast();
          break;
        case "getFront":
          impl.deque.getFront();
          break;
        case "getRear":
          impl.deque.getRear();
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Final size: ${impl.deque.getSize()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Circular Deque Tests / Kiểm thử Circular Deque");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const deque1 = new MyCircularDeque(3);
  console.log(`insertLast(1): ${deque1.insertLast(1)}`); // Expected: true
  console.log(`insertLast(2): ${deque1.insertLast(2)}`); // Expected: true
  console.log(`insertFront(3): ${deque1.insertFront(3)}`); // Expected: true
  console.log(`insertFront(4): ${deque1.insertFront(4)}`); // Expected: false
  console.log(`getRear(): ${deque1.getRear()}`); // Expected: 2
  console.log(`isFull(): ${deque1.isFull()}`); // Expected: true
  console.log(`deleteLast(): ${deque1.deleteLast()}`); // Expected: true
  console.log(`insertFront(4): ${deque1.insertFront(4)}`); // Expected: true
  console.log(`getFront(): ${deque1.getFront()}`); // Expected: 4

  // Test 2: Statistics tracking
  console.log("\nTest 2: Statistics tracking / Theo dõi thống kê");
  const statDeque = new MyCircularDequeWithStats(5);

  statDeque.insertFront(1);
  statDeque.insertLast(2);
  statDeque.insertFront(3);
  statDeque.deleteFront();
  statDeque.deleteLast();

  const stats = statDeque.getStats();
  console.log(`Insert front count: ${stats.insertFrontCount}`);
  console.log(`Insert last count: ${stats.insertLastCount}`);
  console.log(`Delete front count: ${stats.deleteFrontCount}`);
  console.log(`Delete last count: ${stats.deleteLastCount}`);
  console.log(`Total operations: ${stats.totalOperations}`);
  console.log(`Utilization: ${stats.currentUtilization.toFixed(2)}%`);

  // Test 3: State inspection
  console.log("\nTest 3: State inspection / Kiểm tra trạng thái");
  const stateDeque = new MyCircularDeque(4);
  stateDeque.insertFront(1);
  stateDeque.insertLast(2);

  console.log("Current state:");
  console.log(stateDeque.getState());

  stateDeque.deleteFront();

  console.log("After deleteFront:");
  console.log(stateDeque.getState());

  // Test 4: Performance comparison
  console.log("\nTest 4: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "insertFront" as const, value: 1 },
    { type: "insertLast" as const, value: 2 },
    { type: "insertFront" as const, value: 3 },
    { type: "getFront" as const },
    { type: "getRear" as const },
    { type: "deleteFront" as const },
    { type: "deleteLast" as const },
    { type: "insertLast" as const, value: 4 },
    { type: "getFront" as const },
    { type: "getRear" as const },
  ];

  compareCircularDequeImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  MyCircularDeque,
  MyCircularDequeSizeOnly,
  MyCircularDequeLinkedList,
  MyCircularDequeWithStats,
  MyCircularDequeWithPriority,
  DequeNode,
  compareCircularDequeImplementations,
  runTests,
};
{% endraw %}
