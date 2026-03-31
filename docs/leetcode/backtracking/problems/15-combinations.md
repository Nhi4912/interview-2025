---
layout: page
title: "Combinations"
difficulty: Medium
category: Backtracking
tags: [Backtracking]
leetcode_url: "https://leetcode.com/problems/combinations"
---

# Combinations / Tổ Hợp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Combination Sum](https://leetcode.com/problems/combination-sum) | [Permutations](https://leetcode.com/problems/permutations) | [Subsets](https://leetcode.com/problems/subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chọn đội hình — bạn chọn từng cầu thủ từ số nhỏ đến lớn, không được chọn lại và không cần quan tâm thứ tự (AB = BA). Khi đủ `k` người thì ghi lại kết quả.

**Pattern Recognition:**

- Chọn `k` phần tử không thứ tự → **Backtracking** with `start` pointer
- Pruning: nếu còn `< k - path.length` phần tử phía sau → dừng sớm

```
n=4, k=2: pick 2 from [1,2,3,4]
start=1 → pick 1
  start=2 → pick 2 → [1,2] ✓
  start=3 → pick 3 → [1,3] ✓
  start=4 → pick 4 → [1,4] ✓
start=2 → pick 2
  start=3 → pick 3 → [2,3] ✓
  start=4 → pick 4 → [2,4] ✓
start=3 → pick 3
  start=4 → pick 4 → [3,4] ✓
```

---

## Problem Description

Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`. Return in any order.

**Example 1:**

```
Input: n=4, k=2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```

**Example 2:**

```
Input: n=1, k=1
Output: [[1]]
```

**Constraints:** `1 ≤ k ≤ n ≤ 20`

---

## 📝 Interview Tips

- 🇻🇳 **Dùng `start`** để chỉ chọn phần tử phía sau, tránh hoán vị trùng
- 🇬🇧 Always pass a `start` index — never pick elements before it; avoids duplicate combos
- 🇻🇳 **Pruning quan trọng**: vòng lặp chỉ đến `n - (k - path.length) + 1`, không đến `n`
- 🇬🇧 Prune loop: `i <= n - (k - path.length) + 1` — if not enough numbers remain, stop
- 🇻🇳 Phân biệt: **Combinations** (không thứ tự, dùng `start`) vs **Permutations** (có thứ tự, dùng `visited`)
- 🇬🇧 Key distinction: Combinations → `start` pointer; Permutations → `visited` boolean array

---

## Solutions

### Solution 1: Backtracking with Pruning

```typescript
/**
 * Generate all k-combinations from range [1..n]
 * @param {number} n - upper bound (inclusive)
 * @param {number} k - size of each combination
 * @returns {number[][]} all unique combinations
 * Time: O(C(n,k) * k) — C(n,k) combos, each costs O(k) to copy
 * Space: O(k) recursion depth + output space
 */
function combine(n: number, k: number): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[]): void {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    // Prune: need (k - path.length) more numbers; available: n - i + 1
    const need = k - path.length;
    for (let i = start; i <= n - need + 1; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(1, []);
  return result;
}

console.log(combine(4, 2));
// [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
console.log(combine(1, 1));
// [[1]]
console.log(combine(5, 3).length); // 10
```

### Solution 2: Iterative Lexicographic

```typescript
/**
 * Iterative combination — no recursion stack overhead
 * Uses "odometer" technique: rightmost digit increments first
 * Time: O(C(n,k) * k)
 * Space: O(k) for working array
 */
function combineIterative(n: number, k: number): number[][] {
  const result: number[][] = [];
  // combo[0..k-1] are the combination; combo[k] is a sentinel
  const combo: number[] = Array.from({ length: k + 1 }, (_, i) => i + 1);
  combo[k] = n + 1; // sentinel stops the loop

  let j = 0;
  while (j < k) {
    result.push(combo.slice(0, k));
    j = 0;
    // Find leftmost index where we can increment
    while (j < k && combo[j] + 1 === combo[j + 1]) {
      combo[j] = j + 1; // reset to minimum
      j++;
    }
    combo[j]++;
  }
  return result;
}

console.log(combineIterative(4, 2).length); // 6
console.log(combineIterative(5, 3).length); // 10
```

---

## 🔗 Related Problems

- [77. Combinations](https://leetcode.com/problems/combinations) ← this
- [39. Combination Sum](https://leetcode.com/problems/combination-sum) — unlimited use of elements
- [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii) — with duplicates
- [46. Permutations](https://leetcode.com/problems/permutations) — order matters
- [78. Subsets](https://leetcode.com/problems/subsets) — all possible subset sizes
