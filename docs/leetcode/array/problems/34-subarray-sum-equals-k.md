---
layout: page
title: "Subarray Sum Equals K"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/subarray-sum-equals-k"
---

# Subarray Sum Equals K / Tổng Mảng Con Bằng K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + HashMap
> **Frequency**: ⭐ Tier 2 — Gặp ở 25+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống như đọc điểm tích lũy học kỳ — bạn ghi lại tổng điểm từ đầu năm đến mỗi môn. Muốn biết một học kỳ nào đó có đúng k điểm không, chỉ cần kiểm tra: _tổng từ đầu đến hiện tại - k_ đã từng xảy ra chưa? Không cần tính lại từ đầu.

**Pattern Recognition:**

- Signal: "count subarrays" + "sum equals k" → **Prefix Sum + HashMap counting**
- Nếu `prefixSum[j] - prefixSum[i] == k` thì subarray `[i+1..j]` có tổng = k
- Lưu tần số của từng prefix sum → tra cứu O(1)

**Visual — nums = [1, 1, 1], k = 2:**

```
Index:      0    1    2
nums:      [1,   1,   1]
prefix:   0→1→2→3

map = {0:1}  ← khởi tạo (sum=0 xuất hiện 1 lần)

i=0: sum=1, check (1-2)=-1 → 0 lần. map={0:1, 1:1}
i=1: sum=2, check (2-2)= 0 → 1 lần! count=1. map={0:1,1:1,2:1}
i=2: sum=3, check (3-2)= 1 → 1 lần! count=2. map={0:1,1:1,2:1,3:1}

Answer: 2 ✅  (subarrays [0..1] và [1..2])
```

---

## Problem Description

Cho mảng số nguyên `nums` và số nguyên `k`, trả về **số lượng** subarray liên tiếp có tổng bằng `k`. ([LeetCode 560](https://leetcode.com/problems/subarray-sum-equals-k))

Difficulty: Medium | Acceptance: 45.5%

```
Example 1: nums = [1,1,1], k = 2  → 2
Example 2: nums = [1,2,3], k = 3  → 2  ([1,2] và [3])
Example 3: nums = [1,-1,1], k = 1 → 3
```

Constraints:

- `1 <= nums.length <= 2 * 10^4`
- `-1000 <= nums[i] <= 1000`
- `-10^7 <= k <= 10^7`

---

## 📝 Interview Tips

1. **Clarify**: "Có số âm không? Phần tử có thể âm → sliding window không dùng được" / Negative numbers present? Sliding window won't work — must use prefix sum
2. **Brute force**: "Duyệt mọi cặp (i,j), tính sum từng lần — O(n²)" / Check all subarrays, recalculate sum each time
3. **Optimize**: "Prefix sum + HashMap: thay vì tính lại, lưu prefixSum đã thấy vào map" / Store seen prefix sums, O(1) lookup per element
4. **Key insight**: "Khởi tạo map = {0: 1} để xử lý subarray bắt đầu từ index 0" / Initialize map with {0:1} to handle subarrays starting at index 0
5. **Edge case**: "Số âm → prefix sum có thể giảm, nhưng thuật toán vẫn đúng" / Negative values OK — prefix sum handles them correctly
6. **Follow-up**: "Nếu cần return indices thay vì count?" / What if we need to return the actual subarray indices?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Name: Check All Subarrays
 * Time: O(n²) — two nested loops
 * Space: O(1)
 */
function subarraySumBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Prefix Sum + HashMap  ← OPTIMAL
 * Name: Prefix Sum Counting
 * Time: O(n) — single pass
 * Space: O(n) — hashmap stores prefix sums
 */
function subarraySum(nums: number[], k: number): number {
  // map: prefixSum → how many times it appeared
  const map = new Map<number, number>();
  map.set(0, 1); // empty prefix (sum=0) appears once

  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;
    // If (sum - k) exists in map, those prefixes form valid subarrays
    count += map.get(sum - k) ?? 0;
    map.set(sum, (map.get(sum) ?? 0) + 1);
  }

  return count;
}

// === Test Cases ===
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2
console.log(subarraySum([1, -1, 1], 1)); // 3
console.log(subarraySum([3], 3)); // 1
console.log(subarraySum([-1, -1, 1], 0)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Relationship                       |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k)                     | Same pattern, divisibility variant |
| [Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum)                               | Same prefix sum + map trick        |
| [Count Subarrays With Median K](https://leetcode.com/problems/count-subarrays-with-median-k)                   | Prefix sum counting variant        |
| [Maximum Size Subarray Sum Equals k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k)         | Find length instead of count       |
| [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero) | Same idea, different framing       |
