---
layout: page
title: "Minimum Operations to Make a Uni-Value Grid"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid"
---

# Minimum Operations to Make a Uni-Value Grid / Số Thao Tác Tối Thiểu để Grid Đồng Đều

🟡 Medium

## 🧠 Intuition

> **Hình ảnh:** Bạn có nhiều cột nước với độ cao khác nhau. Mỗi lần bơm/rút thêm/bớt đúng `x` đơn vị. Muốn tất cả bằng nhau với ít thao tác nhất — đây là bài toán tìm **trung vị** (median) vì median tối thiểu hóa tổng độ lệch tuyệt đối.

```
grid=[[2,4],[6,8]], x=2

Flatten & sort: [2, 4, 6, 8]
All must have same remainder mod x: 2%2=0, 4%2=0, 6%2=0, 8%2=0 ✓

Median = 4 (or 6, same cost)
Ops = |2-4|/2 + |4-4|/2 + |6-4|/2 + |8-4|/2
    =    1   +    0   +    1   +    2   = 4 ✓
```

**Chiến lược:** Flatten → sort → check divisibility by x → median minimizes total ops.

## 📋 Problem Description

Given `m×n` grid and integer `x`. Each operation: choose any element, add or subtract `x`. Return minimum operations to make all elements equal, or `-1` if impossible.

**Example 1:** `grid=[[2,4],[6,8]]`, `x=2` → `4`
**Example 2:** `grid=[[1,5],[2,3]]`, `x=1` → `5`
**Example 3:** `grid=[[1,2],[3,4]]`, `x=2` → `-1`

**Constraints:** `1 ≤ m, n ≤ 10^5`, `1 ≤ x, grid[i][j] ≤ 10^4`

## 📝 Interview Tips

- **Feasibility check:** All elements must have the same remainder mod x (otherwise impossible)
- **Optimal target:** The median of all flattened values minimizes `Σ|val - target| / x`
- **Why median?** Mean minimizes sum of squares; median minimizes sum of absolute differences
- **Ops formula:** `Σ |grid[i][j] - median| / x`
- **Prefix sum trick:** Compute prefix sums on sorted array for O(1) half-sum queries
- **Even-length array:** Any value between two middle elements works — median[n/2] is safe choice

## 💡 Solutions

### Solution 1: Flatten + Sort + Median — O(mn log(mn))

```typescript
function minOperations(grid: number[][], x: number): number {
  // Flatten the grid
  const vals: number[] = [];
  for (const row of grid) for (const v of row) vals.push(v);

  vals.sort((a, b) => a - b);
  const n = vals.length;

  // Check feasibility: all values must have same remainder mod x
  const rem = vals[0] % x;
  for (const v of vals) {
    if (v % x !== rem) return -1;
  }

  // Median minimizes total absolute deviation
  const median = vals[Math.floor(n / 2)];

  let ops = 0;
  for (const v of vals) {
    ops += Math.abs(v - median) / x;
  }
  return ops;
}
```

### Solution 2: Prefix Sum for Efficient Cost Calculation — O(mn log(mn))

```typescript
function minOperationsPrefix(grid: number[][], x: number): number {
  const vals: number[] = [];
  for (const row of grid) for (const v of row) vals.push(v);
  vals.sort((a, b) => a - b);

  const n = vals.length;
  const rem = vals[0] % x;
  for (const v of vals) if (v % x !== rem) return -1;

  // Prefix sum for fast range sum queries
  const prefix = [0];
  for (const v of vals) prefix.push(prefix[prefix.length - 1] + v);

  const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l];

  // For any target = vals[mid]:
  // Cost = (target * mid - rangeSum(0, mid-1)) + (rangeSum(mid+1, n-1) - target*(n-1-mid))
  // all divided by x
  let minCost = Infinity;
  for (let mid = 0; mid < n; mid++) {
    const target = vals[mid];
    const leftCost = target * mid - rangeSum(0, mid - 1);
    const rightCost = rangeSum(mid + 1, n - 1) - target * (n - 1 - mid);
    minCost = Math.min(minCost, (leftCost + rightCost) / x);
  }

  return minCost;
}
```

### Solution 3: Linear Scan After Sort (Median Proof) — O(mn log(mn))

```typescript
function minOperationsClean(grid: number[][], x: number): number {
  const flat = grid.flat().sort((a, b) => a - b);
  const n = flat.length;

  // Impossibility check
  if (flat.some((v) => v % x !== flat[0] % x)) return -1;

  // Median index
  const medIdx = n >> 1;
  const median = flat[medIdx];

  return flat.reduce((sum, v) => sum + Math.abs(v - median) / x, 0);
}
```

## 🔗 Related Problems

| Problem                                                                                                                           | Similarity                          |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Best Meeting Point](https://leetcode.com/problems/best-meeting-point/)                                                           | Median minimizes Manhattan distance |
| [Minimum Cost to Move Chips to The Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/) | Parity-based grouping               |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference/)                                         | Sort + adjacent comparison          |
| [Minimum Amount of Time to Fill Cups](https://leetcode.com/problems/minimum-amount-of-time-to-fill-cups/)                         | Greedy array reduction              |
