---
layout: page
title: "Fruit Into Baskets"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/fruit-into-baskets"
---

# Fruit Into Baskets / Hái Trái Cây Vào 2 Giỏ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Bạn đang đi dọc một hàng cây ăn trái với 2 giỏ. Mỗi giỏ chỉ chứa **một loại** trái cây. Bạn muốn hái liên tiếp càng nhiều trái càng tốt — khi gặp loại thứ 3, bạn phải bỏ hết giỏ có loại ít nhất và bắt đầu lại từ điểm đó. Đây là bài **longest subarray with at most 2 distinct values**.

**Pattern Recognition:**

- "Longest subarray with at most K distinct" → Sliding Window với frequency map
- Khi distinct > 2: co cửa sổ từ trái cho đến khi hợp lệ trở lại
- Mỗi element chỉ vào/ra cửa sổ 1 lần → O(n)

**Visual:**

```
fruits = [1,2,1,2,3], k=2

R=0: {1:1}               window=[1]         len=1
R=1: {1:1,2:1}           window=[1,2]       len=2
R=2: {1:2,2:1}           window=[1,2,1]     len=3
R=3: {1:2,2:2}           window=[1,2,1,2]   len=4  ← max=4
R=4: {1:2,2:2,3:1}→ >2 distinct!
  shrink L=0: remove 1→{1:1,2:2,3:1}   still >2
  shrink L=1: remove 2→{1:1,2:1,3:1}   still >2
  shrink L=2: remove 1→{1:0,2:1,3:1}→{2:1,3:1} = 2 ✅
  window=[2,3]  len=2
Result = 4
```

## Problem Description

You are visiting a farm with a row of fruit trees `fruits[i]`. You have **two baskets**, each holding only one type of fruit. Starting from any tree, pick fruits moving right without stopping. Return the maximum number of fruits you can pick.

**Example 1:** `fruits = [1,2,1]` → `3` (pick all 3, types 1 and 2)

**Example 2:** `fruits = [0,1,2,2]` → `3` (pick `[1,2,2]`, skip type 0)

**Constraints:** `1 <= fruits.length <= 10^5`, `0 <= fruits[i] < fruits.length`.

## 📝 Interview Tips

1. **Clarify**: Bắt đầu từ bất kỳ cây nào không? — Yes, pick any starting tree; must be contiguous rightward.
2. **Approach**: "At most 2 distinct" = classic sliding window — expand right, shrink left when violated.
3. **Edge cases**: Chỉ 1 loại trái → return n; tất cả khác nhau → return 2 (if n ≥ 2) or 1.
4. **Optimize**: O(n²) brute → O(n) sliding window; the key is shrinking left correctly.
5. **Test**: `[3,3,3,1,2,1,1,2,3,3,4]` → answer is `5` (`[1,2,1,1,2]`).
6. **Follow-up**: K baskets instead of 2 → same algorithm, just change the distinct limit to K.

## Solutions

```typescript
/** Solution 1: Brute Force — try every starting position
 * Time: O(n²) | Space: O(1)
 */
function totalFruit1(fruits: number[]): number {
  let max = 0;
  for (let i = 0; i < fruits.length; i++) {
    const basket = new Set<number>();
    for (let j = i; j < fruits.length; j++) {
      basket.add(fruits[j]);
      if (basket.size > 2) break;
      max = Math.max(max, j - i + 1);
    }
  }
  return max;
}

/** Solution 2: Sliding Window + Frequency Map — O(n) optimal
 * Time: O(n) | Space: O(1) — map size bounded by 3
 */
function totalFruit(fruits: number[]): number {
  const freq = new Map<number, number>();
  let left = 0;
  let max = 0;

  for (let right = 0; right < fruits.length; right++) {
    const f = fruits[right];
    freq.set(f, (freq.get(f) ?? 0) + 1);

    // Shrink window until at most 2 distinct fruit types
    while (freq.size > 2) {
      const leftFruit = fruits[left];
      freq.set(leftFruit, freq.get(leftFruit)! - 1);
      if (freq.get(leftFruit) === 0) freq.delete(leftFruit);
      left++;
    }

    max = Math.max(max, right - left + 1);
  }
  return max;
}

/** Solution 3: Generalized — at most K distinct (k=2 for this problem)
 * Time: O(n) | Space: O(k)
 */
function totalFruitK(fruits: number[], k = 2): number {
  const freq = new Map<number, number>();
  let left = 0,
    max = 0;
  for (let right = 0; right < fruits.length; right++) {
    freq.set(fruits[right], (freq.get(fruits[right]) ?? 0) + 1);
    while (freq.size > k) {
      const lf = fruits[left++];
      freq.set(lf, freq.get(lf)! - 1);
      if (freq.get(lf) === 0) freq.delete(lf);
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}

// Test cases
console.log(totalFruit([1, 2, 1])); // 3
console.log(totalFruit([0, 1, 2, 2])); // 3
console.log(totalFruit([1, 2, 3, 2, 2])); // 4
console.log(totalFruit([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4])); // 5
console.log(totalFruitK([1, 2, 1, 2, 3], 2)); // 4
console.log(totalFruit1([0, 1, 2, 2])); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                                    | Relationship                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| [Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters) | Identical problem on strings; k=2 special case |
| [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers)                                   | Count instead of max length; uses same window  |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters)             | Sliding window with distinct = 0 duplicates    |
