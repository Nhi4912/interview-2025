---
layout: page
title: "Count of Integers"
difficulty: Hard
category: Dynamic Programming
tags: [Math, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-of-integers"
---

# Count of Integers / Đếm Số Nguyên Theo Tổng Chữ Số

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [String Transformation](https://leetcode.com/problems/string-transformation) | [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm số biển số xe thỏa mãn điều kiện — không cần liệt kê từng số mà tính theo "hàng số" từ trái sang phải. Kỹ thuật "digit DP" cho phép đếm trong khoảng [num1, num2] mà không cần duyệt từng số.

**Pattern Recognition:**

- Signal: "count integers in range [num1, num2] with digit-sum constraint" → **Digit DP**
- `count(s)` = số x ∈ [0..s] với tổng chữ số ∈ [min_sum, max_sum]
- Answer = `count(num2) - count(num1) + (num1 thỏa điều kiện ? 1 : 0)`

**Visual — Digit DP state machine:**

```
count("125", min_sum=1, max_sum=5):
dfs(pos, sum, tight):
  tight=true: digit ≤ s[pos];  tight=false: digit ∈ [0..9]

pos=0, sum=0, tight=T → try d=0..1
  d=1: pos=1, sum=1, tight=T → try d=0..2
    d=2: pos=2, sum=3, tight=T → try d=0..5
      each valid d: check 1 ≤ 3+d ≤ 5 → d ∈ {0,1,2}
```

---

## Problem Description

Given strings `num1`, `num2` and integers `min_sum`, `max_sum`, count integers `x` in `[num1, num2]` (inclusive) where `min_sum <= digitSum(x) <= max_sum`. Return the count modulo 10^9+7. ([LeetCode 2719](https://leetcode.com/problems/count-of-integers))

**Example 1:** `num1="1", num2="12", min_sum=1, max_sum=8` → `11`

**Example 2:** `num1="1", num2="5", min_sum=1, max_sum=5` → `5`

Constraints: `1 <= num1 <= num2 <= 10^22`, `1 <= min_sum <= max_sum <= 400`

---

## 📝 Interview Tips

1. **Key formula**: "answer = count(num2) - count(num1) + valid(num1); tránh trừ 1 từ chuỗi lớn" / Avoid decrementing large string num1
2. **Digit DP state**: "(pos, sum, tight) — pos tăng, sum tích lũy, tight giới hạn digit tối đa" / Three-state DP: position, digit sum, boundary flag
3. **Prune early**: "Nếu sum > max_sum thì return 0 ngay — không cần tiếp tục" / Early pruning when sum exceeds max_sum
4. **Memoization**: "Key = (pos, sum, tight) — tight=false cho phép tái sử dụng nhiều" / Cache (pos, sum, tight) for ~n×max_sum×2 states
5. **Leading zeros**: "Leading zeros đóng góp 0 vào tổng — không ảnh hưởng; x=5 và '005' cùng kết quả" / Leading zeros don't affect digit sum
6. **Modular arithmetic**: "Tính mod ở mỗi bước cộng; cẩn thận khi trừ: dùng (a-b+MOD)%MOD" / Always add MOD before % when subtracting

---

## Solutions

```typescript
/**
 * Solution 1: Digit DP — count integers in [0..s] with digit sum in [min_sum, max_sum]
 * Time: O(n * max_sum * 2 * 10) ≈ O(n * max_sum) where n = number of digits
 * Space: O(n * max_sum) — memoization map
 */
function countInRange(num1: string, num2: string, minSum: number, maxSum: number): number {
  const MOD = 1_000_000_007;

  // count(s) = number of x in [0..s] with digitSum(x) in [minSum, maxSum]
  function count(s: string): number {
    const n = s.length;
    const memo = new Map<string, number>();

    function dfs(pos: number, sum: number, tight: boolean): number {
      if (sum > maxSum) return 0; // prune: already over limit
      if (pos === n) return sum >= minSum ? 1 : 0;

      const key = `${pos},${sum},${tight ? 1 : 0}`;
      if (memo.has(key)) return memo.get(key)!;

      const limit = tight ? parseInt(s[pos]) : 9;
      let res = 0;
      for (let d = 0; d <= limit; d++) {
        res = (res + dfs(pos + 1, sum + d, tight && d === limit)) % MOD;
      }

      memo.set(key, res);
      return res;
    }

    return dfs(0, 0, true);
  }

  const c2 = count(num2);
  const c1 = count(num1);
  // digitSum(num1) check
  const s1 = num1.split("").reduce((acc, d) => acc + parseInt(d), 0);
  const v1 = s1 >= minSum && s1 <= maxSum ? 1 : 0;

  return (((c2 - c1 + v1) % MOD) + MOD) % MOD;
}

/**
 * Solution 2: Bottom-Up Digit DP — tabulation
 * Time: O(n * max_sum * 10) — explicit table, avoids recursion overhead
 * Space: O(n * max_sum)
 */
function countInRangeTabulation(
  num1: string,
  num2: string,
  minSum: number,
  maxSum: number,
): number {
  const MOD = 1_000_000_007;

  function solve(s: string): number {
    const n = s.length;
    // dp[tight][sum] = count of ways for remaining digits
    // Build from right to left
    // Use iterative approach: dp[pos][sum][tight]
    const digits = s.split("").map(Number);
    let dp: number[][] = [[1, ...new Array(maxSum).fill(0)]]; // pos=n: 1 way if sum=0 (then check at end)

    // Actually simpler: just use the memoized dfs above
    // For tabulation, simulate the recursion left-to-right
    let tight: number[] = new Array(maxSum + 1).fill(0);
    let free: number[] = new Array(maxSum + 1).fill(0);
    tight[0] = 1; // position 0, sum=0, tight=true

    for (let pos = 0; pos < n; pos++) {
      const nTight = new Array(maxSum + 1).fill(0);
      const nFree = new Array(maxSum + 1).fill(0);
      for (let sum = 0; sum <= maxSum; sum++) {
        if (tight[sum]) {
          for (let d = 0; d <= digits[pos]; d++) {
            const ns = sum + d;
            if (ns > maxSum) break;
            if (d < digits[pos]) nFree[ns] = (nFree[ns] + tight[sum]) % MOD;
            else nTight[ns] = (nTight[ns] + tight[sum]) % MOD;
          }
        }
        if (free[sum]) {
          for (let d = 0; d <= 9; d++) {
            const ns = sum + d;
            if (ns > maxSum) break;
            nFree[ns] = (nFree[ns] + free[sum]) % MOD;
          }
        }
      }
      tight = nTight;
      free = nFree;
    }

    let res = 0;
    for (let sum = minSum; sum <= maxSum; sum++) {
      res = (res + tight[sum] + free[sum]) % MOD;
    }
    return res;
  }

  const c2 = solve(num2);
  const c1 = solve(num1);
  const s1 = num1.split("").reduce((a, d) => a + parseInt(d), 0);
  const v1 = s1 >= minSum && s1 <= maxSum ? 1 : 0;
  return (((c2 - c1 + v1) % MOD) + MOD) % MOD;
}

// === Test Cases ===
console.log(countInRange("1", "12", 1, 8)); // 11
console.log(countInRange("1", "5", 1, 5)); // 5
console.log(countInRange("1", "100", 1, 9)); // 99
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Difficulty | Pattern    |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits)                           | 🟡 Medium  | Digit DP   |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set)                         | 🔴 Hard    | Digit DP   |
| [Count the Number of Powerful Integers](https://leetcode.com/problems/count-the-number-of-powerful-integers)                 | 🔴 Hard    | Digit DP   |
| [The Score of Students Solving Math Expression](https://leetcode.com/problems/the-score-of-students-solving-math-expression) | 🔴 Hard    | DP         |
| [Digit Count in Range](https://leetcode.com/problems/digit-count-in-range)                                                   | 🔴 Hard    | Digit Math |
