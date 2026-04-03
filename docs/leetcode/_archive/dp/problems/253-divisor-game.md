---
layout: page
title: "Divisor Game"
difficulty: Easy
category: DP
tags: [Math, Dynamic Programming, Game Theory]
leetcode_url: "https://leetcode.com/problems/divisor-game"
---

# Divisor Game / Trò Chơi Ước Số

> **Track**: DP | **Difficulty**: 🟢 Easy | **Pattern**: Game Theory DP / Math
> **Frequency**: 📘 Tier 3 — Gặp ở các vòng phỏng vấn cơ bản
> **See also**: [Nim Game](https://leetcode.com/problems/nim-game) | [Stone Game](https://leetcode.com/problems/stone-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai người chơi trò chơi với số `n`. Người đến lượt chọn một ước số `x` của `n` (0 < x < n), rồi `n` trở thành `n - x`. Ai không thể chọn được thì thua. Alice đi trước — cô ấy có thể thắng không? Mẹo thú vị: nếu `n` chẵn, Alice luôn chọn `x = 1` (ước số chẵn - ước số lẻ = lẻ), đẩy Bob vào tình thế số lẻ. Bob buộc phải trả số chẵn cho Alice, và cứ thế Alice luôn kiểm soát. Đáp án: Alice thắng khi và chỉ khi `n` chẵn!

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Divisor Game example:**

```
n=1: Alice cần ước < 1 → không có → thua (false)
n=2: Alice chọn x=1 → n=1 → Bob thua (true)
n=3: Alice chọn x=1 → n=2 → Bob thắng (false)
     (3's divisors: 1,3→ only x=1 valid)
n=4: Alice chọn x=1 → n=3 → Bob thua (true)
     OR chọn x=2 → n=2 → Bob thắng... so choose x=1!
n=5: Alice must choose x=1 → n=4 → Bob wins (false)
     OR x=5→ invalid

Pattern: even→true, odd→false!

DP verification:
dp[1]=F, dp[2]=T, dp[3]=F, dp[4]=T, dp[5]=F, dp[6]=T...
For n: dp[n] = OR of (!dp[n-x]) for all divisors x of n
```

---

## Problem Description

Alice and Bob take turns. Alice goes first. On each turn, the current player picks `x` where `0 < x < n` and `x` divides `n`, then replaces `n` with `n - x`. The player who can't make a move loses. Return `true` if Alice wins (both play optimally).

**Example 1:** `n = 2` → `true` (Alice picks 1, n becomes 1, Bob can't move)

**Example 2:** `n = 3` → `false` (Alice picks 1, n becomes 2, Bob picks 1, n becomes 1, Alice can't)

**Example 3:** `n = 4` → `true`

**Constraints:** `1 ≤ n ≤ 1000`

---

## 📝 Interview Tips

- **Math insight** / Nhận xét toán học: `n % 2 === 0` → Alice wins; `n % 2 === 1` → Alice loses
- **Why** / Tại sao: Số lẻ chỉ có ước lẻ (ngoại trừ chính nó) → `odd - odd = even` → chỉ có thể tạo số chẵn
- **Induction** / Quy nạp: `n=1` thua, `n=2` thắng (chọn 1→n=1), mọi số chẵn kế thừa thắng
- **DP solution** / DP: `dp[n] = any !dp[n-x]` cho `x` là ước của `n` — O(n²) nhưng không cần
- **O(1) solution** / O(1): `return n % 2 === 0` — không cần DP!
- **Interview pitfall** / Bẫy phỏng vấn: Hỏi DP nhưng toán học đơn giản hơn nhiều — nhận ra là điểm cộng

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O(n)
 * Recursive game theory: try all valid moves
 */
function divisorGameBrute(n: number): boolean {
  const memo = new Map<number, boolean>();

  function canWin(num: number): boolean {
    if (memo.has(num)) return memo.get(num)!;
    // Find all divisors x (0 < x < num, x divides num)
    for (let x = 1; x < num; x++) {
      if (num % x === 0) {
        if (!canWin(num - x)) {
          memo.set(num, true);
          return true; // can move to losing position for opponent
        }
      }
    }
    memo.set(num, false);
    return false; // no winning move
  }

  return canWin(n);
}

/**
 * @complexity Time: O(n²) | Space: O(n)
 * dp[i] = true if current player wins with number i
 */
function divisorGameDP(n: number): boolean {
  const dp = new Array(n + 1).fill(false);
  // dp[1] = false (no valid x: 0 < x < 1 doesn't exist)

  for (let i = 2; i <= n; i++) {
    // Try every divisor x of i
    for (let x = 1; x < i; x++) {
      if (i % x === 0 && !dp[i - x]) {
        dp[i] = true;
        break; // found a winning move
      }
    }
  }

  return dp[n];
}

/**
 * @complexity Time: O(1) | Space: O(1)
 * Key insight: Alice wins iff n is even.
 * Proof by induction:
 *   Base: n=1 (odd)→ false, n=2 (even)→ true
 *   n=odd: only valid moves x must be odd (odd divisors), odd-odd=even → Bob gets even → Bob wins
 *   n=even: Alice picks x=1 (always a divisor), n-1=odd → Bob gets odd → Alice wins
 */
function divisorGame(n: number): boolean {
  return n % 2 === 0;
}

// === Test Cases ===
console.log(divisorGame(1)); // → false
console.log(divisorGame(2)); // → true
console.log(divisorGame(3)); // → false
console.log(divisorGame(4)); // → true
console.log(divisorGame(1000)); // → true
console.log(divisorGameDP(6)); // → true
console.log(divisorGameBrute(7)); // → false
```

---

## 🔗 Related Problems

| Problem       | Difficulty | Link                                                  |
| ------------- | ---------- | ----------------------------------------------------- |
| Nim Game      | Easy       | [LC 292](https://leetcode.com/problems/nim-game)      |
| Stone Game    | Medium     | [LC 877](https://leetcode.com/problems/stone-game)    |
| Cat and Mouse | Hard       | [LC 913](https://leetcode.com/problems/cat-and-mouse) |
