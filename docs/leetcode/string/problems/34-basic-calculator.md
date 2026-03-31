---
layout: page
title: "Basic Calculator"
difficulty: Hard
category: String
tags: [Math, String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/basic-calculator"
---

# Basic Calculator / Máy Tính Cơ Bản

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack — Sign Tracking with Parenthesis Nesting
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Facebook, Amazon; cần xử lý dấu ngoặc lồng nhau
> **See also**: [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) | [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn đọc một công thức toán từ trái sang phải. Khi gặp `(`, bạn "bookmark" kết quả và dấu hiện tại rồi bắt đầu tính con. Khi gặp `)`, bạn "quay lại" bookmark, nhân kết quả con với dấu bookmark, cộng vào kết quả trước. Stack là bộ nhớ của các bookmark đó.

- **Pattern Recognition:**
  - Chỉ có `+`, `-`, `(`, `)` (không có `*`, `/` như Calculator II)
  - Stack lưu `[result, sign]` khi gặp `(` → pop và combine khi gặp `)`
  - `sign` là +1 hoặc -1; số nhiều chữ số cần parse toàn bộ trước khi apply

- **Visual — `"1 + (2 - (3 + 1))"`:**

  ```
  result=0, sign=1, num=0

  '1': num=1
  '+': result += 1*1 = 1,  sign=1, num=0
  '(': push(1, 1) → stack=[(1,1)], result=0, sign=1
  '2': num=2
  '-': result += 1*2 = 2,  sign=-1, num=0
  '(': push(2,-1) → stack=[(1,1),(2,-1)], result=0, sign=1
  '3': num=3
  '+': result += 1*3 = 3,  sign=1, num=0
  '1': num=1
  ')': result += 1*1 = 4
       [prevResult, prevSign] = pop = (2,-1)
       result = prevResult + prevSign*result = 2 + (-1)*4 = -2
  ')': [prevResult, prevSign] = pop = (1, 1)
       result = 1 + 1*(-2) = -1 ✅
  ```

## Problem Description

Cho chuỗi biểu thức `s` chứa các số nguyên không âm, `+`, `-`, `(`, `)` và khoảng trắng. Tính giá trị của biểu thức. **Không dùng eval().**

| Input                   | Output | Giải thích          |
| ----------------------- | ------ | ------------------- |
| `"1 + 1"`               | `2`    | Cộng đơn giản       |
| `" 2-1 + 2 "`           | `3`    | Khoảng trắng bỏ qua |
| `"(1+(4+5+2)-3)+(6+8)"` | `23`   | Ngoặc lồng nhau     |

## 📝 Interview Tips

- 🇻🇳 Chỉ có `+` và `-` → `sign` đủ dùng, không cần priority queue / 🇬🇧 _Only + and - (no \* /) → sign tracking without operator precedence is sufficient_
- 🇻🇳 Số nhiều chữ số: tích lũy vào `num` khi gặp digit, flush khi gặp operator/parenthesis / 🇬🇧 _Multi-digit numbers: accumulate into `num`, flush when hitting +, -, or )_
- 🇻🇳 Gặp `(`: push `(result, sign)` lên stack, reset `result=0, sign=1` cho scope mới / 🇬🇧 _On (: push (result, sign) to save context, reset for inner expression_
- 🇻🇳 Gặp `)`: flush `num` → `result += sign*num`, rồi pop và kết hợp: `result = prevResult + prevSign * result` / 🇬🇧 _On ): flush num, pop stack, combine: result = popped_result + popped_sign \* inner_result_
- 🇻🇳 Cuối chuỗi: đừng quên flush `num` lần cuối / 🇬🇧 _Don't forget to flush the last `num` after the loop ends_

## Solutions

```typescript
/**
 * Solution 1: Stack with Sign Tracking — Iterative
 * Duyệt chuỗi từ trái sang phải.
 * Stack lưu (result, sign) của scope bên ngoài khi gặp '('.
 * Khi gặp ')': kết hợp inner result với outer context.
 *
 * @time O(n) — mỗi ký tự xử lý O(1)
 * @space O(n) — stack depth = độ sâu ngoặc lồng nhau
 */
function calculate(s: string): number {
  const stack: number[] = [];
  let result = 0;
  let sign = 1; // +1 hoặc -1
  let num = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= "0" && ch <= "9") {
      num = num * 10 + (ch.charCodeAt(0) - 48); // tích lũy số nhiều chữ số
    } else if (ch === "+" || ch === "-") {
      result += sign * num; // flush số hiện tại
      num = 0;
      sign = ch === "+" ? 1 : -1;
    } else if (ch === "(") {
      // Lưu context hiện tại lên stack
      stack.push(result);
      stack.push(sign);
      // Bắt đầu scope mới
      result = 0;
      sign = 1;
    } else if (ch === ")") {
      result += sign * num; // flush số hiện tại
      num = 0;
      const prevSign = stack.pop()!;
      const prevResult = stack.pop()!;
      result = prevResult + prevSign * result; // kết hợp inner với outer
    }
    // khoảng trắng: bỏ qua (không làm gì)
  }

  result += sign * num; // flush số cuối cùng (nếu có)
  return result;
}

console.log(calculate("1 + 1")); // 2
console.log(calculate(" 2-1 + 2 ")); // 3
console.log(calculate("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculate("1 + (2 - (3 + 1))")); // -1
console.log(calculate("- (3 + (4 + 5))")); // -12

/**
 * Solution 2: Recursive Descent Parser
 * Dùng pointer `pos` dùng chung qua recursion.
 * Khi gặp '(', gọi đệ quy parse() cho subexpression.
 * Khi gặp ')' hoặc end-of-string, return kết quả hiện tại.
 *
 * @time O(n) — mỗi ký tự xử lý đúng một lần
 * @space O(d) — d = độ sâu ngoặc (call stack)
 */
function calculateRecursive(s: string): number {
  let pos = 0;

  function parse(): number {
    let result = 0;
    let sign = 1;
    let num = 0;

    while (pos < s.length) {
      const ch = s[pos];

      if (ch >= "0" && ch <= "9") {
        num = num * 10 + (ch.charCodeAt(0) - 48);
        pos++;
      } else if (ch === "+" || ch === "-") {
        result += sign * num;
        num = 0;
        sign = ch === "+" ? 1 : -1;
        pos++;
      } else if (ch === "(") {
        pos++; // bỏ qua '('
        num = parse(); // kết quả subexpression
      } else if (ch === ")") {
        pos++; // bỏ qua ')'
        break; // kết thúc scope hiện tại
      } else {
        pos++; // khoảng trắng
      }
    }

    result += sign * num;
    return result;
  }

  return parse();
}

console.log(calculateRecursive("1 + 1")); // 2
console.log(calculateRecursive("(1+(4+5+2)-3)+(6+8)")); // 23
console.log(calculateRecursive("1 + (2 - (3 + 1))")); // -1
```

## 🔗 Related Problems

| Problem                                                                                                 | Pattern                     | Difficulty |
| ------------------------------------------------------------------------------------------------------- | --------------------------- | ---------- |
| [227. Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)                           | Stack + Operator Precedence | 🟡 Medium  |
| [772. Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii)                         | Recursive Descent           | 🔴 Hard    |
| [394. Decode String](https://leetcode.com/problems/decode-string)                                       | Stack + Nesting             | 🟡 Medium  |
| [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation) | Stack                       | 🟡 Medium  |
