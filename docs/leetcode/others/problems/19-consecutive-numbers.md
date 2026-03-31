---
layout: page
title: "Consecutive Numbers"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/consecutive-numbers"
---

# Consecutive Numbers / Số Xuất Hiện Liên Tiếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Self-JOIN / LAG+LEAD Window Functions
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Rising Temperature](https://leetcode.com/problems/rising-temperature) | [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn theo dõi nhật ký xe buýt — mỗi chuyến ghi số lượng hành khách. Bạn muốn biết con số nào xuất hiện **ít nhất 3 lần liên tiếp** theo thứ tự id. Giống như xem phim và muốn tìm cảnh quay lặp lại 3 khung hình liên tiếp.

**Pattern Recognition:**

- Signal: "same value in 3 consecutive rows" → **Self-JOIN 3 copies** or **LAG/LEAD** window functions
- Self-join: `l1.id = l2.id - 1 AND l2.id = l3.id - 1 AND l1.num = l2.num = l3.num`
- Key insight: Consecutive means consecutive `id` values (id+1, id+2), not just any 3 rows

**Visual:**

```
Logs table:
id | num
1  | 1
2  | 1
3  | 1    ← 1 appears at id 1,2,3 (consecutive) ✅
4  | 2
5  | 1
6  | 2
7  | 2

Self-join (l1,l2,l3 where ids = n, n+1, n+2):
(id1=1,id2=2,id3=3): nums=1,1,1 → match ✅
(id1=2,id2=3,id3=4): nums=1,1,2 → no match
...
(id1=5,id2=6,id3=7): nums=1,2,2 → no match

Result: DISTINCT [1]
```

---

## Problem Description

Given `Logs(id, num)` where `id` is sequential auto-increment, find all numbers that appear **at least 3 times consecutively**. Return distinct values in any order.

**Example:** `[1,1,1,2,1,2,2]` → `1` appears 3 times consecutively in positions 1-3.

**Constraints:** `1 <= n <= 10^5`, `id` is guaranteed sequential (no gaps in this problem).

---

## 📝 Interview Tips

1. **DISTINCT on result**: "Một số có thể xuất hiện nhiều chuỗi liên tiếp, DISTINCT đảm bảo không trùng" / Same number can form multiple consecutive runs — DISTINCT prevents duplicates
2. **Self-join on id**: "l1.id + 1 = l2.id AND l2.id + 1 = l3.id — không dùng WHERE id IN vì cần đúng thứ tự" / Join on sequential id ensures positional consecutiveness
3. **LAG/LEAD approach**: "LAG lấy giá trị hàng trước, LEAD lấy hàng sau — không cần join" / More efficient than 3-way self-join for large tables
4. **Gap in ids**: "Nếu id có gap (1,2,4) thì id+1 không đủ — phải dùng ROW_NUMBER() trước" / If ids aren't sequential, use ROW_NUMBER() to create artificial sequence
5. **Edge case**: "Chỉ 1-2 dòng → không thể có 3 liên tiếp → trả về rỗng" / Tables with <3 rows return empty result
6. **Follow-up**: "Nếu cần N lần liên tiếp thay vì 3?" / Self-join N copies or use window frame COUNT

---

## Solutions

### SQL Solution 1 — Triple Self-JOIN (Classic, Readable)

```sql
-- Time: O(n) — linear scan with index on id
-- Space: O(1)
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id + 1 = l2.id AND l1.num = l2.num
JOIN Logs l3 ON l2.id + 1 = l3.id AND l2.num = l3.num;
```

### SQL Solution 2 — LAG + LEAD Window Functions

```sql
-- Time: O(n log n) — window function ordering
-- Space: O(n) — window buffer
SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT num,
           LAG(num)  OVER (ORDER BY id) AS prev_num,
           LEAD(num) OVER (ORDER BY id) AS next_num
    FROM Logs
) t
WHERE num = prev_num AND num = next_num;
```

### SQL Solution 3 — CTE with Row Grouping

```sql
-- Group consecutive equal values using difference-of-rownumbers trick
WITH numbered AS (
    SELECT num,
           id,
           id - ROW_NUMBER() OVER (PARTITION BY num ORDER BY id) AS grp
    FROM Logs
),
grouped AS (
    SELECT num, grp, COUNT(*) AS cnt
    FROM numbered
    GROUP BY num, grp
)
SELECT DISTINCT num AS ConsecutiveNums
FROM grouped
WHERE cnt >= 3;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Consecutive Numbers
 * Time: O(n) — single linear scan
 * Space: O(k) — k = distinct qualifying values
 */
interface Log {
  id: number;
  num: number;
}

function consecutiveNumbers(logs: Log[]): number[] {
  // Sort by id (assume sequential but sort to be safe)
  const sorted = [...logs].sort((a, b) => a.id - b.id);
  const result = new Set<number>();

  // Sliding window of 3
  for (let i = 0; i + 2 < sorted.length; i++) {
    const a = sorted[i],
      b = sorted[i + 1],
      c = sorted[i + 2];
    // Check ids are consecutive AND values are equal
    if (b.id === a.id + 1 && c.id === b.id + 1 && a.num === b.num && b.num === c.num) {
      result.add(a.num);
    }
  }

  return [...result];
}

// === Test Cases ===
const logs1 = [
  { id: 1, num: 1 },
  { id: 2, num: 1 },
  { id: 3, num: 1 },
  { id: 4, num: 2 },
  { id: 5, num: 1 },
  { id: 6, num: 2 },
  { id: 7, num: 2 },
];
console.log(consecutiveNumbers(logs1)); // [1]

// Edge: number appears in two separate runs of 3
const logs2 = [
  { id: 1, num: 5 },
  { id: 2, num: 5 },
  { id: 3, num: 5 },
  { id: 4, num: 9 },
  { id: 5, num: 5 },
  { id: 6, num: 5 },
  { id: 7, num: 5 },
];
console.log(consecutiveNumbers(logs2)); // [5] — DISTINCT

console.log(
  consecutiveNumbers([
    { id: 1, num: 1 },
    { id: 2, num: 2 },
  ]),
); // []
```

---

## 🔗 Related Problems

- [Rising Temperature](https://leetcode.com/problems/rising-temperature) — compare adjacent rows
- [Human Traffic of Stadium](https://leetcode.com/problems/human-traffic-of-stadium) — 3 consecutive rows with condition
- [Find the Start and End Number of Continuous Ranges](https://leetcode.com/problems/find-the-start-and-end-number-of-continuous-ranges) — group consecutive IDs
- [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) — ranking per group
