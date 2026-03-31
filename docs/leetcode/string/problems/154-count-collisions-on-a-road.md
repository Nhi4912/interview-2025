---
layout: page
title: "Count Collisions on a Road"
difficulty: Medium
category: String
tags: [String, Stack, Simulation]
leetcode_url: "https://leetcode.com/problems/count-collisions-on-a-road"
---

# Count Collisions on a Road / Đếm va chạm trên đường

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare) | [Design a Text Editor](https://leetcode.com/problems/design-a-text-editor)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống những chiếc xe trên đường một chiều — xe `L` (trái) ở đầu không bao giờ va chạm (thoát tự do), xe `R` (phải) ở cuối cũng vậy. Chỉ những xe bên trong mới va chạm. Mỗi ký tự không phải 'S' sau khi bỏ viền = 1 đơn vị va chạm.

```
directions = "RLRSLL"
Strip leading L's:  nothing (R is first)
Strip trailing R's: "RLRSL" (remove last nothing — last is L)

Actually:
Leading L's  = none   (first char is R)
Trailing R's = none   (last char is L)

Middle: "RLRSLL"
Non-S count: R,L,R,L,L = 5 collisions

Key insight: every car that is NOT already 'S' in the trimmed region
will eventually collide and stop.
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Trim free-movers / Bỏ xe chạy tự do**: Leading 'L's và trailing 'R's thoát không va chạm
- 🔑 **Remaining non-S = collisions / Còn lại không phải S = va chạm**: Mỗi xe L/R sẽ dừng lại
- 🔑 **O(n) greedy / O(n) tham lam**: Không cần mô phỏng từng bước
- 🔑 **Stack approach / Cách dùng stack**: Cũng đúng nhưng phức tạp hơn cần thiết
- 🔑 **'S' cars stay / Xe 'S' đứng yên**: Không đóng góp va chạm mới
- 🔑 **Count energy not events / Đếm năng lượng không phải sự kiện**: Mỗi xe L/R = 1 đơn vị

---

## Solutions

### Solution 1: Trim + Count (Optimal O(n))

```typescript
/**
 * Leading 'L's escape left (never collide), trailing 'R's escape right.
 * Every remaining non-'S' car will collide → count them.
 *
 * Time:  O(n)
 * Space: O(1)
 */
function countCollisions(directions: string): number {
  let l = 0;
  let r = directions.length - 1;

  // Skip leading 'L's — they escape leftward
  while (l <= r && directions[l] === "L") l++;
  // Skip trailing 'R's — they escape rightward
  while (r >= l && directions[r] === "R") r--;

  // Every non-'S' in [l, r] contributes to collisions
  let collisions = 0;
  for (let i = l; i <= r; i++) {
    if (directions[i] !== "S") collisions++;
  }

  return collisions;
}

console.log(countCollisions("RLRSLL")); // 5
console.log(countCollisions("LLRR")); // 0  (LL escape left, RR escape right — wait)
// "LLRR": L,L escape; R,R escape → 0
console.log(countCollisions("SSRSSRLLRSLLRSRSSRLRRRRLLRRLSSSS")); // 20
```

### Solution 2: Stack Simulation (Explicit)

```typescript
/**
 * Stack-based simulation: process each car, resolve collisions immediately.
 *
 * Time:  O(n)
 * Space: O(n) — stack
 */
function countCollisions2(directions: string): number {
  const stack: string[] = [];
  let collisions = 0;

  for (const d of directions) {
    if (d === "R") {
      stack.push("R");
    } else if (d === "S") {
      // All 'R's on stack crash into this stationary car
      while (stack.length && stack[stack.length - 1] === "R") {
        stack.pop();
        collisions++;
      }
      stack.push("S");
    } else {
      // d === "L"
      if (!stack.length || stack[stack.length - 1] === "L") {
        stack.push("L"); // escapes left
      } else if (stack[stack.length - 1] === "S") {
        collisions++; // L hits stationary
      } else {
        // top is "R" — R and L collide, both stop
        collisions += 2;
        stack.pop(); // remove the R
        // drain any remaining R's that now hit the resulting S
        while (stack.length && stack[stack.length - 1] === "R") {
          stack.pop();
          collisions++;
        }
        stack.push("S");
      }
    }
  }

  return collisions;
}

console.log(countCollisions2("RLRSLL")); // 5
console.log(countCollisions2("LLRR")); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                            | Difficulty | Pattern              |
| ---- | ------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| 844  | [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare)                                 | 🟢 Easy    | Stack / Two pointers |
| 735  | [Asteroid Collision](https://leetcode.com/problems/asteroid-collision)                                             | 🟡 Medium  | Stack simulation     |
| 2751 | [Robot Collisions](https://leetcode.com/problems/robot-collisions)                                                 | 🔴 Hard    | Stack simulation     |
| 1047 | [Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | 🟢 Easy    | Stack                |
