---
layout: page
title: "Count Number of Pairs With Absolute Difference K"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k"
---

# Count Number of Pairs With Absolute Difference K / Đếm Số Cặp Có Hiệu Tuyệt Đối Bằng K

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map (Complement Lookup)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm cặp bạn bè trong lớp có độ tuổi chênh nhau đúng k năm — thay vì hỏi từng đôi, bạn ghi lại số người đã gặp, rồi khi gặp một bạn mới, tra xem đã từng gặp người chênh k tuổi chưa.

**Pattern Recognition:**

- Signal: "|nums[i] - nums[j]| == k", "count pairs" → **Hash Map complement lookup**
- |a - b| == k ⟺ a - b == k OR a - b == -k ⟺ b == a-k OR b == a+k
- Key insight: duyệt từng j, tra cứu freq[nums[j]-k] và freq[nums[j]+k] trong map đã xây dựng từ trái

**Visual — nums=[1,2,2,1], k=1:**

```
Scan left to right, building freq map:

j=0: num=1, check freq[0]=0, freq[2]=0 → count+=0; freq={1:1}
j=1: num=2, check freq[1]=1, freq[3]=0 → count+=1; freq={1:1,2:1}
j=2: num=2, check freq[1]=1, freq[3]=0 → count+=1; freq={1:1,2:2}
j=3: num=1, check freq[0]=0, freq[2]=2 → count+=2; freq={1:2,2:2}
Total = 4 ✅
```

---

## Problem Description

Given an integer array `nums` and a positive integer `k`, return the number of pairs `(i, j)` where `i < j` and `|nums[i] - nums[j]| == k`.

- Example 1: `nums=[1,2,2,1], k=1` → `4`
- Example 2: `nums=[1,3], k=3` → `0`
- Example 3: `nums=[3,2,1,5,4], k=2` → `3`

Constraints: `1 <= nums.length <= 200`, `1 <= nums[i] <= 100`, `1 <= k <= 99`

---

## 📝 Interview Tips

1. **Clarify**: "i < j nghiêm ngặt, pair (i,j) chứ không phải unordered" / Ordered pair i<j, but |diff| handles both directions
2. **Brute force**: "Duyệt O(n²) mọi cặp — đủ tốt với n≤200" / O(n²) is fine here; constraints are small
3. **Optimize**: "Hash map để O(n) — nhưng n≤200 nên brute force cũng AC" / Hash map for O(n), but brute force passes too
4. **|a-b|=k**: "Chia thành a-b=k và b-a=k — tra cả hai complement" / Check both a-k and a+k in map
5. **Order matters**: "Build map incrementally: khi ở j, map chỉ chứa indices < j" / Left-to-right ensures i < j
6. **Follow-up**: "Nếu |a-b| <= k?" / Count pairs within distance k → sort + binary search or sliding window

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — all pairs
 * Time: O(n²) — sufficient for n ≤ 200
 * Space: O(1)
 */
function countKDifferenceBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Hash Map — O(n)
 * Time: O(n) — single pass with O(1) lookup
 * Space: O(n) — frequency map
 *
 * For each nums[j], count how many previous elements differ by exactly k:
 * complement1 = nums[j] - k  (nums[i] = nums[j]-k → nums[j]-nums[i] = k)
 * complement2 = nums[j] + k  (nums[i] = nums[j]+k → nums[i]-nums[j] = k)
 */
function countKDifference(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  let count = 0;

  for (const num of nums) {
    // Count elements already seen that form a valid pair with current num
    count += freq.get(num - k) ?? 0;
    count += freq.get(num + k) ?? 0;
    // Add current number to frequency map
    freq.set(num, (freq.get(num) ?? 0) + 1);
  }

  return count;
}

// === Test Cases ===
console.log(countKDifference([1, 2, 2, 1], 1)); // 4
console.log(countKDifference([1, 3], 3)); // 0
console.log(countKDifference([3, 2, 1, 5, 4], 2)); // 3
console.log(countKDifference([1, 1, 1, 1], 0)); // 0 (k≥1 per constraints)
```

---

## 🔗 Related Problems

- [Two Sum](https://leetcode.com/problems/two-sum) — classic complement hash map lookup
- [K-diff Pairs in an Array](https://leetcode.com/problems/k-diff-pairs-in-an-array) — same concept but count unique pairs
- [Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60) — complement counting pattern
- [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance) — pair distance with binary search
