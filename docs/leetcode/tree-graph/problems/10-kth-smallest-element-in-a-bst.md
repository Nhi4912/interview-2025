---
layout: page
title: "Kth Smallest Element in a BST"
difficulty: Easy
category: Tree/Graph
tags: [Tree/Graph, Binary Search]
leetcode_url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
---

# Kth Smallest Element in a BST



## Problem Description

 * return the kth smallest value (1-indexed) of all the values of the nodes in the tree.  *  *  * Companies: Amazon, Google, Microsoft  * 

## Solutions

{% raw %}
/**
 * Kth Smallest Element in a BST
 *
 * Problem: Given the root of a binary search tree and an integer k,
 * return the kth smallest value (1-indexed) of all the values of the nodes in the tree.
 *
 * LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 *
 * Companies: Amazon, Google, Microsoft
 *
 * Difficulty: Medium
 *
 * Key Concepts: BST properties, inorder traversal, iterative DFS
 */

/**
 * Definition for a binary tree node.
 */
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number = 0,
    left: TreeNode | null = null,
    right: TreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Solution 1: Inorder Traversal with Stack (Iterative)
 *
 * Time Complexity: O(h + k) - Where h is the height of the tree
 * Space Complexity: O(h) - Stack space
 *
 * Approach:
 * 1. Use iterative inorder traversal with stack
 * 2. Keep track of visited nodes count
 * 3. Return the kth element when count reaches k
 *
 * Thuật toán:
 * 1. Sử dụng duyệt inorder với stack
 * 2. Theo dõi số lượng nút đã thăm
 * 3. Trả về phần tử thứ k khi đếm đạt k
 */
function kthSmallest(root: TreeNode | null, k: number): number {
  if (!root) return -1;

  const stack: TreeNode[] = [];
  let current = root;
  let count = 0;

  while (current || stack.length > 0) {
    // Go to the leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Process current node
    current = stack.pop()!;
    count++;

    if (count === k) {
      return current.val;
    }

    // Move to right subtree
    current = current.right;
  }

  return -1; // k is larger than number of nodes
}

/**
 * Solution 2: Recursive Inorder Traversal
 *
 * Time Complexity: O(n) - Visit all nodes in worst case
 * Space Complexity: O(h) - Recursion stack
 *
 * Approach:
 * 1. Use recursive inorder traversal
 * 2. Keep track of count and result
 * 3. Early termination when kth element is found
 *
 * Thuật toán:
 * 1. Sử dụng duyệt inorder đệ quy
 * 2. Theo dõi đếm và kết quả
 * 3. Dừng sớm khi tìm thấy phần tử thứ k
 */
function kthSmallestRecursive(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = -1;

  function inorder(node: TreeNode | null): void {
    if (!node || count >= k) return;

    inorder(node.left);

    count++;
    if (count === k) {
      result = node.val;
      return;
    }

    inorder(node.right);
  }

  inorder(root);
  return result;
}

/**
 * Solution 3: Morris Traversal (O(1) Space)
 *
 * Time Complexity: O(n) - Each edge is traversed at most 3 times
 * Space Complexity: O(1) - Only using a few pointers
 *
 * Approach:
 * 1. Use Morris traversal to avoid stack/recursion
 * 2. Create temporary links to predecessor
 * 3. Restore tree structure after processing
 *
 * Thuật toán:
 * 1. Sử dụng Morris traversal để tránh stack/đệ quy
 * 2. Tạo liên kết tạm thời đến nút tiền nhiệm
 * 3. Khôi phục cấu trúc cây sau khi xử lý
 */
function kthSmallestMorris(root: TreeNode | null, k: number): number {
  if (!root) return -1;

  let current = root;
  let count = 0;

  while (current) {
    if (!current.left) {
      // Process current node
      count++;
      if (count === k) {
        return current.val;
      }
      current = current.right;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Create temporary link
        predecessor.right = current;
        current = current.left;
      } else {
        // Remove temporary link and process current node
        predecessor.right = null;
        count++;
        if (count === k) {
          return current.val;
        }
        current = current.right;
      }
    }
  }

  return -1;
}

/**
 * Solution 4: Binary Search on Tree Structure
 *
 * Time Complexity: O(n) - Count nodes in each subtree
 * Space Complexity: O(h) - Recursion stack
 *
 * Approach:
 * 1. Count nodes in left subtree
 * 2. If count >= k, search in left subtree
 * 3. If count + 1 == k, current node is the answer
 * 4. Otherwise, search in right subtree with k - count - 1
 *
 * Thuật toán:
 * 1. Đếm nút trong cây con trái
 * 2. Nếu đếm >= k, tìm trong cây con trái
 * 3. Nếu đếm + 1 == k, nút hiện tại là đáp án
 * 4. Ngược lại, tìm trong cây con phải với k - đếm - 1
 */
function kthSmallestBinarySearch(root: TreeNode | null, k: number): number {
  function countNodes(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }

  function findKth(node: TreeNode | null, k: number): number {
    if (!node) return -1;

    const leftCount = countNodes(node.left);

    if (leftCount >= k) {
      return findKth(node.left, k);
    } else if (leftCount + 1 === k) {
      return node.val;
    } else {
      return findKth(node.right, k - leftCount - 1);
    }
  }

  return findKth(root, k);
}

/**
 * Solution 5: Augmented Tree Node (For repeated queries)
 *
 * Time Complexity: O(h) - Height of the tree
 * Space Complexity: O(n) - Additional storage for node counts
 *
 * Approach:
 * 1. Augment each node with count of nodes in its subtree
 * 2. Use this information to navigate to kth smallest
 * 3. Efficient for multiple queries on the same tree
 *
 * Thuật toán:
 * 1. Bổ sung mỗi nút với số lượng nút trong cây con
 * 2. Sử dụng thông tin này để điều hướng đến phần tử nhỏ thứ k
 * 3. Hiệu quả cho nhiều truy vấn trên cùng một cây
 */
class AugmentedTreeNode {
  val: number;
  left: AugmentedTreeNode | null;
  right: AugmentedTreeNode | null;
  count: number; // Number of nodes in subtree rooted at this node

  constructor(
    val: number = 0,
    left: AugmentedTreeNode | null = null,
    right: AugmentedTreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.count = 1;
  }
}

function buildAugmentedTree(root: TreeNode | null): AugmentedTreeNode | null {
  if (!root) return null;

  const augmentedRoot = new AugmentedTreeNode(root.val);
  augmentedRoot.left = buildAugmentedTree(root.left);
  augmentedRoot.right = buildAugmentedTree(root.right);

  // Calculate count
  augmentedRoot.count =
    1 + (augmentedRoot.left?.count || 0) + (augmentedRoot.right?.count || 0);

  return augmentedRoot;
}

function kthSmallestAugmented(
  root: AugmentedTreeNode | null,
  k: number
): number {
  if (!root) return -1;

  const leftCount = root.left?.count || 0;

  if (leftCount >= k) {
    return kthSmallestAugmented(root.left, k);
  } else if (leftCount + 1 === k) {
    return root.val;
  } else {
    return kthSmallestAugmented(root.right, k - leftCount - 1);
  }
}

/**
 * Utility function to create BST from array
 */
function createBST(values: number[]): TreeNode | null {
  if (values.length === 0) return null;

  const root = new TreeNode(values[0]);

  for (let i = 1; i < values.length; i++) {
    insertBST(root, values[i]);
  }

  return root;
}

function insertBST(root: TreeNode, val: number): void {
  if (val < root.val) {
    if (root.left) {
      insertBST(root.left, val);
    } else {
      root.left = new TreeNode(val);
    }
  } else {
    if (root.right) {
      insertBST(root.right, val);
    } else {
      root.right = new TreeNode(val);
    }
  }
}

/**
 * Utility function to print tree in inorder (sorted order)
 */
function printInorder(root: TreeNode | null): number[] {
  const result: number[] = [];

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    result.push(node.val);
    inorder(node.right);
  }

  inorder(root);
  return result;
}

// Test cases
function runTests(): void {
  console.log("=== Testing Kth Smallest Element in a BST ===\n");

  // Test Case 1: Simple BST
  console.log("Test Case 1: Simple BST");
  const values1 = [3, 1, 4, null, 2];
  const tree1 = createBST([3, 1, 4, 2]);
  const k1 = 1;

  console.log("BST values (inorder):", printInorder(tree1));
  console.log(`Finding ${k1}th smallest element`);

  console.log("Iterative approach:", kthSmallest(tree1, k1));
  console.log("Recursive approach:", kthSmallestRecursive(tree1, k1));
  console.log("Morris approach:", kthSmallestMorris(tree1, k1));
  console.log("Binary search approach:", kthSmallestBinarySearch(tree1, k1));
  console.log();

  // Test Case 2: Larger BST
  console.log("Test Case 2: Larger BST");
  const tree2 = createBST([5, 3, 6, 2, 4, null, null, 1]);
  const k2 = 3;

  console.log("BST values (inorder):", printInorder(tree2));
  console.log(`Finding ${k2}th smallest element`);

  console.log("Iterative approach:", kthSmallest(tree2, k2));
  console.log("Recursive approach:", kthSmallestRecursive(tree2, k2));
  console.log("Morris approach:", kthSmallestMorris(tree2, k2));
  console.log("Binary search approach:", kthSmallestBinarySearch(tree2, k2));
  console.log();

  // Test Case 3: Single node
  console.log("Test Case 3: Single node");
  const tree3 = createBST([1]);
  const k3 = 1;

  console.log("BST values (inorder):", printInorder(tree3));
  console.log(`Finding ${k3}th smallest element`);

  console.log("Iterative approach:", kthSmallest(tree3, k3));
  console.log("Recursive approach:", kthSmallestRecursive(tree3, k3));
  console.log("Morris approach:", kthSmallestMorris(tree3, k3));
  console.log("Binary search approach:", kthSmallestBinarySearch(tree3, k3));
  console.log();

  // Test Case 4: Left-skewed BST
  console.log("Test Case 4: Left-skewed BST");
  const tree4 = createBST([3, 2, 1]);
  const k4 = 2;

  console.log("BST values (inorder):", printInorder(tree4));
  console.log(`Finding ${k4}th smallest element`);

  console.log("Iterative approach:", kthSmallest(tree4, k4));
  console.log("Recursive approach:", kthSmallestRecursive(tree4, k4));
  console.log("Morris approach:", kthSmallestMorris(tree4, k4));
  console.log("Binary search approach:", kthSmallestBinarySearch(tree4, k4));
  console.log();

  // Test Case 5: Right-skewed BST
  console.log("Test Case 5: Right-skewed BST");
  const tree5 = createBST([1, 2, 3]);
  const k5 = 3;

  console.log("BST values (inorder):", printInorder(tree5));
  console.log(`Finding ${k5}th smallest element`);

  console.log("Iterative approach:", kthSmallest(tree5, k5));
  console.log("Recursive approach:", kthSmallestRecursive(tree5, k5));
  console.log("Morris approach:", kthSmallestMorris(tree5, k5));
  console.log("Binary search approach:", kthSmallestBinarySearch(tree5, k5));
  console.log();

  // Performance comparison
  console.log("=== Performance Comparison ===");

  // Create a large BST
  const largeValues = Array.from({ length: 10000 }, (_, i) => i + 1);
  const largeTree = createBST(largeValues);
  const kLarge = 5000;

  console.time("Iterative Approach");
  kthSmallest(largeTree, kLarge);
  console.timeEnd("Iterative Approach");

  const largeTree2 = createBST(largeValues);
  console.time("Recursive Approach");
  kthSmallestRecursive(largeTree2, kLarge);
  console.timeEnd("Recursive Approach");

  const largeTree3 = createBST(largeValues);
  console.time("Morris Approach");
  kthSmallestMorris(largeTree3, kLarge);
  console.timeEnd("Morris Approach");

  const largeTree4 = createBST(largeValues);
  console.time("Binary Search Approach");
  kthSmallestBinarySearch(largeTree4, kLarge);
  console.timeEnd("Binary Search Approach");

  // Test augmented tree for multiple queries
  console.log("\n=== Augmented Tree for Multiple Queries ===");
  const augmentedTree = buildAugmentedTree(largeTree);

  console.time("Augmented Tree (first query)");
  kthSmallestAugmented(augmentedTree, kLarge);
  console.timeEnd("Augmented Tree (first query)");

  console.time("Augmented Tree (second query)");
  kthSmallestAugmented(augmentedTree, kLarge + 100);
  console.timeEnd("Augmented Tree (second query)");
}

// Run tests
runTests();

export {
  kthSmallest,
  kthSmallestRecursive,
  kthSmallestMorris,
  kthSmallestBinarySearch,
  TreeNode,
};
{% endraw %}
