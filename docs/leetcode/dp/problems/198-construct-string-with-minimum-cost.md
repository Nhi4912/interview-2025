---
layout: page
title: "Construct String with Minimum Cost"
difficulty: Hard
category: Dynamic Programming
tags: [Array, String, Dynamic Programming, Suffix Array]
leetcode_url: "https://leetcode.com/problems/construct-string-with-minimum-cost"
---

# construct string with minimum cost

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như ghép mảnh ghép hình — bạn muốn tạo ra chuỗi `target` bằng cách chọn các từ trong `words[]`, mỗi từ có chi phí riêng. Mỗi lần chọn một từ khớp với `target[i..i+len-1]` thì trả chi phí tương ứng. Tìm cách ghép rẻ nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
target = "abcdef", words = ["ab","bc","cd","bcd"], costs = [1,2,3,5]

dp[0]=0
  "ab"  matches target[0..1] → dp[2] = min(∞, 0+1) = 1
  "bc"  matches target[1..2] → dp[3] = min(∞, 0+2) = 2  (from dp[0])
dp[2]=1
  "cd"  matches target[2..3] → dp[4] = min(∞, 1+3) = 4
  "bcd" matches target[1..3] → dp[4] = min(4, 0+5) = 4
...
```

**Key insight:** `dp[i]` = min cost to construct `target[0..i-1]`. For each position, try matching each word. Use Aho-Corasick or simple string search for efficiency.

---

---

## Problem Description

Given string `target` and arrays `words`, `costs`. You can use each word unlimited times. Constructing `target[i..i+len-1]` using `words[j]` costs `costs[j]`. Find minimum total cost, or -1 if impossible.

- Example: `target="abcdef"`, `words=["abdef","abc","d","def","ef"]`, `costs=[100,1,1,10,5]` → **7**
- Example: `target="aaaa"`, `words=["z"]`, `costs=[1]` → **-1**

---

---

## 📝 Interview Tips

- 🎯 **DP state**: `dp[i]` = min cost to build `target[0..i-1]`; `dp[0] = 0`
- 🎯 **Transition**: `dp[i + len] = min(dp[i + len], dp[i] + cost[j])` if `words[j]` matches `target[i..]`
- 🎯 **Optimization**: group words by length then check match; or use suffix automaton / Aho-Corasick for O(n·L) total
- 🎯 **Multiple same-length words**: only keep minimum cost per word string
- 🎯 **Return**: if `dp[n] === Infinity`, return -1
- 🎯 **Complexity**: O(n × sum_of_word_lengths) naively; suffix-array approach is O(n·maxLen)

---

---

## Solutions

```typescript
function minimumCost(target: string, words: string[], costs: number[]): number {
  const n = target.length;
  const INF = Infinity;

  // Deduplicate: keep minimum cost per unique word
  const wordCost = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    const prev = wordCost.get(words[i]) ?? INF;
    wordCost.set(words[i], Math.min(prev, costs[i]));
  }

  // Group by length for faster iteration
  const byLen = new Map<number, [string, number][]>();
  for (const [w, c] of wordCost) {
    const arr = byLen.get(w.length) ?? [];
    arr.push([w, c]);
    byLen.set(w.length, arr);
  }

  const dp = new Array(n + 1).fill(INF);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    if (dp[i] === INF) continue;
    for (const [len, pairs] of byLen) {
      if (i + len > n) continue;
      const sub = target.slice(i, i + len);
      for (const [w, c] of pairs) {
        if (sub === w) {
          dp[i + len] = Math.min(dp[i + len], dp[i] + c);
        }
      }
    }
  }

  return dp[n] === INF ? -1 : dp[n];
}

function minimumCostTrie(target: string, words: string[], costs: number[]): number {
  const n = target.length;

  // Build trie; each node stores min cost if it's a word end
  interface TrieNode {
    children: Map<string, TrieNode>;
    minCost: number;
  }
  const root: TrieNode = { children: new Map(), minCost: Infinity };

  for (let idx = 0; idx < words.length; idx++) {
    let node = root;
    for (const ch of words[idx]) {
      if (!node.children.has(ch)) {
        node.children.set(ch, { children: new Map(), minCost: Infinity });
      }
      node = node.children.get(ch)!;
    }
    node.minCost = Math.min(node.minCost, costs[idx]);
  }

  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    if (dp[i] === Infinity) continue;
    let node = root;
    for (let j = i; j < n; j++) {
      const ch = target[j];
      if (!node.children.has(ch)) break;
      node = node.children.get(ch)!;
      if (node.minCost < Infinity) {
        dp[j + 1] = Math.min(dp[j + 1], dp[i] + node.minCost);
      }
    }
  }

  return dp[n] === Infinity ? -1 : dp[n];
}

function minimumCostSuffix(target: string, words: string[], costs: number[]): number {
  const n = target.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  // Precompute: for each end position e, what (word, cost) pairs end here?
  const endAt: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (let k = 0; k < words.length; k++) {
    const w = words[k];
    const len = w.length;
    // Find all occurrences of w in target
    let start = 0;
    while (start <= n - len) {
      const pos = target.indexOf(w, start);
      if (pos === -1) break;
      endAt[pos + len].push([pos, costs[k]]);
      start = pos + 1;
    }
  }

  for (let i = 1; i <= n; i++) {
    for (const [start, cost] of endAt[i]) {
      if (dp[start] < Infinity) {
        dp[i] = Math.min(dp[i], dp[start] + cost);
      }
    }
  }

  return dp[n] === Infinity ? -1 : dp[n];
}
```

---

## 🔗 Related Problems

| Problem                                                                                                       | Difficulty | Key Technique |
| ------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [139. Word Break](https://leetcode.com/problems/word-break/)                                                  | Medium     | DP + Trie     |
| [472. Concatenated Words](https://leetcode.com/problems/concatenated-words/)                                  | Hard       | DP + Trie     |
| [2977. Minimum Cost to Convert String I](https://leetcode.com/problems/minimum-cost-to-convert-string-i/)     | Medium     | Dijkstra      |
| [1977. Number of Ways to Separate Numbers](https://leetcode.com/problems/number-of-ways-to-separate-numbers/) | Hard       | DP            |
