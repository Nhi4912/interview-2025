---
layout: page
title: "Remove Nth Node From End of List"
difficulty: Hard
category: Linked List
tags: [Linked List, Two Pointers, Hash Table]
leetcode_url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
---

# Remove Nth Node From End of List

**LeetCode Problem # * 19. Remove Nth Node From End of List**

## Problem Description

 * Given the head of a linked list, remove the nth node from the end of the list  * and return its head.  *  * Input: head = [1,2,3,4,5], n = 2  * Output: [1,2,3,5] 

## Solutions

{% raw %}
/**
 * 19. Remove Nth Node From End of List
 *
 * Problem:
 * Given the head of a linked list, remove the nth node from the end of the list
 * and return its head.
 *
 * Example:
 * Input: head = [1,2,3,4,5], n = 2
 * Output: [1,2,3,5]
 *
 * Input: head = [1], n = 1
 * Output: []
 *
 * Input: head = [1,2], n = 1
 * Output: [1]
 *
 * LeetCode: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
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
 * Solution 1: Two Pointers (Optimal)
 *
 * Approach:
 * - Use two pointers with n+1 gap
 * - When fast reaches end, slow points to node before target
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  if (!head) return null;

  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;

  // Move fast n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    fast = fast.next!;
  }

  // Move both pointers until fast reaches end
  while (fast) {
    slow = slow.next!;
    fast = fast.next!;
  }

  // Remove the nth node
  slow.next = slow.next!.next;

  return dummy.next;
}

/**
 * Solution 2: Two Pass (Length calculation)
 *
 * Approach:
 * - First pass: calculate length
 * - Second pass: remove nth node from end
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function removeNthFromEndTwoPass(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  // Calculate length
  let length = 0;
  let current = head;
  while (current) {
    length++;
    current = current.next;
  }

  // Handle case where we need to remove head
  if (n === length) {
    return head.next;
  }

  // Find node before target
  current = head;
  for (let i = 0; i < length - n - 1; i++) {
    current = current!.next;
  }

  // Remove the nth node
  current!.next = current!.next!.next;

  return head;
}

/**
 * Solution 3: Using Stack
 *
 * Approach:
 * - Push all nodes to stack
 * - Pop n nodes and remove the nth
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function removeNthFromEndStack(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  const stack: ListNode[] = [];
  let current = head;

  // Push all nodes to stack
  while (current) {
    stack.push(current);
    current = current.next;
  }

  // Handle case where we need to remove head
  if (n === stack.length) {
    return head.next;
  }

  // Remove the nth node from end
  const targetIndex = stack.length - n;
  const prevNode = stack[targetIndex - 1];
  prevNode.next = prevNode.next!.next;

  return head;
}

/**
 * Solution 4: Using Array
 *
 * Approach:
 * - Store all nodes in array
 * - Remove nth node from end
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function removeNthFromEndArray(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  const nodes: ListNode[] = [];
  let current = head;

  // Store all nodes in array
  while (current) {
    nodes.push(current);
    current = current.next;
  }

  // Handle case where we need to remove head
  if (n === nodes.length) {
    return head.next;
  }

  // Remove the nth node from end
  const targetIndex = nodes.length - n;
  const prevNode = nodes[targetIndex - 1];
  prevNode.next = prevNode.next!.next;

  return head;
}

/**
 * Solution 5: Using Map
 *
 * Approach:
 * - Store node positions in Map
 * - Remove nth node from end
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function removeNthFromEndMap(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  const nodeMap = new Map<number, ListNode>();
  let current = head;
  let index = 0;

  // Store all nodes in Map
  while (current) {
    nodeMap.set(index, current);
    current = current.next;
    index++;
  }

  const length = index;

  // Handle case where we need to remove head
  if (n === length) {
    return head.next;
  }

  // Remove the nth node from end
  const targetIndex = length - n;
  const prevNode = nodeMap.get(targetIndex - 1)!;
  prevNode.next = prevNode.next!.next;

  return head;
}

/**
 * Solution 6: Recursive Approach
 *
 * Approach:
 * - Use recursion to count from end
 * - Remove node when count reaches n
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function removeNthFromEndRecursive(
  head: ListNode | null,
  n: number
): ListNode | null {
  const dummy = new ListNode(0, head);
  let count = 0;

  function removeHelper(node: ListNode | null): ListNode | null {
    if (!node) return null;

    node.next = removeHelper(node.next);
    count++;

    if (count === n) {
      return node.next;
    }

    return node;
  }

  removeHelper(dummy);
  return dummy.next;
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
function* nodeGenerator(head: ListNode | null): Generator<ListNode> {
  let current = head;
  while (current) {
    yield current;
    current = current.next;
  }
}

function removeNthFromEndGenerator(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  const nodes = Array.from(nodeGenerator(head));

  // Handle case where we need to remove head
  if (n === nodes.length) {
    return head.next;
  }

  // Remove the nth node from end
  const targetIndex = nodes.length - n;
  const prevNode = nodes[targetIndex - 1];
  prevNode.next = prevNode.next!.next;

  return head;
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a LinkedList class
 * - Encapsulate removal logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class LinkedList {
  head: ListNode | null;

  constructor(head: ListNode | null = null) {
    this.head = head;
  }

  removeNthFromEnd(n: number): ListNode | null {
    if (!this.head) return null;

    const dummy = new ListNode(0, this.head);
    let slow = dummy;
    let fast = dummy;

    // Move fast n+1 steps ahead
    for (let i = 0; i <= n; i++) {
      fast = fast.next!;
    }

    // Move both pointers until fast reaches end
    while (fast) {
      slow = slow.next!;
      fast = fast.next!;
    }

    // Remove the nth node
    slow.next = slow.next!.next;

    this.head = dummy.next;
    return this.head;
  }

  toArray(): number[] {
    const result: number[] = [];
    let current = this.head;
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }
}

function removeNthFromEndClass(
  head: ListNode | null,
  n: number
): ListNode | null {
  const list = new LinkedList(head);
  return list.removeNthFromEnd(n);
}

/**
 * Solution 9: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function removeNthFromEndFunctional(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  // Convert to array
  const nodes: ListNode[] = [];
  let current = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }

  // Handle case where we need to remove head
  if (n === nodes.length) {
    return head.next;
  }

  // Remove the nth node from end
  const targetIndex = nodes.length - n;
  const prevNode = nodes[targetIndex - 1];
  prevNode.next = prevNode.next!.next;

  return head;
}

/**
 * Solution 10: Using Two Pointers with Count
 *
 * Approach:
 * - Use two pointers with explicit count
 * - More readable than Solution 1
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function removeNthFromEndWithCount(
  head: ListNode | null,
  n: number
): ListNode | null {
  if (!head) return null;

  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;
  let count = 0;

  // Move fast n steps ahead
  while (count < n && fast.next) {
    fast = fast.next;
    count++;
  }

  // Move both pointers until fast reaches end
  while (fast.next) {
    slow = slow.next!;
    fast = fast.next;
  }

  // Remove the nth node
  slow.next = slow.next!.next;

  return dummy.next;
}

// Helper functions
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

function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

// Test cases
function testRemoveNthFromEnd() {
  console.log("=== Testing Remove Nth Node From End of List ===\n");

  const testCases = [
    {
      input: [1, 2, 3, 4, 5],
      n: 2,
      expected: [1, 2, 3, 5],
      description: "Remove second from end",
    },
    {
      input: [1],
      n: 1,
      expected: [],
      description: "Remove only node",
    },
    {
      input: [1, 2],
      n: 1,
      expected: [1],
      description: "Remove last node",
    },
    {
      input: [1, 2, 3, 4, 5],
      n: 5,
      expected: [2, 3, 4, 5],
      description: "Remove first node",
    },
    {
      input: [1, 2, 3],
      n: 2,
      expected: [1, 3],
      description: "Remove middle node",
    },
    {
      input: [],
      n: 1,
      expected: [],
      description: "Empty list",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}], n = ${testCase.n}`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const head = createLinkedList(testCase.input);

    // Test Solution 1 (Two Pointers)
    const result1 = removeNthFromEnd(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array1 = linkedListToArray(result1);
    console.log(
      `Solution 1 (Two Pointers): [${array1.join(", ")}] ${
        JSON.stringify(array1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Two Pass)
    const result2 = removeNthFromEndTwoPass(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array2 = linkedListToArray(result2);
    console.log(
      `Solution 2 (Two Pass): [${array2.join(", ")}] ${
        JSON.stringify(array2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Stack)
    const result3 = removeNthFromEndStack(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array3 = linkedListToArray(result3);
    console.log(
      `Solution 3 (Stack): [${array3.join(", ")}] ${
        JSON.stringify(array3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const result4 = removeNthFromEndArray(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array4 = linkedListToArray(result4);
    console.log(
      `Solution 4 (Array): [${array4.join(", ")}] ${
        JSON.stringify(array4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Map)
    const result5 = removeNthFromEndMap(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array5 = linkedListToArray(result5);
    console.log(
      `Solution 5 (Map): [${array5.join(", ")}] ${
        JSON.stringify(array5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Recursive)
    const result6 = removeNthFromEndRecursive(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array6 = linkedListToArray(result6);
    console.log(
      `Solution 6 (Recursive): [${array6.join(", ")}] ${
        JSON.stringify(array6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = removeNthFromEndGenerator(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array7 = linkedListToArray(result7);
    console.log(
      `Solution 7 (Generator): [${array7.join(", ")}] ${
        JSON.stringify(array7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = removeNthFromEndClass(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array8 = linkedListToArray(result8);
    console.log(
      `Solution 8 (Class): [${array8.join(", ")}] ${
        JSON.stringify(array8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const result9 = removeNthFromEndFunctional(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array9 = linkedListToArray(result9);
    console.log(
      `Solution 9 (Functional): [${array9.join(", ")}] ${
        JSON.stringify(array9) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Two Pointers with Count)
    const result10 = removeNthFromEndWithCount(
      createLinkedList(testCase.input),
      testCase.n
    );
    const array10 = linkedListToArray(result10);
    console.log(
      `Solution 10 (Two Pointers with Count): [${array10.join(", ")}] ${
        JSON.stringify(array10) === JSON.stringify(testCase.expected)
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

  const testCases = [
    { name: "Two Pointers", func: removeNthFromEnd },
    { name: "Two Pass", func: removeNthFromEndTwoPass },
    { name: "Stack", func: removeNthFromEndStack },
    { name: "Array", func: removeNthFromEndArray },
    { name: "Map", func: removeNthFromEndMap },
    { name: "Recursive", func: removeNthFromEndRecursive },
    { name: "Generator", func: removeNthFromEndGenerator },
    { name: "Class", func: removeNthFromEndClass },
    { name: "Functional", func: removeNthFromEndFunctional },
    { name: "Two Pointers with Count", func: removeNthFromEndWithCount },
  ];

  // Create test cases
  const smallList = createLinkedList(Array.from({ length: 100 }, (_, i) => i));
  const mediumList = createLinkedList(
    Array.from({ length: 1000 }, (_, i) => i)
  );
  const largeList = createLinkedList(
    Array.from({ length: 10000 }, (_, i) => i)
  );

  const cases = [
    { name: "Small", list: smallList, n: 50 },
    { name: "Medium", list: mediumList, n: 500 },
    { name: "Large", list: largeList, n: 5000 },
  ];

  cases.forEach(({ name, list, n }) => {
    console.log(`${name} List:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(createLinkedList(linkedListToArray(list)), n);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testRemoveNthFromEnd();
// performanceComparison();

export {
  removeNthFromEnd,
  removeNthFromEndTwoPass,
  removeNthFromEndStack,
  removeNthFromEndArray,
  removeNthFromEndMap,
  removeNthFromEndRecursive,
  removeNthFromEndGenerator,
  removeNthFromEndClass,
  removeNthFromEndFunctional,
  removeNthFromEndWithCount,
  ListNode,
  LinkedList,
  nodeGenerator,
  createLinkedList,
  linkedListToArray,
  testRemoveNthFromEnd,
  performanceComparison,
};
{% endraw %}
