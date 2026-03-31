---
layout: page
title: "Minimum Swaps to Group All 1's Together II"
difficulty: Medium
category: Array
tags: [Array, Sliding Window]
leetcode_url: "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii"
---

# Minimum Swaps to Group All 1's Together II / Số Hoán Vị Tối Thiểu Để Gom Tất Cả Số 1

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mảng **vòng tròn** — nghĩ như vòng lính đứng thành vòng, một số cầm cờ (1). Muốn gom tất cả lính cầm cờ đứng liền nhau với ít hoán đổi nhất. Số hoán vị = số lính **không cầm cờ** đang nằm trong vùng k cần chiếm = `k - max_ones_in_window`.

```
nums = [0,1,0,1,1,0,0], total_ones = k = 3
Circular windows of size 3:
[0,1,0]→1 one  [1,0,1]→2 ones  [0,1,1]→2 ones
[1,1,0]→2 ones  [1,0,0]→1 one  ...
Max ones in window = 2 → answer = 3 - 2 = 1
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng nhị phân `nums` (coi như **vòng tròn**). Một lần hoán vị là đổi hai phần tử bất kỳ. Trả về **số hoán vị tối thiểu** để gom tất cả số `1` về liền nhau.

- **Input:** `nums = [0,1,0,1,1,0,0]` → **Output:** `1`
- **Input:** `nums = [0,1,1,1,0,0,1,1,0]` → **Output:** `2`

**Constraints:** `1 <= nums.length <= 10^5`, `nums[i]` là `0` hoặc `1`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key insight: total ones = window size k; answer = k − max ones in any window. **VI:** Tổng số 1 = k; đáp án = k − max_ones_in_window.
2. **EN:** Circular array → use `(i + k - 1) % n` for right edge, no array doubling needed. **VI:** Mảng vòng → dùng mod, không cần nhân đôi mảng.
3. **EN:** Slide window of size k, track ones count with +1/-1 at boundaries. **VI:** Trượt cửa sổ k, cập nhật số 1 khi thêm/bỏ phần tử.
4. **EN:** If no ones in array → return 0 (k=0 window). **VI:** Không có số 1 → trả 0.
5. **EN:** Time O(n), Space O(1). **VI:** O(n) thời gian, O(1) không gian.
6. **EN:** This is a circular array pattern — think mod or array doubling. **VI:** Mảng vòng → xem xét mod hoặc nhân đôi.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Circular Sliding Window with Modulo  O(n) time, O(1) space ──
function minSwaps(nums: number[]): number {
  const n = nums.length;
  const k = nums.reduce((s, x) => s + x, 0); // total ones = window size
  if (k === 0) return 0;

  // Build initial window [0..k-1]
  let onesInWindow = 0;
  for (let i = 0; i < k; i++) onesInWindow += nums[i];

  let maxOnes = onesInWindow;

  // Slide window circularly
  for (let i = 1; i < n; i++) {
    onesInWindow += nums[(i + k - 1) % n]; // add new right
    onesInWindow -= nums[i - 1]; // remove old left
    maxOnes = Math.max(maxOnes, onesInWindow);
  }

  return k - maxOnes; // zeros inside best window = swaps needed
}

// ─── Solution 2: Array Doubling  O(n) time, O(n) space ───────────────────────
function minSwapsDoubling(nums: number[]): number {
  const n = nums.length;
  const k = nums.reduce((s, x) => s + x, 0);
  if (k === 0) return 0;

  const doubled = [...nums, ...nums];
  let windowOnes = doubled.slice(0, k).reduce((s, x) => s + x, 0);
  let maxOnes = windowOnes;

  for (let r = k; r < doubled.length; r++) {
    windowOnes += doubled[r] - doubled[r - k];
    maxOnes = Math.max(maxOnes, windowOnes);
  }

  return k - maxOnes;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(minSwaps([0, 1, 0, 1, 1, 0, 0])); // 1
console.log(minSwaps([0, 1, 1, 1, 0, 0, 1, 1, 0])); // 2
console.log(minSwaps([1, 1, 0, 0, 1])); // 0 (already grouped circularly at pos 4→0→1)
console.log(minSwapsDoubling([0, 1, 0, 1, 1, 0, 0])); // 1
console.log(minSwapsDoubling([1, 1, 0, 0, 1])); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                         | Difficulty | Pattern        |
| ---- | --------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1151 | [Minimum Swaps to Group All 1's Together](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together) | 🟡 Medium  | Sliding Window |
| 1004 | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                              | 🟡 Medium  | Sliding Window |
| 239  | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum)                                  | 🔴 Hard    | Sliding Window |
