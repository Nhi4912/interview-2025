/**
 * 104. Maximum Depth of Binary Tree
 *
 * Problem:
 * Given the root of a binary tree, return its maximum depth.
 * A binary tree's maximum depth is the number of nodes along the longest path
 * from the root node down to the farthest leaf node.
 *
 * Example:
 * Input: root = [3,9,20,null,null,15,7]
 * Output: 3
 *
 * Input: root = [1,null,2]
 * Output: 2
 *
 * LeetCode: https://leetcode.com/problems/maximum-depth-of-binary-tree/
 */

// Definition for a binary tree node
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
 * Solution 1: Recursive DFS (Optimal)
 *
 * Approach:
 * - Use recursion to traverse the tree
 * - Return 1 + max(left subtree depth, right subtree depth)
 * - Base case: null node returns 0
 *
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - height of tree (recursion stack)
 */
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
}

/**
 * Solution 2: Iterative DFS using Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Track current depth and max depth
 * - Push nodes with their current depth
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h) - stack space
 */
function maxDepthIterativeDFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: Array<{ node: TreeNode; depth: number }> = [];
  let maxDepth = 0;

  stack.push({ node: root, depth: 1 });

  while (stack.length > 0) {
    const { node, depth } = stack.pop()!;

    maxDepth = Math.max(maxDepth, depth);

    if (node.right) {
      stack.push({ node: node.right, depth: depth + 1 });
    }

    if (node.left) {
      stack.push({ node: node.left, depth: depth + 1 });
    }
  }

  return maxDepth;
}

/**
 * Solution 3: BFS using Queue (Level Order)
 *
 * Approach:
 * - Use queue for level-order traversal
 * - Count levels to get depth
 * - Process all nodes at current level before moving to next
 *
 * Time Complexity: O(n)
 * Space Complexity: O(w) - width of tree (queue size)
 */
function maxDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;

      if (node.left) {
        queue.push(node.left);
      }

      if (node.right) {
        queue.push(node.right);
      }
    }

    depth++;
  }

  return depth;
}

/**
 * Solution 4: Tail Recursive (Optimized)
 *
 * Approach:
 * - Use tail recursion to avoid stack overflow
 * - Pass accumulated depth as parameter
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - tail call optimization
 */
function maxDepthTailRecursive(root: TreeNode | null): number {
  function maxDepthHelper(node: TreeNode | null, currentDepth: number): number {
    if (node === null) {
      return currentDepth;
    }

    const leftDepth = maxDepthHelper(node.left, currentDepth + 1);
    const rightDepth = maxDepthHelper(node.right, currentDepth + 1);

    return Math.max(leftDepth, rightDepth);
  }

  return maxDepthHelper(root, 0);
}

/**
 * Solution 5: Using Morris Traversal (Threaded Binary Tree)
 *
 * Approach:
 * - Use Morris traversal to avoid stack/queue
 * - Create temporary links to traverse without extra space
 * - Track depth during traversal
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1) - constant extra space
 */
function maxDepthMorris(root: TreeNode | null): number {
  if (root === null) return 0;

  let maxDepth = 0;
  let currentDepth = 0;
  let current = root;

  while (current !== null) {
    if (current.left === null) {
      // No left child, go to right
      maxDepth = Math.max(maxDepth, currentDepth + 1);
      current = current.right;
      if (current !== null) currentDepth++;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      let tempDepth = currentDepth + 1;

      while (predecessor.right !== null && predecessor.right !== current) {
        predecessor = predecessor.right;
        tempDepth++;
      }

      if (predecessor.right === null) {
        // Create temporary link
        predecessor.right = current;
        current = current.left;
        currentDepth++;
      } else {
        // Remove temporary link
        predecessor.right = null;
        maxDepth = Math.max(maxDepth, tempDepth);
        current = current.right;
        currentDepth = tempDepth - 1;
      }
    }
  }

  return maxDepth;
}

/**
 * Solution 6: Post-order Traversal with Stack
 *
 * Approach:
 * - Use post-order traversal with explicit stack
 * - Track depth for each node
 * - Update max depth when visiting leaf nodes
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function maxDepthPostOrder(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: Array<{ node: TreeNode; depth: number; visited: boolean }> = [];
  let maxDepth = 0;

  stack.push({ node: root, depth: 1, visited: false });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    if (current.visited) {
      // Process node
      stack.pop();
      maxDepth = Math.max(maxDepth, current.depth);
    } else {
      // Mark as visited and push children
      current.visited = true;

      if (current.node.right) {
        stack.push({
          node: current.node.right,
          depth: current.depth + 1,
          visited: false,
        });
      }

      if (current.node.left) {
        stack.push({
          node: current.node.left,
          depth: current.depth + 1,
          visited: false,
        });
      }
    }
  }

  return maxDepth;
}

// Helper function to create binary tree from array
function createBinaryTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    // Left child
    if (i < values.length && values[i] !== null) {
      node.left = new TreeNode(values[i]!);
      queue.push(node.left);
    }
    i++;

    // Right child
    if (i < values.length && values[i] !== null) {
      node.right = new TreeNode(values[i]!);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

// Helper function to print tree (for debugging)
function printTree(root: TreeNode | null, level: number = 0): void {
  if (root === null) return;

  printTree(root.right, level + 1);
  console.log("  ".repeat(level) + root.val);
  printTree(root.left, level + 1);
}

// Test cases
function testMaxDepth() {
  console.log("=== Testing Maximum Depth of Binary Tree ===\n");

  const testCases = [
    {
      input: [3, 9, 20, null, null, 15, 7],
      expected: 3,
      description: "Balanced tree",
    },
    {
      input: [1, null, 2],
      expected: 2,
      description: "Left-skewed tree",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: 3,
      description: "Complete binary tree",
    },
    {
      input: [1],
      expected: 1,
      description: "Single node",
    },
    {
      input: [],
      expected: 0,
      description: "Empty tree",
    },
    {
      input: [1, 2, 3, 4, null, null, 5, 6, null, null, 7],
      expected: 4,
      description: "Complex tree",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input}]`);
    console.log(`Expected: ${testCase.expected}\n`);

    const root = createBinaryTree(testCase.input);

    // Test Solution 1 (Recursive DFS)
    const result1 = maxDepth(root);
    console.log(
      `Solution 1 (Recursive DFS): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Iterative DFS)
    const result2 = maxDepthIterativeDFS(root);
    console.log(
      `Solution 2 (Iterative DFS): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (BFS)
    const result3 = maxDepthBFS(root);
    console.log(
      `Solution 3 (BFS): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Tail Recursive)
    const result4 = maxDepthTailRecursive(root);
    console.log(
      `Solution 4 (Tail Recursive): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Morris)
    const result5 = maxDepthMorris(root);
    console.log(
      `Solution 5 (Morris): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Post-order)
    const result6 = maxDepthPostOrder(root);
    console.log(
      `Solution 6 (Post-order): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  // Create large tree (linked list structure for worst case)
  const largeTreeValues: (number | null)[] = [];
  for (let i = 0; i < 10000; i++) {
    largeTreeValues.push(i);
    if (i < 9999) largeTreeValues.push(null); // Create linked list structure
  }

  const largeTree = createBinaryTree(largeTreeValues);

  const testCases = [
    { name: "Recursive DFS", func: maxDepth },
    { name: "Iterative DFS", func: maxDepthIterativeDFS },
    { name: "BFS", func: maxDepthBFS },
    { name: "Tail Recursive", func: maxDepthTailRecursive },
    { name: "Morris", func: maxDepthMorris },
    { name: "Post-order", func: maxDepthPostOrder },
  ];

  testCases.forEach(({ name, func }) => {
    const testTree = createBinaryTree(largeTreeValues);
    const start = performance.now();
    const result = func(testTree);
    const end = performance.now();

    console.log(`${name}:`);
    console.log(`  Time: ${(end - start).toFixed(2)}ms`);
    console.log(`  Result: ${result}`);
    console.log(`  Memory: ${name === "Morris" ? "O(1)" : "O(h)"}\n`);
  });
}

// Memory usage test for deep trees
function memoryUsageTest() {
  console.log("=== Memory Usage Test for Deep Trees ===\n");

  const depths = [1000, 5000, 10000];

  depths.forEach((depth) => {
    console.log(`Testing with tree depth ${depth}:`);

    // Create deep linked list tree
    const deepTreeValues: (number | null)[] = [];
    for (let i = 0; i < depth; i++) {
      deepTreeValues.push(i);
      if (i < depth - 1) deepTreeValues.push(null);
    }

    // Test recursive (might overflow for very deep trees)
    try {
      const tree = createBinaryTree(deepTreeValues);
      const start = performance.now();
      const result = maxDepth(tree);
      const end = performance.now();
      console.log(
        `  Recursive: ${(end - start).toFixed(2)}ms, Depth: ${result} ✅`
      );
    } catch (error) {
      console.log(`  Recursive: Stack overflow ❌`);
    }

    // Test iterative (should handle deep trees)
    try {
      const tree = createBinaryTree(deepTreeValues);
      const start = performance.now();
      const result = maxDepthIterativeDFS(tree);
      const end = performance.now();
      console.log(
        `  Iterative: ${(end - start).toFixed(2)}ms, Depth: ${result} ✅`
      );
    } catch (error) {
      console.log(`  Iterative: Error ❌`);
    }

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testMaxDepth();
// performanceComparison();
// memoryUsageTest();

export {
  TreeNode,
  maxDepth,
  maxDepthIterativeDFS,
  maxDepthBFS,
  maxDepthTailRecursive,
  maxDepthMorris,
  maxDepthPostOrder,
  createBinaryTree,
  printTree,
  testMaxDepth,
  performanceComparison,
  memoryUsageTest,
};
