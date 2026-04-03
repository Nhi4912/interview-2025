---
layout: page
title: "Subsets II"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/subsets-ii"
---

# Subsets II / Tập Con Có Phần Tử Trùng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking + Dedup
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Subsets](https://leetcode.com/problems/subsets) | [Permutations II](https://leetcode.com/problems/permutations-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chọn đồ từ tủ — với những món giống nhau, ta không muốn chọn "chiếc áo đỏ đầu tiên" và "chiếc áo đỏ thứ hai" cho ra hai tập con khác nhau. Sort rồi skip nếu cùng giá trị với phần tử trước ở cùng level.

**Pattern Recognition:**

- Signal: "all unique subsets" + "duplicates in input" → **Sort + skip same-value sibling**
- Khác Permutations II: đây là combination (không quan tâm thứ tự), dùng `start` index
- Dedup rule: `i > start && nums[i] === nums[i-1]` → skip at current recursion level

**Visual — `nums=[1,2,2]` sort → `[1,2,2]`:**

```
start=0: []
  i=0 → [1], recurse(start=1)
    i=1 → [1,2], recurse(start=2)
      i=2 → [1,2,2], recurse(start=3) → add [1,2,2]
    i=2 → SKIP (2==2 and i>start=1)
  i=1 → [2], recurse(start=2)
    i=2 → [2,2], recurse(start=3) → add [2,2]
  i=2 → SKIP (2==2 and i>start=0)

Results: [], [1], [1,2], [1,2,2], [2], [2,2]  ✅
```

---

## Problem Description

Given an integer array `nums` that may contain duplicates, return all possible unique subsets (the power set). The solution set must not contain duplicate subsets; return in any order. ([LeetCode 90](https://leetcode.com/problems/subsets-ii))

**Example 1:** `nums = [1,2,2]` → `[[],[1],[1,2],[1,2,2],[2],[2,2]]`
**Example 2:** `nums = [0]` → `[[],[0]]`

**Constraints:** `1 ≤ nums.length ≤ 10`, `-10 ≤ nums[i] ≤ 10`

---

## 📝 Interview Tips

1. **Clarify**: "Subsets không quan tâm thứ tự — [1,2] và [2,1] là cùng một tập" / Subsets are order-independent
2. **Sort first**: "Sort để phần tử giống nhau liền kề — dễ detect và skip" / Sorting clusters duplicates
3. **Dedup rule**: "`i > start && nums[i] === nums[i-1]` — khác với Permutations II (`!used[i-1]`)" / i > start (not i > 0) because start resets per level
4. **vs Permutations II**: "Permutations dùng `used[]`, Subsets dùng `start` index — combinations không dùng lại element" / Key difference: combinations use start index
5. **Iterative approach**: "Build tập con dần, với mỗi số trùng chỉ nhân những subset vừa thêm vào vòng lặp trước" / Iterative: only multiply newly-added subsets for duplicate values
6. **Complexity**: "O(2ⁿ × n) — at most 2ⁿ subsets × O(n) copy each" / Exponential but bounded by 2^n

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Skip Duplicates Backtracking
 * Sort input. Use start index (not used array) — combinations don't reuse elements.
 * Skip if current element equals previous AND i > start (same sibling level).
 * Time: O(2ⁿ × n) — at most 2ⁿ subsets, O(n) copy each
 * Space: O(n) — recursion depth + current path
 */
function subsetsWithDup(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = (start: number) => {
    result.push([...path]); // add current subset (including empty set at start)

    for (let i = start; i < nums.length; i++) {
      // Skip duplicate at the same recursion level
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  };

  backtrack(0);
  return result;
}

/**
 * Solution 2: Iterative Build + Handle Duplicates
 * Start with [[]], then for each number extend existing subsets.
 * For duplicates: only extend subsets added in the PREVIOUS round
 * (not all subsets) to avoid generating duplicates.
 * Time: O(2ⁿ × n) — same asymptotic as backtracking
 * Space: O(2ⁿ × n) — store all subsets
 */
function subsetsWithDupIterative(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [[]];
  let prevStart = 0; // start of subsets added in last round

  for (let i = 0; i < nums.length; i++) {
    const start = i > 0 && nums[i] === nums[i - 1] ? prevStart : 0;
    const currentSize = result.length;
    // Extend each subset from `start` by appending current number
    for (let j = start; j < currentSize; j++) {
      result.push([...result[j], nums[i]]);
    }
    prevStart = currentSize; // mark where new subsets started this round
  }

  return result;
}

// === Test Cases ===
const r1 = subsetsWithDup([1, 2, 2]);
console.log(r1.map((s) => JSON.stringify(s)).sort());
// [],[1],[1,2],[1,2,2],[2],[2,2] → 6 subsets

const r2 = subsetsWithDup([1, 1, 2]);
console.log(r2.length); // 6

const r3 = subsetsWithDup([0]);
console.log(r3); // [[], [0]]

const r4 = subsetsWithDupIterative([1, 2, 2]);
console.log(r4.map((s) => JSON.stringify(s)).sort());
// same 6 subsets

console.log(subsetsWithDup([1, 1, 1]).length); // 4: [], [1], [1,1], [1,1,1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Pattern                   | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------- |
| [Subsets](https://leetcode.com/problems/subsets)                                                                       | Backtracking no dedup     | 🟡 Medium  |
| [Permutations II](https://leetcode.com/problems/permutations-ii)                                                       | Sort + dedup backtracking | 🟡 Medium  |
| [Combination Sum II](https://leetcode.com/problems/combination-sum-ii)                                                 | Same dedup + target       | 🟡 Medium  |
| [Count Number of Maximum Bitwise-OR Subsets](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets) | Subset enumeration        | 🟡 Medium  |
