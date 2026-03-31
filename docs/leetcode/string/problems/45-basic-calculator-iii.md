---
layout: page
title: "Basic Calculator III"
difficulty: Hard
category: String
tags: [Math, String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/basic-calculator-iii"
---

# Basic Calculator III / Máy Tính Cơ Bản III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Basic Calculator](https://leetcode.com/problems/basic-calculator) | [Basic Calculator IV](https://leetcode.com/problems/basic-calculator-iv)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như kế toán xử lý hóa đơn có nhiều cấp ngoặc — khi gặp dấu `(`, họ mở một tập hồ sơ mới và làm bên trong trước, xong rồi mới cộng kết quả vào tập hồ sơ ngoài. Dấu `*` và `/` được ưu tiên cao hơn `+` và `-`, nên phải giải quyết ngay.

**Pattern Recognition:**

- Signal: "arithmetic expression" + "parentheses" + "operator precedence" → **Stack + Recursion**
- Dùng stack để lưu kết quả trước khi gặp `(`, pop ra khi gặp `)`
- Key insight: Xử lý `*`/`/` ngay lập tức (high precedence), còn `+`/`-` thì push lên stack

**Visual — Basic Calculator III:**

```
"2*(5+5*2)/3+(6/2+8)"
                                   stack
  2  →                             []
  *  →  prev_op = *                []
  (  →  push (2, *) and reset      [(2,*)]
  5  →                             [(2,*)]
  +  →  flush: stack=[5]           [(2,*)]
  5  →                             [(2,*)]
  *  →  prev_op = *                [(2,*)]
  2  →  prev_op=* → 5*2=10, update [(2,*)]
  )  →  sum stack = 5+10=15        []
       apply (2,*): 2*15=30        []
  /  →  prev_op = /                []
  3  →  30/3 = 10                  []
  +  →  push 10                    [10]
  ...
Result: 21
```

---

## Problem Description

Implement a basic calculator to evaluate a string expression `s` containing digits, `+`, `-`, `*`, `/`, `(`, `)`, and spaces. Integer division truncates toward zero.

**Example 1:** `"1 + 1"` → `2`
**Example 2:** `" 6-4 / 2 "` → `4`
**Example 3:** `"2*(5+5*2)/3+(6/2+8)"` → `21`
**Example 4:** `"(2+6*3+5-(3*14/7+2)*5)+3"` → `-12`

Constraints:

- `1 <= s.length <= 10^4`
- `s` is a valid expression with integers, operators, and parentheses
- All intermediate results fit in a 32-bit integer

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Có số âm trong input không? Có khoảng trắng không?" / **EN**: Clarify if negative numbers appear vs unary minus, and whitespace handling
2. **Brute force (VN)**: "Parse cây biểu thức (AST) rồi evaluate — đúng nhưng phức tạp" / **EN**: Build AST then evaluate — correct but heavy to code in interview
3. **Optimize (VN)**: "Stack giữ state trước dấu `(`, recursive call giải ngoặc" / **EN**: Stack saves outer context; recursion or stack for parentheses
4. **Precedence (VN)**: "`*`/`/` cần flush ngay; `+`/`-` push vào stack để cộng cuối" / **EN**: Apply `*`/`/` immediately; defer `+`/`-` by pushing to stack
5. **Edge cases (VN)**: "Dấu `-` unary không xuất hiện (input guaranteed valid)" / **EN**: Per constraints, no unary minus — only binary operators
6. **Follow-up (VN)**: "Basic Calculator I (chỉ `+`/`-`), II (thêm `*`/`/`, không ngoặc)" / **EN**: LC 224 = no `*`/`/`; LC 227 = `*`/`/` but no parens; this = full

---

## Solutions

```typescript
/**
 * Solution: Recursive descent with stack for precedence
 * Time: O(n) — each character processed once
 * Space: O(n) — recursion depth + stack proportional to nesting
 */
function calculate(s: string): number {
  let i = 0;

  function parseExpr(): number {
    const stack: number[] = [];
    let num = 0;
    let op = "+";

    while (i < s.length) {
      const c = s[i];

      if (c >= "0" && c <= "9") {
        num = num * 10 + (c.charCodeAt(0) - 48);
      }

      if (c === "(") {
        i++; // skip '('
        num = parseExpr(); // recursively evaluate inner expression
      }

      // Process when: operator, closing paren, or end of string
      if (((c < "0" || c > "9") && c !== " " && c !== "(") || i === s.length - 1) {
        if (op === "+") stack.push(num);
        else if (op === "-") stack.push(-num);
        else if (op === "*") stack.push(stack.pop()! * num);
        else if (op === "/") stack.push(Math.trunc(stack.pop()! / num));
        op = c;
        num = 0;
      }

      if (c === ")") break; // end of this sub-expression
      i++;
    }

    return stack.reduce((a, b) => a + b, 0);
  }

  return parseExpr();
}

/**
 * Solution 2: Iterative with explicit stack for parentheses
 * Time: O(n)
 * Space: O(n) — stack depth proportional to nesting level
 */
function calculateIterative(s: string): number {
  const stack: number[] = [];
  let result = 0;
  let num = 0;
  let sign = 1;

  // Only handles +/- with parentheses (simpler variant)
  // For full *// support, recursive approach above is cleaner
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= "0" && c <= "9") {
      num = num * 10 + Number(c);
    } else if (c === "+") {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (c === "-") {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (c === "(") {
      stack.push(result, sign);
      result = 0;
      sign = 1;
    } else if (c === ")") {
      result += sign * num;
      num = 0;
      result *= stack.pop()!; // sign before '('
      result += stack.pop()!; // result before '('
    }
  }
  return result + sign * num;
}

// === Test Cases ===
console.log(calculate("1 + 1")); // 2
console.log(calculate(" 6-4 / 2 ")); // 4
console.log(calculate("2*(5+5*2)/3+(6/2+8)")); // 21
console.log(calculate("(2+6*3+5-(3*14/7+2)*5)+3")); // -12
console.log(calculate("1*2-3/4+5*6-7*8+9/10")); // -24
```

---

## 🔗 Related Problems

| Problem                                                                               | Pattern      | Difficulty |
| ------------------------------------------------------------------------------------- | ------------ | ---------- |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                    | Stack        | 🔴 Hard    |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)              | Stack        | 🟡 Medium  |
| [Decode String](https://leetcode.com/problems/decode-string)                          | Stack        | 🟡 Medium  |
| [Expression Add Operators](https://leetcode.com/problems/expression-add-operators)    | Backtracking | 🔴 Hard    |
| [Basic Calculator III — LeetCode](https://leetcode.com/problems/basic-calculator-iii) | Stack        | 🔴 Hard    |
