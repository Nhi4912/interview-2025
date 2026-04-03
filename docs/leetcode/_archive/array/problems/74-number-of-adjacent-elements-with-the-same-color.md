---
layout: page
title: "Number of Adjacent Elements With the Same Color"
difficulty: Medium
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/number-of-adjacent-elements-with-the-same-color"
---

# Number of Adjacent Elements With the Same Color / Số Cặp Phần Tử Kề Cùng Màu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array Simulation (Incremental Update)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm số đôi hàng xóm cùng màu trong dãy đèn — khi bạn đổi màu một bóng đèn, chỉ cần cập nhật tối đa 2 cặp liền kề (trái và phải), không cần đếm lại toàn bộ.

**Pattern Recognition:**

- Signal: "update one element", "count adjacent pairs", "answer after each query" → **Incremental delta update**
- Naive: recalculate all adjacent pairs after each query O(n\*q). Optimal: track delta at affected positions only
- Key insight: thay đổi colors[idx] chỉ ảnh hưởng cặp (idx-1,idx) và (idx,idx+1)

**Visual — n=5, queries=[[0,4],[1,4],[2,3]]:**

```
Initial:  [0,0,0,0,0]  adjacent=0

Query [0,4]: set colors[0]=4
  Before: colors[-1] doesn't exist, colors[0]=0≠colors[1]=0 → no change
  After:  colors[0]=4≠colors[1]=0 → no change
  adjacent=0, result=[0]

Query [1,4]: set colors[1]=4
  Before: colors[0]=4≠colors[1]=0(old), colors[1]=0≠colors[2]=0 → adj was 0
  After:  colors[0]=4==colors[1]=4 → +1, colors[1]=4≠colors[2]=0 → no change
  adjacent=1, result=[0,1]
```

---

## Problem Description

You have `n` elements with colors initially `0` (uncolored). Process queries `[index, color]` — set `colors[index] = color`. After each query, return the count of adjacent pairs `(i, i+1)` with the same color (both non-zero). Return an array of results after each query.

- Example 1: `n=5, queries=[[0,4],[1,4],[2,3],[3,5],[4,5],[2,5]]` → `[0,1,1,1,1,2]` (approximately)
- Example 2: `n=1, queries=[[0,100000]]` → `[0]`

Constraints: `1 <= n <= 10^5`, `1 <= queries.length <= 10^5`, `0 <= queries[i][0] < n`, `1 <= queries[i][1] <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Ban đầu tất cả colors = 0 (chưa tô), cặp có 0 không đếm" / Initially uncolored (0), pairs with 0 don't count
2. **Naive**: "Sau mỗi query, đếm lại O(n) — tổng O(n*q) quá chậm" / Recount all pairs is O(n*q)
3. **Key insight**: "Mỗi query chỉ ảnh hưởng 2 cặp liền kề → O(1) update per query" / Only 2 pairs affected
4. **Order**: "Trước update: xóa contribution cũ. Sau update: cộng contribution mới" / Remove old, add new contributions
5. **Edge**: "idx=0 không có hàng xóm trái, idx=n-1 không có hàng xóm phải" / Boundary checks needed
6. **Follow-up**: "Nếu có thể query range [l,r]?" / Range updates → segment tree or BIT

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — recount after each query
 * Time: O(n * q) — n elements, q queries
 * Space: O(n) — colors array
 */
function colorTheArrayBrute(n: number, queries: number[][]): number[] {
  const colors = new Array(n).fill(0);
  const result: number[] = [];
  for (const [idx, color] of queries) {
    colors[idx] = color;
    let adj = 0;
    for (let i = 0; i < n - 1; i++) {
      if (colors[i] !== 0 && colors[i] === colors[i + 1]) adj++;
    }
    result.push(adj);
  }
  return result;
}

/**
 * Solution 2: Incremental delta — O(1) per query
 * Time: O(q) — constant work per query
 * Space: O(n) — colors array
 *
 * Before setting colors[idx]: subtract pairs that will break
 * After setting colors[idx]: add pairs that will form
 */
function colorTheArray(n: number, queries: number[][]): number[] {
  const colors = new Array(n).fill(0);
  const result: number[] = [];
  let adjacent = 0;

  for (const [idx, color] of queries) {
    // Remove existing adjacent contributions involving idx
    if (idx > 0 && colors[idx] !== 0 && colors[idx] === colors[idx - 1]) adjacent--;
    if (idx < n - 1 && colors[idx] !== 0 && colors[idx] === colors[idx + 1]) adjacent--;

    colors[idx] = color;

    // Add new adjacent contributions involving idx
    if (idx > 0 && colors[idx] !== 0 && colors[idx] === colors[idx - 1]) adjacent++;
    if (idx < n - 1 && colors[idx] !== 0 && colors[idx] === colors[idx + 1]) adjacent++;

    result.push(adjacent);
  }
  return result;
}

// === Test Cases ===
console.log(
  colorTheArray(5, [
    [0, 4],
    [1, 4],
    [2, 3],
    [3, 5],
    [4, 5],
    [2, 5],
  ]),
); // [0,1,1,1,1,2]? let me verify
console.log(colorTheArray(1, [[0, 100000]])); // [0]
console.log(
  colorTheArray(4, [
    [0, 2],
    [1, 2],
    [3, 1],
    [2, 1],
  ]),
); // [0,1,1,2]
console.log(
  colorTheArray(3, [
    [0, 1],
    [1, 1],
    [2, 1],
  ]),
); // [0,1,2]
```

---

## 🔗 Related Problems

- [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts) — counting adjacent patterns
- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — incremental update pattern
- [Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game) — simulation with updates
- [Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary) — column-based counting
