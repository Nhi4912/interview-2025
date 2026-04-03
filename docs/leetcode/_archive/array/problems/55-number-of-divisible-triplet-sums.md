---
layout: page
title: "Number of Divisible Triplet Sums"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/number-of-divisible-triplet-sums"
---

# Number of Divisible Triplet Sums / Số Bộ Ba Chia Hết

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map + Prefix Frequency
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán đếm cặp — thay vì duyệt tất cả bộ ba O(n³), ta cố định phần tử giữa j, dùng tần suất số dư bên trái và bên phải để tính nhanh O(n·d).

**Pattern Recognition:**

- Signal: "count triplets (i<j<k) with sum divisible by d" → **Prefix Frequency + Remainder Map**
- Cố định j (middle), đếm cặp (left_rem, right_rem) thỏa (a + nums[j] + b) % d == 0
- Key insight: leftFreq[a] × rightFreq[(d - (a + nums[j]%d))%d] cho mỗi a

**Visual — Sliding left/right frequency:**

```
nums=[1,2,3,4], d=2
Init: leftFreq=[0→1,1→1], rightFreq=[1→1,0→1]  (nums[2],nums[3])

j=1 (nums[1]=2, rem=0):
  a=1 → need=(2-(1+0))%2=1 → count += leftFreq[1]*rightFreq[1] = 1
j=2 (nums[2]=3, rem=1):
  a=0 → need=(2-(0+1))%2=1 → 0  |  a=1 → need=0 → count += 1
Result = 2 ✅
```

---

## Problem Description

Given integer array `nums` and positive integer `d`, return the number of triplets `(i, j, k)` with `i < j < k` such that `(nums[i] + nums[j] + nums[k]) % d == 0`. ([LeetCode](https://leetcode.com/problems/number-of-divisible-triplet-sums))

Difficulty: Medium | Acceptance: 67.8%

- Example 1: `nums=[1,2,3,4], d=2` → `2` (triplets: (1,3,4) and (1,2,3))
- Example 2: `nums=[3,3,4,7,8], d=5` → `3`

Constraints: `1 ≤ nums.length ≤ 1000`, `1 ≤ d ≤ 1000`, `1 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "d là divisor dương? nums có âm không?" / Confirm d is positive and ask about negative values
2. **Brute force**: "3 vòng for lồng nhau O(n³)" / Three nested loops, straightforward
3. **Optimize**: "Cố định j, dùng freq array 2 đầu → O(n·d)" / Fix middle element, use freq arrays on both sides
4. **Transition**: "Sau mỗi j: leftFreq++ và rightFreq--" / Slide frequency windows as j moves
5. **Edge cases**: "n < 3 → return 0, d=1 → mọi bộ ba đều đúng" / Handle n<3 and d=1
6. **Follow-up**: "Nếu d rất lớn thì dùng HashMap thay array" / Use HashMap if d is huge

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(n³) — three nested loops
 * Space: O(1) — no extra space
 */
function numberOfDivisibleTripletSumsBrute(nums: number[], d: number): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        if ((nums[i] + nums[j] + nums[k]) % d === 0) count++;
      }
    }
  }
  return count;
}

/**
 * Solution 2: Fix Middle + Sliding Frequency Arrays
 * Time: O(n·d) — for each j, iterate d remainders
 * Space: O(d) — two frequency arrays of size d
 */
function numberOfDivisibleTripletSums(nums: number[], d: number): number {
  const n = nums.length;
  if (n < 3) return 0;
  let count = 0;

  // leftFreq: remainders of nums[0..j-1], rightFreq: remainders of nums[j+1..n-1]
  const leftFreq = new Array(d).fill(0);
  leftFreq[((nums[0] % d) + d) % d]++;

  const rightFreq = new Array(d).fill(0);
  for (let k = 2; k < n; k++) rightFreq[((nums[k] % d) + d) % d]++;

  for (let j = 1; j < n - 1; j++) {
    const jRem = ((nums[j] % d) + d) % d;
    for (let a = 0; a < d; a++) {
      if (leftFreq[a] === 0) continue;
      const need = (d - ((a + jRem) % d)) % d;
      count += leftFreq[a] * rightFreq[need];
    }
    // Slide window: add nums[j] to left, remove nums[j+1] from right
    leftFreq[jRem]++;
    if (j + 1 < n - 1) rightFreq[((nums[j + 1] % d) + d) % d]--;
  }

  return count;
}

// === Test Cases ===
console.log(numberOfDivisibleTripletSums([1, 2, 3, 4], 2)); // 2
console.log(numberOfDivisibleTripletSums([3, 3, 4, 7, 8], 5)); // 3
console.log(numberOfDivisibleTripletSums([1, 1, 1], 3)); // 1
console.log(numberOfDivisibleTripletSums([1, 2], 3)); // 0 (n < 3)
```

---

## 🔗 Related Problems

- [Two Sum](https://leetcode.com/problems/two-sum) — same idea: use hash map to find complement in O(1)
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — prefix sum + hash map
- [3Sum](https://leetcode.com/problems/3sum) — fix middle, two pointers on sorted array
- [Count Triplets That Can Form Two Arrays of Equal XOR](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor) — triplet counting with math insight
- [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k) — divisibility with modular arithmetic
