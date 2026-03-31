---
layout: page
title: "Ugly Number II"
difficulty: Medium
category: Dynamic Programming
tags: [Hash Table, Math, Dynamic Programming, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/ugly-number-ii"
---

# Ugly Number II / Số Xấu II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (3-Pointer)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Super Ugly Number](https://leetcode.com/problems/super-ugly-number) | [Ugly Number III](https://leetcode.com/problems/ugly-number-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng 3 hàng đợi: một hàng nhân 2, một hàng nhân 3, một hàng nhân 5. Mỗi bước, lấy số nhỏ nhất từ cả 3 hàng, đó là số xấu tiếp theo. Rồi nhân số đó với 2, 3, 5 và thêm vào hàng tương ứng.

**Pattern Recognition:**

- 3 con trỏ `p2, p3, p5` trỏ vào phần tử tiếp theo sẽ được nhân
- `dp[i] = min(dp[p2]*2, dp[p3]*3, dp[p5]*5)`
- Tiến con trỏ tương ứng sau khi chọn minimum

**Visual — 3-Pointer DP:**

```
dp = [1, ...]
p2=0, p3=0, p5=0

i=1: min(1*2,1*3,1*5)=2 → dp[1]=2, p2→1
i=2: min(2*2,1*3,1*5)=3 → dp[2]=3, p3→1
i=3: min(2*2,3*3,1*5)=4 → dp[3]=4, p2→2
i=4: min(4*2,3*3,1*5)=5 → dp[4]=5, p5→1
i=5: min(4*2,3*3,5*5)=6 → dp[5]=6, p2→3, p3→2 (tie! advance both)
...
dp = [1,2,3,4,5,6,8,9,10,12,...]
```

---

## Problem Description

An **ugly number** is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer `n`, return the `n`-th ugly number. ([LeetCode #264](https://leetcode.com/problems/ugly-number-ii))

**Example 1:** `n = 10` → `12` (sequence: 1,2,3,4,5,6,8,9,10,12)
**Example 2:** `n = 1` → `1` (1 is the first ugly number)

Constraints: `1 <= n <= 1690`

---

## 📝 Interview Tips

1. **Clarify**: "1 có phải là ugly number không? Có (ước số là rỗng) / Yes, 1 is the first ugly number"
2. **Brute force**: "Kiểm tra từng số: chia liên tiếp cho 2,3,5 → O(n \* log n) / Too slow for large n"
3. **3-pointer key**: "Mỗi ugly number = ugly_previous \* (2 or 3 or 5) / All uglies are generated from previous"
4. **Tie handling**: "Khi min trùng nhau phải advance tất cả con trỏ trùng / Advance ALL matching pointers to avoid duplicates"
5. **Heap alt**: "Min-heap + HashSet cũng đúng nhưng O(n log n) / Heap works but 3-pointer is faster"
6. **Edge cases**: "n=1 → 1, không có overflow vì n ≤ 1690, dp[1690] < 2^31 / No overflow concern"

---

## Solutions

```typescript
/**
 * Solution 1: Min-Heap with HashSet
 * Time: O(n log n) — n heap operations
 * Space: O(n) — heap and set
 */
function nthUglyNumberHeap(n: number): number {
  const visited = new Set<number>([1]);
  const heap: number[] = [1];
  const factors = [2, 3, 5];

  const pop = (): number => {
    let minIdx = 0;
    for (let i = 1; i < heap.length; i++) if (heap[i] < heap[minIdx]) minIdx = i;
    const [val] = heap.splice(minIdx, 1);
    return val;
  };

  let val = 1;
  for (let i = 0; i < n; i++) {
    val = pop();
    for (const f of factors) {
      const next = val * f;
      if (!visited.has(next)) {
        visited.add(next);
        heap.push(next);
      }
    }
  }
  return val;
}

/**
 * Solution 2: 3-Pointer DP (Optimal)
 * Time: O(n) — single pass to build dp table
 * Space: O(n) — dp array of size n
 */
function nthUglyNumber(n: number): number {
  const dp = new Array(n).fill(0);
  dp[0] = 1;

  let p2 = 0; // next dp index to multiply by 2
  let p3 = 0; // next dp index to multiply by 3
  let p5 = 0; // next dp index to multiply by 5

  for (let i = 1; i < n; i++) {
    const next2 = dp[p2] * 2;
    const next3 = dp[p3] * 3;
    const next5 = dp[p5] * 5;
    const nextVal = Math.min(next2, next3, next5);
    dp[i] = nextVal;

    // Advance ALL pointers that produced the minimum (avoid duplicates)
    if (nextVal === next2) p2++;
    if (nextVal === next3) p3++;
    if (nextVal === next5) p5++;
  }
  return dp[n - 1];
}

// === Test Cases ===
console.log(nthUglyNumber(1)); // 1
console.log(nthUglyNumber(10)); // 12
console.log(nthUglyNumber(15)); // 24
console.log(nthUglyNumber(1690)); // 2123366400
```

---

## 🔗 Related Problems

| Problem                                                                      | Pattern              | Difficulty |
| ---------------------------------------------------------------------------- | -------------------- | ---------- |
| [Super Ugly Number](https://leetcode.com/problems/super-ugly-number)         | Multi-Pointer DP     | Medium     |
| [Ugly Number III](https://leetcode.com/problems/ugly-number-iii)             | Math / Binary Search | Medium     |
| [Nth Magical Number](https://leetcode.com/problems/nth-magical-number)       | Binary Search        | Hard       |
| [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts) | DP                   | Medium     |
