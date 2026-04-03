---
layout: page
title: "Maximum Running Time of N Computers"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-running-time-of-n-computers"
---

# Maximum Running Time of N Computers / Thời Gian Chạy Tối Đa Của N Máy Tính

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia điện cho n máy từ nhiều pin — mỗi pin cấp tối đa `t` phút cho một máy bất kỳ. Hỏi: n máy có thể chạy đồng thời tối đa bao nhiêu phút? Binary search trên t: feasible khi tổng `min(battery, t)` ≥ n\*t.

**Pattern Recognition:**

- Signal: "n computers run simultaneously, batteries can be split" → **Binary Search on Answer**
- Feasibility check: for time t, each battery contributes `min(battery[i], t)` minutes to pool
- Key insight: pool ≥ n\*t means we can distribute power to keep n computers running for t minutes

**Visual — n=2, batteries=[3,3,3]:**

```
t=3: min(3,3)+min(3,3)+min(3,3)=9 ≥ 2*3=6 ✓
t=4: min(3,4)+min(3,4)+min(3,4)=9 ≥ 2*4=8 ✓
t=5: 9 < 2*5=10 ✗

Binary search: lo=1, hi=sum/n=4 → answer=4
```

---

## Problem Description

You have `n` computers and a list of `batteries`. Each computer needs exactly one battery at a time; batteries can be **swapped** between computers. Return the **maximum number of minutes** you can run all `n` computers simultaneously. ([LeetCode 2141](https://leetcode.com/problems/maximum-running-time-of-n-computers))

Difficulty: Hard | Acceptance: 49.8%

```
Example 1: n=2, batteries=[3,3,3]  → 4
Example 2: n=2, batteries=[1,1,1,1]  → 2
Example 3: n=3, batteries=[10,10,3,5] → 8
  t=8: min(10,8)+min(10,8)+min(3,8)+min(5,8)=8+8+3+5=24 ≥ 3*8=24 ✓
```

Constraints: `1 ≤ n ≤ batteries.length ≤ 10^5`, `1 ≤ batteries[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Key insight / Nhận xét**: "Battery capped at t: nếu battery > t, nó chỉ đóng góp t cho một máy"
2. **Feasibility formula / Công thức**: `sum(min(b, t)) >= n * t` → feasible
3. **Upper bound / Giới hạn trên**: hi = sum(batteries) / n (nếu chia đều hoàn hảo)
4. **Greedy proof / Chứng minh greedy**: Nếu sum >= n\*t, ta có thể schedule bằng round-robin theo thứ tự tham lam
5. **Battery > t special case / Trường hợp đặc biệt**: Nếu có battery >= tổng thời gian cần → mỗi máy có thể dùng nhiều pin khác
6. **Complexity / Độ phức tạp**: O(n log(sum/n)) for binary search + O(n) per check

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — linear scan from t=1 upward
 * Time: O(sum/n * n) — infeasible for large inputs  Space: O(1)
 */
function maxRunTimeBrute(n: number, batteries: number[]): number {
  const canRun = (t: number): boolean => {
    let pool = 0;
    for (const b of batteries) pool += Math.min(b, t);
    return pool >= n * t;
  };
  let t = 0;
  while (canRun(t + 1)) t++;
  return t;
}

/**
 * Solution 2: Binary Search on Answer (Optimal)
 * Time: O(m * log(sum/n)) where m = batteries.length  Space: O(1)
 *
 * Observation: if we can run for time t, then for each battery we use
 * min(b, t) minutes. Total capacity = sum(min(b_i, t)).
 * Feasible iff total capacity >= n * t.
 *
 * Monotone: if feasible at t, not necessarily at t+1 (capacity grows slower).
 * Upper bound: sum(batteries) / n (perfect distribution).
 */
function maxRunTime(n: number, batteries: number[]): number {
  const canRun = (t: number): boolean => {
    let pool = 0;
    for (const b of batteries) {
      pool += Math.min(b, t);
      // Early exit not possible without tracking overflow carefully
    }
    return pool >= n * t;
  };

  let lo = 1;
  let hi = Math.floor(batteries.reduce((s, b) => s + b, 0) / n);

  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2); // upper mid to avoid infinite loop
    if (canRun(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Solution 3: Greedy with sorted batteries
 * Time: O(m log m)  Space: O(1)
 *
 * Sort batteries descending. For the largest battery:
 * - If battery[0] >= total_others / (n-1): each of n computers can use one large
 *   battery exclusively for battery[0] minutes, rest share remaining.
 *   Answer = battery[0] if battery[0] <= sum_rest/(n-1), else recurse.
 * Equivalent to binary search but with greedy insight for large batteries.
 */
function maxRunTimeGreedy(n: number, batteries: number[]): number {
  batteries.sort((a, b) => b - a);
  let sum = batteries.reduce((s, b) => s + b, 0);

  for (const b of batteries) {
    if (b >= Math.floor(sum / n)) {
      // This battery can power one computer exclusively
      sum -= b;
      n--;
    } else {
      // Remaining batteries: binary search answer = sum / n
      return Math.floor(sum / n);
    }
  }
  return Math.floor(sum / n);
}

// === Tests ===
console.log(maxRunTime(2, [3, 3, 3])); // 4
console.log(maxRunTime(2, [1, 1, 1, 1])); // 2
console.log(maxRunTime(3, [10, 10, 3, 5])); // 8
console.log(maxRunTimeGreedy(2, [3, 3, 3])); // 4
console.log(maxRunTimeGreedy(3, [10, 10, 3, 5])); // 8
console.log(maxRunTimeBrute(2, [3, 3, 3])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Relationship                            |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [2141. Maximum Running Time of N Computers](https://leetcode.com/problems/maximum-running-time-of-n-computers)             | This problem                            |
| [2594. Minimum Time to Repair Cars](https://leetcode.com/problems/minimum-time-to-repair-cars)                             | Binary search on time, parallel workers |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                              | Binary search on rate                   |
| [1482. Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets) | Binary search on day count              |
| [1648. Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls)         | Greedy + binary search on value         |
