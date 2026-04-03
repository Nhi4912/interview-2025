---
layout: page
title: "Query Kth Smallest Trimmed Number"
difficulty: Medium
category: Sorting-Searching
tags: [Array, String, Divide and Conquer, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/query-kth-smallest-trimmed-number"
---

# Query Kth Smallest Trimmed Number / Truy Vấn Số Nhỏ Thứ K Sau Khi Cắt Bớt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting + Index Tracking
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống sắp xếp danh sách điện thoại nhưng chỉ nhìn vào `trim` chữ số cuối cùng. Số nào có đuôi nhỏ hơn xếp trước. Với mỗi query khác nhau, ta sort lại theo suffix khác nhau.

**Pattern Recognition:**

- Signal: "sort by last trim digits, find kth" → **Sort with index preservation**
- Brute force: với mỗi query, trim tất cả rồi sort (kèm original index) → O(q _ n _ log n)
- Optimal (Radix Sort): group queries by same trim, process together → O(n \* total_trim)

**Visual — nums=["102","473","251","814"], query=[1,trim=2]:**

```
Original:  ["102","473","251","814"]  indices=[0,1,2,3]
Trim to 2: ["02", "73", "51", "14"]
Sort:      ("02",0), ("14",3), ("51",2), ("73",1)
           idx:  0        3       2       1
k=1 → 0th element → index 0  ✓
```

---

## Problem Description

Given `nums` (equal-length numeric strings) and `queries[i] = [k, trim]`: trim each number to last `trim` digits (no leading zeros counted for comparison), find the **original index** of the k-th smallest (1-indexed). Ties broken by original index (smaller index wins). ([LeetCode 2343](https://leetcode.com/problems/query-kth-smallest-trimmed-number))

Difficulty: Medium | Acceptance: 45.6%

```
Example 1: nums=["102","473","251","814"], queries=[[1,1],[2,3],[4,2]]
           → [2, 2, 1]
           query[0]: trim=1 → ["2","3","1","4"] → sorted: 1(idx2),2(idx0),3(idx1),4(idx3) → k=1 → idx 2
           query[1]: trim=3 → full numbers → sorted: 102,251,473,814 → k=2 → idx 2
           query[2]: trim=2 → "02","73","51","14" → sorted: 02,14,51,73 → k=4 → idx 1
Example 2: nums=["24","37","96","04"], queries=[[2,1],[2,2]]
           → [1, 3]
```

Constraints: `1 ≤ n, queries.length ≤ 100`, equal-length strings of digits

---

## 📝 Interview Tips

1. **Tie-breaking / Ưu tiên**: "Khi hai số trimmed bằng nhau, chọn index nhỏ hơn"
2. **Leading zeros / Số không đầu**: "Sau khi trim, so sánh string lexicographically (same length → lex = numeric)"
3. **Same length → lex sort works / So sánh lex**: Vì tất cả strings cùng độ dài sau trim, so sánh lex = so sánh numeric
4. **Brute force first / Brute force trước**: n ≤ 100 nên brute force O(q \* n log n) là đủ
5. **Radix sort optimization / Tối ưu**: Group queries by trim, process in order → O(n \* D) where D = string length
6. **Complexity / Độ phức tạp**: Brute O(q _ n _ log n _ L), Radix O((n + q) _ L) where L = string length

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — for each query, trim + sort
 * Time: O(q * n * log(n) * L)  Space: O(n)
 */
function smallestTrimmedNumbersBrute(nums: string[], queries: number[][]): number[] {
  return queries.map(([k, trim]) => {
    const trimmed = nums.map((s, i) => [s.slice(s.length - trim), i] as [string, number]);
    trimmed.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]));
    return trimmed[k - 1][1];
  });
}

/**
 * Solution 2: Optimized — Radix Sort (process column by column from right)
 * Time: O(n * L + q * L)  Space: O(n + q)
 *
 * Key: process columns right-to-left (trim=1,2,...,L).
 * After processing t columns, we have stable-sorted order for trim=t.
 * For each query with that trim, read off k-th element.
 */
function smallestTrimmedNumbers(nums: string[], queries: number[][]): number[] {
  const n = nums.length;
  const L = nums[0].length;
  const result = new Array(queries.length).fill(0);

  // Group queries by trim value
  const queryByTrim = new Map<number, number[]>(); // trim → list of query indices
  for (let i = 0; i < queries.length; i++) {
    const trim = queries[i][1];
    if (!queryByTrim.has(trim)) queryByTrim.set(trim, []);
    queryByTrim.get(trim)!.push(i);
  }

  // Radix sort: start with identity order, sort from rightmost column
  let order = Array.from({ length: n }, (_, i) => i);

  for (let col = L - 1; col >= 0; col--) {
    const trim = L - col; // number of columns processed so far
    // Stable sort by current column
    order.sort((a, b) => {
      const ca = nums[a][col],
        cb = nums[b][col];
      return ca < cb ? -1 : ca > cb ? 1 : a - b;
    });
    // Answer queries for this trim
    if (queryByTrim.has(trim)) {
      for (const qi of queryByTrim.get(trim)!) {
        result[qi] = order[queries[qi][0] - 1];
      }
    }
  }
  return result;
}

// === Tests ===
console.log(
  JSON.stringify(
    smallestTrimmedNumbers(
      ["102", "473", "251", "814"],
      [
        [1, 1],
        [2, 3],
        [4, 2],
      ],
    ),
  ),
); // [2,2,1]
console.log(
  JSON.stringify(
    smallestTrimmedNumbers(
      ["24", "37", "96", "04"],
      [
        [2, 1],
        [2, 2],
      ],
    ),
  ),
); // [3,0]  (trim=1: 2nd of "4","4" by idx → idx3; trim=2: sorted "04"<"24"→ k=2 → idx0)
console.log(
  JSON.stringify(
    smallestTrimmedNumbersBrute(
      ["102", "473", "251", "814"],
      [
        [1, 1],
        [2, 3],
        [4, 2],
      ],
    ),
  ),
); // [2,2,1]
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                    |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [2343. Query Kth Smallest Trimmed Number](https://leetcode.com/problems/query-kth-smallest-trimmed-number) | This problem                    |
| [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)      | Kth element, quickselect/heap   |
| [164. Maximum Gap](https://leetcode.com/problems/maximum-gap)                                              | Radix sort technique            |
| [1859. Sorting the Sentence](https://leetcode.com/problems/sorting-the-sentence)                           | String sort with index tracking |
| [539. Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference)                      | Sort + custom comparison        |
