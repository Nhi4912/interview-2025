---
layout: page
title: "Evaluate Division"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/evaluate-division"
---

# Evaluate Division / Evaluate Division

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Shortest Path (BFS/Dijkstra)
> **Frequency**: 📘 Tier 3 — Gặp ở 13 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi ngắn nhất trên Google Maps — BFS cho đồ thị không trọng số, Dijkstra cho có trọng số dương.

**Pattern Recognition:**

- Signal: "shortest/minimum path with weights" → **Dijkstra/BFS**
- Bài này thuộc dạng Shortest Path (BFS/Dijkstra) — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Evaluate Division example:**

```
// TODO: Add step-by-step visual for Shortest Path (BFS/Dijkstra)
// Show one complete example with state at each step
```

---

## Problem Description

Evaluate Division. ([LeetCode](https://leetcode.com/problems/evaluate-division))

Difficulty: Medium | Acceptance: 63.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/evaluate-division) for full constraints

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
function evaluateDivisionBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Shortest Path (BFS/Dijkstra)
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function evaluateDivision(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Shortest Path (BFS/Dijkstra)
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(evaluateDivision(/* example 1 */)); // expected
// console.log(evaluateDivision(/* example 2 */)); // expected
// console.log(evaluateDivision(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Minimum Runes to Add to Cast Spell](https://leetcode.com/problems/minimum-runes-to-add-to-cast-spell) — same pattern: Topological Sort
- [Similar String Groups](https://leetcode.com/problems/similar-string-groups) — same pattern: Union Find
- [Evaluate Division — LeetCode](https://leetcode.com/problems/evaluate-division) — problem page
