---
layout: page
title: "Repeated DNA Sequences"
difficulty: Medium
category: String
tags: [Hash Table, String, Bit Manipulation, Sliding Window, Rolling Hash]
leetcode_url: "https://leetcode.com/problems/repeated-dna-sequences"
---

# Repeated DNA Sequences / Chuỗi DNA Lặp Lại

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Set + Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như đọc một đoạn gene dài và đánh dấu từng đoạn 10 ký tự bằng bút dạ. Khi bạn gặp một đoạn đã được tô, đó là đoạn lặp lại. Bạn chỉ cần đi qua chuỗi một lần với "cửa sổ" cố định 10 ký tự.

**Pattern Recognition:**

- Signal: "substring of fixed length" + "find duplicates" → **Hash Set + Fixed Window**
- Window size = 10 (cố định), trượt từ trái sang phải
- Two-pass check: lần đầu `seen`, lần sau `duplicate`

**Visual:**

```
s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
       |--10--|
        |--10--|    slide →

i=0:  "AAAAACCCCC" → seen={AAAAACCCCC}
i=1:  "AAAACCCCCA" → seen add
...
i=10: "AAAAACCCCC" → already in seen → result add
```

## Problem Description

Given a DNA string `s`, return all 10-letter-long sequences that occur more than once. DNA consists of only `'A'`, `'C'`, `'G'`, `'T'`.

- **Example 1**: `s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"` → `["AAAAACCCCC","CCCCCAAAAA"]`
- **Example 2**: `s = "AAAAAAAAAAAAA"` → `["AAAAAAAAAA"]`

**Constraints**: `1 <= s.length <= 10^5`, `s[i]` is `'A'`, `'C'`, `'G'`, or `'T'`.

## 📝 Interview Tips

1. **Clarify**: "Window size luôn là 10?" / Window size is always 10 in this problem
2. **Approach**: "Dùng 2 Set: seen và result để tránh duplicate trong output" / Two sets prevent duplicates in result
3. **Edge cases**: "Chuỗi ngắn hơn 10 ký tự → return []" / Length < 10 returns empty
4. **Optimize**: "Dùng rolling hash thay substring để giảm Space" / Rolling hash avoids storing full substrings
5. **Test**: "Chuỗi toàn ký tự giống nhau như AAAAAAAAAAAAA" / All-same string is key test
6. **Follow-up**: "Nếu window size thay đổi theo input?" / Generalize to variable-length k

## Solutions

```typescript
/** Solution 1: Brute Force — nested loop kiểm tra mọi cặp
 * Time: O(n²·L) | Space: O(n·L) — L=10
 */
function repeatedDnaSequencesBrute(s: string): string[] {
  const result: string[] = [];
  for (let i = 0; i <= s.length - 10; i++) {
    const sub = s.substring(i, i + 10);
    for (let j = i + 1; j <= s.length - 10; j++) {
      if (s.substring(j, j + 10) === sub && !result.includes(sub)) {
        result.push(sub);
        break;
      }
    }
  }
  return result;
}

/** Solution 2: Hash Set — hai Set seen/result, một lần duyệt
 * Time: O(n·L) | Space: O(n·L) — L=10, thực tế O(n)
 */
function repeatedDnaSequences(s: string): string[] {
  const seen = new Set<string>();
  const result = new Set<string>();
  for (let i = 0; i <= s.length - 10; i++) {
    const sub = s.substring(i, i + 10);
    if (seen.has(sub)) result.add(sub);
    else seen.add(sub);
  }
  return [...result];
}

/** Solution 3: Rolling Hash (Rabin-Karp) — tránh tạo substring
 * Time: O(n) | Space: O(n)
 */
function repeatedDnaSequencesRollingHash(s: string): string[] {
  if (s.length <= 10) return [];
  const charMap: Record<string, number> = { A: 0, C: 1, G: 2, T: 3 };
  const seen = new Set<number>();
  const result = new Set<string>();
  const BASE = 4,
    L = 10;
  let hash = 0;
  const MOD = (1 << 20) - 1; // 4^10 = 2^20
  for (let i = 0; i < L; i++) hash = (hash * BASE + charMap[s[i]]) & MOD;
  seen.add(hash);
  for (let i = L; i < s.length; i++) {
    hash = ((hash * BASE) & MOD) + charMap[s[i]] - charMap[s[i - L]] * Math.pow(BASE, L);
    // Simpler: recompute or use bitmask approach
    hash = hash & MOD;
    if (seen.has(hash)) result.add(s.substring(i - L + 1, i + 1));
    else seen.add(hash);
  }
  return [...result];
}

// Test cases
console.log(repeatedDnaSequences("AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT")); // ["AAAAACCCCC","CCCCCAAAAA"]
console.log(repeatedDnaSequences("AAAAAAAAAAAAA")); // ["AAAAAAAAAA"]
console.log(repeatedDnaSequences("ACGT")); // []
```

## 🔗 Related Problems

| Problem                                                                                                              | Relationship                         |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Strings Differ by One Character](https://leetcode.com/problems/strings-differ-by-one-character)                     | Fixed-length substring hashing       |
| [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring)                             | Rolling hash for duplicate detection |
| [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | Fixed window sliding over string     |
