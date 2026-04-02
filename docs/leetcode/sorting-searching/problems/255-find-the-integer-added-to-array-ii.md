---
layout: page
title: "Find the Integer Added to Array II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting, Enumeration]
leetcode_url: "https://leetcode.com/problems/find-the-integer-added-to-array-ii"
---

# Find the Integer Added to Array II / Tìm Số Nguyên Được Thêm Vào Mảng II

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Enumeration + Two Pointers
> **Frequency**: ★★☆ Occasional — gặp ở các round về array manipulation
> **See also**: [3Sum](https://leetcode.com/problems/3sum/) | [Find the Integer Added to Array I](https://leetcode.com/problems/find-the-integer-added-to-array-i/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là thám tử đang so sánh hai danh sách hàng hoá trong kho. Danh sách thứ hai là danh sách thứ nhất đã cộng thêm một khoản phụ phí bí ẩn x — nhưng có đúng hai mặt hàng đã bị rút ra trước khi điều chỉnh giá. Vì sau khi sắp xếp, phần tử đầu tiên của nums2 bắt buộc phải tương ứng với một trong ba phần tử đầu của nums1 (sau khi bỏ 2 cái), bạn chỉ cần thử 3 ứng viên cho x, rồi xác nhận từng ứng viên bằng two pointers.

**Pattern Recognition:**

- Signal: "remove exactly 2 elements" + "same difference throughout" → **Enumeration + Two Pointers**
- Bài này thuộc dạng liệt kê các cặp phần tử bị loại, sau đó kiểm tra bằng hai con trỏ
- Key insight: Sau khi sort, `x = nums2[0] - nums1[i]` với `i ∈ {0,1,2}` — chỉ 3 ứng viên cần xét

**Visual — Enumeration example:**

```
nums1 sorted: [4,  8, 12, 16, 20]
nums2 sorted: [14, 18, 22]

Try skip nums1[0]=4, nums1[1]=8:  kept=[12,16,20]
  x = 14-12 = 2  →  [12,16,20]+2 = [14,18,22] ✓  ans=2

Try skip nums1[0]=4, nums1[2]=12: kept=[8,16,20]
  x = 14-8 = 6   →  [8,16,20]+6  = [14,22,26] ✗

Try skip nums1[1]=8, nums1[2]=12: kept=[4,16,20]
  x = 14-4 = 10  →  [4,16,20]+10 = [14,26,30] ✗

Answer: minimum valid x = 2
```

---

## Problem Description

Given two integer arrays `nums1` and `nums2`, `nums2` is formed by adding integer `x` to every element of `nums1` after removing exactly 2 elements. Return the **minimum possible** value of `x`. ([LeetCode](https://leetcode.com/problems/find-the-integer-added-to-array-ii))

```
Example 1: nums1=[4,20,16,12,8], nums2=[14,18,22]  → 2
Example 2: nums1=[3,2,1],        nums2=[7,9]        → 8
```

Constraints: `3 <= nums1.length <= 200`, `nums2.length == nums1.length - 2`, values in `[-10^6, 10^6]`

---

## 📝 Interview Tips

1. **Sort both arrays first** — _Sắp xếp cả hai mảng để việc đối chiếu trở nên tuần tự và có thể dùng two pointers_
2. **Only 3 candidate values for x** — _x chỉ có thể bằng nums2[0] - nums1[i] với i ∈ {0,1,2} sau khi sort_
3. **Validate each candidate with two pointers, allow ≤ 2 skips** — _Dùng hai con trỏ, cho phép bỏ qua tối đa 2 phần tử của nums1_
4. **Return the minimum among valid candidates** — _Trong số ứng viên hợp lệ, trả về x nhỏ nhất_
5. **Watch the skip counter boundary** — _Đếm số phần tử bị bỏ qua phải ≤ 2, không phải < 2_
6. **Time O(n log n), Space O(1)** — _Chỉ cần sắp xếp, không cần bộ nhớ phụ_

---

## Solutions

```typescript
/** Solution 1: Brute Force — try all C(n,2) pairs @complexity Time: O(n³) | Space: O(n) */
function minimumAddedIntegerBrute(nums1: number[], nums2: number[]): number {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const n = nums1.length;
  let ans = Infinity;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const kept = nums1.filter((_, idx) => idx !== i && idx !== j);
      const x = nums2[0] - kept[0];
      if (kept.every((v, k) => v + x === nums2[k])) ans = Math.min(ans, x);
    }
  }
  return ans;
}

/** Solution 2: Enumeration + Two Pointers @complexity Time: O(n log n) | Space: O(1) */
function minimumAddedInteger(nums1: number[], nums2: number[]): number {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  const n2 = nums2.length;

  const isValid = (x: number): boolean => {
    let j = 0,
      skipped = 0;
    for (let i = 0; i < nums1.length && j < n2; i++) {
      if (nums1[i] + x === nums2[j]) {
        j++;
      } else {
        if (++skipped > 2) return false;
      }
    }
    return j === n2;
  };

  let ans = Infinity;
  // After removing 2 elements, one of nums1[0..2] must map to nums2[0]
  for (let i = 0; i <= 2; i++) {
    const x = nums2[0] - nums1[i];
    if (isValid(x)) ans = Math.min(ans, x);
  }
  return ans;
}

// === Test Cases ===
console.log(minimumAddedInteger([4, 20, 16, 12, 8], [14, 18, 22])); // 2
console.log(minimumAddedInteger([3, 2, 1], [7, 9])); // 8
console.log(minimumAddedInteger([1, 2, 3, 4, 5], [4, 5, 6])); // 3
```

---

## 🔗 Related Problems

| #   | Problem                                                                                               | Difficulty | Pattern      |
| --- | ----------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| 1   | [Two Sum](https://leetcode.com/problems/two-sum/)                                                     | Easy       | Hash Table   |
| 2   | [3Sum](https://leetcode.com/problems/3sum/)                                                           | Medium     | Two Pointers |
| 3   | [Find the Integer Added to Array I](https://leetcode.com/problems/find-the-integer-added-to-array-i/) | Easy       | Sorting      |
| 4   | [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/)         | Easy       | Two Pointers |
