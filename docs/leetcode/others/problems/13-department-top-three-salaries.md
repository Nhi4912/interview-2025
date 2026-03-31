---
layout: page
title: "Department Top Three Salaries"
difficulty: Hard
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/department-top-three-salaries"
---

# Department Top Three Salaries / Lương Top 3 Theo Phòng Ban

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Window Function / Ranking
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary) | [Second Highest Salary](https://leetcode.com/problems/second-highest-salary)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Hãy tưởng tượng bạn là HR manager cần lập danh sách "top 3 lương cao nhất" cho từng phòng ban để báo cáo lên CEO. Bạn không nhìn toàn công ty — bạn xét riêng từng phòng, xếp hạng lương trong phòng đó, rồi lấy những người có hạng 1, 2, 3.

**Pattern Recognition:**

- Signal: "top N per group" → **DENSE_RANK() window function** partitioned by group
- `DENSE_RANK` thay vì `RANK` vì cùng lương = cùng hạng (không bỏ hạng)
- Key insight: `DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) <= 3`

**Visual:**

```
Employee table:          Department table:
id | name  | salary | deptId    id | name
1  | Joe   | 85000  | 1         1  | IT
2  | Henry | 80000  | 2         2  | Sales
3  | Sam   | 60000  | 2
4  | Max   | 90000  | 1
5  | Janet | 69000  | 1
6  | Randy | 85000  | 1

PARTITION BY deptId, rank by salary DESC:
IT dept:  Max=90000→rank1, Joe=85000→rank2, Randy=85000→rank2, Janet=69000→rank3
Sales:    Henry=80000→rank1, Sam=60000→rank2

Result: IT: Max,Joe,Randy,Janet  |  Sales: Henry,Sam
```

---

## Problem Description

Given `Employee(id, name, salary, departmentId)` and `Department(id, name)`, find employees who earn one of the **top three unique salaries** in their department. Return `Department`, `Employee`, `Salary` columns.

**Example:**

- IT dept salaries: 90000, 85000, 69000 → top 3 unique values ✓ (85000 appears twice but counts as rank 2)
- A dept with only 2 distinct salaries → return those 2

**Constraints:** `1 <= Employee rows <= 10^4`, salary is a positive integer.

---

## 📝 Interview Tips

1. **Clarify DENSE_RANK vs RANK**: "Nếu 2 người cùng lương thứ 2, DENSE_RANK cho cả hai rank=2 và người kế tiếp rank=3, còn RANK bỏ rank=3" / DENSE_RANK doesn't skip ranks after ties — use it for "top N unique salaries"
2. **Subquery alternative**: "Có thể dùng subquery đếm distinct salary lớn hơn" / `WHERE (SELECT COUNT(DISTINCT s2) FROM e2 WHERE s2 > e1.salary AND dept=same) < 3`
3. **Edge case**: "Phòng có ít hơn 3 mức lương vẫn trả về tất cả" / Departments with <3 distinct salaries still appear
4. **Performance**: "Window function chỉ scan table một lần, subquery scan N lần" / Window functions are O(n log n) vs subquery O(n²)
5. **NULL handling**: "Salary NULL không được xếp hạng, cần kiểm tra" / Filter NULLs before ranking
6. **Follow-up**: "Nếu cần top 5? Chỉ đổi <= 3 thành <= 5" / Parameterize the rank threshold

---

## Solutions

### SQL Solution 1 — DENSE_RANK Window Function (Optimal)

```sql
-- Time: O(n log n) — one pass with ranking
-- Space: O(n) — rank computed inline
SELECT d.name AS Department,
       e.name AS Employee,
       e.salary AS Salary
FROM (
    SELECT name,
           salary,
           departmentId,
           DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
    FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rnk <= 3
ORDER BY d.name, e.salary DESC;
```

### SQL Solution 2 — Correlated Subquery (Classic)

```sql
-- Time: O(n²) — correlated subquery per row
-- Space: O(1) — no extra storage
SELECT d.name AS Department,
       e.name AS Employee,
       e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (
    SELECT COUNT(DISTINCT e2.salary)
    FROM Employee e2
    WHERE e2.departmentId = e.departmentId
      AND e2.salary > e.salary
) < 3
ORDER BY d.name, e.salary DESC;
```

### SQL Solution 3 — CTE with DENSE_RANK

```sql
-- Clean readable version using CTE
WITH RankedSalaries AS (
    SELECT name,
           salary,
           departmentId,
           DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
    FROM Employee
)
SELECT d.name AS Department,
       rs.name AS Employee,
       rs.salary AS Salary
FROM RankedSalaries rs
JOIN Department d ON rs.departmentId = d.id
WHERE rs.rnk <= 3;
```

### TypeScript Simulation

```typescript
/**
 * Simulate SQL: Department Top Three Salaries
 * Time: O(n log n) — sort per department
 * Space: O(n) — grouped map
 */
interface Employee {
  id: number;
  name: string;
  salary: number;
  departmentId: number;
}
interface Department {
  id: number;
  name: string;
}

function departmentTopThreeSalaries(
  employees: Employee[],
  departments: Department[],
): Array<{ Department: string; Employee: string; Salary: number }> {
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));

  // Group employees by department
  const byDept = new Map<number, Employee[]>();
  for (const e of employees) {
    if (!byDept.has(e.departmentId)) byDept.set(e.departmentId, []);
    byDept.get(e.departmentId)!.push(e);
  }

  const result: Array<{ Department: string; Employee: string; Salary: number }> = [];

  for (const [deptId, emps] of byDept) {
    const deptName = deptMap.get(deptId) ?? "Unknown";
    // Get top 3 unique salaries using DENSE_RANK logic
    const uniqueSalaries = [...new Set(emps.map((e) => e.salary))].sort((a, b) => b - a);
    const top3 = new Set(uniqueSalaries.slice(0, 3));

    for (const emp of emps) {
      if (top3.has(emp.salary)) {
        result.push({ Department: deptName, Employee: emp.name, Salary: emp.salary });
      }
    }
  }

  return result.sort((a, b) => a.Department.localeCompare(b.Department) || b.Salary - a.Salary);
}

// === Test Cases ===
const employees = [
  { id: 1, name: "Joe", salary: 85000, departmentId: 1 },
  { id: 2, name: "Henry", salary: 80000, departmentId: 2 },
  { id: 3, name: "Sam", salary: 60000, departmentId: 2 },
  { id: 4, name: "Max", salary: 90000, departmentId: 1 },
  { id: 5, name: "Janet", salary: 69000, departmentId: 1 },
  { id: 6, name: "Randy", salary: 85000, departmentId: 1 },
];
const departments = [
  { id: 1, name: "IT" },
  { id: 2, name: "Sales" },
];

console.log(departmentTopThreeSalaries(employees, departments));
// IT: Max(90000), Joe(85000), Randy(85000), Janet(69000)
// Sales: Henry(80000), Sam(60000)
```

---

## 🔗 Related Problems

- [Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary) — ranking single column
- [Second Highest Salary](https://leetcode.com/problems/second-highest-salary) — rank=2 special case
- [Rank Scores](https://leetcode.com/problems/rank-scores) — DENSE_RANK pattern
- [Managers with at Least 5 Direct Reports](https://leetcode.com/problems/managers-with-at-least-5-direct-reports) — GROUP BY + JOIN
