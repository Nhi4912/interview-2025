---
layout: page
title: "Search Insert Position"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/search-insert-position"
---

# Search Insert Position / Tìm Vị Trí Chèn

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn cần chèn một cuốn sách vào kệ đã sắp thứ tự. Thay vì dò từng ô, bạn mở kệ ở giữa, so sánh tên sách, rồi quyết định đi nửa trái hay phải — như tra từ điển.

**Pattern:** "Leftmost binary search" — khi vòng lặp kết thúc, `lo` luôn hội tụ về đúng vị trí dù target có tồn tại hay không.

```
nums = [1, 3, 5, 6], target = 5
lo=0  hi=3  mid=1 → nums[1]=3 < 5 → lo=2
lo=2  hi=3  mid=2 → nums[2]=5 = 5 → return 2 ✅

nums = [1, 3, 5, 6], target = 2
lo=0  hi=3  mid=1 → nums[1]=3 > 2 → hi=0
lo=0  hi=0  mid=0 → nums[0]=1 < 2 → lo=1
lo=1 > hi=0 → loop ends → return lo=1 ✅ (insert between 1 and 3)
```

---

Cho mảng **đã sắp xếp tăng dần** `nums` và số nguyên `target`. Trả về **chỉ số** của target nếu tồn tại, hoặc **chỉ số nơi sẽ chèn** để giữ thứ tự sắp xếp. Yêu cầu O(log n).

- `nums = [1,3,5,6], target = 5` → `2`
- `nums = [1,3,5,6], target = 2` → `1`
- `nums = [1,3,5,6], target = 7` → `4`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **`lo` là câu trả lời**: khi vòng lặp kết thúc, `lo` chính xác bằng vị trí chèn
- 🇺🇸 **Invariant**: elements before `lo` are < target; elements from `hi+1` onward are ≥ target
- 🇻🇳 **Đây là `lower_bound`** của C++ STL — vị trí đầu tiên có `nums[i] >= target`
- 🇺🇸 **Overflow-safe mid**: use `lo + ((hi - lo) >> 1)` instead of `(lo + hi) / 2`
- 🇻🇳 **Linear scan** O(n) cũng đúng nhưng interviewer sẽ yêu cầu tối ưu ngay
- 🇺🇸 **Template to memorize**: `while (lo <= hi)` + `lo = mid+1` / `hi = mid-1` → return `lo`

---

## Solutions

### Solution 1: Linear Scan — O(n) time, O(1) space

```typescript
/**
 * Scan left-to-right, return first index where nums[i] >= target
 * Time: O(n) | Space: O(1)
 */
function searchInsertLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= target) return i;
  }
  return nums.length; // target larger than all elements → append at end
}

// Tests
console.log(searchInsertLinear([1, 3, 5, 6], 5)); // 2
console.log(searchInsertLinear([1, 3, 5, 6], 2)); // 1
console.log(searchInsertLinear([1, 3, 5, 6], 7)); // 4
console.log(searchInsertLinear([1, 3, 5, 6], 0)); // 0
```

### Solution 2: Binary Search — O(log n) time, O(1) space ✅ Optimal

```typescript
/**
 * Classic leftmost binary search — lo converges to the insert/found position
 * Time: O(log n) | Space: O(1)
 */
function searchInsert(nums: number[], target: number): number {
  let lo = 0,
    hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // lo is the insertion point: first index where nums[lo] >= target
  return lo;
}

// Tests
console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
console.log(searchInsert([1, 3, 5, 6], 0)); // 0
console.log(searchInsert([1], 0)); // 0
console.log(searchInsert([1], 2)); // 1
console.log(searchInsert([3, 5, 7, 9], 6)); // 2  (between 5 and 7)
console.log(searchInsert([3, 5, 7, 9], 3)); // 0  (exact match first elem)
console.log(searchInsert([3, 5, 7, 9], 9)); // 3  (exact match last elem)
```

> **Pattern reminder:** This is the standard `lower_bound` template. Memorize it — it reappears
> verbatim in First Bad Version, Koko Eating Bananas, and every "binary search on answer" problem.
> The invariant: after the loop, `lo` is the smallest index where `nums[lo] >= target`.

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                               | Difficulty | Pattern                 |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | 🟡 Medium  | Binary search bounds    |
| [First Bad Version](https://leetcode.com/problems/first-bad-version)                                                  | 🟢 Easy    | Same leftmost pattern   |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                              | 🟡 Medium  | Binary search on answer |
