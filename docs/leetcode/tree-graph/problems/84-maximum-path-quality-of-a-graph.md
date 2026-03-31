---
layout: page
title: "Maximum Path Quality of a Graph"
difficulty: Hard
category: Tree-Graph
tags: [Array, Backtracking, Graph]
leetcode_url: "https://leetcode.com/problems/maximum-path-quality-of-a-graph"
---

# Maximum Path Quality of a Graph / Maximum Path Quality of a Graph

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Combination Sum II](https://leetcode.com/problems/combination-sum-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Path Quality of a Graph example:**

```
                    []
            /       |       \
          [a]      [b]      [c]
         / \        |
      [a,b] [a,c]  [b,c]
       |
    [a,b,c]

Choose → Explore → Un-choose (backtrack)
Prune branches that violate constraints
```

---

## Problem Description

Maximum Path Quality of a Graph. ([LeetCode](https://leetcode.com/problems/maximum-path-quality-of-a-graph))

Difficulty: Hard | Acceptance: 59.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-path-quality-of-a-graph) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần all solutions hay count? Có duplicate input không?" / All results or count? Duplicate elements?
2. **Template**: "Choose → Explore → Un-choose" / Follow the standard backtracking template
3. **Pruning**: "Skip nếu biết sớm branch này invalid" / Prune early to avoid TLE
4. **Edge cases**: "Input rỗng, n=0, kết quả có thể rỗng" / Empty input, n=0, possibly empty result set

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumPathQualityOfAGraphBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumPathQualityOfAGraph(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumPathQualityOfAGraph(/* example 1 */)); // expected
// console.log(maximumPathQualityOfAGraph(/* example 2 */)); // expected
// console.log(maximumPathQualityOfAGraph(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Combination Sum II](https://leetcode.com/problems/combination-sum-ii) — same pattern: Backtracking
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Permutations II](https://leetcode.com/problems/permutations-ii) — same pattern: Backtracking
- [Maximum Path Quality of a Graph — LeetCode](https://leetcode.com/problems/maximum-path-quality-of-a-graph) — problem page
