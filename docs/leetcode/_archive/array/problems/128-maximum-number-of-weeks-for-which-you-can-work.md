---
layout: page
title: "Maximum Number of Weeks for Which You Can Work"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-weeks-for-which-you-can-work"
---

# Maximum Number of Weeks for Which You Can Work / Số Tuần Làm Việc Tối Đa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có nhiều loại bánh với số lượng khác nhau. Bạn ăn không được ăn hai cái bánh cùng loại liền nhau. Câu hỏi: ăn được tối đa bao nhiêu cái? Nếu loại bánh nhiều nhất `max ≤ rest + 1` thì ăn hết được; ngược lại chỉ ăn được `2 * rest + 1`.

**Pattern Recognition:**

- "Interleave tasks, no two same consecutive" → Task Scheduler greedy
- Key invariant: `max_milestones ≤ sum_rest + 1` → can use all
- Otherwise bottleneck is the dominant project: `2 * rest + 1`

**Visual:**

```
milestones = [1, 2, 3]
max = 3, rest = 1+2 = 3, sum = 6

max(3) <= rest(3) + 1 = 4 → YES → answer = sum = 6
Schedule: A B A C A B → 6 weeks ✓

milestones = [5, 2, 1]
max = 5, rest = 2+1 = 3, sum = 8

max(5) > rest(3) + 1 = 4 → NO → answer = 2*rest+1 = 7
Best: A B A C A B A → only 7 weeks (can't use 1 A-task)
```

## Problem Description

You have `milestones[i]` milestones for project `i`. Each week you pick one milestone from any project, but **no two consecutive weeks** can be from the same project. Return the maximum number of weeks you can work.

- `[1,2,3]` → `6` (use all)
- `[5,2,1]` → `7`
- `[6,3,5,2]` → `16` (all, max=6, rest=10, 6≤11)

## 📝 Interview Tips

1. **Clarify**: Can a project have 0 milestones? Yes — ignore it / dự án có 0 milestone thì bỏ qua
2. **Approach**: Only max and sum matter — O(n) single pass / chỉ cần max và tổng
3. **Edge cases**: Single project → can only work 1 week / chỉ một dự án thì làm 1 tuần
4. **Optimize**: No need to sort — just find max and sum / không cần sắp xếp, chỉ cần max và sum
5. **Follow-up**: Same as "Task Scheduler" problem — can generalize / giống bài Task Scheduler
6. **Complexity**: Time O(n), Space O(1) / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Greedy with mathematical insight
 * Time: O(n) | Space: O(1)
 * Key: if max <= rest+1, use everything; else 2*rest+1
 */
function numberOfWeeks(milestones: number[]): number {
  let maxVal = 0,
    total = 0;
  for (const m of milestones) {
    total += m;
    maxVal = Math.max(maxVal, m);
  }
  const rest = total - maxVal;

  if (maxVal <= rest + 1) {
    return total; // can interleave perfectly
  } else {
    return 2 * rest + 1; // dominant project limits us
  }
}

/** Solution 2: Explicit formula with sort (intuition-building version)
 * Time: O(n log n) | Space: O(1)
 */
function numberOfWeeksSorted(milestones: number[]): number {
  milestones.sort((a, b) => b - a); // sort descending
  const maxVal = milestones[0];
  const rest = milestones.slice(1).reduce((a, b) => a + b, 0);
  const total = maxVal + rest;

  // If max project can always be "sandwiched" between others
  return maxVal <= rest + 1 ? total : 2 * rest + 1;
}

/** Solution 3: Functional one-liner style
 * Time: O(n) | Space: O(1)
 */
function numberOfWeeksOneLiner(milestones: number[]): number {
  const sum = milestones.reduce((a, b) => a + b, 0);
  const max = Math.max(...milestones);
  const rest = sum - max;
  return max > rest + 1 ? 2 * rest + 1 : sum;
}

// Test cases
console.log(numberOfWeeks([1, 2, 3])); // 6
console.log(numberOfWeeks([5, 2, 1])); // 7
console.log(numberOfWeeks([6, 3, 5, 2])); // 16 (6<=10+1)
console.log(numberOfWeeks([1])); // 1
console.log(numberOfWeeksSorted([5, 2, 1])); // 7
console.log(numberOfWeeksOneLiner([1, 2, 3])); // 6
```

## 🔗 Related Problems

| Problem                                                              | Relationship                                  |
| -------------------------------------------------------------------- | --------------------------------------------- |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)       | Identical greedy insight — max task dominates |
| [Reorganize String](https://leetcode.com/problems/reorganize-string) | No two same chars adjacent — same invariant   |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)           | Greedy choice at each step                    |
