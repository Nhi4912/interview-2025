---
layout: page
title: "Relative Ranks"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/relative-ranks"
---

# Relative Ranks / Xếp Hạng Tương Đối

🟢 Easy

## 🧠 Intuition

> **Hình ảnh:** Đây là bài toán **bảng xếp hạng thể thao** — sắp xếp theo điểm số giảm dần, top 3 nhận huy chương vàng/bạc/đồng, còn lại nhận số thứ hạng. Trick: giữ lại **vị trí ban đầu** trong khi sắp xếp.

```
score = [5, 4, 3, 2, 1]
         ↑  ↑  ↑  ↑  ↑
idx:     0  1  2  3  4

Sort by score desc → [(5,0), (4,1), (3,2), (2,3), (1,4)]

Assign:
  rank 1 → idx 0 → "Gold Medal"
  rank 2 → idx 1 → "Silver Medal"
  rank 3 → idx 2 → "Bronze Medal"
  rank 4 → idx 3 → "4"
  rank 5 → idx 4 → "5"

result[0]="Gold Medal", result[1]="Silver Medal", ...
```

**Chiến lược:** Pair each score with its original index, sort descending, then assign medals/ranks back by original index.

## 📋 Problem Description

Given integer array `score` of `n` athletes. Return `answer[i]` = athlete `i`'s rank. Top 3 get `"Gold Medal"`, `"Silver Medal"`, `"Bronze Medal"`; others get their rank number as string.

**Example 1:** `score=[5,4,3,2,1]` → `["Gold Medal","Silver Medal","Bronze Medal","4","5"]`
**Example 2:** `score=[10,3,8,9,4]` → `["Gold Medal","5","Bronze Medal","Silver Medal","4"]`

**Constraints:** `1 ≤ n ≤ 10^4`, `0 ≤ score[i] ≤ 10^6`, all scores distinct

## 📝 Interview Tips

- **Key trick:** Create `(score[i], i)` pairs before sorting to track original positions
- **Sort descending** by score; iterate to assign ranks by original index
- **Medals array:** `["Gold Medal", "Silver Medal", "Bronze Medal"]` — just index with rank-1
- **All scores distinct** (per constraints) — no tie-breaking needed
- **Alternative:** Use `Map<score, rank>` for O(1) lookup after sorting
- **Edge case:** n=1 → single athlete gets "Gold Medal"; n=2 → Gold + Silver

## 💡 Solutions

### Solution 1: Sort with Index — O(n log n)

```typescript
function findRelativeRanks(score: number[]): string[] {
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const n = score.length;
  const result = new Array<string>(n);

  // Pair each score with its original index, sort descending by score
  const sorted = score.map((s, i) => [s, i] as [number, number]);
  sorted.sort((a, b) => b[0] - a[0]);

  // Assign rank back to original position
  for (let rank = 0; rank < n; rank++) {
    const origIdx = sorted[rank][1];
    result[origIdx] = rank < 3 ? medals[rank] : String(rank + 1);
  }

  return result;
}
```

### Solution 2: Map-Based Lookup — O(n log n)

```typescript
function findRelativeRanksMap(score: number[]): string[] {
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];

  // Sort scores descending, build rank map
  const sorted = [...score].sort((a, b) => b - a);
  const rankMap = new Map<number, string>();
  sorted.forEach((s, rank) => {
    rankMap.set(s, rank < 3 ? medals[rank] : String(rank + 1));
  });

  return score.map((s) => rankMap.get(s)!);
}
```

### Solution 3: Heap-Based (Priority Queue) — O(n log n)

```typescript
function findRelativeRanksHeap(score: number[]): string[] {
  const medals = ["Gold Medal", "Silver Medal", "Bronze Medal"];
  const n = score.length;
  const result = new Array<string>(n);

  // Max-heap by score (simulate with sorted array for simplicity)
  // Use indices sorted by score descending
  const heap = [...Array(n).keys()].sort((a, b) => score[b] - score[a]);

  heap.forEach((origIdx, rank) => {
    result[origIdx] = rank < 3 ? medals[rank] : String(rank + 1);
  });

  return result;
}
```

## 🔗 Related Problems

| Problem                                                                                           | Similarity                    |
| ------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Finding rank / kth element    |
| [Rank Transform of an Array](https://leetcode.com/problems/rank-transform-of-an-array/)           | Assign rank by sorted order   |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)                 | Sort by frequency for ranking |
| [Assign Cookies](https://leetcode.com/problems/assign-cookies/)                                   | Greedy pairing after sort     |
