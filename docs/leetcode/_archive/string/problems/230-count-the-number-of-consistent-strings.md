---
layout: page
title: "Count the Number of Consistent Strings"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Bit Manipulation, Counting]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-consistent-strings"
---

# Count the Number of Consistent Strings / Đếm Số Chuỗi Nhất Quán

---

## 🧠 Intuition / Tư Duy

**Analogy:** Chuỗi được gọi là **nhất quán** nếu mọi ký tự trong nó đều xuất hiện trong chuỗi `allowed`. Cho `allowed` và mảng `words`, đếm số chuỗi nhất quán trong `words`.

**Ví dụ:** `allowed = "ab"`, `words = ["ad","bd","aaab","baa","badab"]` → `"aaab"` ✓, `"baa"` ✓ → kết quả `2`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count the Number of Consistent Strings example:**

```
allowed = "ab"
Allowed set: {a, b}

words:
"ad"   → 'd' ∉ {a,b} → NOT consistent
"bd"   → 'd' ∉ {a,b} → NOT consistent
"aaab" → all ∈ {a,b} → CONSISTENT ✓
"baa"  → all ∈ {a,b} → CONSISTENT ✓
"badab"→ 'd' ∉ {a,b} → NOT consistent

Count = 2

Bitmask approach:
allowed "ab" → bit 0 (a) | bit 1 (b) = 0b11 = 3
"aaab": bits = 0b11 = 3, (3 & ~3) = 0 → consistent ✓
"ad":   bits = 0b1001, (9 & ~3) = 8 ≠ 0 → not consistent
```

---

## Problem Description

- Trả về số chuỗi trong `words` mà mọi ký tự đều thuộc `allowed`.

**Constraints:** `1 <= words.length <= 10^4`, `1 <= allowed.length <= 26`, chỉ chứa chữ thường.

---

## 📝 Interview Tips

1. **Set cho O(1) lookup** — tạo Set từ `allowed`.
2. **Bitmask** — encode `allowed` thành 26-bit number, so sánh nhanh.
3. **every()** — `word.split('').every(ch => allowed.has(ch))`.
4. **Early termination** — ngay khi gặp ký tự không được phép, dừng word đó.
5. **Bitmask trick** — nếu `(wordBits & ~allowedBits) === 0` → consistent.
6. **Độ phức tạp** — O(n·m) với n = tổng độ dài words, m = |allowed|.

---

## Solutions

```typescript
function countConsistentStrings(allowed: string, words: string[]): number {
  const allowedSet = new Set(allowed);

  return words.filter((word) => word.split("").every((ch) => allowedSet.has(ch))).length;
}

// Test cases
console.log(countConsistentStrings("ab", ["ad", "bd", "aaab", "baa", "badab"])); // 2
console.log(countConsistentStrings("abc", ["a", "b", "c", "ab", "ac", "bc", "abc"])); // 7
console.log(countConsistentStrings("cad", ["cc", "acd", "b", "ba", "bac", "bad", "ac", "d"])); // 4

function countConsistentStringsBitmask(allowed: string, words: string[]): number {
  // Build bitmask for allowed characters
  let allowedMask = 0;
  for (const ch of allowed) {
    allowedMask |= 1 << (ch.charCodeAt(0) - 97);
  }

  let count = 0;
  for (const word of words) {
    let wordMask = 0;
    for (const ch of word) {
      wordMask |= 1 << (ch.charCodeAt(0) - 97);
    }
    // Word is consistent if all its bits are subset of allowed bits
    if ((wordMask & ~allowedMask) === 0) count++;
  }

  return count;
}

console.log(countConsistentStringsBitmask("ab", ["ad", "bd", "aaab", "baa", "badab"])); // 2
console.log(countConsistentStringsBitmask("abc", ["a", "b", "c", "ab", "ac", "bc", "abc"])); // 7
console.log(
  countConsistentStringsBitmask("cad", ["cc", "acd", "b", "ba", "bac", "bad", "ac", "d"]),
); // 4

function countConsistentStringsLoop(allowed: string, words: string[]): number {
  const allowedSet = new Set(allowed);
  let count = 0;

  for (const word of words) {
    let consistent = true;
    for (const ch of word) {
      if (!allowedSet.has(ch)) {
        consistent = false;
        break; // Early exit
      }
    }
    if (consistent) count++;
  }

  return count;
}

console.log(countConsistentStringsLoop("ab", ["ad", "bd", "aaab", "baa", "badab"])); // 2
console.log(countConsistentStringsLoop("abc", ["a", "b", "c", "ab", "ac", "bc", "abc"])); // 7

// Performance comparison: bitmask is fastest for large inputs
const bigWords = Array.from({ length: 10000 }, () =>
  Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 5))).join(
    "",
  ),
);
console.time("bitmask");
countConsistentStringsBitmask("abcde", bigWords);
console.timeEnd("bitmask");
```

---

## 🔗 Related Problems

| Giải pháp   | Thời gian | Không gian | Ghi chú             |
| ----------- | --------- | ---------- | ------------------- |
| Set + every | O(n·m)    | O(k)       | Ngắn gọn            |
| Bitmask     | O(n·m)    | O(1)       | Tốc độ cao, bit ops |
| For Loop    | O(n·m)    | O(k)       | Early exit tốt nhất |

k = |allowed|, n = |words|, m = avg word length
