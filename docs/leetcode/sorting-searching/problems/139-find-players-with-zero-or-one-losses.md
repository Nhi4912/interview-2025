---
layout: page
title: "Find Players With Zero or One Losses"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/find-players-with-zero-or-one-losses"
---

# Find Players With Zero or One Losses / Tìm Người Chơi Với Không Hoặc Một Lần Thua

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + Sort

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Mỗi trận đấu có người thắng và người thua. Đếm số lần thua của từng người. Người chưa thua lần nào = 0 lần thua; người thua đúng một lần = 1 lần thua. Sau đó sắp xếp kết quả theo thứ tự tăng dần.

```
matches = [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]

lossCount: { 3:2, 6:2, 7:1, 5:1, 8:1, 9:2, 4:1 }
players who appeared: {1,2,3,4,5,6,7,8,9,10}

0 losses: {1,2,10}  → sorted: [1,2,10]
1 loss:   {4,5,7,8} → sorted: [4,5,7,8]
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Track all players** / Dùng Set hoặc Map để nhớ tất cả người chơi xuất hiện
- 🔑 **Count losses only** / Chỉ cần đếm số lần thua — người thắng không cần ghi nhận
- 🔑 **Zero loss** / Người có 0 lần thua: xuất hiện trong matches nhưng không có trong lossCount
- 🔑 **One loss** / Người có đúng 1 lần thua: `lossCount.get(p) === 1`
- 🔑 **Sort result** / Đề yêu cầu kết quả theo thứ tự tăng dần — sort cả hai mảng
- 🔑 **Complexity** / O(n log n) do sort — O(n) nếu không cần sort

## Solutions

```typescript
// ─── Solution 1: Brute Force with array scan — O(n²) ───
function findWinnersBrute(matches: number[][]): number[][] {
  const all = new Set<number>();
  const losses = new Map<number, number>();
  for (const [w, l] of matches) {
    all.add(w);
    all.add(l);
    losses.set(l, (losses.get(l) ?? 0) + 1);
  }
  const zero: number[] = [],
    one: number[] = [];
  for (const p of all) {
    const lc = losses.get(p) ?? 0;
    if (lc === 0) zero.push(p);
    else if (lc === 1) one.push(p);
  }
  return [zero.sort((a, b) => a - b), one.sort((a, b) => a - b)];
}

// ─── Solution 2: Hash Map — O(n log n) ───
function findWinners(matches: number[][]): number[][] {
  // lossCount: -1 means player seen only as winner (never lost)
  const lossCount = new Map<number, number>();

  for (const [winner, loser] of matches) {
    // Register winner if not seen — mark as 0 losses
    if (!lossCount.has(winner)) lossCount.set(winner, 0);
    // Increment loser's count
    lossCount.set(loser, (lossCount.get(loser) ?? 0) + 1);
  }

  const zeroLoss: number[] = [];
  const oneLoss: number[] = [];

  for (const [player, losses] of lossCount) {
    if (losses === 0) zeroLoss.push(player);
    else if (losses === 1) oneLoss.push(player);
  }

  zeroLoss.sort((a, b) => a - b);
  oneLoss.sort((a, b) => a - b);
  return [zeroLoss, oneLoss];
}

const m1 = [
  [1, 3],
  [2, 3],
  [3, 6],
  [5, 6],
  [5, 7],
  [4, 5],
  [4, 8],
  [4, 9],
  [10, 4],
  [10, 9],
];
console.log(JSON.stringify(findWinners(m1)));
// [[1,2,10],[4,5,7,8]]

const m2 = [
  [2, 3],
  [1, 3],
  [5, 4],
  [6, 4],
];
console.log(JSON.stringify(findWinners(m2)));
// [[1,2,5,6],[]]

// ─── Solution 3: Using separate winner/loser sets ───
function findWinnersV2(matches: number[][]): number[][] {
  const winners = new Set<number>();
  const lostOnce = new Set<number>();
  const lostMore = new Set<number>();

  for (const [w, l] of matches) {
    winners.add(w);
    if (lostMore.has(l)) {
      /* already > 1 */
    } else if (lostOnce.has(l)) {
      lostOnce.delete(l);
      lostMore.add(l);
    } else lostOnce.add(l);
  }

  const zeroLoss = [...winners].filter((p) => !lostOnce.has(p) && !lostMore.has(p));
  const oneLoss = [...lostOnce];
  return [zeroLoss.sort((a, b) => a - b), oneLoss.sort((a, b) => a - b)];
}

console.log(JSON.stringify(findWinnersV2(m1))); // [[1,2,10],[4,5,7,8]]
```

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                              | Pattern         |
| ---- | ------------------------------------ | --------------- |
| 2225 | Find Players With Zero or One Losses | This problem    |
| 169  | Majority Element                     | Counting        |
| 347  | Top K Frequent Elements              | Hash Map + Sort |
| 692  | Top K Frequent Words                 | Hash Map + Sort |
