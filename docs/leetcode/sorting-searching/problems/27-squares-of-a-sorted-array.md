---
layout: page
title: "Squares of a Sorted Array"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/squares-of-a-sorted-array"
---

# Squares of a Sorted Array / Bình Phương của Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array) | [Sort Colors](https://leetcode.com/problems/sort-colors)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như hai vận động viên chạy từ hai đầu đường đua vào nhau — người có vận tốc (giá trị tuyệt đối) lớn hơn sẽ được xếp hạng trước. Ta điền bảng thành tích từ cuối lên đầu mà không cần sort lại.

**Pattern Recognition:**

- Signal: "sorted array with negatives" + "return sorted squares" → **Two Pointers từ hai đầu**
- Điểm mấu chốt: giá trị bình phương lớn nhất luôn nằm ở một trong hai đầu mảng
- Điền kết quả từ cuối về đầu — tránh O(n log n) sort

**Visual — Two Pointers fill from back:**

```
Input: [-4, -1, 0, 3, 10]
        L               R     pos = 4

Step 1: 16  vs  100  → 100 wins → result[4]=100, R--
        L           R
Step 2: 16  vs   9  →  16 wins → result[3]=16,  L++
            L    R
Step 3:  1  vs   9  →   9 wins → result[2]=9,   R--
            L  R
Step 4:  1  vs   0  →   1 wins → result[1]=1,   L++
               LR
Step 5: L==R → result[0]= 0²=0
Output: [0, 1, 9, 16, 100] ✅
```

---

## Problem Description

Given an integer array `nums` sorted in non-decreasing order (may contain negatives), return an array of the **squares of each number** sorted in non-decreasing order. ([LeetCode 977](https://leetcode.com/problems/squares-of-a-sorted-array))

**Example 1:** `nums = [-4,-1,0,3,10]` → `[0,1,9,16,100]`
**Example 2:** `nums = [-7,-3,2,3,11]` → `[4,9,9,49,121]`

**Constraints:** `1 <= nums.length <= 10⁴`, `-10⁴ <= nums[i] <= 10⁴`, `nums` is sorted non-decreasing.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Mảng đã sorted? Có số âm không?" / Confirm sorted input, negatives allowed
2. **Brute force** / Thô: Square all + `.sort()` — O(n log n), nói trước để show structured thinking
3. **Insight** / Điểm mấu chốt: Giá trị lớn nhất luôn ở hai đầu → Two Pointers O(n)
4. **Direction** / Hướng đi: Điền result từ vị trí cuối ngược về đầu, tránh dịch chuyển phần tử
5. **Edge cases** / Biên: Toàn âm `[-5,-3,-1]`, toàn dương `[1,2,3]`, một phần tử `[0]`
6. **Follow-up** / Câu hỏi thêm: "Nếu không sorted thì sao?" — vẫn square + sort, O(n log n)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Square then Sort
 * Time: O(n log n) — sort dominates
 * Space: O(n) — output array
 */
function sortedSquaresBrute(nums: number[]): number[] {
  return nums.map((x) => x * x).sort((a, b) => a - b);
}

/**
 * Solution 2: Optimal — Two Pointers (fill from back)
 * Time: O(n) — single pass, no extra sort needed
 * Space: O(n) — output array only (no extra structures)
 *
 * Key insight: the largest square is always at one of the two ends
 * because the array is sorted and negatives square to large positives.
 */
function sortedSquares(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n);
  let left = 0;
  let right = n - 1;
  let pos = n - 1; // fill result from the end

  while (left <= right) {
    const leftSq = nums[left] * nums[left];
    const rightSq = nums[right] * nums[right];

    if (leftSq > rightSq) {
      result[pos--] = leftSq;
      left++;
    } else {
      // rightSq >= leftSq: pick right (handles equal case too)
      result[pos--] = rightSq;
      right--;
    }
  }

  return result;
}

// === Test Cases ===
console.log(sortedSquares([-4, -1, 0, 3, 10])); // [0, 1, 9, 16, 100]
console.log(sortedSquares([-7, -3, 2, 3, 11])); // [4, 9, 9, 49, 121]
console.log(sortedSquares([-5, -3, -1])); // [1, 9, 25]
console.log(sortedSquares([1, 2, 3])); // [1, 4, 9]
console.log(sortedSquares([0])); // [0]
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern      | Difficulty |
| ------------------------------------------------------------------------------------ | ------------ | ---------- |
| [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array)               | Two Pointers | 🟢 Easy    |
| [Sort Colors](https://leetcode.com/problems/sort-colors)                             | Two Pointers | 🟡 Medium  |
| [3Sum](https://leetcode.com/problems/3sum)                                           | Two Pointers | 🟡 Medium  |
| [Container With Most Water](https://leetcode.com/problems/container-with-most-water) | Two Pointers | 🟡 Medium  |
| [Reverse String](https://leetcode.com/problems/reverse-string)                       | Two Pointers | 🟢 Easy    |
