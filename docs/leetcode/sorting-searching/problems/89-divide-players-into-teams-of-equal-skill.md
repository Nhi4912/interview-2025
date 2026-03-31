---
layout: page
title: "Divide Players Into Teams of Equal Skill"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/divide-players-into-teams-of-equal-skill"
---

# Divide Players Into Teams of Equal Skill / Chia Người Chơi Thành Đội Kỹ Năng Đều Nhau

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Two Pointers on Sorted Array

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như bốc thăm chia đội bóng đá — ghép cầu thủ giỏi nhất với kém nhất để đội nào cũng cân bằng. Nếu tổng điểm từng đội khác nhau thì không thể chia đều được.

**Pattern Recognition:**

- All pairs must have equal sum → sort + pair weakest with strongest → **Two Pointers**
- If any pair sum ≠ target sum → return -1
- Chemistry = product of pair → accumulate while checking validity

**Visual:**

```
skill = [3, 2, 5, 1, 3, 4]
Sort:    [1, 2, 3, 3, 4, 5]
          L               R   → sum=6, chem=5
             L        R       → sum=6, chem=8
                L   R         → sum=6, chem=9
All sums equal 6 ✓
Total chemistry = 5 + 8 + 9 = 22
```

## Problem Description

Given an array `skill` of even length, divide players into pairs (teams of 2) such that every team has equal total skill. Return the sum of the **chemistry** of all teams, where chemistry = product of both players' skills. If it's impossible, return -1.

**Example:**

- skill=[3,2,5,1,3,4] → 22 (pairs: (1,5), (2,4), (3,3) all sum to 6; 5+8+9=22)
- skill=[3,4] → 12
- skill=[1,1,2,3] → -1 (cannot form equal-skill teams)

**Constraints:** 2 ≤ skill.length ≤ 10⁵, skill.length is even, 1 ≤ skill[i] ≤ 1000

## 📝 Interview Tips

1. **Clarify**: Is it guaranteed skill.length is even? (Yes per constraints)
2. **Approach**: Sort, pair first with last; all pairs must share same sum
3. **Edge cases**: skill=[1,1] (both equal), all elements same value, impossible pairings
4. **Optimize**: Sort gives O(n log n); two-pointer avoids O(n²) brute force
5. **Follow-up**: What if teams can have size k instead of 2?
6. **Complexity**: Time O(n log n), Space O(1) (in-place sort)

## Solutions

```typescript
// Solution 1: Sort + Two Pointers — Time: O(n log n) | Space: O(1)
function dividePlayers(skill: number[]): number {
  skill.sort((a, b) => a - b);
  const n = skill.length;
  const target = skill[0] + skill[n - 1];
  let chemistry = 0;

  for (let l = 0, r = n - 1; l < r; l++, r--) {
    if (skill[l] + skill[r] !== target) return -1;
    chemistry += skill[l] * skill[r];
  }

  return chemistry;
}

// Solution 2: Hash Map frequency count — Time: O(n) | Space: O(n)
function dividePlayers2(skill: number[]): number {
  const freq = new Map<number, number>();
  let total = 0;
  for (const s of skill) {
    freq.set(s, (freq.get(s) ?? 0) + 1);
    total += s;
  }

  const n = skill.length;
  const target = total / (n / 2); // each pair must sum to this
  if (!Number.isInteger(target)) return -1;

  let chemistry = 0;
  const used = new Map<number, number>(freq);

  for (const [s, cnt] of freq) {
    if ((used.get(s) ?? 0) === 0) continue;
    const need = target - s;
    if (need === s) {
      // pair same values: need even count
      if ((used.get(s) ?? 0) % 2 !== 0) return -1;
      const pairs = (used.get(s) ?? 0) / 2;
      chemistry += pairs * s * s;
      used.set(s, 0);
    } else {
      const haveCnt = used.get(s) ?? 0;
      const needCnt = used.get(need) ?? 0;
      if (haveCnt !== needCnt) return -1;
      chemistry += haveCnt * s * need;
      used.set(s, 0);
      used.set(need, 0);
    }
  }

  return chemistry;
}

// Solution 3: Brute Force — Time: O(n²) | Space: O(n)
function dividePlayers3(skill: number[]): number {
  const sorted = [...skill].sort((a, b) => a - b);
  const target = sorted[0] + sorted[sorted.length - 1];
  const used = new Array(sorted.length).fill(false);
  let chemistry = 0;

  for (let i = 0; i < sorted.length; i++) {
    if (used[i]) continue;
    let found = false;
    for (let j = i + 1; j < sorted.length; j++) {
      if (!used[j] && sorted[i] + sorted[j] === target) {
        chemistry += sorted[i] * sorted[j];
        used[i] = used[j] = true;
        found = true;
        break;
      }
    }
    if (!found) return -1;
  }

  return chemistry;
}

// Tests
console.log(dividePlayers([3, 2, 5, 1, 3, 4])); // 22
console.log(dividePlayers([3, 4])); // 12
console.log(dividePlayers([1, 1, 2, 3])); // -1
console.log(dividePlayers([1, 1, 1, 1])); // 3
console.log(dividePlayers([2, 2, 2, 2, 2, 2])); // 12
```

## 🔗 Related Problems

| Problem                                                                                                | Relationship                   |
| ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| [Two Sum](https://leetcode.com/problems/two-sum)                                                       | Same pair-finding concept      |
| [3Sum](https://leetcode.com/problems/3sum)                                                             | Generalised k-sum with sorting |
| [Minimize Maximum Pair Sum in Array](https://leetcode.com/problems/minimize-maximum-pair-sum-in-array) | Same sort+pair pattern         |
