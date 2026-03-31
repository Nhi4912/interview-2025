---
layout: page
title: "Optimal Partition of String"
difficulty: Medium
category: String
tags: [Hash Table, String, Greedy]
leetcode_url: "https://leetcode.com/problems/optimal-partition-of-string"
---

# Optimal Partition of String / Optimal Partition of String

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Longest Palindrome](https://leetcode.com/problems/longest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Optimal Partition of String example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Optimal Partition of String. ([LeetCode](https://leetcode.com/problems/optimal-partition-of-string))

Difficulty: Medium | Acceptance: 78.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/optimal-partition-of-string) for full constraints

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
function optimalPartitionOfStringBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function optimalPartitionOfString(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(optimalPartitionOfString(/* example 1 */)); // expected
// console.log(optimalPartitionOfString(/* example 2 */)); // expected
// console.log(optimalPartitionOfString(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Longest Palindrome](https://leetcode.com/problems/longest-palindrome) — same pattern: Greedy
- [Largest Palindromic Number](https://leetcode.com/problems/largest-palindromic-number) — same pattern: Greedy
- [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique) — same pattern: Greedy
- [Optimal Partition of String — LeetCode](https://leetcode.com/problems/optimal-partition-of-string) — problem page
