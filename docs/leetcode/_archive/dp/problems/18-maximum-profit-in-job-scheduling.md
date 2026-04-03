---
layout: page
title: "Maximum Profit in Job Scheduling"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling"
---

# Maximum Profit in Job Scheduling / Lợi Nhuận Tối Đa Khi Lập Lịch Công Việc

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies (Google, Uber, Airbnb)
> **See also**: [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes) | [Weighted Job Scheduling](https://www.geeksforgeeks.org/weighted-job-scheduling/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống lập lịch thuê phòng — mỗi booking có giờ vào, giờ ra, giá tiền. Bạn muốn chọn các booking không chồng nhau để thu được tối đa. Sort theo giờ kết thúc, dùng DP để chọn hoặc bỏ từng booking.

**Pattern Recognition:**

- Signal: "chọn tập các interval không chồng nhau tối đa lợi nhuận" → **Interval DP + Binary Search**
- Sau sort theo endTime: dp[i] = max profit dùng i jobs đầu tiên
- Take job i: `dp[i] = dp[latestNonConflict] + profit[i]` — binary search để tìm nhanh

**Visual — startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]:**

```
Sorted by end: [{1,3,50}, {2,4,10}, {3,5,40}, {3,6,70}]

dp[0]=0
dp[1]: take job1(s=1,e=3,p=50): latest non-conflict=dp[0]=0 → dp[0]+50=50
       dp[1] = max(dp[0]=0, 50) = 50
dp[2]: take job2(s=2,e=4,p=10): jobs[0].e=3>2 → non-conflict=dp[0]=0 → 0+10=10
       dp[2] = max(dp[1]=50, 10) = 50
dp[3]: take job3(s=3,e=5,p=40): jobs[0].e=3<=3 → non-conflict=dp[1]=50 → 50+40=90
       dp[3] = max(dp[2]=50, 90) = 90
dp[4]: take job4(s=3,e=6,p=70): same → non-conflict=dp[1]=50 → 50+70=120
       dp[4] = max(dp[3]=90, 120) = 120 ✅
```

---

## Problem Description

Given `n` jobs each with `startTime[i]`, `endTime[i]`, and `profit[i]`, find the maximum total profit from a subset of non-overlapping jobs. Jobs `[i, j]` conflict if `i.startTime < j.endTime` and `j.startTime < i.endTime`.

```
Example 1: start=[1,2,3,3], end=[3,4,5,6], profit=[50,10,40,70]  → 120
Example 2: start=[1,2,3,4,6], end=[3,5,10,6,9], profit=[20,20,100,70,60] → 150
```

Constraints: `1 <= n <= 5×10^4`, `1 <= startTime[i] < endTime[i] <= 10^9`, `1 <= profit[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Công việc overlap khi nào?" / Confirm jobs conflict if they share any time.
2. **Sort by end time**: Cho phép DP tiến dần — mỗi job mới chỉ phụ thuộc các job đã xét.
3. **Binary search**: Tìm latest non-conflicting job trong O(log n) thay vì O(n) linear.
4. **State**: `dp[i]` = max profit dùng i jobs đầu tiên (sorted by end) — skip hoặc take job i.
5. **Transition**: `dp[i] = max(dp[i-1], dp[j] + profit[i-1])` với j = latestNonConflict(i).
6. **Edge**: 1 job → return profit[0]; tất cả overlap → return max single profit.

---

## Solutions

```typescript
/**
 * Solution 1: DP with Linear Search (Brute DP)
 * Time: O(n²) — sort O(n log n) + for each job linear scan for non-conflict
 * Space: O(n) — dp array
 */
function jobScheduling1(startTime: number[], endTime: number[], profit: number[]): number {
  const n = startTime.length;
  const jobs = Array.from({ length: n }, (_, i) => [startTime[i], endTime[i], profit[i]]);
  jobs.sort((a, b) => a[1] - b[1]);
  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const [s, , p] = jobs[i - 1];
    dp[i] = dp[i - 1]; // option 1: skip job i
    // Option 2: take job i — find latest j where jobs[j-1].end <= s
    let j = i - 1;
    while (j > 0 && jobs[j - 1][1] > s) j--;
    dp[i] = Math.max(dp[i], dp[j] + p);
  }
  return dp[n];
}

/**
 * Solution 2: DP + Binary Search (optimal)
 * Time: O(n log n) — sort + for each job binary search
 * Space: O(n) — dp array + jobs array
 *
 * dp[i] = max profit considering first i jobs (sorted by endTime).
 * For job i: binary search in jobs[0..i-2].endTime for largest <= jobs[i-1].startTime.
 * Returns index j (0..i-1) where dp[j] is the best base for taking job i.
 */
function jobScheduling(startTime: number[], endTime: number[], profit: number[]): number {
  const n = startTime.length;
  const jobs = Array.from({ length: n }, (_, i) => [startTime[i], endTime[i], profit[i]]);
  jobs.sort((a, b) => a[1] - b[1]);

  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const [s, , p] = jobs[i - 1];
    dp[i] = dp[i - 1]; // skip job i

    // Binary search: find largest j in [0, i-1] where jobs[j-1].endTime <= s
    let lo = 0,
      hi = i - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (jobs[mid - 1][1] <= s) lo = mid;
      else hi = mid - 1;
    }
    dp[i] = Math.max(dp[i], dp[lo] + p);
  }

  return dp[n];
}

// === Test Cases ===
console.log(jobScheduling([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70])); // 120
console.log(jobScheduling([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60])); // 150
console.log(jobScheduling([1, 1, 1], [2, 3, 4], [5, 6, 4])); // 6
console.log(jobScheduling1([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70])); // 120
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                              |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [1235. Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)  | This problem                              |
| [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)                 | Greedy interval scheduling (unweighted)   |
| [354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                       | Sort + DP + binary search — same skeleton |
| [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)       | DP + binary search — O(n log n) pattern   |
| [452. Minimum Number of Arrows](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Greedy interval variant                   |
