---
layout: page
title: "Article Views I"
difficulty: Easy
category: Others
tags: [Database]
leetcode_url: "https://leetcode.com/problems/article-views-i"
---

# Article Views I / Lượt Xem Bài Viết I

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Simple Filter + DISTINCT
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Rising Temperature](https://leetcode.com/problems/rising-temperature) | [Students and Examinations](https://leetcode.com/problems/students-and-examinations)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Bạn có nhật ký xem bài viết — ghi lại ai xem bài nào của tác giả nào. Bạn muốn tìm những tác giả đã **tự xem bài của chính mình** (tự đọc lại bài mình viết). Đây là khi `author_id = viewer_id` trong cùng một dòng log.

**Pattern Recognition:**

- Signal: "where two columns in same row are equal" → **WHERE author_id = viewer_id**
- Signal: "distinct, sorted" → **SELECT DISTINCT ... ORDER BY**
- Key insight: Không cần JOIN — điều kiện nằm hoàn toàn trong cùng một dòng

**Visual:**

```
Views table:
article_id | author_id | viewer_id | view_date
1          | 3         | 5         | 2019-08-01   ← viewer≠author, skip
1          | 3         | 6         | 2019-08-02   ← viewer≠author, skip
2          | 7         | 7         | 2019-08-01   ← author=viewer ✅
3          | 4         | 4         | 2019-08-03   ← author=viewer ✅
4          | 7         | 1         | 2019-07-22   ← viewer≠author, skip

WHERE author_id = viewer_id → ids {7, 4}
SELECT DISTINCT → [4, 7]
ORDER BY id ASC → [4, 7]
```

---

## Problem Description

Given `Views(article_id, author_id, viewer_id, view_date)`, find all authors who have viewed **at least one of their own articles**. Return `id` (author_id) sorted in ascending order. The same author may appear multiple times — use DISTINCT.

**Example:** Author 7 viewed article 2 themselves → include 7. Author 4 viewed article 3 themselves → include 4.

**Constraints:** No primary key (duplicate rows allowed), `1 <= rows <= 500`.

---

## 📝 Interview Tips

1. **One-table solution**: "Bài này chỉ cần một bảng, không cần JOIN" / No join required — the condition compares columns within the same row
2. **DISTINCT mandatory**: "author_id = viewer_id có thể xảy ra nhiều lần cho cùng tác giả" / An author may have viewed their own articles multiple times
3. **Column alias**: "Đổi tên cột thành 'id' trong SELECT để khớp output schema" / Output column name is `id`, not `author_id`
4. **ORDER BY ASC**: "ORDER BY id ASC — đây là mặc định nhưng nên viết tường minh" / Ascending order is default but be explicit
5. **Edge case**: "Không có tác giả nào tự xem bài → trả về bảng rỗng" / No matching rows returns empty result set
6. **No date filter needed**: "Bài không giới hạn ngày, lấy tất cả bản ghi" / No date constraint in this version (Article Views II may add one)

---

## Solutions

### SQL Solution 1 — Direct WHERE Filter (Simplest)

```sql
-- Time: O(n) — single table scan
-- Space: O(k) — k distinct authors who self-viewed
SELECT DISTINCT author_id AS id
FROM Views
WHERE author_id = viewer_id
ORDER BY id ASC;
```

### SQL Solution 2 — GROUP BY Alternative

```sql
-- Same result via GROUP BY (overkill but valid)
SELECT author_id AS id
FROM Views
WHERE author_id = viewer_id
GROUP BY author_id
ORDER BY author_id ASC;
```

### SQL Solution 3 — EXISTS Subquery (Verbose but educational)

```sql
-- Find authors who EXIST in Views as their own viewer
SELECT DISTINCT v1.author_id AS id
FROM Views v1
WHERE EXISTS (
    SELECT 1 FROM Views v2
    WHERE v2.author_id = v1.author_id
      AND v2.viewer_id = v1.author_id
)
ORDER BY id;
```

### TypeScript Simulation

```typescript
/**
 * Simulate: Article Views I
 * Time: O(n) — single pass through views
 * Space: O(k) — k distinct self-viewing authors
 */
interface View {
  article_id: number;
  author_id: number;
  viewer_id: number;
  view_date: string;
}

function articleViewsI(views: View[]): number[] {
  const selfViewers = new Set<number>();

  for (const v of views) {
    if (v.author_id === v.viewer_id) {
      selfViewers.add(v.author_id);
    }
  }

  // Return sorted ascending
  return [...selfViewers].sort((a, b) => a - b);
}

// === Test Cases ===
const views = [
  { article_id: 1, author_id: 3, viewer_id: 5, view_date: "2019-08-01" },
  { article_id: 1, author_id: 3, viewer_id: 6, view_date: "2019-08-02" },
  { article_id: 2, author_id: 7, viewer_id: 7, view_date: "2019-08-01" },
  { article_id: 3, author_id: 4, viewer_id: 4, view_date: "2019-08-03" },
  { article_id: 4, author_id: 7, viewer_id: 1, view_date: "2019-07-22" },
];
console.log(articleViewsI(views)); // [4, 7]

// Edge: no self-viewers
const views2 = [{ article_id: 1, author_id: 1, viewer_id: 2, view_date: "2020-01-01" }];
console.log(articleViewsI(views2)); // []

// Edge: same author viewed own article multiple times
const views3 = [
  { article_id: 1, author_id: 5, viewer_id: 5, view_date: "2020-01-01" },
  { article_id: 2, author_id: 5, viewer_id: 5, view_date: "2020-01-02" },
];
console.log(articleViewsI(views3)); // [5] — DISTINCT
```

---

## 🔗 Related Problems

- [Article Views II](https://leetcode.com/problems/article-views-ii) — viewers who viewed multiple articles on same date
- [Rising Temperature](https://leetcode.com/problems/rising-temperature) — simple filter with date condition
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — detecting duplicates/matches
- [Managers with at Least 5 Direct Reports](https://leetcode.com/problems/managers-with-at-least-5-direct-reports) — self-referencing table
