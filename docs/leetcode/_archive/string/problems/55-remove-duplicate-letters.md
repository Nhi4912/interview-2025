---
layout: page
title: "Remove Duplicate Letters"
difficulty: Medium
category: String
tags: [String, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/remove-duplicate-letters"
---

# Remove Duplicate Letters / Xóa Ký Tự Trùng Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack + Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Smallest Subsequence of Distinct Characters](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp hàng chờ — nếu người đứng trước (ký tự lớn hơn) mà còn có thể xuất hiện lại phía sau, ta đuổi họ ra khỏi hàng và để người nhỏ hơn lên trước.

**Pattern Recognition:**

- Signal: "lexicographically smallest subsequence" + "each char appears exactly once" → **Greedy + Monotonic Stack**
- Ba điều kiện để pop stack: (1) stack.top > current, (2) current chưa trong stack, (3) stack.top còn xuất hiện sau
- Key insight: `lastIndex` map cho biết ký tự có còn cơ hội xuất hiện không

**Visual — s="bcabc":**

```
lastIdx: b=3, c=4, a=2
inStack: {}

i=0 'b': stack=[]  → push b     stack=[b]  inStack={b}
i=1 'c': b<c       → push c     stack=[b,c]
i=2 'a': c>a & lastIdx[c]=4>2 → pop c
         b>a & lastIdx[b]=3>2 → pop b
         push a  stack=[a]  inStack={a}
i=3 'b': a<b → push b  stack=[a,b]
i=4 'c': b<c → push c  stack=[a,b,c]

Result: "abc" ✅
```

---

## Problem Description

Given string `s`, remove duplicate letters so that every letter appears once. Return the result that is the **smallest in lexicographical order** among all possible results.

```
Example 1: s="bcabc"  → "abc"
Example 2: s="cbacdcbc" → "acdb"
Example 3: s="abcd"   → "abcd"  (already unique)
```

Constraints: `1 <= s.length <= 10^4`, `s` contains lowercase English letters only.

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả là subsequence (không phải substring)? Mỗi ký tự đúng một lần?" / Result is subsequence, each char exactly once
2. **Brute force**: "Generate all subsequences, filter unique, sort" → O(2^n) không khả thi / Exponential, not viable
3. **Optimize**: "Greedy stack — pop lớn hơn nếu còn cơ hội sau; không pop nếu ký tự đã trong stack" / Three conditions to pop
4. **Edge cases**: "Chuỗi đã sorted tăng dần, giảm dần, tất cả giống nhau" / Already sorted, reverse-sorted, all same
5. **Follow-up**: "Smallest K-length subsequence" — tương tự nhưng cần đủ k ký tự / Generalization with length constraint
6. **Complexity**: "O(n) vì mỗi ký tự push/pop nhiều nhất một lần, 26 ký tự distinct" / O(n) amortized

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try all unique-char subsequences
 * Time: O(2^n) — exponential, impractical
 * Space: O(n)
 */
function removeDuplicateLettersBrute(s: string): string {
  const chars = [...new Set(s)].sort();
  if (chars.length === s.length) return s; // already unique
  for (const c of chars) {
    const idx = s.indexOf(c);
    const rest = removeDuplicateLettersBrute(s.slice(idx).replace(new RegExp(c, "g"), ""));
    return c + rest;
  }
  return "";
}

/**
 * Solution 2: Greedy + Monotonic Stack
 * Time: O(n) — single pass, each char pushed/popped at most once
 * Space: O(26) = O(1) — stack and maps bounded by alphabet size
 */
function removeDuplicateLetters(s: string): string {
  // Last occurrence index for each character
  const lastIndex = new Map<string, number>();
  for (let i = 0; i < s.length; i++) lastIndex.set(s[i], i);

  const stack: string[] = [];
  const inStack = new Set<string>();

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStack.has(c)) continue; // already included, skip

    // Pop larger chars that still appear later in s
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > c &&
      lastIndex.get(stack[stack.length - 1])! > i
    ) {
      inStack.delete(stack.pop()!);
    }

    stack.push(c);
    inStack.add(c);
  }

  return stack.join("");
}

// === Test Cases ===
console.log(removeDuplicateLetters("bcabc")); // "abc"
console.log(removeDuplicateLetters("cbacdcbc")); // "acdb"
console.log(removeDuplicateLetters("abcd")); // "abcd"
console.log(removeDuplicateLetters("bbcaac")); // "bac"
```

---

## 🔗 Related Problems

- [Remove K Digits](https://leetcode.com/problems/remove-k-digits) — same monotonic stack, remove exactly k digits
- [Smallest Subsequence of Distinct Characters](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters) — identical problem, different title
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — monotonic stack foundation
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures) — monotonic stack for next-greater pattern
