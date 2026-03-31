---
layout: page
title: "Stone Game"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Game Theory]
leetcode_url: "https://leetcode.com/problems/stone-game"
---

# Stone Game / Trò Chơi Đá

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Amazon, Facebook

## 🧠 Intuition / Tư Duy

**Analogy:** Như hai người nhặt tiền từ hai đầu hàng — người đi trước (Alex) luôn thắng bằng cách chọn tất cả đống chẵn hoặc tất cả đống lẻ (tổng chắc chắn lớn hơn). Interval DP tổng quát hơn, hoạt động khi không có đảm bảo toán học này.

**Pattern Recognition:**

- "Two players take turns from ends of array, maximize own score" → interval DP
- dp[i][j] = max score difference (current player − opponent) for subarray piles[i..j]
- Current player picks either end; opponent plays optimally on the remaining subarray

**Visual:**

```
piles = [5, 3, 4, 5]
dp[i][j] = score diff for current player in piles[i..j]:
dp[i][i] = piles[i]  (take the only pile)
dp[0][1]=max(5-dp[1][1], 3-dp[0][0])=max(5-3, 3-5)=2  (take 5)
dp[1][2]=max(3-dp[2][2], 4-dp[1][1])=max(3-4, 4-3)=1  (take 4)
dp[2][3]=max(4-dp[3][3], 5-dp[2][2])=max(4-5, 5-4)=1  (take 5)
dp[0][3]=max(5-dp[1][3], 5-dp[0][2]) → dp[0][3]>0 → Alice wins
```

## Problem Description

Alice and Bob take turns (Alice first), each time picking a pile from either end of the row. Return `true` if Alice wins with optimal play. Piles has even length and total stones is odd, so no ties.

Examples: piles=[5,3,4,5] → true; any valid input → always true (Alice always wins).

## 📝 Interview Tips

1. **Clarify**: Số đống luôn chẵn và tổng luôn lẻ → Alice luôn thắng / length is always even + total odd → Alice always wins, but prove it or show DP.
2. **Approach**: Math: Alice takes all even-indexed or all odd-indexed piles (whichever sums more). DP for generality.
3. **Edge cases**: Chỉ 2 đống → người đầu lấy đống lớn → thắng; piles.length = 2 → always true.
4. **Optimize**: Câu trả lời toán học là `return true` — nhưng viết DP cho phỏng vấn / math gives O(1), DP gives O(n²) but shows deeper understanding.
5. **Follow-up**: Stone Game II, III yêu cầu DP thực sự vì không có đảm bảo toán học.
6. **Complexity**: Math O(1), DP O(n²) time and space.

## Solutions

```typescript
/** Solution 1: Math — Alice always wins (O(1))
 * Proof: piles has even length, so Alice can always commit to taking all
 * even-indexed piles or all odd-indexed piles (whichever total is larger).
 * Since total is odd, one group must be strictly larger.
 * Time: O(1) | Space: O(1)
 */
function stoneGame(piles: number[]): boolean {
  return true; // Alice always wins given the constraints
}

/** Solution 2: Interval DP — general minimax
 * dp[i][j] = max score diff (current player - opponent) for piles[i..j]
 * Time: O(n²) | Space: O(n²)
 */
function stoneGameDP(piles: number[]): boolean {
  const n = piles.length;
  // dp[i][j] = best score diff for the player whose turn it is in [i,j]
  const dp: number[][] = Array.from(
    { length: n },
    (_, i) => piles.slice(), // base: dp[i][i] = piles[i], rest will be overwritten
  );
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      // Take left end: score = piles[i] - (opponent's best on [i+1..j])
      // Take right end: score = piles[j] - (opponent's best on [i..j-1])
      dp[i][j] = Math.max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1]);
    }
  }
  return dp[0][n - 1] > 0;
}

/** Solution 3: Space-optimized DP (1D rolling)
 * Time: O(n²) | Space: O(n)
 */
function stoneGameOpt(piles: number[]): boolean {
  const n = piles.length;
  const dp = [...piles]; // dp[i] = best diff for current player with single pile
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i] = Math.max(piles[i] - dp[i + 1], piles[j] - dp[i]);
    }
  }
  return dp[0] > 0;
}

// Tests
console.log(stoneGame([5, 3, 4, 5])); // true
console.log(stoneGameDP([5, 3, 4, 5])); // true
console.log(stoneGameOpt([5, 3, 4, 5])); // true
console.log(stoneGameDP([3, 7, 2, 3])); // true
console.log(stoneGameOpt([3, 7, 2, 3])); // true
console.log(stoneGame([1, 5, 233, 7])); // true
```

## 🔗 Related Problems

| Problem                                                                | Relationship                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | Same interval DP — but without the always-win guarantee |
| [Stone Game II](https://leetcode.com/problems/stone-game-ii)           | Take up to 2M piles — needs real DP                     |
| [Stone Game VII](https://leetcode.com/problems/stone-game-vii)         | Score is sum of remaining — different payoff function   |
