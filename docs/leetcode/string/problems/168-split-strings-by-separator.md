---
layout: page
title: "Split Strings by Separator"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/split-strings-by-separator"
---

# Split Strings by Separator / Split Strings by Separator

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xử lý chuỗi ký tự — thường dùng hash table, two pointers, hoặc sliding window tuỳ bài toán.

**Pattern Recognition:**

- Signal: "string transformation/validation" → **String Processing**
- Bài này thuộc dạng String Processing — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Split Strings by Separator example:**

```
// TODO: Add step-by-step visual for String Processing
// Show one complete example with state at each step
```

---

## Problem Description

Split Strings by Separator. ([LeetCode](https://leetcode.com/problems/split-strings-by-separator))

Difficulty: Easy | Acceptance: 74.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/split-strings-by-separator) for full constraints

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
function splitStringsBySeparatorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Processing
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function splitStringsBySeparator(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Processing
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(splitStringsBySeparator(/* example 1 */)); // expected
// console.log(splitStringsBySeparator(/* example 2 */)); // expected
// console.log(splitStringsBySeparator(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Text Justification](https://leetcode.com/problems/text-justification) — same pattern: Matrix / Simulation
- [Largest Number](https://leetcode.com/problems/largest-number) — same pattern: Greedy
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — same pattern: Trie
- [Split Strings by Separator — LeetCode](https://leetcode.com/problems/split-strings-by-separator) — problem page
