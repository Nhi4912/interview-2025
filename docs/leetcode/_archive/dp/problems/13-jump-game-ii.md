---
layout: page
title: "Jump Game II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/jump-game-ii"
---

# Jump Game II / Trò Chơi Nhảy II — Số Bước Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS-like Greedy (Level tracking)
> **Frequency**: ⭐ Tier 2 — Gặp ở 30+ companies
> **See also**: [Jump Game](https://leetcode.com/problems/jump-game) | [Jump Game III](https://leetcode.com/problems/jump-game-iii)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn chơi game nhảy qua các tảng đá. Mỗi "lượt nhảy" bạn chọn nhảy xa nhất có thể từ các đá trong tầm với. Giống như BFS theo từng level — level = số bước nhảy. Bạn không biết sẽ nhảy đến đá nào, nhưng luôn track "xa nhất có thể đến trong bước này".

- **Pattern Recognition:**
  - Signal: "minimum jumps" + "greedy optimal" → **BFS-level greedy**
  - Track: `curEnd` (cuối level hiện tại), `farthest` (xa nhất có thể trong level này)
  - Khi đến `curEnd`: increment jumps, `curEnd = farthest`
  - Không cần simulate chính xác nhảy đến đâu — chỉ cần biết farthest

- **Visual — nums = [2, 3, 1, 1, 4]:**

```
Index:   0  1  2  3  4
nums:   [2, 3, 1, 1, 4]

jumps=0, curEnd=0, farthest=0

i=0: farthest = max(0, 0+2) = 2
     i==curEnd(0) → jumps=1, curEnd=2

i=1: farthest = max(2, 1+3) = 4
i=2: farthest = max(4, 2+1) = 4
     i==curEnd(2) → jumps=2, curEnd=4

i=3: farthest = max(4, 3+1) = 4
i=4: i >= n-1 (reached end) → DONE

Answer: 2 jumps ✓ (0→1→4 or 0→2→4)
```

---

## Problem Description

Given an array `nums` where `nums[i]` is the max jump length from index `i`, return the **minimum number of jumps** to reach the last index.
It is guaranteed you can always reach the last index.

```
Input:  [2,3,1,1,4]  → 2  (jump from 0→1→4)
Input:  [2,3,0,1,4]  → 2  (jump from 0→1→4)
Input:  [1,2,3]      → 2  (0→1→2 or 0→2)
Input:  [0]          → 0  (already at last)
```

Constraints: `1 ≤ nums.length ≤ 10^4`, `0 ≤ nums[i] ≤ 1000`, always reachable.

---

## 📝 Interview Tips

1. **Greedy > DP ở đây**: DP O(n²) works but greedy O(n) is optimal / **Greedy wins**: O(n) vs O(n²) DP — greedy is the expected answer
2. **BFS mental model**: `curEnd` = end of current BFS level; reaching it → increment jump counter / **Think BFS levels**: each jump = one BFS level
3. **Không cần track chính xác path**: Chỉ cần farthest reachable / **No path needed**: just track farthest, not which index to jump to
4. **Dừng trước index cuối**: Không cần xử lý index `n-1` (đích đến, không cần nhảy từ đó) / **Stop before last**: don't need to process last index (already arrived)
5. **DP O(n²)**: `dp[i] = min(dp[j] + 1)` for all j reachable to i — mention as brute before optimizing / **DP brute**: valid for small n, but O(n²) TLE for large

---

## Solutions

```typescript
/**
 * Solution 1: DP (Brute Force O(n²))
 * Time: O(n²) | Space: O(n)
 */
function jumpDP(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (j + nums[j] >= i && dp[j] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }
  return dp[n - 1];
}

/**
 * Solution 2: Greedy BFS-Level (Optimal)
 * Time: O(n) | Space: O(1)
 */
function jump(nums: number[]): number {
  const n = nums.length;
  if (n <= 1) return 0;

  let jumps = 0;
  let curEnd = 0; // end of current BFS level
  let farthest = 0; // farthest reachable in next jump

  for (let i = 0; i < n - 1; i++) {
    // stop before last index
    farthest = Math.max(farthest, i + nums[i]);

    if (i === curEnd) {
      // current level exhausted
      jumps++;
      curEnd = farthest;
      if (curEnd >= n - 1) break; // reached or passed end
    }
  }
  return jumps;
}

// === Test Cases ===
console.log(jump([2, 3, 1, 1, 4])); // 2
console.log(jump([2, 3, 0, 1, 4])); // 2
console.log(jump([1, 2, 3])); // 2
console.log(jump([0])); // 0
console.log(jump([1, 1, 1, 1])); // 3
console.log(jump([5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Jump Game](https://leetcode.com/problems/jump-game)                                                                               | Simpler version: can you reach end? (boolean, not min jumps) |
| [Jump Game III](https://leetcode.com/problems/jump-game-iii)                                                                       | Jump ±nums[i] to reach 0 — BFS/DFS variant                   |
| [Jump Game VII](https://leetcode.com/problems/jump-game-vii)                                                                       | Range-constrained jumps on binary string                     |
| [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) | Same greedy interval coverage pattern                        |
