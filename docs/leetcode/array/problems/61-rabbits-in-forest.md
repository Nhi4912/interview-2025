---
layout: page
title: "Rabbits in Forest"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/rabbits-in-forest"
---

# Rabbits in Forest / Thỏ Trong Rừng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Math
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng các nhóm thỏ cùng màu. Nếu một thỏ nói "có 2 con khác cùng màu với tôi", nhóm đó có 3 thỏ. Tối đa 3 thỏ có thể trả lời "2" mà vẫn cùng một nhóm — con thứ 4 phải là nhóm mới.

**Pattern Recognition:**

- Signal: "group elements by answer, find minimum total" → **Greedy** (pack into groups greedily)
- Nếu k thỏ cùng trả lời x, số nhóm = ceil(k / (x+1)), mỗi nhóm có x+1 thỏ
- Key insight: `ceil(k / groupSize) * groupSize` = số thỏ tối thiểu cho giá trị x đó

**Visual — Greedy Grouping:**

```
answers = [1, 1, 2]
x=1: count=2, groupSize=2 → ceil(2/2)=1 group → 2 rabbits
x=2: count=1, groupSize=3 → ceil(1/3)=1 group → 3 rabbits
Total = 2 + 3 = 5

answers = [10, 10, 10]
x=10: count=3, groupSize=11 → ceil(3/11)=1 group → 11 rabbits
```

---

## Problem Description

In a forest, rabbits have colors. Each rabbit says how many **other** rabbits have the same color. Given the `answers` array (some rabbits don't answer), return the **minimum** number of rabbits in the forest. ([LeetCode](https://leetcode.com/problems/rabbits-in-forest))

Difficulty: Medium | Acceptance: 58.3%

- Example 1: `answers=[1,1,2]` → `5`
- Example 2: `answers=[10,10,10]` → `11`
- Example 3: `answers=[]` → `0`

Constraints: `1 ≤ answers.length ≤ 1000`, `0 ≤ answers[i] < 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Có thỏ nào không trả lời không? Chúng ta cần đếm tối thiểu" / Some rabbits may not answer; we want minimum count
2. **Key insight**: "x+1 thỏ tối đa có thể cùng trả lời x mà vẫn hợp lệ" / At most x+1 rabbits can answer x in same group
3. **Greedy rule**: "Nhóm tối đa mỗi câu trả lời trước khi tạo nhóm mới" / Fill each group to x+1 before starting new group
4. **Formula**: "ceil(count / (x+1)) \* (x+1) — dùng Math.ceil" / Use ceiling division for group count
5. **Edge cases**: "answers=[] → 0, tất cả trả lời 0 → mỗi con là một nhóm" / Empty array or all zeros
6. **Follow-up**: "Nếu thỏ có thể nói sai? Bài toán trở nên NP-hard" / If rabbits can lie, problem becomes NP-hard

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (same as optimal but less readable)
 * Time: O(n) — count frequencies then compute
 * Space: O(k) — k = unique answer values
 */
function numRabbitsBrute(answers: number[]): number {
  const count: Record<number, number> = {};
  for (const a of answers) count[a] = (count[a] ?? 0) + 1;
  let total = 0;
  for (const [x, cnt] of Object.entries(count)) {
    const groupSize = Number(x) + 1;
    // ceil(cnt / groupSize) * groupSize
    total += Math.ceil(cnt / groupSize) * groupSize;
  }
  return total;
}

/**
 * Solution 2: Greedy with Hash Map
 * Time: O(n) — single pass + O(k) for unique values
 * Space: O(k) — hash map for counts
 *
 * Key math: if cnt rabbits say x, they need ceil(cnt/(x+1)) groups,
 * each group has (x+1) rabbits. Total = ceil(cnt/(x+1)) * (x+1).
 */
function numRabbits(answers: number[]): number {
  const count = new Map<number, number>();
  for (const a of answers) count.set(a, (count.get(a) ?? 0) + 1);

  let total = 0;
  for (const [x, cnt] of count) {
    const groupSize = x + 1;
    const groups = Math.ceil(cnt / groupSize);
    total += groups * groupSize;
  }

  return total;
}

// === Test Cases ===
console.log(numRabbits([1, 1, 2])); // 5
console.log(numRabbits([10, 10, 10])); // 11
console.log(numRabbits([])); // 0
console.log(numRabbits([0, 0, 1, 1, 1])); // 2 + 3 = 5 (2 solo + one group of 2 but 3 answered 1 → 2 groups → 4? Let's check: x=0:cnt=2→2groups*1=2; x=1:cnt=3→ceil(3/2)*2=4 → total=6)
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy grouping with cooldown
- [Single Number](https://leetcode.com/problems/single-number) — find element that doesn't fit pattern
- [Group Anagrams](https://leetcode.com/problems/group-anagrams) — group elements by property
- [Brick Wall](https://leetcode.com/problems/brick-wall) — count by frequency of positions
- [Minimum Number of People to Teach](https://leetcode.com/problems/minimum-number-of-people-to-teach) — greedy with grouping constraints
