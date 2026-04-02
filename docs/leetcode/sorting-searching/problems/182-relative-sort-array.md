---
layout: page
title: "Relative Sort Array"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Counting Sort]
leetcode_url: "https://leetcode.com/problems/relative-sort-array"
---

# Relative Sort Array / Sắp Xếp Mảng Theo Thứ Tự Tương Đối

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Elements in arr1 that appear in arr2 should come first, in the same order as arr2. Elements not in arr2 come last, sorted in ascending order. Build a rank map from arr2, then sort arr1 with a custom comparator: if both in arr2, compare by rank; otherwise, elements not in arr2 sort after with their natural value.

**VI:** Phần tử trong arr1 xuất hiện trong arr2 thì theo thứ tự của arr2. Phần tử không có trong arr2 xếp cuối theo thứ tự tăng dần. Tạo bảng rank từ arr2, rồi sắp xếp arr1 với comparator tùy chỉnh.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Relative Sort Array example:**

```
arr1 = [2,3,1,3,2,4,6,7,9,2,19]
arr2 = [2,1,4,3,9,6]

rank: {2→0, 1→1, 4→2, 3→3, 9→4, 6→5}

Sort arr1:
  In arr2: 2(r0),2(r0),2(r0),1(r1),4(r2),3(r3),3(r3),9(r4),6(r5)
  Not in arr2: 7, 19  → sorted asc

Result: [2,2,2,1,4,3,3,9,6,7,19]
```

---

---

## Problem Description

| #   | Problem                      | Difficulty | Pattern         |
| --- | ---------------------------- | ---------- | --------------- |
| 1   | Sort Array by Parity         | 🟢 Easy    | custom sort     |
| 2   | Custom Sort String           | 🟡 Medium  | rank-based sort |
| 3   | Sort Characters by Frequency | 🟡 Medium  | frequency sort  |

---

## 📝 Interview Tips

- 🗺️ **EN:** Build rank map `{value → position in arr2}` first — O(m) build, O(1) lookup. **VI:** Xây dựng bảng rank `{giá trị → vị trí trong arr2}` trước — xây dựng O(m), tra cứu O(1).
- 🔢 **EN:** Comparator: if both have rank → compare ranks. If only one has rank → ranked one comes first. If neither → compare natural values. **VI:** So sánh: cả hai có rank → so rank; một trong hai có rank → cái có rank lên trước; không cái nào có rank → so tự nhiên.
- 📊 **EN:** Alternative: counting sort — since values ≤ 1000, use count array + two-pass reconstruction. O(n + k) time. **VI:** Cách khác: counting sort — giá trị ≤ 1000, dùng mảng đếm và tái tạo hai lần. O(n+k).
- ✅ **EN:** arr2 has distinct values (guaranteed) so rank map has no duplicates. **VI:** arr2 có giá trị phân biệt (đảm bảo bởi đề) nên bảng rank không có trùng lặp.
- 🎯 **EN:** For elements not in arr2, assigning rank = `arr2.length + value` makes the single comparator work cleanly. **VI:** Với phần tử không trong arr2, gán rank = `arr2.length + value` để comparator hoạt động gọn gàng.
- ⚡ **EN:** In JavaScript, `Array.sort` is stable (since V8), so equal-rank elements maintain relative order. **VI:** Trong JavaScript, `Array.sort` ổn định (từ V8), nên các phần tử cùng rank giữ thứ tự tương đối.

---

---

## Solutions

```typescript
/**
 * Map arr2 values to their rank. Sort arr1 using rank comparator.
 * Elements not in arr2 get rank = arr2.length + value (sorts after and asc).
 * Time: O(n log n)  Space: O(m)  m = arr2.length
 */
function relativeSortArray(arr1: number[], arr2: number[]): number[] {
  const rank = new Map<number, number>();
  arr2.forEach((v, i) => rank.set(v, i));

  return arr1.sort((a, b) => {
    const ra = rank.has(a) ? rank.get(a)! : arr2.length + a;
    const rb = rank.has(b) ? rank.get(b)! : arr2.length + b;
    return ra - rb;
  });
}

// Tests
console.log(relativeSortArray([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6])); // [2,2,2,1,4,3,3,9,6,7,19]

console.log(relativeSortArray([28, 6, 22, 8, 44, 17], [22, 28, 8, 6])); // [22,28,8,6,17,44]

/**
 * Since values ≤ 1000, use counting sort.
 * Pass 1: count frequencies. Pass 2: place arr2 elements first, then rest asc.
 * Time: O(n + k)  Space: O(k)  k = max value = 1000
 */
function relativeSortArray2(arr1: number[], arr2: number[]): number[] {
  const MAX_VAL = 1001;
  const count = new Array(MAX_VAL).fill(0);
  for (const v of arr1) count[v]++;

  const result: number[] = [];

  // First: place arr2 elements in order
  for (const v of arr2) {
    while (count[v]-- > 0) result.push(v);
  }

  // Then: place remaining elements in ascending order
  for (let v = 0; v < MAX_VAL; v++) {
    while (count[v]-- > 0) result.push(v);
  }

  return result;
}

console.log(relativeSortArray2([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6])); // [2,2,2,1,4,3,3,9,6,7,19]

/**
 * Explicitly separate arr1 into "in arr2" and "not in arr2" groups.
 * Time: O(n log n)  Space: O(n)
 */
function relativeSortArray3(arr1: number[], arr2: number[]): number[] {
  const inArr2 = new Set(arr2);
  const grouped = new Map<number, number[]>();
  const extra: number[] = [];

  for (const v of arr1) {
    if (inArr2.has(v)) {
      if (!grouped.has(v)) grouped.set(v, []);
      grouped.get(v)!.push(v);
    } else {
      extra.push(v);
    }
  }

  extra.sort((a, b) => a - b);

  const result: number[] = [];
  for (const v of arr2) {
    result.push(...(grouped.get(v) ?? []));
  }
  result.push(...extra);
  return result;
}

console.log(relativeSortArray3([28, 6, 22, 8, 44, 17], [22, 28, 8, 6])); // [22,28,8,6,17,44]
```

---

## 🔗 Related Problems

| #   | Problem                      | Difficulty | Pattern         |
| --- | ---------------------------- | ---------- | --------------- |
| 1   | Sort Array by Parity         | 🟢 Easy    | custom sort     |
| 2   | Custom Sort String           | 🟡 Medium  | rank-based sort |
| 3   | Sort Characters by Frequency | 🟡 Medium  | frequency sort  |
