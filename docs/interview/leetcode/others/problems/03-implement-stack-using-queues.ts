/**
 * Implement Stack using Queues
 *
 * Problem: https://leetcode.com/problems/implement-stack-using-queues/
 *
 * Implement a last in first out (LIFO) stack using only two queues.
 * The implemented stack should support all the functions of a normal stack
 * (push, top, pop, and empty).
 *
 * Implement the MyStack class:
 * - void push(int x) Pushes element x to the top of the stack.
 * - int pop() Removes the element on the top of the stack and returns it.
 * - int top() Returns the element on the top of the stack.
 * - boolean empty() Returns true if the stack is empty, false otherwise.
 *
 * Notes:
 * - You must use only standard operations of a queue, which means only push to back,
 *   peek/pop from front, size, and is empty operations are valid.
 * - Depending on your language, queue may not be supported natively. You may simulate
 *   a queue using a list or deque (double-ended queue) as long as you use only a
 *   queue's standard operations.
 *
 * Example 1:
 * Input:
 * ["MyStack", "push", "push", "top", "pop", "empty"]
 * [[], [1], [2], [], [], []]
 * Output: [null, null, null, 2, 2, false]
 *
 * Explanation:
 * MyStack myStack = new MyStack();
 * myStack.push(1);
 * myStack.push(2);
 * myStack.top();   // return 2
 * myStack.pop();   // return 2
 * myStack.empty(); // return false
 *
 * Constraints:
 * - 1 <= x <= 9
 * - At most 100 calls will be made to push, pop, top, and empty.
 * - All the calls to pop and top are valid.
 *
 * Solution Approaches:
 * 1. Two-queue approach with lazy transfer
 * 2. Two-queue approach with eager transfer
 * 3. Single queue approach
 * 4. Using array as queue
 *
 * Time Complexity: O(1) for push, O(n) for pop/top operations
 * Space Complexity: O(n) where n is the number of elements
 */

/**
 * MyStack - Two Queue Implementation with Lazy Transfer
 *
 * MyStack - Triển khai hai Queue với chuyển đổi lười
 *
 * This approach uses two queues:
 * - mainQueue: contains the stack elements
 * - tempQueue: used for temporary storage during pop/top operations
 */
class MyStack {
  private mainQueue: number[];
  private tempQueue: number[];

  constructor() {
    this.mainQueue = [];
    this.tempQueue = [];
  }

  /**
   * Push element to the top of stack
   * Đẩy phần tử lên đỉnh stack
   */
  push(x: number): void {
    this.mainQueue.push(x);
  }

  /**
   * Removes the element on the top of the stack and returns it
   * Xóa phần tử ở đỉnh stack và trả về nó
   */
  pop(): number {
    // Move all elements except the last one to temp queue
    while (this.mainQueue.length > 1) {
      this.tempQueue.push(this.mainQueue.shift()!);
    }

    // Get the top element
    const result = this.mainQueue.shift()!;

    // Swap queues
    [this.mainQueue, this.tempQueue] = [this.tempQueue, this.mainQueue];

    return result;
  }

  /**
   * Returns the element on the top of the stack
   * Trả về phần tử ở đỉnh stack
   */
  top(): number {
    // Move all elements except the last one to temp queue
    while (this.mainQueue.length > 1) {
      this.tempQueue.push(this.mainQueue.shift()!);
    }

    // Get the top element
    const result = this.mainQueue[0];

    // Move the last element to temp queue as well
    this.tempQueue.push(this.mainQueue.shift()!);

    // Swap queues
    [this.mainQueue, this.tempQueue] = [this.tempQueue, this.mainQueue];

    return result;
  }

  /**
   * Returns true if the stack is empty, false otherwise
   * Trả về true nếu stack rỗng, false nếu không
   */
  empty(): boolean {
    return this.mainQueue.length === 0;
  }

  /**
   * Get the current size of the stack
   * Lấy kích thước hiện tại của stack
   */
  size(): number {
    return this.mainQueue.length;
  }

  /**
   * Get the internal state for debugging
   * Lấy trạng thái nội bộ để debug
   */
  getState(): { mainQueue: number[]; tempQueue: number[] } {
    return {
      mainQueue: [...this.mainQueue],
      tempQueue: [...this.tempQueue],
    };
  }
}

/**
 * Alternative Implementation: Eager Transfer
 *
 * Triển khai thay thế: Chuyển đổi ngay lập tức
 *
 * This approach maintains the stack order after each push operation
 */
class MyStackEager {
  private mainQueue: number[];
  private tempQueue: number[];

  constructor() {
    this.mainQueue = [];
    this.tempQueue = [];
  }

  push(x: number): void {
    // Move all existing elements to temp queue
    while (this.mainQueue.length > 0) {
      this.tempQueue.push(this.mainQueue.shift()!);
    }

    // Add the new element to main queue
    this.mainQueue.push(x);

    // Move all elements back to main queue
    while (this.tempQueue.length > 0) {
      this.mainQueue.push(this.tempQueue.shift()!);
    }
  }

  pop(): number {
    return this.mainQueue.shift()!;
  }

  top(): number {
    return this.mainQueue[0];
  }

  empty(): boolean {
    return this.mainQueue.length === 0;
  }

  size(): number {
    return this.mainQueue.length;
  }
}

/**
 * Implementation using Single Queue
 *
 * Triển khai sử dụng một Queue duy nhất
 */
class MyStackSingleQueue {
  private queue: number[];

  constructor() {
    this.queue = [];
  }

  push(x: number): void {
    this.queue.push(x);
  }

  pop(): number {
    // Move all elements except the last one to the back
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift()!);
    }

    return this.queue.shift()!;
  }

  top(): number {
    // Move all elements except the last one to the back
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift()!);
    }

    const result = this.queue[0];
    this.queue.push(this.queue.shift()!);

    return result;
  }

  empty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

/**
 * Implementation using Array as Queue
 *
 * Triển khai sử dụng Array làm Queue
 */
class MyStackArray {
  private queue: number[];

  constructor() {
    this.queue = [];
  }

  push(x: number): void {
    this.queue.push(x);
  }

  pop(): number {
    // Create a temporary array
    const temp: number[] = [];

    // Move all elements except the last one to temp
    while (this.queue.length > 1) {
      temp.push(this.queue.shift()!);
    }

    // Get the last element
    const result = this.queue.shift()!;

    // Move all elements back
    while (temp.length > 0) {
      this.queue.push(temp.shift()!);
    }

    return result;
  }

  top(): number {
    // Create a temporary array
    const temp: number[] = [];

    // Move all elements to temp
    while (this.queue.length > 0) {
      temp.push(this.queue.shift()!);
    }

    // Get the last element
    const result = temp[temp.length - 1];

    // Move all elements back
    while (temp.length > 0) {
      this.queue.push(temp.shift()!);
    }

    return result;
  }

  empty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

/**
 * Implementation with Performance Tracking
 *
 * Triển khai với theo dõi hiệu suất
 */
class MyStackWithPerformance extends MyStack {
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
    this.transferCount++;
    return super.pop();
  }

  top(): number {
    this.operationCount++;
    this.transferCount++;
    return super.top();
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
 * Stack Implementation with Additional Features
 *
 * Triển khai Stack với các tính năng bổ sung
 */
class MyStackExtended extends MyStack {
  private maxSize: number;

  constructor(maxSize: number = Infinity) {
    super();
    this.maxSize = maxSize;
  }

  push(x: number): boolean {
    if (this.size() >= this.maxSize) {
      return false; // Stack is full
    }
    super.push(x);
    return true;
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

  /**
   * Get the remaining capacity
   * Lấy dung lượng còn lại
   */
  getRemainingCapacity(): number {
    return this.maxSize - this.size();
  }

  /**
   * Get all elements in the stack (for debugging)
   * Lấy tất cả phần tử trong stack (để debug)
   */
  getAllElements(): number[] {
    const elements: number[] = [];
    const tempStack = new MyStack();

    // Pop all elements and store them
    while (!this.empty()) {
      const element = this.pop();
      elements.push(element);
      tempStack.push(element);
    }

    // Restore the stack
    while (!tempStack.empty()) {
      this.push(tempStack.pop());
    }

    return elements.reverse(); // Return in original order
  }
}

/**
 * Performance Comparison Function
 *
 * Hàm so sánh hiệu suất các phương pháp
 */
function compareStackImplementations(
  operations: Array<{ type: "push" | "pop" | "top"; value?: number }>
): void {
  console.log(
    "Stack Implementation Performance Comparison / So sánh hiệu suất triển khai Stack"
  );
  console.log("=".repeat(70));

  const implementations = [
    { name: "Lazy Transfer", stack: new MyStack() },
    { name: "Eager Transfer", stack: new MyStackEager() },
    { name: "Single Queue", stack: new MyStackSingleQueue() },
    { name: "Array-based", stack: new MyStackArray() },
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
  console.log("Stack using Queues Tests / Kiểm thử Stack sử dụng Queues");
  console.log("=".repeat(50));

  // Test 1: Basic operations
  console.log("\nTest 1: Basic operations / Các thao tác cơ bản");
  const stack1 = new MyStack();
  stack1.push(1);
  stack1.push(2);
  stack1.push(3);

  console.log(`Top: ${stack1.top()}`); // Expected: 3
  console.log(`Pop: ${stack1.pop()}`); // Expected: 3
  console.log(`Top: ${stack1.top()}`); // Expected: 2
  console.log(`Pop: ${stack1.pop()}`); // Expected: 2
  console.log(`Empty: ${stack1.empty()}`); // Expected: false
  console.log(`Pop: ${stack1.pop()}`); // Expected: 1
  console.log(`Empty: ${stack1.empty()}`); // Expected: true

  // Test 2: Performance tracking
  console.log("\nTest 2: Performance tracking / Theo dõi hiệu suất");
  const perfStack = new MyStackWithPerformance();

  for (let i = 0; i < 10; i++) {
    perfStack.push(i);
  }

  for (let i = 0; i < 5; i++) {
    perfStack.pop();
  }

  for (let i = 0; i < 3; i++) {
    perfStack.top();
  }

  const stats = perfStack.getPerformanceStats();
  console.log(`Operations: ${stats.operationCount}`);
  console.log(`Transfers: ${stats.transferCount}`);
  console.log(`Transfer ratio: ${(stats.transferRatio * 100).toFixed(2)}%`);

  // Test 3: Extended stack
  console.log("\nTest 3: Extended stack / Stack mở rộng");
  const extStack = new MyStackExtended(5);

  for (let i = 0; i < 7; i++) {
    const success = extStack.push(i);
    console.log(`Push ${i}: ${success ? "success" : "failed (full)"}`);
  }

  console.log(`Capacity: ${extStack.getCapacity()}`);
  console.log(`Size: ${extStack.size()}`);
  console.log(`Remaining: ${extStack.getRemainingCapacity()}`);
  console.log(`Is full: ${extStack.isFull()}`);
  console.log(`All elements: [${extStack.getAllElements().join(", ")}]`);

  // Test 4: State inspection
  console.log("\nTest 4: State inspection / Kiểm tra trạng thái");
  const stateStack = new MyStack();
  stateStack.push(1);
  stateStack.push(2);

  console.log("Before pop:");
  console.log(stateStack.getState());

  stateStack.pop();

  console.log("After pop:");
  console.log(stateStack.getState());

  // Test 5: Performance comparison
  console.log("\nTest 5: Performance comparison / So sánh hiệu suất");
  const testOperations = [
    { type: "push" as const, value: 1 },
    { type: "push" as const, value: 2 },
    { type: "push" as const, value: 3 },
    { type: "pop" as const },
    { type: "top" as const },
    { type: "push" as const, value: 4 },
    { type: "pop" as const },
    { type: "pop" as const },
  ];

  compareStackImplementations(testOperations);
}

// Uncomment to run tests
// runTests();

export {
  MyStack,
  MyStackEager,
  MyStackSingleQueue,
  MyStackArray,
  MyStackWithPerformance,
  MyStackExtended,
  compareStackImplementations,
  runTests,
};
