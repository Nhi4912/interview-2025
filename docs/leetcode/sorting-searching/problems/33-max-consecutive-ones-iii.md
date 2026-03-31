---
layout: page
title: "Max Consecutive Ones III"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/max-consecutive-ones-iii"
---

# Max Consecutive Ones III / Số Lượng Số 1 Liên Tiếp Tối Đa III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Longest Subarray of 1's After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) | [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang sơn một hàng rào toàn màu trắng (số 1) nhưng có một số ô màu đen (số 0). Bạn có đúng `k` lọ sơn trắng để đổi các ô đen. Hỏi có thể sơn liên tiếp nhiều nhất bao nhiêu ô trắng liền nhau? Trượt khung cửa sổ và đếm số 0 trong khung — nếu vượt quá `k` thì thu hẹp từ trái.

**Pattern Recognition:**

- Signal: "binary array" + "flip at most k zeros" + "longest subarray of 1s" → **Sliding Window**
- Reframe: tìm window dài nhất có số 0 ≤ k → có thể "lấp" hết bằng k lần flip
- Shrink khi `zeros > k`: dịch L sang phải cho đến khi `zeros == k`

**Visual — Sliding Window with k=2 flips:**

```
nums=[1,1,1,0,0,0,1,1,1,1,0], k=2

R adds:    [1,1,1,0] zeros=1 ≤ 2 → len=4
           [1,1,1,0,0] zeros=2 ≤ 2 → len=5
           [1,1,1,0,0,0] zeros=3 > 2 → shrink L
L removes:  [1,1,0,0,0] zeros=3>2 → shrink L
             [1,0,0,0] zeros=3>2 → shrink L
              [0,0,0] zeros=3>2 → shrink L
               [0,0] zeros=2 ≤ 2 → continue R
           [0,0,1,1,1,1] zeros=2 → len=6
           [0,0,1,1,1,1,0] zeros=3 > 2 → shrink L
           ...
Final max = 6 ✅
```

---

## Problem Description

Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`s in the array if you can flip at most `k` `0`s. ([LeetCode 1004](https://leetcode.com/problems/max-consecutive-ones-iii))

**Example 1:** `nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2` → `6`
**Example 2:** `nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k = 3` → `10`

**Constraints:** `1 <= nums.length <= 10⁵`, `nums[i]` is `0` or `1`, `0 <= k <= nums.length`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Flip nghĩa là thay đổi vĩnh viễn hay tạm thời?" / Flip in-place or just conceptually?
2. **Reframe** / Diễn giải lại: "Tìm subarray dài nhất có tối đa k số 0" — đơn giản hơn "flip k zeros"
3. **Shrink condition** / Điều kiện thu hẹp: Khi `zeros > k` → shrink L; khi `nums[L] == 0` → `zeros--`
4. **k=0 edge** / Biên k=0: Chỉ được dãy 1 thuần — window sẽ shrink mỗi khi gặp số 0
5. **All zeros** / Toàn 0: `k >= n` → cả mảng là đáp án
6. **Variant** / Biến thể: "Longest Subarray of 1s After Deleting One Element" = bài này với k=1, bỏ đi element đó

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check All Subarrays
 * Time: O(n²) — all starting positions × expanding
 * Space: O(1)
 */
function longestOnesBrute(nums: number[], k: number): number {
  let maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    let zeros = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) zeros++;
      if (zeros > k) break;
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }
  return maxLen;
}

/**
 * Solution 2: Sliding Window — Variable Size (Optimal)
 * Time: O(n) — each element added and removed at most once
 * Space: O(1)
 *
 * Maintain window [left, right] with at most k zeros.
 * When zeros exceeds k, shrink left until zeros == k again.
 */
function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let zeros = 0;
  let maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;

    // Shrink window from left until we have at most k zeros
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }

    // Current window [left..right] has at most k zeros
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

/**
 * Solution 3: Sliding Window — Fixed Size Optimization
 * Time: O(n) — window only moves forward, never shrinks
 * Space: O(1)
 *
 * Trick: never shrink the window below current maxLen.
 * We only grow the window when we can (zeros still ≤ k).
 * This gives constant-size window advance for cleaner logic.
 */
function longestOnesFixed(nums: number[], k: number): number {
  let left = 0;
  let zeros = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    // If invalid, move left forward by exactly 1 (window slides, not shrinks)
    if (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
  }

  // Window size = nums.length - left = right - left + 1 at end
  return nums.length - left;
}

// === Test Cases ===
console.log(longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)); // 6
console.log(longestOnes([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 3)); // 10
console.log(longestOnes([0, 0, 0], 0)); // 0
console.log(longestOnes([1, 1, 1], 0)); // 3
console.log(longestOnes([0, 0, 0], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                              | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element) | Sliding Window | 🟡 Medium  |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum)                                                 | Sliding Window | 🟡 Medium  |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)                                           | Sliding Window | 🟡 Medium  |
| [Max Consecutive Ones](https://leetcode.com/problems/max-consecutive-ones)                                                           | Sliding Window | 🟢 Easy    |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)                     | Sliding Window | 🟡 Medium  |
