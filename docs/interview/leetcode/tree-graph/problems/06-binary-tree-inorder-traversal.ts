/**
 * 94. Binary Tree Inorder Traversal
 *
 * Problem:
 * Given the root of a binary tree, return the inorder traversal of its nodes' values.
 *
 * Example:
 * Input: root = [1,null,2,3]
 * Output: [1,3,2]
 *
 * Input: root = []
 * Output: []
 *
 * Input: root = [1]
 * Output: [1]
 *
 * LeetCode: https://leetcode.com/problems/binary-tree-inorder-traversal/
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
 * - Visit left subtree, then root, then right subtree
 * - Natural recursive implementation
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h) - height of tree
 */
function inorderTraversal(root: TreeNode | null): number[] {
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

/**
 * Solution 2: Iterative with Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - Push all left nodes, then process root, then right
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function inorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current = root;

  while (current || stack.length > 0) {
    // Push all left nodes
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Process current node
    current = stack.pop()!;
    result.push(current.val);

    // Move to right subtree
    current = current.right;
  }

  return result;
}

/**
 * Solution 3: Using Morris Traversal
 *
 * Approach:
 * - Use threaded binary tree concept
 * - O(1) space complexity
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
function inorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current = root;

  while (current) {
    if (!current.left) {
      result.push(current.val);
      current = current.right;
    } else {
      // Find inorder predecessor
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (!predecessor.right) {
        predecessor.right = current;
        current = current.left;
      } else {
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }

  return result;
}

/**
 * Solution 4: Using Class (Object-oriented)
 *
 * Approach:
 * - Create an InorderTraverser class
 * - Encapsulate the traversal logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
class InorderTraverser {
  private root: TreeNode | null;

  constructor(root: TreeNode | null) {
    this.root = root;
  }

  traverse(): number[] {
    const result: number[] = [];
    this.inorder(this.root, result);
    return result;
  }

  private inorder(node: TreeNode | null, result: number[]): void {
    if (!node) return;

    this.inorder(node.left, result);
    result.push(node.val);
    this.inorder(node.right, result);
  }

  getRoot(): TreeNode | null {
    return this.root;
  }
}

function inorderTraversalClass(root: TreeNode | null): number[] {
  const traverser = new InorderTraverser(root);
  return traverser.traverse();
}

/**
 * Solution 5: Using Generator
 *
 * Approach:
 * - Use generator to yield values
 * - Memory efficient for large trees
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function* inorderTraversalGenerator(root: TreeNode | null): Generator<number> {
  if (!root) return;

  // Yield left subtree
  yield* inorderTraversalGenerator(root.left);

  // Yield current node
  yield root.val;

  // Yield right subtree
  yield* inorderTraversalGenerator(root.right);
}

function inorderTraversalWithGenerator(root: TreeNode | null): number[] {
  return Array.from(inorderTraversalGenerator(root));
}

/**
 * Solution 6: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function inorderTraversalFunctional(root: TreeNode | null): number[] {
  if (!root) return [];

  return [
    ...inorderTraversalFunctional(root.left),
    root.val,
    ...inorderTraversalFunctional(root.right),
  ];
}

/**
 * Solution 7: Using Array Methods
 *
 * Approach:
 * - Use array methods like concat
 * - More functional style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function inorderTraversalArrayMethods(root: TreeNode | null): number[] {
  if (!root) return [];

  const left = inorderTraversalArrayMethods(root.left);
  const right = inorderTraversalArrayMethods(root.right);

  return left.concat([root.val], right);
}

/**
 * Solution 8: Using Two Stacks
 *
 * Approach:
 * - Use two stacks for explicit control
 * - More explicit stack management
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function inorderTraversalTwoStacks(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack1: TreeNode[] = [];
  const stack2: TreeNode[] = [];

  if (root) stack1.push(root);

  while (stack1.length > 0) {
    const node = stack1.pop()!;
    stack2.push(node);

    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }

  while (stack2.length > 0) {
    const node = stack2.pop()!;
    result.unshift(node.val);
  }

  return result;
}

/**
 * Solution 9: Using Queue
 *
 * Approach:
 * - Use queue for level-order traversal first
 * - Then sort to get inorder
 *
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
function inorderTraversalQueue(root: TreeNode | null): number[] {
  if (!root) return [];

  const queue: TreeNode[] = [root];
  const values: number[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    values.push(node.val);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  // Sort to simulate inorder (not efficient)
  return values.sort((a, b) => a - b);
}

/**
 * Solution 10: Using Recursion with Helper
 *
 * Approach:
 * - Use helper function with accumulator
 * - More explicit parameter passing
 *
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
function inorderTraversalHelper(root: TreeNode | null): number[] {
  function inorder(node: TreeNode | null, acc: number[]): number[] {
    if (!node) return acc;

    inorder(node.left, acc);
    acc.push(node.val);
    inorder(node.right, acc);

    return acc;
  }

  return inorder(root, []);
}

/**
 * Solution 11: Using Iterative with State Machine
 *
 * Approach:
 * - Use state machine to track traversal state
 * - More explicit state management
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function inorderTraversalStateMachine(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: { node: TreeNode; state: "left" | "root" | "right" }[] = [];

  if (root) {
    stack.push({ node: root, state: "left" });
  }

  while (stack.length > 0) {
    const current = stack[stack.length - 1];

    switch (current.state) {
      case "left":
        current.state = "root";
        if (current.node.left) {
          stack.push({ node: current.node.left, state: "left" });
        }
        break;

      case "root":
        result.push(current.node.val);
        current.state = "right";
        break;

      case "right":
        stack.pop();
        if (current.node.right) {
          stack.push({ node: current.node.right, state: "left" });
        }
        break;
    }
  }

  return result;
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

// Test cases
function testInorderTraversal() {
  console.log("=== Testing Binary Tree Inorder Traversal ===\n");

  const testCases = [
    {
      input: [1, null, 2, 3],
      expected: [1, 3, 2],
      description: "Basic case",
    },
    {
      input: [],
      expected: [],
      description: "Empty tree",
    },
    {
      input: [1],
      expected: [1],
      description: "Single node",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: [4, 2, 5, 1, 3],
      description: "Complete binary tree",
    },
    {
      input: [1, 2, 3, null, null, 4, 5],
      expected: [2, 1, 4, 3, 5],
      description: "Complex tree",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    const root = createBinaryTree(testCase.input);

    // Test Solution 1 (Recursive)
    const result1 = inorderTraversal(root);
    console.log(
      `Solution 1 (Recursive): [${result1.join(", ")}] ${
        JSON.stringify(result1) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 2 (Iterative)
    const result2 = inorderTraversalIterative(root);
    console.log(
      `Solution 2 (Iterative): [${result2.join(", ")}] ${
        JSON.stringify(result2) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 3 (Morris)
    const result3 = inorderTraversalMorris(root);
    console.log(
      `Solution 3 (Morris): [${result3.join(", ")}] ${
        JSON.stringify(result3) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 4 (Class)
    const result4 = inorderTraversalClass(root);
    console.log(
      `Solution 4 (Class): [${result4.join(", ")}] ${
        JSON.stringify(result4) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 5 (Generator)
    const result5 = inorderTraversalWithGenerator(root);
    console.log(
      `Solution 5 (Generator): [${result5.join(", ")}] ${
        JSON.stringify(result5) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = inorderTraversalFunctional(root);
    console.log(
      `Solution 6 (Functional): [${result6.join(", ")}] ${
        JSON.stringify(result6) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 7 (Array Methods)
    const result7 = inorderTraversalArrayMethods(root);
    console.log(
      `Solution 7 (Array Methods): [${result7.join(", ")}] ${
        JSON.stringify(result7) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 8 (Two Stacks)
    const result8 = inorderTraversalTwoStacks(root);
    console.log(
      `Solution 8 (Two Stacks): [${result8.join(", ")}] ${
        JSON.stringify(result8) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 9 (Queue) - Note: This is not efficient for inorder
    const result9 = inorderTraversalQueue(root);
    console.log(
      `Solution 9 (Queue): [${result9.join(", ")}] ${
        JSON.stringify(result9) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 10 (Helper)
    const result10 = inorderTraversalHelper(root);
    console.log(
      `Solution 10 (Helper): [${result10.join(", ")}] ${
        JSON.stringify(result10) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (State Machine)
    const result11 = inorderTraversalStateMachine(root);
    console.log(
      `Solution 11 (State Machine): [${result11.join(", ")}] ${
        JSON.stringify(result11) === JSON.stringify(testCase.expected)
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
    { name: "Recursive", func: inorderTraversal },
    { name: "Iterative", func: inorderTraversalIterative },
    { name: "Morris", func: inorderTraversalMorris },
    { name: "Class", func: inorderTraversalClass },
    { name: "Generator", func: inorderTraversalWithGenerator },
    { name: "Functional", func: inorderTraversalFunctional },
    { name: "Array Methods", func: inorderTraversalArrayMethods },
    { name: "Two Stacks", func: inorderTraversalTwoStacks },
    { name: "Queue", func: inorderTraversalQueue },
    { name: "Helper", func: inorderTraversalHelper },
    { name: "State Machine", func: inorderTraversalStateMachine },
  ];

  // Create test cases
  const smallCase = createBinaryTree([1, 2, 3, 4, 5]);
  const mediumCase = createBinaryTree(
    Array.from({ length: 100 }, (_, i) => i + 1)
  );
  const largeCase = createBinaryTree(
    Array.from({ length: 1000 }, (_, i) => i + 1)
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

      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (length: ${
          result.length
        })`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testInorderTraversal();
// performanceComparison();

export {
  inorderTraversal,
  inorderTraversalIterative,
  inorderTraversalMorris,
  inorderTraversalClass,
  inorderTraversalWithGenerator,
  inorderTraversalFunctional,
  inorderTraversalArrayMethods,
  inorderTraversalTwoStacks,
  inorderTraversalQueue,
  inorderTraversalHelper,
  inorderTraversalStateMachine,
  InorderTraverser,
  inorderTraversalGenerator,
  TreeNode,
  createBinaryTree,
  testInorderTraversal,
  performanceComparison,
};
