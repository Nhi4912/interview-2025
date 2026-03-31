---
layout: page
title: "Design Search Autocomplete System"
difficulty: Hard
category: Tree-Graph
tags: [String, Depth-First Search, Design, Trie, Sorting]
leetcode_url: "https://leetcode.com/problems/design-search-autocomplete-system"
---

# Design Search Autocomplete System / Thiết Kế Hệ Thống Gợi Ý Tìm Kiếm

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie + Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) | [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như thanh tìm kiếm Google — khi bạn gõ từng ký tự, hệ thống hiển thị 3 gợi ý phổ biến nhất bắt đầu bằng prefix đó. Dùng Trie để tra prefix nhanh, mỗi node lưu danh sách câu có prefix đó; khi nhấn `#` thì lưu câu vừa nhập vào Trie.

**Pattern Recognition:**

- Signal: "autocomplete" + "top-k by frequency" → **Trie + frequency map**
- Trie node lưu `children` map và `freqMap` (sentence → count)
- Khi input `#`: lưu câu hiện tại vào Trie; khi input char: tra prefix và trả top-3

**Visual:**

```
insert("i love you", 5), ("island", 3), ("iroman", 2)
Trie:
  i → {freq: {i love you:5, island:3, iroman:2}}
  i → l → {freq: {i love you:5}}
  i → s → {freq: {island:3}}

input("i") → top3: ["i love you","island","iroman"]
input(" ") → prefix="i " → top3: ["i love you"]
input("#") → save "i " → reset current input
```

---

## Problem Description

Design a search autocomplete system. Initialize with `sentences[]` and `times[]`. Method `input(c)`: if `c != '#'`, return top 3 hottest sentences (by frequency, then lexicographic) matching current prefix; if `c == '#'`, save current sentence and return `[]`.

**Example:** Init with `["i love you","island","iroman"]`, times `[5,3,2]`. Input `'i'` → `["i love you","island","iroman"]`. Input `' '` → `["i love you"]`. Input `'a'` → `[]`. Input `'#'` → save `"i a"`, return `[]`.

Constraints: `1 <= sentences.length <= 100`, sentence length ≤ 100, `1 <= times[i] <= 50`, all inputs are lowercase letters, spaces, or `#`.

---

## 📝 Interview Tips

1. **Trie vs HashMap**: "Trie cho prefix search; HashMap đơn giản hơn nếu không cần tối ưu space" / Trie optimal; simple HashMap works for interview
2. **Top-3 sort**: "Sắp xếp theo (-freq, lex order) để lấy top 3" / Sort by negative freq then lex for top-3
3. **State management**: "Lưu `currentInput` string để track prefix hiện tại" / Track current typed string across calls
4. **`#` handling**: "Khi gặp #: insert currentInput, reset state, return []" / Save and reset on `#`
5. **Trie node freqMap**: "Mỗi Trie node lưu Map<sentence, count> — update khi insert mới" / Each node caches all sentences in its subtree
6. **Follow-up**: "Top-k thay vì top-3? Realtime với millions of queries?" / Parameterize k; use distributed Trie for scale

---

## Solutions

```typescript
/**
 * Solution 1: HashMap-based (simpler, interview-friendly)
 * Time: input O(P·S·logS) where P=prefix length, S=matching sentences
 * Space: O(N·L) — N sentences, L avg length
 */
class AutocompleteSystem {
  private freq: Map<string, number> = new Map();
  private current = "";

  constructor(sentences: string[], times: number[]) {
    for (let i = 0; i < sentences.length; i++) {
      this.freq.set(sentences[i], (this.freq.get(sentences[i]) ?? 0) + times[i]);
    }
  }

  input(c: string): string[] {
    if (c === "#") {
      this.freq.set(this.current, (this.freq.get(this.current) ?? 0) + 1);
      this.current = "";
      return [];
    }
    this.current += c;
    const prefix = this.current;
    const matches: [string, number][] = [];
    for (const [sentence, count] of this.freq) {
      if (sentence.startsWith(prefix)) matches.push([sentence, count]);
    }
    matches.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return matches.slice(0, 3).map(([s]) => s);
  }
}

/**
 * Solution 2: Trie-based (optimal for large prefix trees)
 * Time: input O(L + S·logS) L=prefix length, S=sentences at node
 * Space: O(N·L) — Trie nodes
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  freq: Map<string, number> = new Map();
}

class AutocompleteSystemTrie {
  private root = new TrieNode();
  private current = "";
  private curNode: TrieNode | null = this.root;

  constructor(sentences: string[], times: number[]) {
    for (let i = 0; i < sentences.length; i++) this.insert(sentences[i], times[i]);
  }

  private insert(sentence: string, count: number): void {
    let node = this.root;
    for (const ch of sentence) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      node.freq.set(sentence, (node.freq.get(sentence) ?? 0) + count);
    }
  }

  input(c: string): string[] {
    if (c === "#") {
      this.insert(this.current, 1);
      this.current = "";
      this.curNode = this.root;
      return [];
    }
    this.current += c;
    if (this.curNode) this.curNode = this.curNode.children.get(c) ?? null;
    if (!this.curNode) return [];
    const entries = [...this.curNode.freq.entries()];
    entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return entries.slice(0, 3).map(([s]) => s);
  }
}

// === Test Cases ===
const ac = new AutocompleteSystem(["i love you", "island", "iroman"], [5, 3, 2]);
console.log(ac.input("i")); // ["i love you","island","iroman"]
console.log(ac.input(" ")); // ["i love you"]
console.log(ac.input("a")); // []
console.log(ac.input("#")); // []
console.log(ac.input("i")); // ["i love you","island","i a"] — "i a" now has freq 1
```

---

## 🔗 Related Problems

| Problem                                                                                    | Pattern           | Difficulty |
| ------------------------------------------------------------------------------------------ | ----------------- | ---------- |
| [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)       | Trie prefix       | 🟡 Medium  |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)   | Trie fundamentals | 🟡 Medium  |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                 | Heap + frequency  | 🟡 Medium  |
| [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system) | Trie tree design  | 🔴 Hard    |
| [Word Search II](https://leetcode.com/problems/word-search-ii)                             | Trie + DFS        | 🔴 Hard    |
