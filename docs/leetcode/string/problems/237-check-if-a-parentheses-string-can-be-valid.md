---
layout: page
title: "Check if a Parentheses String Can Be Valid"
difficulty: Medium
category: String
tags: [String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid"
---

# Check if a Parentheses String Can Be Valid / Check if a Parentheses String Can Be Valid

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Two-pass
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) | [Minimum Number of Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như kiểm tra tài khoản ngân hàng — theo dõi số dư tối thiểu và tối đa có thể có. Nếu số dư tối đa âm (không thể tránh nợ), không hợp lệ. Nếu cuối cùng số dư tối thiểu = 0 (có thể cân bằng), hợp lệ.

**Visual — Track [minOpen, maxOpen] range:**

```
s = "))(("  locked = "0011"
                  minOpen  maxOpen
Start:               0        0
i=0 ')' unlocked:   -1→0     +1     [0, 1]  (can be '(' or ')')
i=1 ')' unlocked:   -1→0     +2     [0, 2]
i=2 '(' locked:     +1       +1     [1, 3]
i=3 '(' locked:     +1       +1     [2, 4]
Final minOpen=2 ≠ 0 → INVALID

s = "))]]"  locked = "0000"
i=0 ')' unlock: [0,1]  i=1 ')' unlock: [0,2]
i=2 ')' unlock: [0,3]  i=3 ')' unlock: [0,4]
Final minOpen=0 → VALID (all treated as '(')

Rule: if maxOpen < 0 at any point → impossible (too many locked ')')
      clamp minOpen to 0 (can't have negative balance)
      final minOpen must be 0
```

---

## Problem Description

Given a parentheses string `s` and a binary string `locked` (same length). If `locked[i] = '1'`, `s[i]` is fixed; if `locked[i] = '0'`, `s[i]` can be changed to `'('` or `')'`. Return `true` if `s` can become a valid parentheses string.

**Example 1:** `s = "))]]"`, `locked = "0000"` → `true` (change all to `'(('`)  
**Example 2:** `s = ")"`, `locked = "0"` → `false` (length 1 is always invalid)

Constraints: `1 <= s.length <= 10^5`, `s` and `locked` consist of `'('`/`')'` and `'0'`/`'1'` respectively.

---

## 📝 Interview Tips

1. **Quick checks**: "Độ dài lẻ → luôn sai; độ dài chẵn mới có thể hợp lệ" / Odd length → always false; must be even to be valid
2. **Range tracking**: "Thay vì một số, theo dõi [min, max] open parens có thể" / Track range [minOpen, maxOpen] of possible open paren counts
3. **Pruning**: "Nếu maxOpen < 0 → không thể cứu được, return false" / If maxOpen < 0, no assignment can fix it
4. **minOpen clamp**: "minOpen không thể âm — clamp về 0" / minOpen can't go below 0 (can't match imaginary opens)
5. **Final check**: "Cuối cùng minOpen = 0 → có thể đóng hết ngoặc" / Final minOpen = 0 means all opens can be closed
6. **Stack alternative**: "Dùng 2 stack (indices của ngoặc mở locked/unlocked) cũng được — O(n) cả hai" / Two-stack approach also works: track locked/unlocked open positions

---

## Solutions

```typescript
/**
 * Solution 1: Stack-based — track unmatched locked '(' and flexible positions
 * Push indices of unlocked chars and locked '(' onto separate stacks.
 * Match locked ')' with whatever is available.
 * Time: O(n) — single pass + cleanup
 * Space: O(n) — two stacks
 */
function canBeValidStack(s: string, locked: string): boolean {
  const n = s.length;
  if (n % 2 !== 0) return false;

  // Stack of indices of locked '(' and unlocked positions
  const openLocked: number[] = [];   // locked '('
  const openFlex: number[] = [];     // unlocked (can be '(' or ')')

  for (let i = 0; i < n; i++) {
    if (locked[i] === '0') {
      openFlex.push(i);
    } else if (s[i] === '(') {
      openLocked.push(i);
    } else {
      // s[i] === ')' and locked
      if (openLocked.length > 0) openLocked.pop();
      else if (openFlex.length > 0) openFlex.pop();
      else return false;
    }
  }

  // Match remaining locked '(' with flexible positions (flexible must be to the right)
  while (openLocked.length > 0 && openFlex.length > 0) {
    if (openFlex[openFlex.length - 1] < openLocked[openLocked.length - 1]) return false;
    openLocked.pop();
    openFlex.pop();
  }

  return openLocked.length === 0 && openFlex.length % 2 === 0;
}

/**
 * Solution 2: Greedy range — track [minOpen, maxOpen] in one pass
 * For each character, update the range of possible unmatched '(' counts.
 * If maxOpen < 0 at any point → impossible.
 * If minOpen = 0 at end → valid assignment exists.
 * Time: O(n) — single left-to-right pass
 * Space: O(1) — only two integers
 */
function canBeValid(s: string, locked: string): boolean {
  const n = s.length;
  if (n % 2 !== 0) return false;

  let minOpen = 0; // minimum possible unmatched '('
  let maxOpen = 0; // maximum possible unmatched '('

  for (let i = 0; i < n; i++) {
    if (locked[i] === '1') {
      if (s[i] === '(') { minOpen++; maxOpen++; }
      else              { minOpen--; maxOpen--; }
    } else {
      // Unlocked: can be '(' (+1) or ')' (-1)
      minOpen--;
      maxOpen++;
    }

    if (maxOpen < 0) return false;         // Too many ')' in any scenario
    minOpen = Math.max(minOpen, 0);        // Can't have negative open count
  }

  return minOpen === 0;
}

// === Test Cases ===
console.log(canBeValid('))]]', '0000'));          // true
console.log(canBeValid(')', '0'));                // false  (odd length)
console.log(canBeValid('()', '11'));              // true   (locked valid)
console.log(canBeValid(')(', '00'));              // true   (swap both)
console.log(canBeValid(')(', '11'));              // false  (locked invalid)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) | Greedy | Medium |
| [Minimum Number of Swaps to Make String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | Two Pointers | Medium |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | Monotonic Stack | Medium |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters) | Monotonic Stack | Medium |
