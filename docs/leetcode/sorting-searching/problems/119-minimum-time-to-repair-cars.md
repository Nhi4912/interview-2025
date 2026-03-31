---
layout: page
title: "Minimum Time to Repair Cars"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-repair-cars"
---

# Minimum Time to Repair Cars / Thời Gian Tối Thiểu Để Sửa Xe

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài "Koko ăn chuối" — ta không tính thời gian trực tiếp, mà đặt câu hỏi: "Nếu cho phép tối đa `t` phút, có thể sửa xong tất cả xe không?" Binary search tìm `t` nhỏ nhất với câu trả lời là Yes.

**Pattern Recognition:**

- Signal: "minimum time, all mechanics work in parallel" → **Binary Search on Answer**
- Mechanic với rank `r` sửa được `floor(sqrt(t/r))` xe trong thời gian `t`
- Key insight: "can we fix all `cars` in time `t`?" là monotone → binary search

**Visual — ranks=[4,2,3,1], cars=10:**

```
t=16: rank4→floor(√(16/4))=2, rank2→floor(√8)=2, rank3→floor(√(16/3))=2, rank1→4
      total=2+2+2+4=10 ✓
t=15: rank1→floor(√15)=3, rank2→floor(√7)=2, rank3→floor(√5)=2, rank4→floor(√(15/4))=1
      total=3+2+2+1=8 < 10 ✗

Binary search: lo=1, hi=rank_min * cars^2
```

---

## Problem Description

Given `ranks[]` (mechanic ranks) and integer `cars` (total cars to fix): mechanic with rank `r` takes `r * n²` minutes to fix `n` cars. All mechanics work **in parallel**. Return **minimum minutes** to fix all `cars`. ([LeetCode 2594](https://leetcode.com/problems/minimum-time-to-repair-cars))

Difficulty: Medium | Acceptance: 59.9%

```
Example 1: ranks=[4,2,3,1], cars=10  → 16
  (mechanic rank 1 fixes 4 cars in 16 min, others fix 2+2+2=6, total=10)
Example 2: ranks=[5,1,8], cars=6     → 16
  (rank1 fixes floor(√16)=4, rank5 fixes 1, rank8 fixes 1, total=6)
```

Constraints: `1 ≤ n ≤ 10^5`, `1 ≤ ranks[i] ≤ 100`, `1 ≤ cars ≤ 10^6`

---

## 📝 Interview Tips

1. **Formula / Công thức**: "Mechanic rank r sửa được floor(√(t/r)) xe trong thời gian t"
2. **Upper bound / Giới hạn trên**: hi = min(ranks) \* cars² (1 mechanic làm tất cả)
3. **Overflow / Tràn số**: ranks[i] _ cars² có thể tới 100 _ 10^12 → dùng BigInt hoặc check carefully
4. **Math.sqrt precision / Độ chính xác sqrt**: Dùng Math.floor(Math.sqrt(t/r)) — kiểm tra integer boundary
5. **Parallel work / Song song**: Mỗi mechanic tự tính riêng, sum tất cả capacity ≥ cars → feasible
6. **Complexity / Độ phức tạp**: O(n _ log(min_rank _ cars²))

---

## Solutions

```typescript
/**
 * Solution 1: Linear scan — increment time until feasible
 * Time: O(min_rank * cars^2) — only for tiny inputs
 * Space: O(1)
 */
function repairCarsBrute(ranks: number[], cars: number): number {
  const canFix = (t: number) => ranks.reduce((s, r) => s + Math.floor(Math.sqrt(t / r)), 0) >= cars;
  let t = 1;
  while (!canFix(t)) t++;
  return t;
}

/**
 * Solution 2: Binary Search on Answer (Optimal)
 * Time: O(n * log(min_rank * cars^2))  Space: O(1)
 *
 * Feasibility: sum of floor(sqrt(t / ranks[i])) >= cars
 * Monotone: if feasible at t, then feasible at t+1 too
 * Search range: [1, min(ranks) * cars^2]
 */
function repairCars(ranks: number[], cars: number): number {
  const canFix = (t: number): boolean => {
    let fixed = 0;
    for (const r of ranks) {
      fixed += Math.floor(Math.sqrt(t / r));
      if (fixed >= cars) return true; // early exit
    }
    return false;
  };

  let lo = 1;
  let hi = Math.min(...ranks) * cars * cars; // worst case: fastest mechanic fixes all

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canFix(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * Solution 3: Optimized Binary Search — group by rank (reduce n)
 * Time: O(100 * log(min_rank * cars^2))  Space: O(100)
 * ranks[i] ∈ [1,100], so group by rank for constant inner loop
 */
function repairCarsOpt(ranks: number[], cars: number): number {
  const freq = new Array(101).fill(0);
  let minRank = 101;
  for (const r of ranks) {
    freq[r]++;
    minRank = Math.min(minRank, r);
  }

  const canFix = (t: number): boolean => {
    let fixed = 0;
    for (let r = 1; r <= 100; r++) {
      if (freq[r] > 0) fixed += freq[r] * Math.floor(Math.sqrt(t / r));
      if (fixed >= cars) return true;
    }
    return false;
  };

  let lo = 1,
    hi = minRank * cars * cars;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canFix(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// === Tests ===
console.log(repairCars([4, 2, 3, 1], 10)); // 16
console.log(repairCars([5, 1, 8], 6)); // 16
console.log(repairCars([1], 1)); // 1
console.log(repairCarsOpt([4, 2, 3, 1], 10)); // 16
console.log(repairCarsBrute([4, 2, 3, 1], 10)); // 16
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Relationship                              |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [2594. Minimum Time to Repair Cars](https://leetcode.com/problems/minimum-time-to-repair-cars)                         | This problem                              |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                          | Binary search on answer, parallel workers |
| [1011. Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) | Binary search on capacity                 |
| [2226. Maximum Candies Allocated to K Children](https://leetcode.com/problems/maximum-candies-allocated-to-k-children) | Binary search feasibility                 |
| [2141. Maximum Running Time of N Computers](https://leetcode.com/problems/maximum-running-time-of-n-computers)         | Binary search on time, parallel resources |
