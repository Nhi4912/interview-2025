---
layout: page
title: "Best Team With No Conflicts"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/best-team-with-no-conflicts"
---

## ⚽ 1626. Best Team With No Conflicts / Đội Bóng Tốt Nhất Không Xung Đột

**Difficulty:** 🟡 Medium

---

## 🧠 Intuition

**Analogy (Vietnamese):** Bạn chọn cầu thủ vào đội. Quy tắc: không được có xung đột — cầu thủ trẻ hơn không được điểm cao hơn cầu thủ già hơn trong đội (vì cầu thủ già hơn sẽ "tức"). Sắp xếp theo tuổi, sau đó bài toán trở thành: **tìm dãy con điểm tăng** (giống LIS nhưng maximize tổng thay vì độ dài).

```
Sort by (age, score):
ages  = [1, 2, 3, 4, 5]
scores= [4, 5, 6, 5, 4]

dp[i] = max score with player i as the "oldest"
dp[0] = 4
dp[1] = 5  (only player 1)  or  4+5=9  (players 0,1: 4≤5 ✓)  → 9
dp[2] = 6+9=15...
→ Similar to "weighted LIS" / increasing subsequence with max sum
```

---

## 📋 Problem Description

Given `scores[]` and `ages[]` for `n` players. Select a team (subset) to **maximize total score** with no conflicts: a conflict exists if player A is younger than player B but has a higher score. Return max score.

- Example: `scores=[1,3,5,10,15]`, `ages=[1,2,3,4,5]` → **34**
- Example: `scores=[4,5,6,5]`, `ages=[2,1,2,1]` → **16**

---

## 📝 Interview Tips

- 🎯 **Sort by (age ASC, score ASC)**: after sorting, conflict only happens when `scores[j] > scores[i]` for `j < i`
- 🎯 **LIS variant**: dp[i] = max team score ending with player i; `dp[i] = max(dp[j] + score[i])` where `score[j] ≤ score[i]`
- 🎯 **No conflict after sort**: if ages[j] ≤ ages[i] and scores[j] ≤ scores[i], including both is safe
- 🎯 **Base case**: dp[i] = scores[i] (just player i alone)
- 🎯 **Answer**: max(dp[i]) over all i
- 🎯 **Complexity**: O(n²) DP is fine for n ≤ 1000; BIT/segment tree gives O(n log n)

---

## 💡 Solutions

### Solution 1: O(n²) DP (Sort + Weighted LIS)

```typescript
function bestTeamScore(scores: number[], ages: number[]): number {
  const n = scores.length;
  // Create pairs and sort by (age ASC, score ASC)
  const players = scores.map((s, i) => [ages[i], s] as [number, number]);
  players.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  // dp[i] = max team score with players[i] as the last/oldest member
  const dp = players.map((p) => p[1]); // start: just player i alone

  let ans = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // players[j] is younger or same age; add j to team if score[j] ≤ score[i]
      if (players[j][1] <= players[i][1]) {
        dp[i] = Math.max(dp[i], dp[j] + players[i][1]);
      }
    }
    ans = Math.max(ans, dp[i]);
  }

  return ans;
}
```

### Solution 2: Binary Indexed Tree (O(n log n))

```typescript
function bestTeamScoreBIT(scores: number[], ages: number[]): number {
  const n = scores.length;
  const players = scores.map((s, i) => [ages[i], s] as [number, number]);
  players.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  // Coordinate compress scores
  const sortedScores = [...new Set(players.map((p) => p[1]))].sort((a, b) => a - b);
  const rank = new Map(sortedScores.map((s, i) => [s, i + 1]));
  const maxRank = sortedScores.length;

  // BIT for range max query
  const bit = new Array(maxRank + 1).fill(0);

  function update(pos: number, val: number): void {
    for (; pos <= maxRank; pos += pos & -pos) bit[pos] = Math.max(bit[pos], val);
  }
  function query(pos: number): number {
    let res = 0;
    for (; pos > 0; pos -= pos & -pos) res = Math.max(res, bit[pos]);
    return res;
  }

  let ans = 0;
  for (const [, score] of players) {
    const r = rank.get(score)!;
    const best = query(r) + score;
    ans = Math.max(ans, best);
    update(r, best);
  }

  return ans;
}
```

### Solution 3: Concise DP variant

```typescript
function bestTeamScoreConcise(scores: number[], ages: number[]): number {
  const n = scores.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => (ages[a] !== ages[b] ? ages[a] - ages[b] : scores[a] - scores[b]));

  const dp = idx.map((i) => scores[i]);
  let ans = Math.max(...dp);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (scores[idx[j]] <= scores[idx[i]]) {
        dp[i] = Math.max(dp[i], dp[j] + scores[idx[i]]);
      }
    }
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Difficulty | Key Technique      |
| --------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)      | Medium     | LIS / DP           |
| [354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                      | Hard       | LIS 2D             |
| [2008. Maximum Earnings From Taxi](https://leetcode.com/problems/maximum-earnings-from-taxi/)             | Medium     | DP + Sort          |
| [1235. Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) | Hard       | DP + Binary Search |
