---
layout: page
title: "Counting Elements"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/counting-elements"
---

# Counting Elements / Đếm Phần Tử

🟢 Easy | Array · Hash Table

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Tưởng tượng bạn có một bộ chìa khoá. Mỗi chìa khoá x chỉ "hợp lệ" nếu trong bộ có chiếc x+1. Bạn đếm xem có bao nhiêu chìa khoá hợp lệ.

```
arr = [1, 2, 3]
Set = {1, 2, 3}
  x=1: 2 in Set? ✓ → count 1
  x=2: 3 in Set? ✓ → count 2
  x=3: 4 in Set? ✗ → skip
Result = 2
```

## Problem Description

Given an integer array `arr`, count how many elements `x` exist such that `x + 1` also exists in `arr`. Duplicates are counted separately.

- **Example 1**: `arr = [1,2,3]` → `2` (1→2 ✓, 2→3 ✓, 3→4 ✗)
- **Example 2**: `arr = [1,1,2]` → `2` (each 1 counts since 2 exists, 2→3 ✗)

## 📝 Interview Tips

- 💡 **Hash Set lookup / Tra cứu Set**: O(1) lookup vs O(n) linear scan — always use a Set here / dùng Set để tra O(1)
- 🔍 **Duplicates count / Trùng lặp được tính**: If arr=[1,1,2] both 1s count because 2 exists / cả hai số 1 đều được tính
- ⚠️ **Off-by-one / Lệch một**: Check x+1, not x-1 or 2x / kiểm tra x+1, không phải x-1
- 🧮 **Time complexity / Độ phức tạp**: O(n) build set + O(n) scan = O(n) total / O(n) tổng
- 📊 **Space / Không gian**: O(u) where u = unique elements / O(u) với u là số phần tử duy nhất
- 🎯 **Edge case / Trường hợp đặc biệt**: Empty array → 0; single element → 0 / mảng rỗng hoặc 1 phần tử → 0

## Solutions

### Solution 1: Hash Set (Optimal)

```typescript
/**
 * Count elements x where x+1 also appears in the array
 * Time: O(n) | Space: O(n)
 */
function countElements(arr: number[]): number {
  const set = new Set(arr);
  let count = 0;
  for (const x of arr) {
    if (set.has(x + 1)) count++;
  }
  return count;
}

// Tests
console.log(countElements([1, 2, 3])); // 2
console.log(countElements([1, 1, 2])); // 2
console.log(countElements([1, 3, 2, 3, 5, 0])); // 3 (0→1, 1 wait...) let's trace
// 0→1✓, 1→2✓, 2→3✓, 3→4✗, 3→4✗, 5→6✗ → 3
console.log(countElements([1, 2, 3, 4, 5])); // 4
```

### Solution 2: Sort + Binary Search

```typescript
/**
 * Sort then binary search for x+1
 * Time: O(n log n) | Space: O(1)
 */
function countElementsSort(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);

  const bsHas = (val: number): boolean => {
    let lo = 0,
      hi = sorted.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] === val) return true;
      else if (sorted[mid] < val) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  };

  let count = 0;
  for (const x of arr) {
    if (bsHas(x + 1)) count++;
  }
  return count;
}

// Tests
console.log(countElementsSort([1, 2, 3])); // 2
console.log(countElementsSort([1, 1, 2])); // 2
```

### Solution 3: Frequency Map (Extra insight)

```typescript
/**
 * Frequency map — also shows occurrence count
 * Time: O(n) | Space: O(n)
 */
function countElementsFreq(arr: number[]): number {
  const freq = new Map<number, number>();
  for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);

  let count = 0;
  for (const [x, cnt] of freq) {
    if (freq.has(x + 1)) count += cnt; // each occurrence of x counts
  }
  return count;
}

// Tests
console.log(countElementsFreq([1, 1, 2])); // 2
console.log(countElementsFreq([1, 2, 3])); // 2
console.log(countElementsFreq([5])); // 0
```

## 🔗 Related Problems

| #    | Problem                      | Difficulty | Tags       |
| ---- | ---------------------------- | ---------- | ---------- |
| 1    | Two Sum                      | Easy       | Hash Table |
| 128  | Longest Consecutive Sequence | Medium     | Hash Table |
| 532  | K-diff Pairs in an Array     | Medium     | Hash Table |
| 1207 | Unique Number of Occurrences | Easy       | Hash Table |
