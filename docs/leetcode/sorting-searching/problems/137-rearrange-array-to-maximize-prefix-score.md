---
layout: page
title: "Rearrange Array to Maximize Prefix Score"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/rearrange-array-to-maximize-prefix-score"
---

# Rearrange Array to Maximize Prefix Score / Sắp Xếp Mảng Để Tối Đa Điểm Tiền Tố

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sort

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Bạn muốn xây một chuỗi dài nhất sao cho tất cả các tổng tích lũy đều dương. Chiến lược tham lam: đặt số lớn nhất trước. Như xếp những người nặng nhất vào đầu đội, đảm bảo tổng trọng luôn dương càng lâu càng tốt.

```
nums = [-1, -3, -2, 4, 5, 6]
sorted desc: [6, 5, 4, -1, -2, -3]
prefix:      [6, 11, 15, 14, 12, 9]
all positive → score = 6 ✅

nums = [-1, -3, -2, 4, 5]
sorted desc: [5, 4, -1, -2, -3]
prefix:      [5, 9, 8, 6, 3]
all positive → score = 5 ✅

nums = [-3, -5]
sorted desc: [-3, -5]
prefix:      [-3, ...]  ← negative at index 0 → score = 0
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Greedy insight** / Sắp xếp giảm dần — lớn nhất trước để trì hoãn tổng âm lâu nhất
- 🔑 **Why descending?** / Nếu đặt số nhỏ trước, tổng sẽ âm sớm hơn — mọi hoán vị khác đều tệ hơn
- 🔑 **Count positives** / Đếm số vị trí có prefix sum > 0 — dừng ngay khi thấy ≤ 0
- 🔑 **Prefix sum** / Tích lũy tổng từ trái sang phải, kiểm tra dấu sau mỗi bước
- 🔑 **Edge case** / Mảng toàn số âm → score = 0 (không có prefix sum dương)
- 🔑 **Complexity** / O(n log n) sort + O(n) scan = O(n log n) total

## Solutions

```typescript
// ─── Solution 1: Brute Force — try all permutations (only for tiny input) ───
// Not practical — O(n!) — shown for conceptual clarity only
function maxScoreBrute(nums: number[]): number {
  // For demo: just sort descending (already optimal by greedy)
  const sorted = [...nums].sort((a, b) => b - a);
  let score = 0,
    prefix = 0;
  for (const x of sorted) {
    prefix += x;
    if (prefix > 0) score++;
    else break;
  }
  return score;
}

console.log(maxScoreBrute([-1, -3, -2, 4, 5, 6])); // 6
console.log(maxScoreBrute([2, -1, 0, 1, -3, 3, -3])); // 6

// ─── Solution 2: Greedy — Sort Descending + Prefix Scan — O(n log n) ───
function maxScore(nums: number[]): number {
  // Sort descending: greedily front-load the largest values
  nums.sort((a, b) => b - a);

  let score = 0;
  let prefix = 0;
  for (const x of nums) {
    prefix += x;
    if (prefix > 0) score++;
    else break; // Once prefix ≤ 0, no further arrangement can help
  }
  return score;
}

console.log(maxScore([-1, -3, -2, 4, 5, 6])); // 6
console.log(maxScore([2, -1, 0, 1, -3, 3, -3])); // 6
console.log(maxScore([-3, -5])); // 0
console.log(maxScore([1])); // 1

// ─── Solution 3: Without early break (handles all-positive case) ───
function maxScoreV2(nums: number[]): number {
  nums.sort((a, b) => b - a);
  let prefix = 0,
    count = 0;
  for (const x of nums) {
    prefix += x;
    if (prefix > 0) count++;
  }
  return count;
}

console.log(maxScoreV2([1, 2, 3, 4])); // 4 — all sums positive
console.log(maxScoreV2([-1, 1])); // 1
```

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                     | Pattern       |
| ---- | ------------------------------------------- | ------------- |
| 2587 | Rearrange Array to Maximize Prefix Score    | This problem  |
| 1403 | Minimum Subsequence in Non-Increasing Order | Greedy + Sort |
| 976  | Largest Perimeter Triangle                  | Greedy + Sort |
| 2405 | Optimal Partition of String                 | Greedy        |
