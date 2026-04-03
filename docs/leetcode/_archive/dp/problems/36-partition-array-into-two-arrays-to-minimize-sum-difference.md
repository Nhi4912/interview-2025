---
layout: page
title: "Partition Array Into Two Arrays to Minimize Sum Difference"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Two Pointers, Binary Search, Dynamic Programming, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference"
---

# Partition Array Into Two Arrays to Minimize Sum Difference / Chia Mảng Thành Hai Phần Để Tối Thiểu Hiệu Tổng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Meet in the Middle
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum) | [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hai đội chia đồ chơi: bạn muốn chia đều nhất có thể. Nếu tổng là S, mục tiêu là tìm tập con có tổng gần S/2 nhất. Với n lớn, brute force 2ⁿ quá chậm — nhưng nếu chia đôi mảng và liệt kê tất cả tổng từng nửa, rồi dùng binary search để ghép đôi — đây là kỹ thuật "Meet in the Middle" nổi tiếng!

**Pattern Recognition:**

- Signal: "n ≤ 30" + "tìm subset tổng" → **Meet in the Middle (2^(n/2))**
- Brute force 2ⁿ bị TLE; DP bitmask cũng quá chậm cho n=30
- Key insight: chia 2n phần tử thành 2 nửa n phần tử. Mỗi nửa có 2ⁿ subsets. Với mỗi subset k phần tử từ nửa trái, cần (n-k) phần tử từ nửa phải → binary search

**Visual — nums=[3,9,7,3], n=2:**

```
Left half: [3,9]    Right half: [7,3]
totalSum = 22, target = 11

Left subsets by size:
  size 0: {0}
  size 1: {3, 9}
  size 2: {12}

Right subsets by size:
  size 0: {0}
  size 1: {7, 3} → sorted: [3, 7]
  size 2: {10}

For each left subset of size k, find right subset of size (n-k=2-k):
  k=0: leftSum=0, need rightSize=2: rs=[10] → total=10, diff=|22-20|=2
  k=1: leftSum=3, need rightSize=1: rs=[3,7]
        binary search for target=11-3=8 → closest is 7 → total=10 → diff=2
        leftSum=9: target=11-9=2 → closest is 3 → total=12 → diff=2
  k=2: leftSum=12, need rightSize=0: rs=[0] → total=12 → diff=2

Answer = 2 ✅
```

---

## Problem Description

Given an array `nums` of `2n` integers, partition it into two arrays of length `n` each to **minimize the absolute difference** of their sums. Return the minimum difference.

**Example 1:**

```
Input:  nums=[3,9,7,3]
Output: 2
Explanation: [3,7] sum=10, [9,3] sum=12, diff=2.
```

**Example 2:**

```
Input:  nums=[-36,36]
Output: 72
Explanation: [-36] and [36], diff=72.
```

**Constraints:** `1 ≤ n ≤ 15`, `nums.length == 2n`, `-10⁷ ≤ nums[i] ≤ 10⁷`

---

## 📝 Interview Tips

1. **Clarify**: "Mảng có 2n phần tử, chia thành 2 mảng mỗi cái đúng n phần tử — không phải chia tùy ý" / Exactly n elements each, not arbitrary split
2. **Why not DP**: "n ≤ 15 → 2n=30 → DP(subset) = 2³⁰ ≈ 10⁹ TLE; Meet-in-Middle = 2¹⁵ ≈ 32K OK" / n=15 → use MITM not subset DP
3. **MITM steps**: "1. Enumerate 2ⁿ sums for each half. 2. Group by subset size. 3. Binary search to pair" / Enumerate → group by size → binary search
4. **Why group by size**: "Mỗi nửa phải có đúng n/2 phần tử từ mỗi half → size k từ trái + size (n-k) từ phải = n tổng" / Left k + right (n-k) = n total elements
5. **Binary search target**: "Muốn lSum + rSum ≈ totalSum/2 → tìm rSum ≈ totalSum/2 - lSum" / Search for complement to minimize |total - 2\*(lSum+rSum)|
6. **Follow-up**: "Nếu không cần chia đều (k từ trái bất kỳ)?" / If split ratio is unconstrained → simpler subset sum DP

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — enumerate all 2^(2n) partitions
 * Time: O(2^(2n)) — works only for n ≤ 10
 * Space: O(2^(2n))
 */
function minimumDifferenceBrute(nums: number[]): number {
  const n = nums.length / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  let minDiff = Infinity;
  // Try all subsets of size n from nums
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    if (popcount(mask) !== n) continue;
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      if (mask & (1 << i)) sum += nums[i];
    }
    minDiff = Math.min(minDiff, Math.abs(total - 2 * sum));
  }
  return minDiff;
  function popcount(x: number) {
    let c = 0;
    while (x) {
      c += x & 1;
      x >>= 1;
    }
    return c;
  }
}

/**
 * Solution 2: Meet in the Middle
 * Time: O(2^n · n) — enumerate both halves O(2^n), sort O(2^n · n), binary search O(2^n · log(2^n))
 * Space: O(2^n) — store subset sums grouped by size
 *
 * Key steps:
 * 1. Split nums into left half and right half (each size n)
 * 2. For each half, enumerate all 2^n subsets, group sums by subset size
 * 3. Sort each group in right half
 * 4. For each subset of size k from left, binary search in right sums of size (n-k)
 *    to find rSum closest to (totalSum/2 - lSum)
 */
function minimumDifference(nums: number[]): number {
  const n = nums.length / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  const left = nums.slice(0, n);
  const right = nums.slice(n);

  // Enumerate all subset sums grouped by size
  function subsetSumsBySize(arr: number[]): Map<number, number[]> {
    const m = arr.length;
    const map = new Map<number, number[]>();
    for (let mask = 0; mask < 1 << m; mask++) {
      let sum = 0,
        cnt = 0;
      for (let i = 0; i < m; i++) {
        if (mask & (1 << i)) {
          sum += arr[i];
          cnt++;
        }
      }
      if (!map.has(cnt)) map.set(cnt, []);
      map.get(cnt)!.push(sum);
    }
    // Sort each group for binary search
    for (const arr of map.values()) arr.sort((a, b) => a - b);
    return map;
  }

  const leftMap = subsetSumsBySize(left);
  const rightMap = subsetSumsBySize(right);
  const halfTotal = total / 2;
  let minDiff = Infinity;

  for (let k = 0; k <= n; k++) {
    const ls = leftMap.get(k) ?? [];
    const rs = rightMap.get(n - k) ?? [];
    if (!ls.length || !rs.length) continue;

    for (const lSum of ls) {
      // Binary search in rs for value closest to (halfTotal - lSum)
      const tgt = halfTotal - lSum;
      let lo = 0,
        hi = rs.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const candidate = lSum + rs[mid];
        minDiff = Math.min(minDiff, Math.abs(total - 2 * candidate));
        if (rs[mid] < tgt) lo = mid + 1;
        else hi = mid - 1;
      }
    }
  }
  return minDiff;
}

// === Test Cases ===
console.log(minimumDifference([3, 9, 7, 3])); // 2
console.log(minimumDifference([-36, 36])); // 72
console.log(minimumDifference([2, -1, 0, 4, -2, 3])); // 0
console.log(minimumDifference([0, 0, 0, 0])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                      | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum)             | Meet in the Middle | Hard       |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)       | DP / Subset Sum    | Medium     |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)                   | DP / Subset Sum    | Medium     |
| [Target Sum](https://leetcode.com/problems/target-sum)                                       | DP / DFS           | Medium     |
| [Split Array With Same Average](https://leetcode.com/problems/split-array-with-same-average) | Meet in the Middle | Hard       |
