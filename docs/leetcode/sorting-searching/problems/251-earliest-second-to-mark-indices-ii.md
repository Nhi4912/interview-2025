---
layout: page
title: "Earliest Second to Mark Indices II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/earliest-second-to-mark-indices-ii"
---

# Earliest Second to Mark Indices II / Earliest Second to Mark Indices II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) | [Avoid Flood in The City](https://leetcode.com/problems/avoid-flood-in-the-city)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Earliest Second to Mark Indices II example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Earliest Second to Mark Indices II. ([LeetCode](https://leetcode.com/problems/earliest-second-to-mark-indices-ii))

Difficulty: Hard | Acceptance: 20.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/earliest-second-to-mark-indices-ii) for full constraints

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
function earliestSecondToMarkIndicesIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function earliestSecondToMarkIndicesIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(earliestSecondToMarkIndicesIi(/* example 1 */)); // expected
// console.log(earliestSecondToMarkIndicesIi(/* example 2 */)); // expected
// console.log(earliestSecondToMarkIndicesIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) — same pattern: Binary Search
- [Avoid Flood in The City](https://leetcode.com/problems/avoid-flood-in-the-city) — same pattern: Binary Search
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Earliest Second to Mark Indices II — LeetCode](https://leetcode.com/problems/earliest-second-to-mark-indices-ii) — problem page
