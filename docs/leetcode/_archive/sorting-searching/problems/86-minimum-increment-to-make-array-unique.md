---
layout: page
title: "Minimum Increment to Make Array Unique"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-increment-to-make-array-unique"
---

# Minimum Increment to Make Array Unique / Số Lần Tăng Tối Thiểu Để Mảng Unique

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Hãy tưởng tượng bạn đặt nhiều chiếc ghế có số nhà vào một dãy phố — không có hai nhà cùng số. Khi hai ghế va chạm, bạn đẩy ghế sau ra xa tối thiểu. Sau khi sort, nếu `nums[i] <= nums[i-1]`, bạn phải tăng `nums[i]` lên `nums[i-1] + 1`.

```
nums = [3, 2, 1, 2, 1, 7]
Sort: [1, 1, 2, 2, 3, 7]

i=1: nums[1]=1 <= nums[0]=1 → set to 2, moves += 1
i=2: nums[2]=2 <= nums[1]=2 → set to 3, moves += 1
i=3: nums[3]=2 <= nums[2]=3 → set to 4, moves += 2
i=4: nums[4]=3 <= nums[3]=4 → set to 5, moves += 2
i=5: nums[5]=7 > nums[4]=5 → OK
Total moves = 6  ✅
```

---

## Problem Description

Given an array `nums`, return the **minimum number of increments** (each +1 counts as one move) to make all values unique.

- **Example 1:** `nums = [1,2,2]` → `1` (change one 2 to 3)
- **Example 2:** `nums = [3,2,1,2,1,7]` → `6`

---

## 📝 Interview Tips

- 🔽 **Sort first:** Sau khi sort, xử lý từ trái sang phải — đảm bảo mỗi phần tử lớn hơn phần tử trước
- 🎯 **Greedy proof:** Tăng lên giá trị nhỏ nhất possible (prev+1) luôn tối ưu vì tránh conflict cascade
- 🪣 **Counting sort variant:** O(max_val) — đếm frequency, resolve conflicts từ thấp đến cao
- 📊 **Complexity:** O(n log n) sorting; O(n + max_val) counting sort
- ⚠️ **Overflow:** `nums[i]` có thể tăng lên `n + max_val` — dùng BigInt nếu sum rất lớn
- 💡 **Follow-up:** Nếu được phép cả increment và decrement → tối ưu hóa khác hẳn (complex DP)

---

## Solutions

### Solution 1: Sort + greedy

```typescript
/**
 * Sort array, ensure each element is strictly greater than previous
 * Time: O(n log n)  Space: O(1)
 */
function minIncrementForUnique(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let moves = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) {
      moves += nums[i - 1] + 1 - nums[i];
      nums[i] = nums[i - 1] + 1;
    }
  }
  return moves;
}

console.log(minIncrementForUnique([1, 2, 2])); // 1
console.log(minIncrementForUnique([3, 2, 1, 2, 1, 7])); // 6
console.log(minIncrementForUnique([0, 0, 0])); // 3
```

### Solution 2: Counting sort — O(n + max_val)

```typescript
/**
 * Count frequencies, resolve conflicts from lowest to highest value
 * Time: O(n + max_val)  Space: O(max_val)
 */
function minIncrementForUniqueCounting(nums: number[]): number {
  const MAX = 100001 + nums.length; // upper bound after all increments
  const count = new Array(MAX).fill(0);
  for (const n of nums) count[n]++;

  let moves = 0;
  for (let i = 0; i < MAX - 1; i++) {
    if (count[i] > 1) {
      const overflow = count[i] - 1;
      count[i + 1] += overflow;
      moves += overflow;
      count[i] = 1;
    }
  }
  return moves;
}

console.log(minIncrementForUniqueCounting([1, 2, 2])); // 1
console.log(minIncrementForUniqueCounting([3, 2, 1, 2, 1, 7])); // 6
```

### Solution 3: Path compression (union-find style)

```typescript
/**
 * For each element, find its "next available" slot using memoized search
 * Time: O(n α(n)) amortized  Space: O(max_val)
 */
function minIncrementForUniqueUF(nums: number[]): number {
  const parent = new Map<number, number>();

  const find = (x: number): number => {
    if (!parent.has(x)) return x;
    const root = find(parent.get(x)!);
    parent.set(x, root);
    return root;
  };

  let moves = 0;
  for (const n of nums) {
    const slot = find(n);
    moves += slot - n;
    parent.set(slot, slot + 1); // mark slot as used, next available is slot+1
  }
  return moves;
}

console.log(minIncrementForUniqueUF([3, 2, 1, 2, 1, 7])); // 6
console.log(minIncrementForUniqueUF([1, 1, 1, 1])); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                                       | Difficulty | Connection                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [First Missing Positive](https://leetcode.com/problems/first-missing-positive/)                                                               | 🔴 Hard    | Find smallest unused positive  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                                               | 🟡 Medium  | Greedy frequency assignment    |
| [Avoid Conflict Between Adjacent Intervals](https://leetcode.com/problems/remove-interval/)                                                   | 🟡 Medium  | Greedy interval adjustment     |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | 🔴 Hard    | Sliding window on sorted array |
| [Seat Reservation Manager](https://leetcode.com/problems/seat-reservation-manager/)                                                           | 🟡 Medium  | Find smallest available slot   |
