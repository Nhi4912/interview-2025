---
layout: page
title: "Decoded String at Index"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/decoded-string-at-index"
---

# Decoded String at Index / Ký Tự Tại Chỉ Số Trong Chuỗi Giải Mã

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Reverse Traversal / Virtual Length
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Tưởng tượng bạn có một bản đồ gấp (giống accordion) — bạn không cần mở toàn bộ ra mới tìm được địa điểm thứ k. Thay vào đó, đi từ cuối ngược về đầu, dùng phép chia để "thu gọn" k theo từng bước.

**Pattern Recognition:**

- Decoded string có thể cực dài (tránh build actual string) → work with **lengths only**
- Duyệt ngược: tại mỗi bước số `d`, `k = k % (len / d)` để tìm vị trí tương đương trong phần nhỏ hơn
- Khi `k == 0` tại vị trí ký tự letter → đó chính là ký tự cần tìm

**Visual:**

```
s = "leet2code3", k = 10
Lengths after each char:
l=1, e=2, e=3, t=4, 2→8, c=9, o=10, d=11, e=12, 3→36

Reverse scan with k=10:
i=9 '3': len=36, k=10 → k = 10 % 12 = 10 (k < len/3=12, ok), len=12
i=8 'e': len=12, k=10 → letter, k != 0
i=7 'd': len=11, k=10 → letter, k != 0
i=6 'o': len=10, k=10 → letter, k == 0 → return 'o'!

k=10 in decoded string "leet" repeated 3x → position 10 = 'o' ✅
```

## Problem Description

String `s` is encoded: letters stay as-is, digit `d` repeats the current string `d` times. Given `k` (1-indexed), return the `k`th character of the decoded string **without building it**.

Examples: `("leet2code3", 10)` → `"o"` | `("ha22", 5)` → `"h"` | `("a2345678999999999999999", 1)` → `"a"`.

## 📝 Interview Tips

1. **Clarify**: k là 1-indexed? Decoded string đảm bảo có đủ k chars? / Yes 1-indexed, always valid
2. **Approach**: Tính virtual length, rồi đi ngược + modulo để tìm k / Never build the actual string
3. **Edge cases**: k becomes 0 after modulo → answer is current letter or last letter of prev block / k=0 is key signal
4. **Optimize**: Phải dùng BigNumber nếu length > Number.MAX_SAFE_INTEGER / Use BigInt for lengths
5. **Follow-up**: Nếu digits > 9? Bài này giới hạn single digit 2-9 / Multi-digit would need parsing
6. **Complexity**: O(n) time, O(1) space / Optimal — no string construction

## Solutions

```typescript
/** Solution 1: Reverse Traversal with Modulo (Optimal)
 * Time: O(n) | Space: O(1)
 */
function decodeAtIndex(s: string, k: number): string {
  // First: compute total virtual length
  let len = BigInt(0);
  for (const ch of s) {
    if (/\d/.test(ch)) {
      len *= BigInt(parseInt(ch));
    } else {
      len++;
    }
  }

  // Second: reverse traversal to find k
  let target = BigInt(k);
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    if (/\d/.test(ch)) {
      len /= BigInt(parseInt(ch));
      target = target % len;
    } else {
      if (target === 0n || target === len) return ch;
      len--;
    }
  }

  return ""; // never reached
}

/** Solution 2: Two-pass without BigInt (safe for small lengths)
 * Time: O(n) | Space: O(n) for lengths array
 */
function decodeAtIndexSafe(s: string, k: number): string {
  const lengths: number[] = new Array(s.length);
  let len = 0;

  for (let i = 0; i < s.length; i++) {
    if (/\d/.test(s[i])) {
      len *= parseInt(s[i]);
    } else {
      len++;
    }
    lengths[i] = len;
  }

  let target = k;
  for (let i = s.length - 1; i >= 0; i--) {
    target = target % lengths[i];
    if (target === 0 && /[a-z]/.test(s[i])) return s[i];
  }

  return "";
}

/** Solution 3: Stack-based building (only feasible for small k)
 * Time: O(n * max_factor) | Space: O(n * max_factor)
 * Educational only — will TLE on large inputs
 */
function decodeAtIndexBrute(s: string, k: number): string {
  let decoded = "";
  for (const ch of s) {
    if (/\d/.test(ch)) {
      decoded = decoded.repeat(parseInt(ch));
    } else {
      decoded += ch;
    }
    if (decoded.length >= k) return decoded[k - 1];
  }
  return decoded[k - 1];
}

// Tests
console.log(decodeAtIndex("leet2code3", 10)); // "o"
console.log(decodeAtIndex("ha22", 5)); // "h"
console.log(decodeAtIndex("a2345678999999999999999", 1)); // "a"
console.log(decodeAtIndex("y959q969u3hb22odq595", 222222227)); // needs BigInt
console.log(decodeAtIndexBrute("leet2code3", 10)); // "o" (works for small k)
console.log(decodeAtIndexSafe("ha22", 5)); // "h"
```

## 🔗 Related Problems

| Problem                                                                | Relationship                             |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| [Decode String](https://leetcode.com/problems/decode-string)           | Same encoding format, full decode        |
| [String Compression](https://leetcode.com/problems/string-compression) | Encoding/decoding strings                |
| [Count and Say](https://leetcode.com/problems/count-and-say)           | String generation by rules, k-th element |
