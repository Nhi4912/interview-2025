---
layout: page
title: "Mini Parser"
difficulty: Medium
category: Tree-Graph
tags: [String, Stack, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/mini-parser"
---

# Mini Parser / Mini Parser

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Simplify Path](https://leetcode.com/problems/simplify-path)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Mini Parser example:**

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

Mini Parser. ([LeetCode](https://leetcode.com/problems/mini-parser))

Difficulty: Medium | Acceptance: 40.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/mini-parser) for full constraints

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
function miniParserBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function miniParser(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(miniParser(/* example 1 */)); // expected
// console.log(miniParser(/* example 2 */)); // expected
// console.log(miniParser(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Decode String](https://leetcode.com/problems/decode-string) — same pattern: Stack
- [Simplify Path](https://leetcode.com/problems/simplify-path) — same pattern: Stack
- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses) — same pattern: Dynamic Programming
- [Mini Parser — LeetCode](https://leetcode.com/problems/mini-parser) — problem page
