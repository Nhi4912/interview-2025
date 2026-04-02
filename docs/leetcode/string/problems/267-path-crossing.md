---
layout: page
title: "Path Crossing"
difficulty: Easy
category: String
tags: [Hash Table, String, Simulation]
leetcode_url: "https://leetcode.com/problems/path-crossing"
---

# Path Crossing / Đường Đi Cắt Nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simulation / Hash Set
> **Frequency**: 📘 Tier 2 — Gặp ở 5 companies
> **See also**: [Robot Return to Origin](https://leetcode.com/problems/robot-return-to-origin) | [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation)

---

## Vietnamese Analogy (Ví dụ thực tế)

Một vận động viên chạy bộ trên bản đồ thành phố dạng lưới, ghi lại từng bước đi (`N`, `S`, `E`, `W`). Câu hỏi: liệu đường chạy của anh có bao giờ đi qua một điểm mình đã từng ghé thăm không? Đây chính là bài toán phát hiện vòng lặp (crossing) trong đường đi. Giải pháp: lưu tập hợp các tọa độ đã thăm; sau mỗi bước, kiểm tra xem tọa độ mới có trong tập không. Khác với "Robot Return to Origin" — ở đây ta cần biết lịch sử toàn bộ hành trình, không chỉ vị trí cuối.

## Visual (Minh họa trực quan)

```
path = "NES"
  Start (0,0) → visited = {(0,0)}
  N: (0,1) → not visited → add
  E: (1,1) → not visited → add
  S: (1,0) → not visited → add
  Result: false (no crossing)

path = "NESWW"
  Start (0,0) → visited = {(0,0)}
  N: (0,1) → new
  E: (1,1) → new
  S: (1,0) → new
  W: (0,0) → ALREADY VISITED!  ✓ → true

path = "NNSWWEWSSSSA"  (invalid, only NSEW)
Coordinate key: "x,y" string for O(1) Set lookup
```

## Problem (Bài toán)

Given string `path` (characters: `'N'`, `'S'`, `'E'`, `'W'`), return `true` if the path **crosses itself** (visits any coordinate more than once), including the starting point `(0,0)`.

**Example 1:** `path = "NES"` → `false`
**Example 2:** `path = "NESWW"` → `true` (returns to (0,0))
**Example 3:** `path = "NESW"` → `true` (forms a square, returns to origin)

**Constraints:** `1 ≤ path.length ≤ 10⁴`, `path[i] ∈ {'N', 'S', 'E', 'W'}`

## Tips (Mẹo phỏng vấn)

- **Include start in visited** / Gồm điểm xuất phát: Khởi tạo visited với `"0,0"` — đường đi quay lại origin cũng là crossing
- **String key cho Set** / String key for Set: `"${x},${y}"` là cách đơn giản nhất; JavaScript Set so sánh string by value
- **Early return** / Thoát sớm: Dừng ngay khi tìm thấy crossing đầu tiên — không cần duyệt hết
- **Coordinate encoding** / Mã hóa tọa độ: Dùng `x * 20001 + y` (với offset) để map sang số nếu muốn tối ưu bộ nhớ
- **Khác Robot Return** / Different from Robot Return: Robot Return chỉ cần vị trí cuối; Path Crossing cần toàn bộ lịch sử
- **Direction map** / Bảng hướng: Object `{N:[0,1], S:[0,-1], E:[1,0], W:[-1,0]}` dễ đọc và mở rộng

## Solution 1 - String Key Set O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Store visited positions as "x,y" strings in a Set
 */
function isPathCrossing(path: string): boolean {
  let x = 0,
    y = 0;
  const visited = new Set<string>();
  visited.add("0,0");
  for (const d of path) {
    if (d === "N") y++;
    else if (d === "S") y--;
    else if (d === "E") x++;
    else x--;
    const key = `${x},${y}`;
    if (visited.has(key)) return true;
    visited.add(key);
  }
  return false;
}
```

## Solution 2 - Direction Map O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Use direction map for cleaner code; same logic
 */
function isPathCrossingMap(path: string): boolean {
  const dir: Record<string, [number, number]> = {
    N: [0, 1],
    S: [0, -1],
    E: [1, 0],
    W: [-1, 0],
  };
  let x = 0,
    y = 0;
  const visited = new Set<string>(["0,0"]);
  for (const d of path) {
    const [dx, dy] = dir[d];
    x += dx;
    y += dy;
    const key = `${x},${y}`;
    if (visited.has(key)) return true;
    visited.add(key);
  }
  return false;
}
```

## Solution 3 - Numeric Hash Key O(n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Encode (x,y) as a single number to avoid string allocation.
 * Coordinates bounded by path.length ≤ 10^4, offset by 10001
 */
function isPathCrossingNumeric(path: string): boolean {
  const OFFSET = 10001;
  const STRIDE = 20003;
  let x = 0,
    y = 0;
  const visited = new Set<number>();
  visited.add(OFFSET * STRIDE + OFFSET);
  for (const d of path) {
    if (d === "N") y++;
    else if (d === "S") y--;
    else if (d === "E") x++;
    else x--;
    const key = (x + OFFSET) * STRIDE + (y + OFFSET);
    if (visited.has(key)) return true;
    visited.add(key);
  }
  return false;
}
```

## Test Cases

```typescript
console.log(isPathCrossing("NES")); // → false
console.log(isPathCrossing("NESWW")); // → true
console.log(isPathCrossing("NESW")); // → true (full square)
console.log(isPathCrossingMap("NES")); // → false
console.log(isPathCrossingNumeric("NESWW")); // → true
console.log(isPathCrossing("N")); // → false
console.log(isPathCrossing("NN")); // → false
```

## Related Problems

| Problem                  | Difficulty | Link                                                             |
| ------------------------ | ---------- | ---------------------------------------------------------------- |
| Robot Return to Origin   | Easy       | [LC 657](https://leetcode.com/problems/robot-return-to-origin)   |
| Walking Robot Simulation | Medium     | [LC 874](https://leetcode.com/problems/walking-robot-simulation) |
| Spiral Matrix            | Medium     | [LC 54](https://leetcode.com/problems/spiral-matrix)             |
