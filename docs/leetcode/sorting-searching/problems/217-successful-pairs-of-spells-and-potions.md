---
layout: page
title: "Successful Pairs of Spells and Potions"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/successful-pairs-of-spells-and-potions"
---

# Successful Pairs of Spells and Potions / Các Cặp Bùa Chú Và Thuốc Thành Công

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers / Binary Search
> **Frequency**: ⭐ Tier 2 — Hay gặp ở Amazon, Meta
> **See also**: [Two Sum Less Than K](https://leetcode.com/problems/two-sum-less-than-k) | [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi bùa chú (spell) cần một lọ thuốc (potion) đủ mạnh để cặp đôi thành công (spell * potion >= success). Sort potions, và với mỗi spell, tìm lọ thuốc nhỏ nhất thỏa điều kiện bằng binary search. Số lọ thành công = potions.length - index tìm được.

**Pattern Recognition:**

- Signal: "count pairs where product >= threshold" → **Sort potions + Binary Search per spell**
- minPotion = ceil(success / spell) → binary search leftmost index trong sorted potions
- count = n - firstValidIndex

**Visual — spells=[5,1,3], potions=[1,2,3,4,5], success=7:**

```
Sort potions: [1,2,3,4,5]
n=5

spell=5: minPotion=ceil(7/5)=2 -> binary search -> idx=1 -> count=5-1=4
spell=1: minPotion=ceil(7/1)=7 -> idx=5 (not found) -> count=0
spell=3: minPotion=ceil(7/3)=3 -> idx=2 -> count=5-2=3

Output: [4,0,3] ✅
```

---

## Problem Description

Given `spells` and `potions` arrays and `success` threshold. A pair (spell, potion) is successful if `spell * potion >= success`. Return array where `pairs[i]` = number of potions that form a successful pair with `spells[i]`.

```
Example 1: spells=[5,1,3], potions=[1,2,3,4,5], success=7  -> [4,0,3]
Example 2: spells=[3,1,2], potions=[8,5,8], success=16     -> [2,0,2]
```

---

## 📝 Interview Tips

1. **Sort potions once**: Sort O(m log m) once, binary search O(log m) per spell
2. **minPotion calculation**: spell * p >= success → p >= success/spell → Math.ceil
3. **Binary search for lower bound**: Tìm index đầu tiên >= minPotion
4. **Two pointer approach**: Sort spells too, use two pointers — O((n+m) log(n+m))
5. **Overflow nguy hiểm**: spell * potion có thể lớn → dùng comparison thay vì product
6. **Complexity**: Time O((n+m) log m), Space O(n) for result

---

## Solutions

```typescript
/**
 * Solution 1: Sort Potions + Binary Search per Spell (Optimal)
 * Time O(m log m + n log m), Space O(n)
 *
 * For each spell, find the first potion >= ceil(success/spell).
 * Count of valid potions = n - firstValidIndex.
 */
function successfulPairs(spells: number[], potions: number[], success: number): number[] {
  potions.sort((a, b) => a - b);
  const m = potions.length;

  // Lower bound: first index where potions[idx] >= target
  const lowerBound = (target: number): number => {
    let lo = 0, hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (potions[mid] >= target) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };

  return spells.map(spell => {
    // Need spell * potion >= success, i.e., potion >= success/spell
    const minPotion = Math.ceil(success / spell);
    return m - lowerBound(minPotion);
  });
}

/**
 * Solution 2: Sort Both + Two Pointers
 * Time O(n log n + m log m + n + m), Space O(n)
 *
 * Sort spells (with original indices), sort potions.
 * Two pointers: as spells increase, minPotion threshold decreases.
 */
function successfulPairs2(spells: number[], potions: number[], success: number): number[] {
  const m = potions.length;
  potions.sort((a, b) => a - b);

  // Sort spells with their original indices
  const indexed = spells.map((s, i) => [s, i]).sort((a, b) => a[0] - b[0]);
  const result = new Array(spells.length);

  let ptr = m - 1; // pointer in potions (start from largest)

  for (const [spell, origIdx] of indexed) {
    // Advance ptr while potions[ptr] * spell >= success
    // Actually: for increasing spells, threshold decreases, so ptr moves left
    while (ptr >= 0 && (potions[ptr] * spell >= success)) {
      ptr--;
    }
    result[origIdx] = m - (ptr + 1);
  }

  return result;
}

// --- Quick inline tests ---
console.log(JSON.stringify(successfulPairs([5,1,3], [1,2,3,4,5], 7)));  // [4,0,3]
console.log(JSON.stringify(successfulPairs([3,1,2], [8,5,8], 16)));      // [2,0,2]
console.log(JSON.stringify(successfulPairs([1], [1], 1)));                // [1]
console.log(JSON.stringify(successfulPairs2([5,1,3], [1,2,3,4,5], 7))); // [4,0,3]
console.log(JSON.stringify(successfulPairs2([3,1,2], [8,5,8], 16)));     // [2,0,2]
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [2300. Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions/) | This problem |
| [167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Two pointers on sorted array |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Binary search on threshold |
| [1385. Find the Distance Value Between Two Arrays](https://leetcode.com/problems/find-the-distance-value-between-two-arrays/) | Sort + binary search count |
| [2410. Maximum Matching of Players With Trainers](https://leetcode.com/problems/maximum-matching-of-players-with-trainers/) | Sort + greedy matching |
