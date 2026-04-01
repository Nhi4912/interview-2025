---
layout: page
title: "Find Building Where Alice and Bob Can Meet"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Stack, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/find-building-where-alice-and-bob-can-meet"
---

# Find Building Where Alice and Bob Can Meet / Tìm Tòa Nhà Alice Và Bob Gặp Nhau

> **Track**: Sorting-Searching | **Difficulty**: 🔴 Hard | **Pattern**: Offline + Monotone Stack
> **Frequency**: 📘 Tier 3 — Gặp ở competitive interviews
> **See also**: [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) | [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums)

## 🧠 Intuition / Tư Duy

**Analogy:** Hai người đứng ở hai tòa nhà khác nhau muốn gặp nhau — họ cần tòa nhà đầu tiên **bên phải** cao hơn **cả hai** tòa hiện tại. Như tìm hàng xóm cao hơn khi nhìn về bên phải.

**Pattern Recognition:**

- Signal: "find first index ≥ boundary where value > threshold" + multiple queries → **Offline + Monotone Stack + Binary Search**
- Sort queries by right boundary, sweep right→left, stack giảm dần = binary search được

**Visual — heights=[6,4,8,5,2,7], query(0,1):**

```
idx:     0   1   2   3   4   5
height:  6   4   8   5   2   7
         ↑   ↑
        a=0 b=1  max_h=6, need >6 from idx≥1
                  → idx=2: height=8 > 6 ✓  ans=2

Stack (decreasing, right-to-left sweep):
i=5: stack=[(7,5)]
i=4: 2<7 push → stack=[(7,5),(2,4)]  ← top has smallest index
i=3: 5>2 pop(2,4), 5<7 push → stack=[(7,5),(5,3)]
i=2: 8>5 pop, 8>7 pop → stack=[(8,2)]  ← binary search here for threshold>6
```

## Problem Description

Given integer array `heights` and queries `[a, b]`, for each query find the **leftmost index** `i ≥ max(a,b)` where `heights[i] > max(heights[a], heights[b])`. Return -1 if none exists.

**Special cases:** if `a == b` return `a`; if one person is already at a taller building, return that index.

**Example 1:**

```
Input:  heights=[6,4,8,5,2,7], queries=[[0,1],[0,3],[2,4],[3,4],[2,2]]
Output: [2, 5, -1, 5, 2]
```

**Example 2:**

```
Input:  heights=[5,3,8,2,6,1,4,6], queries=[[0,7],[3,5],[5,2],[3,0],[1,6]]
Output: [7, 6, -1, 4, 6]
```

**Constraints:**

- `1 ≤ heights.length ≤ 5 × 10⁴`, `1 ≤ heights[i] ≤ 10⁹`
- `1 ≤ queries.length ≤ 5 × 10⁴`, `0 ≤ a, b < heights.length`

---

## 📝 Interview Tips

1. **Nhận dạng early exit** — `a==b` trả ngay `a`; nếu một người ở tòa cao hơn → trả vị trí đó. / Handle trivial cases first: same index, or one height already dominates.
2. **Offline query** — Khi queries độc lập nhau, sort theo right boundary rồi xử lý 1 lần. / Offline processing: sort queries by right bound, sweep once.
3. **Monotone stack giảm** — Stack lưu (height, index) giảm dần cho phép binary search tìm phần tử > ngưỡng. / Decreasing stack enables binary search for first element exceeding threshold.
4. **Binary search trên stack** — Stack giảm từ bottom→top theo height → tìm nhị phân index nhỏ nhất thỏa height > X. / Stack decreases bottom→top → binary search for leftmost index with height > X.
5. **Normalize với swap** — Luôn đảm bảo `a ≤ b` bằng swap để đơn giản hóa logic boundary. / Always normalize `a ≤ b` by swapping to simplify right-boundary logic.
6. **Độ phức tạp** — Brute O(n·q) dễ nhưng TLE; offline+stack O((n+q) log n) pass được. / Brute O(n·q) is intuitive but TLEs; offline+stack is O((n+q) log n).

---

## Solutions

```typescript
/**
 * Approach 1: Brute Force
 * Time: O(n * q)  Space: O(1) extra
 */
function leftmostBuildingQueriesBrute(heights: number[], queries: number[][]): number[] {
  return queries.map(([a, b]) => {
    if (a > b) [a, b] = [b, a];
    if (a === b) return a;
    if (heights[a] < heights[b]) return b;
    // heights[a] >= heights[b], need strictly greater than heights[a] after b
    const threshold = heights[a];
    for (let i = b + 1; i < heights.length; i++) {
      if (heights[i] > threshold) return i;
    }
    return -1;
  });
}

/**
 * Approach 2: Offline + Monotone Stack (Optimal)
 * Time: O((n + q) log n)  Space: O(n + q)
 *
 * Group non-trivial queries by right boundary; sweep right→left maintaining
 * a decreasing-height stack. Binary search the stack for leftmost height > threshold.
 */
function leftmostBuildingQueries(heights: number[], queries: number[][]): number[] {
  const n = heights.length;
  const q = queries.length;
  const ans = new Array<number>(q).fill(-1);

  // Bucket non-trivial queries by right boundary
  const queryAt: [number, number][][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < q; i++) {
    let [a, b] = queries[i];
    if (a > b) [a, b] = [b, a]; // ensure a <= b
    if (a === b) {
      ans[i] = a;
    } else if (heights[a] < heights[b]) {
      ans[i] = b; // b is already taller
    } else {
      // Need first index > b with height > heights[a]
      queryAt[b].push([heights[a], i]);
    }
  }

  // Monotone stack: [height, index], decreasing by height bottom→top
  const stack: [number, number][] = [];

  for (let i = n - 1; i >= 0; i--) {
    // Maintain strictly decreasing stack
    while (stack.length > 0 && stack[stack.length - 1][0] <= heights[i]) {
      stack.pop();
    }
    stack.push([heights[i], i]);

    // Answer queries whose right boundary is i.
    // Stack now holds indices i+1..n-1 in decreasing height order.
    for (const [threshold, qi] of queryAt[i]) {
      // Binary search: stack is height-decreasing bottom→top.
      // Find topmost entry (smallest index) with height > threshold.
      let lo = 0,
        hi = stack.length - 1,
        res = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (stack[mid][0] > threshold) {
          res = stack[mid][1]; // valid; try further toward top for smaller index
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      ans[qi] = res;
    }
  }

  return ans;
}

// Tests
// prettier-ignore
console.log(leftmostBuildingQueries([6,4,8,5,2,7], [[0,1],[0,3],[2,4],[3,4],[2,2]])); // [2,5,-1,5,2]
// prettier-ignore
console.log(leftmostBuildingQueries([5,3,8,2,6,1,4,6], [[0,7],[3,5],[5,2],[3,0],[1,6]])); // [7,6,-1,4,6]
// prettier-ignore
console.log(leftmostBuildingQueriesBrute([6,4,8,5,2,7], [[0,1],[0,3],[2,4],[3,4],[2,2]])); // [2,5,-1,5,2]
```

---

## 🔗 Related Problems

- [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem) — Monotone structure on heights
- [907. Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums) — Offline stack trick
- [2736. Maximum Sum Queries](https://leetcode.com/problems/maximum-sum-queries/) — Offline + BIT same pattern
- [1944. Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue/) — Monotone stack heights
- [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — Monotone stack classic
