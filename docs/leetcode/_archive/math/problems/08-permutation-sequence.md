---
layout: page
title: "Permutation Sequence"
difficulty: Hard
category: Math
tags: [Math, Recursion]
leetcode_url: "https://leetcode.com/problems/permutation-sequence"
---

# Permutation Sequence / Hoán Vị Thứ K

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Factorial Number System
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Next Permutation](https://leetcode.com/problems/next-permutation) | [Permutations](https://leetcode.com/problems/permutations)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Có 3 người và 3 ghế. Có 3! = 6 cách xếp. Nếu muốn tìm cách thứ k, bạn biết: nhóm đầu tiên (theo chữ số đầu tiên) có (n-1)! cách. Số đầu tiên là `digits[(k-1) / (n-1)!]`. Sau khi chọn, xóa chữ số đó rồi lặp lại — như đọc số trong hệ đếm giai thừa.

**Pattern Recognition:**

- Signal: "kth permutation without generating all" → **factorial number system**
- Mỗi vị trí: `idx = floor((k-1) / (remaining-1)!)`, chọn `digits[idx]`, cập nhật `k = (k-1) % factorial + 1`
- Brute force O(n! × n) dễ TLE với n=9 (362880 perms), factorial method O(n²)
- Convert k sang 0-indexed (`k--`) trước để tránh off-by-one

**Visual — n=4, k=9:**

```
Digits: [1,2,3,4]    Factorials: 3!=6, 2!=2, 1!=1, 0!=1

Step 1: idx=(9-1)/6=1 → pick 2, remaining=[1,3,4], k=9%6=3 (re-index: k=3)
Step 2: idx=(3-1)/2=1 → pick 3, remaining=[1,4],   k=3%2=1
Step 3: idx=(1-1)/1=0 → pick 1, remaining=[4],     k=0
Step 4: only 4 left   → pick 4

Result: "2314"
```

---

## Problem Description

Given `n` and `k`, return the `k`th permutation sequence of `[1, 2, ..., n]` (1-indexed, lexicographic order). ([LeetCode 60](https://leetcode.com/problems/permutation-sequence))

Difficulty: Hard | Acceptance: 49.9%

- **Example 1**: n=3, k=3 → `"213"` (all: 123, 132, **213**, 231, 312, 321)
- **Example 2**: n=4, k=9 → `"2314"`
- **Example 3**: n=3, k=1 → `"123"`

Constraints: `1 ≤ n ≤ 9`, `1 ≤ k ≤ n!`

---

## 📝 Interview Tips

1. **Clarify**: "k là 1-indexed, cần `k--` ngay để chuyển 0-indexed" / k is 1-based; subtract 1 immediately to avoid confusion
2. **Brute force**: "Sinh tất cả hoán vị rồi lấy phần tử thứ k — O(n! × n), TLE" / Backtracking all permutations works but is slow
3. **Key insight**: "Hệ số giai thừa: chia nhóm (n-1)! tại mỗi vị trí" / Factorial partitioning — each position has (n-1)! possibilities
4. **Remove digit**: "Sau mỗi lần chọn, xóa chữ số khỏi danh sách còn lại" / splice chosen digit from the pool after selection
5. **Edge cases**: "n=1 → '1'; k=1 → chuỗi nhỏ nhất; k=n! → chuỗi lớn nhất" / Boundary k values produce first/last permutations
6. **Follow-up**: "n lớn → giai thừa overflow, dùng BigInt" / For large n, factorials overflow 32-bit integers

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Generate All Permutations (Backtracking)
 * Time: O(n! * n) — generates all permutations, then indexes
 * Space: O(n! * n) — stores all permutations
 */
function getPermutationBrute(n: number, k: number): string {
  const results: string[] = [];
  const used = new Array(n + 1).fill(false);

  function backtrack(current: string): void {
    if (current.length === n) {
      results.push(current);
      return;
    }
    for (let i = 1; i <= n; i++) {
      if (!used[i]) {
        used[i] = true;
        backtrack(current + i);
        used[i] = false;
      }
    }
  }
  backtrack("");
  return results[k - 1];
}

/**
 * Solution 2: Optimal — Factorial Number System
 * Time: O(n²) — n positions, each with O(n) splice
 * Space: O(n)
 *
 * At each position, use k and (remaining-1)! to pick the exact digit.
 * No need to generate any other permutations.
 */
function getPermutation(n: number, k: number): string {
  // Precompute factorials: factorial[i] = i!
  const factorial = [1];
  for (let i = 1; i <= n; i++) factorial[i] = factorial[i - 1] * i;

  // Pool of available digits
  const digits = Array.from({ length: n }, (_, i) => i + 1);
  let result = "";
  k--; // Convert to 0-indexed

  for (let i = n; i >= 1; i--) {
    const idx = Math.floor(k / factorial[i - 1]);
    result += digits[idx];
    digits.splice(idx, 1); // remove chosen digit from pool
    k %= factorial[i - 1]; // update k for next position
  }

  return result;
}

// === Test Cases ===
console.log(getPermutation(3, 3)); // "213"
console.log(getPermutation(4, 9)); // "2314"
console.log(getPermutation(3, 1)); // "123"
console.log(getPermutation(1, 1)); // "1"
console.log(getPermutation(3, 6)); // "321"
```

---

## 🔗 Related Problems

- [Next Permutation](https://leetcode.com/problems/next-permutation) — advance by exactly 1 in lexicographic order
- [Permutations](https://leetcode.com/problems/permutations) — generate ALL permutations via backtracking
- [Permutations II](https://leetcode.com/problems/permutations-ii) — handle duplicate digits in permutations
- [Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes) — factorial number properties
- [Permutation Sequence — LeetCode](https://leetcode.com/problems/permutation-sequence) — problem page
