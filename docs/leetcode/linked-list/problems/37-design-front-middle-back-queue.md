---
layout: page
title: "Design Front Middle Back Queue"
difficulty: Medium
category: Linked-List
tags: [Array, Linked List, Design, Queue, Data Stream]
leetcode_url: "https://leetcode.com/problems/design-front-middle-back-queue"
---

# Design Front Middle Back Queue / Design Front Middle Back Queue

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linked List
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) | [Design HashMap](https://leetcode.com/problems/design-hashmap)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoàn tàu — mỗi toa nối với toa sau. Muốn thay đổi thứ tự, bạn chỉ cần nối lại các khớp nối, không cần di chuyển cả toa.

**Pattern Recognition:**

- Signal: "ListNode" + "in-place modification" → **Linked List**
- Bài này thuộc dạng Linked List — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design Front Middle Back Queue example:**

```
Before: 1 → 2 → 3 → 4 → null
After:  ... (depends on operation)

Use: slow/fast pointers, dummy head, prev tracking
```

---

## Problem Description

Design Front Middle Back Queue. ([LeetCode](https://leetcode.com/problems/design-front-middle-back-queue))

Difficulty: Medium | Acceptance: 56.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-front-middle-back-queue) for full constraints

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
function designFrontMiddleBackQueueBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Linked List
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designFrontMiddleBackQueue(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Linked List
  // Hint: Use dummy head, slow/fast pointers, or prev tracking
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designFrontMiddleBackQueue(/* example 1 */)); // expected
// console.log(designFrontMiddleBackQueue(/* example 2 */)); // expected
// console.log(designFrontMiddleBackQueue(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) — same pattern: Queue
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — same pattern: Linked List
- [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls) — same pattern: Queue
- [Design Snake Game](https://leetcode.com/problems/design-snake-game) — same pattern: Queue
- [Design Front Middle Back Queue — LeetCode](https://leetcode.com/problems/design-front-middle-back-queue) — problem page
