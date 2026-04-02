---
layout: page
title: "Maximum Equal Frequency"
difficulty: Hard
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/maximum-equal-frequency"
---

# Maximum Equal Frequency / Tần Số Bằng Nhau Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Hash Map / Invariant Checking

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Tại mỗi vị trí prefix `p`, kiểm tra xem có thể xóa đúng 1 phần tử để tất cả các phần tử còn lại có tần số bằng nhau không. Dùng hai map: `freq[x]` = số lần x xuất hiện trong prefix, `freqCount[f]` = số phần tử có tần số f. Có 4 trường hợp hợp lệ:

**EN:** At each prefix position `p`, check if removing exactly 1 element makes all remaining frequencies equal. Track `freq[x]` and `freqCount[f]` (how many elements have frequency f). There are exactly 4 valid cases to check:

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Equal Frequency example:**

```
4 Valid Cases (prefix length = p+1, distinct count = d):
1. maxFreq == 1           → every element appears once → remove any one
2. maxFreq * d == p+1 - 1 AND maxFreq == p+1/d  → can remove one from any group
   (wait: maxFreq * d == p AND freqCount[maxFreq] == d)
3. (maxFreq+1)*1 == p+1 AND freqCount[maxFreq+1] == 1 → one element appears maxFreq+1 times
4. maxFreq == p           → all same element, remove one copy
   (Also: d == 1 → only one distinct value, all copies → remove 1)

Track answer = max prefix length where any case holds.
```

---

---

## Problem Description

| #    | Problem                                              | Difficulty | Pattern           |
| ---- | ---------------------------------------------------- | ---------- | ----------------- |
| 451  | Sort Characters By Frequency                         | 🟡 Medium  | Hash Map          |
| 659  | Split Array into Consecutive Subsequences            | 🟡 Medium  | Greedy + Hash Map |
| 2982 | Find Longest Special Substring That Occurs Thrice II | 🔴 Hard    | Hash Map          |

---

## 📝 Interview Tips

- 🔴 **EN:** Maintain `freq` (element→count) and `freqCount` (count→how many elements have it).
  **VI:** Duy trì `freq` (phần tử→đếm) và `freqCount` (đếm→số phần tử có đếm đó).
- 🔴 **EN:** Also track `maxFreq` and `distinctCount` at each step.
  **VI:** Theo dõi thêm `maxFreq` và `distinctCount` ở mỗi bước.
- 🔴 **EN:** The 4 valid conditions cover all ways removing 1 element equalizes frequencies.
  **VI:** 4 điều kiện hợp lệ bao phủ tất cả cách xóa 1 phần tử để cân bằng tần số.
- 🔴 **EN:** Case 1: all freq=1 (remove any). Case 2: all same freq, divisible. Case 3: one outlier with freq+1. Case 4: all same element.
  **VI:** Case 1: mọi tần số=1. Case 2: cùng tần số, tổng chia hết. Case 3: một phần tử ngoại lệ. Case 4: chỉ một giá trị phân biệt.
- 🔴 **EN:** Time O(n), Space O(n) — update maps in O(1) per element.
  **VI:** Thời gian O(n), Không gian O(n) — cập nhật map O(1) mỗi phần tử.
- 🔴 **EN:** Answer is the maximum prefix length (1-indexed) where the condition holds.
  **VI:** Đáp án là độ dài prefix tối đa (đánh số từ 1) thỏa điều kiện.

---

---

## Solutions

```typescript
function maxEqualFreq(nums: number[]): number {
  const freq = new Map<number, number>(); // element → frequency
  const freqCount = new Map<number, number>(); // frequency → # of elements with that freq
  let maxFreq = 0;
  let ans = 0;

  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    const prevFreq = freq.get(x) ?? 0;

    // Update freqCount: remove old frequency bucket
    if (prevFreq > 0) {
      const oldCount = freqCount.get(prevFreq)!;
      if (oldCount === 1) freqCount.delete(prevFreq);
      else freqCount.set(prevFreq, oldCount - 1);
    }

    // Update freq
    const newFreq = prevFreq + 1;
    freq.set(x, newFreq);
    freqCount.set(newFreq, (freqCount.get(newFreq) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, newFreq);

    const prefixLen = i + 1;
    const distinct = freq.size;

    // Check 4 valid cases:
    const valid =
      // Case 1: all elements appear exactly once → remove any one
      maxFreq === 1 ||
      // Case 2: all elements same frequency, and (freq * distinct == prefixLen - 1)
      //         i.e., can remove one element leaving equal freqs
      (freqCount.get(maxFreq) === distinct && maxFreq * distinct === prefixLen - 1) ||
      // Case 3: one element has freq = maxFreq, others have maxFreq-1
      //         i.e., freqCount[maxFreq] == 1 and (maxFreq-1) * (distinct-1) + maxFreq == prefixLen
      (freqCount.get(maxFreq) === 1 && (maxFreq - 1) * (distinct - 1) + maxFreq === prefixLen) ||
      // Case 4: only one distinct value → remove one copy
      distinct === 1;

    if (valid) ans = prefixLen;
  }
  return ans;
}

// Test cases
console.log(maxEqualFreq([2, 2, 1, 1, 5, 3, 3, 5])); // Expected: 7
console.log(maxEqualFreq([1, 1, 1, 2, 2, 2])); // Expected: 5
console.log(maxEqualFreq([1, 1, 1, 2, 2, 2, 3, 3, 3, 4])); // Expected: 10
console.log(maxEqualFreq([1])); // Expected: 1
console.log(maxEqualFreq([1, 2])); // Expected: 2

function maxEqualFreq_labeled(nums: number[]): number {
  const cnt = new Map<number, number>(); // val → freq
  const fcnt = new Map<number, number>(); // freq → # vals with that freq
  let maxF = 0,
    ans = 0;

  for (let i = 0; i < nums.length; i++) {
    const v = nums[i];
    const f = cnt.get(v) ?? 0;
    if (f > 0) fcnt.set(f, (fcnt.get(f) ?? 1) - 1);
    cnt.set(v, f + 1);
    fcnt.set(f + 1, (fcnt.get(f + 1) ?? 0) + 1);
    maxF = Math.max(maxF, f + 1);

    const len = i + 1,
      d = cnt.size;
    // All freq=1: remove any
    if (maxF === 1) {
      ans = len;
      continue;
    }
    // One big, rest freq=1: big has freq=2, exactly 1 element → remove one of the big
    if (maxF === 2 && fcnt.get(2) === 1 && fcnt.get(1) === d - 1) {
      ans = len;
      continue;
    }
    // maxFreq*(d) = len-1: e.g. freq=2, d=3, len=7 → remove one whole element (freq→0)
    if (maxF * d === len - 1 && fcnt.get(maxF) === d) {
      ans = len;
      continue;
    }
    // One outlier: 1 element at maxF, rest at maxF-1, and removing 1 from outlier works
    if (fcnt.get(maxF) === 1 && (maxF - 1) * (d - 1) + maxF === len) {
      ans = len;
      continue;
    }
    // All same element
    if (d === 1) {
      ans = len;
      continue;
    }
  }
  return ans;
}

console.log(maxEqualFreq_labeled([2, 2, 1, 1, 5, 3, 3, 5])); // Expected: 7
console.log(maxEqualFreq_labeled([1, 1, 1, 2, 2, 2, 3, 3, 3, 4])); // Expected: 10
```

---

## 🔗 Related Problems

| #    | Problem                                              | Difficulty | Pattern           |
| ---- | ---------------------------------------------------- | ---------- | ----------------- |
| 451  | Sort Characters By Frequency                         | 🟡 Medium  | Hash Map          |
| 659  | Split Array into Consecutive Subsequences            | 🟡 Medium  | Greedy + Hash Map |
| 2982 | Find Longest Special Substring That Occurs Thrice II | 🔴 Hard    | Hash Map          |
