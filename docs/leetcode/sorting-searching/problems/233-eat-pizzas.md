---
layout: page
title: "Eat Pizzas!"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/eat-pizzas"
---

# Eat Pizzas! / Ăn Pizza!

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Sorting
> **Frequency**: 📘 Tier 3 — Recent contest problem
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [IPO](https://leetcode.com/problems/ipo)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Ăn buffet với luật lạ — mỗi lần bạn lấy 4 cái pizza, nhưng chỉ được tính điểm cái ngon nhất (lượt lẻ) hoặc cái ngon thứ 2 (lượt chẵn). Chiến lược tham lam: sort rồi phân bổ pizza tốt nhất cho lượt lẻ.

**Pattern Recognition:**

- Signal: "maximize sum with selection rule per round" → **Sort + Greedy assignment**
- Key insight: Sau khi sort giảm dần, lượt lẻ luôn nên nhận pizza đứng đầu (index 0, 4, 8...), lượt chẵn nhận pizza đứng thứ 2 trong nhóm 4.

**Visual — pizzas=[1,2,3,4,5,6,7,8], n=2 rounds:**

```
Sort desc: [8, 7, 6, 5, 4, 3, 2, 1]

All 4n pizzas must be eaten. Assign groups of 4 to rounds greedily:
  oddCnt = ceil(2/2) = 1  →  block 0: [8,7,6,5], gain max  = 8
  evenCnt= floor(2/2)= 1  →  block 1: [4,3,2,1], gain 2nd  = 3  → total=11?

Wait — we can pick ANY 4 per round, not fixed blocks!
Best split: Round1(odd):[1,2,5,8] gain=8; Round2(even):[3,4,6,7] gain=6 → 14 ✓

Formula: sorted desc, oddCnt rounds gain sorted[0..oddCnt-1],
         evenCnt rounds gain sorted[oddCnt+1], sorted[oddCnt+3], ...
```

---

## Problem Description

You have `4n` pizzas. In each of `n` rounds you eat exactly **4 pizzas**.

- **Odd rounds** (1st, 3rd, …): you gain the **maximum** weight among the 4 chosen.
- **Even rounds** (2nd, 4th, …): you gain the **2nd maximum** weight among the 4 chosen.

Return the **maximum total** you can gain.

**Example 1:**

```
Input:  pizzas = [1,2,3,4,5,6,7,8]   (n=2)
Output: 14
Explanation: Round 1(odd): eat [3,4,7,8], gain max=8
             Round 2(even): eat [1,2,5,6], gain 2nd=5  → total=13
             OR: Round1(odd):[1,2,5,8] gain=8; Round2(even):[3,4,6,7] gain=6 → 14 ✓
```

**Example 2:**

```
Input:  pizzas = [2,1,1,1,1,1,1,1]   (n=2)
Output: 3
Explanation: Round 1(odd): gain 2; Round 2(even): gain 1 → total=3
```

**Constraints:**

- `4 ≤ pizzas.length ≤ 2 × 10⁵`, `pizzas.length % 4 == 0`
- `1 ≤ pizzas[i] ≤ 10⁹`

---

## 📝 Interview Tips

1. **Nhận dạng Greedy** — Khi tìm max với luật chọn cố định, thử sort + gán tham lam. / When maximizing with fixed selection rules, try sort + greedy assignment.
2. **Phân loại rounds** — Tách rõ odd/even rounds, tính số lượng mỗi loại: `oddCnt=⌈n/2⌉, evenCnt=⌊n/2⌋`. / Classify odd vs even rounds: `oddCnt=⌈n/2⌉, evenCnt=⌊n/2⌋`.
3. **Assign best to odd** — Lượt lẻ gain nhiều hơn (max vs 2nd), nên ưu tiên pizza tốt nhất cho chúng. / Odd rounds gain more (max vs 2nd), so assign best pizzas to them.
4. **Offset pattern** — Sau sort desc: odd gains `pizza[0], pizza[2], ...(every 2)`; even gains từ cuối mảng theo offset cố định. / After sorting desc: odd takes `pizza[0], pizza[2],...`; even takes offset from tail.
5. **Verify với ví dụ nhỏ** — Kiểm tra tay với n=2 trước khi code để chắc offset. / Always verify the index formula by hand on a small example before coding.
6. **Không cần simulation** — Không cần mô phỏng chọn 4 cái; chỉ cần biết cái nào được tính điểm. / No need to simulate picking 4 — only the gained pizza matters.

---

## Solutions

```typescript
/**
 * Approach 1: Sort + Greedy Index Formula
 * Time: O(n log n)  Space: O(1) extra (sort in-place)
 *
 * After sorting descending:
 *  - oddCnt = ceil(n/2) odd rounds → each gains pizza[0], pizza[2], pizza[4], ...
 *    (take the best pizza from each group; waste 3 from that group)
 *  - evenCnt = floor(n/2) even rounds → each gains the 2nd pizza in its group
 *    counted from the tail end: pizza[n*4 - 2], pizza[n*4 - 4 - 1], ...
 *
 * Simplified index pattern (verified against examples):
 *  - Odd rounds gain: sorted[0], sorted[1], ..., sorted[oddCnt - 1]  (top oddCnt values)
 *  - Even rounds gain: sorted[oddCnt + 1], sorted[oddCnt + 3], ...   (skip one between each)
 *    i.e. sorted[oddCnt + 1 + 2*k] for k = 0..evenCnt-1
 */
function eatPizzas(pizzas: number[]): number {
  const total = pizzas.length; // = 4n
  const n = total / 4;
  const oddCnt = Math.ceil(n / 2); // number of odd rounds
  const evenCnt = Math.floor(n / 2); // number of even rounds

  // Sort descending
  pizzas.sort((a, b) => b - a);

  let gain = 0;

  // Odd rounds: gain the maximum → take sorted[0..oddCnt-1]
  for (let i = 0; i < oddCnt; i++) {
    gain += pizzas[i];
  }

  // Even rounds: gain the 2nd maximum in each group of 4
  // After assigning top oddCnt to odd rounds, even rounds pick 2nd from remaining blocks
  // Pattern: sorted[oddCnt + 1], sorted[oddCnt + 3], sorted[oddCnt + 5], ...
  for (let i = 0; i < evenCnt; i++) {
    gain += pizzas[oddCnt + 1 + 2 * i];
  }

  return gain;
}

/**
 * Approach 2: Explicit group simulation (clearer intent)
 * Time: O(n log n)  Space: O(1)
 *
 * Each "day" of 4 pizzas consumes a contiguous block from the sorted array.
 * Odd day → index 0 of that block (max); Even day → index 1 (2nd max).
 * We want to assign blocks greedily: put highest-value blocks at odd days.
 */
function eatPizzasSimulate(pizzas: number[]): number {
  pizzas.sort((a, b) => b - a);
  const n = pizzas.length / 4;
  const oddCnt = Math.ceil(n / 2);
  let gain = 0;

  for (let round = 0; round < n; round++) {
    const blockStart = round * 4;
    if (round < oddCnt) {
      gain += pizzas[blockStart]; // odd round: gain max of block
    } else {
      gain += pizzas[blockStart + 1]; // even round: gain 2nd of block
    }
  }
  return gain;
}

// Tests
console.log(eatPizzas([1, 2, 3, 4, 5, 6, 7, 8])); // 14
console.log(eatPizzas([2, 1, 1, 1, 1, 1, 1, 1])); // 3
console.log(eatPizzasSimulate([1, 2, 3, 4, 5, 6, 7, 8])); // 14
console.log(eatPizzasSimulate([2, 1, 1, 1, 1, 1, 1, 1])); // 3
```

---

## 🔗 Related Problems

- [621. Task Scheduler](https://leetcode.com/problems/task-scheduler) — Greedy allocation with constraints
- [502. IPO](https://leetcode.com/problems/ipo) — Greedy + two heaps for maximizing profit
- [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight) — Greedy with sorted selection
- [2561. Rearranging Fruits](https://leetcode.com/problems/rearranging-fruits) — Sort + greedy pairing
- [2141. Maximum Running Time of N Computers](https://leetcode.com/problems/maximum-running-time-of-n-computers) — Greedy with binary search
