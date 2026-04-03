---
layout: page
title: "Can Place Flowers"
difficulty: Easy
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/can-place-flowers"
---

# Can Place Flowers / Có Thể Trồng Hoa Không

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn trồng cây dọc hàng rào nhà hàng xóm — mỗi cây phải cách cây bên cạnh ít nhất 1 ô để không tranh nước. Bạn đi từ trái sang phải, thấy ô nào trống và cả hai ô bên đều trống thì trồng luôn, đây là lựa chọn tham lam tối ưu vì trồng sớm không bao giờ giảm số chỗ còn lại.

**Pattern Recognition:**

- Signal: "place items with spacing constraint" + "count how many fit" → **Greedy**
- Greedily place at first valid position — planting early never hurts future placements
- Treat out-of-bounds neighbors as 0 (empty) to unify edge logic

**Visual — `flowerbed = [1,0,0,0,1], n = 1`:**

```
Index:     0   1   2   3   4
Value:    [1,  0,  0,  0,  1]

i=0: val=1, skip (occupied)
i=1: val=0, left=1 → skip (neighbor occupied)
i=2: val=0, left=0, right=0 → PLANT!  count=1, board=[1,0,1,0,1]
i=3: val=0, left=1 → skip (neighbor now occupied)
i=4: val=1, skip

count=1 >= n=1 → true ✅
```

---

## Problem Description

Given an integer array `flowerbed` containing 0s and 1s (0 = empty, 1 = planted), and an integer `n`, return `true` if `n` new flowers can be planted without any two flowers being adjacent.

**Example 1:** `flowerbed = [1,0,0,0,1], n = 1` → `true`

**Example 2:** `flowerbed = [1,0,0,0,1], n = 2` → `false`

Constraints:

- `1 <= flowerbed.length <= 2 * 10^4`
- `0 <= n <= flowerbed.length`
- No two adjacent flowers in the initial `flowerbed`

---

## 📝 Interview Tips

1. **Clarify**: "Array đã đảm bảo không có 2 hoa liền kề chưa?" / Confirm initial array has no two adjacent flowers
2. **Brute force**: "Thử mọi tổ hợp vị trí trồng — O(2^n)" → greedy scan is O(n) / Trying all placements is exponential
3. **Optimize**: "Greedy: trồng ngay khi có thể — không giảm số chỗ còn lại" / Planting early never blocks a better future choice
4. **Edge cases**: "n=0 → luôn true; mảng dài 1 ô trống → có thể trồng 1" / n=0 always true; single empty cell can hold 1 flower
5. **Follow-up**: "Nếu muốn maximize số hoa trồng được?" / What if we want to maximize total flowers placed?
6. **Trick**: "Kiểm tra left/right out-of-bounds là 0 giúp handle biên đơn giản" / Treating OOB as 0 avoids special-casing boundaries

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — scan with explicit boundary checks
 * Time: O(n) — one pass through the array
 * Space: O(1) — mutate in place (or copy first)
 */
function canPlaceFlowersBrute(flowerbed: number[], n: number): boolean {
  const bed = [...flowerbed]; // copy to avoid mutating input
  let placed = 0;
  for (let i = 0; i < bed.length; i++) {
    const leftEmpty = i === 0 || bed[i - 1] === 0;
    const rightEmpty = i === bed.length - 1 || bed[i + 1] === 0;
    if (bed[i] === 0 && leftEmpty && rightEmpty) {
      bed[i] = 1;
      placed++;
      if (placed >= n) return true;
    }
  }
  return placed >= n;
}

/**
 * Solution 2: Optimized — early exit + in-place mutation
 * Time: O(n) — one pass, exits as soon as n placements made
 * Space: O(1) — mutates input directly (common in interview setting)
 */
function canPlaceFlowers(flowerbed: number[], n: number): boolean {
  let count = 0;
  for (let i = 0; i < flowerbed.length && count < n; i++) {
    if (flowerbed[i] === 0) {
      const prevEmpty = i === 0 || flowerbed[i - 1] === 0;
      const nextEmpty = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;
      if (prevEmpty && nextEmpty) {
        flowerbed[i] = 1; // plant here
        count++;
      }
    }
  }
  return count >= n;
}

// === Test Cases ===
console.log(canPlaceFlowers([1, 0, 0, 0, 1], 1)); // true
console.log(canPlaceFlowers([1, 0, 0, 0, 1], 2)); // false
console.log(canPlaceFlowers([0, 0, 0, 0, 0], 3)); // true  (plant at 0,2,4)
console.log(canPlaceFlowers([1, 0, 0, 0, 0, 0, 1], 2)); // true
console.log(canPlaceFlowers([0], 1)); // true  (single cell)
console.log(canPlaceFlowers([0, 0, 1], 1)); // true  (plant at index 0)
```

---

## 🔗 Related Problems

| Problem                                                                    | Pattern | Difficulty |
| -------------------------------------------------------------------------- | ------- | ---------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                 | Greedy  | Medium     |
| [Largest Number](https://leetcode.com/problems/largest-number)             | Greedy  | Medium     |
| [Gas Station](https://leetcode.com/problems/gas-station)                   | Greedy  | Medium     |
| [Candy](https://leetcode.com/problems/candy)                               | Greedy  | Hard       |
| [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array) | Greedy  | Medium     |
