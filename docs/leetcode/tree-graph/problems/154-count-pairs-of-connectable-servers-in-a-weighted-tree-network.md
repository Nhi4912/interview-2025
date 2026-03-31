---
layout: page
title: "Count Pairs of Connectable Servers in a Weighted Tree Network"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network"
---

# Count Pairs of Connectable Servers in a Weighted Tree Network / Count Pairs of Connectable Servers in a Weighted Tree Network

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) | [Count Nodes With the Highest Score](https://leetcode.com/problems/count-nodes-with-the-highest-score)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Pairs of Connectable Servers in a Weighted Tree Network example:**

```
       root
      /    \
     A      B
    / \      \
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
```

---

## Problem Description

Count Pairs of Connectable Servers in a Weighted Tree Network. ([LeetCode](https://leetcode.com/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network))

Difficulty: Medium | Acceptance: 54.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network) for full constraints

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
function countPairsOfConnectableServersInAWeightedTreeNetworkBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countPairsOfConnectableServersInAWeightedTreeNetwork(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countPairsOfConnectableServersInAWeightedTreeNetwork(/* example 1 */)); // expected
// console.log(countPairsOfConnectableServersInAWeightedTreeNetwork(/* example 2 */)); // expected
// console.log(countPairsOfConnectableServersInAWeightedTreeNetwork(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) — same pattern: Dynamic Programming
- [Count Nodes With the Highest Score](https://leetcode.com/problems/count-nodes-with-the-highest-score) — same pattern: DFS
- [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) — same pattern: Topological Sort
- [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree) — same pattern: BFS
- [Count Pairs of Connectable Servers in a Weighted Tree Network — LeetCode](https://leetcode.com/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network) — problem page
