---
layout: page
title: "Pairs of Songs With Total Durations Divisible by 60"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Counting]
leetcode_url: "https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60"
---

# Pairs of Songs With Total Durations Divisible by 60 / Cặp Bài Hát Có Tổng Thời Lượng Chia Hết Cho 60

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Majority Element](https://leetcode.com/problems/majority-element) | [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài này y chang bài Two Sum nhưng với đồng hồ: bạn muốn tìm hai bài hát mà tổng thời lượng chia hết cho 60. Tưởng tượng DJ muốn ghép các bài hát thành cặp vừa khớp một chu kỳ nhạc 60 giây — bài có remainder `r` cần được ghép với bài có remainder `(60 - r) % 60`. Đây là Two Sum mod 60!

**Pattern Recognition:**

- Signal: "pairs summing to multiple of K" → **Two Sum with modulo**
- Instead of exact complement, look for `(60 - t % 60) % 60`
- Use a count array of size 60 — no HashMap needed, just indices

**Visual — `time = [30,20,150,100,40]`:**

```
Compute remainders: [30, 20, 30, 40, 40]

i=0: r=30, need=(60-30)%60=30, count[30]=0 → pairs+=0, count[30]++  → [0..0,30:1]
i=1: r=20, need=40,            count[40]=0 → pairs+=0, count[20]++
i=2: r=30, need=30,            count[30]=1 → pairs+=1, count[30]++  → count[30]=2
i=3: r=40, need=20,            count[20]=1 → pairs+=1, count[40]++
i=4: r=40, need=20,            count[20]=1 → pairs+=1, count[40]=2

Total pairs = 3  ✅
```

---

## Problem Description

Given an integer array `time` where `time[i]` is the duration of a song in seconds, return the number of pairs `(i, j)` where `i < j` and `time[i] + time[j]` is divisible by 60.

**Example 1:** `time = [30,20,150,100,40]` → `3` (pairs: (0,2), (1,3), (3,4))

**Example 2:** `time = [60,60,60]` → `3` (all three pairs work)

Constraints:

- `1 <= time.length <= 6 * 10^4`
- `1 <= time[i] <= 500`

---

## 📝 Interview Tips

1. **Clarify**: "Pair (i,j) yêu cầu i<j — tránh đếm trùng" / Confirm ordered pairs (i < j) to avoid double counting
2. **Brute force**: "Kiểm tra tất cả pair (i,j) — O(n²)" / Check all pairs; easy to implement but slow
3. **Optimize**: "Two Sum mod 60 — dùng mảng đếm remainder thay HashMap" / Modulo reduces to 60 buckets; array beats HashMap
4. **Special case**: "remainder=0 và remainder=30 tự ghép với nhau (60-r)%60" / remainder 0 pairs with 0; remainder 30 pairs with 30
5. **Follow-up**: "Nếu K thay thế 60? Bài toán tổng quát hơn" / Generalize to any K; same O(n) approach with array of size K
6. **Complexity**: "O(n) time, O(1) space — mảng count chỉ có 60 phần tử" / Linear time, constant space (fixed-size array of 60)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all pairs
 * Time: O(n²) — nested loops over all unique pairs
 * Space: O(1)
 */
function numPairsDivisibleBy60Brute(time: number[]): number {
  let count = 0;
  for (let i = 0; i < time.length; i++) {
    for (let j = i + 1; j < time.length; j++) {
      if ((time[i] + time[j]) % 60 === 0) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Optimized — Two Sum mod 60 with count array
 * Key insight: t1 + t2 ≡ 0 (mod 60) ↔ t2 ≡ -t1 ≡ (60 - t1%60) % 60 (mod 60)
 * Use a frequency array of size 60 to count remainders seen so far.
 * Time: O(n) — single pass; each element processed in O(1)
 * Space: O(1) — fixed array of 60 elements
 */
function numPairsDivisibleBy60(time: number[]): number {
  const count = new Array(60).fill(0); // count[r] = # songs seen with remainder r
  let pairs = 0;

  for (const t of time) {
    const remainder = t % 60;
    const complement = (60 - remainder) % 60; // handles remainder=0: (60-0)%60=0
    pairs += count[complement]; // pair with all matching songs seen before
    count[remainder]++;
  }

  return pairs;
}

// === Test Cases ===
console.log(numPairsDivisibleBy60([30, 20, 150, 100, 40])); // 3
console.log(numPairsDivisibleBy60([60, 60, 60])); // 3
console.log(numPairsDivisibleBy60([60])); // 0  (single element)
console.log(numPairsDivisibleBy60([1, 59, 120, 180])); // 2  (0+1, 1+3: (0,1) and (2,3))
console.log(numPairsDivisibleBy60([15, 63, 451, 213, 37, 209, 343, 319])); // 3
```
