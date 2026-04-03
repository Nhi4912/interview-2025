---
layout: page
title: "Race Car"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/race-car"
---

# Race Car / Xe Đua

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như lái xe cao tốc — bạn có thể tăng tốc liên tục (A) hoặc quay đầu (R). Mục tiêu đến đích với ít lệnh nhất. Mỗi trạng thái (vị trí, tốc độ) là một node trong đồ thị ngầm, cần tìm đường ngắn nhất.

**Pattern Recognition:**

- Signal: "minimum instructions" + "state transitions with two choices" → **DP or BFS**
- Key insight: `dp[i]` = số lệnh tối thiểu đến vị trí `i`; với mỗi `i` chỉ có 2 dạng transition
- Overshoot (đi qua, quay lại) vs. undershoot (dừng trước, đảo chiều, đi tiếp)

**Visual — transitions for target = 6:**

```
Positions after k Accelerations: 2^k - 1
  k=1 → 1,  k=2 → 3,  k=3 → 7

target=6 (between 2^2=4 and 2^3=8):
  Overshoot:  AAA(→7) R A(←1)     = 3+1+1 = 5 ✓
  Undershoot: AA(→3) R Aj R solve  = 2+1+j+1+dp[6-3+2^j]
```

---

## Problem Description

Car starts at position 0 with speed +1. **A**: `pos += speed; speed *= 2`. **R**: `speed = speed > 0 ? -1 : 1`. Return the minimum number of instructions to reach `target`. ([LeetCode 818](https://leetcode.com/problems/race-car))

**Example 1:** `target = 3` → `2` ("AA": 0→1→3, speeds 1→2→4)

**Example 2:** `target = 6` → `5` ("AAARA": 0→1→3→7→7→6)

Constraints: `1 <= target <= 10000`

---

## 📝 Interview Tips

1. **Clarify**: "State = (position, speed); speed doubles so can be huge — need bounds" / Speed grows exponentially, prune aggressively
2. **BFS insight**: "Giữ position trong (-target, 2\*target) để tránh vòng lặp vô tận" / Bound positions to keep state space finite
3. **DP insight**: "Chỉ cần dp[0..target]; transition từ overshoot và undershoot" / Only need dp table up to target
4. **Key base case**: "Nếu 2^k - 1 == i thì dp[i] = k" / Exact powers-of-2 minus 1 are trivial: dp[2^k-1] = k
5. **Complexity**: "DP là O(t log t) vì mỗi i có O(log i) transitions" / Each target has O(log target) cases to check
6. **Edge cases**: "target=1 → 1, target=3 → 2, verify formulas on small targets first" / Always sanity-check with small examples

---

## Solutions

```typescript
/**
 * Solution 1: BFS on (position, speed) state pairs
 * Time: O(target * log(target)) — bounded state space
 * Space: O(target * log(target)) — visited set size
 */
function raceCarBFS(target: number): number {
  type State = [number, number]; // [position, speed]
  const visited = new Set<string>(["0,1"]);
  let queue: State[] = [[0, 1]];
  let steps = 0;

  while (queue.length > 0) {
    const next: State[] = [];
    for (const [pos, speed] of queue) {
      if (pos === target) return steps;
      // Accelerate: pos += speed, speed *= 2
      const np = pos + speed,
        ns = speed * 2;
      const ak = `${np},${ns}`;
      if (!visited.has(ak) && np > 0 && np < 2 * target) {
        visited.add(ak);
        next.push([np, ns]);
      }
      // Reverse: flip speed direction
      const rs = speed > 0 ? -1 : 1;
      const rk = `${pos},${rs}`;
      if (!visited.has(rk)) {
        visited.add(rk);
        next.push([pos, rs]);
      }
    }
    queue = next;
    steps++;
  }
  return -1;
}

/**
 * Solution 2: Bottom-Up DP — O(t log t) time
 * Time: O(t log t) — 2 transition types, each O(log i) per position
 * Space: O(t) — dp array of size target+1
 */
function raceCar(target: number): number {
  const dp = new Array(target + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= target; i++) {
    // k = smallest integer where 2^k > i
    let k = 1;
    while (1 << k <= i) k++;

    // Case 1: exact hit — 2^k - 1 == i, just k accelerations
    if ((1 << k) - 1 === i) {
      dp[i] = k;
      continue;
    }

    // Case 2: overshoot — go k A's to 2^k-1, R, come back dp[2^k-1-i]
    dp[i] = k + 1 + dp[(1 << k) - 1 - i];

    // Case 3: undershoot — go k-1 A's, R, go j A's backward, R, solve rest
    for (let j = 0; j < k - 1; j++) {
      const netPos = (1 << (k - 1)) - (1 << j);
      dp[i] = Math.min(dp[i], k - 1 + 1 + j + 1 + dp[i - netPos]);
    }
  }

  return dp[target];
}

// === Test Cases ===
console.log(raceCar(1)); // 1  ("A")
console.log(raceCar(3)); // 2  ("AA")
console.log(raceCar(6)); // 5  ("AAARA")
console.log(raceCar(10)); // 7
```

---

## 🔗 Related Problems

| Problem                                                                                                      | Difficulty | Pattern       |
| ------------------------------------------------------------------------------------------------------------ | ---------- | ------------- |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                   | 🟡 Medium  | Greedy / BFS  |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix)               | 🟡 Medium  | BFS           |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                     | 🔴 Hard    | BFS on state  |
| [Minimum Cost to Reach Destination](https://leetcode.com/problems/minimum-cost-to-reach-city-with-discounts) | 🟡 Medium  | Dijkstra / DP |
| [Dungeon Game](https://leetcode.com/problems/dungeon-game)                                                   | 🔴 Hard    | Interval DP   |
