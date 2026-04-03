/**
 * 206. Reverse Linked List
 *
 * Problem:
 * Given the head of a singly linked list, reverse the list, and return the reversed list.
 *
 * Example:
 * Input: head = [1,2,3,4,5]
 * Output: [5,4,3,2,1]
 *
 * Input: head = [1,2]
 * Output: [2,1]
 *
 * LeetCode: https://leetcode.com/problems/reverse-linked-list/
 */

// Definition for singly-linked list
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Iterative Approach (Optimal)
 *
 * Approach:
 * - Use three pointers: prev, current, next
 * - Reverse links one by one
 * - Move pointers forward
 *
 * Time Complexity: O(n) - traverse the entire list
 * Space Complexity: O(1) - constant extra space
 */
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current: ListNode | null = head;

  while (current !== null) {
    const next = current.next; // Store next node
    current.next = prev; // Reverse the link
    prev = current; // Move prev forward
    current = next; // Move current forward
  }

  return prev; // prev becomes the new head
}

/**
 * Solution 2: Recursive Approach
 *
 * Approach:
 * - Use recursion to reverse the rest of the list
 * - Base case: when head is null or head.next is null
 * - Reverse the link and return new head
 *
 * Time Complexity: O(n) - recursive calls for each node
 * Space Complexity: O(n) - recursion stack space
 */
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // Base case: empty list or single node
  if (head === null || head.next === null) {
    return head;
  }

  // Recursively reverse the rest of the list
  const newHead = reverseListRecursive(head.next);

  // Reverse the link
  head.next.next = head;
  head.next = null;

  return newHead;
}

/**
 * Solution 3: Using Stack (Not optimal, but educational)
 *
 * Approach:
 * - Push all nodes to stack
 * - Pop them back to create reversed list
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - stack storage
 */
function reverseListStack(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const stack: ListNode[] = [];
  let current: ListNode | null = head;

  // Push all nodes to stack
  while (current !== null) {
    stack.push(current);
    current = current.next;
  }

  // Create new head from stack
  const newHead = stack.pop()!;
  current = newHead;

  // Pop remaining nodes and link them
  while (stack.length > 0) {
    current.next = stack.pop()!;
    current = current.next;
  }

  // Set last node's next to null
  current.next = null;

  return newHead;
}

/**
 * Solution 4: In-place with Two Pointers
 *
 * Approach:
 * - Use two pointers to reverse links
 * - Similar to Solution 1 but with different variable names
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function reverseListTwoPointers(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current: ListNode | null = head;

  while (current !== null) {
    const temp = current.next;
    current.next = previous;
    previous = current;
    current = temp;
  }

  return previous;
}

/**
 * Solution 5: Using Array (Not recommended, but shows alternative)
 *
 * Approach:
 * - Convert linked list to array
 * - Reverse array
 * - Reconstruct linked list
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - array storage
 */
function reverseListArray(head: ListNode | null): ListNode | null {
  if (head === null) return null;

  const values: number[] = [];
  let current: ListNode | null = head;

  // Collect all values
  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }

  // Reverse array
  values.reverse();

  // Reconstruct linked list
  const newHead = new ListNode(values[0]);
  current = newHead;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;
  }

  return newHead;
}

/**
 * Solution 6: Tail Recursive (Optimized recursion)
 *
 * Approach:
 * - Use tail recursion to avoid stack overflow
 * - Pass accumulated result as parameter
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - tail call optimization
 */
function reverseListTailRecursive(head: ListNode | null): ListNode | null {
  function reverseHelper(
    current: ListNode | null,
    prev: ListNode | null
  ): ListNode | null {
    if (current === null) {
      return prev;
    }

    const next = current.next;
    current.next = prev;
    return reverseHelper(next, current);
  }

  return reverseHelper(head, null);
}

// Helper function to create linked list from array
function createLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;

  const head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

// Helper function to convert linked list to array
function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;

  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

// Test cases
function testReverseLinkedList() {
  console.log("=== Testing Reverse Linked List ===\n");

  const testCases = [
    {
      input: [1, 2, 3, 4, 5],
      expected: [5, 4, 3, 2, 1],
      description: "Basic case",
    },
    {
      input: [1, 2],
      expected: [2, 1],
      description: "Two nodes",
    },
    {
      input: [1],
      expected: [1],
      description: "Single node",
    },
    {
      input: [],
      expected: [],
      description: "Empty list",
    },
    {
      input: [1, 2, 3],
      expected: [3, 2, 1],
      description: "Three nodes",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input}]`);
    console.log(`Expected: [${testCase.expected}]\n`);

    // Test Solution 1 (Iterative)
    const head1 = createLinkedList(testCase.input);
    const result1 = reverseList(head1);
    const array1 = linkedListToArray(result1);
    console.log(
      `Solution 1 (Iterative): [${array1}] ${
        JSON.stringify(array1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Recursive)
    const head2 = createLinkedList(testCase.input);
    const result2 = reverseListRecursive(head2);
    const array2 = linkedListToArray(result2);
    console.log(
      `Solution 2 (Recursive): [${array2}] ${
        JSON.stringify(array2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Stack)
    const head3 = createLinkedList(testCase.input);
    const result3 = reverseListStack(head3);
    const array3 = linkedListToArray(result3);
    console.log(
      `Solution 3 (Stack): [${array3}] ${
        JSON.stringify(array3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Two Pointers)
    const head4 = createLinkedList(testCase.input);
    const result4 = reverseListTwoPointers(head4);
    const array4 = linkedListToArray(result4);
    console.log(
      `Solution 4 (Two Pointers): [${array4}] ${
        JSON.stringify(array4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Array)
    const head5 = createLinkedList(testCase.input);
    const result5 = reverseListArray(head5);
    const array5 = linkedListToArray(result5);
    console.log(
      `Solution 5 (Array): [${array5}] ${
        JSON.stringify(array5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Tail Recursive)
    const head6 = createLinkedList(testCase.input);
    const result6 = reverseListTailRecursive(head6);
    const array6 = linkedListToArray(result6);
    console.log(
      `Solution 6 (Tail Recursive): [${array6}] ${
        JSON.stringify(array6) === JSON.stringify(testCase.expected)
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

  // Create large linked list
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  const largeList = createLinkedList(largeArray);

  const testCases = [
    { name: "Iterative", func: reverseList },
    { name: "Recursive", func: reverseListRecursive },
    { name: "Stack", func: reverseListStack },
    { name: "Two Pointers", func: reverseListTwoPointers },
    { name: "Array", func: reverseListArray },
    { name: "Tail Recursive", func: reverseListTailRecursive },
  ];

  testCases.forEach(({ name, func }) => {
    const testList = createLinkedList(largeArray);
    const start = performance.now();
    func(testList);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(
      `  Memory: ${
        name === "Recursive" || name === "Stack" || name === "Array"
          ? "O(n)"
          : "O(1)"
      }\n`
    );
  });
}

// Memory usage test
function memoryUsageTest() {
  console.log("=== Memory Usage Test ===\n");

  const sizes = [100, 1000, 10000];

  sizes.forEach((size) => {
    console.log(`Testing with ${size} nodes:`);

    const testArray = Array.from({ length: size }, (_, i) => i);

    // Test iterative (should handle large lists)
    try {
      const list = createLinkedList(testArray);
      const start = performance.now();
      reverseList(list);
      const end = performance.now();
      console.log(`  Iterative: ${(end - start).toFixed(2)}ms ✅`);
    } catch (error) {
      console.log(`  Iterative: Stack overflow ❌`);
    }

    // Test recursive (might overflow for large lists)
    try {
      const list = createLinkedList(testArray);
      const start = performance.now();
      reverseListRecursive(list);
      const end = performance.now();
      console.log(`  Recursive: ${(end - start).toFixed(2)}ms ✅`);
    } catch (error) {
      console.log(`  Recursive: Stack overflow ❌`);
    }

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testReverseLinkedList();
// performanceComparison();
// memoryUsageTest();

export {
  ListNode,
  reverseList,
  reverseListRecursive,
  reverseListStack,
  reverseListTwoPointers,
  reverseListArray,
  reverseListTailRecursive,
  createLinkedList,
  linkedListToArray,
  testReverseLinkedList,
  performanceComparison,
  memoryUsageTest,
};
