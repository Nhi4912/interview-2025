---
layout: page
title: "Number of Submatrices That Sum to Target"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Matrix, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-submatrices-that-sum-to-target"
---

# Number of Submatrices That Sum to Target / Số Lượng Ma Trận Con Có Tổng Bằng Target

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ tới bài "Subarray Sum Equals K" trên mảng 1D — đã biết dùng prefix sum + hashmap. Bài này nâng lên 2D: cố định 2 hàng (r1, r2), "nén" cột thành 1D (cộng dọc các cột), rồi áp dụng lại đúng kỹ thuật hashmap như 1D. Tổng cộng: O(rows² × cols).

**Pattern Recognition:**

- Signal: "count submatrices sum = target" → **2D Prefix Sum + 1D Subarray Sum = K trick**
- Key insight: fix pair of rows → collapse to 1D column sums → use HashMap `{sum: count}`

**Visual — matrix=[[0,1,0],[1,1,1],[0,1,0]], target=0:**

```
Fix r1=0, r2=0: colSum=[0,1,0]
  prefixes: 0→1, 0+1→0, 0+1+0→0... check map for sum-target

Fix r1=0, r2=1: colSum=[0+1,1+1,0+1]=[1,2,1]
  prefixes: 1, 3, 4 → check for sum-0=sum... none match target=0

Fix r1=1, r2=1: colSum=[1,1,1]
  ...

Total submatrices with sum=0: 4 (four corners)
```

---

## 📝 Problem Description

Given `matrix` and integer `target`. Return the number of non-empty submatrices whose elements sum to `target`.

**Example 1:** `matrix=[[0,1,0],[1,1,1],[0,1,0]], target=0` → `4`
**Example 2:** `matrix=[[1,-1],[-1,1]], target=0` → `5`

**Constraints:** `1 ≤ m,n ≤ 100`, `-1000 ≤ matrix[i][j] ≤ 1000`, `-10^8 ≤ target ≤ 10^8`

---

## 🎯 Interview Tips

1. **Reduce to 1D** / Giảm về 1D: fix hai hàng r1,r2 → compress thành mảng colSum[] 1D
2. **Subarray sum = K** / Tổng mảng con = K: dùng prefix sum + hashmap `{prefixSum: count}`
3. **Nested loops r1,r2** / Hai vòng r1,r2: O(m²) cặp hàng, mỗi cặp O(n) → tổng O(m²×n)
4. **Init map with {0:1}** / Khởi tạo map với `{0:1}`: để đếm subarray bắt đầu từ cột 0
5. **Negative values** / Giá trị âm: target và matrix values có thể âm → HashMap bắt buộc
6. **Transpose trick** / Đổi chiều: nếu m > n thì transpose để O(n²×m) với n < m

---

## 💡 Solutions

### Approach 1: Brute Force — O(m²n²) Four Loops

/\*_ @complexity Time: O(m²×n²) | Space: O(1) _/

```typescript
function numSubmatrixSumTargetBrute(matrix: number[][], target: number): number {
  const m = matrix.length,
    n = matrix[0].length;
  let count = 0;

  for (let r1 = 0; r1 < m; r1++) {
    for (let r2 = r1; r2 < m; r2++) {
      for (let c1 = 0; c1 < n; c1++) {
        let sum = 0;
        for (let c2 = c1; c2 < n; c2++) {
          for (let r = r1; r <= r2; r++) sum += matrix[r][c2];
          if (sum === target) count++;
        }
      }
    }
  }
  return count;
}
```

### Approach 2: 2D Prefix Sum + HashMap — Optimal

/\*_ @complexity Time: O(m²×n) | Space: O(n) _/

```typescript
function numSubmatrixSumTarget(matrix: number[][], target: number): number {
  const m = matrix.length,
    n = matrix[0].length;
  let count = 0;

  // Fix pair of rows
  for (let r1 = 0; r1 < m; r1++) {
    const colSum = new Array(n).fill(0); // sum from row r1 to r2 in each column

    for (let r2 = r1; r2 < m; r2++) {
      // Extend column sums to include row r2
      for (let c = 0; c < n; c++) colSum[c] += matrix[r2][c];

      // Subarray sum equals target on colSum[] using prefix sum + hashmap
      const map = new Map<number, number>();
      map.set(0, 1);
      let prefSum = 0;

      for (let c = 0; c < n; c++) {
        prefSum += colSum[c];
        count += map.get(prefSum - target) ?? 0;
        map.set(prefSum, (map.get(prefSum) ?? 0) + 1);
      }
    }
  }
  return count;
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  numSubmatrixSumTarget(
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    0,
  ),
); // → 4
console.log(
  numSubmatrixSumTarget(
    [
      [1, -1],
      [-1, 1],
    ],
    0,
  ),
); // → 5
console.log(numSubmatrixSumTarget([[1]], 1)); // → 1
console.log(
  numSubmatrixSumTarget(
    [
      [1, 2],
      [3, 4],
    ],
    10,
  ),
); // → 1 (whole matrix)
console.log(
  numSubmatrixSumTargetBrute(
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    0,
  ),
); // → 4
```

---

## Related Problems

| Problem                                                                                                      | Difficulty | Pattern              |
| ------------------------------------------------------------------------------------------------------------ | ---------- | -------------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)                                 | Medium     | Prefix Sum + HashMap |
| [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable)                 | Medium     | 2D Prefix Sum        |
| [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) | Hard       | 2D Prefix + BST      |
