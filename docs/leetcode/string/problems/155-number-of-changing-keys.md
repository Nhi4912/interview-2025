---
layout: page
title: "Number of Changing Keys"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/number-of-changing-keys"
---

# Number of Changing Keys / Số lần đổi phím

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống theo dõi người dùng gõ bàn phím — mỗi khi họ chuyển từ phím này sang phím khác (bỏ qua Shift/CapsLock) là một lần "đổi phím". So sánh từng ký tự liền kề sau khi lowercase.

```
s = "aAbBcC"
lowercase: "aabbcc"
Pairs: (a,a)=same, (a,b)=CHANGE, (b,b)=same, (b,c)=CHANGE, (c,c)=same
Changes: 2

s = "AaAaAaaA"
lowercase: "aaaaaaaa"
All same → 0 changes

s = "aB"
lowercase: "ab"
(a,b) = 1 change
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Case insensitive / Không phân biệt hoa thường**: lowercase cả hai trước khi so sánh
- 🔑 **Adjacent pairs / Cặp liền kề**: Chỉ so sánh `s[i]` và `s[i-1]`
- 🔑 **Start from index 1 / Bắt đầu từ 1**: `i=1` đến `n-1`, không phải 0
- 🔑 **Single pass O(n) / Một lượt O(n)**: Không cần preprocessing ngoài toLowerCase
- 🔑 **Shift does not count / Shift không tính**: CapsLock/Shift bỏ qua → lowercase
- 🔑 **Empty string edge / Chuỗi rỗng**: `s.length ≤ 1` → 0 changes

---

## Solutions

### Solution 1: Linear Scan (Optimal)

```typescript
/**
 * Compare consecutive chars case-insensitively.
 * Count transitions where lowercased chars differ.
 *
 * Time:  O(n)
 * Space: O(1) — toLowerCase is O(n) but constant extra
 */
function countKeyChanges(s: string): number {
  const low = s.toLowerCase();
  let changes = 0;
  for (let i = 1; i < low.length; i++) {
    if (low[i] !== low[i - 1]) changes++;
  }
  return changes;
}

console.log(countKeyChanges("aAbBcC")); // 2
console.log(countKeyChanges("AaAaAaaA")); // 0
console.log(countKeyChanges("aB")); // 1
console.log(countKeyChanges("a")); // 0
```

### Solution 2: filter + map (Functional)

```typescript
/**
 * Convert to lowercase array, compare adjacent with filter.
 * Time:  O(n)
 * Space: O(n) — intermediate arrays
 */
function countKeyChanges2(s: string): number {
  const chars = [...s.toLowerCase()];
  return chars.slice(1).filter((c, i) => c !== chars[i]).length;
}

console.log(countKeyChanges2("aAbBcC")); // 2
console.log(countKeyChanges2("AaAaAaaA")); // 0
```

### Solution 3: reduce (One-liner)

```typescript
/**
 * reduce over chars, accumulate count when prev !== current (lowercased).
 * Time:  O(n)
 * Space: O(n)
 */
function countKeyChanges3(s: string): number {
  const low = [...s.toLowerCase()];
  return low.reduce((acc, c, i) => acc + (i > 0 && c !== low[i - 1] ? 1 : 0), 0);
}

console.log(countKeyChanges3("aAbBcC")); // 2
console.log(countKeyChanges3("aB")); // 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                        | Difficulty | Pattern      |
| ---- | -------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| 1768 | [Merge Strings Alternately](https://leetcode.com/problems/merge-strings-alternately)                           | 🟢 Easy    | Two pointers |
| 1684 | [Count the Number of Consistent Strings](https://leetcode.com/problems/count-the-number-of-consistent-strings) | 🟢 Easy    | Counting     |
| 2351 | [First Letter to Appear Twice](https://leetcode.com/problems/first-letter-to-appear-twice)                     | 🟢 Easy    | Hash set     |
| 443  | [String Compression](https://leetcode.com/problems/string-compression)                                         | 🟡 Medium  | Two pointers |
