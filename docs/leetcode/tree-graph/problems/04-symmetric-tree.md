---
layout: page
title: "Symmetric Tree"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph, Two Pointers]
leetcode_url: "https://leetcode.com/problems/symmetric-tree/"
---

# Symmetric Tree

**LeetCode Problem # * 101. Symmetric Tree**

## Problem Description

 * Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).  *  * Input: root = [1,2,2,3,4,4,3]  * Output: true  * 

## Solutions

{% raw %}
/**
 * 101. Symmetric Tree
 *
 * Problem:
 * Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).
 *
 * Example:
 * Input: root = [1,2,2,3,4,4,3]
 * Output: true
 *
 * Input: root = [1,2,2,null,3,null,3]
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/symmetric-tree/
 */

// Definition for a binary tree node
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

/**
 * Solution 1: Recursive DFS (Optimal)
 *
 * Approach:
 * - Compare left subtree with right subtree
 * - Check if left.left == right.right and left.right == right.left
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h) - height of tree
 */
function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true;

  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
    if (!left && !right) return true;
    if (!left || !right) return false;

    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  }

  return isMirror(root.left, root.right);
}

/**
 * Solution 2: Iterative DFS with Stack
 *
 * Approach:
 * - Use stack to simulate recursive calls
 * - Push pairs of nodes to compare
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricIterative(root: TreeNode | null): boolean {
  if (!root) return true;

  const stack: [TreeNode | null, TreeNode | null][] = [[root.left, root.right]];

  while (stack.length > 0) {
    const [left, right] = stack.pop()!;

    if (!left && !right) continue;
    if (!left || !right) return false;
    if (left.val !== right.val) return false;

    stack.push([left.left, right.right]);
    stack.push([left.right, right.left]);
  }

  return true;
}

/**
 * Solution 3: BFS with Queue
 *
 * Approach:
 * - Use queue for level-order traversal
 * - Compare nodes level by level
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricBFS(root: TreeNode | null): boolean {
  if (!root) return true;

  const queue: (TreeNode | null)[] = [root.left, root.right];

  while (queue.length > 0) {
    const left = queue.shift()!;
    const right = queue.shift()!;

    if (!left && !right) continue;
    if (!left || !right) return false;
    if (left.val !== right.val) return false;

    queue.push(left.left, right.right);
    queue.push(left.right, right.left);
  }

  return true;
}

/**
 * Solution 4: Using Array (Level Order)
 *
 * Approach:
 * - Convert tree to level-order array
 * - Check if each level is symmetric
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricArray(root: TreeNode | null): boolean {
  if (!root) return true;

  function levelOrderTraversal(root: TreeNode | null): number[][] {
    if (!root) return [];

    const result: number[][] = [];
    const queue: (TreeNode | null)[] = [root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const level: number[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        if (node) {
          level.push(node.val);
          queue.push(node.left, node.right);
        } else {
          level.push(null!);
        }
      }

      result.push(level);
    }

    return result;
  }

  function isLevelSymmetric(level: number[]): boolean {
    let left = 0;
    let right = level.length - 1;

    while (left < right) {
      if (level[left] !== level[right]) return false;
      left++;
      right--;
    }

    return true;
  }

  const levels = levelOrderTraversal(root);

  for (const level of levels) {
    if (!isLevelSymmetric(level)) return false;
  }

  return true;
}

/**
 * Solution 5: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a SymmetryChecker class
 * - Encapsulate the symmetry checking logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
class SymmetryChecker {
  private root: TreeNode | null;

  constructor(root: TreeNode | null) {
    this.root = root;
  }

  check(): boolean {
    if (!this.root) return true;
    return this.isMirror(this.root.left, this.root.right);
  }

  private isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
    if (!left && !right) return true;
    if (!left || !right) return false;

    return (
      left.val === right.val &&
      this.isMirror(left.left, right.right) &&
      this.isMirror(left.right, right.left)
    );
  }

  getRoot(): TreeNode | null {
    return this.root;
  }
}

function isSymmetricClass(root: TreeNode | null): boolean {
  const checker = new SymmetryChecker(root);
  return checker.check();
}

/**
 * Solution 6: Using Generator
 *
 * Approach:
 * - Use generator to yield node pairs
 * - Memory efficient for large trees
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function* symmetricTreeGenerator(
  root: TreeNode | null
): Generator<[TreeNode | null, TreeNode | null]> {
  if (!root) return;

  const stack: [TreeNode | null, TreeNode | null][] = [[root.left, root.right]];

  while (stack.length > 0) {
    const pair = stack.pop()!;
    yield pair;

    const [left, right] = pair;
    if (left && right) {
      stack.push([left.left, right.right]);
      stack.push([left.right, right.left]);
    }
  }
}

function isSymmetricWithGenerator(root: TreeNode | null): boolean {
  if (!root) return true;

  for (const [left, right] of symmetricTreeGenerator(root)) {
    if (!left && !right) continue;
    if (!left || !right) return false;
    if (left.val !== right.val) return false;
  }

  return true;
}

/**
 * Solution 7: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function isSymmetricFunctional(root: TreeNode | null): boolean {
  if (!root) return true;

  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
    if (!left && !right) return true;
    if (!left || !right) return false;

    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  }

  return isMirror(root.left, root.right);
}

/**
 * Solution 8: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to traverse left and right subtrees
 * - More explicit pointer manipulation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function isSymmetricTwoPointers(root: TreeNode | null): boolean {
  if (!root) return true;

  function traverse(left: TreeNode | null, right: TreeNode | null): boolean {
    if (!left && !right) return true;
    if (!left || !right) return false;

    // Check current nodes
    if (left.val !== right.val) return false;

    // Check left.left with right.right
    if (!traverse(left.left, right.right)) return false;

    // Check left.right with right.left
    return traverse(left.right, right.left);
  }

  return traverse(root.left, root.right);
}

/**
 * Solution 9: Using Inorder Traversal
 *
 * Approach:
 * - Get inorder traversal of left and right subtrees
 * - Compare the traversals
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricInorder(root: TreeNode | null): boolean {
  if (!root) return true;

  function inorderTraversal(node: TreeNode | null, isLeft: boolean): number[] {
    if (!node) return [];

    const result: number[] = [];

    if (isLeft) {
      result.push(...inorderTraversal(node.left, true));
      result.push(node.val);
      result.push(...inorderTraversal(node.right, true));
    } else {
      result.push(...inorderTraversal(node.right, false));
      result.push(node.val);
      result.push(...inorderTraversal(node.left, false));
    }

    return result;
  }

  const leftTraversal = inorderTraversal(root.left, true);
  const rightTraversal = inorderTraversal(root.right, false);

  if (leftTraversal.length !== rightTraversal.length) return false;

  for (let i = 0; i < leftTraversal.length; i++) {
    if (leftTraversal[i] !== rightTraversal[i]) return false;
  }

  return true;
}

/**
 * Solution 10: Using Preorder Traversal
 *
 * Approach:
 * - Get preorder traversal of left and right subtrees
 * - Compare the traversals
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricPreorder(root: TreeNode | null): boolean {
  if (!root) return true;

  function preorderTraversal(node: TreeNode | null, isLeft: boolean): number[] {
    if (!node) return [];

    const result: number[] = [];

    if (isLeft) {
      result.push(node.val);
      result.push(...preorderTraversal(node.left, true));
      result.push(...preorderTraversal(node.right, true));
    } else {
      result.push(node.val);
      result.push(...preorderTraversal(node.right, false));
      result.push(...preorderTraversal(node.left, false));
    }

    return result;
  }

  const leftTraversal = preorderTraversal(root.left, true);
  const rightTraversal = preorderTraversal(root.right, false);

  if (leftTraversal.length !== rightTraversal.length) return false;

  for (let i = 0; i < leftTraversal.length; i++) {
    if (leftTraversal[i] !== rightTraversal[i]) return false;
  }

  return true;
}

/**
 * Solution 11: Using Postorder Traversal
 *
 * Approach:
 * - Get postorder traversal of left and right subtrees
 * - Compare the traversals
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isSymmetricPostorder(root: TreeNode | null): boolean {
  if (!root) return true;

  function postorderTraversal(
    node: TreeNode | null,
    isLeft: boolean
  ): number[] {
    if (!node) return [];

    const result: number[] = [];

    if (isLeft) {
      result.push(...postorderTraversal(node.left, true));
      result.push(...postorderTraversal(node.right, true));
      result.push(node.val);
    } else {
      result.push(...postorderTraversal(node.right, false));
      result.push(...postorderTraversal(node.left, false));
      result.push(node.val);
    }

    return result;
  }

  const leftTraversal = postorderTraversal(root.left, true);
  const rightTraversal = postorderTraversal(root.right, false);

  if (leftTraversal.length !== rightTraversal.length) return false;

  for (let i = 0; i < leftTraversal.length; i++) {
    if (leftTraversal[i] !== rightTraversal[i]) return false;
  }

  return true;
}

// Helper function to create a binary tree from array
function createBinaryTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]!);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    if (node && i < values.length) {
      if (values[i] !== null) {
        node.left = new TreeNode(values[i]!);
        queue.push(node.left);
      }
      i++;
    }

    if (node && i < values.length) {
      if (values[i] !== null) {
        node.right = new TreeNode(values[i]!);
        queue.push(node.right);
      }
      i++;
    }
  }

  return root;
}

// Helper function to convert binary tree to array
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];

  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node) {
      result.push(node.val);
      queue.push(node.left, node.right);
    } else {
      result.push(null);
    }

    // Stop if all remaining nodes are null
    if (queue.every((n) => n === null)) break;
  }

  return result;
}

// Test cases
function testIsSymmetric() {
  console.log("=== Testing Symmetric Tree ===\n");

  const testCases = [
    {
      input: [1, 2, 2, 3, 4, 4, 3],
      expected: true,
      description: "Symmetric tree",
    },
    {
      input: [1, 2, 2, null, 3, null, 3],
      expected: false,
      description: "Asymmetric tree",
    },
    {
      input: [1],
      expected: true,
      description: "Single node",
    },
    {
      input: [],
      expected: true,
      description: "Empty tree",
    },
    {
      input: [1, 2, 2, 3, 4, 4, 3, 5, 6, 6, 5],
      expected: true,
      description: "Complex symmetric tree",
    },
    {
      input: [1, 2, 2, 3, 4, 4, 3, 5, 6, 6, 5, 7],
      expected: false,
      description: "Complex asymmetric tree",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${testCase.expected}\n`);

    const root = createBinaryTree(testCase.input);

    // Test Solution 1 (Recursive DFS)
    const result1 = isSymmetric(root);
    console.log(
      `Solution 1 (Recursive DFS): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Iterative DFS)
    const result2 = isSymmetricIterative(root);
    console.log(
      `Solution 2 (Iterative DFS): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (BFS)
    const result3 = isSymmetricBFS(root);
    console.log(
      `Solution 3 (BFS): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const result4 = isSymmetricArray(root);
    console.log(
      `Solution 4 (Array): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Class)
    const result5 = isSymmetricClass(root);
    console.log(
      `Solution 5 (Class): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const result6 = isSymmetricWithGenerator(root);
    console.log(
      `Solution 6 (Generator): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Functional)
    const result7 = isSymmetricFunctional(root);
    console.log(
      `Solution 7 (Functional): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Two Pointers)
    const result8 = isSymmetricTwoPointers(root);
    console.log(
      `Solution 8 (Two Pointers): ${result8} ${
        result8 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Inorder)
    const result9 = isSymmetricInorder(root);
    console.log(
      `Solution 9 (Inorder): ${result9} ${
        result9 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Preorder)
    const result10 = isSymmetricPreorder(root);
    console.log(
      `Solution 10 (Preorder): ${result10} ${
        result10 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 11 (Postorder)
    const result11 = isSymmetricPostorder(root);
    console.log(
      `Solution 11 (Postorder): ${result11} ${
        result11 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Recursive DFS", func: isSymmetric },
    { name: "Iterative DFS", func: isSymmetricIterative },
    { name: "BFS", func: isSymmetricBFS },
    { name: "Array", func: isSymmetricArray },
    { name: "Class", func: isSymmetricClass },
    { name: "Generator", func: isSymmetricWithGenerator },
    { name: "Functional", func: isSymmetricFunctional },
    { name: "Two Pointers", func: isSymmetricTwoPointers },
    { name: "Inorder", func: isSymmetricInorder },
    { name: "Preorder", func: isSymmetricPreorder },
    { name: "Postorder", func: isSymmetricPostorder },
  ];

  // Create test cases
  const smallCase = createBinaryTree([1, 2, 2, 3, 4, 4, 3]);
  const mediumCase = createBinaryTree([
    1, 2, 2, 3, 4, 4, 3, 5, 6, 6, 5, 7, 8, 8, 7,
  ]);
  const largeCase = createBinaryTree(
    Array.from({ length: 100 }, (_, i) => (i % 3 === 0 ? i : null))
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

// Uncomment the following lines to run tests
// testIsSymmetric();
// performanceComparison();

export {
  isSymmetric,
  isSymmetricIterative,
  isSymmetricBFS,
  isSymmetricArray,
  isSymmetricClass,
  isSymmetricWithGenerator,
  isSymmetricFunctional,
  isSymmetricTwoPointers,
  isSymmetricInorder,
  isSymmetricPreorder,
  isSymmetricPostorder,
  SymmetryChecker,
  symmetricTreeGenerator,
  TreeNode,
  createBinaryTree,
  treeToArray,
  testIsSymmetric,
  performanceComparison,
};
{% endraw %}
