---
layout: page
title: "Most Profit Assigning Work"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/most-profit-assigning-work"
---

# Most Profit Assigning Work / Phân Công Việc Lợi Nhuận Tối Đa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers / Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) | [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tuyển dụng — mỗi nhân viên có năng lực `w`, chỉ nhận việc có độ khó ≤ w, muốn lương cao nhất có thể. Sort công việc theo độ khó, sort nhân viên theo năng lực, duyệt song song — với mỗi nhân viên, biết được tất cả việc họ làm được và chọn lương cao nhất (running max).

**Pattern Recognition:**

- Signal: "worker ability ≥ job difficulty → earn profit; maximize total" → **Sort + Two Pointers + Running Max**
- Sort jobs by difficulty, workers by ability; sweep both with pointer
- Key insight: maintain running max profit as job pointer advances

**Visual — difficulty=[2,4,6,8,10], profit=[10,20,30,40,50], workers=[4,5,6,7]:**

```
Jobs sorted by diff: (2,10),(4,20),(6,30),(8,40),(10,50)
Workers sorted:      4, 5, 6, 7

worker=4: advance job ptr while diff≤4 → maxProfit=max(10,20)=20 → earn 20
worker=5: no new jobs (diff=6>5) → maxProfit=20 → earn 20
worker=6: advance → maxProfit=max(20,30)=30 → earn 30
worker=7: no new jobs (diff=8>7) → maxProfit=30 → earn 30
Total = 20+20+30+30 = 100
```

---

## Problem Description

Given `difficulty[]`, `profit[]` (job i has difficulty[i] and earns profit[i]), and `worker[]` (ability of each worker). Each worker can do **one** job with difficulty ≤ their ability, earning that job's profit (or 0 if no such job). Return **maximum total profit**. ([LeetCode 826](https://leetcode.com/problems/most-profit-assigning-work))

Difficulty: Medium | Acceptance: 55.9%

```
Example 1: difficulty=[2,4,6,8,10], profit=[10,20,30,40,50], workers=[4,5,6,7]  → 100
Example 2: difficulty=[85,47,57], profit=[24,66,99], workers=[40,25,25]  → 0
  (all workers have ability < all job difficulties)
```

Constraints: `1 ≤ n ≤ 10^4`, `1 ≤ workers.length ≤ 10^4`, `1 ≤ difficulty, profit, workers[i] ≤ 10^5`

---

## 📝 Interview Tips

1. **Sort both / Sort cả hai**: "Sort jobs by difficulty ASC, workers by ability ASC"
2. **Running max / Max tích lũy**: "Một worker với ability cao hơn có thể làm mọi việc worker kém hơn làm được → chỉ cần running max profit"
3. **Multiple workers same ability / Cùng năng lực**: "Nhiều worker cùng ability → tất cả lấy cùng max profit"
4. **Worker can do 0 jobs / Không làm được**: "Nếu tất cả jobs khó hơn worker → profit = 0"
5. **Binary search alternative / Phương án binary search**: Thay vì two pointers, binary search vị trí trong jobs sorted → O(n log m) thay vì O(n+m)
6. **Complexity / Độ phức tạp**: O((n+m) log(n+m)) for sort + O(n+m) for sweep = O((n+m) log(n+m))

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — for each worker, scan all jobs
 * Time: O(n * m)  Space: O(1)
 */
function maxProfitAssignmentBrute(
  difficulty: number[],
  profit: number[],
  workers: number[],
): number {
  let total = 0;
  for (const w of workers) {
    let best = 0;
    for (let i = 0; i < difficulty.length; i++) {
      if (difficulty[i] <= w) best = Math.max(best, profit[i]);
    }
    total += best;
  }
  return total;
}

/**
 * Solution 2: Sort + Two Pointers + Running Max (Optimal)
 * Time: O((n+m) log(n+m))  Space: O(n)
 *
 * 1. Create (difficulty, profit) pairs, sort by difficulty.
 * 2. Sort workers by ability.
 * 3. Sweep workers in ascending order; advance job pointer while job.diff <= worker.ability.
 * 4. Track running max profit. Each worker earns runningMax.
 */
function maxProfitAssignment(difficulty: number[], profit: number[], workers: number[]): number {
  const n = difficulty.length;
  // Create and sort jobs by difficulty
  const jobs: [number, number][] = difficulty.map((d, i) => [d, profit[i]]);
  jobs.sort((a, b) => a[0] - b[0]);
  workers.sort((a, b) => a - b);

  let total = 0,
    maxProfit = 0,
    j = 0;
  for (const w of workers) {
    // Advance job pointer: take all jobs doable by this worker
    while (j < n && jobs[j][0] <= w) {
      maxProfit = Math.max(maxProfit, jobs[j][1]);
      j++;
    }
    total += maxProfit;
  }
  return total;
}

/**
 * Solution 3: Sort + Binary Search
 * Time: O(n log n + m log n)  Space: O(n)
 *
 * Preprocess jobs: create sorted array of (difficulty, maxProfit)
 * where maxProfit[i] = max profit for difficulty ≤ sortedDiff[i].
 * For each worker: binary search max difficulty ≤ ability, look up maxProfit.
 */
function maxProfitAssignmentBS(difficulty: number[], profit: number[], workers: number[]): number {
  const n = difficulty.length;
  const jobs: [number, number][] = difficulty.map((d, i) => [d, profit[i]]);
  jobs.sort((a, b) => a[0] - b[0]);

  // Build prefix max profit array
  const diffs = jobs.map((j) => j[0]);
  const maxProfits = new Array(n).fill(0);
  maxProfits[0] = jobs[0][1];
  for (let i = 1; i < n; i++) maxProfits[i] = Math.max(maxProfits[i - 1], jobs[i][1]);

  let total = 0;
  for (const w of workers) {
    // Binary search: last job with difficulty <= w
    let lo = 0,
      hi = n - 1,
      best = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (diffs[mid] <= w) {
        best = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (best >= 0) total += maxProfits[best];
  }
  return total;
}

// === Tests ===
console.log(maxProfitAssignment([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7])); // 100
console.log(maxProfitAssignment([85, 47, 57], [24, 66, 99], [40, 25, 25])); // 0
console.log(maxProfitAssignment([68, 35, 52, 47, 86], [67, 17, 1, 81, 3], [92, 10, 85, 84, 82])); // 324
console.log(maxProfitAssignmentBrute([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7])); // 100
console.log(maxProfitAssignmentBS([2, 4, 6, 8, 10], [10, 20, 30, 40, 50], [4, 5, 6, 7])); // 100
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Relationship                      |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [826. Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work)                                | This problem                      |
| [2300. Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions)       | Sort + binary search on threshold |
| [1099. Two Sum Less Than K](https://leetcode.com/problems/two-sum-less-than-k)                                             | Sort + two pointers               |
| [1648. Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls)         | Greedy + sorted selection         |
| [2410. Maximum Matching of Players With Trainers](https://leetcode.com/problems/maximum-matching-of-players-with-trainers) | Sort both, two pointers matching  |
