---
layout: page
title: "Merge Strings Alternately"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/merge-strings-alternately"
---

# Merge Strings Alternately / Ghép Hai Chuỗi Xen Kẽ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Như xáo bài — lấy một lá từ bộ bài trái, một lá từ bộ bài phải, xen kẽ nhau. Khi một bộ hết trước, ghép toàn bộ phần còn lại của bộ kia vào cuối.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Merge Strings Alternately example:**

```
word1 = "abc"   word2 = "pqr"
  a p b q c r
  ↑   ↑
  i   j   (both advance together)
Result: "apbqcr"

word1 = "ab"    word2 = "pqrs"
  a p b q . r . s
  ↑   ↑
  After i exhausts: append "rs"
Result: "apbqrs"
```

**Key insight**: Walk both strings simultaneously; after one runs out, append the rest of the longer one.

---

## Problem Description

| #    | Problem                                | Difficulty | Pattern      |
| ---- | -------------------------------------- | ---------- | ------------ |
| 21   | Merge Two Sorted Lists                 | 🟢 Easy    | Two Pointers |
| 88   | Merge Sorted Array                     | 🟢 Easy    | Two Pointers |
| 1768 | Merge Strings Alternately              | 🟢 Easy    | Two Pointers |
| 2645 | Minimum Additions to Make Valid String | 🟡 Medium  | Greedy       |

---

## 📝 Interview Tips

- 🔑 **EN**: Single loop condition `i < word1.length || j < word2.length` handles unequal lengths
  **VI**: Điều kiện vòng lặp `i < word1.length || j < word2.length` xử lý độ dài khác nhau
- 🔑 **EN**: Use optional chaining or bounds check before appending each character
  **VI**: Kiểm tra giới hạn trước khi thêm từng ký tự
- 🔑 **EN**: Collect chars in array then `join("")` — more efficient than string concatenation
  **VI**: Tích lũy ký tự vào mảng rồi `join("")` — hiệu quả hơn nối chuỗi
- 🔑 **EN**: Alternative: interleave up to `min(len1, len2)`, then append remainder
  **VI**: Cách khác: xen kẽ đến `min(len1, len2)`, rồi nối phần dư
- 🔑 **EN**: Time O(m+n), Space O(m+n) — unavoidable since we must build the result
  **VI**: Thời gian O(m+n), Không gian O(m+n) — không tránh được vì cần xây kết quả
- 🔑 **EN**: Edge: one string empty → just return the other
  **VI**: Trường hợp đặc biệt: một chuỗi rỗng → trả về chuỗi kia

---

```typescript
// ─── Solution 1: Single Loop — O(m+n) time, O(m+n) space ────────────────────
function mergeAlternately(word1: string, word2: string): string {
  const result: string[] = [];
  let i = 0,
    j = 0;

  while (i < word1.length || j < word2.length) {
    if (i < word1.length) result.push(word1[i++]);
    if (j < word2.length) result.push(word2[j++]);
  }

  return result.join("");
}

// Tests
console.log(mergeAlternately("abc", "pqr")); // "apbqcr"
console.log(mergeAlternately("ab", "pqrs")); // "apbqrs"
console.log(mergeAlternately("abcd", "pq")); // "apbqcd"
console.log(mergeAlternately("", "pq")); // "pq"
```

```typescript
// ─── Solution 2: Interleave + Append Remainder — O(m+n) time ─────────────────
function mergeAlternately2(word1: string, word2: string): string {
  const minLen = Math.min(word1.length, word2.length);
  let merged = "";

  for (let i = 0; i < minLen; i++) {
    merged += word1[i] + word2[i];
  }

  // Append the leftover of the longer string
  merged += word1.slice(minLen) + word2.slice(minLen);

  return merged;
}

// Tests
console.log(mergeAlternately2("abc", "pqr")); // "apbqcr"
console.log(mergeAlternately2("ab", "pqrs")); // "apbqrs"
console.log(mergeAlternately2("abcd", "pq")); // "apbqcd"
```

```typescript
// ─── Solution 3: Reduce / Functional style ───────────────────────────────────
function mergeAlternately3(word1: string, word2: string): string {
  const len = Math.max(word1.length, word2.length);
  return Array.from(
    { length: len },
    (_, i) => (i < word1.length ? word1[i] : "") + (i < word2.length ? word2[i] : ""),
  ).join("");
}

// Tests
console.log(mergeAlternately3("abc", "pqr")); // "apbqcr"
console.log(mergeAlternately3("ab", "pqrs")); // "apbqrs"
```

---

---

## Solutions


---

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Pattern      |
| ---- | -------------------------------------- | ---------- | ------------ |
| 21   | Merge Two Sorted Lists                 | 🟢 Easy    | Two Pointers |
| 88   | Merge Sorted Array                     | 🟢 Easy    | Two Pointers |
| 1768 | Merge Strings Alternately              | 🟢 Easy    | Two Pointers |
| 2645 | Minimum Additions to Make Valid String | 🟡 Medium  | Greedy       |
