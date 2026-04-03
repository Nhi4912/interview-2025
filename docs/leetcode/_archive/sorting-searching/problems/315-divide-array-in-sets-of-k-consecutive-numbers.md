---
layout: page
title: "Divide Array in Sets of K Consecutive Numbers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers"
---

# Divide Array in Sets of K Consecutive Numbers / Divide Array in Sets of K Consecutive Numbers

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Divide Array in Sets of K Consecutive Numbers example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Divide Array in Sets of K Consecutive Numbers. ([LeetCode](https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers))

Difficulty: Medium | Acceptance: 58.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers) for full constraints

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
function divideArrayInSetsOfKConsecutiveNumbersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function divideArrayInSetsOfKConsecutiveNumbers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(divideArrayInSetsOfKConsecutiveNumbers(/* example 1 */)); // expected
// console.log(divideArrayInSetsOfKConsecutiveNumbers(/* example 2 */)); // expected
// console.log(divideArrayInSetsOfKConsecutiveNumbers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — same pattern: Sliding Window
- [Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals) — same pattern: Greedy
- [Find Original Array From Doubled Array](https://leetcode.com/problems/find-original-array-from-doubled-array) — same pattern: Greedy
- [Divide Array in Sets of K Consecutive Numbers — LeetCode](https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers) — problem page
