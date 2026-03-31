---
layout: page
title: "Word Ladder II"
difficulty: Hard
category: Tree-Graph
tags: [Hash Table, String, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/word-ladder-ii"
---

# Word Ladder II / Chuỗi Biến Đổi Từ II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Open the Lock](https://leetcode.com/problems/open-the-lock)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm tất cả tuyến đường ngắn nhất trên bản đồ — trước tiên BFS để biết khoảng cách tối thiểu, sau đó DFS/backtrack để liệt kê mọi con đường đi đúng khoảng cách đó.

**Pattern Recognition:**

- Signal: "find ALL shortest transformation sequences" → **BFS (distance map) + DFS (path reconstruction)**
- BFS builds `dist` map: word → min distance from `beginWord`
- DFS backtracks from `endWord` to `beginWord` following decreasing distances

**Visual — BFS distance + DFS reconstruction:**

```
beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]

BFS distance map:
  hit→0, hot→1, dot→2, lot→2, dog→3, log→3, cog→4

Adjacency (differ by 1 char):
  hit↔hot, hot↔dot, hot↔lot, dot↔dog, lot↔log, dog↔cog, log↔cog

DFS from "hit" following dist+1 neighbors:
  hit(0)→hot(1)→dot(2)→dog(3)→cog(4) ✓
  hit(0)→hot(1)→lot(2)→log(3)→cog(4) ✓
```

---

## Problem Description

Given `beginWord`, `endWord`, and a `wordList`, find all shortest transformation sequences from `beginWord` to `endWord` where each step changes exactly one letter and every intermediate word must be in `wordList`. Return all such sequences as arrays of words; return empty if no path exists.

- Example 1: `begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]` → `[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]`
- Example 2: `begin="hit", end="cog", list=["hot","dot","dog","lot","log"]` → `[]` (cog not in list)

Constraints: `1 <= wordList.length <= 500`, word length `1..5`, all lowercase.

---

## 📝 Interview Tips

1. **Clarify**: "endWord phải có trong wordList không? Có, theo LeetCode constraints" / endWord must be in wordList; if not, return []
2. **Two phases**: "Phase 1: BFS tính dist mọi word từ beginWord. Phase 2: DFS reconstruct paths theo dist tăng dần" / BFS for distances, DFS for all paths
3. **Adjacency**: "Thay từng ký tự a-z — O(26*L) per word. Tốt hơn duyệt wordList O(N*L)" / Generate neighbors by character substitution
4. **Pruning**: "Trong DFS chỉ đi tới neighbor có dist = dist[current]+1 → đảm bảo shortest" / Only follow edges that advance toward endWord
5. **Edge cases**: "beginWord = endWord → trả về [[beginWord]]. endWord không có → trả về []" / Handle when start equals end or target unreachable
6. **Follow-up**: "Word Ladder I (just count)? BFS chỉ cần đếm level, không cần DFS" / Part I is simpler BFS count only

---

## Solutions

```typescript
/**
 * Word Ladder II: BFS for distances + DFS for all shortest paths
 * Time: O(N * L * 26 + N * paths) — N words, L length, 26 chars
 * Space: O(N * L) — dist map + adjacency
 */
function findLadders(beginWord: string, endWord: string, wordList: string[]): string[][] {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return [];

  const L = beginWord.length;

  // Build adjacency: generate all 1-char-diff neighbors in wordSet
  function getNeighbors(word: string): string[] {
    const neighbors: string[] = [];
    const arr = word.split("");
    for (let i = 0; i < L; i++) {
      const orig = arr[i];
      for (let c = 97; c <= 122; c++) {
        arr[i] = String.fromCharCode(c);
        const next = arr.join("");
        if (next !== word && wordSet.has(next)) neighbors.push(next);
      }
      arr[i] = orig;
    }
    return neighbors;
  }

  // BFS: build distance map from beginWord
  const dist = new Map<string, number>([[beginWord, 0]]);
  let queue: string[] = [beginWord];

  while (queue.length > 0) {
    const next: string[] = [];
    for (const word of queue) {
      for (const neighbor of getNeighbors(word)) {
        if (!dist.has(neighbor)) {
          dist.set(neighbor, dist.get(word)! + 1);
          next.push(neighbor);
        }
      }
    }
    queue = next;
  }

  if (!dist.has(endWord)) return [];

  // DFS: reconstruct all shortest paths
  const results: string[][] = [];
  const path: string[] = [beginWord];

  function dfs(word: string): void {
    if (word === endWord) {
      results.push([...path]);
      return;
    }
    const d = dist.get(word)!;
    for (const neighbor of getNeighbors(word)) {
      if (dist.get(neighbor) === d + 1) {
        path.push(neighbor);
        dfs(neighbor);
        path.pop();
      }
    }
  }

  dfs(beginWord);
  return results;
}

// === Test Cases ===
console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));
// [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]

console.log(findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log"]));
// [] — cog not in wordList

console.log(findLadders("a", "c", ["a", "b", "c"]));
// [["a","c"]]

console.log(findLadders("hot", "dog", ["hot", "dog"]));
// [] — hot→dog requires 2 changes
```

---

## 🔗 Related Problems

- [Word Ladder](https://leetcode.com/problems/word-ladder) — Part I: just count shortest path length (BFS only)
- [Open the Lock](https://leetcode.com/problems/open-the-lock) — BFS on string state space with fixed transforms
- [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses) — BFS + backtracking for all shortest valid strings
- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — Union Find on connected string components
