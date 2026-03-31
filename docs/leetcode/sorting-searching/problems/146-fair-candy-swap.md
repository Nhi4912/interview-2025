---
layout: page
title: "Fair Candy Swap"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/fair-candy-swap"
---

# Fair Candy Swap / Đổi Kẹo Công Bằng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set / Math

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Alice và Bob mỗi người có một số hộp kẹo. Họ đổi đúng một hộp cho nhau để tổng kẹo bằng nhau. Với mỗi hộp `a` của Alice, hộp cần đổi từ Bob là `b = a - diff`, trong đó `diff = (sumA - sumB) / 2`.

```
A = [1, 1],  B = [2, 2]
sumA = 2, sumB = 4, diff = (2-4)/2 = -1
For a=1: b = 1 - (-1) = 2  → 2 ∈ setB? YES
Answer: [1, 2] ✅

After swap: Alice = {1,2}=3, Bob = {2,1}=3 ✓

A = [1, 2],  B = [2, 3]
sumA=3, sumB=5, diff=(3-5)/2=-1
a=1: b=1-(-1)=2 ∈ setB? YES → [1,2]
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Math insight** / Sau swap: `sumA - a + b = sumB - b + a` → `b = a - (sumA-sumB)/2`
- 🔑 **diff always integer** / `sumA - sumB` luôn chẵn vì tổng thay đổi cùng lượng
- 🔑 **HashSet for O(1) lookup** / Đưa B vào Set để kiểm tra `b ∈ B` nhanh
- 🔑 **Guaranteed solution** / Đề đảm bảo luôn có đáp án — không cần xử lý không tìm được
- 🔑 **No need to sort** / HashSet đủ — sort + binary search cũng được nhưng phức tạp hơn
- 🔑 **Complexity** / O(n + m) time, O(m) space cho setB

## Solutions

```typescript
// ─── Solution 1: Brute Force — O(n × m) ───
function fairCandySwapBrute(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((a, b) => a + b, 0);
  const sumB = bobSizes.reduce((a, b) => a + b, 0);
  const target = (sumA + sumB) / 2;

  for (const a of aliceSizes) {
    for (const b of bobSizes) {
      if (sumA - a + b === target) return [a, b];
    }
  }
  return [];
}

// ─── Solution 2: Hash Set — O(n + m) ───
function fairCandySwap(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((acc, x) => acc + x, 0);
  const sumB = bobSizes.reduce((acc, x) => acc + x, 0);
  // After swap: (sumA - a + b) = (sumB - b + a)
  // → 2b = 2a + sumB - sumA → b = a + (sumB - sumA) / 2
  const diff = (sumA - sumB) / 2; // Alice needs to give this much more than she receives

  const setB = new Set(bobSizes);
  for (const a of aliceSizes) {
    const b = a - diff; // the box Bob must give back
    if (setB.has(b)) return [a, b];
  }
  return []; // guaranteed to find by problem statement
}

console.log(fairCandySwap([1, 1], [2, 2])); // [1, 2]
console.log(fairCandySwap([1, 2], [2, 3])); // [1, 2]
console.log(fairCandySwap([2], [1, 3])); // [2, 3]
console.log(fairCandySwap([1, 2, 5], [2, 4])); // [5, 4]

// ─── Solution 3: Sort + Binary Search — O(n log n + m log m) ───
function fairCandySwapBS(aliceSizes: number[], bobSizes: number[]): number[] {
  const sumA = aliceSizes.reduce((a, b) => a + b, 0);
  const sumB = bobSizes.reduce((a, b) => a + b, 0);
  const diff = (sumA - sumB) / 2;

  const sortedB = [...bobSizes].sort((a, b) => a - b);

  const binarySearch = (target: number): boolean => {
    let lo = 0,
      hi = sortedB.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sortedB[mid] === target) return true;
      if (sortedB[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  };

  for (const a of aliceSizes) {
    const b = a - diff;
    if (Number.isInteger(b) && binarySearch(b)) return [a, b];
  }
  return [];
}

console.log(fairCandySwapBS([1, 1], [2, 2])); // [1, 2]
console.log(fairCandySwapBS([2], [1, 3])); // [2, 3]
```

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem         | Pattern      |
| --- | --------------- | ------------ |
| 888 | Fair Candy Swap | This problem |
| 1   | Two Sum         | Hash Map     |
| 268 | Missing Number  | Math         |
| 454 | 4Sum II         | Hash Map     |
