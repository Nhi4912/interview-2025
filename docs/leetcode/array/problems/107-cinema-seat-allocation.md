---
layout: page
title: "Cinema Seat Allocation"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Greedy, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/cinema-seat-allocation"
---

# Cinema Seat Allocation / Phân Bổ Ghế Rạp Chiếu Phim

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Bitmask
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Bạn quản lý rạp chiếu phim n hàng × 10 ghế (ghế 1 và 10 là cạnh tường). Mỗi nhóm 4 người cần ngồi liên tiếp không kề tường. Có 3 vị trí có thể: [2-5], [4-7], [6-9]. Dùng **bitmask** để biểu diễn ghế nào đã bị đặt trong hàng, rồi kiểm tra từng vị trí xem có trống không.

**Pattern Recognition:**

- Chỉ 3 lựa chọn hợp lệ cho nhóm 4: seats [2,3,4,5], [4,5,6,7], [6,7,8,9]
- Dùng bitmask (10 bit) cho ghế 1-10; bit i = 1 nếu ghế i+1 đã đặt
- Hàng không có ai đặt → tối đa 2 nhóm (left + right); hàng có đặt → dùng bitmask check

**Visual:**

```
Row seats: 1  2  3  4  5  6  7  8  9  10
           |  [L  L  L  L][M  M  M  M][R  R] (can't use seat 1,10 for aisle)

3 candidate groups (0-indexed bits 1-8 for seats 2-9):
  Left:   bits 1,2,3,4 → mask 0b0000011110 = 0x1E = 30
  Middle: bits 3,4,5,6 → mask 0b0001111000 = 0x78 = 120
  Right:  bits 5,6,7,8 → mask 0b0111100000 = 0x1E0 = 480

Row reserved=[1,3,1,9]: reserved bitmask = bit0|bit2|bit0|bit8 = ...
Check Left=(reservedMask & 30)==0 → can seat there
```

## Problem Description

A cinema has `n` rows, each with 10 seats labeled 1-10. Seats 1 and 10 are next to the aisle. Given `reservedSeats`, allocate seats for as many groups of 4 as possible (4 consecutive non-aisle seats per group). Return the maximum number of 4-person groups that can be seated.

**Example 1:** `n=3, reservedSeats=[[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]` → `4`

**Example 2:** `n=2, reservedSeats=[[2,1],[1,8]]` → `2`

**Constraints:** `1 <= n <= 10^9`, `1 <= reservedSeats.length <= min(10n, 10^4)`, `1 <= reservedSeats[i][0] <= n`, `1 <= reservedSeats[i][1] <= 10`.

## 📝 Interview Tips

1. **Clarify**: n có thể lên đến 10^9 — use hash map for only rows with reservations, not array.
2. **Approach**: Group reservations by row; for unreserved rows, always fit 2 groups.
3. **Edge cases**: Row fully booked → 0 groups; no reservations at all → 2\*n groups.
4. **Optimize**: Only iterate over rows with reservations; O(R) where R = reservedSeats.length.
5. **Test**: Row with only seat 5 reserved → can fit left [2-5]? No (5 blocked). Right [6-9]? Yes. Middle? No.
6. **Follow-up**: Groups of 3 instead of 4? — Different candidate positions, same bitmask approach.

## Solutions

```typescript
/** Solution 1: Bitmask per row — check 3 candidate groups
 * Time: O(R) | Space: O(R) where R = reservedSeats.length
 */
function maxNumberOfFamilies(n: number, reservedSeats: number[][]): number {
  // Bitmasks for the 3 possible 4-seat groups (seats 2-9, 0-indexed as bits 1-8)
  const LEFT = 0b0000011110; // seats 2,3,4,5
  const MIDDLE = 0b0001111000; // seats 4,5,6,7
  const RIGHT = 0b0111100000; // seats 6,7,8,9

  // Build reservation bitmask per row (only for rows with reservations)
  const rowMask = new Map<number, number>();
  for (const [row, seat] of reservedSeats) {
    rowMask.set(row, (rowMask.get(row) ?? 0) | (1 << seat));
  }

  // Rows with no reservations: always fits 2 groups (left + right)
  let result = 2 * (n - rowMask.size);

  // Rows with reservations: check each candidate
  for (const mask of rowMask.values()) {
    let seated = 0;
    if ((mask & LEFT) === 0 && (mask & RIGHT) === 0) {
      seated = 2; // Both left and right are free
    } else if ((mask & LEFT) === 0 || (mask & MIDDLE) === 0 || (mask & RIGHT) === 0) {
      seated = 1; // At least one group fits
    }
    result += seated;
  }
  return result;
}

/** Solution 2: Explicit check with helper — more readable for interview
 * Time: O(R) | Space: O(R)
 */
function maxNumberOfFamilies2(n: number, reservedSeats: number[][]): number {
  const reserved = new Map<number, Set<number>>();
  for (const [r, s] of reservedSeats) {
    if (!reserved.has(r)) reserved.set(r, new Set());
    reserved.get(r)!.add(s);
  }

  const canPlace = (seats: Set<number>, cols: number[]): boolean =>
    cols.every((c) => !seats.has(c));

  let total = 2 * (n - reserved.size); // unreserved rows
  for (const seats of reserved.values()) {
    const leftFree = canPlace(seats, [2, 3, 4, 5]);
    const rightFree = canPlace(seats, [6, 7, 8, 9]);
    const middleFree = canPlace(seats, [4, 5, 6, 7]);

    if (leftFree && rightFree) total += 2;
    else if (leftFree || middleFree || rightFree) total += 1;
  }
  return total;
}

// Test cases
console.log(
  maxNumberOfFamilies(3, [
    [1, 2],
    [1, 3],
    [1, 8],
    [2, 6],
    [3, 1],
    [3, 10],
  ]),
); // 4
console.log(
  maxNumberOfFamilies(2, [
    [2, 1],
    [1, 8],
  ]),
); // 2
console.log(maxNumberOfFamilies(1, [])); // 2
console.log(
  maxNumberOfFamilies2(3, [
    [1, 2],
    [1, 3],
    [1, 8],
    [2, 6],
    [3, 1],
    [3, 10],
  ]),
); // 4
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship                                 |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| [Seat Reservation Manager](https://leetcode.com/problems/seat-reservation-manager)               | Dynamic seat allocation using priority queue |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)                               | Bitmask operations for counting              |
| [Maximum Product of Word Lengths](https://leetcode.com/problems/maximum-product-of-word-lengths) | Bitmask encoding to check overlap            |
