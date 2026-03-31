---
layout: page
title: "Nth Highest Salary"
difficulty: Medium
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/nth-highest-salary"
---

# Nth Highest Salary / Mức Lương Cao Thứ N

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: SQL Function / OFFSET
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Second Highest Salary](https://leetcode.com/problems/second-highest-salary) | [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn có danh sách lương đã sắp xếp giảm dần. Muốn lấy lương cao thứ N, bạn đếm N-1 lần từ đầu rồi lấy giá trị tiếp theo. Nếu không có đủ N mức lương khác nhau, trả về NULL (không bỏ qua duplicate).

**Pattern Recognition:**

- Signal: "Nth distinct value" → **DISTINCT + ORDER BY DESC + LIMIT 1 OFFSET N-1**
- MySQL stored function syntax: `CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT`
- Key insight: DISTINCT loại trùng trước, OFFSET bỏ qua N-1 giá trị lớn nhất, lấy giá trị thứ N

**Visual:**

```
salary column: 300, 200, 200, 100
DISTINCT DESC: 300, 200, 100
               [0]  [1]  [2]  ← OFFSET index

getNthHighestSalary(1) → OFFSET 0 → 300
getNthHighestSalary(2) → OFFSET 1 → 200
getNthHighestSalary(3) → OFFSET 2 → 100
getNthHighestSalary(4) → OFFSET 3 → NULL (not enough rows)
```

---

## Problem Description

Write a SQL function `getNthHighestSalary(N INT)` that returns the Nth highest **distinct** salary from the `Employee(id, salary)` table. Return `NULL` if there are fewer than N distinct salaries.

**Example 1:** Salaries `[300, 200, 100]`, N=2 → `200`
**Example 2:** Salaries `[100]`, N=2 → `NULL`

**Constraints:** `1 <= N <= 1000`, salary is non-negative integer.

---

## 📝 Interview Tips

1. **DISTINCT is mandatory**: "Không có DISTINCT thì duplicate salary bị đếm nhiều lần" / Without DISTINCT, two employees earning 200 would make it appear twice in rank
2. **OFFSET = N-1**: "Offset bắt đầu từ 0, nên N=1 thì OFFSET=0" / SQL OFFSET is 0-indexed — store `M = N-1` inside the function
3. **Return NULL when not found**: "LIMIT 1 OFFSET quá lớn sẽ trả về empty set, cần convert sang NULL" / Wrap with subquery or use `IFNULL` / `COALESCE`
4. **MySQL function syntax**: "Cần khai báo DECLARE M INT; SET M=N-1; rồi dùng M trong LIMIT" / Variables inside function must be declared with DECLARE
5. **DENSE_RANK alternative**: "Có thể dùng DENSE_RANK() = N thay vì OFFSET" / Window function approach is more portable
6. **Follow-up**: "Nếu N=0 hoặc âm? Cần validate input" / Guard against invalid N values

---

## Solutions

### SQL Solution 1 — MySQL Stored Function with LIMIT/OFFSET

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    DECLARE M INT;
    SET M = N - 1;          -- OFFSET is 0-indexed
    RETURN (
        SELECT DISTINCT salary
        FROM Employee
        ORDER BY salary DESC
        LIMIT 1 OFFSET M    -- skip M rows, take 1
    );
END
```

### SQL Solution 2 — DENSE_RANK Window Function

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    RETURN (
        SELECT salary FROM (
            SELECT salary,
                   DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
            FROM Employee
        ) ranked
        WHERE rnk = N
        LIMIT 1
    );
END
```

### SQL Solution 3 — Correlated Subquery (No Window Functions)

```sql
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
    RETURN (
        SELECT DISTINCT e1.salary
        FROM Employee e1
        WHERE N - 1 = (
            SELECT COUNT(DISTINCT e2.salary)
            FROM Employee e2
            WHERE e2.salary > e1.salary
        )
    );
END
```

### TypeScript Simulation

```typescript
/**
 * Simulate: getNthHighestSalary
 * Time: O(n log n) — sort deduplicated salaries
 * Space: O(n) — unique salary set
 */
function getNthHighestSalary(salaries: number[], n: number): number | null {
  // Get distinct salaries sorted descending
  const unique = [...new Set(salaries)].sort((a, b) => b - a);

  // 1-indexed: Nth highest is at index N-1
  const idx = n - 1;
  return idx < unique.length ? unique[idx] : null;
}

// === Test Cases ===
console.log(getNthHighestSalary([300, 200, 200, 100], 2)); // 200
console.log(getNthHighestSalary([300, 200, 200, 100], 1)); // 300
console.log(getNthHighestSalary([300, 200, 200, 100], 3)); // 100
console.log(getNthHighestSalary([100], 2)); // null
console.log(getNthHighestSalary([], 1)); // null

// Verify: N=1 always equals MAX
console.log(getNthHighestSalary([500, 300, 100], 1) === 500); // true
```

---

## 🔗 Related Problems

- [Second Highest Salary](https://leetcode.com/problems/second-highest-salary) — special case N=2
- [Department Top Three Salaries](https://leetcode.com/problems/department-top-three-salaries) — top N per group
- [Rank Scores](https://leetcode.com/problems/rank-scores) — DENSE_RANK pattern
- [Find the Quiet Students in All Exams](https://leetcode.com/problems/find-the-quiet-students-in-all-exams) — ranking across groups
