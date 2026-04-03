---
layout: page
title: "Check if an Original String Exists Given Two Encoded Strings"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/check-if-an-original-string-exists-given-two-encoded-strings"
---

# Check if an Original String Exists Given Two Encoded Strings / Kiểm Tra Chuỗi Gốc Từ Hai Chuỗi Mã Hóa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google

## 🧠 Intuition / Tư Duy

**Analogy:** Như so khớp hai bản dịch có đoạn bị che khuất — số trong chuỗi có nghĩa là "đoạn bất kỳ dài ngần đó". Bạn dùng `skew` để theo dõi bao nhiêu ký tự s1 đang "nợ" trước s2 (hoặc ngược lại), dừng lại khi cả hai cùng giải mã hoàn toàn và skew = 0.

**Pattern Recognition:**

- "Match two strings where digits encode wildcard spans" → DFS/DP on (i, j, skew)
- skew > 0: s1 has skew surplus wildcard chars; skew < 0: s2 has |skew| surplus
- When both at literal chars and skew=0, chars must match; memoize visited states

**Visual:**

```
s1="l123e", s2="44"
State (i, j, skew): i=pos in s1, j=pos in s2, skew=s1_surplus
(0,0,0) → s1[0]='l' literal, s2[0]='4' digit → parse digit 4 → (0,2,4)
(0,2,4) → skew>0, consume s1[0]='l' → (1,2,3)
(1,2,3) → s1[1]='1' digit, try spans 1..9: span 123→(4,2,-120)...
         Try span 1: (2,2,2), span 12: (3,2,-9), span 123: (4,2,-120)
(2,2,2) → skew=2, consume s1[2]='2' (digit, parse) or s1[2]='2'...  eventually reaches (5,2,0) at 'e' vs end → false
Eventually (4,2,0): s1[4]='e' literal, s2 at pos 2=end → fail
Try other paths... answer = true
```

## Problem Description

Two encoded strings use digits to represent any lowercase string of that exact length (multi-digit numbers form one number). Return `true` if there exists an original string consistent with both encoded forms.

Examples: s1="internationalization", s2="i18n" → true; s1="l123e", s2="44" → true; s1="a5b", s2="c77b" → false.

## 📝 Interview Tips

1. **Clarify**: "123" là một số (123 ký tự), không phải 3 số riêng biệt / consecutive digits form one number, e.g., "123" means 123-char wildcard.
2. **Approach**: DFS with memoization on (i, j, skew); skew = s1_surplus − s2_surplus; cap skew range to avoid TLE.
3. **Edge cases**: Chuỗi chỉ có số — mọi tổng ký tự bằng nhau đều OK; số 0 trong chuỗi? Constraints say no leading zeros.
4. **Optimize**: Cap skew ở ±maxLen (≈40) — nếu |skew| > 40 thì không thể khớp ký tự thường trong window.
5. **Follow-up**: Nếu cho phép nhiều encoding styles → mở rộng transition set.
6. **Complexity**: Time O(|s1| × |s2| × maxSkew), Space same.

## Solutions

```typescript
/** Solution 1: DFS with visited-set memoization
 * State: (i, j, skew) where skew = surplus chars s1 owes vs s2
 * Time: O(|s1| * |s2| * maxLen) | Space: O(|s1| * |s2| * maxLen)
 */
function possiblyEquals(s1: string, s2: string): boolean {
  const n1 = s1.length,
    n2 = s2.length;
  const visited = new Set<string>();

  function dfs(i: number, j: number, skew: number): boolean {
    const key = `${i},${j},${skew}`;
    if (visited.has(key)) return false;
    visited.add(key);

    if (i === n1 && j === n2) return skew === 0;

    // Advance s1 digit(s): consume number from s1[i..]
    if (i < n1 && s1[i] >= "0" && s1[i] <= "9") {
      let num = 0;
      for (let k = i; k < n1 && s1[k] >= "0" && s1[k] <= "9"; k++) {
        num = num * 10 + parseInt(s1[k]);
        if (dfs(k + 1, j, skew - num)) return true;
      }
    }

    // Advance s2 digit(s): consume number from s2[j..]
    if (j < n2 && s2[j] >= "0" && s2[j] <= "9") {
      let num = 0;
      for (let k = j; k < n2 && s2[k] >= "0" && s2[k] <= "9"; k++) {
        num = num * 10 + parseInt(s2[k]);
        if (dfs(i, k + 1, skew + num)) return true;
      }
    }

    if (skew === 0) {
      // Both at literal chars — must match
      if (
        i < n1 &&
        j < n2 &&
        s1[i] >= "a" &&
        s1[i] <= "z" &&
        s2[j] >= "a" &&
        s2[j] <= "z" &&
        s1[i] === s2[j]
      ) {
        if (dfs(i + 1, j + 1, 0)) return true;
      }
    } else if (skew > 0) {
      // s1 owes skew more chars; consume one literal from s1
      if (i < n1 && s1[i] >= "a" && s1[i] <= "z") {
        if (dfs(i + 1, j, skew - 1)) return true;
      }
    } else {
      // s2 owes |skew| more chars; consume one literal from s2
      if (j < n2 && s2[j] >= "a" && s2[j] <= "z") {
        if (dfs(i, j + 1, skew + 1)) return true;
      }
    }
    return false;
  }

  return dfs(0, 0, 0);
}

/** Solution 2: BFS over (i, j, skew) states (iterative alternative)
 * Time: O(|s1| * |s2| * maxLen) | Space: O(|s1| * |s2| * maxLen)
 */
function possiblyEquals2(s1: string, s2: string): boolean {
  const n1 = s1.length,
    n2 = s2.length;
  // Each state: [i, j, skew]
  let frontier = new Set<string>(["0,0,0"]);
  const visited = new Set<string>(["0,0,0"]);

  while (frontier.size > 0) {
    const next = new Set<string>();
    const add = (i: number, j: number, skew: number) => {
      if (i === n1 && j === n2 && skew === 0) return true; // handled below
      const k = `${i},${j},${skew}`;
      if (!visited.has(k)) {
        visited.add(k);
        next.add(k);
      }
      return false;
    };
    for (const state of frontier) {
      const [i, j, skew] = state.split(",").map(Number);
      if (i === n1 && j === n2 && skew === 0) return true;
      // Consume number from s1
      if (i < n1 && s1[i] >= "0" && s1[i] <= "9") {
        let num = 0;
        for (let k = i; k < n1 && s1[k] >= "0" && s1[k] <= "9"; k++) {
          num = num * 10 + parseInt(s1[k]);
          add(k + 1, j, skew - num);
        }
      }
      // Consume number from s2
      if (j < n2 && s2[j] >= "0" && s2[j] <= "9") {
        let num = 0;
        for (let k = j; k < n2 && s2[k] >= "0" && s2[k] <= "9"; k++) {
          num = num * 10 + parseInt(s2[k]);
          add(i, k + 1, skew + num);
        }
      }
      // Match literal chars based on skew
      if (skew === 0 && i < n1 && j < n2 && s1[i] >= "a" && s2[j] >= "a" && s1[i] === s2[j])
        add(i + 1, j + 1, 0);
      else if (skew > 0 && i < n1 && s1[i] >= "a") add(i + 1, j, skew - 1);
      else if (skew < 0 && j < n2 && s2[j] >= "a") add(i, j + 1, skew + 1);
    }
    frontier = next;
  }
  return false;
}

// Tests
console.log(possiblyEquals("internationalization", "i18n")); // true
console.log(possiblyEquals("l123e", "44")); // true
console.log(possiblyEquals("a5b", "c77b")); // false
console.log(possiblyEquals("1", "1")); // true
console.log(possiblyEquals("a1b", "a1b")); // true
console.log(possiblyEquals("ab", "a1")); // true
```

## 🔗 Related Problems

| Problem                                                                                  | Relationship                                    |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                     | Pattern matching with wildcards                 |
| [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching) | String DP with flexible matching                |
| [Interleaving String](https://leetcode.com/problems/interleaving-string)                 | Check if string is interleaved from two sources |
