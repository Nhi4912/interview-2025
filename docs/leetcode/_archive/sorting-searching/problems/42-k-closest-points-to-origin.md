---
layout: page
title: "K Closest Points to Origin"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Divide and Conquer, Geometry, Sorting]
leetcode_url: "https://leetcode.com/problems/k-closest-points-to-origin"
---

# K Closest Points to Origin / K Điểm Gần Gốc Tọa Độ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [Query Kth Smallest Trimmed Number](https://leetcode.com/problems/query-kth-smallest-trimmed-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phòng cấp cứu — bệnh nhân nặng nhất luôn được ưu tiên, bất kể ai đến trước. Heap giữ phần tử quan trọng nhất ở đầu. Ở đây ta giữ max-heap size k, loại ra điểm xa nhất khi có điểm gần hơn.

**Pattern Recognition:**

- Signal: "k-th closest/largest/smallest" + "top-k elements" → **Sort or Heap**
- Không cần sort toàn bộ — chỉ cần k phần tử nhỏ nhất → max-heap size k
- Key insight: khoảng cách Euclidean — tránh sqrt, so sánh `x²+y²` trực tiếp

**Visual — points = [[3,3],[5,-1],[-2,4]], k = 2:**

```
Distances²: (3,3)→18  (5,-1)→26  (-2,4)→20

Max-heap of size k=2:
  Add (3,3):  heap=[(18,(3,3))]
  Add (5,-1): heap=[(26,(5,-1)),(18,(3,3))]  ← heap full
  Add (-2,4): 20 < 26 (heap top) → pop (5,-1), push (-2,4)
              heap=[(20,(-2,4)),(18,(3,3))]

Result: [[3,3],[-2,4]] ✅
```

---

## Problem Description

Cho mảng `points` (tọa độ 2D) và số nguyên `k`, trả về **k điểm gần gốc (0,0) nhất**. Thứ tự trả về không quan trọng. ([LeetCode](https://leetcode.com/problems/k-closest-points-to-origin))

Difficulty: Medium | Acceptance: 67.9%

- `points = [[1,3],[-2,2]], k = 1` → `[[-2,2]]` (dist²=5 < 10)
- `points = [[3,3],[5,-1],[-2,4]], k = 2` → `[[3,3],[-2,4]]`
- `points = [[0,1],[1,0]], k = 2` → `[[0,1],[1,0]]`

Constraints: `1 <= k <= points.length <= 10^4`, `-10^4 <= xi, yi <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Có cần sort kết quả không? Có điểm trùng nhau không?" / Result sorted? Duplicate points allowed?
2. **Brute force**: "Sort tất cả theo khoảng cách, lấy k đầu — O(n log n)" / Sort all, take first k
3. **Optimize**: "Max-heap size k → O(n log k), tốt hơn khi k << n" / Max-heap when k is small
4. **Avoid sqrt**: "So sánh x²+y² thay vì sqrt(x²+y²) để tránh floating point" / Compare squared distances
5. **Edge cases**: "k = n → trả về tất cả; k = 1 → điểm gần nhất" / k equals length or k=1
6. **Follow-up**: "Streaming data → max-heap k luôn hoạt động; quickselect O(n) average" / Quickselect for offline

---

## Solutions

```typescript
/**
 * Solution 1: Sort All Points by Distance
 * Time: O(n log n) — sorting
 * Space: O(n) — sorted copy
 */
function kClosestSort(points: number[][], k: number): number[][] {
  return points
    .slice()
    .sort((a, b) => a[0] ** 2 + a[1] ** 2 - (b[0] ** 2 + b[1] ** 2))
    .slice(0, k);
}

/**
 * Solution 2: Max-Heap of Size k (simulated with sorted array)
 * Time: O(n log k) — each insertion into heap is O(log k)
 * Space: O(k) — heap stores k points
 *
 * Note: JS has no built-in heap; we simulate with a sorted array for clarity.
 * In production, use a proper heap library or quickselect.
 */
function kClosest(points: number[][], k: number): number[][] {
  const dist2 = (p: number[]) => p[0] * p[0] + p[1] * p[1];
  // Max-heap simulated: keep array sorted descending, cap at k
  const heap: number[][] = [];

  for (const p of points) {
    heap.push(p);
    // Insertion sort to maintain max-heap property (feasible for small k)
    heap.sort((a, b) => dist2(b) - dist2(a));
    if (heap.length > k) heap.pop(); // remove the farthest
  }
  return heap;
}

/**
 * Solution 3: Quickselect — O(n) average
 * Time: O(n) average, O(n²) worst — partition-based
 * Space: O(1) — in-place
 */
function kClosestQuickSelect(points: number[][], k: number): number[][] {
  const dist2 = (p: number[]) => p[0] * p[0] + p[1] * p[1];
  const swap = (i: number, j: number) => ([points[i], points[j]] = [points[j], points[i]]);

  let lo = 0,
    hi = points.length - 1;
  while (lo <= hi) {
    const pivot = dist2(points[hi]);
    let p = lo;
    for (let i = lo; i < hi; i++) if (dist2(points[i]) <= pivot) swap(p++, i);
    swap(p, hi);
    if (p === k) break;
    if (p < k) lo = p + 1;
    else hi = p - 1;
  }
  return points.slice(0, k);
}

// === Test Cases ===
console.log(
  JSON.stringify(
    kClosest(
      [
        [1, 3],
        [-2, 2],
      ],
      1,
    ),
  ),
);
// [[-2,2]]
console.log(
  JSON.stringify(
    kClosest(
      [
        [3, 3],
        [5, -1],
        [-2, 4],
      ],
      2,
    ),
  ),
);
// [[3,3],[-2,4]] (order may vary)
console.log(
  JSON.stringify(
    kClosestQuickSelect(
      [
        [0, 1],
        [1, 0],
      ],
      2,
    ),
  ),
);
// [[0,1],[1,0]]
```

---

## 🔗 Related Problems

- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — quickselect / heap pattern
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) — top-k with custom comparator
- [Query Kth Smallest Trimmed Number](https://leetcode.com/problems/query-kth-smallest-trimmed-number) — k-th selection
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — two heaps technique
- [K Closest Points to Origin — LeetCode](https://leetcode.com/problems/k-closest-points-to-origin) — problem page
