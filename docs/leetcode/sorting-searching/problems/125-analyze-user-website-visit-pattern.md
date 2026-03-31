---
layout: page
title: "Analyze User Website Visit Pattern"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/analyze-user-website-visit-pattern"
---

# Analyze User Website Visit Pattern / Phân Tích Hành Vi Duyệt Web

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting + Hash Map
> **Frequency**: 📘 Tier 3 | **Company tags**: Amazon

## 🧠 Intuition / Tư Duy

**Giống phân tích thói quen mua sắm:** marketing team muốn tìm "hành trình 3 bước" phổ biến nhất. Group user lại, liệt kê mọi combo 3 trang theo thứ tự, đếm combo nào nhiều người cùng đi.

**Pattern Recognition:**

- Signal: "grouped events + ordered subsequences + max frequency" → **Sort + HashMap + Combinations**
- Group by user → sort by timestamp → generate C(n,3) triplets per user
- Dùng Set per user để tránh đếm trùng cùng người

**Visual:**

```
Input: user=["A","A","A","B","B"], ts=[1,2,3,4,5], web=["w1","w2","w3","w1","w2"]

After sort by ts → already sorted
User A: [w1, w2, w3] → triplets: {w1,w2,w3}
User B: [w1, w2]     → triplets: (none, need 3)

freq = { "w1,w2,w3": 1 }
Result: ["w1","w2","w3"] ✅
```

## Problem Description

Given parallel arrays `username[]`, `timestamp[]`, `website[]`, find the 3-sequence pattern (preserving visit order) visited by the most unique users. Return lexicographically smallest pattern on ties.

- Example 1: users=["joe","joe","joe","james","james","james","james","mary","mary","mary"], ts=[1,2,3,4,5,6,7,8,9,10], web=["home","about","career","home","cart","maps","home","home","about","career"] → `["home","about","career"]`
- Example 2: 3 events, 1 user → only one possible triplet

## 📝 Interview Tips

1. **Clarify**: Triplet phải đúng thứ tự thời gian không? / Must triplet preserve chronological order? Yes
2. **Approach**: Sort by timestamp, group by user, enumerate C(n,3) / Sort then group, generate all ordered triplets
3. **Edge cases**: User có ít hơn 3 trang / User with fewer than 3 visits contributes no triplets
4. **Optimize**: Dùng Set per user để tránh đếm trùng / Use Set per user to avoid double-counting same pattern
5. **Follow-up**: Nếu k thay vì 3? / Generalize to k-sequence? → same approach, C(n,k)
6. **Complexity**: Time O(n³ \* n) worst case, Space O(n³) for pattern storage

## Solutions

```typescript
/** Solution 1: Brute Force – Generate All Triplets Per User
 * Time: O(n³ * log n) | Space: O(n³)
 */
function mostVisitedPatternBrute(
  username: string[],
  timestamp: number[],
  website: string[],
): string[] {
  // Sort events by timestamp
  const events = username.map((u, i) => [timestamp[i], u, website[i]] as [number, string, string]);
  events.sort((a, b) => a[0] - b[0]);

  // Group by user
  const userSites = new Map<string, string[]>();
  for (const [, u, w] of events) {
    if (!userSites.has(u)) userSites.set(u, []);
    userSites.get(u)!.push(w);
  }

  // Count patterns
  const freq = new Map<string, number>();
  for (const sites of userSites.values()) {
    const seen = new Set<string>();
    for (let i = 0; i < sites.length - 2; i++)
      for (let j = i + 1; j < sites.length - 1; j++)
        for (let k = j + 1; k < sites.length; k++) {
          const key = `${sites[i]},${sites[j]},${sites[k]}`;
          if (!seen.has(key)) {
            seen.add(key);
            freq.set(key, (freq.get(key) ?? 0) + 1);
          }
        }
  }

  let best = "",
    bestCount = 0;
  for (const [key, count] of freq) {
    if (count > bestCount || (count === bestCount && key < best)) {
      best = key;
      bestCount = count;
    }
  }
  return best.split(",");
}

/** Solution 2: Optimized – Same Logic, Cleaner Map Usage
 * Time: O(n³) | Space: O(n²)
 */
function mostVisitedPattern(username: string[], timestamp: number[], website: string[]): string[] {
  const events = username
    .map((u, i) => ({ t: timestamp[i], u, w: website[i] }))
    .sort((a, b) => a.t - b.t);

  const userMap = new Map<string, string[]>();
  for (const { u, w } of events) {
    if (!userMap.has(u)) userMap.set(u, []);
    userMap.get(u)!.push(w);
  }

  const patternCount = new Map<string, number>();
  for (const sites of userMap.values()) {
    const n = sites.length;
    const userPatterns = new Set<string>();
    for (let i = 0; i < n - 2; i++)
      for (let j = i + 1; j < n - 1; j++)
        for (let k = j + 1; k < n; k++) userPatterns.add(`${sites[i]}|${sites[j]}|${sites[k]}`);
    for (const p of userPatterns) patternCount.set(p, (patternCount.get(p) ?? 0) + 1);
  }

  let result = "";
  let maxCount = 0;
  for (const [p, c] of patternCount) {
    if (c > maxCount || (c === maxCount && p < result)) {
      result = p;
      maxCount = c;
    }
  }
  return result.split("|");
}

// Tests
console.log(
  mostVisitedPattern(
    ["joe", "joe", "joe", "james", "james", "james", "james", "mary", "mary", "mary"],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ["home", "about", "career", "home", "cart", "maps", "home", "home", "about", "career"],
  ),
); // ["home","about","career"]
console.log(
  mostVisitedPattern(
    ["ua", "ua", "ua", "ub", "ub", "ub"],
    [1, 2, 3, 4, 5, 6],
    ["a", "b", "c", "a", "b", "c"],
  ),
);
// ["a","b","c"]
console.log(mostVisitedPatternBrute(["joe", "joe", "joe"], [1, 2, 3], ["a", "b", "c"])); // ["a","b","c"]
```

## 🔗 Related Problems

| Problem                                                                                      | Relationship                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words)                   | Frequency counting with lex tie-break |
| [Group Anagrams](https://leetcode.com/problems/group-anagrams)                               | Group then aggregate                  |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) | Pattern matching in sequences         |
