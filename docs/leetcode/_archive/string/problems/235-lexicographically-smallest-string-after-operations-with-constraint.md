---
layout: page
title: "Lexicographically Smallest String After Operations With Constraint"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-string-after-operations-with-constraint"
---

# Lexicographically Smallest String After Operations With Constraint / Lexicographically Smallest String After Operations With Constraint

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Remove K Digits](https://leetcode.com/problems/remove-k-digits)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mặc cả ở chợ — bạn có k đồng để chi, muốn mua hàng rẻ nhất từng vị trí từ trái sang phải. Hễ đã mua được hàng rẻ hơn ở vị trí này (chuỗi nhỏ hơn ở vị trí này), các vị trí sau cứ tiêu hết số tiền còn lại vì chuỗi đã tốt hơn rồi.

**Visual — Greedy left-to-right character minimization:**

```
s = "zbbz", k = 3
Circular distance: dist(a, b) = min(|a-b|, 26-|a-b|)

i=0, c='z'(25), k=3:
  dist('z','a') = min(25, 1) = 1 ≤ 3 → change to 'a', k=2
i=1, c='b'(1), k=2:
  dist('b','a') = min(1, 25) = 1 ≤ 2 → change to 'a', k=1
i=2, c='b'(1), k=1:
  dist('b','a') = 1 ≤ 1 → change to 'a', k=0
i=3, c='z', k=0: no budget → keep 'z'

Result: "aaaz"

Key: once we've changed a char to something smaller,
     keep spending budget greedily on remaining chars.
     But if we CAN'T make it smaller, save budget for later positions!
```

---

## Problem Description

Given a string `s` and integer `k`, you can change any character. The **circular distance** between chars `a` and `b` is `min(|a-b|, 26-|a-b|)`. The total cost of all changes must be ≤ `k`. Return the **lexicographically smallest** string achievable.

**Example 1:** `s = "zbbz"`, `k = 3` → `"aaaz"`
**Example 2:** `s = "xaxcd"`, `k = 4` → `"aawcd"`

Constraints: `1 <= s.length <= 100`, `0 <= k <= 100`.

---

## 📝 Interview Tips

1. **Clarify**: "Khoảng cách vòng tròn — từ 'z' đến 'a' chỉ 1 bước!" / Circular distance: 'z' to 'a' is distance 1, not 25
2. **Greedy proof**: "Vị trí trái quan trọng hơn — cứ tối ưu từ trái, dùng hết budget cho mỗi vị trí" / Leftmost positions dominate: greedily minimize each char, use budget as needed
3. **Stop condition**: "Khi k=0, dừng lại — các vị trí sau giữ nguyên" / Stop once k=0, remaining chars unchanged
4. **Budget saving**: "Chỉ tiêu budget khi CÓ THỂ làm nhỏ hơn — nếu ký tự đã nhỏ nhất ('a'), không tiêu" / Only spend if char can be made smaller; if already 'a', cost is 0
5. **Edge cases**: "k=0 → return s; s toàn 'a' → return s; k rất lớn → toàn 'a'" / k=0: unchanged; all 'a': unchanged; large k: all 'a'
6. **Follow-up**: "Nếu cho phép tăng ký tự cũng được? → xét cả hướng tăng" / If both directions allowed: same logic, just also check increasing direction

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try all reachable chars at each position
 * At each position, try all 26 chars within budget, pick smallest reachable.
 * Time: O(26·n) — 26 chars × n positions
 * Space: O(n) — result array
 */
function smallestStringBrute(s: string, k: number): string {
  const arr = s.split('');
  let remaining = k;

  for (let i = 0; i < arr.length; i++) {
    if (remaining === 0) break;
    const cur = arr[i].charCodeAt(0) - 97;
    let bestChar = arr[i];
    let bestCost = 0;

    for (let t = 0; t < 26; t++) {
      const cost = Math.min(Math.abs(cur - t), 26 - Math.abs(cur - t));
      if (cost <= remaining && t < bestChar.charCodeAt(0) - 97) {
        bestChar = String.fromCharCode(97 + t);
        bestCost = cost;
      }
    }

    if (bestChar < arr[i]) {
      arr[i] = bestChar;
      remaining -= bestCost;
    }
  }

  return arr.join('');
}

/**
 * Solution 2: Greedy — minimize each position left to right
 * For each character:
 *   1. If we can reach 'a' (costToA ≤ k): change to 'a', subtract cost
 *   2. Else: go as far left (toward 'a') as possible with remaining k, then k=0
 * Note: only spend budget if the result is strictly smaller (don't waste on 'a').
 * Time: O(n) — single pass
 * Space: O(n) — result array
 */
function smallestString(s: string, k: number): string {
  const arr = s.split('');
  let remaining = k;

  for (let i = 0; i < arr.length; i++) {
    if (remaining === 0) break;
    const c = arr[i].charCodeAt(0) - 97; // 0-indexed: 'a'=0, 'z'=25
    const costToA = Math.min(c, 26 - c);  // min circular steps to reach 'a'

    if (costToA <= remaining) {
      // Can fully reach 'a'
      remaining -= costToA;
      arr[i] = 'a';
    } else if (c > 0) {
      // Can't reach 'a', but can move left `remaining` steps
      // Going left gives smaller char; going right gives larger → always go left
      arr[i] = String.fromCharCode(arr[i].charCodeAt(0) - remaining);
      remaining = 0;
    }
    // If c === 0 (already 'a'), cost is 0, nothing changes
  }

  return arr.join('');
}

// === Test Cases ===
console.log(smallestString('zbbz', 3));    // "aaaz"
console.log(smallestString('xaxcd', 4));   // "aawcd"
console.log(smallestString('lol', 0));     // "lol"  (k=0)
console.log(smallestString('a', 5));       // "a"    (already 'a')
console.log(smallestString('z', 1));       // "a"    (z→a costs 1)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Largest Number](https://leetcode.com/problems/largest-number) | Greedy | Medium |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits) | Monotonic Stack | Medium |
| [Lexicographically Smallest Palindrome](https://leetcode.com/problems/lexicographically-smallest-palindrome) | Greedy | Easy |
| [Reorganize String](https://leetcode.com/problems/reorganize-string) | Greedy + Heap | Medium |
