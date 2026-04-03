---
layout: page
title: "Students and Examinations"
difficulty: Easy
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/students-and-examinations"
---

# Students and Examinations / Học Sinh Và Các Kỳ Thi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: CROSS JOIN + LEFT JOIN + GROUP BY
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Managers with at Least 5 Direct Reports](https://leetcode.com/problems/managers-with-at-least-5-direct-reports) | [Article Views I](https://leetcode.com/problems/article-views-i)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giả sử trường có 3 học sinh và 2 môn học. Điểm danh kỳ thi cần liệt kê **tất cả tổ hợp** học sinh × môn học (dù em đó có thi hay không). Đây là CROSS JOIN. Sau đó, đếm em đó đã thi môn đó bao nhiêu lần bằng LEFT JOIN với bảng điểm thi. Nếu chưa thi lần nào → hiện 0.

**Pattern Recognition:**

- Signal: "every student × every subject combination" → **CROSS JOIN**
- Signal: "count attendance, show 0 if none" → **LEFT JOIN** then COUNT
- Key insight: CROSS JOIN creates all (student, subject) pairs; LEFT JOIN with Examinations counts actual attendance

**Visual:**

```
Students: [1=Alice, 2=Bob]   Subjects: [Math, Physics]

CROSS JOIN → all pairs:
(1,Alice,Math), (1,Alice,Physics), (2,Bob,Math), (2,Bob,Physics)

Examinations: Alice took Math twice, Bob took Physics once
LEFT JOIN:
(Alice,Math)    → count=2 ✅
(Alice,Physics) → count=0 (no match, LEFT JOIN gives NULL→0)
(Bob,Math)      → count=0
(Bob,Physics)   → count=1 ✅

ORDER BY student_id, subject_name
```

---

## Problem Description

Given `Students(student_id, student_name)`, `Subjects(subject_name)`, and `Examinations(student_id, subject_name)`, return each student-subject pair with how many times the student attended that exam. Include rows with 0 attendance. Order by `student_id`, then `subject_name`.

**Example:** 3 students × 2 subjects = 6 rows; fill attendance counts from Examinations.

**Constraints:** `1 <= Students rows <= 500`, `1 <= Subjects rows <= 10`, exam records may repeat.

---

## 📝 Interview Tips

1. **CROSS JOIN first**: "Tạo hết tất cả tổ hợp (student × subject) trước, không bỏ sót cặp nào" / Generate all pairs before joining — ensures even (0-attendance) rows appear
2. **LEFT JOIN not INNER JOIN**: "INNER JOIN sẽ bỏ những cặp chưa có kỳ thi, cần LEFT JOIN để giữ lại với count=0" / LEFT JOIN preserves unmatched pairs
3. **COUNT vs COUNT(\*)**: "COUNT(e.student_id) đếm không NULL — NULL nghĩa là không thi, trả về 0" / COUNT on the nullable joined column gives 0 when no exam found
4. **GROUP BY both columns**: "GROUP BY student_id, subject_name — không chỉ GROUP BY student_id" / Must group on both columns for correct counts per pair
5. **ORDER BY**: "Bài yêu cầu ORDER BY student_id, subject_name" / Output must be sorted as specified
6. **No subquery needed**: "Giải pháp chỉ cần CROSS JOIN + LEFT JOIN + GROUP BY — không cần subquery" / Clean single-query solution

---

## Solutions

### SQL Solution 1 — CROSS JOIN + LEFT JOIN (Standard)

```sql
-- Time: O(s * sub * e) — s students, sub subjects, e exams
-- Space: O(s * sub) — all combinations
SELECT st.student_id,
       st.student_name,
       su.subject_name,
       COUNT(e.student_id) AS attended_exams
FROM Students st
CROSS JOIN Subjects su
LEFT JOIN Examinations e
  ON st.student_id = e.student_id
 AND su.subject_name = e.subject_name
GROUP BY st.student_id, st.student_name, su.subject_name
ORDER BY st.student_id, su.subject_name;
```

### SQL Solution 2 — Subquery for Exam Counts

```sql
-- Pre-aggregate examinations, then join
SELECT st.student_id,
       st.student_name,
       su.subject_name,
       COALESCE(ec.cnt, 0) AS attended_exams
FROM Students st
CROSS JOIN Subjects su
LEFT JOIN (
    SELECT student_id, subject_name, COUNT(*) AS cnt
    FROM Examinations
    GROUP BY student_id, subject_name
) ec ON st.student_id = ec.student_id
     AND su.subject_name = ec.subject_name
ORDER BY st.student_id, su.subject_name;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Students and Examinations
 * Time: O(s * sub + e) — s students, sub subjects, e exams
 * Space: O(s * sub) — all pairs
 */
interface Student {
  student_id: number;
  student_name: string;
}
interface Subject {
  subject_name: string;
}
interface Exam {
  student_id: number;
  subject_name: string;
}
interface Result {
  student_id: number;
  student_name: string;
  subject_name: string;
  attended_exams: number;
}

function studentsAndExaminations(
  students: Student[],
  subjects: Subject[],
  exams: Exam[],
): Result[] {
  // Count exams per (student_id, subject_name)
  const examCount = new Map<string, number>();
  for (const e of exams) {
    const key = `${e.student_id}|${e.subject_name}`;
    examCount.set(key, (examCount.get(key) ?? 0) + 1);
  }

  // CROSS JOIN: every student × every subject
  const result: Result[] = [];
  for (const st of students) {
    for (const su of subjects) {
      const key = `${st.student_id}|${su.subject_name}`;
      result.push({
        student_id: st.student_id,
        student_name: st.student_name,
        subject_name: su.subject_name,
        attended_exams: examCount.get(key) ?? 0,
      });
    }
  }

  // ORDER BY student_id, subject_name
  return result.sort(
    (a, b) => a.student_id - b.student_id || a.subject_name.localeCompare(b.subject_name),
  );
}

// === Test Cases ===
const students = [
  { student_id: 1, student_name: "Alice" },
  { student_id: 2, student_name: "Bob" },
  { student_id: 13, student_name: "John" },
];
const subjects = [
  { subject_name: "Math" },
  { subject_name: "Physics" },
  { subject_name: "Programming" },
];
const exams = [
  { student_id: 1, subject_name: "Math" },
  { student_id: 1, subject_name: "Physics" },
  { student_id: 1, subject_name: "Programming" },
  { student_id: 2, subject_name: "Math" },
  { student_id: 1, subject_name: "Math" },
  { student_id: 13, subject_name: "Math" },
  { student_id: 13, subject_name: "Programming" },
];

console.log(studentsAndExaminations(students, subjects, exams));
// Alice: Math=2, Physics=1, Programming=1
// Bob: Math=1, Physics=0, Programming=0
// John: Math=1, Physics=0, Programming=1
```

---

## 🔗 Related Problems

- [Game Play Analysis I](https://leetcode.com/problems/game-play-analysis-i) — aggregate per user
- [Find the Missing IDs](https://leetcode.com/problems/find-missing-ids) — generate all values
- [Managers with at Least 5 Direct Reports](https://leetcode.com/problems/managers-with-at-least-5-direct-reports) — GROUP BY + HAVING
- [Immediate Food Delivery II](https://leetcode.com/problems/immediate-food-delivery-ii) — conditional aggregation
