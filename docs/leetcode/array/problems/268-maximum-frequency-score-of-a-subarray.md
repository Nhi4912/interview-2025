---
layout: page
title: "Maximum Frequency Score of a Subarray"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Math, Stack, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-frequency-score-of-a-subarray"
---

# Maximum Frequency Score of a Subarray / Điểm Tần Số Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Modular Arithmetic
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Subarray With Elements Greater Than Varying Threshold](https://leetcode.com/problems/subarray-with-elements-greater-than-varying-threshold) | [Maximum Frequency of an Element After Performing Operations I](https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-i)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng một cửa hàng với nhiều loại sản phẩm. "Điểm phổ biến" của một cửa sổ k sản phẩm bằng tổng `(giá^số_lần_xuất_hiện)` cho mỗi loại. Khi cửa sổ trượt sang phải: ta thêm một sản phẩm (tăng lũy thừa lên 1) và xóa một sản phẩm (giảm lũy thừa). Thủ thuật: thay vì tính lại từ đầu, ta cập nhật điểm số delta: `+value^newFreq - value^oldFreq` mỗi bước trượt.

## Visual (Minh họa trực quan)

```
nums = [1,1,1,2,1,2], k = 3, MOD = 10^9+7

Window [0..2] = [1,1,1]: freq={1:3} → score = 1^3 = 1
Window [1..3] = [1,1,2]: remove nums[0]=1(freq 3→2), add nums[3]=2(freq 0→1)
  score = 1 - 1^3 + 1^2 + 2^1 = 1 - 1 + 1 + 2 = 3
Window [2..4] = [1,2,1]: remove nums[1]=1(freq 2→1), add nums[4]=1(freq 1→2)
  score = 3 - 1^2 + 1^1 + 1^2 - 1^1 = 3 - 1 + 1 + 1 - 1 = 3
  Wait: add nums[4]=1: 1 was freq 1 → 2, remove nums[1]=1: was freq 2 → 1
  Actually score: +1^2 - 1^1 + 1^1 - 1^2 = (no net change)...
Window [3..5] = [2,1,2]: freq={2:2, 1:1} → score = 2^2 + 1^1 = 5 ← MAX ✓
Answer = 5
```

## Problem (Bài toán)

The **frequency score** of an array is `Σ value^frequency(value)` (mod 10^9+7) for each distinct value. Given `nums` and integer `k`, return the **maximum frequency score** among all subarrays of size `k`.

**Example 1:** `nums = [1,1,1,2,1,2]`, `k = 3` → `5`
**Example 2:** `nums = [1,2,3,4,5,6,7,8]`, `k = 2` → `65`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `1 ≤ k ≤ nums.length`, `1 ≤ nums[i] ≤ 10^6`

## Tips (Mẹo phỏng vấn)

- **Sliding window + incremental update** / Cửa sổ trượt + cập nhật từng bước: Tránh tính lại toàn bộ O(k) mỗi bước
- **Modular exponentiation** / Lũy thừa modular: `value^freq mod MOD` — cần `modPow` để tính nhanh
- **Score delta** / Delta điểm: `add(v,c)`: score += v^(c+1) - v^c; `remove(v,c)`: score -= v^c - v^(c-1)
- **Modular inverse for subtraction** / Nghịch đảo modular: `(a - b + MOD) % MOD` để tránh âm
- **Why MOD is needed** / Tại sao cần MOD: `nums[i]^k` có thể cực lớn với k=10^5 và nums[i]=10^6
- **Brute O(n·k)** / Brute force: Tính lại score cho mỗi window từ đầu → chấp nhận được với n≤10^5, k nhỏ

## Solution 1 - Brute Force (O(n·k))

```typescript
/**
 * @complexity Time: O(n·k) | Space: O(k)
 * Compute frequency score for each window from scratch
 */
function maxFrequencyScoreBrute(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    let result = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) result = (result * base) % mod;
      base = (base * base) % mod;
      exp /= 2n;
    }
    return result;
  };

  let maxScore = 0n;
  for (let i = 0; i <= nums.length - k; i++) {
    const freq = new Map<number, number>();
    for (let j = i; j < i + k; j++) freq.set(nums[j], (freq.get(nums[j]) ?? 0) + 1);
    let score = 0n;
    for (const [v, f] of freq) score = (score + modPow(BigInt(v), BigInt(f), MOD)) % MOD;
    if (score > maxScore) maxScore = score;
  }
  return Number(maxScore);
}
```

## Solution 2 - Sliding Window with Incremental Score (Optimal O(n·log(k)))

```typescript
/**
 * @complexity Time: O(n·log k) | Space: O(k)
 * Slide window; update score by removing contribution of old freq, adding new freq
 */
function maxFrequencyScore(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;

  const modPow = (base: bigint, exp: bigint): bigint => {
    let result = 1n,
      b = base % MOD;
    let e = exp;
    while (e > 0n) {
      if (e & 1n) result = (result * b) % MOD;
      b = (b * b) % MOD;
      e >>= 1n;
    }
    return result;
  };

  const freq = new Map<number, number>();
  let score = 0n;

  // Initialize first window
  for (let i = 0; i < k; i++) {
    const v = nums[i],
      c = freq.get(v) ?? 0;
    score = (score - modPow(BigInt(v), BigInt(c)) + modPow(BigInt(v), BigInt(c + 1)) + MOD) % MOD;
    freq.set(v, c + 1);
  }

  let maxScore = score;

  // Slide window
  for (let r = k; r < nums.length; r++) {
    // Add nums[r]
    const addV = nums[r],
      addC = freq.get(addV) ?? 0;
    score =
      (score - modPow(BigInt(addV), BigInt(addC)) + modPow(BigInt(addV), BigInt(addC + 1)) + MOD) %
      MOD;
    freq.set(addV, addC + 1);

    // Remove nums[r - k]
    const remV = nums[r - k],
      remC = freq.get(remV)!;
    score =
      (score - modPow(BigInt(remV), BigInt(remC)) + modPow(BigInt(remV), BigInt(remC - 1)) + MOD) %
      MOD;
    freq.set(remV, remC - 1);
    if (freq.get(remV) === 0) freq.delete(remV);

    if (score > maxScore) maxScore = score;
  }

  return Number(maxScore);
}
```

## Test Cases

```typescript
console.log(maxFrequencyScore([1, 1, 1, 2, 1, 2], 3)); // → 5
console.log(maxFrequencyScore([1, 2, 3, 4, 5, 6, 7, 8], 2)); // → 65
console.log(maxFrequencyScore([1], 1)); // → 1
console.log(maxFrequencyScoreBrute([1, 1, 1, 2, 1, 2], 3)); // → 5
```

## Related Problems

| Problem                                | Difficulty | Link                                                                            |
| -------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| Subarray Sum Equals K                  | Medium     | [LC 560](https://leetcode.com/problems/subarray-sum-equals-k)                   |
| Frequency of the Most Frequent Element | Medium     | [LC 1838](https://leetcode.com/problems/frequency-of-the-most-frequent-element) |
| Maximum Erasure Value                  | Medium     | [LC 1695](https://leetcode.com/problems/maximum-erasure-value)                  |
