---
layout: page
title: "Minimum Cost to Convert String II"
difficulty: Hard
category: Tree-Graph
tags: [Array, String, Dynamic Programming, Graph, Trie]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-convert-string-ii"
---

# Minimum Cost to Convert String II / Chi phí tối thiểu để chuyển đổi chuỗi II

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Thay vì biến đổi từng ký tự, bài này biến đổi các **chuỗi con**. Dùng Trie để nhanh chóng tìm tất cả các cặp `(original[i], changed[i])` bắt đầu tại mỗi vị trí. Gán ID cho từng chuỗi duy nhất, chạy Floyd-Warshall trên đồ thị chuỗi con. Sau đó DP: `dp[i]` = chi phí tối thiểu để biến đổi `source[0..i-1]` thành `target[0..i-1]`.

**English:** Transformations are now on **substrings**, not single chars. Build a Trie of all `original[i]` strings to efficiently find all matching transformations starting at each position. Run Floyd-Warshall on substring-node graph. Then DP: `dp[i]` = min cost to convert `source[0..i-1]`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Cost to Convert String II example:**

```
source="abcd", target="acbe"
original=["ab","bc"], changed=["bc","cb"], cost=[1,2]

Trie for source patterns; at pos 0, "ab" matches original[0]
DP:
  dp[0] = 0
  dp[2] = dp[0] + cost("ab"→"bc") = 1   (replaces s[0..1] with t[0..1])
  dp[4] = dp[2] + cost("cd"→"be") = ... (need path or -1)
```

---

---

## Problem Description

| #    | Problem                           | Difficulty | Pattern        |
| ---- | --------------------------------- | ---------- | -------------- |
| 2976 | Min Cost Convert String I         | Medium     | Floyd-Warshall |
| 2977 | Min Cost Convert String II (this) | Hard       | Trie + DP      |
| 139  | Word Break                        | Medium     | DP + Trie      |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Two Tries — one for `original[]` strings, one for `target[]` strings. Map each unique string to an integer ID.
- 📊 **Floyd-Warshall on IDs / Floyd trên ID:** Build cost matrix of size `(# unique strings)²`, run Floyd-Warshall to get min-cost transformations.
- ⚡ **DP transition / Chuyển trạng thái DP:** For each position `i`, walk both Tries simultaneously to find all `(originalId, targetId)` pairs matching `source[i..j]` and `target[i..j]`.
- 🎯 **Impossibility check / Kiểm tra bất khả thi:** If `dp[i] = Infinity` at any point and it's the last position used, return -1.
- 🧩 **Same char positions / Vị trí cùng ký tự:** If `source[i] == target[i]`, `dp[i+1] = min(dp[i+1], dp[i])`.
- 📏 **Complexity / Độ phức tạp:** O(K³ + n × L) where K = unique strings, L = max string length.

---

---

## Solutions

```typescript
/**
 * 1. Assign integer IDs to each unique original/changed string.
 * 2. Build min-cost graph; run Floyd-Warshall.
 * 3. DP over source/target positions, using Trie to find matching substrings.
 *
 * Time:  O(K^3 + n*L + E)  K=unique strings, L=max length, E=# rules
 * Space: O(K^2 + n + Trie_size)
 */
function minimumCostII(
  source: string,
  target: string,
  original: string[],
  changed: string[],
  cost: number[],
): number {
  const INF = 1e15;

  // Step 1: assign IDs to unique strings
  const strId = new Map<string, number>();
  const getId = (s: string): number => {
    if (!strId.has(s)) strId.set(s, strId.size);
    return strId.get(s)!;
  };
  for (let i = 0; i < original.length; i++) {
    getId(original[i]);
    getId(changed[i]);
  }
  const K = strId.size;

  // Step 2: build Floyd-Warshall dist matrix
  const dist: number[][] = Array.from({ length: K }, (_, i) =>
    Array.from({ length: K }, (__, j) => (i === j ? 0 : INF)),
  );
  for (let i = 0; i < original.length; i++) {
    const u = getId(original[i]);
    const v = getId(changed[i]);
    dist[u][v] = Math.min(dist[u][v], cost[i]);
  }
  for (let k = 0; k < K; k++)
    for (let i = 0; i < K; i++)
      for (let j = 0; j < K; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];

  // Step 3: precompute match costs at every position
  // matchCost[i][len] = cost to transform source[i..i+len-1] → target[i..i+len-1]
  const n = source.length;

  // Build a map: (srcSubstr, tgtSubstr) → min cost after Floyd-Warshall
  const pairCost = new Map<string, number>();
  for (const [srcStr, srcId] of strId) {
    for (const [tgtStr, tgtId] of strId) {
      if (dist[srcId][tgtId] < INF) {
        pairCost.set(`${srcStr}|${tgtStr}`, dist[srcId][tgtId]);
      }
    }
  }

  // Step 4: DP
  const dp = new Array<number>(n + 1).fill(INF);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    if (dp[i] === INF) continue;
    // Option 1: source[i] == target[i], advance by 1 for free
    if (source[i] === target[i]) {
      dp[i + 1] = Math.min(dp[i + 1], dp[i]);
    }
    // Option 2: find all matching substring pairs starting at i
    for (let len = 1; i + len <= n; len++) {
      const srcSub = source.substring(i, i + len);
      const tgtSub = target.substring(i, i + len);
      const key = `${srcSub}|${tgtSub}`;
      if (pairCost.has(key)) {
        dp[i + len] = Math.min(dp[i + len], dp[i] + pairCost.get(key)!);
      }
    }
  }

  return dp[n] >= INF ? -1 : dp[n];
}

console.log(
  minimumCostII(
    "abcd",
    "acbe",
    ["a", "b", "c", "c", "e", "d"],
    ["b", "c", "b", "e", "b", "e"],
    [2, 5, 5, 1, 2, 20],
  ),
); // 28
console.log(minimumCostII("aaaa", "bbbb", ["a", "c"], ["c", "b"], [1, 2])); // 12
console.log(
  minimumCostII("abcdefgh", "acdeeghh", ["bcd", "fgh", "thh"], ["cde", "thh", "ghh"], [1, 3, 5]),
); // 9
```

---

## 🔗 Related Problems

| #    | Problem                           | Difficulty | Pattern        |
| ---- | --------------------------------- | ---------- | -------------- |
| 2976 | Min Cost Convert String I         | Medium     | Floyd-Warshall |
| 2977 | Min Cost Convert String II (this) | Hard       | Trie + DP      |
| 139  | Word Break                        | Medium     | DP + Trie      |
