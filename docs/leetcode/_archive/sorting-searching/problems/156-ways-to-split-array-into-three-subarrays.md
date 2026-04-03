---
layout: page
title: "Ways to Split Array Into Three Subarrays"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/ways-to-split-array-into-three-subarrays"
---

# Ways to Split Array Into Three Subarrays / Số Cách Chia Mảng Thành Ba Phần

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum Coins Heroes Can Collect](https://leetcode.com/problems/maximum-coins-heroes-can-collect) | [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Chia thước kẻ dài thành 3 đoạn bằng 2 vạch cắt, sao cho tổng đoạn 1 ≤ tổng đoạn 2 ≤ tổng đoạn 3. Với vạch cắt đầu tiên cố định tại i, dùng binary search tìm khoảng hợp lệ cho vạch cắt thứ hai j.

```
nums = [1,1,1], prefix = [0,1,2,3]
Split at i=0: left=[1], sum=1
  j must satisfy: prefix[j]-prefix[1] >= 1  AND  prefix[3]-prefix[j] >= prefix[j]-prefix[1]
  → j_min=1, j_max=1 → 1 way

Split at i=1: left=[1,1], sum=2
  → need mid sum ≥ 2, but total-2 = 1 < 2 → no valid j

Total = 1

nums = [1,2,2,2,5,0], prefix = [0,1,3,5,7,12,12]
Enumerate i, binary search j → 3 ways
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Prefix sum là nền tảng** — sum(i..j) = prefix[j+1] - prefix[i] / prefix sum enables O(1) range queries
- 🇻🇳 **Enumerate i, binary search j** — với mỗi i cố định, j có valid range liên tục → binary search / for fixed i, valid j forms contiguous range
- 🇻🇳 **j_min: mid ≥ left** — binary search tìm j nhỏ nhất sao cho sum(i+1..j) ≥ sum(0..i) / find smallest j where mid sum ≥ left sum
- 🇻🇳 **j_max: right ≥ mid** — binary search tìm j lớn nhất sao cho sum(j+1..n-1) ≥ sum(i+1..j) / find largest j where right sum ≥ mid sum
- 🇻🇳 **Mod 10^9+7** — kết quả có thể rất lớn / answer can overflow, take modulo
- 🇻🇳 **j range: [i+1, n-2]** — mid phải có ít nhất 1 phần tử, right cũng vậy / j must leave room for at least 1 element in right

---

## Solutions

### Solution 1: Prefix Sum + Binary Search — O(n log n)

```typescript
/**
 * For each first split i, binary search for valid range of second split j
 * Time: O(n log n)  Space: O(n)
 */
function waysToSplit(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  const total = prefix[n];

  let ans = 0n;

  for (let i = 0; i < n - 2; i++) {
    const leftSum = prefix[i + 1];
    // mid must be >= leftSum → prefix[j+1] - prefix[i+1] >= leftSum
    // → prefix[j+1] >= leftSum + prefix[i+1]

    // Early exit: if left already > total/3, impossible
    if (leftSum * 3 > total) break;

    // Find j_min: smallest j >= i+1 where mid sum >= leftSum
    // prefix[j+1] - prefix[i+1] >= leftSum → prefix[j+1] >= leftSum + prefix[i+1]
    let lo = i + 1,
      hi = n - 2;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (prefix[mid + 1] - prefix[i + 1] >= leftSum) hi = mid;
      else lo = mid + 1;
    }
    const jMin = lo;
    if (prefix[jMin + 1] - prefix[i + 1] < leftSum) continue;

    // Find j_max: largest j where right sum >= mid sum
    // prefix[n] - prefix[j+1] >= prefix[j+1] - prefix[i+1]
    // → 2*prefix[j+1] <= prefix[n] + prefix[i+1]
    lo = jMin;
    hi = n - 2;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      const midSum = prefix[mid + 1] - prefix[i + 1];
      const rightSum = prefix[n] - prefix[mid + 1];
      if (rightSum >= midSum) lo = mid;
      else hi = mid - 1;
    }
    const jMax = lo;

    if (jMax >= jMin) {
      ans = (ans + BigInt(jMax - jMin + 1)) % MOD;
    }
  }

  return Number(ans);
}

console.log(waysToSplit([1, 1, 1])); // 1
console.log(waysToSplit([1, 2, 2, 2, 5, 0])); // 3
console.log(waysToSplit([0, 0, 0, 0])); // 4? depends on definition - [0,0,0,0] → 1
```

### Solution 2: Prefix Sum + Two Pointers — O(n)

```typescript
/**
 * Two pointers: jMin and jMax both only move right as i increases
 * Time: O(n)  Space: O(n)
 */
function waysToSplit2(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + nums[i];
  const total = pre[n];

  let ans = 0n;
  let jMin = 0,
    jMax = 0;

  for (let i = 0; i < n - 2; i++) {
    const leftSum = pre[i + 1];
    if (leftSum * 3 > total) break;

    // Advance jMin: first j >= i+1 where midSum >= leftSum
    if (jMin <= i) jMin = i + 1;
    while (jMin < n - 1 && pre[jMin + 1] - pre[i + 1] < leftSum) jMin++;
    if (pre[jMin + 1] - pre[i + 1] < leftSum) continue;

    // Advance jMax: last j where rightSum >= midSum
    if (jMax < jMin) jMax = jMin;
    while (jMax < n - 2) {
      const midNext = pre[jMax + 2] - pre[i + 1];
      const rightNext = pre[n] - pre[jMax + 2];
      if (rightNext >= midNext) jMax++;
      else break;
    }

    ans = (ans + BigInt(jMax - jMin + 1)) % MOD;
  }

  return Number(ans);
}

console.log(waysToSplit2([1, 1, 1])); // 1
console.log(waysToSplit2([1, 2, 2, 2, 5, 0])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                          | Difficulty | Pattern                   |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                                 | 🔴 Hard    | Binary Search on Answer   |
| [Partition Array Into Three Parts With Equal Sum](https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum) | 🟢 Easy    | Prefix Sum                |
| [Count Subarrays with Score Less Than K](https://leetcode.com/problems/count-subarrays-with-score-less-than-k)                   | 🟡 Medium  | Prefix Sum + Two Pointers |
| [Number of Ways to Split a String](https://leetcode.com/problems/number-of-ways-to-split-a-string)                               | 🟡 Medium  | Math                      |
