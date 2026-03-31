---
layout: page
title: "Minimum Time to Eat All Grains"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-eat-all-grains"
---

# Minimum Time to Eat All Grains / Thời Gian Tối Thiểu Để Ăn Hết Ngũ Cốc

🔴 Hard | Binary Search + Greedy | [LeetCode 2513](https://leetcode.com/problems/minimum-time-to-eat-all-grains)

---

## 🧠 Intuition / Trực Giác

**EN:** Binary search on time `t`. For a given `t`, greedily check: sort both hens and grains. Each hen covers a range of grains — if grains are to the right only, reach is `h + t`; if grains extend left, the hen must travel left then right (or right then left), computed as `max(t - 2*leftDist, floor((t-leftDist)/2))` extra rightward reach.

**VI:** Binary search trên thời gian `t`. Với `t` cho trước, kiểm tra tham lam: sắp xếp cả gà và ngũ cốc. Mỗi con gà phủ một dải ngũ cốc — nếu chỉ bên phải thì đến `h + t`; nếu có phía trái, phải tính đường đi trái-rồi-phải.

```
hens = [3, 6, 7]   grains = [2, 4, 7, 9]   t = 2

Sorted hens: [3,6,7]   grains: [2,4,7,9]

Hen 3: leftDist=1 (grain 2), reach right = 3 + max(2-2, (2-1)/2) = 3 + max(0,0) = 3
  Eats grain 2 (=2<3? no, 2≤3 yes) and grain 4 (4≤3? no, skip)
  Wait: reach = 3+max(0,0)=3. Grain 4 > 3, not eaten. j=1 (grain 2 eaten)

Hen 6: grain 4, leftDist=0 (4>6? no, 4<6, leftDist=2), reach=6+max(-2,0)=6
  Eats grain 4 (≤6 ✓). j=2

Hen 7: grain 7, rightOnly, reach=7+2=9. Eats grains 7,9. j=4

All grains eaten in t=2 ✓
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔍 **EN:** Binary search range: `lo=0`, `hi=max(grains) + max(hens)` (safe upper bound). **VI:** Phạm vi binary search: `lo=0`, `hi` là khoảng cách tối đa có thể.
- 🐔 **EN:** Sort both arrays — greedy assignment only works when both are sorted left to right. **VI:** Phải sắp xếp cả hai mảng — tham lam chỉ đúng khi cả hai đã được sắp xếp.
- ↔️ **EN:** When a grain is to the hen's left: `leftDist = h - grain`. Two travel options give rightward reach of `max(t - 2*leftDist, floor((t-leftDist)/2))`. Take the max. **VI:** Khi ngũ cốc nằm bên trái: tính khoảng cách trái, rồi lấy tối đa của hai chiến lược di chuyển.
- 📌 **EN:** If `leftDist > t`, the grain is unreachable by this hen — since hens are sorted, earlier hens were closer and couldn't eat it either → return false. **VI:** Nếu `leftDist > t`, ngũ cốc không đến được → return false ngay.
- ✅ **EN:** A hen always eats at least the grains directly to its right up to `h + t`. Grains to the left may shrink this rightward reach. **VI:** Mỗi con gà luôn ăn được những ngũ cốc bên phải trong vòng `h + t`. Ngũ cốc bên trái có thể giảm tầm với phải.
- ⏱️ **EN:** The feasibility check is O(h + g) two-pointer; overall O((h+g) log(maxDist)). **VI:** Kiểm tra khả thi O(h+g) two-pointer; tổng O((h+g) log(maxDist)).

---

## 💡 Solutions / Giải Pháp

### Solution 1 — Binary Search + Greedy Two-Pointer

```typescript
/**
 * Binary search on time t. Greedy: each hen eats leftmost remaining grains
 * it can reach within t seconds.
 * Time: O((H+G) log D)  H=hens, G=grains, D=max distance
 * Space: O(1) after sorting
 */
function minimumTime(hens: number[], grains: number[]): number {
  hens.sort((a, b) => a - b);
  grains.sort((a, b) => a - b);

  function canFinish(t: number): boolean {
    let j = 0; // next unassigned grain index
    for (let i = 0; i < hens.length && j < grains.length; i++) {
      const h = hens[i];

      if (grains[j] >= h) {
        // All remaining grains start at or right of hen — go right
        while (j < grains.length && grains[j] <= h + t) j++;
      } else {
        // Leftmost grain is to the left of hen
        const leftDist = h - grains[j];
        if (leftDist > t) return false; // unreachable

        // Option A: go left first, then right
        //   rightward reach = h + (t - 2*leftDist)
        // Option B: go right first, then left
        //   rightward reach = h + floor((t - leftDist) / 2)
        const reach = h + Math.max(t - 2 * leftDist, Math.floor((t - leftDist) / 2));
        while (j < grains.length && grains[j] <= reach) j++;
      }
    }
    return j >= grains.length;
  }

  const maxDist = Math.max(...hens, ...grains);
  let lo = 0,
    hi = 2 * maxDist;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// Tests
console.log(minimumTime([3, 6, 7], [2, 4, 7, 9])); // 2
console.log(minimumTime([4, 6, 109], [5, 6])); // 1
console.log(minimumTime([10], [1, 2, 3, 4, 5])); // 9
```

### Solution 2 — Binary Search with Explicit Bounds Calculation

```typescript
/**
 * Same logic but computes hi more precisely from constraints
 * Time: O((H+G) log D)  Space: O(H+G) for sorted copies
 */
function minimumTime2(hens: number[], grains: number[]): number {
  const H = [...hens].sort((a, b) => a - b);
  const G = [...grains].sort((a, b) => a - b);

  function feasible(t: number): boolean {
    let g = 0;
    for (let h = 0; h < H.length && g < G.length; h++) {
      if (G[g] >= H[h]) {
        while (g < G.length && G[g] <= H[h] + t) g++;
      } else {
        const d = H[h] - G[g];
        if (d > t) return false;
        const reach = H[h] + Math.max(t - 2 * d, Math.floor((t - d) / 2));
        while (g < G.length && G[g] <= reach) g++;
      }
    }
    return g >= G.length;
  }

  // Upper bound: one hen eats all from leftmost grain to rightmost grain
  let lo = 0;
  let hi =
    G[G.length - 1] -
    G[0] +
    Math.max(Math.abs(H[0] - G[0]), Math.abs(H[H.length - 1] - G[G.length - 1]));

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(minimumTime2([3, 6, 7], [2, 4, 7, 9])); // 2
console.log(minimumTime2([10], [1, 2, 3, 4, 5])); // 9
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                | Difficulty | Pattern                     |
| --- | ---------------------- | ---------- | --------------------------- |
| 1   | Koko Eating Bananas    | 🟡 Medium  | binary search on answer     |
| 2   | Minimum Number of Days | 🔴 Hard    | binary search + greedy      |
| 3   | Swim in Rising Water   | 🔴 Hard    | binary search + feasibility |
