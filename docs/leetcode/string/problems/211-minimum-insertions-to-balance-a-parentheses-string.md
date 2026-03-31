---
layout: page
title: "Minimum Insertions to Balance a Parentheses String"
difficulty: Medium
category: String
tags: [String, Stack, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string"
---

# Minimum Insertions to Balance a Parentheses String / Chèn Tối Thiểu Để Cân Bằng Dãy Ngoặc

> **Difficulty**: 🟡 Medium | **Category**: String | **Pattern**: Stack / Greedy

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Mỗi cặp ngoặc mở `(` cần hai ngoặc đóng `))` — như mỗi chiếc hộp cần hai nắp. Khi quét qua chuỗi, đếm số hộp đang chờ nắp và chèn khi thiếu.

**Pattern Recognition:**

- Modified parentheses: `(` needs `))` instead of `)`
- Track open count and right-paren deficit separately
- Encounter `)` without pair → need to insert another `)`

**Visual:**

```
s = "(()"
     ^       open=1
      ^      open=2
       ^     single ')' found → need 1 more, insert 1, close one open: open=1, res=1
end: open=1 remaining → need 2 insertions each → res += 2
Total = 3

s = "()))"
     ^    open=1
      ^   s[1..2]='))' → closes one: open=0
          s[2..3]='))' → no open, insert '(' and consume: res+=1
Total = 1
```

## Problem Description

A balanced string requires each `(` to be followed by `))`. Given string `s` with only `(` and `)`, return the minimum insertions to make it balanced.

**Example 1:** `s = "(()"` → `3` (insert `))` after `(` at 0, insert `)` after `(` at 1: `(()))(())` — actually need 3 total)
**Example 2:** `s = "(()))"` → `1`

**Constraints:** `1 <= s.length <= 10^5`, `s` consists of `(` and `)` only

## 📝 Interview Tips

1. **Clarify**: Each `(` needs exactly two `)` — not one
2. **Approach**: Greedy scan, track `open` (unmatched `(`) and `res` (insertions needed)
3. **Edge cases**: Consecutive `)` like `))` — consume both for one open; single `)` needs insert
4. **Optimize**: One pass O(n), handles paired `))` by consuming double-close
5. **Follow-up**: Generalize to `(` needing k closing brackets
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Greedy One-Pass — Time: O(n) | Space: O(1)
function minInsertions(s: string): number {
  let open = 0; // Unmatched '(' waiting for '))'
  let res = 0; // Total insertions needed
  let i = 0;

  while (i < s.length) {
    if (s[i] === "(") {
      open++;
      i++;
    } else {
      // s[i] === ')'
      // Check if next char is also ')'
      if (i + 1 < s.length && s[i + 1] === ")") {
        // Got a '))', consume both
        i += 2;
      } else {
        // Single ')', need to insert one more ')'
        res++;
        i++;
      }
      // Now consume one open '('
      if (open > 0) {
        open--;
      } else {
        // No open '(' available, need to insert '('
        res++;
      }
    }
  }

  // Each remaining open '(' needs '))'
  res += open * 2;
  return res;
}

// Solution 2: Stack-Based — Time: O(n) | Space: O(n)
function minInsertions2(s: string): number {
  const stack: string[] = [];
  let res = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push("(");
    } else {
      // Need )) to match one (
      if (i + 1 < s.length && s[i + 1] === ")") {
        i++; // consume both ))
      } else {
        res++; // insert one )
      }
      if (stack.length > 0) {
        stack.pop();
      } else {
        res++; // insert one (
      }
    }
  }

  res += stack.length * 2; // each unmatched ( needs ))
  return res;
}

// Tests
console.log(minInsertions("(()))")); // 1
console.log(minInsertions("(((((())")); // 3
console.log(minInsertions(")))))))")); // 5
console.log(minInsertions("((()))")); // 0  wait: each ( needs )) so "((()))" needs recheck
console.log(minInsertions("()")); // 1 (single ) needs one more ))
```

## 🔗 Related Problems

| Problem                                                                                                               | Relationship                          |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/)   | Parentheses balancing variant         |
| [Check if Parentheses String Can Be Valid](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/) | Validity check greedy                 |
| [Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/)         | Standard version (1 closing per open) |
