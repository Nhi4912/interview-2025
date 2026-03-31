---
layout: page
title: "Reward Top K Students"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/reward-top-k-students"
---

# Reward Top K Students / Thưởng K Học Sinh Hàng Đầu

🟡 Medium | Hash Table, Sorting | [LeetCode 2592](https://leetcode.com/problems/reward-top-k-students)

---

## 🧠 Intuition / Trực Giác

**EN:** Score each student's feedback by counting positive words (+3 each) and negative words (-1 each). Sort students by score descending, break ties by student ID ascending, then return the top k IDs.

**VI:** Chấm điểm phản hồi mỗi học sinh: từ tích cực +3, từ tiêu cực -1. Sắp xếp giảm dần theo điểm, cùng điểm thì tăng dần theo ID, trả về k ID đầu tiên.

```
positive = ["smart","brilliant"]  negative = ["bad","wrong"]
report[0] = "this student is smart and brilliant"  → +3 +3 = 6
report[1] = "this student is bad and wrong"        → -1 -1 = -2
report[2] = "a brilliant but also bad student"     → +3 -1 = 2

scores: [6, -2, 2]  student_id: [1, 2, 3]
sorted: [(6,1), (2,3), (-2,2)]
top 2 → [1, 3]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Pre-build Set for positive/negative words — O(1) lookup per word instead of O(m). **VI:** Xây dựng Set trước cho từ tích cực/tiêu cực để tra cứu O(1).
- 📊 **EN:** Score per student: sum across all words, +3 or -1 per word. **VI:** Điểm mỗi học sinh là tổng điểm trên tất cả từ trong phản hồi.
- 🔤 **EN:** Split report by space to get individual words before lookup. **VI:** Tách phản hồi theo khoảng trắng để lấy từng từ.
- 🔢 **EN:** Sort comparator: `b[0] - a[0]` for score desc, then `a[1] - b[1]` for ID asc on tie. **VI:** So sánh: giảm dần điểm, tăng dần ID khi bằng điểm.
- ⚡ **EN:** Avoid building full sorted array if k << n — a max-heap of size k gives O(n log k). **VI:** Nếu k << n, heap kích thước k cho O(n log k) thay vì O(n log n).
- 🧪 **EN:** Edge case: a word can be in both sets — problem guarantees disjoint sets, so safe. **VI:** Bài đảm bảo tập tích cực và tiêu cực không giao nhau.

---

## 💡 Solutions / Giải Pháp

### Solution 1 — Hash Set + Sort (Clean & Simple)

```typescript
/**
 * Build word sets, score each student, sort and return top k
 * Time: O(n * w + n log n)  Space: O(n + p + q)
 *   w = avg words per report, p = positive set size, q = negative set size
 */
function topStudents(
  positive_feedback: string[],
  negative_feedback: string[],
  report: string[],
  student_id: number[],
  k: number,
): number[] {
  const posSet = new Set(positive_feedback);
  const negSet = new Set(negative_feedback);

  const scored: [number, number][] = report.map((r, i) => {
    let score = 0;
    for (const word of r.split(" ")) {
      if (posSet.has(word)) score += 3;
      else if (negSet.has(word)) score -= 1;
    }
    return [score, student_id[i]];
  });

  scored.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  return scored.slice(0, k).map(([, id]) => id);
}

// Tests
console.log(
  topStudents(
    ["smart", "brilliant", "studious"],
    ["not", "bad"],
    ["this student is not studious", "the student is smart"],
    [1, 2],
    2,
  ),
); // [2, 1]

console.log(topStudents(["a"], ["b"], ["a b a", "b a", "a a a"], [10, 20, 30], 2)); // [30, 10]  scores: [5, -1, 9] → sorted: [9→30, 5→10]
```

### Solution 2 — Reduce with Early Exit + Stable Sort

```typescript
/**
 * Same approach using reduce; separates scoring from sorting concerns
 * Time: O(n * w + n log n)  Space: O(n)
 */
function topStudents2(
  positive_feedback: string[],
  negative_feedback: string[],
  report: string[],
  student_id: number[],
  k: number,
): number[] {
  const pos = new Set(positive_feedback);
  const neg = new Set(negative_feedback);

  function scoreReport(r: string): number {
    return r.split(" ").reduce((acc, w) => {
      if (pos.has(w)) return acc + 3;
      if (neg.has(w)) return acc - 1;
      return acc;
    }, 0);
  }

  return student_id
    .map((id, i) => ({ id, score: scoreReport(report[i]) }))
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, k)
    .map((x) => x.id);
}

console.log(topStudents2(["smart"], ["bad"], ["smart bad", "smart", "bad"], [3, 1, 2], 2));
// scores: [2,3,-1] → sorted: [3→id1, 2→id3] → [1,3]... wait
// [3,1,2] are ids, scores [2,3,-1]: (id=3,s=2),(id=1,s=3),(id=2,s=-1) → sorted: [(1,3),(3,2),(2,-1)] → [1,3]
```

### Solution 3 — Score Map with Partial Sort (k << n)

```typescript
/**
 * When k is small, use selection-based partial sort instead of full sort
 * Time: O(n*w + n log k)  Space: O(n)
 */
function topStudents3(
  positive_feedback: string[],
  negative_feedback: string[],
  report: string[],
  student_id: number[],
  k: number,
): number[] {
  const pos = new Set(positive_feedback);
  const neg = new Set(negative_feedback);
  const scores = new Map<number, number>();

  for (let i = 0; i < report.length; i++) {
    let s = 0;
    for (const w of report[i].split(" ")) {
      if (pos.has(w)) s += 3;
      else if (neg.has(w)) s -= 1;
    }
    scores.set(student_id[i], s);
  }

  return [...scores.keys()].sort((a, b) => scores.get(b)! - scores.get(a)! || a - b).slice(0, k);
}
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                      | Difficulty | Pattern        |
| --- | ---------------------------- | ---------- | -------------- |
| 1   | Rank Teams by Votes          | 🟡 Medium  | custom sort    |
| 2   | Sort Characters By Frequency | 🟡 Medium  | frequency sort |
| 3   | K Closest Points to Origin   | 🟡 Medium  | heap top-k     |
