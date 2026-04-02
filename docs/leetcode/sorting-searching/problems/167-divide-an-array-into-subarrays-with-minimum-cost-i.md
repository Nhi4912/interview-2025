---
layout: page
title: "Divide an Array Into Subarrays With Minimum Cost I"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting, Enumeration]
leetcode_url: "https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-i"
---

# Divide an Array Into Subarrays With Minimum Cost I / Chia Mảng Thành Các Dãy Con Với Chi Phí Tối Thiểu I

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Chia mảng thành 3 phần: phần đầu luôn là `nums[0]`. Chi phí = tổng 3 giá trị đầu mỗi phần = `nums[0]` + 2 giá trị nhỏ nhất trong `nums[1..n-1]`. Vì nums[0] cố định, chỉ cần tìm 2 giá trị nhỏ nhất trong phần còn lại.

**Analogy:** Ba đội thi đấu — đội đầu tiên luôn được chọn sẵn. Để chi phí thấp nhất, chọn 2 đội yếu nhất trong số còn lại làm đội trưởng 2 nhóm sau.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Divide an Array Into Subarrays With Minimum Cost I example:**

```
nums = [1, 2, 3, 12]  k=3 subarrays
Cost = nums[0] + min1 + min2  from nums[1..]
     = 1 + 2 + 3 = 6

nums = [5, 4, 3, 2, 1]
Cost = 5 + 1 + 2 = 8  (two smallest from [4,3,2,1] are 1,2)
```

---

---

## Problem Description

| Problem                                                                                                                                  | Difficulty | Connection                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| [Divide an Array Into Subarrays With Minimum Cost II](https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-ii) | 🔴 Hard    | k subarrays version, needs heap |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                                         | 🔴 Hard    | Array partitioning              |
| [Minimum Cost to Split an Array](https://leetcode.com/problems/minimum-cost-to-split-an-array)                                           | 🔴 Hard    | DP split cost                   |

---

## 📝 Interview Tips

- **EN:** Cost of a division = sum of first elements of each subarray / **VI:** Chi phí = tổng phần tử đầu tiên của mỗi dãy con
- **EN:** First subarray always starts at index 0, so cost includes nums[0] / **VI:** Dãy con đầu tiên luôn bắt đầu ở index 0
- **EN:** Need k−1 = 2 more starting elements from nums[1..n-1]; pick the 2 smallest / **VI:** Cần 2 điểm chia nữa từ nums[1..n-1], chọn 2 nhỏ nhất
- **EN:** With k=3 and n≤50, sort nums[1..] and take first 2 / **VI:** k=3, n≤50, sort phần còn lại và lấy 2 phần tử đầu
- **EN:** No need for complex DP — greedy suffices for minimum starting element sum / **VI:** Không cần DP, greedy đủ vì tổng nhỏ nhất = chọn 2 nhỏ nhất
- **EN:** Edge: n=3 → exactly one way to divide, answer = nums[0]+nums[1]+nums[2] / **VI:** n=3 → chỉ có một cách, đáp án = tổng 3 phần tử

---

---

## Solutions

```typescript
/**
 * Cost = nums[0] + 2 smallest values from nums[1..n-1].
 * Time: O(n log n)  Space: O(n)
 */
function minimumCost(nums: number[]): number {
  const tail = nums.slice(1).sort((a, b) => a - b);
  return nums[0] + tail[0] + tail[1];
}

// Tests
console.log(minimumCost([1, 2, 3, 12])); // 6
console.log(minimumCost([5, 4, 3, 2, 1])); // 8
console.log(minimumCost([10, 3, 1, 1])); // 12

/**
 * Single pass to find 2 smallest in nums[1..] without sorting.
 * Time: O(n)  Space: O(1)
 */
function minimumCost2(nums: number[]): number {
  let min1 = Infinity,
    min2 = Infinity;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= min1) {
      min2 = min1;
      min1 = nums[i];
    } else if (nums[i] < min2) {
      min2 = nums[i];
    }
  }
  return nums[0] + min1 + min2;
}

// Tests
console.log(minimumCost2([1, 2, 3, 12])); // 6
console.log(minimumCost2([5, 4, 3, 2, 1])); // 8
console.log(minimumCost2([10, 3, 1, 1])); // 12
console.log(minimumCost2([1, 1, 1])); // 3

/**
 * Try all valid split points (i,j) with 0<i<j<n; return min cost.
 * Time: O(n^2)  Space: O(1)  — valid for n<=50
 */
function minimumCost3(nums: number[]): number {
  const n = nums.length;
  let best = Infinity;

  for (let i = 1; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      // Subarrays: [0..i-1], [i..j-1], [j..n-1]
      const cost = nums[0] + nums[i] + nums[j];
      best = Math.min(best, cost);
    }
  }
  return best;
}

// Tests
console.log(minimumCost3([1, 2, 3, 12])); // 6
console.log(minimumCost3([5, 4, 3, 2, 1])); // 8
```

---

## 🔗 Related Problems

| Problem                                                                                                                                  | Difficulty | Connection                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| [Divide an Array Into Subarrays With Minimum Cost II](https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-ii) | 🔴 Hard    | k subarrays version, needs heap |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                                         | 🔴 Hard    | Array partitioning              |
| [Minimum Cost to Split an Array](https://leetcode.com/problems/minimum-cost-to-split-an-array)                                           | 🔴 Hard    | DP split cost                   |
