---
layout: page
title: "Longest Common Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-common-subsequence/"
leetcode_number: 1143
pattern: "2D DP (classic subsequence)"
frequency_tier: 2
companies: [Google, Amazon, Microsoft, Oracle]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Longest Common Subsequence / Dãy Con Chung Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Edit Distance](./07-edit-distance.md) | [Longest Increasing Subsequence](./06-longest-increasing-subsequence.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giả sử bạn có hai bản thảo truyện và muốn tìm đoạn cốt truyện chung dài nhất giữa hai bản — không cần liên tiếp, chỉ cần cùng thứ tự xuất hiện. Thay vì so sánh toàn bộ, bạn xây một bảng so sánh từng cặp ký tự và điền dần: nếu hai ký tự trùng nhau, ta kế thừa từ góc trên-trái cộng 1; nếu không, ta lấy max từ ô trên hoặc ô trái.

**Pattern Recognition:**

- Signal: "two strings", "common subsequence", "length of longest" → **2D DP table**
- Subproblem: `dp[i][j]` = LCS length of `text1[0..i-1]` and `text2[0..j-1]`
- Recurrence: match → `dp[i-1][j-1] + 1`; no match → `max(dp[i-1][j], dp[i][j-1])`

**Visual — text1 = "abcde", text2 = "ace":**

```
      ""  a  c  e
  ""   0  0  0  0
  a    0  1  1  1    'a'=='a' → dp[0][0]+1=1
  b    0  1  1  1    'b'!='a' → max(dp[1][1], dp[2][0])=1
  c    0  1  2  2    'c'=='c' → dp[2][1]+1=2
  d    0  1  2  2    'd'!='c' → max(dp[3][2], dp[4][1])=2
  e    0  1  2  3    'e'=='e' → dp[4][2]+1=3  ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| **When you see** | "two strings", "common subsequence", "longest/shortest common"                |
| **Think**        | 2D DP — `dp[i][j]` = LCS of first i chars of text1 and first j chars of text2 |
| **Template**     | `match → dp[i-1][j-1]+1; else → max(dp[i-1][j], dp[i][j-1])`                  |
| **Time target**  | ⏱️ 25 min (Medium)                                                            |

> 💡 **Memory hook / Móc nhớ:** "Hai chuỗi = bảng 2D — trùng thì chéo +1, khác thì max(trên, trái)!"

---

## Problem Description

Given two strings `text1` and `text2`, return the **length** of their longest common subsequence. A subsequence preserves relative order but doesn't need to be contiguous. Return 0 if none exists.

```
Example 1: text1="abcde", text2="ace"  → 3   (LCS = "ace")
Example 2: text1="abc",   text2="abc"  → 3   (LCS = "abc")
Example 3: text1="abc",   text2="def"  → 0   (no common characters)
```

Constraints:

- `1 <= text1.length, text2.length <= 1000`
- Both strings contain only lowercase English letters

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have two strings and need the length of their longest common subsequence — characters in the same relative order but not necessarily contiguous. Clarify: strictly subsequence, not substring?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "Brute force recursion tries all 2^(m+n) combinations — way too slow. I recognize this as classic 2D DP: define dp[i][j] as LCS of text1[0..i-1] and text2[0..j-1]. If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise, take max of dp[i-1][j] and dp[i][j-1]. O(m·n) time and space."

### Step 3 — Implement / Viết Code (5-7 min)

> "Create (m+1)×(n+1) table initialized to 0. Fill row by row: if text1[i-1] === text2[j-1], diagonal + 1; else max of top and left. Return dp[m][n]."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "For 'abcde' and 'ace': dp fills to 3 at dp[5][3]. Trace: a→c→e matches. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time O(m·n), Space O(m·n) — optimizable to O(min(m,n)) with rolling array. Edge cases: no common chars → 0, identical strings → full length."

---

## 📝 Interview Tips

1. **Clarify**: Return length or the actual subsequence string? / Trả về độ dài hay chuỗi thực tế?
2. **Brute force**: Đệ quy thuần — thử tất cả cặp (i, j) không memo. O(2^(m+n)) time — quá chậm, chỉ dùng để giải thích tư duy.
3. **Optimize**: 2D DP bottom-up — fill `dp[i][j]` từ (0,0) đến (m,n). O(m·n) time, O(m·n) space.
4. **Space optimize**: Chỉ cần 2 rows (prev + curr) → O(min(m,n)) space — đề cập nếu interviewer hỏi follow-up.
5. **Edge cases**: No common chars → return 0; identical strings → return full length; single char strings.
6. **Follow-up**: Return actual LCS string — backtrack qua dp table từ `[m][n]` về `[0][0]` theo chiều match/non-match.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                   | Why Wrong / Tại sao sai                                          | Fix / Cách sửa                                          |
| --- | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Confusing subsequence with substring (contiguous)   | Substring requires consecutive chars; subsequence doesn't        | Subsequence = same order, not necessarily adjacent      |
| 2   | Off-by-one: using `dp[i][j]` for chars at index i,j | dp table is (m+1)×(n+1); row/col 0 are base cases (empty string) | `dp[i][j]` corresponds to `text1[i-1]` and `text2[j-1]` |
| 3   | Forgetting to initialize first row/column to 0      | LCS of any string with empty string is 0 — must be explicit      | Fill `dp[0][j]=0` and `dp[i][0]=0` (or use `.fill(0)`)  |

---

## Solutions

```typescript
/**

- Solution 1: Recursion with Memoization (Top-Down)
- Time: O(m·n) — each (i,j) pair computed exactly once
- Space: O(m·n) — memo map + O(m+n) recursion stack
  */
function lcsTopDown(text1: string, text2: string): number {
  const memo = new Map<string, number>();

  function dfs(i: number, j: number): number {
    if (i >= text1.length || j >= text2.length) return 0;
    const key = `${i},${j}`;
    if (memo.has(key)) return memo.get(key)!;

    const result =
      text1[i] === text2[j] ? 1 + dfs(i + 1, j + 1) : Math.max(dfs(i + 1, j), dfs(i, j + 1));

    memo.set(key, result);
    return result;
  }

  return dfs(0, 0);
}

/**

- Solution 2: DP Bottom-Up 2D Table (Optimal — interview standard)
- Time: O(m·n) — fill entire table
- Space: O(m·n) — dp table; reducible to O(n) with rolling 1D array
  */
function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // characters match → extend LCS
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // take best excluding one
      }
    }
  }

  return dp[m][n];
}

// === Test Cases ===
console.log(longestCommonSubsequence("abcde", "ace")); // 3
console.log(longestCommonSubsequence("abc", "abc")); // 3
console.log(longestCommonSubsequence("abc", "def")); // 0
console.log(longestCommonSubsequence("bl", "yby")); // 1
```

---

## 🔗 Related Problems

- [Edit Distance](./07-edit-distance.md) — 2D DP with insert/delete/replace operations
- [Longest Increasing Subsequence](./06-longest-increasing-subsequence.md) — 1D DP on single sequence
- [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/) — count occurrences of LCS
- [Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/) — build string using LCS result

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 25 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
