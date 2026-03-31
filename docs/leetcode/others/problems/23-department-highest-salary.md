---
layout: page
title: "Department Highest Salary"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/department-highest-salary"
---

# Department Highest Salary / Lương Cao Nhất Theo Phòng Ban

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: SQL — GROUP BY + JOIN
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Second Highest Salary](https://leetcode.com/problems/second-highest-salary) | [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm "quán quân lương" ở mỗi phòng ban — GROUP BY department để lấy MAX, rồi JOIN lại để lấy tên nhân viên có lương bằng MAX đó.

**Pattern Recognition:**

- Signal: "find rows matching per-group maximum" → **GROUP BY + JOIN or IN subquery**
- Có thể có nhiều người cùng lương cao nhất trong một phòng → trả về tất cả
- Key insight: subquery lấy (departmentId, max salary), rồi join với Employee

**Visual — Two-step approach:**

```
Employee:            Department:
id  name  salary  deptId    id  name
1   Joe   70000   1         1   IT
2   Jim   90000   1         2   Sales
3   Henry 80000   2
4   Sam   60000   2
5   Max   90000   1

Step 1: MAX per dept → {1: 90000, 2: 80000}
Step 2: JOIN → employees where salary = dept_max
Result: Jim(IT,90000), Max(IT,90000), Henry(Sales,80000)
```

---

## Problem Description

Write SQL to find employees who have the **highest salary** in each department. Return `Department`, `Employee`, `Salary`. ([LeetCode 184](https://leetcode.com/problems/department-highest-salary))

**Schema:** `Employee(id, name, salary, departmentId)`, `Department(id, name)`

**Example:** Department IT has max 90000 → Jim and Max; Sales has max 80000 → Henry.

Constraints: Multiple employees can share the same max salary per department.

---

## 📝 Interview Tips

1. **Clarify**: "Có thể nhiều người cùng lương cao nhất không?" / Multiple employees can tie for max salary
2. **Approach**: "GROUP BY dept → MAX salary → JOIN lại" / Subquery for max per dept, then join
3. **IN vs JOIN**: "Dùng `WHERE (deptId, salary) IN (subquery)` hoặc JOIN đều được" / Both work; tuple IN is cleaner
4. **NULL**: "Department không có nhân viên → không cần show" / Departments with no employees aren't expected
5. **DENSE_RANK**: "Alternative: dùng window function DENSE_RANK() OVER PARTITION" / Window function is elegant

---

## Solutions

```sql
-- Solution 1: Subquery with tuple IN (clean)
SELECT d.name AS Department,
       e.name AS Employee,
       e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);

-- Solution 2: JOIN with aggregated subquery (portable)
SELECT d.name AS Department,
       e.name AS Employee,
       e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
JOIN (
    SELECT departmentId, MAX(salary) AS maxSalary
    FROM Employee
    GROUP BY departmentId
) m ON e.departmentId = m.departmentId AND e.salary = m.maxSalary;

-- Solution 3: Window function (MySQL 8+, elegant)
SELECT Department, Employee, Salary
FROM (
    SELECT d.name AS Department,
           e.name AS Employee,
           e.salary AS Salary,
           DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
) ranked
WHERE rnk = 1;
```

```typescript
// TypeScript simulation for logic verification
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

/**
 * Simulate Department Highest Salary query in TypeScript
 * Time: O(n) — single pass to find max per dept, then filter
 * Space: O(d) — d = number of departments
 */
function departmentHighestSalary(
  employees: Employee[],
  departments: Department[],
): { Department: string; Employee: string; Salary: number }[] {
  // Step 1: find max salary per department
  const maxSalary = new Map<number, number>();
  for (const e of employees) {
    maxSalary.set(e.departmentId, Math.max(maxSalary.get(e.departmentId) ?? 0, e.salary));
  }

  // Step 2: build dept name lookup
  const deptName = new Map(departments.map((d) => [d.id, d.name]));

  // Step 3: filter employees matching their dept's max
  return employees
    .filter((e) => e.salary === maxSalary.get(e.departmentId))
    .map((e) => ({
      Department: deptName.get(e.departmentId)!,
      Employee: e.name,
      Salary: e.salary,
    }));
}

// === Test Cases ===
const employees = [
  { id: 1, name: "Joe", salary: 70000, departmentId: 1 },
  { id: 2, name: "Jim", salary: 90000, departmentId: 1 },
  { id: 3, name: "Henry", salary: 80000, departmentId: 2 },
  { id: 4, name: "Sam", salary: 60000, departmentId: 2 },
  { id: 5, name: "Max", salary: 90000, departmentId: 1 },
];
const departments = [
  { id: 1, name: "IT" },
  { id: 2, name: "Sales" },
];
console.log(departmentHighestSalary(employees, departments));
// [{Department:'IT',Employee:'Jim',Salary:90000}, {Department:'IT',Employee:'Max',Salary:90000}, {Department:'Sales',Employee:'Henry',Salary:80000}]
```

---

## 🔗 Related Problems

- [Second Highest Salary](https://leetcode.com/problems/second-highest-salary) — per-table rank query
- [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) — DENSE_RANK per dept
- [Nth Highest Salary](https://leetcode.com/problems/nth-highest-salary) — parameterized rank
- [Employees Earning More Than Their Managers](https://leetcode.com/problems/employees-earning-more-than-their-managers) — self-join
- [Department Highest Salary — LeetCode](https://leetcode.com/problems/department-highest-salary) — problem page
