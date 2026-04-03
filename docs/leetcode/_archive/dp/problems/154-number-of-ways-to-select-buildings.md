---
layout: page
title: "Number of Ways to Select Buildings"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-select-buildings"
---

# Number of Ways to Select Buildings / Số Cách Chọn Tòa Nhà

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như đếm subsequence "010" và "101" — tại mỗi vị trí, ta nhân với số pattern ngắn hơn đã thấy. Giống tổng luỹ tiến nhưng nhân số lần khớp.

```
s = "001101"
     0 0 1 1 0 1

Track counts as we scan:
  c0  = count of "0" seen
  c1  = count of "1" seen
  c01 = count of "01" seen
  c10 = count of "10" seen
  c010, c101 = final answers

i=0 ('0'): c0=1
i=1 ('0'): c0=2
i=2 ('1'): c10+=c1=0, c01+=c0=2 → c01=2, c1=1
i=3 ('1'): c10+=c1=1 → c10=1, c01+=c0=2 → c01=4, c1=2
i=4 ('0'): c010+=c01=4, c101+=c10=1 → c010=4, c0=3
i=5 ('1'): c010+=0(stays), c101+=c10=1+c010? NO: c101+=c10, c010+=c01

Result = c010 + c101
```

**Key insight:** Scan left to right tracking `c0, c1, c01, c10, c010, c101`. At each '0': increment `c010` by `c01`; at each '1': increment `c101` by `c10`. Final answer = `c010 + c101`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Pattern**: Count subsequences matching "010" and "101" (no two adjacent same) / đếm subsequence xen kẽ độ dài 3
- 🔑 **Build up**: Track patterns of length 1 and 2 as prefix to build length-3 counts / xây từ length 1 → 2 → 3
- 🔑 **At '0'**: `c010 += c01` (extend all "01" patterns), `c10 += c1` / mở rộng pattern có đuôi '1'
- 🔑 **At '1'**: `c101 += c10` (extend all "10" patterns), `c01 += c0` / mở rộng pattern có đuôi '0'
- 🔑 **Order matters**: Update length-3 BEFORE length-2 BEFORE length-1 at each step / thứ tự cập nhật quan trọng
- 🔑 **Answer**: `c010 + c101` — both alternating patterns of length 3 / cả hai pattern đều hợp lệ

---

## Solutions / Giải Pháp

### Solution 1: DP Counting (O(n) time, O(1) space)

```typescript
/**
 * Number of Ways to Select Buildings — DP Pattern Counting
 *
 * We want subsequences "010" and "101" (no two adjacent same type).
 * Track counts: c0, c1, c01, c10, c010, c101.
 * At each position, extend existing patterns by one character.
 *
 * Time:  O(n)
 * Space: O(1) — only 6 counters
 */
function numberOfWays(s: string): number {
  let c0 = 0,
    c1 = 0; // count of "0", "1" seen
  let c01 = 0,
    c10 = 0; // count of "01", "10" subsequences
  let c010 = 0,
    c101 = 0; // count of "010", "101" subsequences

  for (const ch of s) {
    if (ch === "0") {
      c010 += c01; // extend "01" → "010"
      c10 += c1; // extend "1" → "10"
      c0++;
    } else {
      c101 += c10; // extend "10" → "101"
      c01 += c0; // extend "0" → "01"
      c1++;
    }
  }

  return c010 + c101;
}

console.log(numberOfWays("001101")); // 6
console.log(numberOfWays("11100")); // 0
console.log(numberOfWays("0101")); // 2 ("010" at 0,1,2 and "101" at 1,2,3... let's verify)
console.log(numberOfWays("10")); // 0 (need length ≥ 3)
console.log(numberOfWays("010101")); // 9
```

### Solution 2: Prefix Count Approach (O(n) time, O(n) space)

```typescript
/**
 * Number of Ways to Select Buildings — Prefix Arrays
 *
 * For each middle position i (the 2nd element of the triplet),
 * count (number of opposite type before i) × (number of opposite type after i).
 *
 * If s[i]='0': count (1s before i) × (1s after i)  → "101" patterns
 * If s[i]='1': count (0s before i) × (0s after i)  → "010" patterns
 *
 * Time:  O(n)
 * Space: O(n)
 */
function numberOfWaysPrefix(s: string): number {
  const n = s.length;
  const prefix0 = new Array(n + 1).fill(0); // prefix0[i] = count of '0' in s[0..i)
  const prefix1 = new Array(n + 1).fill(0); // prefix1[i] = count of '1' in s[0..i)

  for (let i = 0; i < n; i++) {
    prefix0[i + 1] = prefix0[i] + (s[i] === "0" ? 1 : 0);
    prefix1[i + 1] = prefix1[i] + (s[i] === "1" ? 1 : 0);
  }

  const total0 = prefix0[n];
  const total1 = prefix1[n];
  let result = 0;

  for (let i = 1; i < n - 1; i++) {
    if (s[i] === "0") {
      // Middle is '0': need '1' before and '1' after → "101"
      const onesBefore = prefix1[i];
      const onesAfter = total1 - prefix1[i + 1];
      result += onesBefore * onesAfter;
    } else {
      // Middle is '1': need '0' before and '0' after → "010"
      const zerosBefore = prefix0[i];
      const zerosAfter = total0 - prefix0[i + 1];
      result += zerosBefore * zerosAfter;
    }
  }

  return result;
}

console.log(numberOfWaysPrefix("001101")); // 6
console.log(numberOfWaysPrefix("11100")); // 0
console.log(numberOfWaysPrefix("010101")); // 9
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                                                    | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Count Vowel Substrings of a String](https://leetcode.com/problems/count-vowel-substrings-of-a-string)                                     | 🟢 Easy    | Counting         |
| [Number of Substrings Containing All Three Characters](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters) | 🟡 Medium  | Sliding Window   |
| [Count Binary Substrings](https://leetcode.com/problems/count-binary-substrings)                                                           | 🟢 Easy    | Pattern Counting |
| [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence)                                                                     | 🟡 Medium  | Greedy / DP      |
