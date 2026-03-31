---
layout: page
title: "K-th Smallest in Lexicographical Order"
difficulty: Hard
category: String
tags: [Trie]
leetcode_url: "https://leetcode.com/problems/k-th-smallest-in-lexicographical-order"
---

# K-th Smallest in Lexicographical Order / Số Thứ K Nhỏ Nhất Theo Thứ Tự Từ Điển

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Tưởng tượng bạn đếm các số trong danh bạ điện thoại theo thứ tự chữ cái — 1, 10, 100, 101, ... 109, 11, 110 ... Số "1" là cha của tất cả số bắt đầu bằng "1". Đếm bao nhiêu số nằm dưới cây con đó để quyết định đi tiếp hay đi sâu.

```
Lexicographic tree rooted at 1 (n=13):
       1
     / | \
   10  11  12
  /\    |
100 ...  110

countNodes(cur=1, next=2, n=13) → 5 nodes (1,10,11,12,13)
k=3 → skip cur=1 (5>=3? yes) → step into 10 → ...
```

---

## Problem Description

Given two integers `n` and `k`, return the `k`-th lexicographically smallest integer in the range `[1, n]`.

**Example 1:** `n=13, k=2` → `10` (order: 1,10,11,12,13,2,3,...,9)
**Example 2:** `n=1, k=1` → `1`

Constraints: `1 ≤ k ≤ n ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Kết quả là số nguyên, không phải chuỗi?" / Result is integer, not string?
2. **Brute force / Vét cạn**: Generate all numbers, sort lexicographically → O(n log n), TLE for n=10^9
3. **Optimize / Tối ưu**: Count nodes in trie subtree in O(log n); skip or descend
4. **Key insight / Ý tưởng chính**: `countSteps(cur, next)` = nodes between prefix `cur` and `next` capped at n
5. **Edge cases / Trường hợp đặc biệt**: k=1 returns 1; n=10^9 needs BigInt-safe arithmetic
6. **Follow-up / Hỏi thêm**: "Nếu n rất lớn thì sao?" / Same algo still O(log²n) — handles it

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (sort lexicographically)
 * Time: O(n log n) — TLE for large n
 * Space: O(n)
 */
function findKthNumberBrute(n: number, k: number): number {
  const nums: string[] = [];
  for (let i = 1; i <= n; i++) nums.push(String(i));
  nums.sort();
  return parseInt(nums[k - 1]);
}
console.log(findKthNumberBrute(13, 2)); // 10
console.log(findKthNumberBrute(1, 1)); // 1

/**
 * Solution 2: Trie Prefix Counting (Optimal)
 * Count how many numbers exist under a given prefix subtree.
 * Skip entire subtree (k -= count) or step into it (k--, cur*10).
 * Time: O(log²n) — log n levels, each countSteps is O(log n)
 * Space: O(1)
 */
function findKthNumber(n: number, k: number): number {
  // Count integers in [cur, next) that are <= n
  function countSteps(cur: number, next: number): number {
    let steps = 0;
    while (cur <= n) {
      steps += Math.min(n + 1, next) - cur;
      cur *= 10;
      next *= 10;
    }
    return steps;
  }

  let cur = 1;
  k--; // we're already "at" 1

  while (k > 0) {
    const steps = countSteps(cur, cur + 1);
    if (steps <= k) {
      // Skip this entire subtree, move to sibling
      k -= steps;
      cur++;
    } else {
      // Descend into this subtree
      k--;
      cur *= 10;
    }
  }
  return cur;
}

console.log(findKthNumber(13, 2)); // 10
console.log(findKthNumber(13, 5)); // 13
console.log(findKthNumber(1, 1)); // 1
console.log(findKthNumber(100, 10)); // 17
```

---

## 🔗 Related Problems

| Problem                                                                                    | Pattern       | Difficulty |
| ------------------------------------------------------------------------------------------ | ------------- | ---------- |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)   | Trie          | Medium     |
| [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)       | Trie          | Medium     |
| [Lexicographical Numbers](https://leetcode.com/problems/lexicographical-numbers)           | DFS/Trie      | Medium     |
| [K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction) | Binary Search | Medium     |
