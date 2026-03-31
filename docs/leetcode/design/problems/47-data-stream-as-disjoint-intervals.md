---
layout: page
title: "Data Stream as Disjoint Intervals"
difficulty: Hard
category: Design
tags: [Binary Search, Design, Ordered Set]
leetcode_url: "https://leetcode.com/problems/data-stream-as-disjoint-intervals"
---

# Data Stream as Disjoint Intervals / Data Stream as Disjoint Intervals

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Implement Router](https://leetcode.com/problems/implement-router) | [My Calendar I](https://leetcode.com/problems/my-calendar-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Data Stream as Disjoint Intervals example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Data Stream as Disjoint Intervals. ([LeetCode](https://leetcode.com/problems/data-stream-as-disjoint-intervals))

Difficulty: Hard | Acceptance: 59.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/data-stream-as-disjoint-intervals) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Input đã sorted? Cần tìm vị trí chính xác hay boundary?" / Is input sorted? Exact match or boundary?
2. **Brute force**: "Linear scan O(n)" → optimize with binary search O(log n) / Start linear, suggest binary
3. **Optimize**: "Chú ý lo/hi boundary: lo <= hi hay lo < hi? mid±1 hay mid?" / Watch boundary conditions carefully
4. **Edge cases**: "Mảng rỗng, một phần tử, target không tồn tại, overflow mid" / Empty, single, not found, overflow

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function dataStreamAsDisjointIntervalsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function dataStreamAsDisjointIntervals(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(dataStreamAsDisjointIntervals(/* example 1 */)); // expected
// console.log(dataStreamAsDisjointIntervals(/* example 2 */)); // expected
// console.log(dataStreamAsDisjointIntervals(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Implement Router](https://leetcode.com/problems/implement-router) — same pattern: Binary Search
- [My Calendar I](https://leetcode.com/problems/my-calendar-i) — same pattern: Segment Tree
- [Tweet Counts Per Frequency](https://leetcode.com/problems/tweet-counts-per-frequency) — same pattern: Binary Search
- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Data Stream as Disjoint Intervals — LeetCode](https://leetcode.com/problems/data-stream-as-disjoint-intervals) — problem page
