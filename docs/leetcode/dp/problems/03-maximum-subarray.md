---
layout: page
title: "Maximum Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Divide and Conquer, Array]
leetcode_url: "https://leetcode.com/problems/maximum-subarray/"
---

# Maximum Subarray / Mảng Con Có Tổng Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP (Kadane's Algorithm)
> **Frequency**: 🔥 Tier 1 — Bài nền tảng của mọi bài tìm subarray tối ưu
> **See also**: [Best Time to Buy & Sell Stock](./02-best-time-to-buy-and-sell-stock.md) | [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đo nhiệt độ liên tiếp trong tháng — bạn muốn tìm chuỗi ngày có tổng nhiệt độ cao nhất. Nếu tổng đang âm, tiếp tục cộng thêm ngày mới chỉ kéo xuống thấp hơn — tốt hơn là "bắt đầu lại" từ ngày đó. Đây chính là quyết định cốt lõi của Kadane.

**Pattern Recognition:**

- Signal: "contiguous subarray", "maximum sum" → **Kadane's Algorithm (DP)**
- Quyết định tại mỗi phần tử: tiếp tục subarray cũ hay bắt đầu subarray mới?
- `currentSum = max(nums[i], currentSum + nums[i])` — nếu cộng thêm chỉ làm tệ hơn, reset

**Visual — nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]:**

```
Index:       0   1   2   3   4   5   6   7   8
Value:      -2   1  -3   4  -1   2   1  -5   4
currentSum: -2   1  -2   4   3   5   6   1   5
maxSum:     -2   1   1   4   4   5   6   6   6
                                     ↑
                              maxSum = 6  (subarray [4,-1,2,1])
```

---

## Problem Description

Given an integer array `nums`, find the **contiguous subarray** with the largest sum and return its sum. The array may contain negative numbers; a subarray must have at least one element.

```
Example 1: [-2,1,-3,4,-1,2,1,-5,4] → 6    (subarray [4,-1,2,1])
Example 2: [1]                      → 1
Example 3: [5,4,-1,7,8]             → 23   (whole array)
```

Constraints:

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: Can the array be all negative? Must return the largest single element / Mảng toàn âm thì vẫn phải trả về phần tử lớn nhất
2. **Brute force**: Try all subarrays O(n²) — duyệt mọi cặp start/end
3. **Optimize**: Kadane's: at each step, extend or restart the subarray — O(n) / Quyết định tham lam tại từng bước
4. **Edge cases**: All negatives → max single element; single element → return it; all positive → sum whole array
5. **Follow-up**: Return the actual subarray indices? / Trả về cả chỉ số start/end của subarray?

---

## Solutions

```typescript

/**

- Solution 1: Brute Force
- Time: O(n²) — enumerate all subarrays
- Space: O(1) — no extra memory
  */
  function maxSubArrayBrute(nums: number[]): number {
  let maxSum = -Infinity;

for (let i = 0; i < nums.length; i++) {
let currentSum = 0;
for (let j = i; j < nums.length; j++) {
currentSum += nums[j];
maxSum = Math.max(maxSum, currentSum);
}
}

return maxSum;
}

/**

- Solution 2: Kadane's Algorithm (Optimal)
- Time: O(n) — single pass, one decision per element
- Space: O(1) — two variables: currentSum and maxSum
  */
  function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let maxSum = nums[0];

for (let i = 1; i < nums.length; i++) {
// Extend existing subarray OR start fresh from nums[i]
currentSum = Math.max(nums[i], currentSum + nums[i]);
maxSum = Math.max(maxSum, currentSum);
}

return maxSum;
}

// === Test Cases ===
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1])); // 1
console.log(maxSubArray([-1, -2, -3])); // -1 (edge: all negative)

```

---

## 🔗 Related Problems

- [Best Time to Buy and Sell Stock](./02-best-time-to-buy-and-sell-stock.md) — Kadane variant trên mảng chênh lệch giá
- [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) — biến thể với phép nhân, cần track cả min
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — biến thể dùng prefix sum thay Kadane
