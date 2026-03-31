---
layout: page
title: "Count Vowels Permutation"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-vowels-permutation"
---

# Count Vowels Permutation / Đếm Hoán Vị Nguyên Âm

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Amazon

## 🧠 Intuition / Tư Duy

**Analogy:** Như đặt hạt chuỗi ngọc trai — mỗi hạt màu (nguyên âm) chỉ được nối sau một số màu nhất định. Bạn đếm số chuỗi dài n thỏa quy tắc, dùng kết quả độ dài n-1 để tính độ dài n.

**Pattern Recognition:**

- "Count strings of length n with vowel adjacency rules" → state-machine DP on last character
- Each state = last vowel; transitions define valid predecessors; accumulate counts per length step
- 5 vowels × n steps → O(n) time, O(1) space with rolling variables

**Visual:**

```
Rules (what can precede each vowel):
a ← {e, i, u}    e ← {a, i}    i ← {e, o}    o ← {i}    u ← {i, o}

n=1:  a=1  e=1  i=1  o=1  u=1   total=5
n=2:  a=3  e=2  i=2  o=1  u=2   total=10
n=3:  a=6  e=5  i=3  o=2  u=3   total=19 (not asked, just shows growth)
n=5:                              total=68
```

## Problem Description

Given `n`, count strings of length `n` using only vowels (a,e,i,o,u) following adjacency rules: `a` can only be followed by `e`; `e` → `a` or `i`; `i` → `a`, `e`, `o`, `u` (not `i`); `o` → `i` or `u`; `u` → `a`. Return the count modulo 10⁹+7.

Examples: n=1 → 5, n=2 → 10, n=5 → 68.

## 📝 Interview Tips

1. **Clarify**: Quy tắc là "X đứng sau Y nào được?" — xác định chiều transition / confirm whether rules define what can _follow_ or _precede_ each vowel.
2. **Approach**: Biểu diễn bằng 5 biến rolling thay vì mảng 2D — tiết kiệm bộ nhớ / 5 scalar variables instead of 2-D array, O(1) space.
3. **Edge cases**: n=1 → mọi nguyên âm đều hợp lệ → answer is 5.
4. **Optimize**: Ma trận nhân cho O(log n) nếu n rất lớn / matrix exponentiation gives O(log n) for huge n.
5. **Follow-up**: Nếu có thêm quy tắc mới → chỉ cần cập nhật bảng predecessor.
6. **Complexity**: Time O(n), Space O(1) for rolling solution.

## Solutions

```typescript
/** Solution 1: Rolling DP with 5 scalar variables (optimal)
 * Time: O(n) | Space: O(1)
 */
function countVowelPermutation(n: number): number {
  const MOD = 1_000_000_007n;
  let a = 1n,
    e = 1n,
    i = 1n,
    o = 1n,
    u = 1n;
  for (let step = 1; step < n; step++) {
    // a can be preceded by e, i, u
    // e can be preceded by a, i
    // i can be preceded by e, o
    // o can be preceded by i
    // u can be preceded by i, o
    const [na, ne, ni, no_, nu] = [
      (e + i + u) % MOD,
      (a + i) % MOD,
      (e + o) % MOD,
      i % MOD,
      (i + o) % MOD,
    ];
    [a, e, i, o, u] = [na, ne, ni, no_, nu];
  }
  return Number((a + e + i + o + u) % MOD);
}

/** Solution 2: DP with predecessor array (explicit, readable)
 * Time: O(n) | Space: O(n)
 */
function countVowelPermutation2(n: number): number {
  const MOD = 1_000_000_007;
  // index: 0=a,1=e,2=i,3=o,4=u; pred[v] = vowels that can precede v
  const pred = [[1, 2, 4], [0, 2], [1, 3], [2], [2, 3]];
  let dp = [1, 1, 1, 1, 1];
  for (let step = 1; step < n; step++) {
    const next = [0, 0, 0, 0, 0];
    for (let v = 0; v < 5; v++) for (const p of pred[v]) next[v] = (next[v] + dp[p]) % MOD;
    dp = next;
  }
  return dp.reduce((s, x) => (s + x) % MOD, 0);
}

// Tests
console.log(countVowelPermutation(1)); // 5
console.log(countVowelPermutation(2)); // 10
console.log(countVowelPermutation(5)); // 68
console.log(countVowelPermutation2(1)); // 5
console.log(countVowelPermutation2(5)); // 68
console.log(countVowelPermutation(144)); // large modular result
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                                        |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences)               | String DP counting                                  |
| [Student Attendance Record II](https://leetcode.com/problems/student-attendance-record-ii) | Count strings with character-transition constraints |
| [Decode Ways](https://leetcode.com/problems/decode-ways)                                   | State-machine DP on sequences                       |
