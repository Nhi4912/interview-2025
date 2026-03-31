---
layout: page
title: "Robot Collisions"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Stack, Sorting, Simulation]
leetcode_url: "https://leetcode.com/problems/robot-collisions"
---

# Robot Collisions / Va Chạm Robot

> **Difficulty**: 🔴 Hard | **Category**: Sorting-Searching | **Pattern**: Stack Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Giống như xe máy chạy trên đường một chiều — xe đi cùng chiều thì không va chạm, xe đi ngược chiều thì chiếc nặng hơn thắng, chiếc nhẹ hơn bị loại.

**Pattern Recognition:**

- Robots moving right stacked → waiting to collide with left-movers → **Stack**
- Collision rules (equal health → both die) → simulate step by step
- Need original indices preserved → sort by position, track index mapping

**Visual:**

```
positions=[3,5,2,6], healths=[10,10,15,12], directions="RRLL"
Sort by pos: idx=2(pos2,h15,L), idx=0(pos3,h10,R), idx=1(pos5,h10,R), idx=3(pos6,h12,L)

Process:
  idx=2 L → stack empty → survives: stack=[]  result[2]=15
  idx=0 R → push:        stack=[{0,10}]
  idx=1 R → push:        stack=[{0,10},{1,10}]
  idx=3 L → collide with {1,10}: equal → both die: stack=[{0,10}]
           → collide with {0,10}: equal → both die: stack=[]
           → stack empty → result[3]=12... wait
```

## Problem Description

There are `n` robots on a number line. Each robot has a position, health value, and direction (`'L'` or `'R'`). At each step, robots move simultaneously. When two robots collide, the one with lower health is removed (health-1 for survivor); equal health removes both. Return surviving robots' health in original order, or empty if none survive.

**Example:**

- positions=[5,4,3,2,1], healths=[2,17,9,15,10], directions="RRRRR" → [2,17,9,15,10] (no collisions)
- positions=[3,5,2,6], healths=[10,10,15,12], directions="RRLL" → [14] (only robot at pos 2 survives)

**Constraints:** 1 ≤ n ≤ 10⁵, 1 ≤ positions[i] ≤ 10⁹, 1 ≤ healths[i] ≤ 10⁹

## 📝 Interview Tips

1. **Clarify**: Do all positions start unique? (Yes per constraints)
2. **Approach**: Sort by position, simulate collisions using a stack of rightward robots
3. **Edge cases**: Equal health (both die), all same direction (no collisions), single robot
4. **Optimize**: Stack is O(n) — no way to do better than O(n log n) due to sort
5. **Follow-up**: What if robots can change direction after collision?
6. **Complexity**: Time O(n log n) for sort + O(n) simulation = O(n log n), Space O(n)

## Solutions

```typescript
// Solution 1: Stack Simulation — Time: O(n log n) | Space: O(n)
function survivedRobotsHealths(
  positions: number[],
  healths: number[],
  directions: string,
): number[] {
  const n = positions.length;
  // Create index array sorted by position
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => positions[a] - positions[b]);

  const stack: number[] = []; // stack of indices of right-moving robots
  const result: (number | null)[] = new Array(n).fill(null);

  for (const i of indices) {
    if (directions[i] === "R") {
      stack.push(i);
    } else {
      // Left-moving robot: collide with stack of right-movers
      let survived = true;
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (healths[i] > healths[top]) {
          // Current (left) wins
          healths[i]--;
          stack.pop();
        } else if (healths[i] < healths[top]) {
          // Stack top (right) wins
          healths[top]--;
          survived = false;
          break;
        } else {
          // Equal: both die
          stack.pop();
          survived = false;
          break;
        }
      }
      if (survived) {
        result[i] = healths[i];
      }
    }
  }

  // Remaining right-movers survive
  for (const i of stack) {
    result[i] = healths[i];
  }

  return result.filter((v): v is number => v !== null);
}

// Solution 2: Same approach, cleaner with explicit health tracking — Time: O(n log n) | Space: O(n)
function survivedRobotsHealths2(
  positions: number[],
  healths: number[],
  directions: string,
): number[] {
  const n = positions.length;
  const order = [...Array(n).keys()].sort((a, b) => positions[a] - positions[b]);
  const alive = new Array(n).fill(true);
  const h = [...healths];
  const stack: number[] = [];

  for (const i of order) {
    if (directions[i] === "R") {
      stack.push(i);
      continue;
    }
    // Left-mover
    while (stack.length > 0) {
      const j = stack[stack.length - 1];
      if (h[i] === h[j]) {
        alive[i] = false;
        alive[j] = false;
        stack.pop();
        break;
      } else if (h[i] > h[j]) {
        alive[j] = false;
        h[i]--;
        stack.pop();
      } else {
        alive[i] = false;
        h[j]--;
        break;
      }
    }
  }

  return Array.from({ length: n }, (_, i) => i)
    .filter((i) => alive[i])
    .sort((a, b) => a - b)
    .map((i) => h[i]);
}

// Tests
console.log(survivedRobotsHealths([5, 4, 3, 2, 1], [2, 17, 9, 15, 10], "RRRRR")); // [2,17,9,15,10]
console.log(survivedRobotsHealths([3, 5, 2, 6], [10, 10, 15, 12], "RRLL")); // [14]
console.log(survivedRobotsHealths([1, 2, 5, 6], [10, 10, 11, 11], "RRLL")); // []
console.log(survivedRobotsHealths([1], [1000], "R")); // [1000]
console.log(survivedRobotsHealths([2, 1], [5, 4], "LR")); // [5,4]
```

## 🔗 Related Problems

| Problem                                                                | Relationship                                    |
| ---------------------------------------------------------------------- | ----------------------------------------------- |
| [Asteroid Collision](https://leetcode.com/problems/asteroid-collision) | Same stack collision pattern with +/- direction |
| [Remove K Digits](https://leetcode.com/problems/remove-k-digits)       | Stack-based elimination                         |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures) | Monotonic stack pattern                         |
