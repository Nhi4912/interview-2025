---
layout: page
title: "Exam Room"
difficulty: Medium
category: Design
tags: [Design, Heap (Priority Queue), Ordered Set]
leetcode_url: "https://leetcode.com/problems/exam-room"
---

# Exam Room / Exam Room

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) | [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Exam Room example:**

```
Min Heap:
        1
       / \
      3   2
     / \
    7   4

Insert: add to end, bubble up
Extract: remove root, bubble down
```

---

## Problem Description

Exam Room. ([LeetCode](https://leetcode.com/problems/exam-room))

Difficulty: Medium | Acceptance: 42.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/exam-room) for full constraints

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
function examRoomBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function examRoom(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(examRoom(/* example 1 */)); // expected
// console.log(examRoom(/* example 2 */)); // expected
// console.log(examRoom(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) — same pattern: Heap / Priority Queue
- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — same pattern: Heap / Priority Queue
- [Design a 3D Binary Matrix with Efficient Layer Tracking](https://leetcode.com/problems/design-a-3d-binary-matrix-with-efficient-layer-tracking) — same pattern: Heap / Priority Queue
- [Design Movie Rental System](https://leetcode.com/problems/design-movie-rental-system) — same pattern: Heap / Priority Queue
- [Exam Room — LeetCode](https://leetcode.com/problems/exam-room) — problem page
