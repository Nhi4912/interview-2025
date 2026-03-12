---
layout: page
title: "Implement Queue using Stack"
difficulty: Easy
category: Others
tags: [Others]
leetcode_url: "https://leetcode.com/problems/implement-queue-using-stacks/"
---

# Implement Queue using Stack



## Problem Description

 *  * Implement a first in first out (FIFO) queue using only two stacks.  * The implemented queue should support all the functions of a normal queue  * (push, peek, pop, and empty).  * 

## Solutions

{% raw %}
/**
 * Implement Queue using Stacks
 *
 * Problem: https://leetcode.com/problems/implement-queue-using-stacks/
 *
 * Implement a first in first out (FIFO) queue using only two stacks.
 * The implemented queue should support all the functions of a normal queue
 * (push, peek, pop, and empty).
 *
 * Implement the MyQueue class:
 * - void push(int x) Pushes element x to the back of the queue.
 * - int pop() Removes the element from the front of the queue and returns it.
 * - int peek() Returns the element at the front of the queue.
 * - boolean empty() Returns true if the queue is empty, false otherwise.
 *
 * Notes:
 * - You must use only standard operations of a stack, which means only push to top,
 *   peek/pop from top, size, and is empty operations are valid.
 * - Depending on your language, stack may not be supported natively. You may simulate
 *   a stack using a list or deque (double-ended queue) as long as you use only a
 *   stack's standard operations.
 *
 * Example 1:
 * Input:
 * ["MyQueue", "push", "push", "peek", "pop", "empty"]
 * [[], [1], [2], [], [], []]
 * Output: [null, null, null, 1, 1, false]
 *
 * Explanation:
 * MyQueue myQueue = new MyQueue();
 * myQueue.push(1); // queue is: [1]
 * myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
 * myQueue.peek();  // return 1
 * myQueue.pop();   // return 1, queue is [2]
 * myQueue.empty(); // return false
 *
 * Constraints:
 * - 1 <= x <= 9
 * - At most 100 calls will be made to push, pop, peek, and empty.
 * - All the calls to pop and peek are valid.
 *
 * Solution Approaches:
 * 1. Two-stack approach with lazy transfer
 * 2. Two-stack approach with eager transfer
 * 3. Single stack with recursion
 * 4. Using array as stack
 *
 * Time Complexity: O(1) amortized for all operations
 * Space Complexity: O(n) where n is the number of elements
 */

/**
 * MyQueue - Two Stack Implementation with Lazy Transfer
 *
 * MyQueue - Triển khai hai Stack với chuyển đổi lười
 *
 * This approach uses two stacks:
 * - inputStack: for push operations
 * - outputStack: for pop/peek operations
 * Elements are transferred from inputStack to outputStack only when needed
 */
class MyQueue {
  private inputStack: number[];
  private outputStack: number[];

  constructor() {
    this.inputStack = [];
    this.outputStack = [];
  }

  /**
   * Push element to the back of queue
   * Đẩy phần tử vào cuối hàng đợi
   */
  push(x: number): void {
    this.inputStack.push(x);
  }

  /**
   * Transfer elements from inputStack to outputStack if outputStack is empty
   * Chuyển đổi phần tử từ inputStack sang outputStack nếu outputStack rỗng
   */
  private transferIfNeeded(): void {
    if (this.outputStack.length === 0) {
      while (this.inputStack.length > 0) {
        this.outputStack.push(this.inputStack.pop()!);
      }
    }
  }

  /**
   * Removes the element from the front of the queue and returns it
   * Xóa phần tử ở đầu hàng đợi và trả về nó
   */
  pop(): number {
    this.transferIfNeeded();
    return this.outputStack.pop()!;
  }

  /**
   * Returns the element at the front of the queue
   * Trả về phần tử ở đầu hàng đợi
   */
  peek(): number {
    this.transferIfNeeded();
    return this.outputStack[this.outputStack.length - 1];
  }

  /**
   * Returns true if the queue is empty, false otherwise
   * Trả về true nếu hàng đợi rỗng, false nếu không
   */
  empty(): boolean {
    return this.inputStack.length === 0 && this.outputStack.length === 0;
  }

  /**
   * Get the current size of the queue
   * Lấy kích thước hiện tại của hàng đợi
   */
  size(): number {
    return this.inputStack.length + this.outputStack.length;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { inputStack: number[]; outputStack: number[] } {
    return {
      inputStack: [...this.inputStack],
      outputStack: [...this.outputStack],
    };
  }
}

/**
 * Alternative Implementation: Eager Transfer
 *
 * Triển khai thay thế: Chuyển đổi ngay lập tức
 *
 * This approach transfers elements immediately after each push
 */
class MyQueueEager {
  private inputStack: number[];
  private outputStack: number[];

  constructor() {
    this.inputStack = [];
    this.outputStack = [];
  }

  push(x: number): void {
    // Transfer all elements from outputStack back to inputStack
    while (this.outputStack.length > 0) {
      this.inputStack.push(this.outputStack.pop()!);
    }

    // Push the new element
    this.inputStack.push(x);

    // Transfer all elements to outputStack in reverse order
    while (this.inputStack.length > 0) {
      this.outputStack.push(this.inputStack.pop()!);
    }
  }

  pop(): number {
    return this.outputStack.pop()!;
  }

  peek(): number {
    return this.outputStack[this.outputStack.length - 1];
  }

  empty(): boolean {
    return this.outputStack.length === 0;
  }

  size(): number {
    return this.outputStack.length;
  }
}

/**
 * Implementation using Array as Stack
 *
 * Triển khai sử dụng Array làm Stack
 */
class MyQueueArray {
  private stack: number[];

  constructor() {
    this.stack = [];
  }

  push(x: number): void {
    this.stack.push(x);
  }

  pop(): number {
    // Create a temporary stack
    const tempStack: number[] = [];

    // Move all elements except the last one to temp stack
    while (this.stack.length > 1) {
      tempStack.push(this.stack.pop()!);
    }

    // Get the first element (which is now at the top)
    const result = this.stack.pop()!;

    // Move all elements back
    while (tempStack.length > 0) {
      this.stack.push(tempStack.pop()!);
    }

    return result;
  }

  peek(): number {
    // Create a temporary stack
    const tempStack: number[] = [];

    // Move all elements to temp stack
    while (this.stack.length > 0) {
      tempStack.push(this.stack.pop()!);
    }

    // Get the first element
    const result = tempStack[tempStack.length - 1];

    // Move all elements back
    while (tempStack.length > 0) {
      this.stack.push(tempStack.pop()!);
    }

    return result;
  }

  empty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}

/**
 * Implementation with Performance Tracking
 *
 * Triển khai với theo dõi hiệu suất
 */
class MyQueueWithPerformance extends MyQueue {
  private operationCount: number;
  private transferCount: number;

  constructor() {
    super();
    this.operationCount = 0;
    this.transferCount = 0;
  }

  push(x: number): void {
    this.operationCount++;
    super.push(x);
  }

  pop(): number {
    this.operationCount++;
    const stateBefore = this.getState();
    const result = super.pop();
    const stateAfter = this.getState();

    // Check if transfer occurred
    if (stateBefore.outputStack.length !== stateAfter.outputStack.length) {
      this.transferCount++;
    }

    return result;
  }

  peek(): number {
    this.operationCount++;
    const stateBefore = this.getState();
    const result = super.peek();
    const stateAfter = this.getState();

    // Check if transfer occurred
    if (stateBefore.outputStack.length !== stateAfter.outputStack.length) {
      this.transferCount++;
    }

    return result;
  }

  getPerformanceStats(): {
    operationCount: number;
    transferCount: number;
    transferRatio: number;
  } {
    return {
      operationCount: this.operationCount,
      transferCount: this.transferCount,
      transferRatio:
        this.operationCount > 0 ? this.transferCount / this.operationCount : 0,
    };
  }
}

/**
 * Queue Implementation with Additional Features
 *
 * Triển khai Queue với các tính năng bổ sung
 */
class MyQueueExtended extends MyQueue {
  private maxSize: number;

  constructor(maxSize: number = Infinity) {
    super();
    this.maxSize = maxSize;
  }

  push(x: number): boolean {
    if (this.size() >= this.maxSize) {
      return false; // Queue is full
    }
    super.push(x);
    return true;
  }

  /**
   * Check if queue is full
   * Kiểm tra xem queue có đầy không
   */
  isFull(): boolean {
    return this.size() >= this.maxSize;
  }

  /**
   * Get the capacity of the queue
   * Lấy dung lượng của queue
   */
  getCapacity(): number {
    return this.maxSize;
  }

  /**
   * Get the remaining capacity
   * Lấy dung lượng còn lại
   */
  getRemainingCapacity(): number {
    return this.maxSize - this.size();
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareQueueImplementations(
  operations: Array<{ type: "push" | "pop" | "peek"; value?: number }>
): void {
  console.log(
    "Queue Implementation Performance Comparison / So sánh hiệu suất triển khai Queue"
  );
  console.log("=".repeat(70));

  const implementations = [
    { name: "Lazy Transfer", queue: new MyQueue() },
    { name: "Eager Transfer", queue: new MyQueueEager() },
    { name: "Array-based", queue: new MyQueueArray() },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "push":
          impl.queue.push(op.value!);
          break;
        case "pop":
          impl.queue.pop();
          break;
        case "peek":
          impl.queue.peek();
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Final size: ${impl.queue.size()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("Queue using Stacks Tests / Kiểm thử Queue sử dụng Stacks");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const queue1 = new MyQueue();
  queue1.push(1);
  queue1.push(2);
  queue1.push(3);

  console.log(`Peek: ${queue1.peek()}`); // Expected: 1
  console.log(`Pop: ${queue1.pop()}`); // Expected: 1
  console.log(`Pop: ${queue1.pop()}`); // Expected: 2
  console.log(`Empty: ${queue1.empty()}`); // Expected: false
  console.log(`Pop: ${queue1.pop()}`); // Expected: 3
  console.log(`Empty: ${queue1.empty()}`); // Expected: true

  // Test 2: Performance tracking
  console.log("\nTest 2: Performance tracking / Theo dõi hiệu suất");
  const perfQueue = new MyQueueWithPerformance();

  for (let i = 0; i < 10; i++) {
    perfQueue.push(i);
  }

  for (let i = 0; i < 5; i++) {
    perfQueue.pop();
  }

  for (let i = 0; i < 3; i++) {
    perfQueue.peek();
  }

  const stats = perfQueue.getPerformanceStats();
  console.log(`Operations: ${stats.operationCount}`);
  console.log(`Transfers: ${stats.transferCount}`);
  console.log(`Transfer ratio: ${(stats.transferRatio * 100).toFixed(2)}%`);

  // Test 3: Extended queue
  console.log("\nTest 3: Extended queue / Queue mở rộng");
  const extQueue = new MyQueueExtended(5);

  for (let i = 0; i < 7; i++) {
    const success = extQueue.push(i);
    console.log(`Push ${i}: ${success ? "success" : "failed (full)"}`);
  }

  console.log(`Capacity: ${extQueue.getCapacity()}`);
  console.log(`Size: ${extQueue.size()}`);
  console.log(`Remaining: ${extQueue.getRemainingCapacity()}`);
  console.log(`Is full: ${extQueue.isFull()}`);

  // Test 4: State inspection
  console.log("\nTest 4: State inspection / Kiểm tra trạng thái");
  const stateQueue = new MyQueue();
  stateQueue.push(1);
  stateQueue.push(2);

  console.log("Before pop:");
  console.log(stateQueue.getState());

  stateQueue.pop();

  console.log("After pop:");
  console.log(stateQueue.getState());

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "push" as const, value: 1 },
    { type: "push" as const, value: 2 },
    { type: "push" as const, value: 3 },
    { type: "pop" as const },
    { type: "peek" as const },
    { type: "push" as const, value: 4 },
    { type: "pop" as const },
    { type: "pop" as const },
  ];

  compareQueueImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  MyQueue,
  MyQueueEager,
  MyQueueArray,
  MyQueueWithPerformance,
  MyQueueExtended,
  compareQueueImplementations,
  runTests,
};
{% endraw %}
