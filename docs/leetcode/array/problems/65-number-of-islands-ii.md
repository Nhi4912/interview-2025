---
layout: page
title: "Number of Islands II"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Union Find]
leetcode_url: "https://leetcode.com/problems/number-of-islands-ii"
---

# Number of Islands II / Number of Islands II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) | [Accounts Merge](https://leetcode.com/problems/accounts-merge)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Islands II example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Number of Islands II. ([LeetCode](https://leetcode.com/problems/number-of-islands-ii))

Difficulty: Hard | Acceptance: 40.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-islands-ii) for full constraints

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
function numberOfIslandsIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfIslandsIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfIslandsIi(/* example 1 */)); // expected
// console.log(numberOfIslandsIi(/* example 2 */)); // expected
// console.log(numberOfIslandsIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — same pattern: Union Find
- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Synonymous Sentences](https://leetcode.com/problems/synonymous-sentences) — same pattern: Union Find
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Number of Islands II — LeetCode](https://leetcode.com/problems/number-of-islands-ii) — problem page
