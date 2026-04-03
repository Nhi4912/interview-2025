---
layout: page
title: "Evaluate the Bracket Pairs of a String"
difficulty: Medium
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/evaluate-the-bracket-pairs-of-a-string"
---

# Evaluate the Bracket Pairs of a String / Tính Giá Trị Các Cặp Ngoặc Trong Chuỗi

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cho chuỗi `s` chứa các cặp ngoặc `(key)` và mảng `knowledge` là danh sách `[key, value]`. Thay thế mỗi `(key)` trong `s` bằng giá trị tương ứng. Nếu không tìm thấy `key`, thay bằng `"?"`.

**Ví dụ:** `s = "(name)is(age)yearsold"`, `knowledge = [["name","bob"],["age","two"]]` → `"bobistwoyearsold"`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Evaluate the Bracket Pairs of a String example:**

```
s = "(a)bc(d)ef(g)"
knowledge = {a: "1", d: "4"}

Parsing:
'(' → start collecting key
'a' → key buffer: "a"
')' → lookup "a" → "1" → append "1"
'b','c' → append directly
'(' → start key
'd' → key buffer: "d"
')' → lookup "d" → "4" → append "4"
'e','f' → append directly
'(' → start key
'g' → key buffer: "g"
')' → lookup "g" → not found → append "?"

Result: "1bc4ef?"
```

---

## Problem Description

- `s` chứa chữ thường và các cặp `(key)`.
- `knowledge[i] = [key_i, value_i]`.
- Thay mỗi `(key)` bằng `value` hoặc `"?"` nếu không có.

**Constraints:** `1 <= s.length <= 10^5`, `0 <= knowledge.length <= 10^5`.

---

## 📝 Interview Tips

1. **HashMap trước** — convert `knowledge` sang `Map` để O(1) lookup.
2. **State machine** — dùng flag `inBracket` và buffer để thu thập key.
3. **Không lồng ngoặc** — bài đảm bảo cặp ngoặc hợp lệ, không cần xử lý lồng.
4. **StringBuilder** — dùng array rồi `join('')` thay vì nối string liên tục.
5. **Fallback `"?"`** — nếu Map không có key, push `"?"`.
6. **Độ phức tạp** — O(n + m) với n = |s|, m = |knowledge|.

---

## Solutions

```typescript
function evaluate(s: string, knowledge: string[][]): string {
  // Build lookup map
  const map = new Map<string, string>();
  for (const [key, val] of knowledge) {
    map.set(key, val);
  }

  const result: string[] = [];
  let i = 0;

  while (i < s.length) {
    if (s[i] === "(") {
      // Collect key until ')'
      let j = i + 1;
      while (j < s.length && s[j] !== ")") j++;
      const key = s.slice(i + 1, j);
      result.push(map.get(key) ?? "?");
      i = j + 1; // skip past ')'
    } else {
      result.push(s[i]);
      i++;
    }
  }

  return result.join("");
}

// Test cases
console.log(
  evaluate("(name)is(age)yearsold", [
    ["name", "bob"],
    ["age", "two"],
  ]),
);
// "bobistwoyearsold"
console.log(evaluate("hi(name)", [["a", "b"]]));
// "hi?"
console.log(evaluate("(a)(a)(a)aaa", [["a", "yes"]]));
// "yesyesyesaaa"
console.log(
  evaluate("(a)bc(d)", [
    ["a", "1"],
    ["d", "4"],
  ]),
);
// "1bc4"

function evaluateRegex(s: string, knowledge: string[][]): string {
  const map = new Map<string, string>(knowledge.map(([k, v]) => [k, v]));

  // Replace each (key) with its value or '?'
  return s.replace(/\(([^)]+)\)/g, (_, key) => map.get(key) ?? "?");
}

console.log(
  evaluateRegex("(name)is(age)yearsold", [
    ["name", "bob"],
    ["age", "two"],
  ]),
);
// "bobistwoyearsold"
console.log(evaluateRegex("hi(name)", [["a", "b"]]));
// "hi?"
console.log(evaluateRegex("(a)(a)(a)aaa", [["a", "yes"]]));
// "yesyesyesaaa"

function evaluateCharByChar(s: string, knowledge: string[][]): string {
  const map = new Map<string, string>();
  for (const [k, v] of knowledge) map.set(k, v);

  const result: string[] = [];
  let inBracket = false;
  let keyBuf = "";

  for (const ch of s) {
    if (ch === "(") {
      inBracket = true;
      keyBuf = "";
    } else if (ch === ")") {
      result.push(map.get(keyBuf) ?? "?");
      inBracket = false;
    } else if (inBracket) {
      keyBuf += ch;
    } else {
      result.push(ch);
    }
  }

  return result.join("");
}

console.log(
  evaluateCharByChar("(name)is(age)yearsold", [
    ["name", "bob"],
    ["age", "two"],
  ]),
);
// "bobistwoyearsold"
console.log(evaluateCharByChar("(missing)", []));
// "?"
```

---

## 🔗 Related Problems

| Giải pháp     | Thời gian | Không gian | Ghi chú         |
| ------------- | --------- | ---------- | --------------- |
| State Machine | O(n + m)  | O(n + m)   | Tối ưu, rõ ràng |
| Regex replace | O(n + m)  | O(n + m)   | Ngắn gọn        |
| Char by char  | O(n + m)  | O(n + m)   | Trực quan nhất  |
