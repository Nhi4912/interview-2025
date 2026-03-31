---
layout: page
title: "Next Greater Element II"
difficulty: Medium
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/next-greater-element-ii"
---

# Next Greater Element II / Phần Tử Lớn Hơn Tiếp Theo II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **dãy núi vòng tròn** — đứng ở mỗi đỉnh, nhìn về phía trước theo chiều kim đồng hồ tìm đỉnh cao hơn đầu tiên. Monotonic Stack lưu các chỉ số "chưa tìm được đỉnh cao hơn". Mảng vòng → duyệt `2n` lần, dùng `% n`.

```
nums = [1, 2, 1]   → circular
i=0: push 0          stack=[0]
i=1: 2>nums[0]=1 → pop, result[0]=2; push 1  stack=[1]
i=2: 1<nums[1]=2 → push 2  stack=[1,2]
i=3(→0): 1<nums[1]=2, 1=nums[2]=1 (not >) → no pop
i=4(→1): 2>nums[2]=1 → pop 2, result[2]=2  stack=[1]
Answer: [2, -1, 2]
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng **vòng tròn** `nums`. Với mỗi phần tử, tìm **phần tử lớn hơn kế tiếp** (nhìn về phía trước rồi quay vòng). Không tồn tại → trả `-1`.

- **Input:** `nums = [1,2,1]` → **Output:** `[2,-1,2]`
- **Input:** `nums = [1,2,3,4,3]` → **Output:** `[2,3,4,-1,4]`

**Constraints:** `1 <= nums.length <= 10^4`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Circular array trick: loop `2n` times, use `i % n` as real index. **VI:** Mảng vòng: duyệt 2n lần, dùng `i % n` làm chỉ số thực.
2. **EN:** Monotonic decreasing stack stores indices; pop when a greater element is found. **VI:** Stack đơn điệu giảm lưu chỉ số; pop khi tìm phần tử lớn hơn.
3. **EN:** Only push in first pass (i < n) to avoid duplicate index entries. **VI:** Chỉ push trong n lần đầu để tránh trùng.
4. **EN:** Initialize result array with -1; only overwrite when a greater element is found. **VI:** Khởi tạo kết quả với -1; chỉ ghi đè khi tìm được.
5. **EN:** Time O(n), Space O(n) for stack. **VI:** O(n) thời gian và không gian.
6. **EN:** Brute force O(n²): for each element, scan up to n-1 next positions circularly. **VI:** Brute force O(n²): mỗi phần tử duyệt tối đa n-1 vị trí.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Monotonic Stack + 2-Pass Circular  O(n) time, O(n) space ────
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack: number[] = []; // stores indices

  for (let i = 0; i < 2 * n; i++) {
    const curr = nums[i % n];
    // Pop all indices whose value is smaller than current
    while (stack.length > 0 && nums[stack[stack.length - 1]] < curr) {
      result[stack.pop()!] = curr;
    }
    // Only push real indices (first pass)
    if (i < n) stack.push(i);
  }

  return result;
}

// ─── Solution 2: Brute Force  O(n²) time, O(1) extra space ───────────────────
function nextGreaterElementsBrute(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j++) {
      if (nums[(i + j) % n] > nums[i]) {
        result[i] = nums[(i + j) % n];
        break;
      }
    }
  }

  return result;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(nextGreaterElements([1, 2, 1])); // [2, -1, 2]
console.log(nextGreaterElements([1, 2, 3, 4, 3])); // [2, 3, 4, -1, 4]
console.log(nextGreaterElements([5, 4, 3, 2, 1])); // [-1, 5, 5, 5, 5]
console.log(nextGreaterElementsBrute([1, 2, 1])); // [2, -1, 2]
console.log(nextGreaterElementsBrute([5, 4, 3, 2, 1])); // [-1, 5, 5, 5, 5]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                        | Difficulty | Pattern         |
| --- | ---------------------------------------------------------------------------------------------- | ---------- | --------------- |
| 496 | [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i)                 | 🟢 Easy    | Monotonic Stack |
| 739 | [Daily Temperatures](https://leetcode.com/problems/daily-temperatures)                         | 🟡 Medium  | Monotonic Stack |
| 84  | [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | 🔴 Hard    | Monotonic Stack |
