---
layout: page
title: "Special Array II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/special-array-ii"
---

# Special Array II / Mảng Đặc Biệt II

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum for Range Queries
> **Frequency**: ★★☆ Occasional — prefix sum với binary search để xử lý nhiều queries
> **See also**: [Special Array With X Elements Greater Than or Equal X](https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/) | [Range Sum Query](https://leetcode.com/problems/range-sum-query-immutable/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang kiểm tra xem một đoạn đường có "xen kẽ" giữa đường một chiều và đường hai chiều hay không. Bạn đánh dấu mỗi điểm chuyển tiếp (chẵn→lẻ hoặc lẻ→chẵn). Sau đó, mọi câu hỏi "đoạn [from, to] có xen kẽ không?" chỉ cần kiểm tra xem có điểm chuyển tiếp nào trong đoạn đó không — dùng prefix sum để trả lời O(1) mỗi query.

**Pattern Recognition:**

- Signal: "multiple range queries" + "check alternating parity" → **Prefix Sum + Binary Search**
- Bài này thuộc dạng xây dựng prefix sum về số lần vi phạm tính xen kẽ, sau đó query O(1)
- Key insight: Mảng đặc biệt ↔ không có hai phần tử liền kề cùng tính chẵn/lẻ trong đoạn [from, to]

**Visual — Prefix sum of parity breaks:**

```
nums   = [4, 3, 1, 6]
parity = [E, O, O, E]  (E=even, O=odd)

breaks[i] = 1 if nums[i] and nums[i-1] have same parity
breaks = [0, 0, 1, 0]   (index 2: O-O break)

prefix = [0, 0, 1, 1]

Query [0,3]: breaks in range = prefix[3] - prefix[0] = 1 > 0 → NOT special
Query [0,1]: breaks in range = prefix[1] - prefix[0] = 0    → special ✓
```

---

## Problem Description

An array is **special** if every pair of adjacent elements has different parity (one even, one odd). Given `nums` and `queries[i] = [from_i, to_i]`, return boolean array where each entry indicates if `nums[from_i..to_i]` is special. ([LeetCode](https://leetcode.com/problems/special-array-ii))

```
Example 1: nums=[3,4,1,2,6], queries=[[0,4]]  → [false]
Example 2: nums=[4,3,1,6],   queries=[[0,2],[2,3]] → [false,true]
```

Constraints: `1 <= nums.length <= 10^5`, `1 <= queries.length <= 10^5`

---

## 📝 Interview Tips

1. **Precompute parity break positions** — _Đánh dấu vị trí i nơi nums[i] và nums[i-1] cùng tính chẵn/lẻ_
2. **Build prefix sum of breaks** — _prefix[i] = số lần vi phạm trong nums[0..i-1]_
3. **Query in O(1): check if breaks in range > 0** — _Nếu prefix[to+1] - prefix[from] > 0 thì không đặc biệt_
4. **Subarray is special iff zero breaks** — _Không có điểm vi phạm nào trong đoạn → đặc biệt_
5. **Alternative: binary search on break positions** — _Lưu mảng vị trí vi phạm, dùng binary search để đếm_
6. **Time O(n + q), Space O(n)** — _Tiền xử lý O(n), mỗi query O(1)_

---

## Solutions

```typescript
/** Solution 1: Brute Force per query @complexity Time: O(n*q) | Space: O(1) */
function isArraySpecialBrute(nums: number[], queries: number[][]): boolean[] {
  return queries.map(([from, to]) => {
    for (let i = from + 1; i <= to; i++) {
      if (nums[i] % 2 === nums[i - 1] % 2) return false;
    }
    return true;
  });
}

/** Solution 2: Prefix Sum of parity breaks @complexity Time: O(n + q) | Space: O(n) */
function isArraySpecial(nums: number[], queries: number[][]): boolean[] {
  const n = nums.length;
  // prefix[i] = number of parity breaks in nums[0..i-1]
  const prefix = new Int32Array(n + 1);
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] + (nums[i] % 2 === nums[i - 1] % 2 ? 1 : 0);
  }
  prefix[n] = prefix[n - 1];

  return queries.map(([from, to]) => {
    // breaks in [from, to] = breaks ending before 'to' minus breaks before 'from'
    return prefix[to] - prefix[from] === 0;
  });
}

// === Test Cases ===
console.log(isArraySpecial([3, 4, 1, 2, 6], [[0, 4]]).toString()); // false
console.log(
  isArraySpecial(
    [4, 3, 1, 6],
    [
      [0, 2],
      [2, 3],
    ],
  ).toString(),
); // false,true
console.log(isArraySpecial([1], [[0, 0]]).toString()); // true
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                 | Difficulty | Pattern        |
| --- | ------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 1   | [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/)                 | Easy       | Prefix Sum     |
| 2   | [Special Array I](https://leetcode.com/problems/special-array-with-x-elements-greater-than-or-equal-x/) | Easy       | Binary Search  |
| 3   | [Count Vowel Substrings](https://leetcode.com/problems/count-vowel-substrings-of-a-string/)             | Easy       | Sliding Window |
| 4   | [Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/)   | Medium     | Prefix Sum     |
