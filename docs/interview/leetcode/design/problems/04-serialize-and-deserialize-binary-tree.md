---
layout: page
title: "Serialize and Deserialize Binary Tree"
difficulty: Hard
category: Design
tags: [Design]
leetcode_url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
---

# Serialize and Deserialize Binary Tree



## Problem Description

 *  * Serialization is the process of converting a data structure or object into a sequence  * of bits so that it can be stored in a file or memory buffer, or transmitted across a  * network connection link to be reconstructed later in the same or another computer environment.  * 

## Solutions

{% raw %}
/**
 * Serialize and Deserialize Binary Tree
 *
 * Problem: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
 *
 * Serialization is the process of converting a data structure or object into a sequence
 * of bits so that it can be stored in a file or memory buffer, or transmitted across a
 * network connection link to be reconstructed later in the same or another computer environment.
 *
 * Design an algorithm to serialize and deserialize a binary tree. There is no restriction
 * on how your serialization/deserialization algorithm should work. You just need to ensure
 * that a binary tree can be serialized to a string and this string can be deserialized to
 * the original tree structure.
 *
 * Example 1:
 * Input: root = [1,2,3,null,null,4,5]
 * Output: [1,2,3,null,null,4,5]
 *
 * Example 2:
 * Input: root = []
 * Output: []
 *
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 10^4].
 * - -1000 <= Node.val <= 1000
 *
 * Solution Approach:
 * 1. Preorder traversal with null markers
 * 2. Level-order traversal (BFS) with null markers
 * 3. Use special characters to represent null nodes
 * 4. Parse the string back to reconstruct the tree
 *
 * Time Complexity: O(n) for both serialization and deserialization
 * Space Complexity: O(n) for storing the serialized string
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
 * Serialize and Deserialize Binary Tree - Preorder Solution
 *
 * Giải pháp duyệt tiền thứ tự cho bài toán Tuần tự hóa và giải tuần tự hóa cây nhị phân
 */
class Codec {
  /**
   * Serialize a binary tree to a string using preorder traversal
   *
   * Tuần tự hóa cây nhị phân thành chuỗi sử dụng duyệt tiền thứ tự
   *
   * @param root - Root of the binary tree
   * @returns Serialized string representation
   */
  serialize(root: TreeNode | null): string {
    if (!root) return "null";

    const left = this.serialize(root.left);
    const right = this.serialize(root.right);

    return `${root.val},${left},${right}`;
  }

  /**
   * Deserialize a string back to a binary tree
   *
   * Giải tuần tự hóa chuỗi về cây nhị phân
   *
   * @param data - Serialized string
   * @returns Root of the reconstructed binary tree
   */
  deserialize(data: string): TreeNode | null {
    const values = data.split(",");
    let index = 0;

    function deserializeHelper(): TreeNode | null {
      if (index >= values.length || values[index] === "null") {
        index++;
        return null;
      }

      const val = parseInt(values[index]);
      index++;

      const node = new TreeNode(val);
      node.left = deserializeHelper();
      node.right = deserializeHelper();

      return node;
    }

    return deserializeHelper();
  }
}

/**
 * Alternative Solution: Level-order (BFS) Serialization
 *
 * Giải pháp thay thế: Tuần tự hóa theo thứ tự mức (BFS)
 */
class CodecBFS {
  serialize(root: TreeNode | null): string {
    if (!root) return "[]";

    const queue: (TreeNode | null)[] = [root];
    const result: (number | null)[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;

      if (node === null) {
        result.push(null);
      } else {
        result.push(node.val);
        queue.push(node.left);
        queue.push(node.right);
      }
    }

    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }

    return JSON.stringify(result);
  }

  deserialize(data: string): TreeNode | null {
    if (data === "[]") return null;

    const values: (number | null)[] = JSON.parse(data);
    if (values.length === 0) return null;

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
}

/**
 * Solution with Compact Representation
 *
 * Giải pháp với biểu diễn gọn
 */
class CodecCompact {
  serialize(root: TreeNode | null): string {
    if (!root) return "#";

    const left = this.serialize(root.left);
    const right = this.serialize(root.right);

    return `${root.val}(${left})(${right})`;
  }

  deserialize(data: string): TreeNode | null {
    if (data === "#") return null;

    let index = 0;

    function parseValue(): number {
      let value = "";
      while (index < data.length && data[index] !== "(") {
        value += data[index];
        index++;
      }
      return parseInt(value);
    }

    function parseSubtree(): TreeNode | null {
      if (data[index] === "#") {
        index++;
        return null;
      }

      const val = parseValue();
      const node = new TreeNode(val);

      if (data[index] === "(") {
        index++; // skip '('
        node.left = parseSubtree();
        index++; // skip ')'

        index++; // skip '('
        node.right = parseSubtree();
        index++; // skip ')'
      }

      return node;
    }

    return parseSubtree();
  }
}

/**
 * Solution with Tree Visualization
 *
 * Giải pháp với hiển thị cây
 */
class CodecWithVisualization {
  serialize(root: TreeNode | null): string {
    return new Codec().serialize(root);
  }

  deserialize(data: string): TreeNode | null {
    return new Codec().deserialize(data);
  }

  /**
   * Visualize the tree structure
   *
   * Hiển thị cấu trúc cây
   *
   * @param root - Root of the tree
   * @returns String representation of the tree
   */
  visualizeTree(root: TreeNode | null): string {
    if (!root) return "Empty tree";

    const result: string[] = [];

    function visualizeHelper(
      node: TreeNode | null,
      prefix: string,
      isLeft: boolean
    ): void {
      if (!node) return;

      result.push(`${prefix}${isLeft ? "├── " : "└── "}${node.val}`);

      const newPrefix = prefix + (isLeft ? "│   " : "    ");

      if (node.left || node.right) {
        if (node.left) {
          visualizeHelper(node.left, newPrefix, true);
        }
        if (node.right) {
          visualizeHelper(node.right, newPrefix, false);
        }
      }
    }

    result.push(`${root.val}`);
    if (root.left) visualizeHelper(root.left, "", true);
    if (root.right) visualizeHelper(root.right, "", false);

    return result.join("\n");
  }

  /**
   * Compare two trees for equality
   *
   * So sánh hai cây có bằng nhau không
   *
   * @param tree1 - First tree
   * @param tree2 - Second tree
   * @returns true if trees are equal
   */
  areTreesEqual(tree1: TreeNode | null, tree2: TreeNode | null): boolean {
    if (!tree1 && !tree2) return true;
    if (!tree1 || !tree2) return false;

    return (
      tree1.val === tree2.val &&
      this.areTreesEqual(tree1.left, tree2.left) &&
      this.areTreesEqual(tree1.right, tree2.right)
    );
  }
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

/**
 * Utility function to convert tree to array
 *
 * Hàm tiện ích để chuyển cây thành mảng
 *
 * @param root - Root of the tree
 * @returns Array representation of the tree
 */
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];

  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    if (node === null) {
      result.push(null);
    } else {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  // Remove trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

// Test cases / Các trường hợp kiểm thử
function runTests() {
  console.log("=== Serialize and Deserialize Binary Tree Tests ===");
  console.log(
    "=== Kiểm thử bài toán Tuần tự hóa và giải tuần tự hóa cây nhị phân ===\n"
  );

  const testCases = [
    {
      name: "Example 1: Standard tree",
      input: [1, 2, 3, null, null, 4, 5],
      description: "Tree with 5 nodes",
    },
    {
      name: "Example 2: Empty tree",
      input: [],
      description: "Empty tree",
    },
    {
      name: "Single node",
      input: [1],
      description: "Tree with single node",
    },
    {
      name: "Left-skewed tree",
      input: [1, 2, null, 3, null, 4],
      description: "Tree skewed to the left",
    },
    {
      name: "Right-skewed tree",
      input: [1, null, 2, null, 3, null, 4],
      description: "Tree skewed to the right",
    },
    {
      name: "Complete binary tree",
      input: [1, 2, 3, 4, 5, 6, 7],
      description: "Complete binary tree",
    },
    {
      name: "Tree with negative values",
      input: [-1, -2, -3, null, null, -4, -5],
      description: "Tree with negative values",
    },
  ];

  const codec = new Codec();
  const codecBFS = new CodecBFS();
  const codecCompact = new CodecCompact();
  const codecViz = new CodecWithVisualization();

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);
    console.log(`Input: [${testCase.input.join(", ")}]`);
    console.log(`Description: ${testCase.description}`);

    // Create original tree
    const originalTree = createTreeFromArray(testCase.input);

    // Test preorder serialization
    const serialized = codec.serialize(originalTree);
    const deserialized = codec.deserialize(serialized);

    console.log(`Serialized (preorder): ${serialized}`);
    console.log(
      `Deserialized array: [${treeToArray(deserialized).join(", ")}]`
    );

    // Test BFS serialization
    const serializedBFS = codecBFS.serialize(originalTree);
    const deserializedBFS = codecBFS.deserialize(serializedBFS);

    console.log(`Serialized (BFS): ${serializedBFS}`);

    // Test compact serialization
    const serializedCompact = codecCompact.serialize(originalTree);
    const deserializedCompact = codecCompact.deserialize(serializedCompact);

    console.log(`Serialized (compact): ${serializedCompact}`);

    // Verify all methods produce same result
    const originalArray = treeToArray(originalTree);
    const deserializedArray = treeToArray(deserialized);
    const deserializedBFSArray = treeToArray(deserializedBFS);
    const deserializedCompactArray = treeToArray(deserializedCompact);

    const allMatch =
      JSON.stringify(originalArray) === JSON.stringify(deserializedArray) &&
      JSON.stringify(deserializedArray) ===
        JSON.stringify(deserializedBFSArray) &&
      JSON.stringify(deserializedBFSArray) ===
        JSON.stringify(deserializedCompactArray);

    console.log(`All methods match: ${allMatch ? "✅ Yes" : "❌ No"}`);

    // Show tree visualization
    if (originalTree) {
      console.log("Tree visualization:");
      console.log(codecViz.visualizeTree(originalTree));
    }

    console.log("---");
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
  const serialized1 = codec.serialize(largeTree);
  const deserialized1 = codec.deserialize(serialized1);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  const serialized2 = codecBFS.serialize(largeTree);
  const deserialized2 = codecBFS.deserialize(serialized2);
  const time2 = performance.now() - start2;

  const start3 = performance.now();
  const serialized3 = codecCompact.serialize(largeTree);
  const deserialized3 = codecCompact.deserialize(serialized3);
  const time3 = performance.now() - start3;

  console.log(
    `Preorder: ${time1.toFixed(4)}ms, Size: ${serialized1.length} chars`
  );
  console.log(`BFS: ${time2.toFixed(4)}ms, Size: ${serialized2.length} chars`);
  console.log(
    `Compact: ${time3.toFixed(4)}ms, Size: ${serialized3.length} chars`
  );

  const resultsMatch =
    codecViz.areTreesEqual(deserialized1, deserialized2) &&
    codecViz.areTreesEqual(deserialized2, deserialized3);
  console.log(`Results match: ${resultsMatch ? "✅ Yes" : "❌ No"}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export {
  TreeNode,
  Codec,
  CodecBFS,
  CodecCompact,
  CodecWithVisualization,
  createTreeFromArray,
  treeToArray,
};
{% endraw %}
