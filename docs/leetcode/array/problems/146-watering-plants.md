---
layout: page
title: "Watering Plants"
difficulty: Medium
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/watering-plants"
---

# Watering Plants / Tưới Cây

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Simulation / Greedy

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Mô phỏng hành trình tưới cây. Bắt đầu tại vòi nước (vị trí -1), đi theo thứ tự cây từ trái sang phải. Nếu bình đang có đủ nước thì tưới và đi tiếp (+1 bước). Nếu không đủ: quay về vòi (i bước ngược), nạp đầy, rồi đi lại đến cây (i+1 bước tới).

**EN:** Simulate the watering journey. Start at the river (position -1), visit plants left to right. If enough water: water and step forward (+1 step). If not: go back to river (i steps), refill, walk forward again (i+1 steps).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Watering Plants example:**

```
plants=[2,2,3,3], capacity=5
Start at pos=-1, water=5

Plant 0 (need 2): water=5≥2 → water it, steps+=1, pos=0, water=3
Plant 1 (need 2): water=3≥2 → water it, steps+=1, pos=1, water=1
Plant 2 (need 3): water=1<3 → go back: steps+=2, refill water=5
                            → go forward: steps+=3, water it, pos=2, water=2
Plant 3 (need 3): water=2<3 → go back: steps+=3, refill water=5
                            → go forward: steps+=4, water it, pos=3, water=2
Total steps = 1+1+2+3+3+4 = 14
```

---

---

## Problem Description

| #    | Problem            | Difficulty | Pattern                  |
| ---- | ------------------ | ---------- | ------------------------ |
| 2079 | Watering Plants    | 🟢 Easy    | Simulation (single trip) |
| 2105 | Watering Plants II | 🟡 Medium  | Two Pointers             |
| 1598 | Crawler Log Folder | 🟢 Easy    | Simulation / Stack       |

---

## 📝 Interview Tips

- 🟡 **EN:** Key insight: when refilling, you walk back i steps to river (position 0) and i+1 steps forward to plant i.
  **VI:** Điểm mấu chốt: khi nạp đầy, đi ngược i bước về vòi (pos 0) và i+1 bước tới cây i.
- 🟡 **EN:** No need to track actual position if you process plants left to right.
  **VI:** Không cần theo dõi vị trí thực nếu xử lý cây từ trái sang phải.
- 🟡 **EN:** For plant at index i: refill cost = 2*i + 1 (go back i steps + forward i+1 steps).
  **VI:** Chi phí nạp đầy cho cây i: 2*i + 1 bước (i lui + i+1 tới).
- 🟡 **EN:** Without refill: just +1 step for each plant (total n steps baseline).
  **VI:** Không nạp đầy: chỉ +1 bước mỗi cây (tổng n bước cơ bản).
- 🟡 **EN:** Time O(n), Space O(1) — single pass simulation.
  **VI:** Thời gian O(n), Không gian O(1) — mô phỏng một lượt.
- 🟡 **EN:** Edge case: plant[0] needs more than capacity — impossible per constraints (plants[i] ≤ capacity).
  **VI:** Edge case: plants[i] ≤ capacity được đảm bảo bởi constraints.

---

---

## Solutions

```typescript
function wateringPlants(plants: number[], capacity: number): number {
  let steps = 0;
  let water = capacity;
  let pos = -1; // Start at river (position -1, river is at 0 conceptually)

  for (let i = 0; i < plants.length; i++) {
    if (water >= plants[i]) {
      // Enough water: just step forward
      steps++;
      water -= plants[i];
      pos = i;
    } else {
      // Not enough: walk back to river, refill, walk to plant
      steps += i - pos; // go back: current pos is i-1, river at -1 → i steps
      // Actually: pos is currently i-1 after last step, river at -1: distance = i
      // Then walk from river (-1) to plant i: i+1 steps
      // Total = i + (i+1) = 2i+1 steps added
      steps += i + 1; // go forward from river to plant i (i+1 steps)
      water = capacity - plants[i];
      pos = i;
    }
  }
  return steps;
}

// Test cases
console.log(wateringPlants([2, 2, 3, 3], 5)); // Expected: 14
console.log(wateringPlants([1, 1, 1, 4, 2, 3], 4)); // Expected: 30
console.log(wateringPlants([7, 7, 7, 7, 7, 7, 7], 8)); // Expected: 49

function wateringPlants_v2(plants: number[], capacity: number): number {
  let steps = 0;
  let water = capacity;

  for (let i = 0; i < plants.length; i++) {
    if (water < plants[i]) {
      // Refill: go back to river and return
      // From plant i-1 (current) to river: i steps
      // From river to plant i: i+1 steps
      steps += 2 * i + 1;
      water = capacity;
    } else {
      // Just move forward one step
      steps += 1;
    }
    water -= plants[i];
  }
  return steps;
}

// Test cases
console.log(wateringPlants_v2([2, 2, 3, 3], 5)); // Expected: 14
console.log(wateringPlants_v2([1, 1, 1, 4, 2, 3], 4)); // Expected: 30
console.log(wateringPlants_v2([7, 7, 7, 7, 7, 7, 7], 8)); // Expected: 49
console.log(wateringPlants_v2([1], 1)); // Expected: 1
```

---

## 🔗 Related Problems

| #    | Problem            | Difficulty | Pattern                  |
| ---- | ------------------ | ---------- | ------------------------ |
| 2079 | Watering Plants    | 🟢 Easy    | Simulation (single trip) |
| 2105 | Watering Plants II | 🟡 Medium  | Two Pointers             |
| 1598 | Crawler Log Folder | 🟢 Easy    | Simulation / Stack       |
