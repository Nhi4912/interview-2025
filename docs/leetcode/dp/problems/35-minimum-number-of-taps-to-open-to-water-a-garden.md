---
layout: page
title: "Minimum Number of Taps to Open to Water a Garden"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden"
---

# Minimum Number of Taps to Open to Water a Garden / Số Vòi Nước Tối Thiểu Để Tưới Vườn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP / Greedy (Interval Cover)
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Video Stitching](https://leetcode.com/problems/video-stitching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một dải đất dài từ 0 đến n mét, với các vòi nước đặt ở các vị trí khác nhau, mỗi vòi phun nước ra một đoạn nhất định sang hai bên. Bạn muốn tưới toàn bộ dải đất bằng ít vòi nhất. Đây chính là bài toán "bao phủ đoạn thẳng" — giống như đèn đường: dùng ít đèn nhất để chiếu sáng toàn bộ con đường.

**Pattern Recognition:**

- Signal: "cover [0,n] with minimum intervals" → **Greedy Interval Cover / Jump Game variant**
- Transform: tap i with range r[i] → interval [i-r[i], i+r[i]]
- Key insight: dp[i] = min taps to water [0..i]; or greedy jump-game style

**Visual — n=5, ranges=[3,4,1,1,0,0]:**

```
Taps (position: coverage):
  Tap 0: range 3 → covers [-3, 3] → effective [0, 3]
  Tap 1: range 4 → covers [-3, 5] → effective [0, 5]  ← covers all!
  Tap 2: range 1 → covers [1, 3]
  Tap 3: range 1 → covers [2, 4]
  Tap 4: range 0 → covers [4, 4]
  Tap 5: range 0 → covers [5, 5]

Transform to maxReach[i] = farthest right any tap covering position i can reach:
  maxReach[0] = max(3, 5) = 5
  maxReach[1] = 5
  maxReach[2] = max(3, 4) = 4
  ...

Greedy (like Jump Game II):
  Start: covered=0, nextCovered=maxReach[0]=5 → open 1 tap
  covered=5 ≥ n=5 → done! Answer: 1
```

---

## Problem Description

There is a garden of length `n` (positions 0 to n). Each tap `i` has range `ranges[i]`, watering `[i-ranges[i], i+ranges[i]]`. Find the minimum taps needed to water the entire garden, or -1 if impossible. ([LeetCode 1326](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden))

Difficulty: Hard | Acceptance: 50.7%

- **Example 1**: n=5, ranges=[3,4,1,1,0,0] → **1** (tap 1 covers [-3,5] → [0,5])
- **Example 2**: n=3, ranges=[0,0,0,0] → **-1** (no tap has any range)

Constraints:

- `1 <= n <= 10^4`
- `ranges.length == n + 1`
- `0 <= ranges[i] <= 100`

---

## 📝 Interview Tips

1. **Reduce**: "Bài này = Video Stitching / Jump Game II sau khi transform" / Reduce to interval cover
2. **Transform**: "Tạo maxReach[i] = farthest right tap covering position i can water" / Preprocess ranges
3. **Greedy**: "Tại mỗi vị trí, chọn vòi phun xa nhất trong tầm hiện tại" / Greedy: pick farthest-reaching tap
4. **DP approach**: "dp[i] = min taps to fully cover [0..i]" / DP alternative: O(n²)
5. **Impossible**: "Nếu có khoảng không vòi nào phủ → return -1" / Gap in coverage → -1
6. **Edge cases**: "ranges toàn 0 → -1 trừ n=0; n=0 → 0 taps" / Zero ranges and n=0

---

## Solutions

```typescript
/**
 * Solution 1: DP approach
 * Time: O(n × max_range) — for each position, check all taps covering it
 * Space: O(n) — dp array
 */
function minTapsDP(n: number, ranges: number[]): number {
  // dp[i] = min taps to water garden [0..i]
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i <= n; i++) {
    const left = Math.max(0, i - ranges[i]);
    const right = Math.min(n, i + ranges[i]);
    // Tap i can cover [left, right]
    // For any position left..right, we can reach right using dp[left] taps + 1
    for (let j = left; j <= right; j++) {
      if (dp[left] !== Infinity) {
        dp[right] = Math.min(dp[right], dp[left] + 1);
      }
    }
  }

  return dp[n] === Infinity ? -1 : dp[n];
}

/**
 * Solution 2: Greedy (Jump Game II style) — Optimal
 * Time: O(n) — single pass after O(n) preprocessing
 * Space: O(n) — maxReach array
 */
function minTaps(n: number, ranges: number[]): number {
  // maxReach[i] = the farthest right any tap whose left boundary ≤ i can reach
  // i.e., for tap j with range r, it covers [j-r, j+r]
  // So for left endpoint (j-r), the right reachable point is (j+r)
  const maxReach = new Array(n + 1).fill(0);

  for (let i = 0; i <= n; i++) {
    const left = Math.max(0, i - ranges[i]);
    const right = Math.min(n, i + ranges[i]);
    maxReach[left] = Math.max(maxReach[left], right);
  }

  // Greedy: like Jump Game II
  let taps = 0;
  let covered = 0; // current coverage boundary
  let nextCover = 0; // farthest we can reach with one more tap

  for (let i = 0; i <= n; i++) {
    if (i > nextCover) return -1; // gap: position i unreachable
    nextCover = Math.max(nextCover, maxReach[i]);
    if (i === covered && i < n) {
      // Need to open a new tap to extend coverage
      taps++;
      covered = nextCover;
    }
  }

  return taps;
}

// === Test Cases ===
console.log(minTaps(5, [3, 4, 1, 1, 0, 0])); // 1
console.log(minTaps(3, [0, 0, 0, 0])); // -1
console.log(minTaps(7, [1, 2, 1, 0, 2, 1, 0, 1])); // 3
console.log(minTaps(1, [0, 0])); // -1
console.log(minTaps(0, [0])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                              | Difficulty | Pattern                    |
| ---------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                           | 🟡 Medium  | Greedy interval cover      |
| [Video Stitching](https://leetcode.com/problems/video-stitching)                                     | 🟡 Medium  | Greedy interval cover      |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                 | 🟡 Medium  | Greedy interval scheduling |
| [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops) | 🔴 Hard    | Greedy + heap              |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                     | 🔴 Hard    | Binary Search              |
