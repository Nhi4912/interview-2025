---
layout: page
title: "Maximum Points You Can Obtain from Cards"
difficulty: Medium
category: Array
tags: [Array, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards"
---

# Maximum Points You Can Obtain from Cards / Điểm Tối Đa Lấy Từ Bộ Bài

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống chọn bài ở hai đầu hàng — thay vì tìm k lá bài tối ưu ở hai đầu, hãy nghĩ ngược lại: bỏ đi n-k lá bài giữa (window) sao cho tổng phần còn lại là lớn nhất. Tổng lớn nhất = tổng tất cả - min(tổng cửa sổ n-k phần tử liên tiếp).

**Visual:**

```
cards=[1,2,3,4,5,6,1], k=3
totalSum = 22
Window size = n-k = 7-3 = 4

Windows of size 4:
[1,2,3,4] → sum=10  →  take=22-10=12
[2,3,4,5] → sum=14  →  take=22-14=8
[3,4,5,6] → sum=18  →  take=22-18=4
[4,5,6,1] → sum=16  →  take=22-16=6

Min window = 10  →  Max points = 22-10 = 12 ✓
(take cards[4,5,6]=5+6+1=12)
```

---

## Problem Description

There is a row of cards with values `cardPoints`. In one step, take the **first or last** card. Take exactly `k` cards. Return the **maximum score** achievable.

- Example 1: `cardPoints=[1,2,3,4,5,6,1], k=3` → `12` (take 1,6,5 from ends)
- Example 2: `cardPoints=[2,2,2], k=2` → `4` (take any two)

**Constraints:** `1 <= cardPoints.length <= 10^5`, `1 <= cardPoints[i] <= 10^4`, `1 <= k <= cardPoints.length`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Chỉ lấy từ đầu hoặc cuối, không nhảy vào giữa" / Cards can only be taken from front or back.
2. **Inversion trick**: "Thay vì tối đa k lá đầu/cuối, tối thiểu n-k lá giữa" / Invert to: find minimum-sum window of size n-k.
3. **Window size**: "Cửa sổ có độ dài cố định n-k — dùng fixed sliding window" / Fixed window size makes this straightforward.
4. **Edge case k==n**: "Lấy tất cả → answer = totalSum" / If k==n, the window is empty, answer is full sum.
5. **Prefix sum alternative**: "Có thể dùng prefix sum: sum(front i) + sum(back k-i)" / Or enumerate front picks 0..k.
6. **Complexity**: "O(n) — khởi tạo cửa sổ O(n), slide O(n-k) ≤ O(n)" / Linear time overall.

---

## Solutions

```typescript
/**
 * Solution 1: Prefix Sum Enumeration
 * Time: O(k) — enumerate how many cards from front (0..k)
 * Space: O(k) — prefix sum of first k and suffix sum of last k
 */
function maxPointsFromCardsPrefixSuffix(cardPoints: number[], k: number): number {
  const n = cardPoints.length;
  // Prefix sums for first 0..k cards
  const front = new Array(k + 1).fill(0);
  for (let i = 0; i < k; i++) front[i + 1] = front[i] + cardPoints[i];

  // Suffix sums for last 0..k cards
  const back = new Array(k + 1).fill(0);
  for (let i = 0; i < k; i++) back[i + 1] = back[i] + cardPoints[n - 1 - i];

  let best = 0;
  for (let i = 0; i <= k; i++) {
    best = Math.max(best, front[i] + back[k - i]);
  }
  return best;
}

console.log(maxPointsFromCardsPrefixSuffix([1, 2, 3, 4, 5, 6, 1], 3)); // 12
console.log(maxPointsFromCardsPrefixSuffix([2, 2, 2], 2)); // 4
console.log(maxPointsFromCardsPrefixSuffix([9, 7, 7, 9, 7, 7, 9], 7)); // 55

/**
 * Solution 2: Fixed Sliding Window — Optimal
 * Time: O(n) — compute total, then slide window of size (n-k)
 * Space: O(1)
 *
 * Maximize (total - min_subarray_of_length_n-k)
 */
function maxScore(cardPoints: number[], k: number): number {
  const n = cardPoints.length;
  const windowLen = n - k;

  if (windowLen === 0) return cardPoints.reduce((a, b) => a + b, 0);

  const totalSum = cardPoints.reduce((a, b) => a + b, 0);

  // Find minimum window sum of length windowLen
  let windowSum = 0;
  for (let i = 0; i < windowLen; i++) windowSum += cardPoints[i];

  let minWindow = windowSum;
  for (let r = windowLen; r < n; r++) {
    windowSum += cardPoints[r] - cardPoints[r - windowLen];
    if (windowSum < minWindow) minWindow = windowSum;
  }

  return totalSum - minWindow;
}

console.log(maxScore([1, 2, 3, 4, 5, 6, 1], 3)); // 12
console.log(maxScore([2, 2, 2], 2)); // 4
console.log(maxScore([9, 7, 7, 9, 7, 7, 9], 7)); // 55
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)                           | Sliding Window | Medium     |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)                     | Sliding Window | Medium     |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                             | Sliding Window | Medium     |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | Sliding Window | Medium     |
