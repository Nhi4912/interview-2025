---
layout: page
title: "Score After Flipping Matrix"
difficulty: Medium
category: Array
tags: [Array, Greedy, Bit Manipulation, Matrix]
leetcode_url: "https://leetcode.com/problems/score-after-flipping-matrix"
---

# Score After Flipping Matrix / Điểm Sau Khi Lật Ma Trận

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Greedy / Bit Manipulation

## 🧠 Intuition / Tư Duy

**Như tối ưu hóa điểm nhị phân**: mỗi hàng là một số nhị phân. Bit cao nhất (cột 0) quan trọng nhất — luôn phải là 1. Sau đó tối đa hóa từng cột còn lại bằng cách đếm xem flip cột có lợi không.

**Pattern Recognition:**

- Greedy: luôn flip hàng sao cho cột 0 = 1 (MSB tối đa)
- Sau đó, với mỗi cột j: đếm số 1; nếu count < n/2 → flip cột đó
- Tính score: mỗi cột j đóng góp max(count1, n-count1) \* 2^(n-1-j)

**Visual:**

```
grid = [[0,0,1,1],[1,0,1,0],[1,1,0,0]]
Step 1 - flip rows where col[0]=0: row[0] → [1,1,0,0]
After: [[1,1,0,0],[1,0,1,0],[1,1,0,0]]
Step 2 - check each column:
  col1: 1,0,1 → 2 ones, n=3 → 2>1 → keep
  col2: 0,1,0 → 1 one  → 1<2 → flip → 1,0,1
  col3: 0,0,0 → 0 ones → 0<2 → flip → 1,1,1
Final: 1110+1001+1011 = 14+9+11 = 39
```

## Problem Description

Cho ma trận nhị phân `grid` m×n. Có thể flip bất kỳ hàng hoặc cột nào bất kỳ số lần. Score = tổng giá trị nhị phân của mỗi hàng. Tìm score **tối đa** có thể đạt được.

**Example 1:** `grid = [[0,0,1,1],[1,0,1,0],[1,1,0,0]]` → `39`
**Example 2:** `grid = [[0]]` → `1`

**Constraints:** `m == grid.length`, `n == grid[i].length`, `1 ≤ m,n ≤ 20`, `grid[i][j] ∈ {0,1}`

## 📝 Interview Tips

1. **Greedy key**: col[0] phải là 1 vì 2^(n-1) > sum(2^0..2^(n-2))
2. **Không cần thực sự flip**: chỉ cần tính contribution mỗi cột
3. **Row flip effect**: nếu row[0]=0, row sẽ bị flip → tất cả bit đảo
4. **Column j contribution**: max(count_ones_in_col_j, m - count_ones_in_col_j) \* 2^(n-1-j)
5. **Account for row flips**: khi đếm col j, xét hàng đã flip hay chưa (xem grid[i][0])
6. **O(mn) time**: duyệt một lần để tính tất cả

## Solutions

```typescript
// Solution 1: Greedy calculation (no actual flipping) — O(mn)
function matrixScore(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let ans = 0;

  for (let j = 0; j < n; j++) {
    let countOnes = 0;
    for (let i = 0; i < m; i++) {
      // If grid[i][0] === 0, this row was flipped → XOR bit with 1
      const bit = grid[i][j] ^ (grid[i][0] === 0 ? 1 : 0);
      countOnes += bit;
    }
    ans += Math.max(countOnes, m - countOnes) * (1 << (n - 1 - j));
  }
  return ans;
}

// Solution 2: Actually perform greedy flips, then compute
function matrixScoreV2(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  // Step 1: flip rows to make col[0] = 1
  for (let i = 0; i < m; i++) {
    if (grid[i][0] === 0) {
      for (let j = 0; j < n; j++) grid[i][j] ^= 1;
    }
  }
  // Step 2: for each col j > 0, flip if more 0s than 1s
  for (let j = 1; j < n; j++) {
    let countOnes = 0;
    for (let i = 0; i < m; i++) countOnes += grid[i][j];
    if (countOnes < m - countOnes) {
      // more zeros
      for (let i = 0; i < m; i++) grid[i][j] ^= 1;
    }
  }
  // Step 3: compute score
  let ans = 0;
  for (let i = 0; i < m; i++) {
    let rowVal = 0;
    for (let j = 0; j < n; j++) {
      rowVal = rowVal * 2 + grid[i][j];
    }
    ans += rowVal;
  }
  return ans;
}

// Tests
console.log(
  matrixScore([
    [0, 0, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
  ]),
); // 39
console.log(matrixScore([[0]])); // 1
console.log(
  matrixScoreV2([
    [0, 0, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
  ]),
); // 39
```

## 🔗 Related Problems

| Problem                                                 | Relationship           |
| ------------------------------------------------------- | ---------------------- |
| 1284 - Minimum Number of Flips to Convert Binary Matrix | Matrix flip operations |
| 2128 - Remove All Ones With Row and Column Flips        | Row/col flip pattern   |
| 861 - Score After Flipping Matrix                       | This problem           |
| 1529 - Minimum Suffix Flips                             | Greedy bit flip        |
