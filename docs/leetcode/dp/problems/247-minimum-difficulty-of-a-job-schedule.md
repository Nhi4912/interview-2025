---
layout: page
title: "Minimum Difficulty of a Job Schedule"
difficulty: Hard
category: DP
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule"
---

# Minimum Difficulty of a Job Schedule / Độ Khó Tối Thiểu Của Lịch Làm Việc

> **Track**: DP | **Difficulty**: 🔴 Hard | **Pattern**: Interval DP / Partition DP
> **Frequency**: 📗 Tier 1 — Gặp ở Amazon, Google
> **See also**: [Burst Balloons](https://leetcode.com/problems/burst-balloons) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một danh sách công việc cần làm theo thứ tự trong d ngày. Mỗi ngày bạn phải làm ít nhất 1 việc, và độ khó của một ngày là độ khó cao nhất trong các việc bạn làm hôm đó. Mục tiêu: phân chia công việc vào d ngày sao cho tổng độ khó tối thiểu. Giống như lập lịch thi đấu thể thao: bạn phải xếp các trận đấu (có độ khắc nghiệt khác nhau) vào d vòng — mỗi vòng ít nhất một trận — sao cho tổng sức ép thấp nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Difficulty of a Job Schedule example:**

```
jobDifficulty = [6,5,4,3,2,1], d = 2

dp[day][i] = min difficulty for days 1..day using first i jobs

day 1: must do jobs 0..i-1 (at least day jobs remain for later)
day 2: finish remaining jobs

Optimal split: day1=[6,5,4,3,2], day2=[1]
  day1 max = 6, day2 max = 1, total = 7

Or: day1=[6,5,4,3,2,1 skip day2 must get 1+]...
Actually day1=[6], day2=[5,4,3,2,1]: 6+5=11
day1=[6,5,4,3,2], day2=[1]: 6+1=7  ← optimal

dp[2][6] = 7
```

---

## Problem Description

Given `jobDifficulty[i]` (difficulty of job `i`, must be done in order) and `d` days (at least 1 job/day), return the **minimum sum of daily difficulties**. Each day's difficulty = max job difficulty that day. Return `-1` if impossible.

**Example 1:** `jobDifficulty = [6,5,4,3,2,1]`, `d = 2` → `7`

**Example 2:** `jobDifficulty = [9,9,9]`, `d = 4` → `-1` (not enough jobs)

**Example 3:** `jobDifficulty = [1,1,1]`, `d = 3` → `3`

**Constraints:** `1 ≤ jobDifficulty.length ≤ 300`, `0 ≤ jobDifficulty[i] ≤ 1000`, `1 ≤ d ≤ 10`

---

## 📝 Interview Tips

- **Infeasible check** / Kiểm tra bất khả thi: Nếu `n < d` → `-1` (không đủ việc cho mỗi ngày)
- **dp[day][i]** / Định nghĩa: Chi phí tối thiểu dùng `day` ngày để hoàn thành `i` công việc đầu
- **Precompute suffix max** / Tính trước suffix max: Giúp tính max(jobs[j..i]) trong O(1)
- **Monotone stack** / Stack đơn điệu: Tối ưu transition từ O(n²) xuống O(n) mỗi ngày
- **d ≤ 10** / d nhỏ: Chỉ 10 ngày → O(d·n²) = O(10·90000) = O(900k) — OK
- **Base case** / Trường hợp cơ sở: `dp[1][i]` = max(jobs[0..i-1]) — tất cả trong ngày đầu

---

## Solutions

```typescript
/**
 * @complexity Time: O(d·n²) | Space: O(d·n)
 * dp[k][i] = min difficulty using k days for first i jobs
 */
function minDifficulty(jobDifficulty: number[], d: number): number {
  const n = jobDifficulty.length;
  if (n < d) return -1;

  const INF = Infinity;
  // dp[k][i] = min total difficulty: k days, first i jobs done
  const dp: number[][] = Array.from({ length: d + 1 }, () => new Array(n + 1).fill(INF));
  dp[0][0] = 0;

  for (let k = 1; k <= d; k++) {
    for (let i = k; i <= n; i++) {
      // last day handles jobs j..i-1
      let maxD = 0;
      for (let j = i; j >= k; j--) {
        maxD = Math.max(maxD, jobDifficulty[j - 1]);
        if (dp[k - 1][j - 1] < INF) {
          dp[k][i] = Math.min(dp[k][i], dp[k - 1][j - 1] + maxD);
        }
      }
    }
  }

  return dp[d][n] === INF ? -1 : dp[d][n];
}

/**
 * @complexity Time: O(d·n) | Space: O(n)
 * Use monotone stack to optimize transition for each day to O(n)
 */
function minDifficultyOptimal(jobDifficulty: number[], d: number): number {
  const n = jobDifficulty.length;
  if (n < d) return -1;

  let prev = new Array(n + 1).fill(Infinity);
  prev[0] = 0;

  for (let k = 1; k <= d; k++) {
    const curr = new Array(n + 1).fill(Infinity);
    // Monotone stack: (index, dp_value)
    const stack: [number, number][] = []; // [job_end_idx, dp_cost]

    for (let i = k; i <= n; i++) {
      const job = jobDifficulty[i - 1];
      // This job could be the hardest of today's batch
      // Start fresh from prev[i-1]
      let val = prev[i - 1] === Infinity ? Infinity : prev[i - 1] + job;

      // Pop stack while top job difficulty <= current job
      // (current job dominates, update their dp values)
      while (stack.length > 0 && jobDifficulty[stack[stack.length - 1][0] - 1] <= job) {
        const [, topVal] = stack.pop()!;
        val = Math.min(val, topVal + job);
      }

      // If stack not empty, current job is in range where top dominates
      if (stack.length > 0) {
        val = Math.min(val, stack[stack.length - 1][1]);
      }

      curr[i] = val;
      stack.push([i, val]);
    }

    prev = curr;
  }

  return prev[n] === Infinity ? -1 : prev[n];
}

// === Test Cases ===
console.log(minDifficulty([6, 5, 4, 3, 2, 1], 2)); // → 7
console.log(minDifficulty([9, 9, 9], 4)); // → -1
console.log(minDifficulty([1, 1, 1], 3)); // → 3
console.log(minDifficulty([7, 1, 7, 1, 7, 1], 3)); // → 15
console.log(minDifficultyOptimal([6, 5, 4, 3, 2, 1], 2)); // → 7
```

---

## 🔗 Related Problems

| Problem                 | Difficulty | Link                                                            |
| ----------------------- | ---------- | --------------------------------------------------------------- |
| Split Array Largest Sum | Hard       | [LC 410](https://leetcode.com/problems/split-array-largest-sum) |
| Burst Balloons          | Hard       | [LC 312](https://leetcode.com/problems/burst-balloons)          |
| Painting the Walls      | Hard       | [LC 2742](https://leetcode.com/problems/painting-the-walls)     |
