---
layout: page
title: "Find Peak Element"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-peak-element"
---

# Find Peak Element / Tìm Phần Tử Đỉnh

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Unsorted Array
> **Frequency**: 📘 Tier 3 — Gặp ở 18 companies
> **See also**: [Find Peak Index in Mountain Array](https://leetcode.com/problems/find-peak-index-in-a-mountain-array) | [Find a Peak Element II](https://leetcode.com/problems/find-a-peak-element-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng bạn đang leo núi trong sương mù — bạn không thấy toàn bộ dãy núi nhưng bạn biết mình đang đi lên hay đi xuống. Nếu bước tiếp theo đi xuống, thì đỉnh phải ở phía sau (hoặc ngay đây). Đây chính xác là cách binary search hoạt động trên mảng không cần sorted — theo dõi _hướng dốc_ thay vì so sánh giá trị.

**Pattern Recognition:**

- Signal: "find any peak" + "O(log n)" → **Binary Search on slope direction**
- Vì `nums[-1] = nums[n] = -∞`, đỉnh được đảm bảo tồn tại ở bất kỳ đâu
- Nếu `nums[mid] < nums[mid+1]` → đang đi lên → peak ở phía phải (right half)
- Nếu `nums[mid] > nums[mid+1]` → đang đi xuống → peak ở phía trái (bao gồm mid)

**Visual — Binary Search on [1, 2, 1, 3, 5, 6, 4]:**

```
nums: [1,  2,  1,  3,  5,  6,  4]
idx:   0   1   2   3   4   5   6

Step 1: lo=0, hi=6, mid=3, nums[3]=3, nums[4]=5
        nums[mid] < nums[mid+1] → slope going UP → peak in right half
        lo = mid+1 = 4

Step 2: lo=4, hi=6, mid=5, nums[5]=6, nums[6]=4
        nums[mid] > nums[mid+1] → slope going DOWN → peak in left half (incl mid)
        hi = mid = 5

Step 3: lo=4, hi=5, mid=4, nums[4]=5, nums[5]=6
        nums[mid] < nums[mid+1] → going UP → lo = mid+1 = 5

Step 4: lo=5 == hi=5 → return 5 ✅ (nums[5]=6 is peak)
```

---

## Problem Description

Given a 0-indexed array `nums` where `nums[i] ≠ nums[i+1]`, find a peak element and return its index. A peak is an element strictly greater than its neighbors. Assume `nums[-1] = nums[n] = -∞`. If multiple peaks exist, return the index of **any** one of them. Must run in O(log n). ([LeetCode 162](https://leetcode.com/problems/find-peak-element))

```
Input: nums = [1, 2, 3, 1]       → Output: 2  (nums[2]=3 is peak)
Input: nums = [1, 2, 1, 3, 5, 6, 4] → Output: 5  (nums[5]=6 is peak)
Input: nums = [1]                → Output: 0
```

Constraints: `1 <= nums.length <= 1000`, `-2³¹ <= nums[i] <= 2³¹-1`, `nums[i] ≠ nums[i+1]`

---

## 📝 Interview Tips

1. **Clarify**: "Trả về bất kỳ đỉnh nào — không cần tìm đỉnh cao nhất / Return ANY peak, not necessarily the maximum"
2. **Why BS works**: "Theo chiều dốc, đỉnh phải tồn tại trong nửa ta chọn — guaranteed / Slope guarantee ensures peak in chosen half"
3. **Boundary**: "Dùng `lo < hi` (không phải `<=`) vì hi = mid, không bị loop vô hạn" / Use `lo < hi` to avoid infinite loop
4. **Edge case**: "Mảng 1 phần tử → index 0 luôn là đỉnh" / Single element is always a peak
5. **Unsorted insight**: "Binary search không cần array sorted — chỉ cần _monotone property_ trên nửa nào đó" / BS needs local monotone property, not global sort
6. **Follow-up**: "Tìm TẤT CẢ đỉnh → linear scan O(n) / Find all peaks → linear scan"

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan
 * Name: Linear Scan
 * Time: O(n) — check each element
 * Space: O(1)
 */
function findPeakElementLinear(nums: number[]): number {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) return i; // first downslope = peak on left
  }
  return nums.length - 1; // monotonically increasing, last element is peak
}

/**
 * Solution 2: Binary Search on Slope (Optimal)
 * Name: Binary Search Slope
 * Time: O(log n) — halve search space each step
 * Space: O(1)
 */
function findPeakElement(nums: number[]): number {
  let lo = 0,
    hi = nums.length - 1;

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] < nums[mid + 1]) {
      // going uphill → peak must be in right half (after mid)
      lo = mid + 1;
    } else {
      // going downhill → peak is in left half (including mid)
      hi = mid;
    }
  }

  return lo; // lo == hi, converged to peak
}

/**
 * Solution 3: Recursive Binary Search
 * Name: Recursive Binary Search
 * Time: O(log n)
 * Space: O(log n) — call stack
 */
function findPeakElementRecursive(nums: number[]): number {
  function search(lo: number, hi: number): number {
    if (lo === hi) return lo;
    const mid = lo + Math.floor((hi - lo) / 2);
    return nums[mid] < nums[mid + 1] ? search(mid + 1, hi) : search(lo, mid);
  }
  return search(0, nums.length - 1);
}

// === Test Cases ===
console.log(findPeakElement([1, 2, 3, 1])); // 2
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 5
console.log(findPeakElement([1])); // 0
console.log(findPeakElement([3, 2, 1])); // 0 (descending, first is peak)
console.log(findPeakElementLinear([1, 2, 3, 4, 5])); // 4 (ascending, last is peak)
```

---

## 🔗 Related Problems

| Problem | Relationship |
|---|---|
| [Find Peak Index in a Mountain Array](https://leetcode.com/problems/find-peak-index-in-a-mountain-array) | Simpler version: guaranteed single mountain shape |
| [Find a Peak Element II](https://leetcode.com/problems/find-a-peak-element-ii) | Extended to 2D matrix — binary search on rows |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix) | Binary search on virtual 1D array |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) | Binary search on answer space |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array) | Binary search using slope/direction property |
