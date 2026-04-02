---
layout: page
title: "Maximum Number of Vowels in a Substring of Given Length"
difficulty: Medium
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length"
---

# Maximum Number of Vowels in a Substring of Given Length / Số Nguyên Âm Tối Đa Trong Chuỗi Con Dài K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Cửa sổ trượt kích thước `k` qua chuỗi. Khi trượt sang phải một bước: cộng thêm 1 nếu ký tự mới là nguyên âm, trừ 1 nếu ký tự rời khỏi cửa sổ là nguyên âm.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Number of Vowels in a Substring of Given Length example:**

```
s = "abciiidef"  k = 3
         ↓ window [0..2]="abc" → vowels=1 (a)
         ↓ slide → [1..3]="bci" → vowels=0 (lost a, no new vowel)
         ↓ slide → [2..4]="cii" → vowels=2
         ↓ slide → [3..5]="iii" → vowels=3  ← max!
         ↓ slide → [4..6]="iid" → vowels=2
         ...
Answer = 3
```

**Key insight**: Maintain a running vowel count. Slide right: `+1` if `s[i]` is vowel, `-1` if `s[i-k]` is vowel. O(n) — no recount.

---

## Problem Description

| #    | Problem                                 | Difficulty | Pattern        |
| ---- | --------------------------------------- | ---------- | -------------- |
| 643  | Maximum Average Subarray I              | 🟢 Easy    | Sliding Window |
| 1004 | Max Consecutive Ones III                | 🟡 Medium  | Sliding Window |
| 567  | Permutation in String                   | 🟡 Medium  | Sliding Window |
| 1456 | Maximum Number of Vowels in a Substring | 🟡 Medium  | Sliding Window |

---

## 📝 Interview Tips

- 🔑 **EN**: Fixed-size window — expand to size k, then slide one step at a time
  **VI**: Cửa sổ cố định — mở rộng đến kích thước k, rồi trượt từng bước
- 🔑 **EN**: Use a Set `{a,e,i,o,u}` for O(1) vowel lookup
  **VI**: Dùng Set `{a,e,i,o,u}` để tra cứu nguyên âm O(1)
- 🔑 **EN**: On each slide: `count += isVowel(s[i]) - isVowel(s[i-k])`
  **VI**: Mỗi bước trượt: `count += isVowel(s[i]) - isVowel(s[i-k])`
- 🔑 **EN**: Early exit possible if `count === k` (all chars are vowels — can't do better)
  **VI**: Có thể thoát sớm nếu `count === k` (tất cả là nguyên âm — không thể tốt hơn)
- 🔑 **EN**: Brute O(n·k) vs Sliding Window O(n) — always prefer sliding window for fixed k
  **VI**: Brute O(n·k) vs Sliding Window O(n) — luôn dùng sliding window cho k cố định
- 🔑 **EN**: Track `maxVowels` at every slide step, not just after full traversal
  **VI**: Cập nhật `maxVowels` ở mỗi bước trượt, không chỉ sau khi duyệt xong

---

```typescript
// ─── Solution 1: Brute Force — O(n·k) time, O(1) space ──────────────────────
function maxVowelsBrute(s: string, k: number): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let max = 0;

  for (let i = 0; i <= s.length - k; i++) {
    let count = 0;
    for (let j = i; j < i + k; j++) {
      if (vowels.has(s[j])) count++;
    }
    max = Math.max(max, count);
    if (max === k) return k; // early exit
  }

  return max;
}

// Tests
console.log(maxVowelsBrute("abciiidef", 3)); // 3
console.log(maxVowelsBrute("aeiou", 2)); // 2
console.log(maxVowelsBrute("leetcode", 3)); // 2
```

```typescript
// ─── Solution 2: Sliding Window — O(n) time, O(1) space ──────────────────────
function maxVowels(s: string, k: number): number {
  const isVowel = (c: string): number => ("aeiou".includes(c) ? 1 : 0);

  // Seed the first window
  let count = 0;
  for (let i = 0; i < k; i++) count += isVowel(s[i]);

  let max = count;
  if (max === k) return k;

  // Slide
  for (let i = k; i < s.length; i++) {
    count += isVowel(s[i]) - isVowel(s[i - k]);
    if (count > max) {
      max = count;
      if (max === k) return k; // early exit
    }
  }

  return max;
}

// Tests
console.log(maxVowels("abciiidef", 3)); // 3
console.log(maxVowels("aeiou", 2)); // 2
console.log(maxVowels("leetcode", 3)); // 2
console.log(maxVowels("rhythms", 4)); // 0
```

```typescript
// ─── Solution 3: Bitmask Vowel Check (micro-optimization) ────────────────────
function maxVowels3(s: string, k: number): number {
  // Encode vowels as bitmask on charCode for O(1) check without Set/includes
  const VOWEL_MASK = 0b10000100000100010001; // a=1,e=5,i=9,o=15,u=21 bits
  const isV = (c: string) => (VOWEL_MASK >> (c.charCodeAt(0) - 97)) & 1;

  let count = 0;
  for (let i = 0; i < k; i++) count += isV(s[i]);
  let max = count;

  for (let i = k; i < s.length; i++) {
    count += isV(s[i]) - isV(s[i - k]);
    if (count > max) max = count;
  }

  return max;
}

// Tests
console.log(maxVowels3("abciiidef", 3)); // 3
console.log(maxVowels3("aeiou", 2)); // 2
```

---

---

## Solutions


---

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Pattern        |
| ---- | --------------------------------------- | ---------- | -------------- |
| 643  | Maximum Average Subarray I              | 🟢 Easy    | Sliding Window |
| 1004 | Max Consecutive Ones III                | 🟡 Medium  | Sliding Window |
| 567  | Permutation in String                   | 🟡 Medium  | Sliding Window |
| 1456 | Maximum Number of Vowels in a Substring | 🟡 Medium  | Sliding Window |
