---
layout: page
title: "Rotate Array"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Math]
leetcode_url: "https://leetcode.com/problems/rotate-array/"
---

# Rotate Array / Xoay Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array Reversal  
> **Frequency**: 📘 Tier 3 — Tests in-place manipulation and reverse trick insight  
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Rotate Image](11-rotate-image.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng một đoàn tàu gồm 7 toa. Xoay 3 bước về phải = 3 toa cuối chạy lên đầu. Thủ thuật đảo ngược: lật cả đoàn tàu → lật 3 toa đầu → lật 4 toa còn lại. Ba lần lật, mỗi lần O(n), tổng O(1) bộ nhớ.

- **Pattern Recognition:**
  - In-place rotation + O(1) space constraint → **Triple Reverse trick**
  - `k % n` trước để xử lý k > n
  - Brute force (shift từng bước k lần) là O(n·k) — không đủ cho large k

- **Visual — Triple Reverse:**

```
nums = [1, 2, 3, 4, 5, 6, 7],  k = 3
                                (k % 7 = 3)

Step 1: Reverse all
        [7, 6, 5, 4, 3, 2, 1]

Step 2: Reverse first k=3
        [5, 6, 7, 4, 3, 2, 1]

Step 3: Reverse rest [k..n-1]
        [5, 6, 7, 1, 2, 3, 4]  ✓
```

## Problem Description

Given array `nums`, rotate it to the **right** by `k` steps in-place.

```
Input:  [1,2,3,4,5,6,7], k=3    → [5,6,7,1,2,3,4]
Input:  [-1,-100,3,99],  k=2    → [3,99,-1,-100]
Input:  [1,2,3],         k=4    → [2,3,1]   (k%n=1)
```

## 📝 Interview Tips

1. **Xử lý k > n**: Luôn tính `k = k % n` đầu tiên để tránh vòng lặp thừa / **Normalize k**: `k %= n` first — interviewer will test this edge case
2. **Ba giải pháp phổ biến**: Extra array O(n) space; Reverse O(1) space; Cyclic replacement O(1) space / **Know 3**: extra array (easy), reverse trick (elegant), cyclic (tricky)
3. **Reverse trick phải nhớ**: Reverse all → reverse [0..k-1] → reverse [k..n-1] / **Order matters**: all → first k → last n-k
4. **Edge cases**: k=0 hoặc k%n=0 → no-op; length ≤ 1 → no-op; k=n → same array
5. **Sai lầm phổ biến**: Quên `k %= n` → TLE hoặc wrong answer khi k > n / **Trap**: forgetting modulo — k can be larger than array length
6. **Tại sao Medium?**: Brute O(n·k) dễ viết, O(1) space inplace đòi hỏi insight / **Why Medium**: O(n·k) brute is obvious; the insight is non-trivial

## Solutions

{% raw %}
/\*\*

- Solution 1: Triple Reverse — Optimal (in-place)
- Time: O(n) | Space: O(1)
  \*/
  function rotate(nums: number[], k: number): void {
  const n = nums.length;
  k %= n;
  if (k === 0) return;

const reverse = (l: number, r: number): void => {
while (l < r) {
[nums[l], nums[r]] = [nums[r], nums[l]];
l++; r--;
}
};

reverse(0, n - 1); // reverse all
reverse(0, k - 1); // reverse first k
reverse(k, n - 1); // reverse last n-k
}

/\*\*

- Solution 2: Extra Array — Simple (O(n) space, good as brute force mention)
- Time: O(n) | Space: O(n)
  \*/
  function rotateBrute(nums: number[], k: number): void {
  const n = nums.length;
  k %= n;
  if (k === 0) return;

const rotated = new Array(n);
for (let i = 0; i < n; i++) rotated[(i + k) % n] = nums[i];
for (let i = 0; i < n; i++) nums[i] = rotated[i];
}

// Inline tests
const r1 = [1,2,3,4,5,6,7]; rotate(r1, 3); console.log(JSON.stringify(r1) === '[5,6,7,1,2,3,4]'); // true
const r2 = [-1,-100,3,99]; rotate(r2, 2); console.log(JSON.stringify(r2) === '[3,99,-1,-100]'); // true
const r3 = [1,2,3]; rotate(r3, 4); console.log(JSON.stringify(r3) === '[3,1,2]'); // true
const r4 = [1]; rotate(r4, 5); console.log(JSON.stringify(r4) === '[1]'); // true
{% endraw %}

## 🔗 Related Problems

| Problem                                                            | Relationship                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| [#11 Rotate Image](11-rotate-image.md)                             | Rotation concept extended to 2D matrix (also uses reversal) |
| [#01 Remove Duplicates](01-remove-duplicates-from-sorted-array.md) | In-place array manipulation without extra space             |
| [#09 Move Zeroes](09-move-zeroes.md)                               | In-place element rearrangement, same O(1) space constraint  |
| [#13 Set Matrix Zeroes](13-set-matrix-zeroes.md)                   | In-place array/matrix modification pattern                  |
