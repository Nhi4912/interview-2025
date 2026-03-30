---
layout: page
title: "Sliding Window Maximum"
difficulty: Hard
category: String
tags: [Array, Deque, Sliding Window, Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/sliding-window-maximum/"
---

# Sliding Window Maximum / Giá Trị Lớn Nhất Trong Cửa Sổ Trượt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Deque
> **Frequency**: ⭐ Tier 2 — Bài chuẩn FAANG Hard, kiểm tra nắm vững monotonic deque
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Find All Anagrams](./19-find-all-anagrams-in-string.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn ngồi trên đoàn tàu, nhìn qua cửa sổ thấy đúng `k` cột điện. Mỗi khi tàu tiến thêm một ga, một cột mới xuất hiện và một cột cũ biến mất. Bạn muốn biết cột cao nhất trong tầm nhìn ở mọi thời điểm. Mẹo: khi cột mới cao hơn tất cả cột còn lại phía sau, những cột thấp đó sẽ không bao giờ là cao nhất — hãy loại bỏ chúng ngay để chỉ duy trì "danh sách ứng viên" hữu ích.

- **Pattern Recognition:**
  - "Max/min of each fixed-size window" → **Monotonic Deque** (O(n) vs O(nk) brute)
  - Store **indices**, not values — needed to check if front index is still inside window
  - Deque maintains **decreasing value order**: front = window max, back = smallest candidate

- **Visual — nums=[1,3,-1,-3,5], k=3:**

```
i=0: push 0        deque=[0]      vals=[1]         window not ready
i=1: 3>nums[0]=1 → pop 0, push 1  deque=[1]  [3]  window not ready
i=2: -1<3→push 2   deque=[1,2]   [3,-1]     → max = nums[1] = 3
i=3: -3<-1→push 3  deque=[1,2,3] [3,-1,-3]  → front idx=1 in [1..3] ✓ → max = 3
i=4: 5>all→clear, push 4  deque=[4]  [5]    → max = nums[4] = 5

result = [3, 3, 5] ✓
```

## Problem Description

Given integer array `nums` and window size `k`, return the maximum value at each window position as it slides right by one step.

```
Input: nums=[1,3,-1,-3,5,3,6,7], k=3 → Output: [3,3,5,5,6,7]
Input: nums=[1],                  k=1 → Output: [1]
Input: nums=[9,11],               k=2 → Output: [11]
```

## 📝 Interview Tips

1. **Brute first** / **Bắt đầu brute**: giải thích O(nk) trước, sau đó hỏi "làm sao tránh tính lại max?"
2. **Indices not values** / **Lưu index không lưu value**: cần kiểm tra `deque[0] <= i - k` để loại phần tử ra ngoài cửa sổ.
3. **Two-step cleanup per iteration** / **Hai bước mỗi vòng**: (1) pop front nếu out-of-window; (2) pop back khi `nums[back] <= nums[i]`.
4. **Deque invariant** / **Bất biến**: indices tăng dần, values giảm dần — front luôn là max của cửa sổ hiện tại.
5. **Amortized O(n)** / **O(n) amortized**: mỗi index push và pop tối đa 1 lần → tổng O(2n).
6. **Follow-up** / **Mở rộng**: sliding window minimum (đảo `<=` thành `>=`); sliding window median (max-heap + min-heap).

## Solutions

{% raw %}
/\*\*

- 239.  Sliding Window Maximum
- Brute: scan every element in each window independently.
- Time O(n·k), Space O(1)
  \*/
  function maxSlidingWindowBrute(nums: number[], k: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= nums.length - k; i++) {
  let max = nums[i];
  for (let j = i + 1; j < i + k; j++) max = Math.max(max, nums[j]);
  result.push(max);
  }
  return result;
  }

/\*\*

- Monotonic Deque — optimal solution.
- Deque stores indices in decreasing-value order.
- Front always points to the current window's maximum.
- Each element is pushed and popped at most once → amortized O(1) per element.
- Time O(n), Space O(k)
  \*/
  function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // indices

      for (let i = 0; i < nums.length; i++) {
          // Step 1: remove front index if it has left the window
          while (deque.length > 0 && deque[0] <= i - k) deque.shift();

          // Step 2: remove back indices whose values are ≤ current (they can never be max)
          while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();

          deque.push(i);

          // Record window max once the first full window is formed
          if (i >= k - 1) result.push(nums[deque[0]]);
      }

      return result;

  }

// Inline checks
console.log(JSON.stringify(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))); // [3,3,5,5,6,7]
console.log(JSON.stringify(maxSlidingWindow([1], 1))); // [1]
console.log(JSON.stringify(maxSlidingWindowBrute([9,11], 2))); // [11]
console.log(JSON.stringify(maxSlidingWindow([4,-2,-1,3,1,2], 2))); // [4,-1,3,3,2]
{% endraw %}

## 🔗 Related Problems

- [862. Shortest Subarray with Sum ≥ K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) — monotonic deque on prefix sums
- [1438. Longest Subarray with Absolute Diff ≤ Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/) — two deques (min + max) simultaneously
- [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) — variable-size sliding window classic
- [918. Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) — deque variant on circular array
- [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) — fixed-size window with character matching
