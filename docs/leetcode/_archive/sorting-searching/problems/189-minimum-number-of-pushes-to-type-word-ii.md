---
layout: page
title: "Minimum Number of Pushes to Type Word II"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii"
---

# Minimum Number of Pushes to Type Word II / Số Lần Nhấn Tối Thiểu Để Gõ Từ II

🟡 Medium | 🏷️ Hash Table, String, Greedy, Sorting, Counting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bàn phím điện thoại có 8 phím (2-9). Mỗi phím có thể gán nhiều chữ cái. Chữ cái thứ nhất trên phím cần 1 lần nhấn, thứ hai cần 2 lần, v.v. Để tối thiểu tổng nhấn: sắp xếp tần số giảm dần, gán 8 chữ phổ biến nhất vào vị trí 1 (1 lần), 8 tiếp theo vào vị trí 2 (2 lần), ...

```
word = "xyzxyzxyzxyz"
freq: x=4, y=4, z=4
Sorted desc: [4,4,4]
Keys 2-9 = 8 keys:
  x → key2 pos1 → 4×1 = 4
  y → key3 pos1 → 4×1 = 4
  z → key4 pos1 → 4×1 = 4
Total = 12
```

## Problem Description

You have a phone keypad with keys **2–9** (8 keys). Reassign 26 letters to keys freely. Typing a letter costs `ceil` pushes equal to its **position** on the key (1st letter = 1 push, 2nd = 2 pushes, etc.). Given `word`, return the **minimum** total pushes needed.

**Example 1:** `word = "abcde"` → `5` (one letter per key, each 1 push)

**Example 2:** `word = "xyzxyzxyzxyz"` → `12`

## 📝 Interview Tips

- 🔑 **Greedy key / Tham lam:** Sort distinct letter frequencies descending; assign first 8 to cost×1, next 8 to cost×2, etc.
- 🔑 **Formula / Công thức:** For letter ranked `i` (0-indexed), cost multiplier = `floor(i / 8) + 1`
- 🔑 **Distinct letters / Chữ phân biệt:** Count distinct letters first; if ≤ 8 they all get multiplier 1
- ⚠️ **Word II vs I / Phân biệt:** Word I has distinct letters; Word II has repeated letters — count frequencies
- ⚠️ **Zero frequency / Tần số 0:** Skip letters with count=0 to avoid spurious assignments
- 🔗 **Pattern / Mẫu:** Frequency sort + greedy assignment is the "bucket assignment" template

## Solutions

### Solution 1: Greedy with Frequency Sort

```typescript
/**
 * Count character frequencies, sort descending, assign to 8 keys greedily.
 * Time: O(n + 26 log 26) = O(n)  Space: O(26)
 */
function minimumPushes(word: string): number {
  // Count frequencies
  const freq = new Array(26).fill(0);
  for (const ch of word) freq[ch.charCodeAt(0) - 97]++;

  // Sort descending (only non-zero)
  const sorted = freq.filter((f) => f > 0).sort((a, b) => b - a);

  let total = 0;
  for (let i = 0; i < sorted.length; i++) {
    const multiplier = Math.floor(i / 8) + 1; // keys 2-9 = 8 keys
    total += sorted[i] * multiplier;
  }

  return total;
}

console.log(minimumPushes("abcde")); // 5
console.log(minimumPushes("xyzxyzxyzxyz")); // 12
console.log(minimumPushes("aabbccddeeffgghhiiiiii")); // 24
console.log(minimumPushes("aaaaaaaaabbbbbbbbbccc")); // 3+3+3 * something
```

### Solution 2: Bucket Counting (No Sort Needed)

```typescript
/**
 * Since frequencies fit in known range, use bucket sort for O(n) total.
 * Time: O(n + maxFreq)  Space: O(26 + maxFreq)
 */
function minimumPushesLinear(word: string): number {
  const freq = new Array(26).fill(0);
  for (const ch of word) freq[ch.charCodeAt(0) - 97]++;

  // Bucket sort: index = frequency value
  const maxF = Math.max(...freq);
  const buckets = new Array(maxF + 1).fill(0);
  for (const f of freq) if (f > 0) buckets[f]++;

  let total = 0;
  let rank = 0; // how many letters assigned so far

  for (let f = maxF; f >= 1; f--) {
    for (let b = 0; b < buckets[f]; b++) {
      const multiplier = Math.floor(rank / 8) + 1;
      total += f * multiplier;
      rank++;
    }
  }

  return total;
}

console.log(minimumPushesLinear("abcde")); // 5
console.log(minimumPushesLinear("xyzxyzxyzxyz")); // 12
```

### Solution 3: One-liner style

```typescript
/**
 * Concise version combining count + sort + reduce.
 * Time: O(n)  Space: O(26)
 */
function minimumPushesCompact(word: string): number {
  const cnt = new Array(26).fill(0);
  for (const c of word) cnt[c.charCodeAt(0) - 97]++;
  return cnt
    .filter(Boolean)
    .sort((a, b) => b - a)
    .reduce((sum, f, i) => sum + f * (Math.floor(i / 8) + 1), 0);
}

console.log(minimumPushesCompact("abcde")); // 5
console.log(minimumPushesCompact("xyzxyzxyzxyz")); // 12
console.log(minimumPushesCompact("aaaa")); // 4
```

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Pattern                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------- |
| [Minimum Number of Pushes to Type Word I](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-i/) | Easy       | Same greedy, distinct only |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                   | Medium     | Frequency-based greedy     |
| [Reorganize String](https://leetcode.com/problems/reorganize-string/)                                             | Medium     | Greedy frequency placement |
| [Distribute Candies Among Children II](https://leetcode.com/problems/distribute-candies-among-children-ii/)       | Medium     | Counting + greedy          |
