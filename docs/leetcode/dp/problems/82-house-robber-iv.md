---
layout: page
title: "House Robber IV"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/house-robber-iv"
---

# House Robber IV / Kẻ Trộm Nhà IV

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chọn `k` căn nhà không liền kề nhau để trộm sao cho giá trị căn đắt nhất là nhỏ nhất — đây là dạng "minimize the maximum". Khi thấy từ khóa này, hãy nghĩ ngay đến **Binary Search on the answer**.

**Pattern Recognition:**

- Signal: "minimize the maximum value" + "select k non-adjacent elements" → **Binary Search + Greedy check**
- Binary search trên đáp án: `lo = min(nums)`, `hi = max(nums)`
- Check feasibility: greedy — ăn tham từng nhà hợp lệ (value ≤ mid) và skip nhà kề

**Visual — Binary search + greedy check:**

```
nums = [2, 3, 5, 9], k = 2

Binary search: lo=2, hi=9
  mid=5: greedy pick [2,5]? → 2≤5 pick(idx=0,skip 1), 5≤5 pick(idx=2) → count=2 ≥ k ✓ → hi=5
  mid=3: greedy pick [2,3]? → 2≤3 pick(idx=0,skip 1), 3≤3 pick(idx=2=5)?no 5>3, 9>3 → count=2 ≥ k ✓ → hi=3
  mid=2: → only 2≤2 picked → count=1 < k ✗ → lo=3
Answer: lo = 3
```

---

## Problem Description

There are `n` houses along a street. A thief will rob **at least `k`** houses such that no two adjacent houses are robbed. The **capability** is the maximum value among all robbed houses. Return the **minimum** possible capability. ([LeetCode 2560](https://leetcode.com/problems/house-robber-iv))

**Example 1:** `nums=[2,3,5,9], k=2` → `5`

**Example 2:** `nums=[2,7,9,3,1], k=2` → `2`

Constraints: `1 <= n <= 10^5`, `1 <= k <= (n+1)/2`, `1 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Recognize pattern**: "Minimize the maximum → luôn nghĩ binary search on answer trước" / "Minimize maximum" is the classic binary search signal
2. **Feasibility check**: "Greedy: với capability=mid, đếm nhà có thể trộm không kề nhau" / Greedy count of non-adjacent houses with value ≤ mid
3. **Greedy proof**: "Chọn sớm nhất có thể (tham lam) luôn tối ưu vì không làm xấu các lựa chọn sau" / Earliest possible selection is always optimal (exchange argument)
4. **Binary search bounds**: "lo = min(nums) vì phải trộm ít nhất k nhà; hi = max(nums)" / lo must be achievable, hi is worst case
5. **Time complexity**: "O(n log(max-min)) — binary search × greedy scan" / Log factor from binary search range
6. **Classic variant**: "House Robber I/II dùng DP O(n); bài này dùng binary search vì hỏi min-max" / DP for max-sum, binary search for min-max

---

## Solutions

```typescript
/**
 * Solution 1: Binary Search with linear feasibility check
 * Time: O(n log(max-min)) — binary search over value range, O(n) greedy check
 * Space: O(1)
 */
function minCapability(nums: number[], k: number): number {
  let lo = Math.min(...nums);
  let hi = Math.max(...nums);

  // Greedy: can we rob at least k non-adjacent houses with max value <= cap?
  function canRob(cap: number): boolean {
    let count = 0;
    let i = 0;
    while (i < nums.length) {
      if (nums[i] <= cap) {
        count++;
        i += 2; // skip the adjacent house
      } else {
        i++;
      }
    }
    return count >= k;
  }

  // Standard binary search: find smallest cap where canRob(cap) is true
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canRob(mid)) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

/**
 * Solution 2: Explicit greedy helper (same complexity, more readable)
 * Time: O(n log V) where V = max value range
 * Space: O(1)
 */
function minCapabilityAlt(nums: number[], k: number): number {
  const values = [...new Set(nums)].sort((a, b) => a - b);
  let lo = 0,
    hi = values.length - 1;

  function greedyCount(cap: number): number {
    let cnt = 0,
      i = 0;
    while (i < nums.length) {
      if (nums[i] <= cap) {
        cnt++;
        i += 2;
      } else i++;
    }
    return cnt;
  }

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (greedyCount(values[mid]) >= k) hi = mid;
    else lo = mid + 1;
  }

  return values[lo];
}

// === Test Cases ===
console.log(minCapability([2, 3, 5, 9], 2)); // 5
console.log(minCapability([2, 7, 9, 3, 1], 2)); // 2
console.log(minCapability([1, 2, 3, 4, 5], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern                |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------- |
| [House Robber](https://leetcode.com/problems/house-robber)                                                         | 🟡 Medium  | DP                     |
| [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs) | 🟡 Medium  | Binary Search + Greedy |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                   | 🔴 Hard    | Binary Search + Greedy |
| [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array)                               | 🟡 Medium  | Binary Search          |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                           | 🟡 Medium  | Binary Search          |
