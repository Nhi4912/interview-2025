---
layout: page
title: "Minimum Remove to Make Valid Parentheses"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses"
---

# Minimum Remove to Make Valid Parentheses / Xoá Tối Thiểu Để Ngoặc Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống dọn dẹp văn bản pháp lý — dấu ngoặc thừa cần bị xoá. Dùng stack lưu **index** của `(` chưa được đóng, sau đó đánh dấu các index đó + mọi `)` thừa để bỏ qua khi build kết quả.

**Pattern Recognition:**

- Tìm ngoặc "mồ côi" → Stack lưu index của `(` chưa khớp
- Gặp `)` không có `(` nào pending → đánh dấu remove ngay
- Cuối: index còn trong stack = `(` dư → đánh dấu remove

```
s = "lee(t(c)o)de)"
idx: 0123456789...

Pass 1 — track unmatched:
i=3 '(':  stack=[3]
i=5 '(':  stack=[3,5]
i=7 ')':  pop 5 → stack=[3]  (matched pair 5-7)
i=9 ')':  pop 3 → stack=[]   (matched pair 3-9)
i=12')':  stack empty → mark idx 12 as remove

removeSet = {12}  (unmatched ')')
remaining stack = {} (all '(' were matched)

Pass 2 — build result:
skip index 12 → "lee(t(c)o)de" ✅
```

---

## Problem Description

Given string `s` with lowercase letters and parentheses, remove the **minimum** number of parentheses to make it valid (every `(` has a matching `)` and vice versa). Return any valid result.

**Examples:**

- `s = "lee(t(c)o)de)"` → `"lee(t(c)o)de"`
- `s = "a)b(c)d"` → `"ab(c)d"`
- `s = "))(("` → `""`

**Constraints:** `1 ≤ s.length ≤ 10^5`, lowercase letters and `()` only

---

## 📝 Interview Tips

- 🇻🇳 Stack lưu **index** (không phải char) để biết vị trí cần xoá
- 🇺🇸 Two-pass approach: mark indices to remove, then build filtered string
- 🇻🇳 Gặp `)` mà stack rỗng → thêm index vào `removeSet` ngay
- 🇺🇸 After scan: all remaining indices in stack are unmatched `(` → add to remove set
- 🇻🇳 Dùng `Set<number>` để O(1) lookup khi build kết quả
- 🇺🇸 Can also do two-pass string sweep (left-to-right, then right-to-left) without stack

---

## Solutions

### Solution 1 — Stack of Indices + Remove Set

```typescript
/**
 * Track unmatched parenthesis indices, build result skipping them
 * Time: O(n) — two passes
 * Space: O(n) — stack + remove set
 */
function minRemoveToMakeValid(s: string): string {
  const stack: number[] = []; // indices of unmatched '('
  const remove = new Set<number>();

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(") {
      stack.push(i);
    } else if (ch === ")") {
      if (stack.length > 0) {
        stack.pop(); // matched '(' found
      } else {
        remove.add(i); // unmatched ')' — mark for removal
      }
    }
  }

  // All remaining '(' in stack are unmatched
  for (const idx of stack) remove.add(idx);

  // Build result skipping removed indices
  const result: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (!remove.has(i)) result.push(s[i]);
  }

  return result.join("");
}

// Test cases
console.log(minRemoveToMakeValid("lee(t(c)o)de)")); // "lee(t(c)o)de"
console.log(minRemoveToMakeValid("a)b(c)d")); // "ab(c)d"
console.log(minRemoveToMakeValid("))((")); // ""
console.log(minRemoveToMakeValid("(a(b(c)d)")); // "a(b(c)d)" or similar valid
```

### Solution 2 — Two-Pass String Sweep (No Stack)

```typescript
/**
 * Left-to-right pass removes unmatched ')'; right-to-left removes unmatched '('
 * Time: O(n), Space: O(n)
 */
function minRemoveToMakeValid2(s: string): string {
  // Pass 1: remove unmatched ')'
  let open = 0;
  let temp = "";
  for (const ch of s) {
    if (ch === "(") {
      open++;
      temp += ch;
    } else if (ch === ")") {
      if (open > 0) {
        open--;
        temp += ch;
      }
      // else: skip unmatched ')'
    } else {
      temp += ch;
    }
  }

  // Pass 2: remove unmatched '(' (right-to-left, so remove trailing ones)
  let close = 0;
  let result = "";
  for (let i = temp.length - 1; i >= 0; i--) {
    const ch = temp[i];
    if (ch === ")") {
      close++;
      result = ch + result;
    } else if (ch === "(") {
      if (close > 0) {
        close--;
        result = ch + result;
      }
      // else: skip unmatched '('
    } else {
      result = ch + result;
    }
  }
  return result;
}

console.log(minRemoveToMakeValid2("lee(t(c)o)de)")); // "lee(t(c)o)de"
console.log(minRemoveToMakeValid2("))((")); // ""
```

---

## 🔗 Related Problems

- [20 - Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — check validity (simpler)
- [32 - Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) — find longest valid substr
- [301 - Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) — return all minimal results (BFS)
- [1209 - Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/) — stack for removal
