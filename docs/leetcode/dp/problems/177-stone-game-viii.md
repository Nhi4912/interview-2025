---
layout: page
title: "Stone Game VIII"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Prefix Sum, Game Theory]
leetcode_url: "https://leetcode.com/problems/stone-game-viii"
---

# Stone Game VIII / Trò Chơi Đá VIII

🔴 Hard | Dynamic Programming · Prefix Sum · Game Theory

---

## 🧠 Intuition

**EN:** When Alice picks index `i` (≥1), she scores `prefix[i+1]` = sum of all stones up to i. After that Bob picks from i+1 onward. Define `dp[i]` = best score difference (Alice−Bob) when it's the current player's turn and they choose index ≥ i. Work backwards from right.

**VI:** Khi Alice chọn chỉ số `i` (≥1), cô ấy ghi `prefix[i+1]`. Sau đó Bob chọn từ i+1 trở đi. Định nghĩa `dp[i]` = hiệu điểm tốt nhất (Alice−Bob) khi đang đến lượt chọn và chọn chỉ số ≥ i. Tính ngược từ phải.

```
prefix[i] = stones[0] + ... + stones[i]

dp[i] = best (current_player_score - opponent_score) from index i onward

If current player picks i: scores prefix[i+1], opponent faces dp[i+1]
  → result = prefix[i+1] - dp[i+1]
If current player picks i+1, i+2, ...: dp[i+1]

dp[i] = max(prefix[i+1] - dp[i+1], dp[i+1])
      = max(prefix[i+1] - dp[i+1], dp[i+1])

Base: dp[n-1] = prefix[n]   (must pick last index)
Answer: dp[1]  (Alice goes first, can pick index 1..n-1)
```

---

## 📝 Interview Tips

- 🔑 **EN:** Key insight: once Alice picks index i, all stones 0..i are "locked" into prefix[i+1]. **VI:** Khi Alice chọn i, tất cả đá 0..i được "khóa" thành prefix[i+1].
- 🔑 **EN:** `dp[i] = max score difference` for current player choosing from index i onwards. **VI:** dp[i] = hiệu điểm tối đa cho người đang chơi khi chọn từ chỉ số i trở đi.
- 🔑 **EN:** Transition: pick index i → `prefix[i+1] - dp[i+1]`; skip to i+1 → `dp[i+1]`. Take max. **VI:** Chuyển tiếp: chọn i → prefix[i+1] - dp[i+1]; bỏ qua → dp[i+1]. Lấy max.
- 🔑 **EN:** Build prefix sums first, then iterate i from n-2 down to 1. **VI:** Xây dựng tiền tố trước, rồi duyệt i từ n-2 xuống 1.
- 🔑 **EN:** Only need to track one DP value since `dp[i]` only depends on `dp[i+1]`. **VI:** Chỉ cần một biến DP vì dp[i] chỉ phụ thuộc dp[i+1].
- 🔑 **EN:** Game theory: optimal play means both players maximize their own net gain. **VI:** Lý thuyết trò chơi: cả hai người chơi tối đa hóa lợi thế của mình.

---

## 💡 Solutions

```typescript
/**
 * Suffix DP with prefix sums
 * Time: O(n)  Space: O(n)
 */
function stoneGameVIII(stones: number[]): number {
  const n = stones.length;

  // Build prefix sums
  const prefix = new Array(n).fill(0);
  prefix[0] = stones[0];
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] + stones[i];

  // dp[i] = best score diff for current player, must choose index >= i
  // Base: dp[n-1] = prefix[n-1] (must pick last)
  let dp = prefix[n - 1];

  // Iterate from n-2 down to 1
  for (let i = n - 2; i >= 1; i--) {
    // Pick index i: score = prefix[i], then opponent faces dp (next state)
    // or skip (pass to dp which represents choosing index >= i+1)
    dp = Math.max(prefix[i] - dp, dp);
  }

  return dp;
}

/**
 * Explicit array version for clarity
 * Time: O(n)  Space: O(n)
 */
function stoneGameVIIIV2(stones: number[]): number {
  const n = stones.length;
  const prefix = [...stones];
  for (let i = 1; i < n; i++) prefix[i] += prefix[i - 1];

  // dp[i] = max score diff when current player picks from i..n-1
  const dp = new Array(n).fill(0);
  dp[n - 1] = prefix[n - 1];

  for (let i = n - 2; i >= 1; i--) {
    // Option 1: pick index i → gain prefix[i], opponent faces dp[i+1]
    // Option 2: don't pick index i → dp[i+1] (same player still gets to choose)
    dp[i] = Math.max(prefix[i] - dp[i + 1], dp[i + 1]);
  }

  return dp[1]; // Alice starts at index 1 (must pick at least index 1)
}

/**
 * Walk-through trace for [-1, 2, -3, 4, -5]:
 *   prefix = [-1, 1, -2, 2, -3]
 *   dp starts = prefix[4] = -3
 *   i=3: dp = max(prefix[3] - (-3), -3) = max(2+3, -3) = max(5,-3) = 5
 *   i=2: dp = max(prefix[2] - 5, 5)   = max(-2-5, 5) = max(-7,5)  = 5
 *   i=1: dp = max(prefix[1] - 5, 5)   = max(1-5, 5)  = max(-4,5)  = 5
 *   return 5 ✓
 */

// Tests
console.log(stoneGameVIII([-1, 2, -3, 4, -5])); // 5
console.log(stoneGameVIII([7, -6, 5, 10, 5, -2, -6])); // 13
console.log(stoneGameVIIIV2([-1, 2, -3, 4, -5])); // 5
console.log(stoneGameVIIIV2([7, -6, 5, 10, 5, -2, -6])); // 13
```

---

## 🔗 Related Problems

| Problem                                                                 | Difficulty | Pattern         |
| ----------------------------------------------------------------------- | ---------- | --------------- |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner/) | 🟡 Medium  | Game Theory DP  |
| [Stone Game](https://leetcode.com/problems/stone-game/)                 | 🟡 Medium  | Game Theory     |
| [Stone Game VII](https://leetcode.com/problems/stone-game-vii/)         | 🟡 Medium  | Prefix Sum + DP |
