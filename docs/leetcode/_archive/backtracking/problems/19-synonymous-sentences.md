---
layout: page
title: "Synonymous Sentences"
difficulty: Medium
category: Backtracking
tags: [Array, Hash Table, String, Backtracking, Union Find]
leetcode_url: "https://leetcode.com/problems/synonymous-sentences"
---

# Synonymous Sentences / Các Câu Đồng Nghĩa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find + Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn đồng nghĩa — "happy" và "joy" cùng nhóm, "joy" và "cheerful" cùng nhóm → cả ba cùng nhóm. **Union Find** gộp các từ đồng nghĩa. Rồi với mỗi từ trong câu, thay thế bằng **mọi từ trong nhóm** theo thứ tự từ điển.

**Pattern Recognition:**

- Gộp nhóm từ đồng nghĩa → **Union Find** (transitive synonyms)
- Sinh tất cả câu → **Backtracking** word by word

```
synonyms: [["happy","joy"],["sad","sorrow"],["joy","cheerful"]]
Groups: {happy,joy,cheerful} | {sad,sorrow}
text: "I am happy today but was sad yesterday"
  word "happy" → try: "cheerful","happy","joy" (sorted)
  word "sad"   → try: "sad","sorrow"
  → 3 × 2 = 6 output sentences
```

---

## Problem Description

Given a list of synonym pairs and a sentence, return all possible sentences by replacing any word with a synonym. Each synonym pair `[a,b]` is transitive. Return results in **lexicographic order**.

**Example:**

```
Input: synonyms=[["happy","joy"],["sad","sorrow"],["joy","cheerful"]]
       text="I am happy today but was sad yesterday"
Output: ["I am cheerful today but was sad yesterday",
         "I am cheerful today but was sorrow yesterday",
         "I am happy today but was sad yesterday",
         "I am happy today but was sorrow yesterday",
         "I am joy today but was sad yesterday",
         "I am joy today but was sorrow yesterday"]
```

**Constraints:** `0 ≤ synonyms.length ≤ 10`, `1 ≤ text.length ≤ 10000`

---

## 📝 Interview Tips

- 🇻🇳 **Hai bước tách biệt**: (1) Union Find gộp nhóm, (2) Backtracking sinh câu
- 🇬🇧 Two clear phases: (1) Union-Find groups, (2) word-by-word backtracking
- 🇻🇳 Sắp xếp mỗi nhóm từ theo **thứ tự từ điển** sau khi gộp để output đúng thứ tự
- 🇬🇧 Sort each synonym group alphabetically — backtracking then produces lex-ordered output
- 🇻🇳 Từ không có đồng nghĩa → chỉ có 1 lựa chọn, không backtrack
- 🇬🇧 Words with no synonyms → single choice, no branching needed

---

## Solutions

### Solution 1: Union Find + Backtracking

```typescript
/**
 * Generate all synonymous sentences in lexicographic order
 * @param {string[][]} synonyms - pairs of synonym words
 * @param {string} text - input sentence
 * @returns {string[]} all possible sentences sorted
 * Time: O(W * S * log S) W=words, S=synonym group size, output factor
 * Space: O(V) V = unique words in synonym pairs
 */
function generateSentences(synonyms: string[][], text: string): string[] {
  // --- Union Find ---
  const parent = new Map<string, string>();

  function find(x: string): string {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }

  function union(a: string, b: string): void {
    const ra = find(a),
      rb = find(b);
    if (ra !== rb) {
      // Smaller root (lex) becomes the new root for predictability
      if (ra < rb) parent.set(rb, ra);
      else parent.set(ra, rb);
    }
  }

  for (const [a, b] of synonyms) {
    union(a, b);
  }

  // Build group map: root → sorted list of synonyms
  const groups = new Map<string, string[]>();
  for (const key of parent.keys()) {
    const root = find(key);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(key);
  }
  for (const arr of groups.values()) arr.sort();

  // --- Backtracking over words ---
  const words = text.split(" ");
  const result: string[] = [];
  const path: string[] = [];

  function backtrack(i: number): void {
    if (i === words.length) {
      result.push(path.join(" "));
      return;
    }
    const word = words[i];
    const root = find(word);
    const choices = groups.get(root) ?? [word];
    for (const choice of choices) {
      path.push(choice);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

console.log(
  generateSentences(
    [
      ["happy", "joy"],
      ["sad", "sorrow"],
      ["joy", "cheerful"],
    ],
    "I am happy today but was sad yesterday",
  ),
);
// 6 sentences in lexicographic order

console.log(generateSentences([], "I am happy"));
// ["I am happy"] — no synonyms
```

---

## 🔗 Related Problems

- [1258. Synonymous Sentences](https://leetcode.com/problems/synonymous-sentences) ← this
- [721. Accounts Merge](https://leetcode.com/problems/accounts-merge) — Union Find grouping
- [737. Sentence Similarity II](https://leetcode.com/problems/sentence-similarity-ii) — transitive synonyms
- [839. Similar String Groups](https://leetcode.com/problems/similar-string-groups) — Union Find on strings
- [140. Word Break II](https://leetcode.com/problems/word-break-ii) — generate all sentence splits
