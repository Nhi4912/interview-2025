---
layout: page
title: "Minimum Number of People to Teach"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-people-to-teach"
---

# Minimum Number of People to Teach / Minimum Number of People to Teach

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

**Visual — Minimum Number of People to Teach example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Number of People to Teach. ([LeetCode](https://leetcode.com/problems/minimum-number-of-people-to-teach))

Difficulty: Medium | Acceptance: 43.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-number-of-people-to-teach) for full constraints

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
function minimumNumberOfPeopleToTeachBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNumberOfPeopleToTeach(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNumberOfPeopleToTeach(/* example 1 */)); // expected
// console.log(minimumNumberOfPeopleToTeach(/* example 2 */)); // expected
// console.log(minimumNumberOfPeopleToTeach(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — same pattern: Sliding Window
- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — same pattern: Greedy
- [Smallest Missing Non-negative Integer After Operations](https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations) — same pattern: Greedy
- [Minimum Number of People to Teach — LeetCode](https://leetcode.com/problems/minimum-number-of-people-to-teach) — problem page
