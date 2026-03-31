---
layout: page
title: "Delete and Earn"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/delete-and-earn"
---

# Delete and Earn / Xóa Và Kiếm Điểm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linear DP (House Robber variant)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [House Robber](https://leetcode.com/problems/house-robber) | [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn trộm — nếu bạn lấy số x, phải bỏ x-1 và x+1. Tổng tất cả x trong mảng có thể gom thành "phần thưởng" tại giá trị x, rồi áp dụng House Robber!

**Pattern Recognition:**

- Signal: "pick value x → delete x±1" + "maximize total" → **Reduce to House Robber**
- Bước 1: `earn[v] = v * count(v)` — tổng điểm nếu chọn tất cả số có giá trị v
- Bước 2: House Robber trên mảng `earn[0..maxVal]` — không thể lấy hai giá trị liên tiếp

**Visual — nums=[2,2,3,3,3,4]:**

```
Step 1 — Build earn[] (index = value):
  value:  0  1   2   3  4
  earn:   0  0   4   9  4   (earn[2]=2×2, earn[3]=3×3, earn[4]=4×1)

Step 2 — House Robber on earn[]:
  dp[1] = earn[1]           = 0
  dp[2] = max(0, 0+4)       = 4
  dp[3] = max(4, 0+9)       = 9   ← take all 3s
  dp[4] = max(9, 4+4)       = 9
Answer = 9 ✓ (taking all 3s earns 9; deletes 2s and 4s)
```

---

## Problem Description

Given array `nums`, you can pick a number `x` to earn `x` points, but must delete every occurrence of `x-1` and `x+1`. Repeat until no more picks. Return the maximum points. ([LeetCode 740](https://leetcode.com/problems/delete-and-earn))

- Example 1: `nums=[3,4,2]` → `6` (take 2 earns 2, deletes 1 and 3; then take 4 earns 4 → total 6)
- Example 2: `nums=[2,2,3,3,3,4]` → `9` (take all 3s earns 9, deletes all 2s and 4s)
- Example 3: `nums=[1,1,1,2,4]` → `7` (take all 1s earns 3, skip 2, take 4 earns 4)

Constraints: `1 ≤ nums.length ≤ 2*10^4`, `1 ≤ nums[i] ≤ 10^4`, total sum ≤ `10^8`

---

## 📝 Interview Tips

1. **Key reduction**: "Khi lấy x, BẮT BUỘC lấy tất cả x; vậy gom thành earn[x] = x \* freq[x]" / Must take all copies of chosen value
2. **Insight**: "Sau khi gom, đây là House Robber — hai giá trị liên tiếp không thể cùng lấy" / Adjacent values conflict = House Robber
3. **Brute force**: "Enumerate tất cả subsets của values rồi check conflicts" / O(2^maxVal) — too slow
4. **State**: "`dp[v]` = max earn từ values 1..v; `dp[v] = max(dp[v-1], dp[v-2] + earn[v])`" / Same as house robber
5. **Space opt**: "Chỉ cần prev2 và prev1 — O(1) space sau khi build earn[]" / Roll to 3 variables
6. **Edge**: "nums[i] có thể trùng, earn[x] = x \* count — đừng count riêng từng phần tử" / Aggregate by value first, then DP
7. **Complexity**: "O(n + maxVal) time — n để build earn[], maxVal để chạy house robber" / Linear in both n and value range

---

## Solutions

```typescript
/**
 * Solution 1: Sorted unique values + DP
 * Time: O(n + m) — n=nums.length, m=maxVal
 * Space: O(m)
 */
function deleteAndEarnSorted(nums: number[]): number {
  const maxVal = Math.max(...nums);
  const earn = new Array(maxVal + 1).fill(0);
  for (const n of nums) earn[n] += n;

  // House Robber on earn array
  if (maxVal === 0) return 0;
  if (maxVal === 1) return earn[1];

  const dp = new Array(maxVal + 1).fill(0);
  dp[1] = earn[1];
  for (let v = 2; v <= maxVal; v++) {
    dp[v] = Math.max(dp[v - 1], dp[v - 2] + earn[v]);
  }
  return dp[maxVal];
}

/**
 * Solution 2: Space-Optimized House Robber
 * Time: O(n + m)
 * Space: O(m) for earn[], O(1) for DP
 */
function deleteAndEarn(nums: number[]): number {
  const maxVal = Math.max(...nums);
  const earn = new Array(maxVal + 1).fill(0);
  for (const n of nums) earn[n] += n;

  let prev2 = 0;
  let prev1 = earn[1] || 0;
  for (let v = 2; v <= maxVal; v++) {
    const curr = Math.max(prev1, prev2 + earn[v]);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

// === Test Cases ===
console.log(deleteAndEarn([3, 4, 2])); // 6
console.log(deleteAndEarn([2, 2, 3, 3, 3, 4])); // 9
console.log(deleteAndEarn([1])); // 1
console.log(deleteAndEarn([1, 1, 1, 2, 4])); // 7 (earn[1]=3, earn[2]=2, earn[3]=0, earn[4]=4 → dp: 0,3,3,3,7)
```

---

## 🔗 Related Problems

- [House Robber](https://leetcode.com/problems/house-robber) — cơ sở của bài này — không lấy liền kề
- [House Robber II](https://leetcode.com/problems/house-robber-ii) — circular house robber
- [Maximum Total Damage With Spell Casting](https://leetcode.com/problems/maximum-total-damage-with-spell-casting) — generalized variant
- [Paint House](https://leetcode.com/problems/paint-house) — linear DP với state
- [Coin Change II](https://leetcode.com/problems/coin-change-2) — knapsack variant

