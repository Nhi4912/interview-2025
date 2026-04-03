---
layout: page
title: "Check if All Characters Have Equal Number of Occurrences"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/check-if-all-characters-have-equal-number-of-occurrences"
---

# Check if All Characters Have Equal Number of Occurrences / Kiểm tra tất cả ký tự xuất hiện đều nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia kẹo đều — đếm kẹo từng loại, rồi kiểm tra mọi loại có đúng cùng số lượng không. Nếu Set của tất cả số đếm có kích thước = 1 → tất cả bằng nhau.

```
s = "abacbc"
Count: {a:2, b:2, c:2}
Set of values: {2}  → size = 1 → true ✅

s = "aaabb"
Count: {a:3, b:2}
Set of values: {3, 2} → size = 2 → false ❌

s = "z"
Count: {z:1}
Set of values: {1} → size = 1 → true ✅
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Count frequencies / Đếm tần số**: Map hoặc 26-element array
- 🔑 **Set of values / Set các giá trị**: `new Set(freq.values()).size === 1`
- 🔑 **One-line check / Kiểm tra một dòng**: Cực kỳ gọn với Set
- 🔑 **All same OR all different? / Tất cả bằng hay khác nhau?**: Đề hỏi bằng nhau, không phải duy nhất
- 🔑 **Edge: single char / Ký tự đơn**: s = "a" → true (trivially equal)
- 🔑 **26-array vs Map / 26-mảng vs Map**: 26-array nhanh hơn cho lowercase-only

---

## Solutions

### Solution 1: Map + Set (Clearest)

```typescript
/**
 * Count char frequencies with a Map.
 * All equal ↔ Set of frequency values has exactly 1 unique value.
 *
 * Time:  O(n)
 * Space: O(1) — at most 26 distinct lowercase letters
 */
function areOccurrencesEqual(s: string): boolean {
  const freq = new Map<string, number>();
  for (const c of s) {
    freq.set(c, (freq.get(c) ?? 0) + 1);
  }
  return new Set(freq.values()).size === 1;
}

console.log(areOccurrencesEqual("abacbc")); // true
console.log(areOccurrencesEqual("aaabb")); // false
console.log(areOccurrencesEqual("z")); // true
console.log(areOccurrencesEqual("aabb")); // true
```

### Solution 2: Array Count (Fastest for lowercase)

```typescript
/**
 * Use a 26-element array for O(1) access per char.
 * Compare all non-zero counts against the first non-zero count.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function areOccurrencesEqual2(s: string): boolean {
  const cnt = new Array<number>(26).fill(0);
  for (const c of s) cnt[c.charCodeAt(0) - 97]++;

  const target = cnt.find((v) => v > 0)!;
  return cnt.every((v) => v === 0 || v === target);
}

console.log(areOccurrencesEqual2("abacbc")); // true
console.log(areOccurrencesEqual2("aaabb")); // false
```

### Solution 3: Sort Values (Alternative)

```typescript
/**
 * Sort frequency values; equal iff first === last (all same).
 * Time:  O(n + k log k) where k ≤ 26
 * Space: O(k)
 */
function areOccurrencesEqual3(s: string): boolean {
  const freq: Record<string, number> = {};
  for (const c of s) freq[c] = (freq[c] ?? 0) + 1;
  const vals = Object.values(freq).sort((a, b) => a - b);
  return vals[0] === vals[vals.length - 1];
}

console.log(areOccurrencesEqual3("abacbc")); // true
console.log(areOccurrencesEqual3("aaabb")); // false
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                  | Difficulty | Pattern     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 242  | [Valid Anagram](https://leetcode.com/problems/valid-anagram)                                                                             | 🟢 Easy    | Counting    |
| 387  | [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string)                                   | 🟢 Easy    | Counting    |
| 451  | [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency)                                               | 🟡 Medium  | Bucket sort |
| 1347 | [Minimum Number of Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram) | 🟡 Medium  | Counting    |
