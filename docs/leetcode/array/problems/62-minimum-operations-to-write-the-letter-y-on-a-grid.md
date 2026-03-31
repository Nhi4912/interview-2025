---
layout: page
title: "Minimum Operations to Write the Letter Y on a Grid"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-write-the-letter-y-on-a-grid"
---

# Minimum Operations to Write the Letter Y on a Grid / Tối Thiểu Thao Tác Vẽ Chữ Y

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Counting / Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán làm đồng phục — chia học sinh thành 2 nhóm (trong Y và ngoài Y), mỗi nhóm cùng màu áo, hai nhóm khác màu. Thử tất cả 3×2=6 cặp màu, chọn cặp có chi phí thấp nhất.

**Pattern Recognition:**

- Signal: "partition grid into 2 groups, minimize changes to same value in each" → **Frequency Count + Enumeration**
- Xác định tập Y: đường chéo trái, đường chéo phải (hàng 0..n/2), cột giữa (hàng n/2..n-1)
- Key insight: đếm tần suất {0,1,2} trong Y và ngoài Y, thử tất cả cặp (v1≠v2)

**Visual — Y pattern on 5×5 grid:**

```
n=5, mid=2
Y cells (marked *):
* . . . *    row 0: (0,0) left-diag, (0,4) right-diag
. * . * .    row 1: (1,1), (1,3)
. . * . .    row 2: (2,2) center (junction)
. . * . .    row 3: (3,2) vertical stem
. . * . .    row 4: (4,2) vertical stem

Cost = (|Y| - yCount[v1]) + (|nonY| - nonYCount[v2])
Try all (v1,v2) pairs with v1 ≠ v2
```

---

## Problem Description

Given an `n×n` grid (n odd) with values 0, 1, or 2, find the minimum operations to make all **Y cells** one value and all **non-Y cells** another (different) value. Y = top-left diagonal + top-right diagonal (rows 0 to n/2) + vertical center (rows n/2 to n-1). ([LeetCode](https://leetcode.com/problems/minimum-operations-to-write-the-letter-y-on-a-grid))

Difficulty: Medium | Acceptance: 61.9%

- Example 1: `grid=[[1,2,2],[1,1,0],[0,0,0]]` → `3`
- Example 2: `grid=[[0,1,0,1,0],[2,1,0,1,2],[2,2,2,0,1],[2,2,0,1,2],[2,1,0,1,2]]` → `12`

Constraints: `3 ≤ n ≤ 49`, `n` is odd, `grid[i][j] ∈ {0,1,2}`

---

## 📝 Interview Tips

1. **Clarify**: "n luôn lẻ? Phạm vi giá trị là {0,1,2}?" / Confirm n is always odd and values are in {0,1,2}
2. **Identify Y**: "Đường chéo trái: j==i, phải: j==n-1-i (hàng ≤ mid), dọc: j==mid (hàng ≥ mid)" / Three conditions for Y membership
3. **Corner case**: "Điểm giao nhau (mid, mid) thuộc Y — đảm bảo không đếm trùng" / Junction cell (mid,mid) is in all three arms, don't double-count
4. **Enumerate**: "6 cặp (v1,v2) với v1≠v2, mỗi cặp tính chi phí O(n²)" / Try all 6 valid (v1,v2) pairs
5. **Cost formula**: "Chi phí = (|Y| - yCount[v1]) + (|nonY| - nonYCount[v2])" / Operations = total cells minus already-correct cells
6. **Follow-up**: "Nếu giá trị không giới hạn → sắp xếp theo tần suất, chọn mode" / Unbounded values: pick most frequent for each partition

---

## Solutions

```typescript
/**
 * Solution 1: Explicit Y-check per cell (clear but same complexity)
 * Time: O(n²) — scan every cell
 * Space: O(1) — only 6 counters
 */
function minimumOperationsToWriteYOnGridBrute(grid: number[][]): number {
  const n = grid.length,
    mid = Math.floor(n / 2);
  const yCount = [0, 0, 0],
    nonYCount = [0, 0, 0];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const onY = (i <= mid && j === i) || (i <= mid && j === n - 1 - i) || (i >= mid && j === mid);
      (onY ? yCount : nonYCount)[grid[i][j]]++;
    }
  }

  const yTotal = yCount[0] + yCount[1] + yCount[2];
  const nonYTotal = nonYCount[0] + nonYCount[1] + nonYCount[2];
  let minOps = Infinity;

  for (let v1 = 0; v1 < 3; v1++) {
    for (let v2 = 0; v2 < 3; v2++) {
      if (v1 === v2) continue;
      minOps = Math.min(minOps, yTotal - yCount[v1] + (nonYTotal - nonYCount[v2]));
    }
  }
  return minOps;
}

/**
 * Solution 2: Count + Enumerate — same O(n²) but more explicit enumeration
 * Time: O(n²) — one pass to count, 6 pair comparisons
 * Space: O(1) — fixed-size frequency arrays (3 values)
 */
function minimumOperationsToWriteYOnGrid(grid: number[][]): number {
  const n = grid.length,
    mid = Math.floor(n / 2);
  const yCount = [0, 0, 0];
  const nonYCount = [0, 0, 0];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const val = grid[i][j];
      // Y: left diagonal, right diagonal (top half), vertical center (bottom half)
      if ((i <= mid && j === i) || (i <= mid && j === n - 1 - i) || (i >= mid && j === mid)) {
        yCount[val]++;
      } else {
        nonYCount[val]++;
      }
    }
  }

  const yTotal = yCount.reduce((s, v) => s + v, 0);
  const nonYTotal = nonYCount.reduce((s, v) => s + v, 0);

  let minOps = Infinity;
  // Try all pairs (v1, v2) where v1 is the Y-value and v2 is the non-Y value
  for (let v1 = 0; v1 < 3; v1++) {
    for (let v2 = 0; v2 < 3; v2++) {
      if (v1 === v2) continue; // Y and non-Y must be different values
      const ops = yTotal - yCount[v1] + (nonYTotal - nonYCount[v2]);
      minOps = Math.min(minOps, ops);
    }
  }

  return minOps;
}

// === Test Cases ===
console.log(
  minimumOperationsToWriteYOnGrid([
    [1, 2, 2],
    [1, 1, 0],
    [0, 0, 0],
  ]),
); // 3
console.log(
  minimumOperationsToWriteYOnGrid([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
); // 0
console.log(
  minimumOperationsToWriteYOnGrid([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // depends on non-Y
console.log(
  minimumOperationsToWriteYOnGrid([
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2],
  ]),
); // similar
```

---

## 🔗 Related Problems

- [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous) — minimize changes to meet condition
- [Majority Element](https://leetcode.com/problems/majority-element) — frequency counting
- [Minimum Cost to Set Cooking Time](https://leetcode.com/problems/minimum-cost-to-set-cooking-time) — enumerate small state space
- [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60) — frequency counting with constraint
- [Minimum Cost to Move Chips to Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-same-position) — partition + min-cost enumeration
