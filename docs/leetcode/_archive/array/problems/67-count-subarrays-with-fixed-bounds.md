---
layout: page
title: "Count Subarrays With Fixed Bounds"
difficulty: Hard
category: Array
tags: [Array, Queue, Sliding Window, Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/count-subarrays-with-fixed-bounds"
---

# Count Subarrays With Fixed Bounds / Đếm Mảng Con Có Biên Cố Định

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Index Tracking
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đoạn đường với biển báo tốc độ — bạn đang tìm các đoạn đường mà tốc độ nhỏ nhất đúng bằng minK và lớn nhất đúng bằng maxK. Khi gặp giá trị ngoài range [minK, maxK], đoạn hợp lệ bắt buộc phải bắt đầu lại từ sau điểm đó.

**Pattern Recognition:**

- Signal: "subarray", "min == X", "max == Y" → track last positions of each bound
- Mỗi vị trí `r`, đếm số subarray kết thúc tại `r` có min==minK và max==maxK
- Key insight: valid start range = `(lastBad, min(lastMin, lastMax)]` → count = max(0, min(lastMin,lastMax) - lastBad)

**Visual — nums=[1,3,3,2,2], minK=2, maxK=3:**

```
idx:  0  1  2  3  4
val:  1  3  3  2  2
           ^     ^
lastBad=0 (val=1 is out of [2,3])

At r=1: lastBad=0, lastMin=-1, lastMax=1 → min(-1,1)-0 = max(0,-1-0)=0
At r=2: lastBad=0, lastMin=-1, lastMax=2 → max(0,-1-0)=0
At r=3: lastBad=0, lastMin=3,  lastMax=2 → max(0,min(3,2)-0)=2
At r=4: lastBad=0, lastMin=4,  lastMax=2 → max(0,min(4,2)-0)=2
Total = 0+0+2+2 = 4 ✅
```

---

## Problem Description

Given an integer array `nums` and two integers `minK` and `maxK`, return the number of **fixed-bound subarrays**. A fixed-bound subarray has its minimum equal to `minK` and maximum equal to `maxK`. All elements must stay within `[minK, maxK]`.

- Example 1: `nums=[1,3,3,2,2], minK=2, maxK=3` → `4`
- Example 2: `nums=[1,1,1,1], minK=1, maxK=1` → `10`

Constraints: `2 <= nums.length <= 10^5`, `1 <= nums[i], minK, maxK <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "minK có thể bằng maxK không?" / Can minK equal maxK? Yes — subarrays with all same elements
2. **Brute force**: "Duyệt O(n²) tất cả subarrays, kiểm tra min/max" / Check every subarray — O(n²) time
3. **Optimize**: "Track 3 indices: lastBad, lastMin, lastMax để đếm O(n)" / Three pointers give O(n)
4. **Edge cases**: "Phần tử ngoài [minK, maxK] phá vỡ mọi subarray qua nó" / Out-of-range elements break all subarrays
5. **Key formula**: "count += max(0, min(lastMin, lastMax) - lastBad)" / The count per right pointer
6. **Follow-up**: "Nếu cần subarrays với min<=minK và max>=maxK?" / Relaxed bounds changes the logic

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check every subarray
 * Time: O(n²) — nested loops
 * Space: O(1)
 */
function countSubarraysWithFixedBoundsBrute(nums: number[], minK: number, maxK: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let lo = Infinity,
      hi = -Infinity;
    for (let j = i; j < nums.length; j++) {
      lo = Math.min(lo, nums[j]);
      hi = Math.max(hi, nums[j]);
      if (lo === minK && hi === maxK) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Optimal — Three-index sliding window
 * Time: O(n) — single pass
 * Space: O(1) — only 3 pointers
 *
 * Track: lastBad (last out-of-range idx), lastMin (last minK idx), lastMax (last maxK idx)
 * For each right end r: valid starts = (lastBad, min(lastMin,lastMax)]
 * Count += max(0, min(lastMin,lastMax) - lastBad)
 */
function countSubarraysWithFixedBounds(nums: number[], minK: number, maxK: number): number {
  let count = 0;
  let lastBad = -1; // last index where nums[i] < minK or nums[i] > maxK
  let lastMin = -1; // last index where nums[i] === minK
  let lastMax = -1; // last index where nums[i] === maxK

  for (let r = 0; r < nums.length; r++) {
    if (nums[r] < minK || nums[r] > maxK) {
      lastBad = r;
    }
    if (nums[r] === minK) lastMin = r;
    if (nums[r] === maxK) lastMax = r;
    // Both minK and maxK must appear in [lastBad+1 .. r]
    count += Math.max(0, Math.min(lastMin, lastMax) - lastBad);
  }
  return count;
}

// === Test Cases ===
console.log(countSubarraysWithFixedBounds([1, 3, 3, 2, 2], 2, 3)); // 4
console.log(countSubarraysWithFixedBounds([1, 1, 1, 1], 1, 1)); // 10
console.log(countSubarraysWithFixedBounds([2, 3], 2, 3)); // 1
console.log(countSubarraysWithFixedBounds([5, 5, 5], 1, 5)); // 0
```

---

## 🔗 Related Problems

- [Longest Continuous Subarray With Absolute Diff ≤ Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — similar sliding window with monotonic deque
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) — sliding window pattern
- [Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum) — counting subarrays with max constraint
- [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) — monotonic queue for DP optimization
