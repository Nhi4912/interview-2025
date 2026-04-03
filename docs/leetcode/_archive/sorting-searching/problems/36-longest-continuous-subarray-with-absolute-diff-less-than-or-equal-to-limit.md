---
layout: page
title: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Queue, Sliding Window, Heap (Priority Queue), Ordered Set]
leetcode_url: "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit"
---

# Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit / Subarray Dài Nhất với Hiệu Tuyệt Đối ≤ Limit

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang kiểm tra chất lượng một dãy sản phẩm trên băng chuyền — chênh lệch giữa sản phẩm xịn nhất và kém nhất trong khung quan sát không được vượt quá `limit`. Bạn dùng hai thước đo: một cái ghi nhớ giá trị cao nhất (monotone decreasing deque) và một cái ghi nhớ thấp nhất (monotone increasing deque) để tức thì biết khi nào cần thu hẹp khung.

**Pattern Recognition:**

- Signal: "longest subarray" + "max - min ≤ limit" → **Sliding Window + Monotonic Deques**
- Cần biết max và min trong window hiện tại một cách O(1) → dùng 2 deque đơn điệu
- Khi `max - min > limit`: loại phần tử cũ nhất ở front của deque tương ứng, tăng left

**Visual — Two Monotonic Deques:**

```
nums=[8,2,4,7], limit=4

right=0: maxD=[0]  minD=[0]  → max=8, min=8, diff=0 ≤ 4, len=1
right=1: maxD=[0,1] minD=[1] → max=8, min=2, diff=6 > 4 → shrink!
  left=1: pop front of maxD(0) → maxD=[1], minD=[1]
  → max=2, min=2, diff=0 ≤ 4, len=1
right=2: maxD=[2]  minD=[1,2]→ max=4, min=2, diff=2 ≤ 4, len=2
right=3: maxD=[3]  minD=[1,2,3]→ max=7, min=2, diff=5>4 → shrink!
  left=2: pop front of minD(1) → maxD=[3], minD=[2,3]
  → max=7, min=4, diff=3 ≤ 4, len=2
max length = 2 ✅
```

---

## Problem Description

Given an array `nums` and a limit, return the size of the **longest contiguous subarray** such that the absolute difference between any two elements is less than or equal to `limit`. ([LeetCode 1438](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit))

**Example 1:** `nums = [8,2,4,7], limit = 4` → `2`
**Example 2:** `nums = [10,1,2,4,7,2], limit = 5` → `4` (subarray `[2,4,7,2]`)

**Constraints:** `1 <= nums.length <= 10⁵`, `1 <= nums[i] <= 10⁹`, `0 <= limit <= 10⁹`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Hiệu tuyệt đối giữa 2 phần tử bất kỳ hay min/max?" / Any two elements = check max-min
2. **Brute force** / Thô: O(n²) kiểm tra mọi subarray — nêu rồi nói về bottleneck là tính max/min
3. **Bottleneck** / Điểm nghẽn: Cần dynamic max và min trong window → monotonic deques O(1) amortized
4. **Two deques** / Hai deque: `maxDeque` (decreasing, front=max), `minDeque` (increasing, front=min)
5. **Shrink logic** / Thu hẹp: Khi `maxDeque[0] - minDeque[0] > limit` → tăng left, bỏ front nếu stale
6. **Alternative** / Khác: Dùng SortedList/TreeMap O(n log n) — đơn giản hơn nhưng chậm hơn

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check All Subarrays
 * Time: O(n²) — for each start, expand right and track min/max
 * Space: O(1)
 */
function longestSubarrayBrute(nums: number[], limit: number): number {
  let maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    let lo = nums[i],
      hi = nums[i];
    for (let j = i; j < nums.length; j++) {
      lo = Math.min(lo, nums[j]);
      hi = Math.max(hi, nums[j]);
      if (hi - lo > limit) break;
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}

/**
 * Solution 2: Sliding Window + Two Monotonic Deques (Optimal)
 * Time: O(n) — each element pushed and popped from each deque at most once
 * Space: O(n) — deques hold at most n indices
 *
 * maxDeque: indices in decreasing order of value → front = index of window max
 * minDeque: indices in increasing order of value → front = index of window min
 *
 * Invariant: window = [left, right], max-min ≤ limit
 */
function longestSubarray(nums: number[], limit: number): number {
  // Deques store indices; front = relevant extreme
  const maxDeque: number[] = []; // decreasing values → front is max
  const minDeque: number[] = []; // increasing values → front is min

  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    // Maintain maxDeque: remove indices whose values are ≤ current (they'll never be max)
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);

    // Maintain minDeque: remove indices whose values are ≥ current (they'll never be min)
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
      minDeque.pop();
    }
    minDeque.push(right);

    // Shrink window from left while constraint violated
    while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {
      left++;
      // Remove stale front entries that are outside the window
      if (maxDeque[0] < left) maxDeque.shift();
      if (minDeque[0] < left) minDeque.shift();
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

/**
 * Solution 3: Sliding Window + Sorted Map (simpler to reason about, O(n log n))
 * Uses a frequency map sorted by key to track window min/max in O(log n)
 * Time: O(n log n), Space: O(n)
 */
function longestSubarraySortedMap(nums: number[], limit: number): number {
  // Simulate sorted map with Map + sorted keys
  const freq = new Map<number, number>();
  let left = 0;
  let maxLen = 0;

  const add = (v: number) => freq.set(v, (freq.get(v) ?? 0) + 1);
  const remove = (v: number) => {
    const c = freq.get(v)! - 1;
    if (c === 0) freq.delete(v);
    else freq.set(v, c);
  };
  const getMin = () => Math.min(...freq.keys());
  const getMax = () => Math.max(...freq.keys());

  for (let right = 0; right < nums.length; right++) {
    add(nums[right]);
    while (getMax() - getMin() > limit) {
      remove(nums[left++]);
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// === Test Cases ===
console.log(longestSubarray([8, 2, 4, 7], 4)); // 2
console.log(longestSubarray([10, 1, 2, 4, 7, 2], 5)); // 4
console.log(longestSubarray([4, 2, 2, 2, 4, 4, 2, 2], 0)); // 3
console.log(longestSubarray([1, 5, 6, 7, 8, 10, 6, 5, 6], 4)); // 5
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern              | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum)                                 | Monotonic Deque      | 🔴 Hard    |
| [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)                       | Monotonic Deque + DP | 🔴 Hard    |
| [Maximum Number of Robots Within Budget](https://leetcode.com/problems/maximum-number-of-robots-within-budget) | Monotonic Deque      | 🔴 Hard    |
| [Jump Game VI](https://leetcode.com/problems/jump-game-vi)                                                     | Monotonic Deque + DP | 🟡 Medium  |
| [Count Subarrays With Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds)           | Monotonic Queue      | 🔴 Hard    |
