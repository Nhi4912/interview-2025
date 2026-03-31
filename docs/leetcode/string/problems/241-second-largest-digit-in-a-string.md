---
layout: page
title: "Second Largest Digit in a String"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/second-largest-digit-in-a-string"
---

# Second Largest Digit in a String / Second Largest Digit in a String

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Tracking Top-2
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number in at Least Two Consecutive Arrays](https://leetcode.com/problems/largest-number-in-at-least-two-consecutive-arrays) | [Third Maximum Number](https://leetcode.com/problems/third-maximum-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cuộc thi đua xe — bạn chỉ cần biết ai về nhất và nhì, không cần xếp hạng toàn bộ. Dùng 2 biến để theo dõi top-1 và top-2, cập nhật khi thấy ký tự số mới.

**Visual — Two-variable tracking:**

```
s = "dfa12321afd"
     d f a 1 2 3 2 1 a f d

Only look at digits: 1, 2, 3, 2, 1

first = -1, second = -1

d: skip (not digit)
1: first=-1 → 1>-1 → second=first=-1, first=1     [first=1, second=-1]
2: 2>first=1 → second=1, first=2                  [first=2, second=1]
3: 3>first=2 → second=2, first=3                  [first=3, second=2]
2: 2<first, 2=second → skip (not strictly less)   [first=3, second=2]
1: 1<second=2 → skip                              [first=3, second=2]

Result: second = 2 ✅
```

---

## Problem Description

Given an alphanumeric string `s`, return the **second largest** numerical digit that appears in `s`, or `-1` if it does not exist.

**Example 1:** `s = "dfa12321afd"` → `2`
**Example 2:** `s = "abc1111"` → `-1` (only one distinct digit `'1'`)

Constraints: `1 <= s.length <= 500`, `s` consists of lowercase English letters and digits.

---

## 📝 Interview Tips

1. **Clarify**: "Số lớn thứ 2 phân biệt — không phải lần xuất hiện thứ 2 của digit" / Second LARGEST distinct digit, not second occurrence
2. **Track top-2**: "Dùng 2 biến first/second thay vì sort — O(n) thay vì O(n log n)" / Two variables instead of sorting: O(n) vs O(n log n)
3. **Strict inequality**: "second phải nhỏ hơn NGHIÊM NGẶT first — tránh lưu giá trị trùng" / second must be strictly less than first
4. **Hash set variant**: "Dùng Set lưu tất cả digits rồi sort — clean hơn nhưng O(10 log 10) extra" / Use Set to collect all digits then sort: clean but adds small overhead
5. **Edge cases**: "Không có digit → -1; chỉ 1 loại digit → -1; digit lớn nhất là '9'" / No digits → -1; only one distinct digit → -1
6. **Follow-up**: "Tìm k-th largest digit tổng quát? → dùng min-heap size k" / k-th largest in general → use min-heap of size k

---

## Solutions

```typescript
/**
 * Solution 1: Collect all distinct digits then sort
 * Time: O(n) — scan string; sorting 10 digits is O(10 log 10) = O(1)
 * Space: O(1) — at most 10 distinct digits
 */
function secondHighestBrute(s: string): number {
  const digits = new Set<number>();
  for (const c of s) {
    if (c >= '0' && c <= '9') digits.add(parseInt(c));
  }
  const sorted = [...digits].sort((a, b) => b - a);
  return sorted.length >= 2 ? sorted[1] : -1;
}

/**
 * Solution 2: Track top-2 in a single pass
 * Maintain `first` (largest seen) and `second` (second largest seen).
 * Update both whenever a new digit is found.
 * Time: O(n) — single pass
 * Space: O(1) — only two variables
 */
function secondHighest(s: string): number {
  let first = -1;
  let second = -1;

  for (const c of s) {
    if (c >= '0' && c <= '9') {
      const d = parseInt(c);
      if (d > first) {
        second = first;
        first = d;
      } else if (d > second && d < first) {
        second = d;
      }
    }
  }

  return second;
}

// === Test Cases ===
console.log(secondHighest('dfa12321afd'));   // 2
console.log(secondHighest('abc1111'));        // -1  (only digit is '1')
console.log(secondHighest('abc'));            // -1  (no digits)
console.log(secondHighest('0987654321'));     // 8
console.log(secondHighest('aa'));             // -1
console.log(secondHighest('9'));              // -1  (only one digit)
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Third Maximum Number](https://leetcode.com/problems/third-maximum-number) | Tracking Top-3 | Easy |
| [Largest Number](https://leetcode.com/problems/largest-number) | Greedy | Medium |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements) | Heap | Medium |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings) | Hash Map | Easy |
