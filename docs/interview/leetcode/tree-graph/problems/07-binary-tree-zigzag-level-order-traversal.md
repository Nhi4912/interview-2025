---
layout: page
title: "Binary Tree Zigzag Level Order Traversal"
difficulty: Hard
category: Tree/Graph
tags: [Tree/Graph]
leetcode_url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"
---

# Binary Tree Zigzag Level Order Traversal



## Problem Description

 *  * Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.  * (i.e., from left to right, then right to left for the next level and alternate between).  *  * Input: root = [3,9,20,null,null,15,7] 

## Solutions

{% raw %}
/**
 * Binary Tree Zigzag Level Order Traversal
 *
 * Problem: https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/
 *
 * Given the root of a binary tree, return the zigzag level order traversal of its nodes' values.
 * (i.e., from left to right, then right to left for the next level and alternate between).
 *
 * Example 1:
 * Input: root = [3,9,20,null,null,15,7]
 * Output: [[3],[20,9],[15,7]]
 *
 * Example 2:
 * Input: root = [1]
 * Output: [[1]]
 *
 * Example 3:
 * Input: root = []
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 2000].
 * - -100 <= Node.val <= 100
 *
 * Solution Approach:
 * 1. Use BFS with level tracking
 * 2. Reverse alternate levels
 * 3. Use deque for efficient operations
 * 4. Track level number to determine direction
 *
 * Time Complexity: O(n) where n is the number of nodes
 * Space Complexity: O(n) for storing the result
 */

/**
 * TreeNode class definition
 *
 * Định nghĩa lớp TreeNode
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
 * Zigzag Level Order Traversal - BFS Solution
 *
 * Giải pháp BFS cho bài toán Duyệt cây theo mức zigzag
 *
 * @param root - Root of the binary tree
 * @returns Array of arrays representing zigzag level order traversal
 */
function zigzagLevelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  while (queue.length > 0) {
    const { node, level } = queue.shift()!;

    // Initialize level array if needed
    if (result.length <= level) {
      result.push([]);
    }

    // Add node to current level
    result[level].push(node.val);

    // Add children to queue
    if (node.left) {
      queue.push({ node: node.left, level: level + 1 });
    }
    if (node.right) {
      queue.push({ node: node.right, level: level + 1 });
    }
  }

  // Reverse odd levels for zigzag effect
  for (let i = 1; i < result.length; i += 2) {
    result[i].reverse();
  }

  return result;
}

/**
 * Alternative Solution: Using Two Stacks
 *
 * Giải pháp thay thế: Sử dụng hai stack
 *
 * @param root - Root of the binary tree
 * @returns Array of arrays representing zigzag level order traversal
 */
function zigzagLevelOrderTwoStacks(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const currentLevel: TreeNode[] = [root];
  const nextLevel: TreeNode[] = [];
  let leftToRight = true;

  while (currentLevel.length > 0) {
    const levelResult: number[] = [];

    while (currentLevel.length > 0) {
      const node = currentLevel.pop()!;
      levelResult.push(node.val);

      if (leftToRight) {
        if (node.left) nextLevel.push(node.left);
        if (node.right) nextLevel.push(node.right);
      } else {
        if (node.right) nextLevel.push(node.right);
        if (node.left) nextLevel.push(node.left);
      }
    }

    result.push(levelResult);

    // Swap stacks and direction
    [currentLevel, nextLevel] = [nextLevel, currentLevel];
    leftToRight = !leftToRight;
  }

  return result;
}

/**
 * Solution with Level Information
 *
 * Giải pháp với thông tin mức
 *
 * @param root - Root of the binary tree
 * @returns Object containing zigzag traversal and level information
 */
function zigzagLevelOrderWithInfo(root: TreeNode | null): {
  traversal: number[][];
  levelInfo: Array<{ level: number; direction: string; nodeCount: number }>;
} {
  if (!root) return { traversal: [], levelInfo: [] };

  const traversal: number[][] = [];
  const levelInfo: Array<{
    level: number;
    direction: string;
    nodeCount: number;
  }> = [];
  const queue: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  while (queue.length > 0) {
    const { node, level } = queue.shift()!;

    if (traversal.length <= level) {
      traversal.push([]);
      levelInfo.push({
        level,
        direction: level % 2 === 0 ? "left-to-right" : "right-to-left",
        nodeCount: 0,
      });
    }

    traversal[level].push(node.val);
    levelInfo[level].nodeCount++;

    if (node.left) {
      queue.push({ node: node.left, level: level + 1 });
    }
    if (node.right) {
      queue.push({ node: node.right, level: level + 1 });
    }
  }

  // Reverse odd levels
  for (let i = 1; i < traversal.length; i += 2) {
    traversal[i].reverse();
  }

  return { traversal, levelInfo };
}

/**
 * Recursive Solution with Level Tracking
 *
 * Giải pháp đệ quy với theo dõi mức
 *
 * @param root - Root of the binary tree
 * @returns Array of arrays representing zigzag level order traversal
 */
function zigzagLevelOrderRecursive(root: TreeNode | null): number[][] {
  const result: number[][] = [];

  function dfs(node: TreeNode | null, level: number): void {
    if (!node) return;

    if (result.length <= level) {
      result.push([]);
    }

    // Add node to current level
    result[level].push(node.val);

    // Recursive calls
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);

  // Reverse odd levels
  for (let i = 1; i < result.length; i += 2) {
    result[i].reverse();
  }

  return result;
}

/**
 * Solution with Visualization
 *
 * Giải pháp với hiển thị
 *
 * @param root - Root of the binary tree
 * @returns Object containing traversal and visualization
 */
function zigzagLevelOrderWithVisualization(root: TreeNode | null): {
  traversal: number[][];
  visualization: string;
} {
  const { traversal, levelInfo } = zigzagLevelOrderWithInfo(root);

  let visualization = "Zigzag Level Order Traversal:\n";
  visualization += "Duyệt cây theo mức zigzag:\n\n";

  for (let i = 0; i < traversal.length; i++) {
    const level = traversal[i];
    const info = levelInfo[i];

    visualization += `Level ${i} (${info.direction}): [${level.join(", ")}]\n`;
    visualization += `Mức ${i} (${info.direction}): [${level.join(", ")}]\n`;
    visualization += `Node count: ${info.nodeCount}\n`;
    visualization += `Số nút: ${info.nodeCount}\n\n`;
  }

  return { traversal, visualization };
}

/**
 * Utility function to create a binary tree from array
 *
 * Hàm tiện ích để tạo cây nhị phân từ mảng
 *
 * @param arr - Array representation of the tree
 * @returns Root of the created tree
 */
function createTreeFromArray(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;

    // Left child
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      queue.push(node.left);
    }
    i++;

    // Right child
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Binary Tree Zigzag Level Order Traversal Tests ===");
  console.log("=== Kiểm thử bài toán Duyệt cây theo mức zigzag ===\n");

  const testCases = [
    {
      name: "Example 1: Standard tree",
      input: [3, 9, 20, null, null, 15, 7],
      expected: [[3], [20, 9], [15, 7]],
      description: "Standard binary tree with 3 levels",
    },
    {
      name: "Example 2: Single node",
      input: [1],
      expected: [[1]],
      description: "Tree with single node",
    },
    {
      name: "Example 3: Empty tree",
      input: [],
      expected: [],
      description: "Empty tree",
    },
    {
      name: "Left-skewed tree",
      input: [1, 2, null, 3, null, 4],
      expected: [[1], [2], [3], [4]],
      description: "Tree skewed to the left",
    },
    {
      name: "Right-skewed tree",
      input: [1, null, 2, null, 3, null, 4],
      expected: [[1], [2], [3], [4]],
      description: "Tree skewed to the right",
    },
    {
      name: "Complete binary tree",
      input: [1, 2, 3, 4, 5, 6, 7],
      expected: [[1], [3, 2], [4, 5, 6, 7]],
      description: "Complete binary tree",
    },
    {
      name: "Unbalanced tree",
      input: [1, 2, 3, 4, null, null, 5],
      expected: [[1], [3, 2], [4, 5]],
      description: "Unbalanced tree",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}`);
    console.log(`Description: ${testCase.description}`);

    const root = createTreeFromArray(testCase.input);

    // Test BFS solution
    const result1 = zigzagLevelOrder(root);
    const passed1 =
      JSON.stringify(result1) === JSON.stringify(testCase.expected);

    console.log(`BFS Result: ${JSON.stringify(result1)}`);
    console.log(`BFS Status: ${passed1 ? "✅ PASSED" : "❌ FAILED"}`);

    // Test Two Stacks solution
    const result2 = zigzagLevelOrderTwoStacks(root);
    const passed2 =
      JSON.stringify(result2) === JSON.stringify(testCase.expected);

    console.log(`Two Stacks Result: ${JSON.stringify(result2)}`);
    console.log(`Two Stacks Status: ${passed2 ? "✅ PASSED" : "❌ FAILED"}`);

    // Test Recursive solution
    const result3 = zigzagLevelOrderRecursive(root);
    const passed3 =
      JSON.stringify(result3) === JSON.stringify(testCase.expected);

    console.log(`Recursive Result: ${JSON.stringify(result3)}`);
    console.log(`Recursive Status: ${passed3 ? "✅ PASSED" : "❌ FAILED"}`);

    const allPassed = passed1 && passed2 && passed3;
    console.log(`All implementations match: ${allPassed ? "✅ Yes" : "❌ No"}`);

    console.log("---");
  }

  // Test with visualization
  console.log("\n=== Testing with Visualization ===");
  console.log("=== Kiểm thử với hiển thị ===\n");

  const testTree = createTreeFromArray([3, 9, 20, null, null, 15, 7]);
  const { traversal, visualization } =
    zigzagLevelOrderWithVisualization(testTree);

  console.log(visualization);

  // Test with level information
  console.log("\n=== Testing with Level Information ===");
  console.log("=== Kiểm thử với thông tin mức ===\n");

  const { traversal: traversal2, levelInfo } =
    zigzagLevelOrderWithInfo(testTree);

  console.log("Level Information:");
  console.log("Thông tin mức:");
  for (const info of levelInfo) {
    console.log(
      `  Level ${info.level}: ${info.direction}, ${info.nodeCount} nodes`
    );
  }

  // Performance comparison
  console.log("\n=== Performance Comparison ===");
  console.log("=== So sánh hiệu suất ===\n");

  // Create a large tree
  const largeTreeArray: (number | null)[] = [];
  for (let i = 0; i < 1000; i++) {
    largeTreeArray.push(i);
  }

  const largeTree = createTreeFromArray(largeTreeArray);

  console.log("Testing with large tree (1000 nodes)...");
  console.log("Kiểm thử với cây lớn (1000 nút)...");

  const start1 = performance.now();
  const result1 = zigzagLevelOrder(largeTree);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const result2 = zigzagLevelOrderTwoStacks(largeTree);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const result3 = zigzagLevelOrderRecursive(largeTree);
  const time3 = performance.now() - start3;

  console.log(`BFS: ${time1.toFixed(4)}ms, Levels: ${result1.length}`);
  console.log(`Two Stacks: ${time2.toFixed(4)}ms, Levels: ${result2.length}`);
  console.log(`Recursive: ${time3.toFixed(4)}ms, Levels: ${result3.length}`);

  const resultsMatch =
    JSON.stringify(result1) === JSON.stringify(result2) &&
    JSON.stringify(result2) === JSON.stringify(result3);
  console.log(`Results match: ${resultsMatch ? "✅ Yes" : "❌ No"}`);

  // Test edge cases
  console.log("\n=== Edge Cases Testing ===");
  console.log("=== Kiểm thử trường hợp đặc biệt ===\n");

  const edgeCases = [
    { name: "Null root", tree: null },
    { name: "Single node", tree: new TreeNode(42) },
    { name: "Two nodes", tree: new TreeNode(1, new TreeNode(2)) },
    {
      name: "Three nodes",
      tree: new TreeNode(1, new TreeNode(2), new TreeNode(3)),
    },
  ];

  for (const edgeCase of edgeCases) {
    const result = zigzagLevelOrder(edgeCase.tree);
    console.log(`${edgeCase.name}: ${JSON.stringify(result)}`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  TreeNode,
  zigzagLevelOrder,
  zigzagLevelOrderTwoStacks,
  zigzagLevelOrderWithInfo,
  zigzagLevelOrderRecursive,
  zigzagLevelOrderWithVisualization,
  createTreeFromArray,
};
{% endraw %}
