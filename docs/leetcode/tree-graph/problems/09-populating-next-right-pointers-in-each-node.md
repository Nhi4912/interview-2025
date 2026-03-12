---
layout: page
title: "Populating Next Right Pointers in Each Node"
difficulty: Easy
category: Tree/Graph
tags: [Tree/Graph]
leetcode_url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/"
---

# Populating Next Right Pointers in Each Node



## Problem Description

 * and every parent has two children. Populate each next pointer to point to its next right node.  * If there is no next right node, the next pointer should be set to NULL.  *  *  * Companies: Amazon, Google, Microsoft, Facebook 

## Solutions

{% raw %}
/**
 * Populating Next Right Pointers in Each Node
 *
 * Problem: You are given a perfect binary tree where all leaves are on the same level,
 * and every parent has two children. Populate each next pointer to point to its next right node.
 * If there is no next right node, the next pointer should be set to NULL.
 *
 * LeetCode: https://leetcode.com/problems/populating-next-right-pointers-in-each-node/
 *
 * Companies: Amazon, Google, Microsoft, Facebook
 *
 * Difficulty: Medium
 *
 * Key Concepts: Level-order traversal, pointer manipulation, BFS
 */

/**
 * Definition for a Node.
 */
class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  next: Node | null;

  constructor(
    val: number = 0,
    left: Node | null = null,
    right: Node | null = null,
    next: Node | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.next = next;
  }
}

/**
 * Solution 1: Level-order Traversal with Queue (BFS)
 *
 * Time Complexity: O(n) - Each node is visited once
 * Space Complexity: O(w) - Where w is the maximum width of the tree
 *
 * Approach:
 * 1. Use BFS to traverse level by level
 * 2. For each level, connect nodes from left to right
 * 3. The last node in each level points to null
 *
 * Thuật toán:
 * 1. Sử dụng BFS để duyệt từng cấp
 * 2. Với mỗi cấp, kết nối các nút từ trái sang phải
 * 3. Nút cuối cùng trong mỗi cấp trỏ đến null
 */
function connect(root: Node | null): Node | null {
  if (!root) return null;

  const queue: Node[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift()!;

      // Connect to next node in the same level
      if (i < levelSize - 1) {
        current.next = queue[0];
      }

      // Add children to queue
      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }
  }

  return root;
}

/**
 * Solution 2: O(1) Space Approach (Optimal)
 *
 * Time Complexity: O(n) - Each node is visited once
 * Space Complexity: O(1) - Only using a few pointers
 *
 * Approach:
 * 1. Use the next pointers we're creating to traverse the tree
 * 2. For each node, connect its children
 * 3. Use the next pointer to move to the next node in the same level
 *
 * Thuật toán:
 * 1. Sử dụng các con trỏ next đang tạo để duyệt cây
 * 2. Với mỗi nút, kết nối các con của nó
 * 3. Sử dụng con trỏ next để di chuyển đến nút tiếp theo trong cùng cấp
 */
function connectOptimal(root: Node | null): Node | null {
  if (!root) return null;

  let leftmost = root;

  // While we have a leftmost node (not a leaf)
  while (leftmost.left) {
    let current = leftmost;

    // Traverse the current level
    while (current) {
      // Connect left child to right child
      current.left!.next = current.right;

      // Connect right child to next node's left child (if exists)
      if (current.next) {
        current.right!.next = current.next.left;
      }

      current = current.next;
    }

    // Move to the next level
    leftmost = leftmost.left;
  }

  return root;
}

/**
 * Solution 3: Recursive Approach
 *
 * Time Complexity: O(n) - Each node is visited once
 * Space Complexity: O(h) - Height of the tree (recursion stack)
 *
 * Approach:
 * 1. Recursively connect nodes at each level
 * 2. Use the next pointers to traverse horizontally
 * 3. Connect children and their cousins
 *
 * Thuật toán:
 * 1. Đệ quy kết nối các nút ở mỗi cấp
 * 2. Sử dụng con trỏ next để duyệt theo chiều ngang
 * 3. Kết nối các con và anh em họ của chúng
 */
function connectRecursive(root: Node | null): Node | null {
  if (!root) return null;

  function connectLevel(node: Node | null): void {
    if (!node || !node.left) return;

    // Connect left child to right child
    node.left.next = node.right;

    // Connect right child to next node's left child (if exists)
    if (node.next) {
      node.right!.next = node.next.left;
    }

    // Recursively connect next level
    connectLevel(node.left);
    connectLevel(node.right);
  }

  connectLevel(root);
  return root;
}

/**
 * Solution 4: DFS with Level Tracking
 *
 * Time Complexity: O(n) - Each node is visited once
 * Space Complexity: O(h) - Height of the tree (recursion stack)
 *
 * Approach:
 * 1. Use DFS to visit nodes in preorder
 * 2. Keep track of the rightmost node at each level
 * 3. Connect current node to the rightmost node at the same level
 *
 * Thuật toán:
 * 1. Sử dụng DFS để thăm các nút theo thứ tự preorder
 * 2. Theo dõi nút ngoài cùng bên phải ở mỗi cấp
 * 3. Kết nối nút hiện tại với nút ngoài cùng bên phải ở cùng cấp
 */
function connectDFS(root: Node | null): Node | null {
  if (!root) return null;

  const rightmost: Node[] = [];

  function dfs(node: Node | null, level: number): void {
    if (!node) return;

    // If this is the rightmost node at this level
    if (level >= rightmost.length) {
      rightmost.push(node);
    } else {
      // Connect to the rightmost node at this level
      rightmost[level].next = node;
      rightmost[level] = node;
    }

    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);
  return root;
}

/**
 * Utility function to create a perfect binary tree from array
 */
function createPerfectBinaryTree(values: number[]): Node | null {
  if (values.length === 0) return null;

  const root = new Node(values[0]);
  const queue: Node[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const current = queue.shift()!;

    if (i < values.length && values[i] !== null) {
      current.left = new Node(values[i]);
      queue.push(current.left);
    }
    i++;

    if (i < values.length && values[i] !== null) {
      current.right = new Node(values[i]);
      queue.push(current.right);
    }
    i++;
  }

  return root;
}

/**
 * Utility function to print tree with next pointers
 */
function printTreeWithNext(root: Node | null): void {
  if (!root) {
    console.log("Empty tree");
    return;
  }

  let current = root;
  let level = 0;

  while (current) {
    console.log(`Level ${level}:`);
    let node = current;
    const levelNodes: (number | string)[] = [];

    while (node) {
      levelNodes.push(node.val);
      node = node.next;
    }

    console.log(levelNodes.join(" -> "));
    current = current.left;
    level++;
  }
}

/**
 * Utility function to verify next pointers
 */
function verifyNextPointers(root: Node | null): boolean {
  if (!root) return true;

  let current = root;

  while (current) {
    let node = current;

    // Check if all nodes in this level are properly connected
    while (node && node.next) {
      if (node.next.val <= node.val) {
        return false; // Next pointer should point to a node with greater value
      }
      node = node.next;
    }

    current = current.left;
  }

  return true;
}

// Test cases
function runTests(): void {
  console.log("=== Testing Populating Next Right Pointers in Each Node ===\n");

  // Test Case 1: Simple perfect binary tree
  console.log("Test Case 1: Simple perfect binary tree");
  const values1 = [1, 2, 3, 4, 5, 6, 7];
  const tree1 = createPerfectBinaryTree(values1);

  console.log("Original tree:");
  printTreeWithNext(tree1);

  const result1 = connect(tree1);
  console.log("\nAfter connecting:");
  printTreeWithNext(result1);
  console.log("Next pointers valid:", verifyNextPointers(result1));
  console.log();

  // Test Case 2: Single node
  console.log("Test Case 2: Single node");
  const values2 = [1];
  const tree2 = createPerfectBinaryTree(values2);

  console.log("Original tree:");
  printTreeWithNext(tree2);

  const result2 = connect(tree2);
  console.log("\nAfter connecting:");
  printTreeWithNext(result2);
  console.log("Next pointers valid:", verifyNextPointers(result2));
  console.log();

  // Test Case 3: Larger perfect binary tree
  console.log("Test Case 3: Larger perfect binary tree");
  const values3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const tree3 = createPerfectBinaryTree(values3);

  console.log("Original tree:");
  printTreeWithNext(tree3);

  const result3 = connect(tree3);
  console.log("\nAfter connecting:");
  printTreeWithNext(result3);
  console.log("Next pointers valid:", verifyNextPointers(result3));
  console.log();

  // Test Case 4: Empty tree
  console.log("Test Case 4: Empty tree");
  const tree4 = null;
  const result4 = connect(tree4);
  console.log("Result:", result4);
  console.log();

  // Performance comparison
  console.log("=== Performance Comparison ===");

  // Create a large perfect binary tree (15 levels = 2^15 - 1 nodes)
  const largeValues = Array.from({ length: 32767 }, (_, i) => i + 1);
  const largeTree = createPerfectBinaryTree(largeValues);

  console.time("BFS Approach");
  connect(largeTree);
  console.timeEnd("BFS Approach");

  const largeTree2 = createPerfectBinaryTree(largeValues);
  console.time("Optimal O(1) Space Approach");
  connectOptimal(largeTree2);
  console.timeEnd("Optimal O(1) Space Approach");

  const largeTree3 = createPerfectBinaryTree(largeValues);
  console.time("Recursive Approach");
  connectRecursive(largeTree3);
  console.timeEnd("Recursive Approach");

  const largeTree4 = createPerfectBinaryTree(largeValues);
  console.time("DFS Approach");
  connectDFS(largeTree4);
  console.timeEnd("DFS Approach");
}

// Run tests
runTests();

export { connect, connectOptimal, connectRecursive, connectDFS, Node };
{% endraw %}
