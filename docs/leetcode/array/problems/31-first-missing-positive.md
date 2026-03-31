---
layout: page
title: "First Missing Positive"
difficulty: Hard
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/first-missing-positive"
---

# First Missing Positive / Số Dương Nhỏ Nhất Còn Thiếu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Index as Hash (Cyclic Sort)
> **Frequency**: ⭐ Tier 2 — Gặp ở 40+ companies
> **See also**: [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) | [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng phòng ký túc xá có n phòng đánh số 1..n. Mỗi sinh viên có mã số riêng. Nếu sinh viên mã `k` nằm trong khoảng [1..n], hãy cho họ vào đúng phòng `k`. Sau khi sắp xếp, phòng nào còn trống (index không khớp) → đó là số thiếu đầu tiên.

- **Pattern Recognition:**
  - Signal: "O(1) space" + "find missing in range [1..n]" → **Index as Hash**
  - Dùng chính mảng làm bảng hash: đặt `nums[i]` vào vị trí `nums[i]-1`
  - Answer nằm trong [1..n+1] — nếu 1..n đủ cả thì answer là n+1

- **Visual — nums = [3, 4, -1, 1]:**

```
Initial:  [3, 4, -1, 1]   (indices: 0 1 2 3)

Cyclic placement (swap each num to its "home"):
  nums[0]=3 → swap with nums[2]:   [-1, 4,  3, 1]
  nums[0]=-1 → out of range, skip
  nums[1]=4 → swap with nums[3]:   [-1, 1,  3, 4]
  nums[1]=1 → swap with nums[0]:   [ 1,-1,  3, 4]
  nums[1]=-1 → skip
  nums[2]=3 → already at index 2, skip
  nums[3]=4 → already at index 3, skip

Final:    [ 1, -1,  3,  4]
           ✓   ✗   ✓   ✓
Index:     0   1   2   3

nums[1] = -1 ≠ 2  →  answer = 2 ✓
```

---

## Problem Description

Given an unsorted integer array `nums`, return the **smallest missing positive integer**.
Must run in O(n) time and O(1) extra space.

```
Input:  [1,2,0]       → 3
Input:  [3,4,-1,1]    → 2
Input:  [7,8,9,11,12] → 1
```

Constraints: `1 ≤ n ≤ 10^5`, `-2^31 ≤ nums[i] ≤ 2^31 - 1`.

---

## 📝 Interview Tips

1. **Key insight**: Answer là trong [1..n+1] — nếu 1..n đều có mặt thì answer = n+1 / **Range insight**: missing positive is always in [1, n+1]
2. **Dùng array như hashtable**: Swap `nums[i]` về vị trí `nums[i]-1` nếu nằm trong range / **In-place hash**: treat index `i` as bucket for value `i+1`
3. **While loop khi swap**: Tiếp tục swap cho đến khi phần tử ở đúng chỗ hoặc ra ngoài range / **Keep swapping** until element is in correct slot or out of range
4. **Tránh vòng lặp vô tận**: Nếu `nums[nums[i]-1] === nums[i]` (duplicate) thì break / **Break on duplicate** to avoid infinite swap loop
5. **Lần quét thứ 2**: Tìm index đầu tiên có `nums[i] !== i+1` / **Second pass**: first index where `nums[i] !== i+1` is the answer

---

## Solutions

```typescript
/**
 * Solution 1: HashSet
 * Time: O(n) | Space: O(n)
 */
function firstMissingPositiveHash(nums: number[]): number {
  const seen = new Set(nums);
  for (let i = 1; i <= nums.length + 1; i++) {
    if (!seen.has(i)) return i;
  }
  return nums.length + 1;
}

/**
 * Solution 2: Index as Hash (Cyclic Sort) — O(1) space
 * Time: O(n) | Space: O(1)
 */
function firstMissingPositive(nums: number[]): number {
  const n = nums.length;

  // Phase 1: place each num in its "home" position (num-1)
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const home = nums[i] - 1;
      [nums[i], nums[home]] = [nums[home], nums[i]];
    }
  }

  // Phase 2: first index where value doesn't match
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}

// === Test Cases ===
console.log(firstMissingPositive([1, 2, 0])); // 3
console.log(firstMissingPositive([3, 4, -1, 1])); // 2
console.log(firstMissingPositive([7, 8, 9, 11, 12])); // 1
console.log(firstMissingPositive([1])); // 2
console.log(firstMissingPositive([1, 2, 3])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                                           |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array) | Same cyclic sort technique, find ALL missing in [1..n] |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)                               | Index-as-hash pattern for O(1) space detection         |
| [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)                         | Similar "find gap in sequence" problem with HashSet    |
| [Missing Number](https://leetcode.com/problems/missing-number)                                                     | Simpler version: find single missing in [0..n]         |
