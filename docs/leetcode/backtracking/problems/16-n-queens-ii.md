---
layout: page
title: "N-Queens II"
difficulty: Hard
category: Backtracking
tags: [Backtracking]
leetcode_url: "https://leetcode.com/problems/n-queens-ii"
---

# N-Queens II / Đếm Số Cách Xếp N Hậu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [N-Queens](https://leetcode.com/problems/n-queens) | [Grid Illumination](https://leetcode.com/problems/grid-illumination)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi hàng chỉ đặt được 1 quân hậu — xem như chọn cột cho từng hàng. Ba loại tấn công cần kiểm tra: cùng cột, đường chéo chính (`row - col = const`), đường chéo phụ (`row + col = const`).

**Pattern Recognition:**

- Đặt 1 phần tử mỗi hàng → iterate rows, backtrack on columns
- Dùng bitmask hoặc sets để O(1) conflict check thay vì O(n) scan

```
n=4, row=0: try cols 0,1,2,3
  col=1 → row=1: try cols 0,2,3 (col 1 blocked, diag 0, anti-diag 2)
    col=3 → row=2: no valid col → backtrack
  col=2 → row=1: try cols 0 (col 2,diag 1,anti-diag 3 blocked)
    col=0 → row=2: try col 3
      col=3 → row=3: try col 1 → ✓ solution!
Total: 2
```

---

## Problem Description

The **n-queens** puzzle places `n` queens on an `n×n` board so no two attack each other. Return the **number of distinct solutions**.

**Example 1:**

```
Input: n=4
Output: 2
Explanation: Two valid placements exist for a 4x4 board
```

**Example 2:**

```
Input: n=1
Output: 1
```

**Constraints:** `1 ≤ n ≤ 9`

---

## 📝 Interview Tips

- 🇻🇳 **Ba loại attack**: cùng cột, chéo trái-phải (`row-col`), chéo phải-trái (`row+col`) — dùng Set để O(1) check
- 🇬🇧 Track three conflict sets: `cols`, `diag1` (row-col), `diag2` (row+col) for O(1) validation
- 🇻🇳 **Bitmask** phiên bản nhanh hơn: 3 integers thay Set, bitwise ops cho state
- 🇬🇧 Bitmask approach: `cols | diag1 | diag2` shows all attacked positions in O(1)
- 🇻🇳 Chỉ cần **đếm** (không cần lưu board) → simpler than N-Queens I
- 🇬🇧 Counting only (not reconstructing) removes the O(n²) board copy overhead

---

## Solutions

### Solution 1: Backtracking with Sets

```typescript
/**
 * Count distinct N-Queens solutions
 * @param {number} n - board dimension
 * @returns {number} count of valid placements
 * Time: O(n!) — at most n! arrangements, pruned heavily
 * Space: O(n) — recursion depth + three sets of size O(n)
 */
function totalNQueens(n: number): number {
  let count = 0;
  const cols = new Set<number>();
  const diag1 = new Set<number>(); // row - col (top-left to bottom-right)
  const diag2 = new Set<number>(); // row + col (top-right to bottom-left)

  function backtrack(row: number): void {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      backtrack(row + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return count;
}

console.log(totalNQueens(4)); // 2
console.log(totalNQueens(1)); // 1
console.log(totalNQueens(8)); // 92
```

### Solution 2: Bitmask Backtracking (Fastest)

```typescript
/**
 * Bitmask N-Queens — all conflict checks are bitwise operations
 * Time: O(n!) with strong pruning
 * Space: O(n) recursion depth
 */
function totalNQueensBitmask(n: number): number {
  const full = (1 << n) - 1; // all n columns occupied
  let count = 0;

  function backtrack(cols: number, diag1: number, diag2: number): void {
    if (cols === full) {
      count++;
      return;
    }
    // Available positions: columns not attacked by any queen
    let available = full & ~(cols | diag1 | diag2);
    while (available) {
      const pos = available & -available; // lowest set bit = rightmost free col
      available &= available - 1; // remove that bit
      backtrack(
        cols | pos,
        (diag1 | pos) << 1, // shift left for next row
        (diag2 | pos) >> 1, // shift right for next row
      );
    }
  }

  backtrack(0, 0, 0);
  return count;
}

console.log(totalNQueensBitmask(4)); // 2
console.log(totalNQueensBitmask(9)); // 352
```

---

## 🔗 Related Problems

- [52. N-Queens II](https://leetcode.com/problems/n-queens-ii) ← this
- [51. N-Queens](https://leetcode.com/problems/n-queens) — return the actual boards
- [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver) — same constraint-grid backtracking
- [1001. Grid Illumination](https://leetcode.com/problems/grid-illumination) — diagonal tracking
- [46. Permutations](https://leetcode.com/problems/permutations) — foundational backtracking
