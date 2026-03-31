---
layout: page
title: "Keep Multiplying Found Values by Two"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Simulation]
leetcode_url: "https://leetcode.com/problems/keep-multiplying-found-values-by-two"
---

# Keep Multiplying Found Values by Two / Liên Tục Nhân Đôi Giá Trị Tìm Thấy

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting + Simulation
> **Frequency**: 📗 Tier 3 — Bài khởi động, nền tảng về hash set
> **See also**: [Contains Duplicate](https://leetcode.com/problems/contains-duplicate) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn chơi trò tìm kiếm trong danh sách: bắt đầu với giá trị `original`. Nếu tìm thấy trong danh sách, nhân đôi và tìm tiếp. Cứ như vậy cho đến khi không tìm thấy. Dùng Set để tìm kiếm O(1) thay vì O(n) mỗi lần. Không cần sort — Set là đủ.

**Pattern Recognition:**

- Signal: "find in array, if found multiply by 2" → **Hash Set simulation**
- Convert arr to Set → O(1) lookup per step
- Vòng lặp dừng khi giá trị không có trong Set

**Visual — nums=[5,3,6,1,12], original=3:**

```
Set = {1,3,5,6,12}

original=3:  3 in Set? YES -> 3*2=6
original=6:  6 in Set? YES -> 6*2=12
original=12: 12 in Set? YES -> 12*2=24
original=24: 24 in Set? NO  -> return 24 ✅
```

---

## Problem Description

Given integer array `nums` and integer `original`, repeatedly: if `original` exists in `nums`, multiply it by 2. Return the final value of `original`.

```
Example 1: nums=[5,3,6,1,12], original=3  -> 24
Example 2: nums=[2,7,9], original=4       -> 4
Example 3: nums=[1,2,4,8], original=1     -> 16
```

---

## 📝 Interview Tips

1. **Set vs Sort**: Sort + binary search O(n log n) vs Set O(n) — Set thắng
2. **Khi nào dừng?** Khi original không có trong Set — đây là điều kiện dừng đơn giản
3. **Overflow?** Với n <= 1000 và giá trị <= 1000, max = 1000 * 2^1000 — cần BigInt? Không! Giá trị nums <= 1000, original <= 1000, và sau tối đa ~10 bước sẽ vượt max của nums
4. **Approach với sort**: Sort arr, dùng binary search cho từng lookup — O(n log n + k log n)
5. **Hỏi follow-up**: "Nếu divide by 2 thay vì multiply?" → Tương tự, chú ý odd numbers
6. **Complexity**: Time O(n + log(maxVal)), Space O(n)

---

## Solutions

```typescript
/**
 * Solution 1: Hash Set (Optimal)
 * Time O(n + log(maxVal)), Space O(n)
 *
 * Build a Set for O(1) lookup. Keep multiplying while value exists.
 * Max iterations bounded: once original > max(nums), loop ends.
 */
function findFinalValue(nums: number[], original: number): number {
  const set = new Set(nums);
  while (set.has(original)) {
    original *= 2;
  }
  return original;
}

/**
 * Solution 2: Sort + Binary Search
 * Time O(n log n + k * log n), Space O(1) extra
 *
 * Sort arr, then binary search for each value of original.
 */
function findFinalValue2(nums: number[], original: number): number {
  nums.sort((a, b) => a - b);

  const binarySearch = (target: number): boolean => {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] === target) return true;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  };

  while (binarySearch(original)) {
    original *= 2;
  }
  return original;
}

/**
 * Solution 3: Simulation with sorted array (straightforward)
 * Time O(n log n), Space O(1)
 *
 * Sort + linear scan — readable, slightly less optimal than Set.
 */
function findFinalValue3(nums: number[], original: number): number {
  nums.sort((a, b) => a - b);
  for (const num of nums) {
    if (num === original) original *= 2;
  }
  return original;
}

// --- Quick inline tests ---
console.log(findFinalValue([5, 3, 6, 1, 12], 3));   // 24
console.log(findFinalValue([2, 7, 9], 4));           // 4
console.log(findFinalValue([1, 2, 4, 8], 1));        // 16
console.log(findFinalValue2([5, 3, 6, 1, 12], 3));  // 24
console.log(findFinalValue3([5, 3, 6, 1, 12], 3));  // 24
console.log(findFinalValue([], 5));                  // 5
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [2doubles. Keep Multiplying Found Values by Two](https://leetcode.com/problems/keep-multiplying-found-values-by-two/) | This problem |
| [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Hash set membership test |
| [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | Finding specific values in array |
| [202. Happy Number](https://leetcode.com/problems/happy-number/) | Repeated transformation until condition |
| [771. Jewels and Stones](https://leetcode.com/problems/jewels-and-stones/) | Hash set lookup pattern |
