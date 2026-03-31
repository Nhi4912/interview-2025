---
layout: page
title: "Minimum Number of Lines to Cover Points"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Math, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-lines-to-cover-points"
---

## 📏 2152. Minimum Number of Lines to Cover Points / Số Đường Thẳng Tối Thiểu Để Phủ Các Điểm

**Difficulty:** 🟡 Medium

---

## 🧠 Intuition

**Analogy (Vietnamese):** Bạn có một tập điểm trên mặt phẳng và muốn vẽ ít đường thẳng nhất sao cho mỗi điểm nằm trên ít nhất một đường thẳng. Chiến lược tối ưu: với mỗi điểm chưa được phủ, **chọn đường thẳng qua nó và điểm tiếp theo** để phủ được nhiều nhất.

```
Points: (0,1), (2,3), (4,5), (4,3)

Try line through (0,1)-(2,3): slope=1, covers (0,1),(2,3),(4,5)
Remaining: (4,3) → 1 more line
Total: 2 lines ✓

Backtracking: for first uncovered point p,
  try all lines through p and each other point q
  recurse with covered set updated
```

**Key insight:** Since n ≤ 10, backtracking with bitmask (2^10 = 1024) is feasible. For each uncovered point, fix it as line anchor and try all possible second points to define the line.

---

## 📋 Problem Description

Given `points[]` (2D coordinates, no duplicates, n ≤ 10). Find minimum number of lines such that every point lies on at least one line. A line through two points covers all collinear points.

- Example: `points = [[0,1],[2,3],[4,5],[4,3]]` → **2**
- Example: `points = [[0,2],[-2,-2],[1,4]]` → **1** (all collinear)

---

## 📝 Interview Tips

- 🎯 **Small n**: n ≤ 10 → 2^10 = 1024 subsets; bitmask backtracking is O(2^n × n²)
- 🎯 **Key observation**: always pick the first uncovered point and draw a line through it + every other point
- 🎯 **Collinearity**: use cross product `(x2-x1)*(y3-y1) == (x3-x1)*(y2-y1)` (avoids float issues)
- 🎯 **Special case**: if only 1 uncovered point remains, 1 line covers it (line through that point in any direction)
- 🎯 **Pruning**: if current count ≥ best found, prune
- 🎯 **Complexity**: O(2^n × n²) with memoization on bitmask state

---

## 💡 Solutions

### Solution 1: Bitmask Backtracking with Memoization

```typescript
function minimumLines(points: number[][]): number {
  const n = points.length;
  if (n <= 2) return 1;

  function coveredBy(mask: number, i: number, j: number): number {
    // Return bitmask of all points collinear with points[i] and points[j]
    const [x1, y1] = points[i];
    const [x2, y2] = points[j];
    let covered = (1 << i) | (1 << j);
    for (let k = 0; k < n; k++) {
      if ((mask >> k) & 1) {
        const [x3, y3] = points[k];
        // Cross product = 0 means collinear
        if ((x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1)) {
          covered |= 1 << k;
        }
      }
    }
    return covered;
  }

  const memo = new Map<number, number>();

  function solve(mask: number): number {
    if (mask === 0) return 0;
    if (memo.has(mask)) return memo.get(mask)!;

    // Find first uncovered point (lowest set bit)
    let first = -1;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        first = i;
        break;
      }
    }

    // Single point: 1 line covers it
    if (mask === 1 << first) {
      memo.set(mask, 1);
      return 1;
    }

    let best = n; // worst case
    // Try line through first and every other uncovered point
    for (let j = first + 1; j < n; j++) {
      if (!((mask >> j) & 1)) continue;
      const covered = coveredBy(mask, first, j);
      const remaining = mask & ~covered;
      best = Math.min(best, 1 + solve(remaining));
    }

    memo.set(mask, best);
    return best;
  }

  const fullMask = (1 << n) - 1;
  return solve(fullMask);
}
```

### Solution 2: Backtracking without explicit bitmask

```typescript
function minimumLinesBacktrack(points: number[][]): number {
  const n = points.length;
  const covered = new Array(n).fill(false);
  let ans = n;

  function getCollinear(i: number, j: number): number[] {
    const [x1, y1] = points[i];
    const [x2, y2] = points[j];
    const res: number[] = [i, j];
    for (let k = 0; k < n; k++) {
      if (k === i || k === j) continue;
      const [x3, y3] = points[k];
      if ((x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1)) res.push(k);
    }
    return res;
  }

  function solve(lines: number): void {
    // Find first uncovered point
    let first = -1;
    for (let i = 0; i < n; i++) {
      if (!covered[i]) {
        first = i;
        break;
      }
    }
    if (first === -1) {
      ans = Math.min(ans, lines);
      return;
    }
    if (lines + 1 >= ans) return; // prune

    // Try line through first + each other uncovered point
    for (let j = first + 1; j < n; j++) {
      if (covered[j]) continue;
      const pts = getCollinear(first, j);
      pts.forEach((k) => (covered[k] = true));
      solve(lines + 1);
      pts.forEach((k) => (covered[k] = false));
    }
    // Also try: first point alone on its own line
    covered[first] = true;
    solve(lines + 1);
    covered[first] = false;
  }

  solve(0);
  return ans;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                                     | Difficulty | Key Technique |
| --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [149. Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/)                                            | Hard       | Math + Slope  |
| [1723. Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs/)           | Hard       | Bitmask DP    |
| [526. Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement/)                                          | Medium     | Backtracking  |
| [1986. Minimum Number of Work Sessions](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) | Medium     | Bitmask DP    |
