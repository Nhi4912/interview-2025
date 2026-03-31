---
layout: page
title: "Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts"
---

# Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts / Diện Tích Tối Đa Của Miếng Bánh Sau Khi Cắt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Hãy tưởng tượng bạn cắt bánh theo hàng và cột. Sau khi cắt xong, kích thước của từng miếng = khoảng cách giữa hai đường cắt liên tiếp. Miếng **lớn nhất** = khoảng cách ngang lớn nhất × khoảng cách dọc lớn nhất. Bạn chỉ cần tìm gap lớn nhất theo từng chiều!

**Pattern Recognition:**

- Cuts divide [0, h] into horizontal strips and [0, w] into vertical strips
- Max piece = max horizontal gap × max vertical gap
- Sort cuts, include boundaries 0 and h/w, find largest consecutive difference

**Visual:**

```
h=5, w=4, hCuts=[1,2,4], vCuts=[1,3]

Horizontal gaps: [0,1,2,4,5] → diffs: 1,1,2,1 → maxH=2
Vertical gaps:   [0,1,3,4]   → diffs: 1,2,1   → maxV=2

Answer = 2 × 2 = 4 ✅

(Be careful: h=10^9 → use BigInt or careful modular arithmetic)
```

## Problem Description

A rectangle cake has height `h` and width `w`. `horizontalCuts[i]` and `verticalCuts[j]` are y/x coordinates of cuts. After all cuts, return the **maximum area** of any piece modulo `10^9 + 7`. `2 ≤ h,w ≤ 10^9`, `1 ≤ horizontalCuts.length ≤ min(h-1, 10^5)`, same for vertical.

**Example 1:** `h=5, w=4, hCuts=[1,2,4], vCuts=[1,3]` → `4`
**Example 2:** `h=5, w=4, hCuts=[3,1], vCuts=[1]` → `6`

## 📝 Interview Tips

1. **Clarify**: Kết quả mod 10^9+7 — cần chú ý overflow khi nhân / Result mod 10^9+7; watch for integer overflow on multiplication
2. **Approach**: Sort cuts, thêm 0 và h/w vào, tìm max gap / Sort cuts, add boundaries, find max consecutive gap
3. **Edge cases**: Không có cut nào → max gap = h hoặc w; overflow khi h,w ~ 10^9 / No cuts; large values need BigInt
4. **Optimize**: O(n log n) là tối ưu — bottleneck là sort / Sort is the bottleneck; O(n log n)
5. **Test**: `h=5, w=4, hCuts=[1,2,4], vCuts=[1,3]` → 4; `hCuts=[3,1], vCuts=[1]` → 6 / Trace both examples
6. **Follow-up**: Nếu cần tổng diện tích (không phải max)? → sum of all gaps × sum of all vgaps / Total area instead of max?

## Solutions

```typescript
const MOD = 1_000_000_007n;

/** Helper: find max gap after sorting and adding boundaries */
function maxGap(cuts: number[], bound: number): bigint {
  const sorted = [0, ...cuts, bound].sort((a, b) => a - b);
  let max = 0;
  for (let i = 1; i < sorted.length; i++) {
    max = Math.max(max, sorted[i] - sorted[i - 1]);
  }
  return BigInt(max);
}

/** Solution 1: Greedy — find max horizontal gap × max vertical gap
 * Time: O(n log n + m log m) | Space: O(n + m)
 */
function maxArea(h: number, w: number, horizontalCuts: number[], verticalCuts: number[]): number {
  const maxH = maxGap(horizontalCuts, h);
  const maxV = maxGap(verticalCuts, w);
  return Number((maxH * maxV) % MOD);
}

/** Solution 2: Inline without helper, explicit BigInt handling
 * Time: O(n log n) | Space: O(1) extra
 */
function maxArea2(h: number, w: number, horizontalCuts: number[], verticalCuts: number[]): number {
  horizontalCuts.sort((a, b) => a - b);
  verticalCuts.sort((a, b) => a - b);

  let maxH = Math.max(horizontalCuts[0], h - horizontalCuts[horizontalCuts.length - 1]);
  for (let i = 1; i < horizontalCuts.length; i++) {
    maxH = Math.max(maxH, horizontalCuts[i] - horizontalCuts[i - 1]);
  }

  let maxV = Math.max(verticalCuts[0], w - verticalCuts[verticalCuts.length - 1]);
  for (let i = 1; i < verticalCuts.length; i++) {
    maxV = Math.max(maxV, verticalCuts[i] - verticalCuts[i - 1]);
  }

  return Number((BigInt(maxH) * BigInt(maxV)) % BigInt(1_000_000_007));
}

// Test cases
console.log(maxArea(5, 4, [1, 2, 4], [1, 3])); // 4
console.log(maxArea(5, 4, [3, 1], [1])); // 6
console.log(maxArea2(5, 4, [1, 2, 4], [1, 3])); // 4
console.log(maxArea(1000000000, 1000000000, [2], [2])); // large value mod test
```

## 🔗 Related Problems

| Problem                                                                                      | Relationship                                          |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Max Chunks To Make Sorted](https://leetcode.com/problems/max-chunks-to-make-sorted)         | Find partition points by gap/boundary analysis        |
| [Number of Ways to Cut a Pizza](https://leetcode.com/problems/number-of-ways-to-cut-a-pizza) | Cutting 2D grid with constraints                      |
| [Minimum Cost to Cut a Stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick)     | Interval DP on cuts; different optimization direction |
