---
layout: page
title: "Minimum Adjacent Swaps for K Consecutive Ones"
difficulty: Hard
category: Array
tags: [Array, Greedy, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-adjacent-swaps-for-k-consecutive-ones"
---

# Minimum Adjacent Swaps for K Consecutive Ones / Số Hoán Vị Liền Kề Tối Thiểu Để Có K Số 1 Liên Tiếp

🔴 Hard | Array · Greedy · Sliding Window · Prefix Sum | LeetCode #1703

## 🧠 Intuition / Tư Duy

**Vietnamese:** Chiết xuất vị trí các số 1 vào mảng `pos[]`. Bài toán trở thành: chọn k số 1 liên tiếp trong `pos[]` và tính số bước di chuyển tối thiểu để gom chúng về trung điểm. Dùng sliding window + prefix sum trên `pos[]` để tính hiệu quả.

```
nums = [1,0,0,1,0,1], k=2
pos = [0, 3, 5]  (indices of 1s)

Window [0,3]: cost to group = |0-mid| + |3-mid|, mid=1 → 1+2=3
  But optimal: bring to adjacent (1,2) → 1+1=2

Key: cost = sum of |pos[i] - median_adjusted|
Using prefix sums on pos[] to compute window costs in O(1).
```

## Problem Description

Given binary array `nums` and integer `k`, return the **minimum number of adjacent swaps** needed to make `k` consecutive 1s appear anywhere in the array.

Approach: extract positions of all 1s → sliding window of size k over positions → for each window find cost to bring them together (they meet at their median) using prefix sums.

**Example 1:**

```
nums=[1,0,0,1,0,1], k=2
Output: 1
```

**Example 2:**

```
nums=[1,0,1,0,1], k=3
Output: 2
```

## 📝 Interview Tips

- **🔑 Extract positions / Trích vị trí:** Work on indices of 1s, not the full array — reduces problem size
- **🎯 Median minimizes / Trung vị tối thiểu hoá:** To bring k numbers together, they should meet at their median — minimizes total movement
- **📊 Prefix sum trick / Mẹo prefix sum:** Precompute prefix sums of `pos[]` to get range sums in O(1)
- **🔢 Offset adjustment / Điều chỉnh offset:** Within a window of k ones, their relative positions to each other matter — subtract `i*(i-1)/2` to account for "gaps already closed"
- **⚠️ Window size k / Kích thước cửa sổ k:** Slide window of size k over `pos[]` — O(total_ones) iterations
- **📈 Complexity / Độ phức tạp:** O(n) overall — extracting positions O(n), prefix sum O(n), sliding window O(n)

## Solutions

```typescript
/**
 * Approach 1: Positions + Prefix Sum + Sliding Window
 * Time: O(n)
 * Space: O(n) for positions and prefix sum
 */
function minMoves(nums: number[], k: number): number {
  // Extract positions of all 1s
  const pos: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) pos.push(i);
  }

  const m = pos.length;
  // Adjust positions: subtract index to account for relative gaps
  // pos[i] - i gives the "reduced" position
  const adj: number[] = pos.map((p, i) => p - i);

  // Build prefix sum of adjusted positions
  const prefix = new Array(m + 1).fill(0);
  for (let i = 0; i < m; i++) prefix[i + 1] = prefix[i] + adj[i];

  let minCost = Infinity;
  const half = Math.floor(k / 2);

  // Slide window of size k
  for (let i = 0; i + k <= m; i++) {
    const mid = i + half;
    const midVal = adj[mid];

    // Cost of left half: midVal*leftCount - sum(adj[i..mid-1])
    const leftSum = prefix[mid] - prefix[i];
    const leftCount = mid - i;
    const leftCost = midVal * leftCount - leftSum;

    // Cost of right half: sum(adj[mid+1..i+k-1]) - midVal*rightCount
    const rightSum = prefix[i + k] - prefix[mid + 1];
    const rightCount = i + k - mid - 1;
    const rightCost = rightSum - midVal * rightCount;

    minCost = Math.min(minCost, leftCost + rightCost);
  }

  return minCost;
}

console.log(minMoves([1, 0, 0, 1, 0, 1], 2)); // 1
console.log(minMoves([1, 0, 1, 0, 1], 3)); // 2
console.log(minMoves([1, 1, 0, 1], 2)); // 0
```

```typescript
/**
 * Approach 2: Brute force with position extraction (small inputs)
 * Time: O(n * k)
 * Space: O(n)
 */
function minMovesBrute(nums: number[], k: number): number {
  const pos: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) pos.push(i);
  }

  let minCost = Infinity;
  for (let i = 0; i + k <= pos.length; i++) {
    const window = pos.slice(i, i + k);
    const median = window[Math.floor(k / 2)];
    let cost = 0;
    for (let j = 0; j < k; j++) {
      cost += Math.abs(window[j] - median) - Math.abs(j - Math.floor(k / 2));
    }
    minCost = Math.min(minCost, cost);
  }

  return minCost;
}

console.log(minMovesBrute([1, 0, 0, 1, 0, 1], 2)); // 1
console.log(minMovesBrute([1, 0, 1, 0, 1], 3)); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                   | Difficulty | Pattern        |
| ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Minimum Operations to Make Array Continuous](https://leetcode.com/problems/minimum-operations-to-make-array-continuous/) | 🔴 Hard    | Sliding Window |
| [Minimum Swaps to Group All 1s Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/)     | 🟡 Medium  | Sliding Window |
| [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/)       | 🟡 Medium  | Median         |
| [Minimum Number of Moves to Seat Everyone](https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone/)       | 🟢 Easy    | Sorting        |
