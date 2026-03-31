---
layout: page
title: "Total Cost to Hire K Workers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/total-cost-to-hire-k-workers"
---

# Total Cost to Hire K Workers / Tổng Chi Phí Thuê K Công Nhân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Candy Crush](https://leetcode.com/problems/candy-crush) | [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn phỏng vấn ứng viên từ hai đầu danh sách CV. Mỗi vòng, bạn xem `candidates` người từ đầu và `candidates` người từ cuối, chọn người có chi phí thấp nhất. Sau mỗi lần thuê, danh sách thu hẹp lại.

**Pattern Recognition:**

- Hai heap (trái và phải), mỗi heap chứa `candidates` phần tử
- Two pointers `left` và `right` đánh dấu biên của vùng "chưa xét"
- Mỗi vòng lấy min từ hai heap, tuyển dụng người đó

**Visual — costs=[17,12,10,2,7,2,11,20,8], k=3, candidates=4:**

```
Left heap:  [2, 10, 12, 17]   (idx 0..3)
Right heap: [2,  7,  8, 11]   (idx 5..8)
              ↑ left=4       right=4 ↑

Round 1: pick min(2,2)=2 from right → total=2, right heap refills ← idx4=2
Round 2: pick min(2,2)=2 from left  → total=4
Round 3: pick min(10,2)=2            → total=6 ✅
```

---

## Problem Description

You have `costs` array where `costs[i]` is the cost of the i-th worker. In each hiring session, choose the worker with the **lowest cost** from among the first `candidates` and last `candidates` workers. Hire `k` workers total. Return the total minimum cost.

- Example 1: `costs=[17,12,10,2,7,2,11,20,8], k=3, candidates=4` → `11`
- Example 2: `costs=[1,2,4,1], k=3, candidates=3` → `4`

---

## 📝 Interview Tips

1. **Clarify**: "Candidates có thể overlap (2\*candidates >= n)?" / Can candidate windows overlap?
2. **Data structure**: "Dùng min-heap cho từng phía trái/phải" / Use min-heap for each side
3. **Two pointers**: "`left` và `right` thu hẹp sau mỗi lần tuyển" / Pointers shrink inward after each hire
4. **Tie-break**: "Nếu bằng chi phí, ưu tiên left heap (index nhỏ hơn)" / Same cost → prefer smaller index (left)
5. **Edge case**: "Nếu 2\*candidates >= n thì mọi người đều trong candidate pool" / Overlapping windows = all workers are candidates
6. **Follow-up**: "Nếu cho phép thuê cùng người nhiều lần?" / What if re-hiring is allowed?

---

## Solutions

```typescript
// Min-heap helper (simple sorted array sim for interview clarity)
class MinHeap {
  private data: number[] = [];
  push(val: number) {
    this.data.push(val);
    this.data.sort((a, b) => a - b);
  }
  pop(): number {
    return this.data.shift()!;
  }
  peek(): number {
    return this.data[0];
  }
  size(): number {
    return this.data.length;
  }
}

/**
 * Solution 1: Two Min-Heaps + Two Pointers
 * Time: O((n + k) log(candidates)) — heap ops
 * Space: O(candidates) — two heaps of size candidates
 */
function totalCost(costs: number[], k: number, candidates: number): number {
  const n = costs.length;
  const left = new MinHeap();
  const right = new MinHeap();
  let lo = 0,
    hi = n - 1;

  // Seed both heaps
  for (let i = 0; i < candidates && lo <= hi; i++, lo++) left.push(costs[lo]);
  for (let i = 0; i < candidates && lo <= hi; i++, hi--) right.push(costs[hi]);

  let total = 0;
  for (let i = 0; i < k; i++) {
    const lMin = left.size() > 0 ? left.peek() : Infinity;
    const rMin = right.size() > 0 ? right.peek() : Infinity;
    if (lMin <= rMin) {
      total += left.pop();
      if (lo <= hi) {
        left.push(costs[lo++]);
      }
    } else {
      total += right.pop();
      if (lo <= hi) {
        right.push(costs[hi--]);
      }
    }
  }
  return total;
}

/**
 * Solution 2: Single merged sorted approach (simpler for small inputs)
 * Time: O(n log n + k log n)
 * Space: O(n)
 */
function totalCostSimple(costs: number[], k: number, candidates: number): number {
  const n = costs.length;
  // Tag each cost with its index to track left/right eligibility
  const tagged = costs.map((c, i) => [c, i] as [number, number]);
  tagged.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  let total = 0,
    hired = 0;
  const used = new Set<number>();
  for (const [cost, idx] of tagged) {
    if (hired === k) break;
    // Check if idx is in first or last candidates (considering used slots)
    if (idx < candidates || idx >= n - candidates) {
      total += cost;
      used.add(idx);
      hired++;
    }
  }
  return total;
}

// === Test Cases ===
console.log(totalCost([17, 12, 10, 2, 7, 2, 11, 20, 8], 3, 4)); // 11
console.log(totalCost([1, 2, 4, 1], 3, 3)); // 4
console.log(totalCost([1], 1, 1)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern                        | Difficulty |
| ------------------------------------------------------------------------------------------------ | ------------------------------ | ---------- |
| [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)                 | Binary Search + Sliding Window | Medium     |
| [Number of Orders in the Backlog](https://leetcode.com/problems/number-of-orders-in-the-backlog) | Heap                           | Medium     |
| [IPO](https://leetcode.com/problems/ipo)                                                         | Two Heaps                      | Hard       |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | Heap / Quickselect             | Medium     |
