---
layout: page
title: "Node With Highest Edge Score"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Graph]
leetcode_url: "https://leetcode.com/problems/node-with-highest-edge-score"
---

# Node With Highest Edge Score / Nút Có Điểm Cạnh Cao Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Graph / Array
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bầu cử — mỗi người bầu cho một người khác, nhưng phiếu bầu có "trọng số" là chỉ số của người bầu. Tính tổng trọng số phiếu bầu cho mỗi ứng cử viên, chọn người có tổng cao nhất.

**Visual — accumulate source indices into destination score:**

```
edges = [1, 0, 0, 0, 0, 7, 7, 5]
idx:      0  1  2  3  4  5  6  7

Node 0 receives edges from: idx 1,2,3,4 → score = 1+2+3+4 = 10
Node 1 receives edges from: idx 0       → score = 0
Node 5 receives edges from: idx 7       → score = 7  (wait, edges[5]=7, 5→7)
Node 7 receives edges from: idx 5,6     → score = 5+6 = 11

scores = [10, 0, 0, 0, 0, 0, 0, 11]
Max = 11 at node 7 → answer = 7

Note: use BigInt or careful comparison for large n (scores can reach n²/2)
```

---

## Problem Description

Given `edges` where `edges[i]` is the destination of a directed edge from node `i`. The **edge score** of node `x` = sum of all `i` where `edges[i] = x`. Return the node with the **highest edge score** (smallest index if tie). ([LeetCode 2374](https://leetcode.com/problems/node-with-highest-edge-score))

**Example 1:** edges=[1,0,0,0,0,7,7,5] → **7** (score=5+6=11)
**Example 2:** edges=[2,0,0,2] → **0** (score=1; node 2 score=0+3=3 → answer=2... wait: 0 gets edge from idx=1, score=1; 2 gets from idx=0,3, score=3) → **2**

**Constraints:** n ≤ 10⁵, 0 ≤ edges[i] < n, edges[i] ≠ i.

---

## 📝 Interview Tips

1. **Overflow risk**: n có thể lên đến 10⁵, score có thể ~n² ≈ 10¹⁰ → dùng BigInt hoặc number (JS safe up to 2⁵³).
2. **Single pass**: Chỉ cần duyệt một lần, cộng i vào score[edges[i]] / No graph traversal needed.
3. **Tie-breaking**: Duyệt từ 0 đến n-1, cập nhật chỉ khi score nghiêm ngặt lớn hơn / `>` not `>=`.
4. **Pattern**: Giống bài "find the town judge" nhưng với sum thay vì count / Same accumulation pattern.
5. **Edge case**: Nếu n=1, edges=[0] → không xảy ra (edges[i] ≠ i); tất cả edges về node 0 → score[0]=sum(1..n-1).
6. **Follow-up**: "Trả về top-k nodes?" / Sort score array → O(n log n); or partial sort O(n log k).

---

## Solutions

```typescript
/**
 * Solution 1: Hash Map accumulation
 * Time: O(n) — one pass to build scores, one pass to find max
 * Space: O(n) — map stores up to n entries
 */
function edgeScoreMap(edges: number[]): number {
  const score = new Map<number, number>();

  for (let i = 0; i < edges.length; i++) {
    const dest = edges[i];
    score.set(dest, (score.get(dest) ?? 0) + i);
  }

  let result = 0,
    maxScore = -1;
  for (let i = 0; i < edges.length; i++) {
    const s = score.get(i) ?? 0;
    if (s > maxScore) {
      maxScore = s;
      result = i;
    }
  }
  return result;
}

/**
 * Solution 2: Array accumulation (optimal — avoids map overhead)
 * Note: JavaScript numbers are 64-bit floats, safe up to 2^53 ≈ 9×10^15.
 * For n=10^5, max score ≈ n*(n-1)/2 ≈ 5×10^9, well within safe range.
 * Time: O(n) — two O(n) passes
 * Space: O(n) — score array of size n
 */
function edgeScore(edges: number[]): number {
  const n = edges.length;
  const score = new Array(n).fill(0);

  // Accumulate: each node i contributes its index to its destination's score
  for (let i = 0; i < n; i++) {
    score[edges[i]] += i;
  }

  // Find node with maximum score (smallest index on tie)
  let result = 0;
  for (let i = 1; i < n; i++) {
    if (score[i] > score[result]) result = i;
  }

  return result;
}

// === Test Cases ===
console.log(edgeScore([1, 0, 0, 0, 0, 7, 7, 5])); // 7 (score=5+6=11)
console.log(edgeScore([2, 0, 0, 2])); // 2 (score=0+3=3)
console.log(edgeScore([1, 2, 0])); // 0 (0←2, score=2; 1←0, score=0; 2←1, score=1)
console.log(edgeScore([0, 0, 0, 0])); // 0 (impossible: edges[i]≠i, but if it were: score=1+2+3=6)
// Verify with manual:
// edges=[1,0,0,0,0,7,7,5]: score[0]=1+2+3+4=10, score[5]=7, score[7]=5+6=11 → node 7 ✓
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern             | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge)                                                     | In/out degree count | Easy       |
| [Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue)                     | Array accumulation  | Hard       |
| [Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column)     | Union Find          | Medium     |
| [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) | Topological Sort    | Medium     |
| [Node With Highest Edge Score — LeetCode](https://leetcode.com/problems/node-with-highest-edge-score)                        | —                   | Medium     |
