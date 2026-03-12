---
layout: page
title: "Inorder Successor in BST"
difficulty: Easy
category: Tree/Graph
tags: [Tree/Graph]
leetcode_url: "https://leetcode.com/problems/inorder-successor-in-bst/"
---

# Inorder Successor in BST



## Problem Description

 * return the in-order successor of that node in the BST. If the given node  * has no in-order successor in the tree, return null.  *  *  * Companies: Amazon, Google, Microsoft 

## Solutions

{% raw %}
/**
 * Inorder Successor in BST
 *
 * Problem: Given the root of a binary search tree and a node p in it,
 * return the in-order successor of that node in the BST. If the given node
 * has no in-order successor in the tree, return null.
 *
 * LeetCode: https://leetcode.com/problems/inorder-successor-in-bst/
 *
 * Companies: Amazon, Google, Microsoft
 *
 * Difficulty: Medium
 *
 * Key Concepts: BST properties, inorder traversal, successor finding
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
 * Time Complexity: O(n) - Worst case visit all nodes
 * Space Complexity: O(h) - Stack space
 *
 * Approach:
 * 1. Use iterative inorder traversal
 * 2. Keep track of previous node
 * 3. When current node equals target, return previous node
 *
 * Thuật toán:
 * 1. Sử dụng duyệt inorder với stack
 * 2. Theo dõi nút trước đó
 * 3. Khi nút hiện tại bằng nút đích, trả về nút trước đó
 */
function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {
  if (!root) return null;

  const stack: TreeNode[] = [];
  let current = root;
  let previous: TreeNode | null = null;

  while (current || stack.length > 0) {
    // Go to the leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Process current node
    current = stack.pop()!;

    // If previous node was the target, current is the successor
    if (previous === p) {
      return current;
    }

    previous = current;
    current = current.right;
  }

  return null; // No successor found
}

/**
 * Solution 2: BST Properties (Optimal)
 *
 * Time Complexity: O(h) - Height of the tree
 * Space Complexity: O(1) - Only using a few pointers
 *
 * Approach:
 * 1. If p has right child, successor is leftmost node in right subtree
 * 2. If p has no right child, successor is the first ancestor where p is in left subtree
 * 3. Use BST properties to navigate efficiently
 *
 * Thuật toán:
 * 1. Nếu p có con phải, successor là nút ngoài cùng bên trái của cây con phải
 * 2. Nếu p không có con phải, successor là tổ tiên đầu tiên mà p nằm trong cây con trái
 * 3. Sử dụng tính chất BST để điều hướng hiệu quả
 */
function inorderSuccessorOptimal(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  if (!root) return null;

  // If p has right child, successor is leftmost node in right subtree
  if (p.right) {
    let successor = p.right;
    while (successor.left) {
      successor = successor.left;
    }
    return successor;
  }

  // If p has no right child, find the first ancestor where p is in left subtree
  let successor: TreeNode | null = null;
  let current = root;

  while (current !== p) {
    if (p.val < current.val) {
      successor = current; // Current could be the successor
      current = current.left;
    } else {
      current = current.right;
    }
  }

  return successor;
}

/**
 * Solution 3: Recursive Approach
 *
 * Time Complexity: O(h) - Height of the tree
 * Space Complexity: O(h) - Recursion stack
 *
 * Approach:
 * 1. Use recursive BST search
 * 2. Keep track of potential successor
 * 3. Navigate based on node values
 *
 * Thuật toán:
 * 1. Sử dụng tìm kiếm BST đệ quy
 * 2. Theo dõi successor tiềm năng
 * 3. Điều hướng dựa trên giá trị nút
 */
function inorderSuccessorRecursive(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  let successor: TreeNode | null = null;

  function findSuccessor(node: TreeNode | null): void {
    if (!node) return;

    if (p.val < node.val) {
      successor = node; // Current node could be successor
      findSuccessor(node.left);
    } else {
      findSuccessor(node.right);
    }
  }

  findSuccessor(root);

  // If p has right child, find leftmost in right subtree
  if (p.right) {
    let temp = p.right;
    while (temp.left) {
      temp = temp.left;
    }
    return temp;
  }

  return successor;
}

/**
 * Solution 4: Morris Traversal (O(1) Space)
 *
 * Time Complexity: O(n) - Each edge is traversed at most 3 times
 * Space Complexity: O(1) - Only using a few pointers
 *
 * Approach:
 * 1. Use Morris traversal to avoid stack/recursion
 * 2. Keep track of previous node
 * 3. Find successor during traversal
 *
 * Thuật toán:
 * 1. Sử dụng Morris traversal để tránh stack/đệ quy
 * 2. Theo dõi nút trước đó
 * 3. Tìm successor trong quá trình duyệt
 */
function inorderSuccessorMorris(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  if (!root) return null;

  let current = root;
  let previous: TreeNode | null = null;

  while (current) {
    if (!current.left) {
      // Process current node
      if (previous === p) {
        return current;
      }
      previous = current;
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
        if (previous === p) {
          return current;
        }
        previous = current;
        current = current.right;
      }
    }
  }

  return null;
}

/**
 * Solution 5: Two-Pass Approach
 *
 * Time Complexity: O(n) - Two passes through the tree
 * Space Complexity: O(n) - Store all nodes in order
 *
 * Approach:
 * 1. First pass: collect all nodes in inorder
 * 2. Second pass: find target node and return next node
 *
 * Thuật toán:
 * 1. Lần đầu: thu thập tất cả nút theo thứ tự inorder
 * 2. Lần hai: tìm nút đích và trả về nút tiếp theo
 */
function inorderSuccessorTwoPass(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  if (!root) return null;

  const nodes: TreeNode[] = [];

  // Collect all nodes in inorder
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    nodes.push(node);
    inorder(node.right);
  }

  inorder(root);

  // Find target node and return next node
  for (let i = 0; i < nodes.length - 1; i++) {
    if (nodes[i] === p) {
      return nodes[i + 1];
    }
  }

  return null; // Target is the last node or not found
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
 * Utility function to find node by value
 */
function findNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;

  if (root.val === val) return root;

  if (val < root.val) {
    return findNode(root.left, val);
  } else {
    return findNode(root.right, val);
  }
}

/**
 * Utility function to print tree in inorder
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
  console.log("=== Testing Inorder Successor in BST ===\n");

  // Test Case 1: Simple BST
  console.log("Test Case 1: Simple BST");
  const tree1 = createBST([2, 1, 3]);
  const p1 = findNode(tree1, 1);

  console.log("BST values (inorder):", printInorder(tree1));
  console.log(`Finding successor of node ${p1?.val}`);

  console.log("Iterative approach:", inorderSuccessor(tree1, p1!)?.val);
  console.log("Optimal approach:", inorderSuccessorOptimal(tree1, p1!)?.val);
  console.log(
    "Recursive approach:",
    inorderSuccessorRecursive(tree1, p1!)?.val
  );
  console.log("Morris approach:", inorderSuccessorMorris(tree1, p1!)?.val);
  console.log("Two-pass approach:", inorderSuccessorTwoPass(tree1, p1!)?.val);
  console.log();

  // Test Case 2: Larger BST
  console.log("Test Case 2: Larger BST");
  const tree2 = createBST([5, 3, 6, 2, 4, null, null, 1]);
  const p2 = findNode(tree2, 4);

  console.log("BST values (inorder):", printInorder(tree2));
  console.log(`Finding successor of node ${p2?.val}`);

  console.log("Iterative approach:", inorderSuccessor(tree2, p2!)?.val);
  console.log("Optimal approach:", inorderSuccessorOptimal(tree2, p2!)?.val);
  console.log(
    "Recursive approach:",
    inorderSuccessorRecursive(tree2, p2!)?.val
  );
  console.log("Morris approach:", inorderSuccessorMorris(tree2, p2!)?.val);
  console.log("Two-pass approach:", inorderSuccessorTwoPass(tree2, p2!)?.val);
  console.log();

  // Test Case 3: Node with right child
  console.log("Test Case 3: Node with right child");
  const tree3 = createBST([5, 3, 6, 2, 4, null, null, 1]);
  const p3 = findNode(tree3, 3);

  console.log("BST values (inorder):", printInorder(tree3));
  console.log(`Finding successor of node ${p3?.val}`);

  console.log("Iterative approach:", inorderSuccessor(tree3, p3!)?.val);
  console.log("Optimal approach:", inorderSuccessorOptimal(tree3, p3!)?.val);
  console.log(
    "Recursive approach:",
    inorderSuccessorRecursive(tree3, p3!)?.val
  );
  console.log("Morris approach:", inorderSuccessorMorris(tree3, p3!)?.val);
  console.log("Two-pass approach:", inorderSuccessorTwoPass(tree3, p3!)?.val);
  console.log();

  // Test Case 4: Last node (no successor)
  console.log("Test Case 4: Last node (no successor)");
  const tree4 = createBST([5, 3, 6, 2, 4, null, null, 1]);
  const p4 = findNode(tree4, 6);

  console.log("BST values (inorder):", printInorder(tree4));
  console.log(`Finding successor of node ${p4?.val}`);

  console.log("Iterative approach:", inorderSuccessor(tree4, p4!));
  console.log("Optimal approach:", inorderSuccessorOptimal(tree4, p4!));
  console.log("Recursive approach:", inorderSuccessorRecursive(tree4, p4!));
  console.log("Morris approach:", inorderSuccessorMorris(tree4, p4!));
  console.log("Two-pass approach:", inorderSuccessorTwoPass(tree4, p4!));
  console.log();

  // Test Case 5: Single node
  console.log("Test Case 5: Single node");
  const tree5 = createBST([1]);
  const p5 = findNode(tree5, 1);

  console.log("BST values (inorder):", printInorder(tree5));
  console.log(`Finding successor of node ${p5?.val}`);

  console.log("Iterative approach:", inorderSuccessor(tree5, p5!));
  console.log("Optimal approach:", inorderSuccessorOptimal(tree5, p5!));
  console.log("Recursive approach:", inorderSuccessorRecursive(tree5, p5!));
  console.log("Morris approach:", inorderSuccessorMorris(tree5, p5!));
  console.log("Two-pass approach:", inorderSuccessorTwoPass(tree5, p5!));
  console.log();

  // Performance comparison
  console.log("=== Performance Comparison ===");

  // Create a large BST
  const largeValues = Array.from({ length: 10000 }, (_, i) => i + 1);
  const largeTree = createBST(largeValues);
  const pLarge = findNode(largeTree, 5000);

  console.time("Iterative Approach");
  inorderSuccessor(largeTree, pLarge!);
  console.timeEnd("Iterative Approach");

  const largeTree2 = createBST(largeValues);
  const pLarge2 = findNode(largeTree2, 5000);
  console.time("Optimal Approach");
  inorderSuccessorOptimal(largeTree2, pLarge2!);
  console.timeEnd("Optimal Approach");

  const largeTree3 = createBST(largeValues);
  const pLarge3 = findNode(largeTree3, 5000);
  console.time("Recursive Approach");
  inorderSuccessorRecursive(largeTree3, pLarge3!);
  console.timeEnd("Recursive Approach");

  const largeTree4 = createBST(largeValues);
  const pLarge4 = findNode(largeTree4, 5000);
  console.time("Morris Approach");
  inorderSuccessorMorris(largeTree4, pLarge4!);
  console.timeEnd("Morris Approach");

  const largeTree5 = createBST(largeValues);
  const pLarge5 = findNode(largeTree5, 5000);
  console.time("Two-Pass Approach");
  inorderSuccessorTwoPass(largeTree5, pLarge5!);
  console.timeEnd("Two-Pass Approach");
}

// Run tests
runTests();

export {
  inorderSuccessor,
  inorderSuccessorOptimal,
  inorderSuccessorRecursive,
  inorderSuccessorMorris,
  TreeNode,
};
{% endraw %}
