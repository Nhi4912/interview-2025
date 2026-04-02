---
layout: page
title: "Minimize Result by Adding Parentheses to Expression"
difficulty: Medium
category: String
tags: [String, Enumeration]
leetcode_url: "https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression"
---

# Minimize Result by Adding Parentheses to Expression / Thu Nhỏ Kết Quả Bằng Cách Thêm Dấu Ngoặc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Enumeration

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Bạn có phép tính `"12+34"`. Chèn `(` và `)` bao quanh dấu `+` sao cho kết quả nhỏ nhất. Phần ngoài ngoặc sẽ **nhân** với phần bên trong — duyệt mọi vị trí chia là đủ.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimize Result by Adding Parentheses to Expression example:**

```
"247+38"   num1="247"  num2="38"
  i=0 → "(247+38)"   = 285          ← left=∅ → ×1
  i=1 → "2(47+38)"   = 2×85 = 170  ← minimum!
  i=2 → "24(7+38)"   = 24×45 = 1080

  j=1 → "2(47+3)8"   = 2×50×8 = 800
  j=2 → "2(47+38)"   = 2×85   = 170  ← tie
```

**Key insight**: `result = leftVal × (mid1 + mid2) × rightVal`. Empty outside part → multiplier = 1.

---

## Problem Description

| #    | Problem                                              | Difficulty | Pattern          |
| ---- | ---------------------------------------------------- | ---------- | ---------------- |
| 678  | Valid Parenthesis String                             | 🟡 Medium  | Greedy           |
| 241  | Different Ways to Add Parentheses                    | 🟡 Medium  | Divide & Conquer |
| 856  | Score of Parentheses                                 | 🟡 Medium  | Stack            |
| 1896 | Minimum Cost to Change the Final Value of Expression | 🔴 Hard    | DP               |

---

## 📝 Interview Tips

- 🔑 **EN**: Find `+` index first to split `expression` into `num1` and `num2`
  **VI**: Tìm vị trí `+` để tách biểu thức thành `num1` và `num2`
- 🔑 **EN**: `i` ranges `0..num1.length-1`; `j` ranges `1..num2.length` (both non-empty inside)
  **VI**: `i` từ 0 đến `num1.length-1`; `j` từ 1 đến `num2.length` (phần trong không rỗng)
- 🔑 **EN**: Empty left/right string means multiplier = 1, not 0
  **VI**: Phần ngoài rỗng nghĩa là nhân với 1, không phải 0
- 🔑 **EN**: O(n²) enumeration is fine — each part is at most 10 digits
  **VI**: Duyệt O(n²) ổn vì mỗi bên tối đa 10 chữ số
- 🔑 **EN**: Track both the minimum value and the expression string simultaneously
  **VI**: Lưu đồng thời giá trị nhỏ nhất và chuỗi biểu thức tương ứng
- 🔑 **EN**: Use `+left` coercion; guard empty string with `|| 1`
  **VI**: Dùng `+left` để ép kiểu; xử lý chuỗi rỗng bằng `|| 1`

---

```typescript
// ─── Solution 1: Brute Force Enumeration — O(n²) time, O(1) space ────────────
function minimizeResult(expression: string): string {
  const plusIdx = expression.indexOf("+");
  const num1 = expression.slice(0, plusIdx);
  const num2 = expression.slice(plusIdx + 1);

  let minVal = Infinity;
  let result = "";

  // i: position of '(' inside num1 (0 = wrap whole num1)
  // j: position of ')' inside num2 (num2.length = wrap whole num2)
  for (let i = 0; i < num1.length; i++) {
    for (let j = 1; j <= num2.length; j++) {
      const left = num1.slice(0, i); // before '('
      const mid1 = num1.slice(i); // inside '(' from num1
      const mid2 = num2.slice(0, j); // inside ')' from num2
      const right = num2.slice(j); // after  ')'

      const leftVal = left === "" ? 1 : parseInt(left, 10);
      const rightVal = right === "" ? 1 : parseInt(right, 10);
      const total = leftVal * (parseInt(mid1, 10) + parseInt(mid2, 10)) * rightVal;

      if (total < minVal) {
        minVal = total;
        result = `${left}(${mid1}+${mid2})${right}`;
      }
    }
  }

  return result;
}

// Tests
console.log(minimizeResult("247+38")); // "2(47+38)"
console.log(minimizeResult("12+34")); // "1(2+3)4"
console.log(minimizeResult("999+999")); // "(999+999)"
console.log(minimizeResult("1+1")); // "(1+1)"
```

```typescript
// ─── Solution 2: Same Logic — Cleaner with Numeric Coercion ──────────────────
function minimizeResult2(expression: string): string {
  const plus = expression.indexOf("+");
  const A = expression.slice(0, plus); // left operand
  const B = expression.slice(plus + 1); // right operand

  let best = { val: Infinity, expr: "" };

  for (let i = 0; i < A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      const L = A.slice(0, i); // multiplier left
      const aM = A.slice(i); // sum addend from A
      const bM = B.slice(0, j); // sum addend from B
      const R = B.slice(j); // multiplier right

      const val = (L ? +L : 1) * (+aM + +bM) * (R ? +R : 1);
      if (val < best.val) best = { val, expr: `${L}(${aM}+${bM})${R}` };
    }
  }

  return best.expr;
}

// Tests
console.log(minimizeResult2("247+38")); // "2(47+38)"
console.log(minimizeResult2("12+34")); // "1(2+3)4"
console.log(minimizeResult2("100+200")); // "(100+200)"
```

---

---

## Solutions


---

## 🔗 Related Problems

| #    | Problem                                              | Difficulty | Pattern          |
| ---- | ---------------------------------------------------- | ---------- | ---------------- |
| 678  | Valid Parenthesis String                             | 🟡 Medium  | Greedy           |
| 241  | Different Ways to Add Parentheses                    | 🟡 Medium  | Divide & Conquer |
| 856  | Score of Parentheses                                 | 🟡 Medium  | Stack            |
| 1896 | Minimum Cost to Change the Final Value of Expression | 🔴 Hard    | DP               |
