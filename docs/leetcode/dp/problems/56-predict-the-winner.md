---
layout: page
title: "Predict the Winner"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Recursion, Game Theory]
leetcode_url: "https://leetcode.com/problems/predict-the-winner"
---

# Predict the Winner / Dự Đoán Người Chiến Thắng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Game Theory / Interval DP)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Stone Game](https://leetcode.com/problems/stone-game) | [Stone Game VII](https://leetcode.com/problems/stone-game-vii)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Hai người chơi bốc tiền từ hai đầu dãy — người nào cũng chơi tối ưu. Thay vì theo dõi điểm từng người riêng lẻ, ta chỉ theo dõi **chênh lệch điểm** (current_player - opponent). Người hiện tại muốn maximize chênh lệch, người kia muốn minimize.

**Pattern Recognition:**

- Signal: "two players, pick from ends, both play optimally" → **Game Theory DP / Minimax**
- dp[i][j] = max score advantage người đang chơi có thể đạt được trên dải nums[i..j]
- Key insight: nếu dp[0][n-1] >= 0 → Player 1 thắng hoặc hòa

**Visual — nums = [1, 5, 2]:**

```
Base: dp[i][i] = nums[i]  (chỉ 1 lựa chọn)

len=2:
  dp[0][1] = max(nums[0]-dp[1][1], nums[1]-dp[0][0]) = max(1-5, 5-1) = 4
  dp[1][2] = max(nums[1]-dp[2][2], nums[2]-dp[1][1]) = max(5-2, 2-5) = 3

len=3:
  dp[0][2] = max(nums[0]-dp[1][2], nums[2]-dp[0][1]) = max(1-3, 2-4) = -2

dp[0][2] = -2 < 0 → Player 1 loses → return false
```

---

## Problem Description

Two players take turns picking a number from either end of `nums`. The player with higher score wins (ties go to Player 1). Given both play optimally, return `true` if Player 1 can win or tie.

- Example 1: `nums = [1, 5, 2]` → `false` (Player 2 wins with score 6 vs 2)
- Example 2: `nums = [1, 5, 233, 7]` → `true` (Player 1 can guarantee score 236)

Constraints: `1 <= nums.length <= 20`, `0 <= nums[i] <= 10^7`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Cả hai chơi tối ưu — không phải greedy" / Both players play optimally, not just greedily
2. **Key insight**: Theo dõi chênh lệch điểm thay vì điểm tuyệt đối → dp[i][j] là scalar duy nhất
3. **Transition**: `dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])`
4. **Why subtraction?** Khi player chọn nums[i], opponent phải chơi dp[i+1][j] → chênh lệch = nums[i] - dp[i+1][j]
5. **Fill order**: Cần len nhỏ trước len lớn (diagonal fill) — duyệt theo len từ 1 đến n
6. **Math shortcut** (for odd-length arrays): Player 1 luôn thắng — nhưng không cần nhớ, code DP là chắc

---

## Solutions

```typescript
/**
 * Solution 1: Top-down Memoization (Recursive)
 * Time: O(n²) — n² states, O(1) per state
 * Space: O(n²) — memo + recursion stack
 */
function predictTheWinnerMemo(nums: number[]): boolean {
  const memo: Map<string, number> = new Map();

  function maxDiff(l: number, r: number): number {
    if (l > r) return 0;
    if (l === r) return nums[l];
    const key = `${l},${r}`;
    if (memo.has(key)) return memo.get(key)!;
    // Pick left end or right end; subtract opponent's best play
    const res = Math.max(nums[l] - maxDiff(l + 1, r), nums[r] - maxDiff(l, r - 1));
    memo.set(key, res);
    return res;
  }

  return maxDiff(0, nums.length - 1) >= 0;
}

/**
 * Solution 2: Bottom-up Interval DP (Optimal)
 * Time: O(n²) — fill n² entries in the dp table
 * Space: O(n²) — 2D dp table (can optimize to O(n) with rolling)
 */
function predictTheWinner(nums: number[]): boolean {
  const n = nums.length;
  // dp[i][j] = max score difference (current player - opponent) for nums[i..j]
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Base case: single element
  for (let i = 0; i < n; i++) dp[i][i] = nums[i];

  // Fill diagonally: increasing subarray length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Math.max(
        nums[i] - dp[i + 1][j], // pick left, opponent faces [i+1..j]
        nums[j] - dp[i][j - 1], // pick right, opponent faces [i..j-1]
      );
    }
  }

  // Player 1 wins or ties if their advantage over the full array >= 0
  return dp[0][n - 1] >= 0;
}

// === Test Cases ===
console.log(predictTheWinner([1, 5, 2])); // false
console.log(predictTheWinner([1, 5, 233, 7])); // true
console.log(predictTheWinner([1])); // true (Player 1 takes the only number)
console.log(predictTheWinner([1, 3, 1])); // false (P1=1+1=2, P2=3 → false)
```

---

## 🔗 Related Problems

- [Stone Game](https://leetcode.com/problems/stone-game) — same problem, always returns true (math insight)
- [Stone Game VII](https://leetcode.com/problems/stone-game-vii) — variant with sum-minus-element scoring
- [Stone Game VIII](https://leetcode.com/problems/stone-game-viii) — harder game DP with prefix sums
- [Can I Win](https://leetcode.com/problems/can-i-win) — game theory DP with bitmask state
- [Nim Game](https://leetcode.com/problems/nim-game) — classic game theory with math shortcut
