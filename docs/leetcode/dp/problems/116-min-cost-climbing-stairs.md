---
layout: page
title: "Min Cost Climbing Stairs"
difficulty: Easy
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/min-cost-climbing-stairs"
---

# Min Cost Climbing Stairs / Chi Phí Leo Cầu Thang Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dynamic Programming (Linear)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như leo cầu thang tính tiền — mỗi bậc có giá vé, bạn trả tiền khi đứng lên bậc đó, rồi có thể nhảy 1 hoặc 2 bậc. Bạn muốn lên đến đỉnh với chi phí thấp nhất.

**Pattern Recognition:**

- Signal: "min cost" + "1 or 2 steps" + overlapping subproblems → DP
- `dp[i]` = chi phí tối thiểu để **đến** bậc `i` (sau khi đã trả cost[i])
- Đỉnh là bậc `n` (ngoài mảng), có thể đến từ `n-1` hoặc `n-2`

```
cost = [10, 15, 20]

Bắt đầu tại index 0 hoặc 1 (miễn phí):
dp[0] = 10  (cost[0])
dp[1] = 15  (cost[1])
dp[2] = cost[2] + min(dp[0], dp[1]) = 20 + 10 = 30

Đỉnh (index 3): min(dp[1], dp[2]) = min(15, 30) = 15
→ Đi: bậc 1 → bậc 3 (nhảy 2 bậc). Chi phí: 15 ✓
```

---

## Problem Description / Mô Tả Bài Toán

Mỗi bậc thang `i` có chi phí `cost[i]`. Sau khi trả, có thể nhảy 1 hoặc 2 bậc. Có thể bắt đầu từ bậc 0 hoặc 1. Trả về **chi phí tối thiểu để lên đến đỉnh** (vượt qua bậc cuối).

**Example 1:** `cost=[10,15,20]` → `15`
**Example 2:** `cost=[1,100,1,1,1,100,1,1,100,1]` → `6`

**Constraints:** `2 ≤ cost.length ≤ 1000`, `0 ≤ cost[i] ≤ 999`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** The "top" is index n (one step beyond the array). Reach it from n-1 or n-2.
   **VI:** "Đỉnh" là index n (ngoài mảng). Có thể đến từ n-1 hoặc n-2.

2. **EN:** dp[i] = cost to leave step i (pay cost[i], then jump). Alternatively define dp[i] = min cost to reach step i.
   **VI:** dp[i] = chi phí rời bậc i (trả cost[i] rồi nhảy). Hoặc định nghĩa là chi phí đến bậc i.

3. **EN:** Space can be optimized to O(1) — only need the last 2 values.
   **VI:** Tối ưu không gian về O(1) — chỉ cần 2 biến thay vì mảng.

4. **EN:** Starting for free: dp[0]=cost[0], dp[1]=cost[1] — you pay when you stand on the step.
   **VI:** Xuất phát miễn phí: dp[0]=cost[0], dp[1]=cost[1] — trả tiền khi đứng trên bậc.

5. **EN:** This is a classic "Frog Jump" pattern — same recurrence as Fibonacci but with min.
   **VI:** Pattern "Frog Jump" kinh điển — cùng công thức với Fibonacci nhưng dùng min.

6. **EN:** Verify answer for `cost=[0,0]` → 0. Both paths cost 0.
   **VI:** Kiểm tra `cost=[0,0]` → 0. Cả hai đường đều miễn phí.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Top-Down Recursion + Memo — O(n) time, O(n) space ───────────
function minCostClimbingStairs_memo(cost: number[]): number {
  const n = cost.length;
  const memo = new Map<number, number>();

  function dp(i: number): number {
    if (i >= n) return 0; // reached or passed the top
    if (memo.has(i)) return memo.get(i)!;
    const result = cost[i] + Math.min(dp(i + 1), dp(i + 2));
    memo.set(i, result);
    return result;
  }

  // Can start from index 0 or 1
  return Math.min(dp(0), dp(1));
}

// ─── Solution 2: Bottom-Up DP — O(n) time, O(n) space ────────────────────────
// dp[i] = min cost to "leave" step i (pay cost[i] then jump)
function minCostClimbingStairs_dp(cost: number[]): number {
  const n = cost.length;
  const dp = [...cost]; // dp[i] = min total cost passing through step i

  for (let i = 2; i < n; i++) {
    dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
  }

  // Top is beyond the array; reached from n-1 (1 step) or n-2 (2 steps)
  return Math.min(dp[n - 1], dp[n - 2]);
}

// ─── Solution 3: Space-Optimized DP — O(n) time, O(1) space ──────────────────
function minCostClimbingStairs(cost: number[]): number {
  const n = cost.length;
  let prev2 = cost[0]; // dp[i-2]
  let prev1 = cost[1]; // dp[i-1]

  for (let i = 2; i < n; i++) {
    const curr = cost[i] + Math.min(prev1, prev2);
    prev2 = prev1;
    prev1 = curr;
  }

  return Math.min(prev1, prev2);
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(minCostClimbingStairs([10, 15, 20])); // 15
console.log(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])); // 6
console.log(minCostClimbingStairs_dp([10, 15, 20])); // 15
console.log(minCostClimbingStairs_memo([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])); // 6
console.log(minCostClimbingStairs([0, 0])); // 0
console.log(minCostClimbingStairs([1, 0])); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                            | Difficulty | Pattern        |
| --- | ------------------------------------------------------------------ | ---------- | -------------- |
| 70  | [Climbing Stairs](https://leetcode.com/problems/climbing-stairs)   | 🟢 Easy    | DP (Fibonacci) |
| 120 | [Triangle](https://leetcode.com/problems/triangle)                 | 🟡 Medium  | DP (Grid)      |
| 64  | [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) | 🟡 Medium  | DP (Grid)      |
