---
layout: page
title: "Minimum Length of String After Operations"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-length-of-string-after-operations"
---

# Minimum Length of String After Operations / Độ Dài Nhỏ Nhất Sau Khi Thao Tác

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Phép so sánh:** Giống bộ bài — mỗi khi có đủ 3 lá cùng loại, bạn bỏ 2 lá (1 trái, 1 phải). Bạn cứ bỏ đến khi không còn bỏ được nữa. Kết quả chỉ phụ thuộc vào tần suất mỗi ký tự.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Length of String After Operations example:**

```
Operation: pick char s[i], if s[j]==s[i] (j<i) and s[k]==s[i] (k>i) → delete j and k
Effect: each time we have ≥3 of a char, we can remove 2 of them

freq=1 → remains 1
freq=2 → remains 2
freq=3 → remove 2 → remains 1
freq=4 → remove 2 → remains 2
freq=5 → remove 2 → remove 2 → remains 1
Pattern: odd freq → 1 left, even freq → 2 left
```

---

## Problem Description

Given string `s`, repeatedly pick index `i` where `s[j] == s[i]` for some `j < i` and `s[k] == s[i]` for some `k > i`, then delete `s[j]` and `s[k]`. Return the minimum length achievable.

**Example 1:** `"abaacbcbb"` → `5`

**Example 2:** `"aa"` → `2`

**Constraints:** `1 <= s.length <= 2*10^5`, s contains only lowercase letters

---

## 📝 Interview Tips

- **Key insight:** Operation reduces frequency of a char by 2 — repeat until freq < 3
- **Pattern:** If freq is odd → final count = 1; if freq is even → final count = 2
- **No simulation needed:** Just count frequencies, apply the formula character by character
- **Minimum freq left:** `freq % 2 === 0 ? 2 : 1` (since freq ≥ 1 always contributes ≥ 1)
- **Complexity:** O(n) time, O(1) space (26 letters)
- **Interview insight:** Nhận ra phép toán giảm 2 là chìa khóa — không cần mô phỏng từng bước

---

## Solutions

```typescript
function minimumLength(s: string): number {
  const freq = new Array(26).fill(0);
  for (const ch of s) {
    freq[ch.charCodeAt(0) - 97]++;
  }

  let result = 0;
  for (const f of freq) {
    if (f === 0) continue;
    // Reduce f by 2 until < 3
    result += f % 2 === 0 ? 2 : 1;
  }
  return result;
}

function minimumLength(s: string): number {
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  let total = 0;
  for (const [, count] of freq) {
    // Each character contributes 1 if odd frequency, 2 if even
    total += count % 2 === 1 ? 1 : 2;
  }
  return total;
}

function minimumLength(s: string): number {
  const freq = new Array(26).fill(0);
  for (const ch of s) freq[ch.charCodeAt(0) - 97]++;

  let len = s.length;
  for (let i = 0; i < 26; i++) {
    let f = freq[i];
    // Each removal reduces by 2; stop when f < 3
    while (f >= 3) {
      f -= 2;
      len -= 2;
    }
  }
  return len;
}
```

---

## 🔗 Related Problems

| #    | Problem                                                | Difficulty | Tags                 |
| ---- | ------------------------------------------------------ | ---------- | -------------------- |
| 383  | Ransom Note                                            | Easy       | Hash Table, Counting |
| 387  | First Unique Character                                 | Easy       | Hash Table, String   |
| 1647 | Minimum Deletions to Make Character Frequencies Unique | Medium     | Greedy               |
| 2870 | Minimum Number of Operations                           | Medium     | Hash Table           |
