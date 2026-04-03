---
layout: page
title: "Second Highest Salary"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/second-highest-salary"
---

# Second Highest Salary / Mức Lương Cao Thứ Hai

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: SQL Subquery / OFFSET / Window Function
> **Frequency**: 📘 Tier 2 — Bài SQL kinh điển trong phỏng vấn; xuất hiện tại hầu hết công ty có SQL round
> **See also**: [Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary) | [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như tìm người về nhì trong cuộc thi — không thể chỉ `ORDER BY salary DESC LIMIT 1` (đó là quán quân). Cần loại trừ max trước, rồi lấy max của phần còn lại. Hoặc dùng `OFFSET 1` để bỏ qua hạng nhất.

- **Pattern Recognition:**
  - **Subquery**: `MAX(salary) WHERE salary < (SELECT MAX(salary) ...)`
  - **IFNULL + OFFSET**: `IFNULL((SELECT DISTINCT salary ORDER BY DESC LIMIT 1 OFFSET 1), NULL)`
  - **DENSE_RANK**: `WHERE rank = 2` — tổng quát hoá dễ dàng thành Nth highest
  - Phải trả về `NULL` nếu không có hạng 2 (chỉ có 0 hoặc 1 mức lương phân biệt)

- **Visual — Bảng Employee:**

  ```
  +----+--------+
  | id | salary |
  +----+--------+
  |  1 |    100 |
  |  2 |    200 |
  |  3 |    300 |
  +----+--------+
  MAX = 300 → second = MAX(salary < 300) = 200 ✅

  Chỉ một mức lương [100,100]:
  MAX = 100 → SELECT MAX(salary < 100) → NULL ✅
  ```

## Problem Description

Viết SQL query trả về mức lương cao thứ 2 (`SecondHighestSalary`) từ bảng `Employee`. Nếu không tồn tại mức lương cao thứ 2, trả về `null`.

| Employee Table           | Output |
| ------------------------ | ------ |
| salaries: 100, 200, 300  | `200`  |
| salaries: 100 (only one) | `null` |

## 📝 Interview Tips

- 🇻🇳 Luôn dùng `DISTINCT` để tránh trùng lặp — `[300, 300, 200]` → second highest là 200, không phải 300 lần thứ 2 / 🇬🇧 _Always use DISTINCT — duplicate max salaries should still yield one unique second highest_
- 🇻🇳 `IFNULL(expr, NULL)` đảm bảo subquery trả về NULL thay vì empty set / 🇬🇧 _IFNULL wraps the subquery to return NULL instead of no rows when second doesn't exist_
- 🇻🇳 `DENSE_RANK` là cách tổng quát nhất — dễ mở rộng thành Nth highest bằng cách đổi `rank = 2` / 🇬🇧 _DENSE_RANK generalizes to Nth highest by changing rank = N_
- 🇻🇳 Không dùng `LIMIT 1,1` vì MySQL-specific; prefer `LIMIT 1 OFFSET 1` hoặc subquery / 🇬🇧 _Avoid MySQL-only syntax like LIMIT 1,1; use LIMIT 1 OFFSET 1 for portability_
- 🇻🇳 Nếu hỏi "giải thích tại sao NULL": subquery có thể trả về empty → cần bọc IFNULL / 🇬🇧 _Explain NULL: inner SELECT returns empty set → outer query returns NULL without IFNULL wrapper_

## Solutions

```sql
-- Solution 1: Subquery — MAX excluding the highest
-- Tìm MAX của tập con salary nhỏ hơn MAX toàn bộ.
-- Trả về NULL tự động nếu không có hạng 2.
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Solution 2: IFNULL + DISTINCT + OFFSET
-- Sắp xếp DESC, bỏ qua 1 hàng (max), lấy 1 hàng tiếp theo.
-- IFNULL bọc ngoài để đảm bảo trả về NULL khi không có kết quả.
SELECT IFNULL(
  (SELECT DISTINCT salary
   FROM Employee
   ORDER BY salary DESC
   LIMIT 1 OFFSET 1),
  NULL
) AS SecondHighestSalary;

-- Solution 3: DENSE_RANK — Generalizable to Nth Highest
-- DENSE_RANK xử lý đúng trường hợp duplicate salary.
-- Dễ mở rộng: chỉ cần đổi rank = 2 thành rank = N.
SELECT MAX(salary) AS SecondHighestSalary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee
) ranked
WHERE rnk = 2;
```

```typescript
/**
 * Solution 4: TypeScript Array Simulation
 * Mô phỏng SQL query bằng JavaScript array operations.
 * Hữu ích cho phỏng vấn frontend/fullstack.
 *
 * @time O(n log n) — sort + dedup
 * @space O(n) — unique salaries array
 */
function secondHighestSalary(employees: { id: number; salary: number }[]): number | null {
  // Lấy danh sách lương phân biệt, sắp xếp giảm dần
  const unique = [...new Set(employees.map((e) => e.salary))].sort((a, b) => b - a);

  // Hạng 2 là index 1 (0-indexed), trả về null nếu không tồn tại
  return unique.length >= 2 ? unique[1] : null;
}

// Test cases
const employees = [
  { id: 1, salary: 100 },
  { id: 2, salary: 200 },
  { id: 3, salary: 300 },
];
console.log(secondHighestSalary(employees)); // 200

const singleSalary = [{ id: 1, salary: 100 }];
console.log(secondHighestSalary(singleSalary)); // null

const duplicates = [
  { id: 1, salary: 300 },
  { id: 2, salary: 300 },
  { id: 3, salary: 200 },
];
console.log(secondHighestSalary(duplicates)); // 200

const onlyOne = [{ id: 1, salary: 500 }];
console.log(secondHighestSalary(onlyOne)); // null
```

## 🔗 Related Problems

| Problem                                                                                           | Pattern                   | Difficulty |
| ------------------------------------------------------------------------------------------------- | ------------------------- | ---------- |
| [177. Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary)                       | SQL Variable / DENSE_RANK | 🟡 Medium  |
| [184. Department Highest Salary](https://leetcode.com/problems/department-highest-salary)         | GROUP BY + JOIN           | 🟡 Medium  |
| [185. Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) | DENSE_RANK + Partition    | 🔴 Hard    |
| [178. Rank Scores](https://leetcode.com/problems/rank-scores)                                     | DENSE_RANK                | 🟡 Medium  |
