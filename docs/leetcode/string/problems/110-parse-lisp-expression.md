---
layout: page
title: "Parse Lisp Expression"
difficulty: Hard
category: String
tags: [Hash Table, String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/parse-lisp-expression"
---

# Parse Lisp Expression / Phân Tích Biểu Thức Lisp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Recursive Descent Parser + Scoped Variables
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> Giống như đọc một cây thư mục lồng nhau — mỗi cặp ngoặc `(...)` tạo ra một phạm vi (scope) riêng. Biến trong scope trong sẽ ẩn biến scope ngoài. Khi ra khỏi scope, biến đó biến mất. Đây là bài phân tích cú pháp đệ quy cổ điển.

**Pattern Recognition:**

- Signal: "nested expression" + "scoped variables" → **Recursive Parser + Scope Stack**
- Ba loại biểu thức: `(let ...)`, `(add ...)`, `(mult ...)`
- Dùng Map theo scope (hoặc copy-on-enter) để xử lý variable shadowing

**Visual:**

```
"(let x 2 (mult x (let x 3 y 4 (add x y))))"
  Outer scope: x=2
    Inner let: x=3, y=4
      (add x y) → 3+4=7
    (mult 2 7) → 14
result = 14

Parse flow: read token → if '(' → check keyword → recurse
```

## Problem Description

Evaluate a Lisp expression string. Supported operations: `(let v1 e1 v2 e2 ... expr)` assigns variables then evaluates last expression; `(add e1 e2)` returns sum; `(mult e1 e2)` returns product. Variables shadow outer scope.

- **Example 1**: `"(add 1 2)"` → `3`
- **Example 2**: `"(let x 2 (mult x (let x 3 y 4 (add x y))))"` → `14`

**Constraints**: `3 <= expression.length <= 2000`, expression is always valid, integer values in `[-1000, 1000]`.

## 📝 Interview Tips

1. **Clarify**: "Variable names luôn là chữ thường? Số có thể âm không?" / Lowercase var names, integers can be negative
2. **Approach**: "Viết recursive parser với scope map (pass by value hoặc undo changes)" / Recursive descent with scope restoration
3. **Edge cases**: "Variable shadowing: inner `x` ẩn outer `x`; `let` với 0 bindings" / Variable shadowing must work correctly
4. **Optimize**: "Copy scope vào mỗi recursive call là đơn giản nhất, dù O(n) space mỗi call" / Copying scope is simplest, undo-map is more space efficient
5. **Test**: `"(let x 2 x)"` → 2; `"(add (let x 1 x) x)"` → ERROR (x not in outer scope)
6. **Follow-up**: "Thêm toán tử `div`, `mod`, hoặc `if`?" / Extending with more operators

## Solutions

```typescript
/** Solution 1: Recursive Descent Parser — copy scope each call
 * Time: O(n²) worst | Space: O(n·d) — d=nesting depth
 */
function parseLispExpressionCopy(expression: string): number {
  let pos = 0;

  function parseExpr(scope: Map<string, number>): number {
    if (expression[pos] === "(") {
      pos++; // skip '('
      let result: number;
      if (expression.startsWith("let", pos)) {
        pos += 3;
        pos++; // skip 'let '
        const newScope = new Map(scope);
        while (true) {
          // peek: if next token is the last expr (starts with '(' or '-' or digit or unknown var followed by ')'), eval it
          const saved = pos;
          const name = readToken();
          if (
            expression[pos] === ")" ||
            expression[pos - 1] === ")" ||
            name.startsWith("(") ||
            /^-?\d/.test(name)
          ) {
            // It's the final expression — re-parse it
            pos = saved;
            result = parseExpr(newScope);
            break;
          }
          pos++; // skip space
          const val = parseExpr(newScope);
          newScope.set(name, val);
          pos++; // skip space
        }
      } else if (expression.startsWith("add", pos)) {
        pos += 3;
        pos++;
        const a = parseExpr(scope);
        pos++;
        const b = parseExpr(scope);
        result = a + b;
      } else {
        // mult
        pos += 4;
        pos++;
        const a = parseExpr(scope);
        pos++;
        const b = parseExpr(scope);
        result = a * b;
      }
      pos++; // skip ')'
      return result!;
    } else {
      // number or variable
      const token = readToken();
      if (/^-?\d+$/.test(token)) return parseInt(token);
      return scope.get(token)!;
    }
  }

  function readToken(): string {
    let end = pos;
    while (end < expression.length && expression[end] !== " " && expression[end] !== ")") end++;
    const token = expression.slice(pos, end);
    pos = end;
    return token;
  }

  return parseExpr(new Map());
}

/** Solution 2: Clean Recursive Parser — index-based, cleaner structure
 * Time: O(n²) | Space: O(n·d)
 */
function parseLispExpression(expression: string): number {
  let i = 0;

  function parse(scope: Map<string, number>): number {
    if (expression[i] === "(") {
      i++; // consume '('
      let res: number;
      if (expression[i] === "l") {
        // let
        i += 4; // skip 'let '
        const localScope = new Map(scope);
        while (true) {
          if (expression[i] === "(" || expression[i] === "-" || /\d/.test(expression[i])) {
            res = parse(localScope);
            break;
          }
          const j = expression.indexOf(" ", i);
          const varName = expression.slice(i, j);
          i = j + 1;
          const val = parse(localScope);
          localScope.set(varName, val);
          if (expression[i] === " ") i++;
          // If next is the final expression
          if (expression[i] === "(" || expression[i] === "-" || /\d/.test(expression[i])) {
            res = parse(localScope);
            break;
          }
          // Check if varName is actually the final expr (lowercase word)
          const peekJ = expression.indexOf(" ", i);
          const peekEnd = expression.indexOf(")", i);
          if (peekJ === -1 || peekEnd < peekJ) {
            res = parse(localScope);
            break;
          }
        }
      } else if (expression[i] === "a") {
        // add
        i += 4; // skip 'add '
        const a = parse(scope);
        i++;
        const b = parse(scope);
        res = a + b;
      } else {
        // mult
        i += 5; // skip 'mult '
        const a = parse(scope);
        i++;
        const b = parse(scope);
        res = a * b;
      }
      i++; // consume ')'
      return res!;
    } else {
      // read until space or ')'
      let j = i;
      while (j < expression.length && expression[j] !== " " && expression[j] !== ")") j++;
      const token = expression.slice(i, j);
      i = j;
      if (/^-?\d+$/.test(token)) return parseInt(token);
      return scope.get(token)!;
    }
  }

  return parse(new Map());
}

// Test cases
console.log(parseLispExpression("(add 1 2)")); // 3
console.log(parseLispExpression("(mult 3 (add 2 3))")); // 15
console.log(parseLispExpression("(let x 2 (mult x 5))")); // 10
console.log(parseLispExpression("(let x 2 (mult x (let x 3 y 4 (add x y))))")); // 14
```

## 🔗 Related Problems

| Problem                                                                    | Relationship                                  |
| -------------------------------------------------------------------------- | --------------------------------------------- |
| [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii) | Recursive expression parser without variables |
| [Decode String](https://leetcode.com/problems/decode-string)               | Recursive/stack parsing of nested strings     |
| [Basic Calculator IV](https://leetcode.com/problems/basic-calculator-iv)   | Symbolic expression evaluation                |
