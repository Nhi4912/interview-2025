---
layout: page
title: "Edit Distance"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/edit-distance/"
---

# Edit Distance / Khoảng Cách Chỉnh Sửa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Coin Change](./02-coin-change.md) | [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn là biên tập viên phải biến từ "horse" thành "ros" bằng ít thao tác nhất — xóa chữ, thêm chữ, hoặc thay chữ, mỗi thao tác tốn 1 đơn vị. DP lưu lại kết quả của các cặp tiền tố ngắn hơn, rồi dùng chúng để xây đáp án cho cặp dài hơn — tránh tính lại từ đầu.

**Pattern Recognition:**

- Signal: "minimum operations to convert" → **2D DP (Levenshtein Distance)**
- dp[i][j] = min ops to convert word1[0..i-1] → word2[0..j-1]
- Recurrence: chars match → dp[i-1][j-1]; else → 1 + min(delete, insert, replace)

**Visual — DP table for "horse" → "ros":**

```
      ""  r  o  s
  ""  [ 0  1  2  3 ]
  h   [ 1  1  2  3 ]
  o   [ 2  2  1  2 ]
  r   [ 3  2  2  2 ]
  s   [ 4  3  3  2 ]
  e   [ 5  4  4  3 ] ← dp[5][3] = 3 ✅

  Cell rule:
  word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]         (no op)
  else:                      dp[i][j] = 1 + min(
                               dp[i-1][j],    ← delete from word1
                               dp[i][j-1],    ← insert into word1
                               dp[i-1][j-1])  ← replace
```

---

## Problem Description

Given two strings `word1` and `word2`, return the minimum number of operations to convert `word1` to `word2`. Allowed operations: insert, delete, or replace a character (each costs 1).

```
Example 1: word1="horse", word2="ros" → 3
  horse → rorse (replace h→r) → rose (delete r) → ros (delete e)

Example 2: word1="intention", word2="execution" → 5

Example 3: word1="", word2="abc" → 3  (insert 3 chars)
```

Constraints:

- 0 ≤ word1.length, word2.length ≤ 500

---

## 📝 Interview Tips

1. **Clarify**: Are all three operations cost-1? / Ba thao tác có chi phí bằng nhau không?
2. **Brute force**: Recursion without memo → O(3^(m+n)), exponential / Đệ quy thuần bùng nổ tổ hợp.
3. **Optimize**: Memoize → bottom-up 2D DP → space-optimize with rolling array / Tối ưu dần: memo → bảng 2D → 1 hàng rolling.
4. **Edge cases**: Either string empty → answer is the other string's length / Chuỗi rỗng thì đáp án = độ dài chuỗi còn lại.
5. **Complexity**: Time O(m×n), Space O(m×n) → optimized O(min(m,n)) / Space tối ưu xuống O(n).
6. **Follow-up**: Reconstruct the actual edit sequence by backtracking from dp[m][n] / Tái tạo chuỗi thao tác cụ thể.

---

## Solutions

```typescript

/**

- Solution 1: 2D DP Bottom-Up (Classic)
- Time: O(m×n) — fill entire m×n table
- Space: O(m×n) — 2D dp array
  */
  function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  // dp[i][0]=i (delete all), dp[0][j]=j (insert all)
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
  Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

for (let i = 1; i <= m; i++) {
for (let j = 1; j <= n; j++) {
dp[i][j] = word1[i - 1] === word2[j - 1]
? dp[i - 1][j - 1]
: 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
}
}
return dp[m][n];
}

/**

- Solution 2: Space-Optimized 1D Rolling Array (Optimal)
- Time: O(m×n) — same computation
- Space: O(min(m,n)) — single row, reused each iteration
  */
  function minDistanceOptimal(word1: string, word2: string): number {
  // Iterate over longer string; store shorter in array dimension
  if (word1.length < word2.length) [word1, word2] = [word2, word1];
  const m = word1.length, n = word2.length;

let prev = Array.from({ length: n + 1 }, (_, j) => j);

for (let i = 1; i <= m; i++) {
const curr: number[] = [i];
for (let j = 1; j <= n; j++) {
curr[j] = word1[i - 1] === word2[j - 1]
? prev[j - 1]
: 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
}
prev = curr;
}
return prev[n];
}

// === Test Cases ===
console.log(minDistance("horse", "ros")); // 3
console.log(minDistance("intention", "execution")); // 5
console.log(minDistance("", "abc")); // 3
console.log(minDistanceOptimal("abc", "abc")); // 0

```

---

## 🔗 Related Problems

- [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — same 2D DP structure; LCS helps bound edit distance
- [One Edit Distance](https://leetcode.com/problems/one-edit-distance/) — simplified: check if edit distance equals exactly 1
- [Minimum ASCII Delete Sum](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/) — variant with character cost weighting
- [Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/) — only delete operations allowed
