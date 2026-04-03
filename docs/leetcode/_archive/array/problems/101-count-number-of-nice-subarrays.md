---
layout: page
title: "Count Number of Nice Subarrays"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Sliding Window, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-number-of-nice-subarrays"
---

# Count Number of Nice Subarrays / Đếm Số Mảng Con Đẹp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum / Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn đang đếm số lần xe chạy qua đúng k đèn đỏ trên một tuyến đường. Thay vì thử mọi đoạn đường, bạn ghi lại tại mỗi điểm "đã gặp bao nhiêu đèn đỏ từ đầu" — rồi tìm cặp điểm có hiệu đúng bằng k. Đây là trick **prefix count + hash map** kinh điển.

**Pattern Recognition:**

- "Đếm subarray có đúng k số lẻ" → prefix sum trên binary (odd=1, even=0)
- `count[prefix-k]` = số subarray kết thúc tại đây có đúng k số lẻ
- Biến thể của "subarray sum equals k" với odd numbers

**Visual:**

```
nums = [1,1,2,1,1], k = 3
Binarize (1=odd, 0=even): [1,1,0,1,1]
Prefix sums:              [0,1,2,2,3,4]
                           ↑ start with 0

At prefix=3: need count[3-3]=count[0]=1 → 1 subarray [1,1,2,1]
At prefix=4: need count[4-3]=count[1]=1 → 1 subarray [1,2,1,1]
Total = 2
```

## Problem Description

Given an array of integers `nums` and an integer `k`, return the number of **nice** subarrays — subarrays that contain exactly `k` odd numbers.

**Example 1:** `nums = [1,1,2,1,1], k = 3` → `2` (subarrays `[1,1,2,1]` and `[1,2,1,1]`)

**Example 2:** `nums = [2,4,6], k = 1` → `0` (no odd numbers)

**Constraints:** `1 <= nums.length <= 50000`, `1 <= k <= nums.length`, `0 <= nums[i] <= 10^5`.

## 📝 Interview Tips

1. **Clarify**: "Subarray" nghĩa là contiguous — confirm it's contiguous, not subsequence.
2. **Approach**: Transform odd→1, even→0 → reduces to "subarray sum = k" — classic prefix sum trick.
3. **Edge cases**: k > số lượng số lẻ trong array → return 0; all evens → return 0 if k > 0.
4. **Optimize**: Từ O(n²) brute force → O(n) với prefix sum map — explain the hash map lookup.
5. **Test**: `[1,2,3], k=1` → 3 subarrays: `[1]`, `[2,3]`... wait `[3]` → actually `[1]`,`[2,3]`? No: `[1]`=1 odd ✓, `[1,2]`=1 odd ✓, `[3]`=1 odd ✓ = 3.
6. **Follow-up**: "At most k odd numbers" = `atMost(k) - atMost(k-1)` — same technique extended.

## Solutions

```typescript
/** Solution 1: Brute Force — try every subarray
 * Time: O(n²) | Space: O(1)
 */
function numberOfSubarrays1(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let odds = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] % 2 === 1) odds++;
      if (odds === k) count++;
      if (odds > k) break;
    }
  }
  return count;
}

/** Solution 2: Prefix Sum + Hash Map — count subarrays with exactly k odds
 * Time: O(n) | Space: O(n)
 */
function numberOfSubarrays(nums: number[], k: number): number {
  // Map: prefix_count → how many times seen
  const prefixCount = new Map<number, number>([[0, 1]]);
  let result = 0;
  let oddCount = 0;

  for (const num of nums) {
    if (num % 2 === 1) oddCount++;
    // If we've seen (oddCount - k) before, those are valid left boundaries
    result += prefixCount.get(oddCount - k) ?? 0;
    prefixCount.set(oddCount, (prefixCount.get(oddCount) ?? 0) + 1);
  }
  return result;
}

/** Solution 3: Sliding Window (atMost trick) — exact k = atMost(k) - atMost(k-1)
 * Time: O(n) | Space: O(1)
 */
function numberOfSubarrays3(nums: number[], k: number): number {
  const atMost = (maxOdd: number): number => {
    let left = 0,
      odds = 0,
      count = 0;
    for (let right = 0; right < nums.length; right++) {
      if (nums[right] % 2 === 1) odds++;
      while (odds > maxOdd) {
        if (nums[left] % 2 === 1) odds--;
        left++;
      }
      count += right - left + 1;
    }
    return count;
  };
  return atMost(k) - atMost(k - 1);
}

// Test cases
console.log(numberOfSubarrays([1, 1, 2, 1, 1], 3)); // 2
console.log(numberOfSubarrays([2, 4, 6], 1)); // 0
console.log(numberOfSubarrays([2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2)); // 16
console.log(numberOfSubarrays3([1, 1, 2, 1, 1], 3)); // 2
console.log(numberOfSubarrays1([1, 2, 3], 1)); // 3
```

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                               |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                             | Exact same pattern with arbitrary sum instead of odd count |
| [Binary Subarrays With Sum](https://leetcode.com/problems/binary-subarrays-with-sum)                     | Identical structure; binary values summing to goal         |
| [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers) | Uses same atMost(k) - atMost(k-1) trick                    |
