---
layout: page
title: "Constrained Subsequence Sum"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Queue, Sliding Window, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/constrained-subsequence-sum"
---

# Constrained Subsequence Sum / Tổng Dãy Con Bị Ràng Buộc

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Monotonic Deque
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) | [Jump Game VI](https://leetcode.com/problems/jump-game-vi)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhảy qua các tảng đá — bạn có thể bỏ qua tảng, nhưng giữa hai tảng bạn chọn, khoảng cách ≤ k. Tìm tổng điểm lớn nhất của các tảng đã chọn.

**Pattern Recognition:**

- `dp[i]` = tổng lớn nhất của dãy con kết thúc tại `i`
- `dp[i] = nums[i] + max(0, max(dp[j]) for j in [i-k, i-1])`
- Max trong cửa sổ trượt → **Monotonic Deque (decreasing)** → O(n)

```
nums=[10,2,-10,5,20], k=2

i=0: dp[0]=10,    deque=[0]
i=1: front=0 ✓,  dp[1]=2+max(0,dp[0])=12,  deque=[1]  (12>10 → pop 0)
i=2: front=1 ✓,  dp[2]=-10+max(0,dp[1])=2, deque=[1,2]
i=3: front=1, 1≥1=i-k ✓, dp[3]=5+dp[1]=17, deque=[3]  (17>2,17>12)
i=4: front=3 ✓,  dp[4]=20+dp[3]=37,        deque=[4]
Answer = max(dp) = 37
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng `nums` và số nguyên `k`. Trả về **tổng lớn nhất** của dãy con không rỗng, trong đó mọi cặp chỉ số kề `(i, j)` trong dãy con thỏa `0 ≤ i-j ≤ k`.

**Example 1:** `nums=[10,2,-10,5,20]`, `k=2` → `37` (chọn indices 0,1,3,4)
**Example 2:** `nums=[-1,-2,-3]`, `k=1` → `-1`

**Constraints:** `1 ≤ nums.length ≤ 10⁵`, `-10⁴ ≤ nums[i] ≤ 10⁴`, `1 ≤ k ≤ nums.length`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** `dp[i]` = max non-empty subsequence sum ending exactly at i. Key: must include nums[i].
   **VI:** `dp[i]` = tổng lớn nhất của dãy con không rỗng kết thúc tại i. Bắt buộc có nums[i].

2. **EN:** The term `max(0, ...)` handles the case where best is to start fresh at i (no previous element).
   **VI:** `max(0, ...)` xử lý trường hợp bắt đầu dãy mới tại i (không lấy phần tử nào trước).

3. **EN:** Deque invariant: indices in increasing order, dp values in decreasing order (max at front).
   **VI:** Deque: chỉ số tăng dần, giá trị dp giảm dần (max ở đầu).

4. **EN:** Remove front when it goes out of window [i-k, i-1]. Pop back when new dp[i] ≥ dp[back].
   **VI:** Pop đầu khi ra khỏi cửa sổ. Pop cuối khi dp[i] mới ≥ dp[cuối].

5. **EN:** Answer = max(dp[i]) over all i (not just dp[n-1]).
   **VI:** Đáp án = max(dp[i]) trên tất cả i (không chỉ dp[n-1]).

6. **EN:** Alternative: max-heap O(n log n). For all-negative arrays, answer = max element.
   **VI:** Có thể dùng heap O(n log n). Mảng toàn âm → đáp án = phần tử lớn nhất.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: DP + Brute Force — O(n·k) ───────────────────────────────────
function constrainedSubsequenceSum_brute(nums: number[], k: number): number {
  const n = nums.length;
  const dp = [...nums];

  for (let i = 1; i < n; i++) {
    for (let j = Math.max(0, i - k); j < i; j++) {
      if (dp[j] > 0) dp[i] = Math.max(dp[i], nums[i] + dp[j]);
    }
  }
  return Math.max(...dp);
}

// ─── Solution 2: DP + Monotonic Deque — O(n) ─────────────────────────────────
// Deque stores indices with decreasing dp values.
// Front = best previous dp within window [i-k, i-1].
function constrainedSubsequenceSum(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  const deque: number[] = []; // indices, dp values strictly decreasing
  let ans = -Infinity;

  for (let i = 0; i < n; i++) {
    // Remove front if out of window
    while (deque.length > 0 && deque[0] < i - k) deque.shift();

    // dp[i] = nums[i] + max(0, best dp in window)
    const prevBest = deque.length > 0 ? Math.max(0, dp[deque[0]]) : 0;
    dp[i] = nums[i] + prevBest;

    ans = Math.max(ans, dp[i]);

    // Maintain decreasing deque: pop back entries with dp ≤ dp[i]
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
      deque.pop();
    }
    deque.push(i);
  }

  return ans;
}

// ─── Solution 3: DP + Max-Heap — O(n log n) ──────────────────────────────────
// Heap of [dp_value, index]. Lazily skip stale (out-of-window) entries.
function constrainedSubsequenceSum_heap(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  // Min-heap simulation using sorted array (for correctness, not performance)
  const heap: Array<[number, number]> = [];

  const heapPush = (entry: [number, number]) => {
    heap.push(entry);
    heap.sort((a, b) => b[0] - a[0]); // max-heap by dp value
  };

  let ans = -Infinity;
  for (let i = 0; i < n; i++) {
    // Remove stale entries from front (they're out of window)
    while (heap.length > 0 && heap[0][1] < i - k) heap.shift();

    const prevBest = heap.length > 0 ? Math.max(0, heap[0][0]) : 0;
    dp[i] = nums[i] + prevBest;
    ans = Math.max(ans, dp[i]);
    heapPush([dp[i], i]);
  }

  return ans;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(constrainedSubsequenceSum([10, 2, -10, 5, 20], 2)); // 37
console.log(constrainedSubsequenceSum([-1, -2, -3], 1)); // -1
console.log(constrainedSubsequenceSum([10, -2, -10, -5, 20], 2)); // 23
console.log(constrainedSubsequenceSum_brute([10, 2, -10, 5, 20], 2)); // 37
console.log(constrainedSubsequenceSum_heap([10, 2, -10, 5, 20], 2)); // 37
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                      | Difficulty | Pattern              |
| ---- | ------------------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| 1696 | [Jump Game VI](https://leetcode.com/problems/jump-game-vi)                                                   | 🟡 Medium  | DP + Monotonic Deque |
| 239  | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum)                               | 🔴 Hard    | Monotonic Deque      |
| 862  | [Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k) | 🔴 Hard    | Monotonic Deque      |
