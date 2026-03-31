---
layout: page
title: "Jump Game VI"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Queue, Heap (Priority Queue), Monotonic Queue]
leetcode_url: "https://leetcode.com/problems/jump-game-vi"
---

# Jump Game VI / Trò Chơi Nhảy VI — Tối Đa Hoá Điểm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP + Monotonic Deque
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) | [Delivering Boxes from Storage to Ports](https://leetcode.com/problems/delivering-boxes-from-storage-to-ports)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đi trên đường có thu phí — mỗi ô có điểm thưởng/phạt, bạn được nhảy 1~k bước. Bài toán: chọn đường đi tối ưu. DP + "cửa sổ trượt tối đa" bằng deque đơn điệu.

**Pattern Recognition:**

- DP: `dp[i]` = điểm tối đa khi đứng tại `i`
- Transition: `dp[i] = nums[i] + max(dp[i-k], ..., dp[i-1])`
- Bottleneck O(nk) → dùng Monotonic Deque (decreasing) → O(n)

```
nums = [1,-1,-2,4,-7,3], k=2

dp[0]=1 (base)
dp[1]=nums[1]+max(dp[0])=-1+1=0     deque=[0→1, 1→0]
dp[2]=nums[2]+max(dp[0],dp[1])=-2+1=-1   deque=[0→1, 2→-1]
dp[3]=nums[3]+max(dp[1],dp[2])=4+0=4    deque=[3→4]
dp[4]=nums[4]+max(dp[2],dp[3])=-7+4=-3  deque=[3→4, 4→-3]
dp[5]=nums[5]+max(dp[3],dp[4])=3+4=7    → ans=7
```

---

## Problem Description / Mô Tả Bài Toán

Bắt đầu tại `nums[0]`, mỗi lần nhảy từ `i` có thể đến `i+1, i+2, ..., i+k`. Tổng điểm = tổng `nums[j]` của các ô đã đứng. Trả về **tổng điểm tối đa** khi đến `nums[n-1]`.

**Example 1:** `nums=[1,-1,-2,4,-7,3]`, `k=2` → `7`
**Example 2:** `nums=[10,-5,-2,4,0,3]`, `k=3` → `17`

**Constraints:** `1 ≤ nums.length ≤ 10⁵`, `-10⁴ ≤ nums[i] ≤ 10⁴`, `1 ≤ k ≤ nums.length`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Define dp[i] = max score to reach index i (must land on i). Transition needs max of dp in window [i-k, i-1].
   **VI:** dp[i] = điểm tối đa để đến index i. Transition cần max dp trong cửa sổ [i-k, i-1].

2. **EN:** Brute force O(nk) TLEs for n=10⁵, k=10⁵. Monotonic deque gives O(n).
   **VI:** Brute O(nk) chậm với n lớn. Monotonic deque cho O(n).

3. **EN:** Deque stores indices in decreasing dp-value order; front is always the max in window.
   **VI:** Deque lưu chỉ số theo thứ tự dp giảm dần; đầu deque là max trong cửa sổ.

4. **EN:** When processing i: (1) pop front if out of window, (2) compute dp[i], (3) pop back while dp[back] ≤ dp[i].
   **VI:** Khi xử lý i: (1) pop đầu nếu ra ngoài cửa sổ, (2) tính dp[i], (3) pop cuối khi dp[cuối] ≤ dp[i].

5. **EN:** Alternative: segment tree or heap — deque is cleanest. Heap needs lazy deletion.
   **VI:** Có thể dùng segment tree hoặc heap — deque gọn nhất. Heap cần lazy deletion.

6. **EN:** Always start dp[0] = nums[0]; the first element is always included.
   **VI:** dp[0] = nums[0]; phần tử đầu luôn được chọn.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: DP + Brute Force — O(n·k) ───────────────────────────────────
function maxResult_brute(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(-Infinity);
  dp[0] = nums[0];

  for (let i = 1; i < n; i++) {
    for (let j = Math.max(0, i - k); j < i; j++) {
      dp[i] = Math.max(dp[i], dp[j] + nums[i]);
    }
  }
  return dp[n - 1];
}

// ─── Solution 2: DP + Monotonic Deque — O(n) ─────────────────────────────────
// Deque stores indices with decreasing dp values (max at front).
// Front always holds the index with best dp[j] within window [i-k, i-1].
function maxResult(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];

  const deque: number[] = [0]; // indices, dp values decreasing

  for (let i = 1; i < n; i++) {
    // Remove front if it's outside the window [i-k, i-1]
    while (deque.length > 0 && deque[0] < i - k) deque.shift();

    // Best previous dp is at front of deque
    dp[i] = nums[i] + dp[deque[0]];

    // Maintain decreasing order: remove indices with dp <= dp[i] from back
    while (deque.length > 0 && dp[deque[deque.length - 1]] <= dp[i]) {
      deque.pop();
    }
    deque.push(i);
  }

  return dp[n - 1];
}

// ─── Solution 3: DP + Max-Heap (Priority Queue) — O(n·log n) ─────────────────
function maxResult_heap(nums: number[], k: number): number {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];

  // Max-heap: [dp_value, index] — simulate with sorted array for clarity
  // (In a real interview, use a proper heap library)
  const heap: Array<[number, number]> = [[dp[0], 0]];

  const heapPush = (val: [number, number]) => {
    heap.push(val);
    heap.sort((a, b) => b[0] - a[0]); // max-heap
  };

  for (let i = 1; i < n; i++) {
    // Remove stale entries (out of window)
    while (heap.length > 0 && heap[0][1] < i - k) heap.shift();
    dp[i] = nums[i] + heap[0][0];
    heapPush([dp[i], i]);
  }

  return dp[n - 1];
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(maxResult([1, -1, -2, 4, -7, 3], 2)); // 7
console.log(maxResult([10, -5, -2, 4, 0, 3], 3)); // 17
console.log(maxResult([1, -5, -20, 4, -1, 3, -6, -3], 2)); // 0
console.log(maxResult_brute([1, -1, -2, 4, -7, 3], 2)); // 7
console.log(maxResult_heap([1, -1, -2, 4, -7, 3], 2)); // 7
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                  | Difficulty | Pattern              |
| ---- | ---------------------------------------------------------------------------------------- | ---------- | -------------------- |
| 1425 | [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum) | 🔴 Hard    | DP + Monotonic Deque |
| 239  | [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum)           | 🔴 Hard    | Monotonic Deque      |
| 45   | [Jump Game II](https://leetcode.com/problems/jump-game-ii)                               | 🟡 Medium  | Greedy               |
