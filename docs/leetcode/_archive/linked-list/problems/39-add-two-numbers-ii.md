---
layout: page
title: "Add Two Numbers II"
difficulty: Medium
category: Linked-List
tags: [Linked List, Math, Stack]
leetcode_url: "https://leetcode.com/problems/add-two-numbers-ii"
---

# Add Two Numbers II / Add Two Numbers II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Double a Number Represented as a Linked List](https://leetcode.com/problems/double-a-number-represented-as-a-linked-list) | [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Add Two Numbers II example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Add Two Numbers II. ([LeetCode](https://leetcode.com/problems/add-two-numbers-ii))

Difficulty: Medium | Acceptance: 61.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/add-two-numbers-ii) for full constraints

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
function addTwoNumbersIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function addTwoNumbersIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(addTwoNumbersIi(/* example 1 */)); // expected
// console.log(addTwoNumbersIi(/* example 2 */)); // expected
// console.log(addTwoNumbersIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Double a Number Represented as a Linked List](https://leetcode.com/problems/double-a-number-represented-as-a-linked-list) — same pattern: Linked List
- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — same pattern: Stack
- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list) — same pattern: DFS
- [Add Two Numbers II — LeetCode](https://leetcode.com/problems/add-two-numbers-ii) — problem page
