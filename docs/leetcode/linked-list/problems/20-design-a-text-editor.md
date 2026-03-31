---
layout: page
title: "Design a Text Editor"
difficulty: Hard
category: Linked-List
tags: [Linked List, String, Stack, Design, Simulation]
leetcode_url: "https://leetcode.com/problems/design-a-text-editor"
---

# Design a Text Editor / Design a Text Editor

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Max Stack](https://leetcode.com/problems/max-stack) | [LFU Cache](https://leetcode.com/problems/lfu-cache)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design a Text Editor example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Design a Text Editor. ([LeetCode](https://leetcode.com/problems/design-a-text-editor))

Difficulty: Hard | Acceptance: 47.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-a-text-editor) for full constraints

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
function designATextEditorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designATextEditor(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designATextEditor(/* example 1 */)); // expected
// console.log(designATextEditor(/* example 2 */)); // expected
// console.log(designATextEditor(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Max Stack](https://leetcode.com/problems/max-stack) — same pattern: Linked List
- [LFU Cache](https://leetcode.com/problems/lfu-cache) — same pattern: Linked List
- [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) — same pattern: Two Pointers
- [All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure) — same pattern: Linked List
- [Design a Text Editor — LeetCode](https://leetcode.com/problems/design-a-text-editor) — problem page
