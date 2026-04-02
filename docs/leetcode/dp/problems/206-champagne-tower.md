---
layout: page
title: "Champagne Tower"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/champagne-tower"
---

# champagne tower

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hình dung một tháp ly rượu hình tam giác (hàng 0 có 1 ly, hàng 1 có 2 ly, ...). Đổ `poured` ly vào ly đầu tiên. Khi ly đầy (>1), phần dư tràn đều sang 2 ly bên dưới. Hỏi ly ở vị trí `(query_row, query_glass)` chứa bao nhiêu? (tối đa 1.0)

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
poured=2, query_row=1, query_glass=1

Row 0: [2.0]  → overflows 1.0 each side
Row 1: [1.0, 1.0]  → both full

Answer: min(1.0, tower[1][1]) = 1.0

Simulation:
  tower[r][c] pours excess to tower[r+1][c] and tower[r+1][c+1]
  excess = max(0, tower[r][c] - 1.0)
  each neighbor gets excess/2
```

**Key insight:** Simulate row by row. Each glass `(r, c)` can overflow, splitting equally to `(r+1, c)` and `(r+1, c+1)`. Answer is `min(1.0, tower[query_row][query_glass])`.

---

---

## Problem Description

Glasses in a champagne tower: row 0 has 1 glass, row `i` has `i+1`. Pour `poured` units into `(0,0)`. Full glass overflows equally to two below. Return how full glass `(query_row, query_glass)` is (0.0 to 1.0).

- Example: `poured=1, query_row=1, query_glass=1` → **0.0**
- Example: `poured=2, query_row=1, query_glass=1` → **0.5**
- Example: `poured=100000009, query_row=33, query_glass=17` → **1.0**

---

---

## 📝 Interview Tips

- 🎯 **Simulation, not formula**: iterate row by row, propagate overflow down
- 🎯 **Overflow rule**: `excess = max(0, tower[r][c] - 1); tower[r+1][c] += excess/2; tower[r+1][c+1] += excess/2`
- 🎯 **Only simulate to query_row**: stop early — no need to go further
- 🎯 **Cap at 1.0**: at the end, `min(1.0, tower[query_row][query_glass])`
- 🎯 **Space**: only need two rows at a time (current and next)
- 🎯 **Complexity**: O(query_row^2) time, O(query_row) space

---

---

## Solutions

```typescript
function champagneTower(poured: number, query_row: number, query_glass: number): number {
  // current[c] = amount of champagne in glass c on current row
  let current = [poured];

  for (let row = 0; row < query_row; row++) {
    const next = new Array(row + 2).fill(0);
    for (let c = 0; c <= row; c++) {
      if (current[c] > 1.0) {
        const overflow = (current[c] - 1.0) / 2;
        next[c] += overflow;
        next[c + 1] += overflow;
      }
    }
    current = next;
  }

  return Math.min(1.0, current[query_glass]);
}

function champagneTower2D(poured: number, query_row: number, query_glass: number): number {
  // tower[r][c] = amount poured into glass (r, c)
  const R = query_row + 1;
  const tower: number[][] = Array.from({ length: R + 1 }, (_, i) => new Array(i + 2).fill(0));
  tower[0][0] = poured;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c <= r; c++) {
      if (tower[r][c] > 1.0) {
        const overflow = (tower[r][c] - 1.0) / 2;
        tower[r + 1][c] += overflow;
        tower[r + 1][c + 1] += overflow;
      }
    }
  }

  return Math.min(1.0, tower[query_row][query_glass]);
}

function champagneTowerInPlace(poured: number, query_row: number, query_glass: number): number {
  // Build tower up to query_row
  const rows: number[][] = [[poured]];

  for (let r = 0; r < query_row; r++) {
    const prev = rows[r];
    const next: number[] = new Array(r + 2).fill(0);
    for (let c = 0; c < prev.length; c++) {
      const excess = Math.max(0, prev[c] - 1);
      next[c] += excess / 2;
      next[c + 1] += excess / 2;
    }
    rows.push(next);
  }

  return Math.min(1, rows[query_row][query_glass]);
}
```

---

## 🔗 Related Problems

| Problem                                                                            | Difficulty | Key Technique |
| ---------------------------------------------------------------------------------- | ---------- | ------------- |
| [118. Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/)          | Easy       | Triangle DP   |
| [119. Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii/)    | Easy       | Row-by-Row DP |
| [741. Cherry Pickup](https://leetcode.com/problems/cherry-pickup/)                 | Hard       | Grid DP       |
| [576. Out of Boundary Paths](https://leetcode.com/problems/out-of-boundary-paths/) | Medium     | Grid DP       |
