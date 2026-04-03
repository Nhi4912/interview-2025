---
layout: page
title: "Count Binary Substrings"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/count-binary-substrings"
---

# Count Binary Substrings / Đếm Chuỗi Con Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Group Counting / Linear Scan
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [String Compression](https://leetcode.com/problems/string-compression) | [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Chia chuỗi thành các nhóm liên tiếp cùng ký tự ("000111" → [3,3]). Tại mỗi ranh giới giữa hai nhóm kề nhau, số chuỗi con hợp lệ bằng `min(nhóm trước, nhóm sau)`.

**Pattern Recognition:**

- Signal: "equal number of 0s and 1s" + "contiguous" → **Count consecutive groups**
- Không cần sliding window hay DP — chỉ cần track độ dài nhóm hiện tại và nhóm trước
- Key insight: `min(prev, cur)` là số chuỗi con valid tại ranh giới này

**Visual — s="00110011":**

```
Groups:  [2, 2, 2, 2]   (00, 11, 00, 11)

Boundary 0→1: min(2,2)=2  → "01","0011"     count+=2
Boundary 1→0: min(2,2)=2  → "10","1100"     count+=2
Boundary 0→1: min(2,2)=2  → "01","0011"     count+=2
Total = 6 ✅
```

---

## Problem Description

Given binary string `s`, return the number of non-empty substrings that have the same number of `0`s and `1`s, and all the `0`s and all the `1`s in these substrings are grouped consecutively (e.g., `"0011"`, `"10"` are valid; `"0101"` is not).

```
Example 1: s="00110011" → 6  ("0011","01","11","1100","10","0011")
Example 2: s="10101"    → 4  ("10","01","10","01")
Example 3: s="0"        → 0
```

Constraints: `1 <= s.length <= 10^5`, `s[i]` is `'0'` or `'1'`.

---

## 📝 Interview Tips

1. **Clarify**: "Substrings phải có tất cả 0s liền nhau và tất cả 1s liền nhau?" / All same chars must be contiguous?
2. **Brute force**: "Kiểm tra mọi substring O(n²)" — đếm 0 và 1, validate cấu trúc / Check every pair O(n^2)
3. **Optimize**: "Chia nhóm liên tiếp, dùng min(prev_group, cur_group)" / Group-count trick, O(n)
4. **Edge cases**: "Chuỗi chỉ toàn 0s hoặc toàn 1s → 0, chuỗi độ dài 1 → 0" / All-same chars, single char
5. **Follow-up**: "Nếu cần liệt kê tất cả substrings? O(n) count nhưng O(n²) space" / Enumerate vs count
6. **Complexity**: "O(n) time, O(1) space — elegant linear scan" / Single pass, constant extra space

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all substrings
 * Time: O(n^2) — all pairs of indices
 * Space: O(1)
 */
function countBinarySubstringsBrute(s: string): number {
  let count = 0;
  for (let i = 0; i < s.length - 1; i++) {
    let zeros = 0,
      ones = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === "0") zeros++;
      else ones++;
      // Valid: equal count AND grouped (all same before crossing)
      if (zeros === ones) {
        const half = zeros;
        const sub = s.slice(i, j + 1);
        if (/^0+1+$|^1+0+$/.test(sub)) count++;
      }
    }
  }
  return count;
}

/**
 * Solution 2: Group Counting (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — only two counters
 */
function countBinarySubstrings(s: string): number {
  let prev = 0; // length of previous group
  let cur = 1; // length of current group
  let count = 0;

  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      cur++;
    } else {
      // New group starts — add valid substrings from this boundary
      count += Math.min(prev, cur);
      prev = cur;
      cur = 1;
    }
  }

  // Don't forget the last boundary
  count += Math.min(prev, cur);
  return count;
}

// === Test Cases ===
console.log(countBinarySubstrings("00110011")); // 6
console.log(countBinarySubstrings("10101")); // 4
console.log(countBinarySubstrings("0")); // 0
console.log(countBinarySubstrings("0011")); // 2
```

---

## 🔗 Related Problems

- [String Compression](https://leetcode.com/problems/string-compression) — also groups consecutive chars
- [Number of Substrings Containing All Three Characters](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters) — substring counting with constraints
- [Consecutive Characters](https://leetcode.com/problems/consecutive-characters) — max run of same char
- [Find the Longest Equal Subarray](https://leetcode.com/problems/find-the-longest-equal-subarray) — grouping pattern
