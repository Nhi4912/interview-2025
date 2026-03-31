---
layout: page
title: "Managers with at Least 5 Direct Reports"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/managers-with-at-least-5-direct-reports"
---

# Managers with at Least 5 Direct Reports / Quản Lý Có Ít Nhất 5 Nhân Viên Trực Tiếp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: GROUP BY + HAVING + Self-JOIN
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) | [Employees Earning More Than Their Managers](https://leetcode.com/problems/employees-earning-more-than-their-managers)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn là trưởng phòng nhân sự cần tìm những "manager bận rộn" — những người đang quản lý từ 5 người trở lên. Bạn đếm trong bảng nhân viên xem mỗi `managerId` xuất hiện bao nhiêu lần, rồi lọc ra những manager có >= 5 báo cáo trực tiếp.

**Pattern Recognition:**

- Signal: "count subordinates per manager" → **GROUP BY managerId HAVING COUNT(\*) >= 5**
- Sau đó JOIN lại với bảng Employee để lấy tên manager
- Key insight: `managerId` trong bảng Employee tham chiếu đến `id` của chính bảng đó (self-reference)

**Visual:**

```
Employee table:
id | name    | managerId
1  | Alice   | NULL      ← CEO (no manager)
2  | Bob     | 1         ← reports to Alice
3  | Carol   | 1         ← reports to Alice
4  | Dave    | 1         ← reports to Alice
5  | Eve     | 1         ← reports to Alice
6  | Frank   | 1         ← reports to Alice
7  | Grace   | 2         ← reports to Bob

COUNT per managerId:
managerId=1 → 5 reports (Bob,Carol,Dave,Eve,Frank) ✅ >= 5
managerId=2 → 1 report  (Grace)                    ❌ < 5

Result: Alice (id=1)
```

---

## Problem Description

Given `Employee(id, name, department, managerId)`, find the names of managers who have **at least 5 direct reports**. A manager is an employee whose `id` appears as another employee's `managerId`.

**Example:** Alice manages 5 employees → return "Alice". Bob manages 1 → not returned.

**Constraints:** `1 <= n <= 500`, `managerId` is NULL or a valid employee id.

---

## 📝 Interview Tips

1. **Self-JOIN insight**: "Cùng một bảng, vừa đóng vai nhân viên vừa đóng vai manager" / The same table acts as both employee and manager — join Employee to itself
2. **HAVING vs WHERE**: "WHERE lọc từng dòng trước khi group, HAVING lọc sau khi đã group" / Use HAVING to filter on aggregate COUNT, not WHERE
3. **NULL managerId**: "managerId NULL nghĩa là CEO, không phải lỗi dữ liệu" / NULL managerId means top-level employee, skip them in the join
4. **Alternative subquery**: "Dùng subquery IN thay vì JOIN cũng được" / `WHERE id IN (SELECT managerId FROM Employee GROUP BY managerId HAVING COUNT(*)>=5)`
5. **Edge case**: "Manager có đúng 5 report thì vẫn tính" / Exactly 5 reports satisfies >= 5
6. **Follow-up**: "Nếu cần tìm manager có >= N reports, N truyền vào?" / Parameterize the threshold

---

## Solutions

### SQL Solution 1 — GROUP BY + HAVING + JOIN (Optimal)

```sql
-- Time: O(n) — single scan + group
-- Space: O(m) — m = distinct managers
SELECT e.name
FROM Employee e
JOIN (
    SELECT managerId
    FROM Employee
    WHERE managerId IS NOT NULL
    GROUP BY managerId
    HAVING COUNT(*) >= 5
) AS mgr ON e.id = mgr.managerId;
```

### SQL Solution 2 — Subquery with IN

```sql
-- Clean alternative using IN subquery
SELECT name
FROM Employee
WHERE id IN (
    SELECT managerId
    FROM Employee
    WHERE managerId IS NOT NULL
    GROUP BY managerId
    HAVING COUNT(*) >= 5
);
```

### SQL Solution 3 — CTE for Readability

```sql
WITH ManagerCounts AS (
    SELECT managerId, COUNT(*) AS report_count
    FROM Employee
    WHERE managerId IS NOT NULL
    GROUP BY managerId
    HAVING COUNT(*) >= 5
)
SELECT e.name
FROM Employee e
JOIN ManagerCounts mc ON e.id = mc.managerId;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Managers with at Least 5 Direct Reports
 * Time: O(n) — single pass to count, one pass to filter
 * Space: O(m) — m distinct manager IDs
 */
interface Employee {
  id: number;
  name: string;
  department: string;
  managerId: number | null;
}

function managersWithAtLeast5Reports(employees: Employee[]): string[] {
  // Count direct reports per managerId
  const reportCount = new Map<number, number>();
  for (const emp of employees) {
    if (emp.managerId !== null) {
      reportCount.set(emp.managerId, (reportCount.get(emp.managerId) ?? 0) + 1);
    }
  }

  // Find managers with >= 5 direct reports
  const qualifyingIds = new Set<number>();
  for (const [managerId, count] of reportCount) {
    if (count >= 5) qualifyingIds.add(managerId);
  }

  // Return their names
  return employees.filter((e) => qualifyingIds.has(e.id)).map((e) => e.name);
}

// === Test Cases ===
const employees = [
  { id: 1, name: "Alice", department: "A", managerId: null },
  { id: 2, name: "Bob", department: "A", managerId: 1 },
  { id: 3, name: "Carol", department: "A", managerId: 1 },
  { id: 4, name: "Dave", department: "A", managerId: 1 },
  { id: 5, name: "Eve", department: "A", managerId: 1 },
  { id: 6, name: "Frank", department: "A", managerId: 1 },
  { id: 7, name: "Grace", department: "B", managerId: 2 },
];

console.log(managersWithAtLeast5Reports(employees)); // ['Alice']

const edgeCase = [{ id: 1, name: "Solo", department: "X", managerId: null }];
console.log(managersWithAtLeast5Reports(edgeCase)); // [] — no managers qualify
```

---

## 🔗 Related Problems

- [Employees Earning More Than Their Managers](https://leetcode.com/problems/employees-earning-more-than-their-managers) — self-JOIN pattern
- [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) — GROUP BY + ranking
- [Find the Team Size](https://leetcode.com/problems/find-the-team-size) — count per group
- [Count Salary Categories](https://leetcode.com/problems/count-salary-categories) — GROUP BY + aggregate
