---
layout: page
title: "Count Zero Request Servers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/count-zero-request-servers"
---

# Count Zero Request Servers / Đếm Server Không Nhận Request

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window + Sorted Queries
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có cửa sổ thời gian `[l, r]` và cần đếm server nào **không có log nào** trong cửa sổ đó. Thay vì quét lại toàn bộ log cho mỗi query, hãy sort queries theo `r` rồi dùng **two pointers** để trượt cửa sổ — thêm từ phải, bỏ từ trái.

**Pattern Recognition:**

- Signal: "count per query window" + "offline queries" → **Sort queries + Two Pointers**
- Key insight: sort queries by right endpoint, slide left pointer forward for each query
- Active servers = servers with ≥1 log in [l, r]; answer = n − active

**Visual — Sliding window over sorted logs:**

```
logs (sorted by time): [(1,A),(2,B),(3,A),(5,C),(7,B)]
Query [2,5] x=3 → window [2,5]:
  rp: include logs time<=5 → (1,A)(2,B)(3,A)(5,C) but...
  lp: exclude logs time<2  → remove (1,A)
  active = {A,B,C} = 3  →  n - 3 = answer
         ↑
         (1,A) removed since time=1 < l=2
```

---

## Problem Description

Có `n` server (1-indexed). Mảng `logs[i]=[time, server]` ghi lại request. Mỗi query `queries[i]` cho cửa sổ `[queries[i], queries[i]+x]`. Với mỗi query, đếm server không nhận request nào trong cửa sổ đó. ([LeetCode 2747](https://leetcode.com/problems/count-zero-request-servers))

- Example 1: `n=3, logs=[[1,3],[2,6],[3,5]], x=5, queries=[10,11]` → `[1,2]`
- Example 2: `n=3, logs=[[2,4],[2,1],[1,2],[3,1]], x=2, queries=[2,3]` → `[0,1]`

Constraints: `1 ≤ n ≤ 10⁵`, `1 ≤ logs.length ≤ 10⁵`, `1 ≤ queries.length ≤ 10⁵`

---

## 📝 Interview Tips

1. **Clarify**: "x là khoảng thời gian cố định? Cửa sổ là [q, q+x]?" / Confirm fixed-width window [q, q+x]
2. **Brute force**: "Mỗi query quét hết logs O(q × m)" / Scan all logs per query is too slow
3. **Offline approach**: "Sort queries theo r → có thể dùng two pointers" / Sorting queries enables two-pointer
4. **Two pointers**: "rp chỉ tiến về phải; lp cũng chỉ tiến — tổng O(n + q) amortized" / Both pointers advance only forward
5. **Active tracking**: "serverCnt map → khi count đến 0 thì --active" / Hash map counts per-server, decrement active when hits 0
6. **Result indexing**: "Lưu original index của query để điền kết quả đúng vị trí" / Track original query index for correct output

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — per-query log scan
 * Time: O(q × m) — for each of q queries, scan all m logs
 * Space: O(n) — set of active servers
 */
function countZeroRequestServersBruteForce(
  n: number,
  logs: number[][],
  x: number,
  queries: number[],
): number[] {
  return queries.map((q) => {
    const active = new Set<number>();
    for (const [t, srv] of logs) {
      if (t >= q && t <= q + x) active.add(srv);
    }
    return n - active.size;
  });
}

/**
 * Solution 2: Sort Queries + Two Pointers (Optimal)
 * Time: O((m + q) log m + n) — sort logs O(m log m), sort queries O(q log q), two-pointer O(m + q)
 * Space: O(m + q) — sorted query array, serverCnt map
 */
function countZeroRequestServers(
  n: number,
  logs: number[][],
  x: number,
  queries: number[],
): number[] {
  logs.sort((a, b) => a[0] - b[0]); // Sort logs by time

  // Indexed queries sorted by right endpoint
  const sortedQ = queries
    .map((q, i) => [q, q + x, i] as [number, number, number])
    .sort((a, b) => a[1] - b[1]);

  const result = new Array(queries.length).fill(0);
  const serverCnt = new Map<number, number>(); // server → count in current window
  let active = 0; // Number of servers with at least 1 log in window
  let lp = 0,
    rp = 0;

  for (const [l, r, qi] of sortedQ) {
    // Expand right: add all logs with time <= r
    while (rp < logs.length && logs[rp][0] <= r) {
      const srv = logs[rp][1];
      if ((serverCnt.get(srv) ?? 0) === 0) active++;
      serverCnt.set(srv, (serverCnt.get(srv) ?? 0) + 1);
      rp++;
    }
    // Shrink left: remove all logs with time < l
    while (lp < rp && logs[lp][0] < l) {
      const srv = logs[lp][1];
      serverCnt.set(srv, serverCnt.get(srv)! - 1);
      if (serverCnt.get(srv) === 0) active--;
      lp++;
    }
    result[qi] = n - active;
  }

  return result;
}

// === Test Cases ===
console.log(
  countZeroRequestServers(
    3,
    [
      [1, 3],
      [2, 6],
      [3, 5],
    ],
    5,
    [10, 11],
  ),
); // [1,2]
console.log(
  countZeroRequestServers(
    3,
    [
      [2, 4],
      [2, 1],
      [1, 2],
      [3, 1],
    ],
    2,
    [2, 3],
  ),
); // [0,1]
console.log(
  countZeroRequestServers(
    5,
    [
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    1,
    [1, 2, 3, 100],
  ),
); // varies
console.log(countZeroRequestServers(1, [[1, 1]], 0, [1])); // [0]
```

---

## 🔗 Related Problems

- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — fixed window sliding with monotonic deque
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — multi-list sliding window
- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — offline query processing with sorted events
- [Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit) — variable-size sliding window
- [Count Zero Request Servers — LeetCode](https://leetcode.com/problems/count-zero-request-servers) — problem page
