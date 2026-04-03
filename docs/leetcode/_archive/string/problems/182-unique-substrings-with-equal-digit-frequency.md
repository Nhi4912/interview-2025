---
layout: page
title: "Unique Substrings With Equal Digit Frequency"
difficulty: Medium
category: String
tags: [Hash Table, String, Rolling Hash, Counting, Hash Function]
leetcode_url: "https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency"
---

# Unique Substrings With Equal Digit Frequency / Xâu Con Duy Nhất Với Tần Số Chữ Số Bằng Nhau

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đếm **xâu con phân biệt** mà mọi chữ số xuất hiện cùng số lần.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Unique Substrings With Equal Digit Frequency example:**

```
s = "1212"

All substrings with equal-frequency digits:
  "1"    → {1:1}         equal ✓
  "2"    → {2:1}         equal ✓
  "12"   → {1:1, 2:1}   equal ✓
  "121"  → {1:2, 2:1}   NOT equal ✗
  "212"  → {2:2, 1:1}   NOT equal ✗
  "1212" → {1:2, 2:2}   equal ✓
  "2"    → duplicate, skip
  "21"   → {2:1,1:1}    equal, but "21" distinct from "12" ✓
  "212"  → duplicate, skip

Distinct qualifying: {"1","2","12","21","1212"} → count = 5

Equal-frequency check trick:
  maxFreq × nonZeroCount === substring length
  (only works when all present digits have same count)
```

---

---

## Problem Description

| Problem                                                                                                         | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Distinct Echo Substrings](https://leetcode.com/problems/distinct-echo-substrings/)                             | 🔴 Hard    | Rolling hash   |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) | 🟡 Medium  | Sliding window |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)                   | 🟡 Medium  | Freq map       |

---

## 📝 Interview Tips

- 🇻🇳 **`maxFreq × nonZeroCount === len`**: kiểm tra bằng nhau O(1) thay vì O(10)
- 🇺🇸 **`maxFreq × nonZeroCount === len`**: O(1) equality check instead of O(10) scan
- 🇻🇳 **Set<string> đảm bảo duy nhất**: dùng substring làm key tự nhiên
- 🇺🇸 **Set<string> for uniqueness**: substring as natural key — no hash collision
- 🇻🇳 **Rolling hash nếu n lớn**: giảm từ O(n³) → O(n²) bằng cách tránh `slice`
- 🇺🇸 **Rolling hash for large n**: reduces O(n³) → O(n²) by avoiding `slice` per step
- 🇻🇳 **freq array cập nhật dần**: tăng freq[d]++ khi mở rộng j, cập nhật maxFreq và nonZero
- 🇺🇸 **Incremental freq update**: increment freq[d], update maxFreq and nonZero count as j grows
- 🇻🇳 **n ≤ 1000**: O(n²) là đủ; cần chú ý string dedup cost
- 🇺🇸 **n ≤ 1000**: O(n²) is sufficient; be mindful of string dedup O(len) cost
- 🇻🇳 **Chữ số 0-9**: chỉ 10 giá trị có thể, freq array nhỏ
- 🇺🇸 **Digits 0-9 only**: only 10 possible values; tiny freq array

---

---

## Solutions

```typescript
/**
 * Incremental frequency tracking; deduplicate via Set of substrings.
 * Time: O(n² × avg_len) amortised  Space: O(n²)
 */
function equalDigitFrequency(s: string): number {
  const seen = new Set<string>();
  const n = s.length;

  for (let i = 0; i < n; i++) {
    const freq = new Array(10).fill(0);
    let maxFreq = 0;
    let nonZero = 0;

    for (let j = i; j < n; j++) {
      const d = s.charCodeAt(j) - 48;
      if (freq[d] === 0) nonZero++;
      freq[d]++;
      if (freq[d] > maxFreq) maxFreq = freq[d];

      // All non-zero digits have equal frequency iff maxFreq * nonZero === length
      if (maxFreq * nonZero === j - i + 1) {
        seen.add(s.slice(i, j + 1));
      }
    }
  }

  return seen.size;
}

console.log(equalDigitFrequency("1212")); // 5
console.log(equalDigitFrequency("12321")); // 9
console.log(equalDigitFrequency("0")); // 1

/**
 * Use polynomial rolling hash to avoid O(len) string slice per substring.
 * Time: O(n²)  Space: O(n²)
 * Note: double-hashing reduces collision probability.
 */
function equalDigitFrequency2(s: string): number {
  const n = s.length;
  const MOD1 = 1_000_000_007;
  const MOD2 = 998_244_353;
  const BASE1 = 31;
  const BASE2 = 37;

  const seen = new Set<string>(); // store "h1,h2" to reduce collisions

  for (let i = 0; i < n; i++) {
    const freq = new Array(10).fill(0);
    let maxFreq = 0;
    let nonZero = 0;
    let h1 = 0,
      h2 = 0;

    for (let j = i; j < n; j++) {
      const d = s.charCodeAt(j) - 48;
      if (freq[d] === 0) nonZero++;
      freq[d]++;
      if (freq[d] > maxFreq) maxFreq = freq[d];

      h1 = (h1 * BASE1 + d + 1) % MOD1;
      h2 = (h2 * BASE2 + d + 1) % MOD2;

      if (maxFreq * nonZero === j - i + 1) {
        seen.add(`${h1},${h2}`);
      }
    }
  }

  return seen.size;
}

console.log(equalDigitFrequency2("1212")); // 5
console.log(equalDigitFrequency2("12321")); // 9

/**
 * Explicit frequency check for interview clarity.
 * Time: O(n³)  Space: O(n²)
 */
function equalDigitFrequency3(s: string): number {
  const seen = new Set<string>();
  const n = s.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const sub = s.slice(i, j);
      const freq = new Array(10).fill(0);
      for (const c of sub) freq[+c]++;
      const counts = freq.filter((f) => f > 0);
      if (counts.every((c) => c === counts[0])) {
        seen.add(sub);
      }
    }
  }

  return seen.size;
}

console.log(equalDigitFrequency3("1212")); // 5
console.log(equalDigitFrequency3("0")); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Distinct Echo Substrings](https://leetcode.com/problems/distinct-echo-substrings/)                             | 🔴 Hard    | Rolling hash   |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) | 🟡 Medium  | Sliding window |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/)                   | 🟡 Medium  | Freq map       |
