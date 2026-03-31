---
layout: page
title: "Strong Password Checker"
difficulty: Hard
category: Sorting-Searching
tags: [String, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/strong-password-checker"
---

# Strong Password Checker / Strong Password Checker

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Longest Happy String](https://leetcode.com/problems/longest-happy-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu.

**Pattern Recognition:**

- Signal: "k-th largest/smallest" + "top-k elements" → **Heap**
- Bài này thuộc dạng Heap / Priority Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Strong Password Checker example:**

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

Strong Password Checker. ([LeetCode](https://leetcode.com/problems/strong-password-checker))

Difficulty: Hard | Acceptance: 14.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/strong-password-checker) for full constraints

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
function strongPasswordCheckerBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Heap / Priority Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function strongPasswordChecker(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Heap / Priority Queue
  // Hint: Use min/max heap to efficiently track k-th element
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(strongPasswordChecker(/* example 1 */)); // expected
// console.log(strongPasswordChecker(/* example 2 */)); // expected
// console.log(strongPasswordChecker(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Longest Happy String](https://leetcode.com/problems/longest-happy-string) — same pattern: Heap / Priority Queue
- [Construct String With Repeat Limit](https://leetcode.com/problems/construct-string-with-repeat-limit) — same pattern: Heap / Priority Queue
- [Lexicographically Minimum String After Removing Stars](https://leetcode.com/problems/lexicographically-minimum-string-after-removing-stars) — same pattern: Heap / Priority Queue
- [Strong Password Checker — LeetCode](https://leetcode.com/problems/strong-password-checker) — problem page
