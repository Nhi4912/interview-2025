---
layout: page
title: "Linked List Random Node"
difficulty: Medium
category: Linked-List
tags: [Linked List, Math, Reservoir Sampling, Randomized]
leetcode_url: "https://leetcode.com/problems/linked-list-random-node"
---

# Linked List Random Node / Linked List Random Node

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) | [Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Linked List Random Node example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Linked List Random Node. ([LeetCode](https://leetcode.com/problems/linked-list-random-node))

Difficulty: Medium | Acceptance: 64.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/linked-list-random-node) for full constraints

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
function linkedListRandomNodeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function linkedListRandomNode(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(linkedListRandomNode(/* example 1 */)); // expected
// console.log(linkedListRandomNode(/* example 2 */)); // expected
// console.log(linkedListRandomNode(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed) — same pattern: Math
- [Convert Binary Number in a Linked List to Integer](https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer) — same pattern: Linked List
- [Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii) — same pattern: Linked List
- [Linked List Random Node — LeetCode](https://leetcode.com/problems/linked-list-random-node) — problem page
