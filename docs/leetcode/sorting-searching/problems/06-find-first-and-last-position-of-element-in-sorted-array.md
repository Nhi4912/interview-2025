---
layout: page
title: "Find First and Last Position of Element in Sorted Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array"
---

# Find First and Last Position of Element in Sorted Array / Tìm Vị Trí Đầu và Cuối Trong Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dual Binary Search (leftmost + rightmost)
> **Frequency**: ⭐ Tier 2 — Gặp ở 30+ companies
> **See also**: [Search Insert Position](https://leetcode.com/problems/search-insert-position) | [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tìm tên "Nguyễn Văn A" trong danh bạ điện thoại đã sắp thứ tự. Bạn mở tới trang "Nguyễn", rồi **tiếp tục sang trái** để tìm trang đầu tiên có tên đó, và **tiếp tục sang phải** để tìm trang cuối cùng — hai lần tìm kiếm nhị phân riêng biệt.

- **Pattern Recognition:**
  - Signal: "sorted array" + "find range/boundary" → **Two binary searches**
  - Lần 1: Tìm leftmost — khi tìm thấy target, tiếp tục tìm sang trái (`right = mid - 1`)
  - Lần 2: Tìm rightmost — khi tìm thấy target, tiếp tục tìm sang phải (`left = mid + 1`)

- **Visual — nums = [5, 7, 7, 8, 8, 10], target = 8:**

```
Find LEFT boundary:
  lo=0 hi=5 → mid=2, nums[2]=7 < 8 → lo=3
  lo=3 hi=5 → mid=4, nums[4]=8 = 8 → result=4, hi=3
  lo=3 hi=3 → mid=3, nums[3]=8 = 8 → result=3, hi=2
  lo=3 > hi=2 → stop. Left = 3

Find RIGHT boundary:
  lo=0 hi=5 → mid=2, nums[2]=7 < 8 → lo=3
  lo=3 hi=5 → mid=4, nums[4]=8 = 8 → result=4, lo=5
  lo=5 hi=5 → mid=5, nums[5]=10 > 8 → hi=4
  lo=5 > hi=4 → stop. Right = 4

Answer: [3, 4] ✓
```

---

## Problem Description

Given a sorted array of integers `nums` and a `target`, find the **starting and ending positions** of `target`.
If not found, return `[-1, -1]`. Must run in O(log n).

```
Input:  nums=[5,7,7,8,8,10], target=8  → [3,4]
Input:  nums=[5,7,7,8,8,10], target=6  → [-1,-1]
Input:  nums=[], target=0              → [-1,-1]
```

Constraints: `0 ≤ nums.length ≤ 10^5`, values fit in 32-bit int.

---

## 📝 Interview Tips

1. **Hai binary search riêng biệt**: Một cho left bound, một cho right bound — code ngắn gọn hơn dùng flag / **Two separate searches**: cleaner than one search with a flag
2. **Left bound**: Khi `nums[mid] === target`, lưu lại và tiếp tục `hi = mid - 1` / **Left search**: on match, record and keep searching left
3. **Right bound**: Khi `nums[mid] === target`, lưu lại và tiếp tục `lo = mid + 1` / **Right search**: on match, record and keep searching right
4. **Trả về [-1,-1] nếu không tìm thấy**: Check sau khi tìm left / **Early exit**: check left result before running right search
5. **Overflow**: Dùng `lo + Math.floor((hi - lo) / 2)` thay vì `(lo + hi) / 2` / **Overflow safe**: use `lo + (hi - lo >> 1)` for mid calculation

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Time: O(n) | Space: O(1)
 */
function searchRangeBrute(nums: number[], target: number): number[] {
  let left = -1,
    right = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (left === -1) left = i;
      right = i;
    }
  }
  return [left, right];
}

/**
 * Solution 2: Dual Binary Search (Optimal)
 * Time: O(log n) | Space: O(1)
 */
function searchRange(nums: number[], target: number): number[] {
  function findBound(isLeft: boolean): number {
    let lo = 0,
      hi = nums.length - 1,
      bound = -1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isLeft)
          hi = mid - 1; // keep searching left
        else lo = mid + 1; // keep searching right
      } else if (nums[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return bound;
  }

  const left = findBound(true);
  if (left === -1) return [-1, -1]; // target not in array
  return [left, findBound(false)];
}

// === Test Cases ===
console.log(JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 8))); // [3,4]
console.log(JSON.stringify(searchRange([5, 7, 7, 8, 8, 10], 6))); // [-1,-1]
console.log(JSON.stringify(searchRange([], 0))); // [-1,-1]
console.log(JSON.stringify(searchRange([1], 1))); // [0,0]
console.log(JSON.stringify(searchRange([2, 2], 2))); // [0,1]
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                    |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Search Insert Position](https://leetcode.com/problems/search-insert-position)                           | Single binary search for leftmost position      |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                     | Binary search on unsorted but unimodal array    |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                 | Binary search on answer space, not direct array |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) | Uses lower/upper bound concepts                 |
