---
layout: page
title: "Increasing Decreasing String"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/increasing-decreasing-string"
---

# Increasing Decreasing String / Chuỗi tăng giảm xen kẽ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp hàng tại siêu thị: đầu tiên mời người thấp → cao (tăng dần), rồi mời từ cao → thấp (giảm dần), cứ thế lặp lại đến hết. Đếm số lần xuất hiện từng ký tự, rồi luân phiên "gắp" ký tự nhỏ nhất → lớn nhất → ...

```
s = "aaaabbbbcccc"
count: a=4, b=4, c=4

Round 1 up   (a→z): pick a,b,c  → "abc"   counts: a=3,b=3,c=3
Round 1 down (z→a): pick c,b,a  → "cba"   counts: a=2,b=2,c=2
Round 2 up           pick a,b,c  → "abc"   counts: a=1,b=1,c=1
Round 2 down         pick c,b,a  → "cba"   counts: a=0,b=0,c=0

Result: "abccbaabccba"
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Count first / Đếm trước**: Chỉ cần 26-phần-tử array, không dùng Map
- 🔑 **Alternate direction / Đổi chiều**: Một vòng a→z, vòng tiếp z→a, lặp lại
- 🔑 **Skip zero / Bỏ qua 0**: Ký tự có count=0 thì bỏ qua khi chọn
- 🔑 **Loop until output = input length / Lặp đến đủ độ dài**: Điều kiện dừng khi đủ n ký tự
- 🔑 **Total length preserved / Độ dài không đổi**: Kết quả luôn có đúng n ký tự
- 🔑 **26-char alphabet / Chữ cái thường**: Dùng `c.charCodeAt(0) - 97` để index

---

## Solutions

### Solution 1: Count + Alternate Sweep (Optimal)

```typescript
/**
 * Count character frequencies, then repeatedly sweep a→z then z→a,
 * picking chars with remaining count > 0.
 *
 * Time:  O(26 * n) = O(n) — each sweep is O(26), at most n/26 + 1 rounds
 * Space: O(1) extra (26-element count array, output is O(n))
 */
function sortString(s: string): string {
  const cnt = new Array<number>(26).fill(0);
  for (const c of s) cnt[c.charCodeAt(0) - 97]++;

  let result = "";
  while (result.length < s.length) {
    // Sweep a → z
    for (let i = 0; i < 26; i++) {
      if (cnt[i] > 0) {
        result += String.fromCharCode(97 + i);
        cnt[i]--;
      }
    }
    // Sweep z → a
    for (let i = 25; i >= 0; i--) {
      if (cnt[i] > 0) {
        result += String.fromCharCode(97 + i);
        cnt[i]--;
      }
    }
  }

  return result;
}

console.log(sortString("aaaabbbbcccc")); // "abccbaabccba"
console.log(sortString("rat")); // "art"
console.log(sortString("leetcode")); // "cdeeltoee" → one valid ordering
```

### Solution 2: Array Accumulation (Readable)

```typescript
/**
 * Collect picked chars into an array, join once at the end.
 * Time:  O(n)
 * Space: O(n) for result array
 */
function sortString2(s: string): string {
  const cnt = new Array<number>(26).fill(0);
  for (const c of s) cnt[c.charCodeAt(0) - 97]++;

  const out: string[] = [];

  while (out.length < s.length) {
    for (let i = 0; i < 26 && out.length < s.length; i++) {
      if (cnt[i]) {
        out.push(String.fromCharCode(97 + i));
        cnt[i]--;
      }
    }
    for (let i = 25; i >= 0 && out.length < s.length; i--) {
      if (cnt[i]) {
        out.push(String.fromCharCode(97 + i));
        cnt[i]--;
      }
    }
  }

  return out.join("");
}

console.log(sortString2("aaaabbbbcccc")); // "abccbaabccba"
console.log(sortString2("rat")); // "art"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                    | Difficulty | Pattern         |
| --- | ------------------------------------------------------------------------------------------ | ---------- | --------------- |
| 692 | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                 | 🟡 Medium  | Counting + Heap |
| 767 | [Reorganize String](https://leetcode.com/problems/reorganize-string)                       | 🟡 Medium  | Greedy + Heap   |
| 242 | [Valid Anagram](https://leetcode.com/problems/valid-anagram)                               | 🟢 Easy    | Counting        |
| 451 | [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | 🟡 Medium  | Bucket sort     |
