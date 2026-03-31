---
layout: page
title: "Maximum Points Inside the Square"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-points-inside-the-square"
---

# Maximum Points Inside the Square / Điểm Tối Đa Trong Hình Vuông

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như mở rộng một chiếc lều hình vuông tại gốc tọa độ — ta tăng dần bán kính và hỏi "hình vuông này có chứa hai điểm cùng nhãn không?". Binary search trên kích thước hình vuông.

**Pattern Recognition:**

- Signal: "hình vuông" + "tối đa điểm" + khoảng cách Chebyshev → Binary Search trên kích thước
- Key insight: điểm `(x,y)` nằm trong hình vuông cạnh `2s` tâm gốc khi `max(|x|,|y|) <= s`

**Visual — Maximum Points Inside the Square example:**

```
Points: [(2,2,'a'), (1,7,'b'), (4,4,'b'), (-1,-1,'a')]
Labels: "ab"

Chebyshev distance: max(|x|, |y|)
  (2,2,'a')  → dist=2
  (1,7,'b')  → dist=7
  (4,4,'b')  → dist=4
  (-1,-1,'a')→ dist=1

Binary search on s:
  s=1: check max(|x|,|y|)<=1 → only (-1,-1,'a'), dist=1 ✓ no duplicates → valid
  s=4: points with dist<=4: a@1,a@2,b@4 → 'a' appears twice → invalid
  s=2: a@1,a@2 → 'a' appears twice → invalid
  s=1: valid, count=1
  Answer: 2 (s=2 only has 1 label-a point at dist=1, so max valid=1?
             Actually re-check: s=2 → dist<=2: (2,2,'a')dist=2, (-1,-1,'a')dist=1 → two 'a' → bad
             s=1 → dist<=1: (-1,-1,'a') → only 1 → valid → 1 point)
```

---

## Problem Description

You are given a 2D array `points` and a string `s` where `points[i]` corresponds to `s[i]`. Consider a square of side length `2*d` centered at the origin. A point `(x, y)` is inside if `max(|x|, |y|) <= d`. Return the **maximum** number of points that fit inside some square such that no two points share the same label.

Difficulty: Medium | Acceptance: 38.2%

```
Example 1:
  Input:  points = [[2,2],[1,7],[4,4],[1,1]], s = "abba"
  Output: 2

Example 2:
  Input:  points = [[1,1],[-2,-2],[-2,2]], s = "abb"
  Output: 3

Example 3:
  Input:  points = [[1,1],[-1,-1],[2,-2]], s = "abc"
  Output: 3
```

Constraints:

- `1 <= points.length <= 10^5`
- `points[i].length == 2`
- `-10^9 <= points[i][0], points[i][1] <= 10^9`
- `s.length == points.length`
- `s` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Khoảng cách là Chebyshev (max(|x|,|y|)) hay Euclidean?" / Confirm it's Chebyshev (infinity norm) not Euclidean.
2. **Binary Search insight**: "Ta binary search trên kích thước d, kiểm tra feasibility" / Binary search on the half-side-length d.
3. **Feasibility check**: "Với mỗi d, đếm điểm trong hình vuông và kiểm tra không có nhãn nào trùng" / For a given d, check label uniqueness.
4. **Optimize**: "Sort theo dist giúp scan nhanh hơn; hoặc bin-search trực tiếp" / Sort by Chebyshev dist for two-pointer scan.
5. **Edge cases**: "Tất cả điểm cùng nhãn — answer=1; điểm tại gốc — dist=0" / All same label → 1; point at origin → dist=0.
6. **Follow-up**: "Nếu trung tâm không phải gốc? Shift tọa độ" / If center isn't origin, shift coordinates.

---

## Solutions

```typescript
/**
 * Solution 1: Sort by Chebyshev Distance + Two-Pointer Scan
 * Time: O(n log n) — sorting
 * Space: O(n) — sorted pairs array
 */
function maxPointsInsideSquare(points: number[][], s: string): number {
  const n = points.length;
  // pair (dist, label)
  const pairs: [number, string][] = points.map((p, i) => [
    Math.max(Math.abs(p[0]), Math.abs(p[1])),
    s[i],
  ]);
  pairs.sort((a, b) => a[0] - b[0]);

  const seen = new Set<string>();
  let ans = 0;
  let i = 0;
  while (i < n) {
    // gather all points at the same distance (they enter simultaneously)
    let j = i;
    while (j < n && pairs[j][0] === pairs[i][0]) j++;
    const group = pairs.slice(i, j);
    // check if any label in this group already in seen or duplicates within group
    const groupLabels = group.map((p) => p[1]);
    const groupSet = new Set(groupLabels);
    if (groupLabels.length !== groupSet.size) break; // duplicate label in same dist
    let conflict = false;
    for (const lbl of groupLabels) {
      if (seen.has(lbl)) {
        conflict = true;
        break;
      }
    }
    if (conflict) break;
    for (const lbl of groupLabels) seen.add(lbl);
    ans = seen.size;
    i = j;
  }
  return ans;
}

/**
 * Solution 2: Binary Search on half-side d
 * Time: O(n log(maxVal)) — binary search * O(n) feasibility
 * Space: O(n) — label set
 */
function maxPointsInsideSquareBinSearch(points: number[][], s: string): number {
  const canFit = (d: number): boolean => {
    const seen = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      const dist = Math.max(Math.abs(points[i][0]), Math.abs(points[i][1]));
      if (dist <= d) {
        if (seen.has(s[i])) return false;
        seen.add(s[i]);
      }
    }
    return true;
  };

  // count for a specific feasible d
  const countAt = (d: number): number => {
    const seen = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      const dist = Math.max(Math.abs(points[i][0]), Math.abs(points[i][1]));
      if (dist <= d) seen.add(s[i]);
    }
    return seen.size;
  };

  // Collect all unique distances, binary search on them
  const dists = [...new Set(points.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))))].sort(
    (a, b) => a - b,
  );

  let lo = 0,
    hi = dists.length - 1,
    best = 0;
  // We want maximum d where canFit is true
  // But we need to handle: canFit could be true at d but false at d+epsilon due to new group
  // Actually we check each dist boundary
  for (const d of dists) {
    if (canFit(d)) best = countAt(d);
    else break; // once infeasible, larger d also infeasible
  }
  return best;
}

// === Test Cases ===
console.log(
  maxPointsInsideSquare(
    [
      [2, 2],
      [1, 7],
      [4, 4],
      [1, 1],
    ],
    "abba",
  ),
); // 2
console.log(
  maxPointsInsideSquare(
    [
      [1, 1],
      [-2, -2],
      [-2, 2],
    ],
    "abb",
  ),
); // 3
console.log(
  maxPointsInsideSquare(
    [
      [1, 1],
      [-1, -1],
      [2, -2],
    ],
    "abc",
  ),
); // 3
console.log(
  maxPointsInsideSquareBinSearch(
    [
      [2, 2],
      [1, 7],
      [4, 4],
      [1, 1],
    ],
    "abba",
  ),
); // 2
```

---

## 🔗 Related Problems

- [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) — same pattern: grouping by key
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — binary search on sorted data
- [Missing Number](https://leetcode.com/problems/missing-number) — binary search variant
- [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) — binary search on value
- [Maximum Points Inside the Square — LeetCode](https://leetcode.com/problems/maximum-points-inside-the-square) — problem page
