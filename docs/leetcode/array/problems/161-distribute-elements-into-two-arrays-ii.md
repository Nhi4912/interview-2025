---
layout: page
title: "Distribute Elements Into Two Arrays II"
difficulty: Hard
category: Array
tags: [Array, Binary Indexed Tree, Segment Tree, Simulation]
leetcode_url: "https://leetcode.com/problems/distribute-elements-into-two-arrays-ii"
---

# Distribute Elements Into Two Arrays II / Phân Phối Phần Tử Vào Hai Mảng II

🔴 Hard | 🏷️ Array, BIT, Simulation | 🔗 [LeetCode](https://leetcode.com/problems/distribute-elements-into-two-arrays-ii)

## 🧠 Intuition / Trực Giác

**Tiếng Việt:** Giống bài I nhưng thay vì so sánh phần tử cuối, ta đếm xem có bao nhiêu phần tử trong mảng lớn hơn giá trị hiện tại. Cần BIT (Binary Indexed Tree) để đếm nhanh trong O(log n).

**English:** Same greedy as Part I, but greaterCount(arr, val) = count of elements in arr strictly greater than val. Use a Fenwick Tree with coordinate compression for O(log n) queries.

```
nums = [2, 1, 4, 3]
arr1=[2] arr2=[1]  BIT1: {2→1}  BIT2: {1→1}

i=2, val=4:
  gc1 = elements in arr1 > 4 = 0
  gc2 = elements in arr2 > 4 = 0
  Equal → arr1 (fewer elements? arr1.len=arr2.len → arr1)
  arr1=[2,4]

i=3, val=3:
  gc1 = elements in arr1 > 3 = 1 (the 4)
  gc2 = elements in arr2 > 3 = 0
  gc1 > gc2 → arr1=[2,4,3]

Result: [2,4,3,1]
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Coordinate compress values before building BIT | **VI:** Nén tọa độ trước khi xây dựng BIT
- 🔑 **EN:** greaterCount = total - prefixSum(rank) using BIT | **VI:** greaterCount = tổng - prefixSum(rank) qua BIT
- 🔑 **EN:** Tiebreak: equal counts → choose array with fewer elements | **VI:** Hòa: chọn mảng ít phần tử hơn; nếu bằng → chọn arr1
- 🔑 **EN:** Two separate BITs, one per array | **VI:** Hai BIT riêng biệt, một cho mỗi mảng
- 🔑 **EN:** Coordinate compress all values upfront, not lazily | **VI:** Nén tọa độ tất cả giá trị ngay từ đầu
- 🔑 **EN:** O(n log n) total — each element causes one BIT update + two queries | **VI:** O(n log n) tổng cộng

## Solutions

### Solution 1: BIT + Coordinate Compression (Optimal)

```typescript
/**
 * Fenwick Tree for greaterCount queries
 * Time: O(n log n) — coordinate compress + BIT ops
 * Space: O(n) — two BITs + arrays
 */
class FenwickTree {
  private tree: number[];
  private n: number;
  constructor(n: number) {
    this.n = n;
    this.tree = new Array(n + 1).fill(0);
  }
  update(i: number): void {
    for (; i <= this.n; i += i & -i) this.tree[i]++;
  }
  query(i: number): number {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.tree[i];
    return s;
  }
  greaterCount(rank: number): number {
    return this.query(this.n) - this.query(rank);
  }
}

function resultArray(nums: number[]): number[] {
  // Coordinate compression
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  sorted.forEach((v, i) => rank.set(v, i + 1));
  const m = sorted.length;

  const bit1 = new FenwickTree(m);
  const bit2 = new FenwickTree(m);
  const arr1: number[] = [nums[0]];
  const arr2: number[] = [nums[1]];
  bit1.update(rank.get(nums[0])!);
  bit2.update(rank.get(nums[1])!);

  for (let i = 2; i < nums.length; i++) {
    const r = rank.get(nums[i])!;
    const gc1 = bit1.greaterCount(r);
    const gc2 = bit2.greaterCount(r);

    if (gc1 > gc2 || (gc1 === gc2 && arr1.length <= arr2.length)) {
      arr1.push(nums[i]);
      bit1.update(r);
    } else {
      arr2.push(nums[i]);
      bit2.update(r);
    }
  }

  return [...arr1, ...arr2];
}

console.log(resultArray([2, 1, 4, 3])); // [2,4,3,1]
console.log(resultArray([2, 1, 3, 3])); // [2,3,3,1]
console.log(resultArray([3, 2, 2, 3, 3, 2])); // [3,3,3,2,2,2]
```

### Solution 2: Brute Force (O(n²) — for small inputs)

```typescript
/**
 * Count elements greater than val by linear scan
 * Time: O(n²) | Space: O(n)
 */
function resultArrayBrute(nums: number[]): number[] {
  const greaterCount = (arr: number[], val: number) => arr.filter((x) => x > val).length;

  const arr1: number[] = [nums[0]];
  const arr2: number[] = [nums[1]];

  for (let i = 2; i < nums.length; i++) {
    const gc1 = greaterCount(arr1, nums[i]);
    const gc2 = greaterCount(arr2, nums[i]);

    if (gc1 > gc2 || (gc1 === gc2 && arr1.length <= arr2.length)) {
      arr1.push(nums[i]);
    } else {
      arr2.push(nums[i]);
    }
  }

  return [...arr1, ...arr2];
}

console.log(resultArrayBrute([2, 1, 4, 3])); // [2,4,3,1]
console.log(resultArrayBrute([2, 1, 3, 3])); // [2,3,3,1]
```

## 🔗 Related Problems

| Problem                                                                                                   | Difficulty | Pattern          |
| --------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Distribute Elements Into Two Arrays I](./160-distribute-elements-into-two-arrays-i.md)                   | 🟢 Easy    | Greedy           |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | 🔴 Hard    | BIT              |
| [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/)                                   | 🔴 Hard    | BIT + Merge Sort |
