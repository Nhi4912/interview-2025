---
layout: page
title: "Permutation Difference between Two Strings"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/permutation-difference-between-two-strings"
---

# Permutation Difference between Two Strings / Độ Lệch Hoán Vị Giữa Hai Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Mỗi ký tự có vị trí trong `s` và vị trí trong `t`. Độ lệch = tổng `|pos_s(c) - pos_t(c)|` cho mọi ký tự. Xây bảng vị trí từ cả hai chuỗi, rồi cộng hiệu tuyệt đối.

```
s = "abc"   t = "bca"
  a: pos_s=0, pos_t=2 → |0-2| = 2
  b: pos_s=1, pos_t=0 → |1-0| = 1
  c: pos_s=2, pos_t=1 → |2-1| = 1
  Total = 2 + 1 + 1 = 4
```

**Key insight**: Build two position maps (or arrays), then sum `|posS[c] - posT[c]|` for every distinct char.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: `s` and `t` contain the same set of distinct characters (guaranteed by problem)
  **VI**: `s` và `t` chứa cùng tập ký tự phân biệt (đề đảm bảo)
- 🔑 **EN**: Build maps in one pass each; then iterate over chars of `s` to sum differences
  **VI**: Xây map mỗi chuỗi trong một lượt; rồi duyệt ký tự của `s` để cộng hiệu
- 🔑 **EN**: Array of size 26 is faster than a Map for lowercase letters
  **VI**: Mảng kích thước 26 nhanh hơn Map cho chữ thường
- 🔑 **EN**: Can do in a single pass over `s`: build `posS`, then scan `t` for `posT`, then sum
  **VI**: Có thể dùng một lượt trên `s`: xây `posS`, duyệt `t` lấy `posT`, rồi cộng
- 🔑 **EN**: Time O(n), Space O(1) — only 26 possible characters
  **VI**: Thời gian O(n), Không gian O(1) — chỉ 26 ký tự có thể có
- 🔑 **EN**: Absolute difference, not signed — use `Math.abs`
  **VI**: Hiệu tuyệt đối, không có dấu — dùng `Math.abs`

---

```typescript
// ─── Solution 1: Two Maps — O(n) time, O(1) space ────────────────────────────
function findPermutationDifference(s: string, t: string): number {
  const posS = new Map<string, number>();
  const posT = new Map<string, number>();

  for (let i = 0; i < s.length; i++) posS.set(s[i], i);
  for (let i = 0; i < t.length; i++) posT.set(t[i], i);

  let diff = 0;
  for (const ch of s) {
    diff += Math.abs(posS.get(ch)! - posT.get(ch)!);
  }

  return diff;
}

// Tests
console.log(findPermutationDifference("abc", "bca")); // 4
console.log(findPermutationDifference("abcd", "dcba")); // 8
console.log(findPermutationDifference("a", "a")); // 0
console.log(findPermutationDifference("ab", "ba")); // 2
```

```typescript
// ─── Solution 2: Array (26 slots) — O(n) time, O(1) space ────────────────────
function findPermutationDifference2(s: string, t: string): number {
  const posS = new Array(26).fill(-1);
  const posT = new Array(26).fill(-1);

  for (let i = 0; i < s.length; i++) posS[s.charCodeAt(i) - 97] = i;
  for (let i = 0; i < t.length; i++) posT[t.charCodeAt(i) - 97] = i;

  let diff = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97;
    diff += Math.abs(posS[c] - posT[c]);
  }

  return diff;
}

// Tests
console.log(findPermutationDifference2("abc", "bca")); // 4
console.log(findPermutationDifference2("abcd", "dcba")); // 8
console.log(findPermutationDifference2("a", "a")); // 0
```

```typescript
// ─── Solution 3: Single Map — O(n) time, O(1) space ──────────────────────────
function findPermutationDifference3(s: string, t: string): number {
  // Store s positions, then look up t positions inline
  const posS = new Map<string, number>();
  for (let i = 0; i < s.length; i++) posS.set(s[i], i);

  let diff = 0;
  for (let i = 0; i < t.length; i++) {
    diff += Math.abs(posS.get(t[i])! - i);
  }
  return diff;
}

// Tests
console.log(findPermutationDifference3("abc", "bca")); // 4
console.log(findPermutationDifference3("abcd", "dcba")); // 8
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                          | Difficulty | Pattern  |
| ---- | ------------------------------------------------ | ---------- | -------- |
| 242  | Valid Anagram                                    | 🟢 Easy    | Hash Map |
| 387  | First Unique Character in a String               | 🟢 Easy    | Hash Map |
| 1832 | Check if the Sentence Is Pangram                 | 🟢 Easy    | Hash Set |
| 2006 | Count Number of Pairs With Absolute Difference K | 🟢 Easy    | Hash Map |
