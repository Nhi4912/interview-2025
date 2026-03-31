---
layout: page
title: "Maximal Rectangle"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Stack, Matrix, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/maximal-rectangle"
---

# Maximal Rectangle / Hình Chữ Nhật Lớn Nhất

> **Track**: DP + Stack | **Difficulty**: 🔴 Hard | **Pattern**: Histogram + Monotonic Stack
> **Frequency**: 📕 Tier 2 — Gặp ở 30+ companies (Amazon, Google, Microsoft)
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang xây tường gạch — mỗi hàng ngang là một "đáy" của hình chữ nhật. Với mỗi ô `'1'`, chiều cao của cột đó tăng thêm 1. Sau khi xây xong mỗi hàng, bài toán trở thành "Largest Rectangle in Histogram" cho hàng đó.

**Pattern Recognition:**

- Signal: "ma trận nhị phân, tìm hình chữ nhật lớn nhất" → **Histogram DP per row**
- Dựng mảng `heights[j]`: chiều cao cột j tính từ hàng hiện tại trở lên liên tiếp
- Mỗi hàng → dùng **Monotonic Stack** để tìm largest rectangle trong O(m)

**Visual — matrix rows processed as histograms:**

```
Matrix:                  Heights after each row:
1 0 1 0 0              row0: [1,0,1,0,0]  → max=1
1 0 1 1 1              row1: [2,0,2,1,1]  → max=3
1 1 1 1 1              row2: [3,1,3,2,2]  → max=6 ✅
1 0 0 1 0              row3: [4,0,0,3,0]  → max=4

Heights at row2: 3 1 3 2 2
Stack-based largest rect → width=5,h=1 OR w=2,h=2 OR w=1,h=3 → area=6
```

---

## Problem Description

Given a binary matrix filled with `'0'`s and `'1'`s, find the largest rectangle containing only `'1'`s and return its area. The rectangle sides must be axis-aligned.

```
Example 1: matrix=[["1","0","1","0","0"],["1","0","1","1","1"],
                   ["1","1","1","1","1"],["1","0","0","1","0"]] → 6
Example 2: matrix=[["0"]] → 0
Example 3: matrix=[["1","1"]] → 2
```

Constraints: `1 <= rows, cols <= 200`, `matrix[i][j]` is `'0'` or `'1'`

---

## 📝 Interview Tips

1. **Clarify**: "Matrix có toàn 0 không?" / Confirm empty matrix or all-zero handling.
2. **Key Insight**: Reduce to "Largest Rectangle in Histogram" per row — mỗi hàng tạo histogram.
3. **Heights update**: `heights[j] = matrix[i][j]==='1' ? heights[j]+1 : 0` — reset on '0'.
4. **Monotonic Stack**: Dùng stack tăng dần — khi gặp bar thấp hơn, pop và tính diện tích.
5. **Area formula**: `height = heights[popped]`, `width = stack empty ? i : i - stack.top - 1`.
6. **Brute vs Optimal**: Brute O(n²m²) → Histogram O(nm) — mention trade-off upfront.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all top-left/bottom-right rectangle pairs
 * Time: O(n²m²) — O(nm) top-left corners × O(nm) expansions
 * Space: O(1)
 */
function maximalRectangle1(matrix: string[][]): number {
  if (!matrix.length || !matrix[0].length) return 0;
  const n = matrix.length,
    m = matrix[0].length;
  let ans = 0;

  for (let r1 = 0; r1 < n; r1++) {
    for (let c1 = 0; c1 < m; c1++) {
      if (matrix[r1][c1] === "0") continue;
      let minWidth = m;
      for (let r2 = r1; r2 < n; r2++) {
        let width = 0;
        while (c1 + width < m && matrix[r2][c1 + width] === "1") width++;
        minWidth = Math.min(minWidth, width);
        if (minWidth === 0) break;
        ans = Math.max(ans, minWidth * (r2 - r1 + 1));
      }
    }
  }
  return ans;
}

/**
 * Solution 2: Heights Histogram + Monotonic Stack (Optimal)
 * Time: O(nm) — O(m) per row for histogram processing, n rows total
 * Space: O(m) — heights array + monotonic stack
 *
 * Key insight: for each row i, heights[j] = consecutive '1's ending at row i in column j.
 * Then solve "Largest Rectangle in Histogram" using monotonic stack in O(m).
 * Stack stores bar indices in increasing height order.
 * When a shorter bar is found, pop and compute area with popped height as the limiting height.
 */
function maximalRectangle(matrix: string[][]): number {
  if (!matrix.length || !matrix[0].length) return 0;
  const n = matrix.length,
    m = matrix[0].length;
  const heights = new Array(m).fill(0);
  let ans = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      heights[j] = matrix[i][j] === "1" ? heights[j] + 1 : 0;
    }
    ans = Math.max(ans, largestRectInHistogram(heights));
  }
  return ans;
}

function largestRectInHistogram(heights: number[]): number {
  const stack: number[] = []; // indices, monotonically increasing heights
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const cur = i === n ? 0 : heights[i];
    while (stack.length > 0 && cur < heights[stack[stack.length - 1]]) {
      const h = heights[stack.pop()!];
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}

// === Test Cases ===
const m1 = [
  ["1", "0", "1", "0", "0"],
  ["1", "0", "1", "1", "1"],
  ["1", "1", "1", "1", "1"],
  ["1", "0", "0", "1", "0"],
];
console.log(maximalRectangle(m1)); // 6
console.log(maximalRectangle([["0"]])); // 0
console.log(maximalRectangle([["1"]])); // 1
console.log(
  maximalRectangle([
    ["1", "1"],
    ["1", "1"],
  ]),
); // 4
console.log(maximalRectangle1(m1)); // 6 (brute force verify)
```

---

## 🔗 Related Problems

| Problem                                                                                                 | Relationship                                  |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)     | Core sub-problem used per row                 |
| [221. Maximal Square](https://leetcode.com/problems/maximal-square/)                                    | Same matrix, square constraint, pure DP O(nm) |
| [85. Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/)                               | This problem                                  |
| [1504. Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones/) | Count variant of same pattern                 |
| [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)                           | Monotonic stack on 1D array                   |
