---
layout: page
title: "Length of Longest Subarray With at Most K Frequency"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency"
---

# Length of Longest Subarray With at Most K Frequency / Mảng Con Dài Nhất Với Tần Suất Tối Đa K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii) | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống khung cửa sổ trượt dọc theo dãy số — mở rộng sang phải khi điều kiện còn hợp lệ, thu hẹp từ trái khi vi phạm. Ở đây điều kiện là: không phần tử nào xuất hiện quá k lần trong cửa sổ.

**Visual:**

```
nums=[1,2,1,2,1,3], k=2

 L           R
[1] → freq{1:1}            len=1
[1,2] → freq{1:1,2:1}     len=2
[1,2,1] → freq{1:2,2:1}   len=3  (1 appears 2 ≤ k=2 ✓)
[1,2,1,2] → freq{1:2,2:2} len=4  ✓
[1,2,1,2,1] → freq{1:3...} VIOLATE! shrink left:
  remove nums[L=0]=1 → freq{1:2,2:2}, L=1 → len=4 ✓
[2,1,2,1,3] → freq{1:2,2:2,3:1} len=5  ✓ ← answer
```

---

## Problem Description

Given array `nums` and integer `k`, return the **length of the longest subarray** where each element appears **at most k times**.

- Example 1: `nums=[1,2,1,2,1,2,1,2], k=2` → `4` (e.g. [1,2,1,2])
- Example 2: `nums=[1,2,3,1,2,3,1,2], k=2` → `6` (e.g. [2,3,1,2,3,1])

**Constraints:** `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^9`, `1 <= k <= nums.length`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Subarray phải liên tiếp (contiguous), không phải subsequence" / Must be contiguous.
2. **Brute force**: "O(n²) — thử mọi cặp [i,j] và đếm freq" / Try all pairs O(n²).
3. **Sliding window**: "Expand R, shrink L khi có phần tử vượt quá k lần" / Classic expand-then-shrink pattern.
4. **Invariant**: "Map theo dõi freq trong window hiện tại" / Maintain freq map for current window.
5. **Edge case**: "k >= n → toàn bộ mảng hợp lệ" / k large enough means full array is valid.
6. **Complexity**: "O(n) thời gian — mỗi phần tử vào/ra window đúng 1 lần" / Each element enters/exits once: O(n).

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n²)
 * Time: O(n²) — try all subarrays
 * Space: O(n) — frequency map per window
 */
function longestSubarrayAtMostKFreqBrute(nums: number[], k: number): number {
  let best = 0;
  for (let l = 0; l < nums.length; l++) {
    const freq = new Map<number, number>();
    for (let r = l; r < nums.length; r++) {
      freq.set(nums[r], (freq.get(nums[r]) ?? 0) + 1);
      if (freq.get(nums[r])! > k) break;
      best = Math.max(best, r - l + 1);
    }
  }
  return best;
}

console.log(longestSubarrayAtMostKFreqBrute([1, 2, 1, 2, 1, 2, 1, 2], 2)); // 4
console.log(longestSubarrayAtMostKFreqBrute([1, 2, 3, 1, 2, 3, 1, 2], 2)); // 6

/**
 * Solution 2: Sliding Window — Optimal
 * Time: O(n) — each element added/removed once
 * Space: O(n) — frequency map for window
 */
function findMaximumLength(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    // Expand: add nums[right]
    const rVal = nums[right];
    freq.set(rVal, (freq.get(rVal) ?? 0) + 1);

    // Shrink: while nums[right] exceeds k, move left pointer
    while ((freq.get(rVal) ?? 0) > k) {
      const lVal = nums[left];
      freq.set(lVal, freq.get(lVal)! - 1);
      if (freq.get(lVal) === 0) freq.delete(lVal);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}

console.log(findMaximumLength([1, 2, 1, 2, 1, 2, 1, 2], 2)); // 4
console.log(findMaximumLength([1, 2, 3, 1, 2, 3, 1, 2], 2)); // 6
console.log(findMaximumLength([5], 1)); // 1
console.log(findMaximumLength([1, 1, 1], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii)                                                   | Sliding Window | Medium     |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                             | Sliding Window | Medium     |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | Sliding Window | Medium     |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)                 | Sliding Window | Medium     |
