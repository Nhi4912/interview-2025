---
layout: page
title: "Minimum Limit of Balls in a Bag"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag"
---

# Minimum Limit of Balls in a Bag / Giới Hạn Tối Thiểu Số Bóng Trong Túi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống chia đều đồ ăn vào hộp:** bạn muốn không hộp nào quá đầy. Binary search câu hỏi "với giới hạn m, cần bao nhiêu lần chia?" — tăng m thì ít thao tác hơn.

**Pattern Recognition:**

- Signal: "minimize maximum + at most k operations" → **Binary Search on Answer**
- Monotone: nếu limit=m khả thi, limit=m+1 cũng khả thi → search space là monotone
- Cost function: túi n bóng, giới hạn m → cần `ceil(n/m)-1 = floor((n-1)/m)` lần chia

**Visual:**

```
nums=[9,7,5], maxOps=3
Binary search limit m in [1, max(nums)=9]:

m=5: ops = ceil(9/5)-1 + ceil(7/5)-1 + ceil(5/5)-1
        = 1 + 1 + 0 = 2 ≤ 3 ✅ → try smaller
m=3: ops = ceil(9/3)-1 + ceil(7/3)-1 + ceil(5/3)-1
        = 2 + 2 + 1 = 5 > 3 ❌ → try larger
m=4: ops = ceil(9/4)-1 + ceil(7/4)-1 + ceil(5/4)-1
        = 2 + 1 + 1 = 4 > 3 ❌
m=5 is minimum → Answer: 5 ✅
```

## Problem Description

You have bags of balls. `nums[i]` is the number of balls in the i-th bag. You can split any bag into two in one operation. After at most `maxOperations` splits, return the **minimum possible maximum** bag size.

- Example 1: `nums=[9], maxOperations=2` → `3`
- Example 2: `nums=[2,4,8,2], maxOperations=4` → `2`

## 📝 Interview Tips

1. **Clarify**: maxOperations có thể = 0 không? / Can maxOperations be 0? Yes, return max(nums)
2. **Approach**: Binary search on answer m, check ops needed / Identify monotone property first
3. **Edge cases**: nums=[1] → answer is 1 regardless / Single ball bags can't be split further
4. **Optimize**: Check function O(n), binary search O(log(max)) → O(n log max) / Linear check inside log search
5. **Follow-up**: Nếu muốn minimize total bags? / Minimize total bags instead? → different objective
6. **Complexity**: Time O(n log(max(nums))), Space O(1) / Very efficient

## Solutions

```typescript
/** Solution 1: Linear Scan (brute force on answer)
 * Time: O(n * max(nums)) | Space: O(1)
 */
function minimumSizeBrute(nums: number[], maxOperations: number): number {
  const maxVal = Math.max(...nums);
  for (let m = 1; m <= maxVal; m++) {
    let ops = 0;
    for (const n of nums) ops += Math.ceil(n / m) - 1;
    if (ops <= maxOperations) return m;
  }
  return maxVal;
}

/** Solution 2: Binary Search on Answer
 * Time: O(n log(max(nums))) | Space: O(1)
 */
function minimumSize(nums: number[], maxOperations: number): number {
  // Check: can we achieve limit m with ≤ maxOperations splits?
  const canAchieve = (m: number): boolean => {
    let ops = 0;
    for (const n of nums) {
      ops += Math.floor((n - 1) / m); // = ceil(n/m) - 1
      if (ops > maxOperations) return false; // early exit
    }
    return true;
  };

  let lo = 1,
    hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canAchieve(mid))
      hi = mid; // mid works, try smaller
    else lo = mid + 1; // mid too small, try larger
  }
  return lo;
}

/** Solution 3: Binary Search (explicit bounds)
 * Time: O(n log(max(nums))) | Space: O(1)
 */
function minimumSizeV2(nums: number[], maxOperations: number): number {
  let lo = 1,
    hi = Math.max(...nums),
    ans = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    let ops = 0;
    for (const n of nums) ops += Math.floor((n - 1) / mid);
    if (ops <= maxOperations) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}

// Tests
console.log(minimumSize([9], 2)); // 3
console.log(minimumSize([2, 4, 8, 2], 4)); // 2
console.log(minimumSize([7, 17], 2)); // 7
console.log(minimumSize([1], 0)); // 1
console.log(minimumSizeBrute([9], 2)); // 3
console.log(minimumSizeV2([2, 4, 8, 2], 4)); // 2
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                          |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                         | Same pattern: binary search on answer |
| [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) | Binary search on capacity             |
| [Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance)               | Binary search + counting              |
