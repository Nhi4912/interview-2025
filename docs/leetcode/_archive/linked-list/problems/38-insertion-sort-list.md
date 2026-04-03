---
layout: page
title: "Insertion Sort List"
difficulty: Medium
category: Linked-List
tags: [Linked List, Sorting]
leetcode_url: "https://leetcode.com/problems/insertion-sort-list"
---

# Insertion Sort List / Insertion Sort List

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Sort List](https://leetcode.com/problems/sort-list) | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Insertion Sort List example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Insertion Sort List. ([LeetCode](https://leetcode.com/problems/insertion-sort-list))

Difficulty: Medium | Acceptance: 56.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/insertion-sort-list) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function insertionSortListBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function insertionSortList(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(insertionSortList(/* example 1 */)); // expected
// console.log(insertionSortList(/* example 2 */)); // expected
// console.log(insertionSortList(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sort List](https://leetcode.com/problems/sort-list) — same pattern: Two Pointers
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — same pattern: Heap / Priority Queue
- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) — same pattern: Linked List
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — same pattern: Two Pointers
- [Insertion Sort List — LeetCode](https://leetcode.com/problems/insertion-sort-list) — problem page
