/**
 * 141. Linked List Cycle
 *
 * Problem:
 * Given head, the head of a linked list, determine if the linked list has a cycle in it.
 *
 * There is a cycle in a linked list if there is some node in the list that can be reached
 * again by continuously following the next pointer. Internally, pos is used to denote the
 * index of the node that tail's next pointer is connected to. Note that pos is not passed
 * as a parameter.
 *
 * Return true if there is a cycle in the linked list. Otherwise, return false.
 *
 * Example:
 * Input: head = [3,2,0,-4], pos = 1
 * Output: true
 * Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
 *
 * Input: head = [1,2], pos = 0
 * Output: true
 * Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
 *
 * Input: head = [1], pos = -1
 * Output: false
 * Explanation: There is no cycle in the linked list.
 *
 * LeetCode: https://leetcode.com/problems/linked-list-cycle/
 */

// Definition for singly-linked list
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/**
 * Solution 1: Floyd's Cycle Detection Algorithm (Fast and Slow Pointer)
 *
 * Approach:
 * - Use two pointers: slow (moves 1 step) and fast (moves 2 steps)
 * - If there's a cycle, fast will eventually catch up to slow
 * - If fast reaches null, there's no cycle
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function hasCycle(head: ListNode | null): boolean {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next!;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}

/**
 * Solution 2: Using Set
 *
 * Approach:
 * - Use Set to track visited nodes
 * - If we encounter a node that's already in the set, there's a cycle
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function hasCycleSet(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();
  let current = head;

  while (current) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = current.next;
  }

  return false;
}

/**
 * Solution 3: Using Map
 *
 * Approach:
 * - Use Map to track visited nodes with additional information
 * - More explicit tracking of node positions
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function hasCycleMap(head: ListNode | null): boolean {
  const visited = new Map<ListNode, number>();
  let current = head;
  let position = 0;

  while (current) {
    if (visited.has(current)) {
      return true;
    }
    visited.set(current, position);
    current = current.next;
    position++;
  }

  return false;
}

/**
 * Solution 4: Using Array
 *
 * Approach:
 * - Use array to store visited nodes
 * - Check if current node exists in array
 *
 * Time Complexity: O(n²) - includes array search
 * Space Complexity: O(n)
 */
function hasCycleArray(head: ListNode | null): boolean {
  const visited: ListNode[] = [];
  let current = head;

  while (current) {
    if (visited.includes(current)) {
      return true;
    }
    visited.push(current);
    current = current.next;
  }

  return false;
}

/**
 * Solution 5: Using Object as Hash Map
 *
 * Approach:
 * - Use JavaScript object as hash map
 * - More familiar for JavaScript developers
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function hasCycleObject(head: ListNode | null): boolean {
  const visited: { [key: string]: boolean } = {};
  let current = head;

  while (current) {
    const key = current.toString();
    if (visited[key]) {
      return true;
    }
    visited[key] = true;
    current = current.next;
  }

  return false;
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a CycleDetector class
 * - Encapsulate the detection logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class CycleDetector {
  private head: ListNode | null;

  constructor(head: ListNode | null) {
    this.head = head;
  }

  detect(): boolean {
    if (!this.head || !this.head.next) return false;

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next!;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }

  getHead(): ListNode | null {
    return this.head;
  }
}

function hasCycleClass(head: ListNode | null): boolean {
  const detector = new CycleDetector(head);
  return detector.detect();
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield nodes
 * - Memory efficient for large lists
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* hasCycleGenerator(head: ListNode | null): Generator<ListNode> {
  let current = head;

  while (current) {
    yield current;
    current = current.next;
  }
}

function hasCycleWithGenerator(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();

  for (const node of hasCycleGenerator(head)) {
    if (visited.has(node)) {
      return true;
    }
    visited.add(node);
  }

  return false;
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function hasCycleFunctional(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();

  function traverse(node: ListNode | null): boolean {
    if (!node) return false;
    if (visited.has(node)) return true;

    visited.add(node);
    return traverse(node.next);
  }

  return traverse(head);
}

/**
 * Solution 9: Using Three Pointers
 *
 * Approach:
 * - Use three pointers for more complex cycle detection
 * - Can detect cycle length and starting point
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function hasCycleThreePointers(head: ListNode | null): boolean {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;
  let third = head;

  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next!;

    if (slow === fast) {
      // Find cycle starting point
      while (slow !== third) {
        slow = slow.next!;
        third = third.next!;
      }
      return true;
    }
  }

  return false;
}

/**
 * Solution 10: Using Recursion with Memoization
 *
 * Approach:
 * - Use recursion with memoization
 * - Track visited nodes in recursive calls
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function hasCycleRecursive(head: ListNode | null): boolean {
  const visited = new Set<ListNode>();

  function detect(node: ListNode | null): boolean {
    if (!node) return false;
    if (visited.has(node)) return true;

    visited.add(node);
    return detect(node.next);
  }

  return detect(head);
}

/**
 * Solution 11: Using Bit Manipulation (Node Marking)
 *
 * Approach:
 * - Mark visited nodes by modifying their values
 * - Use special value to indicate visited nodes
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - but modifies original list
 */
function hasCycleBitManipulation(head: ListNode | null): boolean {
  const MARKED_VALUE = -100001; // Special value to mark visited nodes
  let current = head;

  while (current) {
    if (current.val === MARKED_VALUE) {
      return true;
    }
    current.val = MARKED_VALUE;
    current = current.next;
  }

  return false;
}

// Helper function to create a linked list with cycle
function createLinkedListWithCycle(
  values: number[],
  cyclePos: number
): ListNode | null {
  if (values.length === 0) return null;

  const head = new ListNode(values[0]);
  let current = head;
  let cycleNode: ListNode | null = null;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next!;

    if (i === cyclePos) {
      cycleNode = current;
    }
  }

  if (cyclePos >= 0 && cycleNode) {
    current.next = cycleNode;
  }

  return head;
}

// Helper function to create a linked list without cycle
function createLinkedList(values: number[]): ListNode | null {
  if (values.length === 0) return null;

  const head = new ListNode(values[0]);
  let current = head;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next!;
  }

  return head;
}

// Test cases
function testHasCycle() {
  console.log("=== Testing Linked List Cycle ===\n");

  const testCases = [
    {
      values: [3, 2, 0, -4],
      cyclePos: 1,
      expected: true,
      description: "Cycle exists",
    },
    {
      values: [1, 2],
      cyclePos: 0,
      expected: true,
      description: "Cycle at beginning",
    },
    {
      values: [1],
      cyclePos: -1,
      expected: false,
      description: "No cycle, single node",
    },
    {
      values: [],
      cyclePos: -1,
      expected: false,
      description: "Empty list",
    },
    {
      values: [1, 2, 3, 4, 5],
      cyclePos: -1,
      expected: false,
      description: "No cycle, multiple nodes",
    },
    {
      values: [1, 2, 3, 4, 5],
      cyclePos: 2,
      expected: true,
      description: "Cycle in middle",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Values: [${testCase.values.join(", ")}], Cycle Position: ${
        testCase.cyclePos
      }`
    );
    console.log(`Expected: ${testCase.expected}\n`);

    const head =
      testCase.cyclePos >= 0
        ? createLinkedListWithCycle(testCase.values, testCase.cyclePos)
        : createLinkedList(testCase.values);

    // Test Solution 1 (Floyd's Algorithm)
    const result1 = hasCycle(head);
    console.log(
      `Solution 1 (Floyd's Algorithm): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Set)
    const result2 = hasCycleSet(head);
    console.log(
      `Solution 2 (Set): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Map)
    const result3 = hasCycleMap(head);
    console.log(
      `Solution 3 (Map): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const result4 = hasCycleArray(head);
    console.log(
      `Solution 4 (Array): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Object)
    const result5 = hasCycleObject(head);
    console.log(
      `Solution 5 (Object): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Class)
    const result6 = hasCycleClass(head);
    console.log(
      `Solution 6 (Class): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = hasCycleWithGenerator(head);
    console.log(
      `Solution 7 (Generator): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = hasCycleFunctional(head);
    console.log(
      `Solution 8 (Functional): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Three Pointers)
    const result9 = hasCycleThreePointers(head);
    console.log(
      `Solution 9 (Three Pointers): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Recursive)
    const result10 = hasCycleRecursive(head);
    console.log(
      `Solution 10 (Recursive): ${result10} ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (Bit Manipulation) - Only for non-cycle cases to avoid modification
    if (testCase.cyclePos === -1) {
      const headCopy = createLinkedList(testCase.values);
      const result11 = hasCycleBitManipulation(headCopy);
      console.log(
        `Solution 11 (Bit Manipulation): ${result11} ${
          result11 === testCase.expected ? "✅" : "❌"
        }`
      );
    } else {
      console.log(`Solution 11 (Bit Manipulation): Skipped (modifies list)`);
    }

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Floyd's Algorithm", func: hasCycle },
    { name: "Set", func: hasCycleSet },
    { name: "Map", func: hasCycleMap },
    { name: "Array", func: hasCycleArray },
    { name: "Object", func: hasCycleObject },
    { name: "Class", func: hasCycleClass },
    { name: "Generator", func: hasCycleWithGenerator },
    { name: "Functional", func: hasCycleFunctional },
    { name: "Three Pointers", func: hasCycleThreePointers },
    { name: "Recursive", func: hasCycleRecursive },
  ];

  // Create test cases
  const smallCase = createLinkedListWithCycle([1, 2, 3, 4], 1);
  const mediumCase = createLinkedListWithCycle(
    Array.from({ length: 100 }, (_, i) => i),
    50
  );
  const largeCase = createLinkedListWithCycle(
    Array.from({ length: 1000 }, (_, i) => i),
    500
  );

  const cases = [
    { name: "Small", case: smallCase },
    { name: "Medium", case: mediumCase },
    { name: "Large", case: largeCase },
  ];

  cases.forEach(({ name, case: testCase }) => {
    console.log(`${name} Case:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(testCase);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Cycle analysis
function cycleAnalysis() {
  console.log("=== Cycle Analysis ===\n");

  const testCases = [
    { values: [1, 2, 3, 4, 5], cyclePos: 1 },
    { values: [1, 2, 3, 4, 5], cyclePos: -1 },
    { values: [1], cyclePos: 0 },
    { values: [1, 2, 3], cyclePos: 2 },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}:`);
    console.log(
      `Values: [${testCase.values.join(", ")}], Cycle Position: ${
        testCase.cyclePos
      }`
    );

    const head =
      testCase.cyclePos >= 0
        ? createLinkedListWithCycle(testCase.values, testCase.cyclePos)
        : createLinkedList(testCase.values);

    const result = hasCycle(head);
    console.log(`Has cycle: ${result}`);
    console.log("");
  });
}

// Uncomment the following lines to run tests
// testHasCycle();
// performanceComparison();
// cycleAnalysis();

export {
  hasCycle,
  hasCycleSet,
  hasCycleMap,
  hasCycleArray,
  hasCycleObject,
  hasCycleClass,
  hasCycleWithGenerator,
  hasCycleFunctional,
  hasCycleThreePointers,
  hasCycleRecursive,
  hasCycleBitManipulation,
  CycleDetector,
  hasCycleGenerator,
  ListNode,
  createLinkedListWithCycle,
  createLinkedList,
  testHasCycle,
  performanceComparison,
  cycleAnalysis,
};
