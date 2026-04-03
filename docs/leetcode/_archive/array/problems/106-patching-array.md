---
layout: page
title: "Patching Array"
difficulty: Hard
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/patching-array"
---

# Patching Array / Vá Mảng Số

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy (Reach Extension)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Bạn đang xây cầu qua sông bằng cách đặt các viên đá. Mỗi viên đá có thể đi thêm được `stone_value` mét. Nếu bạn có thể đến `reach` mét, và viên đá tiếp theo ≤ `reach+1`, thì bạn đặt nó và mở rộng reach. Nếu không, bạn phải "vá" thêm một viên đá mới ngay tại `reach+1` — nhân đôi reach. Greedy nhất: luôn đặt viên đá to nhất có thể.

**Pattern Recognition:**

- Duy trì `reach`: mọi số từ `[1, reach]` đều có thể tạo thành tổng con
- Nếu `nums[i] <= reach + 1` → dùng được, `reach += nums[i]`
- Nếu `nums[i] > reach + 1` → phải patch `reach+1`, `reach = 2*reach + 1`, `patches++`

**Visual:**

```
nums=[1,3], n=6

reach=0, i=0, patches=0
nums[0]=1 ≤ reach+1=1 → reach=0+1=1, i=1
nums[1]=3 ≤ reach+1=2? No (3>2) → patch! reach=1+1+1=3? No:
  patch value = reach+1 = 2, reach = reach + (reach+1) = 1+2 = 3, patches=1
nums[1]=3 ≤ reach+1=4 → reach=3+3=6, i=2
reach=6 ≥ n=6 ✅
→ patches = 1
```

## Problem Description

Given a sorted integer array `nums` and an integer `n`, add/patch elements to the array such that any number in `[1, n]` can be formed by the sum of some elements in the array. Return the minimum number of patches required.

**Example 1:** `nums=[1,3], n=6` → `1` (add 2: sums cover [1,6])

**Example 2:** `nums=[1,5,10], n=20` → `2` (add 2 and 4)

**Constraints:** `1 <= nums.length <= 1000`, `1 <= nums[i] <= 10^4`, `nums` is sorted ascending, `1 <= n <= 2^31 - 1`.

## 📝 Interview Tips

1. **Clarify**: "Sum of some elements" — elements can be chosen (not all must be used); no duplicates needed.
2. **Approach**: Key insight: if we can form [1..reach], and nums[i] ≤ reach+1, we can form [1..reach+nums[i]].
3. **Edge cases**: Empty nums → patch log2(n)+1 times; n=1 → check if 1 is in nums.
4. **Optimize**: This is already O(m + log n) where m=nums.length — optimal greedy.
5. **Test**: `nums=[], n=7` → 3 patches (add 1→reach=1, add 2→reach=3, add 4→reach=7).
6. **Follow-up**: What's the maximum reach after k patches from empty? `2^k - 1`.

## Solutions

```typescript
/** Solution 1: Greedy Reach Extension — the canonical O(m + log n) approach
 * Time: O(m + log n) | Space: O(1)
 */
function minPatches(nums: number[], n: number): number {
  let patches = 0;
  let reach = 0; // can form all numbers in [1, reach]
  let i = 0;

  while (reach < n) {
    if (i < nums.length && nums[i] <= reach + 1) {
      // Use nums[i] to extend reach
      reach += nums[i];
      i++;
    } else {
      // Patch: add (reach + 1) to extend reach maximally
      reach += reach + 1; // same as reach = 2*reach + 1
      patches++;
    }
  }
  return patches;
}

/** Solution 2: Same with BigInt for very large n — handles n=2^31-1 safely
 * Time: O(m + log n) | Space: O(1)
 */
function minPatches2(nums: number[], n: number): number {
  let patches = 0;
  let reach = 0n;
  const target = BigInt(n);
  let i = 0;

  while (reach < target) {
    const next = i < nums.length ? BigInt(nums[i]) : target + 1n;
    if (next <= reach + 1n) {
      reach += next;
      i++;
    } else {
      reach = reach * 2n + 1n;
      patches++;
    }
  }
  return patches;
}

/** Solution 3: Annotated version — best for explaining in interview
 * Time: O(m + log n) | Space: O(1)
 */
function minPatches3(nums: number[], n: number): number {
  let patches = 0;
  let miss = 1; // smallest number we can NOT yet form; need to form [1..miss-1]
  let i = 0;

  while (miss <= n) {
    if (i < nums.length && nums[i] <= miss) {
      // nums[i] ≤ miss: use it to extend coverage
      // if we could form [1..miss-1], now we can form [1..miss-1+nums[i]]
      miss += nums[i++];
    } else {
      // Gap! Patch with value=miss (greedy: use miss itself to double coverage)
      miss += miss; // miss = 2 * miss
      patches++;
    }
  }
  return patches;
}

// Test cases
console.log(minPatches([1, 3], 6)); // 1
console.log(minPatches([1, 5, 10], 20)); // 2
console.log(minPatches([1, 2, 2], 5)); // 0
console.log(minPatches([], 7)); // 3
console.log(minPatches3([1, 3], 6)); // 1
console.log(minPatches2([1, 5, 10], 20)); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                                         | Greedy reach-extension to cover all positions |
| [Maximum Width Ramp](https://leetcode.com/problems/maximum-width-ramp)                                                             | Greedy with reach/boundary tracking           |
| [Minimum Number of Taps to Open to Water a Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden) | Interval coverage with greedy reach extension |
