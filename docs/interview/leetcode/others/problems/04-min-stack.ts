/**
 * Min Stack
 *
 * Problem: https://leetcode.com/problems/min-stack/
 *
 * Design a stack that supports push, pop, top, and retrieving the minimum element
 * in constant time.
 *
 * Implement the MinStack class:
 * - MinStack() initializes the stack object.
 * - void push(int val) pushes the element val onto the stack.
 * - void pop() removes the element on the top of the stack.
 * - int top() gets the top element of the stack.
 * - int getMin() retrieves the minimum element in the stack.
 *
 * You must implement a solution with O(1) time complexity for each function.
 *
 * Example 1:
 * Input:
 * ["MinStack","push","push","push","getMin","pop","top","getMin"]
 * [[],[-2],[0],[-3],[],[],[],[]]
 * Output: [null,null,null,null,-3,null,0,-2]
 *
 * Explanation:
 * MinStack minStack = new MinStack();
 * minStack.push(-2);
 * minStack.push(0);
 * minStack.push(-3);
 * minStack.getMin(); // return -3
 * minStack.pop();
 * minStack.top();    // return 0
 * minStack.getMin(); // return -2
 *
 * Constraints:
 * - -2^31 <= val <= 2^31 - 1
 * - Methods pop, top and getMin operations will always be called on non-empty stacks.
 * - At most 3 * 10^4 calls will be made to push, pop, top, and getMin.
 *
 * Solution Approaches:
 * 1. Two stacks approach (main stack + min stack)
 * 2. Single stack with pairs (value, min)
 * 3. Single stack with mathematical approach
 * 4. Using linked list with min tracking
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) where n is the number of elements
 */

/**
 * MinStack - Two Stack Implementation
 *
 * MinStack - Triển khai hai Stack
 *
 * This approach uses two stacks:
 * - mainStack: stores all elements
 * - minStack: stores minimum values at each state
 */
class MinStack {
  private mainStack: number[];
  private minStack: number[];

  constructor() {
    this.mainStack = [];
    this.minStack = [];
  }

  /**
   * Push element onto the stack
   * Đẩy phần tử lên stack
   */
  push(val: number): void {
    this.mainStack.push(val);

    // Update min stack
    if (
      this.minStack.length === 0 ||
      val <= this.minStack[this.minStack.length - 1]
    ) {
      this.minStack.push(val);
    }
  }

  /**
   * Remove the element on top of the stack
   * Xóa phần tử ở đỉnh stack
   */
  pop(): void {
    const popped = this.mainStack.pop()!;

    // Update min stack if the popped element was the minimum
    if (popped === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
  }

  /**
   * Get the top element of the stack
   * Lấy phần tử ở đỉnh stack
   */
  top(): number {
    return this.mainStack[this.mainStack.length - 1];
  }

  /**
   * Retrieve the minimum element in the stack
   * Lấy phần tử nhỏ nhất trong stack
   */
  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }

  /**
   * Get the current size of the stack
   * Lấy kích thước hiện tại của stack
   */
  size(): number {
    return this.mainStack.length;
  }

  /**
   * Check if stack is empty
   * Kiểm tra xem stack có rỗng không
   */
  isEmpty(): boolean {
    return this.mainStack.length === 0;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { mainStack: number[]; minStack: number[] } {
    return {
      mainStack: [...this.mainStack],
      minStack: [...this.minStack],
    };
  }
}

/**
 * Alternative Implementation: Single Stack with Pairs
 *
 * Triển khai thay thế: Một Stack với các cặp giá trị
 *
 * This approach stores pairs of (value, current_min) in a single stack
 */
class MinStackPairs {
  private stack: Array<{ value: number; min: number }>;

  constructor() {
    this.stack = [];
  }

  push(val: number): void {
    const currentMin =
      this.stack.length > 0 ? this.stack[this.stack.length - 1].min : val;
    const newMin = Math.min(val, currentMin);
    this.stack.push({ value: val, min: newMin });
  }

  pop(): void {
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1].value;
  }

  getMin(): number {
    return this.stack[this.stack.length - 1].min;
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

/**
 * Implementation: Mathematical Approach
 *
 * Triển khai: Phương pháp toán học
 *
 * This approach uses a mathematical trick to store min information
 * without extra space (but requires integer overflow handling)
 */
class MinStackMath {
  private stack: number[];
  private min: number;

  constructor() {
    this.stack = [];
    this.min = 0;
  }

  push(val: number): void {
    if (this.stack.length === 0) {
      this.stack.push(val);
      this.min = val;
    } else {
      if (val < this.min) {
        // Store 2*val - min (which will be less than val)
        this.stack.push(2 * val - this.min);
        this.min = val;
      } else {
        this.stack.push(val);
      }
    }
  }

  pop(): void {
    const popped = this.stack.pop()!;

    if (popped < this.min) {
      // Restore previous min
      this.min = 2 * this.min - popped;
    }
  }

  top(): number {
    const top = this.stack[this.stack.length - 1];
    return top < this.min ? this.min : top;
  }

  getMin(): number {
    return this.min;
  }

  size(): number {
    return this.stack.length;
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

/**
 * Implementation using Linked List
 *
 * Triển khai sử dụng Linked List
 */
class MinStackLinkedList {
  private head: ListNode | null;

  constructor() {
    this.head = null;
  }

  push(val: number): void {
    const currentMin = this.head ? this.head.min : val;
    const newMin = Math.min(val, currentMin);

    const newNode = new ListNode(val, newMin, this.head);
    this.head = newNode;
  }

  pop(): void {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  top(): number {
    if (!this.head) throw new Error("Stack is empty");
    return this.head.value;
  }

  getMin(): number {
    if (!this.head) throw new Error("Stack is empty");
    return this.head.min;
  }

  size(): number {
    let count = 0;
    let current = this.head;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}

/**
 * ListNode class for linked list implementation
 */
class ListNode {
  value: number;
  min: number;
  next: ListNode | null;

  constructor(value: number, min: number, next: ListNode | null = null) {
    this.value = value;
    this.min = min;
    this.next = next;
  }
}

/**
 * Implementation with Performance Tracking
 *
 * Triển khai với theo dõi hiệu suất
 */
class MinStackWithPerformance extends MinStack {
  private operationCount: number;
  private minUpdateCount: number;

  constructor() {
    super();
    this.operationCount = 0;
    this.minUpdateCount = 0;
  }

  push(val: number): void {
    this.operationCount++;
    const stateBefore = this.getState();
    super.push(val);
    const stateAfter = this.getState();

    // Check if min stack was updated
    if (stateBefore.minStack.length !== stateAfter.minStack.length) {
      this.minUpdateCount++;
    }
  }

  pop(): void {
    this.operationCount++;
    super.pop();
  }

  getPerformanceStats(): {
    operationCount: number;
    minUpdateCount: number;
    minUpdateRatio: number;
  } {
    return {
      operationCount: this.operationCount,
      minUpdateCount: this.minUpdateCount,
      minUpdateRatio:
        this.operationCount > 0 ? this.minUpdateCount / this.operationCount : 0,
    };
  }
}

/**
 * Extended MinStack with Additional Features
 *
 * MinStack mở rộng với các tính năng bổ sung
 */
class MinStackExtended extends MinStack {
  private maxSize: number;
  private history: Array<{
    operation: string;
    value?: number;
    timestamp: number;
  }>;

  constructor(maxSize: number = Infinity) {
    super();
    this.maxSize = maxSize;
    this.history = [];
  }

  push(val: number): boolean {
    if (this.size() >= this.maxSize) {
      return false; // Stack is full
    }

    super.push(val);
    this.history.push({ operation: "push", value: val, timestamp: Date.now() });
    return true;
  }

  pop(): number | null {
    if (this.isEmpty()) {
      return null;
    }

    const value = this.top();
    super.pop();
    this.history.push({ operation: "pop", value, timestamp: Date.now() });
    return value;
  }

  /**
   * Get the maximum element in the stack
   * Lấy phần tử lớn nhất trong stack
   */
  getMax(): number {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return Math.max(...this.getState().mainStack);
  }

  /**
   * Get both min and max in one call
   * Lấy cả min và max trong một lần gọi
   */
  getMinMax(): { min: number; max: number } {
    if (this.isEmpty()) throw new Error("Stack is empty");
    const values = this.getState().mainStack;
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  /**
   * Get operation history
   * Lấy lịch sử thao tác
   */
  getHistory(): Array<{
    operation: string;
    value?: number;
    timestamp: number;
  }> {
    return [...this.history];
  }

  /**
   * Clear operation history
   * Xóa lịch sử thao tác
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Check if stack is full
   * Kiểm tra xem stack có đầy không
   */
  isFull(): boolean {
    return this.size() >= this.maxSize;
  }

  /**
   * Get the capacity of the stack
   * Lấy dung lượng của stack
   */
  getCapacity(): number {
    return this.maxSize;
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareMinStackImplementations(
  operations: Array<{ type: "push" | "pop" | "top" | "getMin"; value?: number }>
): void {
  console.log(
    "MinStack Implementation Performance Comparison / So sánh hiệu suất triển khai MinStack"
  );
  console.log("=".repeat(80));

  const implementations = [
    { name: "Two Stacks", stack: new MinStack() },
    { name: "Pairs", stack: new MinStackPairs() },
    { name: "Math Approach", stack: new MinStackMath() },
    { name: "Linked List", stack: new MinStackLinkedList() },
  ];

  for (const impl of implementations) {
    console.log(`\nTesting ${impl.name}:`);

    const start = performance.now();

    for (const op of operations) {
      switch (op.type) {
        case "push":
          impl.stack.push(op.value!);
          break;
        case "pop":
          impl.stack.pop();
          break;
        case "top":
          impl.stack.top();
          break;
        case "getMin":
          impl.stack.getMin();
          break;
      }
    }

    const end = performance.now();
    console.log(`  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`  Final size: ${impl.stack.size()}`);
  }
}

/**
 * Test Cases
 *
 * Các trường hợp kiểm thử
 */
function runTests(): void {
  console.log("MinStack Tests / Kiểm thử MinStack");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const stack1 = new MinStack();
  stack1.push(-2);
  stack1.push(0);
  stack1.push(-3);

  console.log(`getMin: ${stack1.getMin()}`); // Expected: -3
  stack1.pop();
  console.log(`top: ${stack1.top()}`); // Expected: 0
  console.log(`getMin: ${stack1.getMin()}`); // Expected: -2

  // Test 2: Performance tracking
  console.log("\nTest 2: Performance tracking / Theo dõi hiệu suất");
  const perfStack = new MinStackWithPerformance();

  for (let i = 0; i < 10; i++) {
    perfStack.push(i);
  }

  for (let i = 0; i < 5; i++) {
    perfStack.pop();
  }

  for (let i = 0; i < 3; i++) {
    perfStack.getMin();
  }

  const stats = perfStack.getPerformanceStats();
  console.log(`Operations: ${stats.operationCount}`);
  console.log(`Min updates: ${stats.minUpdateCount}`);
  console.log(`Min update ratio: ${(stats.minUpdateRatio * 100).toFixed(2)}%`);

  // Test 3: Extended stack
  console.log("\nTest 3: Extended stack / Stack mở rộng");
  const extStack = new MinStackExtended(5);

  for (let i = 0; i < 7; i++) {
    const success = extStack.push(i);
    console.log(`Push ${i}: ${success ? "success" : "failed (full)"}`);
  }

  console.log(`Capacity: ${extStack.getCapacity()}`);
  console.log(`Size: ${extStack.size()}`);
  console.log(`Is full: ${extStack.isFull()}`);
  console.log(`Min: ${extStack.getMin()}`);
  console.log(`Max: ${extStack.getMax()}`);
  console.log(`MinMax: ${JSON.stringify(extStack.getMinMax())}`);

  // Test 4: State inspection
  console.log("\nTest 4: State inspection / Kiểm tra trạng thái");
  const stateStack = new MinStack();
  stateStack.push(1);
  stateStack.push(2);
  stateStack.push(0);

  console.log("Current state:");
  console.log(stateStack.getState());

  stateStack.pop();

  console.log("After pop:");
  console.log(stateStack.getState());

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "push" as const, value: 1 },
    { type: "push" as const, value: 2 },
    { type: "push" as const, value: 0 },
    { type: "getMin" as const },
    { type: "pop" as const },
    { type: "top" as const },
    { type: "getMin" as const },
    { type: "push" as const, value: -1 },
    { type: "getMin" as const },
  ];

  compareMinStackImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  MinStack,
  MinStackPairs,
  MinStackMath,
  MinStackLinkedList,
  MinStackWithPerformance,
  MinStackExtended,
  ListNode,
  compareMinStackImplementations,
  runTests,
};
