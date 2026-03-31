---
layout: page
title: "Minimize Result by Adding Parentheses to Expression"
difficulty: Medium
category: String
tags: [String, Enumeration]
leetcode_url: "https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression"
---

# Minimize Result by Adding Parentheses to Expression / Minimize Result by Adding Parentheses to Expression

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Split Message Based on Limit](https://leetcode.com/problems/split-message-based-on-limit) | [Shortest String That Contains Three Strings](https://leetcode.com/problems/shortest-string-that-contains-three-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xử lý chuỗi ký tự — thường dùng hash table, two pointers, hoặc sliding window tuỳ bài toán.

**Pattern Recognition:**

- Signal: "string transformation/validation" → **String Processing**
- Bài này thuộc dạng String Processing — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimize Result by Adding Parentheses to Expression example:**

```
// TODO: Add step-by-step visual for String Processing
// Show one complete example with state at each step
```

---

## Problem Description

Minimize Result by Adding Parentheses to Expression. ([LeetCode](https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression))

Difficulty: Medium | Acceptance: 67.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression) for full constraints

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
function minimizeResultByAddingParenthesesToExpressionBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — String Processing
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimizeResultByAddingParenthesesToExpression(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using String Processing
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimizeResultByAddingParenthesesToExpression(/* example 1 */)); // expected
// console.log(minimizeResultByAddingParenthesesToExpression(/* example 2 */)); // expected
// console.log(minimizeResultByAddingParenthesesToExpression(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Split Message Based on Limit](https://leetcode.com/problems/split-message-based-on-limit) — same pattern: Binary Search
- [Shortest String That Contains Three Strings](https://leetcode.com/problems/shortest-string-that-contains-three-strings) — same pattern: Greedy
- [Lexicographically Smallest String After Applying Operations](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations) — same pattern: BFS
- [Frequencies of Shortest Supersequences](https://leetcode.com/problems/frequencies-of-shortest-supersequences) — same pattern: Topological Sort
- [Minimize Result by Adding Parentheses to Expression — LeetCode](https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression) — problem page
