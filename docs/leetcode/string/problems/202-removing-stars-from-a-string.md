---
layout: page
title: "Removing Stars From a String"
difficulty: Medium
category: String
tags: [String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/removing-stars-from-a-string"
---

# Removing Stars From a String / Xóa Dấu Sao Khỏi Chuỗi

🟡 Medium

## 🧠 Intuition

> **Phép so sánh:** Giống phím Backspace trên bàn phím — mỗi `*` xóa ký tự cuối cùng bạn gõ. Stack là cấu trúc hoàn hảo: push ký tự thường, pop khi gặp `*`.

```
s = "leet**cod*e"
Stack evolution:
 'l' → [l]
 'e' → [l,e]
 'e' → [l,e,e]
 't' → [l,e,e,t]
 '*' → [l,e,e]   (pop 't')
 '*' → [l,e]     (pop 'e')
 'c' → [l,e,c]
 'o' → [l,e,c,o]
 'd' → [l,e,c,o,d]
 '*' → [l,e,c,o] (pop 'd')
 'e' → [l,e,c,o,e]
Result: "lecoe"
```

## Problem Description

Given string `s` containing lowercase letters and `*`. Each `*` removes the **nearest non-star character to its left**. Return the resulting string after processing all stars.

**Example 1:** `"leet**cod*e"` → `"lecoe"`

**Example 2:** `"erase*****"` → `""`

**Constraints:** `1 <= s.length <= 10^5`, always valid (enough chars before each `*`)

## 📝 Interview Tips

- **Stack = O(n) solution:** Push regular chars, pop on `*` — clean and intuitive
- **Array-as-stack:** Using `string[]` + `join('')` at end avoids repeated string concatenation
- **Two-pointer alternative:** Maintain write pointer `w`; increment on char, decrement on `*` — O(1) space
- **Guaranteed valid input:** No need to check if stack is empty before pop
- **Complexity:** O(n) time, O(n) space
- **Interview insight:** Mô phỏng text editor — bài này thường xuất hiện trong system design discussion

## Solutions

### Solution 1: Stack — O(n) time, O(n) space

```typescript
function removeStars(s: string): string {
  const stack: string[] = [];

  for (const ch of s) {
    if (ch === "*") {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }

  return stack.join("");
}
```

### Solution 2: Two-pointer (in-place) — O(n) time, O(n) space for output

```typescript
function removeStars(s: string): string {
  const arr = s.split("");
  let write = 0;

  for (let read = 0; read < arr.length; read++) {
    if (arr[read] === "*") {
      write--; // "delete" last written char
    } else {
      arr[write++] = arr[read];
    }
  }

  return arr.slice(0, write).join("");
}
```

### Solution 3: Functional / reduce — O(n) time, O(n) space

```typescript
function removeStars(s: string): string {
  return s.split("").reduce((acc, ch) => {
    if (ch === "*") return acc.slice(0, -1);
    return acc + ch;
  }, "");
}
```

## 🔗 Related Problems

| #    | Problem                                    | Difficulty | Tags                |
| ---- | ------------------------------------------ | ---------- | ------------------- |
| 844  | Backspace String Compare                   | Easy       | Two Pointers, Stack |
| 2390 | Removing Stars From a String               | Medium     | Stack               |
| 1003 | Check If Word Is Valid After Substitutions | Medium     | Stack               |
| 2716 | Minimize String Length                     | Easy       | Hash Table          |
