---
layout: page
title: "Top K Frequent Words"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/top-k-frequent-words"
---

# Top K Frequent Words / Top K Frequent Words

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục — mỗi ký tự là một cấp. Tìm kiếm prefix cực nhanh O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search" + "dictionary of words" → **Trie**
- Bài này thuộc dạng Trie — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Top K Frequent Words example:**

```
// TODO: Add step-by-step visual for Trie
// Show one complete example with state at each step
```

---

## Problem Description

Top K Frequent Words. ([LeetCode](https://leetcode.com/problems/top-k-frequent-words))

Difficulty: Medium | Acceptance: 59.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/top-k-frequent-words) for full constraints

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
function topKFrequentWordsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Trie
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function topKFrequentWords(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Trie
  // Hint: Build trie from dictionary, search by prefix
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(topKFrequentWords(/* example 1 */)); // expected
// console.log(topKFrequentWords(/* example 2 */)); // expected
// console.log(topKFrequentWords(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) — same pattern: Heap / Priority Queue
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Top K Frequent Words — LeetCode](https://leetcode.com/problems/top-k-frequent-words) — problem page
