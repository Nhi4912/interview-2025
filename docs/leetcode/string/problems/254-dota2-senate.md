---
layout: page
title: "Dota2 Senate"
difficulty: Medium
category: String
tags: [String, Greedy, Queue]
leetcode_url: "https://leetcode.com/problems/dota2-senate"
---

# Dota2 Senate / Dota2 Senate

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stamping The Sequence](https://leetcode.com/problems/stamping-the-sequence) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Dota2 Senate example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Dota2 Senate. ([LeetCode](https://leetcode.com/problems/dota2-senate))

Difficulty: Medium | Acceptance: 48.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/dota2-senate) for full constraints

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
function dota2SenateBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function dota2Senate(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(dota2Senate(/* example 1 */)); // expected
// console.log(dota2Senate(/* example 2 */)); // expected
// console.log(dota2Senate(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stamping The Sequence](https://leetcode.com/problems/stamping-the-sequence) — same pattern: Stack
- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — same pattern: Dynamic Programming
- [Largest Number](https://leetcode.com/problems/largest-number) — same pattern: Greedy
- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — same pattern: Monotonic Stack
- [Dota2 Senate — LeetCode](https://leetcode.com/problems/dota2-senate) — problem page
