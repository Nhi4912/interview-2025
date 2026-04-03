---
layout: page
title: "Minimum Number of Steps to Make Two Strings Anagram II"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram-ii"
---

# Minimum Steps to Make Two Strings Anagram II / Số Bước Tối Thiểu Để Hai Chuỗi Là Đồng Vị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Frequency Counting
> **Frequency**: 📘 Tier 2 — Gặp ở 4 companies
> **See also**: [Minimum Number of Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram) | [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai nhóm nhạc muốn hát cùng một bài: nhóm A có danh sách nốt nhạc, nhóm B có danh sách khác. Để hòa giọng, mỗi nhóm cần loại bỏ các nốt "dư thừa" không xuất hiện ở nhóm kia (hoặc xuất hiện ít hơn). Khác với bài toán "Version I" chỉ cho phép thêm vào một chuỗi, ở đây ta được **xóa từ cả hai** — linh hoạt hơn. Tổng số xóa tối thiểu bằng tổng giá trị tuyệt đối của hiệu tần số: `∑|freq_s[c] - freq_t[c]|` với mọi ký tự `c`. Mỗi đơn vị dư thừa ở bên nào thì phải xóa đúng bên đó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Steps to Make Two Strings Anagram II example:**

```
s = "leetcode",  t = "coats"

Frequency difference (freq_s - freq_t):
  'l': 1-0 =  +1  → delete 1 from s
  'e': 3-0 =  +3  → delete 3 from s
  't': 1-1 =   0  → balanced
  'c': 1-1 =   0  → balanced
  'o': 1-1 =   0  → balanced
  'd': 1-0 =  +1  → delete 1 from s
  'a': 0-1 =  -1  → delete 1 from t
  's': 0-1 =  -1  → delete 1 from t

Total = |+1|+|+3|+|0|+|0|+|0|+|+1|+|-1|+|-1| = 1+3+1+1+1 = 7
```

---

## Problem Description

Given strings `s` and `t`, return the minimum number of characters to delete (from either string) so the remaining parts are anagrams of each other.

**Example 1:** `s = "leetcode", t = "coats"` → `7`
**Example 2:** `s = "night", t = "thing"` → `0` (already anagrams)
**Example 3:** `s = "planet", t = "lane"` → `2` (delete 'p' and 't' from s)

**Constraints:** `1 ≤ s.length, t.length ≤ 2×10⁵`, `s`, `t` consist of lowercase English letters

---

## 📝 Interview Tips

- **Difference = total deletions** / Hiệu tần số = tổng xóa: `|freq_s - freq_t|` cho mỗi ký tự = số lần cần xóa ký tự đó từ chuỗi nhiều hơn
- **So sánh với Version I** / vs Version I (LC 1347): Version I chỉ cho append vào `t` → answer = sum of positive diffs; Version II cho xóa cả hai → answer = sum of |diffs|
- **26 chars only** / Chỉ 26 ký tự: Array kích thước 26 hiệu quả hơn Map, dùng `charCodeAt(0) - 97`
- **Không cần sắp xếp** / No sorting needed: Chỉ cần tần số, không cần thứ tự ký tự
- **Verify: sum(|diff|) vs sum(max-min)** / Hai cách tính: `sum|diff| = sum(max(freq_s,freq_t)) - sum(min(freq_s,freq_t))` — cùng kết quả
- **Edge: identical strings** / Chuỗi giống nhau: mọi hiệu = 0 → trả về 0

---

## Solutions

```typescript
/**
 * @complexity Time: O(m+n) | Space: O(26)
 * Count freq difference; sum absolute values
 */
function minStepsMap(s: string, t: string): number {
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);
  for (const c of t) freq.set(c, (freq.get(c) ?? 0) - 1);
  let steps = 0;
  for (const v of freq.values()) steps += Math.abs(v);
  return steps;
}

/**
 * @complexity Time: O(m+n) | Space: O(26)
 * Use fixed-size array for speed; one pass per string
 */
function minSteps(s: string, t: string): number {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;
  for (const c of t) freq[c.charCodeAt(0) - 97]--;
  return freq.reduce((sum, v) => sum + Math.abs(v), 0);
}

/**
 * @complexity Time: O(m+n) | Space: O(26)
 * Answer = (sum of max freqs) - (sum of min freqs)
 * = total chars to keep × 2 subtracted from total
 */
function minStepsMaxMin(s: string, t: string): number {
  const fs = new Array(26).fill(0);
  const ft = new Array(26).fill(0);
  for (const c of s) fs[c.charCodeAt(0) - 97]++;
  for (const c of t) ft[c.charCodeAt(0) - 97]++;
  let steps = 0;
  for (let i = 0; i < 26; i++) steps += Math.max(fs[i], ft[i]) - Math.min(fs[i], ft[i]);
  return steps;
}

// === Test Cases ===
console.log(minStepsMap("leetcode", "coats")); // → 7
console.log(minSteps("leetcode", "coats")); // → 7
console.log(minStepsMaxMin("night", "thing")); // → 0
console.log(minSteps("planet", "lane")); // → 2
console.log(minSteps("a", "b")); // → 2
console.log(minSteps("abc", "abc")); // → 0
```

---

## 🔗 Related Problems

| Problem                                           | Difficulty | Link                                                                                            |
| ------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| Min Steps to Make Two Strings Anagram (I)         | Medium     | [LC 1347](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram)    |
| Minimum Deletions to Make Char Frequencies Unique | Medium     | [LC 1647](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique) |
| Valid Anagram                                     | Easy       | [LC 242](https://leetcode.com/problems/valid-anagram)                                           |
