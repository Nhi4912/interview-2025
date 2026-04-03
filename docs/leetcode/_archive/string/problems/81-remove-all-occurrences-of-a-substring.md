---
layout: page
title: "Remove All Occurrences of a Substring"
difficulty: Medium
category: String
tags: [String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/remove-all-occurrences-of-a-substring"
---

# Remove All Occurrences of a Substring / Xoá Tất Cả Lần Xuất Hiện Của Chuỗi Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack / String Builder
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) | [Minimum String Length After Removing Substrings](https://leetcode.com/problems/minimum-string-length-after-removing-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xoá domino — khi bạn đẩy một quân, nó có thể tạo ra hiệu ứng dây chuyền xoá tiếp những quân kế bên. Xây dựng chuỗi từng ký tự; khi đuôi chuỗi kết thúc bằng `part`, cắt đi và tiếp tục.

**Pattern Recognition:**

- Signal: "remove substring, check again after each removal" → **Stack / String Builder**
- Key insight: xây kết quả như stack ký tự; sau mỗi lần thêm ký tự, kiểm tra đuôi

**Visual — Stack approach:**

```
s = "daabcbaabcbc", part = "abc"

Process char by char:
stack: d a a b c          → endsWith "abc"? no
stack: d a a b c b        → no
stack: d a a b c b a      → no
stack: d a a b c b a b    → no
stack: d a a b c b a b c  → endsWith "abc"? YES → pop 3 → "daabcb"
                                                        → endsWith "abc"? YES → pop 3 → "da"
stack: d a b              → "dab"
stack: d a b c            → endsWith "abc"? YES → pop 3 → "d"

Result: "d" ✅
```

---

## Problem Description

Given strings `s` and `part`, repeatedly remove the **leftmost occurrence** of `part` in `s` until no more exist, then return the resulting string. ([LeetCode 1910](https://leetcode.com/problems/remove-all-occurrences-of-a-substring))

**Example 1:** `s = "daabcbaabcbc", part = "abc"` → `"dab"` (remove "abc" at index 2, then at index 3, then at index 1)
**Example 2:** `s = "axxxxyyyyb", part = "xy"` → `"ab"`

Constraints: `1 <= s.length <= 1000`, `1 <= part.length <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Có luôn tìm lần xuất hiện đầu tiên (leftmost) không?" / Always leftmost — but stack approach handles this naturally
2. **Brute force**: "Dùng `s.indexOf(part)` lặp lại trong while loop → O(n²)" / Simple loop with indexOf — OK for n=1000
3. **Optimize**: "Dùng stack (string builder) + endsWith check sau mỗi ký tự → O(n·m)" / Build char by char, check suffix
4. **Edge cases**: "part không xuất hiện → trả về s gốc; s rỗng → trả về ''" / No match → return s unchanged
5. **Follow-up**: "KMP failure function để check suffix trong O(1) amortized" / KMP for O(n) total time
6. **Complexity**: "Stack approach O(n·m) time — n chars, m = part length for each endsWith check" / Better than O(n²) indexOf loop

---

## Solutions

```typescript
/**
 * Solution 1: Simple loop with indexOf
 * Time: O(n² / m) — at most n/m removals, each indexOf O(n)
 * Space: O(n) — string intermediate storage
 */
function removeOccurrencesSimple(s: string, part: string): string {
  while (s.includes(part)) {
    const idx = s.indexOf(part);
    s = s.slice(0, idx) + s.slice(idx + part.length);
  }
  return s;
}

/**
 * Solution 2: Stack / String Builder (optimal)
 * Time: O(n · m) — push each char, check suffix in O(m)
 * Space: O(n) — stack storage
 */
function removeOccurrences(s: string, part: string): string {
  const stack: string[] = [];
  const m = part.length;

  for (const c of s) {
    stack.push(c);
    // Check if stack tail matches 'part'
    if (stack.length >= m && stack.slice(-m).join("") === part) {
      stack.splice(stack.length - m, m);
    }
  }

  return stack.join("");
}

/**
 * Solution 3: Stack with string (faster join avoidance)
 * Time: O(n · m)
 * Space: O(n)
 */
function removeOccurrencesStr(s: string, part: string): string {
  let result = "";
  const m = part.length;

  for (const c of s) {
    result += c;
    if (result.endsWith(part)) {
      result = result.slice(0, result.length - m);
    }
  }

  return result;
}

// === Test Cases ===
console.log(removeOccurrences("daabcbaabcbc", "abc")); // → "dab"
console.log(removeOccurrences("axxxxyyyyb", "xy")); // → "ab"
console.log(removeOccurrences("aaaa", "aa")); // → ""
console.log(removeOccurrencesStr("daabcbaabcbc", "abc")); // → "dab"
```
