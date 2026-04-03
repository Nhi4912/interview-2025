---
layout: page
title: "Ternary Expression Parser"
difficulty: Medium
category: String
tags: [String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/ternary-expression-parser"
---

# Ternary Expression Parser / Ternary Expression Parser

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack / Recursion
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Basic Calculator](https://leetcode.com/problems/basic-calculator)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đọc hướng dẫn if-else lồng nhau từ trong ra ngoài — điều kiện sâu nhất (bên phải nhất) được quyết định trước, rồi kết quả đó được dùng cho tầng ngoài. Stack hoặc đệ quy xử lý tự nhiên cấu trúc lồng này.

**Visual — Recursive parse or right-to-left stack:**

```
Expression: "F?1:T?4:5"
             0123456789

Recursive (left-to-right):
  parse(i=0): val='F', s[1]='?' → recurse
    trueVal = parse(i=2): val='1', s[3]≠'?' → return '1'
    skip ':', i=4
    falseVal = parse(i=4): val='T', s[5]='?' → recurse
      trueVal = parse(i=6): val='4', s[7]≠'?' → return '4'
      skip ':', i=8
      falseVal = parse(i=8): val='5' → return '5'
      cond='T' → return '4'
    cond='F' → return '4'
  Result: "4" ✅

Stack (right-to-left):
Push: 5 → [:] → 4 → [?] → T → [:] → 1 → [?] → F
When we see '?': pop cond, pop '?', pop true, pop ':', pop false
  T?4:5 → '4' (push '4')
  F?1:4 → '4' (push '4')
```

---

## Problem Description

Given a valid ternary expression string (format: `cond?trueExpr:falseExpr`, where `cond` is `'T'` or `'F'`, and expressions can be nested), evaluate and return the result as a single character.

**Example 1:** `"T?2:3"` → `"2"`
**Example 2:** `"F?1:T?4:5"` → `"4"` (inner `T?4:5` evaluates to `"4"`, outer `F` picks falseExpr)

Constraints: `5 <= expression.length <= 10^4`, valid input guaranteed, each value/condition is a single character.

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi toán hạng là 1 ký tự (digit hoặc T/F), lồng nhau tùy ý" / Each operand is a single char; nesting depth is arbitrary
2. **Recursion**: "Đệ quy tự nhiên cho cấu trúc lồng — mỗi lần gặp '?' tạo ra một nhánh" / Recursion is natural: each '?' spawns a branch
3. **Stack right-to-left**: "Đọc từ phải sang trái, khi gặp '?' xử lý top 3 phần tử stack" / Process right-to-left; on '?', evaluate top of stack
4. **Complexity**: "O(n) thời gian và không gian — mỗi ký tự xử lý đúng 1 lần" / O(n) time and space — each char processed exactly once
5. **Edge cases**: "Biểu thức đơn giản không có '?'; lồng sâu nhiều tầng" / Simple expression with no nesting; deeply nested expression
6. **Follow-up**: "Nếu toán hạng là số nhiều chữ số? → cần parse number, stack vẫn dùng được" / Multi-digit numbers → parse them; stack approach still works

---

## Solutions

```typescript
/**
 * Solution 1: Recursive descent parser
 * Consume the expression left-to-right with a shared index.
 * If next char is '?', recursively evaluate true and false branches.
 * Time: O(n) — each character visited once
 * Space: O(n) — recursion stack depth proportional to nesting depth
 */
function parseTernaryRecursive(expression: string): string {
  let i = 0;

  function parse(): string {
    const val = expression[i++];
    if (i < expression.length && expression[i] === '?') {
      i++; // skip '?'
      const trueVal = parse();
      i++; // skip ':'
      const falseVal = parse();
      return val === 'T' ? trueVal : falseVal;
    }
    return val;
  }

  return parse();
}

/**
 * Solution 2: Stack — process right-to-left
 * Push chars onto stack. When encountering a condition char followed by '?',
 * pop true and false branches and push result.
 * Time: O(n) — one pass right-to-left
 * Space: O(n) — stack
 */
function parseTernary(expression: string): string {
  const stack: string[] = [];

  for (let i = expression.length - 1; i >= 0; i--) {
    const c = expression[i];

    if (stack.length > 0 && stack[stack.length - 1] === '?') {
      stack.pop(); // remove '?'
      const trueVal = stack.pop()!;
      stack.pop(); // remove ':'
      const falseVal = stack.pop()!;
      stack.push(c === 'T' ? trueVal : falseVal);
    } else {
      stack.push(c);
    }
  }

  return stack[0];
}

// === Test Cases ===
console.log(parseTernary('T?2:3'));             // "2"
console.log(parseTernary('F?1:T?4:5'));         // "4"
console.log(parseTernary('T?T?F:5:3'));         // "F"  (T → inner T?F:5 → F)
console.log(parseTernary('F?F?1:2:T?3:4'));     // "3"
console.log(parseTernary('T?1:2'));             // "1"
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Decode String](https://leetcode.com/problems/decode-string) | Stack | Medium |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator) | Stack | Hard |
| [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii) | Stack | Hard |
| [Parse Lisp Expression](https://leetcode.com/problems/parse-lisp-expression) | Recursion | Hard |
