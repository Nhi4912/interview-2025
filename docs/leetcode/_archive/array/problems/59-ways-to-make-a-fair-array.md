---
layout: page
title: "Ways to Make a Fair Array"
difficulty: Medium
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/ways-to-make-a-fair-array"
---

# Ways to Make a Fair Array / Cách Làm Mảng Công Bằng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — xóa một phần tử làm tất cả phần tử sau nó đảo chỉ số chẵn/lẻ. Thay vì tính lại O(n) mỗi lần xóa, dùng prefix sum để query O(1).

**Pattern Recognition:**

- Signal: "remove one element, check parity balance" → **Prefix Sum** (suffix sums flip parity)
- Khi xóa index k: phần tử trước k giữ nguyên chỉ số, phần tử sau k đổi chẵn↔lẻ
- Key insight: newEvenSum = prefEven[k] + sufOdd[k+1], newOddSum = prefOdd[k] + sufEven[k+1]

**Visual — Remove index k, suffix flips parity:**

```
nums = [2, 1, 6, 4]  totalEven=2+6=8  totalOdd=1+4=5
Remove k=1 (nums[1]=1, odd-indexed):
  prefEven=2, prefOdd=0
  sufEven = totalEven - prefEven - 0 = 6   (6 was even-indexed)
  sufOdd  = totalOdd  - prefOdd  - 1 = 4   (4 was odd-indexed)
  After removal, suffix flips:
  newEven = prefEven + sufOdd  = 2 + 4 = 6
  newOdd  = prefOdd  + sufEven = 0 + 6 = 6  ✅ FAIR!
```

---

## Problem Description

Remove exactly one element from `nums`. The resulting array is **fair** if the sum of odd-indexed elements equals the sum of even-indexed elements. Return how many valid removal indices exist. ([LeetCode](https://leetcode.com/problems/ways-to-make-a-fair-array))

Difficulty: Medium | Acceptance: 64.5%

- Example 1: `nums=[2,1,6,4]` → `1` (remove index 1)
- Example 2: `nums=[1,1,1]` → `3` (remove any index)
- Example 3: `nums=[1,2,3]` → `0`

Constraints: `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Fair nghĩa là tổng chỉ số lẻ = tổng chỉ số chẵn sau khi xóa" / Fair = odd-indexed sum equals even-indexed sum
2. **Brute force**: "Với mỗi k, xây dựng mảng mới O(n) → tổng O(n²)" / Rebuild array for each removal
3. **Key insight**: "Xóa index k: các phần tử sau k đổi chẵn↔lẻ" / Removing k swaps parities of suffix elements
4. **Formula**: "newEven = prefEven + sufOdd, newOdd = prefOdd + sufEven" / Use prefix + transformed suffix
5. **Edge cases**: "n=1 → luôn fair (mảng rỗng), n=2 → fair khi hai phần tử bằng nhau" / Single element always fair
6. **Follow-up**: "Nếu xóa nhiều phần tử? → bài toán khó hơn, cần DP" / Multiple removals requires DP

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — rebuild array for each removal
 * Time: O(n²) — for each k, recompute sums
 * Space: O(1) extra
 */
function waysToMakeAFairArrayBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let k = 0; k < n; k++) {
    let evenSum = 0,
      oddSum = 0;
    let idx = 0;
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      if (idx % 2 === 0) evenSum += nums[i];
      else oddSum += nums[i];
      idx++;
    }
    if (evenSum === oddSum) count++;
  }
  return count;
}

/**
 * Solution 2: Prefix Sum — O(n) one-pass
 * Time: O(n) — single pass with running prefix sums
 * Space: O(1) — only scalar variables
 */
function waysToMakeAFairArray(nums: number[]): number {
  const n = nums.length;

  // Compute total even-indexed and odd-indexed sums
  let totalEven = 0,
    totalOdd = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) totalEven += nums[i];
    else totalOdd += nums[i];
  }

  let count = 0;
  let prefEven = 0,
    prefOdd = 0;

  for (let k = 0; k < n; k++) {
    // Suffix sums excluding nums[k]
    const sufEven = totalEven - prefEven - (k % 2 === 0 ? nums[k] : 0);
    const sufOdd = totalOdd - prefOdd - (k % 2 === 1 ? nums[k] : 0);

    // After removing k: suffix elements swap parity
    const newEven = prefEven + sufOdd;
    const newOdd = prefOdd + sufEven;

    if (newEven === newOdd) count++;

    // Update running prefix sums
    if (k % 2 === 0) prefEven += nums[k];
    else prefOdd += nums[k];
  }

  return count;
}

// === Test Cases ===
console.log(waysToMakeAFairArray([2, 1, 6, 4])); // 1
console.log(waysToMakeAFairArray([1, 1, 1])); // 3
console.log(waysToMakeAFairArray([1, 2, 3])); // 0
console.log(waysToMakeAFairArray([1])); // 1
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — prefix sum with hash map
- [Find Pivot Index](https://leetcode.com/problems/find-pivot-index) — prefix/suffix sum balance
- [Sum of Even Numbers After Queries](https://leetcode.com/problems/sum-of-even-numbers-after-queries) — maintain parity sums under updates
- [Minimum Operations to Make Array Equal](https://leetcode.com/problems/minimum-operations-to-make-array-equal) — parity-based transformation
- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — prefix sum for partition problems
