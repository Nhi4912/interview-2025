---
layout: page
title: "Robot Return to Origin"
difficulty: Easy
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/robot-return-to-origin"
---

# Robot Return to Origin / Robot Trở Về Gốc

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simulation / Counter
> **Frequency**: 📘 Tier 2 — Gặp ở 4 companies
> **See also**: [Path Crossing](https://leetcode.com/problems/path-crossing) | [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng một robot giao hàng trong kho hàng dạng lưới ô vuông. Robot nhận lệnh di chuyển dạng chuỗi ký tự: `U` (lên), `D` (xuống), `L` (trái), `R` (phải). Sau khi thực hiện hết lệnh, người quản lý hỏi: "Robot có trở về điểm xuất phát không?" Đây không cần mô phỏng từng bước — chỉ cần đếm: `U` và `D` phải bằng nhau (dọc cân bằng), `L` và `R` phải bằng nhau (ngang cân bằng). Nếu cả hai cặp cân bằng, robot ắt đứng đúng chỗ ban đầu.

## Visual (Minh họa trực quan)

```
moves = "UDLR"
Start (0,0):
  U → (0, 1)
  D → (0, 0)
  L → (-1, 0)
  R → (0, 0)   ← back to origin  ✓

moves = "LLRR"  → x: -1-1+1+1=0, y: 0  → (0,0) ✓

moves = "UUDDLR"
  x: L+R = -1+1 = 0  ✓
  y: UU+DD = 2-2 = 0 ✓  → back to origin ✓

moves = "UUUU"
  y = 4 ≠ 0  → NOT at origin ✗

Counter approach:
  Count U=count D AND count L=count R  →  O(n), O(1)
```

## Problem (Bài toán)

Given string `moves` where each character is `'U'`, `'D'`, `'L'`, or `'R'`, return `true` if the robot returns to the origin `(0,0)` after executing all moves.

**Example 1:** `moves = "UD"` → `true` (up then down)
**Example 2:** `moves = "LL"` → `false` (moved left twice, not at origin)
**Example 3:** `moves = "UUDDLR"` → `true`

**Constraints:** `1 ≤ moves.length ≤ 2×10⁴`, `moves` only contains `'U'`, `'D'`, `'L'`, `'R'`

## Tips (Mẹo phỏng vấn)

- **Counter không cần tọa độ** / Counter beats coordinates: Chỉ cần đếm `U==D && L==R` — không cần lưu `x,y` nếu muốn space O(1)
- **Hoặc tọa độ đơn giản** / Coordinate is clearer: `x,y` tracking dễ đọc hơn và mở rộng tốt cho biến thể phức tạp hơn
- **Biến thể 3D** / 3D variant: Thêm `F/B` (forward/backward) → kiểm tra thêm `z=0`
- **Early exit** / Thoát sớm: Không thể thoát sớm hiệu quả (không biết tổng trước) — nhưng có thể dừng nếu phát hiện ra rõ
- **Không cần visited set** / No Set needed: Đây chỉ là về vị trí cuối, không phải đường đi — khác với "Path Crossing"
- **String vs char array** / String vs array: Dùng `for...of` trên string để tránh `.split('')`

## Solution 1 - Coordinate Tracking O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Track (x, y) position; check if returns to (0, 0)
 */
function judgeCircle(moves: string): boolean {
  let x = 0,
    y = 0;
  for (const m of moves) {
    if (m === "U") y++;
    else if (m === "D") y--;
    else if (m === "L") x--;
    else x++;
  }
  return x === 0 && y === 0;
}
```

## Solution 2 - Count-Based O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Just count each direction; balanced pairs = return to origin
 */
function judgeCircleCount(moves: string): boolean {
  let u = 0,
    d = 0,
    l = 0,
    r = 0;
  for (const m of moves) {
    if (m === "U") u++;
    else if (m === "D") d++;
    else if (m === "L") l++;
    else r++;
  }
  return u === d && l === r;
}
```

## Solution 3 - Frequency Map One-Liner

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Count all chars; compare pairs
 */
function judgeCircleOneLiner(moves: string): boolean {
  const freq: Record<string, number> = { U: 0, D: 0, L: 0, R: 0 };
  for (const m of moves) freq[m]++;
  return freq["U"] === freq["D"] && freq["L"] === freq["R"];
}

// Functional style
function judgeCircleFP(moves: string): boolean {
  const count = (c: string) => [...moves].filter((m) => m === c).length;
  return count("U") === count("D") && count("L") === count("R");
}
```

## Test Cases

```typescript
console.log(judgeCircle("UD")); // → true
console.log(judgeCircle("LL")); // → false
console.log(judgeCircle("UUDDLR")); // → true
console.log(judgeCircleCount("UD")); // → true
console.log(judgeCircleCount("LRLR")); // → true
console.log(judgeCircleOneLiner("UUUU")); // → false
console.log(judgeCircleFP("UDLR")); // → true
```

## Related Problems

| Problem                         | Difficulty | Link                                                                     |
| ------------------------------- | ---------- | ------------------------------------------------------------------------ |
| Path Crossing                   | Easy       | [LC 1496](https://leetcode.com/problems/path-crossing)                   |
| Walking Robot Simulation        | Medium     | [LC 874](https://leetcode.com/problems/walking-robot-simulation)         |
| Number of Laser Beams in a Bank | Medium     | [LC 2125](https://leetcode.com/problems/number-of-laser-beams-in-a-bank) |
