---
layout: page
title: "Flip Game II"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Backtracking, Memoization, Game Theory]
leetcode_url: "https://leetcode.com/problems/flip-game-ii"
---

# Flip Game II / Trò Chơi Lật Dấu II

🟡 Medium | Game theory with memoization (Sprague-Grundy)

## 🧠 Intuition

**VI:** Trò chơi công bằng: người hiện tại thắng nếu tồn tại ít nhất một nước đi
khiến đối thủ thua. Dùng memoisation để tránh tính lại trạng thái đã gặp.

**EN:** Current player wins if there exists at least one move that puts the opponent in a
losing state. Memoize by string state to avoid recomputation.

```
currentState = "+++++"
Try flipping each "++" → "+--++", "++--+", "+++--"
canWin("+--++") → opponent can flip → canWin recursive
If ANY resulting state makes opponent lose → return true
```

## 📝 Interview Tips

- 🔑 **EN:** Classic minimax: return true if any move leads to opponent returning false.
  **VI:** Minimax cổ điển: trả true nếu có nước đi nào khiến đối thủ trả false.
- 🔑 **EN:** Memoize by the string state — exponential states but many repeated.
  **VI:** Ghi nhớ theo chuỗi trạng thái — trạng thái mũ nhưng nhiều lần lặp.
- 🔑 **EN:** Sprague-Grundy: game decomposes into independent runs of "+". Nim-value of run length L is floor(L/2).
  **VI:** Sprague-Grundy: trò chơi phân rã thành các đoạn "+" độc lập. Nim-value = floor(L/2).
- 🔑 **EN:** XOR of all Grundy values determines win/loss. XOR=0 → lose, XOR≠0 → win.
  **VI:** XOR tất cả Grundy values → XOR=0 thua, XOR≠0 thắng.
- 🔑 **EN:** Memoized DFS is simpler to implement; Grundy approach is O(n).
  **VI:** DFS có memo dễ cài hơn; phương pháp Grundy O(n).
- 🔑 **EN:** Each move converts "++" to "--"; game ends when no "++" remains.
  **VI:** Mỗi nước chuyển "++" thành "--"; trò chơi kết thúc khi không còn "++".

## Solutions

### Solution 1: Memoised Backtracking

```typescript
/**
 * Flip Game II — memoised DFS
 * canWin(s) = true if current player can win from state s
 * Time: O(n! / 2^k) worst case  Space: O(states)
 */
function canWin(currentState: string): boolean {
  const memo = new Map<string, boolean>();

  function dfs(s: string): boolean {
    if (memo.has(s)) return memo.get(s)!;
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === "+" && s[i + 1] === "+") {
        const next = s.slice(0, i) + "--" + s.slice(i + 2);
        if (!dfs(next)) {
          memo.set(s, true);
          return true;
        }
      }
    }
    memo.set(s, false);
    return false;
  }

  return dfs(currentState);
}

console.log(canWin("++++")); // true
console.log(canWin("+")); // false
console.log(canWin("++--++")); // true
```

### Solution 2: Sprague-Grundy (O(n))

```typescript
/**
 * Sprague-Grundy theorem:
 * Split string by '-', each contiguous run of '+' of length L
 * has Grundy value floor(L/2).
 * XOR all Grundy values: non-zero → first player wins.
 * Time: O(n)  Space: O(n)
 */
function canWinGrundy(currentState: string): boolean {
  let xorSum = 0;
  let runLen = 0;

  for (const ch of currentState) {
    if (ch === "+") {
      runLen++;
    } else {
      xorSum ^= Math.floor(runLen / 2);
      runLen = 0;
    }
  }
  xorSum ^= Math.floor(runLen / 2);

  return xorSum !== 0;
}

console.log(canWinGrundy("++++")); // true
console.log(canWinGrundy("+")); // false
console.log(canWinGrundy("++--++")); // true
console.log(canWinGrundy("++")); // true
```

## 🔗 Related Problems

| Problem                                                                                                | Difficulty | Key Idea                 |
| ------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [292. Nim Game](https://leetcode.com/problems/nim-game/)                                               | 🟢 Easy    | Mathematical game theory |
| [294. Flip Game II](https://leetcode.com/problems/flip-game-ii/)                                       | 🟡 Medium  | This problem             |
| [375. Guess Number Higher or Lower II](https://leetcode.com/problems/guess-number-higher-or-lower-ii/) | 🟡 Medium  | Minimax DP               |
| [486. Predict the Winner](https://leetcode.com/problems/predict-the-winner/)                           | 🟡 Medium  | Minimax game DP          |
