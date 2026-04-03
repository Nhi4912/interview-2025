---
layout: page
title: "Integer Replacement"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Greedy, Bit Manipulation, Memoization]
leetcode_url: "https://leetcode.com/problems/integer-replacement"
---

# Integer Replacement / Thay Thế Số Nguyên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Bloomberg

## 🧠 Intuition / Tư Duy

**Analogy:** Như rút ngắn đường đến đích — nếu đang ở số chẵn, chia đôi ngay; nếu số lẻ, thêm hoặc bớt 1, chọn bước nào tạo số có ít bit 1 hơn để xử lý nhanh hơn về sau.

**Pattern Recognition:**

- "Reduce n to 1 via operations, minimize steps" → memoized recursion (BFS also works)
- Greedy bit trick: for odd n, prefer n-1 if bit 1 (second-lowest) is 0, else n+1 (except n==3)
- Subproblem overlap → memoize to avoid recomputation

**Visual:**

```
n=7 (binary 0111):
Path A: 7→8→4→2→1  (4 steps: +1, /2, /2, /2)
Path B: 7→6→3→2→1  (4 steps: -1, /2, -1, /2)  tie
Greedy check: 7 & 2 = 2 ≠ 0 → choose +1 path (leads to 8 = power of 2)

n=3 (binary 11):  greedy says +1→4 but 3→2→1 is only 2 steps, so use n-1 for n=3
```

## Problem Description

Given a positive integer `n`, you may replace `n` with `n/2` if even, or `n+1` or `n-1` if odd. Return the minimum number of replacements to reach 1.

Examples: n=8 → 3; n=7 → 4; n=4 → 2.

## 📝 Interview Tips

1. **Clarify**: n lên tới 2³¹-1 — cần cẩn thận overflow khi n+1 / n up to 2^31-1; n+1 may overflow 32-bit int.
2. **Approach**: Greedy bit rule cho O(log n) space O(1): với số lẻ, nếu bit thứ 2 là 1 thì +1 (trừ n=3), ngược lại -1.
3. **Edge cases**: n=1 → 0; n=3 → 2 (3→2→1, không phải 3→4→2→1=3).
4. **Optimize**: Greedy O(log n) O(1) tốt hơn memoization O(log n) O(log n) overhead.
5. **Follow-up**: Khôi phục chuỗi thao tác — log thêm quyết định tại mỗi bước odd.
6. **Complexity**: Time O(log n), Space O(1) greedy, O(log n) memoization.

## Solutions

```typescript
/** Solution 1: Memoized recursion
 * Time: O(log n) | Space: O(log n)
 */
function integerReplacement(n: number): number {
  const memo = new Map<number, number>();
  function dp(x: number): number {
    if (x === 1) return 0;
    if (memo.has(x)) return memo.get(x)!;
    let res: number;
    if (x % 2 === 0) {
      res = 1 + dp(x / 2);
    } else {
      res = 1 + Math.min(dp(x - 1), dp(x + 1));
    }
    memo.set(x, res);
    return res;
  }
  return dp(n);
}

/** Solution 2: Greedy bit manipulation (optimal)
 * Time: O(log n) | Space: O(1)
 * Rule: even → /2; odd n==3 → -1; odd, bit1==1 → +1; else → -1
 */
function integerReplacement2(n: number): number {
  let steps = 0;
  while (n !== 1) {
    if ((n & 1) === 0) {
      n >>>= 1;
    } else if (n === 3 || (n & 2) === 0) {
      n -= 1;
    } else {
      n += 1;
    }
    steps++;
  }
  return steps;
}

/** Solution 3: BFS — finds shortest path naturally
 * Time: O(log n) | Space: O(log n)
 */
function integerReplacement3(n: number): number {
  const visited = new Set<number>([n]);
  const queue: [number, number][] = [[n, 0]];
  while (queue.length) {
    const [cur, dist] = queue.shift()!;
    if (cur === 1) return dist;
    const nexts = cur % 2 === 0 ? [cur / 2] : [cur - 1, cur + 1];
    for (const nx of nexts) {
      if (!visited.has(nx)) {
        visited.add(nx);
        queue.push([nx, dist + 1]);
      }
    }
  }
  return -1;
}

// Tests
console.log(integerReplacement(8)); // 3
console.log(integerReplacement(7)); // 4
console.log(integerReplacement(4)); // 2
console.log(integerReplacement2(7)); // 4
console.log(integerReplacement2(3)); // 2
console.log(integerReplacement3(14)); // 5
```

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Minimum One Bit Operations to Make Integers Zero](https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero) | Bit manipulation to reduce integer         |
| [Happy Number](https://leetcode.com/problems/happy-number)                                                                         | Number transformation with cycle detection |
| [Minimum Operations to Reduce an Integer to 0](https://leetcode.com/problems/minimum-operations-to-reduce-an-integer-to-0)         | Similar greedy/DP reduction                |
