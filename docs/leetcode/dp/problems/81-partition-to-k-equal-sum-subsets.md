---
layout: page
title: "Partition to K Equal Sum Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Memoization]
leetcode_url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets"
---

# Partition to K Equal Sum Subsets / Phân Chia Thành K Tập Con Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Shopping Offers](https://leetcode.com/problems/shopping-offers) | [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia đều quà tặng vào k hộp — thử bỏ từng món vào từng hộp, nếu hộp đầy thì chuyển sang hộp mới. Sắp xếp quà to trước để phát hiện sớm trường hợp bất khả thi (pruning hiệu quả hơn).

**Pattern Recognition:**

- Signal: "partition array into k groups with equal sum" → **Backtracking + Bitmask DP**
- Bitmask DP: `dp[mask]` = tổng còn lại trong nhóm đang xây, sau khi đã dùng các phần tử trong mask
- Backtracking: thử lần lượt, pruning khi bucket vượt target hoặc khi duplicate bucket sum

**Visual — Bitmask DP for nums=[4,3,2,3,5,2,1], k=4, target=5:**

```
mask = 0b0000000 → dp = 0 (empty, partial bucket sum = 0)
Add nums[0]=4: mask=0b0000001 → dp = 4
Add nums[1]=3: 4+3=7>5 skip
Add nums[2]=2: 4+2=6>5 skip
Add nums[5]=2: 4+2=6>5 skip   (trying bit 5)
...
Add nums[6]=1: 4+1=5=target → dp[mask] = 5%5 = 0 (bucket complete!)
```

---

## Problem Description

Given an integer array `nums` and integer `k`, return `true` if it's possible to divide this array into `k` non-empty subsets whose sums are all equal. ([LeetCode 698](https://leetcode.com/problems/partition-to-k-equal-sum-subsets))

**Example 1:** `nums=[4,3,2,3,5,2,1], k=4` → `true` (subsets: {5},{1,4},{2,3},{2,3})

**Example 2:** `nums=[1,2,3,4], k=3` → `false`

Constraints: `1 <= k <= nums.length <= 16`, `1 <= nums[i] <= 10^4`

---

## 📝 Interview Tips

1. **Early exit**: "Nếu sum%k≠0 hoặc max(nums)>target → false ngay" / Check divisibility and max element first
2. **Sort descending**: "Sort giảm dần giúp pruning nhanh hơn trong backtracking" / Sorting descending prunes failed branches earlier
3. **Dedup in backtracking**: "Skip bucket nếu sum bằng nhau — tránh thử lại nhánh trùng" / Prune duplicate bucket states
4. **Bitmask DP**: "n≤16 → 2^16=65536 states — đủ nhỏ cho DP bitmask O(2^n _ n)" / With n≤16, bitmask DP is O(2^n _ n) = ~1M ops
5. **DP semantics**: "dp[mask] = (sum đang dở trong bucket hiện tại) nếu feasible, -1 nếu không" / dp[mask] = partial bucket sum, -1 if infeasible
6. **Answer check**: "dp[(1<<n)-1] == 0 nghĩa là tất cả bucket đều hoàn chỉnh" / All bits set with dp=0 means every bucket was completed

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking with pruning
 * Time: O(k * 2^n) — worst case explore all subsets per bucket
 * Space: O(n) — recursion stack
 */
function canPartitionKSubsets(nums: number[], k: number): boolean {
  const total = nums.reduce((s, x) => s + x, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  nums.sort((a, b) => b - a); // sort descending for better pruning
  if (nums[0] > target) return false;

  const buckets = new Array(k).fill(0);

  function backtrack(idx: number): boolean {
    if (idx === nums.length) return true;
    const seen = new Set<number>();
    for (let i = 0; i < k; i++) {
      if (seen.has(buckets[i])) continue; // skip duplicate bucket state
      if (buckets[i] + nums[idx] <= target) {
        seen.add(buckets[i]);
        buckets[i] += nums[idx];
        if (backtrack(idx + 1)) return true;
        buckets[i] -= nums[idx];
      }
    }
    return false;
  }

  return backtrack(0);
}

/**
 * Solution 2: Bitmask DP — iterate over all 2^n subsets
 * Time: O(2^n * n) — for each mask try each unused element
 * Space: O(2^n) — dp array of bitmask states
 */
function canPartitionKSubsetsBitmask(nums: number[], k: number): boolean {
  const n = nums.length;
  const total = nums.reduce((s, x) => s + x, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  if (nums.some((x) => x > target)) return false;

  // dp[mask] = partial sum of current (incomplete) bucket after placing elements in mask
  // -1 means this mask state is infeasible
  const dp = new Array(1 << n).fill(-1);
  dp[0] = 0;

  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] < 0) continue;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue; // already used
      const newSum = dp[mask] + nums[i];
      if (newSum <= target) {
        dp[mask | (1 << i)] = newSum % target; // % target: full bucket resets to 0
      }
    }
  }

  return dp[(1 << n) - 1] === 0;
}

// === Test Cases ===
console.log(canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4)); // true
console.log(canPartitionKSubsets([1, 2, 3, 4], 3)); // false
console.log(canPartitionKSubsets([2, 2, 2, 2], 4)); // true
```

---

## 🔗 Related Problems

| Problem                                                                                | Difficulty | Pattern            |
| -------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) | 🟡 Medium  | 0/1 Knapsack       |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)           | 🟡 Medium  | Backtracking       |
| [Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square)           | 🟡 Medium  | Backtracking (k=4) |
| [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word)         | 🔴 Hard    | Bitmask DP         |
| [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing)   | 🔴 Hard    | Backtracking       |
