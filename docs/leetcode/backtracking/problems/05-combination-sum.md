---
layout: page
title: "Combination Sum"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking]
leetcode_url: "https://leetcode.com/problems/combination-sum/"
leetcode_number: 39
pattern: "Backtracking + Unlimited Reuse"
frequency_tier: 2
companies: [Amazon, Google, Bloomberg, Facebook]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Combination Sum / Tổng Tổ Hợp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: ⭐ Tier 2 — Gặp ~55% interviews
> **See also**: [Subsets](./02-subsets.md) | [Permutations](./03-permutations.md) | [Generate Parentheses](./04-generate-parentheses.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang pha cocktail và cần đạt đúng X ml. Mỗi chai nguyên liệu có thể dùng nhiều lần. Backtracking là cách thử-và-bỏ có hệ thống: thêm từng loại, nếu tổng vượt X — dừng ngay và quay lại (pruning). Sắp xếp nguyên liệu từ ít đến nhiều cho phép dừng cả vòng lặp khi chai đầu tiên đã quá X.

**Pattern Recognition:**

- Signal: "all combinations", "same element reused", "sum equals target" → **Backtracking with start index**
- Use `start` index (not 0 each time) to avoid duplicate combos like [2,3] and [3,2]
- Sort candidates first → enables `break` when `candidates[i] > remaining` (prunes entire branch)

**Visual — candidates=[2,3,6,7], target=7:**

```
backtrack(start=0, curr=[], rem=7)
├── +2 → backtrack(start=0, curr=[2], rem=5)
│   ├── +2 → backtrack(curr=[2,2], rem=3)
│   │   ├── +2 → backtrack(curr=[2,2,2], rem=1)
│   │   │   ├── +2 → rem=-1, PRUNE ✂️ (break, sorted)
│   │   └── +3 → rem=0 ✅ FOUND [2,2,3]
│   └── +3 → backtrack(curr=[2,3], rem=2)
│       └── +3 → rem=-1, PRUNE ✂️
├── +3 → backtrack(curr=[3], rem=4) ...
├── +6 → rem=1 → +6 PRUNE, +7 PRUNE ✂️
└── +7 → rem=0 ✅ FOUND [7]

Result: [[2,2,3], [7]]
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| **When you see** | "all combinations summing to target", "same element reused"                       |
| **Think**        | Backtracking with `start` index; recurse from `i` (not `i+1`) to allow reuse     |
| **Template**     | `backtrack(i, rem): if rem===0 push; for j=i: if cands[j]<=rem recurse(j,...)`   |
| **Time target**  | ⏱️ 20 min (Medium)                                                                |

> 💡 **Memory hook / Móc nhớ:** "Unlimited reuse = start từ `i`, không phải `i+1` — cho phép dùng lại!"

---

## Problem Description

Given an array of **distinct** integers `candidates` and `target`, return all unique combinations where chosen numbers sum to `target`. The same number may be used **unlimited times**.

```
Example 1: candidates=[2,3,6,7], target=7  → [[2,2,3],[7]]
Example 2: candidates=[2,3,5],   target=8  → [[2,2,2,2],[2,3,3],[3,5]]
Example 3: candidates=[2],       target=1  → []
```

Constraints:

- 1 <= candidates.length <= 30, all values distinct
- 2 <= candidates[i] <= 40, 1 <= target <= 40

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We need all unique combinations from the candidates array that sum to target. Each candidate can be used unlimited times. Output order doesn't matter."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "This is backtracking. I'll sort the candidates first. I'll use a start index to avoid duplicate combos — when recurring after choosing candidates[i], I pass i (not i+1) to allow reuse. If candidates[i] > remaining, I break since the array is sorted and all subsequent candidates are too large."

### Step 3 — Implement / Viết Code (5 min)

> "backtrack(start, current, remaining). Base case: remaining===0, push copy. For i=start: if candidates[i] > remaining break; push, recurse(i, ...), pop."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "For [2,3,6,7], target=7: explore 2→2→2→3 (rem=0, push [2,2,3]), then 7 (push [7]). Result [[2,2,3],[7]] correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time O(N^(T/M)) where N=candidates, T=target, M=min candidate. Space O(T/M) recursion depth. The sort+break optimization dramatically reduces explored branches."

---

## 📝 Interview Tips

1. **Clarify**: Can elements be reused? Are candidates guaranteed distinct? / Được dùng lại? Candidates có distinct không?
2. **Brute force**: Backtracking without pruning — valid but explores more branches / Backtracking cơ bản, không sắp xếp, không break sớm.
3. **Optimize**: Sort candidates → replace `if sum > target return` with `if candidates[i] > remaining break` — eliminates all larger candidates at once / Sắp xếp + break thay vì return để cắt cả đuôi vòng lặp.
4. **Edge cases**: No valid combination (return `[]`), single candidate equals target, target=0 (return `[[]]`) / Không có kết quả, candidate chính bằng target.
5. **Explain the `start` index**: "I pass `i` (not `i+1`) to allow reuse, but never go backward to avoid duplicate combos" / Truyền `i` để dùng lại, không truyền `i-1` để tránh hoán vị trùng.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                          | Why Wrong / Tại sao sai                                   | Fix / Cách sửa                                              |
| --- | ---------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Recurse with `start=i+1` instead of `i`                    | Misses reuse of same candidate — e.g., [2,2,3] impossible | Pass `i` (not `i+1`) to allow unlimited reuse              |
| 2   | Not sorting candidates before backtracking                 | Can't use `break` for pruning — must check every candidate | Sort candidates ascending to enable early break            |
| 3   | Checking `if sum > target return` but not `break`          | Only exits current branch, still explores larger candidates | With sorted input, `if candidates[i] > remaining break`    |

---

## Solutions

```typescript

/**

- Solution 1: Backtracking without Pruning (Brute Force)
- Time: O(N^(T/M)) — N candidates, T target, M min candidate value
- Space: O(T/M) — max recursion depth = target / smallest candidate
  */
  function combinationSumBrute(candidates: number[], target: number): number[][] {
  const result: number[][] = [];

function backtrack(start: number, curr: number[], sum: number): void {
if (sum === target) { result.push([...curr]); return; }
if (sum > target) return;

    for (let i = start; i < candidates.length; i++) {
      curr.push(candidates[i]);
      backtrack(i, curr, sum + candidates[i]); // i not i+1 → allows reuse
      curr.pop();
    }

}

backtrack(0, [], 0);
return result;
}

/**

- Solution 2: Backtracking with Sort + Early Break (Optimal)
- Time: O(N^(T/M)) — same big-O, but far fewer branches explored in practice
- Space: O(T/M) — recursion depth bounded by target / min_candidate
  */
  function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  candidates.sort((a, b) => a - b); // enables break when candidate > remaining

function backtrack(start: number, curr: number[], remaining: number): void {
if (remaining === 0) { result.push([...curr]); return; }

    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break; // sorted → all subsequent also too large
      curr.push(candidates[i]);
      backtrack(i, curr, remaining - candidates[i]);
      curr.pop();
    }

}

backtrack(0, [], target);
return result;
}

// === Test Cases ===
console.log(JSON.stringify(combinationSum([2, 3, 6, 7], 7))); // [[2,2,3],[7]]
console.log(JSON.stringify(combinationSum([2, 3, 5], 8))); // [[2,2,2,2],[2,3,3],[3,5]]
console.log(JSON.stringify(combinationSum([2], 1))); // []
console.log(JSON.stringify(combinationSum([1], 2))); // [[1,1]]

```

---

## 🔗 Related Problems

- [Subsets](./02-subsets.md) — same backtracking template, no target sum constraint
- [Permutations](./03-permutations.md) — backtracking without start index (order matters)
- [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) — harder: each element used once, input has duplicates
- [Generate Parentheses](./04-generate-parentheses.md) — same explore-prune-backtrack structure

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | ___ min (target: 20 min)                 |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
