---
layout: page
title: "Minimum Operations to Reduce X to Zero"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Binary Search, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero"
---

# Minimum Operations to Reduce X to Zero / Số Phép Toán Tối Thiểu Để Giảm X Về Không

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window (complement thinking)
> **Frequency**: ★★★ Common — classic sliding window với tư duy đảo ngược bài toán
> **See also**: [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Thay vì cắt phần rìa của một cái bánh để lấy đúng x gram, hãy tìm phần **giữa** của cái bánh có trọng lượng bằng `tổng - x`. Cắt ít nhất từ ngoài vào = giữ lại phần giữa dài nhất. Đây là "complement thinking" — thay vì tìm phần nhỏ ở hai đầu, tìm phần lớn nhất ở giữa.

**Pattern Recognition:**

- Signal: "remove from both ends" + "reach target sum" → **Sliding Window (complement)**
- Bài này thuộc dạng Sliding Window với tư duy: tối thiểu phần ngoài = tối đa phần giữa
- Key insight: `minimum removed = n - maximum subarray length with sum = total - x`

**Visual — Complement sliding window:**

```
nums = [1,1,4,2,3], x = 5, total = 11
target_middle = total - x = 11 - 5 = 6

Find longest subarray with sum = 6:
[1,1,4,2,3]
 ←L   R→   sum=1+1+4=6 len=3 ✓
   ←L  R→  sum=1+4+2=7 shrink
    L→R→   sum=4+2=6   len=2
     L R→  sum=4+2+3=9 shrink
           ...

Longest middle = 3 (indices 0-2)
Answer = 5 - 3 = 2
```

---

## Problem Description

Given integer array `nums` and integer `x`, in one operation you can remove either the leftmost or rightmost element and reduce `x` by that element's value. Return the **minimum number of operations** to reduce `x` to exactly 0, or -1 if impossible. ([LeetCode](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero))

```
Example 1: nums=[1,1,4,2,3], x=5  → 2
Example 2: nums=[5,6,7,8,9], x=4  → -1
Example 3: nums=[3,2,20,1,1,3],x=10 → 5
```

Constraints: `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^4`, `1 <= x <= 10^9`

---

## 📝 Interview Tips

1. **Flip the problem: find longest middle subarray** — _Thay vì bỏ từ hai đầu, tìm đoạn giữa dài nhất có tổng = total-x_
2. **If total < x → impossible immediately** — _Nếu tổng toàn mảng nhỏ hơn x, không thể đạt được_
3. **Sliding window on the complement target** — _Cửa sổ trượt với target = total - x; mở rộng phải, co lại trái khi vượt_
4. **Handle total == x edge case** — _Nếu total == x thì target=0, ans=n (lấy hết)_
5. **If no valid middle exists, return -1** — _Nếu không tìm được đoạn giữa hợp lệ, trả về -1_
6. **Time O(n), Space O(1)** — _Single pass sliding window, không cần bộ nhớ thêm_

---

## Solutions

```typescript
/** Solution 1: Hash Map (prefix sum) @complexity Time: O(n) | Space: O(n) */
function minOperationsPrefixMap(nums: number[], x: number): number {
  const total = nums.reduce((s, v) => s + v, 0);
  const target = total - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;

  const map = new Map<number, number>([[0, -1]]);
  let sum = 0,
    maxLen = -1;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (map.has(sum - target)) maxLen = Math.max(maxLen, i - map.get(sum - target)!);
    if (!map.has(sum)) map.set(sum, i);
  }
  return maxLen === -1 ? -1 : nums.length - maxLen;
}

/** Solution 2: Sliding Window (optimal) @complexity Time: O(n) | Space: O(1) */
function minOperations(nums: number[], x: number): number {
  const total = nums.reduce((s, v) => s + v, 0);
  const target = total - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;

  let left = 0,
    sum = 0,
    maxLen = -1;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > target && left <= right) sum -= nums[left++];
    if (sum === target) maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen === -1 ? -1 : nums.length - maxLen;
}

// === Test Cases ===
console.log(minOperations([1, 1, 4, 2, 3], 5)); // 2
console.log(minOperations([5, 6, 7, 8, 9], 4)); // -1
console.log(minOperations([3, 2, 20, 1, 1, 3], 10)); // 5
console.log(minOperations([1, 1], 3)); // -1
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                               | Difficulty | Pattern        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1   | [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)                                                 | Medium     | Sliding Window |
| 2   | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)                                                         | Medium     | Prefix Sum     |
| 3   | [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)                                                   | Medium     | Sliding Window |
| 4   | [Longest Subarray of 1s After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | Medium     | Sliding Window |
