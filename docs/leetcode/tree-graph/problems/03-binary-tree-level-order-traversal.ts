/**
 * 102. Binary Tree Level Order Traversal
 *
 * Problem:
 * Given the root of a binary tree, return the level order traversal of its
 * nodes' values. (i.e., from left to right, level by level).
 *
 * Example:
 * Input: root = [3,9,20,null,null,15,7]
 * Output: [[3],[9,20],[15,7]]
 *
 * Input: root = [1]
 * Output: [[1]]
 *
 * Input: root = []
 * Output: []
 *
 * LeetCode: https://leetcode.com/problems/binary-tree-level-order-traversal/
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
 * Solution 1: BFS with Queue (Optimal)
 *
 * Approach:
 * - Use BFS with queue to traverse level by level
 * - Process each level completely before moving to next
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    result.push(currentLevel);
  }

  return result;
}

/**
 * Solution 2: BFS with Array as Queue
 *
 * Approach:
 * - Use array as queue with index tracking
 * - More memory efficient than shift()
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderArrayQueue(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  let start = 0;

  while (start < queue.length) {
    const levelSize = queue.length - start;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue[start + i];
      currentLevel.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    result.push(currentLevel);
    start += levelSize;
  }

  return result;
}

/**
 * Solution 3: DFS with Level Tracking
 *
 * Approach:
 * - Use DFS with level parameter
 * - Add nodes to appropriate level in result
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderDFS(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];

  function dfs(node: TreeNode, level: number) {
    if (!node) return;

    if (level === result.length) {
      result.push([]);
    }

    result[level].push(node.val);

    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);
  return result;
}

/**
 * Solution 4: Using Map for Level Tracking
 *
 * Approach:
 * - Use Map to store nodes by level
 * - More flexible than array approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderMap(root: TreeNode | null): number[][] {
  if (!root) return [];

  const levelMap = new Map<number, number[]>();
  let maxLevel = 0;

  function dfs(node: TreeNode, level: number) {
    if (!node) return;

    if (!levelMap.has(level)) {
      levelMap.set(level, []);
    }

    levelMap.get(level)!.push(node.val);
    maxLevel = Math.max(maxLevel, level);

    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);

  const result: number[][] = [];
  for (let i = 0; i <= maxLevel; i++) {
    result.push(levelMap.get(i)!);
  }

  return result;
}

/**
 * Solution 5: Using Two Queues
 *
 * Approach:
 * - Use two queues to alternate between levels
 * - Process one level at a time
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderTwoQueues(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  let currentQueue: TreeNode[] = [root];
  let nextQueue: TreeNode[] = [];

  while (currentQueue.length > 0) {
    const currentLevel: number[] = [];

    while (currentQueue.length > 0) {
      const node = currentQueue.shift()!;
      currentLevel.push(node.val);

      if (node.left) {
        nextQueue.push(node.left);
      }
      if (node.right) {
        nextQueue.push(node.right);
      }
    }

    result.push(currentLevel);
    [currentQueue, nextQueue] = [nextQueue, currentQueue];
  }

  return result;
}

/**
 * Solution 6: Using Stack (Reverse Level Order)
 *
 * Approach:
 * - Use stack to reverse level order
 * - Educational purpose - shows stack usage
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderStack(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  const stack: number[][] = [];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    stack.push(currentLevel);
  }

  // Reverse to get normal level order
  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}

/**
 * Solution 7: Using Generator (Memory efficient)
 *
 * Approach:
 * - Use generator to yield levels
 * - Memory efficient for large trees
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function* levelGenerator(root: TreeNode | null): Generator<number[]> {
  if (!root) return;

  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }

    yield currentLevel;
  }
}

function levelOrderGenerator(root: TreeNode | null): number[][] {
  return Array.from(levelGenerator(root));
}

/**
 * Solution 8: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a BinaryTree class
 * - Encapsulate traversal logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class BinaryTree {
  root: TreeNode | null;

  constructor(root: TreeNode | null = null) {
    this.root = root;
  }

  levelOrderTraversal(): number[][] {
    if (!this.root) return [];

    const result: number[][] = [];
    const queue: TreeNode[] = [this.root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: number[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        currentLevel.push(node.val);

        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }
      }

      result.push(currentLevel);
    }

    return result;
  }

  getHeight(): number {
    function getHeightHelper(node: TreeNode | null): number {
      if (!node) return 0;
      return (
        Math.max(getHeightHelper(node.left), getHeightHelper(node.right)) + 1
      );
    }

    return getHeightHelper(this.root);
  }
}

function levelOrderClass(root: TreeNode | null): number[][] {
  const tree = new BinaryTree(root);
  return tree.levelOrderTraversal();
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
function levelOrderFunctional(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];

  function traverse(nodes: TreeNode[], level: number): void {
    if (nodes.length === 0) return;

    const values = nodes.map((node) => node.val);
    result[level] = values;

    const nextLevel = nodes
      .flatMap((node) => [node.left, node.right])
      .filter((node): node is TreeNode => node !== null);

    traverse(nextLevel, level + 1);
  }

  traverse([root], 0);
  return result;
}

/**
 * Solution 10: Using Recursive with Level Array
 *
 * Approach:
 * - Use recursion with level array
 * - More explicit level tracking
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function levelOrderRecursive(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];

  function dfs(node: TreeNode, level: number) {
    if (!node) return;

    // Ensure level array exists
    while (result.length <= level) {
      result.push([]);
    }

    result[level].push(node.val);

    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);
  return result;
}

// Helper functions
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
      } else {
        queue.push(null);
      }
      i++;
    }

    if (node && i < values.length) {
      if (values[i] !== null) {
        node.right = new TreeNode(values[i]!);
        queue.push(node.right);
      } else {
        queue.push(null);
      }
      i++;
    }
  }

  return root;
}

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];

  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }

    // Stop if all remaining nodes are null
    if (queue.every((n) => n === null)) {
      break;
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

// Test cases
function testLevelOrder() {
  console.log("=== Testing Binary Tree Level Order Traversal ===\n");

  const testCases = [
    {
      input: [3, 9, 20, null, null, 15, 7],
      expected: [[3], [9, 20], [15, 7]],
      description: "Standard binary tree",
    },
    {
      input: [1],
      expected: [[1]],
      description: "Single node",
    },
    {
      input: [],
      expected: [],
      description: "Empty tree",
    },
    {
      input: [1, 2, 3, 4, 5, 6, 7],
      expected: [[1], [2, 3], [4, 5, 6, 7]],
      description: "Complete binary tree",
    },
    {
      input: [1, null, 2, null, 3],
      expected: [[1], [2], [3]],
      description: "Right-skewed tree",
    },
    {
      input: [1, 2, null, 3],
      expected: [[1], [2], [3]],
      description: "Left-skewed tree",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: ${JSON.stringify(testCase.expected)}\n`);

    const root = createBinaryTree(testCase.input);

    // Test Solution 1 (BFS with Queue)
    const result1 = levelOrder(root);
    console.log(
      `Solution 1 (BFS with Queue): ${JSON.stringify(result1)} ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (BFS with Array Queue)
    const result2 = levelOrderArrayQueue(root);
    console.log(
      `Solution 2 (BFS with Array Queue): ${JSON.stringify(result2)} ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (DFS)
    const result3 = levelOrderDFS(root);
    console.log(
      `Solution 3 (DFS): ${JSON.stringify(result3)} ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Map)
    const result4 = levelOrderMap(root);
    console.log(
      `Solution 4 (Map): ${JSON.stringify(result4)} ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Two Queues)
    const result5 = levelOrderTwoQueues(root);
    console.log(
      `Solution 5 (Two Queues): ${JSON.stringify(result5)} ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Stack)
    const result6 = levelOrderStack(root);
    console.log(
      `Solution 6 (Stack): ${JSON.stringify(result6)} ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Generator)
    const result7 = levelOrderGenerator(root);
    console.log(
      `Solution 7 (Generator): ${JSON.stringify(result7)} ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Class)
    const result8 = levelOrderClass(root);
    console.log(
      `Solution 8 (Class): ${JSON.stringify(result8)} ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Functional)
    const result9 = levelOrderFunctional(root);
    console.log(
      `Solution 9 (Functional): ${JSON.stringify(result9)} ${
        JSON.stringify(result9) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Recursive)
    const result10 = levelOrderRecursive(root);
    console.log(
      `Solution 10 (Recursive): ${JSON.stringify(result10)} ${
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
    { name: "BFS with Queue", func: levelOrder },
    { name: "BFS with Array Queue", func: levelOrderArrayQueue },
    { name: "DFS", func: levelOrderDFS },
    { name: "Map", func: levelOrderMap },
    { name: "Two Queues", func: levelOrderTwoQueues },
    { name: "Stack", func: levelOrderStack },
    { name: "Generator", func: levelOrderGenerator },
    { name: "Class", func: levelOrderClass },
    { name: "Functional", func: levelOrderFunctional },
    { name: "Recursive", func: levelOrderRecursive },
  ];

  // Create test trees
  const smallTree = createBinaryTree(
    Array.from({ length: 15 }, (_, i) => i + 1)
  );
  const mediumTree = createBinaryTree(
    Array.from({ length: 100 }, (_, i) => i + 1)
  );
  const largeTree = createBinaryTree(
    Array.from({ length: 1000 }, (_, i) => i + 1)
  );

  const trees = [
    { name: "Small", tree: smallTree },
    { name: "Medium", tree: mediumTree },
    { name: "Large", tree: largeTree },
  ];

  trees.forEach(({ name, tree }) => {
    console.log(`${name} Tree:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(tree);
      const end = performance.now();

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (${result.length} levels)`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testLevelOrder();
// performanceComparison();

export {
  levelOrder,
  levelOrderArrayQueue,
  levelOrderDFS,
  levelOrderMap,
  levelOrderTwoQueues,
  levelOrderStack,
  levelOrderGenerator,
  levelOrderClass,
  levelOrderFunctional,
  levelOrderRecursive,
  TreeNode,
  BinaryTree,
  levelGenerator,
  createBinaryTree,
  treeToArray,
  testLevelOrder,
  performanceComparison,
};
