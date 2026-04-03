---
layout: page
title: "Unique Number of Occurrences"
difficulty: Easy
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/unique-number-of-occurrences"
---

# Unique Number of Occurrences / Số Lần Xuất Hiện Duy Nhất

🟢 Easy | Array · Hash Table

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn đếm xem mỗi bạn học sinh xuất hiện bao nhiêu lần trong danh sách. Câu hỏi là: liệu tất cả số lần đó có **khác nhau** không? Dùng Map để đếm, rồi kiểm tra Set xem có trùng không.

```
arr = [1,2,2,1,1,3]
Counts: {1:3, 2:2, 3:1}
Occurrence values: [3, 2, 1]
All unique? Set size (3) === Map size (3) → true ✓

arr = [1,2]
Counts: {1:1, 2:1}
Occurrence values: [1, 1]
Set size (1) !== Map size (2) → false ✗
```

## Problem Description

Return `true` if the number of occurrences of each value in `arr` is **unique**, otherwise return `false`.

- **Example 1**: `arr = [1,2,2,1,1,3]` → `true` (counts: 1→3, 2→2, 3→1, all different)
- **Example 2**: `arr = [1,2]` → `false` (counts: 1→1, 2→1, both equal)

## 📝 Interview Tips

- 💡 **Two-hash trick / Hai bảng băm**: Count frequencies, then check if frequency values are unique via Set / đếm tần số rồi kiểm tra Set
- 🔍 **Size comparison / So sánh kích thước**: If Set(occurrences).size === Map.size → all unique / nếu kích thước bằng nhau → duy nhất
- ⚠️ **Values vs counts / Giá trị vs số lần**: We check uniqueness of COUNTS, not values themselves / kiểm tra tính duy nhất của số lần, không phải giá trị
- 🧮 **O(n) complexity / Độ phức tạp**: One pass to count + one pass to verify = O(n) / hai lượt O(n)
- 📊 **Space bound / Giới hạn không gian**: At most O(n) unique values possible / tối đa O(n) giá trị duy nhất
- 🎯 **Constraints / Ràng buộc**: 1 ≤ arr.length ≤ 1000, -1000 ≤ arr[i] ≤ 1000 / mảng nhỏ, mọi cách đều chạy được

## Solutions

### Solution 1: Map + Set (Optimal)

```typescript
/**
 * Check if all occurrence counts are unique
 * Time: O(n) | Space: O(n)
 */
function uniqueOccurrences(arr: number[]): boolean {
  const freq = new Map<number, number>();
  for (const x of arr) {
    freq.set(x, (freq.get(x) ?? 0) + 1);
  }
  const counts = [...freq.values()];
  return counts.length === new Set(counts).size;
}

// Tests
console.log(uniqueOccurrences([1, 2, 2, 1, 1, 3])); // true
console.log(uniqueOccurrences([1, 2])); // false
console.log(uniqueOccurrences([-3, 0, 1, -3, 1, 1, 1, -3, 10, 0])); // true
```

### Solution 2: Sort + Consecutive Counting

```typescript
/**
 * Sort, count consecutive equal elements, check uniqueness
 * Time: O(n log n) | Space: O(n)
 */
function uniqueOccurrencesSort(arr: number[]): boolean {
  const sorted = [...arr].sort((a, b) => a - b);
  const counts: number[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j] === sorted[i]) j++;
    counts.push(j - i);
    i = j;
  }
  return counts.length === new Set(counts).size;
}

// Tests
console.log(uniqueOccurrencesSort([1, 2, 2, 1, 1, 3])); // true
console.log(uniqueOccurrencesSort([1, 2])); // false
```

### Solution 3: Object frequency map

```typescript
/**
 * Plain object for frequency counting (alternative to Map)
 * Time: O(n) | Space: O(n)
 */
function uniqueOccurrencesObj(arr: number[]): boolean {
  const freq: Record<number, number> = {};
  for (const x of arr) freq[x] = (freq[x] ?? 0) + 1;

  const values = Object.values(freq);
  return values.length === new Set(values).size;
}

// Tests
console.log(uniqueOccurrencesObj([1, 2, 2, 1, 1, 3])); // true
console.log(uniqueOccurrencesObj([1, 2])); // false
console.log(uniqueOccurrencesObj([5])); // true
```

## 🔗 Related Problems

| #   | Problem                        | Difficulty | Tags       |
| --- | ------------------------------ | ---------- | ---------- |
| 217 | Contains Duplicate             | Easy       | Hash Table |
| 347 | Top K Frequent Elements        | Medium     | Hash Table |
| 451 | Sort Characters By Frequency   | Medium     | Hash Table |
| 594 | Longest Harmonious Subsequence | Easy       | Hash Table |
