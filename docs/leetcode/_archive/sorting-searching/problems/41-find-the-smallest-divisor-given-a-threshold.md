---
layout: page
title: "Find the Smallest Divisor Given a Threshold"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold"
---

# Find the Smallest Divisor Given a Threshold / Tìm Ước Số Nhỏ Nhất Theo Ngưỡng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đặt mức giá tối thiểu cho một món hàng — giá càng cao, tổng số lượng bán được càng ít. Cần tìm giá nhỏ nhất sao cho tổng số lượng không vượt quá ngưỡng cho phép.

**Pattern Recognition:**

- Signal: "find smallest X such that f(X) ≤ threshold" + monotone condition → **Binary Search on answer**
- Divisor lớn hơn → tổng nhỏ hơn hoặc bằng (monotone decreasing)
- Key insight: binary search trên khoảng `[1, max(nums)]`, kiểm tra điều kiện `sum ≤ threshold`

**Visual — nums = [1, 2, 5, 9], threshold = 6:**

```
divisor: 1  2  3  4  5  6  7  8  9
sum:    17  9  7  6  5  4  4  4  4
               ^threshold=6
              [1..3] too big, [4..9] ok
               ↑ smallest ok = 5 (wait, 4 gives sum=6 ≤ 6)
Binary search: lo=1 hi=9
  mid=5: sum=5 ≤ 6 → hi=5
  mid=3: sum=7 > 6 → lo=4
  mid=4: sum=6 ≤ 6 → hi=4
  lo=hi=4 → answer = 4 ✅
```

---

## Problem Description

Cho mảng `nums` và ngưỡng `threshold`, tìm **ước số dương nhỏ nhất** sao cho tổng `⌈nums[i]/divisor⌉` cho mọi i không vượt quá `threshold`. ([LeetCode](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold))

Difficulty: Medium | Acceptance: 63.6%

- `nums = [1,2,5,9], threshold = 6` → `5` (⌈1/5⌉+⌈2/5⌉+⌈5/5⌉+⌈9/5⌉ = 1+1+1+2 = 5 ≤ 6)
- `nums = [44,22,33,11,1], threshold = 5` → `44`
- `nums = [2,3,5,7,11], threshold = 11` → `3`

Constraints: `1 <= nums.length <= 5×10^4`, `1 <= nums[i] <= 10^6`, `nums.length <= threshold <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Ceiling hay floor division?" / Ceiling division (round up) per the problem
2. **Brute force**: "Thử mọi divisor từ 1 đến max(nums) — O(max × n)" / Try every divisor linearly
3. **Key insight**: "Hàm sum(d) đơn điệu giảm → binary search trên d" / Sum is monotone, binary search on divisor
4. **Ceiling trick**: "⌈a/b⌉ = Math.floor((a + b - 1) / b)" / Integer ceiling without Math.ceil
5. **Edge cases**: "divisor=1 cho sum max; threshold ≥ n nên luôn có lời giải" / divisor=1 is always worst case
6. **Follow-up**: "Koko Eating Bananas, Ship Packages Within D Days — cùng template" / Classic BS-on-answer family

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try Every Divisor
 * Time: O(max(nums) × n) — for each divisor compute sum
 * Space: O(1)
 */
function smallestDivisorBrute(nums: number[], threshold: number): number {
  const computeSum = (d: number) => nums.reduce((s, n) => s + Math.ceil(n / d), 0);
  for (let d = 1; d <= Math.max(...nums); d++) if (computeSum(d) <= threshold) return d;
  return -1;
}

/**
 * Solution 2: Binary Search on Divisor
 * Time: O(n log(max(nums))) — log iterations, each O(n)
 * Space: O(1)
 */
function smallestDivisor(nums: number[], threshold: number): number {
  const computeSum = (d: number): number => nums.reduce((s, n) => s + Math.ceil(n / d), 0);

  let lo = 1;
  let hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (computeSum(mid) <= threshold) {
      hi = mid; // mid works, try smaller
    } else {
      lo = mid + 1; // mid too small, try larger
    }
  }
  return lo;
}

// === Test Cases ===
console.log(smallestDivisor([1, 2, 5, 9], 6)); // 5
console.log(smallestDivisor([44, 22, 33, 11, 1], 5)); // 44
console.log(smallestDivisor([2, 3, 5, 7, 11], 11)); // 3
console.log(smallestDivisor([1, 2, 3], 6)); // 1
```

---

## 🔗 Related Problems

- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) — identical template: min speed so sum ≤ h
- [Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) — BS on capacity
- [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) — classic BS boundary
- [Minimize Max Distance to Gas Station](https://leetcode.com/problems/minimize-max-distance-to-gas-station) — BS on real-valued answer
- [Find the Smallest Divisor Given a Threshold — LeetCode](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold) — problem page
