---
layout: page
title: "Can I Win"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Bit Manipulation, Memoization, Game Theory]
leetcode_url: "https://leetcode.com/problems/can-i-win"
---

# Can I Win / Tôi Có Thể Thắng Không?

🟡 Medium | Bitmask DP + Game Theory | LeetCode 464

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Hai người chơi lần lượt chọn số từ 1 đến maxChoosableInteger (không lặp lại). Ai đầu tiên đạt tổng ≥ desiredTotal thắng. Dùng bitmask để mã hoá trạng thái các số đã dùng. `canWin(mask)` = người hiện tại có thể thắng không khi các số trong mask đã dùng.

```
maxChoosable=4, desired=6
State = bitmask of chosen numbers (bit i = number i+1 used)

canWin(0000) = ?  current total = 0
  Pick 4 → total=4, canWin(1000)?
    Pick 3 → total=7 ≥ 6 → WIN!   so canWin(1000)=true
  → opponent wins picking 3, so picking 4 is bad for us
  Pick 3 → total=3, canWin(0100)?
    Opponent picks 4 → total=7 ≥ 6 → opponent WINS
  → canWin(0100)=false
  ...
```

## Problem Description

In the 100 game, two players take turns choosing a distinct integer from 1 to `maxChoosableInteger`. The player whose running total reaches or exceeds `desiredTotal` wins. Given `maxChoosableInteger` and `desiredTotal`, determine if the **first player** can guarantee a win, assuming both play optimally.

**Example 1:**

- Input: `maxChoosableInteger = 10`, `desiredTotal = 11`
- Output: `false` — First player always loses with optimal play

**Example 2:**

- Input: `maxChoosableInteger = 10`, `desiredTotal = 0`
- Output: `true` — Already at desired total

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** State = bitmask of used numbers; `memo[mask]` = can current player win given this set of used numbers
- 📊 **Pruning / Cắt tỉa:** Quick checks: if `desiredTotal <= 0` return true; if sum of all integers < desiredTotal return false
- 🔢 **Transition / Công thức:** Try each unused number i; if `currentTotal + i >= desiredTotal` OR `!canWin(nextMask, newTotal)` → current player wins
- ⚡ **Complexity / Độ phức tạp:** O(2^n × n) states × transitions; n ≤ 20
- 🚫 **Edge case / Trường hợp đặc biệt:** `desiredTotal = 0` → first player already wins; n\*(n+1)/2 < desiredTotal → impossible
- 💡 **Memoization / Ghi nhớ:** Key is the bitmask alone — total can be derived from popcount and values

## Solutions

```typescript
/**
 * Approach 1: Bitmask Memoization (Top-Down DP)
 * Time: O(2^n * n)
 * Space: O(2^n)
 *
 * memo[mask] = can current player win when 'mask' encodes used numbers
 * The current total is implicit: sum of bits set in mask
 */
function canIWin(maxChoosableInteger: number, desiredTotal: number): boolean {
  if (desiredTotal <= 0) return true;

  // Total sum of all choosable integers
  const totalSum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
  if (totalSum < desiredTotal) return false;

  const memo = new Map<number, boolean>();

  // Precompute sum for each mask
  const sumOf = (mask: number): number => {
    let s = 0;
    for (let i = 1; i <= maxChoosableInteger; i++) {
      if (mask & (1 << (i - 1))) s += i;
    }
    return s;
  };

  function canWin(mask: number): boolean {
    if (memo.has(mask)) return memo.get(mask)!;

    const currentSum = sumOf(mask);

    for (let i = 1; i <= maxChoosableInteger; i++) {
      const bit = 1 << (i - 1);
      if (mask & bit) continue; // already used

      // Current player picks i
      if (currentSum + i >= desiredTotal) {
        memo.set(mask, true);
        return true;
      }
      // If opponent cannot win from next state, current player wins
      if (!canWin(mask | bit)) {
        memo.set(mask, true);
        return true;
      }
    }

    memo.set(mask, false);
    return false;
  }

  return canWin(0);
}

console.log(canIWin(10, 11)); // false
console.log(canIWin(10, 0)); // true
console.log(canIWin(10, 1)); // true (pick 1 immediately)
console.log(canIWin(4, 6)); // true
```

```typescript
/**
 * Approach 2: Optimized — pass currentTotal to avoid recomputing sum
 * Time: O(2^n * n)
 * Space: O(2^n)
 */
function canIWin2(maxChoosableInteger: number, desiredTotal: number): boolean {
  if (desiredTotal <= 0) return true;

  const n = maxChoosableInteger;
  const totalSum = (n * (n + 1)) / 2;
  if (totalSum < desiredTotal) return false;

  // memo[mask]: 1=win, -1=lose, 0=unvisited
  const memo = new Int8Array(1 << n);

  function canWin(mask: number, total: number): boolean {
    if (memo[mask] !== 0) return memo[mask] === 1;

    for (let i = 1; i <= n; i++) {
      const bit = 1 << (i - 1);
      if (mask & bit) continue;
      if (total + i >= desiredTotal || !canWin(mask | bit, total + i)) {
        memo[mask] = 1;
        return true;
      }
    }

    memo[mask] = -1;
    return false;
  }

  return canWin(0, 0);
}

console.log(canIWin2(10, 11)); // false
console.log(canIWin2(10, 0)); // true
console.log(canIWin2(4, 6)); // true
```

```typescript
/**
 * Approach 3: Bottom-Up DP (iterating masks in order)
 * Time: O(2^n * n)
 * Space: O(2^n)
 */
function canIWin3(maxChoosableInteger: number, desiredTotal: number): boolean {
  if (desiredTotal <= 0) return true;
  const n = maxChoosableInteger;
  if ((n * (n + 1)) / 2 < desiredTotal) return false;

  const dp = new Uint8Array(1 << n); // 1 = current player wins

  for (let mask = 0; mask < 1 << n; mask++) {
    // Compute total from mask
    let total = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) total += i + 1;
    }
    // Try each number not yet chosen
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const val = i + 1;
      if (total + val >= desiredTotal || !dp[mask | (1 << i)]) {
        dp[mask] = 1;
        break;
      }
    }
  }

  return dp[0] === 1;
}

console.log(canIWin3(10, 11)); // false
console.log(canIWin3(4, 6)); // true
```

## 🔗 Related Problems

| Problem                                                                 | Difficulty | Key Concept      |
| ----------------------------------------------------------------------- | ---------- | ---------------- |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner/) | 🟡 Medium  | Game Theory DP   |
| [Stone Game](https://leetcode.com/problems/stone-game/)                 | 🟡 Medium  | Minimax DP       |
| [Nim Game](https://leetcode.com/problems/nim-game/)                     | 🟢 Easy    | Math Game Theory |
| [Cat and Mouse](https://leetcode.com/problems/cat-and-mouse/)           | 🔴 Hard    | Game Theory BFS  |
