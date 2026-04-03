---
layout: page
title: "House Robber"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Array]
leetcode_url: "https://leetcode.com/problems/house-robber/"
leetcode_number: 198
pattern: "Linear DP (Skip Constraint)"
frequency_tier: 1
companies: [Amazon, Google, Meta, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# House Robber / Tên Trộm Cướp Nhà

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linear DP (Skip Constraint)
> **Frequency**: 🔥 Tier 1 — Template kinh điển cho DP "không chọn liên tiếp"
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Google, Meta, Microsoft
> **See also**: [Climbing Stairs](./01-climbing-stairs.md) | [House Robber II](https://leetcode.com/problems/house-robber-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như chọn món ăn trong buffet theo hàng — bạn không thể lấy 2 món đứng cạnh nhau (hết chỗ trên đĩa). Để tối đa hóa tổng giá trị, tại mỗi món bạn chỉ hỏi: "Lấy món này + tổng tốt nhất bỏ qua 1 món trước, hay bỏ qua món này và giữ tổng tốt nhất vừa rồi?"

**Pattern Recognition:**

- Signal: "cannot rob adjacent houses", "maximize total" → **DP with skip-1 constraint**
- Tại nhà `i`: `dp[i] = max(dp[i-2] + nums[i], dp[i-1])`
- Giống Climbing Stairs nhưng đảo ngược: thay vì "đến đây qua đâu", hỏi "chọn hay bỏ"

**Visual — nums = [2, 7, 9, 3, 1]:**

```
House:   0    1    2    3    4
Money:   2    7    9    3    1
dp[0] = 2
dp[1] = max(2, 7) = 7
dp[2] = max(dp[0]+9, dp[1]) = max(11, 7) = 11
dp[3] = max(dp[1]+3, dp[2]) = max(10, 11) = 11
dp[4] = max(dp[2]+1, dp[3]) = max(12, 11) = 12  ✓
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                      |
| ---------------- | ------------------------------------------------------------- |
| **When you see** | "maximize sum", "cannot select adjacent", "skip constraint"   |
| **Think**        | Linear DP — at each item, rob (skip prev) or skip (keep prev) |
| **Template**     | `prev2, prev1 = 0, 0; cur = max(prev2 + x, prev1)`            |
| **Time target**  | ⏱️ 20 min (Medium)                                            |

> 💡 **Memory hook / Móc nhớ:** "Buffet rule — lấy món này thì bỏ món bên cạnh, đổi đĩa mới!"

---

## Problem Description

You are a robber; each house has money but **adjacent houses share an alarm** — robbing two consecutive houses triggers the police. Given `nums[i]` = money in house `i`, return the **maximum amount** you can rob without alerting police.

```
Example 1: [1,2,3,1]   → 4    (rob house 0+2: 1+3)
Example 2: [2,7,9,3,1] → 12   (rob house 0+2+4: 2+9+1)
Example 3: [2,1,1,2]   → 4    (rob house 0+3: 2+2)
```

Constraints:

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an array of house values. We need the maximum sum we can collect
> without picking two adjacent elements.
> Clarification: Can we skip more than one house? — Yes, any gap ≥ 2."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force: try all valid subsets — O(2^n).
> But I notice at each house the decision is only: rob it + best from i-2, or skip it and keep best from i-1.
> I'll use DP with two variables: prev2 and prev1.
> O(n) time, O(1) space. Should I code this?"

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll handle base cases: one house → return it, two houses → return max.
> Then iterate from index 2, computing `current = max(prev2 + nums[i], prev1)`.
> Shift prev2 = prev1, prev1 = current each step."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [2,7,9,3,1]. prev2=2, prev1=7.
> i=2: cur=max(2+9,7)=11, prev2=7, prev1=11.
> i=3: cur=max(7+3,11)=11. i=4: cur=max(11+1,11)=12. Return 12. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — single pass. Space: O(1) — two variables.
> Edge cases: single house, two houses, all zeros, all equal values.
> Follow-up: circular houses → House Robber II; tree → House Robber III."

---

## 📝 Interview Tips

1. **Clarify**: Can we skip more than 1 house? Yes — any gap ≥ 2 / Có thể bỏ qua nhiều hơn 1 nhà
2. **Brute force**: Try all valid subsets (no two adjacent) — O(2^n) / Thử mọi tập hợp hợp lệ
3. **Optimize**: DP: rob-or-skip decision using only prev2 and prev1 — O(n)/O(1)
4. **Edge cases**: Single house → return it; two houses → return max of both
5. **Follow-up**: Circular houses → LC 213; tree structure → LC 337

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm             | Why Wrong / Tại sao sai                                                         | Fix / Cách sửa                            |
| --- | ----------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Greedy: always pick max value | May miss better combos: [1,100,1,100] greedy picks 100+100 but skips constraint | DP considers all valid combinations       |
| 2   | Forget base case for n ≤ 2    | Index out of bounds when accessing dp[i-2]                                      | Handle n=1 and n=2 explicitly before loop |
| 3   | Using full dp array           | Wastes O(n) space when only prev2/prev1 needed                                  | Optimize to two variables for O(1) space  |

---

## Solutions

```typescript
/**
 * Solution 1: DP with Array (Clearer)
 * Time: O(n) — single pass through houses
 * Space: O(n) — dp array stores best value at each position
 */
function robDP(nums: number[]): number {
  if (nums.length === 1) return nums[0];

  const dp = new Array(nums.length).fill(0);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
  }

  return dp[nums.length - 1];
}

/**
 * Solution 2: Space-Optimized DP (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — only track prev2 and prev1
 */
function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];

  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    const current = Math.max(prev2 + nums[i], prev1);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// === Test Cases ===
console.log(rob([1, 2, 3, 1])); // 4
console.log(rob([2, 7, 9, 3, 1])); // 12
console.log(rob([1])); // 1 (edge: single house)
```

---

## 🔗 Related Problems

- [Climbing Stairs](./01-climbing-stairs.md) — cùng dạng DP linear, dp[i] = f(dp[i-1], dp[i-2])
- [House Robber II](https://leetcode.com/problems/house-robber-ii/) — biến thể dãy nhà vòng tròn
- [House Robber III](https://leetcode.com/problems/house-robber-iii/) — biến thể trên cây nhị phân (Tree DP)

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
