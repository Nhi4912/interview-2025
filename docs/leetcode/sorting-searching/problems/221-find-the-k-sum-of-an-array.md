---
layout: page
title: "Find the K-Sum of an Array"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/find-the-k-sum-of-an-array"
---

# Find the K-Sum of an Array / Tìm Tổng Thứ K Của Mảng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như khám phá cây quyết định tất cả tổng tập con — mỗi nhánh "không chọn phần tử này" hoặc "chọn phần tử khác thay thế". Heap giúp duyệt theo thứ tự giảm dần tổng mà không liệt kê hết 2^n tập con.

**Pattern Recognition:**

- Signal: "k-th largest subsequence sum" + "có thể âm" → biến đổi về max-sum rồi dùng Heap
- Key insight: maxSum = sum of all positives; mọi subsequence sum = maxSum − (sum của "bỏ positive / thêm negative")

**Visual — Find the K-Sum of an Array example:**

```
nums = [2, 4, -2], k = 5

Step 1: Separate & compute maxSum
  positives: 2, 4  → maxSum = 6
  negatives: -2    → abs value = 2

Step 2: Build sorted abs array = [2, 2, 4] (abs of all elements, sorted)

Step 3: Max-Heap seeded with (maxSum, index=0)
  Extract maxSum=6 → answer[1]=6
  Push two children:
    (6-2, 0) = (4, 0)  ← subtract abs[0]=2
    (6-2+0, 1) = skip (would need prev)
  ... pop k-1 more times

Heap traversal gives k-th largest subsequence sum.
```

---

## Problem Description

You are given an integer array `nums` and a positive integer `k`. The **k-sum** of the array is the k-th largest sum you can get from any subsequence of `nums` (including the empty subsequence whose sum is 0). Return the **k-sum** of the array.

Difficulty: Hard | Acceptance: 39.7%

```
Example 1:
  Input:  nums = [2,4,-2], k = 5
  Output: 2

Example 2:
  Input:  nums = [1,-2,3,4,-10,12], k = 16
  Output: 10

Example 3:
  Input:  nums = [-1,-1,-1,-1], k = 1
  Output: 0
```

Constraints:

- `1 <= n <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= k <= min(2000, 2^n)`

---

## 📝 Interview Tips

1. **Clarify**: "Empty subsequence cho sum=0 có được tính không?" / Does empty subsequence (sum=0) count? Yes, it does.
2. **Key transform**: "maxSum = tổng tất cả số dương; mọi tổng khác = maxSum trừ đi một subset của abs values" / maxSum minus subset of abs(nums) gives all possible sums.
3. **Heap traversal**: "Dùng max-heap, mỗi lần pop thêm 2 con: bỏ phần tử hiện tại, hoặc thay bằng phần tử kế" / Two children: skip current element, or replace with next one.
4. **Sorted abs**: "Sắp xếp abs values để đảm bảo heap luôn expand theo thứ tự đúng" / Sort abs values so heap expansion is monotone.
5. **Edge cases**: "Tất cả âm → tổng lớn nhất là 0 (rỗng); k=1 luôn là maxSum" / All negative → k=1 answer is 0.
6. **Follow-up**: "Nếu k rất lớn gần 2^n? Constraint k<=2000 giới hạn bài này" / k is bounded by 2000 here, enabling O(k log k).

---

## Solutions

```typescript
// Min-heap implementation for TypeScript (no built-in)
class MinHeap {
  private heap: [number, number][] = []; // [value, index]
  push(item: [number, number]) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }
  pop(): [number, number] | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  size() {
    return this.heap.length;
  }
  private _bubbleUp(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p][0] <= this.heap[i][0]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  private _siftDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.heap[l][0] < this.heap[smallest][0]) smallest = l;
      if (r < n && this.heap[r][0] < this.heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

/**
 * Solution 1: Heap on (deviation from maxSum, sorted-abs index)
 * Time: O(n log n + k log k) — sort + k heap pops
 * Space: O(n + k) — sorted array + heap
 *
 * Key insight: every subsequence sum = maxSum - (some subset of abs(nums))
 * We use a max-heap seeded with (maxSum) and expand by "subtracting" abs values in sorted order.
 * Two children for each state (sum, idx):
 *   1. (sum - abs[idx+1], idx+1)  → replace abs[idx] with abs[idx+1]
 *   2. (sum - abs[idx+1] - abs[idx], idx+1) ← add abs[idx+1] on top of current subtraction
 * Equivalent: heap stores (subtracted amount, idx); we pop smallest subtraction k-1 times.
 */
function kSum(nums: number[], k: number): number {
  let maxSum = 0;
  for (const x of nums) if (x > 0) maxSum += x;

  // abs sorted ascending
  const abs = nums.map((x) => Math.abs(x)).sort((a, b) => a - b);
  const n = abs.length;

  // min-heap of (subtracted_amount, next_index)
  // start: subtract abs[0] from maxSum → subtracted = abs[0]
  const heap = new MinHeap();
  if (n > 0) heap.push([abs[0], 0]);

  let ans = maxSum; // k=1 answer
  for (let i = 1; i < k; i++) {
    if (heap.size() === 0) break;
    const [sub, idx] = heap.pop()!;
    ans = maxSum - sub; // this is the (i+1)-th largest sum
    if (idx + 1 < n) {
      // option A: also subtract abs[idx+1] (cumulative)
      heap.push([sub + abs[idx + 1], idx + 1]);
      // option B: replace abs[idx] with abs[idx+1]
      heap.push([sub - abs[idx] + abs[idx + 1], idx + 1]);
    }
  }
  return ans;
}

/**
 * Solution 2: Brute Force (only viable for small n, k)
 * Time: O(2^n * n) — enumerate all subsequences
 * Space: O(2^n) — store all sums
 */
function kSumBrute(nums: number[], k: number): number {
  const n = nums.length;
  const sums: number[] = [];
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += nums[i];
    sums.push(s);
  }
  sums.sort((a, b) => b - a);
  return sums[k - 1];
}

// === Test Cases ===
console.log(kSum([2, 4, -2], 5)); // 2
console.log(kSum([1, -2, 3, 4, -10, 12], 16)); // 10
console.log(kSum([-1, -1, -1, -1], 1)); // 0
console.log(kSumBrute([2, 4, -2], 5)); // 2 (verify brute)
```

---

## 🔗 Related Problems

- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — heap k-th element
- [K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction) — heap on pairs
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — multi-list heap
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy + heap
- [Find the K-Sum of an Array — LeetCode](https://leetcode.com/problems/find-the-k-sum-of-an-array) — problem page
