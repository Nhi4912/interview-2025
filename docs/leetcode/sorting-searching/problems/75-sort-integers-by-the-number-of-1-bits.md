---
layout: page
title: "Sort Integers by The Number of 1 Bits"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Bit Manipulation, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits"
---

# Sort Integers by The Number of 1 Bits / Sắp Xếp Số Nguyên Theo Số Bit 1

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting + Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Tưởng tượng bạn sắp xếp học sinh theo số huy chương đạt được — ai bằng nhau thì xếp theo mã số tăng dần. Đây chính là bài toán: đếm số bit `1` trong mỗi số (huy chương), rồi sort theo tiêu chí kép.

```
Input: [0, 1, 2, 3, 4, 5, 6, 7, 8]
Bits:  [0, 1, 1, 2, 1, 2, 2, 3, 1]

Group by bit count, then sort each group:
0 bits: [0]
1 bit:  [1, 2, 4, 8]
2 bits: [3, 5, 6]
3 bits: [7]
Result: [0, 1, 2, 4, 8, 3, 5, 6, 7]  ✅
```

---

## Problem Description

Given an integer array `arr`, sort it by the number of `1`s in the binary representation. If two numbers have the same count of `1`s, sort them in ascending order.

- **Example 1:** `arr = [0,1,2,3,4,5,6,7,8]` → `[0,1,2,4,8,3,5,6,7]`
- **Example 2:** `arr = [1024,512,256,128,64,32,16,8,4,2,1]` → `[1,2,4,8,16,32,64,128,256,512,1024]`

---

## 📝 Interview Tips

- 🔢 **Đếm bit 1 / Count bits:** `n.toString(2).split('1').length - 1` — cách nhanh trong JS
- 🔄 **Comparator kép / Dual comparator:** `(a,b) => popcount(a) - popcount(b) || a - b`
- ⚡ **Bitwise loop:** `while(n) { count += n & 1; n >>>= 1; }` — chuẩn với unsigned int 32
- 📊 **Độ phức tạp / Complexity:** O(n log n × log MAX) — log MAX ≈ 30 nên thực tế rất nhanh
- 🪣 **Counting sort:** Nhóm 0–32 buckets → O(n) nếu cần tối ưu hơn
- 💡 **Follow-up:** Nếu cần stable sort thì JS V8 đã stable từ Node 12 — không cần workaround

---

## Solutions

### Solution 1: Custom sort with popcount helper

```typescript
/**
 * Sort integers by their bit-1 count, ties broken by value
 * Time: O(n log n)  Space: O(1)
 */
function sortByBits(arr: number[]): number[] {
  const popcount = (n: number): number => {
    let count = 0;
    while (n > 0) {
      count += n & 1;
      n >>>= 1;
    }
    return count;
  };
  return arr.sort((a, b) => popcount(a) - popcount(b) || a - b);
}

console.log(sortByBits([0, 1, 2, 3, 4, 5, 6, 7, 8]));
// [0,1,2,4,8,3,5,6,7]
console.log(sortByBits([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]));
// [1,2,4,8,16,32,64,128,256,512,1024]
```

### Solution 2: Memoized popcount (faster for repeated values)

```typescript
/**
 * Pre-compute bit counts to avoid redundant work during sort
 * Time: O(n log n)  Space: O(n)
 */
function sortByBitsMemo(arr: number[]): number[] {
  const cache = new Map<number, number>();
  const popcount = (n: number): number => {
    if (cache.has(n)) return cache.get(n)!;
    let c = 0,
      x = n;
    while (x > 0) {
      c += x & 1;
      x >>>= 1;
    }
    cache.set(n, c);
    return c;
  };
  return [...arr].sort((a, b) => popcount(a) - popcount(b) || a - b);
}

console.log(sortByBitsMemo([3, 1, 2, 4, 8]));
// [1,2,4,8,3]  — 1,2,4,8 have 1 bit; 3 has 2 bits
```

### Solution 3: Bucket sort O(n)

```typescript
/**
 * Group into 33 buckets (0–32 bits), sort within buckets
 * Time: O(n)  Space: O(n)
 */
function sortByBitsLinear(arr: number[]): number[] {
  const buckets: number[][] = Array.from({ length: 33 }, () => []);
  for (const n of arr) {
    let bits = 0,
      x = n;
    while (x > 0) {
      bits += x & 1;
      x >>>= 1;
    }
    buckets[bits].push(n);
  }
  for (const b of buckets) b.sort((a, z) => a - z);
  return buckets.flat();
}

console.log(sortByBitsLinear([0, 1, 2, 3, 4, 5, 6, 7, 8]));
// [0,1,2,4,8,3,5,6,7]
```

---

## 🔗 Related Problems

| Problem                                                                           | Difficulty | Connection                |
| --------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)               | 🟢 Easy    | Core popcount helper      |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/)                       | 🟢 Easy    | Bit manipulation sibling  |
| [Relative Sort Array](https://leetcode.com/problems/relative-sort-array/)         | 🟢 Easy    | Custom comparator sort    |
| [Sort Colors](https://leetcode.com/problems/sort-colors/)                         | 🟡 Medium  | Non-standard sort key     |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | 🟡 Medium  | Sort by computed property |
