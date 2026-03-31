---
layout: page
title: "Different Ways to Add Parentheses"
difficulty: Medium
category: Dynamic Programming
tags: [Math, String, Dynamic Programming, Recursion, Memoization]
leetcode_url: "https://leetcode.com/problems/different-ways-to-add-parentheses"
---

# Different Ways to Add Parentheses / Các Cách Thêm Ngoặc Đơn Khác Nhau

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Divide & Conquer / Interval DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Giống như bài toán cắt bánh — mỗi lần chọn một chỗ cắt (toán tử), chia đôi thành hai miếng nhỏ hơn rồi kết hợp tất cả kết quả của hai miếng đó.

**Pattern Recognition:**

- "All ways to compute" + operators between numbers → split at each operator
- Each operator is a "root" of an expression tree → left sub-expr × right sub-expr results
- Memoize substrings to avoid recomputing overlapping sub-expressions

**Visual ("2*3-4*5"):**

```
Split at *  (pos 1): [2] * [3-4*5]  → 2 * {-17,-5} = {-34,-10}
Split at -  (pos 3): [2*3] * [-5]   wait, it's [2*3] - [4*5]
                     {6} - {20}      = {-14}
Split at *  (pos 5): [2*3-4] * [5]
                     {2,-6} * 5      = {10,-30}

All results: {-34,-10,-14,10,-30}  → sorted: [-34,-14,-10,-30,10]
```

## Problem Description

Given a string `expression` of numbers and operators `+`, `-`, `*`, return **all possible results** from computing the expression by adding parentheses in different ways.

**Example 1:** `"2-1-1"` → `[0, 2]` (either `(2-1)-1=0` or `2-(1-1)=2`)
**Example 2:** `"2*3-4*5"` → `[-34,-14,-10,-10,10]`

**Constraints:** `1 <= expression.length <= 20`, digits 0-9, operators `+`, `-`, `*`

## 📝 Interview Tips

1. **Clarify**: Can numbers have multiple digits? Yes — parse carefully between operators.
2. **Approach**: For each operator, recursively compute all left & right sub-expression values; cross-combine.
3. **Edge cases**: Pure number (no operator) → return `[number]` as base case.
4. **Optimize**: Memoize by substring key to avoid recomputing overlapping subproblems.
5. **Follow-up**: Count only — use Catalan number formula for count of distinct groupings.
6. **Complexity**: O(n × Catalan(n)) time where n = number of operators; O(n × Catalan(n)) space.

## Solutions

```typescript
// Solution 1: Divide & Conquer with Memoization — Time: O(n·C(n)) | Space: O(n·C(n))
function diffWaysToCompute(expression: string): number[] {
  const memo = new Map<string, number[]>();

  function solve(expr: string): number[] {
    if (memo.has(expr)) return memo.get(expr)!;

    const results: number[] = [];

    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (c === "+" || c === "-" || c === "*") {
        const left = solve(expr.slice(0, i));
        const right = solve(expr.slice(i + 1));

        for (const l of left) {
          for (const r of right) {
            if (c === "+") results.push(l + r);
            else if (c === "-") results.push(l - r);
            else results.push(l * r);
          }
        }
      }
    }

    // Base case: pure number
    if (results.length === 0) results.push(parseInt(expr, 10));

    memo.set(expr, results);
    return results;
  }

  return solve(expression);
}

// Solution 2: Index-based DP on parsed tokens — Time: O(n·C(n)) | Space: O(n·C(n))
function diffWaysToCompute2(expression: string): number[] {
  // Parse into alternating [num, op, num, op, ..., num]
  const tokens: (number | string)[] = [];
  let i = 0;
  while (i < expression.length) {
    let num = 0;
    while (i < expression.length && expression[i] >= "0") {
      num = num * 10 + parseInt(expression[i++]);
    }
    tokens.push(num);
    if (i < expression.length) tokens.push(expression[i++]);
  }

  const nums = tokens.filter((_, idx) => idx % 2 === 0) as number[];
  const ops = tokens.filter((_, idx) => idx % 2 === 1) as string[];
  const m = nums.length;

  // dp[l][r] = all results from nums[l..r] using ops[l..r-1]
  const dp: number[][][] = Array.from({ length: m }, () => Array(m).fill(null));
  for (let j = 0; j < m; j++) dp[j][j] = [nums[j]];

  for (let len = 2; len <= m; len++) {
    for (let l = 0; l + len - 1 < m; l++) {
      const r = l + len - 1;
      dp[l][r] = [];
      for (let k = l; k < r; k++) {
        const op = ops[k];
        for (const lv of dp[l][k]) {
          for (const rv of dp[k + 1][r]) {
            if (op === "+") dp[l][r].push(lv + rv);
            else if (op === "-") dp[l][r].push(lv - rv);
            else dp[l][r].push(lv * rv);
          }
        }
      }
    }
  }

  return dp[0][m - 1];
}

// Tests
console.log(diffWaysToCompute("2-1-1").sort((a, b) => a - b)); // [0, 2]
console.log(diffWaysToCompute("2*3-4*5").sort((a, b) => a - b)); // [-34,-14,-10,-10,10]
console.log(diffWaysToCompute("1+2+3").sort((a, b) => a - b)); // [6,6,6] → actually [6,6,6]
console.log(diffWaysToCompute("5").sort((a, b) => a - b)); // [5]
console.log(diffWaysToCompute("3*2-1").sort((a, b) => a - b)); // [3, 5]
```

## 🔗 Related Problems

| Problem                                                                                       | Relationship                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/) | Same Catalan-number divide & conquer |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/)                               | Interval DP — split point selection  |
| [Strange Printer](https://leetcode.com/problems/strange-printer/)                             | Interval DP on string                |
