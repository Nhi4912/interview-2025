---
layout: page
title: "Valid Parenthesis String"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/valid-parenthesis-string"
---

# Valid Parenthesis String / Chuỗi Ngoặc Hợp Lệ Với Dấu Sao

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm tiền dự phòng — `*` là tờ tiền linh hoạt (có thể dùng mở, đóng, hoặc không dùng). Bạn track phạm vi [minOpen, maxOpen] của số ngoặc mở còn đang chờ đóng.

**Pattern Recognition:**

- Signal: `*` wildcard + parentheses validity → **Greedy với range tracking**
- Nếu `maxOpen < 0` → không thể valid; Nếu `minOpen < 0` → clamp về 0
- Key insight: Không cần biết `*` là gì — chỉ cần track khoảng giá trị có thể của số ngoặc mở

**Visual — s="(\*)":**

```
Char  minOpen  maxOpen   Meaning
"("     1        1       must have 1 open
"*"     0        2       * can be ')', '', or '('  → min-1, max+1 → clamp min to 0
")"    -1→0      1       close one open → min-1(clamp), max-1=1
End: minOpen==0 → VALID ✓
```

---

## Problem Description

Given string `s` containing `(`, `)`, and `*`, where `*` can be treated as `(`, `)`, or empty string, return true if `s` can be valid parentheses. ([LeetCode 678](https://leetcode.com/problems/valid-parenthesis-string))

- Example 1: `"(*)"` → `true`
- Example 2: `"(*))"` → `true` (`*` = empty or `(`)
- Example 3: `"(((******)))"` → `true`

Constraints: `1 ≤ s.length ≤ 100`, `s[i]` is `(`, `)`, or `*`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu s rỗng có valid không?" / Is empty string valid? (Yes — convention)
2. **Brute force**: "Với mỗi `*`, thử 3 khả năng — O(3^k) với k là số `*`" / Try all combinations for each star
3. **Greedy key**: "Track [minOpen, maxOpen] thay vì một giá trị duy nhất" / Maintain possible range of open counts
4. **Clamp**: "`minOpen = Math.max(0, minOpen)` khi trừ — không để âm" / Floor at 0, negative is impossible
5. **DP alt**: "`dp[i][j]` = có thể có j open parens sau i chars — O(n²)" / DP is O(n²), greedy is O(n)
6. **End check**: "Kết thúc hợp lệ khi `minOpen == 0`" / Valid iff minOpen reaches 0 at end

---

## Solutions

```typescript
/**
 * Solution 1: DP — dp[j] = can we have exactly j open parens after i chars
 * Time: O(n²)
 * Space: O(n)
 */
function checkValidStringDP(s: string): boolean {
  const n = s.length;
  // dp[j] = true if j open parens is achievable at current position
  let dp = new Set<number>([0]);

  for (const ch of s) {
    const next = new Set<number>();
    for (const open of dp) {
      if (ch === "(" || ch === "*") next.add(open + 1);
      if (ch === ")" || ch === "*") {
        if (open > 0) next.add(open - 1);
      }
      if (ch === "*") next.add(open); // * = empty
    }
    dp = next;
  }

  return dp.has(0);
}

/**
 * Solution 2: Greedy — track [minOpen, maxOpen] range
 * Time: O(n)
 * Space: O(1)
 */
function checkValidString(s: string): boolean {
  let minOpen = 0; // minimum possible open parens pending
  let maxOpen = 0; // maximum possible open parens pending

  for (const ch of s) {
    if (ch === "(") {
      minOpen++;
      maxOpen++;
    } else if (ch === ")") {
      minOpen--;
      maxOpen--;
    } else {
      // '*' can be '(', ')', or ''
      minOpen--;
      maxOpen++;
    }
    // maxOpen < 0 means too many ')' even with all '*' as '('
    if (maxOpen < 0) return false;
    // minOpen can't go below 0 — clamp (star as ')' is optional)
    minOpen = Math.max(0, minOpen);
  }

  // Valid if it's possible to have 0 unmatched open parens
  return minOpen === 0;
}

// === Test Cases ===
console.log(checkValidString("(*)")); // true
console.log(checkValidString("(*))")); // true
console.log(checkValidString("((*)")); // true
console.log(checkValidString("((((*)")); // false
```

---

## 🔗 Related Problems

- [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses) — longest valid substring
- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — `*` wildcard DP matching
- [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid) — min additions
- [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses) — remove minimal characters
- [Balance a Parentheses String](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) — swaps variant
