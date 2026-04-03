---
layout: page
title: "Most Beautiful Item for Each Query"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/most-beautiful-item-for-each-query"
---

# Most Beautiful Item for Each Query / Vật Phẩm Đẹp Nhất Cho Mỗi Truy Vấn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn vào cửa hàng với ngân sách q. Muốn tìm đồ đẹp nhất mà giá ≤ q. Nếu cửa hàng sắp xếp theo giá tăng dần và ghi nhớ max beauty từ đầu đến mỗi mốc giá, thì chỉ cần binary search để tìm vị trí ngân sách rồi tra cứu max beauty trước đó.

```
items = [[1,2],[3,2],[2,4],[5,6],[3,5]], queries = [1,2,3,4,5,6]
Sort by price: [[1,2],[2,4],[3,2],[3,5],[5,6]]
Prefix max beauty: [2, 4, 4, 5, 6]
  (price 1→2, price 2→max(2,4)=4, price 3→max(4,2)=4, price 3→max(4,5)=5, price 5→6)

Query 1: binary search → index 0, beauty = 2
Query 2: binary search → index 1, beauty = 4
Query 3: binary search → index 3, beauty = 5
Query 5: binary search → index 4, beauty = 6
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Prefix max** — sau sort theo price, chạy prefix max beauty để mỗi vị trí lưu "beauty tốt nhất đến đây" / prefix max beauty enables O(1) lookup after binary search
- 🇻🇳 **Binary search upperBound** — tìm last index có price ≤ query / find rightmost item with price ≤ query
- 🇻🇳 **Tại sao sort queries cũng được?** — nếu sort queries kèm index gốc, dùng two-pointer thay binary search O(n+q) / sort queries + two-pointer is O(n+q)
- 🇻🇳 **Duplicate prices** — prefix max xử lý tự động, không cần xử lý đặc biệt / prefix max handles duplicate prices naturally
- 🇻🇳 **No item ≤ query** — trả về 0 khi binary search không tìm thấy / return 0 if no item within budget
- 🇻🇳 **Complexity** — O((n+q) log n) với binary search, O(n log n + q log q) với two-pointer / binary search: O((n+q) log n)

---

## Solutions

### Solution 1: Sort + Prefix Max + Binary Search — O((n+q) log n)

```typescript
/**
 * Sort items by price, prefix max beauty, binary search per query
 * Time: O(n log n + q log n)  Space: O(n)
 */
function maximumBeauty(items: number[][], queries: number[]): number[] {
  // Sort items by price ascending
  items.sort((a, b) => a[0] - b[0]);

  // Build prefix max beauty
  for (let i = 1; i < items.length; i++) {
    items[i][1] = Math.max(items[i][1], items[i - 1][1]);
  }

  // For each query, binary search for last item with price <= query
  const upperBound = (q: number): number => {
    let lo = 0,
      hi = items.length - 1,
      res = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (items[mid][0] <= q) {
        res = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return res;
  };

  return queries.map((q) => {
    const idx = upperBound(q);
    return idx === -1 ? 0 : items[idx][1];
  });
}

console.log(
  maximumBeauty(
    [
      [1, 2],
      [3, 2],
      [2, 4],
      [5, 6],
      [3, 5],
    ],
    [1, 2, 3, 4, 5, 6],
  ),
);
// [2,4,5,5,6,6]
console.log(
  maximumBeauty(
    [
      [1, 2],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    [1],
  ),
);
// [4]
```

### Solution 2: Sort Queries + Two Pointers — O(n log n + q log q)

```typescript
/**
 * Sort queries with original index, merge with sorted items using pointer
 * Time: O(n log n + q log q)  Space: O(q)
 */
function maximumBeauty2(items: number[][], queries: number[]): number[] {
  items.sort((a, b) => a[0] - b[0]);

  // Build prefix max
  for (let i = 1; i < items.length; i++) {
    items[i][1] = Math.max(items[i][1], items[i - 1][1]);
  }

  // Pair queries with original indices, sort by value
  const sortedQ = queries.map((val, idx) => [val, idx]).sort((a, b) => a[0] - b[0]);
  const result = new Array(queries.length).fill(0);

  let j = 0; // pointer into items
  for (const [q, origIdx] of sortedQ) {
    // Advance j as far as items[j].price <= q
    while (j < items.length && items[j][0] <= q) j++;
    result[origIdx] = j === 0 ? 0 : items[j - 1][1];
  }
  return result;
}

console.log(
  maximumBeauty2(
    [
      [1, 2],
      [3, 2],
      [2, 4],
      [5, 6],
      [3, 5],
    ],
    [1, 2, 3, 4, 5, 6],
  ),
);
// [2,4,5,5,6,6]
console.log(maximumBeauty2([[10, 1000]], [5]));
// [0]
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Difficulty | Pattern              |
| -------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling)             | 🔴 Hard    | Sort + Binary Search |
| [Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions) | 🟡 Medium  | Sort + Binary Search |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)                                         | 🟡 Medium  | Binary Search        |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)                         | 🟡 Medium  | Sort                 |
