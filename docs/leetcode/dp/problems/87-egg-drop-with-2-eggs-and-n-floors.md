---
layout: page
title: "Egg Drop With 2 Eggs and N Floors"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/egg-drop-with-2-eggs-and-n-floors"
---

# Egg Drop With 2 Eggs and N Floors / Thả Trứng Với 2 Quả Và N Tầng

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Mathematical DP / Triangle Numbers

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có 2 cái bình gốm quý. Thả từ tầng cao xuống để tìm tầng ngưỡng vỡ. Bình đầu tiên dùng để "nhảy" lớn (mỗi lần thả tăng dần), bình thứ hai dùng để "quét" tuyến tính từ điểm cuối nhảy.

**Pattern Recognition:**

- 2 eggs = first egg jumps by decreasing steps (k, k-1, k-2...) so worst case = k attempts total
- Total coverage after k moves: k + (k-1) + ... + 1 = k\*(k+1)/2 ≥ n
- Minimum k: smallest integer where k\*(k+1)/2 ≥ n → ceil of solving quadratic

**Visual (n=14):**

```
k=4: 4+3+2+1=10 < 14  ✗
k=5: 5+4+3+2+1=15 ≥ 14 ✓

Strategy: drop egg1 at floors 5,9,12,14
  Miss at 5 → egg2 scans 1..4  (4 more)  = 5 total
  Miss at 9 → egg2 scans 6..8  (3 more)  = 5 total
  Miss at12 → egg2 scans 10,11 (2 more)  = 5 total
  Miss at14 → egg2 scans 13    (1 more)  = 5 total
Answer: 5
```

## Problem Description

You have 2 eggs and `n` floors. Find the **minimum number of moves** to determine with certainty the highest floor from which an egg will not break. A broken egg cannot be reused; an unbroken egg can.

**Example 1:** `n = 2` → `2` (drop at floor 1; if breaks, try 2; if not, try 2)
**Example 2:** `n = 100` → `14` (triangle number: 14×15/2=105 ≥ 100)

**Constraints:** `1 <= n <= 1000`

## 📝 Interview Tips

1. **Clarify**: Only 2 eggs — if we had k eggs, this becomes the classic egg drop DP.
2. **Approach**: With 2 eggs, optimal is to drop first egg at triangular intervals decreasing by 1 each step.
3. **Edge cases**: `n=1` → 1 move; `n=0` → 0 moves.
4. **Optimize**: O(1) math formula: find smallest k where k\*(k+1)/2 ≥ n.
5. **Follow-up**: Generalize to k eggs, n floors → O(k·n·log n) with binary search DP.
6. **Complexity**: O(√n) iterative, O(1) formula.

## Solutions

```typescript
// Solution 1: Iterative Triangle Numbers — Time: O(√n) | Space: O(1)
function twoEggDrop(n: number): number {
  // Find smallest k: k*(k+1)/2 >= n
  let k = 1;
  while ((k * (k + 1)) / 2 < n) k++;
  return k;
}

// Solution 2: Math Formula O(1) — Time: O(1) | Space: O(1)
function twoEggDrop2(n: number): number {
  // k*(k+1)/2 >= n  →  k^2 + k - 2n >= 0
  // k = ceil((-1 + sqrt(1 + 8n)) / 2)
  return Math.ceil((-1 + Math.sqrt(1 + 8 * n)) / 2);
}

// Solution 3: Classic DP (for understanding) — Time: O(n²) | Space: O(n)
function twoEggDrop3(n: number): number {
  // dp[i] = min moves to check i floors with 2 eggs
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = i; // worst case: linear scan
    for (let x = 1; x < i; x++) {
      // drop from floor x: breaks → check x-1 floors with 1 egg (x-1 moves)
      //                     safe  → check i-x floors with 2 eggs (dp[i-x] moves)
      const worst = Math.max(x - 1, dp[i - x]) + 1;
      dp[i] = Math.min(dp[i], worst);
    }
  }
  return dp[n];
}

// Tests
console.log(twoEggDrop(1)); // 1
console.log(twoEggDrop(2)); // 2
console.log(twoEggDrop(3)); // 2
console.log(twoEggDrop(14)); // 5  (5+4+3+2+1=15>=14)
console.log(twoEggDrop(100)); // 14 (14*15/2=105>=100)
```

## 🔗 Related Problems

| Problem                                                           | Relationship                |
| ----------------------------------------------------------------- | --------------------------- |
| [Super Egg Drop](https://leetcode.com/problems/super-egg-drop/)   | Generalization to k eggs    |
| [Jump Game](https://leetcode.com/problems/jump-game/)             | Triangular stepping pattern |
| [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) | Triangle numbers and DP     |
