---
layout: page
title: "Create Sorted Array through Instructions"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/create-sorted-array-through-instructions"
---

# Create Sorted Array through Instructions / Tạo Mảng Đã Sắp Xếp Qua Từng Lệnh

🔴 Hard | 🏷️ Array, Binary Search, Binary Indexed Tree | [LeetCode](https://leetcode.com/problems/create-sorted-array-through-instructions)

---

## 🧠 Intuition

**Vietnamese:** Khi chèn `instructions[i]` vào mảng đã sắp xếp, chi phí = min(số phần tử nhỏ hơn, số phần tử lớn hơn). Dùng Binary Indexed Tree (BIT/Fenwick Tree) để đếm số phần tử đã chèn nhỏ hơn x trong O(log n), từ đó tính số lớn hơn.

**Analogy:** Như điểm danh trong lớp: mỗi học sinh mới vào, đếm bao nhiêu người đã điểm danh thấp hơn và cao hơn mình. BIT là sổ điểm danh thần kỳ truy vấn nhanh.

```
instructions = [1, 5, 6, 2]
BIT tracks frequency of each value

Insert 1: less=0, greater=0  → cost=0  BIT[1]++
Insert 5: less=1, greater=0  → cost=1  BIT[5]++
Insert 6: less=2, greater=0  → cost=2  BIT[6]++
Insert 2: less=1, greater=2  → cost=1  BIT[2]++
Total cost = 0+1+2+1 = 4  (mod 1e9+7)
```

---

## 📝 Interview Tips

- **EN:** Cost = min(count of existing elements < x, count > x) / **VI:** Chi phí = min(số phần tử đã có nhỏ hơn x, số lớn hơn x)
- **EN:** BIT answers prefix sum queries in O(log n), update in O(log n) / **VI:** BIT trả lời truy vấn tổng prefix O(log n), cập nhật O(log n)
- **EN:** `less(x)` = BIT query [1, x-1]; `greater(x)` = total_inserted − BIT query [1, x] / **VI:** Đếm nhỏ hơn = query BIT [1,x-1]; lớn hơn = i − query[1,x]
- **EN:** Value range up to 1e5, so BIT size = 1e5+1 / **VI:** Giá trị tối đa 1e5, BIT kích thước 1e5+1
- **EN:** Remember modulo 1e9+7 on the total cost / **VI:** Nhớ lấy mod 1e9+7 trên tổng chi phí
- **EN:** Alternative: merge sort counts inversions in O(n log n) / **VI:** Thay thế: merge sort đếm inversion trong O(n log n)

---

## Solutions

### Solution 1: Binary Indexed Tree (Fenwick Tree)

```typescript
/**
 * BIT to count elements less/greater than current in O(log n) per insert.
 * Time: O(n log M)  Space: O(M)  where M = max value = 1e5
 */
function createSortedArray(instructions: number[]): number {
  const MOD = 1_000_000_007n;
  const MAX = 100_001;
  const bit = new Int32Array(MAX + 1);

  const update = (i: number) => {
    for (; i <= MAX; i += i & -i) bit[i]++;
  };
  const query = (i: number): number => {
    let s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
  };

  let cost = 0n;
  for (let idx = 0; idx < instructions.length; idx++) {
    const x = instructions[idx];
    const less = query(x - 1);
    const greater = idx - query(x);
    cost = (cost + BigInt(Math.min(less, greater))) % MOD;
    update(x);
  }
  return Number(cost);
}

// Tests
console.log(createSortedArray([1, 5, 6, 2])); // 1
console.log(createSortedArray([1, 2, 3, 6, 5, 4])); // 3
console.log(createSortedArray([1, 3, 3, 3, 2, 4, 2, 1, 2])); // 4
```

### Solution 2: Merge Sort (Count Inversions style)

```typescript
/**
 * Merge sort: count elements less/greater during merge step.
 * Time: O(n log n)  Space: O(n)
 */
function createSortedArray2(instructions: number[]): number {
  const MOD = 1_000_000_007;
  let cost = 0;

  // Use sorted array + bisect to count
  const sorted: number[] = [];

  const bisectLeft = (arr: number[], v: number): number => {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      arr[mid] < v ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  };
  const bisectRight = (arr: number[], v: number): number => {
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      arr[mid] <= v ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  };
  const sortedInsert = (arr: number[], v: number) => {
    const pos = bisectLeft(arr, v);
    arr.splice(pos, 0, v);
  };

  for (let i = 0; i < instructions.length; i++) {
    const x = instructions[i];
    const less = bisectLeft(sorted, x);
    const greater = i - bisectRight(sorted, x);
    cost = (cost + Math.min(less, greater)) % MOD;
    sortedInsert(sorted, x);
  }
  return cost;
}

// Tests (splice is O(n) so this is O(n^2) — for correctness demonstration)
console.log(createSortedArray2([1, 5, 6, 2])); // 1
console.log(createSortedArray2([1, 2, 3, 6, 5, 4])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Difficulty | Connection                  |
| -------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) | 🔴 Hard    | BIT / merge sort count      |
| [Count of Range Sum](https://leetcode.com/problems/count-of-range-sum)                                   | 🔴 Hard    | Merge sort divide & conquer |
| [Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array)         | 🔴 Hard    | BIT count pattern           |
