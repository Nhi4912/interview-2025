---
layout: page
title: "Subarrays with K Different Integers"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Sliding Window, Counting]
leetcode_url: "https://leetcode.com/problems/subarrays-with-k-different-integers"
---

# Subarrays with K Different Integers / Mảng Con Có Đúng K Số Nguyên Khác Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Longest Harmonious Subsequence](https://leetcode.com/problems/longest-harmonious-subsequence) | [Majority Element](https://leetcode.com/problems/majority-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** "Đúng K khác nhau" rất khó đếm trực tiếp. Nhưng: **Đúng K = AtMost(K) − AtMost(K−1)**. Giống đếm số người cao đúng 1m70 = số người cao ≤ 1m70 trừ số người cao ≤ 1m69.

```
nums = [1,2,1,2,3], k = 2
atMost(2): count subarrays with ≤2 distinct
  [1],[2],[1],[2],[3],[1,2],[2,1],[1,2],[2,3],[1,2,1],[1,2,1,2] → 10 (but not [2,3,X])
  Actually: right-left+1 summed = 10
atMost(1): subarrays with ≤1 distinct → 5
exactly(2) = 10 - 5 = 7? Let me verify: [1,2],[2,1],[1,2],[2,3],[1,2,1],[2,1,2],[1,2,1,2]... = 7 ✅
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng số nguyên `nums` và số nguyên `k`. Trả về số **mảng con** có **đúng `k` số nguyên phân biệt**.

- **Input:** `nums=[1,2,1,2,3], k=2` → **Output:** `7`
- **Input:** `nums=[1,2,1,3,4], k=3` → **Output:** `3`

**Constraints:** `1 <= nums.length <= 2×10^4`, `1 <= nums[i] <= nums.length`, `1 <= k <= nums.length`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key transformation: exactly(k) = atMost(k) - atMost(k-1). **VI:** Biến đổi chính: đúng K = atMost(K) − atMost(K−1).
2. **EN:** atMost(k): expand right always, shrink left when distinct count > k. **VI:** atMost(k): luôn mở rộng phải, thu trái khi distinct > k.
3. **EN:** Count subarrays ending at right = right - left + 1 (all valid). **VI:** Số subarray kết thúc tại right = right − left + 1.
4. **EN:** Delete key from map when frequency drops to 0 to keep size accurate. **VI:** Xóa key khỏi map khi freq về 0 để size chính xác.
5. **EN:** Time O(n), Space O(k) for frequency map (k ≤ n). **VI:** O(n) thời gian, O(k) không gian.
6. **EN:** This technique generalizes to all "exactly k" window counting problems. **VI:** Kỹ thuật này áp dụng mọi bài "đúng k" với window.

---

## Solutions / Giải Pháp

```typescript
// ─── Helper: count subarrays with AT MOST k distinct integers  O(n) ──────────
function atMost(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  let count = 0;
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    // Add right element to window
    freq.set(nums[right], (freq.get(nums[right]) ?? 0) + 1);

    // Shrink left until we have ≤ k distinct values
    while (freq.size > k) {
      const leftVal = nums[left++];
      const f = freq.get(leftVal)! - 1;
      if (f === 0) freq.delete(leftVal);
      else freq.set(leftVal, f);
    }

    // All subarrays [left..right], [left+1..right], ... [right..right] are valid
    count += right - left + 1;
  }

  return count;
}

// ─── Solution 1: atMost(k) - atMost(k-1)  O(n) time, O(n) space ─────────────
function subarraysWithKDistinct(nums: number[], k: number): number {
  return atMost(nums, k) - atMost(nums, k - 1);
}

// ─── Solution 2: Brute Force  O(n²) time — for verification ──────────────────
function subarraysWithKDistinctBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    const seen = new Set<number>();
    for (let j = i; j < nums.length; j++) {
      seen.add(nums[j]);
      if (seen.size === k) count++;
      if (seen.size > k) break;
    }
  }
  return count;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(subarraysWithKDistinct([1, 2, 1, 2, 3], 2)); // 7
console.log(subarraysWithKDistinct([1, 2, 1, 3, 4], 3)); // 3
console.log(subarraysWithKDistinct([1], 1)); // 1
console.log(subarraysWithKDistinctBrute([1, 2, 1, 2, 3], 2)); // 7
console.log(subarraysWithKDistinctBrute([1, 2, 1, 3, 4], 3)); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                                                                        | Difficulty | Pattern        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 3   | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters)                 | 🟡 Medium  | Sliding Window |
| 159 | [Longest Substring with At Most Two Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters) | 🟡 Medium  | Sliding Window |
| 340 | [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters)     | 🟡 Medium  | Sliding Window |
