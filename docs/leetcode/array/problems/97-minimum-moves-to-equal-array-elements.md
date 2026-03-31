---
layout: page
title: "Minimum Moves to Equal Array Elements"
difficulty: Medium
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/minimum-moves-to-equal-array-elements"
---

# Minimum Moves to Equal Array Elements / Số Bước Tối Thiểu Để Đồng Đều Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống nâng thùng hàng — mỗi lần tăng n-1 thùng lên 1 đơn vị, tương đương giảm 1 thùng xuống 1 đơn vị. Để làm đều, chỉ cần kéo mọi thứ xuống mức thấp nhất: số bước = sum(nums) - n \* min(nums).

**Visual:**

```
nums = [1, 2, 3], n=3

Move: increment n-1=2 elements ≡ decrement 1 element by 1.
Target: bring everything to min=1.

Element 2 needs 1 decrement  →  1 move
Element 3 needs 2 decrements →  2 moves
Total = (2-1) + (3-1) = 1+2 = 3 moves

Formula: sum(nums) - n * min(nums)
       = (1+2+3) - 3*1 = 6-3 = 3 ✓
```

---

## Problem Description

Given an integer array `nums` of size `n`, in one move you can increment `n-1` elements by 1. Return the **minimum number of moves** required to make all array elements equal.

- Example 1: `nums = [1,2,3]` → `3` (3 moves: [2,3,3]→[3,4,3]→[4,4,4] or equivalently decrement)
- Example 2: `nums = [1,1,1]` → `0` (already equal)

**Constraints:** `n == nums.length`, `1 <= nums.length <= 10^5`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Increment n-1 elements, không giới hạn số lần thực hiện" / Any number of ops allowed.
2. **Key insight**: "Tăng n-1 phần tử = giảm 1 phần tử — chứng minh bằng tương đương" / Incrementing n-1 is equivalent to decrementing 1.
3. **Target value**: "Target là min(nums) — mọi phần tử cần giảm về min" / Target is always the minimum element.
4. **Formula**: "moves = sum - n \* min" / Derivation: each element needs (elem - min) decrements.
5. **Overflow**: "Sum có thể lớn — dùng bigint hoặc cẩn thận với giới hạn số" / Watch for integer overflow with large inputs.
6. **Follow-up**: "Nếu có thể decrement cũng? → dùng median thay vì min (LC 462)" / With both ops, use median (LC 462).

---

## Solutions

```typescript
/**
 * Solution 1: Simulation / Brute Force (conceptual, for small arrays)
 * Time: O(n * moves) — too slow for large inputs
 * Space: O(1)
 *
 * Simulate: each step increment all except min element.
 * Only feasible for tiny arrays. Here shown for clarity.
 */
function minMovesBrute(nums: number[]): number {
  let moves = 0;
  while (new Set(nums).size > 1) {
    const minVal = Math.min(...nums);
    const minIdx = nums.indexOf(minVal);
    for (let i = 0; i < nums.length; i++) {
      if (i !== minIdx) nums[i]++;
    }
    moves++;
  }
  return moves;
}

console.log(minMovesBrute([1, 2, 3])); // 3
console.log(minMovesBrute([1, 1, 1])); // 0

/**
 * Solution 2: Math Formula — Optimal
 * Time: O(n) — one pass to compute sum and min
 * Space: O(1)
 *
 * Key insight: incrementing (n-1) elements by 1 is equivalent to
 * decrementing 1 element by 1 (relative to the others).
 * Minimum moves = sum(nums) - n * min(nums).
 */
function minMoves(nums: number[]): number {
  let sum = 0;
  let minVal = nums[0];

  for (const n of nums) {
    sum += n;
    if (n < minVal) minVal = n;
  }

  return sum - nums.length * minVal;
}

console.log(minMoves([1, 2, 3])); // 3
console.log(minMoves([1, 1, 1])); // 0
console.log(minMoves([1, 1000000000])); // 999999999
console.log(minMoves([-10, 10])); // 20

/**
 * Solution 3: Sort-based (alternative derivation)
 * Time: O(n log n), Space: O(1)
 * Each nums[i] needs (nums[i] - nums[0]) moves after sorting.
 */
function minMovesSorted(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const minVal = nums[0];
  return nums.reduce((acc, n) => acc + (n - minVal), 0);
}

console.log(minMovesSorted([1, 2, 3])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                          | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii)               | Math + Median  | Medium     |
| [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)                                                       | Math           | Hard       |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                                   | Math / Bit XOR | Easy       |
| [Minimum Cost to Move Chips to the Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position) | Math           | Easy       |
