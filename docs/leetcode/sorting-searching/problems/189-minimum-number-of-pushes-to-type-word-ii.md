---
layout: page
title: "Minimum Number of Pushes to Type Word II"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii"
---

# Minimum Number of Pushes to Type Word II / Minimum Number of Pushes to Type Word II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Maximum Palindromes After Operations](https://leetcode.com/problems/maximum-palindromes-after-operations)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Number of Pushes to Type Word II example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Number of Pushes to Type Word II. ([LeetCode](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii))

Difficulty: Medium | Acceptance: 79.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii) for full constraints

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
function minimumNumberOfPushesToTypeWordIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfPushesToTypeWordIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfPushesToTypeWordIi(/* example 1 */)); // expected
// console.log(minimumNumberOfPushesToTypeWordIi(/* example 2 */)); // expected
// console.log(minimumNumberOfPushesToTypeWordIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Maximum Palindromes After Operations](https://leetcode.com/problems/maximum-palindromes-after-operations) — same pattern: Greedy
- [Minimum Deletions to Make String K-Special](https://leetcode.com/problems/minimum-deletions-to-make-string-k-special) — same pattern: Greedy
- [Minimum Number of Keypresses](https://leetcode.com/problems/minimum-number-of-keypresses) — same pattern: Greedy
- [Minimum Number of Pushes to Type Word II — LeetCode](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii) — problem page
