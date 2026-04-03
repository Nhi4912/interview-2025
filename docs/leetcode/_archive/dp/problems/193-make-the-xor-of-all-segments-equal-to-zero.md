---
layout: page
title: "Make the XOR of All Segments Equal to Zero"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/make-the-xor-of-all-segments-equal-to-zero"
---

# Make the XOR of All Segments Equal to Zero / Làm XOR Mọi Đoạn Bằng Không

🔴 Hard | Bitmask DP on Groups | LeetCode 1787

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Để XOR mọi đoạn độ dài k bằng 0, ta cần `nums[i] = nums[i % k]` (các phần tử cùng nhóm mod k phải bằng nhau). Thêm điều kiện: XOR của k đại diện nhóm = 0. Bài toán: chọn giá trị cho k nhóm, mỗi nhóm có tần số, tổng số thay đổi tối thiểu.

```
nums = [1,2,0,3,0], k = 1
All must be equal and XOR = 0, so all = 0
Changes: 1,2,3 → 3 changes
Answer = 3

nums = [3,4,5,2,1,7,3,4,7], k = 3
Groups: [0]: {3,2,3}, [1]: {4,1,4}, [2]: {5,7,7}
Pick values v0,v1,v2 where v0^v1^v2 = 0
Minimize changes in each group.
```

## Problem Description

Given integer array `nums` and integer `k`, change minimum number of elements so that XOR of every contiguous subarray of length `k` equals `0`. Return minimum number of changes.

**Example 1:**

- Input: `nums = [1,2,0,3,0]`, `k = 1`
- Output: `3` — Change 1,2,3 to 0

**Example 2:**

- Input: `nums = [3,4,5,2,1,7,3,4,7]`, `k = 3`
- Output: `3`

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** XOR of every window of size k = 0 iff nums[i] = nums[i+k] for all i, AND XOR of one window = 0
- 📊 **Group structure / Cấu trúc nhóm:** Split into k groups: group r = {nums[r], nums[r+k], nums[r+2k], ...}; each group must have uniform value
- 🔢 **DP state / Trạng thái DP:** `dp[r][xr]` = min changes for groups 0..r where XOR of chosen values so far is xr
- ⚡ **Complexity / Độ phức tạp:** O(k × 2^B × max_freq) where B bits; with B=10 (values 0..1023) → O(k × 1024 × n/k) = O(1024n)
- 🚫 **Optimization / Tối ưu:** Use "best over all + correct value" trick to avoid O(1024²) per group
- 💡 **Final answer / Kết quả:** `dp[k-1][0]` = min changes making XOR of all k group values = 0

## Solutions

```typescript
/**
 * Approach 1: DP with frequency counts per group
 * Time: O(k * 1024 * (n/k)) = O(1024 * n)
 * Space: O(k * 1024)
 *
 * dp[xorSoFar] = min changes to assign values to groups 0..r-1
 * with XOR of assigned values = xorSoFar
 *
 * For each group r with frequency map freq:
 * - Size of group = sz[r]
 * - Assigning value v costs sz[r] - freq[v] (keep most common, change rest)
 * - Optimization: for each previous xorSoFar, we need to pick v for group r
 */
function minChanges(nums: number[], k: number): number {
  const n = nums.length;
  const MAX_VAL = 1024; // 2^10 covers values 0..1023
  const INF = n + 1;

  // Build groups and frequency maps
  const groups: Map<number, number>[] = Array.from({ length: k }, () => new Map());
  const groupSizes: number[] = new Array(k).fill(0);

  for (let i = 0; i < n; i++) {
    const r = i % k;
    const v = nums[i];
    groups[r].set(v, (groups[r].get(v) ?? 0) + 1);
    groupSizes[r]++;
  }

  // dp[xor] = min changes for groups processed so far with XOR = xor
  let dp = new Array(MAX_VAL).fill(INF);
  dp[0] = 0;

  for (let r = 0; r < k; r++) {
    const freq = groups[r];
    const sz = groupSizes[r];
    const ndp = new Array(MAX_VAL).fill(INF);

    // Optimization: precompute best (min dp[x]) over all x
    const globalBest = Math.min(...dp);

    for (let xr = 0; xr < MAX_VAL; xr++) {
      // Option A: use globalBest + cost of setting group r to value (xr ^ whatever)
      // For any target XOR xr after this group, we pick v for group r:
      // We need prev_xor ^ v = xr → v = xr ^ prev_xor
      // min cost = min over prev_xor of: dp[prev_xor] + (sz - freq[v])
      // = min over v of: (sz - freq[v]) + dp[xr ^ v]

      // First: use global minimum (any v we didn't have in freq → cost = sz)
      ndp[xr] = Math.min(ndp[xr], globalBest + sz);

      // Then: for values actually in freq, try specific prev_xor
      for (const [v, cnt] of freq) {
        const prevXor = xr ^ v;
        if (dp[prevXor] < INF) {
          const cost = sz - cnt; // change all except cnt elements
          ndp[xr] = Math.min(ndp[xr], dp[prevXor] + cost);
        }
      }
    }

    dp = ndp;
  }

  return dp[0];
}

console.log(minChanges([1, 2, 0, 3, 0], 1)); // 3
console.log(minChanges([3, 4, 5, 2, 1, 7, 3, 4, 7], 3)); // 3
console.log(minChanges([0, 0, 0], 1)); // 0
console.log(minChanges([1, 2, 4], 3)); // 1
```

```typescript
/**
 * Approach 2: Same algorithm with explicit prefix minimum optimization
 * Time: O(n + k * 1024)
 * Space: O(1024)
 */
function minChanges2(nums: number[], k: number): number {
  const n = nums.length;
  const MAX_VAL = 1024;
  const INF = n + 1;

  // Group frequency maps
  const freqs: number[][] = Array.from({ length: k }, () => new Array(MAX_VAL).fill(0));
  const sizes = new Array(k).fill(0);

  for (let i = 0; i < n; i++) {
    freqs[i % k][nums[i]]++;
    sizes[i % k]++;
  }

  let dp = new Array(MAX_VAL).fill(INF);
  dp[0] = 0;

  for (let r = 0; r < k; r++) {
    const sz = sizes[r];
    const globalMin = dp.reduce((a, b) => Math.min(a, b));
    const ndp = new Array(MAX_VAL).fill(globalMin + sz); // default: pick new value not in freq

    for (let v = 0; v < MAX_VAL; v++) {
      if (freqs[r][v] === 0) continue;
      const cost = sz - freqs[r][v];
      for (let prevXor = 0; prevXor < MAX_VAL; prevXor++) {
        if (dp[prevXor] === INF) continue;
        const xr = prevXor ^ v;
        ndp[xr] = Math.min(ndp[xr], dp[prevXor] + cost);
      }
    }

    dp = ndp;
  }

  return dp[0];
}

console.log(minChanges2([1, 2, 0, 3, 0], 1)); // 3
console.log(minChanges2([3, 4, 5, 2, 1, 7, 3, 4, 7], 3)); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                                                 | Difficulty | Key Concept    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Minimum XOR Sum of Two Arrays](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/)                                                           | 🔴 Hard    | Bitmask DP     |
| [Maximize Score After N Operations](https://leetcode.com/problems/maximize-score-after-n-operations/)                                                   | 🔴 Hard    | Bitmask DP     |
| [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-lines-to-represent-a-line-chart/)                                       | 🟡 Medium  | DP on groups   |
| [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/) | 🔴 Hard    | Meet in Middle |
