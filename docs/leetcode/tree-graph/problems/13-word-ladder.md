---
layout: page
title: "Word Ladder"
difficulty: Hard
category: Tree/Graph
tags: [Hash Table, String, BFS]
leetcode_url: "https://leetcode.com/problems/word-ladder/"
---

# Word Ladder / Bậc Thang Từ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS (Unweighted Shortest Path)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Serialize and Deserialize Binary Tree](./14-serialize-deserialize-binary-tree.md) | [Binary Tree Maximum Path Sum](./17-binary-tree-maximum-path-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như trò chơi biến đổi từ mà trẻ em hay chơi — từ "cat" muốn thành "dog", mỗi lần chỉ thay một chữ cái, và từ trung gian phải có trong từ điển. BFS đảm bảo tìm ra con đường ngắn nhất vì nó duyệt theo từng lớp — mỗi lớp tương ứng với đúng 1 bước biến đổi.

**Pattern Recognition:**

- Signal: "shortest transformation sequence", "differ by one letter" → **BFS (Unweighted Shortest Path)**
- Model as graph: words = nodes; edge between words differing by exactly 1 char
- BFS guarantees min steps because all edges have equal weight = 1

**Visual — BFS for "hit" → "cog":**

```
  Level 1: [hit]
  Level 2: [hot]           hit→hot (i→o)
  Level 3: [dot, lot]      hot→dot (h→d), hot→lot (h→l)
  Level 4: [dog, log]      dot→dog (t→g), lot→log (t→g)
  Level 5: [cog] ✅        dog→cog (d→c) → return 5

  wordSet = {hot,dot,dog,lot,log,cog}
  visited set prevents revisiting nodes
```

---

## Problem Description

Find the length of the shortest transformation sequence from `beginWord` to `endWord` where each step changes exactly one letter and every intermediate word must be in `wordList`. Return 0 if no valid sequence exists.

```
Example 1: beginWord="hit", endWord="cog"
           wordList=["hot","dot","dog","lot","log","cog"] → 5
           hit → hot → dot → dog → cog

Example 2: beginWord="hit", endWord="cog"
           wordList=["hot","dot","dog","lot","log"] → 0  (cog missing)

Example 3: beginWord="hot", endWord="dog"
           wordList=["hot","hog","dog"] → 3
```

Constraints:

- 1 ≤ beginWord.length ≤ 10, all words same length
- 1 ≤ wordList.length ≤ 5000

---

## 📝 Interview Tips

1. **Clarify**: Does beginWord need to be in wordList? (No) / beginWord có cần trong wordList không? (Không).
2. **Brute force**: DFS explores all paths → exponential, doesn't guarantee shortest / DFS không đảm bảo đường ngắn nhất.
3. **Optimize**: BFS level-by-level → Bidirectional BFS cuts search space in half / BFS hai chiều giảm search space đáng kể.
4. **Edge cases**: Check endWord in wordList immediately — return 0 if missing / Kiểm tra endWord trước để thoát sớm.
5. **Complexity**: O(M²×N) where M=word length, N=list size; each word tries M×26 variations / Mỗi từ thử M×26 biến thể.
6. **Follow-up**: Return the actual path? → Word Ladder II (BFS + backtrack, much harder) / Trả về chuỗi thực tế phức tạp hơn nhiều.

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Standard BFS (Shortest Path)
- Time: O(M²×N) — M=word length, N=wordList size; try 26 chars per position
- Space: O(M×N) — wordSet + visited set + queue
  \*/
  function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

const queue: [string, number][] = [[beginWord, 1]];
const visited = new Set<string>([beginWord]);

while (queue.length > 0) {
const [word, level] = queue.shift()!;
if (word === endWord) return level;

    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        if (wordSet.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([next, level + 1]);
        }
      }
    }

}
return 0;
}

/\*\*

- Solution 2: Bidirectional BFS (Optimal)
- Time: O(M²×N) — same worst case, but practical search space halved
- Space: O(M×N) — two frontier sets instead of one expanding queue
  \*/
  function ladderLengthBidir(beginWord: string, endWord: string, wordList: string[]): number {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

let front = new Set([beginWord]);
let back = new Set([endWord]);
const visited = new Set<string>();
let level = 1;

while (front.size > 0 && back.size > 0) {
// Always expand the smaller frontier for efficiency
if (front.size > back.size) [front, back] = [back, front];

    const next = new Set<string>();
    for (const word of front) {
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const neighbor = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (back.has(neighbor)) return level + 1; // frontiers met!
          if (wordSet.has(neighbor) && !visited.has(neighbor)) {
            visited.add(neighbor);
            next.add(neighbor);
          }
        }
      }
    }
    front = next;
    level++;

}
return 0;
}

// === Test Cases ===
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])); // 5
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"])); // 0
console.log(ladderLengthBidir("hot", "dog", ["hot","hog","dog"])); // 3
console.log(ladderLengthBidir("a", "c", ["a","b","c"])); // 2

{% endraw %}

---

## 🔗 Related Problems

- [Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) — harder: return all shortest paths (BFS + backtrack)
- [Minimum Genetic Mutation](https://leetcode.com/problems/minimum-genetic-mutation/) — same BFS pattern, alphabet restricted to 4 chars
- [Open the Lock](https://leetcode.com/problems/open-the-lock/) — same BFS pattern, 4-digit combination lock
- [Binary Tree Maximum Path Sum](./17-binary-tree-maximum-path-sum.md) — contrast: DFS for max sum in tree vs BFS for shortest path
