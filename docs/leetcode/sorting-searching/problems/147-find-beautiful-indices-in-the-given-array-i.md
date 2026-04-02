---
layout: page
title: "Find Beautiful Indices in the Given Array I"
difficulty: Medium
category: Sorting-Searching
tags: [Two Pointers, String, Binary Search, Rolling Hash, String Matching]
leetcode_url: "https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i"
---

# Find Beautiful Indices in the Given Array I / Tìm Các Chỉ Số Đẹp Trong Mảng I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching + Binary Search

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Tìm tất cả vị trí `i` trong `s` nơi pattern `a` bắt đầu, và `i` đẹp nếu tồn tại vị trí `j` nơi pattern `b` bắt đầu thỏa `|i - j| ≤ k`. Trước tiên tìm tất cả occurrence của `a` và `b`, sau đó với mỗi `i`, binary search để kiểm tra có `j` gần không.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find Beautiful Indices in the Given Array I example:**

```
s="isawsquirrelnearthetree", a="squ", b="irrel", k=15

Occurrences of "squ": [4]
Occurrences of "irrel": [8]

i=4: closest j in B = 8, |4-8|=4 ≤ 15 → beautiful ✅
Answer: [4]
```

---

## Problem Description

| #    | Problem                                            | Pattern         |
| ---- | -------------------------------------------------- | --------------- |
| 3006 | Find Beautiful Indices in the Given Array I        | This problem    |
| 3008 | Find Beautiful Indices in the Given Array II       | KMP             |
| 28   | Find the Index of the First Occurrence in a String | String Matching |
| 459  | Repeated Substring Pattern                         | KMP             |

---

## 📝 Interview Tips

- 🔑 **Two-phase** / Pha 1: tìm tất cả occurrence của a và b; Pha 2: binary search proximity
- 🔑 **indexOf loop** / Dùng `s.indexOf(a, start)` lặp để tìm tất cả vị trí — O(n×|a|)
- 🔑 **KMP/Z-algo** / Để O(n) string matching — nhưng indexOf thường đủ cho constraints
- 🔑 **Binary search** / Với mỗi i, tìm j ∈ B gần nhất: lower_bound(i-k) đến upper_bound(i+k)
- 🔑 **Two pointers** / Nếu cả A và B đã sorted, dùng 2 con trỏ — O(|A| + |B|)
- 🔑 **Result sorted** / A đã được build theo thứ tự tăng dần nên không cần sort lại

---

## Solutions

```typescript
// ─── Helper: find all starting indices of pattern in text ───
function findAll(text: string, pattern: string): number[] {
  const result: number[] = [];
  let pos = 0;
  while (true) {
    const idx = text.indexOf(pattern, pos);
    if (idx === -1) break;
    result.push(idx);
    pos = idx + 1; // advance by 1 to find overlapping matches
  }
  return result;
}

// ─── Solution 1: indexOf + Binary Search — O(n log n) ───
function beautifulIndices(s: string, a: string, b: string, k: number): number[] {
  const occA = findAll(s, a); // sorted ascending
  const occB = findAll(s, b); // sorted ascending

  const result: number[] = [];

  for (const i of occA) {
    // Binary search in occB for any j where |i - j| <= k
    // i.e., j in [i-k, i+k]
    let lo = 0,
      hi = occB.length - 1;
    let found = false;

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const j = occB[mid];
      if (Math.abs(i - j) <= k) {
        found = true;
        break;
      }
      if (j < i - k)
        lo = mid + 1; // j too small, need bigger j
      else hi = mid - 1; // j too large, need smaller j
    }

    if (found) result.push(i);
  }

  return result;
}

console.log(beautifulIndices("isawsquirrelnearthetree", "squ", "irrel", 15)); // [4]
console.log(beautifulIndices("abcd", "a", "a", 4)); // [0]

// ─── Solution 2: Two Pointers — O(|occA| + |occB|) ───
function beautifulIndicesTP(s: string, a: string, b: string, k: number): number[] {
  const occA = findAll(s, a);
  const occB = findAll(s, b);

  const result: number[] = [];
  let j = 0; // pointer into occB

  for (const i of occA) {
    // Advance j until occB[j] >= i - k (left boundary)
    while (j < occB.length && occB[j] < i - k) j++;

    // Check if any occB[j..] is within [i-k, i+k]
    if (j < occB.length && occB[j] <= i + k) result.push(i);
  }

  return result;
}

console.log(beautifulIndicesTP("isawsquirrelnearthetree", "squ", "irrel", 15)); // [4]
console.log(beautifulIndicesTP("abcd", "a", "a", 4)); // [0]

// ─── Solution 3: Brute Force — O(|occA| × |occB|) ───
function beautifulIndicesBrute(s: string, a: string, b: string, k: number): number[] {
  const occA = findAll(s, a);
  const occB = findAll(s, b);
  return occA.filter((i) => occB.some((j) => Math.abs(i - j) <= k));
}

console.log(beautifulIndicesBrute("isawsquirrelnearthetree", "squ", "irrel", 15)); // [4]
```

---

## 🔗 Related Problems

| #    | Problem                                            | Pattern         |
| ---- | -------------------------------------------------- | --------------- |
| 3006 | Find Beautiful Indices in the Given Array I        | This problem    |
| 3008 | Find Beautiful Indices in the Given Array II       | KMP             |
| 28   | Find the Index of the First Occurrence in a String | String Matching |
| 459  | Repeated Substring Pattern                         | KMP             |
