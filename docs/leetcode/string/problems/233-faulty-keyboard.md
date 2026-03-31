---
layout: page
title: "Faulty Keyboard"
difficulty: Easy
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/faulty-keyboard"
---

# Faulty Keyboard / Faulty Keyboard

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) | [Reverse String](https://leetcode.com/problems/reverse-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chiếc quạt trần có công tắc đảo chiều — mỗi lần nhấn 'i' là đảo chiều quay, nhưng thay vì thực sự quay lại, ta chỉ cần ghi nhớ "đang quay chiều nào" và thêm ký tự vào đầu hay cuối tương ứng.

**Visual — Deque + direction flag:**

```
s = "poiinter"

Brute (O(n²)): actually reverse each time
p→"p"  o→"po"  i→"op"  i→"po"  n→"pon"  t→"pont"  e→"ponte"  r→"ponter"

Optimal (O(n)): deque + toRight flag
char  toRight  action           deque
 p      T      push_back    →   [p]
 o      T      push_back    →   [p,o]
 i      F      flip
 i      T      flip
 n      T      push_back    →   [p,o,n]
 t      T      push_back    →   [p,o,n,t]
 e      T      push_back    →   [p,o,n,t,e]
 r      T      push_back    →   [p,o,n,t,e,r]
toRight=T → join → "ponter" ✅
```

---

## Problem Description

Your laptop keyboard is faulty: whenever you type `'i'`, the **entire current string on screen is reversed**. All other characters are typed normally.

Given string `s` representing your key presses, return the final string on screen.

**Example 1:** `s = "poiinter"` → `"ponter"`
**Example 2:** `s = "string"` → `"rtsng"`

Constraints: `1 <= s.length <= 100`, `s` consists of lowercase English letters.

---

## 📝 Interview Tips

1. **Clarify**: "Khi nhấn 'i', chuỗi hiện tại bị đảo — chỉ màn hình, không phải input" / The reversal affects only what's on screen, not future input
2. **Brute force**: "Thực sự đảo mỗi lần gặp 'i' — O(n²) trong trường hợp xấu nhất" / Simulate directly, O(n²) worst case due to repeated reversals
3. **Optimize**: "Dùng deque + flag hướng, thêm vào đầu hay cuối tuỳ chiều" / Use deque + direction flag, append to correct end based on parity of reversals
4. **Key insight**: "Số lần đảo chẵn = chưa đảo, lẻ = đảo 1 lần — chỉ cần 1 bit" / Parity of reversals → only 1 boolean needed
5. **Edge cases**: "Toàn 'i' → chuỗi rỗng; 'i' đầu/cuối; không có 'i'" / All 'i' gives empty; 'i' at boundaries; no 'i' at all
6. **Follow-up**: "Nếu có thêm lệnh đặc biệt khác? Dùng deque tổng quát hơn" / Multiple special commands → generalize the deque model

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — simulate with actual reversal
 * Time: O(n²) — each 'i' reverses in O(n), potentially n reversals
 * Space: O(n) — screen string
 */
function faultyKeyboardBrute(s: string): string {
  let screen = '';
  for (const c of s) {
    if (c === 'i') screen = screen.split('').reverse().join('');
    else screen += c;
  }
  return screen;
}

/**
 * Solution 2: Optimal — deque + direction flag
 * Track which end to append to instead of reversing.
 * 'i' flips the direction; at the end reverse deque if direction is inverted.
 * Time: O(n) — each character processed exactly once
 * Space: O(n) — deque storing result
 */
function faultyKeyboard(s: string): string {
  const deque: string[] = [];
  let toRight = true; // append to right when true, left when false

  for (const c of s) {
    if (c === 'i') {
      toRight = !toRight;
    } else {
      if (toRight) deque.push(c);
      else deque.unshift(c);
    }
  }

  return toRight ? deque.join('') : deque.reverse().join('');
}

// === Test Cases ===
console.log(faultyKeyboard('poiinter'));  // "ponter"
console.log(faultyKeyboard('string'));    // "rtsng"
console.log(faultyKeyboard('abcde'));     // "abcde"  (no 'i')
console.log(faultyKeyboard('iiiii'));     // ""        (all 'i', no other chars)
console.log(faultyKeyboard('iabc'));      // "cba"    ('i' then abc → screen empty then cba reversed)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) | Simulation | Easy |
| [Reverse String](https://leetcode.com/problems/reverse-string) | Two Pointers | Easy |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string) | Two Pointers | Medium |
| [Text Justification](https://leetcode.com/problems/text-justification) | Simulation | Hard |
