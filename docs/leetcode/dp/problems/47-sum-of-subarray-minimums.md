---
layout: page
title: "Sum of Subarray Minimums"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/sum-of-subarray-minimums"
---

# Sum of Subarray Minimums / Tổng Giá Trị Nhỏ Nhất Các Mảng Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tính "tầm ảnh hưởng" của mỗi ngọn núi — phần tử arr[i] là minimum cho bao nhiêu mảng con? Dùng monotonic stack để tìm biên trái và phải của "vùng ảnh hưởng" đó.

**Pattern Recognition:**

- Signal: "sum over all subarrays" + "min/max of each subarray" → **Monotonic Stack với contribution counting**
- Với arr[i]: left[i] = khoảng cách đến phần tử nhỏ hơn gần nhất bên trái; right[i] tương tự bên phải
- Key insight: arr[i] đóng góp `arr[i] * left[i] * right[i]` vào tổng

**Visual — arr=[3,1,2,4]:**

```
i=0, val=3: left=1, right=2 → contributes to 1*2=2 subarrays → 3*2=6
i=1, val=1: left=2, right=3 → contributes to 2*3=6 subarrays → 1*6=6
i=2, val=2: left=1, right=2 → contributes to 1*2=2 subarrays → 2*2=4
i=3, val=4: left=1, right=1 → contributes to 1*1=1 subarray  → 4*1=4

Total = 6+6+4+4 = 20 ✓
```

---

## Problem Description

Given array `arr`, find the sum of `min(b)` for every subarray `b` of `arr`. Return the answer modulo `10^9 + 7`. ([LeetCode 907](https://leetcode.com/problems/sum-of-subarray-minimums))

- Example 1: `arr=[3,1,2,4]` → `17` (subarrays: [3]=3,[1]=1,[2]=2,[4]=4,[3,1]=1,[1,2]=1,[2,4]=2,[3,1,2]=1,[1,2,4]=1,[3,1,2,4]=1 → sum=17)
- Example 2: `arr=[11,81,94,43,3]` → `444`

Constraints: `1 ≤ arr.length ≤ 3*10^4`, `1 ≤ arr[i] ≤ 3*10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Cần modulo không? — Có, 10^9+7" / Modulo required — easy to forget
2. **Brute force**: "Enumerate all subarrays, track min — O(n²)" / O(n²) is borderline, O(n) is optimal
3. **Contribution**: "Với mỗi arr[i], đếm bao nhiêu mảng con có arr[i] là min" / Count subarrays where i is the minimum
4. **Stack trick**: "Monotonic increasing stack tìm previous smaller và next smaller or equal" / Separate left/right pass or single pass
5. **Tie-break**: "Dùng strictly less bên trái, less-or-equal bên phải để tránh double-count" / Handle duplicates carefully
6. **Modulo**: "Apply modulo trước khi sum lớn quá — `(sum + arr[i]*left*right) % MOD`" / Don't overflow

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — enumerate all subarrays
 * Time: O(n²)
 * Space: O(1)
 */
function sumSubarrayMinsBrute(arr: number[]): number {
  const MOD = 1_000_000_007n;
  let sum = 0n;
  for (let i = 0; i < arr.length; i++) {
    let curMin = arr[i];
    for (let j = i; j < arr.length; j++) {
      curMin = Math.min(curMin, arr[j]);
      sum = (sum + BigInt(curMin)) % MOD;
    }
  }
  return Number(sum);
}

/**
 * Solution 2: Monotonic Stack — contribution counting
 * Time: O(n)
 * Space: O(n)
 */
function sumSubarrayMins(arr: number[]): number {
  const MOD = 1_000_000_007n;
  const n = arr.length;
  // left[i] = number of subarrays ending at i where arr[i] is min
  // right[i] = number of subarrays starting at i where arr[i] is min
  const left = new Array(n).fill(0);
  const right = new Array(n).fill(0);
  const stack: number[] = [];

  // Previous less element (strict <) for left boundary
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) {
      stack.pop();
    }
    left[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
    stack.push(i);
  }

  stack.length = 0;
  // Next less or equal element for right boundary (handles duplicates)
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) {
      stack.pop();
    }
    right[i] = stack.length === 0 ? n - i : stack[stack.length - 1] - i;
    stack.push(i);
  }

  let ans = 0n;
  for (let i = 0; i < n; i++) {
    ans = (ans + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
  }
  return Number(ans);
}

// === Test Cases ===
console.log(sumSubarrayMins([3, 1, 2, 4])); // 17
console.log(sumSubarrayMins([11, 81, 94, 43, 3])); // 444
console.log(sumSubarrayMins([1])); // 1
console.log(sumSubarrayMins([3, 3])); // 9 (min[3]=3,[3,3]=3,[3]=3)
```

---

## 🔗 Related Problems

- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — monotonic stack area
- [Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges) — max−min contribution
- [Minimum Cost Tree From Leaf Values](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values) — monotonic stack product
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) — 2D histogram variant
- [Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue) — next greater element
