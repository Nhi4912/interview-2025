---
layout: page
title: "Merge Two Sorted List"
difficulty: Easy
category: Linked List
tags: [Linked List, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/merge-two-sorted-list/"
---

# Merge Two Sorted List

**LeetCode Problem # * 21. Merge Two Sorted Lists**

## Problem Description

 * You are given the heads of two sorted linked lists list1 and list2.  * Merge the two lists into one sorted list. The list should be made by  * splicing together the nodes of the first two lists.  * Return the head of the merged linked list.  * 

## Solutions

{% raw %}
/**
 * 21. Merge Two Sorted Lists
 *
 * Problem:
 * You are given the heads of two sorted linked lists list1 and list2.
 * Merge the two lists into one sorted list. The list should be made by
 * splicing together the nodes of the first two lists.
 * Return the head of the merged linked list.
 *
 * Example:
 * Input: list1 = [1,2,4], list2 = [1,3,4]
 * Output: [1,1,2,3,4,4]
 *
 * Input: list1 = [], list2 = []
 * Output: []
 *
 * Input: list1 = [], list2 = [0]
 * Output: [0]
 *
 * LeetCode: https://leetcode.com/problems/merge-two-sorted-lists/
 */

// ListNode class definition
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/**
 * Solution 1: Iterative with Dummy Node (Optimal)
 *
 * Approach:
 * - Use dummy node to handle edge cases
 * - Compare nodes from both lists
 * - Link smaller node to result
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(1)
 */
function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  // Attach remaining nodes
  current.next = list1 || list2;

  return dummy.next;
}

/**
 * Solution 2: Recursive Approach
 *
 * Approach:
 * - Use recursion to merge lists
 * - Base case: when one list is empty
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(n + m) - recursion stack
 */
function mergeTwoListsRecursive(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  if (list1.val <= list2.val) {
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}

/**
 * Solution 3: In-place Merge (Modifies input)
 *
 * Approach:
 * - Merge in-place by modifying pointers
 * - More complex but space efficient
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(1)
 */
function mergeTwoListsInPlace(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  if (!list1) return list2;
  if (!list2) return list1;

  let head: ListNode;
  let current: ListNode;

  // Choose head
  if (list1.val <= list2.val) {
    head = list1;
    list1 = list1.next;
  } else {
    head = list2;
    list2 = list2.next;
  }

  current = head;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  current.next = list1 || list2;
  return head;
}

/**
 * Solution 4: Using Array Conversion
 *
 * Approach:
 * - Convert lists to arrays
 * - Merge arrays and create new list
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(n + m)
 */
function mergeTwoListsArray(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const array1 = linkedListToArray(list1);
  const array2 = linkedListToArray(list2);

  const mergedArray = mergeArrays(array1, array2);
  return arrayToLinkedList(mergedArray);
}

/**
 * Solution 5: Two Pointers with Sentinel
 *
 * Approach:
 * - Use sentinel node for cleaner code
 * - Similar to Solution 1 but more explicit
 *
 * Time Complexity: O(n + m)
 * Space Complexity: O(1)
 */
function mergeTwoListsSentinel(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const sentinel = new ListNode(-1);
  let tail = sentinel;

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 || list2;
  return sentinel.next;
}

/**
 * Solution 6: Using Priority Queue (Overkill)
 *
 * Approach:
 * - Use priority queue to merge
 * - Educational but inefficient
 *
 * Time Complexity: O((n + m) log(n + m))
 * Space Complexity: O(n + m)
 */
class PriorityQueue {
  private heap: ListNode[] = [];

  enqueue(node: ListNode): void {
    this.heap.push(node);
    this.heapifyUp();
  }

  dequeue(): ListNode | null {
    if (this.heap.length === 0) return null;

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return min;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].val <= this.heap[index].val) break;

      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
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
        leftChild < this.heap.length &&
        this.heap[leftChild].val < this.heap[smallest].val
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].val < this.heap[smallest].val
      ) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

function mergeTwoListsPriorityQueue(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const pq = new PriorityQueue();

  // Add all nodes to priority queue
  let current = list1;
  while (current) {
    pq.enqueue(new ListNode(current.val));
    current = current.next;
  }

  current = list2;
  while (current) {
    pq.enqueue(new ListNode(current.val));
    current = current.next;
  }

  // Build result list
  const dummy = new ListNode(0);
  let tail = dummy;

  while (!pq.isEmpty()) {
    const node = pq.dequeue()!;
    tail.next = node;
    tail = tail.next;
  }

  return dummy.next;
}

// Helper functions
function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

function arrayToLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;

  const head = new ListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }

  return head;
}

function mergeArrays(arr1: number[], arr2: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function createLinkedList(arr: number[]): ListNode | null {
  return arrayToLinkedList(arr);
}

function printLinkedList(head: ListNode | null): string {
  const result: number[] = [];
  let current = head;

  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return `[${result.join(" -> ")}]`;
}

// Test cases
function testMergeTwoSortedLists() {
  console.log("=== Testing Merge Two Sorted Lists ===\n");

  const testCases = [
    {
      list1: [1, 2, 4],
      list2: [1, 3, 4],
      expected: [1, 1, 2, 3, 4, 4],
      description: "Basic merge",
    },
    {
      list1: [],
      list2: [],
      expected: [],
      description: "Empty lists",
    },
    {
      list1: [],
      list2: [0],
      expected: [0],
      description: "One empty list",
    },
    {
      list1: [1, 3, 5],
      list2: [2, 4, 6],
      expected: [1, 2, 3, 4, 5, 6],
      description: "Alternating values",
    },
    {
      list1: [1, 2, 3],
      list2: [4, 5, 6],
      expected: [1, 2, 3, 4, 5, 6],
      description: "Sequential lists",
    },
    {
      list1: [4, 5, 6],
      list2: [1, 2, 3],
      expected: [1, 2, 3, 4, 5, 6],
      description: "Second list smaller",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: list1 = [${testCase.list1.join(
        ", "
      )}], list2 = [${testCase.list2.join(", ")}]`
    );
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const list1 = createLinkedList(testCase.list1);
    const list2 = createLinkedList(testCase.list2);

    // Test Solution 1 (Iterative with Dummy)
    const result1 = mergeTwoLists(list1, list2);
    const result1Array = linkedListToArray(result1);
    console.log(
      `Solution 1 (Iterative): [${result1Array.join(", ")}] ${
        JSON.stringify(result1Array) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Recursive)
    const list1Rec = createLinkedList(testCase.list1);
    const list2Rec = createLinkedList(testCase.list2);
    const result2 = mergeTwoListsRecursive(list1Rec, list2Rec);
    const result2Array = linkedListToArray(result2);
    console.log(
      `Solution 2 (Recursive): [${result2Array.join(", ")}] ${
        JSON.stringify(result2Array) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (In-place)
    const list1InPlace = createLinkedList(testCase.list1);
    const list2InPlace = createLinkedList(testCase.list2);
    const result3 = mergeTwoListsInPlace(list1InPlace, list2InPlace);
    const result3Array = linkedListToArray(result3);
    console.log(
      `Solution 3 (In-place): [${result3Array.join(", ")}] ${
        JSON.stringify(result3Array) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const list1Array = createLinkedList(testCase.list1);
    const list2Array = createLinkedList(testCase.list2);
    const result4 = mergeTwoListsArray(list1Array, list2Array);
    const result4Array = linkedListToArray(result4);
    console.log(
      `Solution 4 (Array): [${result4Array.join(", ")}] ${
        JSON.stringify(result4Array) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Sentinel)
    const list1Sentinel = createLinkedList(testCase.list1);
    const list2Sentinel = createLinkedList(testCase.list2);
    const result5 = mergeTwoListsSentinel(list1Sentinel, list2Sentinel);
    const result5Array = linkedListToArray(result5);
    console.log(
      `Solution 5 (Sentinel): [${result5Array.join(", ")}] ${
        JSON.stringify(result5Array) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Priority Queue)
    const list1PQ = createLinkedList(testCase.list1);
    const list2PQ = createLinkedList(testCase.list2);
    const result6 = mergeTwoListsPriorityQueue(list1PQ, list2PQ);
    const result6Array = linkedListToArray(result6);
    console.log(
      `Solution 6 (Priority Queue): [${result6Array.join(", ")}] ${
        JSON.stringify(result6Array) === JSON.stringify(testCase.expected)
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
    { name: "Iterative", func: mergeTwoLists },
    { name: "Recursive", func: mergeTwoListsRecursive },
    { name: "In-place", func: mergeTwoListsInPlace },
    { name: "Array", func: mergeTwoListsArray },
    { name: "Sentinel", func: mergeTwoListsSentinel },
    { name: "Priority Queue", func: mergeTwoListsPriorityQueue },
  ];

  // Create test lists
  const list1 = createLinkedList(Array.from({ length: 1000 }, (_, i) => i * 2));
  const list2 = createLinkedList(
    Array.from({ length: 1000 }, (_, i) => i * 2 + 1)
  );

  testCases.forEach(({ name, func }) => {
    const start = performance.now();
    const result = func(list1, list2);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result length: ${linkedListToArray(result).length}`);
    console.log(
      `  Memory: ${
        name === "Recursive"
          ? "O(n+m)"
          : name === "Array" || name === "Priority Queue"
          ? "O(n+m)"
          : "O(1)"
      }\n`
    );
  });
}

// Uncomment the following lines to run tests
// testMergeTwoSortedLists();
// performanceComparison();

export {
  ListNode,
  mergeTwoLists,
  mergeTwoListsRecursive,
  mergeTwoListsInPlace,
  mergeTwoListsArray,
  mergeTwoListsSentinel,
  mergeTwoListsPriorityQueue,
  PriorityQueue,
  linkedListToArray,
  arrayToLinkedList,
  createLinkedList,
  printLinkedList,
  testMergeTwoSortedLists,
  performanceComparison,
};
{% endraw %}
