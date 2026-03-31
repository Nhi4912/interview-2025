---
layout: page
title: "Subarray Sums Divisible by K"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/subarray-sums-divisible-by-k"
---

# Subarray Sums Divisible by K / Tổng Mảng Con Chia Hết Cho K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Modular Arithmetic
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đồng hồ — nếu hai cây kim đồng hồ ở cùng vị trí giờ (dù khác vòng), thì khoảng thời gian giữa chúng chia hết cho 12. Tương tự: nếu prefix[i] % k == prefix[j] % k, thì sum(i+1..j) % k == 0.

**Pattern Recognition:**

- Signal: "count subarrays with sum divisible by k" → **Prefix Sum + Frequency Map by Remainder**
- Công thức: `(prefix[j] - prefix[i]) % k == 0 ↔ prefix[j] % k == prefix[i] % k`
- Key insight: đếm cặp (i,j) cùng số dư → dùng freq array size k, không cần HashMap

**Visual — Remainder Frequency:**

```
nums=[4,5,0,-2,-3,1], k=5
Remainders of prefix sums (mod 5):
idx: -1  0  1  2  3  4  5
rem:  0   4  4  4  2  4  0

freq[0]=2: C(2,2)=1 pair  → 1 subarray
freq[4]=4: C(4,2)=6 pairs → 6 subarrays
freq[2]=1: 0 pairs
Total = 7 ✅
```

---

## Problem Description

Given integer array `nums` and integer `k`, return the number of non-empty subarrays with sum divisible by `k`. ([LeetCode](https://leetcode.com/problems/subarray-sums-divisible-by-k))

Difficulty: Medium | Acceptance: 55.6%

- Example 1: `nums=[4,5,0,-2,-3,1], k=5` → `7`
- Example 2: `nums=[5], k=9` → `0`

Constraints: `1 ≤ nums.length ≤ 3×10^4`, `-10^4 ≤ nums[i] ≤ 10^4`, `2 ≤ k ≤ 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "nums có thể âm không? k dương không?" / Confirm nums can be negative, k is positive
2. **Brute force**: "2 vòng for kiểm tra mọi subarray O(n²)" / Check all pairs O(n²)
3. **Key theorem**: "prefix[j]%k == prefix[i]%k → sum(i+1..j) % k == 0" / Same remainder means divisible difference
4. **Negative mod**: "Dùng `((sum%k)+k)%k` để đảm bảo số dư không âm" / Always non-negative remainder for negative sums
5. **Counting**: "freq[r]++ trước hay sau? Initialize freq[0]=1 cho subarray bắt đầu từ 0" / Initialize freq[0]=1 for subarrays starting at index 0
6. **Follow-up**: "Subarray sum bằng đúng k (không phải chia hết) → dùng HashMap thông thường" / For exact k: standard prefix sum HashMap

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all subarrays
 * Time: O(n²) — all pairs
 * Space: O(1) — running sum
 */
function subarraysDivByKBrute(nums: number[], k: number): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum % k === 0) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Prefix Sum + Remainder Frequency Array
 * Time: O(n+k) — single pass + initialize freq array
 * Space: O(k) — frequency array of size k
 *
 * Key: if prefix[i] % k == prefix[j] % k, then sum[i..j] is divisible by k.
 * Count pairs with same remainder using frequency array.
 */
function subarraysDivByK(nums: number[], k: number): number {
  // freq[r] = number of prefix sums seen so far with remainder r
  const freq = new Array(k).fill(0);
  freq[0] = 1; // empty prefix sum has remainder 0

  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;
    // Normalize to non-negative remainder (handles negative numbers)
    const rem = ((sum % k) + k) % k;
    // Each previous prefix with same remainder forms a valid subarray
    count += freq[rem];
    freq[rem]++;
  }

  return count;
}

// === Test Cases ===
console.log(subarraysDivByK([4, 5, 0, -2, -3, 1], 5)); // 7
console.log(subarraysDivByK([5], 9)); // 0
console.log(subarraysDivByK([1, 2, 3], 3)); // 3 ([3],[1,2],[1,2,3])
console.log(subarraysDivByK([-1, 2, 9], 2)); // 2
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — prefix sum + HashMap (exact sum)
- [Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum) — same divisibility trick with length constraint
- [Find the Longest Subarray by Sum](https://leetcode.com/problems/find-the-longest-subarray-by-sum) — prefix sum for subarray length
- [Make Sum Divisible by P](https://leetcode.com/problems/make-sum-divisible-by-p) — remove smallest subarray to make divisible
- [Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings) — prefix XOR + frequency (same pattern, different op)
