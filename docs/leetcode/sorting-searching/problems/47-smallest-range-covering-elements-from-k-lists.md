---
layout: page
title: "Smallest Range Covering Elements from K Lists"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists"
---

# Smallest Range Covering Elements from K Lists / Phạm Vi Nhỏ Nhất Bao Phủ K Danh Sách

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Min Heap + Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Reduce Array Size to The Half](https://leetcode.com/problems/reduce-array-size-to-the-half)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có k nhóm học sinh, mỗi nhóm được xếp hạng. Cần chọn 1 học sinh từ mỗi nhóm sao cho điểm cao nhất - thấp nhất nhỏ nhất — như tìm "cửa sổ" hẹp nhất phủ đại diện từ mỗi nhóm.

**Pattern Recognition:**

- Signal: "pick one from each of k lists, minimize range" → **Min Heap + track current max**
- Merge tất cả phần tử (kèm list index), dùng heap để lấy min; max được track riêng
- Key insight: range = [heap_min, current_max]; advance min forward = shrink range từ dưới

**Visual — nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]:**

```
Init heap: [(0,1,0),(4,0,0),(5,2,0)]  (val, listIdx, elemIdx)
curMax = 5,  range = [0, 5], size=5

Extract (0,list1): add next (9,list1,1)
  heap=[(4,0,0),(5,2,0),(9,1,1)], curMax=9, range=[4,9], size=5

Extract (4,list0): add next (10,list0,1)
  heap=[(5,2,0),(9,1,1),(10,0,1)], curMax=10, range=[5,10], size=5 ✅ best so far

...continue until any list exhausted
```

---

## Problem Description

Cho `nums` là danh sách k mảng đã sort tăng dần. Tìm **phạm vi nhỏ nhất [a, b]** sao cho mỗi danh sách có ít nhất một phần tử trong [a, b]. Nhỏ nhất theo kích thước b-a, rồi theo a nhỏ hơn. ([LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists))

Difficulty: Hard | Acceptance: 69.7%

- `nums=[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]` → `[20,24]`
- `nums=[[1,2,3],[1,2,3],[1,2,3]]` → `[1,1]`

Constraints: `k == nums.length`, `1 <= k <= 3500`, `1 <= nums[i].length <= 50`, `-10^5 <= nums[i][j] <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Range phải chứa ít nhất 1 phần tử từ mỗi list không?" / Yes, at least one from each
2. **Brute force**: "Thử mọi tổ hợp — O((total_elements)^k) — quá chậm" / Too slow for large k
3. **Key insight**: "Min heap giữ 1 phần tử mỗi list; max được theo dõi riêng" / Heap tracks current min per list
4. **Termination**: "Dừng khi bất kỳ list nào hết phần tử — không thể giảm range nữa" / Stop when any list exhausted
5. **Edge cases**: "k=1 → range là [min, min] của list; tất cả list bằng nhau → [v,v]" / k=1 trivial
6. **Follow-up**: "Merge sorted + sliding window cũng hoạt động — tương đương" / Flat merge + sliding window

---

## Solutions

```typescript
/**
 * Min-heap simulation using sorted array (JS has no built-in heap)
 */
type HeapItem = [number, number, number]; // [value, listIndex, elemIndex]

class MinHeap {
  private data: HeapItem[] = [];
  get size() {
    return this.data.length;
  }
  push(item: HeapItem) {
    this.data.push(item);
    this._bubbleUp(this.data.length - 1);
  }
  pop(): HeapItem {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  private _bubbleUp(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  private _sinkDown(i: number) {
    const n = this.data.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.data[l][0] < this.data[min][0]) min = l;
      if (r < n && this.data[r][0] < this.data[min][0]) min = r;
      if (min === i) break;
      [this.data[min], this.data[i]] = [this.data[i], this.data[min]];
      i = min;
    }
  }
}

/**
 * Solution 1: Brute Force — Try All Combinations (feasible for tiny input)
 * Time: O(N^k) — all element combinations across k lists
 * Space: O(k)
 */
function smallestRangeBrute(nums: number[][]): number[] {
  const k = nums.length;
  let best = [-100000, 100000];
  function dfs(idx: number, chosen: number[]) {
    if (idx === k) {
      const lo = Math.min(...chosen),
        hi = Math.max(...chosen);
      if (hi - lo < best[1] - best[0] || (hi - lo === best[1] - best[0] && lo < best[0]))
        best = [lo, hi];
      return;
    }
    for (const v of nums[idx]) {
      chosen.push(v);
      dfs(idx + 1, chosen);
      chosen.pop();
    }
  }
  dfs(0, []);
  return best;
}

/**
 * Solution 2: Min Heap + Track Current Max
 * Time: O(N log k) — N total elements, each heap op is O(log k)
 * Space: O(k) — heap holds one element per list
 */
function smallestRange(nums: number[][]): number[] {
  const heap = new MinHeap();
  let curMax = -Infinity;

  // Initialize: push first element from each list
  for (let i = 0; i < nums.length; i++) {
    heap.push([nums[i][0], i, 0]);
    curMax = Math.max(curMax, nums[i][0]);
  }

  let rangeStart = -100000,
    rangeEnd = 100000;

  while (heap.size === nums.length) {
    const [minVal, listIdx, elemIdx] = heap.pop();
    // Current range: [minVal, curMax]
    if (curMax - minVal < rangeEnd - rangeStart) {
      rangeStart = minVal;
      rangeEnd = curMax;
    }
    // Advance in the list that had the minimum
    const nextIdx = elemIdx + 1;
    if (nextIdx >= nums[listIdx].length) break; // list exhausted → stop
    const nextVal = nums[listIdx][nextIdx];
    heap.push([nextVal, listIdx, nextIdx]);
    curMax = Math.max(curMax, nextVal);
  }
  return [rangeStart, rangeEnd];
}

// === Test Cases ===
console.log(
  smallestRange([
    [4, 10, 15, 24, 26],
    [0, 9, 12, 20],
    [5, 18, 22, 30],
  ]),
);
// [20, 24]
console.log(
  smallestRange([
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ]),
);
// [1, 1]
console.log(
  smallestRange([
    [10, 10],
    [11, 11],
  ]),
);
// [10, 11]
```

---

## 🔗 Related Problems

- [Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists) — same min-heap across k lists
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — track max in a window
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy + heap scheduling
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — heap to interleave optimally
- [Smallest Range Covering Elements from K Lists — LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — problem page
