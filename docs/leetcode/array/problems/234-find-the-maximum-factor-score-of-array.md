---
layout: page
title: "Find the Maximum Factor Score of Array"
difficulty: Medium
category: Array
tags: [Array, Math, Number Theory]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-factor-score-of-array"
---

# Find the Maximum Factor Score of Array / Tìm Điểm Nhân Tố Tối Đa Của Mảng

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Math / GCD-LCM + Prefix-Suffix

## 🧠 Intuition / Tư Duy

**Như tìm nhân tử tối ưu khi bỏ một phần tử**: Factor Score = LCM \* GCD của mảng. Xóa một phần tử có thể tăng score. Dùng prefix/suffix GCD và LCM để tính nhanh "GCD/LCM của mảng trừ nums[i]".

**Pattern Recognition:**

- Factor Score(arr) = lcm(arr) \* gcd(arr)
- Với mỗi i: tính gcd(prefix[i-1], suffix[i+1]) và lcm tương tự
- Prefix GCD/LCM và Suffix GCD/LCM → O(n log n) total

**Visual:**

```
nums = [2, 4, 8, 16]
All: gcd=2, lcm=16, score=32
Remove 2: [4,8,16] → gcd=4, lcm=16, score=64 ← max
Remove 4: [2,8,16] → gcd=2, lcm=16, score=32
...
Answer = 64
```

## Problem Description

Cho mảng `nums`. **Factor score** = `lcm(nums) * gcd(nums)`. Có thể xóa **tối đa một** phần tử. Trả về **factor score tối đa** có thể đạt được sau khi xóa (hoặc không xóa).

**Example 1:** `nums = [2,4,8,16]` → `64`
**Example 2:** `nums = [1,2,3,4,5]` → `60`
**Example 3:** `nums = [3]` → `9`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 10^6`

## 📝 Interview Tips

1. **GCD/LCM basics**: gcd(a,b) chuẩn Euclid; lcm(a,b) = a\*b/gcd(a,b)
2. **Prefix-suffix pattern**: tính prefixGcd[i], prefixLcm[i] và suffixGcd[i], suffixLcm[i]
3. **Combine**: khi bỏ i, gcd_remaining = gcd(prefixGcd[i-1], suffixGcd[i+1])
4. **Edge: n=1**: khi bỏ phần tử duy nhất → score = 0; factor score của mảng = nums[0]²
5. **LCM overflow**: dùng BigInt hoặc chú ý range — nums[i] ≤ 10^6, lcm có thể rất lớn
6. **Chú ý**: gcd với 0 = số kia; lcm với 0 = 0

## Solutions

```typescript
function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return (a / gcd(a, b)) * b; // avoid overflow: divide first
}

// Solution 1: Prefix/Suffix GCD+LCM — O(n log M) time, O(n) space
function maxScore(nums: number[]): number {
  const n = nums.length;

  // Handle n=1 edge case
  if (n === 1) return nums[0] * nums[0]; // can choose not to remove

  const prefGcd = new Array(n).fill(0);
  const prefLcm = new Array(n).fill(0);
  const sufGcd = new Array(n).fill(0);
  const sufLcm = new Array(n).fill(0);

  prefGcd[0] = nums[0];
  prefLcm[0] = nums[0];
  for (let i = 1; i < n; i++) {
    prefGcd[i] = gcd(prefGcd[i - 1], nums[i]);
    prefLcm[i] = lcm(prefLcm[i - 1], nums[i]);
  }

  sufGcd[n - 1] = nums[n - 1];
  sufLcm[n - 1] = nums[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    sufGcd[i] = gcd(sufGcd[i + 1], nums[i]);
    sufLcm[i] = lcm(sufLcm[i + 1], nums[i]);
  }

  // Base: no removal
  let ans = prefLcm[n - 1] * prefGcd[n - 1];

  // Try removing each element i
  for (let i = 0; i < n; i++) {
    let g: number, l: number;
    if (i === 0) {
      g = sufGcd[1];
      l = sufLcm[1];
    } else if (i === n - 1) {
      g = prefGcd[n - 2];
      l = prefLcm[n - 2];
    } else {
      g = gcd(prefGcd[i - 1], sufGcd[i + 1]);
      l = lcm(prefLcm[i - 1], sufLcm[i + 1]);
    }
    ans = Math.max(ans, l * g);
  }
  return ans;
}

// Solution 2: Brute force O(n² log M) — for verification with small inputs
function maxScoreBrute(nums: number[]): number {
  const n = nums.length;
  const arrGcd = (a: number[]) => a.reduce(gcd);
  const arrLcm = (a: number[]) => a.reduce(lcm);
  let ans = arrLcm(nums) * arrGcd(nums);
  for (let i = 0; i < n; i++) {
    if (n === 1) {
      ans = Math.max(ans, 0);
      continue;
    }
    const rest = [...nums.slice(0, i), ...nums.slice(i + 1)];
    ans = Math.max(ans, arrLcm(rest) * arrGcd(rest));
  }
  return ans;
}

// Tests
console.log(maxScore([2, 4, 8, 16])); // 64
console.log(maxScore([1, 2, 3, 4, 5])); // 60
console.log(maxScore([3])); // 9
console.log(maxScoreBrute([2, 4, 8, 16])); // 64
console.log(maxScoreBrute([1, 2, 3, 4, 5])); // 60
```

## 🔗 Related Problems

| Problem                                           | Relationship         |
| ------------------------------------------------- | -------------------- |
| 2447 - Number of Subarrays With GCD Equal to K    | GCD in subarrays     |
| 2654 - Minimum Number of Operations to Make Array | GCD/LCM manipulation |
| 1979 - Find Greatest Common Divisor of Array      | Basic GCD            |
| 365 - Water and Jug Problem                       | GCD application      |
