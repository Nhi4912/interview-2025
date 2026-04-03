---
layout: page
title: "Compare Version Numbers"
difficulty: Medium
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/compare-version-numbers"
---

# Compare Version Numbers / So Sánh Số Phiên Bản

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Parsing / Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [String Compression](https://leetcode.com/problems/string-compression) | [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống so sánh ngày tháng năm — so từng phần (năm → tháng → ngày), phần trước quyết định trước. Phần thiếu tương đương giá trị 0.

**Pattern Recognition:**

- Signal: "version string" + "compare by parts" → **Split on delimiter, compare integers**
- Ký tự `"."` là delimiter; sau split, so sánh từng phần bằng `parseInt`
- Key insight: phần thiếu (version ngắn hơn) được coi là 0 — không phải kết thúc sớm

**Visual — "1.0.1" vs "1":**

```
v1 = ["1","0","1"]   →  parts: 1, 0, 1
v2 = ["1"]           →  parts: 1, 0*, 0*  (* missing = 0)

step 1: 1 == 1  → continue
step 2: 0 == 0  → continue
step 3: 1 >  0  → return 1  ✅
```

---

## Problem Description

Given version strings `version1` and `version2`, compare them. Return `-1` if `version1 < version2`, `1` if `version1 > version2`, else `0`. Revisions are separated by `"."` and compared as integers (leading zeros ignored).

```
Example 1: version1="1.2", version2="1.10"  → -1  (2 < 10)
Example 2: version1="1.01", version2="1.001" → 0  (1 == 1)
Example 3: version1="1.0", version2="1"      → 0  (0 == missing=0)
```

Constraints: Version strings only contain digits and `"."`, `1 <= version.length <= 500`.

---

## 📝 Interview Tips

1. **Clarify**: "Có leading zeros không? Phần thiếu tính là 0?" / Leading zeros in revision? Missing revision = 0?
2. **Brute force**: "Split cả hai, so từng cặp" — đây cũng là optimal / Split-and-compare IS the optimal approach
3. **Optimize**: "Dùng two-pointer trên string để tránh split nếu memory quan trọng" / Pointer-based avoids extra arrays
4. **Edge cases**: "\"1.0\" vs \"1\", \"0.1\" vs \"0.0.1\", leading zeros \"01\"" / Trailing zeros, deep nesting, leading zeros
5. **Follow-up**: "Nếu có alpha/beta suffix? Semantic versioning?" / What about pre-release tags like "1.0.0-alpha"?
6. **parseInt trap**: "`parseInt('01') === 1`" — parseInt loại bỏ leading zero đúng / Works correctly for leading zeros

---

## Solutions

```typescript
/**
 * Solution 1: Split and Compare
 * Time: O(n + m) — split both strings once
 * Space: O(n + m) — store both parts arrays
 */
function compareVersionNumbers(version1: string, version2: string): number {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  const len = Math.max(v1.length, v2.length);

  for (let i = 0; i < len; i++) {
    const n1 = parseInt(v1[i] ?? "0", 10);
    const n2 = parseInt(v2[i] ?? "0", 10);
    if (n1 < n2) return -1;
    if (n1 > n2) return 1;
  }
  return 0;
}

/**
 * Solution 2: Two Pointers (no split, O(1) extra space)
 * Time: O(n + m) — single pass through both strings
 * Space: O(1) — no auxiliary arrays
 */
function compareVersionPointers(version1: string, version2: string): number {
  let i = 0,
    j = 0;

  while (i < version1.length || j < version2.length) {
    let n1 = 0,
      n2 = 0;

    // Parse next revision from version1
    while (i < version1.length && version1[i] !== ".") {
      n1 = n1 * 10 + parseInt(version1[i++], 10);
    }
    i++; // skip '.'

    // Parse next revision from version2
    while (j < version2.length && version2[j] !== ".") {
      n2 = n2 * 10 + parseInt(version2[j++], 10);
    }
    j++; // skip '.'

    if (n1 < n2) return -1;
    if (n1 > n2) return 1;
  }
  return 0;
}

// === Test Cases ===
console.log(compareVersionNumbers("1.2", "1.10")); // -1
console.log(compareVersionNumbers("1.01", "1.001")); // 0
console.log(compareVersionNumbers("1.0", "1")); // 0
console.log(compareVersionNumbers("1.0.1", "1")); // 1
```

---

## 🔗 Related Problems

- [String Compression](https://leetcode.com/problems/string-compression) — string parsing with two-pointer technique
- [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) — substring scanning
- [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string) — split on delimiter, process parts
- [Valid IP Address](https://leetcode.com/problems/validate-ip-address) — similar split-and-validate pattern
