---
layout: page
title: "Frequency of the Most Frequent Element"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/frequency-of-the-most-frequent-element"
---

# Frequency of the Most Frequent Element / Tần Suất Phần Tử Xuất Hiện Nhiều Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Maximum White Tiles Covered by a Carpet](https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có ngân sách `k` để "nâng cấp" nhân viên. Muốn có nhiều nhân viên bằng mức lương cao nhất nhất có thể. Sắp xếp lương, dùng cửa sổ trượt: cửa sổ hợp lệ khi chi phí nâng tất cả bằng `nums[right]` ≤ k.

**Pattern Recognition:**

- Sort + sliding window: expand right, shrink left when invalid
- Window valid if: `nums[right] * windowSize - windowSum <= k`
- Maximize window size

**Visual — nums=[1,2,4], k=5:**

```
Sorted: [1, 2, 4]
         L  R

L=0,R=0: sum=1, cost=1*1-1=0 ≤ 5 → valid, size=1
L=0,R=1: sum=3, cost=2*2-3=1 ≤ 5 → valid, size=2
L=0,R=2: sum=7, cost=4*3-7=5 ≤ 5 → valid, size=3 ✅ maxFreq=3
```

---

## Problem Description

Given an integer array `nums` and integer `k`, you can increment any element by `1` at most `k` times total. Return the **maximum possible frequency** of the most frequent element after performing at most `k` operations.

- Example 1: `nums = [1,2,4], k = 5` → `3`
- Example 2: `nums = [1,4,8,13], k = 5` → `2`

---

## 📝 Interview Tips

1. **Clarify**: "k là tổng số thao tác hay số thao tác mỗi phần tử?" / Is k total operations or per-element?
2. **Sort first**: "Sort để phần tử gần nhau dễ nâng cấp về cùng giá trị" / Sort so nearby elements are cheapest to equalize
3. **Window validity**: "Chi phí = nums[r] _ size - sum ≤ k" / Cost = target _ size - current sum ≤ k
4. **Shrink left**: "Khi window không hợp lệ, dịch left sang phải" / Invalid window → advance left pointer
5. **Edge case**: "k = 0 → max frequency trong mảng gốc" / k=0 → existing max frequency
6. **Follow-up**: "Nếu cho phép cả tăng lẫn giảm?" / What if both increments and decrements are allowed?

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Sliding Window
 * Time: O(n log n) — sort + single pass O(n)
 * Space: O(1) — only pointers and sum
 */
function maxFrequency(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let left = 0,
    windowSum = 0,
    maxFreq = 1;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    // Cost to make all elements in window equal to nums[right]
    while (nums[right] * (right - left + 1) - windowSum > k) {
      windowSum -= nums[left];
      left++;
    }
    maxFreq = Math.max(maxFreq, right - left + 1);
  }
  return maxFreq;
}

/**
 * Solution 2: Sort + Binary Search (for each right, binary search for leftmost valid left)
 * Time: O(n log n) — sort + n*log(n) binary searches
 * Space: O(n) — prefix sum array
 */
function maxFrequency2(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  let maxFreq = 1;
  for (let right = 1; right < n; right++) {
    let lo = 0,
      hi = right;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const size = right - mid + 1;
      const sum = prefix[right + 1] - prefix[mid];
      if (nums[right] * size - sum <= k) hi = mid;
      else lo = mid + 1;
    }
    maxFreq = Math.max(maxFreq, right - lo + 1);
  }
  return maxFreq;
}

// === Test Cases ===
console.log(maxFrequency([1, 2, 4], 5)); // 3
console.log(maxFrequency([1, 4, 8, 13], 5)); // 2
console.log(maxFrequency([3, 9, 6], 2)); // 1
console.log(maxFrequency([1, 1, 1], 10)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                              | Pattern                     | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ---------- |
| [Maximum White Tiles Covered by a Carpet](https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet)                     | Binary Search + Prefix Sum  | Hard       |
| [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) | Sliding Window              | Medium     |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)                                   | Prefix Sum + Ternary Search | Hard       |
| [Minimum Operations to Make a Uni-Value Grid](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid)             | Sorting + Median            | Medium     |
