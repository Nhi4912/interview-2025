---
layout: page
title: "Count Number of Maximum Bitwise-OR Subsets"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking, Bit Manipulation, Enumeration]
leetcode_url: "https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets"
---

# Count Number of Maximum Bitwise-OR Subsets / Đếm Số Tập Con Đạt OR Tối Đa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Enumeration / Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 company
> **See also**: [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | [Subsets](https://leetcode.com/problems/subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** OR chỉ có thể tăng hoặc giữ nguyên — OR của toàn bộ array là giá trị tối đa. Cần đếm bao nhiêu subset khi OR thêm các phần tử vào đạt được giá trị đó.

**Pattern Recognition:**

- Signal: "count subsets satisfying bit condition" → **Bit Enumeration**
- Max OR = OR của toàn array (thêm phần tử không giảm OR)
- Key insight: enumerate tất cả 2^n subsets, đếm subset có OR == maxOR

**Visual — Subset enumeration for [3,1]:**

```
maxOR = 3 | 1 = 3 (binary: 11)

Subsets:
{}     → OR = 0  ✗
{3}    → OR = 3  ✓
{1}    → OR = 1  ✗
{3,1}  → OR = 3  ✓

Count = 2
Note: empty set always excluded (OR of empty = 0)
```

---

## Problem Description

Given integer array `nums`, find the maximum possible **bitwise OR** of any non-empty subset, then return the number of non-empty subsets that achieve this maximum. ([LeetCode 2044](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets))

**Example 1:** `nums = [3,1]` → `2` (subsets `{3}` and `{3,1}` both give OR=3)
**Example 2:** `nums = [2,2,2]` → `7` (any non-empty subset gives OR=2, 2^3-1=7 subsets)

Constraints: `1 <= nums.length <= 16`, `1 <= nums[i] <= 1e5`

---

## 📝 Interview Tips

1. **Clarify**: "Empty subset tính không?" / Empty subset excluded — non-empty subsets only
2. **Max OR insight**: "OR của tất cả phần tử = max có thể, thêm phần tử không giảm OR" / OR is monotone
3. **Enumerate approach**: "n ≤ 16 → 2^16 = 65536, brute force OK" / Small n allows full enumeration
4. **Backtracking alt**: "include/exclude từng phần tử" / DFS include/exclude is equivalent
5. **Edge cases**: "Tất cả bằng nhau → count = 2^n - 1" / All equal → all non-empty subsets valid

---

## Solutions

```typescript
/**
 * Solution 1: Bitmask enumeration (all 2^n subsets)
 * Time: O(2^n * n) — iterate all subsets, compute OR
 * Space: O(1) — no extra space
 */
function countMaxOrSubsets(nums: number[]): number {
  const n = nums.length;
  const maxOr = nums.reduce((acc, x) => acc | x, 0);
  let count = 0;

  for (let mask = 1; mask < 1 << n; mask++) {
    // start at 1 (skip empty)
    let orVal = 0;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) orVal |= nums[i];
    }
    if (orVal === maxOr) count++;
  }

  return count;
}

/**
 * Solution 2: Backtracking (include/exclude)
 * Time: O(2^n) — each element either included or not
 * Space: O(n) — recursion depth
 */
function countMaxOrSubsetsBacktrack(nums: number[]): number {
  const maxOr = nums.reduce((acc, x) => acc | x, 0);
  let count = 0;

  function dfs(idx: number, currentOr: number): void {
    if (idx === nums.length) {
      if (currentOr === maxOr) count++;
      return;
    }
    dfs(idx + 1, currentOr | nums[idx]); // include
    dfs(idx + 1, currentOr); // exclude
  }

  dfs(0, 0);
  return count - (0 === maxOr ? 1 : 0); // subtract empty set if maxOr==0 (impossible per constraints)
}

/**
 * Solution 3: Optimized observation — once currentOr === maxOr, all 2^remaining subsets qualify
 * Time: O(2^n) — same but with early branch counting
 * Space: O(n) — recursion depth
 */
function countMaxOrSubsetsOpt(nums: number[]): number {
  const n = nums.length;
  const maxOr = nums.reduce((acc, x) => acc | x, 0);
  let count = 0;

  function dfs(idx: number, currentOr: number): void {
    if (currentOr === maxOr) {
      // All 2^(n-idx) subsets of remaining elements qualify
      count += 1 << (n - idx);
      return;
    }
    if (idx === n) return;
    dfs(idx + 1, currentOr | nums[idx]);
    dfs(idx + 1, currentOr);
  }

  dfs(0, 0);
  return count; // empty set contributes 0 since OR=0 != maxOr (all nums >= 1)
}

// === Test Cases ===
console.log(countMaxOrSubsets([3, 1])); // 2
console.log(countMaxOrSubsets([2, 2, 2])); // 7
console.log(countMaxOrSubsets([3, 2, 1, 5])); // 6
console.log(countMaxOrSubsetsOpt([3, 1])); // 2
console.log(countMaxOrSubsetsOpt([2, 2, 2])); // 7
```

---

## 🔗 Related Problems

- [Subsets](https://leetcode.com/problems/subsets) — enumerate all subsets (foundation)
- [Maximum XOR of Two Numbers](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) — bit manipulation on subsets
- [Maximum Good People Based on Statements](https://leetcode.com/problems/maximum-good-people-based-on-statements) — bitmask enumeration
- [Maximum Points in an Archery Competition](https://leetcode.com/problems/maximum-points-in-an-archery-competition) — bitmask + backtracking
- [Count Maximum Bitwise-OR Subsets — LeetCode](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets) — problem page
