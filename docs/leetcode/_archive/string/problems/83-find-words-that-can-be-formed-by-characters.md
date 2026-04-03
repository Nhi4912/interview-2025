---
layout: page
title: "Find Words That Can Be Formed by Characters"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/find-words-that-can-be-formed-by-characters"
---

# Find Words That Can Be Formed by Characters / Tìm Các Từ Có Thể Tạo Từ Ký Tự Cho Trước

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Frequency Count
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Ransom Note](https://leetcode.com/problems/ransom-note) | [Check if the Sentence is Pangram](https://leetcode.com/problems/check-if-the-sentence-is-pangram)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra xem trong hộp chữ cái có đủ để ghép thành từ không — đếm số lượng mỗi chữ cái trong hộp (chars), rồi với mỗi từ kiểm tra xem từ đó cần bao nhiêu chữ cái và hộp có đủ không.

**Pattern Recognition:**

- Signal: "can word be formed using available characters (each used once)" → **Frequency array comparison**
- Key insight: build frequency array for `chars`, then for each word compare frequencies

**Visual — Frequency comparison:**

```
chars = "atach"  → freq: {a:2, t:1, c:1, h:1}
words = ["cat", "bt", "hat", "tree"]

"cat": need c=1,a=1,t=1 → all ≤ freq → ✅ length 3
"bt":  need b=1 → b not in freq → ❌
"hat": need h=1,a=1,t=1 → all ≤ freq → ✅ length 3
"tree": need t=1,r=1 → r not in freq → ❌

total = 3 + 3 = 6
```

---

## Problem Description

Given an array of strings `words` and a string `chars`, return the **sum of lengths** of all words that can be formed using characters from `chars` (each character in `chars` can only be used once per word). ([LeetCode 1160](https://leetcode.com/problems/find-words-that-can-be-formed-by-characters))

**Example 1:** `words=["cat","bt","hat","tree"], chars="atach"` → `6` (cat + hat)
**Example 2:** `words=["hello","world","leetcode"], chars="welldonehoneyr"` → `10` (hello + world)

Constraints: All strings consist of lowercase English letters; `1 <= chars.length <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi ký tự trong chars chỉ dùng một lần cho mỗi từ, không phải cho tất cả từ" / chars reusable across words, not within one word
2. **Brute force**: "Sort cả hai rồi so sánh — cũng được vì constraints nhỏ" / Sorting works for small constraints
3. **Optimize**: "Precompute freq array của chars một lần; mỗi từ build freq rồi compare → O(n·L)" / Precompute once
4. **Edge cases**: "chars rỗng → không từ nào hợp lệ; từ rỗng → length 0 cộng vào kết quả" / Empty chars → 0
5. **Follow-up**: "Nếu chars thay đổi thường xuyên?" → không cần precompute, rebuild mỗi lần (small n)
6. **Complexity**: "O(n·L + |chars|) time, O(1) space — chỉ dùng array 26 phần tử" / O(n·L) with O(1) auxiliary space

---

## Solutions

```typescript
/**
 * Solution 1: Frequency array comparison
 * Time: O(|chars| + sum of word lengths) — build char freq once
 * Space: O(1) — fixed 26-length arrays
 */
function countCharacters(words: string[], chars: string): number {
  const charFreq = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of chars) charFreq[c.charCodeAt(0) - a]++;

  let total = 0;

  for (const word of words) {
    const wordFreq = new Array(26).fill(0);
    for (const c of word) wordFreq[c.charCodeAt(0) - a]++;

    let canForm = true;
    for (let i = 0; i < 26; i++) {
      if (wordFreq[i] > charFreq[i]) {
        canForm = false;
        break;
      }
    }

    if (canForm) total += word.length;
  }

  return total;
}

/**
 * Solution 2: Map-based (more readable)
 * Time: O(|chars| + sum of word lengths)
 * Space: O(26) ≈ O(1)
 */
function countCharactersMap(words: string[], chars: string): number {
  const buildFreq = (s: string): Map<string, number> => {
    const m = new Map<string, number>();
    for (const c of s) m.set(c, (m.get(c) ?? 0) + 1);
    return m;
  };

  const charFreq = buildFreq(chars);
  let total = 0;

  for (const word of words) {
    const wordFreq = buildFreq(word);
    const canForm = [...wordFreq.entries()].every(([c, cnt]) => (charFreq.get(c) ?? 0) >= cnt);
    if (canForm) total += word.length;
  }

  return total;
}

// === Test Cases ===
console.log(countCharacters(["cat", "bt", "hat", "tree"], "atach")); // → 6
console.log(countCharacters(["hello", "world", "leetcode"], "welldonehoneyr")); // → 10
console.log(countCharacters(["a"], "b")); // → 0
```
