---
layout: page
title: "Minimum Total Cost to Make Arrays Unequal"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Greedy, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-total-cost-to-make-arrays-unequal"
---

# Minimum Total Cost to Make Arrays Unequal / Chi Phí Tối Thiểu Để Làm Mảng Không Bằng Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + Majority Element
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn phải sắp xếp lại ghế ngồi sao cho không ai ngồi đúng ghế số của mình. Những ghế "xung đột" (nums1[i] == nums2[i]) phải được đổi. Nếu một giá trị xuất hiện quá nhiều (nhiều hơn nửa tổng số ghế cần đổi), bạn cần "mời thêm" các ghế khác vào để có đủ ghế pha trộn — đây là bài toán majority element ẩn.

**Pattern Recognition:**

- Vị trí `i` "xung đột" khi `nums1[i] == nums2[i]` — bắt buộc swap
- Sau khi gom tất cả vị trí xung đột, kiểm tra có giá trị nào chiếm majority không
- Nếu `count[dominant] > total/2` → cần thêm vị trí khác để "loãng" dominant

**Visual:**

```
nums1=[2,2,2,1,3], nums2=[1,2,2,3,3]

Conflicting positions (nums1[i]==nums2[i]): i=1(val=2), i=2(val=2)
totalSwap=2, count={2:2}
dominant=2, count[2]=2 > totalSwap/2=1 → need more positions!

Add i=0: totalSwap=3, count={2:2,1:1} (add nums1[0]=2 and nums2[0]=1? No:
  We add both nums1[i] and nums2[i] to avoid using them as "swapping targets")
  Actually add nums1[3]=1: totalSwap=4, count={2:2,1:1,3:1}?
  Wait: add swaps greedily until dominant ≤ total/2.

Correct: at i=3, add cost 3+1=4, accumulate count[nums1[3]]=1, count[nums2[3]]=...
→ see solution below for exact logic
```

## Problem Description

Given two 0-indexed integer arrays `nums1` and `nums2` of equal length `n`. In one operation, swap `nums1[i]` with `nums1[j]` at cost `i + j`. Return the minimum total cost to make `nums1[i] != nums2[i]` for all `0 <= i < n`.

**Example 1:** `nums1=[1,2,3,4,5], nums2=[1,2,3,4,5]` → `10` (swap positions 0↔4, 1↔3, cost=0+4+1+3=8... actually minimal pairing)

**Example 2:** `nums1=[2,2,2,1,3], nums2=[1,2,2,3,3]` → `10`

**Constraints:** `n == nums1.length == nums2.length`, `1 <= n <= 10^5`, `1 <= nums1[i], nums2[i] <= n`.

## 📝 Interview Tips

1. **Clarify**: "Swap nums1[i] với nums1[j]" chứ không phải swap giữa 2 mảng — only swap within nums1.
2. **Approach**: Positions where `nums1[i]==nums2[i]` MUST be included; then check for majority dominance.
3. **Edge cases**: No conflicts → return 0; all same value → need many extra swaps.
4. **Optimize**: Think majority element — if one value > half the swap pool, we need more positions.
5. **Test**: All elements equal `[1,1,1], [1,1,1]` → cost = 0+1+2+1+0+2 = needs careful calculation.
6. **Follow-up**: If we can also use nums2 values as swap targets, how does it change?

## Solutions

```typescript
/** Solution 1: Greedy + Majority Count — mandatory swaps + dominance check
 * Time: O(n) | Space: O(n)
 */
function minimumTotalCost(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  let totalCost = 0;
  let totalSwaps = 0;
  const freq = new Map<number, number>();
  let dominantVal = -1;
  let dominantCount = 0;

  // Phase 1: collect mandatory conflict positions
  for (let i = 0; i < n; i++) {
    if (nums1[i] === nums2[i]) {
      totalCost += i;
      totalSwaps++;
      const v = nums1[i];
      freq.set(v, (freq.get(v) ?? 0) + 1);
      if ((freq.get(v) ?? 0) > dominantCount) {
        dominantCount = freq.get(v)!;
        dominantVal = v;
      }
    }
  }

  // Phase 2: if dominant value > half, add more positions to "dilute" it
  for (let i = 0; i < n; i++) {
    if (dominantCount <= Math.floor(totalSwaps / 2)) break;
    // Skip already-included conflict positions
    if (nums1[i] === nums2[i]) continue;
    // Only add positions that don't introduce dominant value again
    if (nums1[i] !== dominantVal && nums2[i] !== dominantVal) {
      totalCost += i;
      totalSwaps++;
      // Update frequencies
      const v1 = nums1[i];
      freq.set(v1, (freq.get(v1) ?? 0) + 1);
      if ((freq.get(v1) ?? 0) > dominantCount) {
        dominantCount = freq.get(v1)!;
        dominantVal = v1;
      }
    }
  }

  return dominantCount > Math.floor(totalSwaps / 2) ? -1 : totalCost;
}

/** Solution 2: Same logic, cleaner structure
 * Time: O(n) | Space: O(n)
 */
function minimumTotalCost2(nums1: number[], nums2: number[]): number {
  const count = new Map<number, number>();
  let cost = 0,
    swaps = 0,
    maxFreq = 0,
    dominant = -1;

  for (let i = 0; i < nums1.length; i++) {
    // Must include this index if values collide
    if (nums1[i] === nums2[i]) {
      cost += i;
      swaps++;
      count.set(nums1[i], (count.get(nums1[i]) ?? 0) + 1);
    }
    // Even if no collision, include to dilute dominant if needed
    else if (maxFreq * 2 > swaps) {
      // Check if adding this helps (doesn't contain dominant)
      if (nums1[i] !== dominant && nums2[i] !== dominant) {
        cost += i;
        swaps++;
        count.set(nums1[i], (count.get(nums1[i]) ?? 0) + 1);
        count.set(nums2[i], (count.get(nums2[i]) ?? 0) + 1);
      }
    }
    // Update dominant
    for (const [k, v] of count) {
      if (v > maxFreq) {
        maxFreq = v;
        dominant = k;
      }
    }
  }

  return maxFreq * 2 > swaps ? -1 : cost;
}

// Test cases
console.log(minimumTotalCost([2, 2, 2, 1, 3], [1, 2, 2, 3, 3])); // 10
console.log(minimumTotalCost([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])); // 10
console.log(minimumTotalCost([1], [2])); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                          | Relationship                                              |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                                                   | Majority element limits minimum operations needed         |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                                             | Can't place same char adjacent — same majority constraint |
| [Minimum Cost to Move Chips to The Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position) | Greedy on positional costs                                |
