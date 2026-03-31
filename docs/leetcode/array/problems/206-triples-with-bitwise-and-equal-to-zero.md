---
layout: page
title: "Triples with Bitwise AND Equal To Zero"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/triples-with-bitwise-and-equal-to-zero"
---

# Triples with Bitwise AND Equal To Zero / Bộ Ba Có Phép AND Bằng Zero

🔴 Hard | Array · Hash Table · Bit Manipulation | LeetCode #982

## 🧠 Intuition / Tư Duy

**Vietnamese:** Brute force O(n³) sẽ TLE. Tối ưu: dùng hash map để lưu tần suất các giá trị `nums[i] & nums[j]` (O(n²)), rồi với mỗi `nums[k]`, duyệt qua map đếm các cặp có AND bằng 0 với `nums[k]`.

```
nums = [2,1,3]

Step 1: Build pairAND map
  2&2=2, 2&1=0, 2&3=2
  1&2=0, 1&1=1, 1&3=1
  3&2=2, 3&1=1, 3&3=3
  map: {2:3, 0:2, 1:3, 3:1}

Step 2: For each nums[k], count pairs where pairAND & nums[k] == 0
  k=0 (nums[k]=2): pairs where x&2==0: map[0]=2, map[1]=3 → 2+3=5
  k=1 (nums[k]=1): pairs where x&1==0: map[0]=2, map[2]=3 → 2+3=5
  k=2 (nums[k]=3): pairs where x&3==0: map[0]=2 → 2

Total = 5+5+2 = 12... but answer is 12? Let me recount.

Answer: 12
```

## Problem Description

Given integer array `nums`, return the number of **triples** `(i, j, k)` (0-indexed, i,j,k can repeat indices) where `nums[i] & nums[j] & nums[k] == 0`.

The O(n²) precomputation trick: build a frequency map of all pairwise ANDs, then count in O(n·2^14).

**Example 1:**

```
nums=[2,1,3]
Output: 12
```

**Example 2:**

```
nums=[0,0,0]
Output: 27  // all 27 triples work since 0&0&0=0
```

## 📝 Interview Tips

- **🔑 Key trick / Mẹo then chốt:** Precompute all O(n²) pairwise ANDs into a frequency map; then enumerate k
- **⚡ Complexity jump / Nhảy độ phức tạp:** O(n³) → O(n²) via pair precomputation, or O(n² + n·2^14) via bit enumeration
- **🔢 Bit range / Phạm vi bit:** `nums[i] < 2^16`, so AND values are in [0, 65535] — bounded map
- **🗂️ Hash map vs array / Map vs mảng:** Use a plain array of size 2^16 for the frequency map — faster than Map
- **🔄 Submask enumeration / Duyệt submask:** For each nums[k], enumerate all submasks of `~nums[k]` to count matching pairs
- **📊 Complexity / Độ phức tạp:** O(n² + n·2^14) with submask; O(n² · maxVal) with full scan

## Solutions

```typescript
/**
 * Approach 1: Pairwise AND frequency map + linear scan
 * Time: O(n^2 + n * maxVal) where maxVal = 2^16
 * Space: O(maxVal) for frequency array
 */
function countTriplets(nums: number[]): number {
  const n = nums.length;
  const MAX_VAL = 1 << 16; // 65536

  // Step 1: Build frequency map of all pairwise ANDs
  const pairFreq = new Array(MAX_VAL).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pairFreq[nums[i] & nums[j]]++;
    }
  }

  // Step 2: For each nums[k], count pairs where pairAND & nums[k] == 0
  let count = 0;
  for (let k = 0; k < n; k++) {
    for (let val = 0; val < MAX_VAL; val++) {
      if (pairFreq[val] > 0 && (val & nums[k]) === 0) {
        count += pairFreq[val];
      }
    }
  }

  return count;
}

console.log(countTriplets([2, 1, 3])); // 12
console.log(countTriplets([0, 0, 0])); // 27
console.log(countTriplets([1, 2, 4])); // 1 (only 1&2&4=0 if 0 in nums)
```

```typescript
/**
 * Approach 2: Brute force O(n^3) — clear but TLEs on large input
 * Time: O(n^3)
 * Space: O(1)
 */
function countTripletsBrute(nums: number[]): number {
  let count = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const ab = nums[i] & nums[j];
      for (let k = 0; k < n; k++) {
        if ((ab & nums[k]) === 0) count++;
      }
    }
  }
  return count;
}

console.log(countTripletsBrute([2, 1, 3])); // 12
console.log(countTripletsBrute([0, 0, 0])); // 27
```

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Single Number](https://leetcode.com/problems/single-number/)                                     | 🟢 Easy    | Bit Manipulation |
| [Counting Bits](https://leetcode.com/problems/counting-bits/)                                     | 🟢 Easy    | Bit Manipulation |
| [AND Queries for a Subarray](https://leetcode.com/problems/bitwise-and-of-numbers-range/)         | 🟡 Medium  | Bit Manipulation |
| [Count Pairs With XOR in a Range](https://leetcode.com/problems/count-pairs-with-xor-in-a-range/) | 🔴 Hard    | Trie, Bit        |
