---
layout: page
title: "Number of Ways to Reorder Array to Get Same BST"
difficulty: Hard
category: Tree-Graph
tags: [Array, Math, Divide and Conquer, Dynamic Programming, Tree]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst"
---

# Number of Ways to Reorder Array to Get Same BST / Số Cách Sắp Xếp Lại Mảng Để Được Cùng BST

🔴 Hard | Combinatorics | Divide and Conquer

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** BST được xây dựng từ mảng bằng cách chèn lần lượt. Phần tử đầu tiên là gốc. Các phần tử nhỏ hơn vào cây con trái, lớn hơn vào cây con phải. Để giữ cùng BST, **thứ tự tương đối** của các phần tử trong mỗi cây con phải như cũ — nhưng ta được phép **xen kẽ** (interleave) trái và phải theo bất kỳ cách nào.

```
nums = [3,1,2,5,4,6]  root=3
left=[1,2], right=[5,4,6]
Ways = C(5,2) × ways([1,2]) × ways([5,4,6])
     = 10 × 1 × 1 = 10
(subtract 1 for original: 10 - 1 = ... count non-original)
Answer = ways - 1 (mod 10^9+7)
```

**Key insight:** For root's left (size L) and right (size R) subtrees, ways to interleave = `C(L+R, L)`. Multiply by recursive ways for each subtree. Answer = total_ways - 1 (exclude original order).

## Problem Description

Given an integer array `nums` representing a BST (insert order), return the number of **different** arrays producing the same BST, modulo `10^9 + 7`. Do not count the original array.

**Example 1:**

- Input: `nums = [2,1,3]`
- Output: `1` (only `[2,3,1]` gives same BST)

**Example 2:**

- Input: `nums = [3,4,5,1,2]`
- Output: `5`

## 📝 Interview Tips

- **Q: Why interleave left and right? / Tại sao xen kẽ trái và phải?**
  - A: Relative order within each subtree must stay same; cross-order is free / Thứ tự trong mỗi cây con phải giữ nguyên.
- **Q: How compute C(n,k) efficiently? / Tính C(n,k) hiệu quả thế nào?**
  - A: Precompute Pascal's triangle or use modular inverse / Tính trước tam giác Pascal hoặc dùng nghịch đảo modular.
- **Q: What's the recurrence? / Công thức đệ quy là gì?**
  - A: ways(nums) = C(L+R, L) × ways(left) × ways(right) / Công thức nhân kết hợp.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n^2) for Pascal's triangle and recursion / O(n^2) cho tam giác Pascal và đệ quy.
- **Q: Why subtract 1 at end? / Tại sao trừ 1 ở cuối?**
  - A: The original array is included in our count, must exclude it / Mảng gốc được đếm trong kết quả.
- **Q: Edge case — n=1? / Trường hợp n=1?**
  - A: Only one arrangement possible → return 0 / Chỉ một cách sắp xếp → trả về 0.

## Solutions

### Solution 1: Divide & Conquer + Pascal's Triangle

```typescript
/**
 * Count reorderings that produce same BST.
 * Time: O(n^2)  Space: O(n^2) for Pascal's triangle
 */
function numOfWays(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;

  // Precompute Pascal's triangle
  const C: bigint[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0n));
  for (let i = 0; i <= n; i++) {
    C[i][0] = 1n;
    for (let j = 1; j <= i; j++) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
  }

  function countWays(arr: number[]): bigint {
    if (arr.length <= 2) return 1n;
    const root = arr[0];
    const left = arr.slice(1).filter((x) => x < root);
    const right = arr.slice(1).filter((x) => x > root);
    const L = left.length,
      R = right.length;
    // C(L+R, L) × ways(left) × ways(right)
    return (((C[L + R][L] * countWays(left)) % MOD) * countWays(right)) % MOD;
  }

  return Number((countWays(nums) - 1n + MOD) % MOD);
}

// Tests
console.log(numOfWays([2, 1, 3])); // 1
console.log(numOfWays([3, 4, 5, 1, 2])); // 5
console.log(numOfWays([1, 2, 3])); // 0
console.log(numOfWays([3, 1, 2, 5, 4, 6])); // 19
```

### Solution 2: DFS with Inline Combination

```typescript
/**
 * Count reorderings using DFS with modular combination.
 * Time: O(n^2)  Space: O(n^2)
 */
function numOfWaysDFS(nums: number[]): number {
  const MOD = 1_000_000_007n;

  function comb(n: number, k: number): bigint {
    if (k > n || k < 0) return 0n;
    if (k === 0 || k === n) return 1n;
    let num = 1n,
      den = 1n;
    for (let i = 0; i < k; i++) {
      num = (num * BigInt(n - i)) % MOD;
      den = (den * BigInt(i + 1)) % MOD;
    }
    // Modular inverse using Fermat's little theorem (MOD is prime)
    function pow(base: bigint, exp: bigint, mod: bigint): bigint {
      let result = 1n;
      base %= mod;
      while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
      }
      return result;
    }
    return (num * pow(den, MOD - 2n, MOD)) % MOD;
  }

  function dfs(arr: number[]): bigint {
    if (arr.length <= 2) return 1n;
    const root = arr[0];
    const left = arr.slice(1).filter((x) => x < root);
    const right = arr.slice(1).filter((x) => x > root);
    return (((comb(left.length + right.length, left.length) * dfs(left)) % MOD) * dfs(right)) % MOD;
  }

  return Number((dfs(nums) - 1n + MOD) % MOD);
}

// Tests
console.log(numOfWaysDFS([2, 1, 3])); // 1
console.log(numOfWaysDFS([3, 4, 5, 1, 2])); // 5
```

## 🔗 Related Problems

| #    | Problem                         | Difficulty | Key Concept     |
| ---- | ------------------------------- | ---------- | --------------- |
| 96   | Unique Binary Search Trees      | Medium     | Catalan Numbers |
| 95   | Unique Binary Search Trees II   | Medium     | DP + Recursion  |
| 1569 | Number of Ways to Reorder Array | Hard       | Combinatorics   |
| 894  | All Possible Full Binary Trees  | Medium     | Recursion       |
