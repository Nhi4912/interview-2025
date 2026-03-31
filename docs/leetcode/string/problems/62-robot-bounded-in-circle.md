---
layout: page
title: "Robot Bounded In Circle"
difficulty: Medium
category: String
tags: [Math, String, Simulation]
leetcode_url: "https://leetcode.com/problems/robot-bounded-in-circle"
---

# Robot Bounded In Circle / Robot Bị Giới Hạn Trong Vòng Tròn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation) | [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Robot đi theo lệnh lặp vô hạn. Nó tạo thành vòng tròn nếu: sau một lượt lệnh, nó trở về điểm gốc (0,0), HOẶC nó không còn hướng về phía Bắc (vì qua 2 hoặc 4 lượt sẽ lặp lại).

**Pattern Recognition:**

- Signal: "infinite loop of instructions" + "does it form a cycle?" → **Simulate one cycle, check position and direction**
- Key insight: Bounded ⟺ `(x=0 AND y=0)` OR `(direction != North after 1 cycle)`
  - Nếu hướng West/East: sau 2 chu kỳ về gốc
  - Nếu hướng South: sau 4 chu kỳ về gốc

**Visual — instructions="GLGLGGLGL":**

```
Directions: N(0,1) E(1,0) S(0,-1) W(-1,0)
dir=0(N), x=0, y=0

'G' → y+=1  → (0,1)
'L' → dir=3(W)
'G' → x-=1  → (-1,1)
... (simulate full string)

After cycle: if (x,y)=(0,0) OR dir≠0(N) → bounded=true
```

---

## Problem Description

A robot starts at `(0,0)` facing North and follows instructions: `'G'` (go forward), `'L'` (turn left 90°), `'R'` (turn right 90°). The instructions repeat infinitely. Return `true` if the robot is bounded within a circle.

```
Example 1: instructions="GGLLGG"  → true   (returns to origin after 1 cycle)
Example 2: instructions="GG"      → false  (goes north forever)
Example 3: instructions="GL"      → true   (circles in 4 cycles)
```

Constraints: `1 <= instructions.length <= 100`, instructions contain `'G'`, `'L'`, `'R'` only.

---

## 📝 Interview Tips

1. **Clarify**: "Lặp vô hạn hay hữu hạn? Bounded có nghĩa là gì chính xác?" / Infinite repetition, bounded = stays within some circle
2. **Key theorem**: "Bounded ⟺ về gốc sau 1 chu kỳ OR không nhìn về Bắc" / Math theorem: origin OR non-north direction
3. **Direction tracking**: "Dùng dx/dy array hoặc enum — xoay trái/phải thay đổi index" / Use direction index 0-3 with modulo
4. **Edge cases**: "\"G\" → false (đi mãi về Bắc), \"LLLL\" → true (đứng yên)" / Single 'G', no-op rotations
5. **Why 4 cycles max?**: "Hướng South → 4 chu kỳ = 360° về gốc; West/East → 2 chu kỳ" / Explain the 4-cycle bound
6. **Simulate**: "Chỉ cần simulate 1 lần — không cần 4 lần" / One simulation is sufficient

---

## Solutions

```typescript
/**
 * Solution 1: Simulate 4 cycles (brute, always terminates)
 * Time: O(4n) = O(n)
 * Space: O(1)
 */
function isRobotBoundedBrute(instructions: string): boolean {
  // Directions: N, E, S, W with their (dx, dy)
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let dir = 0,
    x = 0,
    y = 0;

  for (let cycle = 0; cycle < 4; cycle++) {
    for (const c of instructions) {
      if (c === "G") {
        x += dirs[dir][0];
        y += dirs[dir][1];
      } else if (c === "L") dir = (dir + 3) % 4;
      else dir = (dir + 1) % 4;
    }
  }
  return x === 0 && y === 0;
}

/**
 * Solution 2: One-cycle simulation with math theorem
 * Time: O(n) — simulate instructions exactly once
 * Space: O(1)
 */
function isRobotBounded(instructions: string): boolean {
  // 0=North 1=East 2=South 3=West
  const dx = [0, 1, 0, -1];
  const dy = [1, 0, -1, 0];
  let dir = 0,
    x = 0,
    y = 0;

  for (const c of instructions) {
    if (c === "G") {
      x += dx[dir];
      y += dy[dir];
    } else if (c === "L") {
      dir = (dir + 3) % 4; // turn left = +3 mod 4
    } else {
      dir = (dir + 1) % 4; // turn right
    }
  }

  // Bounded if back at origin OR not facing North
  return (x === 0 && y === 0) || dir !== 0;
}

// === Test Cases ===
console.log(isRobotBounded("GGLLGG")); // true  — returns to origin
console.log(isRobotBounded("GG")); // false — goes north forever
console.log(isRobotBounded("GL")); // true  — circles every 4 cycles
console.log(isRobotBounded("GLRG")); // true  — check with simulation
```

---

## 🔗 Related Problems

- [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation) — robot navigation with obstacles
- [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin) — check if robot returns home (simpler)
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — direction cycling pattern
- [Add Strings](https://leetcode.com/problems/add-strings) — same Math/Simulation category
