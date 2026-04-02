---
layout: page
title: "K-Similar Strings"
difficulty: Hard
category: Tree-Graph
tags: [String, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/k-similar-strings"
---

# k similar strings

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Như xáo bài — mỗi lần chỉ được đổi chỗ 2 lá bài. Hỏi tối thiểu cần bao nhiêu lần đổi để từ xếp này sang xếp kia? BFS tìm số bước tối thiểu, mỗi state là một hoán vị.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
s = "abcd"  → t = "badc"
Step 1: swap s[0] and s[1]: "bacd"
Step 2: swap s[2] and s[3]: "badc" ✓
k = 2
```

---

---

## Problem Description

Strings `s1` and `s2` are **k-similar** if we can swap characters in `s1` at most `k` times to equal `s2`. Given two anagrams `s1` and `s2`, return the minimum `k`.

**Example:**

- Input: `s1 = "abcd"`, `s2 = "badc"`
- Output: `2`

**Constraints:**

- `1 <= s1.length <= 20`
- `s1` and `s2` are anagrams of each other
- Characters in `s1` in set `{'a','b','c','d','e','f'}`

---

---

## 📝 Interview Tips

- 🔑 **BFS on permutation states** — each swap is one step, BFS finds minimum swaps
- 🔑 **Pruning:** only swap to fix mismatches; find first mismatch position, only swap with positions that match `s2[i]` there
- 🔑 Avoid revisiting states — use a `Set` of visited strings
- ⚠️ Brute-force all swaps is too slow — must prune to only productive swaps
- ⚠️ Key insight: always fix the **leftmost** mismatch to avoid redundant states
- 💡 At leftmost mismatch `i`, only swap with position `j > i` where `s[j] === s2[i]`

---

---

## Solutions

```typescript
function kSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 0;

  const visited = new Set<string>([s1]);
  let queue: string[] = [s1];
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const next: string[] = [];

    for (const cur of queue) {
      // Find leftmost mismatch
      let i = 0;
      while (i < cur.length && cur[i] === s2[i]) i++;

      // Try swapping cur[i] with cur[j] where cur[j] === s2[i]
      for (let j = i + 1; j < cur.length; j++) {
        if (cur[j] === s2[i]) {
          const arr = cur.split("");
          [arr[i], arr[j]] = [arr[j], arr[i]];
          const swapped = arr.join("");

          if (swapped === s2) return steps;
          if (!visited.has(swapped)) {
            visited.add(swapped);
            next.push(swapped);
          }
        }
      }
    }

    queue = next;
  }

  return steps;
}

function kSimilarityV2(s1: string, s2: string): number {
  if (s1 === s2) return 0;

  const visited = new Set<string>([s1]);
  let queue: string[] = [s1];
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const next: string[] = [];

    for (const cur of queue) {
      // Find leftmost mismatch
      let i = 0;
      while (cur[i] === s2[i]) i++;

      for (let j = i + 1; j < cur.length; j++) {
        // Only swap if cur[j] matches what we need at position i
        // AND skip if cur[j] is already correct at position j (no benefit)
        if (cur[j] === s2[i] && cur[j] !== s2[j]) {
          const arr = cur.split("");
          [arr[i], arr[j]] = [arr[j], arr[i]];
          const swapped = arr.join("");

          if (swapped === s2) return steps;
          if (!visited.has(swapped)) {
            visited.add(swapped);
            next.push(swapped);
          }
        }
      }

      // Also check the unoptimized case where cur[j] === s2[j] but might be needed
      for (let j = i + 1; j < cur.length; j++) {
        if (cur[j] === s2[i] && cur[j] === s2[j]) {
          const arr = cur.split("");
          [arr[i], arr[j]] = [arr[j], arr[i]];
          const swapped = arr.join("");
          if (swapped === s2) return steps;
          if (!visited.has(swapped)) {
            visited.add(swapped);
            next.push(swapped);
          }
          break; // Only need one such swap
        }
      }
    }

    queue = next;
  }

  return steps;
}
```

---

## 🔗 Related Problems

| #   | Problem               | Difficulty | Tags            |
| --- | --------------------- | ---------- | --------------- |
| 765 | Couples Holding Hands | 🔴 Hard    | BFS, Union Find |
| 839 | Similar String Groups | 🔴 Hard    | Union Find, BFS |
| 127 | Word Ladder           | 🔴 Hard    | BFS             |
| 815 | Bus Routes            | 🔴 Hard    | BFS             |
