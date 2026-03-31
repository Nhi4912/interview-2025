---
layout: page
title: "Destroy Sequential Targets"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/destroy-sequential-targets"
---

# Destroy Sequential Targets / Phá Hủy Các Mục Tiêu Tuần Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map (Grouping by Remainder)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhóm học sinh cùng lớp — hai học sinh thuộc cùng nhóm nếu hiệu của họ chia hết cho `space`. Dùng `nums[i] % space` làm "mã lớp". Tìm lớp đông nhất, rồi lấy học sinh nhỏ nhất làm đại diện.

**Pattern Recognition:**

- `nums[i]` can destroy `nums[i] + k*space` for k = 0,1,2,...
- Two indices i,j belong to the same group iff `nums[i] % space == nums[j] % space`
- Group by remainder → count each group → pick largest group → return min element in it

**Visual — Grouping by remainder:**

```
nums = [3,7,8,1,1,5], space = 2

Remainders:
  3%2=1, 7%2=1, 8%2=0, 1%2=1, 1%2=1, 5%2=1

Group 1 (rem=1): [3,7,1,1,5] → count=5, min=1
Group 0 (rem=0): [8]         → count=1, min=8

Largest group: rem=1, count=5
Min in group:  1

Answer = 1 ✅  (with seed=1: destroys 1,3,5,7,...)
```

---

## Problem Description

Each `nums[i]` can destroy targets `nums[i], nums[i]+space, nums[i]+2*space, ...`. Find the **minimum** value in `nums` that can destroy the **most** targets (targets must exist in `nums`). ([LeetCode 2453](https://leetcode.com/problems/destroy-sequential-targets))

Difficulty: Medium | Acceptance: 40.6%

```
Example 1: nums=[3,7,8,1,1,5], space=2 → 1
  Seed 1 destroys: 1,3,5,7 (4 targets, but 1 appears twice → 5 in total)
  Seed 8 destroys: 8 (1 target)
  Best seed with min value: 1

Example 2: nums=[1,3,5,2,4,6], space=2 → 1
  rem=1: {1,3,5} count=3; rem=0: {2,4,6} count=3 → tie → min seed wins (1 < 2)
```

Constraints:

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `1 <= space <= 10^9`

---

## 📝 Interview Tips

1. **Key insight**: "`nums[i] % space` đồng nhất xác định nhóm" / Same remainder means same "chain" — this is the grouping key
2. **Count occurrences**: "Đếm số lần xuất hiện của mỗi remainder" / Count how many nums have each remainder value
3. **Tie-breaking**: "Nếu nhiều nhóm cùng count, chọn giá trị nums[i] nhỏ nhất" / Among tied groups, return the smallest nums[i] value seen
4. **Edge case**: "Khi space=1, mọi số cùng nhóm (rem=0) → answer = min(nums)" / space=1 groups everything → answer is min
5. **Don't sort**: "Không cần sort, chỉ cần track (count, minVal) cho mỗi group" / No sort needed; track count and min per group
6. **Follow-up**: "Nếu space thay đổi động? → mỗi query rebuild map O(n)" / Dynamic space changes → rebuild map each query

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — for each seed, count destroyable targets
 * Time: O(n²) — for each element, scan all others
 * Space: O(1)
 */
function destroySequentialTargetsBrute(nums: number[], space: number): number {
  let bestCount = 0;
  let ans = nums[0];

  for (const seed of nums) {
    const seedSet = new Set(nums);
    let count = 0;
    let target = seed;
    // Count how many elements in nums equal seed + k*space for some k >= 0
    for (const n of nums) {
      if (n >= seed && (n - seed) % space === 0) count++;
    }
    if (count > bestCount || (count === bestCount && seed < ans)) {
      bestCount = count;
      ans = seed;
    }
  }
  return ans;
}

/**
 * Solution 2: Hash Map — group by remainder (optimal)
 * Time: O(n) — two passes: count + find best
 * Space: O(n) — hash map for remainder → count
 */
function destroySequentialTargets(nums: number[], space: number): number {
  // Map: remainder → { count, minVal }
  const groupInfo = new Map<number, { count: number; minVal: number }>();

  for (const num of nums) {
    const rem = num % space;
    if (!groupInfo.has(rem)) {
      groupInfo.set(rem, { count: 0, minVal: num });
    }
    const info = groupInfo.get(rem)!;
    info.count++;
    if (num < info.minVal) info.minVal = num;
  }

  let bestCount = 0;
  let ans = Infinity;

  for (const { count, minVal } of groupInfo.values()) {
    if (count > bestCount || (count === bestCount && minVal < ans)) {
      bestCount = count;
      ans = minVal;
    }
  }

  return ans;
}

// === Test Cases ===
console.log(destroySequentialTargets([3, 7, 8, 1, 1, 5], 2)); // 1
console.log(destroySequentialTargets([1, 3, 5, 2, 4, 6], 2)); // 1
console.log(destroySequentialTargets([6, 2, 5], 100)); // 2 (all separate groups, min wins)
console.log(destroySequentialTargets([1], 1)); // 1
```

---

## 🔗 Related Problems

- [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60) — grouping by remainder
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — frequency counting + greedy
- [Majority Element](https://leetcode.com/problems/majority-element) — find most frequent element
- [Destroy Sequential Targets — LeetCode](https://leetcode.com/problems/destroy-sequential-targets) — problem page
