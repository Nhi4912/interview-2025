---
layout: page
title: "Sum of Values at Indices With K Set Bits"
difficulty: Easy
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/sum-of-values-at-indices-with-k-set-bits"
---

# Sum of Values at Indices With K Set Bits / Tổng Các Giá Trị Tại Chỉ Số Có K Bit Bằng 1

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng mỗi chỉ số trong mảng có một "mã vạch nhị phân". Bạn chỉ muốn lấy sản phẩm từ kệ có đúng `k` vạch đen trong mã vạch. Chỉ cần đếm số bit 1 trong biểu diễn nhị phân của từng chỉ số — bằng `popcount` — rồi cộng dồn giá trị tương ứng.

**Pattern Recognition:**

- "Binary representation of index" → Bit counting with `popcount`
- "Count set bits" → `n.toString(2).split('0').join('').length` or bit tricks
- Simple filter + accumulate → single O(n) pass

**Visual:**

```
nums = [5, 10, 1, 5, 2], k = 1
Index binary & popcount:
 0 → 000 → 0 bits  skip
 1 → 001 → 1 bit   ✓ add nums[1]=10
 2 → 010 → 1 bit   ✓ add nums[2]=1
 3 → 011 → 2 bits  skip
 4 → 100 → 1 bit   ✓ add nums[4]=2

sum = 10 + 1 + 2 = 13
```

## Problem Description

Given `nums` and integer `k`, return the **sum** of `nums[i]` for all indices `i` whose binary representation has exactly `k` set bits (1s).

- `nums=[5,10,1,5,2], k=1` → `13` (indices 1,2,4 have exactly 1 set bit)
- `nums=[4,3,2,1], k=2` → `1` (only index 3 = `011` has 2 set bits)

## 📝 Interview Tips

1. **Clarify**: k can be 0 — index 0 has 0 set bits / k có thể bằng 0 (index 0)
2. **Approach**: Iterate indices, count bits, accumulate / lặp qua chỉ số, đếm bit, cộng dồn
3. **Edge cases**: k=0 → only index 0 qualifies / k=0 chỉ có chỉ số 0 thỏa mãn
4. **Optimize**: Brian Kernighan's algorithm or JS built-in / thuật toán đếm bit hiệu quả
5. **Follow-up**: What if we need XOR instead of sum? → Same filter, different reduce
6. **Complexity**: Time O(n log n) — log n to count bits per index / thời gian O(n log n)

## Solutions

```typescript
/** Solution 1: String method — convert to binary string and count '1's
 * Time: O(n log n) | Space: O(log n) for string
 */
function sumIndicesWithKSetBitsString(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    const bits = i
      .toString(2)
      .split("")
      .filter((b) => b === "1").length;
    if (bits === k) sum += nums[i];
  }
  return sum;
}

/** Solution 2: Bit manipulation — Brian Kernighan popcount
 * Time: O(n * popcount(i)) ≈ O(n log n) | Space: O(1)
 */
function sumIndicesWithKSetBits(nums: number[], k: number): number {
  const popcount = (n: number): number => {
    let count = 0;
    while (n > 0) {
      n &= n - 1; // clear lowest set bit
      count++;
    }
    return count;
  };

  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (popcount(i) === k) sum += nums[i];
  }
  return sum;
}

/** Solution 3: Precomputed popcount table for repeated calls
 * Time: O(n) | Space: O(n)
 */
function sumIndicesWithKSetBitsFast(nums: number[], k: number): number {
  // dp popcount: bits[i] = bits[i >> 1] + (i & 1)
  const bits = new Array(nums.length).fill(0);
  for (let i = 1; i < nums.length; i++) {
    bits[i] = bits[i >> 1] + (i & 1);
  }

  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (bits[i] === k) sum += nums[i];
  }
  return sum;
}

// Test cases
console.log(sumIndicesWithKSetBits([5, 10, 1, 5, 2], 1)); // 13
console.log(sumIndicesWithKSetBits([4, 3, 2, 1], 2)); // 1
console.log(sumIndicesWithKSetBits([1, 2, 3, 4, 5, 6, 7, 8], 0)); // 1 (only index 0)
console.log(sumIndicesWithKSetBitsString([5, 10, 1, 5, 2], 1)); // 13
console.log(sumIndicesWithKSetBitsFast([4, 3, 2, 1], 2)); // 1
console.log(sumIndicesWithKSetBits([10], 0)); // 10 (index 0 has 0 set bits)
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                             |
| ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)                         | Core popcount / hamming weight operation |
| [Counting Bits](https://leetcode.com/problems/counting-bits)                               | Precompute popcount for all 0..n with DP |
| [Sum of All Subset XOR Totals](https://leetcode.com/problems/sum-of-all-subset-xor-totals) | Similar filter-and-sum on bit properties |
