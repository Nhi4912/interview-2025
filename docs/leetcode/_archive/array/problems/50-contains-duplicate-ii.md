---
layout: page
title: "Contains Duplicate II"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/contains-duplicate-ii"
---

# Contains Duplicate II / Chứa Phần Tử Trùng Lặp II

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) | [Count Zero Request Servers](https://leetcode.com/problems/count-zero-request-servers)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn dạo quanh khu phố, mang theo một danh sách ghi nhớ tối đa `k` ngôi nhà gần nhất. Khi thấy ngôi nhà có số hiệu đã trong danh sách → bingo! Nếu danh sách đầy, xóa ngôi nhà cũ nhất trước khi thêm mới. Đây chính là cửa sổ trượt kích thước `k`.

**Pattern Recognition:**

- Signal: "duplicate within distance k" → **Sliding Window of size k** using a Set
- Maintain a Set of at most `k` elements (the current window)
- Slide: add `nums[i]`, evict `nums[i - k]` when window exceeds size `k`

**Visual — `nums = [1,2,3,1,2,3], k = 2`:**

```
Window size <= k=2
i=0: val=1, set={} → no dup → add 1  set={1}
i=1: val=2, set={1} → no dup → add 2  set={1,2}
i=2: val=3, set={1,2} → no dup → evict nums[0]=1, add 3  set={2,3}
i=3: val=1, set={2,3} → no dup → evict nums[1]=2, add 1  set={3,1}
i=4: val=2, set={3,1} → no dup → evict nums[2]=3, add 2  set={1,2}
i=5: val=3, set={1,2} → no dup → evict nums[3]=1, add 3  set={2,3}
→ false ✅ (indices of duplicates are 3 apart, > k=2)
```

---

## Problem Description

Given an integer array `nums` and integer `k`, return `true` if there exist two **distinct indices** `i` and `j` such that `nums[i] == nums[j]` and `|i - j| <= k`.

**Example 1:** `nums = [1,2,3,1], k = 3` → `true` (indices 0 and 3, |0-3|=3 ≤ 3)

**Example 2:** `nums = [1,2,3,1,2,3], k = 2` → `false` (duplicates are 3 apart, > k=2)

Constraints:

- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `0 <= k <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Cần i ≠ j và |i-j| ≤ k — không phải i-j < k" / Confirm ≤ k, and i must be distinct from j
2. **Brute force**: "2 vòng for kiểm tra mọi pair trong khoảng k — O(n\*k)" / Check pairs within distance k; optimize to O(n)
3. **Optimize**: "Set kích thước k — add right, remove left khi window > k" / Fixed-size Set acts as sliding window
4. **Alternative**: "Dùng Map<value, lastIndex> — cập nhật index khi thấy lại" / HashMap of last seen index is also O(n)/O(k)
5. **Edge cases**: "k=0 → không có pair nào; mảng toàn unique → false" / k=0 means no valid pair possible
6. **Complexity**: "O(n) time, O(min(n,k)) space — Set chứa tối đa k+1 elements" / Set bounded by window size

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — nested scan within window
 * Time: O(n * min(n, k)) — inner loop up to k steps
 * Space: O(1)
 */
function containsNearbyDuplicateBrute(nums: number[], k: number): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j <= Math.min(i + k, nums.length - 1); j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}

/**
 * Solution 2: Optimized — Sliding Window Set
 * Maintain a Set of the last k elements. If new element already in set → true.
 * Time: O(n) — each element added/removed once
 * Space: O(min(n, k)) — set size bounded by window
 */
function containsNearbyDuplicate(nums: number[], k: number): boolean {
  const window = new Set<number>();

  for (let i = 0; i < nums.length; i++) {
    if (window.has(nums[i])) return true; // duplicate within window
    window.add(nums[i]);
    if (window.size > k) {
      window.delete(nums[i - k]); // evict element that's now out of range
    }
  }
  return false;
}

/**
 * Solution 3: HashMap last-index approach
 * Time: O(n) | Space: O(min(n, k))
 */
function containsNearbyDuplicateMap(nums: number[], k: number): boolean {
  const lastSeen = new Map<number, number>(); // value → last index

  for (let i = 0; i < nums.length; i++) {
    if (lastSeen.has(nums[i]) && i - lastSeen.get(nums[i])! <= k) return true;
    lastSeen.set(nums[i], i);
  }
  return false;
}

// === Test Cases ===
console.log(containsNearbyDuplicate([1, 2, 3, 1], 3)); // true
console.log(containsNearbyDuplicate([1, 0, 1, 1], 1)); // true  (indices 2,3 same value, dist=1)
console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2)); // false
console.log(containsNearbyDuplicate([1], 0)); // false (single element)
console.log(containsNearbyDuplicate([1, 1], 0)); // false (k=0 → no valid pair)
console.log(containsNearbyDuplicate([1, 1], 1)); // true
```
