/**
 * 98. Validate Binary Search Tree
 *
 * Problem:
 * Given the root of a binary tree, determine if it is a valid binary search tree (BST).
 *
 * A valid BST is defined as follows:
 * - The left subtree of a node contains only nodes with keys less than the node's key.
 * - The right subtree of a node contains only nodes with keys greater than the node's key.
 * - Both the left and right subtrees must also be binary search trees.
 *
 * Example:
 * Input: root = [2,1,3]
 * Output: true
 *
 * Input: root = [5,1,4,null,null,3,6]
 * Output: false
 *
 * LeetCode: https://leetcode.com/problems/validate-binary-search-tree/
 */

// TreeNode class definition
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
 * Solution 1: Inorder Traversal (Optimal)
 *
 * Approach:
 * - Perform inorder traversal (left -> root -> right)
 * - Check if values are in ascending order
 * - Use previous value to compare
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h) - height of tree
 */
function isValidBST(root: TreeNode | null): boolean {
  let prev: number | null = null;

  function inorder(node: TreeNode | null): boolean {
    if (!node) return true;

    // Check left subtree
    if (!inorder(node.left)) return false;

    // Check current node
    if (prev !== null && node.val <= prev) return false;
    prev = node.val;

    // Check right subtree
    return inorder(node.right);
  }

  return inorder(root);
}

/**
 * Solution 2: Recursive with Range
 *
 * Approach:
 * - Pass valid range (min, max) to each node
 * - Check if node value is within range
 * - Update range for children
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function isValidBSTRange(root: TreeNode | null): boolean {
  function isValid(
    node: TreeNode | null,
    min: number | null,
    max: number | null
  ): boolean {
    if (!node) return true;

    // Check if current node is within range
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;

    // Check left and right subtrees
    return (
      isValid(node.left, min, node.val) && isValid(node.right, node.val, max)
    );
  }

  return isValid(root, null, null);
}

/**
 * Solution 3: Iterative Inorder Traversal
 *
 * Approach:
 * - Use stack for iterative inorder traversal
 * - Check ascending order property
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function isValidBSTIterative(root: TreeNode | null): boolean {
  if (!root) return true;

  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  let prev: number | null = null;

  while (current || stack.length > 0) {
    // Go to leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }

    current = stack.pop()!;

    // Check if current value is greater than previous
    if (prev !== null && current.val <= prev) {
      return false;
    }

    prev = current.val;
    current = current.right;
  }

  return true;
}

/**
 * Solution 4: Using Array (Collect all values)
 *
 * Approach:
 * - Collect all values in inorder traversal
 * - Check if array is sorted
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function isValidBSTArray(root: TreeNode | null): boolean {
  const values: number[] = [];

  function inorder(node: TreeNode | null): void {
    if (!node) return;

    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  }

  inorder(root);

  // Check if array is sorted
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) {
      return false;
    }
  }

  return true;
}

/**
 * Solution 5: Morris Traversal (Space Optimized)
 *
 * Approach:
 * - Use Morris traversal for O(1) space
 * - Threaded binary tree approach
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function isValidBSTMorris(root: TreeNode | null): boolean {
  if (!root) return true;

  let current: TreeNode | null = root;
  let prev: number | null = null;

  while (current) {
    if (!current.left) {
      // Process current node
      if (prev !== null && current.val <= prev) {
        return false;
      }
      prev = current.val;
      current = current.right;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        // Create thread
        predecessor.right = current;
        current = current.left;
      } else {
        // Remove thread and process current node
        predecessor.right = null;
        if (prev !== null && current.val <= prev) {
          return false;
        }
        prev = current.val;
        current = current.right;
      }
    }
  }

  return true;
}

/**
 * Solution 6: Using Generator (Memory Efficient)
 *
 * Approach:
 * - Use generator to yield values in order
 * - Check ascending order without storing all values
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function* inorderGenerator(root: TreeNode | null): Generator<number> {
  if (!root) return;

  yield* inorderGenerator(root.left);
  yield root.val;
  yield* inorderGenerator(root.right);
}

function isValidBSTGenerator(root: TreeNode | null): boolean {
  if (!root) return true;

  const generator = inorderGenerator(root);
  let prev: number | null = null;

  for (const value of generator) {
    if (prev !== null && value <= prev) {
      return false;
    }
    prev = value;
  }

  return true;
}

/**
 * Solution 7: BFS with Level Validation (Incorrect but educational)
 *
 * Approach:
 * - This approach is INCORRECT but shows common mistake
 * - Only checks immediate children, not entire subtrees
 *
 * Time Complexity: O(n)
 * Space Complexity: O(w) - width of tree
 */
function isValidBSTBFS(root: TreeNode | null): boolean {
  if (!root) return true;

  const queue: Array<{
    node: TreeNode;
    min: number | null;
    max: number | null;
  }> = [{ node: root, min: null, max: null }];

  while (queue.length > 0) {
    const { node, min, max } = queue.shift()!;

    // Check current node
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;

    // Add children to queue
    if (node.left) {
      queue.push({ node: node.left, min, max: node.val });
    }
    if (node.right) {
      queue.push({ node: node.right, min: node.val, max });
    }
  }

  return true;
}

// Helper functions
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

function printTree(root: TreeNode | null): string {
  if (!root) return "null";

  const result: string[] = [];
  const queue: (TreeNode | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift();

    if (node) {
      result.push(node.val.toString());
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push("null");
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === "null") {
    result.pop();
  }

  return `[${result.join(", ")}]`;
}

// Test cases
function testValidateBST() {
  console.log("=== Testing Validate Binary Search Tree ===\n");

  const testCases = [
    {
      input: [2, 1, 3],
      expected: true,
      description: "Valid BST",
    },
    {
      input: [5, 1, 4, null, null, 3, 6],
      expected: false,
      description: "Invalid BST - right subtree has smaller value",
    },
    {
      input: [1, 1],
      expected: false,
      description: "Invalid BST - duplicate values",
    },
    {
      input: [5, 4, 6, null, null, 3, 7],
      expected: false,
      description: "Invalid BST - 3 is less than 5",
    },
    {
      input: [2, 2, 2],
      expected: false,
      description: "Invalid BST - all same values",
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
      input: [3, 1, 5, 0, 2, 4, 6],
      expected: true,
      description: "Complex valid BST",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${printTree(createBinaryTree(testCase.input))}`);
    console.log(`Expected: ${testCase.expected}\n`);

    const root = createBinaryTree(testCase.input);

    // Test Solution 1 (Inorder)
    const result1 = isValidBST(root);
    console.log(
      `Solution 1 (Inorder): ${result1} ${
        result1 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Range)
    const root2 = createBinaryTree(testCase.input);
    const result2 = isValidBSTRange(root2);
    console.log(
      `Solution 2 (Range): ${result2} ${
        result2 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Iterative)
    const root3 = createBinaryTree(testCase.input);
    const result3 = isValidBSTIterative(root3);
    console.log(
      `Solution 3 (Iterative): ${result3} ${
        result3 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Array)
    const root4 = createBinaryTree(testCase.input);
    const result4 = isValidBSTArray(root4);
    console.log(
      `Solution 4 (Array): ${result4} ${
        result4 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Morris)
    const root5 = createBinaryTree(testCase.input);
    const result5 = isValidBSTMorris(root5);
    console.log(
      `Solution 5 (Morris): ${result5} ${
        result5 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Generator)
    const root6 = createBinaryTree(testCase.input);
    const result6 = isValidBSTGenerator(root6);
    console.log(
      `Solution 6 (Generator): ${result6} ${
        result6 === testCase.expected ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (BFS)
    const root7 = createBinaryTree(testCase.input);
    const result7 = isValidBSTBFS(root7);
    console.log(
      `Solution 7 (BFS): ${result7} ${
        result7 === testCase.expected ? "✅" : "❌"
      }`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Inorder", func: isValidBST },
    { name: "Range", func: isValidBSTRange },
    { name: "Iterative", func: isValidBSTIterative },
    { name: "Array", func: isValidBSTArray },
    { name: "Morris", func: isValidBSTMorris },
    { name: "Generator", func: isValidBSTGenerator },
    { name: "BFS", func: isValidBSTBFS },
  ];

  // Create test trees
  const validTree = createBinaryTree([3, 1, 5, 0, 2, 4, 6]);
  const invalidTree = createBinaryTree([5, 1, 4, null, null, 3, 6]);

  const trees = [
    { name: "Valid BST", tree: validTree },
    { name: "Invalid BST", tree: invalidTree },
  ];

  trees.forEach(({ name, tree }) => {
    console.log(`${name}:`);

    testCases.forEach(({ name: funcName, func }) => {
      const start = performance.now();
      const result = func(tree);
      const end = performance.now();

      console.log(`  ${funcName}: ${(end - start).toFixed(2)}ms (${result})`);
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testValidateBST();
// performanceComparison();

export {
  TreeNode,
  isValidBST,
  isValidBSTRange,
  isValidBSTIterative,
  isValidBSTArray,
  isValidBSTMorris,
  isValidBSTGenerator,
  isValidBSTBFS,
  inorderGenerator,
  createBinaryTree,
  printTree,
  testValidateBST,
  performanceComparison,
};
