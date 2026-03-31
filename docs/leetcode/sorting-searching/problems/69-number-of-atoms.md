---
layout: page
title: "Number of Atoms"
difficulty: Hard
category: Sorting-Searching
tags: [Hash Table, String, Stack, Sorting]
leetcode_url: "https://leetcode.com/problems/number-of-atoms"
---

# Number of Atoms / Số Lượng Nguyên Tử

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như phân tích biểu thức toán học với ngoặc đơn. Khi gặp `(`, ta mở một "bối cảnh" mới. Khi gặp `)` theo sau là số nhân, ta nhân toàn bộ các nguyên tử trong bối cảnh đó rồi gộp vào bối cảnh bên ngoài — đây chính là cơ chế stack.

**Pattern Recognition:**

- Gặp `(` → push dict mới vào stack
- Gặp `)n` → pop dict ra, nhân toàn bộ value với n, merge vào dict phía trên
- Output: sort tên nguyên tử, format `Name` + (count > 1 ? count : "")

**Visual — "K4(ON(SO3)2)2":**

```
stack = [{}]
K4    → [{"K":4}]
(     → [{"K":4}, {}]
O     → [{"K":4}, {"O":1}]
N     → [{"K":4}, {"O":1,"N":1}]
(     → [{"K":4}, {"O":1,"N":1}, {}]
SO3   → [{"K":4}, {"O":1,"N":1}, {"S":1,"O":3}]
)2    → pop×2 → [{"K":4}, {"O":1,"N":1,"S":2,"O":6}]
)2    → pop×2 → [{"K":4,"O":14,"N":2,"S":4}]
→ "K4N2O14S4" ✅
```

---

## Problem Description

Given a chemical formula string, return the count of each element as a string in **alphabetical order**. Elements start with uppercase letters, counts (if > 1) follow immediately. Parentheses group elements with a multiplier.

- Example 1: `formula = "H2O"` → `"H2O"`
- Example 2: `formula = "Mg(OH)2"` → `"H2MgO2"`
- Example 3: `formula = "K4(ON(SO3)2)2"` → `"K4N2O14S4"`

---

## 📝 Interview Tips

1. **Clarify**: "Element có thể nhiều hơn 1 chữ hoa không? Số nhân có thể nhiều chữ số không?" / Multi-char element names? Multi-digit multipliers?
2. **Parse carefully**: "Element: uppercase + lowercase\*, number: digits (default 1)" / Uppercase + optional lowercase letters, digits default to 1
3. **Stack state**: "Stack chứa dict đếm số nguyên tử — push khi '(', pop+merge khi ')n'" / Push new dict on '(', pop-merge on ')n'
4. **Edge case**: "Không có ngoặc đơn → cũng work bình thường" / No parentheses still works
5. **Output format**: "Sort key alphabetically, omit '1'" / Sort keys, skip count of 1
6. **Follow-up**: "Parse nested expressions với depth lớn?" / Handle deeply nested formulas?

---

## Solutions

```typescript
/**
 * Solution 1: Stack-based parser
 * Time: O(n²) — parsing O(n), sorting O(k log k), k = distinct elements
 * Space: O(n) — stack depth proportional to nesting
 */
function countOfAtoms(formula: string): string {
  let i = 0;
  const n = formula.length;

  function parse(): Map<string, number> {
    const map = new Map<string, number>();

    while (i < n && formula[i] !== ")") {
      if (formula[i] === "(") {
        i++; // skip '('
        const inner = parse();
        i++; // skip ')'
        // parse multiplier
        let num = 0;
        while (i < n && formula[i] >= "0" && formula[i] <= "9")
          num = num * 10 + Number(formula[i++]);
        if (num === 0) num = 1;
        for (const [el, cnt] of inner) map.set(el, (map.get(el) ?? 0) + cnt * num);
      } else if (formula[i] >= "A" && formula[i] <= "Z") {
        // Parse element name
        let name = formula[i++];
        while (i < n && formula[i] >= "a" && formula[i] <= "z") name += formula[i++];
        // Parse count
        let num = 0;
        while (i < n && formula[i] >= "0" && formula[i] <= "9")
          num = num * 10 + Number(formula[i++]);
        if (num === 0) num = 1;
        map.set(name, (map.get(name) ?? 0) + num);
      }
    }
    return map;
  }

  const counts = parse();
  const sorted = [...counts.keys()].sort();
  return sorted.map((el) => el + (counts.get(el)! > 1 ? counts.get(el) : "")).join("");
}

// === Test Cases ===
console.log(countOfAtoms("H2O")); // "H2O"
console.log(countOfAtoms("Mg(OH)2")); // "H2MgO2"
console.log(countOfAtoms("K4(ON(SO3)2)2")); // "K4N2O14S4"
console.log(countOfAtoms("Be32")); // "Be32"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Pattern        | Difficulty |
| ------------------------------------------------------------------------------------------ | -------------- | ---------- |
| [Decode String](https://leetcode.com/problems/decode-string)                               | Stack          | Medium     |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)                   | Stack          | Medium     |
| [Parsing A Boolean Expression](https://leetcode.com/problems/parsing-a-boolean-expression) | Stack          | Hard       |
| [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | Trie / HashMap | Hard       |
