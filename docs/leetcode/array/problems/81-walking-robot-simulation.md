---
layout: page
title: "Walking Robot Simulation"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Simulation]
leetcode_url: "https://leetcode.com/problems/walking-robot-simulation"
---

# Walking Robot Simulation / Mô Phỏng Robot Di Chuyển

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Robot Bounded In Circle](https://leetcode.com/problems/robot-bounded-in-circle) | [Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống điều khiển drone — bạn có lệnh rẽ trái/phải và lệnh tiến. Mỗi bước tiến cần kiểm tra chướng ngại vật. Dùng HashSet lưu obstacles để kiểm tra O(1).

```
Directions (index): N=0 → E=1 → S=2 → W=3
Turn right: (dir+1)%4   Turn left: (dir+3)%4

command=4, facing North (0,0):
  step1: (0,1) → not obstacle ✓ → maxDist=1
  step2: (0,2) → not obstacle ✓ → maxDist=4
  step3: (0,3) → not obstacle ✓ → maxDist=9
  step4: (0,4) → not obstacle ✓ → maxDist=16
```

---

## Problem Description

A robot starts at `(0,0)` facing North. Commands: `-2` = turn left 90°, `-1` = turn right 90°, `k ∈ [1,9]` = move forward k steps (stop before obstacles). Obstacles block movement at specific cells. Return the **maximum Euclidean distance squared** from origin reached during the walk.

- Example 1: `commands=[4,-1,3], obstacles=[]` → `25` (reaches (4,3) squared=25)
- Example 2: `commands=[4,-1,4,-2,4], obstacles=[[2,4]]` → `65`

Constraints: `1 <= commands.length <= 10^4`, `0 <= obstacles.length <= 10^4`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Khoảng cách Euclid bình phương, không phải Manhattan" / It's x²+y² (squared Euclidean), not Manhattan distance.
2. **Key trick / Mẹo chính**: "Encode obstacle `(x,y)` thành string `x,y` để dùng Set.has() trong O(1)" / String key in HashSet gives O(1) obstacle lookup.
3. **Direction / Hướng**: "Lưu 4 hướng dx/dy, rẽ = thay đổi index" / `dirs = [[0,1],[1,0],[0,-1],[-1,0]]` and rotate index.
4. **Edge case / Trường hợp đặc biệt**: "Robot có thể quay lại gốc — vẫn phải track maxDist ở bước trước" / Max dist must be tracked at each step, not just final position.
5. **Complexity / Độ phức tạp**: "O(n·k) n=commands, k≤9 tối đa → thực chất O(n)" / At most 9 steps per command, so effectively O(n).
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu grid có biên giới? Nếu cần in đường đi?" / Add bounds check; track path by storing all visited cells.

---

## Solutions

```typescript
/**
 * Solution 1: Hash Set Simulation
 * Time: O(n + m) — n commands × 9 max steps, m obstacles to build set
 * Space: O(m) — obstacle set
 */
function robotSim(commands: number[], obstacles: number[][]): number {
  // N, E, S, W as [dx, dy]
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const obstacleSet = new Set<string>(obstacles.map(([x, y]) => `${x},${y}`));

  let x = 0,
    y = 0,
    dir = 0,
    maxDist = 0;

  for (const cmd of commands) {
    if (cmd === -2) {
      dir = (dir + 3) % 4; // turn left
    } else if (cmd === -1) {
      dir = (dir + 1) % 4; // turn right
    } else {
      const [dx, dy] = dirs[dir];
      for (let step = 0; step < cmd; step++) {
        const nx = x + dx,
          ny = y + dy;
        if (obstacleSet.has(`${nx},${ny}`)) break;
        x = nx;
        y = ny;
        maxDist = Math.max(maxDist, x * x + y * y);
      }
    }
  }

  return maxDist;
}

/**
 * Solution 2: Same logic, slightly cleaner with early-continue pattern
 * Time: O(n + m) — identical complexity
 * Space: O(m) — obstacle set
 */
function robotSimClean(commands: number[], obstacles: number[][]): number {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const blocked = new Set(obstacles.map((o) => `${o[0]},${o[1]}`));
  let [x, y, d, ans] = [0, 0, 0, 0];

  for (const c of commands) {
    if (c < 0) {
      d = (d + (c === -1 ? 1 : 3)) % 4;
      continue;
    }
    for (let s = 0; s < c; s++) {
      const [nx, ny] = [x + dirs[d][0], y + dirs[d][1]];
      if (blocked.has(`${nx},${ny}`)) break;
      [x, y] = [nx, ny];
      ans = Math.max(ans, x * x + y * y);
    }
  }
  return ans;
}

// === Test Cases ===
console.log(robotSim([4, -1, 3], [])); // 25
console.log(robotSim([4, -1, 4, -2, 4], [[2, 4]])); // 65
console.log(robotSim([-2, -1, -2, 3, 1], [])); // 9
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern               | Difficulty |
| ---------------------------------------------------------------------------------------- | --------------------- | ---------- |
| [Robot Bounded In Circle](https://leetcode.com/problems/robot-bounded-in-circle)         | Direction simulation  | 🟡 Medium  |
| [Escape the Spreading Fire](https://leetcode.com/problems/escape-the-spreading-fire)     | BFS simulation        | 🔴 Hard    |
| [Walking Robot Simulation II](https://leetcode.com/problems/walking-robot-simulation-ii) | Robot on bounded grid | 🟡 Medium  |
| [Task Scheduler II](https://leetcode.com/problems/task-scheduler-ii)                     | Hash Map + simulation | 🟡 Medium  |
