---
layout: page
title: "Maximum Coins Heroes Can Collect"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-coins-heroes-can-collect"
---

# Maximum Coins Heroes Can Collect / Lượng Coin Tối Đa Các Anh Hùng Có Thể Thu

🟡 Medium

## 🧠 Intuition

> **Hình ảnh:** Hãy tưởng tượng một hàng quái vật xếp theo sức mạnh tăng dần. Mỗi anh hùng chỉ hạ được quái vật **yếu hơn** mình và gom hết coin của chúng. Bí quyết là: **biết mình mạnh đến đâu thì dừng**.

```
Monsters sorted: [1,  2,  3,  5,  8]
Coins prefix:    [2,  5,  9, 14, 20]
                  ↑   ↑   ↑   ↑   ↑
Hero(4) → beats monsters[0..2] → prefix[3] = 9 coins
Hero(6) → beats monsters[0..3] → prefix[4] = 14 coins
Hero(1) → beats nobody          → prefix[0] = 0 coins
```

**Chiến lược:** Sort monsters + prefix sum coins → mỗi hero binary-search tìm giới hạn → O((n+m) log m).

## 📋 Problem Description

Given `heroes[i]`, `monsters[j]`, `coins[j]`: hero `i` defeats monster `j` iff `heroes[i] > monsters[j]` and earns `coins[j]`. Return `ans[i]` = total coins hero `i` can collect fighting ALL defeatable monsters.

**Example 1:** `heroes=[1,4,2]`, `monsters=[1,1,3,4]`, `coins=[1,1,3,4]` → `[0,5,1]`
**Example 2:** `heroes=[5]`, `monsters=[2,3,4]`, `coins=[10,20,30]` → `[60]`

**Constraints:** `1 ≤ n, m ≤ 10^5`, `1 ≤ heroes[i], monsters[j], coins[j] ≤ 10^9`

## 📝 Interview Tips

- **Clarify:** Does hero need to beat all monsters simultaneously? No — any monster weaker than hero is beaten
- **Brute force:** O(n·m) — for each hero, scan all monsters. Too slow for 10^5 × 10^5
- **Key insight:** Sort monsters; prefix sum coins; hero's answer = prefix[upperBound(power)]
- **Sort trick:** Zip (monsters[j], coins[j]) together before sorting to maintain alignment
- **Binary search boundary:** `monsters[mid] < hero` → move lo up; else move hi down
- **Edge case:** Hero weaker than all monsters → 0; hero stronger than all → total sum of coins

## 💡 Solutions

### Solution 1: Sort + Prefix Sum + Binary Search — O((n+m) log m)

```typescript
function maximumCoins(heroes: number[], monsters: number[], coins: number[]): number[] {
  // Zip and sort monsters by strength
  const m = monsters.length;
  const paired = monsters.map((s, i) => [s, coins[i]] as [number, number]);
  paired.sort((a, b) => a[0] - b[0]);

  // Build prefix sum of coins over sorted order
  const prefix = new Array(m + 1).fill(0);
  for (let i = 0; i < m; i++) {
    prefix[i + 1] = prefix[i] + paired[i][1];
  }
  const strengths = paired.map(([s]) => s);

  return heroes.map((power) => {
    // Find count of monsters strictly weaker than hero (strength < power)
    let lo = 0,
      hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (strengths[mid] < power) lo = mid + 1;
      else hi = mid;
    }
    return prefix[lo];
  });
}
```

### Solution 2: Sort Both + Two Pointers — O((n+m) log(n+m))

```typescript
function maximumCoinsTwoPointer(heroes: number[], monsters: number[], coins: number[]): number[] {
  const m = monsters.length;
  const n = heroes.length;
  const sortedMonsters = monsters
    .map((s, i) => [s, coins[i]] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  // Sort heroes keeping original index for result placement
  const sortedHeroes = heroes.map((p, i) => [p, i] as [number, number]).sort((a, b) => a[0] - b[0]);

  const result = new Array(n).fill(0);
  let j = 0;
  let runningCoins = 0;

  for (const [power, origIdx] of sortedHeroes) {
    // Advance past all monsters this hero can beat
    while (j < m && sortedMonsters[j][0] < power) {
      runningCoins += sortedMonsters[j][1];
      j++;
    }
    result[origIdx] = runningCoins;
  }
  return result;
}
```

### Solution 3: Functional One-liner Style

```typescript
function maximumCoinsClean(heroes: number[], monsters: number[], coins: number[]): number[] {
  const sorted = monsters.map((s, i) => ({ s, c: coins[i] })).sort((a, b) => a.s - b.s);
  const prefix = sorted.reduce<number[]>(
    (acc, { c }) => {
      acc.push(acc[acc.length - 1] + c);
      return acc;
    },
    [0],
  );
  const upperBound = (power: number) => {
    let lo = 0,
      hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      sorted[mid].s < power ? (lo = mid + 1) : (hi = mid);
    }
    return lo;
  };
  return heroes.map((p) => prefix[upperBound(p)]);
}
```

## 🔗 Related Problems

| Problem                                                                                                   | Similarity                                 |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens/) | Prefix sum + binary search on sorted array |
| [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom/)         | Count overlap via sorting + binary search  |
| [Maximum Earnings From Taxi](https://leetcode.com/problems/maximum-earnings-from-taxi/)                   | Prefix sum with sorted intervals           |
| [Heaters](https://leetcode.com/problems/heaters/)                                                         | Binary search threshold on sorted data     |
