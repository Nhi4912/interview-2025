---
layout: page
title: "Toss Strange Coins"
difficulty: Medium
category: DP
tags: [Math, Dynamic Programming, Probability]
leetcode_url: "https://leetcode.com/problems/toss-strange-coins"
---

# Toss Strange Coins / Tung Đồng Xu Kỳ Lạ

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: Probability DP
> **Frequency**: 📙 Tier 2 — Gặp ở các vòng phỏng vấn về xác suất
> **See also**: [Soup Servings](https://leetcode.com/problems/soup-servings) | [New 21 Game](https://leetcode.com/problems/new-21-game)

---

## Vietnamese Analogy (Ví dụ thực tế)

Bạn có `n` đồng xu ma thuật — đồng xu thứ `i` có xác suất `prob[i]` ra mặt ngửa. Tung tất cả đồng xu, xác suất để đúng `target` đồng ra mặt ngửa là bao nhiêu? Giống như `n` học sinh thi đậu với tỉ lệ khác nhau — xác suất đúng `k` người đậu? DP theo từng học sinh: `dp[j]` = xác suất đúng `j` người đậu sau khi xét `i` người đầu.

## Visual (Minh họa trực quan)

```
prob = [0.4, 0.5, 0.6], target = 2

dp[j] = P(exactly j heads with first i coins)

Initial (0 coins): dp[0]=1.0, dp[1..3]=0

After coin 0 (p=0.4):
  dp[1] = dp[0]*0.4 = 0.4
  dp[0] = dp[0]*0.6 = 0.6

After coin 1 (p=0.5):
  dp[2] = old_dp[1]*0.5 = 0.4*0.5 = 0.20
  dp[1] = old_dp[1]*0.5 + old_dp[0]*0.5 = 0.4*0.5 + 0.6*0.5 = 0.50
  dp[0] = old_dp[0]*0.5 = 0.6*0.5 = 0.30

After coin 2 (p=0.6):
  dp[2] = old_dp[2]*0.4 + old_dp[1]*0.6
        = 0.20*0.4 + 0.50*0.6 = 0.08 + 0.30 = 0.38

Answer: dp[2] = 0.38 ✓ (wait: 0.4*0.5*0.4 + 0.4*0.5*0.6 + 0.6*0.5*0.6 = exact same)
```

## Problem (Bài toán)

You have `n` coins with probabilities `prob[i]` of landing heads. Toss all coins simultaneously. Return the **probability** that exactly `target` coins show heads.

**Example 1:** `prob = [0.4]`, `target = 1` → `0.4`

**Example 2:** `prob = [0.5, 0.5, 0.5, 0.5, 0.5]`, `target = 0` → `0.03125`

**Example 3:** `prob = [0.4, 0.5, 0.6]`, `target = 2` → `0.38`

**Constraints:** `1 ≤ prob.length ≤ 1000`, `0 ≤ prob[i] ≤ 1`, `0 ≤ target ≤ prob.length`

## Tips (Mẹo phỏng vấn)

- **dp[j] = P(exactly j heads)** / Ý nghĩa: Sau khi xét `i` đồng xu, xác suất đúng `j` mặt ngửa
- **Reverse iteration** / Duyệt ngược: Duyệt `j` từ `i` xuống 1 để tránh dùng coin mới nhiều lần
- **Update rule** / Công thức: `dp[j] = dp[j]*notHead + dp[j-1]*head` — xác suất tổng hợp
- **Floating point** / Số thực: Dùng `number` đủ chính xác với `prob.length ≤ 1000`
- **Base case** / Cơ sở: `dp[0] = 1.0` (0 đồng xu, 0 mặt ngửa — chắc chắn)
- **Space O(target)** / Không gian: Chỉ cần mảng 1D — duyệt ngược tránh ghi đè

## Solution 1 - Naive Recursion with Memo

```typescript
/**
 * @complexity Time: O(n·target) | Space: O(n·target)
 * Memoized recursion: P(i coins, exactly j heads)
 */
function probabilityOfHeadsMemo(prob: number[], target: number): number {
  const n = prob.length;
  const memo: Map<string, number> = new Map();

  function dp(i: number, heads: number): number {
    if (heads < 0 || heads > i) return 0;
    if (i === 0) return heads === 0 ? 1 : 0;
    const key = `${i},${heads}`;
    if (memo.has(key)) return memo.get(key)!;
    const res = prob[i - 1] * dp(i - 1, heads - 1) + (1 - prob[i - 1]) * dp(i - 1, heads);
    memo.set(key, res);
    return res;
  }

  return dp(n, target);
}
```

## Solution 2 - 1D DP (Optimal)

```typescript
/**
 * @complexity Time: O(n·target) | Space: O(target)
 * Rolling 1D DP: iterate coins, update dp in reverse
 */
function probabilityOfHeads(prob: number[], target: number): number {
  // dp[j] = probability of exactly j heads so far
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1.0;

  for (const p of prob) {
    // Reverse to avoid using this coin twice in one pass
    for (let j = Math.min(target, prob.indexOf(p) + 1); j >= 1; j--) {
      dp[j] = dp[j] * (1 - p) + dp[j - 1] * p;
    }
    dp[0] *= 1 - p;
  }

  return dp[target];
}

/**
 * @complexity Time: O(n·target) | Space: O(target)
 * Cleaner version: track coin index separately
 */
function probabilityOfHeadsClean(prob: number[], target: number): number {
  const n = prob.length;
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1.0;

  for (let i = 0; i < n; i++) {
    const p = prob[i];
    for (let j = Math.min(i + 1, target); j >= 1; j--) {
      dp[j] = dp[j] * (1 - p) + dp[j - 1] * p;
    }
    dp[0] *= 1 - p;
  }

  return dp[target];
}
```

## Test Cases

```typescript
console.log(probabilityOfHeadsClean([0.4], 1)); // → 0.4
console.log(probabilityOfHeadsClean([0.5, 0.5, 0.5, 0.5, 0.5], 0)); // → 0.03125
console.log(probabilityOfHeadsClean([0.4, 0.5, 0.6], 2)); // → ~0.38
console.log(probabilityOfHeadsMemo([0.4, 0.5, 0.6], 2)); // → ~0.38
console.log(probabilityOfHeadsClean([1.0, 1.0, 1.0], 3)); // → 1.0
```

## Related Problems

| Problem              | Difficulty | Link                                                          |
| -------------------- | ---------- | ------------------------------------------------------------- |
| New 21 Game          | Medium     | [LC 837](https://leetcode.com/problems/new-21-game)           |
| Soup Servings        | Medium     | [LC 808](https://leetcode.com/problems/soup-servings)         |
| Dice Roll Simulation | Hard       | [LC 1223](https://leetcode.com/problems/dice-roll-simulation) |
