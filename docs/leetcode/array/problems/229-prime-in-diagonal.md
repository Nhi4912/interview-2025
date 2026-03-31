---
layout: page
title: "Prime In Diagonal"
difficulty: Easy
category: Array
tags: [Array, Math, Matrix, Number Theory]
leetcode_url: "https://leetcode.com/problems/prime-in-diagonal"
---

# Prime In Diagonal / Số Nguyên Tố Trên Đường Chéo

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Matrix Diagonal Traversal + Math

## 🧠 Intuition / Tư Duy

**Như đọc hai đường chéo của bảng cờ vua**: đường chéo chính (i,i) và đường chéo phụ (i, n-1-i). Duyệt qua chúng, kiểm tra số nguyên tố, lấy giá trị lớn nhất.

**Pattern Recognition:**

- Hai đường chéo của ma trận vuông n×n: mat[i][i] và mat[i][n-1-i]
- Kiểm tra nguyên tố với trial division lên đến √n
- Theo dõi max prime tìm được

**Visual:**

```
mat = [[1,2,3],
       [5,6,7],
       [4,8,9]]
Main diagonal:   mat[0][0]=1, mat[1][1]=6, mat[2][2]=9
Anti-diagonal:   mat[0][2]=3, mat[1][1]=6, mat[2][0]=4
Primes found: 3 → answer = 3
```

## Problem Description

Cho ma trận vuông `mat` n×n. Trả về số nguyên tố **lớn nhất** xuất hiện trên đường chéo chính hoặc đường chéo phụ. Nếu không có số nguyên tố → trả về `0`.

**Example 1:** `mat = [[1,2,3],[5,6,7],[4,8,9]]` → `3`
**Example 2:** `mat = [[1,1,1],[1,1,1],[1,1,1]]` → `0`

**Constraints:** `1 ≤ n ≤ 300`, `1 ≤ mat[i][j] ≤ 10^6`

## 📝 Interview Tips

1. **Hai đường chéo**: chính là (i,i), phụ là (i, n-1-i); có thể trùng ở giữa khi n lẻ
2. **isPrime check**: O(√n) — trial division đủ với n ≤ 10^6 → √n ≤ 1000
3. **Memoize isPrime**: cache kết quả để tránh kiểm tra lặp nếu giá trị trùng nhau
4. **Trường hợp đặc biệt**: 1 không phải số nguyên tố, 2 là số nguyên tố chẵn duy nhất
5. **Tối ưu**: Sieve of Eratosthenes nếu n rất lớn và nhiều queries
6. **Lỗi thường gặp**: quên xử lý mat[i][n-1-i] trùng với mat[i][i] khi n lẻ

## Solutions

```typescript
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// Solution 1: Traverse both diagonals — O(n √maxVal) time
function diagonalPrime(mat: number[][]): number {
  const n = mat.length;
  let ans = 0;
  for (let i = 0; i < n; i++) {
    // Main diagonal
    if (isPrime(mat[i][i])) ans = Math.max(ans, mat[i][i]);
    // Anti-diagonal (avoid double-counting center for odd n)
    const j = n - 1 - i;
    if (j !== i && isPrime(mat[i][j])) ans = Math.max(ans, mat[i][j]);
    else if (j === i && isPrime(mat[i][j])) ans = Math.max(ans, mat[i][j]);
  }
  return ans;
}

// Solution 2: Collect diagonal values then filter — cleaner
function diagonalPrimeV2(mat: number[][]): number {
  const n = mat.length;
  const candidates = new Set<number>();
  for (let i = 0; i < n; i++) {
    candidates.add(mat[i][i]);
    candidates.add(mat[i][n - 1 - i]);
  }
  let ans = 0;
  for (const val of candidates) {
    if (isPrime(val)) ans = Math.max(ans, val);
  }
  return ans;
}

// Solution 3: Sieve approach (precompute all primes ≤ 10^6)
function diagonalPrimeV3(mat: number[][]): number {
  const MAX = 1_000_001;
  const sieve = new Uint8Array(MAX).fill(1);
  sieve[0] = sieve[1] = 0;
  for (let i = 2; i * i < MAX; i++) {
    if (sieve[i]) for (let j = i * i; j < MAX; j += i) sieve[j] = 0;
  }
  const n = mat.length;
  let ans = 0;
  for (let i = 0; i < n; i++) {
    if (sieve[mat[i][i]]) ans = Math.max(ans, mat[i][i]);
    if (sieve[mat[i][n - 1 - i]]) ans = Math.max(ans, mat[i][n - 1 - i]);
  }
  return ans;
}

// Tests
console.log(
  diagonalPrime([
    [1, 2, 3],
    [5, 6, 7],
    [4, 8, 9],
  ]),
); // 3
console.log(
  diagonalPrime([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
); // 0
console.log(
  diagonalPrimeV2([
    [1, 2, 3],
    [5, 6, 7],
    [4, 8, 9],
  ]),
); // 3
console.log(
  diagonalPrimeV3([
    [1, 2, 3],
    [5, 6, 7],
    [4, 8, 9],
  ]),
); // 3
```

## 🔗 Related Problems

| Problem                       | Relationship                   |
| ----------------------------- | ------------------------------ |
| 1diagonal - Diagonal Traverse | Matrix diagonal access pattern |
| 2614 - Prime In Diagonal      | This problem                   |
| 866 - Prime Palindrome        | Prime checking + optimization  |
| 204 - Count Primes            | Sieve of Eratosthenes          |
