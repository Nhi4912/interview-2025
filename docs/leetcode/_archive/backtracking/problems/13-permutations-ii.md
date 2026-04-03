---
layout: page
title: "Permutations II"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking, Sorting]
leetcode_url: "https://leetcode.com/problems/permutations-ii"
---

# Permutations II / Hoán Vị Có Phần Tử Trùng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking + Dedup
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Permutations](https://leetcode.com/problems/permutations) | [Subsets II](https://leetcode.com/problems/subsets-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Với phần tử trùng: bỏ qua nếu cùng giá trị đã được thử ở vị trí này trong lần đệ quy hiện tại.

**Pattern Recognition:**

- Signal: "all unique permutations" + "duplicates in input" → **Sort + skip same-value at same position**
- Sort trước → các phần tử giống nhau liền kề → dễ detect và skip
- Rule: `nums[i] === nums[i-1] && !used[i-1]` → skip (tránh hoán vị trùng)

**Visual — `nums=[1,1,2]` sort → `[1,1,2]`:**

```
Position 0:
  try 1 (i=0) → recurse → [1,1,2], [1,2,1]
  try 1 (i=1) → SKIP (same as i=0, and used[0]=false) ← dedup!
  try 2 (i=2) → recurse → [2,1,1]

Result: [[1,1,2],[1,2,1],[2,1,1]]  ✅ (3 unique, not 6)
```

---

## Problem Description

Given a collection of numbers `nums` that might contain duplicates, return all possible unique permutations in any order. ([LeetCode 47](https://leetcode.com/problems/permutations-ii))

**Example 1:** `nums = [1,1,2]` → `[[1,1,2],[1,2,1],[2,1,1]]`
**Example 2:** `nums = [1,2,3]` → all 6 permutations (no duplicates)

**Constraints:** `1 ≤ nums.length ≤ 8`, `-10 ≤ nums[i] ≤ 10`

---

## 📝 Interview Tips

1. **Clarify**: "Có phần tử trùng trong input không?" / Confirm duplicates exist in input
2. **Sort first**: "Sort để phần tử giống nhau liền kề — dễ skip" / Sorting clusters duplicates for easy detection
3. **Dedup rule**: "`nums[i] === nums[i-1] && !used[i-1]` → skip — tránh cùng giá trị ở cùng slot" / Skip when same value at same position was already tried
4. **Alternative**: "Dùng Map đếm tần suất — không cần sort, không cần `used` array" / Counter map avoids sorting and used array
5. **Edge cases**: "Tất cả giống nhau `[1,1,1]` → chỉ 1 kết quả; n=1 → 1 kết quả" / All same → 1 result; n=1 → 1 result
6. **Complexity**: "O(n! × n) total — n! permutations × O(n) to copy each" / Total work proportional to number of unique permutations

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Skip Duplicates Backtracking
 * Sort input. Use `used[]` to track which elements are in current permutation.
 * Skip if same value was tried at this recursion level (but not currently used).
 * Time: O(n! × n) — at most n! unique perms, O(n) copy each
 * Space: O(n) — recursion depth + used array + current path
 */
function permuteUnique(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const used = new Array(nums.length).fill(false);
  const path: number[] = [];

  const backtrack = () => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // Skip duplicate: same value as previous, and previous was NOT used
      // (meaning previous was already tried and backtracked at this level)
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  };

  backtrack();
  return result;
}

/**
 * Solution 2: Counter Map Backtracking (no sort needed)
 * Count frequency of each number. At each position, try each unique value
 * with remaining count > 0. Naturally avoids duplicates by working on counts.
 * Time: O(n! × n) — same asymptotic, but constant factor smaller in practice
 * Space: O(k) counter map where k = unique values, O(n) recursion
 */
function permuteUniqueMap(nums: number[]): number[][] {
  const count = new Map<number, number>();
  for (const n of nums) count.set(n, (count.get(n) ?? 0) + 1);
  const keys = [...count.keys()];
  const result: number[][] = [];
  const path: number[] = [];

  const backtrack = () => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (const k of keys) {
      const c = count.get(k)!;
      if (c === 0) continue;
      count.set(k, c - 1);
      path.push(k);
      backtrack();
      path.pop();
      count.set(k, c);
    }
  };

  backtrack();
  return result;
}

// === Test Cases ===
console.log(permuteUnique([1, 1, 2]));
// [[1,1,2],[1,2,1],[2,1,1]]

console.log(permuteUnique([1, 2, 3]).length); // 6

console.log(permuteUniqueMap([1, 1, 2]));
// [[1,1,2],[1,2,1],[2,1,1]]

console.log(permuteUniqueMap([1, 1, 1]).length); // 1
```

---

## 🔗 Related Problems

| Problem                                                                | Pattern                      | Difficulty |
| ---------------------------------------------------------------------- | ---------------------------- | ---------- |
| [Permutations](https://leetcode.com/problems/permutations)             | Backtracking no dedup        | 🟡 Medium  |
| [Subsets II](https://leetcode.com/problems/subsets-ii)                 | Sort + skip duplicate        | 🟡 Medium  |
| [Combination Sum II](https://leetcode.com/problems/combination-sum-ii) | Same dedup rule              | 🟡 Medium  |
| [N-Queens](https://leetcode.com/problems/n-queens)                     | Backtracking with constraint | 🔴 Hard    |
