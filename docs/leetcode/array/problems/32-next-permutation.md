---
layout: page
title: "Next Permutation"
difficulty: Medium
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/next-permutation"
---

# Next Permutation / Hoán Vị Tiếp Theo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Rightmost Ascending Pair + Reverse Suffix
> **Frequency**: ⭐ Tier 2 — Gặp ở 31+ companies
> **See also**: [Permutations](https://leetcode.com/problems/permutations) | [Permutation Sequence](https://leetcode.com/problems/permutation-sequence)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng số 1 3 5 4 2 trên đồng hồ số. Bạn muốn tăng lên giá trị nhỏ nhất có thể. Tìm **chữ số thấp nhất từ phải** mà còn nhỏ hơn chữ số bên phải nó — đó là điểm "yếu nhất" cần tăng. Đổi nó với số nhỏ nhất lớn hơn nó ở phần đuôi, rồi **sort lại phần đuôi** (đảo ngược vì đuôi đang giảm dần).

- **Pattern Recognition:**
  - Signal: "next lexicographic permutation" → **Find pivot + swap + reverse suffix**
  - Đuôi giảm dần = đã là lớn nhất có thể → cần tăng pivot ngay trước đuôi
  - 4 bước: tìm pivot i, tìm j > i với nums[j] > nums[i], swap, reverse [i+1..]

- **Visual — nums = [1, 3, 5, 4, 2]:**

```
Array:  1   3   5   4   2
        0   1   2   3   4

Step 1: Scan right→left for nums[i] < nums[i+1]
        i=3: 4 > 2 → no
        i=2: 5 > 4 → no
        i=1: 3 < 5 → FOUND pivot at i=1

Step 2: Find rightmost j > i where nums[j] > nums[i]=3
        j=4: nums[4]=2 < 3 → no
        j=3: nums[3]=4 > 3 → FOUND j=3

Step 3: Swap nums[1] and nums[3]:
        [1, 4, 5, 3, 2]

Step 4: Reverse suffix [i+1..end] = [2..4]:
        [1, 4, 2, 3, 5]  ✓

Edge: [3,2,1] (fully descending) → no pivot found → reverse all → [1,2,3]
```

---

## Problem Description

Given an array of integers `nums`, rearrange it into the **next lexicographically greater permutation**.
If no such arrangement exists (already the largest), rearrange to the **lowest possible order** (sorted ascending). Must be done **in-place**.

```
Input:  [1,2,3]   → [1,3,2]
Input:  [3,2,1]   → [1,2,3]
Input:  [1,1,5]   → [1,5,1]
Input:  [1,3,5,4,2] → [1,4,2,3,5]
```

Constraints: `1 ≤ nums.length ≤ 100`, `0 ≤ nums[i] ≤ 100`.

---

## 📝 Interview Tips

1. **4 bước rõ ràng**: Tìm pivot → tìm swap target → swap → reverse suffix / **State the 4 steps** before coding — examiners love clear plans
2. **Quét từ phải sang trái**: Pivot là phần tử đầu tiên (từ phải) nhỏ hơn phần tử bên phải / **Scan right-to-left** for the first descent
3. **Đuôi luôn giảm dần**: Sau pivot, phần đuôi đã là descending — reverse là O(n) thay vì sort O(n log n) / **Suffix is always descending** so reverse (not sort) it
4. **No pivot found**: Toàn bộ mảng descending → reverse toàn bộ / **Edge: fully descending** → reverse all = smallest permutation
5. **In-place**: Không dùng array mới, swap trực tiếp / **In-place requirement**: no extra arrays

---

## Solutions

```typescript
/**
 * Solution: O(n) in-place — 4-step algorithm
 * Time: O(n) | Space: O(1)
 */
function nextPermutation(nums: number[]): void {
  const n = nums.length;

  // Step 1: Find rightmost i where nums[i] < nums[i+1]
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;

  if (i >= 0) {
    // Step 2: Find rightmost j > i where nums[j] > nums[i]
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;

    // Step 3: Swap pivot with successor
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // Step 4: Reverse the suffix [i+1 .. n-1]
  let left = i + 1,
    right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}

// === Test Cases ===
const t1 = [1, 2, 3];
nextPermutation(t1);
console.log(JSON.stringify(t1)); // [1,3,2]
const t2 = [3, 2, 1];
nextPermutation(t2);
console.log(JSON.stringify(t2)); // [1,2,3]
const t3 = [1, 1, 5];
nextPermutation(t3);
console.log(JSON.stringify(t3)); // [1,5,1]
const t4 = [1, 3, 5, 4, 2];
nextPermutation(t4);
console.log(JSON.stringify(t4)); // [1,4,2,3,5]
const t5 = [1];
nextPermutation(t5);
console.log(JSON.stringify(t5)); // [1]
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| [Permutations](https://leetcode.com/problems/permutations)                                                                                       | Generate all permutations; next permutation is one step forward |
| [Permutation Sequence](https://leetcode.com/problems/permutation-sequence)                                                                       | Find k-th permutation using similar digit logic                 |
| [Previous Permutation With One Swap](https://leetcode.com/problems/previous-permutation-with-one-swap)                                           | Symmetric problem: find previous permutation                    |
| [Minimum Adjacent Swaps to Reach the Kth Smallest Number](https://leetcode.com/problems/minimum-adjacent-swaps-to-reach-the-kth-smallest-number) | Apply next permutation k times, count swaps                     |
