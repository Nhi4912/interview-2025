---
layout: page
title: "Apply Operations to Maximize Frequency Score"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/apply-operations-to-maximize-frequency-score"
---

# Apply Operations to Maximize Frequency Score / Tối Đa Hóa Điểm Tần Suất Bằng Phép Toán

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Prefix Sum + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | [Maximum White Tiles Covered by a Carpet](https://leetcode.com/problems/maximum-white-tiles-covered-by-a-carpet)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kéo một "cửa sổ" trên dãy số đã sắp xếp — ta muốn gom tất cả số trong cửa sổ về một giá trị trung vị (median) với chi phí thấp nhất. Nếu chi phí ≤ k, cửa sổ hợp lệ.

**Pattern Recognition:**

- Signal: "maximize frequency with k increment/decrement operations" → **Sort + Sliding Window + Prefix Sum**
- Key insight: sau khi sort, optimal target = nums[mid] (median of window) minimizes total cost
- Cost of window [l,r] with target nums[mid]: use prefix sums for O(1) cost query

**Visual — nums=[1,2,6,4], k=3:**

```
Sorted: [1, 2, 4, 6]
prefix: [0, 1, 3, 7, 13]

Window [1,2,4] target=2: cost = |1-2|+|4-2| = 1+2 = 3 ≤ k=3 → size=3 ✓
Window [2,4,6] target=4: cost = |2-4|+|6-4| = 2+2 = 4 > k=3 ✗
Answer = 3
```

---

## Problem Description

Given `nums` and integer `k`, you can increment or decrement any element by 1 (each costs 1 operation). Maximize the **frequency score** = max frequency of any element after operations. ([LeetCode 2968](https://leetcode.com/problems/apply-operations-to-maximize-frequency-score))

Difficulty: Hard | Acceptance: 36.3%

```
Example 1: nums=[1,2,6,4], k=3  → 3
  (change 1→2, 6→4: [2,2,4,4], or change 1→4: cost=3 → [4,2,6,4] but 4 appears 2x)
  Best: nums=[1,2,4,6] sorted, window [1,2,4] target=2 cost=3 → freq=3
Example 2: nums=[1,4,4,2,4], k=0 → 3  (4 already appears 3 times)
```

Constraints: `1 ≤ n ≤ 10^5`, `0 ≤ nums[i], k ≤ 10^9`

---

## 📝 Interview Tips

1. **Sort first / Sort trước**: "Sau khi sort, window liên tục là optimal — elements gần nhau cost ít nhất"
2. **Median is optimal / Trung vị tối ưu**: "Trong window [l,r], median minimizes sum of |x - target|"
3. **Prefix sum for cost / Tiền tố tổng**: Precompute prefix sum để tính cost window [l,r] trong O(1)
4. **Binary search window / Tìm window**: Binary search on window size, or use sliding window with shrink
5. **Sliding window approach / Cửa sổ trượt**: Expand r, shrink l when cost > k; track max window size
6. **Complexity / Độ phức tạp**: O(n log n) sort + O(n) sliding window with O(1) cost = O(n log n)

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Binary Search on Window Size
 * Time: O(n log n)  Space: O(n)
 *
 * Binary search: for window size `sz`, check if any window of size sz has cost <= k.
 * Cost of window [l, r=l+sz-1] with median at mid = l + (sz>>1):
 *   right half: sum(nums[mid..r]) - nums[mid]*(r-mid+1)
 *   left half:  nums[mid]*(mid-l) - sum(nums[l..mid-1])
 */
function maxFrequencyScoreBS(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l]; // inclusive

  const canAchieve = (sz: number): boolean => {
    for (let l = 0; l + sz - 1 < n; l++) {
      const r = l + sz - 1;
      const mid = l + Math.floor((sz - 1) / 2);
      const target = nums[mid];
      // cost = (right half total - target * count) + (target * count - left half total)
      const rightCost = rangeSum(mid, r) - target * (r - mid + 1);
      const leftCost = target * (mid - l) - rangeSum(l, mid - 1);
      if (rightCost + leftCost <= k) return true;
    }
    return false;
  };

  let lo = 1,
    hi = n;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (canAchieve(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Solution 2: Sort + Sliding Window (Optimal)
 * Time: O(n log n)  Space: O(n)
 *
 * Expand right pointer; when cost > k, shrink left pointer.
 * Cost with target = nums[mid] where mid = (l+r)/2:
 *   Use prefix sums; update incrementally is complex, so recompute per window
 *   or use the sliding window with monotone check.
 */
function maxFrequencyScore(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const rangeSum = (l: number, r: number) => prefix[r + 1] - prefix[l];

  const windowCost = (l: number, r: number): number => {
    const mid = l + Math.floor((r - l) / 2);
    const target = nums[mid];
    const rightCost = rangeSum(mid, r) - target * (r - mid + 1);
    const leftCost = target * (mid - l) - rangeSum(l, mid - 1 < l ? l - 1 : mid - 1);
    return rightCost + (mid > l ? leftCost : 0);
  };

  let ans = 1,
    l = 0;
  for (let r = 1; r < n; r++) {
    // Shrink left until window cost <= k
    while (windowCost(l, r) > k) l++;
    ans = Math.max(ans, r - l + 1);
  }
  return ans;
}

// === Tests ===
console.log(maxFrequencyScoreBS([1, 2, 6, 4], 3)); // 3
console.log(maxFrequencyScoreBS([1, 4, 4, 2, 4], 0)); // 3
console.log(maxFrequencyScore([1, 2, 6, 4], 3)); // 3
console.log(maxFrequencyScore([1, 4, 4, 2, 4], 0)); // 3
console.log(maxFrequencyScore([1], 5)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                              | Relationship                         |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| [2968. Apply Operations to Maximize Frequency Score](https://leetcode.com/problems/apply-operations-to-maximize-frequency-score)     | This problem                         |
| [1838. Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)                 | Sliding window to maximize frequency |
| [2560. House Robber IV](https://leetcode.com/problems/house-robber-iv)                                                               | Binary search on answer              |
| [2106. Maximum Fruits Harvested After at Most K Steps](https://leetcode.com/problems/maximum-fruits-harvested-after-at-most-k-steps) | Sliding window + prefix sums         |
| [2462. Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers)                                     | Greedy selection with sorted array   |
