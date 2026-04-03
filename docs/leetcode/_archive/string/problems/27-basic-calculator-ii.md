---
layout: page
title: "Basic Calculator II"
difficulty: Medium
category: String
tags: [Math, String, Stack]
leetcode_url: "https://leetcode.com/problems/basic-calculator-ii"
---

# Basic Calculator II / Máy Tính Cơ Bản II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack with Operator Precedence
> **Frequency**: ⭐ Tier 2 — Gặp ở 20+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như tính tiền mua hàng — nhân/chia được tính trước, rồi mới cộng/trừ. Khi gặp phép nhân/chia, tính ngay với số trước. Khi gặp cộng/trừ, đẩy vào "hàng chờ" (stack). Cuối cùng cộng tất cả trong hàng chờ lại.

**Pattern Recognition:**

- Signal: "evaluate expression" + "operator precedence" → **Stack**
- Track `prevOp` (toán tử trước số hiện tại)
- `+`: push `+num` vào stack
- `-`: push `-num` vào stack
- `*`: pop × current num, push result (xử lý ngay)
- `/`: pop ÷ current num, push result (xử lý ngay — truncate toward zero)

**Visual — s = "3+2\*2":**

```
Scan:  3   +   2   *   2   (end)
num:   3       2       2
op:    +   +   +   *   *   *

At '+'  (op=+): push +3     stack=[3]
At '*'  (op=+): push +2     stack=[3, 2]
At end  (op=*): pop 2, 2*2=4, push 4  stack=[3, 4]

Sum stack: 3 + 4 = 7 ✅
```

**Visual — s = " 3/2 ":**

```
num=3, op=+  → end: push +3    stack=[3]
              Wait, next is /
num=3, op=+; see '/' → next num=2
At end (op=/): pop 3, 3/2=1 (truncate), push 1  stack=[1]
Sum = 1 ✅
```

---

## Problem Description

Cho chuỗi biểu thức `s` chứa số nguyên không âm và toán tử `+`, `-`, `*`, `/` (không có dấu ngoặc). Tính kết quả và trả về số nguyên (chia truncate về 0). ([LeetCode 227](https://leetcode.com/problems/basic-calculator-ii))

Difficulty: Medium | Acceptance: 45.8%

```
Example 1: s = "3+2*2"   → 7
Example 2: s = " 3/2 "   → 1
Example 3: s = " 3+5 / 2" → 5
```

Constraints:

- `1 <= s.length <= 3 * 10^5`
- `s` gồm các chữ số, `+`, `-`, `*`, `/`, dấu cách
- Số nguyên trong `s` nằm trong `[0, 2^31 - 1]`
- Biểu thức hợp lệ (không chia cho 0)

---

## 📝 Interview Tips

1. **Clarify**: "Có dấu ngoặc không? Có số âm (unary minus) không?" / Parentheses? Unary minus?
2. **Key trick**: "Không xử lý operator khi gặp — xử lý operator TRƯỚC khi đọc số tiếp theo" / Don't process op when you see it — process previous op when you see next number
3. **Truncate**: "JavaScript `/` cho float — dùng `Math.trunc()` hoặc `| 0`" / JS division is float — use Math.trunc() for truncation toward zero
4. **Spaces**: "Filter spaces khi đọc number — `isDigit` check thôi" / Skip spaces naturally when reading digits
5. **End of string**: "Xử lý num cuối cùng sau loop (trigger bởi end-of-string)" / Process last number after the loop ends
6. **Follow-up**: "Thêm dấu ngoặc → LeetCode 224 (Basic Calculator)" / Add parentheses → LC 224

---

## Solutions

```typescript
/**
 * Solution 1: Two-pass (tokenize then evaluate)
 * Name: Tokenize + Evaluate
 * Time: O(n)
 * Space: O(n) — token list + stack
 */
function calculateTwoPass(s: string): number {
  // Tokenize
  const tokens: (number | string)[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === " ") {
      i++;
      continue;
    }
    if ("+-*/".includes(s[i])) {
      tokens.push(s[i]);
      i++;
      continue;
    }
    let num = 0;
    while (i < s.length && s[i] >= "0" && s[i] <= "9") num = num * 10 + +s[i++];
    tokens.push(num);
  }
  // Handle * and / first
  const stack: number[] = [];
  let op = "+";
  for (const t of tokens) {
    if (typeof t === "number") {
      if (op === "+") stack.push(t);
      else if (op === "-") stack.push(-t);
      else if (op === "*") stack.push(stack.pop()! * t);
      else stack.push(Math.trunc(stack.pop()! / t));
    } else op = t as string;
  }
  return stack.reduce((a, b) => a + b, 0);
}

/**
 * Solution 2: Single Pass  ← OPTIMAL
 * Name: One-pass Stack with prevOp
 * Time: O(n) — single scan
 * Space: O(n) — stack
 */
function calculate(s: string): number {
  const stack: number[] = [];
  let num = 0;
  let prevOp = "+"; // operator before current number

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    }

    // Process when we hit an operator or end of string
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || i === s.length - 1) {
      if (prevOp === "+") stack.push(num);
      else if (prevOp === "-") stack.push(-num);
      else if (prevOp === "*") stack.push(stack.pop()! * num);
      else if (prevOp === "/") stack.push(Math.trunc(stack.pop()! / num));

      prevOp = ch;
      num = 0;
    }
  }

  return stack.reduce((a, b) => a + b, 0);
}

// === Test Cases ===
console.log(calculate("3+2*2")); // 7
console.log(calculate(" 3/2 ")); // 1
console.log(calculate(" 3+5 / 2")); // 5
console.log(calculate("14-3/2")); // 13
console.log(calculate("100")); // 100
```

---

## 🔗 Related Problems

| Problem                                                                                            | Relationship                      |
| -------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                                 | With parentheses — harder         |
| [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii)                         | With both parentheses and all ops |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                                       | Stack-based string processing     |
| [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation) | Postfix — stack evaluation        |
| [Expression Add Operators](https://leetcode.com/problems/expression-add-operators)                 | DFS + same operator logic         |
