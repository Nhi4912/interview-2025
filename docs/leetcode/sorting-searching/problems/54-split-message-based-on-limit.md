---
layout: page
title: "Split Message Based on Limit"
difficulty: Hard
category: Sorting-Searching
tags: [String, Binary Search, Enumeration]
leetcode_url: "https://leetcode.com/problems/split-message-based-on-limit"
---

# Split Message Based on Limit / Split Message Based on Limit

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Split Message Based on Limit example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Split Message Based on Limit. ([LeetCode](https://leetcode.com/problems/split-message-based-on-limit))

Difficulty: Hard | Acceptance: 42.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/split-message-based-on-limit) for full constraints

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
function splitMessageBasedOnLimitBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function splitMessageBasedOnLimit(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(splitMessageBasedOnLimit(/* example 1 */)); // expected
// console.log(splitMessageBasedOnLimit(/* example 2 */)); // expected
// console.log(splitMessageBasedOnLimit(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — same pattern: Binary Search
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Minimize Result by Adding Parentheses to Expression](https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression) — same pattern: String Processing
- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — same pattern: Trie
- [Split Message Based on Limit — LeetCode](https://leetcode.com/problems/split-message-based-on-limit) — problem page
