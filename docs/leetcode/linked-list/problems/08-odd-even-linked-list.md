---
layout: page
title: "Odd Even Linked List"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/odd-even-linked-list/"
---

# Odd Even Linked List

**LeetCode Problem # * 328. Odd Even Linked List**

## Problem Description

 * Given the head of a singly linked list, group all the nodes with odd indices together  * followed by the nodes with even indices, and return the reordered list.  *  * The first node is considered odd, and the second node is even, and so on.  * 

## Solutions

{% raw %}
/**
 * 328. Odd Even Linked List
 *
 * Problem:
 * Given the head of a singly linked list, group all the nodes with odd indices together
 * followed by the nodes with even indices, and return the reordered list.
 *
 * The first node is considered odd, and the second node is even, and so on.
 *
 * Note that the relative order inside both the even and odd groups should remain as it was in the input.
 *
 * You must solve the problem in O(1) extra space complexity and O(n) time complexity.
 *
 * Example:
 * Input: head = [1,2,3,4,5]
 * Output: [1,3,5,2,4]
 *
 * Input: head = [2,1,3,5,6,4,7]
 * Output: [2,3,6,7,1,5,4]
 *
 * LeetCode: https://leetcode.com/problems/odd-even-linked-list/
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
 * - Use two pointers: odd and even
 * - Separate odd and even nodes into two lists
 * - Connect odd list to even list
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function oddEvenList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  const evenHead = even;

  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }

  odd.next = evenHead;
  return head;
}

/**
 * Solution 2: Using Arrays
 *
 * Approach:
 * - Convert list to arrays for odd and even indices
 * - Reconstruct the list from arrays
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function oddEvenListArray(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const oddNodes: ListNode[] = [];
  const evenNodes: ListNode[] = [];
  let current = head;
  let index = 0;

  while (current) {
    if (index % 2 === 0) {
      oddNodes.push(current);
    } else {
      evenNodes.push(current);
    }
    current = current.next;
    index++;
  }

  // Reconstruct the list
  const dummy = new ListNode(0);
  let result = dummy;

  // Add odd nodes
  for (const node of oddNodes) {
    result.next = node;
    result = result.next;
  }

  // Add even nodes
  for (const node of evenNodes) {
    result.next = node;
    result = result.next;
  }

  result.next = null;
  return dummy.next;
}

/**
 * Solution 3: Using Separate Lists
 *
 * Approach:
 * - Create separate odd and even lists
 * - Connect them at the end
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function oddEvenListSeparate(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const oddDummy = new ListNode(0);
  const evenDummy = new ListNode(0);
  let oddTail = oddDummy;
  let evenTail = evenDummy;
  let current = head;
  let index = 0;

  while (current) {
    const next = current.next;
    current.next = null;

    if (index % 2 === 0) {
      oddTail.next = current;
      oddTail = oddTail.next;
    } else {
      evenTail.next = current;
      evenTail = evenTail.next;
    }

    current = next;
    index++;
  }

  oddTail.next = evenDummy.next;
  return oddDummy.next;
}

/**
 * Solution 4: Recursive Approach
 *
 * Approach:
 * - Use recursion to separate odd and even nodes
 * - Build result list recursively
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
function oddEvenListRecursive(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  function separate(odd: ListNode, even: ListNode): ListNode {
    if (!even || !even.next) {
      odd.next = even;
      return odd;
    }

    odd.next = even.next;
    even.next = even.next.next;

    return separate(odd.next, even.next);
  }

  const evenHead = head.next;
  separate(head, evenHead);
  return head;
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a ListReorganizer class
 * - Encapsulate the reorganization logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class ListReorganizer {
  private head: ListNode | null;

  constructor(head: ListNode | null) {
    this.head = head;
  }

  reorganize(): ListNode | null {
    if (!this.head || !this.head.next) return this.head;

    let odd = this.head;
    let even = this.head.next;
    const evenHead = even;

    while (even && even.next) {
      odd.next = even.next;
      odd = odd.next;
      even.next = odd.next;
      even = even.next;
    }

    odd.next = evenHead;
    return this.head;
  }

  getHead(): ListNode | null {
    return this.head;
  }
}

function oddEvenListClass(head: ListNode | null): ListNode | null {
  const reorganizer = new ListReorganizer(head);
  return reorganizer.reorganize();
}

/**
 * Solution 6: Using Generator
 *
 * Approach:
 * - Use generator to yield odd and even nodes
 * - Memory efficient for large lists
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* oddEvenListGenerator(head: ListNode | null): Generator<ListNode> {
  if (!head) return;

  let current = head;
  let index = 0;

  while (current) {
    if (index % 2 === 0) {
      yield current;
    }
    current = current.next;
    index++;
  }

  current = head.next;
  index = 1;

  while (current) {
    if (index % 2 === 1) {
      yield current;
    }
    current = current.next;
    index++;
  }
}

function oddEvenListWithGenerator(head: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  for (const node of oddEvenListGenerator(head)) {
    current.next = node;
    current = current.next;
  }

  current.next = null;
  return dummy.next;
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function oddEvenListFunctional(head: ListNode | null): ListNode | null {
  function separateNodes(
    node: ListNode | null,
    index: number
  ): { odd: ListNode[]; even: ListNode[] } {
    if (!node) return { odd: [], even: [] };

    const { odd, even } = separateNodes(node.next, index + 1);

    if (index % 2 === 0) {
      return { odd: [node, ...odd], even };
    } else {
      return { odd, even: [node, ...even] };
    }
  }

  function buildList(nodes: ListNode[]): ListNode | null {
    if (nodes.length === 0) return null;

    const head = nodes[0];
    let current = head;

    for (let i = 1; i < nodes.length; i++) {
      current.next = nodes[i];
      current = current.next;
    }

    current.next = null;
    return head;
  }

  const { odd, even } = separateNodes(head, 0);
  const oddList = buildList(odd);
  const evenList = buildList(even);

  if (!oddList) return evenList;
  if (!evenList) return oddList;

  let current = oddList;
  while (current.next) {
    current = current.next;
  }
  current.next = evenList;

  return oddList;
}

/**
 * Solution 8: Using Two Passes
 *
 * Approach:
 * - First pass: collect odd and even nodes
 * - Second pass: reconstruct the list
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function oddEvenListTwoPasses(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const oddNodes: ListNode[] = [];
  const evenNodes: ListNode[] = [];
  let current = head;
  let index = 0;

  // First pass: collect nodes
  while (current) {
    if (index % 2 === 0) {
      oddNodes.push(current);
    } else {
      evenNodes.push(current);
    }
    current = current.next;
    index++;
  }

  // Second pass: reconstruct
  const dummy = new ListNode(0);
  let result = dummy;

  // Add odd nodes
  for (const node of oddNodes) {
    result.next = node;
    result = result.next;
  }

  // Add even nodes
  for (const node of evenNodes) {
    result.next = node;
    result = result.next;
  }

  result.next = null;
  return dummy.next;
}

/**
 * Solution 9: Using In-place Reversal
 *
 * Approach:
 * - Reverse even nodes in-place
 * - Connect to odd nodes
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function oddEvenListInPlace(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  let odd = head;
  let even = head.next;
  const evenHead = even;

  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }

  // Reverse even list
  let prev = null;
  let current = evenHead;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  odd.next = prev;
  return head;
}

/**
 * Solution 10: Using Queue-like Structure
 *
 * Approach:
 * - Use queue-like structure to maintain order
 * - Process nodes in order
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function oddEvenListQueue(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;

  const oddQueue: ListNode[] = [];
  const evenQueue: ListNode[] = [];
  let current = head;
  let index = 0;

  while (current) {
    const next = current.next;
    current.next = null;

    if (index % 2 === 0) {
      oddQueue.push(current);
    } else {
      evenQueue.push(current);
    }

    current = next;
    index++;
  }

  // Reconstruct from queues
  const dummy = new ListNode(0);
  let result = dummy;

  // Process odd queue
  while (oddQueue.length > 0) {
    result.next = oddQueue.shift()!;
    result = result.next;
  }

  // Process even queue
  while (evenQueue.length > 0) {
    result.next = evenQueue.shift()!;
    result = result.next;
  }

  return dummy.next;
}

// Helper function to create a linked list from array
function createLinkedList(values: number[]): ListNode | null {
  if (values.length === 0) return null;

  const head = new ListNode(values[0]);
  let current = head;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;
  }

  return head;
}

// Helper function to convert linked list to array
function listToArray(head: ListNode | null): number[] {
  const arr: number[] = [];
  let current = head;

  while (current) {
    arr.push(current.val);
    current = current.next;
  }

  return arr;
}

// Test cases
function testOddEvenList() {
  console.log("=== Testing Odd Even Linked List ===\n");

  const testCases = [
    {
      input: [1, 2, 3, 4, 5],
      expected: [1, 3, 5, 2, 4],
      description: "Basic case",
    },
    {
      input: [2, 1, 3, 5, 6, 4, 7],
      expected: [2, 3, 6, 7, 1, 5, 4],
      description: "Complex case",
    },
    {
      input: [1, 2],
      expected: [1, 2],
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
      input: [1, 2, 3, 4, 5, 6, 7, 8],
      expected: [1, 3, 5, 7, 2, 4, 6, 8],
      description: "Even number of nodes",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const head = createLinkedList(testCase.input);

    // Test Solution 1 (Two Pointers)
    const result1 = oddEvenList(head ? createLinkedList(testCase.input) : null);
    const arr1 = listToArray(result1);
    console.log(
      `Solution 1 (Two Pointers): [${arr1.join(", ")}] ${
        JSON.stringify(arr1) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Array)
    const result2 = oddEvenListArray(createLinkedList(testCase.input));
    const arr2 = listToArray(result2);
    console.log(
      `Solution 2 (Array): [${arr2.join(", ")}] ${
        JSON.stringify(arr2) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Separate Lists)
    const result3 = oddEvenListSeparate(createLinkedList(testCase.input));
    const arr3 = listToArray(result3);
    console.log(
      `Solution 3 (Separate Lists): [${arr3.join(", ")}] ${
        JSON.stringify(arr3) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Recursive)
    const result4 = oddEvenListRecursive(createLinkedList(testCase.input));
    const arr4 = listToArray(result4);
    console.log(
      `Solution 4 (Recursive): [${arr4.join(", ")}] ${
        JSON.stringify(arr4) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = oddEvenListClass(createLinkedList(testCase.input));
    const arr5 = listToArray(result5);
    console.log(
      `Solution 5 (Class): [${arr5.join(", ")}] ${
        JSON.stringify(arr5) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = oddEvenListWithGenerator(createLinkedList(testCase.input));
    const arr6 = listToArray(result6);
    console.log(
      `Solution 6 (Generator): [${arr6.join(", ")}] ${
        JSON.stringify(arr6) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = oddEvenListFunctional(createLinkedList(testCase.input));
    const arr7 = listToArray(result7);
    console.log(
      `Solution 7 (Functional): [${arr7.join(", ")}] ${
        JSON.stringify(arr7) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Two Passes)
    const result8 = oddEvenListTwoPasses(createLinkedList(testCase.input));
    const arr8 = listToArray(result8);
    console.log(
      `Solution 8 (Two Passes): [${arr8.join(", ")}] ${
        JSON.stringify(arr8) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (In-place Reversal)
    const result9 = oddEvenListInPlace(createLinkedList(testCase.input));
    const arr9 = listToArray(result9);
    console.log(
      `Solution 9 (In-place Reversal): [${arr9.join(", ")}] ${
        JSON.stringify(arr9) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Queue)
    const result10 = oddEvenListQueue(createLinkedList(testCase.input));
    const arr10 = listToArray(result10);
    console.log(
      `Solution 10 (Queue): [${arr10.join(", ")}] ${
        JSON.stringify(arr10) === JSON.stringify(testCase.expected)
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
    { name: "Two Pointers", func: oddEvenList },
    { name: "Array", func: oddEvenListArray },
    { name: "Separate Lists", func: oddEvenListSeparate },
    { name: "Recursive", func: oddEvenListRecursive },
    { name: "Class", func: oddEvenListClass },
    { name: "Generator", func: oddEvenListWithGenerator },
    { name: "Functional", func: oddEvenListFunctional },
    { name: "Two Passes", func: oddEvenListTwoPasses },
    { name: "In-place Reversal", func: oddEvenListInPlace },
    { name: "Queue", func: oddEvenListQueue },
  ];

  // Create test cases
  const smallCase = createLinkedList([1, 2, 3, 4, 5]);
  const mediumCase = createLinkedList(
    Array.from({ length: 100 }, (_, i) => i + 1)
  );
  const largeCase = createLinkedList(
    Array.from({ length: 1000 }, (_, i) => i + 1)
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

      const resultLength = listToArray(result).length;
      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${resultLength})`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testOddEvenList();
// performanceComparison();

export {
  oddEvenList,
  oddEvenListArray,
  oddEvenListSeparate,
  oddEvenListRecursive,
  oddEvenListClass,
  oddEvenListWithGenerator,
  oddEvenListFunctional,
  oddEvenListTwoPasses,
  oddEvenListInPlace,
  oddEvenListQueue,
  ListReorganizer,
  oddEvenListGenerator,
  ListNode,
  createLinkedList,
  listToArray,
  testOddEvenList,
  performanceComparison,
};
{% endraw %}
