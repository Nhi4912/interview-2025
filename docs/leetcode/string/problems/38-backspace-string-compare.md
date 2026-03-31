---
layout: page
title: "Backspace String Compare"
difficulty: Easy
category: String
tags: [Two Pointers, String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/backspace-string-compare"
---

# Backspace String Compare / So Sánh Chuỗi Có Ký Tự Xóa

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers / Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Design a Text Editor](https://leetcode.com/problems/design-a-text-editor) | [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống hai người đang gõ bàn phím — mỗi khi gõ `#`, ký tự trước bị xóa. Cách đơn giản: dùng stack mô phỏng gõ từng ký tự. Cách tối ưu: đọc từ **cuối lên** — gặp `#` thì bỏ qua ký tự kế tiếp, gặp ký tự bình thường thì so sánh.

**Pattern Recognition:** "Simulate typing with backspace" → Stack O(n) space; hoặc Two-pointer right-to-left O(1) space.

```
s = "ab#c"    t = "ad#c"
Stack: a→[a], b→[a,b], #→[a], c→[a,c]   ⟹ "ac"
Stack: a→[a], d→[a,d], #→[a], c→[a,c]   ⟹ "ac"
"ac" == "ac" → true

Two-pointer reverse:
s: c ← # ← b(skip) ← a    → compare 'c','a'...
```

---

## 📋 Problem / Bài Toán

Given strings `s` and `t` where `#` means a backspace character, return `true` if they are equal after processing all backspaces.

- `s="ab#c", t="ad#c"` → `true` (both become "ac")
- `s="ab##", t="c#d#"` → `true` (both become "")
- `s="a#c",  t="b"` → `false` ("c" vs "b")

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Stack is clearest**: Xử lý từng ký tự, `#` pop nếu stack không rỗng — code rất dễ viết và explain.
- 🔑 **Nhận biết**: "Stack" khi cần undo/backtrack; "Two-pointer from end" khi yêu cầu O(1) space.
- ⚡ **Follow-up O(1) space**: Scan từ cuối — đếm `skipCount` cho mỗi `#`; bỏ qua `skipCount` ký tự tiếp theo.
- ⚡ **Reverse scan logic**: Duy trì `skipS` và `skipT`; advance pointer cho đến khi có ký tự hợp lệ để so sánh.
- 🚨 **Multiple consecutive `#`**: `"abc###"` → cả 3 ký tự bị xóa, stack thành rỗng → hợp lệ.
- 💡 **Extra `#` ở đầu**: `"#a"` → xóa trên stack rỗng không làm gì → kết quả "a".

---

## Solutions

### Solution 1 — Stack Simulation · O(n+m) time · O(n+m) space

```typescript
/**
 * Simulate typing: push chars, pop on '#' (if stack non-empty).
 * Compare final stacks by joining to strings.
 * Time: O(n + m) | Space: O(n + m)
 */
function backspaceCompare_stack(s: string, t: string): boolean {
  function process(str: string): string {
    const stack: string[] = [];
    for (const ch of str) {
      if (ch === "#") {
        if (stack.length) stack.pop();
      } else stack.push(ch);
    }
    return stack.join("");
  }
  return process(s) === process(t);
}

console.log(backspaceCompare_stack("ab#c", "ad#c")); // true
console.log(backspaceCompare_stack("ab##", "c#d#")); // true
console.log(backspaceCompare_stack("a#c", "b")); // false
console.log(backspaceCompare_stack("y#fo##f", "y#f#o##f")); // true
```

### Solution 2 — Reverse Two Pointers · O(n+m) time · O(1) space

```typescript
/**
 * Scan both strings from right to left simultaneously.
 * Count '#' as pending skips; skip that many real chars.
 * Compare the next valid chars from each string.
 * Time: O(n + m) | Space: O(1)
 */
function backspaceCompare(s: string, t: string): boolean {
  let i = s.length - 1,
    j = t.length - 1;
  let skipS = 0,
    skipT = 0;

  while (i >= 0 || j >= 0) {
    // advance i to next valid char in s
    while (i >= 0) {
      if (s[i] === "#") {
        skipS++;
        i--;
      } else if (skipS > 0) {
        skipS--;
        i--;
      } else break;
    }
    // advance j to next valid char in t
    while (j >= 0) {
      if (t[j] === "#") {
        skipT++;
        j--;
      } else if (skipT > 0) {
        skipT--;
        j--;
      } else break;
    }
    // compare valid chars (or exhaustion)
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if (i >= 0 !== j >= 0) return false; // one exhausted, other not
    i--;
    j--;
  }
  return true;
}

console.log(backspaceCompare("ab#c", "ad#c")); // true
console.log(backspaceCompare("ab##", "c#d#")); // true
console.log(backspaceCompare("a#c", "b")); // false
console.log(backspaceCompare("", "")); // true
console.log(backspaceCompare("bbbextm", "bbb#extm")); // false
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                            | Difficulty | Pattern             |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [Design a Text Editor](https://leetcode.com/problems/design-a-text-editor)                                         | 🔴 Hard    | Stack / Linked List |
| [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | 🟢 Easy    | Stack               |
| [Remove All Occurrences of a Substring](https://leetcode.com/problems/remove-all-occurrences-of-a-substring)       | 🟡 Medium  | Stack               |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                                                       | 🟡 Medium  | Stack               |
