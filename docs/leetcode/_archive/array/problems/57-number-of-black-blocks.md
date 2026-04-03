---
layout: page
title: "Number of Black Blocks"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Enumeration]
leetcode_url: "https://leetcode.com/problems/number-of-black-blocks"
---

# Number of Black Blocks / Số Khối Đen

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm ô cờ — mỗi ô đen ảnh hưởng đến tối đa 4 khối 2×2 lân cận. Thay vì duyệt toàn bộ lưới khổng lồ O(m×n), chỉ cần đếm các khối có ít nhất 1 ô đen qua hash map.

**Pattern Recognition:**

- Signal: "sparse black cells in huge grid, count 2×2 blocks" → **Hash Map** (only visit affected blocks)
- Key insight: mỗi cell (r,c) đóng góp cho 4 blocks có top-left ở (r-1,c-1), (r-1,c), (r,c-1), (r,c)
- Blocks với 0 ô đen = tổng blocks - số blocks trong map

**Visual — Contribution of one black cell:**

```
Black cell at (r,c):
  Block top-lefts it contributes to:
  (r-1,c-1) (r-1,c)
  ( r , c-1) ( r ,c)   ← 4 possible blocks (if in bounds)

cnt[block] = number of black cells in that 2×2 block
ans[0] = total 2×2 blocks - len(map)
ans[1..4] = count of blocks with exactly 1..4 black cells
```

---

## Problem Description

Given an `m×n` grid (all white) and coordinates of black cells, for each `k` in `[0,4]`, count the number of 2×2 blocks containing exactly `k` black cells. Return a length-5 array. ([LeetCode](https://leetcode.com/problems/number-of-black-blocks))

Difficulty: Medium | Acceptance: 38.6%

- Example 1: `m=3, n=3, coordinates=[[0,0]]` → `[3,1,0,0,0]`
- Example 2: `m=3, n=3, coordinates=[[0,0],[1,1],[0,2]]` → `[0,2,1,0,0]`

Constraints: `2 ≤ m, n ≤ 10^5`, `0 ≤ coordinates.length ≤ 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Lưới có thể rất lớn (10^5 × 10^5), không thể allocate ma trận" / Grid can be huge, cannot allocate full matrix
2. **Key insight**: "Mỗi ô đen ảnh hưởng ≤ 4 khối → chỉ track các khối bị ảnh hưởng" / Each black cell affects at most 4 blocks
3. **Hash map key**: "Dùng string 'r,c' hoặc r \* n + c làm key cho top-left corner" / Encode block position as key
4. **Count zeros**: "ans[0] = (m-1)\*(n-1) - số khối trong map" / Zero-black blocks = total blocks minus map size
5. **Edge cases**: "Coordinates trùng nhau? Xử lý duplicate nếu có" / Handle duplicate coordinates
6. **Follow-up**: "Nếu cần update real-time → Union Find hoặc Fenwick Tree" / For online updates use UF or BIT

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (only feasible for small grids)
 * Time: O(m·n) — scan every possible 2×2 block
 * Space: O(m·n) — grid storage
 */
function countBlackBlocksBrute(m: number, n: number, coordinates: number[][]): number[] {
  const grid = new Set(coordinates.map(([r, c]) => `${r},${c}`));
  const ans = new Array(5).fill(0);
  for (let r = 0; r <= m - 2; r++) {
    for (let c = 0; c <= n - 2; c++) {
      let cnt = 0;
      for (const [dr, dc] of [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ])
        if (grid.has(`${r + dr},${c + dc}`)) cnt++;
      ans[cnt]++;
    }
  }
  return ans;
}

/**
 * Solution 2: Hash Map — count affected blocks only
 * Time: O(k) — k = number of black cells (each affects ≤4 blocks)
 * Space: O(k) — hash map stores ≤4k block entries
 */
function countBlackBlocks(m: number, n: number, coordinates: number[][]): number[] {
  // blockCnt[key] = number of black cells in the 2×2 block with top-left at (r,c)
  const blockCnt = new Map<string, number>();

  for (const [r, c] of coordinates) {
    // Each black cell contributes to up to 4 blocks
    for (const [dr, dc] of [
      [-1, -1],
      [-1, 0],
      [0, -1],
      [0, 0],
    ]) {
      const br = r + dr,
        bc = c + dc;
      if (br >= 0 && br <= m - 2 && bc >= 0 && bc <= n - 2) {
        const key = `${br},${bc}`;
        blockCnt.set(key, (blockCnt.get(key) ?? 0) + 1);
      }
    }
  }

  const ans = new Array(5).fill(0);
  for (const cnt of blockCnt.values()) ans[cnt]++;

  // Blocks with 0 black cells = total blocks - blocks tracked in map
  const totalBlocks = (m - 1) * (n - 1);
  ans[0] = totalBlocks - blockCnt.size;

  return ans;
}

// === Test Cases ===
console.log(countBlackBlocks(3, 3, [[0, 0]])); // [3,1,0,0,0]
console.log(
  countBlackBlocks(3, 3, [
    [0, 0],
    [1, 1],
    [0, 2],
  ]),
); // [0,2,1,0,0]
console.log(
  countBlackBlocks(2, 2, [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]),
); // [0,0,0,0,1]
console.log(countBlackBlocks(4, 4, [])); // [9,0,0,0,0]
```

---

## 🔗 Related Problems

- [Count Lattice Points Inside a Circle](https://leetcode.com/problems/count-lattice-points-inside-a-circle) — enumerate cells affected by each point
- [Number of Islands](https://leetcode.com/problems/number-of-islands) — grid connectivity counting
- [Game of Life](https://leetcode.com/problems/game-of-life) — each cell influences neighbors
- [Design HashMap](https://leetcode.com/problems/design-hashmap) — hash map fundamentals
- [Count Sub Islands](https://leetcode.com/problems/count-sub-islands) — 2D grid enumeration
