---
layout: page
title: "Maximum Total Damage With Spell Casting"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Two Pointers, Binary Search, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-total-damage-with-spell-casting"
---

# Maximum Total Damage With Spell Casting / Tối Đa Tổng Sát Thương Khi Thi Triển Phép

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: House Robber / Skip-Adjacent DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Giống như một tay trống chọn bài để biểu diễn — nếu chọn bài có nhịp `x`, bạn không thể chọn bài `x-1` hoặc `x+1` vì chúng sẽ "lấn át" nhau trong buổi diễn.

**Pattern Recognition:**

- Sorted values + "cannot pick adjacent values" → House Robber variant
- Duplicates allowed → group by value, multiply count × damage
- Skip `val-1` and `val+1` neighbours → binary search / two-pointer to find safe jump

**Visual (power = [1,1,3,4]):**

```
Sort & group: {1:2, 3:1, 4:1}  →  vals=[1,3,4]
dp[i] = max damage using spells[0..i]

i=0 val=1 dmg=2: dp[0]=2
i=1 val=3 dmg=3: 3 not adjacent to 1 → dp[1]=max(dp[0],dp[0]+3)=5
i=2 val=4 dmg=4: 4 adjacent to 3 → best prev safe is i=0
           dp[2]=max(dp[1], dp[0]+4)=max(5,6)=6
Answer: 6
```

## Problem Description

Given an integer array `power`, each spell deals `power[i]` damage. When you cast a spell with damage `x`, you cannot cast any spell dealing `x-1` or `x+1` damage. Return the **maximum total damage** you can deal.

**Example 1:** `power = [1,1,3,4]` → `6` (cast both 1s for 2 + cast 4 for 4)
**Example 2:** `power = [1,2,3,4]` → `6` (cast 1+3=4 or 2+4=6; pick 6)

**Constraints:** `1 <= power.length <= 10^5`, `1 <= power[i] <= 10^9`

## 📝 Interview Tips

1. **Clarify**: Can power values repeat? Yes — all copies with same value can be cast together.
2. **Approach**: Sort → group by value → House Robber on groups; skip values ±1.
3. **Edge cases**: All same value → take all; strictly increasing consecutive → alternating max.
4. **Optimize**: Binary search for last safe index instead of scanning backwards → O(n log n).
5. **Follow-up**: What if you can't cast spells within ±k? Same pattern, wider skip window.
6. **Complexity**: O(n log n) time, O(n) space.

## Solutions

```typescript
// Solution 1: Sort + Group + Binary Search DP — Time: O(n log n) | Space: O(n)
function maximumTotalDamage(power: number[]): number {
  power.sort((a, b) => a - b);

  // Group: vals[i] = unique value, dmg[i] = total damage from that value
  const vals: number[] = [];
  const dmg: number[] = [];
  for (let i = 0; i < power.length; ) {
    let j = i;
    while (j < power.length && power[j] === power[i]) j++;
    vals.push(power[i]);
    dmg.push(power[i] * (j - i));
    i = j;
  }

  const n = vals.length;
  const dp = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    // Binary search: find last index j where vals[j] < vals[i] - 1
    let lo = 0,
      hi = i - 1,
      prev = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (vals[mid] < vals[i] - 1) {
        prev = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    const best = prev >= 0 ? dp[prev] : 0;
    dp[i] = Math.max(i > 0 ? dp[i - 1] : 0, best + dmg[i]);
  }

  return dp[n - 1];
}

// Solution 2: Hash Map + Sort (cleaner grouping) — Time: O(n log n) | Space: O(n)
function maximumTotalDamage2(power: number[]): number {
  const freq = new Map<number, number>();
  for (const p of power) freq.set(p, (freq.get(p) ?? 0) + p);

  const keys = [...freq.keys()].sort((a, b) => a - b);
  const n = keys.length;
  if (n === 0) return 0;

  const dp = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    // skip: cannot use keys[i-1] if it equals keys[i]-1
    let j = i - 1;
    while (j >= 0 && keys[j] >= keys[i] - 1) j--;
    const prev = j >= 0 ? dp[j + 1] : 0;
    dp[i + 1] = Math.max(dp[i], prev + freq.get(keys[i])!);
  }

  return dp[n];
}

// Tests
console.log(maximumTotalDamage([1, 1, 3, 4])); // 6
console.log(maximumTotalDamage([1, 2, 3, 4])); // 6
console.log(maximumTotalDamage([7, 1, 6, 6])); // 13
console.log(maximumTotalDamage([1])); // 1
console.log(maximumTotalDamage([2, 2, 2])); // 6
```

## 🔗 Related Problems

| Problem                                                                             | Relationship                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| [House Robber](https://leetcode.com/problems/house-robber/)                         | Same skip-adjacent DP structure                   |
| [Delete and Earn](https://leetcode.com/problems/delete-and-earn/)                   | Direct analogue — group by value, skip neighbours |
| [Maximum Sum of Non-Adjacent Elements](https://leetcode.com/problems/house-robber/) | Core DP pattern                                   |
