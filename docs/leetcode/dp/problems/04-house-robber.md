---
layout: page
title: "House Robber"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming, Array]
leetcode_url: "https://leetcode.com/problems/house-robber/"
---

# House Robber / Tên Trộm Cướp Nhà

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP (Linear with Skip Constraint)
> **Frequency**: 🔥 Tier 1 — Template kinh điển cho các bài DP có ràng buộc "không chọn liên tiếp"
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
         ↓    ↓    ↓    ↓    ↓
dp[0] = 2
dp[1] = max(2, 7) = 7
dp[2] = max(dp[0]+9, dp[1]) = max(11, 7) = 11
dp[3] = max(dp[1]+3, dp[2]) = max(10, 11) = 11
dp[4] = max(dp[2]+1, dp[3]) = max(12, 11) = 12  ✓

Chosen houses: 0 (2) + 2 (9) + 4 (1) = 12
```

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

## 📝 Interview Tips

1. **Clarify**: Can we skip more than 1 house? Yes, skip any number / Có thể bỏ qua nhiều hơn 1 nhà liên tiếp
2. **Brute force**: Try all valid subsets (no two adjacent) — O(2^n) / Thử mọi tập hợp hợp lệ
3. **Optimize**: DP: at each house, rob-or-skip decision using only prev2 and prev1 — O(n)/O(1)
4. **Edge cases**: Single house → return it; two houses → return max of both
5. **Follow-up**: Houses arranged in a circle? → LC 213 (House Robber II); tree structure? → LC 337

---

## Solutions

```typescript

/**

- Solution 1: DP with Array (Clearer)
- Time: O(n) — single pass through houses
- Space: O(n) — dp array stores best value at each position
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

- Solution 2: Space-Optimized DP (Optimal)
- Time: O(n) — single pass
- Space: O(1) — only track prev2 and prev1
  */
  function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];

let prev2 = nums[0]; // best up to house i-2
let prev1 = Math.max(nums[0], nums[1]); // best up to house i-1

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
