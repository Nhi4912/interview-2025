---
layout: page
title: "Maximum Students Taking Exam"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Bit Manipulation, Matrix, Bitmask]
leetcode_url: "https://leetcode.com/problems/maximum-students-taking-exam"
---

# Maximum Students Taking Exam / Maximum Students Taking Exam

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) | [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như sắp xếp sinh viên trong phòng thi — không được ngồi cạnh nhau hoặc nhìn được bài nhau. Bitmask DP xử lý từng hàng ghế: mỗi bitmask đại diện cho ai ngồi ở hàng đó.

**Visual — seats 3×3, '.' valid '#' broken:**

```
Row 0: ['.','#','.']   valid masks for row: bits where '#' = 0
Row 1: ['.','.','.']   mask = 0b101 → students at col 0,2
Row 2: ['#','.','#']

For each row, valid placement mask must:
  1. Not place student on broken seat (mask & rowBroken == 0)
  2. No two adjacent students in same row (mask & (mask>>1) == 0)
  3. No student can see from prev row diagonal:
     - prev_mask & (mask>>1) == 0 (prev left-diag of curr)
     - prev_mask & (mask<<1) == 0 (prev right-diag of curr)

dp[row][mask] = max students placed in rows 0..row
               with row having seating pattern 'mask'
```

---

## Problem Description

Given an `m x n` matrix `seats` where `'.'` is an available seat and `'#'` is a broken one, place the maximum number of students such that **no two students can cheat** (no student in adjacent seats left/right, or diagonal seats in the next row). ([LeetCode](https://leetcode.com/problems/maximum-students-taking-exam))

Difficulty: Hard | Acceptance: 52.2%

**Example 1:**

```
Input: seats = [["#",".","#","#",".","#"],
                [".","#","#","#","#","."],
                ["#",".","#","#",".","#"]]
Output: 4
```

**Example 2:**

```
Input: seats = [[".","#"],["#","#"],["#","."],[".","#"],["#","."]]
Output: 3
```

Constraints:

- `m == seats.length`, `n == seats[i].length`
- `1 <= m, n <= 8`
- `seats[i][j]` is `'.'` or `'#'`

---

## 📝 Interview Tips

1. **Bitmask insight**: "Mỗi hàng có n ghế (n≤8), nên bitmask 2^n là khả thi — 256 states per row" / With n≤8, 2^n = 256 is manageable.
2. **Validity check**: "Mask hợp lệ nếu: không đặt trên ghế hỏng, không có hai bit liền kề" / Two conditions for valid row mask.
3. **Row transition**: "Hai hàng liền kề: mask[i] & (mask[i-1] >> 1) == 0 (không nhìn được chéo trái), tương tự chiều còn lại" / Diagonal conflict check.
4. **DP**: "dp[mask] = max students với hàng hiện tại có pattern mask, transition từ mọi prev valid mask" / O(m · 4^n) total.
5. **Count bits**: "Số sinh viên trong mask = popcount(mask)" / Use bit count for score.
6. **Edge cases**: "Tất cả ghế hỏng → 0, n=1 → mỗi hàng tối đa 1" / Degenerate cases.

---

## Solutions

```typescript
/**
 * Solution 1: Bitmask DP
 * Time: O(m · 4^n) — m rows, 2^n masks, 2^n transitions
 * Space: O(2^n) — rolling dp array
 */
function maxStudents(seats: string[][]): number {
  const m = seats.length;
  const n = seats[0].length;

  // Precompute: for each row, which columns are available (bit=1 means available)
  const rowMask: number[] = seats.map((row) =>
    row.reduce((acc, cell, j) => acc | (cell === "." ? 1 << j : 0), 0),
  );

  // dp[mask] = max students placed up to current row with current row pattern = mask
  let dp = new Array(1 << n).fill(-1);
  dp[0] = 0; // no students in first "virtual" row

  let ans = 0;

  for (let r = 0; r < m; r++) {
    const ndp = new Array(1 << n).fill(-1);
    const available = rowMask[r];

    for (let mask = 0; mask < 1 << n; mask++) {
      // Check if mask is valid for this row:
      // 1. Only place on available seats
      if ((mask & available) !== mask) continue;
      // 2. No two adjacent students
      if (mask & (mask >> 1)) continue;

      // Try all previous row masks
      for (let prev = 0; prev < 1 << n; prev++) {
        if (dp[prev] === -1) continue;
        // 3. No diagonal cheating: mask can't have a student where prev has diagonal neighbor
        if (mask & (prev >> 1)) continue; // prev's student at j, curr at j-1
        if (mask & (prev << 1)) continue; // prev's student at j, curr at j+1

        const students = dp[prev] + countBits(mask);
        if (students > ndp[mask]) ndp[mask] = students;
      }
    }

    dp = ndp;
    ans = Math.max(ans, ...dp.filter((x) => x >= 0));
  }

  return ans;
}

function countBits(n: number): number {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// === Test Cases ===
console.log(
  maxStudents([
    ["#", ".", "#", "#", ".", "#"],
    [".", "#", "#", "#", "#", "."],
    ["#", ".", "#", "#", ".", "#"],
  ]),
); // 4

console.log(
  maxStudents([
    [".", "#"],
    ["#", "#"],
    ["#", "."],
    [".", "#"],
    ["#", "."],
  ]),
); // 3

console.log(
  maxStudents([
    [".", "."],
    [".", "."],
  ]),
); // 3
console.log(maxStudents([["#"]])); // 0
```
