---
layout: page
title: "Make Array Non-decreasing or Non-increasing"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/make-array-non-decreasing-or-non-increasing"
---

# make array non decreasing or non increasing

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình dung hàng người xếp hàng chụp ảnh: ta muốn sắp theo chiều cao tăng dần (hoặc giảm dần), mỗi lần "điều chỉnh" 1 cm tốn 1 đồng. Mấu chốt: **nghiệm tối ưu luôn nằm trong tập giá trị ban đầu** — tính chất L1 median — nên chỉ cần xét _m_ giá trị duy nhất thay vì toàn bộ miền số nguyên.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [3, 2, 4, 5, 0]

Slope Trick – non-increasing (run on reversed [0,5,4,2,3]):
  x=0 → heap=[0]                    cost=0
  x=5 → heap=[5,0]                  cost=0  (5 ≤ 5, no clip)
  x=4 → clip 5→4, heap=[4,4,0]      cost=1
  x=2 → clip 4→2, heap=[4,2,2,0]    cost=3
  x=3 → clip 4→3, heap=[3,3,2,2,0]  cost=4

Non-decreasing=6, Non-increasing=4  →  Answer: min(6, 4) = 4
```

---

## Problem Description

| Problem                                                                                                                                     | Difficulty | Note                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Minimum Number of Removals to Make Mountain Array](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/)       | Hard       | LIS-based bitonic variant |
| [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array/)                                                                 | Medium     | Greedy, no cost model     |
| [Minimum Cost to Move Chips to the Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/)           | Easy       | Cost function insight     |
| [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Medium     | DP with slope analysis    |

---

## 📝 Interview Tips

1. **Split into two sub-problems** — Solve non-decreasing and non-increasing separately, return min. / Giải riêng 2 chiều rồi lấy min.
2. **L1 median property** — Optimal mapped values always come from the original array; enables coordinate compression. / Nghiệm tối ưu luôn nằm trong tập giá trị ban đầu.
3. **Prefix-min DP** — `dp[j] = min(dp[0..j]) + |nums[i] − sorted[j]|` reduces each row to O(m). / Prefix-min giúp tối ưu từ O(n·m²) → O(n·m).
4. **Non-increasing via reversal** — Reverse the array, then run the non-decreasing DP. / Lật mảng là đủ, không cần code riêng cho chiều giảm.
5. **Slope trick is O(n log n)** — Max-heap tracks breakpoints of the convex cost function. / Max-heap lưu các điểm bẻ gãy của hàm chi phí lồi.
6. **Pop = cost** — Each time `heap.top > x`, pop and add `top − x` to cost, then push `x` back. / Mỗi lần pop, phần chênh lệch đúng bằng chi phí phải bù.

---

## Solutions

```typescript
function minCostDP(nums: number[]): number {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const m = sorted.length;

  // Base case: cost to map nums[0] to each unique value
  let dp = sorted.map((v) => Math.abs(nums[0] - v));

  for (let i = 1; i < nums.length; i++) {
    const next = new Array<number>(m);
    let pMin = Infinity;
    for (let j = 0; j < m; j++) {
      pMin = Math.min(pMin, dp[j]);
      next[j] = pMin + Math.abs(nums[i] - sorted[j]);
    }
    dp = next;
  }

  return Math.min(...dp);
}

function minCost(nums: number[]): number {
  // Non-increasing ≡ non-decreasing on the reversed array (cost is symmetric)
  return Math.min(minCostDP(nums), minCostDP([...nums].reverse()));
}

class MaxHeap {
  private h: number[] = [];

  push(x: number): void {
    this.h.push(x);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] >= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }

  pop(): number {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length > 0) {
      this.h[0] = last;
      let i = 0;
      while (true) {
        let hi = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < this.h.length && this.h[l] > this.h[hi]) hi = l;
        if (r < this.h.length && this.h[r] > this.h[hi]) hi = r;
        if (hi === i) break;
        [this.h[hi], this.h[i]] = [this.h[i], this.h[hi]];
        i = hi;
      }
    }
    return top;
  }

  peek(): number {
    return this.h[0];
  }
}

function slopeTrick(arr: number[]): number {
  const heap = new MaxHeap();
  let cost = 0;
  for (const x of arr) {
    heap.push(x);
    if (heap.peek() > x) {
      cost += heap.pop() - x;
      heap.push(x); // restore heap size to maintain isotonic breakpoint count
    }
  }
  return cost;
}

function minCostSlopeTrick(nums: number[]): number {
  return Math.min(
    slopeTrick(nums),
    slopeTrick([...nums].reverse()), // reverse → non-increasing
  );
}

// === Test Cases ===
// Solution 1 – DP
console.log(minCost([3, 2, 4, 5, 0])); // 4
console.log(minCost([2, 2, 2])); // 0
console.log(minCost([3, 1, 2])); // 1

// Solution 2 – Slope Trick
console.log(minCostSlopeTrick([3, 2, 4, 5, 0])); // 4
console.log(minCostSlopeTrick([2, 2, 2])); // 0
console.log(minCostSlopeTrick([3, 1, 2])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                                     | Difficulty | Note                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Minimum Number of Removals to Make Mountain Array](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/)       | Hard       | LIS-based bitonic variant |
| [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array/)                                                                 | Medium     | Greedy, no cost model     |
| [Minimum Cost to Move Chips to the Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/)           | Easy       | Cost function insight     |
| [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Medium     | DP with slope analysis    |
