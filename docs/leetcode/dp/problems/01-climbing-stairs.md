---
layout: page
title: "Climbing Stairs"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Math, Memoization]
leetcode_url: "https://leetcode.com/problems/climbing-stairs/"
leetcode_number: 70
pattern: "DP Fibonacci"
frequency_tier: 1
companies: [Google, Amazon, Meta, Apple]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Climbing Stairs / Leo Cầu Thang

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DP Fibonacci
> **Frequency**: 🔥 Tier 1 — xuất hiện rất thường xuyên trong phone screen
> **Target**: ⏱️ 10 min | **Companies**: Google, Amazon, Meta, Apple
> **See also**: [House Robber](./04-house-robber.md) | [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đếm số cách lát đường đi bằng gạch 1 ô hoặc 2 ô: để lát n ô, bạn đặt viên 1-ô cuối (còn lại n-1 ô) hoặc viên 2-ô (còn lại n-2 ô). Số cách lát n ô = cách lát (n-1) + cách lát (n-2) — đây chính là Fibonacci ẩn.

**Pattern Recognition:**

- Signal: "distinct ways", "1 or 2 steps" → **DP Fibonacci: dp[n] = dp[n-1] + dp[n-2]**
- Subproblem chồng chéo: optimal substructure rõ ràng
- Chỉ cần 2 giá trị trước → tối ưu space từ O(n) xuống O(1)

**Visual — n = 5:**

```
Step:   1    2    3    4    5
        ↓    ↓    ↓    ↓    ↓
Ways:   1    2    3    5    8

dp[1] = 1
dp[2] = 2
dp[3] = dp[2] + dp[1] = 2 + 1 = 3
dp[4] = dp[3] + dp[2] = 3 + 2 = 5
dp[5] = dp[4] + dp[3] = 5 + 3 = 8  ✓
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| **When you see** | "how many ways", "1 or 2 steps", "distinct ways to reach"              |
| **Think**        | DP Fibonacci — dp[i] = dp[i-1] + dp[i-2], optimize to 2 vars           |
| **Template**     | `prev=1, curr=1; for(i=2..n) { next=prev+curr; prev=curr; curr=next }` |
| **Time target**  | ⏱️ 10 min (Easy)                                                       |

> 💡 **Memory hook / Móc nhớ:** "Mỗi bậc thang = tổng 2 bậc trước — Fibonacci ẩn trong cầu thang!"

---

## Problem Description

You are climbing a staircase that takes `n` steps to reach the top. Each time you can climb either **1 or 2 steps**. Return the number of distinct ways to climb to the top.

```
Example 1: n = 2 → 2    ([1,1], [2])
Example 2: n = 3 → 3    ([1,1,1], [1,2], [2,1])
Example 3: n = 5 → 8
```

Constraints:

- `1 <= n <= 45`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have n stairs.
> At each step we can take 1 or 2 stairs. We need the total distinct ways to reach the top.
> Clarification: n starts from 1? Is n=0 a valid input?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "My first thought is pure recursion — try 1 step and 2 steps at each point — but that's O(2^n).
> I notice overlapping subproblems: ways(n) = ways(n-1) + ways(n-2) — this is Fibonacci!
> I'll use two rolling variables instead of an array — O(n) time, O(1) space. Should I proceed?"

### Step 3 — Implement / Viết Code (3-5 min)

> "I'll initialize prev=1 and curr=1 for steps 0 and 1.
> Loop from 2 to n: compute next = prev + curr, then shift both forward.
> Return curr at the end."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: n=5. prev=1, curr=1.
> i=2: next=2, prev=1, curr=2. i=3: next=3, prev=2, curr=3.
> i=4: next=5, prev=3, curr=5. i=5: next=8, prev=5, curr=8. Return 8. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — single loop. Space: O(1) — two variables only.
> Edge cases: n=1 → 1, n=2 → 2.
> Follow-up: if can take up to k steps, dp[i] = sum(dp[i-1..i-k])."

---

## 📝 Interview Tips

1. **Clarify**: Does n=0 count as 1 way? / n=0 có cần xử lý không? (LeetCode guarantees n ≥ 1)
2. **Brute force**: Pure recursion O(2^n) — recomputes subproblems / Đệ quy thuần túy, tính lại nhiều lần
3. **Optimize**: Memoization → O(n) time/space → then 2 vars → O(1) space / Tối ưu dần
4. **Edge cases**: n=1 → 1, n=2 → 2 / Kiểm tra base case trước loop
5. **Follow-up**: k steps max? dp[i] = sum(dp[i-1..i-k]) / Nếu bước tối đa k bậc

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                             | Why Wrong / Tại sao sai                            | Fix / Cách sửa                         |
| --- | --------------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| 1   | Use pure recursion without memo               | O(2^n) time — TLE for n > 30                       | Add memoization or use bottom-up DP    |
| 2   | Wrong base case: dp[0]=0, dp[1]=1             | dp[2] should be 2 (take two 1-steps OR one 2-step) | dp[0]=1, dp[1]=1 → dp[2]=2             |
| 3   | Allocate full array when only 2 values needed | Wastes O(n) space unnecessarily                    | Use 2 rolling variables for O(1) space |

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force Recursion
 * Time: O(2^n) — recomputes overlapping subproblems
 * Space: O(n) — recursion call stack depth
 */
function climbStairsBrute(n: number): number {
  if (n <= 1) return 1;
  return climbStairsBrute(n - 1) + climbStairsBrute(n - 2);
}

/**
 * Solution 2: Space-Optimized DP (Optimal)
 * Time: O(n) — single pass through n steps
 * Space: O(1) — only two rolling variables
 */
function climbStairs(n: number): number {
  if (n <= 1) return 1;
  let prev = 1; // dp[i-2]
  let curr = 1; // dp[i-1]

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

// === Test Cases ===
console.log(climbStairs(1)); // 1
console.log(climbStairs(2)); // 2
console.log(climbStairs(5)); // 8
console.log(climbStairs(45)); // 1836311903
```

---

## 🔗 Related Problems

- [House Robber](./04-house-robber.md) — cùng mẫu DP linear, dp[i] phụ thuộc 2 state trước
- [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) — biến thể thêm cost
- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) — bản chất toán học của bài này
- [Decode Ways](https://leetcode.com/problems/decode-ways/) — DP Fibonacci với điều kiện

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
