---
layout: page
title: "Count Almost Equal Pairs I"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting, Enumeration]
leetcode_url: "https://leetcode.com/problems/count-almost-equal-pairs-i"
---

# Count Almost Equal Pairs I / Đếm Các Cặp Gần Bằng Nhau I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhận ra hai số "gần như giống nhau" — hai số là "almost equal" nếu chúng bằng nhau, hoặc bằng nhau sau khi hoán đổi đúng một cặp chữ số. Đếm từng chữ số rồi generate tất cả biến thể hoán đổi.

**Pattern Recognition:**

- Signal: "equal after at most one swap of digits" → enumerate all swap variants for each number, use hash count
- Key insight: mỗi số có tối đa O(d²) biến thể (d = số chữ số ≤ 7), kiểm tra trong hash map

**Visual — Count Almost Equal Pairs I:**

```
nums = [3, 12, 30, 17, 21]

For 12: swaps → {21}     (swap idx 0,1)
For 30: swaps → {30,03=3}(swap idx 0,1: 03=3)
For 17: swaps → {71}
For 21: swaps → {12}

Pairs:
  (1,4): nums[1]=12, nums[4]=21 → 12 almost equal 21? swap digits of 12 → 21 ✓

Answer = 2  (also (0,2): 3 and 30 → swap digits of 30 → 03=3 ✓)
```

---

## Problem Description

You are given a **0-indexed** integer array `nums`. A pair `(i, j)` with `i < j` is **almost equal** if `nums[i] == nums[j]`, OR if `nums[i]` can be made equal to `nums[j]` by swapping **exactly one pair** of digits in `nums[i]`. Return the count of almost equal pairs.

Difficulty: Medium | Acceptance: 37.5%

```
Example 1:
  Input:  nums = [3, 12, 30, 17, 21]
  Output: 2

Example 2:
  Input:  nums = [1, 1, 1, 1, 1]
  Output: 10

Example 3:
  Input:  nums = [123, 231]
  Output: 0
```

Constraints:

- `2 <= nums.length <= 100`
- `1 <= nums[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "'Exactly one swap' có bao gồm swap cùng vị trí (i=j, effectively no change)?" / Clarify: swapping same digit at two positions with same value still counts as "one swap" keeping number identical.
2. **Enumerate variants**: "Mỗi số có tối đa 7 chữ số → C(7,2)=21 biến thể hoán đổi + số gốc" / Each number has at most 21 swap variants (C(7,2)) plus itself.
3. **n<=100**: "n nhỏ — brute force O(n² × d²) chạy được" / n≤100: O(n²×d²) brute force is fine.
4. **Leading zeros**: "Khi hoán đổi, chữ số dẫn đầu 0 → số nhỏ hơn (e.g., 30→03=3); cần normalize" / Swapping may create leading zeros → parseInt handles this.
5. **Edge cases**: "Tất cả phần tử giống nhau: C(n,2) cặp; n=2 → 0 hoặc 1" / All same: C(n,2) pairs.
6. **Follow-up**: "Nếu n=10^5? Cần hash map của variants O(n×d²) tổng cộng" / Larger n: hash map approach O(n·d²).

---

## Solutions

```typescript
/**
 * Generate all numbers reachable by swapping exactly one pair of digits
 * Includes the number itself (swap same digit = no change, still valid)
 */
function getSwapVariants(num: number): Set<number> {
  const digits = num.toString().split("");
  const variants = new Set<number>();
  variants.add(num); // equal (no swap needed)
  const d = digits.length;
  for (let i = 0; i < d; i++) {
    for (let j = i + 1; j < d; j++) {
      // swap i and j
      [digits[i], digits[j]] = [digits[j], digits[i]];
      variants.add(parseInt(digits.join(""), 10));
      // swap back
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
  }
  return variants;
}

/**
 * Solution 1: Brute Force O(n² × d²)
 * Time: O(n² × d²) — for each pair check all swap variants
 * Space: O(d²) — variants set per number
 */
function countAlmostEqualPairsBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if nums[j] is reachable from nums[i] with at most one swap
      const variants = getSwapVariants(nums[i]);
      if (variants.has(nums[j])) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Hash Map of Variants (optimized for larger n)
 * Time: O(n × d²) — for each number, add all variants to map
 * Space: O(n × d²) — hash map
 *
 * For each number, count how many PREVIOUS numbers have this number as a variant.
 */
function countAlmostEqualPairs(nums: number[]): number {
  // seen[x] = how many previous numbers have x as a swap-variant
  const seen = new Map<number, number>();
  let count = 0;

  for (const num of nums) {
    // Count pairs: this num matches any previous variant
    count += seen.get(num) ?? 0;

    // Add all variants of this num to the map for future numbers
    const variants = getSwapVariants(num);
    for (const v of variants) {
      seen.set(v, (seen.get(v) ?? 0) + 1);
    }
  }
  return count;
}

// === Test Cases ===
console.log(countAlmostEqualPairs([3, 12, 30, 17, 21])); // 2
console.log(countAlmostEqualPairs([1, 1, 1, 1, 1])); // 10
console.log(countAlmostEqualPairs([123, 231])); // 0
console.log(countAlmostEqualPairsBrute([3, 12, 30, 17, 21])); // 2
console.log(countAlmostEqualPairsBrute([1, 1, 1, 1, 1])); // 10
```

---

## 🔗 Related Problems

- [Count Pairs Whose Sum is Less than Target](https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target) — count pairs with condition
- [Majority Element](https://leetcode.com/problems/majority-element) — counting with hash map
- [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) — digit/char rearrangement
- [Majority Element II](https://leetcode.com/problems/majority-element-ii) — frequency counting
- [Count Almost Equal Pairs I — LeetCode](https://leetcode.com/problems/count-almost-equal-pairs-i) — problem page
