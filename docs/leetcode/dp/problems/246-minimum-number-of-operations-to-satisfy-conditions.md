---
layout: page
title: "Minimum Number of Operations to Satisfy Conditions"
difficulty: Medium
category: DP
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-satisfy-conditions"
---

# Minimum Number of Operations to Satisfy Conditions / Số Thao Tác Tối Thiểu Để Thỏa Điều Kiện

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: Column DP
> **Frequency**: 📗 Tier 2 — Gặp ở Google
> **See also**: [Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets) | [Paint House](https://leetcode.com/problems/paint-house)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một bảng màu sắc (0-9) cho mỗi ô trong lưới. Điều kiện: mỗi cột phải đồng nhất màu, và hai cột liền kề không được cùng màu. Bạn muốn thay đổi ít ô nhất. Giống như sơn cột đèn trên phố: mỗi cột đèn một màu, hai cột cạnh nhau phải khác màu. DP theo từng cột: `dp[col][color]` = chi phí tối thiểu để cột `col` có màu `color`, với transition lấy min từ tất cả màu khác của cột trước.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Number of Operations to Satisfy Conditions example:**

```
grid = [[1,2,3],[2,2,2],[1,2,2]]
       col0    col1    col2

Cost to make col j all color c = (rows - count of c in col j)

dp[0][c] = cost to make col0 all c:
  c=1: 3-1=2 changes, c=2: 3-1=2, c=3: 3-0=3... wait c=1: count=2→cost=1
  col0 values: [1,2,1] → c=1:cost=1, c=2:cost=2, c=3:cost=3, ...

dp[j][c] = colCost[j][c] + min over c'≠c of dp[j-1][c']

To speed up: track top-2 minimums of previous column

Answer: min over all c of dp[last_col][c]
```

---

## Problem Description

Given an `m × n` integer grid where `0 ≤ grid[i][j] ≤ 9`. In one operation, change any cell's value. Return the **minimum operations** to make:

1. All cells in each column have the same value
2. Adjacent columns have different values

**Example 1:** `grid = [[1,2,3],[2,2,2],[1,2,2]]` → `4`

**Example 2:** `grid = [[1,0,2],[1,0,2]]` → `0` (already satisfies conditions)

**Constraints:** `1 ≤ m, n ≤ 1000`, `0 ≤ grid[i][j] ≤ 9`

---

## 📝 Interview Tips

- **10 colors only** / Chỉ 10 màu: Giá trị 0-9 → dp chỉ có 10 states/cột — rất hiệu quả
- **Column cost precompute** / Tính trước chi phí: `colCost[j][c]` = số ô trong cột `j` không bằng `c`
- **Top-2 optimization** / Tối ưu top-2: Lưu 2 giá trị nhỏ nhất để transition O(1) thay vì O(10)
- **Constraint: adjacent differ** / Ràng buộc kề khác nhau: Chỉ cần `c' ≠ c` khi chuyển trạng thái
- **Total time** / Thời gian: O(m·n + n·100) = O(m·n) — tuyến tính theo kích thước grid
- **Space O(10)** / Không gian: Chỉ cần lưu dp của cột trước — O(10) = O(1)

---

## Solutions

```typescript
/**
 * @complexity Time: O(m·n + n·100) | Space: O(n·10)
 * dp[j][c] = min ops to make columns 0..j valid with col j = color c
 */
function minimumOperationsBasic(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  // precompute cost[j][c] = ops to make column j all color c
  const cost: number[][] = Array.from({ length: n }, (_, j) => {
    const freq = new Array(10).fill(0);
    for (let i = 0; i < m; i++) freq[grid[i][j]]++;
    return Array.from({ length: 10 }, (_, c) => m - freq[c]);
  });

  let dp = cost[0].slice(); // dp[c] = cost to make col0 = color c

  for (let j = 1; j < n; j++) {
    const ndp = new Array(10).fill(Infinity);
    for (let c = 0; c < 10; c++) {
      for (let pc = 0; pc < 10; pc++) {
        if (pc !== c) ndp[c] = Math.min(ndp[c], dp[pc] + cost[j][c]);
      }
    }
    dp = ndp;
  }

  return Math.min(...dp);
}

/**
 * @complexity Time: O(m·n) | Space: O(10) = O(1)
 * Track top-2 minimums of previous DP row for O(1) transition per cell
 */
function minimumOperations(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;

  let dp = new Array(10).fill(0);
  // Initialize with cost of column 0
  const freq0 = new Array(10).fill(0);
  for (let i = 0; i < m; i++) freq0[grid[i][0]]++;
  for (let c = 0; c < 10; c++) dp[c] = m - freq0[c];

  for (let j = 1; j < n; j++) {
    // Compute column frequency
    const freq = new Array(10).fill(0);
    for (let i = 0; i < m; i++) freq[grid[i][j]]++;

    // Find top-2 minimums in dp (and their indices)
    let min1 = Infinity,
      min2 = Infinity,
      minIdx = -1;
    for (let c = 0; c < 10; c++) {
      if (dp[c] < min1) {
        min2 = min1;
        min1 = dp[c];
        minIdx = c;
      } else if (dp[c] < min2) {
        min2 = dp[c];
      }
    }

    const ndp = new Array(10).fill(0);
    for (let c = 0; c < 10; c++) {
      const colCost = m - freq[c];
      // use min1 if c !== minIdx, else use min2
      const prevMin = c !== minIdx ? min1 : min2;
      ndp[c] = prevMin + colCost;
    }
    dp = ndp;
  }

  return Math.min(...dp);
}

// === Test Cases ===
console.log(minimumOperations([[1,2,3],[2,2,2],[1,2,2]]));  // → 4
console.log(minimumOperations([[1,0,2],[1,0,2]]));           // → 0
console.log(minimumOperations([[0]]));                        // → 0
console.log(minimumOperationsBasic([[1,2,3],[2,2,2],[1,2,2]])); // → 4
console.log(minimumOperations([[1,1],[1,1]]));                // → 1
```

---

## 🔗 Related Problems

| Problem                  | Difficulty | Link                                                             |
| ------------------------ | ---------- | ---------------------------------------------------------------- |
| Paint House              | Medium     | [LC 256](https://leetcode.com/problems/paint-house)              |
| Paint House II           | Hard       | [LC 265](https://leetcode.com/problems/paint-house-ii)           |
| Minimum Cost For Tickets | Medium     | [LC 983](https://leetcode.com/problems/minimum-cost-for-tickets) |
