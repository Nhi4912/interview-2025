---
layout: page
title: "Pancake Sorting"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/pancake-sorting"
---

# Pancake Sorting / Sắp Xếp Bánh Kếp

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Like flipping a stack of pancakes: to move the biggest to its correct spot, first flip it to the front (position 0), then flip the whole prefix to its target. Repeat for decreasing sizes.

**VI:** Giống lật chồng bánh kếp: để đưa bánh lớn nhất đến đúng vị trí, trước tiên lật nó lên đầu, rồi lật toàn bộ tiền tố đến vị trí đích.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Pancake Sorting example:**

```
arr = [3, 2, 4, 1]  target: [1, 2, 3, 4]

Round size=4: max=4 at idx=2
  flip(3): [4, 2, 3, 1]  → result: [3]
  flip(4): [1, 3, 2, 4]  → result: [3, 4]

Round size=3: max=3 at idx=1
  flip(2): [3, 1, 2, 4]  → result: [3,4,2]
  flip(3): [2, 1, 3, 4]  → result: [3,4,2,3]

Round size=2: max=2 at idx=0 → already at front
  flip(2): [1, 2, 3, 4]  → result: [3,4,2,3,2]

Done! At most 2*(n-1) flips
```

---

---

## Problem Description

| #   | Problem             | Difficulty | Pattern           |
| --- | ------------------- | ---------- | ----------------- |
| 1   | Reverse Linked List | 🟢 Easy    | in-place reversal |
| 2   | Sort an Array       | 🟡 Medium  | sorting variants  |
| 3   | Selection Sort      | 🟢 Easy    | find-max pattern  |

---

## 📝 Interview Tips

- 🥞 **EN:** Each element needs at most 2 flips → total ≤ 2*(n-1) flips (within the 10*n limit). **VI:** Mỗi phần tử cần tối đa 2 lần lật → tổng ≤ 2\*(n-1).
- 🔍 **EN:** Find the max in `arr[0..size-1]`, not the whole array — already-placed elements stay untouched. **VI:** Tìm max trong `arr[0..size-1]`, không phải toàn bộ mảng.
- ⏭️ **EN:** If max is already at `arr[size-1]`, skip both flips. **VI:** Nếu max đã ở vị trí đúng, bỏ qua cả hai lần lật.
- 🔄 **EN:** Flip(k) reverses `arr[0..k-1]`. Record `k` (1-indexed) in the result array. **VI:** Flip(k) đảo ngược `arr[0..k-1]`. Lưu k (1-based) vào kết quả.
- 📐 **EN:** The output flips don't need to be minimal — any valid sequence ≤ 10*n works. **VI:** Kết quả không cần tối thiểu — bất kỳ dãy hợp lệ ≤ 10*n đều được chấp nhận.
- 🧮 **EN:** Two-step per round: flip max to idx=0 (unless already there), then flip to idx=size-1. **VI:** Hai bước mỗi vòng: lật max lên đầu (nếu cần), rồi lật về cuối.

---

---

## Solutions

```typescript
/**
 * For each size from n down to 2:
 *   1. Find index of max in arr[0..size-1]
 *   2. If not at 0, flip(maxIdx+1) to bring it to front
 *   3. flip(size) to place it at position size-1
 * Time: O(n²)  Space: O(n) for result
 */
function pancakeSort(arr: number[]): number[] {
  const result: number[] = [];

  function flip(k: number): void {
    let lo = 0,
      hi = k - 1;
    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  }

  for (let size = arr.length; size > 1; size--) {
    // Find index of maximum in arr[0..size-1]
    let maxIdx = 0;
    for (let i = 1; i < size; i++) {
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }
    if (maxIdx === size - 1) continue; // already in place

    // Step 1: flip max to front
    if (maxIdx !== 0) {
      result.push(maxIdx + 1);
      flip(maxIdx + 1);
    }
    // Step 2: flip max to position size-1
    result.push(size);
    flip(size);
  }
  return result;
}

// Tests
console.log(pancakeSort([3, 2, 4, 1])); // [3,4,2,3,2] or any valid sequence
console.log(pancakeSort([1, 2, 3])); // [] (already sorted)
console.log(pancakeSort([2, 1])); // [2] or [1,2]

/**
 * Recursive pancake sort — cleaner to reason about
 * Time: O(n²)  Space: O(n) call stack
 */
function pancakeSortRecursive(arr: number[]): number[] {
  const flips: number[] = [];

  function solve(size: number): void {
    if (size <= 1) return;
    let maxIdx = 0;
    for (let i = 1; i < size; i++) if (arr[i] > arr[maxIdx]) maxIdx = i;

    if (maxIdx !== size - 1) {
      if (maxIdx !== 0) {
        flips.push(maxIdx + 1);
        arr.splice(0, maxIdx + 1, ...arr.slice(0, maxIdx + 1).reverse());
      }
      flips.push(size);
      arr.splice(0, size, ...arr.slice(0, size).reverse());
    }
    solve(size - 1);
  }

  solve(arr.length);
  return flips;
}

// Verify result actually sorts
function verify(original: number[], flips: number[]): boolean {
  const arr = [...original];
  for (const k of flips) {
    let lo = 0,
      hi = k - 1;
    while (lo < hi) {
      [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
      lo++;
      hi--;
    }
  }
  for (let i = 1; i < arr.length; i++) if (arr[i] < arr[i - 1]) return false;
  return true;
}

const input = [3, 2, 4, 1];
const result = pancakeSortRecursive([...input]);
console.log(verify(input, result)); // true
```

---

## 🔗 Related Problems

| #   | Problem             | Difficulty | Pattern           |
| --- | ------------------- | ---------- | ----------------- |
| 1   | Reverse Linked List | 🟢 Easy    | in-place reversal |
| 2   | Sort an Array       | 🟡 Medium  | sorting variants  |
| 3   | Selection Sort      | 🟢 Easy    | find-max pattern  |
