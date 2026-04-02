---
layout: page
title: "Longest Harmonious Subsequence"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sliding Window, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/longest-harmonious-subsequence"
---

# Longest Harmonious Subsequence / Dãy Con Hài Hòa Dài Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Sorting

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Một dãy "hài hòa" có giá trị lớn nhất và nhỏ nhất hơn nhau đúng 1. Đếm tần số từng số, rồi với mỗi số `k`, kiểm tra xem `freq[k] + freq[k+1]` có tạo thành dãy hài hòa không. Lấy giá trị lớn nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Longest Harmonious Subsequence example:**

```
nums = [1, 3, 2, 2, 5, 2, 3, 7]
freq: {1:1, 3:2, 2:3, 5:1, 7:1}

Check each key:
  k=1: freq[1]+freq[2] = 1+3 = 4
  k=2: freq[2]+freq[3] = 3+2 = 5  ← max
  k=3: freq[3]+freq[4] = 2+0 = skip (no k+1)
  k=5: freq[5]+freq[6] = 1+0 = skip
  k=7: freq[7]+freq[8] = 1+0 = skip
Answer: 5 ✅
```

---

## Problem Description

| #   | Problem                        | Pattern      |
| --- | ------------------------------ | ------------ |
| 594 | Longest Harmonious Subsequence | This problem |
| 128 | Longest Consecutive Sequence   | Hash Set     |
| 1   | Two Sum                        | Hash Map     |
| 532 | K-diff Pairs in an Array       | Hash Map     |

---

## 📝 Interview Tips

- 🔑 **Harmonic = diff 1** / Dãy hài hòa: max - min = 1 chính xác (không phải ≤ 1)
- 🔑 **Subsequence** / Không cần liên tục — chỉ cần đếm tần số
- 🔑 **HashMap O(n)** / Đếm freq rồi duyệt một lần — tổng O(n)
- 🔑 **Only check k and k+1** / Không cần kiểm tra k-1 vì đã kiểm tra khi duyệt (k-1)
- 🔑 **Skip if no neighbor** / Chỉ tính khi cả freq[k] và freq[k+1] đều tồn tại
- 🔑 **Sorting approach** / Sắp xếp rồi sliding window cũng hoạt động — O(n log n)

---

## Solutions

```typescript
// ─── Solution 1: Sort + Sliding Window — O(n log n) ───
function findLHSSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let left = 0,
    ans = 0;
  for (let right = 1; right < nums.length; right++) {
    // Shrink window while difference > 1
    while (nums[right] - nums[left] > 1) left++;
    // Count only if difference is exactly 1
    if (nums[right] - nums[left] === 1) ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

console.log(findLHSSort([1, 3, 2, 2, 5, 2, 3, 7])); // 5
console.log(findLHSSort([1, 2, 3, 4])); // 2

// ─── Solution 2: Hash Map — O(n) ───
function findLHS(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);

  let ans = 0;
  for (const [k, cnt] of freq) {
    // Check if k+1 exists → harmonic subsequence of length cnt + freq[k+1]
    if (freq.has(k + 1)) {
      ans = Math.max(ans, cnt + freq.get(k + 1)!);
    }
  }
  return ans;
}

console.log(findLHS([1, 3, 2, 2, 5, 2, 3, 7])); // 5
console.log(findLHS([1, 2, 3, 4])); // 2
console.log(findLHS([1, 1, 1, 1])); // 0 (no neighbor)
console.log(findLHS([1])); // 0

// ─── Solution 3: Hash Map, two-pass with both directions ───
function findLHSV2(nums: number[]): number {
  const freq: Map<number, number> = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);

  let ans = 0;
  for (const [k, cnt] of freq) {
    // Check k+1 (avoid double counting by checking only one direction)
    const next = freq.get(k + 1);
    if (next !== undefined) ans = Math.max(ans, cnt + next);
  }
  return ans;
}

console.log(findLHSV2([1, 3, 2, 2, 5, 2, 3, 7])); // 5
console.log(findLHSV2([0, 0])); // 0
console.log(findLHSV2([-3, -2, -2, -1, 1, 2])); // 3
```

---

## 🔗 Related Problems

| #   | Problem                        | Pattern      |
| --- | ------------------------------ | ------------ |
| 594 | Longest Harmonious Subsequence | This problem |
| 128 | Longest Consecutive Sequence   | Hash Set     |
| 1   | Two Sum                        | Hash Map     |
| 532 | K-diff Pairs in an Array       | Hash Map     |
