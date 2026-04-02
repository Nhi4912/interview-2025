---
layout: page
title: "Maximize Sum Of Array After K Negations"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations"
---

# Maximize Sum Of Array After K Negations / Tối Đa Hóa Tổng Sau K Lần Đảo Dấu

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** Bạn có k lần "lật dấu" một số. Muốn tổng lớn nhất. Chiến thuật: **lật hết số âm lớn nhất trước** (âm → dương tăng tổng nhiều nhất). Còn k dư thì lật đi lật lại số **nhỏ nhất tuyệt đối** (thiệt hại ít nhất).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximize Sum Of Array After K Negations example:**

```
nums = [3, -1, 0, 2],  k = 3

Step 1: Sort: [-1, 0, 2, 3]
Step 2: Negate negatives: k=3, negate -1 → [1, 0, 2, 3], k=2
Step 3: k=2 left, min abs = 0 → negate 0 → still 0, k=1
Step 4: k=1 left (odd), negate smallest |val| = 0 → 0
Sum = 1+0+2+3 = 6 ✓

Key: if k is odd after negating all negatives → negate min(|nums[i]|) once
     if k is even → do nothing (negating same element twice = no-op)
```

**Chiến lược:** Sort by value, negate negatives from smallest to largest. If k remaining is odd, negate element with minimum absolute value.

---

## Problem Description

Given integer array `nums` and integer `k`, apply operation (negate any element) exactly `k` times to maximize the array sum. Same element can be chosen multiple times.

**Example 1:** `nums=[4,2,3]`, `k=1` → `5` (negate 2→-2? No, negate 3? Best: negate smallest → negate 2 gives `[4,-2,3]=5`. Actually -2 is worse. Negate nothing positive → best is leaving max, so negate 2: sum = 4+(-2)+3=5. Wait: k=1, we must negate once. Largest negative impact: negate smallest positive = 2 → sum=4-2+3=5 ✓)
**Example 2:** `nums=[3,-1,0,2]`, `k=3` → `6`

**Constraints:** `1 ≤ n ≤ 10^4`, `-100 ≤ nums[i] ≤ 100`, `1 ≤ k ≤ 10^4`

---

## 📝 Interview Tips

- **Sort by value:** Process negatives first (most negative = biggest gain from negation)
- **Two-phase greedy:** Phase 1: negate negatives while k > 0; Phase 2: if k odd, negate min |element|
- **Why sort by |value| for phase 2?** Negating the smallest absolute value minimizes loss
- **Parity matters:** Even remaining k = net zero effect; odd = must negate one element
- **Alternative:** Sort by absolute value descending — negate negatives in order
- **Edge case:** All positive, k odd → negate the smallest element (minimize loss)

---

## Solutions

```typescript
function largestSumAfterKNegations(nums: number[], k: number): number {
  nums.sort((a, b) => a - b); // sort ascending

  // Phase 1: negate negatives from most negative to least negative
  for (let i = 0; i < nums.length && k > 0 && nums[i] < 0; i++) {
    nums[i] = -nums[i];
    k--;
  }

  // Phase 2: if k is odd, negate the smallest absolute value (minimize loss)
  if (k % 2 === 1) {
    let minAbsIdx = 0;
    for (let i = 1; i < nums.length; i++) {
      if (Math.abs(nums[i]) < Math.abs(nums[minAbsIdx])) minAbsIdx = i;
    }
    nums[minAbsIdx] = -nums[minAbsIdx];
  }

  return nums.reduce((s, v) => s + v, 0);
}

function largestSumAfterKNegationsAbsSort(nums: number[], k: number): number {
  // Sort by absolute value descending: handle biggest impact first
  nums.sort((a, b) => Math.abs(b) - Math.abs(a));

  for (let i = 0; i < nums.length && k > 0; i++) {
    if (nums[i] < 0) {
      nums[i] = -nums[i];
      k--;
    }
  }

  // After negating all negatives, if k still odd → negate last (smallest abs value)
  if (k % 2 === 1) {
    nums[nums.length - 1] = -nums[nums.length - 1];
  }

  return nums.reduce((s, v) => s + v, 0);
}

function largestSumAfterKNegationsCounting(nums: number[], k: number): number {
  // Since -100 <= nums[i] <= 100, use frequency count
  const OFFSET = 100;
  const freq = new Array(201).fill(0);
  for (const n of nums) freq[n + OFFSET]++;

  // Negate negatives from most negative to least negative
  for (let val = -100; val < 0 && k > 0; val++) {
    const idx = val + OFFSET;
    if (freq[idx] > 0) {
      const negCount = Math.min(freq[idx], k);
      freq[idx] -= negCount;
      freq[-val + OFFSET] += negCount;
      k -= negCount;
    }
  }

  // If k is odd, negate smallest absolute value (the element at min position in freq)
  if (k % 2 === 1) {
    for (let val = 0; val <= 100; val++) {
      if (freq[val + OFFSET] > 0) {
        freq[val + OFFSET]--;
        freq[-val + OFFSET]++;
        break;
      }
    }
  }

  let total = 0;
  for (let val = -100; val <= 100; val++) {
    total += val * freq[val + OFFSET];
  }
  return total;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Similarity                   |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| [Largest Number](https://leetcode.com/problems/largest-number/)                                                 | Greedy with custom sort      |
| [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/) | Greedy array manipulation    |
| [Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers/)             | Sort + pick optimal elements |
| [Minimize Maximum Pair Sum in Array](https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/)         | Greedy pairing after sort    |
