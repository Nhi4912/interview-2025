---
layout: page
title: "Unique Binary Search Trees"
difficulty: Medium
category: Tree-Graph
tags: [Math, Dynamic Programming, Tree, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/unique-binary-search-trees"
---

# Unique Binary Search Trees / Số Cây Tìm Kiếm Nhị Phân Duy Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Catalan Number — DP / Math
> **Frequency**: 📘 Tier 2 — Gặp ở Google, Amazon; bài DP/math kinh điển về số Catalan
> **See also**: [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii) | [96. Unique BSTs](https://leetcode.com/problems/unique-binary-search-trees)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn chọn một số từ 1..n làm gốc. Khi chọn `i` làm gốc: cây con trái có `i-1` node (từ 1..i-1), cây con phải có `n-i` node (từ i+1..n). Số BST = tích số cách tạo cây con trái × cây con phải. Nhận ra đây là **số Catalan C(n)**.

- **Pattern Recognition:**
  - `G(n)` = tổng số BST với n node = `∑ G(i-1) * G(n-i)` với i từ 1..n
  - `G(0) = G(1) = 1` (cây rỗng và cây 1 node)
  - Đây chính là công thức số Catalan: `C(n) = C(2n,n) / (n+1)`

- **Visual — n=3:**

  ```
  G(3) = G(0)*G(2) + G(1)*G(1) + G(2)*G(0)
       =   1*2    +   1*1    +   2*1     = 5

  root=1: ()  root=2:  2    root=3:    3
           \          / \             /
            2..       1   3           1..
             \                         \
              3                         2

  5 cây: {1→2→3}, {1→3←2}, {2,1,3}, {3←1→2}, {3←2←1}
  ```

## Problem Description

Cho số nguyên `n`, trả về số lượng BST cấu trúc khác nhau có đúng `n` node với giá trị từ 1 đến n.

| Input | Output | Giải thích                 |
| ----- | ------ | -------------------------- |
| `3`   | `5`    | 5 BST khác nhau với 3 node |
| `1`   | `1`    | Chỉ một cây (1 node)       |

## 📝 Interview Tips

- 🇻🇳 Bắt đầu bằng cách giải thích recursion: chọn root `i`, cây con trái có `i-1` node, cây con phải có `n-i` node / 🇬🇧 _Start by explaining the root-choice recursion: left has i-1 nodes, right has n-i nodes_
- 🇻🇳 Thêm memoization → O(n²); bottom-up DP cũng O(n²) nhưng không có stack overhead / 🇬🇧 _Add memoization to recursion for O(n²); bottom-up DP is equivalent without stack overhead_
- 🇻🇳 Số Catalan có công thức đóng: `C(2n,n)/(n+1)` → O(n) nếu dùng BigInt cho n lớn / 🇬🇧 _Catalan closed form: C(2n,n)/(n+1) — O(n) time with BigInt for large n_
- 🇻🇳 Khác với UBST II (build actual trees): bài này chỉ đếm → không cần xây cây / 🇬🇧 _Different from UBST II which builds actual trees — this only counts, no construction needed_

## Solutions

```typescript
/**
 * Solution 1: Recursive with Memoization (Top-Down DP)
 * Với mỗi n, thử từng giá trị i làm root.
 * G(n) = sum G(i-1)*G(n-i) cho i = 1..n.
 *
 * @time O(n²) — n trạng thái, mỗi trạng thái tính O(n)
 * @space O(n) — memoization array
 */
function numTreesMemo(n: number): number {
  const memo = new Map<number, number>();

  function g(k: number): number {
    if (k <= 1) return 1;
    if (memo.has(k)) return memo.get(k)!;

    let count = 0;
    for (let i = 1; i <= k; i++) {
      count += g(i - 1) * g(k - i);
    }
    memo.set(k, count);
    return count;
  }

  return g(n);
}

console.log(numTreesMemo(3)); // 5
console.log(numTreesMemo(1)); // 1
console.log(numTreesMemo(5)); // 42

/**
 * Solution 2: Bottom-Up DP — Catalan Recurrence
 * dp[i] = tổng số BST cấu trúc khác nhau với i node.
 * Công thức: dp[i] = sum(dp[j-1] * dp[i-j]) cho j=1..i.
 *
 * @time O(n²) — hai vòng lặp lồng nhau
 * @space O(n) — mảng dp
 */
function numTrees(n: number): number {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // cây rỗng: 1 cách
  dp[1] = 1; // 1 node: 1 cách

  for (let i = 2; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      dp[i] += dp[j - 1] * dp[i - j]; // j làm root
    }
  }

  return dp[n];
}

console.log(numTrees(3)); // 5
console.log(numTrees(1)); // 1
console.log(numTrees(4)); // 14

/**
 * Solution 3: Closed-Form Catalan Number — O(n)
 * Số Catalan thứ n: C(n) = C(2n, n) / (n+1)
 * Tính tăng dần để tránh số quá lớn.
 *
 * @time O(n) — một vòng lặp
 * @space O(1) — chỉ biến số học
 */
function numTreesCatalan(n: number): number {
  // C(n) = C(n-1) * 2*(2n-1) / (n+1)
  let catalan = 1;
  for (let i = 0; i < n; i++) {
    catalan = (catalan * 2 * (2 * i + 1)) / (i + 2);
  }
  return Math.round(catalan); // làm tròn để tránh lỗi floating point nhỏ
}

console.log(numTreesCatalan(3)); // 5
console.log(numTreesCatalan(4)); // 14
console.log(numTreesCatalan(5)); // 42
console.log(numTreesCatalan(19)); // 1767263190
```

## 🔗 Related Problems

| Problem                                                                                                   | Pattern                    | Difficulty |
| --------------------------------------------------------------------------------------------------------- | -------------------------- | ---------- |
| [95. Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii)          | Backtracking — Build Trees | 🟡 Medium  |
| [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses)                            | Catalan / Backtracking     | 🟡 Medium  |
| [241. Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses) | Divide & Conquer           | 🟡 Medium  |
| [1259. Handshakes That Don't Cross](https://leetcode.com/problems/handshakes-that-dont-cross)             | Catalan Number             | 🔴 Hard    |
