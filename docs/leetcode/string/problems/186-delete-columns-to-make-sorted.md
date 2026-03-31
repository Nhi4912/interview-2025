---
layout: page
title: "Delete Columns to Make Sorted"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/delete-columns-to-make-sorted"
---

# Delete Columns to Make Sorted / Xóa Cột Để Tạo Chuỗi Đã Sắp Xếp

🟢 Easy | Array, String

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Hãy tưởng tượng bảng chữ cái được sắp xếp theo hàng — mỗi cột phải đọc từ trên xuống theo thứ tự tăng dần. Nếu cột nào có ký tự đảo ngược thứ tự, ta cần xóa cột đó.

```
strs = ["cba","daf","ghi"]

Col 0: c,d,g → sorted ✅
Col 1: b,a,f → b > a ❌ → delete
Col 2: a,f,i → sorted ✅

Answer: 1
```

## Problem Description

You are given an array `strs` of `n` strings, all of the same length. Choose a set of column indices to delete such that the remaining columns read top to bottom in each column are **non-decreasing**. Return the **minimum number** of columns to delete.

- **Example 1:** `strs = ["cba","daf","ghi"]` → `1` (delete column 1: b,a,f)
- **Example 2:** `strs = ["a","b"]` → `0` (already sorted)

## 📝 Interview Tips

- **🇻🇳 Duyệt từng cột** — với mỗi cột, so sánh mọi cặp hàng liền kề / Iterate each column, compare adjacent row pairs
- **🇻🇳 Chỉ cần phát hiện 1 vi phạm** → đánh dấu cột đó cần xóa / One violation → mark column for deletion
- **🇻🇳 Độ phức tạp** O(n × m) không tránh khỏi — phải duyệt hết / O(n×m) unavoidable — must examine every cell
- **🇻🇳 Không cần xây ma trận** — dùng chỉ số trực tiếp / No need to build matrix — use indices directly
- **🇻🇳 Edge case** → 1 hàng hoặc tất cả hàng giống nhau → trả về 0 / 1 row or all equal → return 0
- **🇻🇳 Flag sớm** → break khi phát hiện vi phạm để tiết kiệm thời gian / Early break on violation saves time

## Solutions

### Solution 1: Column-by-Column Check (Optimal)

```typescript
/**
 * Check each column for non-decreasing order
 * Time: O(n * m)  Space: O(1)
 * n = number of strings, m = string length
 */
function minDeletionSize(strs: string[]): number {
  const n = strs.length;
  const m = strs[0].length;
  let deletions = 0;

  for (let col = 0; col < m; col++) {
    for (let row = 0; row < n - 1; row++) {
      if (strs[row][col] > strs[row + 1][col]) {
        deletions++;
        break; // This column must be deleted, move to next
      }
    }
  }

  return deletions;
}

// Test cases
console.log(minDeletionSize(["cba", "daf", "ghi"])); // 1
console.log(minDeletionSize(["a", "b"])); // 0
console.log(minDeletionSize(["zyx", "wvu", "tsr"])); // 3
console.log(minDeletionSize(["abc", "bce", "cae"])); // 1
```

### Solution 2: Functional Approach with every/some

```typescript
/**
 * Functional style using Array methods
 * Time: O(n * m)  Space: O(1)
 */
function minDeletionSizeV2(strs: string[]): number {
  const m = strs[0].length;
  let count = 0;

  for (let col = 0; col < m; col++) {
    const isColumnSorted = strs.every((_, i) => i === 0 || strs[i - 1][col] <= strs[i][col]);
    if (!isColumnSorted) count++;
  }

  return count;
}

// Test cases
console.log(minDeletionSizeV2(["cba", "daf", "ghi"])); // 1
console.log(minDeletionSizeV2(["a", "b"])); // 0
```

### Solution 3: Transpose + Check

```typescript
/**
 * Transpose matrix then check each row is sorted
 * Time: O(n * m)  Space: O(n * m)
 */
function minDeletionSizeV3(strs: string[]): number {
  const n = strs.length;
  const m = strs[0].length;
  let deletions = 0;

  // Build column arrays
  for (let col = 0; col < m; col++) {
    const column = strs.map((s) => s[col]);
    for (let i = 1; i < n; i++) {
      if (column[i - 1] > column[i]) {
        deletions++;
        break;
      }
    }
  }

  return deletions;
}

// Test cases
console.log(minDeletionSizeV3(["cba", "daf", "ghi"])); // 1
console.log(minDeletionSizeV3(["zyx", "wvu", "tsr"])); // 3
```

## 🔗 Related Problems

| Problem                                                                                               | Difficulty | Similarity                    |
| ----------------------------------------------------------------------------------------------------- | ---------- | ----------------------------- |
| [Delete Columns to Make Sorted II](https://leetcode.com/problems/delete-columns-to-make-sorted-ii/)   | 🟡 Medium  | Same theme, harder constraint |
| [Delete Columns to Make Sorted III](https://leetcode.com/problems/delete-columns-to-make-sorted-iii/) | 🔴 Hard    | DP extension                  |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)       | 🔴 Hard    | Column processing             |
| [Check if Array Is Sorted](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/)       | 🟢 Easy    | Sorted check pattern          |
