---
layout: page
title: "Permutations"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array]
leetcode_url: "https://leetcode.com/problems/permutations/"
leetcode_number: 46
pattern: "Backtracking"
frequency_tier: 1
companies: [Meta, Amazon, Google, Microsoft, Apple]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Permutations / Hoán Vị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 🔥 Tier 1 — Câu hỏi kinh điển ở mọi vòng phỏng vấn kỹ thuật
> **Target**: ⏱️ 20 min | **Companies**: Meta, Amazon, Google, Microsoft, Apple
> **See also**: [Subsets](./02-subsets.md) | [Permutations II](https://leetcode.com/problems/permutations-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xếp n học sinh đứng thành hàng chụp ảnh kỷ yếu — mỗi thứ tự khác nhau là một hoán vị. n học sinh → n! cách xếp.

**Pattern Recognition:**

- Signal: "all possible orderings / arrangements" → **Backtracking không có `start` index**
- Khác Subsets: cần dùng **toàn bộ** n phần tử, quan tâm thứ tự
- Cần `visited` array hoặc swap-based để theo dõi phần tử đã dùng

**Visual — Backtracking Tree for nums = [1, 2, 3]:**

```
                    []
          /          |          \
        [1]         [2]         [3]
       /   \       /   \       /   \
   [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
     |     |     |     |     |     |
 [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

→ 3! = 6 permutations (only push at leaves when path.length === n)
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **When you see** | "all orderings", "all arrangements", "permutations"                                          |
| **Think**        | Backtracking with visited/swap — try every unused element at each position                   |
| **Template**     | `if (path.length === n) push; for (i = 0..n) if (!visited[i]) { visit; backtrack; unvisit }` |
| **Time target**  | ⏱️ 20 min (Medium)                                                                           |

> 💡 **Memory hook / Móc nhớ:** "Xếp hàng chụp ảnh: mỗi vị trí thử từng người chưa đứng — n! cách"

---

## Problem Description

Given an array `nums` of distinct integers, return all possible permutations in any order.

```
Example 1: nums = [1,2,3] → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
Example 2: nums = [0,1]   → [[0,1],[1,0]]
Example 3: nums = [1]     → [[1]]
```

Constraints:

- 1 <= nums.length <= 6, elements distinct, -10 <= nums[i] <= 10

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need all possible orderings of distinct integers.
> With n elements, there are n! permutations.
> Clarification: All elements are distinct? Return all permutations in any order?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Classic backtracking. At each position, try every unused element.
> I'll use a visited boolean array to track which elements are in the current path.
> When path has n elements, it's a complete permutation. O(n × n!) time."

### Step 3 — Implement / Viết Code (5-7 min)

> "backtrack function takes current path. Base case: path.length === n → push copy.
> Loop i from 0 to n: skip if visited[i]. Mark visited, push, recurse, pop, unmark."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [1,2,3]. Start []. Pick 1→[1], pick 2→[1,2], pick 3→[1,2,3] ✓.
> Pop 3, pop 2, pick 3→[1,3], pick 2→[1,3,2] ✓. Continue...
> Total 6 = 3!. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n × n!) — n! permutations, O(n) to copy each.
> Space: O(n) — recursion stack + visited array.
> Alternative: swap-based approach saves visited array. Follow-up: duplicates → sort + skip."

---

## 📝 Interview Tips

1. **Clarify**: "Duplicates?" / "Có phần tử trùng không?" (#46 no, #47 yes)
2. **Brute force**: Visited array approach — try each unused element → O(n × n!)
3. **Optimize**: Swap-based — swap in-place, no visited array needed
4. **Edge cases**: n=1 → `[[nums[0]]]`; result always has exactly n! elements
5. **Follow-up**: Duplicates → sort + `if (i > 0 && nums[i] === nums[i-1] && !visited[i-1]) continue`

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                        | Why Wrong / Tại sao sai                                             | Fix / Cách sửa                                        |
| --- | ---------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | Forget to unmark visited after backtrack | Elements get permanently excluded, missing permutations             | Always `visited[i] = false` after `path.pop()`        |
| 2   | Use `start` index like Subsets           | Permutations need all orderings, start index skips earlier elements | Loop from `i = 0` with visited check, not `i = start` |
| 3   | Push path reference instead of copy      | All entries point to same mutated array                             | Use `result.push([...path])` to clone                 |

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking with visited array (Clear for interviews)
 * Time: O(n × n!) — n! permutations, each costs O(n) to copy
 * Space: O(n) — recursion stack + visited array
 */
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const visited = new Array(nums.length).fill(false);

  function backtrack(path: number[]): void {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (visited[i]) continue;

      visited[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop();
      visited[i] = false;
    }
  }

  backtrack([]);
  return result;
}

/**
 * Solution 2: Swap-based backtracking (Space optimal)
 * Time: O(n × n!) — same
 * Space: O(n) — recursion stack only, no visited array
 */
function permuteSwap(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number): void {
    if (start === nums.length) {
      result.push([...nums]);
      return;
    }

    for (let i = start; i < nums.length; i++) {
      [nums[start], nums[i]] = [nums[i], nums[start]];
      backtrack(start + 1);
      [nums[start], nums[i]] = [nums[i], nums[start]];
    }
  }

  backtrack(0);
  return result;
}

// === Test Cases ===
console.log(JSON.stringify(permute([1, 2, 3])));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(JSON.stringify(permute([0, 1])));
// [[0,1],[1,0]]
console.log(JSON.stringify(permuteSwap([1, 2, 3])));
// same 6 permutations
```

---

## 🔗 Related Problems

- [Subsets](./02-subsets.md) — backtracking with `start` index, no visited needed
- [Permutations II](https://leetcode.com/problems/permutations-ii/) — handle duplicate elements
- [Next Permutation](https://leetcode.com/problems/next-permutation/) — find next lexicographic permutation

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
