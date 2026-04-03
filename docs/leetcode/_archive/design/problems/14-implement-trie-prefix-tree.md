---
layout: page
title: "Implement Trie (Prefix Tree)"
difficulty: Medium
category: Design
tags: [Hash Table, String, Design, Trie]
leetcode_url: "https://leetcode.com/problems/implement-trie-prefix-tree"
---

# Implement Trie (Prefix Tree) / Triển Khai Cây Trie (Cây Tiền Tố)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies (Google, Facebook, Uber)
> **See also**: [Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure) | [Word Search II](https://leetcode.com/problems/word-search-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cây thư mục file system — mỗi ký tự là một cấp thư mục. Tìm prefix "app" chỉ cần đi theo nhánh a→p→p, không cần duyệt toàn bộ dictionary. Search O(L) với L là độ dài từ.

**Pattern Recognition:**

- Signal: "prefix search", "autocomplete", "dictionary of words" → **Trie**
- HashMap children: linh hoạt, tốt khi alphabet lớn
- Array[26] children: nhanh hơn constant time (array index vs hash lookup), tốn memory hơn

**Visual — insert "app", "apple", "ap"; search "apple"; startsWith "app":**

```
root
 └─ 'a'
     └─ 'p' (isEnd=true for "ap")
         └─ 'p' (isEnd=true for "app")
             └─ 'l'
                 └─ 'e' (isEnd=true for "apple")

search("apple")    → follow a→p→p→l→e, isEnd=true  → true ✅
search("app")      → follow a→p→p,     isEnd=true  → true ✅
startsWith("appl") → follow a→p→p→l,   node exists → true ✅
search("ap")       → follow a→p,        isEnd=true  → true ✅
search("appl")     → follow a→p→p→l,   isEnd=false → false ✅
```

---

## Problem Description

Implement a Trie with `insert(word)`, `search(word)`, and `startsWith(prefix)` methods. `search` returns true only if the exact word was inserted; `startsWith` returns true if any inserted word begins with the prefix.

```
Example:
  trie.insert("apple")
  trie.search("apple")   → true
  trie.search("app")     → false
  trie.startsWith("app") → true
  trie.insert("app")
  trie.search("app")     → true
```

Constraints: `1 <= word.length <= 2000`, lowercase English letters only, at most `3×10^4` calls total.

---

## 📝 Interview Tips

1. **Clarify**: "search vs startsWith khác nhau" / Confirm exact match (search) vs prefix (startsWith).
2. **Node design**: Mỗi TrieNode cần `children` + `isEnd` flag — vẽ structure trước khi code.
3. **HashMap vs Array**: Map linh hoạt hơn, Array[26] nhanh hơn; mention cả hai.
4. **Time**: Insert/Search/StartsWith đều O(L) với L là độ dài từ — hơn hẳn Set O(L) cho prefix.
5. **Space**: O(ALPHABET × L × N) worst case; trong thực tế ít hơn nhiều vì sharing prefix.
6. **Follow-up**: "Delete word? Count words with prefix? Wildcard search?" — đây là bonus points.

---

## Solutions

```typescript
/**
 * Solution 1: HashMap-based Trie
 * Time: O(L) per operation — L = word length
 * Space: O(N × L) — N words of avg length L; shared prefixes reduce this
 *
 * Uses Map<string, TrieNode> for children — works for any alphabet size
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return node.isEnd; // must be end-of-word node
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch)!;
    }
    return true; // any node at end of prefix is sufficient
  }
}

/**
 * Solution 2: Array-based Trie (26 children)
 * Time: O(L) per operation — same as HashMap but with O(1) array index lookup
 * Space: O(26 × N × L) worst — more memory but faster constant factor
 *
 * Uses fixed TrieNodeArr[26] for children — optimal for lowercase English only
 */
class TrieNodeArr {
  children: (TrieNodeArr | null)[] = new Array(26).fill(null);
  isEnd = false;
}

class TrieArray {
  private root = new TrieNodeArr();
  private idx(ch: string) {
    return ch.charCodeAt(0) - 97;
  } // 'a'=0

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      const i = this.idx(ch);
      if (!node.children[i]) node.children[i] = new TrieNodeArr();
      node = node.children[i]!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;
    for (const ch of word) {
      const i = this.idx(ch);
      if (!node.children[i]) return false;
      node = node.children[i]!;
    }
    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix) {
      const i = this.idx(ch);
      if (!node.children[i]) return false;
      node = node.children[i]!;
    }
    return true;
  }
}

// === Test Cases ===
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple")); // true
console.log(trie.search("app")); // false
console.log(trie.startsWith("app")); // true
trie.insert("app");
console.log(trie.search("app")); // true

const trie2 = new TrieArray();
trie2.insert("apple");
console.log(trie2.search("apple")); // true
console.log(trie2.startsWith("app")); // true
console.log(trie2.search("app")); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                       | Relationship                 |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)                | This problem                 |
| [211. Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure/) | Trie + wildcard '.' matching |
| [212. Word Search II](https://leetcode.com/problems/word-search-ii/)                                          | Trie + DFS on grid           |
| [677. Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/)                                            | Trie with summed values      |
| [648. Replace Words](https://leetcode.com/problems/replace-words/)                                            | Trie for prefix replacement  |
