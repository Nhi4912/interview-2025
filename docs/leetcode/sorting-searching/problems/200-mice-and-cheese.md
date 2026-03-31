---
layout: page
title: "Mice and Cheese"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/mice-and-cheese"
---

# Mice and Cheese / Chuột và Pho Mát

🟡 Medium

## 🧠 Intuition

> **Hình ảnh:** Có hai loại pho mát. Chuột 1 ăn tất cả pho mát loại 1 mà con người chỉ định, chuột 2 ăn phần còn lại. Mỗi miếng pho mát `i` có reward nếu do chuột 1 ăn (`r1[i]`) hoặc chuột 2 ăn (`r2[i]`). Hỏi k miếng nào giao cho chuột 1 để **tổng reward tối đa**?

```
reward1=[1,1,3,4], reward2=[4,4,1,1], k=2

Ban đầu: tất cả chuột 2 → sum = 4+4+1+1 = 10
"Đổi" cheese i sang chuột 1: gain = r1[i] - r2[i]
gains = [1-4, 1-4, 3-1, 4-1] = [-3, -3, +2, +3]

Chọn k=2 phần tử gain cao nhất: [+3, +2] = +5
Answer = 10 + 5 = 15 ✓
```

**Chiến lược:** Start with all cheese given to mouse 2. Greedily switch k cheeses to mouse 1 that maximize the gain = r1[i] - r2[i].

## 📋 Problem Description

Two mice eat cheese. Mouse 1 eats **exactly k** cheeses, mouse 2 eats the rest. `reward1[i]` / `reward2[i]` = points if mouse 1/2 eats cheese `i`. Maximize total reward.

**Example 1:** `reward1=[1,1,3,4]`, `reward2=[4,4,1,1]`, `k=2` → `15`
**Example 2:** `reward1=[1,2,3]`, `reward2=[3,2,1]`, `k=1` → `6`

**Constraints:** `1 ≤ n ≤ 10^5`, `1 ≤ k < n`, `1 ≤ reward1[i], reward2[i] ≤ 1000`

## 📝 Interview Tips

- **Greedy correctness proof:** Baseline = all to mouse 2. Each "switch" is independent → pick top-k by gain
- **Gain formula:** `gain[i] = reward1[i] - reward2[i]`, can be negative
- **Sort descending by gain,** take first k → greedy is globally optimal here
- **Alternative:** Sort by gain, compute: `sum(reward2) + sum(top-k gains)`
- **Heap variant:** Use min-heap of size k to find top-k gains in O(n log k)
- **Edge case:** k=n is impossible per constraints. k=0 means all to mouse 2

## 💡 Solutions

### Solution 1: Greedy Sort by Gain — O(n log n)

```typescript
function miceAndCheese(reward1: number[], reward2: number[], k: number): number {
  const n = reward1.length;

  // Start: all cheese to mouse 2
  let total = reward2.reduce((s, v) => s + v, 0);

  // Gain from switching cheese i to mouse 1
  const gains = reward1.map((r1, i) => r1 - reward2[i]);
  gains.sort((a, b) => b - a); // descending

  // Take top-k switches
  for (let i = 0; i < k; i++) {
    total += gains[i];
  }
  return total;
}
```

### Solution 2: Sort Indices by Gain — O(n log n)

```typescript
function miceAndCheeseIdx(reward1: number[], reward2: number[], k: number): number {
  const n = reward1.length;
  const indices = [...Array(n).keys()].sort(
    (a, b) => reward1[b] - reward2[b] - (reward1[a] - reward2[a]),
  );

  let ans = 0;
  for (let i = 0; i < n; i++) {
    const idx = indices[i];
    ans += i < k ? reward1[idx] : reward2[idx];
  }
  return ans;
}
```

### Solution 3: Heap (Top-k Gains) — O(n log k)

```typescript
function miceAndCheeseHeap(reward1: number[], reward2: number[], k: number): number {
  // Min-heap to track top-k gains (efficient for large n, small k)
  class MinHeap {
    private data: number[] = [];
    get size() {
      return this.data.length;
    }
    push(val: number) {
      this.data.push(val);
      let i = this.data.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.data[p] > this.data[i]) {
          [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
          i = p;
        } else break;
      }
    }
    peek() {
      return this.data[0];
    }
    pop(): number {
      const top = this.data[0];
      const last = this.data.pop()!;
      if (this.data.length > 0) {
        this.data[0] = last;
        let i = 0;
        while (true) {
          let smallest = i;
          const l = 2 * i + 1,
            r = 2 * i + 2;
          if (l < this.data.length && this.data[l] < this.data[smallest]) smallest = l;
          if (r < this.data.length && this.data[r] < this.data[smallest]) smallest = r;
          if (smallest === i) break;
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        }
      }
      return top;
    }
  }

  let base = 0;
  for (const r of reward2) base += r;

  const heap = new MinHeap();
  for (let i = 0; i < reward1.length; i++) {
    const gain = reward1[i] - reward2[i];
    heap.push(gain);
    if (heap.size > k) heap.pop(); // keep only top-k
  }

  let gainSum = 0;
  while (heap.size > 0) gainSum += heap.pop();
  return base + gainSum;
}
```

## 🔗 Related Problems

| Problem                                                                                       | Similarity                        |
| --------------------------------------------------------------------------------------------- | --------------------------------- |
| [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team/) | Greedy selection with constraint  |
| [IPO](https://leetcode.com/problems/ipo/)                                                     | Greedy with profit sorting        |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                               | Greedy allocation                 |
| [Advantage Shuffle](https://leetcode.com/problems/advantage-shuffle/)                         | Greedy assignment to maximize sum |
