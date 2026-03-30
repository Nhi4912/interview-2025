---
layout: page
title: "Convert Sorted Array to Binary Search Tree"
difficulty: Easy
category: Tree/Graph
tags: [Tree, Divide and Conquer, Binary Search]
leetcode_url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/"
---

# Convert Sorted Array to Binary Search Tree / Chuyển Mảng Đã Sắp Xếp Thành BST Cân Bằng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Divide and Conquer
> **Frequency**: 📘 Tier 2 — Gặp ~40% interviews, thường xuất hiện ngay sau bài BST cơ bản
> **See also**: [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/) | [Convert Sorted List to BST](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tìm từ trong từ điển — bạn luôn mở trang giữa trước, không bắt đầu từ đầu hay cuối. Chọn phần tử giữa làm gốc đảm bảo hai nhánh có kích thước gần bằng nhau, tạo ra cây cân bằng một cách tự nhiên mà không cần rotation.

**Pattern Recognition:**

- Signal: "sorted array → height-balanced BST" → **Divide & Conquer, chọn mid làm root**
- Subarray [left..right] → root = nums[mid], đệ quy trái [left..mid-1], phải [mid+1..right]
- Base case: `left > right` → return null (subarray rỗng, dừng đệ quy)

**Visual — Build BST từ [1,2,3,4,5,6,7]:**

```
Input: [1, 2, 3, 4, 5, 6, 7]  (indices 0–6)

Round 1: mid=3 → root=4
Round 2L: [0..2] mid=1 → root=2    Round 2R: [4..6] mid=5 → root=6
Round 3:  [0..0]→1  [2..2]→3       Round 3:  [4..4]→5  [6..6]→7

Result:
        4
       / \
      2   6
     / \ / \
    1  3 5  7   ← height-balanced ✅ (BST property verified)
```

---

## Problem Description

Given an integer array `nums` sorted in ascending order, convert it to a **height-balanced** binary search tree (depth of two subtrees of every node never differs by more than one).

```
Example 1: nums = [-10,-3,0,5,9]  → [0,-3,9,-10,null,5]  (multiple valid answers)
Example 2: nums = [1,3]            → [3,1] or [1,null,3]
Example 3: nums = [1,2,3,4,5,6,7] → [4,2,6,1,3,5,7]
```

---

## 📝 Interview Tips

1. **Clarify**: "Any valid height-balanced BST accepted?" — có nhiều kết quả đúng từ cùng một mảng / Multiple valid outputs exist.
2. **Approach**: "Pick mid as root — guarantees left and right subtrees have sizes ⌊n/2⌋ and ⌈n/2⌉-1" / Chọn mid → hai nhánh gần bằng nhau.
3. **Mid choice**: `Math.floor((l+r)/2)` hoặc `Math.ceil` đều hợp lệ — cho ra BST khác nhau nhưng đều cân bằng.
4. **Complexity**: O(n) time (tạo n nodes), O(log n) space cho recursion stack (cây cân bằng → height = log n).
5. **Follow-up**: Nếu input là linked list thay vì array → [LeetCode 109](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/) — mất random access, cần two-pointer trick.
6. **Edge cases**: Array rỗng → null; 1 phần tử → leaf; 2 phần tử → root với 1 child.

---

## Solutions

{% raw %}
// Note: TreeNode class is provided by LeetCode environment

// Solution 1: Recursive Divide and Conquer (Optimal — interview standard)
// Time: O(n) — create each node exactly once
// Space: O(log n) — recursion stack = balanced tree height
function sortedArrayToBST(nums: number[]): TreeNode | null {
function build(left: number, right: number): TreeNode | null {
if (left > right) return null;
const mid = Math.floor((left + right) / 2);
const node = new TreeNode(nums[mid]);
node.left = build(left, mid - 1);
node.right = build(mid + 1, right);
return node;
}
return build(0, nums.length - 1);
}

// Solution 2: Iterative with Explicit Stack (Avoids recursion depth issues)
// Time: O(n) — process each node once
// Space: O(n) — stack holds pending subarray tasks
function sortedArrayToBSTIterative(nums: number[]): TreeNode | null {
if (nums.length === 0) return null;
type Task = { parent: TreeNode | null; l: number; r: number; isLeft: boolean };
const stack: Task[] = [{ parent: null, l: 0, r: nums.length - 1, isLeft: true }];
let root: TreeNode | null = null;
while (stack.length > 0) {
const { parent, l, r, isLeft } = stack.pop()!;
if (l > r) continue;
const mid = Math.floor((l + r) / 2);
const node = new TreeNode(nums[mid]);
if (!parent) root = node;
else if (isLeft) parent.left = node;
else parent.right = node;
stack.push({ parent: node, l, r: mid - 1, isLeft: true });
stack.push({ parent: node, l: mid + 1, r, isLeft: false });
}
return root;
}

// === Test Cases ===
console.log(sortedArrayToBST([-10,-3,0,5,9])?.val); // 0 ✅ (root is middle)
console.log(sortedArrayToBST([1,2,3,4,5,6,7])?.val); // 4 ✅
console.log(sortedArrayToBST([1])); // TreeNode{val:1} ✅
console.log(sortedArrayToBST([])); // null ✅
{% endraw %}

---

## 🔗 Related Problems

- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) — verifies BST property on the tree we build
- [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/) — checks the height-balanced property this problem guarantees
- [Convert Sorted List to BST](https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/) — harder variant using linked list (no random access)
- [Inorder Successor in BST](https://leetcode.com/problems/inorder-successor-in-bst/) — navigates the BST structure built here
