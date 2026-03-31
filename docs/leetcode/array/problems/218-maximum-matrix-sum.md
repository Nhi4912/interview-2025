---
layout: page
title: "Maximum Matrix Sum"
difficulty: Medium
category: Array
tags: [Array, Greedy, Matrix]
leetcode_url: "https://leetcode.com/problems/maximum-matrix-sum"
---

# Maximum Matrix Sum / Tổng Ma Trận Lớn Nhất

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Greedy / Parity of Negatives

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như đổi dấu các tờ tiền âm trong ví — bạn có thể nhân đôi hai ô liền kề với -1 bất kỳ lúc nào. Nếu số lượng âm là chẵn → đổi hết về dương. Nếu lẻ → ít nhất một âm còn lại, để nó là số nhỏ nhất.

**Pattern Recognition:**

- Even number of negatives → all can become positive (flip pairs)
- Odd number of negatives → one negative remains — make it the smallest absolute value
- Sum = total of abs values - 2 × min(|v|) if odd negatives

**Visual:**

```
matrix = [[1,-1],[-1,1]]
negatives = 2 (even)
abs values = [1,1,1,1], sum = 4
Even negatives → return 4

matrix = [[1,2,3],[-1,2,3],[1,2,-3]]
negatives = 2 (even), wait:
negatives: -1, -3 → 2 (even)
abs sum = 1+2+3+1+2+3+1+2+3 = 18 → return 18

matrix = [[-1,-2],[-3,-4]]
negatives = 4 (even) → abs sum = 10 → return 10
```

## Problem Description

Given an `n × n` integer matrix, you may choose any two adjacent cells (horizontally or vertically) and multiply both by `-1`. Do this as many times as you want. Return the maximum possible sum of all matrix elements.

**Example 1:** `matrix = [[1,-1],[-1,1]]` → `4`
**Example 2:** `matrix = [[-1,1,-1],[1,-1,1],[-1,1,-1]]` → `7` (one -1 can't be flipped)

**Constraints:** `1 ≤ n ≤ 250`, `-10^5 ≤ matrix[i][j] ≤ 10^5`

## 📝 Interview Tips

1. **Clarify**: Can you flip the same pair multiple times? (Yes, but it's equivalent to flipping or not)
2. **Approach**: Count negatives; if even → sum of absolute values; if odd → subtract 2 × min(|v|)
3. **Edge cases**: All positive, all negative, single element
4. **Optimize**: Single pass for abs sum, neg count, and min abs value
5. **Follow-up**: What if you can only flip k times?
6. **Complexity**: Time O(n²), Space O(1)

## Solutions

```typescript
// Solution 1: Greedy parity approach — Time: O(n^2) | Space: O(1)
function maxMatrixSum(matrix: number[][]): number {
  const n = matrix.length;
  let totalAbsSum = 0;
  let negCount = 0;
  let minAbs = Infinity;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const val = matrix[i][j];
      totalAbsSum += Math.abs(val);
      if (val < 0) negCount++;
      minAbs = Math.min(minAbs, Math.abs(val));
    }
  }

  // If even negatives → all become positive
  // If odd negatives → one minimum abs must remain negative
  if (negCount % 2 === 0) {
    return totalAbsSum;
  } else {
    return totalAbsSum - 2 * minAbs;
  }
}

// Solution 2: Flattened array — Time: O(n^2) | Space: O(1)
function maxMatrixSum2(matrix: number[][]): number {
  let sum = 0,
    negs = 0,
    minAbs = Infinity;

  for (const row of matrix) {
    for (const v of row) {
      sum += Math.abs(v);
      if (v < 0) negs++;
      if (Math.abs(v) < minAbs) minAbs = Math.abs(v);
    }
  }

  return negs % 2 === 0 ? sum : sum - 2 * minAbs;
}

// Solution 3: One-liner reduce — Time: O(n^2) | Space: O(1)
function maxMatrixSum3(matrix: number[][]): number {
  const flat = matrix.flat();
  const absSum = flat.reduce((s, v) => s + Math.abs(v), 0);
  const negs = flat.filter((v) => v < 0).length;
  const minAbs = Math.min(...flat.map(Math.abs));
  return negs % 2 === 0 ? absSum : absSum - 2 * minAbs;
}

// Tests
console.log(
  maxMatrixSum([
    [1, -1],
    [-1, 1],
  ]),
); // 4
console.log(
  maxMatrixSum([
    [-1, 1, -1],
    [1, -1, 1],
    [-1, 1, -1],
  ]),
); // 7
console.log(
  maxMatrixSum([
    [1, 2, 3],
    [-1, -2, -3],
    [1, 2, 3],
  ]),
); // 18
console.log(
  maxMatrixSum2([
    [1, -1],
    [-1, 1],
  ]),
); // 4
console.log(maxMatrixSum3([[-3]])); // -3 (single odd-neg)
```

## 🔗 Related Problems

| Problem                                                                                                                         | Relationship                       |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Maximum Product of Two Elements (LeetCode 1464)](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/)   | Greedy selection for maximum value |
| [Minimum Operations to Make Array Equal (LeetCode 1551)](https://leetcode.com/problems/minimum-operations-to-make-array-equal/) | Matrix modification for target sum |
| [Score After Flipping Matrix (LeetCode 861)](https://leetcode.com/problems/score-after-flipping-matrix/)                        | Matrix row/col flip for max sum    |
