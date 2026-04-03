/**
 * 108. Convert Sorted Array to Binary Search Tree
 *
 * Problem:
 * Given an integer array nums where the elements are sorted in ascending order,
 * convert it to a height-balanced binary search tree.
 *
 * A height-balanced binary tree is a binary tree in which the depth of the two
 * subtrees of every node never differs by more than one.
 *
 * Example:
 * Input: nums = [-10,-3,0,5,9]
 * Output: [0,-3,9,-10,null,5]
 *
 * Input: nums = [1,3]
 * Output: [3,1]
 *
 * LeetCode: https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/
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
 * Solution 1: Recursive Divide and Conquer (Optimal)
 *
 * Approach:
 * - Find middle element as root
 * - Recursively build left and right subtrees
 * - This ensures height-balanced tree
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n) - recursion stack
 */
function sortedArrayToBST(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(nums[mid]);

    root.left = buildBST(left, mid - 1);
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
}

/**
 * Solution 2: Using Math.floor for Middle
 *
 * Approach:
 * - Same as Solution 1 but more explicit middle calculation
 * - Uses Math.floor for clarity
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTMath(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(nums[mid]);

    root.left = buildBST(left, mid - 1);
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
}

/**
 * Solution 3: Using Bit Shifting for Middle
 *
 * Approach:
 * - Use bit shifting for middle calculation
 * - More efficient than Math.floor
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTBitShift(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = (left + right) >> 1; // Bit shift for division by 2
    const root = new TreeNode(nums[mid]);

    root.left = buildBST(left, mid - 1);
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
}

/**
 * Solution 4: Using Class (Object-oriented)
 *
 * Approach:
 * - Create a BSTBuilder class
 * - Encapsulate the building logic
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
class BSTBuilder {
  private nums: number[];

  constructor(nums: number[]) {
    this.nums = nums;
  }

  build(): TreeNode | null {
    if (this.nums.length === 0) return null;
    return this.buildBST(0, this.nums.length - 1);
  }

  private buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(this.nums[mid]);

    root.left = this.buildBST(left, mid - 1);
    root.right = this.buildBST(mid + 1, right);

    return root;
  }

  getNums(): number[] {
    return [...this.nums];
  }
}

function sortedArrayToBSTClass(nums: number[]): TreeNode | null {
  const builder = new BSTBuilder(nums);
  return builder.build();
}

/**
 * Solution 5: Using Generator
 *
 * Approach:
 * - Use generator to yield nodes
 * - Memory efficient for large arrays
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function* sortedArrayToBSTGenerator(
  nums: number[],
  left: number,
  right: number
): Generator<TreeNode> {
  if (left > right) return;

  const mid = Math.floor((left + right) / 2);
  const root = new TreeNode(nums[mid]);

  yield root;

  // Build left subtree
  for (const leftNode of sortedArrayToBSTGenerator(nums, left, mid - 1)) {
    root.left = leftNode;
    yield leftNode;
  }

  // Build right subtree
  for (const rightNode of sortedArrayToBSTGenerator(nums, mid + 1, right)) {
    root.right = rightNode;
    yield rightNode;
  }
}

function sortedArrayToBSTWithGenerator(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  const iterator = sortedArrayToBSTGenerator(nums, 0, nums.length - 1);
  const result = iterator.next();

  return result.value || null;
}

/**
 * Solution 6: Using Functional Approach
 *
 * Approach:
 * - Use functional programming concepts
 * - More declarative style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTFunctional(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  function buildBST(arr: number[]): TreeNode | null {
    if (arr.length === 0) return null;

    const mid = Math.floor(arr.length / 2);
    const root = new TreeNode(arr[mid]);

    root.left = buildBST(arr.slice(0, mid));
    root.right = buildBST(arr.slice(mid + 1));

    return root;
  }

  return buildBST(nums);
}

/**
 * Solution 7: Using Iterative Approach with Stack
 *
 * Approach:
 * - Use stack to simulate recursion
 * - More explicit control flow
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
function sortedArrayToBSTIterative(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  const stack: {
    left: number;
    right: number;
    parent: TreeNode;
    isLeft: boolean;
  }[] = [];
  const root = new TreeNode(nums[Math.floor(nums.length / 2)]);

  stack.push({
    left: 0,
    right: Math.floor(nums.length / 2) - 1,
    parent: root,
    isLeft: true,
  });

  stack.push({
    left: Math.floor(nums.length / 2) + 1,
    right: nums.length - 1,
    parent: root,
    isLeft: false,
  });

  while (stack.length > 0) {
    const { left, right, parent, isLeft } = stack.pop()!;

    if (left > right) continue;

    const mid = Math.floor((left + right) / 2);
    const node = new TreeNode(nums[mid]);

    if (isLeft) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    stack.push({
      left: left,
      right: mid - 1,
      parent: node,
      isLeft: true,
    });

    stack.push({
      left: mid + 1,
      right: right,
      parent: node,
      isLeft: false,
    });
  }

  return root;
}

/**
 * Solution 8: Using Array Methods
 *
 * Approach:
 * - Use array methods like slice
 * - More functional style
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n) - due to slice operations
 */
function sortedArrayToBSTArrayMethods(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  const mid = Math.floor(nums.length / 2);
  const root = new TreeNode(nums[mid]);

  if (mid > 0) {
    root.left = sortedArrayToBSTArrayMethods(nums.slice(0, mid));
  }

  if (mid < nums.length - 1) {
    root.right = sortedArrayToBSTArrayMethods(nums.slice(mid + 1));
  }

  return root;
}

/**
 * Solution 9: Using Two Pointers
 *
 * Approach:
 * - Use two pointers to track left and right boundaries
 * - More explicit boundary management
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTTwoPointers(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = left + Math.floor((right - left) / 2);
    const root = new TreeNode(nums[mid]);

    root.left = buildBST(left, mid - 1);
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
}

/**
 * Solution 10: Using Inorder Traversal Simulation
 *
 * Approach:
 * - Simulate inorder traversal
 * - Build tree in inorder fashion
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTInorder(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  let index = 0;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);

    // Build left subtree first
    const leftNode = buildBST(left, mid - 1);

    // Create root
    const root = new TreeNode(nums[index++]);
    root.left = leftNode;

    // Build right subtree
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
}

/**
 * Solution 11: Using Preorder Traversal Simulation
 *
 * Approach:
 * - Simulate preorder traversal
 * - Build tree in preorder fashion
 *
 * Time Complexity: O(n)
 * Space Complexity: O(log n)
 */
function sortedArrayToBSTPreorder(nums: number[]): TreeNode | null {
  if (nums.length === 0) return null;

  let index = 0;

  function buildBST(left: number, right: number): TreeNode | null {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);

    // Create root first
    const root = new TreeNode(nums[mid]);
    index++;

    // Build left subtree
    root.left = buildBST(left, mid - 1);

    // Build right subtree
    root.right = buildBST(mid + 1, right);

    return root;
  }

  return buildBST(0, nums.length - 1);
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

// Helper function to get tree height
function getTreeHeight(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

// Helper function to check if tree is balanced
function isBalanced(root: TreeNode | null): boolean {
  if (!root) return true;

  const leftHeight = getTreeHeight(root.left);
  const rightHeight = getTreeHeight(root.right);

  return (
    Math.abs(leftHeight - rightHeight) <= 1 &&
    isBalanced(root.left) &&
    isBalanced(root.right)
  );
}

// Test cases
function testSortedArrayToBST() {
  console.log("=== Testing Convert Sorted Array to Binary Search Tree ===\n");

  const testCases = [
    {
      input: [-10, -3, 0, 5, 9],
      expected: [0, -3, 9, -10, null, 5],
      description: "Basic case",
    },
    {
      input: [1, 3],
      expected: [3, 1],
      description: "Two elements",
    },
    {
      input: [1, 2, 3, 4, 5],
      expected: [3, 2, 5, 1, null, 4],
      description: "Five elements",
    },
    {
      input: [1],
      expected: [1],
      description: "Single element",
    },
    {
      input: [],
      expected: [],
      description: "Empty array",
    },
    {
      input: [1, 2, 3, 4, 5, 6, 7],
      expected: [4, 2, 6, 1, 3, 5, 7],
      description: "Seven elements",
    },
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test Case ${index + 1}: ${testCase.description}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Expected: [${testCase.expected.join(", ")}]\n`);

    // Test Solution 1 (Recursive)
    const result1 = sortedArrayToBST(testCase.input);
    const arr1 = treeToArray(result1);
    console.log(
      `Solution 1 (Recursive): [${arr1.join(", ")}] ${
        JSON.stringify(arr1) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 2 (Math.floor)
    const result2 = sortedArrayToBSTMath(testCase.input);
    const arr2 = treeToArray(result2);
    console.log(
      `Solution 2 (Math.floor): [${arr2.join(", ")}] ${
        JSON.stringify(arr2) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 3 (Bit Shift)
    const result3 = sortedArrayToBSTBitShift(testCase.input);
    const arr3 = treeToArray(result3);
    console.log(
      `Solution 3 (Bit Shift): [${arr3.join(", ")}] ${
        JSON.stringify(arr3) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 4 (Class)
    const result4 = sortedArrayToBSTClass(testCase.input);
    const arr4 = treeToArray(result4);
    console.log(
      `Solution 4 (Class): [${arr4.join(", ")}] ${
        JSON.stringify(arr4) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 5 (Generator)
    const result5 = sortedArrayToBSTWithGenerator(testCase.input);
    const arr5 = treeToArray(result5);
    console.log(
      `Solution 5 (Generator): [${arr5.join(", ")}] ${
        JSON.stringify(arr5) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 6 (Functional)
    const result6 = sortedArrayToBSTFunctional(testCase.input);
    const arr6 = treeToArray(result6);
    console.log(
      `Solution 6 (Functional): [${arr6.join(", ")}] ${
        JSON.stringify(arr6) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 7 (Iterative)
    const result7 = sortedArrayToBSTIterative(testCase.input);
    const arr7 = treeToArray(result7);
    console.log(
      `Solution 7 (Iterative): [${arr7.join(", ")}] ${
        JSON.stringify(arr7) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 8 (Array Methods)
    const result8 = sortedArrayToBSTArrayMethods(testCase.input);
    const arr8 = treeToArray(result8);
    console.log(
      `Solution 8 (Array Methods): [${arr8.join(", ")}] ${
        JSON.stringify(arr8) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 9 (Two Pointers)
    const result9 = sortedArrayToBSTTwoPointers(testCase.input);
    const arr9 = treeToArray(result9);
    console.log(
      `Solution 9 (Two Pointers): [${arr9.join(", ")}] ${
        JSON.stringify(arr9) === JSON.stringify(testCase.expected) ? "✅" : "❌"
      }`
    );

    // Test Solution 10 (Inorder)
    const result10 = sortedArrayToBSTInorder(testCase.input);
    const arr10 = treeToArray(result10);
    console.log(
      `Solution 10 (Inorder): [${arr10.join(", ")}] ${
        JSON.stringify(arr10) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Test Solution 11 (Preorder)
    const result11 = sortedArrayToBSTPreorder(testCase.input);
    const arr11 = treeToArray(result11);
    console.log(
      `Solution 11 (Preorder): [${arr11.join(", ")}] ${
        JSON.stringify(arr11) === JSON.stringify(testCase.expected)
          ? "✅"
          : "❌"
      }`
    );

    // Check if tree is balanced
    const isBalanced1 = isBalanced(result1);
    console.log(
      `Tree is balanced: ${isBalanced1} ${isBalanced1 ? "✅" : "❌"}`
    );

    console.log("\n---\n");
  });
}

// Performance comparison
function performanceComparison() {
  console.log("=== Performance Comparison ===\n");

  const testCases = [
    { name: "Recursive", func: sortedArrayToBST },
    { name: "Math.floor", func: sortedArrayToBSTMath },
    { name: "Bit Shift", func: sortedArrayToBSTBitShift },
    { name: "Class", func: sortedArrayToBSTClass },
    { name: "Generator", func: sortedArrayToBSTWithGenerator },
    { name: "Functional", func: sortedArrayToBSTFunctional },
    { name: "Iterative", func: sortedArrayToBSTIterative },
    { name: "Array Methods", func: sortedArrayToBSTArrayMethods },
    { name: "Two Pointers", func: sortedArrayToBSTTwoPointers },
    { name: "Inorder", func: sortedArrayToBSTInorder },
    { name: "Preorder", func: sortedArrayToBSTPreorder },
  ];

  // Create test cases
  const smallCase = Array.from({ length: 10 }, (_, i) => i);
  const mediumCase = Array.from({ length: 100 }, (_, i) => i);
  const largeCase = Array.from({ length: 1000 }, (_, i) => i);

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

      const height = getTreeHeight(result);
      console.log(
        `  ${funcName}: ${(end - start).toFixed(2)}ms (height: ${height})`
      );
    });

    console.log("");
  });
}

// Uncomment the following lines to run tests
// testSortedArrayToBST();
// performanceComparison();

export {
  sortedArrayToBST,
  sortedArrayToBSTMath,
  sortedArrayToBSTBitShift,
  sortedArrayToBSTClass,
  sortedArrayToBSTWithGenerator,
  sortedArrayToBSTFunctional,
  sortedArrayToBSTIterative,
  sortedArrayToBSTArrayMethods,
  sortedArrayToBSTTwoPointers,
  sortedArrayToBSTInorder,
  sortedArrayToBSTPreorder,
  BSTBuilder,
  sortedArrayToBSTGenerator,
  TreeNode,
  createBinaryTree,
  treeToArray,
  getTreeHeight,
  isBalanced,
  testSortedArrayToBST,
  performanceComparison,
};
