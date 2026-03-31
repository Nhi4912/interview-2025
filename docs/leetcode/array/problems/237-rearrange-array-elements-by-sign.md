---
layout: page
title: "Rearrange Array Elements by Sign"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Simulation]
leetcode_url: "https://leetcode.com/problems/rearrange-array-elements-by-sign"
---

# Rearrange Array Elements by Sign / Sắp Xếp Mảng Theo Dấu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers) | [Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp hàng nam-nữ xen kẽ trong lễ tốt nghiệp — một tay chỉ chỗ cho nam (chỉ số chẵn), tay kia chỉ chỗ cho nữ (chỉ số lẻ). Duyệt mảng gốc một lần, phân phối vào đúng vị trí.

**Pattern Recognition:**

- Equal count of positives and negatives guaranteed
- Place positives at even indices (0, 2, 4…), negatives at odd indices (1, 3, 5…)
- Two pointer: posIdx=0, negIdx=1, advance by 2 each time

**Visual — Two index placement:**

```
nums = [3,1,-2,-5,2,-4]

posIdx=0  negIdx=1
ans = [_, _, _, _, _, _]

num=3  (pos) → ans[0]=3,  posIdx=2
num=1  (pos) → ans[2]=1,  posIdx=4
num=-2 (neg) → ans[1]=-2, negIdx=3
num=-5 (neg) → ans[3]=-5, negIdx=5
num=2  (pos) → ans[4]=2,  posIdx=6
num=-4 (neg) → ans[5]=-4, negIdx=7

ans = [3,-2,1,-5,2,-4] ✅
```

---

## Problem Description

Given an array `nums` with equal numbers of positive and negative integers, rearrange them so that every consecutive pair of integers has opposite signs. Positives go to even indices and negatives go to odd indices, preserving relative order within each sign group. ([LeetCode 2149](https://leetcode.com/problems/rearrange-array-elements-by-sign))

Difficulty: Medium | Acceptance: 84.4%

```
Example 1: nums = [3,1,-2,-5,2,-4]  → [3,-2,1,-5,2,-4]
Example 2: nums = [-1,1]             → [1,-1]
```

Constraints:

- `2 <= nums.length <= 2 * 10^5` (always even)
- `nums` has equal number of positive and negative integers
- `-10^8 <= nums[i] <= 10^8`, `nums[i] != 0`

---

## 📝 Interview Tips

1. **Clarify**: "Có đảm bảo số lượng dương = âm không?" / Confirm equal count of positives and negatives
2. **Index trick**: "Chỉ số chẵn = dương, lẻ = âm" / Map positives → even indices, negatives → odd indices
3. **Brute force**: "Tách ra 2 mảng rồi merge" / Separate into pos[] and neg[] then interleave
4. **Optimal**: "Dùng 2 con trỏ posIdx/negIdx chạy song song, O(n) một lần duyệt" / Single pass with two write pointers
5. **No in-place**: "Bài này cần O(n) space vì thứ tự bị thay đổi" / In-place rearrangement with order preservation needs O(n)
6. **Follow-up**: "Nếu số lượng không bằng nhau? Đặt phần dư ở cuối" / Unequal counts → append leftovers at end

---

## Solutions

```typescript
/**
 * Solution 1: Separate then Merge
 * Time: O(n) — two passes (split + interleave)
 * Space: O(n) — pos and neg arrays
 */
function rearrangeArrayElementsBySignSplit(nums: number[]): number[] {
  const pos = nums.filter((x) => x > 0);
  const neg = nums.filter((x) => x < 0);
  const ans: number[] = [];
  for (let i = 0; i < pos.length; i++) {
    ans.push(pos[i]);
    ans.push(neg[i]);
  }
  return ans;
}

/**
 * Solution 2: Two Write Pointers (optimal — single pass)
 * Time: O(n) — one pass through input
 * Space: O(n) — output array only
 */
function rearrangeArrayElementsBySign(nums: number[]): number[] {
  const n = nums.length;
  const ans = new Array<number>(n);
  let posIdx = 0; // next even index for positives
  let negIdx = 1; // next odd index for negatives

  for (const num of nums) {
    if (num > 0) {
      ans[posIdx] = num;
      posIdx += 2;
    } else {
      ans[negIdx] = num;
      negIdx += 2;
    }
  }
  return ans;
}

// === Test Cases ===
console.log(rearrangeArrayElementsBySign([3, 1, -2, -5, 2, -4])); // [3,-2,1,-5,2,-4]
console.log(rearrangeArrayElementsBySign([-1, 1])); // [1,-1]
console.log(rearrangeArrayElementsBySign([1, -1, 2, -2])); // [1,-1,2,-2]
console.log(rearrangeArrayElementsBySign([-3, 1, -2, 2])); // [1,-3,2,-2]
```

---

## 🔗 Related Problems

- [Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity) — same pattern: partition by condition
- [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers) — Two Pointers
- [Find the Array Concatenation Value](https://leetcode.com/problems/find-the-array-concatenation-value) — Two Pointers
- [Flipping an Image](https://leetcode.com/problems/flipping-an-image) — Array simulation
- [Rearrange Array Elements by Sign — LeetCode](https://leetcode.com/problems/rearrange-array-elements-by-sign) — problem page
