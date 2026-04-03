/**
 * 155. Min Stack
 *
 * Problem:
 * Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
 *
 * Implement the MinStack class:
 * - MinStack() initializes the stack object.
 * - void push(int val) pushes the element val onto the stack.
 * - void pop() removes the element on the top of the stack.
 * - int top() gets the top element of the stack.
 * - int getMin() retrieves the minimum element in the stack.
 *
 * Example:
 * Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]
 *        [[],[-2],[0],[-3],[],[],[],[]]
 * Output: [null,null,null,null,-3,null,0,-2]
 *
 * LeetCode: https://leetcode.com/problems/min-stack/
 */

/**
 * Solution 1: Two Stacks Approach (Optimal)
 *
 * Approach:
 * - Use two stacks: one for all elements, one for minimum elements
 * - When pushing, also push to min stack if it's smaller than current min
 * - When popping, also pop from min stack if it's the current min
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) - worst case when all elements are in decreasing order
 */
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);

    // Push to min stack if it's empty or val is smaller/equal to current min
    if (
      this.minStack.length === 0 ||
      val <= this.minStack[this.minStack.length - 1]
    ) {
      this.minStack.push(val);
    }
  }

  pop(): void {
    const popped = this.stack.pop();

    // Pop from min stack if the popped element is the current minimum
    if (popped === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

/**
 * Solution 2: Single Stack with Pairs
 *
 * Approach:
 * - Store pairs of (value, current_min) in a single stack
 * - Each element knows the minimum value when it was pushed
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) - stores pairs instead of single values
 */
class MinStackPairs {
  private stack: Array<{ val: number; min: number }> = [];

  push(val: number): void {
    const currentMin =
      this.stack.length > 0 ? this.stack[this.stack.length - 1].min : val;
    this.stack.push({
      val,
      min: Math.min(val, currentMin),
    });
  }

  pop(): void {
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1].val;
  }

  getMin(): number {
    return this.stack[this.stack.length - 1].min;
  }
}

/**
 * Solution 3: Single Stack with Mathematical Trick
 *
 * Approach:
 * - Use a single stack and mathematical trick to store min information
 * - When pushing a new min, push 2*val - old_min to stack
 * - When popping, if top < min, then min = 2*min - top
 *
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) - but more space efficient than pairs
 */
class MinStackMath {
  private stack: number[] = [];
  private min: number = Infinity;

  push(val: number): void {
    if (val <= this.min) {
      this.stack.push(2 * val - this.min);
      this.min = val;
    } else {
      this.stack.push(val);
    }
  }

  pop(): void {
    const popped = this.stack.pop()!;

    if (popped <= this.min) {
      this.min = 2 * this.min - popped;
    }
  }

  top(): number {
    const top = this.stack[this.stack.length - 1];
    return top <= this.min ? this.min : top;
  }

  getMin(): number {
    return this.min;
  }
}

/**
 * Solution 4: Using Built-in Math.min (Simple but inefficient)
 *
 * Approach:
 * - Use a single stack and calculate min on demand
 * - Simple implementation but getMin is O(n)
 *
 * Time Complexity: O(1) for push, pop, top; O(n) for getMin
 * Space Complexity: O(n)
 */
class MinStackSimple {
  private stack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
  }

  pop(): void {
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return Math.min(...this.stack);
  }
}

/**
 * Solution 5: Using Priority Queue (Overkill but educational)
 *
 * Approach:
 * - Use a heap/priority queue to track minimum
 * - More complex but shows different data structure usage
 *
 * Time Complexity: O(1) for push, top; O(log n) for pop, getMin
 * Space Complexity: O(n)
 */
class MinStackPriorityQueue {
  private stack: number[] = [];
  private minHeap: number[] = [];

  private heapifyUp(): void {
    let index = this.minHeap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.minHeap[parentIndex] <= this.minHeap[index]) break;

      [this.minHeap[parentIndex], this.minHeap[index]] = [
        this.minHeap[index],
        this.minHeap[parentIndex],
      ];
      index = parentIndex;
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.minHeap.length &&
        this.minHeap[leftChild] < this.minHeap[smallest]
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.minHeap.length &&
        this.minHeap[rightChild] < this.minHeap[smallest]
      ) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.minHeap[index], this.minHeap[smallest]] = [
        this.minHeap[smallest],
        this.minHeap[index],
      ];
      index = smallest;
    }
  }

  push(val: number): void {
    this.stack.push(val);
    this.minHeap.push(val);
    this.heapifyUp();
  }

  pop(): void {
    const popped = this.stack.pop()!;

    // Remove from heap (simplified - in practice would need more complex removal)
    const heapIndex = this.minHeap.indexOf(popped);
    if (heapIndex !== -1) {
      this.minHeap.splice(heapIndex, 1);
      // Rebuild heap (simplified approach)
      this.minHeap.sort((a, b) => a - b);
    }
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minHeap[0];
  }
}

// Test cases
function testMinStack() {
  console.log("=== Testing Min Stack ===\n");

  const testCases = [
    {
      operations: ["push", "push", "push", "getMin", "pop", "top", "getMin"],
      values: [-2, 0, -3, null, null, null, null],
      expected: [null, null, null, -3, null, 0, -2],
      description: "Basic operations",
    },
    {
      operations: ["push", "push", "getMin", "push", "getMin", "pop", "getMin"],
      values: [1, 2, null, 0, null, null, null],
      expected: [null, null, 1, null, 0, null, 1],
      description: "Multiple minimums",
    },
    {
      operations: ["push", "push", "push", "push", "getMin", "pop", "getMin"],
      values: [5, 3, 4, 2, null, null, null],
      expected: [null, null, null, null, 2, null, 3],
      description: "Decreasing sequence",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Operations: [${testCase.operations.join(", ")}]`);
    console.log(`Values: [${testCase.values.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Two Stacks)
    const minStack1 = new MinStack();
    const results1: (number | null)[] = [];

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      const value = testCase.values[i];

      switch (operation) {
        case "push":
          minStack1.push(value!);
          results1.push(null);
          break;
        case "pop":
          minStack1.pop();
          results1.push(null);
          break;
        case "top":
          results1.push(minStack1.top());
          break;
        case "getMin":
          results1.push(minStack1.getMin());
          break;
      }
    }

    console.log(
      `Solution 1 (Two Stacks): [${results1.join(", ")}] ${
        JSON.stringify(results1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Pairs)
    const minStack2 = new MinStackPairs();
    const results2: (number | null)[] = [];

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      const value = testCase.values[i];

      switch (operation) {
        case "push":
          minStack2.push(value!);
          results2.push(null);
          break;
        case "pop":
          minStack2.pop();
          results2.push(null);
          break;
        case "top":
          results2.push(minStack2.top());
          break;
        case "getMin":
          results2.push(minStack2.getMin());
          break;
      }
    }

    console.log(
      `Solution 2 (Pairs): [${results2.join(", ")}] ${
        JSON.stringify(results2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Math)
    const minStack3 = new MinStackMath();
    const results3: (number | null)[] = [];

    for (let i = 0; i < testCase.operations.length; i++) {
      const operation = testCase.operations[i];
      const value = testCase.values[i];

      switch (operation) {
        case "push":
          minStack3.push(value!);
          results3.push(null);
          break;
        case "pop":
          minStack3.pop();
          results3.push(null);
          break;
        case "top":
          results3.push(minStack3.top());
          break;
        case "getMin":
          results3.push(minStack3.getMin());
          break;
      }
    }

    console.log(
      `Solution 3 (Math): [${results3.join(", ")}] ${
        JSON.stringify(results3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const operations = 100000;

  const testCases = [
    { name: "Two Stacks", class: MinStack },
    { name: "Pairs", class: MinStackPairs },
    { name: "Math", class: MinStackMath },
    { name: "Simple", class: MinStackSimple },
    { name: "Priority Queue", class: MinStackPriorityQueue },
  ];

  testCases.forEach(({ name, class: MinStackClass }) => {
    const stack = new MinStackClass();
    const start = performance.now();

    // Push operations
    for (let i = 0; i < operations; i++) {
      stack.push(Math.floor(Math.random() * 1000));
    }

    // Get min operations
    for (let i = 0; i < 1000; i++) {
      stack.getMin();
    }

    // Pop operations
    for (let i = 0; i < operations; i++) {
      stack.pop();
    }

    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Operations: ${operations * 2 + 1000}`);
    console.log(
      `  Memory: ${name === "Simple" ? "O(n) for getMin" : "O(n)"}\n`
    );
  });
}

// Memory usage analysis
function memoryAnalysis() {
  console.log("=== Memory Usage Analysis ===\n");

  const sizes = [1000, 10000, 100000];

  sizes.forEach((size) => {
    console.log(`Testing with ${size} elements:`);

    // Test Two Stacks
    const stack1 = new MinStack();
    for (let i = 0; i < size; i++) {
      stack1.push(Math.floor(Math.random() * 1000));
    }
    console.log(`  Two Stacks: ~${size * 2} elements stored`);

    // Test Pairs
    const stack2 = new MinStackPairs();
    for (let i = 0; i < size; i++) {
      stack2.push(Math.floor(Math.random() * 1000));
    }
    console.log(`  Pairs: ~${size * 2} elements stored`);

    // Test Math
    const stack3 = new MinStackMath();
    for (let i = 0; i < size; i++) {
      stack3.push(Math.floor(Math.random() * 1000));
    }
    console.log(`  Math: ~${size} elements stored`);

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testMinStack();
// performanceComparison();
// memoryAnalysis();

export {
  MinStack,
  MinStackPairs,
  MinStackMath,
  MinStackSimple,
  MinStackPriorityQueue,
  testMinStack,
  performanceComparison,
  memoryAnalysis,
};
