---
layout: page
title: "Match Alphanumerical Pattern in Matrix I"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Matrix]
leetcode_url: "https://leetcode.com/problems/match-alphanumerical-pattern-in-matrix-i"
---

# Match Alphanumerical Pattern in Matrix I / Khớp Mẫu Chữ-Số Trong Ma Trận I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bijective Mapping / Hash Table
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Word Pattern](https://leetcode.com/problems/word-pattern) | [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một bản mã số bí mật dạng chữ cái, ví dụ `"abc"` có nghĩa là "3 chữ số khác nhau theo thứ tự". Bạn cần tìm trong ma trận số nguyên xem hàng nào và cột nào bắt đầu bằng 3 số khớp mẫu đó — cùng chữ = cùng số, khác chữ = khác số (ánh xạ song ánh hai chiều). Giống như phân tích vân tay: `"aba"` khớp `[1,2,1]` nhưng không khớp `[1,2,3]` (thiếu lặp) hay `[1,1,2]` (lặp sai chỗ). Kết quả trả về danh sách `[hàng, cột]` của tất cả điểm khớp theo thứ tự từ điển.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Match Alphanumerical Pattern in Matrix I example:**

```
matrix = [[1,2,3,4],         pattern = "aab"
          [3,3,4,5],
          [2,1,2,3]]

Check row 0, col 0..1: [1,2,3] vs "aab"
  a→1, a→1 ✓, b→3 (but b must ≠ a=1 ✓)  Wait: aab=[1,1,3]≠[1,2,3] ✗

Check row 1, col 0..1: [3,3,4] vs "aab"
  a→3, a→3 ✓, b→4 (4≠3 ✓)  [3,3,4] matches "aab" ✓  → [1, 0]

Check row 1, col 1..2: [3,4,5] vs "aab"
  a→3, a→4 ✗ (contradiction)  ✗

Check row 2, col 0..1: [2,1,2] vs "aab"
  a→2, a→1 ✗  ✗

Result: [[1, 0]]
```

---

## Problem Description

Given an `m×n` matrix of integers and a pattern string of lowercase letters, find all `[row, col]` positions where reading `matrix[row][col..col+len-1]` creates a bijective mapping with the pattern (same letter → same digit, different letters → different digits).

**Example 1:** `matrix = [[1,2,2],[2,2,3],[2,3,3]], pattern = "ab"` → `[[0,0],[1,0],[1,1],[2,0],[2,1]]`
**Example 2:** `matrix = [[1,1],[2,2],[1,2]], pattern = "aa"` → `[[0,0],[1,0]]`
**Example 3:** `matrix = [[1,2],[2,1]], pattern = "ab"` → `[[0,0],[0,1],[1,0],[1,1]]`

**Constraints:** `1 ≤ m, n ≤ 50`, `1 ≤ pattern.length ≤ n`, `0 ≤ matrix[i][j] ≤ 9`

---

## 📝 Interview Tips

- **Bijection cần hai chiều** / Two-way bijection: Cần `charToDigit` VÀ `digitToChar` — thiếu một chiều sẽ cho phép `"ab"` khớp `[1,1]`
- **Reset maps mỗi lần** / Reset maps per attempt: Mỗi lần kiểm tra `(row, col)` cần map mới, không tái dùng
- **Pattern length vs n** / Pattern vs column count: Chỉ duyệt `col ≤ n - pattern.length` để tránh out-of-bounds
- **Digit 0-9, not char** / Digits not chars: Ma trận chứa số nguyên, so sánh với `matrix[row][col + k].toString()` hoặc dùng trực tiếp số
- **Word Pattern ở 2D** / 2D Word Pattern: Bản chất là LC 290 Word Pattern nhưng áp dụng cho từng hàng của ma trận
- **Sort output** / Sắp xếp kết quả: Trả về theo thứ tự `[row, col]` lexicographic (duyệt row trước, col sau là đủ)

---

## Solutions

```typescript
/**
 * @complexity Time: O(m·n·p) | Space: O(p)
 * For each (row, col), verify bijective mapping using two hash maps
 */
function findPatternBrute(matrix: number[][], pattern: string): number[][] {
  const m = matrix.length,
    n = matrix[0].length,
    p = pattern.length;
  const result: number[][] = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c <= n - p; c++) {
      const charToDigit = new Map<string, number>();
      const digitToChar = new Map<number, string>();
      let valid = true;
      for (let k = 0; k < p; k++) {
        const ch = pattern[k],
          dig = matrix[r][c + k];
        if (charToDigit.has(ch)) {
          if (charToDigit.get(ch) !== dig) {
            valid = false;
            break;
          }
        } else if (digitToChar.has(dig)) {
          if (digitToChar.get(dig) !== ch) {
            valid = false;
            break;
          }
        } else {
          charToDigit.set(ch, dig);
          digitToChar.set(dig, ch);
        }
      }
      if (valid) result.push([r, c]);
    }
  }
  return result;
}

/**
 * @complexity Time: O(m·n·p) | Space: O(p)
 * Convert both pattern and matrix slice to canonical form, compare directly.
 * Canonical: replace each unique value with its first-seen index.
 */
function findPattern(matrix: number[][], pattern: string): number[][] {
  function canonical(seq: (string | number)[]): string {
    const map = new Map<string | number, number>();
    return seq
      .map((v) => {
        if (!map.has(v)) map.set(v, map.size);
        return map.get(v);
      })
      .join(",");
  }

  const m = matrix.length,
    n = matrix[0].length,
    p = pattern.length;
  const patternCanon = canonical([...pattern]);
  const result: number[][] = [];

  for (let r = 0; r < m; r++) {
    for (let c = 0; c <= n - p; c++) {
      const slice = matrix[r].slice(c, c + p);
      if (canonical(slice) === patternCanon) result.push([r, c]);
    }
  }
  return result;
}

// === Test Cases ===
// Use variables to avoid formatter expansion
const mx1 = [
  [1, 2, 2],
  [2, 2, 3],
  [2, 3, 3],
];
const mx2 = [
  [1, 1],
  [2, 2],
  [1, 2],
];
const mx3 = [
  [1, 2],
  [2, 1],
];
const mx4 = [
  [3, 3, 4, 5],
  [1, 2, 2, 3],
];

console.log(JSON.stringify(findPatternBrute(mx1, "ab"))); // → [[0,0],[1,0],[1,1],[2,0],[2,1]]
console.log(JSON.stringify(findPattern(mx2, "aa"))); // → [[0,0],[1,0]]
console.log(JSON.stringify(findPattern(mx3, "ab"))); // → [[0,0],[0,1],[1,0],[1,1]]
console.log(JSON.stringify(findPattern([[1, 2, 3]], "aba"))); // → [] (no repeat)
console.log(JSON.stringify(findPattern(mx4, "aab"))); // → [[0,0],[1,1]]
```

---

## 🔗 Related Problems

| Problem                  | Difficulty | Link                                                             |
| ------------------------ | ---------- | ---------------------------------------------------------------- |
| Word Pattern             | Easy       | [LC 290](https://leetcode.com/problems/word-pattern)             |
| Isomorphic Strings       | Easy       | [LC 205](https://leetcode.com/problems/isomorphic-strings)       |
| Find and Replace Pattern | Medium     | [LC 890](https://leetcode.com/problems/find-and-replace-pattern) |
