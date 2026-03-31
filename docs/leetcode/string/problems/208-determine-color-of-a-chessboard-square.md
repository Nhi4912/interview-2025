---
layout: page
title: "Determine Color of a Chessboard Square"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/determine-color-of-a-chessboard-square"
---

# Determine Color of a Chessboard Square / Xác Định Màu Ô Cờ Vua

🟢 Easy

## 🧠 Intuition

> **Phép so sánh:** Bàn cờ vua như bảng ô vuông 8×8 — màu ô phụ thuộc vào tính chẵn/lẻ của tọa độ. Nếu cột + hàng chẵn → một màu; lẻ → màu kia.

```
Chessboard coloring:
  a1=white, b1=black, c1=white, d1=black,...
  a2=black, b2=white, c2=black,...

  col index (a=1,b=2,...) + row index
  If (col + row) is even → white
  If (col + row) is odd  → black

"a1": col=1, row=1 → 1+1=2 (even) → white ✓
"h3": col=8, row=3 → 8+3=11 (odd) → black ✓
"c7": col=3, row=7 → 3+7=10 (even) → white ✓
```

## Problem Description

Given a chess board coordinate string `coordinates` (format: letter + digit, e.g., `"a1"`), return `true` if the square is white, `false` if black.

**Example 1:** `"a1"` → `false` (black)

**Example 2:** `"h3"` → `true` (white)

**Example 3:** `"c7"` → `true` (white)

**Constraints:** `coordinates.length == 2`, `'a' <= coordinates[0] <= 'h'`, `'1' <= coordinates[1] <= '8'`

## 📝 Interview Tips

- **Key insight:** Chessboard has alternating colors → parity of (column + row) determines color
- **Map letter to number:** `'a'=1,'b'=2,...,'h'=8` using `charCodeAt(0) - 96`
- **Parity check:** `(col + row) % 2 !== 0` → white (or vice versa depending on convention)
- **XOR trick:** `(col % 2) !== (row % 2)` is equivalent and avoids addition overflow
- **One-liner:** `(coordinates.charCodeAt(0) + coordinates.charCodeAt(1)) % 2 !== 0`
- **Complexity:** O(1) time, O(1) space — pure arithmetic on 2 characters

## Solutions

### Solution 1: Parity check — O(1) time, O(1) space

```typescript
function squareIsWhite(coordinates: string): boolean {
  const col = coordinates.charCodeAt(0) - 96; // 'a'=1, 'b'=2, ..., 'h'=8
  const row = parseInt(coordinates[1]);
  // White if (col + row) is odd
  return (col + row) % 2 !== 0;
}
```

### Solution 2: Direct char code sum — O(1) time, O(1) space

```typescript
function squareIsWhite(coordinates: string): boolean {
  // Both chars contribute parity: letter code + digit code
  // Sum is odd iff exactly one of them is odd → white square
  return (coordinates.charCodeAt(0) + coordinates.charCodeAt(1)) % 2 !== 0;
}
```

### Solution 3: XOR parity — O(1) time, O(1) space

```typescript
function squareIsWhite(coordinates: string): boolean {
  const colIsOdd = (coordinates.charCodeAt(0) - 96) % 2 === 1;
  const rowIsOdd = parseInt(coordinates[1]) % 2 === 1;
  // White if exactly one of col, row is odd (XOR)
  return colIsOdd !== rowIsOdd;
}
```

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Tags               |
| ---- | -------------------------------------- | ---------- | ------------------ |
| 884  | Uncommon Words from Two Sentences      | Easy       | String, Hash Table |
| 1275 | Find Winner on Tic Tac Toe Game        | Easy       | Array, Matrix      |
| 1812 | Determine Color of a Chessboard Square | Easy       | Math, String       |
| 2079 | Watering Plants                        | Easy       | Array              |
