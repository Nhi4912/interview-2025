---
layout: page
title: "Maximum Product After K Increments"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-product-after-k-increments"
---

# Maximum Product After K Increments / Maximum Product After K Increments

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [IPO](https://leetcode.com/problems/ipo)

---

## 🧠 Intuition / Tư Duy

**Analogy / Gốc nhìn:** Như đổ nước vào các cốc — luôn đổ vào cốc thấp nhất để tổng tích tối đa. AM-GM: tích lớn nhất khi các giá trị đều nhau, nên luôn tăng phần tử nhỏ nhất.

**Pattern Recognition:**

- Keyword: "k increments" + "maximize product" → greedy tăng min → **Min-Heap / Sort**
- Tối ưu: thay vì lặp k lần, gom theo "level" để O(n log n) thay vì O(k log n)

**Visual — Water-Fill Levels:**

```
sorted=[2,3,3,6], k=2
Level→1: cost=1×(3-2)=1 ≤ k=2 → [3,3,3,6], k=1
Level→2: cost=2×(3-3)=0 ≤ k=1 → [3,3,3,6], k=1
Level→3: cost=3×(6-3)=9 > k=1 → distribute: q=0, r=1 → [3,3,4,6]
Product = 3×3×4×6 = 216
```

---

## Problem Description

Cho `nums` và `k`. Mỗi thao tác tăng bất kỳ phần tử lên 1; thực hiện **đúng k** lần. Trả về **tích lớn nhất mod 10⁹+7**.

**Example 1:** `nums=[0,4], k=5` → tăng 0 năm lần → `[5,4]` → `20`
**Example 2:** `nums=[6,3,3,2], k=2` → `[3,3,3,6]` rồi `[3,3,4,6]` → `216`
**Example 3:** `nums=[2,2], k=3` → `[3,4]` hoặc `[2,5]` → tối ưu `[3,4]` → `12`

Constraints: `1 ≤ nums.length ≤ 1e5`, `0 ≤ nums[i] ≤ 1e6`, `1 ≤ k ≤ 1e9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "k có thể = 0? Output cần mod?" / Confirm k range and modular output
2. **Brute Force**: "Sort + lặp k lần tăng min → O(k log n)" — TLE khi k=1e9 / Too slow for large k
3. **Greedy Key**: "Tại sao tăng min tối ưu?" — AM-GM: ∏xᵢ tối đa khi xᵢ đều nhau / AM-GM: equal values maximize product
4. **Optimize**: "Gom thành levels: mỗi level fill bao nhiêu k, remainder phân đều" / Batch fills by level
5. **Edge Case**: "nums chứa 0? k lớn hơn tổng gap?" / Zeros are fine; huge k → distribute q and q+1 evenly
6. **Follow-up**: "Tại sao dùng BigInt?" — tích có thể > Number.MAX_SAFE_INTEGER trước mod / Overflow before modular reduction

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Level Distribution (Optimal)
 * @time O(n log n) — sort dominates; single O(n) fill pass
 * @space O(1) — in-place sort
 */
function maximumProduct(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;
  nums.sort((a, b) => a - b);

  // Fill level-by-level from bottom: bring [0..i] up to nums[i+1]
  for (let i = 0; i < n - 1 && k > 0; i++) {
    const needed = (nums[i + 1] - nums[i]) * (i + 1);
    if (needed >= k) {
      // Not enough k to fill entire level — distribute remainder evenly
      const q = Math.floor(k / (i + 1));
      const r = k % (i + 1);
      for (let j = 0; j <= i; j++) nums[j] += q + (j < i + 1 - r ? 0 : 1);
      k = 0;
      break;
    }
    for (let j = 0; j <= i; j++) nums[j] = nums[i + 1]; // fill to next level
    k -= needed;
  }

  if (k > 0) {
    // still has k after all levels filled → all equal, distribute evenly
    const q = Math.floor(k / n),
      r = k % n;
    for (let j = 0; j < n; j++) nums[j] += q + (j < n - r ? 0 : 1);
  }

  let product = 1n;
  for (const v of nums) product = (product * BigInt(v)) % MOD;
  return Number(product);
}

/**
 * Solution 2: Min-Heap Simulation (Intuitive — OK for k ≤ 1e5)
 * @time O(k log n) — one heap-pop+push per increment
 * @space O(n)
 */
function maximumProductHeap(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  const h = [...nums];

  const down = (i: number) => {
    const n = h.length;
    while (2 * i + 1 < n) {
      let j = 2 * i + 1;
      if (j + 1 < n && h[j + 1] < h[j]) j++;
      if (h[i] <= h[j]) break;
      [h[i], h[j]] = [h[j], h[i]];
      i = j;
    }
  };
  for (let i = (h.length >> 1) - 1; i >= 0; i--) down(i); // build min-heap

  for (let i = 0; i < k; i++) {
    h[0]++; // increment min
    down(0); // restore heap
  }
  let product = 1n;
  for (const v of h) product = (product * BigInt(v)) % MOD;
  return Number(product);
}

// === Test Cases ===
console.log(maximumProduct([0, 4], 5)); // 20
console.log(maximumProduct([6, 3, 3, 2], 2)); // 216
console.log(maximumProductHeap([0, 4], 5)); // 20
console.log(maximumProductHeap([6, 3, 3, 2], 2)); // 216
```

---

## 🔗 Related Problems

- [IPO](https://leetcode.com/problems/ipo) — greedy + two heaps, pick max profit available
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy scheduling with max-heap
- [Minimum Operations to Make Array Equal](https://leetcode.com/problems/minimum-operations-to-make-array-equal) — same level-fill intuition
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — multi-list min-heap
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — greedy + heap, always use most frequent
