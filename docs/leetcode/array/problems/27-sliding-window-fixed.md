---
layout: page
title: "Sliding Window Fixed Size"
difficulty: Easy
category: Array
tags: [Array, Sliding Window, String]
leetcode_url: "https://leetcode.com/problems/maximum-average-subarray-i/"
---

# Sliding Window (Fixed Size) / Cửa Sổ Trượt Kích Thước Cố Định

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window (Fixed)
> **Frequency**: 📘 Tier 3 — Template nền tảng; hay xuất hiện dưới dạng sub-problem
> **See also**: [Two Pointers Sorted](./28-two-pointers-sorted.md) | [Maximum Average Subarray I (LC 643)](https://leetcode.com/problems/maximum-average-subarray-i/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một khung cửa sổ kích thước cố định trượt dọc theo hàng số. Mỗi lần trượt sang phải 1 ô: phần tử bên trái rời khỏi, phần tử bên phải gia nhập. Chỉ cần cập nhật 2 thứ thay vì tính lại toàn bộ từ đầu.

**Pattern Recognition:**

- Signal: "subarray of size exactly k", "every k consecutive elements", "window of k" → **Fixed Sliding Window**
- Biến O(n·k) brute force thành O(n) bằng cách tái sử dụng kết quả cửa sổ trước
- Formula: `newWindowSum = prevWindowSum + nums[i] - nums[i - k]`

**Visual — Max Sum Subarray of Size k=3:**

```
nums = [2, 1, 5, 1, 3, 2]

Step 0: Build initial window
        [2, 1, 5], 1, 3, 2   sum=8,  max=8

Step 1: Slide right by 1
         2, [1, 5, 1], 3, 2   +nums[3]=1, -nums[0]=2   sum=7,  max=8

Step 2: Slide right by 1
         2, 1, [5, 1, 3], 2   +nums[4]=3, -nums[1]=1   sum=9,  max=9 ✓

Step 3: Slide right by 1
         2, 1, 5, [1, 3, 2]   +nums[5]=2, -nums[2]=5   sum=6,  max=9

Answer: 9
```

---

## Problem Description

**Template Problem (LC 643 — Maximum Average Subarray I):** Given integer array `nums` and integer `k`, find the contiguous subarray of length exactly `k` with the maximum sum. Return the maximum sum (LC 643 returns the average).

```
Example 1: nums = [2,1,5,1,3,2], k = 3  →  9   (subarray [5,1,3])
Example 2: nums = [1,12,-5,-6,50,3], k = 4  →  51  (subarray [12,-5,-6,50]? no → [-5,-6,50,3]=42; [1,12,-5,-6]=2; [12,-5,-6,50]=51 ✓)
```

Constraints: `1 <= k <= nums.length <= 10^5`, `-10^4 <= nums[i] <= 10^4`

---

## 📝 Interview Tips

1. **Template phrase**: "Khi window trượt 1 ô, chỉ 2 thứ thay đổi: phần tử vào (bên phải) và phần tử ra (bên trái)" — nói điều này trước khi code
2. **Fixed vs Variable**: Fixed window → size luôn là `k`; Variable window → expand/shrink dựa trên điều kiện (e.g., LC 3, 76)
3. **Edge case k == n**: Toàn bộ mảng là một window duy nhất — vòng lặp không chạy, trả về tổng ban đầu
4. **All negatives**: Vẫn hoạt động — max sum là giá trị ít âm nhất; không cần khởi tạo `maxSum = 0`
5. **Follow-up**: "Max sum of ANY subarray (not fixed k)?" → Kadane's Algorithm (O(n), dynamic window / DP)
6. **Generalize**: Template này áp dụng cho bất kỳ aggregate nào (sum, min, max, count, average, frequency map) trên window size `k` cố định

---

## Solutions

{% raw %}
/\*\*

- Solution 1: Sliding Window — O(n) time, O(1) space ✅ Recommended
-
- Phase 1: Build initial window of size k, record its sum.
- Phase 2: Slide window right — add incoming element, remove outgoing element.
- Track maximum sum seen across all window positions.
  \*/
  function maxSumFixedWindow(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i]; // Phase 1: initial window

let maxSum = windowSum;

for (let i = k; i < nums.length; i++) { // Phase 2: slide
windowSum += nums[i] - nums[i - k]; // add right, remove left
maxSum = Math.max(maxSum, windowSum);
}

return maxSum;
}

/\*\*

- Solution 2: Brute Force — O(n·k) time, O(1) space
-
- Recomputes the sum for each window from scratch.
- Keep for comparison only — shows why sliding window matters.
  \*/
  function maxSumBrute(nums: number[], k: number): number {
  let maxSum = -Infinity;
  for (let i = 0; i <= nums.length - k; i++) {
  let sum = 0;
  for (let j = i; j < i + k; j++) sum += nums[j];
  maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
  }

// === Universal Fixed-Window Template ===
// function fixedWindow(arr, k):
// // Phase 1: build initial window
// init windowState from arr[0..k-1]
// best = windowState
// // Phase 2: slide
// for i from k to n-1:
// add arr[i] ← right element enters
// remove arr[i-k] ← left element leaves
// update best from windowState
// return best
//
// Use for: max/min/avg/count/frequency in a fixed-size window.

// === Test Cases ===
console.log(maxSumFixedWindow([2, 1, 5, 1, 3, 2], 3)); // 9
console.log(maxSumFixedWindow([1, 12, -5, -6, 50, 3], 4)); // 51
console.log(maxSumFixedWindow([-2, -3, 4, -1], 2)); // 3 (4 + -1)
console.log(maxSumFixedWindow([5], 1)); // 5
{% endraw %}

---

## 🔗 Related Problems

- [Maximum Average Subarray I (LC 643)](https://leetcode.com/problems/maximum-average-subarray-i/) — direct application (return average = sum / k)
- [Sliding Window Maximum (LC 239)](https://leetcode.com/problems/sliding-window-maximum/) — fixed window, max element instead of sum (needs monotonic deque)
- [Find All Anagrams in a String (LC 438)](https://leetcode.com/problems/find-all-anagrams-in-a-string/) — fixed window on string with character frequency map
- [Two Pointers Sorted](./28-two-pointers-sorted.md) — complementary pointer technique for pair/triplet problems
