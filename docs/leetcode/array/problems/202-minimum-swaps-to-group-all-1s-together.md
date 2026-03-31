---
layout: page
title: "Minimum Swaps to Group All 1's Together"
difficulty: Medium
category: Array
tags: [Array, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together"
---

# Minimum Swaps to Group All 1's Together / Số Hoán Vị Tối Thiểu Để Gom Tất Cả Số 1

🟡 Medium | Array · Sliding Window | LeetCode #1151

## 🧠 Intuition / Tư Duy

**Vietnamese:** Đếm tổng số 1 trong mảng (= `total`). Để gom tất cả số 1 lại, cần một cửa sổ độ rộng `total`. Số lần hoán vị = số 0 trong cửa sổ tốt nhất. Ta cần tìm cửa sổ có nhiều số 1 nhất — vì đây là mảng vòng tròn.

```
data = [1,0,1,0,1,0,0,1,1,0], total_ones=5

Window size=5, slide through circular array:
[1,0,1,0,1] → 3 ones → 2 swaps
[0,1,0,1,0] → 2 ones → 3 swaps
[1,0,1,0,0] → 2 ones → 3 swaps
[0,1,0,0,1] → 2 ones → 3 swaps
[1,0,0,1,1] → 3 ones → 2 swaps
[0,0,1,1,0] → 2 ones → 3 swaps
[0,1,1,0,1] → 3 ones → 2 swaps
[1,1,0,1,0] → 3 ones → 2 swaps
[1,0,1,0,1] → 3 ones → 2 swaps  (circular)

Answer = min(swaps) = 2
```

## Problem Description

Given a binary circular array `data`, return the **minimum number of swaps** needed to group all `1`s together anywhere in the circular array. A swap exchanges any two elements.

The key insight: count total ones `k`, then find the window of size `k` with the **maximum number of 1s** — answer is `k - maxOnesInWindow`.

**Example 1:**

```
data=[1,0,1,0,1]
Output: 1  // [1,1,1,0,0] needs 1 swap
```

**Example 2:**

```
data=[0,0,0,1,0]
Output: 0  // already grouped
```

## 📝 Interview Tips

- **🔑 Count total 1s / Đếm tổng số 1:** Window size = total 1s — swaps needed = 0s inside best window
- **🔄 Circular handling / Xử lý vòng tròn:** Use modulo `(i + k) % n` to wrap around, or duplicate the array
- **🎯 Sliding window formula / Công thức cửa sổ:** `swaps = windowSize - onesInWindow`, minimize swaps = maximize ones
- **⚠️ Edge cases / Trường hợp biên:** All 1s → 0 swaps; all 0s or one 1 → 0 swaps
- **📊 Fixed window / Cửa sổ cố định:** Window size is fixed (= total ones), so this is a fixed sliding window
- **🌀 Circular trick / Mẹo vòng tròn:** `data.concat(data)` then slide normally — valid when window < n

## Solutions

```typescript
/**
 * Approach 1: Fixed sliding window with circular handling via modulo
 * Time: O(n)
 * Space: O(1)
 */
function minSwaps(data: number[]): number {
  const n = data.length;
  const total = data.reduce((s, x) => s + x, 0);
  if (total === 0 || total === n) return 0;

  // Count ones in initial window [0..total-1]
  let windowOnes = 0;
  for (let i = 0; i < total; i++) windowOnes += data[i];

  let maxOnes = windowOnes;

  // Slide window (circular via modulo)
  for (let i = 1; i < n; i++) {
    windowOnes += data[(i + total - 1) % n]; // add right
    windowOnes -= data[i - 1]; // remove left
    maxOnes = Math.max(maxOnes, windowOnes);
  }

  return total - maxOnes;
}

console.log(minSwaps([1, 0, 1, 0, 1])); // 1
console.log(minSwaps([0, 0, 0, 1, 0])); // 0
console.log(minSwaps([1, 0, 1, 0, 1, 0, 0, 1, 1, 0])); // 3
```

```typescript
/**
 * Approach 2: Duplicate array trick for circular
 * Time: O(n)
 * Space: O(n) — doubled array
 */
function minSwapsV2(data: number[]): number {
  const n = data.length;
  const total = data.reduce((s, x) => s + x, 0);
  if (total === 0 || total === n) return 0;

  const doubled = [...data, ...data];
  let windowOnes = doubled.slice(0, total).reduce((s, x) => s + x, 0);
  let maxOnes = windowOnes;

  for (let i = 1; i < n; i++) {
    windowOnes += doubled[i + total - 1];
    windowOnes -= doubled[i - 1];
    maxOnes = Math.max(maxOnes, windowOnes);
  }

  return total - maxOnes;
}

console.log(minSwapsV2([1, 0, 1, 0, 1])); // 1
console.log(minSwapsV2([1, 0, 1, 0, 1, 0, 0, 1, 1, 0])); // 3
```

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                   | 🟡 Medium  | Sliding Window |
| [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/)       | 🟡 Medium  | Sliding Window |
| [Minimum Swaps to Group All 1s Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/) | 🟡 Medium  | Sliding Window |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)                                 | 🟡 Medium  | Sliding Window |
