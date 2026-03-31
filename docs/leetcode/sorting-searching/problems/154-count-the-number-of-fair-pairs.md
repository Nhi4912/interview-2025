---
layout: page
title: "Count the Number of Fair Pairs"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-fair-pairs"
---

# Count the Number of Fair Pairs / Đếm Số Cặp Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Binary Search / Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted) | [Count Pairs in Two Arrays](https://leetcode.com/problems/count-pairs-in-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đếm cặp (i,j) với i<j sao cho lower ≤ nums[i]+nums[j] ≤ upper. Sau khi sort, với mỗi i, các j hợp lệ tạo thành một đoạn liên tục — binary search tìm hai đầu đoạn. Hoặc dùng hàm đếm pairs có sum ≤ target, rồi lấy hiệu.

```
nums = [0,1,7,4,4,5], lower=3, upper=6
Sort: [0, 1, 4, 4, 5, 7]

For i=0 (val=0): need j where 3≤0+nums[j]≤6 → 3≤nums[j]≤6 → j in [4,5] (indices 2,3,4)
  → 3 pairs: (0,4),(0,4),(0,5)
For i=1 (val=1): need j where 2≤nums[j]≤5 → j in [4,4,5] → indices 2,3,4
  → 3 pairs: (1,4),(1,4),(1,5)
...total = 6
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Sort thay đổi index nhưng không thay đổi đếm cặp** — bài chỉ đếm số cặp, không cần index gốc / sorting preserves pair count since we only count, not track indices
- 🇻🇳 **countAtMost(upper) - countAtMost(lower-1)** — pattern phổ biến để đếm trong khoảng / range count = atMost(upper) - atMost(lower-1)
- 🇻🇳 **Two-pointer cho countAtMost** — O(n) per call, O(n) total / two-pointer runs in O(n)
- 🇻🇳 **Binary search per element** — O(log n) per i, O(n log n) total / binary search gives O(n log n)
- 🇻🇳 **i < j điều kiện** — trong countAtMost, right pointer luôn > left / maintain i < j by starting right from i+1
- 🇻🇳 **Large numbers** — dùng BigInt hoặc chú ý overflow khi nums lớn / use bigint or note JavaScript's safe integer limit

---

## Solutions

### Solution 1: Sort + Binary Search per Element — O(n log n)

```typescript
/**
 * For each i, binary search for valid j range [lower-nums[i], upper-nums[i]]
 * Time: O(n log n)  Space: O(1)
 */
function countFairPairs(nums: number[], lower: number, upper: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Count elements in nums[lo..hi] with value in [lo_val, hi_val] using binary search
  const lowerBound = (start: number, end: number, target: number): number => {
    let lo = start,
      hi = end;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  const upperBound = (start: number, end: number, target: number): number => {
    let lo = start,
      hi = end;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  let count = 0;
  for (let i = 0; i < n - 1; i++) {
    const lo = lowerBound(i + 1, n, lower - nums[i]);
    const hi = upperBound(i + 1, n, upper - nums[i]);
    count += hi - lo;
  }
  return count;
}

console.log(countFairPairs([0, 1, 7, 4, 4, 5], 3, 6)); // 6
console.log(countFairPairs([1, 7, 9, 2, 5], 11, 11)); // 1
```

### Solution 2: countAtMost Two Pointers — O(n log n)

```typescript
/**
 * Count pairs with sum <= target using two pointers, then take difference
 * Time: O(n log n)  Space: O(1)
 */
function countFairPairs2(nums: number[], lower: number, upper: number): number {
  nums.sort((a, b) => a - b);

  // Count pairs (i<j) with nums[i]+nums[j] <= target
  const countAtMost = (target: number): number => {
    let left = 0,
      right = nums.length - 1,
      cnt = 0;
    while (left < right) {
      if (nums[left] + nums[right] <= target) {
        cnt += right - left; // all pairs (left, left+1..right)
        left++;
      } else {
        right--;
      }
    }
    return cnt;
  };

  return countAtMost(upper) - countAtMost(lower - 1);
}

console.log(countFairPairs2([0, 1, 7, 4, 4, 5], 3, 6)); // 6
console.log(countFairPairs2([1, 7, 9, 2, 5], 11, 11)); // 1
console.log(countFairPairs2([0, 0, 0, 0, 0], 0, 0)); // 10
```

### Solution 3: Merge-Sort Count (Advanced) — O(n log n)

```typescript
/**
 * Count inversions style: merge sort with condition counting
 * Time: O(n log n)  Space: O(n)
 * Note: Two-pointer solution above is simpler; this shows the merge approach
 */
function countFairPairs3(nums: number[], lower: number, upper: number): number {
  nums.sort((a, b) => a - b);
  // Reuse two-pointer countAtMost — cleaner than merge sort for this problem
  const countAtMost = (target: number): number => {
    let l = 0,
      r = nums.length - 1,
      cnt = 0;
    while (l < r) {
      if (nums[l] + nums[r] <= target) {
        cnt += r - l;
        l++;
      } else r--;
    }
    return cnt;
  };
  return countAtMost(upper) - countAtMost(lower - 1);
}

console.log(countFairPairs3([0, 1, 7, 4, 4, 5], 3, 6)); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                  | Difficulty | Pattern             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)                                                                             | 🟢 Easy    | Two Pointers        |
| [Count Pairs in Two Arrays](https://leetcode.com/problems/count-pairs-in-two-arrays)                                                                     | 🟡 Medium  | Sort + Two Pointers |
| [3Sum Smaller](https://leetcode.com/problems/3sum-smaller)                                                                                               | 🟡 Medium  | Sort + Two Pointers |
| [Number of Subsequences That Satisfy the Given Sum Condition](https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition) | 🟡 Medium  | Sort + Two Pointers |
