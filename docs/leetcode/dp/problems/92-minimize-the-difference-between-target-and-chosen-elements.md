---
layout: page
title: "Minimize the Difference Between Target and Chosen Elements"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/minimize-the-difference-between-target-and-chosen-elements"
---

# Minimize the Difference Between Target and Chosen Elements / Tối Thiểu Hóa Khoảng Cách Đến Mục Tiêu

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Row-by-Row Knapsack / Reachable Sums DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Mỗi ngày bạn phải chọn một món ăn từ thực đơn hôm đó. Sau `m` ngày, tổng calo nạp vào cần gần nhất với mục tiêu. Dùng DP theo từng ngày, theo dõi tập các tổng khả thi.

**Pattern Recognition:**

- Pick exactly one element per row → extend set of reachable sums row by row
- After all rows, find the reachable sum closest to `target`
- Use a boolean bitset / Set for O(maxSum) per row transitions

**Visual (mat=[[1,2,3],[4,5,6],[7,8,9]], target=13):**

```
Row 0 reachable: {1, 2, 3}
Row 1: add each of {4,5,6} → {5,6,7, 6,7,8, 7,8,9} = {5,6,7,8,9}
Row 2: add each of {7,8,9} → {12,13,14, 13,14,15, 14,15,16, 15,16,17} = {12,13,...18}
Closest to 13: 13 → |13-13| = 0
```

## Problem Description

Given a matrix `mat` and integer `target`, pick one element from each row to minimize `|sum - target|`.

**Example 1:** `mat=[[1,2,3],[4,5,6],[7,8,9]]`, `target=13` → `0` (pick 1+6+7 or 3+4+6... pick 1+3+9=13)
**Example 2:** `mat=[[1],[2],[3]]`, `target=100` → `94`

**Constraints:** `m,n <= 70`, `1 <= mat[i][j] <= 70`, `1 <= target <= 800`

## 📝 Interview Tips

1. **Clarify**: Must pick exactly one per row? Yes. Can same column be picked multiple times? No restriction.
2. **Approach**: DP with boolean set of reachable sums; update row by row.
3. **Edge cases**: All elements in a row are same → reachable sums just shift by that value.
4. **Optimize**: Use `Set<number>` or Uint8Array bitset; prune sums > target + maxPossibleExcess.
5. **Follow-up**: What if we want exact target? → Check if target is in final reachable set.
6. **Complexity**: O(m × n × m×maxVal) ≈ O(m² × n × maxVal) for small bounds here O(m×n×maxSum).

## Solutions

```typescript
// Solution 1: DP with Set of reachable sums — Time: O(m×n×maxSum) | Space: O(maxSum)
function minimizeTheDifference(mat: number[][], target: number): number {
  const m = mat.length;
  // Upper bound on sum: all rows pick max element (70 * 70 = 4900)
  const MAX_SUM = m * 70 + 1;

  // reachable[s] = true if sum s is achievable picking one element per processed row
  let reachable = new Uint8Array(MAX_SUM);
  reachable[0] = 1;

  for (const row of mat) {
    const next = new Uint8Array(MAX_SUM);
    for (const val of row) {
      for (let s = 0; s + val < MAX_SUM; s++) {
        if (reachable[s]) next[s + val] = 1;
      }
    }
    reachable = next;
  }

  let best = Infinity;
  for (let s = 0; s < MAX_SUM; s++) {
    if (reachable[s]) best = Math.min(best, Math.abs(s - target));
  }
  return best;
}

// Solution 2: DP with Set (more readable) — Time: O(m×n×maxSum) | Space: O(maxSum)
function minimizeTheDifference2(mat: number[][], target: number): number {
  let sums = new Set<number>([0]);

  for (const row of mat) {
    const next = new Set<number>();
    for (const s of sums) {
      for (const val of row) {
        next.add(s + val);
      }
    }
    // Prune: if sum already exceeds target + margin, no need to track
    // Keep sums <= current best possible; use target as upper reference
    sums = next;
  }

  let best = Infinity;
  for (const s of sums) best = Math.min(best, Math.abs(s - target));
  return best;
}

// Solution 3: Sorted + deduplicated DP with pruning — Time: O(m×n×maxSum) | Space: O(maxSum)
function minimizeTheDifference3(mat: number[][], target: number): number {
  let reachable = [0];

  for (const row of mat) {
    const uniqueVals = [...new Set(row)].sort((a, b) => a - b);
    const nextSet = new Set<number>();
    for (const s of reachable) {
      for (const v of uniqueVals) {
        nextSet.add(s + v);
      }
    }
    reachable = [...nextSet];
  }

  return Math.min(...reachable.map((s) => Math.abs(s - target)));
}

// Tests
console.log(
  minimizeTheDifference(
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    13,
  ),
); // 0
console.log(minimizeTheDifference([[1], [2], [3]], 100)); // 94
console.log(minimizeTheDifference([[1, 2, 9, 8, 7]], 6)); // 1
console.log(
  minimizeTheDifference(
    [
      [1, 1],
      [1, 1],
    ],
    3,
  ),
); // 1
console.log(
  minimizeTheDifference(
    [
      [1, 69],
      [70, 1],
    ],
    70,
  ),
); // 0
```

## 🔗 Related Problems

| Problem                                                                      | Relationship                           |
| ---------------------------------------------------------------------------- | -------------------------------------- |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)  | Reachable sums DP, minimize difference |
| [Target Sum](https://leetcode.com/problems/target-sum/)                      | Count ways to reach target sum         |
| [Minimum Cost to Fill Given Weight in a Bag](https://leetcode.com/problems/) | Row knapsack variant                   |
