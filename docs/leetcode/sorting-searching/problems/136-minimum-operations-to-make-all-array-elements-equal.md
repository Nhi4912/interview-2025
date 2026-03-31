---
layout: page
title: "Minimum Operations to Make All Array Elements Equal"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-all-array-elements-equal"
---

# Minimum Operations to Make All Array Elements Equal / Số Phép Toán Tối Thiểu Để Mọi Phần Tử Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Binary Search

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Cho một mảng số và nhiều truy vấn `q`. Với mỗi `q`, bạn muốn đưa tất cả phần tử về `q` — tổng chi phí là tổng khoảng cách. Sau khi sort, chia mảng thành hai phần tại `q`: phần trái tăng, phần phải giảm. Prefix sum cho phép tính tổng O(1).

```
sorted: [1, 2, 3, 4]
prefix: [0, 1, 3, 6, 10]

query q=3 → split=2 (first index >= 3)
  left  = q*split - prefix[split] = 3*2 - 3 = 3
  right = (prefix[4]-prefix[2]) - q*(4-2) = 7 - 6 = 1
  total = 4 ✅
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Sort first** / Sắp xếp trước để binary search và prefix sum hoạt động chính xác
- 🔑 **Prefix sum** / Tiền tố tổng: `prefix[i] = prefix[i-1] + nums[i-1]` — truy vấn range sum O(1)
- 🔑 **Binary search** / Tìm `lowerBound(q)` — chỉ số đầu tiên có `nums[i] >= q` — O(log n)
- 🔑 **Left cost** / Chi phí phần trái = `q * split - prefix[split]` (tăng lên q)
- 🔑 **Right cost** / Chi phí phần phải = `(prefix[n] - prefix[split]) - q * (n - split)` (giảm xuống q)
- 🔑 **No overflow** / Với constraints lớn, kết quả vừa vào number (max ~10^14)

## Solutions

```typescript
// ─── Solution 1: Brute Force — O(n * m) ───
function minOperationsBrute(nums: number[], queries: number[]): number[] {
  return queries.map((q) => {
    let cost = 0;
    for (const x of nums) cost += Math.abs(x - q);
    return cost;
  });
}

console.log(minOperationsBrute([3, 1, 2, 4], [1, 5, 2, 4])); // [5, 5, 1, 1]

// ─── Solution 2: Sort + Prefix Sum + Binary Search — O((n+m) log n) ───
function minOperations(nums: number[], queries: number[]): number[] {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // prefix[i] = sum of nums[0..i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  // Lower bound: first index where nums[idx] >= target
  const lowerBound = (target: number): number => {
    let lo = 0,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      nums[mid] < target ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  };

  return queries.map((q) => {
    const split = lowerBound(q);
    // Elements < q: raise each to q  → cost = q*split - sum(left)
    const leftCost = q * split - prefix[split];
    // Elements >= q: lower each to q → cost = sum(right) - q*(n-split)
    const rightCost = prefix[n] - prefix[split] - q * (n - split);
    return leftCost + rightCost;
  });
}

console.log(minOperations([3, 1, 2, 4], [1, 5, 2, 4])); // [5, 5, 1, 1]
console.log(minOperations([2, 9, 6, 3], [10])); // [20]
console.log(minOperations([1], [1])); // [0]

// ─── Solution 3: Same, using built-in reduce ───
function minOperationsV2(nums: number[], queries: number[]): number[] {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const prefix: number[] = [0];
  for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);

  const result: number[] = [];
  for (const q of queries) {
    let lo = 0,
      hi = n;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      nums[m] < q ? (lo = m + 1) : (hi = m);
    }
    const k = lo;
    result.push(q * k - prefix[k] + (prefix[n] - prefix[k]) - q * (n - k));
  }
  return result;
}

console.log(minOperationsV2([3, 1, 2, 4], [1, 5, 2, 4])); // [5, 5, 1, 1]
```

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                             | Pattern                    |
| ---- | --------------------------------------------------- | -------------------------- |
| 1685 | Sum of Absolute Differences in a Sorted Array       | Prefix Sum                 |
| 2602 | Minimum Operations to Make All Array Elements Equal | This problem               |
| 2448 | Minimum Cost to Make Array Equal                    | Prefix Sum + Binary Search |
| 1870 | Minimum Speed to Arrive on Time                     | Binary Search on Answer    |
