---
layout: page
title: "Check if the Sentence Is Pangram"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/check-if-the-sentence-is-pangram"
---

# Check if the Sentence Is Pangram / Kiểm Tra Câu Có Phải Pangram Không

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến bộ chữ cái trẻ em — 26 khối gỗ với 26 chữ từ A đến Z. Câu pangram là câu "bao gồm đủ cả hộp" — mỗi khối đều được dùng ít nhất một lần. Chỉ cần đánh dấu từng chữ cái đã xuất hiện, rồi kiểm tra xem cả 26 ô đều được đánh dấu chưa.

**Pattern Recognition:**

- Signal: "does sentence contain all 26 letters" → **Set / Bitmask**
- Key insight: Dùng Set để track các chữ cái đã thấy, hoặc bitmask 26-bit. Câu là pangram khi Set.size === 26.

**Visual — sentence="thequickbrownfoxjumpsoverthelazydog":**

```
Scan each character:
  t → seen={t}
  h → seen={t,h}
  e → seen={t,h,e}
  ...
  (after scanning full sentence)
  seen = {a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}

  seen.size = 26 → true ✓

Bitmask approach:
  mask starts at 0
  for each char c: mask |= (1 << (c - 'a'))
  pangram iff mask === (1 << 26) - 1 = 0x3FFFFFF
```

---

## 📝 Problem Description

A pangram is a sentence containing every letter of the alphabet at least once. Given a string `sentence` of lowercase letters, return `true` if it is a pangram, `false` otherwise.

- **Example 1:** sentence="thequickbrownfoxjumpsoverthelazydog" → `true`
- **Example 2:** sentence="leetcode" → `false`

Constraints: `1 ≤ n ≤ 1000`, lowercase English letters only.

---

## 🎯 Interview Tips

1. **26 letters target** / 26 chữ cái đích: Need exactly all 26 lowercase letters present.
2. **Set vs bitmask** / Set vs bitmask: Set is cleaner; bitmask is O(1) space and faster in practice.
3. **Early termination** / Dừng sớm: Once size reaches 26, can return immediately.
4. **No case sensitivity here** / Không phân biệt hoa/thường: Problem guarantees lowercase — no `.toLowerCase()` needed.
5. **One-liner possible** / Có thể viết một dòng: `new Set(sentence).size >= 26` (with only lowercase letters, size==26 means all present).
6. **Interviewer follow-up** / Follow-up phỏng vấn: What if string has uppercase? What about Unicode? Handle gracefully.

---

## 💡 Solutions

### Approach 1: Set — Track Seen Letters

/\*_ @complexity Time: O(n) | Space: O(26) = O(1) _/

```typescript
function checkIfPangramSet(sentence: string): boolean {
  const seen = new Set<string>();
  for (const c of sentence) {
    seen.add(c);
    if (seen.size === 26) return true; // early exit
  }
  return seen.size === 26;
}
```

### Approach 2: Bitmask — 26-Bit Integer (Optimal)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function checkIfPangram(sentence: string): boolean {
  let mask = 0;
  for (const c of sentence) {
    mask |= 1 << (c.charCodeAt(0) - 97);
  }
  // All 26 bits set = (1 << 26) - 1 = 67108863
  return mask === (1 << 26) - 1;
}
```

### Approach 3: One-Liner (Clean Code)

/\*_ @complexity Time: O(n) | Space: O(26) _/

```typescript
function checkIfPangramOneLiner(sentence: string): boolean {
  return new Set(sentence).size >= 26;
}
```

---

## 🧪 Test Cases

```typescript
console.log(checkIfPangram("thequickbrownfoxjumpsoverthelazydog")); // → true
console.log(checkIfPangram("leetcode")); // → false
console.log(checkIfPangram("abcdefghijklmnopqrstuvwxyz")); // → true
console.log(checkIfPangram("aabbcc")); // → false
console.log(checkIfPangramOneLiner("thequickbrownfoxjumpsoverthelazydog")); // → true
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Difficulty | Pattern  |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | -------- |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)                                                   | Easy       | Hash Map |
| [Valid Anagram](https://leetcode.com/problems/valid-anagram)                                                             | Easy       | Hash Map |
| [Count the Number of Consistent Strings](https://leetcode.com/problems/count-the-number-of-consistent-strings)           | Easy       | Bitmask  |
| [Find Words That Can Be Formed by Characters](https://leetcode.com/problems/find-words-that-can-be-formed-by-characters) | Easy       | Hash Map |
