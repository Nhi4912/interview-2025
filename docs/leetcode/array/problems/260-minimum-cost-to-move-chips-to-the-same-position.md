---
layout: page
title: "Minimum Cost to Move Chips to The Same Position"
difficulty: Easy
category: Array
tags: [Array, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position"
---

# Minimum Cost to Move Chips / Chi Phí Tối Thiểu Để Gom Chip

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy / Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Moves to Equal Array Elements](https://leetcode.com/problems/minimum-moves-to-equal-array-elements) | [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng các chiếc xe trên một con đường số. Di chuyển 2 bước (cùng chẵn hoặc cùng lẻ) miễn phí — như đi qua làn đường song song. Nhưng đổi làn (từ chẵn sang lẻ hoặc ngược lại) tốn 1 đồng. Bài toán trở thành: gom tất cả xe về cùng một làn chẵn (tốn số xe ở làn lẻ đồng) hoặc làn lẻ (tốn số xe ở làn chẵn đồng). Chọn phương án rẻ hơn!

## Visual (Minh họa trực quan)

```
position = [1, 2, 3]

Vị trí chẵn: {2} → 1 chip
Vị trí lẻ:  {1, 3} → 2 chips

Phương án A: Gom tất cả về vị trí chẵn
  - Chip ở 1 (lẻ) → 2 (chẵn): cost = 1
  - Chip ở 3 (lẻ) → 2 (chẵn): cost = 1
  Total = 2

Phương án B: Gom tất cả về vị trí lẻ
  - Chip ở 2 (chẵn) → 1 (lẻ): cost = 1
  Total = 1  ← winner!

Answer = min(evenCount, oddCount) = min(1, 2) = 1 ✓
```

## Problem (Bài toán)

There are `n` chips on a number line. `position[i]` is the position of the `i`-th chip. Moving a chip **2 steps** costs `0`; moving **1 step** costs `1`. Return the **minimum cost** to move all chips to the same position.

**Example 1:** `position = [1,2,3]` → `1`
**Example 2:** `position = [2,2,2,3,3]` → `2`
**Example 3:** `position = [1,1000000000]` → `1`

**Constraints:** `1 ≤ n ≤ 100`, `1 ≤ position[i] ≤ 10^9`

## Tips (Mẹo phỏng vấn)

- **Key insight** / Nhận xét chính: Di chuyển 2 bước miễn phí → tất cả chip cùng tính chẵn/lẻ có thể gom lại không tốn gì
- **Reduce to parity** / Quy về tính chẵn lẻ: Chỉ cần biết bao nhiêu chip ở vị trí chẵn, bao nhiêu ở lẻ
- **Greedy choice** / Lựa chọn tham lam: Gom nhóm nhỏ hơn vào nhóm lớn hơn → tối ưu
- **Position values irrelevant** / Giá trị vị trí không quan trọng: 1 và 999999999 đều là "lẻ" — distance doesn't matter
- **Edge case** / Trường hợp đặc biệt: Tất cả cùng vị trí → 0; tất cả cùng tính chẵn/lẻ → 0
- **O(n) solution** / Giải pháp O(n): Chỉ một lần duyệt để đếm, không cần sort

## Solution 1 - Count Parity (Optimal O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Count chips at even vs odd positions; answer = min(even, odd)
 */
function minCostToMoveChips(position: number[]): number {
  let evenCount = 0,
    oddCount = 0;
  for (const pos of position) {
    if (pos % 2 === 0) evenCount++;
    else oddCount++;
  }
  return Math.min(evenCount, oddCount);
}
```

## Solution 2 - Simulation (Brute Force O(n·max_pos))

```typescript
/**
 * @complexity Time: O(n·max_pos) | Space: O(max_pos)
 * Simulate moving all chips to each possible position, find min cost
 */
function minCostToMoveChipsBrute(position: number[]): number {
  const maxPos = Math.max(...position);
  let minCost = Infinity;

  for (let target = 1; target <= maxPos; target++) {
    let cost = 0;
    for (const pos of position) {
      const diff = Math.abs(pos - target);
      cost += diff % 2; // even diff = 0 cost, odd diff = 1 cost
    }
    minCost = Math.min(minCost, cost);
  }
  return minCost;
}
```

## Solution 3 - Reduce (Functional O(n))

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * One-liner using reduce
 */
function minCostToMoveChipsFunctional(position: number[]): number {
  const odd = position.reduce((acc, p) => acc + (p % 2), 0);
  return Math.min(odd, position.length - odd);
}
```

## Test Cases

```typescript
console.log(minCostToMoveChips([1, 2, 3])); // → 1
console.log(minCostToMoveChips([2, 2, 2, 3, 3])); // → 2
console.log(minCostToMoveChips([1, 1000000000])); // → 1
console.log(minCostToMoveChips([1, 1, 1])); // → 0
console.log(minCostToMoveChipsBrute([1, 2, 3])); // → 1
```

## Related Problems

| Problem                                  | Difficulty | Link                                                                              |
| ---------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| Minimum Moves to Equal Array Elements    | Medium     | [LC 453](https://leetcode.com/problems/minimum-moves-to-equal-array-elements)     |
| Minimum Number of Moves to Seat Everyone | Easy       | [LC 2037](https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone) |
| Minimum Cost to Connect Sticks           | Medium     | [LC 1167](https://leetcode.com/problems/minimum-cost-to-connect-sticks)           |
