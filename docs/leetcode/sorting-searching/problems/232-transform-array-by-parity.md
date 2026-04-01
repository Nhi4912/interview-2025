---
layout: page
title: "Transform Array by Parity"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/transform-array-by-parity"
---

# Transform Array by Parity / Biến Đổi Mảng Theo Chẵn Lẻ

> **Track**: Sorting-Searching | **Difficulty**: 🟢 Easy | **Pattern**: Sorting / Counting
> **Frequency**: 📘 Tier 3 — Warm-up interview question
> **See also**: [Sort Array by Parity](https://leetcode.com/problems/sort-array-by-parity) | [Separate the Digits in an Array](https://leetcode.com/problems/separate-the-digits-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp hàng ở siêu thị — tất cả người có số chẵn (ưu tiên) đứng trước, xếp nhỏ→lớn; người số lẻ đứng sau, xếp lớn→nhỏ.

**Pattern Recognition:**

- Signal: "group + sort within group" → **Partition + Sort**
- Key insight: Tách mảng thành 2 nhóm, sort riêng từng nhóm, ghép lại.

**Visual — nums=[4,1,2,3]:**

```
Input:  [4, 1, 2, 3]
         ↓  ↓  ↓  ↓
Evens:  [4, 2]  → sort asc  → [2, 4]
Odds:   [1, 3]  → sort desc → [3, 1]
         └──────────────────────────┘
Output: [2, 4, 3, 1]

Counting approach (no sort needed for odds/evens separately):
countEven=2 → fill indices 0,2,4... with 0,2,4...
countOdd=2  → fill descending from largest odd
```

---

## Problem Description

Given integer array `nums`, return a new array where:

- All **even** numbers appear first, sorted in **ascending** order
- All **odd** numbers appear after, sorted in **descending** order

**Example 1:**

```
Input:  nums = [4, 1, 2, 3]
Output: [2, 4, 3, 1]
Explanation: evens sorted asc=[2,4], odds sorted desc=[3,1]
```

**Example 2:**

```
Input:  nums = [2, 1, 4, 3, 6, 5]
Output: [2, 4, 6, 5, 3, 1]
```

**Example 3:**

```
Input:  nums = [1, 3]
Output: [3, 1]   (no evens, odds desc)
```

**Constraints:**

- `1 ≤ nums.length ≤ 100`
- `0 ≤ nums[i] ≤ 100`

---

## 📝 Interview Tips

1. **Phân tách rõ ràng** — Tách evens/odds ra trước, sort riêng từng nhóm, rồi concat. / Separate into two groups first, sort each independently, then concatenate.
2. **Sort order khác nhau** — Evens tăng dần, odds giảm dần — đừng nhầm lẫn chiều sort. / Different sort orders for each group — don't confuse ascending vs descending.
3. **Counting approach** — Vì giá trị ≤ 100, có thể đếm và fill trực tiếp thay vì sort thực sự. / Since values ≤ 100, use counting sort O(n+k) instead of comparison sort.
4. **In-place vs new array** — Bài yêu cầu return new array, không cần in-place. / Problem asks for new array, no need to sort in-place.
5. **Edge cases** — All even, all odd, single element — đều handled bởi concat logic. / All even, all odd, or single element — all handled naturally by concat.
6. **Độ phức tạp** — Split+sort O(n log n); counting O(n+k) với k=max value — cả hai chấp nhận được với n≤100. / Split+sort O(n log n); counting O(n+k) — both fine for n≤100.

---

## Solutions

```typescript
/**
 * Approach 1: Split + Sort
 * Time: O(n log n)  Space: O(n)
 */
function transformArrayByParitySplit(nums: number[]): number[] {
  const evens = nums.filter((x) => x % 2 === 0).sort((a, b) => a - b);
  const odds = nums.filter((x) => x % 2 !== 0).sort((a, b) => b - a);
  return [...evens, ...odds];
}

/**
 * Approach 2: Counting Sort (O(n + k))
 * Time: O(n + k)  Space: O(k) where k = max value (≤ 100)
 *
 * Since values are bounded [0, 100]:
 *  - Count frequency of each value
 *  - Fill result: iterate 0,2,4..100 ascending for evens
 *  - Then iterate 99,97...1 descending for odds
 */
function transformArrayByParity(nums: number[]): number[] {
  const MAX = 101;
  const count = new Array<number>(MAX).fill(0);
  for (const x of nums) count[x]++;

  const result: number[] = [];

  // Evens ascending: 0, 2, 4, ..., 100
  for (let v = 0; v < MAX; v += 2) {
    for (let c = 0; c < count[v]; c++) result.push(v);
  }
  // Odds descending: 99, 97, ..., 1
  for (let v = MAX - 2; v >= 1; v -= 2) {
    for (let c = 0; c < count[v]; c++) result.push(v);
  }

  return result;
}

// Tests
console.log(transformArrayByParity([4, 1, 2, 3])); // [2, 4, 3, 1]
console.log(transformArrayByParity([2, 1, 4, 3, 6, 5])); // [2, 4, 6, 5, 3, 1]
console.log(transformArrayByParity([1, 3])); // [3, 1]
console.log(transformArrayByParity([2])); // [2]
console.log(transformArrayByParitySplit([4, 1, 2, 3])); // [2, 4, 3, 1]
```

---

## 🔗 Related Problems

- [905. Sort Array by Parity](https://leetcode.com/problems/sort-array-by-parity) — evens before odds, no ordering within groups
- [922. Sort Array by Parity II](https://leetcode.com/problems/sort-array-by-parity-ii) — alternate even/odd positions
- [75. Sort Colors](https://leetcode.com/problems/sort-colors) — 3-way partition / Dutch National Flag
- [1636. Sort Array by Increasing Frequency](https://leetcode.com/problems/sort-array-by-increasing-frequency) — custom comparator sort
- [2164. Sort Even and Odd Indices Independently](https://leetcode.com/problems/sort-even-and-odd-indices-independently) — same partition+sort idea
