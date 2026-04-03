---
layout: page
title: "Find All Good Indices"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-all-good-indices"
---

# Find All Good Indices / Tìm Tất Cả Chỉ Số Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như kiểm tra "cửa sổ đối xứng" — với mỗi vị trí i, cần k phần tử bên trái không tăng và k phần tử bên phải không giảm. Thay vì kiểm tra lại từ đầu mỗi lần, ta dùng hai mảng tiền xử lý để trả lời trong O(1).

**Pattern Recognition:**

- Signal: "check k-length window property at each position" → **Prefix counting arrays**
- `dec[i]` = độ dài chuỗi không tăng dài nhất kết thúc tại i (tính từ trái)
- `inc[i]` = độ dài chuỗi không giảm dài nhất kết thúc tại i (tính từ trái)

**Visual — nums = [2, 1, 1, 1, 3, 4, 1], k = 2:**

```
i:    0  1  2  3  4  5  6
val:  2  1  1  1  3  4  1
dec:  1  2  3  4  1  1  2   (non-increasing runs ending here)
inc:  1  1  2  3  4  5  1   (non-decreasing runs ending here)

For i=2: dec[1]=2 ≥ k=2 ✓  inc[4]=4 ≥ k=2 ✓ → GOOD
For i=3: dec[2]=3 ≥ 2 ✓   inc[5]=5 ≥ 2 ✓ → GOOD
For i=4: dec[3]=4 ≥ 2 ✓   inc[6]=1 < 2  ✗ → NOT GOOD
Answer: [2, 3]
```

---

## Problem Description

An index `i` (k ≤ i < n−k) is **good** if the `k` elements before it are non-increasing AND the `k` elements after it are non-decreasing. Return all good indices in sorted order. ([LeetCode 2420](https://leetcode.com/problems/find-all-good-indices))

**Example 1:** `nums=[2,1,1,1,3,4,1], k=2` → `[2,3]`

**Example 2:** `nums=[2,1,1,2], k=2` → `[]`

Constraints: `n >= 2k+1`, `1 <= k <= n/2`, `1 <= nums[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Non-increasing nghĩa là cho phép bằng nhau (≥), non-decreasing tương tự (≤)" / Non-increasing allows equal elements (≥), not strict
2. **Build dec array**: "dec[i] = dec[i-1]+1 nếu nums[i] ≤ nums[i-1], else 1" / Extend run if current ≤ previous
3. **Build inc array**: "inc[i] = inc[i-1]+1 nếu nums[i] ≥ nums[i-1], else 1" / Extend run if current ≥ previous
4. **Check condition**: "i good ↔ dec[i-1] ≥ k AND inc[i+k] ≥ k" / Left k elements non-increasing = dec[i-1]≥k
5. **Index bounds**: "i chạy từ k đến n-k-1 (inclusive); đừng nhầm off-by-one" / i ∈ [k, n-k-1]; check boundary carefully
6. **Time/Space**: "O(n) time và space — hai mảng tiền xử lý một lần" / Two O(n) preprocessing passes

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check each candidate directly
 * Time: O(n * k) — for each valid i, scan k elements left and right
 * Space: O(1) output aside
 */
function goodIndicesBrute(nums: number[], k: number): number[] {
  const n = nums.length;
  const result: number[] = [];

  for (let i = k; i < n - k; i++) {
    let leftOk = true,
      rightOk = true;
    for (let j = i - k; j < i - 1; j++)
      if (nums[j] < nums[j + 1]) {
        leftOk = false;
        break;
      }
    for (let j = i + 1; j < i + k; j++)
      if (nums[j] > nums[j + 1]) {
        rightOk = false;
        break;
      }
    if (leftOk && rightOk) result.push(i);
  }
  return result;
}

/**
 * Solution 2: Prefix counting arrays — O(n) time
 * Time: O(n) — two linear preprocessing passes + one scan
 * Space: O(n) — dec and inc arrays
 */
function goodIndices(nums: number[], k: number): number[] {
  const n = nums.length;

  // dec[i] = length of longest non-increasing run ending at index i
  const dec = new Array(n).fill(1);
  for (let i = 1; i < n; i++) if (nums[i] <= nums[i - 1]) dec[i] = dec[i - 1] + 1;

  // inc[i] = length of longest non-decreasing run ending at index i
  const inc = new Array(n).fill(1);
  for (let i = 1; i < n; i++) if (nums[i] >= nums[i - 1]) inc[i] = inc[i - 1] + 1;

  const result: number[] = [];
  // i is good if:
  //   - k elements before i are non-increasing → dec[i-1] >= k
  //   - k elements after i are non-decreasing  → inc[i+k] >= k
  for (let i = k; i < n - k; i++) {
    if (dec[i - 1] >= k && inc[i + k] >= k) result.push(i);
  }
  return result;
}

// === Test Cases ===
console.log(JSON.stringify(goodIndices([2, 1, 1, 1, 3, 4, 1], 2))); // [2,3]
console.log(JSON.stringify(goodIndices([2, 1, 1, 2], 2))); // []
console.log(JSON.stringify(goodIndices([1, 1, 1, 1, 1], 2))); // [2]
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern             |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)           | 🔴 Hard    | Prefix Sum          |
| [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)         | 🔴 Hard    | Prefix Sum          |
| [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray)                             | 🟡 Medium  | DP / Sliding Window |
| [Maximum Strength of K Disjoint Subarrays](https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays) | 🔴 Hard    | Prefix Sum + DP     |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                                   | 🔴 Hard    | Binary Search + DP  |
