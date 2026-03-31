---
layout: page
title: "Parsing A Boolean Expression"
difficulty: Hard
category: String
tags: [String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/parsing-a-boolean-expression"
---

# Parsing A Boolean Expression / Phân Tích Biểu Thức Boolean

🔴 Hard

## 🧠 Intuition

> **Phép so sánh:** Giống máy tính tay — mỗi khi gặp `(`, mở ngoặc mới; khi gặp `)`, tính kết quả rồi đóng lại. Toán tử `!`, `&`, `|` áp dụng lên tập giá trị bên trong.

```
Expression: |(f,&(t,f))
Stack:
 push '|'
 push '('
 push 'f'
 push '&'
 push '('
 push 't', 'f'
 ')' → pop to '(' → & → false → push 'f'
 ')' → pop to '(' → | → false
Result: false
```

## Problem Description

Return the result of evaluating a boolean expression string. An expression is one of:

- `"t"` → true, `"f"` → false
- `"!(e)"` → logical NOT
- `"&(e1,e2,...)"` → logical AND of all sub-expressions
- `"|(e1,e2,...)"` → logical OR of all sub-expressions

**Example 1:** `"!(f)"` → `true`

**Example 2:** `"|(f,f,f)"` → `false`

**Example 3:** `"&(|(f))"` → `false`

**Constraints:** `1 <= expression.length <= 20000`

## 📝 Interview Tips

- **Pattern signal:** Nested/recursive structure → Stack hoặc Recursive Descent Parser
- **Stack trick:** Push operator trước `(`, khi gặp `)` pop cho đến `(` để thu thập operands
- **Recursion trick:** Dùng shared index pointer; mỗi lần gọi đệ quy tiêu thụ một token
- **`!` edge case:** Luôn có đúng 1 argument — xử lý giống `&`/`|` vẫn đúng
- **Complexity:** O(n) time, O(n) space — mỗi ký tự xử lý tối đa 1 lần
- **Interview insight:** Đây là Recursive Descent Parser — mẫu phổ biến trong compiler design

## Solutions

### Solution 1: Stack (Iterative) — O(n) time, O(n) space

```typescript
function parseBoolExpr(expression: string): boolean {
  const stack: string[] = [];

  for (const ch of expression) {
    if (ch === ",") continue;
    if (ch !== ")") {
      stack.push(ch);
    } else {
      const values: string[] = [];
      while (stack[stack.length - 1] !== "(") {
        values.push(stack.pop()!);
      }
      stack.pop(); // remove '('
      const op = stack.pop()!; // remove operator

      let result: string;
      if (op === "!") {
        result = values[0] === "t" ? "f" : "t";
      } else if (op === "&") {
        result = values.every((v) => v === "t") ? "t" : "f";
      } else {
        // '|'
        result = values.some((v) => v === "t") ? "t" : "f";
      }
      stack.push(result);
    }
  }

  return stack[0] === "t";
}
```

### Solution 2: Recursive Descent Parser — O(n) time, O(n) space

```typescript
function parseBoolExpr(expression: string): boolean {
  let idx = 0;

  function parse(): boolean {
    const ch = expression[idx++];
    if (ch === "t") return true;
    if (ch === "f") return false;

    // ch is '!', '&', or '|'
    idx++; // skip '('
    const results: boolean[] = [];

    while (expression[idx] !== ")") {
      if (expression[idx] === ",") idx++;
      results.push(parse());
    }
    idx++; // skip ')'

    if (ch === "!") return !results[0];
    if (ch === "&") return results.every(Boolean);
    return results.some(Boolean); // '|'
  }

  return parse();
}
```

### Solution 3: Stack with bitmask — O(n) time, O(n) space

```typescript
function parseBoolExpr(expression: string): boolean {
  const stack: string[] = [];

  for (const ch of expression) {
    if (ch === ",") continue;
    if (ch !== ")") {
      stack.push(ch);
      continue;
    }

    let hasTrue = false,
      hasFalse = false;
    while (stack[stack.length - 1] !== "(") {
      const v = stack.pop()!;
      if (v === "t") hasTrue = true;
      if (v === "f") hasFalse = true;
    }
    stack.pop(); // '('
    const op = stack.pop()!;

    if (op === "!") stack.push(hasTrue ? "f" : "t");
    else if (op === "&") stack.push(hasFalse ? "f" : "t");
    else stack.push(hasTrue ? "t" : "f");
  }

  return stack[0] === "t";
}
```

## 🔗 Related Problems

| #   | Problem               | Difficulty | Tags             |
| --- | --------------------- | ---------- | ---------------- |
| 224 | Basic Calculator      | Hard       | Stack, Math      |
| 227 | Basic Calculator II   | Medium     | Stack            |
| 394 | Decode String         | Medium     | Stack, Recursion |
| 736 | Parse Lisp Expression | Hard       | Stack, Recursion |
