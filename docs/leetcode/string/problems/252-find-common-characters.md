---
layout: page
title: "Find Common Characters"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/find-common-characters"
---

# Find Common Characters / Tìm Ký Tự Chung Trong Tất Cả Từ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Tưởng tượng bạn cần tìm những đặc sản nào có mặt trong _tất cả_ các tỉnh thành. Mỗi tỉnh có danh sách đặc sản (với số lượng). Để một đặc sản "xuất hiện chung", số lượng tối thiểu phải lấy là min của tất cả tỉnh. Dùng bảng đếm (26 ô cho 26 chữ cái) và lấy min dần theo từng từ.

**Pattern Recognition:**

- Signal: "characters appearing in ALL strings" + "with multiplicity" → **Frequency Array + Min Intersection**
- Key insight: Duy trì mảng tần suất toàn cục = min(global[c], word[c]) cho mỗi từ. Cuối cùng chuyển mảng tần suất thành danh sách ký tự.

**Visual — words = ["bella","label","roller"]:**

```
"bella":  b=1 e=1 l=2 a=1
"label":  l=2 a=1 b=1 e=1
"roller": r=2 o=1 l=2 e=1

Global = min across all:
  b: min(1,1,0)=0  e: min(1,1,1)=1  l: min(2,2,2)=2
  a: min(1,1,0)=0  r: min(0,0,2)=0  o: min(0,0,1)=0

Result chars: e×1 + l×2 → ["e","l","l"]
```

---

## 📝 Problem Description

Given array of strings `words`, return all characters that appear in every string (including duplicates). You may return the answer in any order.

- **Example 1:** words=["bella","label","roller"] → `["e","l","l"]`
- **Example 2:** words=["cool","lock","cook"] → `["c","o"]`

Constraints: `1 ≤ words.length ≤ 100`, `1 ≤ words[i].length ≤ 100`, lowercase letters only.

---

## 🎯 Interview Tips

1. **Frequency array of size 26** / Mảng tần suất 26 ô: More efficient than Map for lowercase letters.
2. **Initialize with first word** / Khởi tạo từ từ đầu: Set global freq = first word's freq; then min-intersect remaining.
3. **Take min, not intersection** / Lấy min, không phải giao: If 'l' appears 3× in word1 and 2× in word2, output 2 'l's.
4. **Build result from global freq** / Tạo kết quả từ tần suất: Push char c exactly global[c] times.
5. **Edge: single word** / Một từ: Return all chars of that word (with counts).
6. **O(nm) total** / O(nm) tổng cộng: n words × m avg length — fully acceptable.

---

## 💡 Solutions

### Approach 1: Brute Force — Set Intersection Per Char

/\*_ @complexity Time: O(26 × n × m) | Space: O(26) _/

```typescript
function commonCharsBrute(words: string[]): string[] {
  const result: string[] = [];
  for (let c = 0; c < 26; c++) {
    const ch = String.fromCharCode(97 + c);
    // min count of ch across all words
    let minCount = Infinity;
    for (const w of words) {
      let cnt = 0;
      for (const letter of w) if (letter === ch) cnt++;
      minCount = Math.min(minCount, cnt);
    }
    for (let k = 0; k < minCount; k++) result.push(ch);
  }
  return result;
}
```

### Approach 2: Frequency Array Min-Intersection (Optimal)

/\*_ @complexity Time: O(n × m) | Space: O(26) _/

```typescript
function commonChars(words: string[]): string[] {
  const freq = (word: string): number[] => {
    const cnt = new Array(26).fill(0);
    for (const c of word) cnt[c.charCodeAt(0) - 97]++;
    return cnt;
  };

  // Start with frequency of first word
  const global = freq(words[0]);

  // Intersect with each subsequent word (take min)
  for (let i = 1; i < words.length; i++) {
    const wf = freq(words[i]);
    for (let j = 0; j < 26; j++) {
      global[j] = Math.min(global[j], wf[j]);
    }
  }

  // Build result: push char c exactly global[c] times
  const result: string[] = [];
  for (let j = 0; j < 26; j++) {
    for (let k = 0; k < global[j]; k++) {
      result.push(String.fromCharCode(97 + j));
    }
  }
  return result;
}
```

---

## 🧪 Test Cases

```typescript
console.log(commonChars(["bella", "label", "roller"])); // → ["e","l","l"]
console.log(commonChars(["cool", "lock", "cook"])); // → ["c","o"]
console.log(commonChars(["a", "a"])); // → ["a"]
console.log(commonChars(["abc", "def"])); // → []
console.log(commonChars(["aaa", "aa", "a"])); // → ["a"]
```

---

## 🔗 Related Problems

| Problem                                                                                              | Difficulty | Pattern  |
| ---------------------------------------------------------------------------------------------------- | ---------- | -------- |
| [Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii)         | Easy       | Hash Map |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                           | Medium     | Heap     |
| [Ransom Note](https://leetcode.com/problems/ransom-note)                                             | Easy       | Hash Map |
| [Uncommon Words from Two Sentences](https://leetcode.com/problems/uncommon-words-from-two-sentences) | Easy       | Hash Map |
