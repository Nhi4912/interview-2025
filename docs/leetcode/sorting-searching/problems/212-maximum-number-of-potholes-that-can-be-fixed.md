---
layout: page
title: "Maximum Number of Potholes That Can Be Fixed"
difficulty: Medium
category: Sorting-Searching
tags: [String, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-potholes-that-can-be-fixed"
---

# Maximum Number of Potholes That Can Be Fixed / Số Ổ Gà Tối Đa Có Thể Vá

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Minimum Number of Coins to be Added](./211-minimum-number-of-coins-to-be-added.md) | [Jump Game](https://leetcode.com/problems/jump-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Con đường có các đoạn ổ gà liên tiếp (`x`). Mỗi lần vá một đoạn dài L tốn L+1 ngân sách (L để vá ổ gà + 1 cho ký tự đường tiếp theo). Chiến lược tham lam: vá đoạn dài nhất trước — mỗi đơn vị ngân sách sinh ra nhiều ổ gà được vá nhất. Sort các đoạn giảm dần, vá từng đoạn cho đến khi hết budget.

**Pattern Recognition:**

- Signal: "maximize potholes fixed" + "fixed cost per segment" → **Count runs + Sort + Greedy**
- Mỗi run `x...x` độ dài L tốn L+1 budget → hiệu quả nhất khi L lớn
- Nếu budget chưa đủ cho cả run → vá L = budget-1 ổ gà trong run đó

**Visual — road="..xxxxx..xx.x", budget=6:**

```
Runs: [5, 2, 1]  (lengths of consecutive 'x' groups)
Sort desc: [5, 2, 1]

Run 5: cost=6, budget=6 >= 6 -> fix 5 potholes, budget=0
budget=0 -> stop
Total fixed = 5 ✅

road="xxx.x", budget=4:
Runs: [3, 1], sort: [3, 1]
Run 3: cost=4, budget=4 >= 4 -> fix 3, budget=0 -> Total=3
```

---

## Problem Description

Given string `road` ('x' = pothole, '.' = smooth) and integer `budget`. Fixing a contiguous segment of `L` potholes costs `L+1` budget. Maximize total potholes fixed.

```
Example 1: road="..xxxxx..xx.x", budget=14 -> 9
Example 2: road="xxx.x", budget=4           -> 3
Example 3: road="x.x", budget=2             -> 1
```

---

## 📝 Interview Tips

1. **Tại sao +1?** Để fix một đoạn L ổ gà, cần dùng L+1 budget (gồm 1 char đường sau)
2. **Greedy by run length**: Dài nhất → hiệu quả nhất (cost/potholes ratio nhỏ nhất)
3. **Khi budget không đủ cho cả run**: Vá budget-1 ổ gà trong run đó (dùng hết budget)
4. **Edge case**: budget=1 → không thể vá gì (cần ít nhất 2: 1 ổ gà + 1 đường)
5. **Hỏi follow-up**: "Nếu chi phí là function khác của L?" → Vẫn sort + greedy nếu monotone
6. **Complexity**: Time O(n + k log k) với k = số runs, Space O(k)

---

## Solutions

```typescript
/**
 * Solution 1: Count Runs + Sort Descending + Greedy (Optimal)
 * Time O(n + k log k), Space O(k)   k = number of pothole runs
 *
 * Parse all contiguous 'x' runs, sort by length descending,
 * greedily fix as many as possible within budget.
 */
function maxPotholes(road: string, budget: number): number {
  // Parse runs of consecutive 'x'
  const runs: number[] = [];
  let i = 0;
  while (i < road.length) {
    if (road[i] === 'x') {
      let len = 0;
      while (i < road.length && road[i] === 'x') { len++; i++; }
      runs.push(len);
    } else {
      i++;
    }
  }

  // Greedily fix longest runs first (each costs len+1)
  runs.sort((a, b) => b - a);
  let fixed = 0;

  for (const run of runs) {
    if (budget <= 0) break;
    const cost = run + 1;
    if (budget >= cost) {
      fixed += run;
      budget -= cost;
    } else {
      // Can fix at most budget-1 potholes with remaining budget
      fixed += Math.max(0, budget - 1);
      break;
    }
  }

  return fixed;
}

/**
 * Solution 2: One-pass with sorting (same logic, cleaner loop)
 * Time O(n + k log k), Space O(k)
 */
function maxPotholes2(road: string, budget: number): number {
  const runs: number[] = [];
  let count = 0;
  for (let i = 0; i <= road.length; i++) {
    if (i < road.length && road[i] === 'x') {
      count++;
    } else if (count > 0) {
      runs.push(count);
      count = 0;
    }
  }

  runs.sort((a, b) => b - a);
  let ans = 0;

  for (const r of runs) {
    if (budget < 2) break; // minimum cost is 2 (1 pothole + 1 road)
    const canFix = Math.min(r, budget - 1);
    ans += canFix;
    budget -= canFix + 1;
  }
  return ans;
}

// --- Quick inline tests ---
console.log(maxPotholes('..xxxxx..xx.x', 14)); // 9
console.log(maxPotholes('xxx.x', 4));           // 3
console.log(maxPotholes('x.x', 2));             // 1
console.log(maxPotholes('....', 5));            // 0
console.log(maxPotholes2('..xxxxx..xx.x', 14)); // 9
console.log(maxPotholes2('x', 1));              // 0 (need budget >= 2)
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [3119. Maximum Number of Potholes That Can Be Fixed](https://leetcode.com/problems/maximum-number-of-potholes-that-can-be-fixed/) | This problem |
| [2952. Minimum Number of Coins to be Added](https://leetcode.com/problems/minimum-number-of-coins-to-be-added/) | Greedy coverage with budget |
| [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Greedy budget allocation |
| [1326. Minimum Taps to Water Garden](https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/) | Greedy interval coverage |
| [1642. Furthest Building You Can Reach](https://leetcode.com/problems/furthest-building-you-can-reach/) | Greedy resource allocation |
