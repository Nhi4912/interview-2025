---
layout: page
title: "Reconstruct a 2-Row Binary Matrix"
difficulty: Medium
category: Array
tags: [Array, Greedy, Matrix]
leetcode_url: "https://leetcode.com/problems/reconstruct-a-2-row-binary-matrix"
---

# Reconstruct a 2-Row Binary Matrix / Tái Tạo Ma Trận Nhị Phân 2 Hàng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix) | [Maximum Matrix Sum](https://leetcode.com/problems/maximum-matrix-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia tiền xu vào 2 hàng — cột nào cần 2 thì cả hai hàng nhận, cột nào cần 1 thì ưu tiên hàng có tổng lớn hơn, cột nào cần 0 thì không ai nhận.

```
upper=2, lower=1, colsum=[2,2,1,1,0]
col 0: colsum=2 → row0=1, row1=1; upper=1, lower=0
col 1: colsum=2 → row0=1, row1=1; upper=0, lower=-1 → INVALID ✗

upper=2, lower=1, colsum=[1,1,1]
col 0: colsum=1 → give to upper (upper>lower): row0=1, row1=0; upper=1
col 1: colsum=1 → give to upper (upper>lower): row0=1, row1=0; upper=0
col 2: colsum=1 → upper=0, lower=1 → give to lower: row0=0, row1=1
→ [[1,1,0],[0,0,1]] ✓
```

---

## Problem Description

Given integers `upper`, `lower`, and array `colsum` of length `n`, reconstruct a 2-row binary matrix where `colsum[j]` is the sum of column `j`, the first row sums to `upper`, and the second row sums to `lower`. Return any valid matrix or empty array if none exists.

- Example 1: `upper=2, lower=1, colsum=[2,2,1,1,0]` → `[]` (impossible)
- Example 2: `upper=2, lower=3, colsum=[2,2,1,1,0]` → `[[1,1,1,0,0],[1,1,0,1,0]]`

Constraints: `1 <= colsum.length <= 10^5`, `colsum[i] ∈ {0,1,2}`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "colsum[i] chỉ có thể là 0, 1, hoặc 2 — không phải số khác?" / Values in colsum are strictly 0, 1, or 2 — simplifies decisions.
2. **Greedy rule / Quy tắc tham lam**: "colsum=2 → cả hai hàng nhận 1; colsum=0 → không ai nhận; colsum=1 → hàng nào còn budget lớn hơn nhận" / Handle mandatory cases (0, 2) first, then distribute 1s greedily.
3. **Validation / Kiểm tra**: "Sau khi điền xong, upper và lower phải = 0" / If upper or lower goes negative, return [] immediately.
4. **Edge case / Trường hợp đặc biệt**: "`upper + lower != sum(colsum)` → không có lời giải" / Early exit: check total sum matches.
5. **Complexity / Độ phức tạp**: "O(n) time, O(n) space cho output" / Single pass through colsum.
6. **Follow-up / Câu hỏi tiếp theo**: "Nếu có k hàng thay vì 2?" / Generalize: sort descending by colsum, assign 1s greedily from row with highest remaining budget.

---

## Solutions

```typescript
/**
 * Solution 1: Greedy — handle colsum=2 first, then distribute 1s
 * Time: O(n) — single pass
 * Space: O(n) — output matrix
 */
function reconstructMatrix(upper: number, lower: number, colsum: number[]): number[][] {
  const n = colsum.length;
  const row0 = new Array(n).fill(0);
  const row1 = new Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    if (colsum[j] === 2) {
      row0[j] = row1[j] = 1;
      upper--;
      lower--;
    } else if (colsum[j] === 1) {
      // Give to whichever row has more budget remaining
      if (upper >= lower) {
        row0[j] = 1;
        upper--;
      } else {
        row1[j] = 1;
        lower--;
      }
    }
    // colsum === 0: both stay 0

    if (upper < 0 || lower < 0) return [];
  }

  return upper === 0 && lower === 0 ? [row0, row1] : [];
}

/**
 * Solution 2: Two-pass — first fill mandatory 2s, then fill 1s greedily
 * Time: O(n) — two passes still O(n)
 * Space: O(n) — output matrix
 */
function reconstructMatrixTwoPass(upper: number, lower: number, colsum: number[]): number[][] {
  const n = colsum.length;
  const row0 = new Array(n).fill(0);
  const row1 = new Array(n).fill(0);

  // Pass 1: handle colsum=2 (mandatory)
  for (let j = 0; j < n; j++) {
    if (colsum[j] === 2) {
      row0[j] = row1[j] = 1;
      upper--;
      lower--;
    }
  }

  // Pass 2: handle colsum=1 (optional — give to upper first)
  for (let j = 0; j < n; j++) {
    if (colsum[j] === 1) {
      if (upper > 0) {
        row0[j] = 1;
        upper--;
      } else if (lower > 0) {
        row1[j] = 1;
        lower--;
      } else return [];
    }
  }

  return upper === 0 && lower === 0 ? [row0, row1] : [];
}

// === Test Cases ===
console.log(reconstructMatrix(2, 1, [2, 2, 1, 1, 0])); // []
console.log(reconstructMatrix(2, 3, [2, 2, 1, 1, 0])); // [[1,1,1,0,0],[1,1,0,1,0]]
console.log(reconstructMatrix(5, 5, [2, 1, 2, 0, 1, 0, 1, 2, 0, 1])); // valid matrix
```

---

## 🔗 Related Problems

| Problem                                                                                                      | Pattern              | Difficulty |
| ------------------------------------------------------------------------------------------------------------ | -------------------- | ---------- |
| [Score After Flipping Matrix](https://leetcode.com/problems/score-after-flipping-matrix)                     | Greedy on matrix     | 🟡 Medium  |
| [Maximum Matrix Sum](https://leetcode.com/problems/maximum-matrix-sum)                                       | Greedy sign flipping | 🟡 Medium  |
| [Largest Submatrix With Rearrangements](https://leetcode.com/problems/largest-submatrix-with-rearrangements) | Sort + greedy        | 🟡 Medium  |
| [Matrix Cells in Distance Order](https://leetcode.com/problems/matrix-cells-in-distance-order)               | Matrix traversal     | 🟢 Easy    |
