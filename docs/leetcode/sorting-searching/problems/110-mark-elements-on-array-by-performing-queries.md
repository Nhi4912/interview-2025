---
layout: page
title: "Mark Elements on Array by Performing Queries"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/mark-elements-on-array-by-performing-queries"
---

# Mark Elements on Array by Performing Queries / Đánh Dấu Phần Tử Bằng Các Truy Vấn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Min-Heap + Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống trò chơi đánh dấu ô trên bảng — mỗi lượt bạn đánh dấu một ô cụ thể (theo index), rồi tìm và đánh dấu thêm `k-1` ô **nhỏ nhất chưa được đánh dấu**. Sau mỗi lượt, cộng tổng các ô **chưa đánh dấu**. Min-heap giúp lấy phần tử nhỏ nhất còn lại hiệu quả.

**Pattern Recognition:**

- "Remove smallest k elements repeatedly" → Min-Heap
- After each query: mark `queries[i][0]` (index), then mark `queries[i][1]-1` smallest unmarked
- Track sum of unmarked elements; subtract each marked element

**Visual:**

```
nums=[1,2,3,4,5], queries=[[1,2],[3,3],[4,2]]

Initial sum=15, heap=[(1,0),(2,1),(3,2),(4,3),(5,4)]

Query[0]: idx=1, k=2
  Mark index 1 (val=2) → sum=15-2=13
  Need 1 more smallest: pop (1,0)→mark index 0 → sum=13-1=12
  score[0] = 12

Query[1]: idx=3, k=3
  Mark index 3 (val=4) → sum=12-4=8
  Need 2 more: pop (3,2),(5,4) → sum=8-3-5=0
  score[1] = 0

Query[2]: idx=4, k=2
  index 4 already marked → skip
  Need 2 more: heap empty → score[2]=0
```

## Problem Description

Given `nums[]` and `queries[]` where `queries[i] = [index_i, k_i]`. For each query: mark `nums[index_i]`, then mark the `k_i - 1` **smallest unmarked** elements. After each query, record the **sum of all unmarked elements**. Return the score array. `1 ≤ nums.length ≤ 10^5`, `1 ≤ queries.length ≤ 10^5`.

**Example 1:** `nums=[1,2,3,4,5]`, `queries=[[1,2],[3,3],[4,2]]` → `[8,0,0]`
**Example 2:** `nums=[1,4,2,3]`, `queries=[[0,2],[3,3],[4,2]]` → `[7,0,0]`

## 📝 Interview Tips

1. **Clarify**: Nếu index đã được đánh dấu thì chỉ đánh dấu thêm k-1 phần tử nhỏ nhất / If index already marked, still mark k-1 smallest
2. **Approach**: Min-heap (value, index) → pop k-1 times per query; track marked set / Min-heap for efficient smallest removal
3. **Edge cases**: index đã marked; k > remaining unmarked elements / Already-marked index; k exceeds remaining elements
4. **Optimize**: Min-heap với set cho marked → O(n log n + Q·k·log n) tổng thể / Heap with marked set
5. **Test**: Trace query by query, track heap and sum / Manually trace to verify sum decrements
6. **Follow-up**: Nếu cần undo queries? / How would you handle undo operations?

## Solutions

```typescript
/** Min-Heap implementation (simple array-based)
 * In real interviews, JS doesn't have built-in heap — explain you'd use one
 */
class MinHeap {
  private data: [number, number][] = []; // [value, index]

  push(item: [number, number]) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }

  pop(): [number, number] | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  peek(): [number, number] | undefined {
    return this.data[0];
  }
  size(): number {
    return this.data.length;
  }

  private _bubbleUp(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this._less(i, p)) {
        this._swap(i, p);
        i = p;
      } else break;
    }
  }

  private _sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this._less(l, min)) min = l;
      if (r < n && this._less(r, min)) min = r;
      if (min === i) break;
      this._swap(i, min);
      i = min;
    }
  }

  private _less(a: number, b: number): boolean {
    const [va, ia] = this.data[a],
      [vb, ib] = this.data[b];
    return va < vb || (va === vb && ia < ib);
  }

  private _swap(a: number, b: number) {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }
}

/** Solution 1: Min-Heap simulation
 * Time: O((n + Q·k) log n) | Space: O(n)
 */
function unmarkedSumArray(nums: number[], queries: number[][]): number[] {
  const n = nums.length;
  const marked = new Uint8Array(n);
  const heap = new MinHeap();

  let totalSum = 0;
  for (let i = 0; i < n; i++) {
    heap.push([nums[i], i]);
    totalSum += nums[i];
  }

  const result: number[] = [];

  for (const [idx, k] of queries) {
    // Mark the specified index
    if (!marked[idx]) {
      marked[idx] = 1;
      totalSum -= nums[idx];
    }

    // Mark k-1 smallest unmarked elements
    let need = k - 1;
    while (need > 0 && heap.size() > 0) {
      const top = heap.peek()!;
      if (marked[top[1]]) {
        heap.pop();
        continue;
      } // skip already marked
      heap.pop();
      marked[top[1]] = 1;
      totalSum -= top[0];
      need--;
    }

    result.push(totalSum);
  }

  return result;
}

/** Solution 2: Brute force for verification (small inputs)
 * Time: O(Q · n log n) | Space: O(n)
 */
function unmarkedSumArrayBrute(nums: number[], queries: number[][]): number[] {
  const marked = new Array(nums.length).fill(false);
  const result: number[] = [];

  for (const [idx, k] of queries) {
    marked[idx] = true;
    // Find k-1 smallest unmarked
    const unmarked = nums
      .map((v, i) => [v, i] as [number, number])
      .filter(([, i]) => !marked[i])
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    for (let i = 0; i < k - 1 && i < unmarked.length; i++) {
      marked[unmarked[i][1]] = true;
    }
    const sum = nums.reduce((s, v, i) => s + (marked[i] ? 0 : v), 0);
    result.push(sum);
  }
  return result;
}

// Test cases
console.log(
  unmarkedSumArray(
    [1, 2, 3, 4, 5],
    [
      [1, 2],
      [3, 3],
      [4, 2],
    ],
  ),
); // [8, 0, 0]
console.log(
  unmarkedSumArray(
    [1, 4, 2, 3],
    [
      [0, 2],
      [3, 3],
      [4, 2],
    ],
  ),
); // [7, 0, 0]
console.log(
  unmarkedSumArrayBrute(
    [1, 2, 3, 4, 5],
    [
      [1, 2],
      [3, 3],
      [4, 2],
    ],
  ),
); // [8, 0, 0]
```

## 🔗 Related Problems

| Problem                                                                                                                              | Relationship                                        |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [Find Score of an Array After Marking All Elements](https://leetcode.com/problems/find-score-of-an-array-after-marking-all-elements) | Similar marking pattern with heap-based selection   |
| [Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii)                                                                 | Heap tracking smallest available resource           |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)                                     | Core heap operation — extract k-th smallest/largest |
