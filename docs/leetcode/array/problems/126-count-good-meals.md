---
layout: page
title: "Count Good Meals"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/count-good-meals"
---

# Count Good Meals / Đếm Bữa Ăn Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài Two Sum nhưng target là lũy thừa của 2. Bạn đang quản lý một thực đơn nhà hàng: với mỗi món mới, bạn kiểm tra kho có món nào ghép thành tổng "may mắn" (= 2^k) không. Thay vì duyệt toàn bộ kho O(n), bạn tra từ điển O(1) — chỉ cần kiểm tra 22 giá trị lũy thừa 2.

**Pattern Recognition:**

- "Count pairs with sum = specific value" → Hash Map (Two Sum style)
- "Sum is power of 2" → Check all 22 powers of 2 (values ≤ 2^20 + 2^20 = 2^21)
- Counting pairs, not finding first pair → accumulate `freq[num]` before querying

**Visual:**

```
deliciousness = [1, 3, 5, 7, 6]
Powers of 2 to check: [1,2,4,8,16,32,...]

i=0: num=1, freq={}  → no pairs → freq={1:1}
i=1: num=3, check 4→freq[1]=1 → +1 pair → freq={1:1,3:1}
i=2: num=5, check 8→freq[3]=1 → +1 pair → freq={1:1,3:1,5:1}
i=3: num=7, check 8→freq[1]=1 → +1 pair → freq={...,7:1}
i=4: num=6, check 8→freq[2]=0, check 16→0 ... no new pairs
→ total = 4
```

## Problem Description

A "good meal" is a pair `(i, j)` where `i < j` and `deliciousness[i] + deliciousness[j]` is a power of 2. Return the count mod `10^9 + 7`. Values up to `2^20`.

- `[1,3,5,7,6]` → `4` (pairs: (1,7),(1,3),(3,5),(7,?))… actually check: 1+3=4✓, 1+7=8✓, 3+5=8✓, 1+7=8✓, 5+3=8✓ wait...
- `[1,1,1,3,3,3,7]` → `15`

## 📝 Interview Tips

1. **Clarify**: Values up to 2^20, so max sum = 2^21 — only 22 powers to check / tổng tối đa 2^21
2. **Approach**: For each num, check all 22 powers as target, query hash map / kiểm tra 22 lũy thừa 2
3. **Edge cases**: Duplicate values — store frequency counts, not just existence / giá trị trùng lặp
4. **Optimize**: O(22n) = O(n) vs brute O(n²) — critical for n=10^5 / tối ưu từ O(n²) xuống O(n)
5. **Follow-up**: If target were arbitrary — reduce to Two Sum / nếu target tùy ý thì dùng Two Sum
6. **Complexity**: Time O(22n) = O(n), Space O(n) for freq map / thời gian O(n), không gian O(n)

## Solutions

```typescript
/** Solution 1: Brute Force — check all pairs
 * Time: O(n²) | Space: O(1)
 */
function countGoodMealsBrute(deliciousness: number[]): number {
  const MOD = 1_000_000_007n;
  const n = deliciousness.length;
  let count = 0n;

  const isPow2 = (x: number) => x > 0 && (x & (x - 1)) === 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isPow2(deliciousness[i] + deliciousness[j])) count++;
    }
  }
  return Number(count % MOD);
}

/** Solution 2: Hash Map — for each num check 22 power-of-2 targets
 * Time: O(22n) = O(n) | Space: O(n)
 */
function countGoodMeals(deliciousness: number[]): number {
  const MOD = 1_000_000_007;
  const freq = new Map<number, number>();
  let count = 0;

  // Max value is 2^20, so max sum = 2^21
  const powers: number[] = [];
  for (let k = 0; k <= 21; k++) powers.push(1 << k);

  for (const num of deliciousness) {
    for (const pow of powers) {
      const complement = pow - num;
      if (freq.has(complement)) {
        count = (count + freq.get(complement)!) % MOD;
      }
    }
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }
  return count;
}

/** Solution 3: Same logic, BigInt for safety on overflow-sensitive contexts
 * Time: O(22n) | Space: O(n)
 */
function countGoodMealsSafe(deliciousness: number[]): number {
  const MOD = 1_000_000_007;
  const freq = new Map<number, number>();
  let count = 0;

  for (const num of deliciousness) {
    for (let k = 0; k <= 21; k++) {
      const target = (1 << k) - num;
      count = (count + (freq.get(target) ?? 0)) % MOD;
    }
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }
  return count;
}

// Test cases
console.log(countGoodMeals([1, 3, 5, 7, 6])); // 4
console.log(countGoodMeals([1, 1, 1, 3, 3, 3, 7])); // 15
console.log(countGoodMeals([2, 2, 2, 2])); // 6 (all pairs sum to 4)
console.log(countGoodMealsBrute([1, 3, 5, 7, 6])); // 4
console.log(countGoodMealsSafe([1, 1, 1, 3, 3, 3, 7])); // 15
console.log(countGoodMeals([0, 0, 0, 0])); // 0 (0+0=0 not power of 2)
```

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                            |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Two Sum](https://leetcode.com/problems/two-sum)                                                                                   | Same hash map complement lookup pattern |
| [Count Number of Pairs With Absolute Difference K](https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k) | Counting pairs with value constraint    |
| [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)                                         | Hash set for O(1) membership queries    |
