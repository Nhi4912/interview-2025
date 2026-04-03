---
layout: page
title: "Car Fleet"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Stack, Sorting, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/car-fleet"
---

# Car Fleet / Đoàn Xe

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray) | [The Number of Weak Characters in the Game](https://leetcode.com/problems/the-number-of-weak-characters-in-the-game)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đoàn xe trên cao tốc — nếu xe phía sau đến đích trước (hoặc cùng lúc) xe phía trước, nó sẽ bị chặn lại, nhập vào đoàn. Xe chậm hơn = không thể vượt = tạo đoàn mới.

**Pattern Recognition:**

- Signal: "cars catch up to car ahead" + "cannot pass" → **Sort + Monotonic Stack**
- Sort xe theo vị trí (gần đích nhất trước), tính thời gian tới đích
- Key insight: nếu xe sau đến đích nhanh hơn xe trước, chúng tạo thành 1 fleet

**Visual — target=12, pos=[10,8,0,5,3], speed=[2,4,1,1,3]:**

```
Sorted by pos desc: pos=[10,8,5,3,0], speed=[2,4,1,3,1]
Time to target:       [1, 1, 7, 3, 12]

Stack (arrival times, monotone increasing from bottom):
  Push 1.0:  stack=[1.0]
  Push 1.0:  1.0 ≤ 1.0 (stack top) → same fleet, skip
             stack=[1.0]
  Push 7.0:  7.0 > 1.0 → new fleet
             stack=[1.0, 7.0]
  Push 3.0:  3.0 ≤ 7.0 → caught up, skip
             stack=[1.0, 7.0]
  Push 12.0: 12.0 > 7.0 → new fleet
             stack=[1.0, 7.0, 12.0]

Answer = stack.length = 3 ✅
```

---

## Problem Description

Có `n` xe trên đường 1 chiều hướng về `target`. Cho `position[i]` và `speed[i]`. Xe không thể vượt nhau — nếu xe sau bắt kịp xe trước, chúng thành 1 **fleet** đi cùng tốc độ xe trước. Đếm số fleet đến đích. ([LeetCode](https://leetcode.com/problems/car-fleet))

Difficulty: Medium | Acceptance: 53.5%

- `target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]` → `3`
- `target=10, position=[3], speed=[3]` → `1`
- `target=100, position=[0,2,4], speed=[4,2,1]` → `1`

Constraints: `1 <= target <= 10^6`, `0 <= position[i] < target`, `1 <= speed[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể có nhiều xe cùng vị trí không?" / Can two cars start at same position?
2. **Key insight**: "Sort theo vị trí giảm dần (gần đích nhất trước)" / Sort farthest-right car first
3. **Fleet rule**: "Xe sau đến đích trước (hoặc bằng) xe trước → nhập fleet, không tạo fleet mới" / Catch-up means merge
4. **Stack trick**: "Stack đếm số fleet — push khi xe sau ĐẾN MUỘN HƠN xe trước" / Stack grows only when new fleet forms
5. **Edge cases**: "1 xe → 1 fleet; tất cả xe cùng tốc độ → n fleets nếu đứng riêng" / Single car, equal speeds
6. **Follow-up**: "Tìm vị trí gặp nhau thay vì đếm fleet?" / Find the meeting point

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Stack (Monotonic on arrival time)
 * Time: O(n log n) — sorting
 * Space: O(n) — stack storage
 */
function carFleet(target: number, position: number[], speed: number[]): number {
  const n = position.length;
  // Pair positions with speeds, sort by position descending (closest to target first)
  const cars = position
    .map((p, i) => [p, speed[i]] as [number, number])
    .sort((a, b) => b[0] - a[0]);

  const stack: number[] = []; // arrival times, monotone increasing
  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    // If this car arrives after (slower than) the car ahead, it's a new fleet
    if (stack.length === 0 || time > stack[stack.length - 1]) {
      stack.push(time);
    }
    // else: this car catches the fleet ahead — no new fleet
  }
  return stack.length;
}

/**
 * Solution 2: Sort + Counter (no explicit stack)
 * Time: O(n log n) — same complexity, slightly less memory
 * Space: O(n) — the sorted array
 */
function carFleetCounter(target: number, position: number[], speed: number[]): number {
  const cars = position
    .map((p, i) => [p, speed[i]] as [number, number])
    .sort((a, b) => b[0] - a[0]);

  let fleets = 0;
  let maxTime = 0; // slowest time seen so far from cars ahead
  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (time > maxTime) {
      fleets++;
      maxTime = time; // this car sets new "slow" pace
    }
  }
  return fleets;
}

// === Test Cases ===
console.log(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3])); // 3
console.log(carFleet(10, [3], [3])); // 1
console.log(carFleet(100, [0, 2, 4], [4, 2, 1])); // 1
console.log(carFleetCounter(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3])); // 3
```

---

## 🔗 Related Problems

- [Car Fleet II](https://leetcode.com/problems/car-fleet-ii) — harder version: find when each car joins a fleet
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — monotonic stack classic
- [Max Chunks To Make Sorted](https://leetcode.com/problems/max-chunks-to-make-sorted) — chunk counting via prefix max
- [The Number of Weak Characters in the Game](https://leetcode.com/problems/the-number-of-weak-characters-in-the-game) — sort + monotonic
- [Car Fleet — LeetCode](https://leetcode.com/problems/car-fleet) — problem page
