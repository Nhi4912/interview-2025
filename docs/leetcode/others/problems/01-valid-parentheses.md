---
layout: page
title: "Valid Parentheses"
difficulty: Easy
category: Stack
tags: [Stack, String, Hash Table]
leetcode_url: "https://leetcode.com/problems/valid-parentheses/"
---

# Valid Parentheses / Ngoặc Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Stack
> **Frequency**: 🔥 Tier 1 — Bài mở đầu kinh điển cho mọi bài về Stack
> **See also**: [Daily Temperatures](./11-daily-temperatures.md) | [Min Stack](../../design/problems/01-min-stack.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như xếp đĩa trong nhà bếp: mỗi lần mở ngoặc `(`, `{`, `[` bạn đặt một cái đĩa lên. Khi gặp ngoặc đóng, bạn lấy đĩa trên cùng ra kiểm tra — nếu khớp thì bỏ đi, không khớp thì đống đĩa bị xáo trộn (chuỗi không hợp lệ). Cuối cùng, đống phải trống.

**Pattern Recognition:**

- Signal: "matching pairs", "last opened must be first closed", bracket validation → **Stack (LIFO)**
- Ngoặc mở → push lên stack; ngoặc đóng → pop và kiểm tra khớp
- Kết thúc: stack rỗng ↔ hợp lệ

**Visual — s = "{[()]}":**

```
Char:  {   [   (   )   ]   }
Stack: {  [{  [({ [{  [{ (empty)
           ↑       ↓
         push    pop, verify '(' == '(' ✓
                     pop, verify '[' == '[' ✓
                             pop, verify '{' == '{' ✓
Result: stack empty → true ✓
```

---

## Problem Description

Given a string `s` containing only `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is **valid**. A string is valid if every open bracket is closed by the **same type** of bracket in the **correct order**.

```
Example 1: "()"       → true
Example 2: "()[]{}"   → true
Example 3: "(]"       → false
```

Constraints:

- `1 <= s.length <= 10^4`
- `s` consists of brackets only

---

## 📝 Interview Tips

1. **Clarify**: Only brackets, no other characters? / Chuỗi có chứa ký tự khác ngoài ngoặc không?
2. **Brute force**: Repeatedly remove innermost valid pairs with regex — O(n²) / Lặp lại xóa cặp ngoặc trong cùng
3. **Optimize**: Stack: push open brackets, pop & verify on close — one pass O(n) / Một lần duyệt với stack
4. **Edge cases**: Empty string → true; odd length → always false; starts with `)` → false immediately
5. **Follow-up**: Generate all valid combinations? → LC 22; longest valid substring? → LC 32

---

## Solutions

```typescript

/**

- Solution 1: Brute Force — Regex Pair Removal
- Time: O(n²) — repeatedly scan and remove innermost pairs
- Space: O(n) — string copy at each pass
  */
  function isValidBrute(s: string): boolean {
  let prev = "";
  let current = s;

while (prev !== current) {
prev = current;
current = current.replace(/\(\)|\[\]|\{\}/g, "");
}

return current.length === 0;
}

/**

- Solution 2: Stack (Optimal)
- Time: O(n) — single pass through each character
- Space: O(n) — stack holds at most n/2 open brackets
  */
  function isValid(s: string): boolean {
  const stack: string[] = [];
  const matchMap: Record<string, string> = {
  ")": "(",
  "]": "[",
  "}": "{",
  };

for (const char of s) {
if (!(char in matchMap)) {
// Opening bracket — push onto stack
stack.push(char);
} else {
// Closing bracket — must match top of stack
if (stack.pop() !== matchMap[char]) return false;
}
}

return stack.length === 0;
}

// === Test Cases ===
console.log(isValid("()")); // true
console.log(isValid("()[]{}")); // true
console.log(isValid("(]")); // false
console.log(isValid("{[()]}")); // true
console.log(isValid("")); // true (edge: empty string)

```

---

## 🔗 Related Problems

- [Daily Temperatures](./11-daily-temperatures.md) — cùng dùng stack để match elements
- [Min Stack](../../design/problems/01-min-stack.md) — thiết kế stack với tính năng mở rộng
- [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) — tạo tất cả chuỗi ngoặc hợp lệ (backtracking)
