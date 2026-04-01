---
layout: page
title: "Minimum Cost to Connect Sticks"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-connect-sticks"
---

# Minimum Cost to Connect Sticks / Chi Phí Tối Thiểu Để Nối Que

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Min-Heap Greedy (Huffman Coding)
> **Frequency**: 📗 Tier 1 — Gặp ở Amazon, Google, Facebook
> **See also**: [Last Stone Weight](https://leetcode.com/problems/last-stone-weight) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống mã Huffman — để tối thiểu chi phí, luôn ghép hai phần tử **nhỏ nhất** trước. Nếu ghép cái lớn trước, chi phí đó bị tính lại nhiều lần. Min-heap cho phép lấy hai phần tử nhỏ nhất trong O(log n) mỗi lần.

**Pattern Recognition:**

- "Chi phí = tổng tất cả lần ghép" → greedy: luôn ghép 2 nhỏ nhất trước
- Mỗi que đóng góp vào chi phí nhiều lần tùy độ sâu trong cây ghép → tối thiểu bằng cách ghép nhỏ trước
- Min-heap: extract-min × 2, insert × 1, lặp n-1 lần

**Visual — sticks = [2, 4, 3]:**

```
Min-heap: [2, 3, 4]

Step 1: pop 2, pop 3 → merge=5, cost+=5  → heap: [4, 5]
Step 2: pop 4, pop 5 → merge=9, cost+=9  → heap: [9]
Total cost: 5 + 9 = 14 ✅

Wrong order: merge 3+4=7, then 2+7=9 → total 7+9=16 > 14
```

---

## Problem Description

Given array `sticks` of stick lengths, connect any two sticks of lengths `x` and `y` with cost `x + y`. Repeat until one stick remains. Return the **minimum total cost**.

- Example 1: `sticks = [2,4,3]` → `14` (merge 2+3=5 → cost 5, then 5+4=9 → cost 9; total 14)
- Example 2: `sticks = [1,8,3,5]` → `30` (merge 1+3=4, 4+5=9, 9+8=17; total 30)
- Example 3: `sticks = [5]` → `0` (single stick, no merges needed)

**Constraints:** `1 ≤ sticks.length ≤ 10^4`, `1 ≤ sticks[i] ≤ 10^4`.

---

## 📝 Interview Tips

1. **Greedy proof**: "Ghép hai cái nhỏ nhất trước → mỗi que đóng góp chi phí ít lần hơn → tổng nhỏ hơn" / Smaller sticks merged early accumulate fewer additions to total cost
2. **Huffman analogy**: "Đây chính xác là bài toán mã Huffman — xây optimal binary tree" / This is exactly Huffman coding; mentioning it impresses interviewers
3. **Min-heap**: "JS không có built-in heap → simulate bằng sorted array hoặc dùng binary search insert" / JS lacks built-in heap; simulate with sorted array or use binary search insertion
4. **Single stick**: "Nếu chỉ có 1 que → return 0 ngay, không cần merge" / Single stick: return 0 immediately, no merge needed
5. **Edge case**: "Hai que: một lần merge = a+b; ba que trở lên: greedy áp dụng" / Two sticks: single merge a+b; three or more: apply greedy
6. **Follow-up**: "Nếu mỗi lần ghép k que thay vì 2? → điều chỉnh greedy với k extractions" / What if merging k sticks at a time instead of 2?

---

## Solutions

```typescript
/**
 * Solution 1: Simulated Min-Heap via sort-per-round (interview clarity)
 * Time: O(n² log n) — re-sort after each merge; fine for small n
 * Space: O(n)
 */
function connectSticksBrute(sticks: number[]): number {
  const arr = [...sticks];
  let cost = 0;
  while (arr.length > 1) {
    arr.sort((a, b) => a - b);
    const merged = arr.shift()! + arr.shift()!;
    cost += merged;
    arr.push(merged);
  }
  return cost;
}

/**
 * Solution 2: Min-Heap with binary search insertion (optimal)
 * Time: O(n log n) — n-1 merges, each heap op O(log n)
 * Space: O(n)
 */
function connectSticksHeap(sticks: number[]): number {
  const heap = [...sticks].sort((a, b) => a - b);

  const heapPush = (val: number) => {
    let lo = 0,
      hi = heap.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (heap[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    heap.splice(lo, 0, val);
  };

  let cost = 0;
  while (heap.length > 1) {
    const merged = heap.shift()! + heap.shift()!;
    cost += merged;
    heapPush(merged);
  }
  return cost;
}

/**
 * Solution 3: Two-Queue Optimization — sort once, O(n) simulation
 * Time: O(n log n) initial sort + O(n) two-queue pass
 * Space: O(n)
 */
function connectSticksOptimal(sticks: number[]): number {
  sticks.sort((a, b) => a - b);
  const q1 = [...sticks]; // original sorted sticks
  const q2: number[] = []; // merged results (already in sorted order)
  let cost = 0;

  const dequeue = (): number => {
    const a = q1.length > 0 ? q1[0] : Infinity;
    const b = q2.length > 0 ? q2[0] : Infinity;
    if (a <= b) {
      q1.shift();
      return a;
    } else {
      q2.shift();
      return b;
    }
  };

  while (q1.length + q2.length > 1) {
    const merged = dequeue() + dequeue();
    cost += merged;
    q2.push(merged);
  }
  return cost;
}

// === Test Cases ===
console.log(connectSticksHeap([2, 4, 3])); // 14
console.log(connectSticksHeap([1, 8, 3, 5])); // 30
console.log(connectSticksHeap([5])); // 0
console.log(connectSticksOptimal([2, 4, 3])); // 14
console.log(connectSticksOptimal([1, 8, 3, 5])); // 30
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Last Stone Weight](https://leetcode.com/problems/last-stone-weight)                                 | Max-Heap Simulation | Easy       |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                       | Greedy + Heap       | Medium     |
| [IPO](https://leetcode.com/problems/ipo)                                                             | Two-Heap Greedy     | Hard       |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                 | Greedy + Heap       | Medium     |
| [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops) | Greedy + Heap       | Hard       |
