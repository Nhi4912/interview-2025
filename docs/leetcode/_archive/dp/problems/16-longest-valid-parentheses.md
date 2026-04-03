---
layout: page
title: "Longest Valid Parentheses"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Stack]
leetcode_url: "https://leetcode.com/problems/longest-valid-parentheses"
---

# Longest Valid Parentheses / Chuỗi Ngoặc Hợp Lệ Dài Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack-based Index Tracking / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Valid Parentheses](https://leetcode.com/problems/valid-parentheses) | [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng bạn đang kiểm tra dây chuyền sản xuất. Mỗi sản phẩm `(` cần một cái nắp `)`. Bạn dùng một chồng đĩa (stack) để theo dõi vị trí còn thiếu nắp. Khi ghép được, độ dài đoạn hợp lệ = vị trí hiện tại − vị trí đĩa dưới cùng trên chồng (baseline chưa ghép được).

**Pattern Recognition:**

- Signal: "longest valid substring" + "parentheses" → **Stack with index** or **DP**
- Stack lưu _chỉ số_ (không phải ký tự), dùng stack[-1] làm base cho chuỗi hiện tại
- DP: `dp[i]` = độ dài chuỗi hợp lệ kết thúc tại vị trí `i`

**Visual — Stack approach on ")()())":**

```
s:     )   (   )   (   )   )
idx:   0   1   2   3   4   5

stack starts: [-1]   ← sentinel base

i=0 ')': stack=[-1], no '(' to match → pop(-1), push(0) → stack=[0]
i=1 '(': push idx  → stack=[0,1]
i=2 ')': pop(1), stack=[0] → len = 2-0 = 2, max=2
i=3 '(': push idx  → stack=[0,3]
i=4 ')': pop(3), stack=[0] → len = 4-0 = 4, max=4
i=5 ')': stack=[0], pop(0), stack=[] → push(5) → stack=[5]

Result: max = 4 ✅  ("()()" from index 1-4)
```

---

## Problem Description

Given a string containing only `'('` and `')'`, return the length of the longest valid (well-formed) parentheses substring. ([LeetCode 32](https://leetcode.com/problems/longest-valid-parentheses))

```
Input: s = "(()"     → Output: 2   ("()" at index 1-2)
Input: s = ")()())"  → Output: 4   ("()()" at index 1-4)
Input: s = ""        → Output: 0
```

Constraints: `0 <= s.length <= 3×10⁴`, only `(` and `)`

---

## 📝 Interview Tips

1. **Clarify**: "Cần substring liên tiếp, không phải subsequence / Must be contiguous substring, not subsequence"
2. **Stack key insight**: "Lưu INDEX vào stack, không phải ký tự — index giúp tính độ dài" / Store indices, not chars
3. **Sentinel**: "Khởi tạo stack với [-1] để tính độ dài chuỗi bắt đầu từ đầu" / Sentinel avoids edge case at start
4. **DP approach**: "dp[i]=0 nếu s[i]='(' hoặc s[i-1]='(' không match / Set dp[i]=0 for '(' or unmatched ')'"
5. **Two-pass**: "Scan trái-phải và phải-trái với 2 counters, O(1) space" / Left-right pass O(n) time O(1) space
6. **Edge cases**: "Chuỗi rỗng, all '(', all ')'" / Empty, all-open, all-close

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Check all substrings
 * Name: Brute Force Validation
 * Time: O(n³) — O(n²) substrings × O(n) validation each
 * Space: O(n) — stack for validation
 */
function longestValidParenthesesBrute(s: string): number {
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 2; j <= s.length; j += 2) {
      if (isValid(s.slice(i, j))) max = Math.max(max, j - i);
    }
  }
  return max;
}
function isValid(sub: string): boolean {
  let open = 0;
  for (const c of sub) {
    if (c === "(") open++;
    else if (--open < 0) return false;
  }
  return open === 0;
}

/**
 * Solution 2: Stack with Index Tracking (Recommended)
 * Name: Stack Index
 * Time: O(n) — single pass
 * Space: O(n) — stack
 */
function longestValidParentheses(s: string): number {
  let max = 0;
  const stack: number[] = [-1]; // sentinel base index

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else {
      stack.pop(); // try to match
      if (stack.length === 0) {
        stack.push(i); // new base: this ')' is unmatched
      } else {
        max = Math.max(max, i - stack[stack.length - 1]);
      }
    }
  }

  return max;
}

/**
 * Solution 3: Dynamic Programming
 * Name: DP on ')' characters
 * Time: O(n) — single pass
 * Space: O(n) — dp array
 */
function longestValidParenthesesDP(s: string): number {
  const n = s.length;
  const dp = new Array(n).fill(0); // dp[i] = length of longest valid ending at i
  let max = 0;

  for (let i = 1; i < n; i++) {
    if (s[i] === ")") {
      if (s[i - 1] === "(") {
        // case: "...()"
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
      } else if (dp[i - 1] > 0) {
        // case: "...))"  — check char before the inner valid substring
        const j = i - dp[i - 1] - 1;
        if (j >= 0 && s[j] === "(") {
          dp[i] = dp[i - 1] + 2 + (j >= 1 ? dp[j - 1] : 0);
        }
      }
      max = Math.max(max, dp[i]);
    }
  }

  return max;
}

// === Test Cases ===
console.log(longestValidParentheses("(()")); // 2
console.log(longestValidParentheses(")()())")); // 4
console.log(longestValidParentheses("")); // 0
console.log(longestValidParenthesesDP("(()()()")); // 6
console.log(longestValidParenthesesDP("))((")); // 0
console.log(longestValidParenthesesBrute("()(()")); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Relationship                                 |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)                                                 | Simpler: just validate, don't measure length |
| [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid)         | Count imbalance instead of length            |
| [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses)                               | BFS to find all minimal removals             |
| [Score of Parentheses](https://leetcode.com/problems/score-of-parentheses)                                           | Stack-based scoring of nested parens         |
| [Minimum Deletions to Make String Balanced](https://leetcode.com/problems/minimum-deletions-to-make-string-balanced) | DP on balance counts                         |
