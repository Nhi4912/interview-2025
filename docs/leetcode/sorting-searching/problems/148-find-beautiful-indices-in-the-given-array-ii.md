---
layout: page
title: "Find Beautiful Indices in the Given Array II"
difficulty: Hard
category: Sorting-Searching
tags: [Two Pointers, String, Binary Search, Rolling Hash, String Matching]
leetcode_url: "https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii"
---

# Find Beautiful Indices in the Given Array II / Tìm Chỉ Số Đẹp Trong Mảng II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: String Matching + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find Beautiful Indices I](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i) | [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn có hai danh sách địa điểm trên bản đồ (vị trí xuất hiện của a và b trong s). Chỉ số i "đẹp" khi trong bán kính k từ i tồn tại ít nhất một địa điểm b. Dùng KMP tìm tất cả vị trí, rồi binary search để kiểm tra nhanh.

```
s = "isawsmalIsawsmall", a = "saw", b = "small", k = 4
KMP finds a at: [1, 9]
KMP finds b at: [4, 12]

i=1 (a-match): need b in [1-4, 1+4]=[0,5] → b=4 ✓ beautiful
i=9 (a-match): need b in [5,13] → b=12 ✓ beautiful
Result: [1, 9]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **KMP là gì?** Knuth-Morris-Pratt — tìm chuỗi con trong O(n+m) nhờ bảng failure function tránh so sánh lại / KMP avoids redundant comparisons via failure table
- 🇻🇳 **Tại sao không dùng indexOf vòng lặp?** O(n\*m) quá chậm với chuỗi dài / naive search is O(n·m), KMP is O(n+m)
- 🇻🇳 **Binary search trên mảng đã sắp xếp** — vị trí KMP trả về đã theo thứ tự tăng dần / KMP match indices are already sorted, enabling binary search
- 🇻🇳 **Two-pointer thay binary search** — vì cả hai danh sách đều tăng dần, con trỏ j chỉ tiến, O(n) / two-pointer on sorted lists is O(n)
- 🇻🇳 **Failure function (π table)** — π[i] = độ dài prefix cũng là suffix của pattern[0..i] / π[i] = length of longest proper prefix-suffix
- 🇻🇳 **Edge case:** a hoặc b dài hơn s → kết quả rỗng / if |a| or |b| > |s|, return []

---

## Solutions

### Solution 1: KMP + Binary Search — O((n+|a|+|b|) log n)

```typescript
/**
 * KMP string matching + binary search for range queries
 * Time: O((n + |a| + |b|) log n)  Space: O(n + |a| + |b|)
 */
function beautifulIndices(s: string, a: string, b: string, k: number): number[] {
  function kmpSearch(text: string, pattern: string): number[] {
    const n = text.length,
      m = pattern.length;
    const matches: number[] = [];
    // Build failure function
    const pi = new Array(m).fill(0);
    let j = 0;
    for (let i = 1; i < m; i++) {
      while (j > 0 && pattern[i] !== pattern[j]) j = pi[j - 1];
      if (pattern[i] === pattern[j]) j++;
      pi[i] = j;
    }
    // Search
    j = 0;
    for (let i = 0; i < n; i++) {
      while (j > 0 && text[i] !== pattern[j]) j = pi[j - 1];
      if (text[i] === pattern[j]) j++;
      if (j === m) {
        matches.push(i - m + 1);
        j = pi[j - 1];
      }
    }
    return matches;
  }

  const aMatches = kmpSearch(s, a);
  const bMatches = kmpSearch(s, b);

  const result: number[] = [];
  for (const i of aMatches) {
    // Binary search: any bMatch in [i-k, i+k]?
    let lo = 0,
      hi = bMatches.length - 1,
      found = false;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const diff = bMatches[mid] - i;
      if (Math.abs(diff) <= k) {
        found = true;
        break;
      } else if (diff < 0) lo = mid + 1;
      else hi = mid - 1;
    }
    if (found) result.push(i);
  }
  return result;
}

console.log(beautifulIndices("isawsmalIsawsmall", "saw", "small", 4)); // [9]
console.log(beautifulIndices("abcd", "a", "a", 4)); // [0]
```

### Solution 2: KMP + Two Pointers — O(n + |a| + |b|)

```typescript
/**
 * Two-pointer on sorted match lists — optimal linear pass
 * Time: O(n + |a| + |b|)  Space: O(n)
 */
function beautifulIndicesTP(s: string, a: string, b: string, k: number): number[] {
  function kmpSearch(text: string, pattern: string): number[] {
    const m = pattern.length;
    const pi = new Array(m).fill(0);
    let j = 0;
    for (let i = 1; i < m; i++) {
      while (j > 0 && pattern[i] !== pattern[j]) j = pi[j - 1];
      if (pattern[i] === pattern[j]) j++;
      pi[i] = j;
    }
    const matches: number[] = [];
    j = 0;
    for (let i = 0; i < text.length; i++) {
      while (j > 0 && text[i] !== pattern[j]) j = pi[j - 1];
      if (text[i] === pattern[j]) j++;
      if (j === m) {
        matches.push(i - m + 1);
        j = pi[j - 1];
      }
    }
    return matches;
  }

  const aMatches = kmpSearch(s, a);
  const bMatches = kmpSearch(s, b);
  const result: number[] = [];
  let j = 0;

  for (const i of aMatches) {
    // Advance j until bMatches[j] >= i - k
    while (j < bMatches.length && bMatches[j] < i - k) j++;
    // Check if bMatches[j] <= i + k
    if (j < bMatches.length && bMatches[j] <= i + k) result.push(i);
  }
  return result;
}

console.log(beautifulIndicesTP("isawsmalIsawsmall", "saw", "small", 4)); // [9]
console.log(beautifulIndicesTP("abcd", "a", "a", 4)); // [0]
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Difficulty | Pattern             |
| -------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Find Beautiful Indices I](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-i)                      | 🟡 Medium  | KMP + Binary Search |
| [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome)                                                   | 🔴 Hard    | KMP                 |
| [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern)                                     | 🟢 Easy    | KMP                 |
| [Find the Index of the First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | 🟢 Easy    | String Matching     |
