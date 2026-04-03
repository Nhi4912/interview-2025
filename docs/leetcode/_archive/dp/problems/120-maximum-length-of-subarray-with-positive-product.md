---
layout: page
title: "Maximum Length of Subarray With Positive Product"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product"
---

# Maximum Length of Subarray With Positive Product / Dãy Con Dài Nhất Có Tích Dương

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP (Tracking Sign)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm số lần đổi dấu — tích dương khi có số lần âm chẵn. Theo dõi chiều dài dãy con kết thúc tại `i` với tích dương (`pos`) và tích âm (`neg`).

**Pattern Recognition:**

- Khi gặp `nums[i] > 0`: `pos` tăng 1, `neg` tăng 1 (nếu đang có dãy âm)
- Khi gặp `nums[i] < 0`: hoán đổi `pos` và `neg` (dấu đảo ngược), rồi tăng
- Khi gặp `nums[i] = 0`: reset cả hai về 0 (subarray bị cắt đứt)

```
nums = [0, 1, -2, -3, -4]

i=0: 0 → reset: pos=0, neg=0
i=1: 1>0 → pos=0+1=1, neg=0 (neg was 0)
i=2: -2<0 → swap first: pos_new=neg+1=1, neg_new=pos+1=2 → pos=1,neg=2
i=3: -3<0 → swap: pos_new=neg+1=3, neg_new=pos+1=2 → pos=3,neg=2
i=4: -4<0 → swap: pos_new=neg+1=3, neg_new=pos+1=4 → pos=3,neg=4

max(pos over all i) = 3  (indices 1,2,3 → product 1×-2×-3=6>0)
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng số nguyên `nums`. Trả về **độ dài lớn nhất** của mảng con liên tiếp có tích dương.

**Example 1:** `nums=[1,-2,-3,4]` → `4` (toàn bộ mảng, tích = 24 > 0)
**Example 2:** `nums=[0,1,-2,-3,-4]` → `3`
**Example 3:** `nums=[-1,-2,-3,0,1]` → `2`

**Constraints:** `1 ≤ nums.length ≤ 10⁵`, `-10⁹ ≤ nums[i] ≤ 10⁹`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Track `pos` = max length ending at i with positive product, `neg` = with negative product.
   **VI:** Theo dõi `pos` = độ dài tối đa kết thúc tại i với tích dương, `neg` = tích âm.

2. **EN:** Multiplying by positive: pos grows by 1, neg grows by 1 (if neg > 0).
   **VI:** Nhân số dương: pos tăng 1, neg tăng 1 (nếu neg > 0).

3. **EN:** Multiplying by negative: pos and neg swap roles, both increment. pos_new = neg+1 (if neg>0 else 0).
   **VI:** Nhân số âm: pos và neg đổi vai trò, đều tăng. pos_new = neg+1 nếu neg>0.

4. **EN:** Zero resets everything — product chain is broken, next subarray starts fresh.
   **VI:** Số 0 reset tất cả — chuỗi tích bị cắt, dãy con tiếp theo bắt đầu từ đầu.

5. **EN:** Answer = max of all `pos` values seen across the array.
   **VI:** Đáp án = max của tất cả giá trị `pos` trong quá trình duyệt.

6. **EN:** Greedy alternative: fix start, scan to find longest valid window from each zero boundary.
   **VI:** Greedy: cố định điểm bắt đầu từ mỗi vị trí 0, tìm cửa sổ hợp lệ dài nhất.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Brute Force — O(n²) ─────────────────────────────────────────
function getMaxLen_brute(nums: number[]): number {
  const n = nums.length;
  let ans = 0;

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = i; j < n; j++) {
      product *= nums[j];
      if (product > 0) ans = Math.max(ans, j - i + 1);
      if (product === 0) break;
    }
  }
  return ans;
}

// ─── Solution 2: DP — O(n) time, O(1) space ──────────────────────────────────
// pos = max length subarray ending here with positive product
// neg = max length subarray ending here with negative product
function getMaxLen(nums: number[]): number {
  let pos = 0; // length of longest positive-product subarray ending at current index
  let neg = 0; // length of longest negative-product subarray ending at current index
  let ans = 0;

  for (const num of nums) {
    if (num > 0) {
      // Extend positive (or start new), extend negative (only if already negative)
      pos = pos + 1;
      neg = neg > 0 ? neg + 1 : 0;
    } else if (num < 0) {
      // Negative flips sign: old pos → new neg, old neg → new pos
      const newPos = neg > 0 ? neg + 1 : 0;
      const newNeg = pos + 1;
      pos = newPos;
      neg = newNeg;
    } else {
      // Zero breaks the chain
      pos = 0;
      neg = 0;
    }
    ans = Math.max(ans, pos);
  }

  return ans;
}

// ─── Solution 3: Two-Pass Greedy (segment by zeros) ──────────────────────────
// Split by zeros. Within each segment, find longest positive-product subarray.
// For a segment, if count of negatives is even → whole segment works.
// If odd → max(len - firstNegPos - 1, lastNegPos) where firstNeg/lastNeg from edges.
function getMaxLen_greedy(nums: number[]): number {
  let ans = 0;

  function solve(seg: number[]): void {
    const n = seg.length;
    let negCount = 0;
    let firstNegIdx = -1,
      lastNegIdx = -1;

    for (let i = 0; i < n; i++) {
      if (seg[i] < 0) {
        negCount++;
        if (firstNegIdx === -1) firstNegIdx = i;
        lastNegIdx = i;
      }
    }

    if (negCount % 2 === 0) {
      ans = Math.max(ans, n);
    } else {
      // Remove from start up to and including firstNeg, or from end after lastNeg
      ans = Math.max(ans, n - firstNegIdx - 1, lastNegIdx);
    }
  }

  let start = 0;
  for (let i = 0; i <= nums.length; i++) {
    if (i === nums.length || nums[i] === 0) {
      if (i > start) solve(nums.slice(start, i));
      start = i + 1;
    }
  }

  return ans;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(getMaxLen([1, -2, -3, 4])); // 4
console.log(getMaxLen([0, 1, -2, -3, -4])); // 3
console.log(getMaxLen([-1, -2, -3, 0, 1])); // 2
console.log(getMaxLen([-1, -2, -3])); // 2
console.log(getMaxLen_brute([1, -2, -3, 4])); // 4
console.log(getMaxLen_greedy([0, 1, -2, -3, -4])); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                    | Difficulty | Pattern            |
| --- | ------------------------------------------------------------------------------------------ | ---------- | ------------------ |
| 152 | [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray)         | 🟡 Medium  | DP (sign tracking) |
| 53  | [Maximum Subarray](https://leetcode.com/problems/maximum-subarray)                         | 🟡 Medium  | DP (Kadane)        |
| 713 | [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | 🟡 Medium  | Sliding Window     |
