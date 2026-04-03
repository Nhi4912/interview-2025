---
layout: page
title: "Last Stone Weight"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/last-stone-weight"
---

# Last Stone Weight / Trọng Lượng Viên Đá Cuối Cùng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Heap / Priority Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi đấu vật — hai đấu sĩ nặng nhất đấu với nhau. Người nặng hơn sống sót với trọng lượng giảm đi, người nhẹ hơn bị loại. Dùng max-heap để luôn lấy được hai viên đá nặng nhất trong O(log n).

**Pattern Recognition:**

- Cần lấy max liên tục → **Max Heap** (simulate bằng min-heap với giá trị âm)
- Mỗi vòng: lấy 2 lớn nhất, smash, đẩy lại nếu còn dư
- Dừng khi ≤ 1 viên đá còn lại

**Visual — stones = [2,7,4,1,8,1]:**

```
MaxHeap: [8,7,4,2,1,1]
Round 1: 8 vs 7 → 8-7=1 → push 1 → [4,2,1,1,1]
Round 2: 4 vs 2 → 4-2=2 → push 2 → [2,1,1,1]
Round 3: 2 vs 1 → 2-1=1 → push 1 → [1,1,1]
Round 4: 1 vs 1 → equal → both destroyed → [1]
Result: 1 ✅
```

---

## Problem Description

You have an array of stone `stones[i]`. Each turn, smash the two heaviest: if equal both are destroyed; otherwise the heavier loses `(heavy - light)` and remains. Return the weight of the last remaining stone, or `0` if none.

- Example 1: `stones = [2,7,4,1,8,1]` → `1`
- Example 2: `stones = [1]` → `1`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu còn đúng 1 viên thì return ngay, không cần smash" / If only 1 stone remains, return immediately
2. **Max-heap**: "JavaScript không có max-heap built-in → negate values trong min-heap" / Negate values to simulate max-heap
3. **Smash logic**: "Nếu y > x: push y-x; nếu y === x: không push gì" / if equal, push nothing; else push difference
4. **Termination**: "Vòng lặp while heap.size > 1" / Loop while more than 1 stone
5. **Edge case**: "1 viên → return đó luôn; tất cả bằng nhau → return 0" / Single stone returns itself; all equal → 0
6. **Follow-up**: "Nếu muốn smash k viên mỗi lần thay vì 2?" / What if smashing k stones at a time?

---

## Solutions

```typescript
/**
 * Solution 1: Simulated Max-Heap via sorted array (interview clarity)
 * Time: O(n² log n) — re-sort after each smash; n rounds × O(n log n) sort
 * Space: O(n)
 */
function lastStoneWeightBrute(stones: number[]): number {
  const arr = [...stones];
  while (arr.length > 1) {
    arr.sort((a, b) => a - b); // ascending, so last two are heaviest
    const y = arr.pop()!;
    const x = arr.pop()!;
    if (y !== x) arr.push(y - x);
  }
  return arr.length === 0 ? 0 : arr[0];
}

/**
 * Solution 2: Max-Heap simulation with negated min-heap
 * Time: O(n log n) — n heap operations each O(log n)
 * Space: O(n)
 */
function lastStoneWeight(stones: number[]): number {
  // Simulate max-heap with negated values in a sorted structure
  const heap: number[] = stones.map((s) => -s).sort((a, b) => a - b);

  const push = (val: number) => {
    heap.push(-val);
    heap.sort((a, b) => a - b); // keep min at front (= max of originals)
  };

  while (heap.length > 1) {
    const y = -heap.shift()!; // largest
    const x = -heap.shift()!; // second largest
    if (y !== x) push(y - x);
  }
  return heap.length === 0 ? 0 : -heap[0];
}

/**
 * Solution 3: Clean using array + sort each round (most readable)
 * Time: O(n² log n), Space: O(n)
 */
function lastStoneWeight3(stones: number[]): number {
  while (stones.length > 1) {
    stones.sort((a, b) => b - a); // descending
    const diff = stones[0] - stones[1];
    stones = diff === 0 ? stones.slice(2) : [diff, ...stones.slice(2)];
  }
  return stones[0] ?? 0;
}

// === Test Cases ===
console.log(lastStoneWeight([2, 7, 4, 1, 8, 1])); // 1
console.log(lastStoneWeight([1])); // 1
console.log(lastStoneWeight([1, 1])); // 0
console.log(lastStoneWeight([3, 3, 3])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                          | Pattern             | Difficulty |
| ------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)                       | Dynamic Programming | Medium     |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | Heap / Quickselect  | Medium     |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                   | Greedy + Heap       | Medium     |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks)   | Min-Heap            | Medium     |
