---
layout: page
title: "Maximize the Minimum Game Score"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Greedy]
leetcode_url: "https://leetcode.com/problems/maximize-the-minimum-game-score"
---

# Maximize the Minimum Game Score / Maximize the Minimum Game Score

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)

---

## 🧠 Intuition / Tư Duy

**Analogy / Gốc nhìn:** Như kiểm tra xem có đủ thời gian tưới tất cả cây không — thay vì tìm thời gian tối thiểu trực tiếp, ta **đoán** một giá trị T rồi kiểm tra feasibility. Binary search trên đáp án.

**Pattern Recognition:**

- Keyword: "maximize minimum" + "m moves" + "adjacency constraint" → **Binary Search on Answer**
- Feasibility check: với target T, mỗi position cần `need[i] = max(0, T - points[i])` moves
- Adjacency: di chuyển sang vị trí kề → chi phí traverse = số positions bằng 0 nằm giữa

**Visual — Binary Search + Greedy Check:**

```
points=[2,4], m=3   →  lo=0, hi=5
         T=3: need=[1,0] → S=1, gaps=0 → cost=1 ≤ 3 ✓ → lo=3
         T=4: need=[2,0] → S=2, gaps=0 → cost=2 ≤ 3 ✓ → lo=4
         T=5: need=[3,1] → S=4, gaps=0 → cost=4 > 3 ✗ → hi=4
Answer = 4
```

---

## Problem Description

Cho `points[0..n-1]` và `m` lần di chuyển. Mỗi move chọn index `i` (các move liên tiếp phải có `|i_curr - i_prev| ≤ 1`) và tăng `points[i]` lên 1. **Maximize min(points)** sau m moves.

**Example 1:** `points=[2,4], m=3` → tăng points[0] hai lần → `[4,4]` → answer `4`
**Example 2:** `points=[4,1,3,2], m=3` → tăng points[1] → `[4,2,3,2]` → answer `2`
**Example 3:** `points=[1,1,1], m=6` → cost=3\*(T-1) ≤ 6 → T=3 → answer `3`

Constraints: `1 ≤ points.length ≤ 1e5`, `1 ≤ points[i], m ≤ 1e9`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Adjacency nghĩa là sao? i_prev phải cách i_curr ≤ 1?" / Consecutive moves differ by at most 1 index
2. **Brute Force**: "Thử mọi target T từ 0 → min+m → O(n × maxVal)" / Linear scan over T — feasibility check each
3. **Binary Search Insight**: "feasible(T) monotone: nếu T đạt được, T-1 cũng đạt → binary search" / Monotone → binary search on T
4. **Feasibility Cost**: "Traverse p1→pk tốn (pk-p1+1) moves; trong đó S là useful, rest là waste (gap)" / Total = S + gaps between needed positions
5. **Edge Case**: "n=1 → cost=max(0,T-points[0]) ≤ m → T=points[0]+m" / Single element: just add m
6. **Follow-up**: "Nếu cho phép đi theo hướng ngược lại?" — không thay đổi bài toán vì ta đã tính optimal path / Backward allowed — optimal path already captured

---

## Solutions

```typescript
/**
 * Solution 1: Binary Search on Answer + Greedy Feasibility (Optimal)
 * @time O(n log(min+m)) — O(n) feasibility × O(log maxVal) binary search
 * @space O(1)
 *
 * Feasibility for target T:
 *   need[i] = max(0, T - points[i])
 *   Traverse from first needed position p1 to last pk.
 *   Total moves = sum(need) + #zero-need positions in [p1..pk]
 */
function maxScore(points: number[], m: number): number {
  const n = points.length;

  function feasible(T: number): boolean {
    let p1 = -1,
      pk = -1,
      S = 0,
      nonzero = 0;
    for (let i = 0; i < n; i++) {
      const need = Math.max(0, T - points[i]);
      if (need > 0) {
        if (p1 === -1) p1 = i;
        pk = i;
        nonzero++;
        S += need;
      }
    }
    if (p1 === -1) return true; // T ≤ min(points), already achieved
    const gaps = pk - p1 + 1 - nonzero; // zero-need positions between p1..pk
    return S + gaps <= m;
  }

  let lo = 0,
    hi = Math.min(...points) + m;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (feasible(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * Solution 2: Linear Scan on T (Brute-force feasibility — same greedy, no binary search)
 * @time O(n × (min+m)) — TLE on large inputs, illustrates the search space
 * @space O(1)
 */
function maxScoreBrute(points: number[], m: number): number {
  const n = points.length;
  const hi = Math.min(...points) + m;

  const cost = (T: number): number => {
    let p1 = -1,
      pk = -1,
      S = 0,
      nonzero = 0;
    for (let i = 0; i < n; i++) {
      const need = Math.max(0, T - points[i]);
      if (need > 0) {
        if (p1 === -1) p1 = i;
        pk = i;
        nonzero++;
        S += need;
      }
    }
    if (p1 === -1) return 0;
    return S + (pk - p1 + 1) - nonzero;
  };

  let ans = 0;
  for (let T = 0; T <= hi; T++) {
    if (cost(T) <= m) ans = T;
    else break; // monotone: once infeasible, higher T also infeasible
  }
  return ans;
}

// === Test Cases ===
console.log(maxScore([2, 4], 3)); // 4
console.log(maxScore([4, 1, 3, 2], 3)); // 2
console.log(maxScore([1, 1, 1], 6)); // 3
console.log(maxScoreBrute([2, 4], 3)); // 4
```

---

## 🔗 Related Problems

- [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) — binary search on answer with feasibility check
- [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array) — same "binary search on answer" pattern
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — sliding window on sorted array
- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) — binary search on speed (classic template)
- [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — binary search + greedy feasibility
