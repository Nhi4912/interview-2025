---
layout: page
title: "Basic Calculator IV"
difficulty: Hard
category: String
tags: [Hash Table, Math, String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/basic-calculator-iv"
---

# Basic Calculator IV / Máy Tính Cơ Bản IV (Biểu Thức Đa Thức)

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Recursion + Polynomial Representation
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như giáo viên toán giải phương trình đại số — khi nhân `(x+1)(x+2)` ta mở ngoặc thành `x²+3x+2`. Mỗi "term" là một đơn thức (monomial) với hệ số và tập biến; cả biểu thức là đa thức (polynomial) = tập các đơn thức.

**Pattern Recognition:**

- Biểu thức có `+`, `-`, `*`, `()` và biến → cần polynomial class với Map
- Mỗi term: `{sorted vars → coefficient}`, ví dụ `"x*x" → coeff=3`
- Tokenize → recursive parse → evaluate với variable substitution

**Visual:**

```
expression = "e + 1 - 2 - 3"  eval = {"e":1}

Tokens: ["e", "+", "1", "-", "2", "-", "3"]
Parse addition/subtraction left-to-right:
  e → Poly{""→0, "e"→1}  (variable)
  1 → Poly{""→1}          (constant)
  e + 1 → Poly{""→1, "e"→1}
  2 → Poly{""→2}
  e+1 - 2 → Poly{""→-1, "e"→1}
  3 → Poly{""→3}
  final → Poly{""→-4, "e"→1}  → eval with e=1 → -4+1=-3
Output: ["-3"] (constant first, then sorted vars)
```

## Problem Description

Evaluate an expression involving non-negative integers, variables, and `+`, `-`, `*` operators with parentheses. Variables are substituted via `evalvars`/`evalexps` arrays. Return the simplified polynomial in a specific sorted format.

Examples: `"e + 1 - 2 - 3", ["e"], [1]` → `["-3"]` | `"(e + 1) * (e - 1)", ["e"], [1]` → `["0"]`.

## 📝 Interview Tips

1. **Clarify**: Variables chỉ lowercase? Operators có ưu tiên không? / Yes lowercase; `*` > `+/-`
2. **Approach**: Polynomial as Map<string,number>, recursive descent parser / Build Poly class first
3. **Edge cases**: Expression only constants; variables not in evalvars remain symbolic / Handle unknown vars
4. **Optimize**: Sort term keys lexicographically for output; remove zero-coeff terms / Clean up zeros
5. **Follow-up**: Division support? Polynomial division is much harder / Division not required here
6. **Complexity**: O(n × T²) where T = number of terms (multiply = cross product) / T can grow large

## Solutions

```typescript
/** Solution 1: Polynomial Class + Recursive Descent Parser
 * Time: O(n * T^2) | Space: O(T) where T = number of distinct terms
 */

// A Polynomial maps sorted-variable-key → coefficient
// e.g. "" → constant, "x" → x coeff, "x*x" → x^2 coeff, "x*y" → xy coeff
class Poly {
  terms: Map<string, number>;

  constructor() {
    this.terms = new Map();
  }

  static fromConst(c: number): Poly {
    const p = new Poly();
    if (c !== 0) p.terms.set("", c);
    return p;
  }

  static fromVar(v: string): Poly {
    const p = new Poly();
    p.terms.set(v, 1);
    return p;
  }

  add(other: Poly): Poly {
    const res = new Poly();
    for (const [k, v] of this.terms) res.terms.set(k, v);
    for (const [k, v] of other.terms) {
      res.terms.set(k, (res.terms.get(k) ?? 0) + v);
    }
    res.clean();
    return res;
  }

  sub(other: Poly): Poly {
    const neg = new Poly();
    for (const [k, v] of other.terms) neg.terms.set(k, -v);
    return this.add(neg);
  }

  mul(other: Poly): Poly {
    const res = new Poly();
    for (const [k1, v1] of this.terms) {
      for (const [k2, v2] of other.terms) {
        const key = [k1, k2]
          .filter(Boolean)
          .flatMap((s) => s.split("*"))
          .sort()
          .join("*");
        res.terms.set(key, (res.terms.get(key) ?? 0) + v1 * v2);
      }
    }
    res.clean();
    return res;
  }

  clean(): void {
    for (const [k, v] of this.terms) {
      if (v === 0) this.terms.delete(k);
    }
  }

  toList(): string[] {
    const entries = Array.from(this.terms.entries());
    // Sort: longer keys (higher degree) first, then lexicographic
    entries.sort((a, b) => {
      const da = a[0] ? a[0].split("*").length : 0;
      const db = b[0] ? b[0].split("*").length : 0;
      if (da !== db) return db - da;
      return a[0].localeCompare(b[0]);
    });
    return entries.map(([k, v]) => (k ? `${v}*${k}` : `${v}`));
  }
}

function basicCalculatorIV(expression: string, evalvars: string[], evalexps: number[]): string[] {
  const varMap = new Map<string, number>();
  for (let i = 0; i < evalvars.length; i++) varMap.set(evalvars[i], evalexps[i]);

  const tokens = expression.match(/[a-z]+|\d+|[+\-*()]/g) ?? [];
  let pos = 0;

  function parseExpr(): Poly {
    let result = parseTerm();
    while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
      const op = tokens[pos++];
      const right = parseTerm();
      result = op === "+" ? result.add(right) : result.sub(right);
    }
    return result;
  }

  function parseTerm(): Poly {
    let result = parseFactor();
    while (pos < tokens.length && tokens[pos] === "*") {
      pos++;
      result = result.mul(parseFactor());
    }
    return result;
  }

  function parseFactor(): Poly {
    if (tokens[pos] === "(") {
      pos++; // skip '('
      const result = parseExpr();
      pos++; // skip ')'
      return result;
    }
    const tok = tokens[pos++];
    if (/^\d+$/.test(tok)) return Poly.fromConst(parseInt(tok));
    if (varMap.has(tok)) return Poly.fromConst(varMap.get(tok)!);
    return Poly.fromVar(tok);
  }

  return parseExpr().toList();
}

// Tests
console.log(basicCalculatorIV("e + 1 - 2 - 3", ["e"], [1])); // ["-3"]
console.log(basicCalculatorIV("(e + 1) * (e - 1)", ["e"], [1])); // ["0"]
console.log(basicCalculatorIV("a * b * c + b * a * c * 4", [], [])); // ["5*a*b*c"]
console.log(
  basicCalculatorIV("((a - b) * (b - c) + (c - a)) * ((a - b) + (b - c) * (c - a))", [], []),
);
// Complex polynomial
console.log(basicCalculatorIV("3", [], [])); // ["3"]
```

## 🔗 Related Problems

| Problem                                                                      | Relationship                               |
| ---------------------------------------------------------------------------- | ------------------------------------------ |
| [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii)   | Same recursive descent, but numeric only   |
| [Parse Lisp Expression](https://leetcode.com/problems/parse-lisp-expression) | Recursive expression with variable binding |
| [Decode String](https://leetcode.com/problems/decode-string)                 | Recursive/Stack-based string expansion     |
