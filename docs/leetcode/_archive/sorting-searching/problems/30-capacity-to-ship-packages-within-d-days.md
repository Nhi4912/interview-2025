---
layout: page
title: "Capacity To Ship Packages Within D Days"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days"
---

# Capacity To Ship Packages Within D Days / Sức Chở Tàu Trong D Ngày

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn cần thuê xe tải để chở hàng — xe nhỏ quá thì mất nhiều chuyến, xe lớn quá thì lãng phí tiền. Binary search trên "sức chứa" từ min (kiện nặng nhất) đến max (tất cả trong một chuyến) để tìm sức chứa nhỏ nhất đủ giao hàng đúng hạn D ngày.

**Pattern Recognition:**

- Signal: "minimum capacity/speed/value" + "feasibility check" → **Binary Search on Answer**
- Không search trên input mà search trên không gian **đáp án**: `[max(weights), sum(weights)]`
- `canShip(capacity, D)` là hàm monotone: nếu capacity đủ thì capacity lớn hơn cũng đủ

**Visual — Binary Search on Capacity:**

```
weights=[1,2,3,4,5,6,7,8,9,10], days=5

Search space: lo=10 (max single), hi=55 (total sum)

mid=32: canShip? [1-7]=28✓ [8]=8✓ [9]=9✓ [10]=10✓ → 3 days ≤ 5 → hi=32
mid=21: canShip? [1-6]=21✓ [7]=7✓ [8-9]=17✓ [10]=10✓ [...]= → 5 days ≤ 5 → hi=21
mid=15: canShip? [1-5]=15✓ [6-8]=21✗ split → 6 days > 5 → lo=16
...
Answer: lo = 15 ✅
```

---

## Problem Description

A conveyor belt has packages with given `weights`. You ship packages **in order** each day, where total weight loaded per day cannot exceed `capacity`. Return the **minimum capacity** to ship all packages within `days`. ([LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days))

**Example 1:** `weights = [1,2,3,4,5,6,7,8,9,10], days = 5` → `15`
**Example 2:** `weights = [3,2,2,4,1,4], days = 3` → `6`

**Constraints:** `1 <= days <= weights.length <= 500`, `1 <= weights[i] <= 500`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Phải giữ thứ tự các kiện không? Mỗi ngày phải ship ít nhất 1 kiện?" / Order preserved? At least 1 per day?
2. **Search space** / Không gian tìm kiếm: `lo = max(weights)` (tối thiểu chở được kiện nặng nhất), `hi = sum(weights)` (1 ngày tất cả)
3. **Feasibility** / Kiểm tra khả thi: Viết hàm `canShip(cap, days)` — greedy load from left
4. **Monotone** / Tính đơn điệu: Nếu capacity `c` đủ → `c+1` cũng đủ → dùng `hi = mid` khi feasible
5. **Edge cases** / Biên: `days = weights.length` (mỗi ngày 1 kiện), `days = 1` (phải chở tất cả)
6. **Similar** / Tương tự: Koko Eating Bananas, Split Array Largest Sum — cùng pattern "binary search on answer"

---

## Solutions

```typescript
/**
 * Helper: Check if we can ship all packages with given capacity within days
 * Greedy: load as much as possible each day without exceeding capacity
 */
function canShipInDays(weights: number[], capacity: number, days: number): boolean {
  let daysNeeded = 1;
  let currentLoad = 0;

  for (const w of weights) {
    if (currentLoad + w > capacity) {
      daysNeeded++;
      currentLoad = 0;
    }
    currentLoad += w;
  }

  return daysNeeded <= days;
}

/**
 * Solution 1: Brute Force — Try Every Capacity
 * Time: O(n × sum(weights)) — try each capacity and run simulation
 * Space: O(1)
 */
function shipWithinDaysBrute(weights: number[], days: number): number {
  const lo = Math.max(...weights);
  const hi = weights.reduce((a, b) => a + b, 0);
  for (let cap = lo; cap <= hi; cap++) {
    if (canShipInDays(weights, cap, days)) return cap;
  }
  return hi;
}

/**
 * Solution 2: Binary Search on Capacity (Optimal)
 * Time: O(n log(sum - max)) — log of search space × O(n) feasibility check
 * Space: O(1)
 *
 * Left-skewed binary search: find minimum valid capacity
 * When feasible: try smaller (hi = mid), when not: must increase (lo = mid + 1)
 */
function shipWithinDays(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canShipInDays(weights, mid, days)) {
      hi = mid; // mid works, try smaller
    } else {
      lo = mid + 1; // mid doesn't work, must go bigger
    }
  }

  return lo; // lo == hi == minimum valid capacity
}

// === Test Cases ===
console.log(shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)); // 15
console.log(shipWithinDays([3, 2, 2, 4, 1, 4], 3)); // 6
console.log(shipWithinDays([1, 2, 3, 1, 1], 4)); // 3
console.log(shipWithinDays([10], 1)); // 10 (single package)
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern                 | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                             | Binary Search on Answer | 🟡 Medium  |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                     | Binary Search on Answer | 🔴 Hard    |
| [Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets) | Binary Search on Answer | 🟡 Medium  |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array)           | Binary Search           | 🟡 Medium  |
| [Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls)                   | Binary Search on Answer | 🟡 Medium  |
