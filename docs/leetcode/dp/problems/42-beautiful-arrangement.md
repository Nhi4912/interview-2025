---
layout: page
title: "Beautiful Arrangement"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/beautiful-arrangement"
---

# Beautiful Arrangement / Sắp Xếp Đẹp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bitmask DP / Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) | [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp ghế cho n người — mỗi người chỉ ngồi được vào một số ghế nhất định. Đếm tổng số cách phân công hợp lệ với điều kiện "divisibility".

**Pattern Recognition:**

- Signal: "count permutations" + small n (≤15) + positional constraints → **Bitmask DP**
- `dp[mask]` = số cách sắp xếp các số trong `mask` vào các vị trí `1..popcount(mask)`
- Key insight: Position = số bit đã dùng trong mask; backtracking cũng chạy nhanh nhờ pruning

**Visual — n=3, positions 1,2,3:**

```
Backtrack tree:
pos=1: try 1(ok:1%1=0), try 2(ok:2%1=0), try 3(ok:3%1=0)
  pos=2 with used={1}: try 2(ok:2%2=0), try 3(ok:3%2?no,2%3?no)
    pos=3 with used={1,2}: try 3 → 3%3=0 ✓  count++
  pos=2 with used={2}: try 1(1%2?no,2%1=0✓), try 3(3%2?no,2%3?no)
    pos=3 with used={2,1}: try 3 → 3%3=0 ✓  count++
  ...
Answer = 3
```

---

## Problem Description

Suppose you have `n` integers from 1 to n. A beautiful arrangement is a permutation where for every position `i`, either `perm[i] % i == 0` or `i % perm[i] == 0`. Return the count of beautiful arrangements for `n`. ([LeetCode 526](https://leetcode.com/problems/beautiful-arrangement))

- Example 1: `n=2` → `2` (arrangements: [1,2] and [2,1])
- Example 2: `n=1` → `1`

Constraints: `1 ≤ n ≤ 15`

---

## 📝 Interview Tips

1. **Clarify**: "n tối đa bao nhiêu? — ảnh hưởng approach" / n≤15 hints at bitmask DP
2. **Brute force**: "Generate all permutations, check each — O(n! \* n)" / Too slow for large n
3. **Backtracking**: "Prune sớm khi current number không divisible" / Much faster than brute force
4. **Bitmask DP**: "`dp[mask]` = ways to fill positions 1..k where k=bits in mask" / O(2^n \* n)
5. **Position trick**: "Khi điền mask, position = popcount(mask) vì ta điền từng vị trí một" / pos = number of bits set
6. **Complexity**: "Backtracking: O(k _ n!) thực tế, Bitmask: O(2^n _ n) — cả hai đều ok với n≤15" / Both pass

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking with pruning
 * Time: O(k * n!) in worst case, much faster in practice
 * Space: O(n)
 */
function countArrangementBacktrack(n: number): number {
  let count = 0;
  const used = new Array(n + 1).fill(false);

  function backtrack(pos: number): void {
    if (pos > n) {
      count++;
      return;
    }
    for (let num = 1; num <= n; num++) {
      if (!used[num] && (num % pos === 0 || pos % num === 0)) {
        used[num] = true;
        backtrack(pos + 1);
        used[num] = false;
      }
    }
  }

  backtrack(1);
  return count;
}

/**
 * Solution 2: Bitmask DP — dp[mask] = ways to place numbers in mask
 * Time: O(2^n * n)
 * Space: O(2^n)
 */
function countArrangement(n: number): number {
  const dp = new Array(1 << n).fill(0);
  dp[0] = 1; // empty arrangement has 1 way

  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === 0) continue;
    // Next position to fill = count of bits already set + 1
    const pos =
      mask
        .toString(2)
        .split("")
        .filter((c) => c === "1").length + 1;
    if (pos > n) continue;

    for (let num = 1; num <= n; num++) {
      const bit = 1 << (num - 1);
      if (mask & bit) continue; // already used
      if (num % pos === 0 || pos % num === 0) {
        dp[mask | bit] += dp[mask];
      }
    }
  }

  return dp[(1 << n) - 1];
}

// === Test Cases ===
console.log(countArrangement(1)); // 1
console.log(countArrangement(2)); // 2
console.log(countArrangement(3)); // 3
console.log(countArrangement(6)); // 36 (known answer)
```

---

## 🔗 Related Problems

- [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) — backtracking với pruning
- [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) — bitmask DP partition
- [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) — bitmask DP assignment
- [Beautiful Arrangement II](https://leetcode.com/problems/beautiful-arrangement-ii) — variant constructive approach
- [Permutations II](https://leetcode.com/problems/permutations-ii) — permutation counting with constraints
