---
layout: page
title: "Delete Operation for Two Strings"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/delete-operation-for-two-strings"
---

# Delete Operation for Two Strings / Thao Tác Xóa Cho Hai Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, LinkedIn

## 🧠 Intuition / Tư Duy

**Analogy:** Như chỉnh sửa bản thảo đến khi hai người đồng ý — mỗi người xóa những từ không chung nhau. Số lần xóa tối thiểu = tổng độ dài hai chuỗi trừ đi hai lần độ dài chuỗi con chung dài nhất (LCS).

**Pattern Recognition:**

- "Min deletions to make two strings equal" = len(s1) + len(s2) - 2 × LCS(s1, s2)
- Classic LCS DP: match → extend diagonal; mismatch → take max of skip-left or skip-top
- Can also directly DP on deletion cost without computing LCS separately

**Visual:**

```
s1="sea"  s2="eat"   LCS = "ea" (length 2)
     ""   e   a   t
  ""  0   0   0   0
  s   0   0   0   0
  e   0   1   1   1
  a   0   1   2   2
LCS=2  → min deletions = 3 + 3 - 2*2 = 2  (delete 's', delete 't')
```

## Problem Description

Given two strings `word1` and `word2`, return the minimum number of deletion steps to make them equal (each step deletes one character from either string).

Examples: word1="sea", word2="eat" → 2; word1="leetcode", word2="etco" → 4.

## 📝 Interview Tips

1. **Clarify**: Chỉ xóa, không chèn hay thay thế / only deletion, not insertion or replacement (that would be full edit distance).
2. **Approach**: min_del = len(w1)+len(w2)-2\*LCS; tìm LCS trước là cách dễ giải thích nhất / LCS-based formula is most intuitive.
3. **Edge cases**: Hai chuỗi giống nhau → 0; một chuỗi là "" → xóa chuỗi kia hoàn toàn.
4. **Optimize**: 2-row DP giảm space từ O(m×n) xuống O(n) / use 2 rows or even 1 row for O(n) space.
5. **Follow-up**: Edit distance (LC 72) cho phép cả insert và replace — tổng quát hơn bài này.
6. **Complexity**: Time O(m × n), Space O(n) optimized.

## Solutions

```typescript
/** Solution 1: LCS-based approach
 * Time: O(m * n) | Space: O(m * n)
 */
function minDistance(word1: string, word2: string): number {
  const m = word1.length,
    n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return m + n - 2 * dp[m][n];
}

/** Solution 2: Direct deletion DP
 * dp[i][j] = min deletions to make word1[0..i-1] == word2[0..j-1]
 * Time: O(m * n) | Space: O(m * n)
 */
function minDistance2(word1: string, word2: string): number {
  const m = word1.length,
    n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => i + j),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

/** Solution 3: Space-optimized O(n) space
 * Time: O(m * n) | Space: O(n)
 */
function minDistance3(word1: string, word2: string): number {
  const m = word1.length,
    n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array<number>(n + 1).fill(i);
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) cur[j] = prev[j - 1];
      else cur[j] = 1 + Math.min(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}

// Tests
console.log(minDistance("sea", "eat")); // 2
console.log(minDistance("leetcode", "etco")); // 4
console.log(minDistance2("sea", "eat")); // 2
console.log(minDistance3("sea", "eat")); // 2
console.log(minDistance("", "abc")); // 3
console.log(minDistance("abc", "abc")); // 0
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                             |
| -------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Edit Distance](https://leetcode.com/problems/edit-distance)                           | Generalizes to insert + replace + delete |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence) | Core subroutine used here                |
| [Uncrossed Lines](https://leetcode.com/problems/uncrossed-lines)                       | Graphically equivalent to LCS            |
