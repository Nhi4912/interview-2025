---
layout: page
title: "Sum Game"
difficulty: Medium
category: String
tags: [Math, String, Greedy, Game Theory]
leetcode_url: "https://leetcode.com/problems/sum-game"
---

# Sum Game / Trò Chơi Tổng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | [Guess the Word](https://leetcode.com/problems/guess-the-word)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi cân thăng bằng — Alice muốn giữ hai đĩa không cân bằng, Bob muốn làm cân. Mỗi người chọn tối ưu cho mình. Chìa khóa: phân tích toán học để biết ai thắng.

**Pattern Recognition:**

- Signal: "optimal play" + "fill '?'" + "balance halves" → **Math + Game Theory**
- Key insight: Chia chuỗi làm đôi. `sumL`, `qL` = tổng và số '?' ở nửa trái; tương tự nửa phải.
  - Alice điền '?' để giữ mất cân bằng, Bob điền '?' để cân bằng.
  - Bob thắng khi và chỉ khi: `sumL + 9 * (qL/2) == sumR + 9 * (qR/2)` sau khi xử lý pairs.
  - Điều kiện Alice thắng: `(sumL - sumR) + 9 * ((qL - qR) / 2) ≠ 0`.

**Visual:**

```
num = "5023"  (len=4, split at 2: "50" | "23")
sumL = 5+0 = 5,  qL = 0
sumR = 2+3 = 5,  qR = 0
Alice wins iff 5 - 5 ≠ 0 → false → Bob wins (false)

num = "?5006"? No — must be even length.
num = "25??"  (len=4: "25" | "??")
sumL=7, qL=0, sumR=0, qR=2
Remaining: (7-0) vs 9*(2/2)=9 → 7 ≠ 9 → Alice wins (true)
```

---

## Problem Description

Alice and Bob play a game on a string `num` of even length consisting of digits `0-9` and `'?'`. They alternate turns filling `'?'` (Alice first, always in left half; Bob always in right half... wait — actually they alternate, any `'?'` in the string). Alice wins if the sum of first half ≠ sum of second half after all `'?'` filled. Return `true` if Alice wins with optimal play. ([LeetCode](https://leetcode.com/problems/sum-game))

Difficulty: Medium | Acceptance: ~55%

```
Example 1: num = "5023" → false
  sumL=5, sumR=5 already equal, Bob wins

Example 2: num = "25??" → true
  sumL=7, qL=0, sumR=0, qR=2
  Bob needs: 0 + 2*x = 7 → x=3.5 impossible → Alice wins

Example 3: num = "?3295???" → true
```

Constraints:

- `2 <= num.length <= 10^5`, even length
- `num[i]` is digit or `'?'`

---

## 📝 Interview Tips

1. **Clarify**: "Alice và Bob đều chọn tối ưu — Alice muốn != Bob muốn ==" / Confirm optimal play: Alice → ≠, Bob → ==.
2. **Key math**: "Số '?' phải chẵn để Bob có thể cân bằng — nếu lẻ, Alice thắng ngay" / Odd '?' count means Alice always wins.
3. **Formula**: "Alice thắng nếu sumL - sumR + 9\*(qL-qR)/2 ≠ 0" / Memorize this formula for interviews.
4. **Why 9?**: "Mỗi cặp '?' (1 left + 1 right): Bob đặt (x, 9-x) để tổng them += 9. Alice phá bằng cách không cho cân." / Pair of ? sums to 9 optimally.
5. **Edge cases**: "num = '??': sumL=sumR=0, qL=qR=1 → 0+9\*(0)=0 → Bob wins (false)" / All '?' depends on count parity.
6. **Follow-up**: "Nếu cho phép đặt bất kỳ '?' ở đâu? Bài toán phức tạp hơn nhiều." / Placement-free variant is harder.

---

## Solutions

```typescript
/**
 * Solution 1: Math Analysis — Direct Formula
 * Time: O(n) — one pass to compute sums and counts
 * Space: O(1)
 *
 * Key insight:
 * - If total '?' is odd → Alice wins (one extra '?' can't be paired)
 * - Otherwise, each pair of (qL-question, qR-question) Bob fills with (x, 9-x)
 *   Bob wants: sumL + (some fill) == sumR + (some fill)
 *   Alice wins iff: sumL - sumR + 9 * ((qL - qR) / 2) != 0
 *
 * Derivation: Pair up '?'s across halves (or within same half in pairs).
 * Each cross-pair: Bob contributes x + (9-x) = 9 net.
 * Each within-half pair: both sides contributed symmetrically.
 */
function sumGame(num: string): boolean {
  const n = num.length;
  let sumL = 0,
    sumR = 0,
    qL = 0,
    qR = 0;

  for (let i = 0; i < n / 2; i++) {
    if (num[i] === "?") qL++;
    else sumL += parseInt(num[i]);
  }
  for (let i = n / 2; i < n; i++) {
    if (num[i] === "?") qR++;
    else sumR += parseInt(num[i]);
  }

  // If total '?' count is odd, Alice always wins (can't perfectly balance)
  if ((qL + qR) % 2 === 1) return true;

  // Alice wins iff the balance equation has no integer solution
  // Bob's strategy: pair each '?' in left with one in right, fill (x, 9-x)
  // Bob wins iff: sumL + 9*(qL/2) == sumR + 9*(qR/2)  [when qL+qR even]
  // Rearranged: (sumL - sumR) == 9 * (qR - qL) / 2
  return sumL - sumR !== 9 * ((qR - qL) / 2);
}

/**
 * Solution 2: Simulation with explicit pairing logic
 * Time: O(n), Space: O(1)
 * More verbose but shows the reasoning step by step
 */
function sumGameSimulation(num: string): boolean {
  const n = num.length;
  const half = n / 2;

  // Compute deficit: (sumL - sumR) and (qL, qR)
  let diff = 0; // sumL - sumR
  let qL = 0,
    qR = 0;

  for (let i = 0; i < half; i++) {
    if (num[i] === "?") qL++;
    else diff += parseInt(num[i]);
  }
  for (let i = half; i < n; i++) {
    if (num[i] === "?") qR++;
    else diff -= parseInt(num[i]);
  }

  // If odd '?', can't balance
  if ((qL + qR) % 2 !== 0) return true;

  // Pair within-half '?': every 2 '?' in same half contributes 9 to that half's sum
  // (Alice puts 9, Bob puts 9 → symmetric)
  // Pair across halves: Bob puts (x, 9-x) → net contribution to diff = x-(9-x) = 2x-9
  // Bob chooses x = (diff + 9 * crossPairs) / (2 * crossPairs) to zero out diff
  // This is possible only if diff + 9 * (qL - qR) / 2 == 0

  // Reduce within-half pairs first
  let qlRem = qL % 2,
    qrRem = qR % 2;
  diff += 9 * Math.floor(qL / 2); // each pair of qL adds 9 (Alice fills 9 total)
  diff -= 9 * Math.floor(qR / 2); // each pair of qR subtracts 9

  // Now qlRem + qrRem must equal 0 or 2 (both odd → one cross pair)
  // If one cross pair: Bob can zero out diff exactly 9/2 → impossible unless diff==0...
  // Actually with the formula: Alice wins iff diff != 0 after processing
  return diff !== 0;
}

// === Test Cases ===
console.log(sumGame("5023")); // false  (5=5, no ?)
console.log(sumGame("25??")); // true   (7 vs 9 impossible)
console.log(sumGame("?3295???")); // true
console.log(sumGame("??")); // false  (Bob can fill 4,5 or 0,9 etc)
console.log(sumGame("0000")); // false

console.log(sumGameSimulation("5023")); // false
console.log(sumGameSimulation("25??")); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                | Pattern              | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ---------- |
| [Stone Game](https://leetcode.com/problems/stone-game)                                                                                                 | Game Theory + Math   | Medium     |
| [Nim Game](https://leetcode.com/problems/nim-game)                                                                                                     | Game Theory + Math   | Easy       |
| [Remove Colored Pieces if Both Neighbors are the Same Color](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) | Game Theory + Greedy | Medium     |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner)                                                                                 | Game Theory + DP     | Medium     |
