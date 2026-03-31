---
layout: page
title: "Smallest Subsequence of Distinct Characters"
difficulty: Medium
category: String
tags: [String, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters"
---

# Smallest Subsequence of Distinct Characters / Subsequence Nhỏ Nhất Gồm Các Ký Tự Phân Biệt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xây hàng rào thấp nhất — mỗi lần đặt cọc mới, bạn kiểm tra cọc trước có cao hơn không. Nếu cao hơn VÀ còn cọc đó ở phía sau → rút cọc cũ ra, đặt thấp hơn.

**Pattern Recognition:**

- Signal: "lexicographically smallest" + "distinct characters" + "subsequence" → **Greedy + Monotonic Stack**
- Key insight: Với mỗi ký tự `c`, nếu `c < stack.top` VÀ `stack.top` còn xuất hiện ở phía sau → pop top ra, vì sẽ tốt hơn khi dùng `c` thay thế vị trí đó.
- Note: Bài này **giống hệt** LeetCode 316 "Remove Duplicate Letters".

**Visual:**

```
s = "bcabc"
last = {b:3, c:4, a:2}

Process 'b': stack=[], not in stack → push → stack=[b]
Process 'c': stack=[b], c>b → push → stack=[b,c]
Process 'a': stack=[b,c]
  a < c? YES, c appears later (last[c]=4>2) → pop c → stack=[b]
  a < b? YES, b appears later (last[b]=3>2) → pop b → stack=[]
  push a → stack=[a]
Process 'b': not in stack, b > a → push → stack=[a,b]
Process 'c': not in stack, c > b → push → stack=[a,b,c]
Result: "abc" ✓
```

---

## Problem Description

Return the lexicographically smallest subsequence of string `s` that contains **all distinct characters** of `s` exactly once. ([LeetCode](https://leetcode.com/problems/smallest-subsequence-of-distinct-characters))

Note: This problem is identical to LeetCode 316 "Remove Duplicate Letters".

Difficulty: Medium | Acceptance: ~56%

```
Example 1: s = "bcabc" → "abc"
Example 2: s = "cbacdcbc" → "acdb"
Example 3: s = "leetcode" → "letcod"
```

Constraints:

- `1 <= s.length <= 1000`
- `s` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Subsequence: giữ thứ tự tương đối của ký tự trong chuỗi gốc" / Subsequence preserves relative order.
2. **Key condition to pop**: "Pop khi: (1) top > current, (2) top appears again later, (3) current not in stack" / All 3 conditions must hold to pop.
3. **In-stack tracking**: "Dùng Set hoặc boolean[26] để biết ký tự nào đã có trong stack" / Track which chars are in stack.
4. **Last occurrence**: "Precompute last occurrence index của mỗi ký tự" / Precompute `last[c]` = last index of c in s.
5. **Edge cases**: "Single char → trả về chính nó; all same → trả về single char" / s="aaa" → "a".
6. **Follow-up**: "Tương tự Remove K Digits nhưng phải giữ tất cả distinct chars" / Same stack pattern as Remove K Digits.

---

## Solutions

```typescript
/**
 * Solution 1: Greedy + Monotonic Stack
 * Time: O(n) — each char pushed/popped at most once
 * Space: O(26) = O(1) — stack has at most 26 distinct chars
 *
 * Algorithm:
 * 1. Precompute last[c] = last index where c appears
 * 2. For each char c at index i:
 *    - If c already in stack → skip
 *    - Else while stack.top > c AND last[stack.top] > i → pop
 *    - Push c
 */
function smallestSubsequence(s: string): string {
  const last: number[] = new Array(26).fill(-1);
  for (let i = 0; i < s.length; i++) {
    last[s.charCodeAt(i) - 97] = i;
  }

  const stack: number[] = []; // store char codes
  const inStack = new Array(26).fill(false);

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97;

    if (inStack[c]) continue; // already in stack

    // Pop larger chars that will appear again later
    while (stack.length > 0 && stack[stack.length - 1] > c && last[stack[stack.length - 1]] > i) {
      inStack[stack.pop()!] = false;
    }

    stack.push(c);
    inStack[c] = true;
  }

  return stack.map((c) => String.fromCharCode(c + 97)).join("");
}

/**
 * Solution 2: Same algorithm with char-based stack (more readable)
 * Time: O(n), Space: O(1)
 */
function smallestSubsequenceV2(s: string): string {
  // Frequency count for "will appear later" check
  const freq: Map<string, number> = new Map();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  const stack: string[] = [];
  const seen = new Set<string>();

  for (const c of s) {
    freq.set(c, freq.get(c)! - 1); // decrement (already passed c)

    if (seen.has(c)) continue;

    // Pop stack top if it's larger and still available later
    while (
      stack.length > 0 &&
      stack[stack.length - 1] > c &&
      freq.get(stack[stack.length - 1])! > 0
    ) {
      seen.delete(stack.pop()!);
    }

    stack.push(c);
    seen.add(c);
  }

  return stack.join("");
}

// === Test Cases ===
console.log(smallestSubsequence("bcabc")); // "abc"
console.log(smallestSubsequence("cbacdcbc")); // "acdb"
console.log(smallestSubsequence("leetcode")); // "letcod"
console.log(smallestSubsequence("a")); // "a"
console.log(smallestSubsequence("aaa")); // "a"

console.log(smallestSubsequenceV2("bcabc")); // "abc"
console.log(smallestSubsequenceV2("cbacdcbc")); // "acdb"
console.log(smallestSubsequenceV2("aab")); // "ab"
```

---

## 🔗 Related Problems

| Problem                                                                                        | Pattern                  | Difficulty |
| ---------------------------------------------------------------------------------------------- | ------------------------ | ---------- |
| [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)             | Monotonic Stack          | Medium     |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits)                               | Monotonic Stack + Greedy | Medium     |
| [132 Pattern](https://leetcode.com/problems/132-pattern)                                       | Monotonic Stack          | Medium     |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | Monotonic Stack          | Hard       |
