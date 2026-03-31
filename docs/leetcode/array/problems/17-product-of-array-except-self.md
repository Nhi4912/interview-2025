---
layout: page
title: "Product of Array Except Self"
difficulty: Medium
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/product-of-array-except-self/"
---

# Product of Array Except Self / Tích Mảng Ngoại Trừ Chính Nó

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix/Suffix Array
> **Frequency**: 🔥 Tier 1 — bài kinh điển kiểm tra tư duy prefix/suffix, cấm dùng phép chia
> **See also**: [Trapping Rain Water](./20-trapping-rain-water.md) | [Maximum Product Subarray](../../dp/problems/12-maximum-product-subarray.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trong một hàng người và muốn biết tích chiều cao của tất cả người khác (trừ bạn). Thay vì hỏi từng người, bạn chia làm hai lượt: lượt 1 đi từ trái sang, ghi lại tích tất cả người ở bên trái; lượt 2 đi từ phải sang, nhân thêm tích tất cả người ở bên phải. Kết hợp hai lượt là xong — không cần phép chia!

**Pattern Recognition:**

- Signal: "product except self / tích ngoại trừ chính nó" + "no division" → **Prefix × Suffix**
- `answer[i] = product(nums[0..i-1]) × product(nums[i+1..n-1])`
- Dùng output array làm prefix array, rồi sweep ngược lại với một biến running suffix

**Visual — nums = [1, 2, 3, 4]:**

```
Index:          0    1    2    3

Left products:  1    1    2    6    (product of all elements strictly LEFT of i)
                ^    1×1  1×2  2×3

Right products: 24   12   4    1    (product of all elements strictly RIGHT of i)
                2×3×4 3×4  4    ^

answer = L × R: 24   12   8    6
```

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
- The product of any prefix or suffix fits in a 32-bit integer
- **Follow up**: Can you solve it in O(1) extra space? (output array does not count)

---

## 📝 Interview Tips

1. **Clarify**: Can there be zeros? Multiple zeros? / Có số 0 không? Nhiều số 0 thì sao?
2. **Brute force**: For each index i, multiply all other elements — O(n²), O(1) / Vòng lặp lồng nhau
3. **Optimize**: Two-pass prefix/suffix using output array — O(n) time, O(1) extra space / Hai lượt, không cần mảng phụ
4. **Edge cases**: One zero → only that position is non-zero; two+ zeros → all zeros / Xử lý số 0 cẩn thận
5. **Follow-up**: What if division were allowed — how would you handle zeros? / Nếu dùng phép chia, xử lý số 0 thế nào?

---

## Solutions

```typescript

/**

- Solution 1: Explicit Left Array × Right Array (Brute Force / Instructional)
- Time: O(n) — three passes over the array
- Space: O(n) — two auxiliary arrays of size n
  */
  function productExceptSelfBrute(nums: number[]): number[] {
  const n = nums.length;
  const left = new Array(n).fill(1);
  const right = new Array(n).fill(1);

for (let i = 1; i < n; i++) left[i] = left[i - 1] _ nums[i - 1];
for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] _ nums[i + 1];

return left.map((l, i) => l * right[i]);
}

/**

- Solution 2: Prefix in Output Array + Running Suffix (Optimal)
- Time: O(n) — two passes
- Space: O(1) — output array doesn't count; only one scalar `suffix` variable
  */
  function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);

// Pass 1: result[i] holds product of nums[0..i-1]
for (let i = 1; i < n; i++) {
result[i] = result[i - 1] * nums[i - 1];
}

// Pass 2: multiply by running product of nums[i+1..n-1]
let suffix = 1;
for (let i = n - 1; i >= 0; i--) {
result[i] _= suffix;
suffix _= nums[i];
}

return result;
}

// === Test Cases ===
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]

```

---

## 🔗 Related Problems

- [Trapping Rain Water](./20-trapping-rain-water.md) — cùng pattern precompute prefix/suffix arrays từ hai phía
- [Maximum Product Subarray](../../dp/problems/12-maximum-product-subarray.md) — tích mảng con tối đa với DP
