---
layout: page
title: "Optimal Account Balancing"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/optimal-account-balancing"
---

# Optimal Account Balancing / Cân Bằng Tài Khoản Tối Ưu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking / Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) | [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia tiền sau chuyến đi nhóm — một số người nợ tiền, một số được nợ. Tìm cách thanh toán ít giao dịch nhất bằng cách "offset" các khoản nợ với nhau.

**Pattern Recognition:**

- Signal: "minimize transactions" + "net balances" + small group → **Backtracking / Bitmask DP**
- Tính net balance cho mỗi người → giảm xuống còn danh sách nonzero debts/credits
- Key insight: Tìm số nhóm tập hợp con có tổng = 0 → mỗi nhóm cần size-1 giao dịch

**Visual — transactions=[[0,1,10],[2,0,5]]:**

```
Net balances: 0: -10+5=-5, 1: +10, 2: -5
nonzero = [-5, 10, -5]

Backtrack from index 0 (debt=-5):
  Match with index 1 (credit=10): settle 5, creditor left with 5
    Recurse with [->(5), (5), -5] → match remaining
  Total: 2 transactions
```

---

## Problem Description

Given a list of transactions `[from, to, amount]`, return the minimum number of transactions to settle all debts. ([LeetCode 465](https://leetcode.com/problems/optimal-account-balancing))

- Example 1: `[[0,1,10],[2,0,5]]` → `2`
- Example 2: `[[0,1,10],[1,0,1],[1,2,5],[2,0,5]]` → `1`

Constraints: `1 ≤ transactions.length ≤ 8`, `0 ≤ amounts ≤ 100`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể split một giao dịch không? — Không, chỉ cần minimize count" / Can we split? No
2. **Reduce**: "Tính net balance → bỏ zero balance → giảm problem size" / Net balance reduction first
3. **Backtracking**: "Thử settle person i với mọi người j có dấu ngược — đệ quy và backtrack" / Match debts with credits
4. **Bitmask DP**: "Với constraints nhỏ (≤12 người), enumerate subsets sum=0" / DP on subsets alternative
5. **Greedy**: "Greedy không optimal đây — có thể cần chia nhóm phức tạp hơn" / Greedy fails, need exhaustive
6. **Pruning**: "Nếu balance[i]=0, skip; settle và đệ quy từ i+1 trở đi" / Skip zeroed accounts

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking — settle each debt with any matching credit
 * Time: O(n!) worst case, much better in practice
 * Space: O(n)
 */
function minTransfersBacktrack(transactions: number[][]): number {
  const balance = new Map<number, number>();
  for (const [from, to, amt] of transactions) {
    balance.set(from, (balance.get(from) ?? 0) - amt);
    balance.set(to, (balance.get(to) ?? 0) + amt);
  }
  const debts = [...balance.values()].filter((v) => v !== 0);

  function backtrack(idx: number): number {
    while (idx < debts.length && debts[idx] === 0) idx++;
    if (idx === debts.length) return 0;

    let minTx = Infinity;
    for (let j = idx + 1; j < debts.length; j++) {
      // Only settle if opposite signs (one owes, other is owed)
      if (debts[idx] * debts[j] < 0) {
        debts[j] += debts[idx]; // settle debt[idx] with debt[j]
        minTx = Math.min(minTx, 1 + backtrack(idx + 1));
        debts[j] -= debts[idx]; // backtrack
      }
    }
    return minTx;
  }

  return backtrack(0);
}

/**
 * Solution 2: Bitmask DP — find max groups with zero-sum subsets
 * Each zero-sum group of size k needs k-1 transactions
 * Time: O(3^n) — subset enumeration
 * Space: O(2^n)
 */
function minTransfers(transactions: number[][]): number {
  const balance = new Map<number, number>();
  for (const [from, to, amt] of transactions) {
    balance.set(from, (balance.get(from) ?? 0) - amt);
    balance.set(to, (balance.get(to) ?? 0) + amt);
  }
  const debts = [...balance.values()].filter((v) => v !== 0);
  const n = debts.length;
  const sumOf = new Array(1 << n).fill(0);

  // Precompute sum for each subset
  for (let mask = 1; mask < 1 << n; mask++) {
    const lsb = mask & -mask;
    const idx = Math.log2(lsb);
    sumOf[mask] = sumOf[mask ^ lsb] + debts[idx];
  }

  // dp[mask] = min transactions to settle debts in mask
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let mask = 1; mask < 1 << n; mask++) {
    if (sumOf[mask] !== 0) continue; // can't zero this subset alone
    // Try splitting mask into two zero-sum subsets
    dp[mask] =
      mask
        .toString(2)
        .split("")
        .filter((c) => c === "1").length - 1;
    // Enumerate sub-subsets
    for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
      if (sumOf[sub] === 0 && dp[sub] !== Infinity && dp[mask ^ sub] !== Infinity) {
        dp[mask] = Math.min(dp[mask], dp[sub] + dp[mask ^ sub]);
      }
    }
  }

  return dp[(1 << n) - 1];
}

// === Test Cases ===
console.log(
  minTransfers([
    [0, 1, 10],
    [2, 0, 5],
  ]),
); // 2
console.log(
  minTransfers([
    [0, 1, 10],
    [1, 0, 1],
    [1, 2, 5],
    [2, 0, 5],
  ]),
); // 1
console.log(minTransfers([[0, 1, 10]])); // 1
console.log(
  minTransfers([
    [0, 1, 10],
    [1, 2, 10],
    [2, 0, 10],
  ]),
); // 2 (circular)
```

---

## 🔗 Related Problems

- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — backtracking với positional constraints
- [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) — bitmask DP partition
- [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) — bitmask DP assignment
- [Split Array into Equal Sum Subsets](https://leetcode.com/problems/partition-equal-subset-sum) — subset sum variant
- [Minimum Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points) — TSP-style bitmask
