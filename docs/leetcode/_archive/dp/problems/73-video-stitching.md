---
layout: page
title: "Video Stitching"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/video-stitching"
---

# Video Stitching / Ghép Video

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Jump Game variant)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhảy cóc (Jump Game II) — bạn muốn đến đích `time` bằng ít bước nhất. Mỗi clip `[start, end]` là một bước nhảy từ `start` đến `end`. Chiến lược tham lam: ở mỗi vị trí hiện tại, chọn clip bắt đầu ≤ hiện tại nhưng kết thúc xa nhất.

**Pattern Recognition:**

- Greedy: tương tự Jump Game II
- Tại mỗi "bước", từ vị trí hiện tại, tìm clip bắt đầu ≤ curEnd mà có end xa nhất
- Key insight: luôn chọn clip cho phép "nhảy xa nhất" để tối thiểu số clip

**Visual — Greedy Interval Cover:**

```
clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time=10

maxReach[i] = max end of clips starting at i
  0→2, 1→9, 2→2, 4→6, 5→9, 8→10

curEnd=0, farthest=0, clips=0

i=0: 0<=curEnd=0 → farthest=max(0,maxReach[0])=2
→ i==curEnd → take clip, clips=1, curEnd=farthest=2

i=1: 1<=2 → farthest=max(2,maxReach[1])=9
i=2: 2<=2 → farthest=max(9,maxReach[2])=9
→ i==curEnd → take clip, clips=2, curEnd=9

i=..9 → reach time=10? farthest=10
→ clips=3 ✓
```

---

## Problem Description

You have a series of video clips from `[0, time]`. Each clip `clips[i] = [start_i, end_i]` covers the interval. Find the minimum number of clips needed to cover exactly `[0, time]`. Return `-1` if impossible. ([LeetCode #1024](https://leetcode.com/problems/video-stitching))

**Example 1:** `clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10` → `3`
**Example 2:** `clips = [[0,1],[1,2]], time = 5` → `-1`

Constraints: `1 <= clips.length <= 100`, `0 <= start_i <= end_i <= 100`, `1 <= time <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Cần cover liên tục từ 0 đến time, không có khoảng trống / Must cover [0,time] continuously"
2. **Jump Game link**: "Đây là Jump Game II với intervals / This IS Jump Game II on intervals"
3. **Greedy key**: "Tại mỗi bước, chọn clip mở rộng xa nhất / Always extend farthest reach at each step"
4. **Preprocess**: "maxReach[i] = max end của tất cả clip bắt đầu tại i → O(n) lookup / Preprocess to O(1) reach lookup"
5. **DP alt**: "dp[i] = min clips để cover [0,i] / DP approach also works in O(time\*n)"
6. **Edge cases**: "Nếu có khoảng trống (farthest không tiến được) → -1 / Return -1 if stuck"

---

## Solutions

```typescript
/**
 * Solution 1: Greedy (Jump Game II style)
 * Time: O(n + time) — preprocess + single pass over [0..time]
 * Space: O(time) — maxReach array
 */
function videoStitching(clips: number[][], time: number): number {
  // maxReach[i] = farthest we can reach starting a clip at position i
  const maxReach = new Array(time + 1).fill(0);
  for (const [start, end] of clips) {
    if (start <= time) {
      maxReach[start] = Math.max(maxReach[start], end);
    }
  }

  let count = 0;
  let curEnd = 0; // current coverage endpoint
  let farthest = 0; // farthest we can reach from any clip starting in [0..curEnd]

  for (let i = 0; i <= time; i++) {
    if (i > farthest) return -1; // gap: can't cover position i
    farthest = Math.max(farthest, maxReach[i]);
    if (i === curEnd && i < time) {
      // Must take a new clip to extend past curEnd
      count++;
      curEnd = farthest;
      if (curEnd >= time) return count;
    }
  }
  return curEnd >= time ? count : -1;
}

/**
 * Solution 2: DP
 * Time: O(n * time) — for each endpoint, try all clips
 * Space: O(time) — dp array
 *
 * dp[i] = min clips to cover [0, i]
 */
function videoStitchingDP(clips: number[][], time: number): number {
  const INF = time + 1;
  const dp = new Array(time + 1).fill(INF);
  dp[0] = 0;

  for (let i = 1; i <= time; i++) {
    for (const [start, end] of clips) {
      if (start < i && end >= i) {
        // Clip covers some prefix ending at i
        dp[i] = Math.min(dp[i], dp[start] + 1);
      }
    }
  }
  return dp[time] === INF ? -1 : dp[time];
}

// === Test Cases ===
console.log(
  videoStitching(
    [
      [0, 2],
      [4, 6],
      [8, 10],
      [1, 9],
      [1, 5],
      [5, 9],
    ],
    10,
  ),
); // 3
console.log(
  videoStitching(
    [
      [0, 1],
      [1, 2],
    ],
    5,
  ),
); // -1
console.log(
  videoStitching(
    [
      [0, 1],
      [6, 8],
      [0, 2],
      [5, 6],
      [0, 4],
      [0, 3],
      [6, 7],
      [1, 3],
      [4, 7],
      [1, 4],
      [2, 5],
      [2, 6],
      [3, 4],
      [4, 5],
      [5, 7],
      [6, 9],
    ],
    9,
  ),
); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                                         | Greedy             | Medium     |
| [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) | Greedy / DP        | Hard       |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                                               | Greedy             | Medium     |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                                   | DP + Binary Search | Hard       |
