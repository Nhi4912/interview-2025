---
layout: page
title: "Maximum Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Divide and Conquer, Array]
leetcode_url: "https://leetcode.com/problems/maximum-subarray/"
leetcode_number: 53
pattern: "Kadane's Algorithm"
frequency_tier: 1
companies: [Amazon, Google, Meta, Microsoft, Apple]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Maximum Subarray / Mảng Con Có Tổng Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Kadane's Algorithm
> **Frequency**: 🔥 Tier 1 — Bài nền tảng của mọi bài tìm subarray tối ưu
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Google, Meta, Microsoft, Apple
> **See also**: [Best Time to Buy & Sell Stock](./02-best-time-to-buy-and-sell-stock.md) | [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đo nhiệt độ liên tiếp trong tháng — bạn muốn tìm chuỗi ngày có tổng nhiệt độ cao nhất. Nếu tổng đang âm, tiếp tục cộng thêm chỉ kéo xuống — tốt hơn là "bắt đầu lại" từ ngày đó. Đây chính là quyết định cốt lõi của Kadane.

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

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                           |
| ---------------- | ------------------------------------------------------------------ |
| **When you see** | "contiguous subarray", "maximum sum", "largest sum subarray"       |
| **Think**        | Kadane's — extend current subarray or restart from current element |
| **Template**     | `cur = max(nums[i], cur + nums[i]); best = max(best, cur)`         |
| **Time target**  | ⏱️ 20 min (Medium)                                                 |

> 💡 **Memory hook / Móc nhớ:** "Tổng âm = hành lý nặng — bỏ lại, bắt đầu lại từ bước mới!"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an integer array, possibly with negatives.
> We need the maximum sum of any contiguous subarray (at least one element).
> Clarification: Can the array be all negatives? — Yes, return the largest single element."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: check all O(n²) subarrays.
> But I notice at each element the choice is: extend the current subarray or start fresh.
> If currentSum + nums[i] < nums[i], the prefix is hurting us — reset.
> I'll use Kadane's Algorithm: O(n) time, O(1) space. Shall I code it?"

### Step 3 — Implement / Viết Code (5-7 min)

> "Initialize currentSum and maxSum to nums[0].
> Iterate from index 1: currentSum = max(nums[i], currentSum + nums[i]).
> Update maxSum = max(maxSum, currentSum) each step."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [-2,1,-3,4,-1,2,1,-5,4].
> i=0: cur=-2, max=-2. i=1: cur=max(1,-1)=1, max=1.
> i=3: cur=max(4,4-2)=4, max=4. i=6: cur=6, max=6. Return 6. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — single pass. Space: O(1) — two variables.
> Edge cases: all negatives → return max element; single element; all positives → entire sum.
> Follow-up: return the actual subarray indices? Track start/end when resetting."

---

## 📝 Interview Tips

1. **Clarify**: Can array be all negative? Must return largest single element / Mảng toàn âm → phần tử lớn nhất
2. **Brute force**: Try all subarrays O(n²) — duyệt mọi cặp start/end
3. **Optimize**: Kadane's: extend or restart at each step — O(n) / Quyết định tham lam tại từng bước
4. **Edge cases**: All negatives → max element; single element → return it; all positive → sum whole array
5. **Follow-up**: Return actual subarray indices? Track start/end when currentSum resets

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                    | Why Wrong / Tại sao sai                                    | Fix / Cách sửa                             |
| --- | ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------ |
| 1   | Initialize maxSum = 0                | Fails for all-negative arrays: [-3,-2,-1] should return -1 | Initialize maxSum = nums[0]                |
| 2   | Reset currentSum to 0 instead of num | `max(0, cur+num)` loses the best single negative element   | `currentSum = max(nums[i], cur + nums[i])` |
| 3   | Confuse subarray with subsequence    | Subarray must be contiguous; subsequence can skip elements | Clarify "contiguous" requirement upfront   |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — enumerate all subarrays
 * Time: O(n²) — try every start/end pair
 * Space: O(1) — no extra memory
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
 * Solution 2: Kadane's Algorithm (Optimal)
 * Time: O(n) — single pass, one decision per element
 * Space: O(1) — two variables: currentSum and maxSum
 */
function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
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
- [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) — biến thể phép nhân, track cả min
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) — prefix sum thay Kadane

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
