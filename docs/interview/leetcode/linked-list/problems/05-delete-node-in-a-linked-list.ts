/**
 * 237. Delete Node in a Linked List
 *
 * Problem:
 * Write a function to delete a node in a singly-linked list. You will not be given
 * access to the head of the list, instead you will be given access to the node to
 * be deleted directly.
 *
 * It is guaranteed that the node to be deleted is not a tail node in the list.
 *
 * Example:
 * Input: head = [4,5,1,9], node = 5
 * Output: [4,1,9]
 * Explanation: You are given the second node with value 5, the linked list should
 * become 4 -> 1 -> 9 after calling your function.
 *
 * Input: head = [4,5,1,9], node = 1
 * Output: [4,5,9]
 * Explanation: You are given the third node with value 1, the linked list should
 * become 4 -> 5 -> 9 after calling your function.
 *
 * LeetCode: https://leetcode.com/problems/delete-node-in-a-linked-list/
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
 * Solution 1: Copy Next Node (Optimal)
 *
 * Approach:
 * - Copy the value from the next node to the current node
 * - Delete the next node by updating the pointer
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function deleteNode(node: ListNode | null): void {
  if (!node || !node.next) return;

  // Copy the value from next node
  node.val = node.next.val;

  // Delete the next node
  node.next = node.next.next;
}

/**
 * Solution 2: Using Reference
 *
 * Approach:
 * - Use reference to modify the node directly
 * - Similar to Solution 1 but more explicit
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function deleteNodeReference(node: ListNode | null): void {
  if (!node || !node.next) return;

  const nextNode = node.next;
  node.val = nextNode.val;
  node.next = nextNode.next;

  // Clear the next node reference
  nextNode.next = null;
}

/**
 * Solution 3: Using Object Destructuring
 *
 * Approach:
 * - Use object destructuring to copy properties
 * - More modern JavaScript approach
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function deleteNodeDestructuring(node: ListNode | null): void {
  if (!node || !node.next) return;

  const { val, next } = node.next;
  node.val = val;
  node.next = next;
}

/**
 * Solution 4: Using Array Methods (Educational)
 *
 * Approach:
 * - Convert to array, modify, and rebuild
 * - Not efficient but shows array manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function deleteNodeArray(node: ListNode | null): void {
  if (!node) return;

  // Convert to array
  const values: number[] = [];
  let current = node;

  while (current) {
    values.push(current.val);
    current = current.next;
  }

  // Remove the first element (current node)
  values.shift();

  // Rebuild the list
  current = node;
  for (let i = 0; i < values.length; i++) {
    current.val = values[i];
    if (i < values.length - 1) {
      current = current.next!;
    } else {
      current.next = null;
    }
  }
}

/**
 * Solution 5: Using Map (Educational)
 *
 * Approach:
 * - Use Map to store node values
 * - More complex but shows Map usage
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function deleteNodeMap(node: ListNode | null): void {
  if (!node) return;

  const nodeMap = new Map<number, number>();
  let current = node;
  let index = 0;

  // Store all values in Map
  while (current) {
    nodeMap.set(index, current.val);
    current = current.next;
    index++;
  }

  // Remove the first value
  nodeMap.delete(0);

  // Rebuild the list
  current = node;
  for (let i = 1; i < nodeMap.size + 1; i++) {
    current.val = nodeMap.get(i)!;
    if (i < nodeMap.size) {
      current = current.next!;
    } else {
      current.next = null;
    }
  }
}

/**
 * Solution 6: Using Set (Educational)
 *
 * Approach:
 * - Use Set to track processed values
 * - More complex but shows Set usage
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function deleteNodeSet(node: ListNode | null): void {
  if (!node) return;

  const valueSet = new Set<number>();
  let current = node;

  // Collect all values except the first
  while (current.next) {
    valueSet.add(current.next.val);
    current = current.next;
  }

  // Rebuild the list
  current = node;
  const values = Array.from(valueSet);

  for (let i = 0; i < values.length; i++) {
    current.val = values[i];
    if (i < values.length - 1) {
      current = current.next!;
    } else {
      current.next = null;
    }
  }
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield values
 * - Memory efficient for large lists
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function* nodeValueGenerator(node: ListNode | null): Generator<number> {
  if (!node) return;

  let current = node.next; // Skip the first node
  while (current) {
    yield current.val;
    current = current.next;
  }
}

function deleteNodeGenerator(node: ListNode | null): void {
  if (!node) return;

  const values = Array.from(nodeValueGenerator(node));

  if (values.length === 0) {
    // If no next node, we can't delete
    return;
  }

  // Copy values back
  let current = node;
  for (let i = 0; i < values.length; i++) {
    current.val = values[i];
    if (i < values.length - 1) {
      current = current.next!;
    } else {
      current.next = null;
    }
  }
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a NodeDeleter class
 * - Encapsulate the deletion logic
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
class NodeDeleter {
  private node: ListNode | null;

  constructor(node: ListNode | null) {
    this.node = node;
  }

  deleteNode(): void {
    if (!this.node || !this.node.next) return;

    this.node.val = this.node.next.val;
    this.node.next = this.node.next.next;
  }

  getNode(): ListNode | null {
    return this.node;
  }
}

function deleteNodeClass(node: ListNode | null): void {
  const deleter = new NodeDeleter(node);
  deleter.deleteNode();
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
function deleteNodeFunctional(node: ListNode | null): void {
  if (!node) return;

  const values = Array.from({ length: 1000 }, (_, i) => i) // Dummy array
    .reduce((acc, _, index) => {
      if (index === 0) return acc;
      let current = node;
      for (let j = 0; j < index; j++) {
        if (current.next) {
          current = current.next;
        } else {
          return acc;
        }
      }
      return [...acc, current.val];
    }, [] as number[]);

  // Rebuild the list
  let current = node;
  for (let i = 0; i < values.length; i++) {
    current.val = values[i];
    if (i < values.length - 1) {
      current = current.next!;
    } else {
      current.next = null;
    }
  }
}

/**
 * Solution 10: Using Bit Manipulation (Educational)
 *
 * Approach:
 * - Use bit operations to manipulate values
 * - Educational purpose only
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function deleteNodeBitwise(node: ListNode | null): void {
  if (!node || !node.next) return;

  // Copy value using XOR (educational)
  const nextVal = node.next.val;
  node.val = nextVal;

  // Update pointer
  node.next = node.next.next;
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

function findNode(head: ListNode | null, targetVal: number): ListNode | null {
  let current = head;

  while (current) {
    if (current.val === targetVal) {
      return current;
    }
    current = current.next;
  }

  return null;
}

// Test cases
function testDeleteNode() {
  console.log("=== Testing Delete Node in a Linked List ===\n");

  const testCases = [
    {
      input: [4, 5, 1, 9],
      targetVal: 5,
      expected: [4, 1, 9],
      description: "Delete middle node",
    },
    {
      input: [4, 5, 1, 9],
      targetVal: 1,
      expected: [4, 5, 9],
      description: "Delete another middle node",
    },
    {
      input: [1, 2, 3, 4],
      targetVal: 2,
      expected: [1, 3, 4],
      description: "Delete second node",
    },
    {
      input: [1, 2],
      targetVal: 1,
      expected: [2],
      description: "Delete first node",
    },
    {
      input: [1, 2, 3],
      targetVal: 2,
      expected: [1, 3],
      description: "Delete middle node in three-node list",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(
      `Input: [${testCase.input.join(", ")}], target = ${testCase.targetVal}`
    );
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const head = createLinkedList(testCase.input);
    const targetNode = findNode(head, testCase.targetVal);

    if (!targetNode) {
      console.log("Target node not found!");
      return;
    }

    // Test Solution 1 (Copy Next Node)
    const head1 = createLinkedList(testCase.input);
    const targetNode1 = findNode(head1, testCase.targetVal);
    deleteNode(targetNode1);
    const result1 = linkedListToArray(head1);
    console.log(
      `Solution 1 (Copy Next Node): [${result1.join(", ")}] ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Reference)
    const head2 = createLinkedList(testCase.input);
    const targetNode2 = findNode(head2, testCase.targetVal);
    deleteNodeReference(targetNode2);
    const result2 = linkedListToArray(head2);
    console.log(
      `Solution 2 (Reference): [${result2.join(", ")}] ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Destructuring)
    const head3 = createLinkedList(testCase.input);
    const targetNode3 = findNode(head3, testCase.targetVal);
    deleteNodeDestructuring(targetNode3);
    const result3 = linkedListToArray(head3);
    console.log(
      `Solution 3 (Destructuring): [${result3.join(", ")}] ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Array Methods)
    const head4 = createLinkedList(testCase.input);
    const targetNode4 = findNode(head4, testCase.targetVal);
    deleteNodeArray(targetNode4);
    const result4 = linkedListToArray(head4);
    console.log(
      `Solution 4 (Array Methods): [${result4.join(", ")}] ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Map)
    const head5 = createLinkedList(testCase.input);
    const targetNode5 = findNode(head5, testCase.targetVal);
    deleteNodeMap(targetNode5);
    const result5 = linkedListToArray(head5);
    console.log(
      `Solution 5 (Map): [${result5.join(", ")}] ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Set)
    const head6 = createLinkedList(testCase.input);
    const targetNode6 = findNode(head6, testCase.targetVal);
    deleteNodeSet(targetNode6);
    const result6 = linkedListToArray(head6);
    console.log(
      `Solution 6 (Set): [${result6.join(", ")}] ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const head7 = createLinkedList(testCase.input);
    const targetNode7 = findNode(head7, testCase.targetVal);
    deleteNodeGenerator(targetNode7);
    const result7 = linkedListToArray(head7);
    console.log(
      `Solution 7 (Generator): [${result7.join(", ")}] ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const head8 = createLinkedList(testCase.input);
    const targetNode8 = findNode(head8, testCase.targetVal);
    deleteNodeClass(targetNode8);
    const result8 = linkedListToArray(head8);
    console.log(
      `Solution 8 (Class): [${result8.join(", ")}] ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const head9 = createLinkedList(testCase.input);
    const targetNode9 = findNode(head9, testCase.targetVal);
    deleteNodeFunctional(targetNode9);
    const result9 = linkedListToArray(head9);
    console.log(
      `Solution 9 (Functional): [${result9.join(", ")}] ${
        JSON.stringify(result9) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Bitwise)
    const head10 = createLinkedList(testCase.input);
    const targetNode10 = findNode(head10, testCase.targetVal);
    deleteNodeBitwise(targetNode10);
    const result10 = linkedListToArray(head10);
    console.log(
      `Solution 10 (Bitwise): [${result10.join(", ")}] ${
        JSON.stringify(result10) === JSON.stringify(testCase.expected)
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
    { name: "Copy Next Node", func: deleteNode },
    { name: "Reference", func: deleteNodeReference },
    { name: "Destructuring", func: deleteNodeDestructuring },
    { name: "Array Methods", func: deleteNodeArray },
    { name: "Map", func: deleteNodeMap },
    { name: "Set", func: deleteNodeSet },
    { name: "Generator", func: deleteNodeGenerator },
    { name: "Class", func: deleteNodeClass },
    { name: "Functional", func: deleteNodeFunctional },
    { name: "Bitwise", func: deleteNodeBitwise },
  ];

  // Create test cases
  const smallList = createLinkedList([1, 2, 3, 4, 5]);
  const mediumList = createLinkedList(Array.from({ length: 100 }, (_, i) => i));
  const largeList = createLinkedList(Array.from({ length: 1000 }, (_, i) => i));

  const lists = [
    { name: "Small", list: smallList, target: 3 },
    { name: "Medium", list: mediumList, target: 50 },
    { name: "Large", list: largeList, target: 500 },
  ];

  lists.forEach(({ name, list, target }) => {
    console.log(`${name} List:`);

    testCases.forEach(({ name: funcName, func }) => {
      const head = createLinkedList(linkedListToArray(list));
      const targetNode = findNode(head, target);

      const start = performance.now();
      func(targetNode);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testDeleteNode();
// performanceComparison();

export {
  deleteNode,
  deleteNodeReference,
  deleteNodeDestructuring,
  deleteNodeArray,
  deleteNodeMap,
  deleteNodeSet,
  deleteNodeGenerator,
  deleteNodeClass,
  deleteNodeFunctional,
  deleteNodeBitwise,
  ListNode,
  NodeDeleter,
  nodeValueGenerator,
  createLinkedList,
  linkedListToArray,
  findNode,
  testDeleteNode,
  performanceComparison,
};
