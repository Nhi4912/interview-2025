---
layout: page
title: "Mini Parser"
difficulty: Medium
category: Tree-Graph
tags: [String, Stack, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/mini-parser"
---

# Mini Parser / Bộ Phân Tích Cú Pháp Mini

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack-Based Parsing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Basic Calculator](https://leetcode.com/problems/basic-calculator)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như phân tích biểu thức lồng nhau — stack giữ danh sách đang mở. `[` → push NestedInteger mới. `]` hoặc số → pop và add vào parent. Số đơn → wrap thẳng.

**Analogy (EN):** Use a stack of NestedInteger objects. On `[`: push new list. On `]` or digit: finalize current integer, pop and add to parent list. Plain number (no brackets): return immediately.

```
Input: "[123,[456,[789]]]"

'['  → push new NI(list)        stack=[L1]
"123"→ L1.add(NI(123))
','  → nothing
'['  → push new NI(list)        stack=[L1, L2]
"456"→ L2.add(NI(456))
','  → nothing
'['  → push new NI(list)        stack=[L1, L2, L3]
"789"→ L3.add(NI(789))
']'  → pop L3, L2.add(L3)       stack=[L1, L2]
']'  → pop L2, L1.add(L2)       stack=[L1]
']'  → pop L1 → result           stack=[]
```

---

## 📝 Interview Tips

1. **Interface clarify / Làm rõ interface**: NestedInteger có 3 ops: isInteger(), getInteger(), getList() + setInteger(v), add(ni) / Know the NestedInteger API before coding
2. **Plain number edge case / Số đơn**: Nếu không có `[` → số đơn, wrap vào NestedInteger và return / If no bracket, it's a single integer
3. **Negative numbers / Số âm**: Track start index cẩn thận — dấu `-` thuộc về số / Handle negative: `-123` starts at sign character
4. **Stack discipline / Kỷ luật stack**: Push khi gặp `[`, pop khi gặp `]` → add vào top của stack / Push on `[`, pop on `]`, add popped to new top
5. **Comma handling / Dấu phẩy**: Dấu `,` và `[` trigger việc flush số đang đọc / Flush accumulated digit string on `,`, `[`, and `]`
6. **Follow-up**: "Nếu parse JSON?" → tương tự nhưng cần handle strings, objects / Same stack technique, extended for JSON

---

## Solutions

```typescript
// NestedInteger interface (provided by LeetCode)
class NestedInteger {
  private isInt: boolean;
  private intVal: number;
  private listVal: NestedInteger[];

  constructor(value?: number) {
    if (value !== undefined) {
      this.isInt = true;
      this.intVal = value;
      this.listVal = [];
    } else {
      this.isInt = false;
      this.intVal = 0;
      this.listVal = [];
    }
  }

  isInteger(): boolean {
    return this.isInt;
  }
  getInteger(): number {
    return this.intVal;
  }
  setInteger(value: number): void {
    this.intVal = value;
    this.isInt = true;
  }
  add(elem: NestedInteger): void {
    this.listVal.push(elem);
  }
  getList(): NestedInteger[] {
    return this.listVal;
  }
  toString(): string {
    if (this.isInt) return String(this.intVal);
    return "[" + this.listVal.map((x) => x.toString()).join(",") + "]";
  }
}

/**
 * Solution 1: Stack-Based Iterative
 * Time: O(N) — single pass through string
 * Space: O(D) — stack depth D = nesting depth
 *
 * Stack của NestedInteger lists. `[` → push new list. `]` → pop và add vào parent.
 * Số tích lũy được → add vào current top.
 */
function deserialize(s: string): NestedInteger {
  // Edge: plain integer (no brackets)
  if (s[0] !== "[") return new NestedInteger(parseInt(s));

  const stack: NestedInteger[] = [];
  let numStart = -1; // index where current number starts

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch === "[") {
      stack.push(new NestedInteger()); // new empty list
      numStart = -1;
    } else if (ch === "]" || ch === ",") {
      // Flush accumulated number if any
      if (numStart !== -1) {
        const num = parseInt(s.slice(numStart, i));
        stack[stack.length - 1].add(new NestedInteger(num));
        numStart = -1;
      }
      if (ch === "]" && stack.length > 1) {
        const top = stack.pop()!;
        stack[stack.length - 1].add(top);
      }
    } else {
      // digit or '-'
      if (numStart === -1) numStart = i;
    }
  }

  return stack[0];
}

/**
 * Solution 2: Recursive Parser
 * Time: O(N) — each char processed once
 * Space: O(D) — recursion depth = nesting depth
 *
 * Recursive descent: if starts with '[', parse list; else parse integer.
 */
function deserializeRecursive(s: string): NestedInteger {
  let idx = 0;

  function parse(): NestedInteger {
    if (s[idx] === "[") {
      idx++; // consume '['
      const ni = new NestedInteger();
      while (s[idx] !== "]") {
        if (s[idx] === ",") idx++; // consume ','
        ni.add(parse());
      }
      idx++; // consume ']'
      return ni;
    } else {
      // parse integer (possibly negative)
      const start = idx;
      if (s[idx] === "-") idx++;
      while (idx < s.length && s[idx] >= "0" && s[idx] <= "9") idx++;
      return new NestedInteger(parseInt(s.slice(start, idx)));
    }
  }

  return parse();
}

// === Test Cases ===
console.log(deserialize("324").toString()); // "324"
console.log(deserialize("[123,[456,[789]]]").toString()); // "[123,[456,[789]]]"
console.log(deserialize("[-3,[4,5]]").toString()); // "[-3,[4,5]]"
console.log(deserialize("[]").toString()); // "[]"

console.log(deserializeRecursive("[123,[456,[789]]]").toString()); // "[123,[456,[789]]]"
console.log(deserializeRecursive("324").toString()); // "324"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Pattern          | Difficulty |
| ------------------------------------------------------------------------------------------ | ---------------- | ---------- |
| [Decode String](https://leetcode.com/problems/decode-string)                               | Stack            | 🟡 Medium  |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                         | Stack            | 🔴 Hard    |
| [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) | Stack + Iterator | 🟡 Medium  |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                               | Stack            | 🟡 Medium  |
