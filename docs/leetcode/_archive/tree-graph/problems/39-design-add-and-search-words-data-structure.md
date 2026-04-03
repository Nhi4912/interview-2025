---
layout: page
title: "Design Add and Search Words Data Structure"
difficulty: Medium
category: Tree-Graph
tags: [String, Depth-First Search, Design, Trie]
leetcode_url: "https://leetcode.com/problems/design-add-and-search-words-data-structure"
---

# Design Add and Search Words Data Structure / Thiết Kế Cấu Trúc Dữ Liệu Thêm và Tìm Từ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Trie + DFS (Wildcard Matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như từ điển thư viện được sắp xếp theo cây thư mục — mỗi ký tự là một ngăn tủ. Khi tìm từ thông thường, bạn đi thẳng theo các ký tự. Khi gặp dấu `.` (ký tự đại diện), bạn phải **mở tất cả 26 ngăn** và kiểm tra từng nhánh — đây là DFS trên Trie. Wildcard biến bài toán từ O(L) đơn giản thành DFS có thể là O(26^L) trong worst case.

**Pattern Recognition:**

- Signal: "add words" + "search with wildcard `.`" → **Trie + DFS**
- Trie gives O(L) exact search; wildcard `.` requires branching at each Trie level
- Key insight: At each `.` character, recurse into ALL 26 children of current Trie node

**Visual — Trie structure with wildcard search:**

```
After addWord("bad"), addWord("dad"), addWord("mad"):

        root
       /|...\
      b  d    m
      |  |    |
      a  a    a
      |  |    |
      d* d*   d*   (* = isEnd)

search("pad") → root.p → null → false
search("bad") → root.b.a.d → isEnd=true → true
search(".ad") → root.(a|b|c|...|z).a.d
              → try root.b.a.d ✓ → true (short circuit)
search("b..") → root.b.(all children).(all children)
              → root.b.a.d → isEnd ✓ → true
```

---

## Problem Description

Design a data structure that supports:

- `addWord(word)`: Add a word to the data structure
- `search(word)`: Return `true` if any string in the structure matches `word`, where `.` matches any letter

**Example:**

```
addWord("bad"), addWord("dad"), addWord("mad")
search("pad") → false
search("bad") → true
search(".ad") → true
search("b..") → true
```

**Constraints:**

- `1 <= word.length <= 25`
- Words and patterns contain only lowercase letters and `.`
- At most `10^4` calls to `addWord` and `search`

---

## 📝 Interview Tips

1. **Clarify**: "Wildcard `.` chỉ match đúng 1 ký tự hay match 0-nhiều?" / Does `.` match exactly one char or zero-or-more? (exactly one, like regex `.`)
2. **Brute force**: "Lưu tất cả words trong Set, search dùng regex — O(N×L) per search" / Store in Set, use regex match — works but no structural benefits
3. **Trie advantage**: "Exact search O(L); wildcard buộc DFS nhưng Trie giới hạn branches tốt hơn" / Trie gives O(L) exact; DFS on Trie still pruned by structure
4. **DFS wildcard**: "Khi gặp `.`, loop qua tất cả 26 children; nếu bất kỳ nhánh nào return true thì done" / At `.`, try all 26 children; return true if any succeeds
5. **Edge cases**: "Search từ rỗng, `.` khi không có children, word dài hơn bất kỳ từ đã add" / Empty search, dot with no children, word longer than any added
6. **Complexity**: "addWord O(L); search exact O(L); search with dots O(26^D × L) where D=#dots" / Worst case with all dots: O(26^L)

---

## Solutions

```typescript
/**
 * Solution 1: Array-based storage with regex (brute force)
 * Time: addWord O(1); search O(N × L) where N = words stored
 * Space: O(N × L)
 */
class WordDictionaryBrute {
  private words: string[] = [];

  addWord(word: string): void {
    this.words.push(word);
  }

  search(word: string): boolean {
    // Escape dots for regex and check exact length match
    const pattern = new RegExp(
      "^" +
        word
          .split("")
          .map((c) => (c === "." ? "." : c))
          .join("") +
        "$",
    );
    return this.words.some((w) => pattern.test(w));
  }
}

/**
 * Solution 2: Trie with DFS for wildcard (optimal)
 * Time: addWord O(L); search O(L) exact, O(26^D × L) with D wildcards
 * Space: O(N × L × 26) for Trie nodes
 *
 * TrieNode: children[26] + isEnd flag
 * search: recursive DFS — at '.' try all children; at letter follow specific child
 */
class TrieNode {
  children: (TrieNode | null)[] = new Array(26).fill(null);
  isEnd = false;
}

class WordDictionary {
  private root: TrieNode = new TrieNode();

  addWord(word: string): void {
    let node = this.root;
    for (const ch of word) {
      const idx = ch.charCodeAt(0) - 97;
      if (!node.children[idx]) node.children[idx] = new TrieNode();
      node = node.children[idx]!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    return this.dfs(this.root, word, 0);
  }

  private dfs(node: TrieNode, word: string, i: number): boolean {
    if (i === word.length) return node.isEnd;

    const ch = word[i];
    if (ch === ".") {
      // Try all 26 children
      for (const child of node.children) {
        if (child && this.dfs(child, word, i + 1)) return true;
      }
      return false;
    } else {
      const idx = ch.charCodeAt(0) - 97;
      const child = node.children[idx];
      return child ? this.dfs(child, word, i + 1) : false;
    }
  }
}

// === Test Cases ===
const wd = new WordDictionary();
wd.addWord("bad");
wd.addWord("dad");
wd.addWord("mad");
console.log(wd.search("pad")); // false
console.log(wd.search("bad")); // true
console.log(wd.search(".ad")); // true
console.log(wd.search("b..")); // true
console.log(wd.search("b...")); // false (length mismatch)

const wd2 = new WordDictionary();
wd2.addWord("a");
wd2.addWord("a");
console.log(wd2.search(".")); // true
console.log(wd2.search("a")); // true

const brute = new WordDictionaryBrute();
brute.addWord("bad");
brute.addWord("dad");
console.log(brute.search(".ad")); // true
console.log(brute.search("pad")); // false
```

---

## 🔗 Related Problems

| Problem                                                                                              | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)             | Trie basics         | Medium     |
| [Word Search II](https://leetcode.com/problems/word-search-ii)                                       | Trie + DFS on grid  | Hard       |
| [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) | Trie + ranking      | Hard       |
| [Replace Words](https://leetcode.com/problems/replace-words)                                         | Trie prefix lookup  | Medium     |
| [Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system)           | Trie / HashMap tree | Hard       |
