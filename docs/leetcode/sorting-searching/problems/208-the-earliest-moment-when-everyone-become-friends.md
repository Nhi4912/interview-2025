---
layout: page
title: "The Earliest Moment When Everyone Become Friends"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Union Find, Sorting]
leetcode_url: "https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends"
---

# The Earliest Moment When Everyone Become Friends / The Earliest Moment When Everyone Become Friends

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Make Lexicographically Smallest Array by Swapping Elements](https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — The Earliest Moment When Everyone Become Friends example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

The Earliest Moment When Everyone Become Friends. ([LeetCode](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends))

Difficulty: Medium | Acceptance: 65.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends) for full constraints

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
function theEarliestMomentWhenEveryoneBecomeFriendsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function theEarliestMomentWhenEveryoneBecomeFriends(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(theEarliestMomentWhenEveryoneBecomeFriends(/* example 1 */)); // expected
// console.log(theEarliestMomentWhenEveryoneBecomeFriends(/* example 2 */)); // expected
// console.log(theEarliestMomentWhenEveryoneBecomeFriends(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Make Lexicographically Smallest Array by Swapping Elements](https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements) — same pattern: Union Find
- [Rank Transform of a Matrix](https://leetcode.com/problems/rank-transform-of-a-matrix) — same pattern: Topological Sort
- [Maximum Number of Points From Grid Queries](https://leetcode.com/problems/maximum-number-of-points-from-grid-queries) — same pattern: Union Find
- [The Earliest Moment When Everyone Become Friends — LeetCode](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends) — problem page
