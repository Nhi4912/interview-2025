---
layout: page
title: "IPO"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/ipo"
---

# IPO / IPO — Tối Đa Hóa Vốn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Heap / Priority Queue + Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhà đầu tư khởi nghiệp chỉ có ngân sách giới hạn — bạn muốn làm k dự án để IPO với giá trị cao nhất. Chiến lược: mỗi vòng, chọn dự án có lợi nhuận cao nhất trong số các dự án bạn đủ tiền làm. Như người đi chợ: mua món rẻ nhất trước để có tiền mua tiếp món đắt hơn.

**Pattern Recognition:**

- Signal: "chọn k lần, mỗi lần chọn tối ưu trong tập có thể" → **Greedy + Max-Heap**
- Min-heap theo capital: unlock dự án khi đủ vốn
- Max-heap theo profit: luôn chọn dự án lãi nhất hiện có
- Key insight: 2 heaps phối hợp — min-heap "mở khóa" dự án vào max-heap "chọn lãi nhất"

**Visual — k=2, w=0, profits=[1,2,3], capital=[0,1,1]:**

```
Projects sorted by capital: [(0,1), (1,2), (1,3)]

Round 1: w=0
  → Unlock: (0,1) → profit 1 available
  → minCap=[…], maxProfit=[1]
  → Pick profit=1 → w=1

Round 2: w=1
  → Unlock: (1,2),(1,3) → profit 2,3 available
  → maxProfit=[3,2]  (max-heap)
  → Pick profit=3 → w=4

Final capital = 4 ✅
```

---

## Problem Description

You have `k` project slots and initial capital `w`. Given `profits[i]` and `capital[i]` for n projects, each project can only be done once. Doing project `i` earns `profits[i]` capital (you need at least `capital[i]` to start it). Return the **maximum capital** after finishing at most `k` projects.

**Example 1:**

```
Input:  k=2, w=0, profits=[1,2,3], capital=[0,1,1]
Output: 4
Explanation: Do project 0 (profit 1, w→1), then project 2 (profit 3, w→4).
```

**Example 2:**

```
Input:  k=3, w=0, profits=[1,2,3], capital=[0,1,2]
Output: 6
Explanation: Do all 3 in order, w: 0→1→3→6.
```

**Constraints:** `1 ≤ k ≤ 10⁵`, `0 ≤ w ≤ 10⁹`, `n == profits.length == capital.length ≤ 10⁵`, `0 ≤ profits[i], capital[i] ≤ 10⁴`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi dự án chỉ làm được 1 lần? k có thể > n không?" / Each project done at most once? k can exceed n?
2. **Greedy insight**: "Tại mỗi bước, luôn chọn dự án lãi nhất mà ta afford → greedy optimal" / Greedy: always pick highest profit affordable project
3. **Two heaps**: "Min-heap (capital) để track khi nào unlock; max-heap (profit) để chọn tốt nhất" / Min-heap unlocks, max-heap selects
4. **Sort alternative**: "Sort by capital, dùng pointer thay min-heap → vẫn O(n log n)" / Sort + pointer works instead of min-heap
5. **Edge cases**: "w đủ làm tất cả ngay từ đầu? k=0? Không có dự án nào affordable?" / All affordable from start? No affordable project?
6. **Follow-up**: "Nếu có dependencies giữa projects?" / What if projects have prerequisite dependencies?

---

## Solutions

```typescript
/**
 * MinHeap utility for [capital, profit] pairs
 */
class MinCapHeap {
  private h: [number, number][] = [];
  push(item: [number, number]) {
    this.h.push(item);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p][0] <= this.h[i][0]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  peek() {
    return this.h[0];
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      this._down(0);
    }
    return top;
  }
  get size() {
    return this.h.length;
  }
  private _down(i: number) {
    while (true) {
      let m = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < this.h.length && this.h[l][0] < this.h[m][0]) m = l;
      if (r < this.h.length && this.h[r][0] < this.h[m][0]) m = r;
      if (m === i) break;
      [this.h[m], this.h[i]] = [this.h[i], this.h[m]];
      i = m;
    }
  }
}

/**
 * MaxHeap for profit values
 */
class MaxProfitHeap {
  private h: number[] = [];
  push(val: number) {
    this.h.push(val);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] >= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    const top = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      this._down(0);
    }
    return top;
  }
  get size() {
    return this.h.length;
  }
  private _down(i: number) {
    while (true) {
      let m = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < this.h.length && this.h[l] > this.h[m]) m = l;
      if (r < this.h.length && this.h[r] > this.h[m]) m = r;
      if (m === i) break;
      [this.h[m], this.h[i]] = [this.h[i], this.h[m]];
      i = m;
    }
  }
}

/**
 * Solution 1: Brute Force — O(k·n) each round scan all projects
 * Time: O(k·n) — k rounds × n project scan
 * Space: O(n) — done set
 */
function findMaximizedCapitalBrute(
  k: number,
  w: number,
  profits: number[],
  capital: number[],
): number {
  const done = new Set<number>();
  for (let round = 0; round < k; round++) {
    let bestIdx = -1,
      bestProfit = -1;
    for (let i = 0; i < profits.length; i++) {
      if (!done.has(i) && capital[i] <= w && profits[i] > bestProfit) {
        bestProfit = profits[i];
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    done.add(bestIdx);
    w += bestProfit;
  }
  return w;
}

/**
 * Solution 2: Two Heaps — Greedy Optimal
 * Time: O(n log n) — each project pushed/popped from heaps once
 * Space: O(n) — heap storage
 *
 * Algorithm:
 * 1. Sort projects by capital into min-heap
 * 2. For k rounds: unlock all affordable projects into max-heap
 * 3. Pick highest profit from max-heap, add to w
 */
function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {
  const minCap = new MinCapHeap();
  const maxProfit = new MaxProfitHeap();

  for (let i = 0; i < profits.length; i++) {
    minCap.push([capital[i], profits[i]]);
  }

  for (let round = 0; round < k; round++) {
    // Unlock all projects we can currently afford
    while (minCap.size > 0 && minCap.peek()[0] <= w) {
      const [, profit] = minCap.pop();
      maxProfit.push(profit);
    }
    if (maxProfit.size === 0) break; // no affordable project left
    w += maxProfit.pop();
  }
  return w;
}

// === Test Cases ===
console.log(findMaximizedCapital(2, 0, [1, 2, 3], [0, 1, 1])); // 4
console.log(findMaximizedCapital(3, 0, [1, 2, 3], [0, 1, 2])); // 6
console.log(findMaximizedCapital(1, 0, [1, 2, 3], [1, 1, 2])); // 0 (can't afford any)
console.log(findMaximizedCapital(2, 1, [1, 2, 3], [1, 1, 2])); // 1+2=4? No: w=1→pick max(1,2)=2 → w=3 → pick 3 → w=6
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern               | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                                               | Greedy + Heap         | Medium     |
| [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team)                                 | Greedy + Heap         | Hard       |
| [Maximum Number of Events That Can Be Attended](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended) | Greedy + Heap         | Medium     |
| [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) | Heap + Sliding Window | Hard       |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream)                                   | Two Heaps             | Hard       |
