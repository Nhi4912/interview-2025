---
layout: page
title: "Remove Linked List Elements"
difficulty: Easy
category: Linked-List
tags: [Linked List, Recursion]
leetcode_url: "https://leetcode.com/problems/remove-linked-list-elements"
---

# Remove Linked List Elements / Remove Linked List Elements

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) | [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Remove Linked List Elements example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Remove Linked List Elements. ([LeetCode](https://leetcode.com/problems/remove-linked-list-elements))

Difficulty: Easy | Acceptance: 51.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/remove-linked-list-elements) for full constraints

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
function removeLinkedListElementsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function removeLinkedListElements(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(removeLinkedListElements(/* example 1 */)); // expected
// console.log(removeLinkedListElements(/* example 2 */)); // expected
// console.log(removeLinkedListElements(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group) — same pattern: Linked List
- [Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs) — same pattern: Linked List
- [Reorder List](https://leetcode.com/problems/reorder-list) — same pattern: Two Pointers
- [Decode String](https://leetcode.com/problems/decode-string) — same pattern: Stack
- [Remove Linked List Elements — LeetCode](https://leetcode.com/problems/remove-linked-list-elements) — problem page
