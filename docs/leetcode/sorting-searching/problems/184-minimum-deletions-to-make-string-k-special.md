---
layout: page
title: "Minimum Deletions to Make String K-Special"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-deletions-to-make-string-k-special"
---

# Minimum Deletions to Make String K-Special / Xóa Tối Thiểu Để Chuỗi K-Đặc Biệt

🟡 Medium | 🏷️ Hash Table, String, Greedy, Sorting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có nhiều loại kẹo. Một chuỗi là K-đặc biệt nếu với mọi cặp ký tự a,b: |freq(a) - freq(b)| ≤ k. Sắp xếp tần số theo thứ tự tăng dần. Với mỗi tần số nhỏ nhất làm "baseline", xóa tất cả ký tự có tần số nhỏ hơn baseline, và cắt tần số lớn hơn baseline+k.

```
freq: [1, 2, 3, 5, 7], k=2
Fix baseline=3: delete freq<3 → delete (1+2)=3, clip 5→5, 7→5 → total=3+0+2=5
Fix baseline=2: delete freq<2 → delete 1=1, clip 3→4,5→4,7→4 → total=1+0+1+3=5
Pick minimum over all baseline choices!
```

## Problem Description

Given a string `word` and an integer `k`, a string is **k-special** if for every pair of characters `a` and `b`, `|freq(a) - freq(b)| <= k`. Return the **minimum deletions** needed to make `word` k-special.

**Example 1:** `word = "aabcaba", k = 0` → `3` (delete all c and one b so all remaining letters have equal frequency)

**Example 2:** `word = "aabcaba", k = 2` → `2`

## 📝 Interview Tips

- 🔑 **Key insight / Chìa khóa:** Sort frequencies; enumerate each freq[i] as the minimum baseline — O(26²) is fine
- 🔑 **Greedy choice / Tham lam:** For each baseline, total cost = sum of freq[j] for j<i (delete entirely) + sum of max(0, freq[j]-baseline-k) for j>i (trim excess)
- 🔑 **Prefix sum / Tiền tố:** Pre-compute prefix sums of sorted frequencies to evaluate each baseline in O(1)
- ⚠️ **Edge case / Trường hợp biên:** k ≥ max(freq) − min(freq) → answer is 0; single character → 0
- ⚠️ **Off-by-one / Lỗi lệch 1:** Upper bound is `freq[i] + k`, not `freq[i] + k - 1`
- 🔗 **Pattern / Mẫu:** Enumerate threshold + greedy trim is a common "frequency equalisation" template

## Solutions

### Solution 1: Sort + Enumerate Baseline (Greedy)

```typescript
/**
 * Sort character frequencies, try each as the minimum baseline.
 * Time: O(n + 26 log 26) = O(n)  Space: O(26) = O(1)
 */
function minimumDeletions(word: string, k: number): number {
  // Count frequencies
  const freq = new Array(26).fill(0);
  for (const ch of word) freq[ch.charCodeAt(0) - 97]++;

  // Keep only non-zero, sort ascending
  const sorted = freq.filter((f) => f > 0).sort((a, b) => a - b);
  const n = sorted.length;

  // Prefix sum for O(1) range queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + sorted[i];

  let minDel = Infinity;

  for (let i = 0; i < n; i++) {
    const base = sorted[i]; // This freq becomes the minimum
    const cap = base + k; // Maximum allowed frequency

    // Delete all chars with freq < base (indices 0..i-1)
    const deleteFull = prefix[i];

    // Trim chars with freq > base+k (indices i+1..n-1)
    let trimCost = 0;
    for (let j = i + 1; j < n; j++) {
      if (sorted[j] > cap) trimCost += sorted[j] - cap;
    }

    minDel = Math.min(minDel, deleteFull + trimCost);
  }

  // Also consider deleting everything except the largest group
  minDel = Math.min(minDel, prefix[n] - sorted[n - 1]);

  return minDel;
}

// Tests
console.log(minimumDeletions("aabcaba", 0)); // 3
console.log(minimumDeletions("aabcaba", 2)); // 2
console.log(minimumDeletions("aaaaa", 1)); // 0
console.log(minimumDeletions("abcde", 0)); // 4
```

### Solution 2: Optimised with Binary Search for Trim

```typescript
/**
 * Use binary search to find the first index exceeding cap, then use prefix sums.
 * Time: O(n + 26 log 26)  Space: O(26)
 */
function minimumDeletionsOpt(word: string, k: number): number {
  const freq = new Array(26).fill(0);
  for (const ch of word) freq[ch.charCodeAt(0) - 97]++;

  const sorted = freq.filter((f) => f > 0).sort((a, b) => a - b);
  const n = sorted.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + sorted[i];

  let minDel = Infinity;

  for (let i = 0; i < n; i++) {
    const cap = sorted[i] + k;

    // Binary search for first index where sorted[j] > cap
    let lo = i + 1,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] <= cap) lo = mid + 1;
      else hi = mid;
    }
    // lo = first index with sorted[lo] > cap
    const trimStart = lo;
    const deleteFull = prefix[i];
    const trimCost = prefix[n] - prefix[trimStart] - (n - trimStart) * cap;

    minDel = Math.min(minDel, deleteFull + trimCost);
  }

  return minDel;
}

console.log(minimumDeletionsOpt("aabcaba", 0)); // 3
console.log(minimumDeletionsOpt("aabcaba", 2)); // 2
console.log(minimumDeletionsOpt("aaaaa", 1)); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                                         | Difficulty | Pattern                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------- |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/)   | Medium     | Sort + sliding window  |
| [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/) | Medium     | Greedy on frequencies  |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                                                 | Medium     | Frequency-based greedy |
| [Reorganize String](https://leetcode.com/problems/reorganize-string/)                                                                           | Medium     | Max heap + frequency   |
