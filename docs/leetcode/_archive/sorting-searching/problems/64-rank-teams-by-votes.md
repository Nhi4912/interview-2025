---
layout: page
title: "Rank Teams by Votes"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, String, Sorting, Counting]
leetcode_url: "https://leetcode.com/problems/rank-teams-by-votes"
---

# Rank Teams by Votes / Xếp Hạng Đội Theo Phiếu Bầu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Maximum Palindromes After Operations](https://leetcode.com/problems/maximum-palindromes-after-operations)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bảng thi đấu bóng đá — đội nào có nhiều điểm nhất được xếp trên. Nếu bằng điểm, xét hiệu số bàn thắng, rồi số bàn thắng... Đây là **multi-level sorting** (sắp xếp đa tiêu chí).

**Pattern Recognition:**

- Mỗi đội cần một "key" tổng hợp gồm nhiều tiêu chí
- Xây dựng mảng đếm vote theo position cho mỗi đội
- Sort bằng custom comparator: compare theo từng position, tie-break bằng alphabet

**Visual — votes = ["ABC","ACB","ABC","ACB","ACB"]:**

```
Position:  0   1   2
A          5   0   0
B          0   2   3
C          0   3   2

Rank: A (5,0,0) > C (0,3,2) > B (0,2,3) → "ACB" ✅
```

---

## Problem Description

Given an array of strings `votes` where each string represents a voter's ranking of teams (characters), return the final ranking string. A team ranked higher in more first-place votes wins; ties broken by second-place votes, and so on. Final tie broken alphabetically.

- Example 1: `votes = ["ABC","ACB","ABC","ACB","ACB"]` → `"ACB"`
- Example 2: `votes = ["WXYZ","XYZW"]` → `"XWYZ"`

---

## 📝 Interview Tips

1. **Clarify**: "Có team nào không xuất hiện trong một số phiếu không?" / Can a team be absent from some votes?
2. **Data structure**: "Dùng Map<char, number[]> lưu vote counts theo position" / Use map from team → vote count array
3. **Custom sort**: "Comparator so sánh lần lượt từng position, cuối cùng so sánh alphabet" / Compare position by position, then lexicographically
4. **Edge case**: "Chỉ một đội → return luôn" / Single team → return directly
5. **Time**: "O(n·m + m² log m) với n = số vote, m = số đội" / n votes, m teams
6. **Follow-up**: "Nếu số teams rất lớn?" / What if number of teams is very large?

---

## Solutions

```typescript
/**
 * Solution 1: Custom Comparator Sort
 * Time: O(n·m + m² log m) — n votes, m teams, m positions
 * Space: O(m²) — vote count table
 */
function rankTeamsByVotes(votes: string[]): string {
  const n = votes[0].length;
  // count[team][position] = number of votes at that position
  const count: Record<string, number[]> = {};
  for (const ch of votes[0]) count[ch] = new Array(n).fill(0);

  for (const vote of votes) for (let i = 0; i < n; i++) count[vote[i]][i]++;

  const teams = votes[0].split("");
  teams.sort((a, b) => {
    for (let i = 0; i < n; i++) {
      if (count[a][i] !== count[b][i]) return count[b][i] - count[a][i];
    }
    return a < b ? -1 : 1; // alphabetical tiebreak
  });

  return teams.join("");
}

/**
 * Solution 2: Score Array as Sort Key (same complexity, slightly cleaner)
 * Time: O(n·m + m² log m)
 * Space: O(m²)
 */
function rankTeamsByVotes2(votes: string[]): string {
  const m = votes[0].length;
  const score = new Map<string, number[]>();
  for (const ch of votes[0]) score.set(ch, new Array(m).fill(0));

  for (const vote of votes) for (let i = 0; i < m; i++) score.get(vote[i])![i]++;

  return [...score.keys()]
    .sort((a, b) => {
      const sa = score.get(a)!,
        sb = score.get(b)!;
      for (let i = 0; i < m; i++) if (sa[i] !== sb[i]) return sb[i] - sa[i];
      return a < b ? -1 : 1;
    })
    .join("");
}

// === Test Cases ===
console.log(rankTeamsByVotes(["ABC", "ACB", "ABC", "ACB", "ACB"])); // "ACB"
console.log(rankTeamsByVotes(["WXYZ", "XYZW"])); // "XWYZ"
console.log(rankTeamsByVotes(["BCA", "CAB", "CBA", "ABC", "ACB", "BAC"])); // "ABC"
console.log(rankTeamsByVotes(["M"])); // "M"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Pattern                | Difficulty |
| ------------------------------------------------------------------------------------------ | ---------------------- | ---------- |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                 | Heap + Custom Sort     | Medium     |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                             | Greedy + Count         | Medium     |
| [Largest Number](https://leetcode.com/problems/largest-number)                             | Custom Comparator Sort | Medium     |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency) | Bucket Sort            | Medium     |
