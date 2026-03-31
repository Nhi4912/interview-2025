---
layout: page
title: "Maximum Building Height"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-building-height"
---

# Maximum Building Height / Chiều Cao Tòa Nhà Tối Đa

🔴 Hard | 🏷️ Array, Math, Sorting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có n lô đất trên đường thẳng. Một số lô có ràng buộc chiều cao tối đa. Chiều cao thay đổi tối đa 1 đơn vị giữa hai lô liền kề. Chiều cao tối đa đạt được giữa hai điểm bị giới hạn phụ thuộc vào khoảng cách và chênh lệch chiều cao giữa chúng.

```
n=5, restrictions=[[2,1],[4,1]]
Sort by id: [2,1],[4,1]

Forward pass (limit right by left):
  [2,1] → [4, min(1, 1+(4-2))] = [4, min(1,3)] = [4,1] (stay 1)

Backward pass (limit left by right):
  [4,1] → [2, min(1, 1+(4-2))] = [2, min(1,3)] = [2,1] (stay 1)

Between pos 0 (h=0) and pos 2 (h=1):
  max height = (0 + 1 + (2-0)) / 2 = (1+2)/2 = 1.5 → floor = 1
Between pos 2 (h=1) and pos 4 (h=1):
  max height = (1 + 1 + (4-2)) / 2 = (2+2)/2 = 2
Between pos 4 (h=1) and pos 5 (no limit, h=∞... but pos 5 is n):
  max height = 1 + (5-4) = 2
Answer: max(1, 2, 2) = 2...
```

## Problem Description

You have `n` buildings, indexed 1 to n. Restrictions give `[id, maxHeight]` — building `id` can be at most that height. Building 1 must have height 0. Adjacent buildings differ in height by at most 1. Return the **maximum** height achievable by any building.

**Example 1:** `n=5, restrictions=[[2,1],[4,1]]` → `2`

**Example 2:** `n=6, restrictions=[[1,0],[2,1],[3,2],[4,3],[5,2]]` → `3`

## 📝 Interview Tips

- 🔑 **Anchor points / Điểm neo:** Add (1, 0) as a fixed anchor; sort restrictions by building id
- 🔑 **Forward pass / Quét tiến:** Propagate height limits right: `h[i] = min(h[i], h[i-1] + (id[i]-id[i-1]))`
- 🔑 **Backward pass / Quét lùi:** Propagate limits left: `h[i] = min(h[i], h[i+1] + (id[i+1]-id[i]))`
- 🔑 **Between anchors / Giữa hai neo:** Peak between anchor `i` and `i+1` = `floor((h[i] + h[i+1] + dist) / 2)`
- ⚠️ **After last restriction / Sau ràng buộc cuối:** From last anchor to building n, height grows by 1 per step
- 🔗 **Pattern / Mẫu:** Two-pass constraint propagation + peak formula between anchors

## Solutions

### Solution 1: Two-Pass Constraint Propagation

```typescript
/**
 * Sort anchors, propagate limits forward and backward, then compute peaks.
 * Time: O(r log r) where r = restrictions.length  Space: O(r)
 */
function maxBuilding(n: number, restrictions: number[][]): number {
  // Add building 1 as anchor with height 0
  restrictions.push([1, 0]);
  restrictions.sort((a, b) => a[0] - b[0]);

  const r = restrictions.length;

  // Forward pass: limit each anchor by the previous anchor
  for (let i = 1; i < r; i++) {
    const dist = restrictions[i][0] - restrictions[i - 1][0];
    restrictions[i][1] = Math.min(restrictions[i][1], restrictions[i - 1][1] + dist);
  }

  // Backward pass: limit each anchor by the next anchor
  for (let i = r - 2; i >= 0; i--) {
    const dist = restrictions[i + 1][0] - restrictions[i][0];
    restrictions[i][1] = Math.min(restrictions[i][1], restrictions[i + 1][1] + dist);
  }

  let maxHeight = 0;

  // Check peak height between consecutive anchors
  for (let i = 0; i < r - 1; i++) {
    const [id1, h1] = restrictions[i];
    const [id2, h2] = restrictions[i + 1];
    const dist = id2 - id1;
    // Maximum reachable peak between two anchors
    const peak = Math.floor((h1 + h2 + dist) / 2);
    maxHeight = Math.max(maxHeight, peak);
  }

  // After last restriction to building n
  const [lastId, lastH] = restrictions[r - 1];
  maxHeight = Math.max(maxHeight, lastH + (n - lastId));

  return maxHeight;
}

console.log(
  maxBuilding(5, [
    [2, 1],
    [4, 1],
  ]),
); // 2
console.log(
  maxBuilding(6, [
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 2],
  ]),
); // 3
console.log(maxBuilding(10, [])); // 9
console.log(maxBuilding(1, [])); // 0
console.log(
  maxBuilding(4, [
    [2, 0],
    [3, 0],
  ]),
); // 1
```

### Solution 2: Verbose with Proof Comments

```typescript
/**
 * Same algorithm with detailed commentary for interview explanation.
 */
function maxBuildingVerbose(n: number, restrictions: number[][]): number {
  // Anchor: building 1 is always height 0
  const anchors: number[][] = [[1, 0], ...restrictions];
  anchors.sort((a, b) => a[0] - b[0]);

  const m = anchors.length;

  // Forward: if we can only grow +1/step from left anchor,
  // right anchor's height can't exceed left + distance
  for (let i = 1; i < m; i++) {
    const gap = anchors[i][0] - anchors[i - 1][0];
    anchors[i][1] = Math.min(anchors[i][1], anchors[i - 1][1] + gap);
  }

  // Backward: same constraint propagating right-to-left
  for (let i = m - 2; i >= 0; i--) {
    const gap = anchors[i + 1][0] - anchors[i][0];
    anchors[i][1] = Math.min(anchors[i][1], anchors[i + 1][1] + gap);
  }

  let ans = 0;

  // Between anchors i and i+1: the peak is at the midpoint
  // height climbs h1 steps from left, h2 steps from right
  // Peak = (h1 + h2 + gap) / 2 (integer division)
  for (let i = 0; i + 1 < m; i++) {
    const gap = anchors[i + 1][0] - anchors[i][0];
    const peak = Math.floor((anchors[i][1] + anchors[i + 1][1] + gap) / 2);
    ans = Math.max(ans, peak);
  }

  // Tail: after last anchor, no more constraints
  const [tailPos, tailH] = anchors[m - 1];
  ans = Math.max(ans, tailH + (n - tailPos));

  return ans;
}

console.log(
  maxBuildingVerbose(5, [
    [2, 1],
    [4, 1],
  ]),
); // 2
console.log(maxBuildingVerbose(10, [])); // 9
console.log(maxBuildingVerbose(1, [])); // 0
```

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Pattern                        |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)           | Hard       | DP with constraint propagation |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii/)                                       | Medium     | Sweep + prefix sum             |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | Hard       | Binary search + prefix sum     |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)                           | Hard       | Height constraints sweep       |
