---
layout: page
title: "Maximum OR"
difficulty: Medium
category: Array
tags: [Array, Greedy, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-or"
---

# Maximum OR / OR Lớn Nhất

🟡 Medium | Array · Greedy · Bit Manipulation · Prefix Sum

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Hãy tưởng tượng bạn có k "phép tăng gấp đôi" (nhân 2). Vì OR bit là bất đối xứng — bit cao nhất quyết định tất cả — nên bạn nên dồn **toàn bộ** k lần nhân vào **một phần tử duy nhất** để đẩy các bit của nó lên cao nhất có thể. Sau đó dùng prefix/suffix OR để tính OR của toàn mảng.

```
nums = [12, 9], k = 1
  12 << 1 = 24  → 24 | 9  = 25
  9  << 1 = 18  → 18 | 12 = 30  ← max!

Prefix OR: [0, 12]
Suffix OR: [9, 0]
Pick i=1: (9 << k) | prefixOR[1] | suffixOR[2] = 18 | 12 | 0 = 30
```

## Problem Description

Given an integer array `nums` and integer `k`, you may perform at most `k` operations. In each operation, choose one element and multiply it by 2. Return the **maximum possible value of OR** of all elements of the resulting array.

- **Example 1**: `nums = [12,9], k = 1` → `30` (apply op to 9 → 18, 18|12=30)
- **Example 2**: `nums = [8,1,2], k = 2` → `35` (apply both ops to 8 → 32, 32|1|2=35)

## 📝 Interview Tips

- 💡 **Greedy key / Chìa khoá tham lam**: All k operations go to exactly ONE element — spreading dilutes bit impact / dồn tất cả vào một phần tử
- 🔍 **Why prefix+suffix OR?** / Tại sao prefix+suffix?: To quickly compute OR of all OTHER elements when we pick index i / tính OR phần còn lại khi chọn i
- ⚠️ **Overflow** / Tràn số: Use BigInt or note k ≤ 15, nums[i] ≤ 1e9 → result fits in number / kết quả vừa trong number
- 🧮 **Bit shift = multiply 2^k** / Dịch bit: `x << k` is same as x \* 2^k for integers / tương đương nhân 2^k
- 📊 **Complexity** / Độ phức tạp: O(n) time, O(n) space for prefix/suffix arrays / O(n) thời gian và không gian
- 🎯 **Pattern** / Mẫu: Prefix-Suffix technique appears in many greedy array problems / kỹ thuật prefix-suffix phổ biến

## Solutions

### Solution 1: Prefix + Suffix OR (Optimal)

```typescript
/**
 * Maximum OR using prefix/suffix precomputation
 * Time: O(n) | Space: O(n)
 */
function maximumOr(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  const suffix = new Array(n + 1).fill(0);

  // Build prefix OR (prefix[i] = OR of nums[0..i-1])
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] | nums[i];
  }
  // Build suffix OR (suffix[i] = OR of nums[i..n-1])
  for (let i = n - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] | nums[i];
  }

  let ans = 0;
  for (let i = 0; i < n; i++) {
    // Apply all k doublings to nums[i], combine with rest via prefix/suffix
    const candidate = prefix[i] | (nums[i] * Math.pow(2, k)) | suffix[i + 1];
    ans = Math.max(ans, candidate);
  }
  return ans;
}

// Tests
console.log(maximumOr([12, 9], 1)); // 30
console.log(maximumOr([8, 1, 2], 2)); // 35
console.log(maximumOr([1, 2, 3, 4], 3)); // 39
```

### Solution 2: Bit Shift Variant (Cleaner notation)

```typescript
/**
 * Maximum OR using left bit shift operator
 * Time: O(n) | Space: O(n)
 */
function maximumOrShift(nums: number[], k: number): number {
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  const suf = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] | nums[i];
  for (let i = n - 1; i >= 0; i--) suf[i] = suf[i + 1] | nums[i];

  let ans = 0;
  for (let i = 0; i < n; i++) {
    // << k is multiply by 2^k; safe for k<=15 within JS number range
    const boosted = nums[i] * (1 << k);
    ans = Math.max(ans, pre[i] | boosted | suf[i + 1]);
  }
  return ans;
}

// Tests
console.log(maximumOrShift([12, 9], 1)); // 30
console.log(maximumOrShift([8, 1, 2], 2)); // 35
```

### Solution 3: Brute Force O(n²) for verification

```typescript
/**
 * Brute force — try applying all k ops to each element
 * Time: O(n) | Space: O(1)
 */
function maximumOrBrute(nums: number[], k: number): number {
  let ans = 0;
  for (let i = 0; i < nums.length; i++) {
    let orVal = 0;
    for (let j = 0; j < nums.length; j++) {
      orVal |= j === i ? nums[j] * Math.pow(2, k) : nums[j];
    }
    ans = Math.max(ans, orVal);
  }
  return ans;
}

console.log(maximumOrBrute([12, 9], 1)); // 30
console.log(maximumOrBrute([8, 1, 2], 2)); // 35
```

## 🔗 Related Problems

| #    | Problem                                    | Difficulty | Tags             |
| ---- | ------------------------------------------ | ---------- | ---------------- |
| 2680 | Maximum OR                                 | Medium     | Bit Manipulation |
| 1318 | Minimum Flips to Make a OR b Equal to c    | Medium     | Bit Manipulation |
| 2401 | Longest Nice Subarray                      | Medium     | Bit Manipulation |
| 2411 | Smallest Subarrays With Maximum Bitwise OR | Medium     | Bit Manipulation |
