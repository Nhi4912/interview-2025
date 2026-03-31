---
layout: page
title: "Evaluate Reverse Polish Notation"
difficulty: Medium
category: Array
tags: [Array, Math, Stack]
leetcode_url: "https://leetcode.com/problems/evaluate-reverse-polish-notation"
---

# Evaluate Reverse Polish Notation / Tính Biểu Thức Ký Hiệu Ba Lan Ngược

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Maximum Frequency Score of a Subarray](https://leetcode.com/problems/maximum-frequency-score-of-a-subarray) | [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một nhân viên kho hàng xếp thùng lên chồng: mỗi số anh ta đặt lên, còn khi thấy phép toán thì lấy 2 thùng trên cùng ra tính rồi đặt kết quả lại. Chồng thùng LIFO chính là stack — thùng nào đặt sau lấy ra trước.

**Pattern Recognition:**

- Signal: "evaluate expression left-to-right with operators acting on previous operands" → **Stack**
- Operands are pushed; operators pop top-2, compute, push result back
- Division truncates toward zero (use `Math.trunc`, not `Math.floor`)

**Visual — Evaluate `["2","1","+","3","*"]`:**

```
Token "2"  → push 2       stack=[2]
Token "1"  → push 1       stack=[2,1]
Token "+"  → pop 1,2 → 2+1=3 → push 3   stack=[3]
Token "3"  → push 3       stack=[3,3]
Token "*"  → pop 3,3 → 3*3=9 → push 9   stack=[9]
Result = 9 ✅
```

---

## Problem Description

Given an array of strings `tokens` representing an arithmetic expression in **Reverse Polish Notation**, evaluate and return the integer result. Valid operators are `+`, `-`, `*`, `/`. Division truncates toward zero.

**Example 1:** `tokens = ["2","1","+","3","*"]` → `9` (((2+1)\*3) = 9)

**Example 2:** `tokens = ["4","13","5","/","+"]` → `6` (4 + (13/5) = 4+2 = 6)

Constraints:

- `1 <= tokens.length <= 10^4`
- `tokens[i]` is either an operator or an integer in range `[-200, 200]`

---

## 📝 Interview Tips

1. **Clarify**: "Phép chia có truncate về 0 không?" / Confirm integer division truncates toward zero, not floor
2. **Brute force**: "Stack là cách tự nhiên nhất — không cần brute force riêng" / Stack is the natural approach here
3. **Optimize**: "Dùng Map operator→function để code gọn hơn" / Use an operator map for cleaner dispatch
4. **Edge cases**: "Token là số âm như '-3', phân biệt với phép trừ '-'" / Negative number tokens vs minus operator
5. **Follow-up**: "Nếu có thêm toán tử như `**` hay `%`?" / How to extend for new operators like power or modulo?
6. **Complexity**: "O(n) time và space — mỗi token xử lý đúng một lần" / Each token processed exactly once

---

## Solutions

```typescript
/**
 * Solution 1: Stack with if-else dispatch
 * Time: O(n) — one pass through all tokens
 * Space: O(n) — stack holds at most (n+1)/2 numbers
 */
function evalRPNBasic(tokens: string[]): number {
  const stack: number[] = [];
  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b)); // truncate toward zero
    } else {
      stack.push(parseInt(token, 10));
    }
  }
  return stack[0];
}

/**
 * Solution 2: Optimized — Stack with operator map (clean dispatch)
 * Time: O(n) — one pass, O(1) per token
 * Space: O(n) — stack depth proportional to operand count
 */
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  const ops: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => Math.trunc(a / b),
  };

  for (const token of tokens) {
    if (token in ops) {
      const b = stack.pop()!;
      const a = stack.pop()!;
      stack.push(ops[token](a, b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}

// === Test Cases ===
console.log(evalRPN(["2", "1", "+", "3", "*"])); // 9
console.log(evalRPN(["4", "13", "5", "/", "+"])); // 6
console.log(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"])); // 22
console.log(evalRPN(["3", "-4", "+"])); // -1  (negative number token)
console.log(evalRPN(["7", "2", "/"])); // 3   (truncation: 7/2=3.5 → 3)
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Maximum Frequency Score of a Subarray](https://leetcode.com/problems/maximum-frequency-score-of-a-subarray)                 | Sliding Window      | Hard       |
| [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) | Dynamic Programming | Hard       |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram)                               | Monotonic Stack     | Hard       |
| [Asteroid Collision](https://leetcode.com/problems/asteroid-collision)                                                       | Stack               | Medium     |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)                                                     | Stack               | Medium     |
