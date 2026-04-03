---
layout: page
title: "Pascal's Triangle"
difficulty: Easy
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/pascals-triangle"
---

# Pascal's Triangle / Tam Giác Pascal

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dynamic Programming (Row Construction)
> **Frequency**: 📘 Tier 3 — Gặp ở 15 companies
> **See also**: [Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii) | [Unique Paths](https://leetcode.com/problems/unique-paths)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xây kim tự tháp — mỗi viên gạch mới là tổng của 2 viên phía trên. Dòng đầu là [1], mỗi dòng tiếp theo tính từ dòng trước → DP row-by-row.

**Pattern Recognition:**

- Signal: "mỗi row phụ thuộc row trước", "triangle pattern" → **DP row construction**
- Transition: `row[j] = prevRow[j-1] + prevRow[j]` cho j trong [1, len-2]
- Math formula: `C(n, k) = C(n, k-1) * (n-k+1) / k` để tính trực tiếp

**Visual — numRows=5:**

```
Row 0:  [1]
Row 1:  [1, 1]
Row 2:  [1, 2, 1]          C(2,0)=1  C(2,1)=2  C(2,2)=1
Row 3:  [1, 3, 3, 1]       C(3,0)=1  C(3,1)=3  C(3,2)=3  C(3,3)=1
Row 4:  [1, 4, 6, 4, 1]    C(4,0)=1  C(4,1)=4  C(4,2)=6  ...

Each element: C(row, col) = row! / (col! × (row-col)!)
Incremental:  C(n,k) = C(n,k-1) × (n-k+1) / k  (avoids large factorials)
```

---

## Problem Description

Given an integer `numRows`, return the first `numRows` rows of Pascal's triangle, where each row's element equals the sum of the two elements directly above it (edges are always 1).

```
Example 1: numRows=5 → [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Example 2: numRows=1 → [[1]]
```

Constraints: `1 <= numRows <= 30`

---

## 📝 Interview Tips

1. **Clarify**: "numRows=1 chỉ trả về [[1]]?" / Confirm single row case.
2. **Base cases**: Dòng 0 = [1]; mỗi dòng bắt đầu và kết thúc bằng 1.
3. **DP transition**: `triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]` — simple and clean.
4. **Math approach**: Tính C(n,k) bằng incremental formula — elegant nhưng cần careful với float.
5. **Space**: Với numRows<=30 không cần optimize; mention có thể dùng 1D array in-place.
6. **Follow-up**: "Pascal's Triangle II — return only row k in O(k) space" — classic follow-up.

---

## Solutions

```typescript
/**
 * Solution 1: Row-by-Row Construction (DP)
 * Time: O(numRows²) — build each of n rows; row i has i+1 elements
 * Space: O(numRows²) — store all rows in output
 *
 * Each cell = sum of the two cells directly above it.
 * Edges of each row are always 1.
 */
function generate1(numRows: number): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1).fill(1); // fill 1s (handles edges automatically)
    for (let j = 1; j < i; j++) {
      row[j] = result[i - 1][j - 1] + result[i - 1][j]; // inner elements
    }
    result.push(row);
  }
  return result;
}

/**
 * Solution 2: Math Combination Formula C(n, k)
 * Time: O(numRows²) — compute each element once via incremental formula
 * Space: O(numRows²) — output storage only; O(1) extra computation
 *
 * Row n = [C(n,0), C(n,1), ..., C(n,n)]
 * Incremental: C(n,k) = C(n,k-1) × (n-k+1) / k  — avoids computing factorials
 */
function generate(numRows: number): number[][] {
  const result: number[][] = [];
  for (let n = 0; n < numRows; n++) {
    const row: number[] = [1]; // C(n, 0) = 1 always
    for (let k = 1; k <= n; k++) {
      // C(n, k) = C(n, k-1) * (n - k + 1) / k
      row.push(Math.round((row[k - 1] * (n - k + 1)) / k));
    }
    result.push(row);
  }
  return result;
}

// Bonus: Pascal's Triangle II — return only row k using O(k) space
// Modify in-place right-to-left to avoid overwriting values we still need
function getRow(rowIndex: number): number[] {
  const row = new Array(rowIndex + 1).fill(1);
  for (let i = 2; i <= rowIndex; i++) {
    // Traverse right-to-left so we don't overwrite values before using them
    for (let j = i - 1; j >= 1; j--) {
      row[j] = row[j] + row[j - 1];
    }
  }
  return row;
}

// === Test Cases ===
console.log(JSON.stringify(generate(5)));
// [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log(JSON.stringify(generate(1)));
// [[1]]
console.log(JSON.stringify(generate1(5)));
// same as above
console.log(JSON.stringify(getRow(3))); // [1,3,3,1]
console.log(JSON.stringify(getRow(0))); // [1]
```

---

## 🔗 Related Problems

| Problem                                                                               | Relationship                                  |
| ------------------------------------------------------------------------------------- | --------------------------------------------- |
| [118. Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/)             | This problem                                  |
| [119. Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii/)       | Return only row k in O(k) space               |
| [62. Unique Paths](https://leetcode.com/problems/unique-paths/)                       | C(m+n-2, m-1) = element in Pascal's triangle  |
| [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)                 | Fibonacci = diagonal sum of Pascal's triangle |
| [1137. N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/) | DP row dependency — same pattern              |
