---
layout: page
title: "Check if One String Swap Can Make Strings Equal"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal"
---

# Check if One String Swap Can Make Strings Equal / Kiểm Tra Một Lần Hoán Đổi Làm Chuỗi Bằng Nhau

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm **đúng vị trí khác nhau** giữa hai chuỗi, sau đó kiểm tra swap có hợp lệ không.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Check if One String Swap Can Make Strings Equal example:**

```
s1 = "bank"  s2 = "kanb"

Compare char by char:
  i=0  b ≠ k  → diff[0] = (b, k)
  i=1  a = a
  i=2  n = n
  i=3  k ≠ b  → diff[1] = (k, b)

diff.length === 2  AND  diff[0] == reverse(diff[1])?
  diff[0] = ('b','k')  diff[1] = ('k','b')  → YES → return true

Cases:
  0 diffs → strings already equal → true (swap same pos with itself)
  1 diff  → impossible (swap creates 2 diffs at minimum)
  2 diffs → check cross-swap
  >2 diffs→ false
```

---

---

## Problem Description

| Problem                                                                                                               | Difficulty | Pattern           |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Buddy Strings](https://leetcode.com/problems/buddy-strings/)                                                         | 🟢 Easy    | Swap validation   |
| [Determine if Two Strings Are Close](https://leetcode.com/problems/determine-if-two-strings-are-close/)               | 🟡 Medium  | Frequency map     |
| [Check if Two String Arrays are Equivalent](https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/) | 🟢 Easy    | String comparison |

---

## 📝 Interview Tips

- 🇻🇳 **Chiều dài khác nhau**: trả về false ngay lập tức
- 🇺🇸 **Unequal lengths**: return false immediately
- 🇻🇳 **0 vị trí khác**: chuỗi đã bằng nhau → true (hoán đổi vị trí với chính nó)
- 🇺🇸 **0 diffs**: strings already equal → true (swap any char with itself)
- 🇻🇳 **Đúng 2 vị trí khác**: kiểm tra `s1[i]=s2[j]` và `s1[j]=s2[i]`
- 🇺🇸 **Exactly 2 diffs**: verify `s1[i]=s2[j]` and `s1[j]=s2[i]` for cross-match
- 🇻🇳 **1 hoặc >2 vị trí khác**: không thể dùng một lần swap → false
- 🇺🇸 **1 or >2 diffs**: a single swap can't fix 1 diff or 3+ diffs → false
- 🇻🇳 **Swap trên một chuỗi**: chỉ được swap trong s1 HOẶC s2, không phải cả hai
- 🇺🇸 **Swap on one string**: swap applies to one string only, not both
- 🇻🇳 **Phân biệt bài này với Buddy Strings**: bài 179 còn xét trường hợp s1=s2
- 🇺🇸 **vs Buddy Strings (#859)**: buddy strings also handles s==goal with duplicate char

---

---

## Solutions

```typescript
/**
 * Find all differing positions; valid iff 0 or exactly 2 with cross-match.
 * Time: O(n)  Space: O(1)
 */
function areAlmostEqual(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;

  const diffs: number[] = [];
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      diffs.push(i);
      if (diffs.length > 2) return false; // early exit
    }
  }

  if (diffs.length === 0) return true;
  if (diffs.length !== 2) return false;

  const [i, j] = diffs;
  return s1[i] === s2[j] && s1[j] === s2[i];
}

console.log(areAlmostEqual("bank", "kanb")); // true
console.log(areAlmostEqual("attack", "defend")); // false
console.log(areAlmostEqual("kelb", "kelb")); // true  (0 diffs)
console.log(areAlmostEqual("abcd", "dcba")); // false (4 diffs)
console.log(areAlmostEqual("aa", "ac")); // false (1 diff)

/**
 * Track first and second diff as tuples; validate at end.
 * Time: O(n)  Space: O(1)
 */
function areAlmostEqual2(s1: string, s2: string): boolean {
  if (s1 === s2) return true;

  let first = -1,
    second = -1;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      if (first === -1) first = i;
      else if (second === -1) second = i;
      else return false; // 3rd diff
    }
  }

  if (second === -1) return false; // exactly 1 diff
  return s1[first] === s2[second] && s1[second] === s2[first];
}

console.log(areAlmostEqual2("bank", "kanb")); // true
console.log(areAlmostEqual2("attack", "defend")); // false

/**
 * Multi-check: same frequency map AND at most 2 diffs.
 * Time: O(n)  Space: O(26)
 */
function areAlmostEqual3(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;

  let diffCount = 0;
  const freq = new Array(26).fill(0);

  for (let i = 0; i < s1.length; i++) {
    freq[s1.charCodeAt(i) - 97]++;
    freq[s2.charCodeAt(i) - 97]--;
    if (s1[i] !== s2[i]) diffCount++;
  }

  // Same chars overall AND exactly 0 or 2 positional diffs
  const sameFreq = freq.every((f) => f === 0);
  return sameFreq && (diffCount === 0 || diffCount === 2);
}

console.log(areAlmostEqual3("bank", "kanb")); // true
console.log(areAlmostEqual3("attack", "defend")); // false
console.log(areAlmostEqual3("aa", "ac")); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Pattern           |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Buddy Strings](https://leetcode.com/problems/buddy-strings/)                                                         | 🟢 Easy    | Swap validation   |
| [Determine if Two Strings Are Close](https://leetcode.com/problems/determine-if-two-strings-are-close/)               | 🟡 Medium  | Frequency map     |
| [Check if Two String Arrays are Equivalent](https://leetcode.com/problems/check-if-two-string-arrays-are-equivalent/) | 🟢 Easy    | String comparison |
