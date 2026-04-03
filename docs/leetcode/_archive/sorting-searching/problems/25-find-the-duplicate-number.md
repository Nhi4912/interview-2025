---
layout: page
title: "Find the Duplicate Number"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/find-the-duplicate-number"
---

# Find the Duplicate Number / Tìm Số Trùng Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Floyd's Cycle Detection
> **Frequency**: 📗 Tier 2 — Gặp ở 30+ companies
> **See also**: [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình dung mảng như những biển chỉ đường: vị trí `i` trỏ đến vị trí `nums[i]`. Vì có số trùng, hai con đường khác nhau sẽ gặp nhau — giống phát hiện vòng lặp trong linked list!

**Pattern Recognition:**

- Signal: "n+1 số trong [1,n]" → **Pigeonhole: chắc chắn có duplicate**
- Không dùng extra space → **Floyd's cycle detection** hoặc **binary search on answer**
- Key insight: `nums[i]` là "next pointer" → biến bài toán thành "Linked List Cycle II"

**Visual — Floyd's Cycle on `[1,3,4,2,2]`:**

```
index: 0  1  2  3  4
value: 1  3  4  2  2

next pointers: 0→1→3→2→4→2 (cycle: 2→4→2)

Phase 1 (find meeting):
  slow: 0→1→3→2→4→2   fast: 0→3→4→2→4→2
  meet at index 2

Phase 2 (find entrance):
  reset slow=0, step both by 1
  slow: 0→1→3→2   fast: 2→4→2
  meet at index 2  ✅ (duplicate = 2)
```

---

## Problem Description

Given an array `nums` of `n+1` integers where each integer is in `[1, n]`, there is exactly one repeated number. Return it without modifying the array and using only O(1) extra space. ([LeetCode 287](https://leetcode.com/problems/find-the-duplicate-number))

**Example 1:** `nums = [1,3,4,2,2]` → `2`
**Example 2:** `nums = [3,1,3,4,2]` → `3`

**Constraints:** `2 ≤ n ≤ 10⁵`, `nums.length == n+1`, `1 ≤ nums[i] ≤ n`, exactly one duplicate value

---

## 📝 Interview Tips

1. **Clarify**: "Có được sửa mảng không? Được dùng O(n) space không?" / Can we modify the array or use O(n) extra space?
2. **Brute force**: "Sort rồi tìm adjacent equal — O(n log n) nhưng modify mảng" / Sort and scan, but it modifies the array
3. **Floyd's**: "Treat array as linked list: `next[i] = nums[i]` → cycle entrance = duplicate" / The duplicate creates two paths to the same node
4. **Binary search**: "Count elements ≤ mid: nếu count > mid → duplicate trong [1..mid]" / Count-based binary search on value range
5. **Edge cases**: "Duplicate xuất hiện nhiều lần vẫn đúng với Floyd's" / Works even if the duplicate appears more than twice
6. **Follow-up**: "Multiple duplicates → cần HashSet O(n)" / Finding all duplicates requires O(n) space

---

## Solutions

```typescript
/**
 * Solution 1: Sort then scan adjacent
 * Sort a copy, find first adjacent equal pair.
 * Time: O(n log n) — dominated by sort
 * Space: O(n) — copy of array (cannot modify original)
 */
function findDuplicateSort(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) return s[i];
  }
  return -1;
}

/**
 * Solution 2: Floyd's Cycle Detection (Optimal)
 * Map the array to a linked list where node i points to nums[i].
 * The duplicate creates two nodes pointing to the same next node → cycle.
 * Cycle entrance = duplicate value.
 * Time: O(n) — two linear passes
 * Space: O(1) — only two pointer variables
 */
function findDuplicate(nums: number[]): number {
  // Phase 1: find meeting point inside the cycle
  let slow = nums[0];
  let fast = nums[nums[0]];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }

  // Phase 2: find cycle entrance (= duplicate number)
  slow = 0;
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

/**
 * Solution 3: Binary Search on Value Range
 * For midpoint `mid` in [1,n], count numbers ≤ mid.
 * If count > mid, duplicate is in [1..mid] (pigeonhole); else [mid+1..n].
 * Time: O(n log n) — log n rounds × O(n) count per round
 * Space: O(1) — no extra data structures
 */
function findDuplicateBinarySearch(nums: number[]): number {
  let lo = 1,
    hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const count = nums.reduce((acc, n) => acc + (n <= mid ? 1 : 0), 0);
    if (count > mid)
      hi = mid; // duplicate is in [lo..mid]
    else lo = mid + 1; // duplicate is in [mid+1..hi]
  }
  return lo;
}

// === Test Cases ===
console.log(findDuplicate([1, 3, 4, 2, 2])); // 2
console.log(findDuplicate([3, 1, 3, 4, 2])); // 3
console.log(findDuplicateBinarySearch([1, 3, 4, 2, 2])); // 2
console.log(findDuplicateBinarySearch([3, 1, 3, 4, 2])); // 3
console.log(findDuplicateSort([2, 2, 2, 2, 2])); // 2
```

---

## 🔗 Related Problems

| Problem                                                                        | Pattern           | Difficulty |
| ------------------------------------------------------------------------------ | ----------------- | ---------- |
| [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii)     | Floyd's algorithm | 🟡 Medium  |
| [Missing Number](https://leetcode.com/problems/missing-number)                 | Math / XOR        | 🟢 Easy    |
| [First Missing Positive](https://leetcode.com/problems/first-missing-positive) | Index marking     | 🔴 Hard    |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch)                     | XOR duplicate     | 🟢 Easy    |
