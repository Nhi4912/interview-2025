---
layout: page
title: "Missing Element in Sorted Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/missing-element-in-sorted-array"
---

# Missing Element in Sorted Array / Phần Tử Bị Thiếu Trong Mảng Đã Sắp Xếp

🟡 Medium | 🏷️ Array, Binary Search | [LeetCode](https://leetcode.com/problems/missing-element-in-sorted-array)

---

## 🧠 Intuition

**Vietnamese:** Số phần tử bị thiếu trước hoặc tại index i = `nums[i] - nums[0] - i`. Nếu không có số nào thiếu, `nums[i] - nums[0]` sẽ bằng i. Binary search trên index để tìm điểm mà số lượng missing ≥ k.

**Analogy:** Sổ điểm danh có lỗ — đếm số người vắng tính đến trang giữa. Nếu ≥ k người vắng, tìm bên trái; nếu < k người vắng, tìm bên phải.

```
nums = [4, 7, 9, 10]  k=1
missing before index i:
  i=0: 7-4-0=0 (0 missing before 4..7 exclusive: 5,6 → wait: 4-4-0=0)
  Actually: missing(i) = nums[i] - nums[0] - i
  i=0: 4-4-0=0
  i=1: 7-4-1=2  → 2 numbers missing before index 1: {5,6}
  i=2: 9-4-2=3
  i=3: 10-4-3=3

k=1: find smallest i where missing(i) >= 1 → i=1
  answer = nums[i-1] + (k - missing(i-1)) = nums[0] + (1-0) = 5
```

---

## 📝 Interview Tips

- **EN:** `missing(i) = nums[i] - nums[0] - i` counts gaps before index i / **VI:** `missing(i)` đếm số bị thiếu tính đến (không kể) nums[i]
- **EN:** Binary search for first index where missing(i) >= k / **VI:** Binary search index đầu tiên có missing(i) ≥ k
- **EN:** If missing(n-1) < k, answer is beyond the array: `nums[n-1] + remaining` / **VI:** Nếu thiếu tổng < k, đáp án vượt ra ngoài mảng
- **EN:** Answer reconstruction: `nums[left-1] + (k - missing(left-1))` / **VI:** Tái tạo đáp án từ index tìm được
- **EN:** Linear scan O(n) is simpler but binary search O(log n) is optimal / **VI:** Linear O(n) đơn giản hơn nhưng binary search O(log n) tối ưu
- **EN:** Array is sorted with distinct elements — missing values are "gaps" in integer sequence / **VI:** Mảng sắp xếp, phần tử phân biệt — số bị thiếu là "khoảng trống" giữa các số nguyên liên tiếp

---

## Solutions

### Solution 1: Binary Search on Missing Count

```typescript
/**
 * Binary search: find leftmost index where missing count >= k.
 * Time: O(log n)  Space: O(1)
 */
function missingElement(nums: number[], k: number): number {
  const n = nums.length;
  const missing = (i: number) => nums[i] - nums[0] - i;

  // If answer is beyond the array
  if (missing(n - 1) < k) {
    return nums[n - 1] + (k - missing(n - 1));
  }

  // Binary search: find leftmost index where missing(i) >= k
  let lo = 0,
    hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    missing(mid) >= k ? (hi = mid) : (lo = mid + 1);
  }

  // lo is the first index where missing >= k
  // The answer is between nums[lo-1] and nums[lo]
  return nums[lo - 1] + (k - missing(lo - 1));
}

// Tests
console.log(missingElement([4, 7, 9, 10], 1)); // 5
console.log(missingElement([4, 7, 9, 10], 3)); // 8
console.log(missingElement([1, 2, 4], 3)); // 6
console.log(missingElement([1, 2, 4], 1)); // 3
```

### Solution 2: Linear Scan (simpler, O(n))

```typescript
/**
 * Linear scan: maintain count of missing numbers seen so far.
 * Time: O(n)  Space: O(1)
 */
function missingElement2(nums: number[], k: number): number {
  let missingCount = 0;

  for (let i = 1; i < nums.length; i++) {
    const gap = nums[i] - nums[i - 1] - 1; // numbers missing in this gap
    if (missingCount + gap >= k) {
      // Answer is in this gap
      return nums[i - 1] + (k - missingCount);
    }
    missingCount += gap;
  }

  // Answer is after the last element
  return nums[nums.length - 1] + (k - missingCount);
}

// Tests
console.log(missingElement2([4, 7, 9, 10], 1)); // 5
console.log(missingElement2([4, 7, 9, 10], 3)); // 8
console.log(missingElement2([1, 2, 4], 3)); // 6
console.log(missingElement2([1, 2, 4], 1)); // 3
```

### Solution 3: Binary Search with Missing Count Formula (alternate form)

```typescript
/**
 * Alternative BS formulation: search for value directly.
 * Time: O(log n)  Space: O(1)
 */
function missingElement3(nums: number[], k: number): number {
  const n = nums.length;
  // missing(i) = number of integers in [nums[0], nums[i]) that are absent
  // = nums[i] - nums[0] - i

  let lo = 0,
    hi = n; // hi = n means "answer beyond last element"

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const m = mid < n ? nums[mid] - nums[0] - mid : Infinity;
    m < k ? (lo = mid + 1) : (hi = mid);
  }

  // lo is the insertion point
  if (lo === 0) return nums[0] - k; // shouldn't happen with valid input
  const prevMissing = nums[lo - 1] - nums[0] - (lo - 1);
  return nums[lo - 1] + (k - prevMissing);
}

// Tests
console.log(missingElement3([4, 7, 9, 10], 1)); // 5
console.log(missingElement3([4, 7, 9, 10], 3)); // 8
console.log(missingElement3([1, 2, 4], 3)); // 6
```

---

## 🔗 Related Problems

| Problem                                                                                                                               | Difficulty | Connection                         |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)                                                  | 🟡 Medium  | Gap analysis in sorted-like arrays |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                                              | 🟡 Medium  | Binary search on answer            |
| [Find First and Last Position in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | 🟡 Medium  | Binary search boundary             |
