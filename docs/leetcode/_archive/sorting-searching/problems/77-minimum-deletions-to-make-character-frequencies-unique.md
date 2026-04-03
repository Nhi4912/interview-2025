---
layout: page
title: "Minimum Deletions to Make Character Frequencies Unique"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique"
---

# Minimum Deletions to Make Character Frequencies Unique / Số Lần Xóa Tối Thiểu Để Tần Số Ký Tự Unique

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Reorganize String](https://leetcode.com/problems/reorganize-string) | [Maximum Palindromes After Operations](https://leetcode.com/problems/maximum-palindromes-after-operations)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Hãy tưởng tượng bạn có nhiều chồng sách cao bằng nhau — mỗi chồng phải cao khác nhau. Với chồng trùng chiều cao, bạn lấy bớt sách (xóa ký tự) đến khi nó thấp hơn chồng bên cạnh. Chiến lược tham lam: sort giảm dần, xử lý từ cao nhất.

```
s = "aabbcc"  → freq: {a:2, b:2, c:2}
Sort desc: [2, 2, 2]

freq[0]=2 → OK (dùng 2)
freq[1]=2 → conflict → reduce to 1, deletions+=1
freq[2]=2 → conflict → reduce to 0, deletions+=2
Total deletions = 3
```

---

## Problem Description

Given a string `s`, return the minimum number of characters to delete so that no two different characters have the same frequency. Frequency is the number of times a character appears.

- **Example 1:** `s = "aab"` → `0` (a=2, b=1 — already unique)
- **Example 2:** `s = "aaabbbcc"` → `2` (delete 1 b and 1 c → a=3, b=2, c=1)

---

## 📝 Interview Tips

- 📊 **Count first:** `Map` or 26-length array để đếm tần số — O(n)
- 🔽 **Sort desc:** Xử lý từ tần số cao nhất → cho phép giảm xuống giá trị available nhỏ nhất
- 🎯 **Greedy key:** Khi gặp trùng, giảm xuống `prev - 1` (nếu > 0), không cần giảm về 0 ngay
- 🗂️ **Used set:** Dùng `Set` để track tần số đã dùng — tránh conflict O(1) per lookup
- ⚠️ **Edge:** Nếu freq giảm xuống 0, không thêm vào used set (0 không valid)
- 💡 **Follow-up:** "K-special string" là biến thể — min deletions sao cho max_freq - min_freq ≤ k

---

## Solutions

### Solution 1: Sort + greedy reduce

```typescript
/**
 * Sort frequencies descending, reduce conflicts greedily
 * Time: O(n + 26 log 26) = O(n)  Space: O(26) = O(1)
 */
function minDeletions(s: string): number {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  freq.sort((a, b) => b - a);
  let deletions = 0;

  for (let i = 1; i < 26; i++) {
    if (freq[i] >= freq[i - 1] && freq[i] > 0) {
      const newFreq = Math.max(0, freq[i - 1] - 1);
      deletions += freq[i] - newFreq;
      freq[i] = newFreq;
    }
  }
  return deletions;
}

console.log(minDeletions("aab")); // 0
console.log(minDeletions("aaabbbcc")); // 2
console.log(minDeletions("ceabaacb")); // 2
```

### Solution 2: Used-set approach (cleaner logic)

```typescript
/**
 * Track used frequencies in a Set, reduce until finding a free slot
 * Time: O(n + k²) worst case, O(n) average  Space: O(k)
 */
function minDeletionsSet(s: string): number {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  const freqs = [...freq.values()].sort((a, b) => b - a);
  const used = new Set<number>();
  let deletions = 0;

  for (let f of freqs) {
    while (f > 0 && used.has(f)) {
      f--;
      deletions++;
    }
    if (f > 0) used.add(f);
  }
  return deletions;
}

console.log(minDeletionsSet("aab")); // 0
console.log(minDeletionsSet("aaabbbcc")); // 2
console.log(minDeletionsSet("abcabc")); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                 | Difficulty | Connection                       |
| ----------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------- |
| [Reorganize String](https://leetcode.com/problems/reorganize-string/)                                                   | 🟡 Medium  | Frequency manipulation           |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                         | 🟡 Medium  | Greedy on frequencies            |
| [Minimum Number of Pushes to Type Word II](https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii/)     | 🟡 Medium  | Sort freq, greedy assign         |
| [Minimum Deletions to Make String K-Special](https://leetcode.com/problems/minimum-deletions-to-make-string-k-special/) | 🟡 Medium  | Same pattern, relaxed constraint |
| [Maximum Palindromes After Operations](https://leetcode.com/problems/maximum-palindromes-after-operations/)             | 🟡 Medium  | Frequency greedy sibling         |
