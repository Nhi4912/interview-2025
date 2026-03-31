---
layout: page
title: "Water Bottles"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/water-bottles"
---

# Water Bottles / Chai Nước

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) | [Number of Steps to Reduce a Number to Zero](https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống quy trình tái chế — uống xong để lại vỏ, tích đủ `numExchange` vỏ thì đổi được 1 chai đầy. Lặp lại đến khi không đổi được nữa. Có thể dùng simulation hoặc rút ra công thức toán học.

```
numBottles=9, numExchange=3
Round 1: drink 9 → empties=9  → new=9/3=3,  leftover=0 → total=12
Round 2: drink 3 → empties=3  → new=3/3=1,  leftover=0 → total=13
Round 3: drink 1 → empties=1  → 1 < 3, STOP
Total = 13

Math insight: each exchange costs (numExchange-1) net empties and yields 1 drink.
Formula: floor((numBottles - 1) / (numExchange - 1)) + numBottles
```

---

## Problem Description

You have `numBottles` full water bottles. Drink one bottle → produce one empty bottle. Exchange `numExchange` empty bottles → receive one full bottle. Return the **maximum total number of water bottles** you can drink.

- Example 1: `numBottles=9, numExchange=3` → `13`
- Example 2: `numBottles=15, numExchange=4` → `19`

Constraints: `1 <= numBottles <= 100`, `2 <= numExchange <= 100`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Uống 1 chai đầy → 1 vỏ rỗng; đổi `numExchange` vỏ lấy 1 chai đầy — đúng không?" / Confirm 1:1 drink-to-empty ratio and exchange rate.
2. **Simulation / Mô phỏng**: "Vòng lặp while: uống hết, đổi vỏ, cộng vào total — dừng khi không đủ đổi" / Simulate the process; stop when empties < numExchange.
3. **Math shortcut / Công thức**: "`total = numBottles + floor((numBottles-1)/(numExchange-1))`" / Each exchange nets 1 bottle at cost of `(numExchange-1)` empties; derive closed form.
4. **Invariant / Bất biến**: "Tổng empties sau đổi = leftover + new; new chai uống bổ sung thêm `new` empties" / Track `empties = (empties % numExchange) + newBottles` each round.
5. **Edge case / Trường hợp đặc biệt**: "`numExchange=2` → gần như nhân đôi; `numBottles=1, numExchange=2` → chỉ uống 1" / Small exchange rates converge slowly; test boundary cases.
6. **Complexity / Độ phức tạp**: "O(log n) time cho simulation — số lần lặp ≈ log_numExchange(numBottles)" / Bottles reduce geometrically; O(1) with math formula.

---

## Solutions

```typescript
/**
 * Solution 1: Simulation (intuitive, easy to verify)
 * Time: O(log n) — bottles reduce each exchange round
 * Space: O(1) — constant variables
 */
function numWaterBottles(numBottles: number, numExchange: number): number {
  let total = numBottles;
  let empties = numBottles;

  while (empties >= numExchange) {
    const newBottles = Math.floor(empties / numExchange);
    empties = (empties % numExchange) + newBottles;
    total += newBottles;
  }

  return total;
}

/**
 * Solution 2: Closed-form math formula (O(1))
 * Time: O(1) — direct computation
 * Space: O(1) — no variables beyond the formula
 *
 * Derivation: each "net exchange" costs (e-1) empties, yields 1 drink.
 * Starting with n bottles, we can exchange until bottles run out.
 */
function numWaterBottlesMath(numBottles: number, numExchange: number): number {
  return numBottles + Math.floor((numBottles - 1) / (numExchange - 1));
}

/**
 * Solution 3: Recursive approach (demonstrates recursion thinking)
 * Time: O(log n) — same as simulation
 * Space: O(log n) — call stack depth
 */
function numWaterBottlesRecursive(bottles: number, exchange: number, empties = 0): number {
  if (bottles + empties < exchange) return bottles;
  const total = bottles + empties;
  const newFull = Math.floor(total / exchange);
  const remaining = total % exchange;
  return bottles + numWaterBottlesRecursive(newFull, exchange, remaining);
}

// === Test Cases ===
console.log(numWaterBottles(9, 3)); // 13
console.log(numWaterBottles(15, 4)); // 19
console.log(numWaterBottles(5, 5)); // 6
console.log(numWaterBottlesMath(9, 3)); // 13
console.log(numWaterBottlesMath(15, 4)); // 19
console.log(numWaterBottlesRecursive(9, 3)); // 13
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Pattern                    | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------- |
| [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game)             | Math / Josephus simulation | 🟡 Medium  |
| [Bulb Switcher](https://leetcode.com/problems/bulb-switcher)                                                           | Math pattern recognition   | 🟡 Medium  |
| [Number of Steps to Reduce a Number to Zero](https://leetcode.com/problems/number-of-steps-to-reduce-a-number-to-zero) | Iterative reduction        | 🟢 Easy    |
| [Reaching Points](https://leetcode.com/problems/reaching-points)                                                       | Math backward simulation   | 🔴 Hard    |
