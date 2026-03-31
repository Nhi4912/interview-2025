---
layout: page
title: "Two Sum II - Input Array Is Sorted"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search]
leetcode_url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted"
---

# Two Sum II - Input Array Is Sorted / Hai Số Có Tổng Bằng Target trong Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [3Sum](https://leetcode.com/problems/3sum) | [4Sum](https://leetcode.com/problems/4sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như hai người đứng ở hai đầu chiếc cầu, mỗi người cầm một tờ tiền. Nếu tổng số tiền quá lớn, người bên phải (nhiều tiền hơn) bước vào giữa; nếu quá nhỏ, người bên trái bước vào. Vì mảng sorted, mỗi bước luôn loại bỏ được một khả năng.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair with target sum" → **Two Pointers từ hai đầu**
- Khác Two Sum I: không cần HashMap vì input đã sorted → O(n) time, O(1) space
- Return 1-indexed: đề yêu cầu `[index1+1, index2+1]`

**Visual — Two Pointers converging:**

```
numbers = [2, 7, 11, 15],  target = 9
           L            R

Step 1: 2 + 15 = 17 > 9 → R-- (giảm tổng)
           L     R
Step 2: 2 + 11 = 13 > 9 → R--
           LR
Step 3: 2 + 7  =  9 == target → return [1, 2] ✅

numbers = [2, 3, 4],  target = 6
           L      R
Step 1: 2 + 4 = 6 == target → return [1, 3] ✅
```

---

## Problem Description

Given a **1-indexed** array of integers `numbers` sorted in non-decreasing order, find two numbers such that they add up to `target`. Return `[index1, index2]` where `1 <= index1 < index2 <= numbers.length`. ([LeetCode 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted))

**Example 1:** `numbers = [2,7,11,15], target = 9` → `[1,2]`
**Example 2:** `numbers = [2,3,4], target = 6` → `[1,3]`

**Constraints:** `2 <= numbers.length <= 3×10⁴`, exactly one solution guaranteed, can't use same element twice.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "1-indexed hay 0-indexed? Đúng một đáp án?" / 1-indexed return? Exactly one solution?
2. **Brute force** / Thô: Nested loops O(n²) — nêu rồi nói "vì đã sorted, có cách O(n)"
3. **HashMap** / Hash: Dùng HashMap O(n) được nhưng tốn O(n) space — two pointers tốt hơn O(1)
4. **Move logic** / Logic di chuyển: Tổng > target → R-- (giảm); tổng < target → L++ (tăng)
5. **Guarantee** / Đảm bảo: Đề đảm bảo luôn có đáp án → loop sẽ không cạn mà luôn tìm thấy
6. **Extension** / Mở rộng: Bài này là building block cho 3Sum (fix one, two-pointer on rest)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check All Pairs
 * Time: O(n²) — nested loops
 * Space: O(1)
 */
function twoSumIIBrute(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        return [i + 1, j + 1]; // 1-indexed
      }
    }
  }
  return []; // unreachable (guaranteed solution)
}

/**
 * Solution 2: Binary Search per Element
 * Time: O(n log n) — for each element, binary search for complement
 * Space: O(1)
 */
function twoSumIIBinarySearch(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    let lo = i + 1,
      hi = numbers.length - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (numbers[mid] === complement) return [i + 1, mid + 1];
      else if (numbers[mid] < complement) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return [];
}

/**
 * Solution 3: Two Pointers (Optimal)
 * Time: O(n) — L and R converge, at most n steps
 * Space: O(1) — no extra data structures
 *
 * Works because array is sorted: sum too large → move R left (reduce),
 * sum too small → move L right (increase).
 */
function twoSumII(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // convert to 1-indexed
    } else if (sum < target) {
      left++; // need larger sum
    } else {
      right--; // need smaller sum
    }
  }

  return []; // guaranteed to find answer before here
}

// === Test Cases ===
console.log(twoSumII([2, 7, 11, 15], 9)); // [1, 2]
console.log(twoSumII([2, 3, 4], 6)); // [1, 3]
console.log(twoSumII([-1, 0], -1)); // [1, 2]
console.log(twoSumII([1, 2, 3, 4, 4, 9, 56, 90], 8)); // [4, 5]
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern                      | Difficulty |
| ------------------------------------------------------------------------------------ | ---------------------------- | ---------- |
| [Two Sum](https://leetcode.com/problems/two-sum)                                     | Hash Map                     | 🟢 Easy    |
| [3Sum](https://leetcode.com/problems/3sum)                                           | Two Pointers                 | 🟡 Medium  |
| [4Sum](https://leetcode.com/problems/4sum)                                           | Two Pointers                 | 🟡 Medium  |
| [3Sum Closest](https://leetcode.com/problems/3sum-closest)                           | Two Pointers                 | 🟡 Medium  |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) | Two Pointers / Binary Search | 🟡 Medium  |
