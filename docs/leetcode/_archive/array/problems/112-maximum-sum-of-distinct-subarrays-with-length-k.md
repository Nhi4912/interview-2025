---
layout: page
title: "Maximum Sum of Distinct Subarrays With Length K"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k"
---

# Maximum Sum of Distinct Subarrays With Length K / Tổng Tối Đa Của Mảng Con Phân Biệt Độ Dài K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii) | [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một **khung cửa sổ** di chuyển trên dãy nhà. Mỗi lần trượt, thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước k. Nếu trong cửa sổ có nhà trùng thì tổng đó **không hợp lệ**.

**Pattern Recognition:** Sliding Window cố định kích thước k + Map tần suất → kiểm tra distinct trong O(1).

```
nums = [1, 5, 4, 2, 9, 9, 9], k = 3
Window [1,5,4] → distinct ✅ sum=10
Window [5,4,2] → distinct ✅ sum=11
Window [4,2,9] → distinct ✅ sum=15 ← max
Window [2,9,9] → has dup ❌
Window [9,9,9] → has dup ❌
Answer: 15
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng số nguyên `nums` và số nguyên `k`. Trả về **tổng lớn nhất** của mảng con độ dài đúng `k` với tất cả phần tử **phân biệt**. Nếu không tồn tại, trả `0`.

- **Input:** `nums = [1,5,4,2,9,9,9]`, `k = 3` → **Output:** `15`
- **Input:** `nums = [4,4,4]`, `k = 3` → **Output:** `0`

**Constraints:** `1 <= k <= nums.length <= 10^5`, `1 <= nums[i] <= 10^5`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Fixed-size window: add right element, remove left element each step. **VI:** Cửa sổ cố định: thêm phải, bỏ trái mỗi bước.
2. **EN:** Track a frequency map — window is distinct when `map.size === k`. **VI:** Map tần suất: cửa sổ hợp lệ khi `map.size === k`.
3. **EN:** Delete map entry when frequency drops to 0 to keep size accurate. **VI:** Xóa key khỏi map khi count về 0 để size chính xác.
4. **EN:** Update answer only for valid windows (distinct + size k). **VI:** Cập nhật kết quả chỉ khi cửa sổ hợp lệ.
5. **EN:** Time O(n), Space O(k) for the frequency map. **VI:** O(n) thời gian, O(k) không gian.
6. **EN:** Edge: if k > nums.length, no valid window → return 0. **VI:** Nếu k > n → trả 0.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Sliding Window + Frequency Map  O(n) time, O(k) space ───────
function maximumSubarraySum(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  let windowSum = 0;
  let maxSum = 0;

  for (let r = 0; r < nums.length; r++) {
    // Expand: add right element
    freq.set(nums[r], (freq.get(nums[r]) ?? 0) + 1);
    windowSum += nums[r];

    // Shrink: remove leftmost element once window exceeds size k
    if (r >= k) {
      const left = nums[r - k];
      windowSum -= left;
      const cnt = freq.get(left)! - 1;
      if (cnt === 0) freq.delete(left);
      else freq.set(left, cnt);
    }

    // Valid window: exactly k elements, all distinct
    if (r >= k - 1 && freq.size === k) {
      maxSum = Math.max(maxSum, windowSum);
    }
  }

  return maxSum;
}

// ─── Solution 2: Brute Force  O(n*k) time — for small inputs ─────────────────
function maximumSubarraySumBrute(nums: number[], k: number): number {
  let maxSum = 0;
  for (let i = 0; i <= nums.length - k; i++) {
    const seen = new Set<number>();
    let sum = 0;
    let valid = true;
    for (let j = i; j < i + k; j++) {
      if (seen.has(nums[j])) {
        valid = false;
        break;
      }
      seen.add(nums[j]);
      sum += nums[j];
    }
    if (valid) maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(maximumSubarraySum([1, 5, 4, 2, 9, 9, 9], 3)); // 15
console.log(maximumSubarraySum([4, 4, 4], 3)); // 0
console.log(maximumSubarraySum([1, 2, 3, 4], 2)); // 7
console.log(maximumSubarraySumBrute([1, 5, 4, 2, 9, 9, 9], 3)); // 15
console.log(maximumSubarraySumBrute([4, 4, 4], 3)); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                        | Difficulty | Pattern        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------- |
| 3    | [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | 🟡 Medium  | Sliding Window |
| 219  | [Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii)                                                   | 🟢 Easy    | Sliding Window |
| 2090 | [K Radius Subarray Averages](https://leetcode.com/problems/k-radius-subarray-averages)                                         | 🟡 Medium  | Sliding Window |
