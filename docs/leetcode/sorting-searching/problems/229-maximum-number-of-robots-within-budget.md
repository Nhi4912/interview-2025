---
layout: page
title: "Maximum Number of Robots Within Budget"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Queue, Sliding Window, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-robots-within-budget"
---

# Maximum Number of Robots Within Budget / Số Robot Tối Đa Trong Ngân Sách

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như thuê một đội robot liên tiếp — chi phí = max(charge) + k\*sum(run). Cần window dài nhất sao cho chi phí ≤ budget. Để lấy max trong cửa sổ trượt hiệu quả, dùng monotonic deque.

**Pattern Recognition:**

- Signal: "max of window" + "sliding window with sum constraint" → Monotonic Deque + Sliding Window
- Key insight: cost(window) = max(chargeTimes[l..r]) + (r-l+1)\*sum(runningCosts[l..r])

**Visual — Maximum Robots Within Budget:**

```
chargeTimes = [3,6,1,3,4], runningCosts = [2,1,3,4,5], budget = 25
Window cost = max(charge) + k * sum(run)

Sliding window (right expands, left shrinks on violation):
  k=1, sum=2, max=3: cost=3+1*2=5 ≤25 ✓
  k=2, sum=3, max=6: cost=6+2*3=12 ≤25 ✓
  k=3, sum=6, max=6: cost=6+3*6=24 ≤25 ✓
  k=4, sum=10, max=6: cost=6+4*10=46 >25 → shrink left
    remove idx=0, deque: [6], sum=8, k=3: cost=6+3*8=30 >25 → shrink
    remove idx=1, deque: [1,3,4], wait deque had 6 at front
  ...
Answer = 3
```

---

## Problem Description

You have `n` robots, each with a `chargeTimes[i]` and `runningCosts[i]`. Running `k` consecutive robots costs `max(chargeTimes[i..i+k-1]) + k * sum(runningCosts[i..i+k-1])`. Find the **maximum** number of consecutive robots you can run within `budget`.

Difficulty: Hard | Acceptance: 36.8%

```
Example 1:
  Input:  chargeTimes = [3,6,1,3,4], runningCosts = [2,1,3,4,5], budget = 25
  Output: 3

Example 2:
  Input:  chargeTimes = [11,12,19], runningCosts = [10,8,7], budget = 19
  Output: 0
```

Constraints:

- `1 <= n <= 5 * 10^4`
- `1 <= chargeTimes[i], runningCosts[i] <= 10^5`
- `1 <= budget <= 10^15`

---

## 📝 Interview Tips

1. **Clarify**: "Cost là max(charge) + k\*sum(run) — robots phải liên tiếp (consecutive)?" / Confirm robots must be consecutive.
2. **Two parts**: "Max charge → monotonic deque; sum run → prefix sum hoặc running sum" / Max uses deque, sum uses running total.
3. **Deque invariant**: "Deque giữ chỉ số theo thứ tự giảm dần của chargeTimes" / Deque stores indices in decreasing chargeTime order.
4. **Shrink condition**: "Khi cost > budget → shrink từ trái; cập nhật deque front khi l tăng" / Shrink left, remove deque front if it equals left pointer.
5. **Edge cases**: "budget rất lớn → answer có thể là n; một robot vẫn > budget → 0" / Large budget: all robots; any single robot > budget: 0.
6. **Follow-up**: "Binary search + deque O(n log n) thay vì O(n)? Không cần — O(n) đủ" / Binary search alternative exists but O(n) sliding window is optimal.

---

## Solutions

```typescript
/**
 * Solution 1: Sliding Window + Monotonic Deque
 * Time: O(n) — each index enters/leaves deque at most once
 * Space: O(n) — deque + prefix sum
 */
function maximumRobots(chargeTimes: number[], runningCosts: number[], budget: number): number {
  const n = chargeTimes.length;
  // Monotonic deque: stores indices with decreasing chargeTimes
  const deque: number[] = [];
  let left = 0,
    runSum = 0,
    ans = 0;

  for (let right = 0; right < n; right++) {
    // Maintain deque: remove smaller chargeTimes from back
    while (deque.length > 0 && chargeTimes[deque[deque.length - 1]] <= chargeTimes[right]) {
      deque.pop();
    }
    deque.push(right);
    runSum += runningCosts[right];

    const k = right - left + 1;
    const maxCharge = chargeTimes[deque[0]];
    const cost = maxCharge + k * runSum;

    // Shrink window from left if over budget
    while (left <= right && cost > budget) {
      runSum -= runningCosts[left];
      if (deque[0] === left) deque.shift();
      left++;
      const newK = right - left + 1;
      if (newK === 0) break;
      // Recompute since cost depends on k and runSum
      if (chargeTimes[deque[0]] + newK * runSum <= budget) break;
    }

    if (right - left + 1 > 0) {
      const currK = right - left + 1;
      const currMax = chargeTimes[deque[0]];
      if (currMax + currK * runSum <= budget) {
        ans = Math.max(ans, currK);
      }
    }
  }
  return ans;
}

/**
 * Solution 2: Binary Search + Deque (explicit)
 * Time: O(n log n)
 * Space: O(n)
 */
function maximumRobotsBinSearch(
  chargeTimes: number[],
  runningCosts: number[],
  budget: number,
): number {
  const n = chargeTimes.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + runningCosts[i];

  const canFit = (k: number): boolean => {
    const deq: number[] = [];
    for (let r = 0; r < n; r++) {
      // Maintain decreasing deque
      while (deq.length > 0 && chargeTimes[deq[deq.length - 1]] <= chargeTimes[r]) deq.pop();
      deq.push(r);
      if (r >= k) {
        if (deq[0] === r - k) deq.shift();
      }
      if (r >= k - 1) {
        const l = r - k + 1;
        const maxCharge = chargeTimes[deq[0]];
        const sumRun = prefix[r + 1] - prefix[l];
        if (maxCharge + k * sumRun <= budget) return true;
      }
    }
    return false;
  };

  let lo = 1,
    hi = n,
    ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canFit(mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

// === Test Cases ===
console.log(maximumRobots([3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25)); // 3
console.log(maximumRobots([11, 12, 19], [10, 8, 7], 19)); // 0
console.log(maximumRobotsBinSearch([3, 6, 1, 3, 4], [2, 1, 3, 4, 5], 25)); // 3
console.log(maximumRobotsBinSearch([11, 12, 19], [10, 8, 7], 19)); // 0
```

---

## 🔗 Related Problems

- [Longest Continuous Subarray With Absolute Diff ≤ Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — monotonic deque max/min
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — classic monotonic deque
- [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) — deque DP
- [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) — sliding window
- [Maximum Number of Robots Within Budget — LeetCode](https://leetcode.com/problems/maximum-number-of-robots-within-budget) — problem page
