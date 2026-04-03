---
layout: page
title: "Find the Longest Equal Subarray"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Binary Search, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-the-longest-equal-subarray"
---

# Find the Longest Equal Subarray / Tìm Mảng Con Bằng Nhau Dài Nhất

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window on Grouped Indices
> **Frequency**: ★★☆ Occasional — kết hợp grouping theo giá trị và sliding window
> **See also**: [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn muốn xếp một nhóm học sinh mặc cùng màu áo vào hàng dài nhất — nhưng bạn được phép đuổi tối đa k học sinh mặc màu khác ra khỏi hàng. Với mỗi màu áo, bạn chỉ cần xét các vị trí của học sinh đó, rồi dùng sliding window để tìm cửa sổ chứa nhiều nhất học sinh cùng màu với số học sinh "bị đuổi" ≤ k.

**Pattern Recognition:**

- Signal: "longest subarray of equal elements after removing ≤ k elements" → **Group by value + Sliding Window**
- Bài này thuộc dạng: nhóm các vị trí có cùng giá trị, sau đó trượt cửa sổ trên từng nhóm
- Key insight: Với nhóm chứa indices `[i0, i1, ..., im]`, window `[L, R]` cần loại bỏ `(indices[R]-indices[L]) - (R-L)` phần tử khác

**Visual — Group + sliding window:**

```
nums = [1,3,2,3,1,3], k = 3

Group 1: positions [0, 4]
Group 3: positions [1, 3, 5]
Group 2: positions [2]

For group 3: [1, 3, 5]
  Window [1,3]: span=(5-1)=4, count=3, removals=4-2=2 ≤ 3 ✓ len=3
  → ans = max(ans, 3) = 3

Answer: 3
```

---

## Problem Description

Given array `nums` and integer `k`, delete at most `k` elements. Return the length of the **longest resulting subarray containing equal elements**. ([LeetCode](https://leetcode.com/problems/find-the-longest-equal-subarray))

```
Example 1: nums=[1,3,2,3,1,3], k=3  → 3
Example 2: nums=[1,1,2,2,1,1], k=2  → 4
```

Constraints: `1 <= nums.length <= 10^5`, `1 <= nums[i] <= nums.length`, `0 <= k <= nums.length`

---

## 📝 Interview Tips

1. **Group indices by value** — _Với mỗi giá trị, thu thập tất cả vị trí xuất hiện của nó_
2. **Sliding window on each group's index list** — _Trượt cửa sổ [L,R] trên mảng vị trí của từng giá trị_
3. **Removals = span - count = (positions[R] - positions[L]) - (R - L)** — _Số phần tử phải xoá = khoảng cách trừ số phần tử trong nhóm_
4. **Shrink window when removals > k** — _Khi cần xoá quá k phần tử, thu hẹp cửa sổ từ trái_
5. **Answer = max window size (R - L + 1) across all groups** — _Kết quả là kích thước cửa sổ lớn nhất_
6. **Time O(n), Space O(n)** — _Mỗi phần tử được xét một lần trong grouping và sliding window_

---

## Solutions

```typescript
/** Solution 1: Brute Force @complexity Time: O(n²) | Space: O(n) */
function longestEqualSubarrayBrute(nums: number[], k: number): number {
  let ans = 1;
  for (let i = 0; i < nums.length; i++) {
    let count = 1,
      deletions = 0;
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] === nums[i]) count++;
      else deletions++;
      if (deletions > k) break;
      ans = Math.max(ans, count);
    }
  }
  return ans;
}

/** Solution 2: Group by value + Sliding Window @complexity Time: O(n) | Space: O(n) */
function longestEqualSubarray(nums: number[], k: number): number {
  // Group positions by value
  const groups = new Map<number, number[]>();
  for (let i = 0; i < nums.length; i++) {
    if (!groups.has(nums[i])) groups.set(nums[i], []);
    groups.get(nums[i])!.push(i);
  }

  let ans = 1;
  for (const positions of groups.values()) {
    // Sliding window on positions array
    // removals needed for window [L, R] = (positions[R] - positions[L]) - (R - L)
    let left = 0;
    for (let right = 0; right < positions.length; right++) {
      // While removals exceed k, shrink left
      while (positions[right] - positions[left] - (right - left) > k) {
        left++;
      }
      ans = Math.max(ans, right - left + 1);
    }
  }
  return ans;
}

// === Test Cases ===
console.log(longestEqualSubarray([1, 3, 2, 3, 1, 3], 3)); // 3
console.log(longestEqualSubarray([1, 1, 2, 2, 1, 1], 2)); // 4
console.log(longestEqualSubarray([1], 0)); // 1
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                               | Difficulty | Pattern        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1   | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                                   | Medium     | Sliding Window |
| 2   | [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | Medium     | Sliding Window |
| 3   | [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/)                       | Medium     | Sliding Window |
| 4   | [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/)                       | Medium     | Sliding Window |
