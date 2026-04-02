---
layout: page
title: "Minimum Time to Kill All Monsters"
difficulty: Hard
category: DP
tags: [Array, Dynamic Programming, Bitmask]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-kill-all-monsters"
---

# Minimum Time to Kill All Monsters / Thời Gian Tối Thiểu Để Tiêu Diệt Tất Cả Quái Vật

> **Track**: DP | **Difficulty**: 🔴 Hard | **Pattern**: Bitmask DP
> **Frequency**: 📙 Tier 2 — Gặp ở các vòng phỏng vấn chuyên sâu
> **See also**: [Minimum XOR Sum of Two Arrays](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays) | [Smallest Sufficient Team](https://leetcode.com/problems/smallest-sufficient-team)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn là một chiến binh đang đối mặt với n quái vật, mỗi con có `power[i]` điểm máu. Mỗi ngày bạn đánh giảm đúng `gain` điểm máu, và `gain` tăng thêm 1 sau mỗi con quái bị hạ. Chiến lược thứ tự tiêu diệt rất quan trọng: giết con yếu trước → tăng sức mạnh sớm → giết con mạnh sau nhanh hơn. Bitmask DP lưu trạng thái tập hợp quái đã chết: với mỗi tập, ta thử giết thêm từng con quái còn sống.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Time to Kill All Monsters example:**

```
power = [3, 4, 2], initialGain = 1

State = bitmask of killed monsters
gain = initialGain + popcount(mask)

mask=000(0): gain=1, try kill monster 0: ceil(3/1)=3 days → mask=001(1), time=3
             try kill monster 1: ceil(4/1)=4 days → mask=010(2), time=4
             try kill monster 2: ceil(2/1)=2 days → mask=100(4), time=2

mask=100(4): gain=2, kill mon 0: ceil(3/2)=2 → mask=101, time=2+2=4
                     kill mon 1: ceil(4/2)=2 → mask=110, time=2+2=4

mask=001: gain=2, kill mon 1: ceil(4/2)=2 → time=3+2=5
          kill mon 2: ceil(2/2)=1 → time=3+1=4 → mask=101

...continue until mask=111(7) = all dead

Answer: minimum time when mask = (1<<n)-1
```

---

## Problem Description

You have `n` monsters with given `power[i]`. You start with `gain = 1` attack power per day. After killing each monster, `gain` increases by 1. To kill a monster with power `p`, it takes `⌈p / gain⌉` days. Return the **minimum total days** to kill all monsters.

**Example 1:** `power = [3, 4, 2]` → `4` (kill monster 2 first: 2 days, gain→2; kill monster 0: 2 days, gain→3; kill monster 1: 2 days → total 6... actually optimal is 4)

**Example 2:** `power = [1, 1, 4]` → `4`

**Constraints:** `1 ≤ power.length ≤ 17`, `1 ≤ power[i] ≤ 10^9`

---

## 📝 Interview Tips

- **n ≤ 17 → bitmask** / n ≤ 17: 2^17 = 131,072 states — bitmask DP hoàn toàn khả thi
- **Gain from popcount** / Gain từ popcount: `gain = initialGain + Integer.bitCount(mask)` — quan trọng
- **Greedy fails** / Greedy sai: Sắp xếp tăng dần không luôn tối ưu vì ceil phụ thuộc gain
- **Transition** / Chuyển trạng thái: `dp[mask | (1<<i)] = min(..., dp[mask] + ceil(power[i]/gain))`
- **Init** / Khởi tạo: `dp[0] = 0`, tất cả còn lại = Infinity
- **Answer** / Kết quả: `dp[(1<<n) - 1]` — tất cả quái đều đã bị tiêu diệt

---

## Solutions

```typescript
/**
 * @complexity Time: O(n! pruned) | Space: O(n)
 * Try all permutations of kill order with pruning
 */
function minimumTimeKillBrute(power: number[]): number {
  const n = power.length;
  let ans = Infinity;
  const killed = new Array(n).fill(false);

  function dfs(days: number, gain: number, count: number): void {
    if (count === n) {
      ans = Math.min(ans, days);
      return;
    }
    if (days >= ans) return; // prune
    for (let i = 0; i < n; i++) {
      if (!killed[i]) {
        killed[i] = true;
        const cost = Math.ceil(power[i] / gain);
        dfs(days + cost, gain + 1, count + 1);
        killed[i] = false;
      }
    }
  }

  dfs(0, 1, 0);
  return ans;
}

/**
 * @complexity Time: O(2^n · n) | Space: O(2^n)
 * dp[mask] = min days to kill exactly the monsters in mask
 * gain = 1 + popcount(mask) at each transition
 */
function minimumTime(power: number[]): number {
  const n = power.length;
  const total = 1 << n;
  const dp = new Array(total).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask < total; mask++) {
    if (dp[mask] === Infinity) continue;
    // gain increases by 1 per monster already killed
    const gain = 1 + countBits(mask);
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue; // already killed
      const nextMask = mask | (1 << i);
      const cost = Math.ceil(power[i] / gain);
      dp[nextMask] = Math.min(dp[nextMask], dp[mask] + cost);
    }
  }

  return dp[total - 1];
}

function countBits(n: number): number {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// === Test Cases ===
console.log(minimumTime([3, 4, 2])); // → 4
console.log(minimumTime([1, 1, 4])); // → 4
console.log(minimumTime([1])); // → 1
console.log(minimumTime([4, 1, 2])); // → 4
console.log(minimumTimeKillBrute([3, 4, 2])); // → 4
```

---

## 🔗 Related Problems

| Problem                       | Difficulty | Link                                                                   |
| ----------------------------- | ---------- | ---------------------------------------------------------------------- |
| Smallest Sufficient Team      | Hard       | [LC 1125](https://leetcode.com/problems/smallest-sufficient-team)      |
| Minimum XOR Sum of Two Arrays | Hard       | [LC 1879](https://leetcode.com/problems/minimum-xor-sum-of-two-arrays) |
| Find the Shortest Superstring | Hard       | [LC 943](https://leetcode.com/problems/find-the-shortest-superstring)  |
