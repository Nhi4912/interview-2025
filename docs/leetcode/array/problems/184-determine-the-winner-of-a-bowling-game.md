---
layout: page
title: "Determine the Winner of a Bowling Game"
difficulty: Easy
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/determine-the-winner-of-a-bowling-game"
---

# Determine the Winner of a Bowling Game / Xác Định Người Thắng Trò Chơi Bowling

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix) | [Baseball Game](https://leetcode.com/problems/baseball-game)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống tính điểm bowling thực tế — nếu vừa đánh được 10 chân (strike), hai lần tiếp theo được nhân đôi điểm. Chỉ cần nhìn lại 2 lần trước khi tính điểm hiện tại.

**Visual:**

```
player1 = [4, 10, 7, 9]

i=0: pins=4  → no double,  score += 4       = 4
i=1: pins=10 → no double,  score += 10      = 14
i=2: pins=7  → prev[i-1]=10 → DOUBLE!       = 14+14=28
i=3: pins=9  → prev[i-1]=10 → DOUBLE!       = 28+18=46

Turn 2 (i=1) was 10, so turns 2 and 3 get doubled.
```

---

## Problem Description

Two players bowl `n` turns each. If `player[i-1] == 10` OR `player[i-2] == 10`, then `player[i]` is doubled. Return `1` if player 1 wins, `2` if player 2 wins, `0` if tie.

- Example 1: `player1=[4,10,7,9], player2=[6,5,2,3]` → `1` (player1=46 > player2=16)
- Example 2: `player1=[3,5,7,6], player2=[8,10,10,2]` → `2` (player2 wins)

**Constraints:** `n == player1.length == player2.length`, `1 <= n <= 1000`, `0 <= player1[i], player2[i] <= 10`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Double apply nếu LẦN TRƯỚC HOẶC HAI LẦN TRƯỚC là 10?" / Double if either of the two preceding turns was 10.
2. **Look-back window**: "Với mỗi turn i, check i-1 và i-2" / Check indices i-1 and i-2 for strike.
3. **Helper function**: "Tách hàm tính điểm để dùng lại cho cả hai player" / Extract score function used for both arrays.
4. **Boundary**: "i=0 và i=1 không có đủ 2 lần trước — dùng 0 làm default" / Guard against negative indices.
5. **Return value**: "Trả về 0 cho hòa, 1/2 cho người thắng" / Return 0 for tie, not boolean.
6. **Complexity**: "O(n) — một vòng lặp mỗi player" / Linear per player, O(n) total.

---

## Solutions

```typescript
/**
 * Helper: Compute bowling score for one player.
 * Time: O(n), Space: O(1)
 */
function computeScore(pins: number[]): number {
  let score = 0;
  for (let i = 0; i < pins.length; i++) {
    // Double if either of previous two turns was a strike (10)
    const isDouble = (i >= 1 && pins[i - 1] === 10) || (i >= 2 && pins[i - 2] === 10);
    score += isDouble ? 2 * pins[i] : pins[i];
  }
  return score;
}

/**
 * Solution 1: Helper Function
 * Time: O(n), Space: O(1)
 */
function isWinnerBowling(player1: number[], player2: number[]): number {
  const s1 = computeScore(player1);
  const s2 = computeScore(player2);
  if (s1 > s2) return 1;
  if (s2 > s1) return 2;
  return 0;
}

console.log(isWinnerBowling([4, 10, 7, 9], [6, 5, 2, 3])); // 1
console.log(isWinnerBowling([3, 5, 7, 6], [8, 10, 10, 2])); // 2
console.log(isWinnerBowling([2, 3], [4, 1])); // 0 (tie: 5 vs 5)

/**
 * Solution 2: Inline — No Helper
 * Time: O(n), Space: O(1)
 */
function isWinner(player1: number[], player2: number[]): number {
  let score1 = 0;
  let score2 = 0;
  const n = player1.length;

  for (let i = 0; i < n; i++) {
    const prev1 = i >= 1 ? player1[i - 1] : 0;
    const prev12 = i >= 2 ? player1[i - 2] : 0;
    score1 += prev1 === 10 || prev12 === 10 ? 2 * player1[i] : player1[i];

    const prev2 = i >= 1 ? player2[i - 1] : 0;
    const prev22 = i >= 2 ? player2[i - 2] : 0;
    score2 += prev2 === 10 || prev22 === 10 ? 2 * player2[i] : player2[i];
  }

  return score1 > score2 ? 1 : score2 > score1 ? 2 : 0;
}

console.log(isWinner([4, 10, 7, 9], [6, 5, 2, 3])); // 1
console.log(isWinner([3, 5, 7, 6], [8, 10, 10, 2])); // 2
console.log(isWinner([1, 1, 1, 10, 10], [1, 1, 1, 10, 10])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern           | Difficulty |
| ---------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Baseball Game](https://leetcode.com/problems/baseball-game)                             | Stack Simulation  | Easy       |
| [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix) | Greedy Simulation | Medium     |
| [Count Collisions on a Road](https://leetcode.com/problems/count-collisions-on-a-road)   | Simulation        | Medium     |
| [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin)           | Simulation        | Easy       |
