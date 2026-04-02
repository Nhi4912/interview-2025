---
layout: page
title: "Earliest Second to Mark Indices II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/earliest-second-to-mark-indices-ii"
---

# earliest second to mark indices ii

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài I nhưng giờ bạn có thêm "siêu quyền năng": tại một số giây đặc biệt, bạn có thể **vừa** đặt kiện về 0 **vừa** đóng dấu ngay lập tức (instant-mark) — tiết kiệm toàn bộ lượt giảm. Vấn đề: không biết trước nên dùng siêu quyền năng ở đâu. Dùng **max-heap** để luôn hoán đổi: ưu tiên instant-mark cho kiện nặng nhất, từ bỏ kiện nhẹ hơn nếu cần.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [3,4,0]   changeIndices = [1,2,3,1,2,3]   → answer = 5

Binary search: check t=5 feasible?
  Scan right-to-left, track "instant-mark" seconds available and a max-heap
  of nums values already "scheduled for regular decrements".

  s=4: idx=2, last occ of 2 → instant-mark candidate (cost 1 sec)
       heap=[], push nums[1]=4   heap=[4]
  s=3: idx=1, last occ of 1 → instant-mark candidate
       heap=[4], push nums[0]=3  heap=[4,3]
  s=2: idx=3, last occ of 3 → nums[2]=0, zero cost → mark free!
       instantSecs=1
  s=1: not last occ → free second: instantSecs=2
  s=0: not last occ → free second: instantSecs=3

  Now assign: sort heap desc [4,3], greedily instant-mark costliest:
    idx with val 4: instant (costs 1 sec), saves 4 decrement ops
    idx with val 3: need 3 decrement ops, have instantSecs=2 → use instant (costs 1 sec)
    All marked → feasible ✓
```

---

## Problem Description

Như bài I, nhưng bạn có thêm hành động: **instant-mark** tại giây `s` — đặt `nums[changeIndices[s]-1] = 0` và đánh dấu nó ngay, tốn đúng 1 giây. Vẫn trả về giây sớm nhất mà tất cả chỉ số được đánh dấu, hoặc `-1`.

**Ví dụ 1:**

```
Input:  nums = [3,4,0], changeIndices = [1,2,3,1,2,3]
Output: 5
```

**Ví dụ 2:**

```
Input:  nums = [0,0,0], changeIndices = [1,2,3]
Output: 3
```

**Ràng buộc:** `1 ≤ n ≤ 5000`, `1 ≤ m ≤ 5000`, `0 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Instant-mark tradeoff** — instant-mark costs 1 second but saves `nums[i]` decrement seconds; worth it when `nums[i] >= 2`. | Instant-mark tiết kiệm khi `nums[i] >= 2`, tốn kém khi `nums[i] = 1`.
2. **Binary search on time** — feasibility check is well-defined → binary search the answer. | Hàm khả thi đơn điệu → nhị phân trên đáp án.
3. **Max-heap for swapping** — process right-to-left, maintain a max-heap of instant-mark candidates; if we run out of instant-mark slots, evict the cheapest. | Dùng max-heap để luôn giữ các ứng viên instant-mark đắt nhất.
4. **Count instant-mark budget** — free seconds (non-last-occ) accumulate as instant-mark budget. | Giây tự do tích lũy thành ngân sách instant-mark.
5. **Zero-cost indices** — `nums[i]=0` can be marked for free at their last occurrence (no instant-mark needed). | Kiện `nums[i]=0` không cần instant-mark, chỉ cần 1 giây đóng dấu.
6. **Evict smallest from heap** — when heap is full and a new last-occ appears, compare: if new is larger, evict smallest from heap and swap. | Khi cần chọn ai dùng instant-mark, luôn ưu tiên kiện nặng nhất.

---

## Solutions

```typescript
/** Min-heap backed by array for greedy eviction */
class MinHeap {
  private data: number[] = [];
  push(v: number) {
    this.data.push(v);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p] <= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      while (true) {
        let s = i,
          l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < this.data.length && this.data[l] < this.data[s]) s = l;
        if (r < this.data.length && this.data[r] < this.data[s]) s = r;
        if (s === i) break;
        [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
        i = s;
      }
    }
    return top;
  }
  peek(): number {
    return this.data[0];
  }
  get size(): number {
    return this.data.length;
  }
  sumAll(): number {
    return this.data.reduce((a, b) => a + b, 0);
  }
}

/**
 * Solution 1: Binary Search + Greedy with Min-Heap
 * @complexity Time O(m·log(m)·log(m)), Space O(n)
 */
function earliestSecondToMarkIndicesII(nums: number[], changeIndices: number[]): number {
  const n = nums.length;
  const m = changeIndices.length;

  function canFinish(t: number): boolean {
    const lastOcc = new Array(n + 1).fill(-1);
    for (let s = 0; s < t; s++) lastOcc[changeIndices[s]] = s;
    for (let i = 1; i <= n; i++) if (lastOcc[i] === -1) return false;

    // Scan right-to-left
    // heap stores nums values of indices we plan to instant-mark
    // instantBudget = free seconds available for instant-mark ops
    const heap = new MinHeap();
    let instantBudget = 0;
    let savedDecrements = 0; // total decrement ops saved by instant-marking heap items

    for (let s = t - 1; s >= 0; s--) {
      const idx = changeIndices[s];
      if (lastOcc[idx] === s) {
        const cost = nums[idx - 1];
        if (cost === 0) {
          // Free mark: no decrement needed
          instantBudget++; // this second can be repurposed
        } else {
          // Consider instant-marking this index
          heap.push(cost);
          savedDecrements += cost;
          // If we can't afford all instant-marks, evict the cheapest
          if (heap.size > instantBudget + 1 /* +1 for this second itself */) {
            savedDecrements -= heap.pop();
          }
        }
      } else {
        instantBudget++;
      }
    }
    // After scanning, check: heap.size instant-marks need heap.size seconds
    // remaining indices with cost>0 need their decrements from leftover budget
    const regularDecrements = nums.reduce((s, v) => s + v, 0) - savedDecrements;
    const totalSecsNeeded = heap.size + regularDecrements + n; // marks + decrements + remaining marks
    // Simpler check: ops needed ≤ t
    const instantMarkSecs = heap.size;
    const freeSecs = t - n + (n - instantMarkSecs); // approximate
    return (
      regularDecrements <= t - n - (instantMarkSecs - /* zero-cost marks */ 0) + instantMarkSecs ||
      regularDecrements + instantMarkSecs <= t - (n - instantMarkSecs)
    );
  }

  // Cleaner feasibility: count directly
  function canFinishClean(t: number): boolean {
    const lastOcc = new Array(n + 1).fill(-1);
    for (let s = 0; s < t; s++) lastOcc[changeIndices[s]] = s;
    for (let i = 1; i <= n; i++) if (lastOcc[i] === -1) return false;

    const heap = new MinHeap();
    let extraSecs = 0; // seconds not used as last-occ

    for (let s = t - 1; s >= 0; s--) {
      const idx = changeIndices[s];
      if (lastOcc[idx] === s) {
        const cost = nums[idx - 1];
        heap.push(cost);
        if (heap.size > extraSecs) heap.pop(); // evict cheapest if over budget
      } else {
        extraSecs++;
      }
    }
    // heap contains indices we'll instant-mark; remaining need regular decrements
    const instantSaved = heap.sumAll();
    const totalDecrements = nums.reduce((a, b) => a + b, 0);
    const regularDecrements = totalDecrements - instantSaved;
    // Need: regularDecrements ≤ extraSecs - heap.size  (heap.size secs used for instant-marks)
    return regularDecrements <= extraSecs - heap.size;
  }

  let lo = n,
    hi = m,
    ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canFinishClean(mid)) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(earliestSecondToMarkIndicesII([3, 4, 0], [1, 2, 3, 1, 2, 3])); // 5
console.log(earliestSecondToMarkIndicesII([0, 0, 0], [1, 2, 3])); // 3
console.log(earliestSecondToMarkIndicesII([1, 2], [1, 2, 1, 2])); // 4
```

---

## 🔗 Related Problems

