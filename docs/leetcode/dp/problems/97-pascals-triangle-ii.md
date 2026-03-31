---
layout: page
title: "Pascal's Triangle II"
difficulty: Easy
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/pascals-triangle-ii"
---

# Pascal's Triangle II / Tam Giác Pascal II

> **Difficulty**: 🟢 Easy | **Category**: Dynamic Programming | **Pattern**: In-place Row DP / Combinatorics

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Tam giác Pascal giống như bậc thang: mỗi bậc bằng tổng hai bậc phía trên. Chỉ cần lưu một hàng và cập nhật từ phải sang trái để tránh dùng giá trị đã thay đổi.

**Pattern Recognition:**

- Only need row `k` → no need to build all rows; use 1D DP with in-place update
- Update right-to-left: `row[j] += row[j-1]` avoids overwriting values needed for computation
- Row k = binomial coefficients C(k,0), C(k,1), ..., C(k,k)

**Visual (rowIndex=4):**

```
Start:  [1]
k=1:    [1,1]
k=2:    [1] → update right to left: [1,2,1]
k=3:    [1,3,3,1]
k=4:    [1,4,6,4,1]
         ↑ at j=2: row[2]=row[2]+row[1]=3+3=6
```

## Problem Description

Given an integer `rowIndex`, return the `rowIndex`-th (0-indexed) row of Pascal's triangle using only **O(rowIndex)** extra space.

**Example 1:** `rowIndex=3` → `[1,3,3,1]`
**Example 2:** `rowIndex=0` → `[1]`
**Example 3:** `rowIndex=1` → `[1,1]`

**Constraints:** `0 <= rowIndex <= 33`

## 📝 Interview Tips

1. **Clarify**: 0-indexed rows? Yes — row 0 is `[1]`, row 1 is `[1,1]`.
2. **Approach**: Build from row 0 up, updating in-place right-to-left each step.
3. **Edge cases**: `rowIndex=0` → `[1]`; no additions needed.
4. **Optimize**: Direct formula `C(n,k) = C(n,k-1) * (n-k+1) / k` for O(n) one-pass.
5. **Follow-up**: Return the full triangle? Use Pascal's Triangle I approach (2D array).
6. **Complexity**: O(k²) time for iterative DP, O(k) for formula; O(k) space both.

## Solutions

```typescript
// Solution 1: In-place 1D DP (right-to-left) — Time: O(k²) | Space: O(k)
function getRow(rowIndex: number): number[] {
  const row = new Array(rowIndex + 1).fill(0);
  row[0] = 1;

  for (let i = 1; i <= rowIndex; i++) {
    // Update right-to-left so we use the old row[j-1] value
    for (let j = i; j >= 1; j--) {
      row[j] += row[j - 1];
    }
  }

  return row;
}

// Solution 2: Direct Combinatorial Formula — Time: O(k) | Space: O(k)
function getRow2(rowIndex: number): number[] {
  const row = new Array(rowIndex + 1).fill(0);
  row[0] = 1;

  // C(n, k) = C(n, k-1) * (n - k + 1) / k
  for (let k = 1; k <= rowIndex; k++) {
    row[k] = (row[k - 1] * (rowIndex - k + 1)) / k;
  }

  return row;
}

// Solution 3: Functional approach — Time: O(k²) | Space: O(k)
function getRow3(rowIndex: number): number[] {
  let row = [1];
  for (let i = 1; i <= rowIndex; i++) {
    // Prepend and append 1, sum adjacent pairs in between
    row = [1, ...Array.from({ length: i - 1 }, (_, j) => row[j] + row[j + 1]), 1];
  }
  return row;
}

// Tests
console.log(getRow(0)); // [1]
console.log(getRow(1)); // [1,1]
console.log(getRow(2)); // [1,2,1]
console.log(getRow(3)); // [1,3,3,1]
console.log(getRow(4)); // [1,4,6,4,1]
console.log(getRow(5)); // [1,5,10,10,5,1]
```

## 🔗 Related Problems

| Problem                                                                         | Relationship                            |
| ------------------------------------------------------------------------------- | --------------------------------------- |
| [Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/)            | Full triangle version (all rows)        |
| [Unique Paths](https://leetcode.com/problems/unique-paths/)                     | Uses binomial coefficient C(m+n-2, m-1) |
| [K-th Symbol in Grammar](https://leetcode.com/problems/k-th-symbol-in-grammar/) | Triangle-like recursive row structure   |
