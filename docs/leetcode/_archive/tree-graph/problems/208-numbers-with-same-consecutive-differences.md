---
layout: page
title: "Numbers With Same Consecutive Differences"
difficulty: Medium
category: Tree-Graph
tags: [Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/numbers-with-same-consecutive-differences"
---

# Numbers With Same Consecutive Differences / Số Với Hiệu Liên Tiếp Bằng Nhau

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: BFS/Backtracking Digit Construction

## 🧠 Intuition / Tư Duy

**Như leo cầu thang với bước nhảy cố định** — mỗi bước phải nhảy đúng `k` bậc lên hoặc xuống, bắt đầu từ mỗi bậc 1-9. Xây dựng số từng chữ số một, mỗi chữ số tiếp theo phải cách chữ số trước đúng `|k|`.

**Pattern Recognition:**

- Xây dựng số từng chữ số → BFS/backtracking
- State = số hiện tại, digit cuối cùng → branching factor ≤ 2
- Chú ý: k=0 → chỉ có 1 nhánh (cùng chữ số), không nhân đôi

**Visual:**

```
n=3, k=7:
Start digits: 1-9
From 1: next digit = 1+7=8 or 1-7=-6(invalid) → [18...]
  From 8: 8+7=15(invalid), 8-7=1 → [181]
From 2: 2+7=9 → [29...], 2-7<0 → [292]
...
Result: [181,292,707,818,929]
```

## Problem Description

Return all non-negative integers of length `n` such that the absolute difference between every two consecutive digits is `k`. Note: integers should not have leading zeros (except the number 0 itself). Return the answer in any order.

**Example 1:** n=3, k=7 → `[181,292,707,818,929]`
**Example 2:** n=2, k=1 → `[10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]`

**Constraints:** 2 ≤ n ≤ 9, 0 ≤ k ≤ 9

## 📝 Interview Tips

1. **Clarify**: No leading zeros means first digit ∈ {1..9}. But n=1 is special (0..9 all valid) — though n≥2 here.
2. **Approach**: BFS starting with digits 1-9, extend each number by appending digit±k if valid.
3. **Edge cases**: k=0: each digit repeated (111, 222...). k=9: only 9→0 or 0→9 transitions. Last digit+k or last digit-k must be in [0,9].
4. **Optimize**: When k=0, don't add both +k and -k branches (would duplicate). Use Set or condition check.
5. **Follow-up**: What if differences can vary by position? Generalize the branching rule.
6. **Complexity**: O(2^n) worst case (each digit has 2 choices), but bounded by 10·2^(n-1) ≈ O(2^n).

## Solutions

```typescript
// Solution 1: BFS
// Time: O(2^n) | Space: O(2^n)
function numsSameConsecDiff(n: number, k: number): number[] {
  let current: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (n === 1) return [0, ...current];

  for (let len = 2; len <= n; len++) {
    const next: number[] = [];
    for (const num of current) {
      const lastDigit = num % 10;
      if (lastDigit + k <= 9) next.push(num * 10 + lastDigit + k);
      if (k !== 0 && lastDigit - k >= 0) next.push(num * 10 + lastDigit - k);
    }
    current = next;
  }
  return current;
}

// Solution 2: Backtracking/DFS
// Time: O(2^n) | Space: O(n) recursion stack
function numsSameConsecDiff2(n: number, k: number): number[] {
  const result: number[] = [];

  function backtrack(num: number, digitsLeft: number): void {
    if (digitsLeft === 0) {
      result.push(num);
      return;
    }
    const lastDigit = num % 10;
    // Try adding k
    if (lastDigit + k <= 9) backtrack(num * 10 + lastDigit + k, digitsLeft - 1);
    // Try subtracting k (avoid duplicate when k=0)
    if (k !== 0 && lastDigit - k >= 0) backtrack(num * 10 + lastDigit - k, digitsLeft - 1);
  }

  for (let firstDigit = 1; firstDigit <= 9; firstDigit++) {
    backtrack(firstDigit, n - 1);
  }
  if (n === 1) result.unshift(0);
  return result;
}

// Solution 3: BFS with Set to avoid duplicates (cleaner for k=0)
// Time: O(2^n) | Space: O(2^n)
function numsSameConsecDiff3(n: number, k: number): number[] {
  const queue = new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (let len = 1; len < n; len++) {
    const nextQueue = new Set<number>();
    for (const num of queue) {
      const lastDigit = num % 10;
      if (lastDigit + k <= 9) nextQueue.add(num * 10 + lastDigit + k);
      if (lastDigit - k >= 0) nextQueue.add(num * 10 + lastDigit - k);
    }
    queue.clear();
    nextQueue.forEach((v) => queue.add(v));
  }

  return [...queue].sort((a, b) => a - b);
}

// Tests
console.log(numsSameConsecDiff(3, 7).sort((a, b) => a - b)); // [181,292,707,818,929]
console.log(numsSameConsecDiff(2, 1).length); // 17
console.log(numsSameConsecDiff2(2, 0)); // [11,22,33,44,55,66,77,88,99]
console.log(numsSameConsecDiff3(3, 0).sort((a, b) => a - b)); // [111,222,333,444,555,666,777,888,999]
console.log(numsSameConsecDiff(2, 9).sort((a, b) => a - b)); // [09→skip, 90]=[90] + [19→invalid]
```

## 🔗 Related Problems

| Problem                                                                                                       | Relationship                     |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Digit-by-digit construction      |
| [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits/)           | Digit DP/backtracking on numbers |
| [Stepping Numbers](https://leetcode.com/problems/stepping-numbers/)                                           | k=1 special case of this problem |
