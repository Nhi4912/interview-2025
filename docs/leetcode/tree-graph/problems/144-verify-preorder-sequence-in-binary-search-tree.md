---
layout: page
title: "Verify Preorder Sequence in Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Stack, Tree, Binary Search Tree, Recursion]
leetcode_url: "https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree"
---

# Verify Preorder Sequence in Binary Search Tree / Xác Minh Dãy Tiền Thứ Tự Trong BST

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Trong preorder BST: gặp nút nào lớn hơn nút trên đỉnh stack thì ta đang chuyển sang cây con phải — mọi nút sau phải lớn hơn "lower bound" (giá trị cha cây con phải gần nhất). Dùng stack đơn điệu giảm dần: khi gặp phần tử lớn hơn, pop stack và cập nhật lower bound.

**EN**: Preorder traversal visits root → left → right. A monotonic decreasing stack tracks the "path" from root. When we see a value larger than stack top, we're entering a right subtree — pop to find the new lower bound. Any subsequent value below this bound is invalid.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Verify Preorder Sequence in Binary Search Tree example:**

```
preorder = [5, 2, 1, 3, 6]
stack=[], lo=-∞

val=5: stack=[5], lo=-∞
val=2: 2<5 → stack=[5,2], lo=-∞
val=1: 1<2 → stack=[5,2,1], lo=-∞
val=3: 3>1 → pop 1 (lo=1), 3>2 → pop 2 (lo=2), 3<5 → push 3
       stack=[5,3], lo=2
val=6: 6>3 → pop 3 (lo=3), 6>5 → pop 5 (lo=5), push 6
       stack=[6], lo=5
All values > lo → valid ✓
```

---

## Problem Description

| #    | Title                                 | Difficulty | Pattern         |
| ---- | ------------------------------------- | ---------- | --------------- |
| 1008 | Construct BST from Preorder Traversal | 🟡 Medium  | Monotonic Stack |
| 173  | Binary Search Tree Iterator           | 🟡 Medium  | Stack           |
| 739  | Daily Temperatures                    | 🟡 Medium  | Monotonic Stack |
| 901  | Online Stock Span                     | 🟡 Medium  | Monotonic Stack |

---

## 📝 Interview Tips

- 🇻🇳 Stack đơn điệu giảm: nếu giá trị mới < lower_bound thì invalid ngay lập tức.
- 🇬🇧 Monotonic decreasing stack: if new value < lower_bound → invalid immediately.
- 🇻🇳 Lower bound tăng mỗi khi ta pop stack — đây là "cổng" không thể quay lại.
- 🇬🇧 Lower bound increases each pop — represents "crossed into right subtree, no going back left".
- 🇻🇳 Có thể làm O(1) space bằng cách dùng chính mảng `preorder` làm stack.
- 🇬🇧 O(1) space variant: reuse `preorder` array as the stack (in-place).

---

## Solutions

```typescript
// ─── Solution 1: Monotonic Stack O(n) space ───
// Time: O(n)  Space: O(n)
function verifyPreorder(preorder: number[]): boolean {
  const stack: number[] = [];
  let lowerBound = -Infinity;

  for (const val of preorder) {
    // If current value is less than lower bound → invalid
    // (we'd be going left after already entering a right subtree)
    if (val < lowerBound) return false;

    // Pop all elements smaller than current → we're entering right subtree
    // Each popped element becomes new candidate for lower bound
    while (stack.length && stack[stack.length - 1] < val) {
      lowerBound = stack.pop()!;
    }

    stack.push(val);
  }
  return true;
}

// ─── Solution 2: O(1) space — reuse preorder array as stack ───
// Time: O(n)  Space: O(1)
function verifyPreorderO1(preorder: number[]): boolean {
  let stackIdx = -1; // acts as top-of-stack pointer into preorder
  let lowerBound = -Infinity;

  for (const val of preorder) {
    if (val < lowerBound) return false;
    while (stackIdx >= 0 && preorder[stackIdx] < val) {
      lowerBound = preorder[stackIdx--];
    }
    preorder[++stackIdx] = val;
  }
  return true;
}

// ─── Solution 3: Recursive BST reconstruction ───
// Time: O(n)  Space: O(n) call stack
function verifyPreorderRecursive(preorder: number[]): boolean {
  let idx = 0;

  function validate(min: number, max: number): void {
    if (idx >= preorder.length) return;
    const val = preorder[idx];
    if (val <= min || val >= max) return;
    idx++;
    validate(min, val); // left subtree: all values < val
    validate(val, max); // right subtree: all values > val
  }

  validate(-Infinity, Infinity);
  return idx === preorder.length;
}

// Tests
console.log(verifyPreorder([5, 2, 1, 3, 6])); // true
console.log(verifyPreorder([5, 2, 6, 1, 3])); // false (6 then 1 violates lb)
console.log(verifyPreorderO1([5, 2, 1, 3, 6])); // true
console.log(verifyPreorderO1([5, 2, 6, 1, 3])); // false
console.log(verifyPreorderRecursive([5, 2, 1, 3, 6])); // true
console.log(verifyPreorderRecursive([5, 2, 6, 1, 3])); // false
```

---

## 🔗 Related Problems

| #    | Title                                 | Difficulty | Pattern         |
| ---- | ------------------------------------- | ---------- | --------------- |
| 1008 | Construct BST from Preorder Traversal | 🟡 Medium  | Monotonic Stack |
| 173  | Binary Search Tree Iterator           | 🟡 Medium  | Stack           |
| 739  | Daily Temperatures                    | 🟡 Medium  | Monotonic Stack |
| 901  | Online Stock Span                     | 🟡 Medium  | Monotonic Stack |
