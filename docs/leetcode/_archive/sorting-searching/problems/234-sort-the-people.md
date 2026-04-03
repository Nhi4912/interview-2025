---
layout: page
title: "Sort the People"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-the-people"
---

# Sort the People / Sắp Xếp Người Theo Chiều Cao

> **Track**: Sorting-Searching | **Difficulty**: 🟢 Easy | **Pattern**: Index Sort / Map
> **Frequency**: 📘 Tier 3 — Common warm-up / onsite screen
> **See also**: [Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) | [Relative Sort Array](https://leetcode.com/problems/relative-sort-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xếp hàng chụp ảnh — người cao hơn đứng trước. Cần sort theo chiều cao nhưng trả về tên. Bí quyết: sort **indices** theo height rồi map sang tên.

**Pattern Recognition:**

- Signal: "sort one array by values of another array" → **Index Sort** or **Map key→value**
- Heights are unique → safe to use Map(height → name)

**Visual — names=["Mary","John","Emma"], heights=[180,165,170]:**

```
Pair up:   (180,"Mary"), (165,"John"), (170,"Emma")
                ↓ sort by height descending
           (180,"Mary"), (170,"Emma"), (165,"John")
                ↓ extract names
Output:    ["Mary", "Emma", "John"]

Map approach (since heights are distinct):
  Map: {180→"Mary", 165→"John", 170→"Emma"}
  Sort heights desc: [180, 170, 165]
  Look up each: ["Mary", "Emma", "John"]
```

---

## Problem Description

Given arrays `names` (strings) and `heights` (distinct integers) of the same length `n`, return `names` sorted in **descending order** of the corresponding heights.

**Example 1:**

```
Input:  names=["Mary","John","Emma"], heights=[180,165,170]
Output: ["Mary","Emma","John"]
```

**Example 2:**

```
Input:  names=["Alice","Bob","Bob"], heights=[155,185,150]
Output: ["Bob","Alice","Bob"]
```

**Example 3:**

```
Input:  names=["IEO","Sgizfdfrims","QTASHKQ"], heights=[17,11,8]
Output: ["IEO","Sgizfdfrims","QTASHKQ"]
```

**Constraints:**

- `n == names.length == heights.length`
- `1 ≤ n ≤ 10³`, `1 ≤ heights[i] ≤ 10⁵`
- Heights are **distinct**
- `1 ≤ names[i].length ≤ 20`, names contain only English letters

---

## 📝 Interview Tips

1. **Sort indices, not values** — Sort index array `[0..n-1]` theo heights; tránh zip/unzip phức tạp. / Sort an index array by heights — cleaner than juggling parallel arrays.
2. **Map vì heights distinct** — Vì heights không trùng, Map(height→name) cho phép lookup O(1). / Heights are distinct → Map(height→name) gives O(1) lookup without index tracking.
3. **Descending sort** — `(a,b) => b-a` hoặc sort asc rồi reverse. Chú ý chiều sort. / Use `(a, b) => b - a` comparator, or sort ascending then reverse.
4. **Đừng mutate input** — Sort trên copy của heights hoặc sort index array để không thay đổi input. / Avoid mutating input — sort a copy or use index sort.
5. **Edge case n=1** — Trả ngay `[names[0]]`; mọi approach đều handle đúng tự nhiên. / n=1 is trivially handled by any sort-based approach.
6. **Duplicate names OK** — Names có thể trùng (e.g. "Bob" twice) nhưng heights luôn unique → Map keyed on height vẫn đúng. / Names may repeat but heights are unique — Map keyed on height is safe.

---

## Solutions

```typescript
/**
 * Approach 1: Index Sort
 * Time: O(n log n)  Space: O(n)
 *
 * Create an index array, sort it by heights descending, then map to names.
 */
function sortPeopleIndexSort(names: string[], heights: number[]): string[] {
  const indices = Array.from({ length: names.length }, (_, i) => i);
  indices.sort((a, b) => heights[b] - heights[a]);
  return indices.map((i) => names[i]);
}

/**
 * Approach 2: Map height → name (exploits distinct heights)
 * Time: O(n log n)  Space: O(n)
 *
 * Since heights are distinct, build Map(height → name),
 * sort a copy of heights descending, then look up each name.
 */
function sortPeople(names: string[], heights: number[]): string[] {
  const heightToName = new Map<number, string>();
  for (let i = 0; i < names.length; i++) {
    heightToName.set(heights[i], names[i]);
  }

  // Sort heights descending (copy to avoid mutation)
  const sortedHeights = [...heights].sort((a, b) => b - a);

  return sortedHeights.map((h) => heightToName.get(h)!);
}

/**
 * Approach 3: Zip + Sort (most readable)
 * Time: O(n log n)  Space: O(n)
 */
function sortPeopleZip(names: string[], heights: number[]): string[] {
  return names
    .map((name, i) => ({ name, height: heights[i] }))
    .sort((a, b) => b.height - a.height)
    .map((p) => p.name);
}

// Tests
console.log(sortPeople(["Mary", "John", "Emma"], [180, 165, 170]));
// Expected: ["Mary","Emma","John"]

console.log(sortPeople(["Alice", "Bob", "Bob"], [155, 185, 150]));
// Expected: ["Bob","Alice","Bob"]

console.log(sortPeople(["IEO", "Sgizfdfrims", "QTASHKQ"], [17, 11, 8]));
// Expected: ["IEO","Sgizfdfrims","QTASHKQ"]

console.log(sortPeopleIndexSort(["Mary", "John", "Emma"], [180, 165, 170]));
// Expected: ["Mary","Emma","John"]

console.log(sortPeopleZip(["Mary", "John", "Emma"], [180, 165, 170]));
// Expected: ["Mary","Emma","John"]
```

---

## 🔗 Related Problems

- [1366. Rank Teams by Votes](https://leetcode.com/problems/rank-teams-by-votes) — Custom comparator sort on paired data
- [1122. Relative Sort Array](https://leetcode.com/problems/relative-sort-array) — Sort by external order
- [791. Custom Sort String](https://leetcode.com/problems/custom-sort-string) — Custom order sort
- [976. Largest Perimeter Triangle](https://leetcode.com/problems/largest-perimeter-triangle) — Sort + greedy scan
- [1636. Sort Array by Increasing Frequency](https://leetcode.com/problems/sort-array-by-increasing-frequency) — Sort by derived property
