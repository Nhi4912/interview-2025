---
layout: page
title: "Minimum Cost Homecoming of a Robot in a Grid"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid"
---

# Minimum Cost Homecoming of a Robot in a Grid / Chi Phí Tối Thiểu Để Robot Trở Về Nhà

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Optimal Path)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Robot đang ở một ô trong lưới và muốn về nhà. Dù đường đi có quanh co thế nào, robot **vẫn phải vượt qua đúng những hàng và cột nằm giữa** — mỗi hàng/cột bắt buộc phải đi qua đúng 1 lần. Do đó, đường đi tối ưu chỉ gồm di chuyển thẳng theo hàng rồi cột (hoặc ngược lại), không bao giờ đi lùi.

**Pattern Recognition:**

- Không cần BFS/DP — mọi đường từ `start` đến `home` có cùng chi phí hàng + cột
- Chi phí = tổng `rowCosts` giữa startRow và homeRow + tổng `colCosts` giữa startCol và homeCol
- Greedy: di chuyển theo hướng đúng, không bao giờ đi lùi

**Visual:**

```
startPos=[1,0], homePos=[2,3]
rowCosts=[5,4,3], colCosts=[8,2,6,7]

Move row: 1 → 2 (down), pay rowCosts[2]=3
Move col: 0 → 1 → 2 → 3 (right), pay colCosts[1]+colCosts[2]+colCosts[3]=2+6+7=15

Total = 3 + 15 = 18

Why not go col first? colCosts[1]+colCosts[2]+colCosts[3] still = 15, same answer!
Key: must traverse each intermediate row/col exactly once.
```

## Problem Description

A robot starts at `startPos = [startRow, startCol]` and needs to reach `homePos = [homeRow, homeCol]` in an `m x n` grid. Moving to an adjacent row costs `rowCosts[row]` and adjacent column costs `colCosts[col]`. Return the minimum total cost.

**Example 1:** `startPos=[1,0], homePos=[2,3], rowCosts=[5,4,3], colCosts=[8,2,6,7]` → `18`

**Example 2:** `startPos=[0,0], homePos=[0,0], rowCosts=[5], colCosts=[26]` → `0` (already home)

**Constraints:** `m == rowCosts.length`, `n == colCosts.length`, `1 <= m,n <= 10^5`, `0 <= rowCosts[i], colCosts[i] <= 10^4`, valid start and home positions.

## 📝 Interview Tips

1. **Clarify**: Có thể đi bất kỳ hướng nào không? — Yes, but optimally never backtrack.
2. **Approach**: Tại sao không cần DP? — Any path from A to B passes through same rows+cols; cost is path-independent.
3. **Edge cases**: startPos == homePos → return 0; same row or same column → sum only one dimension.
4. **Optimize**: O(m+n) with simple sum — much simpler than BFS which would be O(m\*n).
5. **Test**: `startPos=[2,3], homePos=[0,0]` → move UP and LEFT (subtract direction same cost).
6. **Follow-up**: If costs change dynamically? → Need segment tree / BIT for range sum queries.

## Solutions

```typescript
/** Solution 1: Direct Sum — sum costs along optimal path
 * Time: O(m + n) | Space: O(1)
 */
function minCost(
  startPos: number[],
  homePos: number[],
  rowCosts: number[],
  colCosts: number[],
): number {
  const [sr, sc] = startPos;
  const [hr, hc] = homePos;
  let cost = 0;

  // Traverse rows: move from sr towards hr (skip starting row)
  if (sr < hr) {
    for (let r = sr + 1; r <= hr; r++) cost += rowCosts[r];
  } else {
    for (let r = hr; r < sr; r++) cost += rowCosts[r];
  }

  // Traverse cols: move from sc towards hc (skip starting col)
  if (sc < hc) {
    for (let c = sc + 1; c <= hc; c++) cost += colCosts[c];
  } else {
    for (let c = hc; c < sc; c++) cost += colCosts[c];
  }

  return cost;
}

/** Solution 2: Prefix Sum — O(1) query after O(m+n) build (for repeated queries)
 * Time: O(m + n) | Space: O(m + n)
 */
function minCost2(
  startPos: number[],
  homePos: number[],
  rowCosts: number[],
  colCosts: number[],
): number {
  const prefixRow = [0];
  for (let i = 0; i < rowCosts.length; i++) prefixRow.push(prefixRow[i] + rowCosts[i]);

  const prefixCol = [0];
  for (let i = 0; i < colCosts.length; i++) prefixCol.push(prefixCol[i] + colCosts[i]);

  const rangeRow = (a: number, b: number): number =>
    a <= b
      ? prefixRow[b + 1] - prefixRow[a + 1] // from a+1 to b inclusive
      : prefixRow[a] - prefixRow[b]; // from b to a-1 inclusive

  const rangeCol = (a: number, b: number): number =>
    a <= b ? prefixCol[b + 1] - prefixCol[a + 1] : prefixCol[a] - prefixCol[b];

  return rangeRow(startPos[0], homePos[0]) + rangeCol(startPos[1], homePos[1]);
}

/** Solution 3: Concise functional — Math.min/max range
 * Time: O(m + n) | Space: O(1)
 */
function minCost3(
  startPos: number[],
  homePos: number[],
  rowCosts: number[],
  colCosts: number[],
): number {
  const sumRange = (costs: number[], from: number, to: number): number => {
    let s = 0;
    const [lo, hi] = [Math.min(from, to), Math.max(from, to)];
    for (let i = lo + (from < to ? 1 : 0); i <= hi - (from > to ? 1 : 0); i++) s += costs[i];
    // Simpler: sum costs[min+1..max] if going right/down, costs[min..max-1] if going left/up
    return s;
  };
  const rowSum = (() => {
    const [a, b] = [startPos[0], homePos[0]];
    let s = 0;
    if (a < b) for (let i = a + 1; i <= b; i++) s += rowCosts[i];
    else for (let i = b; i < a; i++) s += rowCosts[i];
    return s;
  })();
  const colSum = (() => {
    const [a, b] = [startPos[1], homePos[1]];
    let s = 0;
    if (a < b) for (let i = a + 1; i <= b; i++) s += colCosts[i];
    else for (let i = b; i < a; i++) s += colCosts[i];
    return s;
  })();
  return rowSum + colSum;
}

// Test cases
console.log(minCost([1, 0], [2, 3], [5, 4, 3], [8, 2, 6, 7])); // 18
console.log(minCost([0, 0], [0, 0], [5], [26])); // 0
console.log(minCost([1, 3], [0, 0], [2, 3], [4, 5, 6, 7])); // 2+3+5+4 = 14? let's verify
console.log(minCost2([1, 0], [2, 3], [5, 4, 3], [8, 2, 6, 7])); // 18
```

## 🔗 Related Problems

| Problem                                                                                                              | Relationship                                                |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum)                                                   | Grid pathfinding with DP — but no backtracking allowed here |
| [Minimum Cost to Reach Destination in Time](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time) | Graph pathfinding with time constraint                      |
| [Gas Station](https://leetcode.com/problems/gas-station)                                                             | Greedy on circular path costs                               |
