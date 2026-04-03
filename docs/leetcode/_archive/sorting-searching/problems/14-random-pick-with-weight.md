---
layout: page
title: "Random Pick with Weight"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Binary Search, Prefix Sum, Randomized]
leetcode_url: "https://leetcode.com/problems/random-pick-with-weight"
---

# Random Pick with Weight / Chọn Ngẫu Nhiên Theo Trọng Số

> **Track**: Sorting & Searching | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Binary Search
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Google, Airbnb)
> **See also**: [Random Pick Index](https://leetcode.com/problems/random-pick-index) | [Implement Rand10 Using Rand7](https://leetcode.com/problems/implement-rand10-using-rand7)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn có một thước dài, mỗi khoảng `w[i]` ứng với chỉ số `i`. Bạn ném một tờ giấy ngẫu nhiên lên thước — tờ giấy rơi vào khoảng nào thì chọn chỉ số đó. Cách xây "thước" chính là mảng prefix sum, và tìm "khoảng" là binary search.

**Pattern Recognition:**

- Signal: "pick index with probability proportional to weight" → **Prefix Sum + Binary Search**
- Build `prefix[i] = w[0] + w[1] + ... + w[i]` — tổng luỹ tiến
- Random target ∈ [1, total] → binary search tìm leftmost prefix ≥ target

**Visual — weights=[1,3,2], total=6:**

```
Index:    0    1    2
Weight:   1    3    2
Prefix:   1    4    6

Number line: [1][2,3,4][5,6]
              ↑    ↑      ↑
             i=0  i=1   i=2

rand=1 → prefix=[1,4,6], target=1 → bisect → i=0
rand=3 → target=3 → first prefix≥3 is prefix[1]=4 → i=1 (prob 3/6=50%)
rand=5 → target=5 → first prefix≥5 is prefix[2]=6 → i=2
```

---

## Problem Description

Given an array `w` of positive integers where `w[i]` is the weight of index `i`, implement `pickIndex()` which randomly picks an index in proportion to its weight. Index `i` should be picked with probability `w[i] / sum(w)`.

```
Example: w=[1,3]  → pickIndex() returns 0 with prob 1/4, 1 with prob 3/4
Example: w=[1]    → pickIndex() always returns 0
```

Constraints: `1 <= w.length <= 10^4`, `1 <= w[i] <= 10^5`, `pickIndex` called at most `10^4` times

---

## 📝 Interview Tips

1. **Clarify**: "Weights có thể bằng 0 không? pickIndex gọi bao nhiêu lần?" / Confirm zero weights and call frequency.
2. **Brute Force**: Expand array — nếu w=[1,3], tạo [0,1,1,1], random index → O(sum) space.
3. **Optimal**: Prefix sum O(n) init, binary search O(log n) per pick — không mở rộng array.
4. **Binary Search**: Tìm leftmost index có `prefix[i] >= rand` — dùng lower_bound pattern.
5. **Random range**: `Math.random() * total` cho float [0,total) → `Math.floor(...) + 1` cho int [1,total].
6. **Follow-up**: "Nếu weights thay đổi dynamic?" → Fenwick tree / segment tree.

---

## Solutions

```typescript
/**
 * Solution 1: Expand Array (Brute Force)
 * Time: O(sum(w)) init, O(1) pick
 * Space: O(sum(w)) — expanded array can be huge (up to 10^9)
 */
class Solution1 {
  private expanded: number[];

  constructor(w: number[]) {
    this.expanded = [];
    for (let i = 0; i < w.length; i++) {
      for (let j = 0; j < w[i]; j++) this.expanded.push(i);
    }
  }

  pickIndex(): number {
    const idx = Math.floor(Math.random() * this.expanded.length);
    return this.expanded[idx];
  }
}

/**
 * Solution 2: Prefix Sum + Binary Search (Optimal)
 * Time: O(n) constructor, O(log n) pickIndex
 * Space: O(n) — prefix sum array only
 *
 * Build prefix sum array. On each pick:
 * - Generate random integer in [1, total]
 * - Binary search for leftmost prefix[i] >= target
 * - That index i is the answer
 */
class Solution {
  private prefix: number[];
  private total: number;

  constructor(w: number[]) {
    this.prefix = new Array(w.length);
    this.prefix[0] = w[0];
    for (let i = 1; i < w.length; i++) {
      this.prefix[i] = this.prefix[i - 1] + w[i];
    }
    this.total = this.prefix[w.length - 1];
  }

  pickIndex(): number {
    // Random target in [1, total] (1-indexed to align with prefix values)
    const target = Math.floor(Math.random() * this.total) + 1;
    // Binary search: leftmost index where prefix[i] >= target
    let lo = 0,
      hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}

// === Test Cases ===
// Deterministic verification: check distribution across many picks
function testDistribution(w: number[], trials = 10000): void {
  const sol = new Solution(w);
  const counts = new Array(w.length).fill(0);
  for (let i = 0; i < trials; i++) counts[sol.pickIndex()]++;
  const total = w.reduce((a, b) => a + b, 0);
  console.log("Expected vs Actual:");
  w.forEach((wi, i) => {
    const expected = ((wi / total) * trials).toFixed(0);
    console.log(`  index ${i}: expected~${expected}, got ${counts[i]}`);
  });
}

const sol = new Solution([1, 3]);
console.log("Single pick [1,3]:", sol.pickIndex()); // 0 or 1
testDistribution([1, 3]); // ~25% for 0, ~75% for 1
testDistribution([1, 1, 1]); // ~33% each

const sol1 = new Solution1([1, 3]);
console.log("Brute force pick:", sol1.pickIndex()); // 0 or 1
```

---

## 🔗 Related Problems

| Problem                                                                                          | Relationship                     |
| ------------------------------------------------------------------------------------------------ | -------------------------------- |
| [528. Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/)           | This problem                     |
| [380. Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/)   | Randomized data structure design |
| [398. Random Pick Index](https://leetcode.com/problems/random-pick-index/)                       | Reservoir sampling variant       |
| [470. Implement Rand10 Using Rand7](https://leetcode.com/problems/implement-rand10-using-rand7/) | Probability transformation       |
| [710. Random Pick with Blacklist](https://leetcode.com/problems/random-pick-with-blacklist/)     | Weighted random with exclusions  |
