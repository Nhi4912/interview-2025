---
layout: page
title: "Couples Holding Hands"
difficulty: Hard
category: Tree-Graph
tags: [Greedy, Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/couples-holding-hands"
---

# Couples Holding Hands / Các Cặp Đôi Nắm Tay

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** 2n người ngồi thành n ghế đôi. Mỗi cặp (2k, 2k+1) là một couple. Số swap tối thiểu = tổng (kích thước cycle - 1) trong đồ thị couple. Xây đồ thị: mỗi ghế đôi là một nút, nối ghế i với ghế j nếu người ngồi ở ghế i thuộc về couple của người ngồi ở ghế j.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Couples Holding Hands example:**

```
row = [0,2,1,3]
Seat pairs: (0,2) at seat0, (1,3) at seat1
Couple 0: {0,1}, Couple 1: {2,3}

Person 0 (couple0) sits with person 2 (couple1) → seat0 connects couple0-couple1
Person 1 (couple0) sits with person 3 (couple1) → seat1 connects couple0-couple1
→ cycle: couple0 ↔ couple1 (size=2, needs 1 swap)
Answer: cycle_size - 1 = 1

Greedy: scan seats left to right, if pair not correct couple → swap right person
```

---

---

## Problem Description

| Problem                                                                                                                                   | Difficulty | Key Idea              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Minimum Number of Swaps to Make String Balanced 1963](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | Medium     | Greedy swap counting  |
| [Number of Operations to Make Network Connected 1319](https://leetcode.com/problems/number-of-operations-to-make-network-connected)       | Medium     | Union-Find components |
| [Minimum Swaps to Group All 1s 1151](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together)                                | Medium     | Sliding window swaps  |
| [Sort Array by Parity 905](https://leetcode.com/problems/sort-array-by-parity)                                                            | Easy       | In-place swap         |

---

## 📝 Interview Tips

- 🔑 **EN:** Partner of person x: if x is even → x+1, if x is odd → x-1 (i.e., x^1) | **VI:** Bạn đôi của x: x XOR 1 (đổi bit cuối)
- 🔑 **EN:** Greedy: iterate each seat pair, swap right seat with correct partner | **VI:** Tham lam: duyệt từng ghế đôi, hoán đổi người cần thiết
- 🔑 **EN:** Union-Find: number of swaps = sum(cycle_size - 1) = n - num_components | **VI:** Union-Find: số swap = n - số thành phần liên thông
- 🔑 **EN:** UF approach: union couple of person[2i] with couple of person[2i+1] for each seat | **VI:** UF: nối couple của hai người ngồi cùng ghế đôi
- 🔑 **EN:** Couple id of person x = Math.floor(x/2) | **VI:** ID couple của x = Math.floor(x/2)
- 🔑 **EN:** Greedy is O(n²) worst case, UF is O(n\*α) ≈ O(n) | **VI:** Greedy O(n²), UF O(n)

---

---

## Solutions

```typescript
/**
 * Greedy Swap: for each seat pair, bring correct partner
 * Time: O(n²) worst case  Space: O(1)
 */
function minSwapsCouples(row: number[]): number {
  const n = row.length;
  let swaps = 0;

  for (let i = 0; i < n; i += 2) {
    const partner = row[i] ^ 1; // x XOR 1 gives partner (0↔1, 2↔3, ...)
    if (row[i + 1] === partner) continue; // already correct

    // Find where partner is and swap to i+1
    for (let j = i + 2; j < n; j++) {
      if (row[j] === partner) {
        [row[i + 1], row[j]] = [row[j], row[i + 1]];
        swaps++;
        break;
      }
    }
  }

  return swaps;
}

// Test cases
console.log(minSwapsCouples([0, 2, 1, 3])); // 1
console.log(minSwapsCouples([3, 2, 0, 1])); // 0
console.log(minSwapsCouples([5, 4, 2, 6, 3, 1, 0, 7])); // 2

/**
 * Union-Find: swaps = n/2 - number of components
 * Time: O(n*α) ≈ O(n)  Space: O(n)
 */
function minSwapsCouplesUF(row: number[]): number {
  const n = row.length;
  const numCouples = n / 2;

  // Union-Find on couple IDs (0 to n/2-1)
  const parent = Array.from({ length: numCouples }, (_, i) => i);
  const rank = new Array(numCouples).fill(0);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };

  let components = numCouples;
  const union = (a: number, b: number): void => {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return;
    components--;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
  };

  // For each seat pair, union the two couples sitting together
  for (let i = 0; i < n; i += 2) {
    const c1 = Math.floor(row[i] / 2);
    const c2 = Math.floor(row[i + 1] / 2);
    union(c1, c2);
  }

  // swaps needed = sum of (cycle_size - 1) = numCouples - components
  return numCouples - components;
}

console.log(minSwapsCouplesUF([0, 2, 1, 3])); // 1
console.log(minSwapsCouplesUF([3, 2, 0, 1])); // 0
console.log(minSwapsCouplesUF([5, 4, 2, 6, 3, 1, 0, 7])); // 2

/**
 * Position map greedy — O(n) time with lookup table
 * Time: O(n)  Space: O(n)
 */
function minSwapsCouplesOpt(row: number[]): number {
  const n = row.length;
  // pos[x] = current index of person x
  const pos = new Array(n);
  for (let i = 0; i < n; i++) pos[row[i]] = i;

  let swaps = 0;
  for (let i = 0; i < n; i += 2) {
    const partner = row[i] ^ 1;
    if (row[i + 1] === partner) continue;

    const j = pos[partner];
    // Swap row[i+1] with row[j]
    pos[row[i + 1]] = j;
    pos[partner] = i + 1;
    [row[i + 1], row[j]] = [row[j], row[i + 1]];
    swaps++;
  }
  return swaps;
}

console.log(minSwapsCouplesOpt([0, 2, 1, 3])); // 1
console.log(minSwapsCouplesOpt([3, 2, 0, 1])); // 0
console.log(minSwapsCouplesOpt([5, 4, 2, 6, 3, 1, 0, 7])); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                                   | Difficulty | Key Idea              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Minimum Number of Swaps to Make String Balanced 1963](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | Medium     | Greedy swap counting  |
| [Number of Operations to Make Network Connected 1319](https://leetcode.com/problems/number-of-operations-to-make-network-connected)       | Medium     | Union-Find components |
| [Minimum Swaps to Group All 1s 1151](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together)                                | Medium     | Sliding window swaps  |
| [Sort Array by Parity 905](https://leetcode.com/problems/sort-array-by-parity)                                                            | Easy       | In-place swap         |
