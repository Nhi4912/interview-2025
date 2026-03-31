---
layout: page
title: "Maximum Palindromes After Operations"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-palindromes-after-operations"
---

# Maximum Palindromes After Operations / Maximum Palindromes After Operations

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Palindromes After Operations example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Palindromes After Operations. ([LeetCode](https://leetcode.com/problems/maximum-palindromes-after-operations))

Difficulty: Medium | Acceptance: 43.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-palindromes-after-operations) for full constraints

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
function maximumPalindromesAfterOperationsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumPalindromesAfterOperations(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumPalindromesAfterOperations(/* example 1 */)); // expected
// console.log(maximumPalindromesAfterOperations(/* example 2 */)); // expected
// console.log(maximumPalindromesAfterOperations(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) — same pattern: Sorting
- [Maximum Palindromes After Operations — LeetCode](https://leetcode.com/problems/maximum-palindromes-after-operations) — problem page
