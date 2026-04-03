---
layout: page
title: "Subsets"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/subsets/"
leetcode_number: 78
pattern: "Backtracking"
frequency_tier: 1
companies: [Meta, Amazon, Google, Bloomberg, Apple]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Subsets / Tập Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 🔥 Tier 1 — Xuất hiện thường xuyên ở phone screen và onsite
> **Target**: ⏱️ 20 min | **Companies**: Meta, Amazon, Google, Bloomberg, Apple
> **See also**: [Permutations](./03-permutations.md) | [Combination Sum](./05-combination-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chọn đồ đóng hành lý — mỗi món có thể mang hoặc không. Mọi cách chọn đều hợp lệ (power set). Kết quả = toàn bộ các tổ hợp có thể.

**Pattern Recognition:**

- Signal: "all possible subsets / power set" → **Backtracking với `start` index**
- Khác Permutations: **mỗi node trong cây đều là đáp án** — push trước khi đệ quy
- Dùng `start` để chỉ nhìn về phía trước, tránh subset trùng lặp

**Visual — Backtracking Tree for nums = [1, 2, 3]:**

```
backtrack(start=0, path=[])       → push []
├─ pick 1 → backtrack(1, [1])     → push [1]
│   ├─ pick 2 → backtrack(2,[1,2])  → push [1,2]
│   │   └─ pick 3 → ([1,2,3])       → push [1,2,3]
│   └─ pick 3 → backtrack(3,[1,3])  → push [1,3]
├─ pick 2 → backtrack(2, [2])     → push [2]
│   └─ pick 3 → backtrack(3,[2,3])  → push [2,3]
└─ pick 3 → backtrack(3, [3])     → push [3]

Result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]  (2^3 = 8)
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                                |
| ---------------- | --------------------------------------------------------------------------------------- |
| **When you see** | "all subsets", "power set", "all combinations of any length"                            |
| **Think**        | Backtracking with `start` — push at every node, not just leaves                         |
| **Template**     | `result.push([...path]); for (i = start; ...) { path.push; backtrack(i+1); path.pop; }` |
| **Time target**  | ⏱️ 20 min (Medium)                                                                      |

> 💡 **Memory hook / Móc nhớ:** "Đóng hành lý: mỗi món chọn/không chọn — cây 2 nhánh, mỗi node đều là đáp án"

---

## Problem Description

Given an integer array `nums` of unique elements, return all possible subsets (the power set). No duplicate subsets, any order.

```
Example 1: nums = [1,2,3] → [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
Example 2: nums = [0]     → [[], [0]]
```

Constraints:

- 1 <= nums.length <= 10, elements unique, -10 <= nums[i] <= 10

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need all possible subsets of an array with unique elements.
> That's the power set — 2^n subsets total, including empty set.
> Clarification: Elements are unique? Order of subsets doesn't matter?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "This is a classic backtracking problem. I'll build subsets by choosing to include or skip each element.
> Key difference from permutations: every partial path is a valid subset — push at every node.
> Use `start` index to avoid duplicates. O(2^n × n) time, O(n) stack space."

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll write a backtrack function with start index and current path.
> At each call, push a copy of path to result.
> Then try adding each element from start onwards, recurse with i+1, then pop."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [1,2,3]. Start with []. Pick 1→[1], pick 2→[1,2], pick 3→[1,2,3].
> Pop 3, pop 2, pick 3→[1,3]. Pop. Pick 2→[2], pick 3→[2,3]. Pick 3→[3].
> Total 8 = 2^3. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(2^n × n) — 2^n subsets, each costs O(n) to copy.
> Space: O(n) recursion depth.
> Follow-up: duplicates → sort + skip nums[i] === nums[i-1] (Subsets II #90)."

---

## 📝 Interview Tips

1. **Clarify**: "Elements unique?" / "Phần tử có trùng không?" (#78 yes, #90 no)
2. **Brute force**: Include/exclude each element → naturally O(2^n), same as optimal
3. **Optimize**: Iterative cascade — clone + append for each new number
4. **Edge cases**: Empty input → `[[]]`; single element → `[[], [x]]`
5. **Follow-up**: Duplicates → sort + skip `nums[i] === nums[i-1]` (Subsets II #90)

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                          | Why Wrong / Tại sao sai                                  | Fix / Cách sửa                                                |
| --- | ------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Push path directly: `result.push(path)`    | path is mutated later — all entries become same array    | Always spread: `result.push([...path])`                       |
| 2   | Only push at leaf nodes                    | Subsets includes partial paths — missing shorter subsets | Push at every backtrack call, not just when path.length === n |
| 3   | Use `i = 0` instead of `i = start` in loop | Creates duplicate subsets like [2,1] and [1,2]           | Loop from `start` to only look forward                        |

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking (Recommended for interviews)
 * Time: O(2^n × n) — 2^n subsets, each copy costs O(n)
 * Space: O(n) — recursion stack depth at most n
 */
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[]): void {
    result.push([...path]); // every node is a valid subset

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // undo choice
    }
  }

  backtrack(0, []);
  return result;
}

/**
 * Solution 2: Iterative cascade (BFS style)
 * Time: O(2^n × n) — same asymptotically
 * Space: O(1) extra — no recursion stack
 */
function subsetsIterative(nums: number[]): number[][] {
  const result: number[][] = [[]];

  for (const num of nums) {
    const size = result.length;
    for (let i = 0; i < size; i++) {
      result.push([...result[i], num]);
    }
  }

  return result;
}

// === Test Cases ===
console.log(JSON.stringify(subsets([1, 2, 3])));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
console.log(JSON.stringify(subsets([0])));
// [[], [0]]
console.log(JSON.stringify(subsetsIterative([1, 2, 3])));
// same 8 subsets (different order)
```

---

## 🔗 Related Problems

- [Permutations](./03-permutations.md) — backtracking without `start` (all orderings)
- [Combination Sum](./05-combination-sum.md) — backtracking with target sum constraint
- [Subsets II](https://leetcode.com/problems/subsets-ii/) — handle duplicate elements

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
