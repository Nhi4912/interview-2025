---
layout: page
title: "Remove Zero Sum Consecutive Nodes from Linked List"
difficulty: Medium
category: Linked-List
tags: [Hash Table, Linked List]
leetcode_url: "https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list"
---

# Remove Zero Sum Consecutive Nodes from Linked List / Remove Zero Sum Consecutive Nodes from Linked List

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [LFU Cache](https://leetcode.com/problems/lfu-cache) | [Design HashMap](https://leetcode.com/problems/design-hashmap)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Remove Zero Sum Consecutive Nodes from Linked List example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Remove Zero Sum Consecutive Nodes from Linked List. ([LeetCode](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list))

Difficulty: Medium | Acceptance: 52.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list) for full constraints

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
function removeZeroSumConsecutiveNodesFromLinkedListBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function removeZeroSumConsecutiveNodesFromLinkedList(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(removeZeroSumConsecutiveNodesFromLinkedList(/* example 1 */)); // expected
// console.log(removeZeroSumConsecutiveNodesFromLinkedList(/* example 2 */)); // expected
// console.log(removeZeroSumConsecutiveNodesFromLinkedList(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [LFU Cache](https://leetcode.com/problems/lfu-cache) — same pattern: Linked List
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: Linked List
- [All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure) — same pattern: Linked List
- [Design Authentication Manager](https://leetcode.com/problems/design-authentication-manager) — same pattern: Linked List
- [Remove Zero Sum Consecutive Nodes from Linked List — LeetCode](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list) — problem page
