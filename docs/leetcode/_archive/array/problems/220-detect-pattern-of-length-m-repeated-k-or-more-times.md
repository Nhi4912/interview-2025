---
layout: page
title: "Detect Pattern of Length M Repeated K or More Times"
difficulty: Easy
category: Array
tags: [Array, Enumeration]
leetcode_url: "https://leetcode.com/problems/detect-pattern-of-length-m-repeated-k-or-more-times"
---

# Detect Pattern of Length M Repeated K or More Times / Phát Hiện Mẫu Độ Dài M Lặp K Lần

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Sliding Window / Consecutive Check

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như kiểm tra tờ vải hoa văn — bạn nhìn xem có đoạn nào mà một mẫu hoa văn dài m ô xuất hiện liên tiếp ít nhất k lần liền nhau không.

**Pattern Recognition:**

- For each starting index `s`, check if `arr[s..s+m-1]` repeats k times consecutively
- Equivalently: `arr[i] == arr[i + m]` for `m*(k-1)` consecutive positions starting at `s`
- Single loop: count consecutive matches; if count ≥ m\*(k-1) at any s → true

**Visual:**

```
arr=[1,2,4,4,4,4], m=1, k=3
Check i=0: arr[0]≠arr[1] → reset
Check i=1: arr[1]≠arr[2] → reset
Check i=2: arr[2]=arr[3]=4 ✓ count=1
Check i=3: arr[3]=arr[4]=4 ✓ count=2
Check i=4: arr[4]=arr[5]=4 ✓ count=3 ≥ m*(k-1)=1*2=2 → true!
```

## Problem Description

Given integer array `arr` and integers `m` and `k`, return `true` if there is a contiguous subarray of length `m` that is repeated `k` or more times consecutively (with no gaps between repetitions).

**Example 1:** `arr=[1,2,4,4,4,4], m=1, k=3` → `true` (pattern `[4]` repeated 3+ times)
**Example 2:** `arr=[1,2,1,2,1,1,1,3], m=2, k=2` → `true` (pattern `[1,2]` repeated 2+ times)
**Example 3:** `arr=[1,2,1,2,1,3], m=2, k=3` → `false`

**Constraints:** `2 ≤ arr.length ≤ 100`, `1 ≤ m ≤ 100`, `2 ≤ k ≤ 100`

## 📝 Interview Tips

1. **Clarify**: Must the pattern repeat exactly at adjacent positions (no gaps)? (Yes)
2. **Approach**: Check `arr[i] === arr[i+m]` sliding; if m\*(k-1) consecutive matches → found
3. **Edge cases**: m×k > arr.length (impossible), k=2 with m=1
4. **Optimize**: Keep a count of consecutive valid comparisons; reset on mismatch
5. **Follow-up**: What if repetitions can overlap?
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Count consecutive valid shifts — Time: O(n) | Space: O(1)
function containsPattern(arr: number[], m: number, k: number): boolean {
  const needed = m * (k - 1); // consecutive matches needed
  let count = 0;

  for (let i = 0; i + m < arr.length; i++) {
    if (arr[i] === arr[i + m]) {
      count++;
      if (count >= needed) return true;
    } else {
      count = 0;
    }
  }

  return false;
}

// Solution 2: Brute force — check each starting position — Time: O(n*m*k) | Space: O(1)
function containsPattern2(arr: number[], m: number, k: number): boolean {
  const n = arr.length;

  for (let s = 0; s + m * k <= n; s++) {
    let matches = true;
    outer: for (let rep = 1; rep < k; rep++) {
      for (let j = 0; j < m; j++) {
        if (arr[s + j] !== arr[s + rep * m + j]) {
          matches = false;
          break outer;
        }
      }
    }
    if (matches) return true;
  }

  return false;
}

// Solution 3: String-based — Time: O(n) | Space: O(n)
function containsPattern3(arr: number[], m: number, k: number): boolean {
  const s = arr.join(",") + ",";
  // Check every substring of length m
  for (let i = 0; i + m <= arr.length; i++) {
    const pattern = arr.slice(i, i + m).join(",") + ",";
    const repeated = pattern.repeat(k);
    if (s.includes(repeated, i * 2)) return true; // rough check
  }
  return false;
}

// Tests
console.log(containsPattern([1, 2, 4, 4, 4, 4], 1, 3)); // true
console.log(containsPattern([1, 2, 1, 2, 1, 1, 1, 3], 2, 2)); // true
console.log(containsPattern([1, 2, 1, 2, 1, 3], 2, 3)); // false
console.log(containsPattern2([1, 2, 4, 4, 4, 4], 1, 3)); // true
console.log(containsPattern([2, 2], 1, 2)); // true
```

## 🔗 Related Problems

| Problem                                                                                                | Relationship                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| [Repeated Substring Pattern (LeetCode 459)](https://leetcode.com/problems/repeated-substring-pattern/) | Detect repeated pattern in string |
| [Find the Duplicate Number (LeetCode 287)](https://leetcode.com/problems/find-the-duplicate-number/)   | Pattern/repetition detection      |
| [Is Subsequence (LeetCode 392)](https://leetcode.com/problems/is-subsequence/)                         | Consecutive element matching      |
