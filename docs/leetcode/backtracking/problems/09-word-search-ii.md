---
layout: page
title: "Word Search II"
difficulty: Hard
category: Backtracking
tags: [Array, Trie, Backtracking, Matrix]
leetcode_url: "https://leetcode.com/problems/word-search-ii/"
---

# Word Search II / Tìm Từ Trên Bảng II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie + DFS Backtracking
> **Frequency**: 📘 Tier 2 — Tests ability to combine Trie with grid DFS; asked at Google, Meta
> **See also**: [Sudoku Solver](./08-sudoku-solver.md) | [Palindrome Partitioning](./10-palindrome-partitioning.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như tìm từ trong ô chữ báo với hàng nghìn từ cần tìm cùng lúc. Tìm từng từ riêng lẻ rất chậm. Thay vào đó, xây dựng "cây từ điển" (Trie) từ tất cả các từ — rồi duyệt bảng chỉ MỘT LẦN, tại mỗi bước kiểm tra nhánh Trie: nếu không có nhánh khớp thì dừng ngay, tiết kiệm vô số bước thừa.

- **Pattern Recognition:**
  - Signal: tìm nhiều từ trên grid → build Trie + single DFS pass
  - Brute O(W×M×N×4^L): search each word separately → TLE cho 30k words
  - Optimal: Trie giúp prune ngay khi prefix không khớp → O(M×N×4^L) total
  - Mark visited: tạm set `board[i][j]='#'`, restore sau khi backtrack

- **Visual — DFS từ ô (1,0) với Trie chứa "eat","oath":**

```
Board:         Trie (partial):
o a a n          root
e t a e           ├── e → a → t → [word:"eat"]
i h k r           └── o → a → t → h → [word:"oath"]
i f l v

DFS(1,0)='e': root has 'e'? Yes → enter node
  DFS(0,0)='o': node 'e' has 'o'? No → prune ✗
  DFS(2,0)='i': node 'e' has 'i'? No → prune ✗
  DFS(1,1)='t': node 'e' has 't'? No → prune ✗  (need 'a' next)
  Wait — from 'e' need 'a'; DFS goes to (1,1)='t' first... adjusting:

DFS from (1,0)='e' → node_e:
  explore (0,0)='o' — no 'o' child in node_e → skip
  explore (1,1)='t' — no 't' child → skip
  Trying all starts... (1,2)='a' is adj to (1,1)? No...

Key: DFS from every cell, prune via Trie at each step → "eat" and "oath" found
```

## Problem Description

Given a board of characters and a list of words, return all words found on the board. Each word must use adjacent (horizontal/vertical) cells, no cell reused per word.

```
board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]

board = [["a","b"],["c","d"]], words = ["abcb"]  → []
```

## 📝 Interview Tips

1. **Build Trie trước, sau đó DFS một lần duy nhất / Build Trie first, then single DFS pass over entire board**
2. **Mark cell đã thăm: `board[i][j]='#'`, restore sau backtrack / Visited marker: set '#', restore original char on backtrack**
3. **Set `node.word=null` sau khi tìm thấy để tránh duplicate / Set node.word=null after finding to avoid duplicate results**
4. **Pruning: khi node không còn children nào, xoá nhánh Trie đó / Prune: remove leaf nodes from Trie after finding a word**
5. **Brute force khi số từ nhỏ (≤100): search each word with LC #79 approach / For small word lists, brute Word Search I per word is acceptable**
6. **Lỗi phổ biến: quên restore board sau khi backtrack / Common bug: forgetting to restore board[i][j] after backtracking**

## Solutions

{% raw %}
class TrieNode {
children: Map<string, TrieNode> = new Map();
word: string | null = null;
}

/\*\*

- Solution 1 — Brute Force: Search Each Word Separately
- Run LC#79 Word Search for each word independently
- Time: O(W × M×N × 4^L) | Space: O(L) recursion
  \*/
  function findWordsBrute(board: string[][], words: string[]): string[] {
  const m = board.length, n = board[0].length;

function exists(word: string): boolean {
function dfs(i: number, j: number, k: number): boolean {
if (k === word.length) return true;
if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
const tmp = board[i][j]; board[i][j] = '#';
const found = dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);
board[i][j] = tmp;
return found;
}
for (let i = 0; i < m; i++)
for (let j = 0; j < n; j++)
if (exists && dfs(i, j, 0)) return true;
return false;
}

return words.filter(w => exists(w));
}

/\*\*

- Solution 2 — Trie + DFS Backtracking ✅ Recommended
- Build Trie once; single DFS pass finds all words simultaneously
- Time: O(M×N×4^L) where L=max word length | Space: O(W×L) for Trie
  \*/
  function findWords(board: string[][], words: string[]): string[] {
  const m = board.length, n = board[0].length;
  const result: string[] = [];

// Build Trie
const root = new TrieNode();
for (const word of words) {
let node = root;
for (const ch of word) {
if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
node = node.children.get(ch)!;
}
node.word = word;
}

function dfs(i: number, j: number, node: TrieNode): void {
if (i < 0 || i >= m || j < 0 || j >= n) return;
const ch = board[i][j];
if (ch === '#' || !node.children.has(ch)) return;

    node = node.children.get(ch)!;
    if (node.word) {
      result.push(node.word);
      node.word = null;                         // avoid duplicates
    }

    board[i][j] = '#';                          // mark visited
    dfs(i+1,j,node); dfs(i-1,j,node);
    dfs(i,j+1,node); dfs(i,j-1,node);
    board[i][j] = ch;                           // restore

}

for (let i = 0; i < m; i++)
for (let j = 0; j < n; j++)
dfs(i, j, root);

return result;
}

// ── inline tests ──
// findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
// ["oath","pea","eat","rain"]) → ["eat","oath"] (order may vary)
// findWords([["a","b"],["c","d"]], ["abcb"]) → []
// findWords([["a"]], ["a"]) → ["a"]
{% endraw %}

## 🔗 Related Problems

- [LC #79 Word Search](https://leetcode.com/problems/word-search/) — single word version (brute basis)
- [LC #208 Implement Trie](https://leetcode.com/problems/implement-trie-prefix-tree/) — Trie structure used here
- [LC #37 Sudoku Solver](./08-sudoku-solver.md) — constraint backtracking on 2D grid
- [LC #425 Word Squares](https://leetcode.com/problems/word-squares/) — Trie + backtracking for grid words
