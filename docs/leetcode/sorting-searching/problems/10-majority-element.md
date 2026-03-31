---
layout: page
title: "Majority Element"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Divide and Conquer, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/majority-element"
---

# Majority Element / Tìm Phần Tử Đa Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Boyer-Moore Voting Algorithm
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Majority Element II](https://leetcode.com/problems/majority-element-ii) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng cuộc bầu cử hội trưởng lớp. Mỗi học sinh đứng lên ủng hộ một bạn. Nếu hai học sinh ủng hộ khác nhau thì cả hai ngồi xuống (triệt tiêu nhau). Vì hội trưởng được hơn nửa lớp ủng hộ, cuối cùng bạn đó sẽ còn đứng một mình — đó chính là đáp án.

**Pattern Recognition:**

- Signal: "majority element appears > n/2 times" + "find in O(n) O(1)" → **Boyer-Moore Voting**
- Nếu thấy "tìm phần tử xuất hiện nhiều hơn n/2 lần" → nghĩ ngay Boyer-Moore
- Key insight: majority và minority cancel nhau. Phần tử đa số luôn sống sót

**Visual — Boyer-Moore on [2, 2, 1, 1, 1, 2, 2]:**

```
nums: [2,  2,  1,  1,  1,  2,  2]
       ↑
candidate=2, count=1

i=1: nums[1]=2 == candidate → count=2
i=2: nums[2]=1 ≠ candidate → count=1
i=3: nums[3]=1 ≠ candidate → count=0  ← reset!
i=4: nums[4]=1, count=0 → candidate=1, count=1
i=5: nums[5]=2 ≠ candidate → count=0  ← reset!
i=6: nums[6]=2, count=0 → candidate=2, count=1

Final candidate = 2 ✅  (majority is always the last survivor)
```

---

## Problem Description

Given an array `nums` of size `n`, return the majority element — the element that appears **more than ⌊n/2⌋ times**. You may assume the majority element always exists in the array. ([LeetCode 169](https://leetcode.com/problems/majority-element))

```
Input: nums = [3, 2, 3]          → Output: 3
Input: nums = [2, 2, 1, 1, 1, 2, 2] → Output: 2
Input: nums = [1]                → Output: 1
```

Constraints: `1 <= n <= 5×10⁴`, `-10⁹ <= nums[i] <= 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Guaranteed majority exists? / Có chắc chắn phần tử đa số tồn tại không?" — Confirm the guarantee; without it you'd need a verification step
2. **Brute force**: "HashMap đếm tần suất O(n) time/space" / HashMap counting is the natural first step
3. **Optimize**: "Boyer-Moore: dùng 1 biến candidate + 1 biến count, O(1) space" / One pass, constant space
4. **Sorting trick**: "Sort rồi lấy nums[n/2] cũng được O(n log n)" / Sorted middle is always majority
5. **Proof**: "Vì majority > n/2 nên dù bị triệt tiêu tối đa, nó vẫn còn lại" / Majority outlasts all cancellations
6. **Follow-up**: "Nếu không có guarantee thì cần verify candidate một lần nữa" / Without guarantee, do a count pass after

---

## Solutions

```typescript
/**
 * Solution 1: HashMap Count
 * Name: Frequency Map
 * Time: O(n) — one pass to count, one pass to find max
 * Space: O(n) — hash map stores up to n/2 + 1 unique values
 */
function majorityElementHashMap(nums: number[]): number {
  const count = new Map<number, number>();
  const threshold = Math.floor(nums.length / 2);

  for (const n of nums) {
    const c = (count.get(n) ?? 0) + 1;
    if (c > threshold) return n;
    count.set(n, c);
  }
  return -1; // unreachable if majority guaranteed
}

/**
 * Solution 2: Boyer-Moore Voting Algorithm (Optimal)
 * Name: Boyer-Moore Voting
 * Time: O(n) — single pass
 * Space: O(1) — two variables only
 */
function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let count = 1;

  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i]; // reset to new candidate
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--; // cancel out one vote
    }
  }

  return candidate; // majority always survives
}

/**
 * Solution 3: Sort-and-Pick Middle
 * Name: Sort Middle
 * Time: O(n log n) — sorting dominates
 * Space: O(1) — sort in place (or O(n) with spread)
 */
function majorityElementSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  return nums[Math.floor(nums.length / 2)]; // middle always holds majority
}

// === Test Cases ===
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElement([1])); // 1
console.log(majorityElementHashMap([6, 5, 5])); // 5
console.log(majorityElementSort([1, 3, 1, 1, 3])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                    | Relationship                                                 |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [Majority Element II](https://leetcode.com/problems/majority-element-ii)                   | Extended: find elements > n/3, uses 2 Boyer-Moore candidates |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)       | Same cycle/counting intuition                                |
| [Single Number](https://leetcode.com/problems/single-number)                               | Cancellation via XOR instead of counter                      |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)           | Frequency counting generalized to top-k                      |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | HashMap + sort by frequency                                  |
