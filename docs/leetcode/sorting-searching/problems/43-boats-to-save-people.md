---
layout: page
title: "Boats to Save People"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/boats-to-save-people"
---

# Boats to Save People / Thuyền Cứu Người

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Maximize Greatness of an Array](https://leetcode.com/problems/maximize-greatness-of-an-array) | [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xếp chỗ ngồi trên máy bay — ghép người nặng nhất với người nhẹ nhất. Nếu tổng trọng lượng vượt giới hạn, người nặng nhất ngồi một mình; nếu vừa, cả hai lên cùng thuyền.

**Pattern Recognition:**

- Signal: "pair elements" + "minimize resource usage" + sorted → **Greedy + Two Pointers**
- Greedy: người nặng nhất luôn đi trước; ghép với người nhẹ nhất nếu được
- Key insight: sort + L/R pointer hội tụ từ hai đầu — mỗi bước dùng 1 thuyền

**Visual — people = [3,2,2,1], limit = 3 → sorted = [1,2,2,3]:**

```
sorted: [1, 2, 2, 3],  limit=3
         L        R

Step 1: 1+3=4 > 3 → R alone (boat 1), R--
Step 2: 1+2=3 ≤ 3 → L+R together (boat 2), L++, R--
Step 3: L=R=1 → one person alone (boat 3)

Total boats = 3 ✅
```

---

## Problem Description

Mỗi thuyền chở tối đa 2 người và không vượt quá `limit` trọng lượng. Tìm **số thuyền tối thiểu** để chở tất cả mọi người. ([LeetCode](https://leetcode.com/problems/boats-to-save-people))

Difficulty: Medium | Acceptance: 60.3%

- `people = [1,2], limit = 3` → `1` (cả hai vừa 1 thuyền)
- `people = [3,2,2,1], limit = 3` → `3`
- `people = [3,5,3,4], limit = 5` → `4` (mọi người đi riêng)

Constraints: `1 <= people.length <= 5×10^4`, `1 <= people[i] <= limit <= 3×10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi thuyền chở đúng 2 người hay tối đa 2?" / Max 2 per boat (not exactly 2)
2. **Greedy proof**: "Người nặng nhất nên ghép với người nhẹ nhất có thể — optimal" / Heaviest with lightest is greedy-optimal
3. **Sort first**: "Phải sort trước để two-pointers hoạt động đúng" / Sorting is prerequisite
4. **Two pointer move**: "R luôn di chuyển (người nặng nhất luôn lên thuyền); L chỉ di chuyển nếu ghép được" / R always moves
5. **Edge cases**: "Mọi người đều nặng bằng limit → mỗi người 1 thuyền" / All at limit → n boats
6. **Follow-up**: "Thuyền chở tối đa k người? → interval scheduling / greedy harder" / k > 2 is much harder

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Try All Pairings (exponential, conceptual only)
 * Time: O(n²) simplified — greedy baseline with linear scan per step
 * Space: O(n) — used[] tracking
 */
function boatsBrute(people: number[], limit: number): number {
  people.sort((a, b) => a - b);
  const used = new Array(people.length).fill(false);
  let boats = 0;
  for (let i = people.length - 1; i >= 0; i--) {
    if (used[i]) continue;
    boats++;
    // find lightest unused person that fits
    for (let j = 0; j < i; j++) {
      if (!used[j] && people[i] + people[j] <= limit) {
        used[j] = true;
        break;
      }
    }
  }
  return boats;
}

/**
 * Solution 2: Sort + Two Pointers (Greedy)
 * Time: O(n log n) — sorting; O(n) for two-pointer scan
 * Space: O(1) — in-place sort, two indices
 */
function numRescueBoats(people: number[], limit: number): number {
  people.sort((a, b) => a - b);
  let lo = 0,
    hi = people.length - 1;
  let boats = 0;
  while (lo <= hi) {
    // Try to pair lightest (lo) with heaviest (hi)
    if (people[lo] + people[hi] <= limit) lo++; // both board
    hi--; // heaviest always boards
    boats++;
  }
  return boats;
}

// === Test Cases ===
console.log(numRescueBoats([1, 2], 3)); // 1
console.log(numRescueBoats([3, 2, 2, 1], 3)); // 3
console.log(numRescueBoats([3, 5, 3, 4], 5)); // 4
console.log(numRescueBoats([1, 1, 1, 1], 3)); // 2
```

---

## 🔗 Related Problems

- [Maximize Greatness of an Array](https://leetcode.com/problems/maximize-greatness-of-an-array) — sort + greedy pairing
- [Assign Cookies](https://leetcode.com/problems/assign-cookies) — greedy matching smallest to smallest
- [Most Profit Assigning Work](https://leetcode.com/problems/most-profit-assigning-work) — sort + two pointers
- [Two Sum II Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted) — two pointer on sorted array
- [Boats to Save People — LeetCode](https://leetcode.com/problems/boats-to-save-people) — problem page
