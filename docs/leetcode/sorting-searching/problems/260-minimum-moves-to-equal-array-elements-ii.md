---
layout: page
title: "Minimum Moves to Equal Array Elements II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii"
---

# Minimum Moves to Equal Array Elements II / Số Bước Tối Thiểu Để Làm Mảng Bằng Nhau

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Median Minimization
> **Frequency**: ★★★ Common — câu hỏi cổ điển về median và tối ưu L1
> **See also**: [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn cần dời tất cả mọi người trên một con đường thẳng về cùng một điểm hẹn, sao cho tổng quãng đường đi là nhỏ nhất. Điểm hẹn tối ưu chính là **trung vị** của các vị trí — không phải trung bình cộng! Giống như việc chọn điểm gặp mặt: nếu có 5 người, người thứ 3 (trung vị) là điểm mà tổng khoảng cách nhỏ nhất.

**Pattern Recognition:**

- Signal: "minimize total absolute moves to make all equal" → **Median + Sorting**
- Bài này thuộc dạng tối ưu hoá L1: `min Σ|nums[i] - target|` đạt tối thiểu khi `target = median`
- Key insight: Sắp xếp → lấy trung vị → tính tổng `|nums[i] - median|`

**Visual — Median minimization:**

```
nums = [1, 2, 3]  sorted: [1, 2, 3]
median = nums[1] = 2

cost = |1-2| + |2-2| + |3-2| = 1 + 0 + 1 = 2

Try target=1: |1-1|+|2-1|+|3-1| = 0+1+2 = 3  ❌ worse
Try target=3: |1-3|+|2-3|+|3-3| = 2+1+0 = 3  ❌ worse
Try target=2: 2 ✓ optimal
```

---

## Problem Description

Given integer array `nums`, in one step you can increment or decrement an element by 1. Return the **minimum number of moves** to make all array elements equal. ([LeetCode](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii))

```
Example 1: nums=[1,2,3]       → 2
Example 2: nums=[1,10,2,9]    → 16
```

Constraints: `1 <= nums.length <= 10^5`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Target is median, not mean** — _Trung vị tối thiểu tổng |diff| (L1), trung bình tối thiểu tổng diff² (L2)_
2. **Sort first, then pick middle element** — _Sắp xếp và lấy nums[n/2] làm trung vị_
3. **For even n, any value between two medians works** — _Số chẵn: nums[n/2-1] hoặc nums[n/2] đều cho kết quả như nhau_
4. **Sum absolute differences from median** — _Tổng tất cả |nums[i] - median|_
5. **Brute O(n²) tries all candidates; O(n log n) with sort** — _Brute force thử mọi giá trị, tối ưu chỉ cần sort_
6. **Alternative: Two-pointer proof** — _Có thể dùng 2 con trỏ: pairs (L,R) cancel, each pair contributes R-L_

---

## Solutions

```typescript
/** Solution 1: Sort + Median @complexity Time: O(n log n) | Space: O(1) */
function minMoves2(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const median = nums[nums.length >> 1];
  return nums.reduce((sum, v) => sum + Math.abs(v - median), 0);
}

/** Solution 2: Two-pointer proof (cancel pairs) @complexity Time: O(n log n) | Space: O(1) */
function minMoves2TwoPointer(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let moves = 0;
  let left = 0,
    right = nums.length - 1;
  // Each pair (left, right) contributes exactly right - left moves
  // regardless of where they meet (both will meet at median)
  while (left < right) {
    moves += nums[right] - nums[left];
    left++;
    right--;
  }
  return moves;
}

/** Solution 3: Quick select for O(n) average @complexity Time: O(n) avg | Space: O(1) */
function minMoves2QuickSelect(nums: number[]): number {
  const n = nums.length;
  const k = n >> 1;

  // Partition-based selection (Lomuto)
  const partition = (lo: number, hi: number): number => {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (nums[j] <= pivot) [nums[i], nums[j]] = [nums[j], nums[i++]];
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
  };

  let lo = 0,
    hi = n - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === k) break;
    else if (p < k) lo = p + 1;
    else hi = p - 1;
  }

  const median = nums[k];
  return nums.reduce((s, v) => s + Math.abs(v - median), 0);
}

// === Test Cases ===
console.log(minMoves2([1, 2, 3])); // 2
console.log(minMoves2([1, 10, 2, 9])); // 16
console.log(minMoves2([1, 1000000000])); // 999999999
```

---

## 🔗 Related Problems

| #   | Problem                                                                                             | Difficulty | Pattern                 |
| --- | --------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| 1   | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | Hard       | Ternary Search / Median |
| 2   | [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal/)             | Medium     | GCD + Median            |
| 3   | [Minimum Average Difference](https://leetcode.com/problems/minimum-average-difference/)             | Medium     | Prefix Sum              |
| 4   | [Best Meeting Point](https://leetcode.com/problems/best-meeting-point/)                             | Hard       | Median                  |
