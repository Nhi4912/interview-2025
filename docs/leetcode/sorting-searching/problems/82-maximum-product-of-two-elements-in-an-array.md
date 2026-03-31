---
layout: page
title: "Maximum Product of Two Elements in an Array"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array"
---

# Maximum Product of Two Elements in an Array / Tích Lớn Nhất Của Hai Phần Tử

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting / One-pass
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Bạn cần chọn 2 người cao nhất trong đội để cùng nhảy — sản phẩm `(height1-1) × (height2-1)` tối đa khi cả hai người đều cao nhất có thể. Chỉ cần tìm **hai giá trị lớn nhất** trong mảng.

```
nums = [3, 4, 5, 2]
Top 2: first=5, second=4
Answer: (5-1) × (4-1) = 4 × 3 = 12  ✅

One-pass tracking:
  [3]    → first=3, second=0
  [3,4]  → first=4, second=3
  [3,4,5]→ first=5, second=4
  [3,4,5,2]→ first=5, second=4  (2 < second, skip)
```

---

## Problem Description

Given a 0-indexed integer array `nums`, find two elements `nums[i]` and `nums[j]` (i ≠ j) such that `(nums[i]-1) * (nums[j]-1)` is **maximized**. Return the maximum value.

- **Example 1:** `nums = [3,4,5,2]` → `12` (pick 5 and 4: (5-1)\*(4-1)=12)
- **Example 2:** `nums = [1,5,4,5]` → `16` (pick 5 and 5: (5-1)\*(5-1)=16)

---

## 📝 Interview Tips

- 🎯 **Key observation:** `(a-1)(b-1)` tối đa khi cả `a` và `b` tối đa → tìm top 2 lớn nhất
- ⚡ **One-pass:** Chỉ cần 2 biến `first` và `second` — không cần sort
- 📊 **Sort approach:** Sort desc, lấy `[0]` và `[1]` — đơn giản nhưng O(n log n)
- 🪣 **Heap approach:** Dùng max-heap size 2 — overkill cho bài này nhưng hay cho follow-up top-k
- ⚠️ **Không phải tích thông thường:** Công thức là `(a-1)*(b-1)`, không phải `a*b` — đọc đề kỹ!
- 💡 **Follow-up:** "Tìm tích lớn nhất của k phần tử bất kỳ" → top-k với heap

---

## Solutions

### Solution 1: One-pass tracking of top 2

```typescript
/**
 * Single pass: track first and second largest values
 * Time: O(n)  Space: O(1)
 */
function maxProduct(nums: number[]): number {
  let first = 0,
    second = 0;
  for (const n of nums) {
    if (n >= first) {
      second = first;
      first = n;
    } else if (n > second) {
      second = n;
    }
  }
  return (first - 1) * (second - 1);
}

console.log(maxProduct([3, 4, 5, 2])); // 12
console.log(maxProduct([1, 5, 4, 5])); // 16
console.log(maxProduct([3, 7])); // 12
```

### Solution 2: Sort descending, take top 2

```typescript
/**
 * Sort desc, multiply the top 2 values (minus 1 each)
 * Time: O(n log n)  Space: O(1)
 */
function maxProductSort(nums: number[]): number {
  nums.sort((a, b) => b - a);
  return (nums[0] - 1) * (nums[1] - 1);
}

console.log(maxProductSort([3, 4, 5, 2])); // 12
console.log(maxProductSort([1, 5, 4, 5])); // 16
```

### Solution 3: Reduce — functional one-liner

```typescript
/**
 * Functional: reduce to find max, then find second max
 * Time: O(n)  Space: O(1)
 */
function maxProductFunctional(nums: number[]): number {
  const max1 = Math.max(...nums);
  const withoutMax = nums.filter((_, i) => i !== nums.indexOf(max1));
  const max2 = Math.max(...withoutMax);
  return (max1 - 1) * (max2 - 1);
}

console.log(maxProductFunctional([3, 4, 5, 2])); // 12
console.log(maxProductFunctional([1, 5, 4, 5])); // 16
```

---

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Connection            |
| --------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers/) | 🟢 Easy    | Top 3 values needed   |
| [Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)               | 🟡 Medium  | Top-k selection       |
| [Two Sum](https://leetcode.com/problems/two-sum/)                                                   | 🟢 Easy    | Two-element selection |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)                   | 🟡 Medium  | Heap for top-k        |
| [Sort Array by Parity](https://leetcode.com/problems/sort-array-by-parity/)                         | 🟢 Easy    | Selection after sort  |
