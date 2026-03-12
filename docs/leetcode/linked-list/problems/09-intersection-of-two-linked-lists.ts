/**
 * 160. Intersection of Two Linked Lists
 *
 * Problem:
 * Given the heads of two singly linked-lists headA and headB, return the node at which
 * the two lists intersect. If the two linked lists have no intersection at all, return null.
 *
 * The test cases are generated such that there are no cycles anywhere in the entire linked structure.
 *
 * Note that the linked lists must retain their original structure after the function returns.
 *
 * Example:
 * Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
 * Output: Intersected at '8'
 * Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect).
 * From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,6,1,8,4,5].
 * There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.
 *
 * Input: intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
 * Output: Intersected at '2'
 *
 * Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
 * Output: null
 *
 * LeetCode: https://leetcode.com/problems/intersection-of-two-linked-lists/
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
 * - Use two pointers starting from headA and headB
 * - When one pointer reaches end, move it to the other list's head
 * - They will meet at intersection point or both become null
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  if (!headA || !headB) return null;

  let pointerA = headA;
  let pointerB = headB;

  while (pointerA !== pointerB) {
    pointerA = pointerA ? pointerA.next : headB;
    pointerB = pointerB ? pointerB.next : headA;
  }

  return pointerA;
}

/**
 * Solution 2: Using Set
 *
 * Approach:
 * - Traverse first list and store all nodes in a Set
 * - Traverse second list and check if node exists in Set
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m) or O(n)
 */
function getIntersectionNodeSet(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  const visited = new Set<ListNode>();
  let current = headA;

  while (current) {
    visited.add(current);
    current = current.next;
  }

  current = headB;
  while (current) {
    if (visited.has(current)) {
      return current;
    }
    current = current.next;
  }

  return null;
}

/**
 * Solution 3: Using Length Difference
 *
 * Approach:
 * - Calculate lengths of both lists
 * - Move pointer of longer list by difference
 * - Then move both pointers together
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function getIntersectionNodeLength(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  function getLength(head: ListNode | null): number {
    let length = 0;
    let current = head;
    while (current) {
      length++;
      current = current.next;
    }
    return length;
  }

  const lenA = getLength(headA);
  const lenB = getLength(headB);

  let currentA = headA;
  let currentB = headB;

  // Move pointer of longer list by difference
  if (lenA > lenB) {
    for (let i = 0; i < lenA - lenB; i++) {
      currentA = currentA!.next;
    }
  } else {
    for (let i = 0; i < lenB - lenA; i++) {
      currentB = currentB!.next;
    }
  }

  // Move both pointers together
  while (currentA && currentB) {
    if (currentA === currentB) {
      return currentA;
    }
    currentA = currentA.next;
    currentB = currentB.next;
  }

  return null;
}

/**
 * Solution 4: Using Hash Map
 *
 * Approach:
 * - Use Map to store nodes with additional information
 * - More explicit tracking of node positions
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m) or O(n)
 */
function getIntersectionNodeMap(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  const visited = new Map<ListNode, number>();
  let current = headA;
  let position = 0;

  while (current) {
    visited.set(current, position);
    current = current.next;
    position++;
  }

  current = headB;
  position = 0;
  while (current) {
    if (visited.has(current)) {
      return current;
    }
    current = current.next;
    position++;
  }

  return null;
}

/**
 * Solution 5: Using Array
 *
 * Approach:
 * - Convert lists to arrays
 * - Find common suffix
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m + n)
 */
function getIntersectionNodeArray(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  function listToArray(head: ListNode | null): ListNode[] {
    const arr: ListNode[] = [];
    let current = head;
    while (current) {
      arr.push(current);
      current = current.next;
    }
    return arr;
  }

  const arrA = listToArray(headA);
  const arrB = listToArray(headB);

  let i = arrA.length - 1;
  let j = arrB.length - 1;

  while (i >= 0 && j >= 0 && arrA[i] === arrB[j]) {
    i--;
    j--;
  }

  return i < arrA.length - 1 ? arrA[i + 1] : null;
}

/**
 * Solution 6: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an IntersectionFinder class
 * - Encapsulate the intersection logic
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
class IntersectionFinder {
  private headA: ListNode | null;
  private headB: ListNode | null;

  constructor(headA: ListNode | null, headB: ListNode | null) {
    this.headA = headA;
    this.headB = headB;
  }

  find(): ListNode | null {
    if (!this.headA || !this.headB) return null;

    let pointerA = this.headA;
    let pointerB = this.headB;

    while (pointerA !== pointerB) {
      pointerA = pointerA ? pointerA.next : this.headB;
      pointerB = pointerB ? pointerB.next : this.headA;
    }

    return pointerA;
  }

  getLists(): { headA: ListNode | null; headB: ListNode | null } {
    return { headA: this.headA, headB: this.headB };
  }
}

function getIntersectionNodeClass(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  const finder = new IntersectionFinder(headA, headB);
  return finder.find();
}

/**
 * Solution 7: Using Generator
 *
 * Approach:
 * - Use generator to yield nodes from both lists
 * - Memory efficient for large lists
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function* getIntersectionNodeGenerator(
  headA: ListNode | null,
  headB: ListNode | null
): Generator<ListNode> {
  let currentA = headA;
  let currentB = headB;

  while (currentA || currentB) {
    if (currentA) {
      yield currentA;
      currentA = currentA.next;
    }
    if (currentB) {
      yield currentB;
      currentB = currentB.next;
    }
  }
}

function getIntersectionNodeWithGenerator(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  const visited = new Set<ListNode>();

  for (const node of getIntersectionNodeGenerator(headA, headB)) {
    if (visited.has(node)) {
      return node;
    }
    visited.add(node);
  }

  return null;
}

/**
 * Solution 8: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(m) or O(n)
 */
function getIntersectionNodeFunctional(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  function traverseAndCheck(
    head: ListNode | null,
    visited: Set<ListNode>
  ): ListNode | null {
    if (!head) return null;

    if (visited.has(head)) {
      return head;
    }

    visited.add(head);
    return traverseAndCheck(head.next, visited);
  }

  const visited = new Set<ListNode>();

  // First traverse list A
  let current = headA;
  while (current) {
    visited.add(current);
    current = current.next;
  }

  // Then check list B
  return traverseAndCheck(headB, visited);
}

/**
 * Solution 9: Using Two Passes with Length
 *
 * Approach:
 * - First pass: calculate lengths
 * - Second pass: find intersection
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function getIntersectionNodeTwoPasses(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  function getLength(head: ListNode | null): number {
    let length = 0;
    let current = head;
    while (current) {
      length++;
      current = current.next;
    }
    return length;
  }

  const lenA = getLength(headA);
  const lenB = getLength(headB);

  let currentA = headA;
  let currentB = headB;

  // Align pointers
  if (lenA > lenB) {
    for (let i = 0; i < lenA - lenB; i++) {
      currentA = currentA!.next;
    }
  } else if (lenB > lenA) {
    for (let i = 0; i < lenB - lenA; i++) {
      currentB = currentB!.next;
    }
  }

  // Find intersection
  while (currentA && currentB) {
    if (currentA === currentB) {
      return currentA;
    }
    currentA = currentA.next;
    currentB = currentB.next;
  }

  return null;
}

/**
 * Solution 10: Using Reverse Traversal
 *
 * Approach:
 * - Reverse both lists
 * - Find common prefix
 * - Reverse back
 *
 * Time Complexity: O(m + n)
 * Space Complexity: O(1)
 */
function getIntersectionNodeReverse(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  function reverseList(head: ListNode | null): ListNode | null {
    let prev = null;
    let current = head;

    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    return prev;
  }

  // Reverse both lists
  const reversedA = reverseList(headA);
  const reversedB = reverseList(headB);

  // Find common prefix
  let intersection = null;
  let currentA = reversedA;
  let currentB = reversedB;

  while (currentA && currentB && currentA === currentB) {
    intersection = currentA;
    currentA = currentA.next;
    currentB = currentB.next;
  }

  // Reverse back
  reverseList(reversedA);
  reverseList(reversedB);

  return intersection;
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

// Helper function to create intersecting lists
function createIntersectingLists(
  listA: number[],
  listB: number[],
  intersection: number[]
): {
  headA: ListNode | null;
  headB: ListNode | null;
  intersectionNode: ListNode | null;
} {
  // Create intersection part
  const intersectionList = createLinkedList(intersection);

  // Create list A
  const headA = createLinkedList(listA);
  let currentA = headA;
  while (currentA && currentA.next) {
    currentA = currentA.next;
  }
  if (currentA) {
    currentA.next = intersectionList;
  }

  // Create list B
  const headB = createLinkedList(listB);
  let currentB = headB;
  while (currentB && currentB.next) {
    currentB = currentB.next;
  }
  if (currentB) {
    currentB.next = intersectionList;
  }

  return { headA, headB, intersectionNode: intersectionList };
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
function testGetIntersectionNode() {
  console.log("=== Testing Intersection of Two Linked Lists ===\n");

  const testCases = [
    {
      listA: [4, 1],
      listB: [5, 6, 1],
      intersection: [8, 4, 5],
      description: "Basic intersection",
    },
    {
      listA: [1, 9, 1],
      listB: [3],
      intersection: [2, 4],
      description: "Intersection at end",
    },
    {
      listA: [2, 6, 4],
      listB: [1, 5],
      intersection: [],
      description: "No intersection",
    },
    {
      listA: [1],
      listB: [2],
      intersection: [3, 4, 5],
      description: "Single node lists",
    },
    {
      listA: [],
      listB: [1, 2, 3],
      intersection: [],
      description: "Empty list A",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`List A: [${testCase.listA.join(", ")}]`);
    console.log(`List B: [${testCase.listB.join(", ")}]`);
    console.log(`Intersection: [${testCase.intersection.join(", ")}]\n`);

    const { headA, headB, intersectionNode } = createIntersectingLists(
      testCase.listA,
      testCase.listB,
      testCase.intersection
    );

    const expectedValue = intersectionNode ? intersectionNode.val : null;

    // Test Solution 1 (Two Pointers)
    const result1 = getIntersectionNode(headA, headB);
    const value1 = result1 ? result1.val : null;
    console.log(
      `Solution 1 (Two Pointers): ${value1} ${
        value1 === expectedValue ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Set)
    const result2 = getIntersectionNodeSet(headA, headB);
    const value2 = result2 ? result2.val : null;
    console.log(
      `Solution 2 (Set): ${value2} ${value2 === expectedValue ? "✅" : "❌"}`
    );

    // Test Solution 3 (Length Difference)
    const result3 = getIntersectionNodeLength(headA, headB);
    const value3 = result3 ? result3.val : null;
    console.log(
      `Solution 3 (Length Difference): ${value3} ${
        value3 === expectedValue ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = getIntersectionNodeMap(headA, headB);
    const value4 = result4 ? result4.val : null;
    console.log(
      `Solution 4 (Map): ${value4} ${value4 === expectedValue ? "✅" : "❌"}`
    );

    // Test Solution 5 (Array)
    const result5 = getIntersectionNodeArray(headA, headB);
    const value5 = result5 ? result5.val : null;
    console.log(
      `Solution 5 (Array): ${value5} ${value5 === expectedValue ? "✅" : "❌"}`
    );

    // Test Solution 6 (Class)
    const result6 = getIntersectionNodeClass(headA, headB);
    const value6 = result6 ? result6.val : null;
    console.log(
      `Solution 6 (Class): ${value6} ${value6 === expectedValue ? "✅" : "❌"}`
    );

    // Test Solution 7 (Generator)
    const result7 = getIntersectionNodeWithGenerator(headA, headB);
    const value7 = result7 ? result7.val : null;
    console.log(
      `Solution 7 (Generator): ${value7} ${
        value7 === expectedValue ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Functional)
    const result8 = getIntersectionNodeFunctional(headA, headB);
    const value8 = result8 ? result8.val : null;
    console.log(
      `Solution 8 (Functional): ${value8} ${
        value8 === expectedValue ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Two Passes)
    const result9 = getIntersectionNodeTwoPasses(headA, headB);
    const value9 = result9 ? result9.val : null;
    console.log(
      `Solution 9 (Two Passes): ${value9} ${
        value9 === expectedValue ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Reverse)
    const result10 = getIntersectionNodeReverse(headA, headB);
    const value10 = result10 ? result10.val : null;
    console.log(
      `Solution 10 (Reverse): ${value10} ${
        value10 === expectedValue ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Two Pointers", func: getIntersectionNode },
    { name: "Set", func: getIntersectionNodeSet },
    { name: "Length Difference", func: getIntersectionNodeLength },
    { name: "Map", func: getIntersectionNodeMap },
    { name: "Array", func: getIntersectionNodeArray },
    { name: "Class", func: getIntersectionNodeClass },
    { name: "Generator", func: getIntersectionNodeWithGenerator },
    { name: "Functional", func: getIntersectionNodeFunctional },
    { name: "Two Passes", func: getIntersectionNodeTwoPasses },
    { name: "Reverse", func: getIntersectionNodeReverse },
  ];

  // Create test cases
  const smallCase = createIntersectingLists([1, 2], [3, 4], [5, 6, 7]);
  const mediumCase = createIntersectingLists(
    Array.from({ length: 50 }, (_, i) => i),
    Array.from({ length: 30 }, (_, i) => i + 100),
    Array.from({ length: 20 }, (_, i) => i + 200)
  );
  const largeCase = createIntersectingLists(
    Array.from({ length: 500 }, (_, i) => i),
    Array.from({ length: 300 }, (_, i) => i + 1000),
    Array.from({ length: 200 }, (_, i) => i + 2000)
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
      const result = func(testCase.headA, testCase.headB);
      const end = performance.now();

      const resultValue = result ? result.val : null;
      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (value: ${resultValue})`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testGetIntersectionNode();
// performanceComparison();

export {
  getIntersectionNode,
  getIntersectionNodeSet,
  getIntersectionNodeLength,
  getIntersectionNodeMap,
  getIntersectionNodeArray,
  getIntersectionNodeClass,
  getIntersectionNodeWithGenerator,
  getIntersectionNodeFunctional,
  getIntersectionNodeTwoPasses,
  getIntersectionNodeReverse,
  IntersectionFinder,
  getIntersectionNodeGenerator,
  ListNode,
  createLinkedList,
  createIntersectingLists,
  listToArray,
  testGetIntersectionNode,
  performanceComparison,
};
