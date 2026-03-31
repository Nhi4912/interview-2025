---
layout: page
title: "Minimum Add to Make Parentheses Valid"
difficulty: Medium
category: String
tags: [String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid"
---

# Minimum Add to Make Parentheses Valid / Số Phép Thêm Tối Thiểu Để Ngoặc Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy Counter
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như kiểm tra số dư tài khoản khi mua hàng — bạn theo dõi số ngoặc mở chưa khớp (`open`) và số ngoặc đóng chưa khớp (`close`). Mỗi ngoặc thừa là một lần thêm cần thiết.

**Pattern Recognition:**

- Signal: "parentheses validity" + "minimum changes" → **Greedy Counter**
- Không cần Stack thực sự — chỉ cần 2 biến đếm
- `close`: gặp `)` mà không có `(` khớp → cần thêm `(`
- `open`: số `(` chưa khớp sau khi duyệt xong → cần thêm `)`

**Visual:**

```
s = "())"   open=0, close=0
  '(' → open=1
  ')' → open>0 → open=0 (matched)
  ')' → open=0 → close=1 (unmatched close)
result = open + close = 0 + 1 = 1

s = "(((" → open=3, close=0 → result=3
```

## Problem Description

A parentheses string is valid if every open bracket has a matching close bracket. Given string `s` of `(` and `)`, return the **minimum** number of parentheses to add to make it valid.

- **Example 1**: `s = "())"` → `1`
- **Example 2**: `s = "((("` → `3`

**Constraints**: `1 <= s.length <= 1000`, `s[i]` is `'('` or `')'`.

## 📝 Interview Tips

1. **Clarify**: "Có thể thêm ở bất kỳ vị trí nào không?" / Can insert at any position
2. **Approach**: "Track 2 counters: unmatched `(` và unmatched `)` — sum là đáp án" / Two counters instead of full stack
3. **Edge cases**: `""` → 0; `"()"` → 0; `")("` → 2 (cần thêm `(` trước và `)` sau)
4. **Optimize**: "Greedy O(n) time O(1) space — không cần Stack" / Constant space beats stack approach
5. **Test**: `")("` → 2, `"()()"` → 0, `"((()"` → 2
6. **Follow-up**: "Minimum removals instead of additions?" / LeetCode 1249 — similar with stack

## Solutions

```typescript
/** Solution 1: Stack — push '(' and count unmatched ')'
 * Time: O(n) | Space: O(n)
 */
function minimumAddToMakeParenthesesValidStack(s: string): number {
  const stack: string[] = [];
  let unmatched = 0;
  for (const c of s) {
    if (c === "(") {
      stack.push(c);
    } else {
      if (stack.length > 0) stack.pop();
      else unmatched++; // unmatched ')'
    }
  }
  return stack.length + unmatched; // remaining '(' + unmatched ')'
}

/** Solution 2: Greedy Counters — O(1) space
 * Time: O(n) | Space: O(1)
 */
function minimumAddToMakeParenthesesValid(s: string): number {
  let open = 0; // unmatched '(' needing ')'
  let close = 0; // unmatched ')' needing '('
  for (const c of s) {
    if (c === "(") {
      open++;
    } else {
      if (open > 0)
        open--; // match with existing '('
      else close++; // no '(' available → need to add one
    }
  }
  return open + close;
}

/** Solution 3: Balance tracking — track min/max valid open count
 * Time: O(n) | Space: O(1)
 */
function minimumAddBalance(s: string): number {
  let balance = 0;
  let additions = 0;
  for (const c of s) {
    balance += c === "(" ? 1 : -1;
    if (balance < 0) {
      additions++; // need to add '(' before this ')'
      balance = 0;
    }
  }
  return additions + balance; // balance = remaining unmatched '('
}

// Test cases
console.log(minimumAddToMakeParenthesesValid("())")); // 1
console.log(minimumAddToMakeParenthesesValid("(((")); // 3
console.log(minimumAddToMakeParenthesesValid("()")); // 0
console.log(minimumAddToMakeParenthesesValid(")(")); // 2
console.log(minimumAddToMakeParenthesesValid("(())")); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                                  | Relationship                       |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses)                       | Remove instead of add for validity |
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string)                                                       | Wildcard `*` can be either bracket |
| [Minimum Number of Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | Similar balance-tracking approach  |
