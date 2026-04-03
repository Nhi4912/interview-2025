---
layout: page
title: "Remove Colored Pieces if Both Neighbors are the Same Color"
difficulty: Medium
category: String
tags: [Math, String, Greedy, Game Theory]
leetcode_url: "https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color"
---

# Remove Colored Pieces if Both Neighbors are the Same Color / Xóa Mảnh Màu Nếu Cả Hai Hàng Xóm Cùng Màu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Game Theory
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Stone Game](https://leetcode.com/problems/stone-game) | [Nim Game](https://leetcode.com/problems/nim-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Alice và Bob chơi trò phá mảnh ghép. Họ chơi độc lập — Alice chỉ xóa `A` (khi cả hai hàng xóm là `A`), Bob chỉ xóa `B`. Hai người không ảnh hưởng lẫn nhau → đếm tổng số nước đi của mỗi người; ai nhiều hơn sẽ thắng.

**Pattern Recognition:**

- Signal: "two players, independent moves, who wins" → **Count moves separately, compare**
- Key insight: Alice và Bob không thể chặn nhau vì họ thao tác trên ký tự khác nhau
- "AAA" → 1 nước đi cho Alice; "AAAA" → 2 nước đi; run của n 'A' cho `n-2` nước đi (nếu n≥3)

**Visual — colors="AAABABB":**

```
A A A B A B B
0 1 2 3 4 5 6

Alice can remove index 1 (neighbors 0='A', 2='A') → 1 move (run AAA → n-2=1)
Bob   can remove index 6? neighbors: 5='B', none → no
      index 5: neighbors 4='A', 6='B' → no (different)
Bob   has 0 moves from BB (length 2, n-2=0)

Alice=1 > Bob=0 → Alice wins → true ✅
```

---

## Problem Description

Alice and Bob take turns (Alice first) removing pieces. Alice removes a piece `'A'` only if both neighbors are `'A'`; Bob removes `'B'` only if both neighbors are `'B'`. The player who cannot move loses. Return `true` if Alice wins assuming optimal play.

```
Example 1: colors="AAABABB"  → true   (Alice 1 move, Bob 0)
Example 2: colors="AA"       → false  (no valid moves for either)
Example 3: colors="ABBBBBBBA" → false (Bob has more moves)
```

Constraints: `1 <= colors.length <= 10^5`, `colors[i]` is `'A'` or `'B'`.

---

## 📝 Interview Tips

1. **Clarify**: "Hai người không ảnh hưởng lẫn nhau vì ký tự khác nhau — xác nhận điều này!" / Confirm moves are truly independent
2. **Key insight**: "Đếm run dài ≥ 3 của 'A' và 'B', cộng (length - 2) cho mỗi run" / Count moves from each run ≥ 3
3. **Brute force**: "Simulate full game với recursion" → O(n²) worst case / Full game simulation exponential
4. **Optimize**: "Đếm số nước đi của Alice và Bob độc lập — O(n)" / Count moves independently O(n)
5. **Edge cases**: "Toàn 'A' hoặc 'B', không có run ≥ 3, chuỗi độ dài 1" / All same color, no valid moves
6. **Game theory**: "Vì moves độc lập, không cần minimax hay DP — đơn giản hóa đáng kể" / Independence eliminates minimax

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — count moves by scanning for patterns "AAA" / "BBB"
 * Time: O(n) — single pass (brute here is actually same complexity, just less elegant)
 * Space: O(1)
 */
function winnerOfGameBrute(colors: string): boolean {
  let alice = 0,
    bob = 0;
  for (let i = 1; i < colors.length - 1; i++) {
    if (colors[i - 1] === "A" && colors[i] === "A" && colors[i + 1] === "A") alice++;
    if (colors[i - 1] === "B" && colors[i] === "B" && colors[i + 1] === "B") bob++;
  }
  return alice > bob;
}

/**
 * Solution 2: Run-Length Encoding (cleaner, same O(n))
 * Time: O(n) — single pass through string
 * Space: O(1) — only counters
 */
function winnerOfGame(colors: string): boolean {
  let alice = 0;
  let bob = 0;
  let i = 0;

  while (i < colors.length) {
    const ch = colors[i];
    let run = 0;
    // Count length of current run
    while (i < colors.length && colors[i] === ch) {
      i++;
      run++;
    }
    // A run of length n gives (n - 2) moves if n >= 3
    if (run >= 3) {
      if (ch === "A") alice += run - 2;
      else bob += run - 2;
    }
  }

  return alice > bob; // Alice wins only if she has strictly more moves
}

// === Test Cases ===
console.log(winnerOfGame("AAABABB")); // true
console.log(winnerOfGame("AA")); // false
console.log(winnerOfGame("ABBBBBBBA")); // false
console.log(winnerOfGame("AAAA")); // true  (Alice 2 moves, Bob 0)
```

---

## 🔗 Related Problems

- [Stone Game](https://leetcode.com/problems/stone-game) — two-player optimal play, math insight
- [Nim Game](https://leetcode.com/problems/nim-game) — game theory with simple math win condition
- [Stone Game IX](https://leetcode.com/problems/stone-game-ix) — more complex game theory
- [Predict the Winner](https://leetcode.com/problems/predict-the-winner) — minimax game where moves DO interact
