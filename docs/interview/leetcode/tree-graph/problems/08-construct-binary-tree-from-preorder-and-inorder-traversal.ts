/**
 * Construct Binary Tree from Preorder and Inorder Traversal
 *
 * Problem: Given two integer arrays preorder and inorder where preorder is the preorder traversal
 * of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.
 *
 * LeetCode: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 *
 * Companies: Amazon, Google, Microsoft, Facebook
 *
 * Difficulty: Medium
 *
 * Key Concepts: Tree reconstruction, hash map, divide and conquer
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
 * Solution 1: Hash Map Approach (Optimal)
 *
 * Time Complexity: O(n) - Each node is visited once
 * Space Complexity: O(n) - Hash map storage + recursion stack
 *
 * Approach:
 * 1. Use hash map to store inorder indices for O(1) lookup
 * 2. Use preorder to determine root nodes
 * 3. Use inorder to determine left/right subtree boundaries
 * 4. Recursively build left and right subtrees
 *
 * Thuật toán:
 * 1. Sử dụng hash map để lưu chỉ số inorder cho việc tìm kiếm O(1)
 * 2. Sử dụng preorder để xác định các nút gốc
 * 3. Sử dụng inorder để xác định ranh giới cây con trái/phải
 * 4. Đệ quy xây dựng cây con trái và phải
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  // Create hash map for O(1) inorder index lookup
  const inorderMap = new Map<number, number>();
  for (let i = 0; i < inorder.length; i++) {
    inorderMap.set(inorder[i], i);
  }

  let preorderIndex = 0;

  function buildTreeHelper(left: number, right: number): TreeNode | null {
    // Base case: no elements to construct
    if (left > right) return null;

    // Get current root from preorder
    const rootVal = preorder[preorderIndex++];
    const root = new TreeNode(rootVal);

    // Find root position in inorder
    const inorderIndex = inorderMap.get(rootVal)!;

    // Recursively build left and right subtrees
    root.left = buildTreeHelper(left, inorderIndex - 1);
    root.right = buildTreeHelper(inorderIndex + 1, right);

    return root;
  }

  return buildTreeHelper(0, inorder.length - 1);
}

/**
 * Solution 2: Array Slice Approach (Less Efficient)
 *
 * Time Complexity: O(n²) - Array slicing takes O(n) each time
 * Space Complexity: O(n) - Recursion stack + new arrays
 *
 * Approach:
 * 1. Find root from preorder (first element)
 * 2. Find root position in inorder
 * 3. Split arrays into left and right subtrees
 * 4. Recursively build subtrees
 *
 * Thuật toán:
 * 1. Tìm gốc từ preorder (phần tử đầu tiên)
 * 2. Tìm vị trí gốc trong inorder
 * 3. Chia mảng thành cây con trái và phải
 * 4. Đệ quy xây dựng các cây con
 */
function buildTreeArraySlice(
  preorder: number[],
  inorder: number[]
): TreeNode | null {
  if (preorder.length === 0 || inorder.length === 0) return null;

  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);

  // Find root index in inorder
  const rootIndex = inorder.indexOf(rootVal);

  // Build left subtree
  const leftInorder = inorder.slice(0, rootIndex);
  const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
  root.left = buildTreeArraySlice(leftPreorder, leftInorder);

  // Build right subtree
  const rightInorder = inorder.slice(rootIndex + 1);
  const rightPreorder = preorder.slice(1 + leftInorder.length);
  root.right = buildTreeArraySlice(rightPreorder, rightInorder);

  return root;
}

/**
 * Solution 3: Iterative Approach using Stack
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * Approach:
 * 1. Use stack to keep track of nodes
 * 2. Use preorder to create nodes
 * 3. Use inorder to determine when to pop from stack
 *
 * Thuật toán:
 * 1. Sử dụng stack để theo dõi các nút
 * 2. Sử dụng preorder để tạo các nút
 * 3. Sử dụng inorder để xác định khi nào pop từ stack
 */
function buildTreeIterative(
  preorder: number[],
  inorder: number[]
): TreeNode | null {
  if (preorder.length === 0) return null;

  const root = new TreeNode(preorder[0]);
  const stack: TreeNode[] = [root];
  let inorderIndex = 0;

  for (let i = 1; i < preorder.length; i++) {
    const currentVal = preorder[i];
    let node = stack[stack.length - 1];

    // If current node is not the inorder successor of top of stack
    if (node.val !== inorder[inorderIndex]) {
      node.left = new TreeNode(currentVal);
      stack.push(node.left);
    } else {
      // Pop nodes from stack until we find the right place
      while (
        stack.length > 0 &&
        stack[stack.length - 1].val === inorder[inorderIndex]
      ) {
        node = stack.pop()!;
        inorderIndex++;
      }
      node.right = new TreeNode(currentVal);
      stack.push(node.right);
    }
  }

  return root;
}

/**
 * Utility function to print tree in level order (for testing)
 */
function printTreeLevelOrder(root: TreeNode | null): void {
  if (!root) {
    console.log("Empty tree");
    return;
  }

  const queue: (TreeNode | null)[] = [root];
  const result: (number | null)[] = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  console.log("Level order:", result);
}

/**
 * Utility function to get inorder traversal (for verification)
 */
function getInorderTraversal(root: TreeNode | null): number[] {
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
 * Utility function to get preorder traversal (for verification)
 */
function getPreorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function preorder(node: TreeNode | null): void {
    if (!node) return;
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }

  preorder(root);
  return result;
}

// Test cases
function runTests(): void {
  console.log(
    "=== Testing Construct Binary Tree from Preorder and Inorder Traversal ===\n"
  );

  // Test Case 1: Simple tree
  console.log("Test Case 1: Simple tree");
  const preorder1 = [3, 9, 20, 15, 7];
  const inorder1 = [9, 3, 15, 20, 7];

  const tree1 = buildTree(preorder1, inorder1);
  console.log("Preorder input:", preorder1);
  console.log("Inorder input:", inorder1);
  console.log("Generated preorder:", getPreorderTraversal(tree1));
  console.log("Generated inorder:", getInorderTraversal(tree1));
  console.log(
    "Match:",
    JSON.stringify(getPreorderTraversal(tree1)) === JSON.stringify(preorder1) &&
      JSON.stringify(getInorderTraversal(tree1)) === JSON.stringify(inorder1)
  );
  printTreeLevelOrder(tree1);
  console.log();

  // Test Case 2: Single node
  console.log("Test Case 2: Single node");
  const preorder2 = [1];
  const inorder2 = [1];

  const tree2 = buildTree(preorder2, inorder2);
  console.log("Preorder input:", preorder2);
  console.log("Inorder input:", inorder2);
  console.log("Generated preorder:", getPreorderTraversal(tree2));
  console.log("Generated inorder:", getInorderTraversal(tree2));
  console.log(
    "Match:",
    JSON.stringify(getPreorderTraversal(tree2)) === JSON.stringify(preorder2) &&
      JSON.stringify(getInorderTraversal(tree2)) === JSON.stringify(inorder2)
  );
  printTreeLevelOrder(tree2);
  console.log();

  // Test Case 3: Left-skewed tree
  console.log("Test Case 3: Left-skewed tree");
  const preorder3 = [1, 2, 3];
  const inorder3 = [3, 2, 1];

  const tree3 = buildTree(preorder3, inorder3);
  console.log("Preorder input:", preorder3);
  console.log("Inorder input:", inorder3);
  console.log("Generated preorder:", getPreorderTraversal(tree3));
  console.log("Generated inorder:", getInorderTraversal(tree3));
  console.log(
    "Match:",
    JSON.stringify(getPreorderTraversal(tree3)) === JSON.stringify(preorder3) &&
      JSON.stringify(getInorderTraversal(tree3)) === JSON.stringify(inorder3)
  );
  printTreeLevelOrder(tree3);
  console.log();

  // Test Case 4: Right-skewed tree
  console.log("Test Case 4: Right-skewed tree");
  const preorder4 = [1, 2, 3];
  const inorder4 = [1, 2, 3];

  const tree4 = buildTree(preorder4, inorder4);
  console.log("Preorder input:", preorder4);
  console.log("Inorder input:", inorder4);
  console.log("Generated preorder:", getPreorderTraversal(tree4));
  console.log("Generated inorder:", getInorderTraversal(tree4));
  console.log(
    "Match:",
    JSON.stringify(getPreorderTraversal(tree4)) === JSON.stringify(preorder4) &&
      JSON.stringify(getInorderTraversal(tree4)) === JSON.stringify(inorder4)
  );
  printTreeLevelOrder(tree4);
  console.log();

  // Test Case 5: Complex tree
  console.log("Test Case 5: Complex tree");
  const preorder5 = [1, 2, 4, 5, 3, 6];
  const inorder5 = [4, 2, 5, 1, 6, 3];

  const tree5 = buildTree(preorder5, inorder5);
  console.log("Preorder input:", preorder5);
  console.log("Inorder input:", inorder5);
  console.log("Generated preorder:", getPreorderTraversal(tree5));
  console.log("Generated inorder:", getInorderTraversal(tree5));
  console.log(
    "Match:",
    JSON.stringify(getPreorderTraversal(tree5)) === JSON.stringify(preorder5) &&
      JSON.stringify(getInorderTraversal(tree5)) === JSON.stringify(inorder5)
  );
  printTreeLevelOrder(tree5);
  console.log();

  // Performance comparison
  console.log("=== Performance Comparison ===");
  const largePreorder = Array.from({ length: 1000 }, (_, i) => i);
  const largeInorder = [...largePreorder].sort((a, b) => a - b);

  console.time("Hash Map Approach");
  buildTree(largePreorder, largeInorder);
  console.timeEnd("Hash Map Approach");

  console.time("Array Slice Approach");
  buildTreeArraySlice(largePreorder, largeInorder);
  console.timeEnd("Array Slice Approach");

  console.time("Iterative Approach");
  buildTreeIterative(largePreorder, largeInorder);
  console.timeEnd("Iterative Approach");
}

// Run tests
runTests();

export { buildTree, buildTreeArraySlice, buildTreeIterative, TreeNode };
