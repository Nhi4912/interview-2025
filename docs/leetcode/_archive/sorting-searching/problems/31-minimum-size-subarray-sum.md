---
layout: page
title: "Minimum Size Subarray Sum"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-size-subarray-sum"
---

# Minimum Size Subarray Sum / Subarray Liên Tiếp Ngắn Nhất có Tổng ≥ Target

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang chạy trên đường đua với một chiếc khung di động — bạn kéo dài khung về phía trước (thêm phần tử bên phải) cho đến khi tổng đủ lớn, rồi thu hẹp từ phía sau (bỏ phần tử bên trái) để tìm khung nhỏ nhất. Cứ thế trượt dần về cuối đường.

**Pattern Recognition:**

- Signal: "contiguous subarray" + "minimum length" + "sum condition" → **Sliding Window (variable size)**
- Khi sum ≥ target: ghi nhận length, thu hẹp từ trái → có thể tìm được subarray ngắn hơn
- Mỗi phần tử được thêm vào và loại ra nhiều nhất 1 lần → O(n)

**Visual — Variable Sliding Window:**

```
target=7, nums=[2, 3, 1, 2, 4, 3]

L=0 R=0: sum=2  < 7 → expand R
L=0 R=1: sum=5  < 7 → expand R
L=0 R=2: sum=6  < 7 → expand R
L=0 R=3: sum=8 >= 7 → minLen=4, shrink L
L=1 R=3: sum=6  < 7 → expand R
L=1 R=4: sum=10>= 7 → minLen=4, shrink L
L=2 R=4: sum=7 >= 7 → minLen=3, shrink L
L=3 R=4: sum=6  < 7 → expand R
L=3 R=5: sum=9 >= 7 → minLen=3, shrink L
L=4 R=5: sum=7 >= 7 → minLen=2  ✅ Answer: 2
```

---

## Problem Description

Given a positive integer `target` and an array of positive integers `nums`, return the **minimal length** of a contiguous subarray whose sum is greater than or equal to `target`. Return `0` if no such subarray exists. ([LeetCode 209](https://leetcode.com/problems/minimum-size-subarray-sum))

**Example 1:** `target=7, nums=[2,3,1,2,4,3]` → `2` (subarray `[4,3]`)
**Example 2:** `target=4, nums=[1,4,4]` → `1` (subarray `[4]`)

**Constraints:** `1 <= target <= 10⁹`, `1 <= nums.length <= 10⁵`, `1 <= nums[i] <= 10⁴`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Tổng ≥ target hay = target? Tất cả phần tử dương?" / Sum ≥ or = target? All positive?
2. **Brute force** / Thô: Mọi subarray O(n²) — nêu rồi hỏi "có cách O(n) không?"
3. **Why sliding works** / Tại sao SW được: Vì tất cả phần tử dương → tổng tăng dần khi expand, giảm dần khi shrink
4. **Shrink condition** / Điều kiện thu hẹp: Khi `sum >= target` → shrink từ trái (tìm subarray ngắn hơn)
5. **Edge cases** / Biên: Không có subarray đủ (return 0), một phần tử đủ (return 1), toàn mảng cần dùng
6. **O(n log n) bonus** / Thêm: Có thể dùng prefix sum + binary search — O(n log n), nêu như follow-up

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check All Subarrays
 * Time: O(n²) — all pairs (i, j)
 * Space: O(1)
 */
function minSubArrayLenBrute(target: number, nums: number[]): number {
  let minLen = Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= target) {
        minLen = Math.min(minLen, j - i + 1);
        break; // can't get shorter starting at i
      }
    }
  }
  return minLen === Infinity ? 0 : minLen;
}

/**
 * Solution 2: Sliding Window (Optimal)
 * Time: O(n) — each element added and removed at most once
 * Space: O(1)
 *
 * Expand right to increase sum, shrink left when sum >= target.
 * Record minimum window size each time constraint is met.
 */
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right]; // expand window

    // Shrink from left while constraint is still satisfied
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left]; // remove leftmost element
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

/**
 * Solution 3: Prefix Sum + Binary Search
 * Time: O(n log n) — build prefix sum, binary search each index
 * Space: O(n) — prefix sum array
 */
function minSubArrayLenPrefixBS(target: number, nums: number[]): number {
  const n = nums.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  let minLen = Infinity;
  for (let i = 1; i <= n; i++) {
    const needed = prefix[i] - target; // need prefix[j] >= needed
    // Binary search for smallest j where prefix[j] >= needed
    let lo = 0,
      hi = i - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (prefix[mid] >= needed) {
        hi = mid - 1;
      } else lo = mid + 1;
    }
    if (prefix[lo] >= needed) minLen = Math.min(minLen, i - lo);
  }
  return minLen === Infinity ? 0 : minLen;
}

// === Test Cases ===
console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2
console.log(minSubArrayLen(4, [1, 4, 4])); // 1
console.log(minSubArrayLen(11, [1, 1, 1, 1, 1])); // 0 (impossible)
console.log(minSubArrayLen(15, [1, 2, 3, 4, 5])); // 5 (whole array)
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k)                                     | Sliding Window | 🟡 Medium  |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                                             | Sliding Window | 🟡 Medium  |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | Sliding Window | 🟡 Medium  |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)                 | Sliding Window | 🟡 Medium  |
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring)                                             | Sliding Window | 🔴 Hard    |
