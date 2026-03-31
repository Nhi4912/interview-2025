---
layout: page
title: "The Score of Students Solving Math Expression"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, String, Dynamic Programming, Stack]
leetcode_url: "https://leetcode.com/problems/the-score-of-students-solving-math-expression"
---

# The Score of Students Solving Math Expression / Điểm Số Học Sinh Giải Biểu Thức Toán

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như chia đoạn thịt nướng — mỗi cách chia (đặt dấu phân cách) cho kết quả khác nhau. Liệt kê mọi cách tính bằng interval DP, thu thập tất cả kết quả có thể.

```
s = "1+2*3+4"
  Numbers: [1, 2, 3, 4]
  Ops:     [+, *, +]

All ways to parenthesize:
  (1+(2*(3+4))) = 1+14 = 15
  (1+((2*3)+4)) = 1+10 = 11
  ((1+2)*(3+4)) = 3*7  = 21
  ((1+(2*3))+4) = 7+4  = 11
  (((1+2)*3)+4) = 9+4  = 13

Correct answer (standard order): 1+2*3+4 = 1+6+4 = 11
Students who got 11 → 5 pts, others → 2 pts, wrong → 0 pts
```

**Key insight:** `dp[i][j]` = Set of all possible values from sub-expression `numbers[i..j]` using different parenthesizations. Cap values at 1000 (max possible = 10^3 per constraints). Compare each answer with correct value.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Parse first**: Extract numbers and operators into separate arrays / tách số và phép toán
- 🔑 **Correct answer**: Evaluate using standard operator precedence (stack) / tính đúng theo thứ tự ưu tiên
- 🔑 **dp[i][j]**: Set of all possible values from parenthesizing `numbers[i..j]` differently / tập hợp kết quả
- 🔑 **Transition**: Split at each operator `k`: combine all values from `dp[i][k]` with `dp[k+1][j]` using `ops[k]` / chia tại k
- 🔑 **Cap at 1000**: `nums[i] ≤ 9`, max honest result ≤ 9^(n/2) but cap set entries at 1000 to bound complexity / giới hạn 1000
- 🔑 **Scoring**: Correct → 5pts; in dp[0][m-1] but wrong → 2pts; not in set → 0pts / chấm điểm

---

## Solutions / Giải Pháp

### Solution 1: Interval DP with Sets (O(n³ × V²) where V ≤ 1000)

```typescript
/**
 * Score of Students Solving Math Expression — Interval DP
 *
 * 1. Parse expression into nums[] and ops[].
 * 2. Compute correct answer via standard evaluation.
 * 3. dp[i][j] = Set<number> of all possible values from parenthesizing nums[i..j].
 *    Split at each operator k: merge dp[i][k] × dp[k+1][j] using ops[k].
 *    Cap each value at 1000 (values > 1000 can never be the correct answer).
 * 4. Score each student: 5 if = correct, 2 if in dp[0][m-1] but wrong, 0 otherwise.
 *
 * Time:  O(n³ × V²)  where V = 1000 (cap), n = number of operands
 * Space: O(n² × V)   — dp sets
 */
function scoreOfStudents(s: string, answers: number[]): number {
  // Step 1: Parse
  const nums: number[] = [];
  const ops: string[] = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "+" || s[i] === "*") {
      ops.push(s[i]);
    } else {
      nums.push(parseInt(s[i]));
    }
  }

  const m = nums.length;
  const CAP = 1000;

  // Step 2: Correct answer with standard precedence
  function evalCorrect(): number {
    const numStack: number[] = [];
    const opStack: string[] = [];
    let ni = 0,
      oi = 0;
    numStack.push(nums[ni++]);
    while (oi < ops.length) {
      const op = ops[oi++];
      numStack.push(nums[ni++]);
      if (op === "*") {
        const b = numStack.pop()!;
        const a = numStack.pop()!;
        numStack.push(a * b);
      } else {
        opStack.push(op);
        // Don't collapse additions yet
        if (opStack.length > 0 && ops[oi - 1] !== "*") {
          // Actually just track ops correctly
        }
      }
    }
    // Sum all remaining — but we need proper precedence
    // Re-evaluate properly: multiply first, then add
    let result = nums[0];
    let cur = nums[0];
    for (let k = 0; k < ops.length; k++) {
      if (ops[k] === "*") {
        cur *= nums[k + 1];
      } else {
        result = cur; // reset
      }
    }
    // Use simple left-to-right with precedence via two passes
    const mults: number[] = [nums[0]];
    for (let k = 0; k < ops.length; k++) {
      if (ops[k] === "*") {
        mults[mults.length - 1] *= nums[k + 1];
      } else {
        mults.push(nums[k + 1]);
      }
    }
    return mults.reduce((a, b) => a + b, 0);
  }

  const correct = evalCorrect();

  // Step 3: Build dp[i][j] = Set of possible values
  const dp: Set<number>[][] = Array.from({ length: m }, () =>
    Array.from({ length: m }, () => new Set<number>()),
  );

  // Base case: single numbers
  for (let i = 0; i < m; i++) dp[i][i].add(nums[i]);

  // Fill by interval length
  for (let len = 2; len <= m; len++) {
    for (let i = 0; i <= m - len; i++) {
      const j = i + len - 1;
      for (let k = i; k < j; k++) {
        const op = ops[k];
        for (const a of dp[i][k]) {
          for (const b of dp[k + 1][j]) {
            const val = op === "+" ? a + b : a * b;
            if (val <= CAP) dp[i][j].add(val);
          }
        }
      }
    }
  }

  const possibleSet = dp[0][m - 1];

  // Step 4: Score students
  let total = 0;
  for (const ans of answers) {
    if (ans === correct) total += 5;
    else if (possibleSet.has(ans)) total += 2;
  }
  return total;
}

console.log(scoreOfStudents("7+3*1*2", [20, 13, 42])); // 7
console.log(scoreOfStudents("3+5*2", [13, 0, 10, 13, 13, 16, 16])); // 19
console.log(scoreOfStudents("6+0*1", [12, 6])); // 7
```

### Solution 2: Memoized Recursive Version

```typescript
/**
 * Score of Students — Memoized Top-Down
 *
 * Same logic but using Map-based memoization for clarity.
 *
 * Time:  O(n³ × V²)
 * Space: O(n² × V)
 */
function scoreOfStudentsMemo(s: string, answers: number[]): number {
  const nums: number[] = [];
  const ops: string[] = [];
  for (const ch of s) {
    if (ch === "+" || ch === "*") ops.push(ch);
    else nums.push(Number(ch));
  }

  const m = nums.length;
  const CAP = 1000;

  // Correct evaluation (proper precedence)
  const mults = [nums[0]];
  for (let k = 0; k < ops.length; k++) {
    if (ops[k] === "*") mults[mults.length - 1] *= nums[k + 1];
    else mults.push(nums[k + 1]);
  }
  const correct = mults.reduce((a, b) => a + b, 0);

  const memo = new Map<string, Set<number>>();

  function solve(i: number, j: number): Set<number> {
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;
    const res = new Set<number>();
    if (i === j) {
      res.add(nums[i]);
      memo.set(key, res);
      return res;
    }

    for (let k = i; k < j; k++) {
      const left = solve(i, k);
      const right = solve(k + 1, j);
      for (const a of left) {
        for (const b of right) {
          const v = ops[k] === "+" ? a + b : a * b;
          if (v <= CAP) res.add(v);
        }
      }
    }
    memo.set(key, res);
    return res;
  }

  const possible = solve(0, m - 1);
  let score = 0;
  for (const a of answers) {
    if (a === correct) score += 5;
    else if (possible.has(a)) score += 2;
  }
  return score;
}

console.log(scoreOfStudentsMemo("7+3*1*2", [20, 13, 42])); // 7
console.log(scoreOfStudentsMemo("3+5*2", [13, 0, 10, 13, 13, 16, 16])); // 19
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                              | Difficulty | Pattern     |
| ---------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses) | 🟡 Medium  | Interval DP |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                                   | 🔴 Hard    | Stack       |
| [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation)   | 🟡 Medium  | Stack       |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons)                                       | 🔴 Hard    | Interval DP |
