---
layout: page
title: "Intersection of Two Arrays"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/intersection-of-two-arrays"
---

# Intersection of Two Arrays / Giao Điểm Hai Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set / Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 12 companies
> **See also**: [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii) | [K-diff Pairs in an Array](https://leetcode.com/problems/k-diff-pairs-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có hai danh sách khách mời — tìm những người có mặt trong **cả hai** danh sách. Đánh dấu tất cả người từ danh sách A vào một Set, rồi quét danh sách B xem ai đã được đánh dấu.

**Pattern:** Hash Set → O(n+m). Khi mảng đã sắp xếp, two pointers tiết kiệm bộ nhớ hơn.

```
nums1 = [4, 9, 5]     nums2 = [9, 4, 9, 8, 4]
Set1  = {4, 9, 5}

Scan nums2:
  9 → in Set1? ✅ → add to result Set
  4 → in Set1? ✅ → add to result Set
  9 → already in result (Set deduplicates)
  8 → in Set1? ❌
  4 → already in result

Result = [9, 4]
```

---

Cho hai mảng số nguyên `nums1` và `nums2`, trả về **giao điểm** của chúng — mỗi phần tử trong kết quả phải là **duy nhất** và xuất hiện trong **cả hai** mảng. Kết quả có thể theo bất kỳ thứ tự nào.

- `nums1 = [1,2,2,1], nums2 = [2,2]` → `[2]`
- `nums1 = [4,9,5], nums2 = [9,4,9,8,4]` → `[9,4]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Set tự động dedup** — không cần kiểm tra trùng thủ công trong output
- 🇺🇸 **Two-set approach**: build Set from nums1, filter nums2 → clean one-liner
- 🇻🇳 **Khi mảng sorted**: two pointers tránh extra space, O(1) space nếu bỏ qua output
- 🇺🇸 **Binary search**: sort nums2, binary-search each element of nums1 → O(n log m)
- 🇻🇳 **Follow-up**: nếu mảng rất lớn không vừa RAM, dùng external sort + merge
- 🇺🇸 **Edge cases**: empty arrays, all duplicates, no common elements → empty result

---

## Solutions

### Solution 1: Two Sets — O(n+m) time, O(n+m) space

```typescript
/**
 * Build lookup set from nums1, iterate nums2 collecting matches (auto-deduped)
 * Time: O(n + m) | Space: O(n + m)
 */
function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const result = new Set<number>();

  for (const num of nums2) {
    if (set1.has(num)) {
      result.add(num); // Set deduplicates automatically
    }
  }

  return [...result];
}

// Tests
console.log(intersection([1, 2, 2, 1], [2, 2])); // [2]
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4])); // [9, 4]
console.log(intersection([], [1, 2])); // []
console.log(intersection([1], [1])); // [1]
```

### Solution 2: Sort + Two Pointers — O(n log n + m log m) time, O(1) extra space

```typescript
/**
 * Sort both arrays, advance pointers to find common elements without extra set
 * Time: O(n log n + m log m) | Space: O(1) extra (ignoring output)
 */
function intersectionTwoPointers(nums1: number[], nums2: number[]): number[] {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);

  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      // Only add if different from last element (dedup)
      if (result.length === 0 || result[result.length - 1] !== nums1[i]) {
        result.push(nums1[i]);
      }
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }

  return result;
}

console.log(intersectionTwoPointers([1, 2, 2, 1], [2, 2])); // [2]
console.log(intersectionTwoPointers([4, 9, 5], [9, 4, 9, 8, 4])); // [4, 9]
```

### Solution 3: Binary Search — O(n log m) time, O(n) space

```typescript
/**
 * Sort nums2, binary-search each unique element of nums1
 * Time: O(n log n + m log m) | Space: O(n) for dedup set
 */
function intersectionBinarySearch(nums1: number[], nums2: number[]): number[] {
  nums2.sort((a, b) => a - b);
  const seen = new Set<number>();
  const result: number[] = [];

  const binarySearch = (arr: number[], target: number): boolean => {
    let lo = 0,
      hi = arr.length - 1;
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (arr[mid] === target) return true;
      else if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  };

  for (const num of nums1) {
    if (!seen.has(num) && binarySearch(nums2, num)) {
      result.push(num);
      seen.add(num);
    }
  }

  return result;
}

console.log(intersectionBinarySearch([4, 9, 5], [9, 4, 9, 8, 4])); // [4, 9]
console.log(intersectionBinarySearch([1, 2, 2, 1], [2, 2])); // [1?, 2] → [2]
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                      | Difficulty | Pattern                    |
| -------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii) | 🟢 Easy    | Hash Map (keep duplicates) |
| [K-diff Pairs in an Array](https://leetcode.com/problems/k-diff-pairs-in-an-array)           | 🟡 Medium  | Hash Set                   |
| [Find Common Characters](https://leetcode.com/problems/find-common-characters)               | 🟢 Easy    | Frequency Array            |
