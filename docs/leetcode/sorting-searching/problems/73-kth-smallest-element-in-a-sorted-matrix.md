---
layout: page
title: "Kth Smallest Element in a Sorted Matrix"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sorting, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix"
---

# Kth Smallest Element in a Sorted Matrix / Phần Tử Nhỏ Thứ K Trong Ma Trận Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Ma trận đã sắp xếp theo hàng và cột. Thay vì tìm phần tử trực tiếp, ta có thể **binary search trên giá trị**: đặt câu hỏi "có bao nhiêu phần tử ≤ mid?". Nếu count < k thì mid quá nhỏ; nếu count ≥ k thì mid có thể là đáp án.

**Pattern Recognition:**

- Binary search trên không gian giá trị `[matrix[0][0], matrix[n-1][n-1]]`
- Count function: đếm phần tử ≤ mid trong O(n) bằng cách đi từ góc trên phải
- Kết quả luôn là giá trị thực có trong ma trận

**Visual — matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8:**

```
lo=1, hi=15 → mid=8: count(≤8)=1 < 8 → lo=9
lo=9, hi=15 → mid=12: count(≤12)=6 < 8 → lo=13
lo=13, hi=15 → mid=14: count(≤14)=8 ≥ 8 → hi=14
lo=13, hi=14 → mid=13: count(≤13)=8 ≥ 8 → hi=13
lo=13=hi → answer=13 ✅
```

---

## Problem Description

Given an `n×n` matrix where each row and column is sorted in ascending order, return the **k-th smallest** element. Note: it is the k-th smallest in sorted order, not the k-th distinct element.

- Example 1: `matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8` → `13`
- Example 2: `matrix = [[-5]], k = 1` → `-5`

---

## 📝 Interview Tips

1. **Clarify**: "k-th smallest trong toàn ma trận hay trong mỗi hàng?" / k-th globally, not per row
2. **Two approaches**: "Heap: O(k log n); Binary search on value: O(n log(max-min))" / Heap simpler, BS faster for large k
3. **Count trick**: "Đếm phần tử ≤ mid: đi từ góc trên-phải, move left/down" / Start top-right, move left if too big, down if ok
4. **BS invariant**: "lo luôn là giá trị tồn tại trong ma trận khi hội tụ" / lo converges to an actual matrix value
5. **Edge case**: "k=1 → matrix[0][0]; k=n² → matrix[n-1][n-1]" / Corner cases are min/max of matrix
6. **Follow-up**: "Ma trận n×m không vuông?" / Non-square matrix?

---

## Solutions

```typescript
/**
 * Solution 1: Min-Heap (K-way merge)
 * Time: O(k log n) — k pops from n-row heap
 * Space: O(n) — heap of size n
 */
function kthSmallestHeap(matrix: number[][], k: number): number {
  const n = matrix.length;
  // [value, row, col]
  const heap: [number, number, number][] = [];
  for (let r = 0; r < n; r++) heap.push([matrix[r][0], r, 0]);
  heap.sort((a, b) => a[0] - b[0]);

  let count = 0;
  while (heap.length > 0) {
    const [val, r, c] = heap.shift()!;
    count++;
    if (count === k) return val;
    if (c + 1 < n) {
      heap.push([matrix[r][c + 1], r, c + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
  return -1;
}

/**
 * Solution 2: Binary Search on Value (Optimal)
 * Time: O(n log(max-min)) — log range binary search, O(n) count each time
 * Space: O(1)
 */
function kthSmallest(matrix: number[][], k: number): number {
  const n = matrix.length;

  // Count elements <= mid using staircase traversal from top-right
  const countLeq = (mid: number): number => {
    let count = 0,
      r = 0,
      c = n - 1;
    while (r < n && c >= 0) {
      if (matrix[r][c] <= mid) {
        count += c + 1;
        r++;
      } else c--;
    }
    return count;
  };

  let lo = matrix[0][0],
    hi = matrix[n - 1][n - 1];
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (countLeq(mid) < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// === Test Cases ===
console.log(
  kthSmallest(
    [
      [1, 5, 9],
      [10, 11, 13],
      [12, 13, 15],
    ],
    8,
  ),
); // 13
console.log(kthSmallest([[-5]], 1)); // -5
console.log(
  kthSmallest(
    [
      [1, 2],
      [1, 3],
    ],
    2,
  ),
); // 1
console.log(
  kthSmallestHeap(
    [
      [1, 5, 9],
      [10, 11, 13],
      [12, 13, 15],
    ],
    8,
  ),
); // 13
```

---

## 🔗 Related Problems

| Problem                                                                                            | Pattern             | Difficulty |
| -------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance) | Binary Search       | Hard       |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)   | Quickselect / Heap  | Medium     |
| [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)                   | Binary Search       | Medium     |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water)                         | Binary Search + BFS | Hard       |
