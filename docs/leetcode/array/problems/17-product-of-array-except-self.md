---
layout: page
title: "Product of Array Except Self"
difficulty: Medium
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/product-of-array-except-self/"
leetcode_number: 238
pattern: "Prefix/Suffix"
frequency_tier: 1
companies: [Amazon, Facebook, Apple, Google]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Product of Array Except Self / Tích Mảng Ngoại Trừ Chính Nó

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix/Suffix
> **Frequency**: 🔥 Tier 1 — bài kinh điển kiểm tra tư duy prefix/suffix, cấm dùng phép chia
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Facebook, Apple, Google
> **See also**: [Trapping Rain Water](./20-trapping-rain-water.md) | [Maximum Product Subarray](../../dp/problems/12-maximum-product-subarray.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trong một hàng người và muốn biết tích chiều cao của tất cả người khác (trừ bạn). Thay vì hỏi từng người, bạn chia làm hai lượt: lượt 1 đi từ trái sang ghi tích bên trái; lượt 2 đi từ phải sang nhân thêm tích bên phải. Không cần phép chia!

**Pattern Recognition:**

- Signal: "product except self" + "no division" → **Prefix × Suffix**
- `answer[i] = product(nums[0..i-1]) × product(nums[i+1..n-1])`
- Dùng output array làm prefix, rồi sweep ngược với running suffix

**Visual — nums = [1, 2, 3, 4]:**

```
Index:          0    1    2    3
Left products:  1    1    2    6
Right products: 24   12   4    1
answer = L × R: 24   12   8    6
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                             |
| ---------------- | ---------------------------------------------------- |
| **When you see** | "product except self", "no division operator"        |
| **Think**        | Prefix/Suffix — tích trái × tích phải cho mỗi index  |
| **Template**     | `left[i] = left[i-1] * nums[i-1]; suffix *= nums[i]` |
| **Time target**  | ⏱️ 20 min (Medium)                                   |

> 💡 **Memory hook / Móc nhớ:** "Hai lượt đi — trái ghi, phải nhân — không cần chia!"

---

## Problem Description

Given an integer array `nums`, return an array `answer` where `answer[i]` equals the product of all elements except `nums[i]`. Must run in O(n) without using the division operator.

```
Example 1: [1,2,3,4]     → [24,12,8,6]
Example 2: [-1,1,0,-3,3] → [0,0,9,0,0]
```

Constraints:

- `2 <= nums.length <= 10^5`
- `-30 <= nums[i] <= 30`
- **Follow up**: Solve in O(1) extra space (output array doesn't count)

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an array of integers and need to return an array where each element is the product of all others except itself. Division is not allowed. Can there be zeros?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force would be O(n²) — nested loop. But I notice each answer[i] = leftProduct × rightProduct. I'll use a Prefix/Suffix approach: first pass builds prefix products in output array, second pass multiplies by a running suffix. O(n) time, O(1) extra space."

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll initialize result with 1s. Pass 1: left to right, result[i] = result[i-1] _ nums[i-1]. Pass 2: right to left with suffix variable, result[i] _= suffix, then suffix \*= nums[i]."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [1,2,3,4]: After pass 1: [1,1,2,6]. Pass 2 with suffix=1: i=3→6*1=6, suffix=4; i=2→2*4=8, suffix=12; i=1→1*12=12, suffix=24; i=0→1*24=24. Result [24,12,8,6]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — two passes. Space: O(1) extra — only suffix variable. Edge cases: zeros — one zero means only that index is non-zero; two+ zeros means all zeros."

---

## 📝 Interview Tips

1. **Clarify**: Can there be zeros? Multiple zeros? / Có số 0 không? Nhiều số 0 thì sao?
2. **Brute force**: Nested loop — O(n²), O(1) / Vòng lặp lồng nhau
3. **Optimize**: Two-pass prefix/suffix — O(n) time, O(1) extra space / Hai lượt, không cần mảng phụ
4. **Edge cases**: One zero → only that index non-zero; two+ zeros → all zeros / Xử lý số 0
5. **Follow-up**: If division allowed, handle zeros separately / Nếu cho phép chia, xử lý zero riêng

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                             | Why Wrong / Tại sao sai                          | Fix / Cách sửa                                      |
| --- | --------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| 1   | Using division `totalProduct / nums[i]`       | Violates constraint; fails when nums[i]=0        | Use prefix × suffix approach                        |
| 2   | Allocating separate left[] and right[] arrays | O(n) extra space — misses follow-up optimization | Use output array as prefix, running suffix variable |
| 3   | Forgetting to initialize result with 1s       | Multiplication with 0 gives wrong results        | `fill(1)` before prefix pass                        |

---

## Solutions

```typescript
/**
 * Solution 1: Left + Right Arrays (Instructional)
 * Time: O(n) — three passes
 * Space: O(n) — two auxiliary arrays
 */
function productExceptSelfBrute(nums: number[]): number[] {
  const n = nums.length;
  const left = new Array(n).fill(1);
  const right = new Array(n).fill(1);

  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];

  return left.map((l, i) => l * right[i]);
}

/**
 * Solution 2: Output Array + Running Suffix (Optimal)
 * Time: O(n) — two passes
 * Space: O(1) — output array doesn't count; one suffix variable
 */
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }

  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}

// === Test Cases ===
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]
```

---

## 🔗 Related Problems

- [Trapping Rain Water](./20-trapping-rain-water.md) — cùng pattern prefix/suffix arrays từ hai phía
- [Maximum Product Subarray](../../dp/problems/12-maximum-product-subarray.md) — tích mảng con tối đa với DP
- [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/) — prefix sum cơ bản

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
