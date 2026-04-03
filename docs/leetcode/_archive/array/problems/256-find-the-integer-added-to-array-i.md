---
layout: page
title: "Find the Integer Added to Array I"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/find-the-integer-added-to-array-i"
---

# Find the Integer Added to Array I / Tìm Số Nguyên Được Thêm Vào Mảng I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Một lớp học đo chiều cao lần 1 (nums1) rồi lần 2 (nums2). Ai cũng lớn thêm đúng x cm. Để biết x, chỉ cần lấy chiều cao thấp nhất lần 2 trừ đi chiều cao thấp nhất lần 1 — vì người thấp nhất vẫn là người thấp nhất, chênh lệch chính là x.

**Pattern Recognition:**

- Signal: "all elements of nums2 = nums1[i] + x for same x" → **min(nums2) - min(nums1)**
- Key insight: cùng một x được cộng vào tất cả phần tử → hiệu của minimums = x (minimum giữ nguyên vị trí)

**Visual — nums1=[2,6,4], nums2=[9,7,5]:**

```
nums1 sorted: [2, 4, 6]
nums2 sorted: [5, 7, 9]

x = min(nums2) - min(nums1)
  = 5 - 2 = 3

Verify: 2+3=5 ✓, 4+3=7 ✓, 6+3=9 ✓
```

---

## 📝 Problem Description

Given two arrays `nums1` and `nums2` of equal length. There exists an integer `x` such that `nums2[i] = nums1[i] + x` for every index. Return the integer `x`.

**Example 1:** `nums1=[2,6,4], nums2=[9,7,5]` → `3`
**Example 2:** `nums1=[10], nums2=[5]` → `-5`

**Constraints:** `1 ≤ nums1.length ≤ 100`, `-1000 ≤ nums1[i], nums2[i] ≤ 1000`

---

## 🎯 Interview Tips

1. **One-liner insight** / Một dòng giải: `x = min(nums2) - min(nums1)` — cực đơn giản
2. **Why min?** / Tại sao min?: cùng một x cộng vào mọi phần tử → min của hai mảng chênh lệch đúng x
3. **Could use any index** / Có thể dùng bất kỳ chỉ số: `nums2[0] - nums1[0]` cũng đúng (vì tất cả bằng x)
4. **Sorted approach** / Cách dùng sort: sort cả hai → `nums2_sorted[0] - nums1_sorted[0]`
5. **Negative x** / x âm: x có thể âm nếu nums2 nhỏ hơn nums1 → không cần xử lý đặc biệt
6. **Verify approach** / Kiểm tra: có thể verify bằng cách check tất cả `nums2[i] - nums1[i]` bằng nhau

---

## 💡 Solutions

### Approach 1: Check All Differences — Brute Force

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function findIntegerAddedBrute(nums1: number[], nums2: number[]): number {
  const x = nums2[0] - nums1[0];
  // Verify all differences are equal (guaranteed by problem, but good practice)
  for (let i = 1; i < nums1.length; i++) {
    if (nums2[i] - nums1[i] !== x) return -1; // invalid input guard
  }
  return x;
}
```

### Approach 2: Min Difference — Optimal O(n)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function addedInteger(nums1: number[], nums2: number[]): number {
  // x = min(nums2) - min(nums1)
  const min1 = Math.min(...nums1);
  const min2 = Math.min(...nums2);
  return min2 - min1;
}
```

### Approach 3: Sort + Compare — Alternative

/\*_ @complexity Time: O(n log n) | Space: O(n) _/

```typescript
function addedIntegerSort(nums1: number[], nums2: number[]): number {
  const s1 = [...nums1].sort((a, b) => a - b);
  const s2 = [...nums2].sort((a, b) => a - b);
  return s2[0] - s1[0]; // minimum of sorted arrays
}
```

---

## 🧪 Test Cases

```typescript
console.log(addedInteger([2, 6, 4], [9, 7, 5])); // → 3
console.log(addedInteger([10], [5])); // → -5
console.log(addedInteger([-3, -1, -2], [0, 2, 1])); // → 3
console.log(addedInteger([0], [0])); // → 0
console.log(addedIntegerSort([2, 6, 4], [9, 7, 5])); // → 3
```

---

## Related Problems

| Problem                                                                                                | Difficulty | Pattern |
| ------------------------------------------------------------------------------------------------------ | ---------- | ------- |
| [Find the Integer Added to Array II](https://leetcode.com/problems/find-the-integer-added-to-array-ii) | Medium     | Sorting |
| [Find the Difference](https://leetcode.com/problems/find-the-difference)                               | Easy       | XOR/Sum |
| [Missing Number](https://leetcode.com/problems/missing-number)                                         | Easy       | Math    |
