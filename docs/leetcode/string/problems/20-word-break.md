---
layout: page
title: "Word Break"
difficulty: Medium
category: String
tags: [String, Dynamic Programming, BFS, Hash Table]
leetcode_url: "https://leetcode.com/problems/word-break/"
---

# Word Break / Phân Tách Từ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP on String Positions
> **Frequency**: ⭐ Tier 2 — Bài DP nền tảng, xuất hiện rộng rãi ở mọi vòng phỏng vấn
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Decode Ways](./21-decode-ways.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn đang cắt một cuộn vải dài (chuỗi `s`) thành các mảnh theo danh sách kích thước hợp lệ (từ điển). Mỗi lần bạn đặt kéo tại vị trí `i`, bạn kiểm tra: "đoạn vừa cắt có trong danh sách không?" và "đoạn trước đó đã cắt được không?" Nếu cả hai đều đúng — bạn đánh dấu `i` là hợp lệ.

- **Pattern Recognition:**
  - "Can string be segmented into valid parts?" → **DP on positions** (subproblem = prefix solvable)
  - `dp[i]` = "can first `i` chars be segmented?" — depends only on smaller subproblems → DP
  - Alternatively model as **BFS on graph**: nodes = indices, edge `i→j` if `s[i..j-1]` in dict

- **Visual — s="leetcode", wordDict=["leet","code"]:**

```
dp index: 0    1    2    3    4    5    6    7    8
          [T]  [F]  [F]  [F]  [?]  [F]  [F]  [F]  [?]

i=4: word="leet"(len=4): dp[4-4]=dp[0]=T, s[0..3]="leet" ✓ → dp[4]=T

dp:       [T]  [F]  [F]  [F]  [T]  [F]  [F]  [F]  [?]

i=8: word="code"(len=4): dp[8-4]=dp[4]=T, s[4..7]="code" ✓ → dp[8]=T

dp:       [T]  [F]  [F]  [F]  [T]  [F]  [F]  [F]  [T]

Return dp[8] = true ✓
```

## Problem Description

Given string `s` and `wordDict`, return `true` if `s` can be segmented into one or more dictionary words (words may reuse).

```
Input: s="leetcode",     wordDict=["leet","code"]           → true   ("leet code")
Input: s="applepenapple",wordDict=["apple","pen"]           → true   ("apple pen apple")
Input: s="catsandog",    wordDict=["cats","dog","sand","and","cat"] → false
```

## 📝 Interview Tips

1. **Define dp[i] clearly** / **Định nghĩa dp[i] rõ ràng**: `dp[i]` = "có thể phân tách `s[0..i-1]` không?" — base case `dp[0]=true` (chuỗi rỗng luôn hợp lệ).
2. **Iterate words not substrings** / **Duyệt từ trong dict**: với mỗi `i`, thử tất cả từ trong `wordDict`; nếu `dp[i-len(word)]` và `s[i-len..i-1]` khớp → `dp[i]=true`.
3. **HashSet for O(1) lookup** / **HashSet tra O(1)**: khi dict nhỏ và `s` dài, chuyển sang duyệt mọi substring `s[j..i]` với `Set` — better when dict is large.
4. **Break early** / **Thoát sớm**: khi `dp[i]` đã là `true`, không cần kiểm tra thêm từ nào cho vị trí `i`.
5. **"catsandog" trap** / **Bẫy catsandog**: "cat"+"sand"+"og" — "og" không có trong dict; DP tự nhiên xử lý đúng, đừng lo.
6. **Follow-up LC 140** / **Mở rộng LC 140**: Word Break II — tìm tất cả cách phân tách, dùng backtracking + memo; worst case O(2ⁿ) output.

## Solutions

{% raw %}
/\*\*

- 139.  Word Break
- BFS approach: treat indices as graph nodes, edges when s[start..end-1] is a word.
- Intuitive model — each reachable index represents a valid partial segmentation.
- Time O(n · |wordDict| · m), Space O(n)
  \*/
  function wordBreakBFS(s: string, wordDict: string[]): boolean {
  const n = s.length;
  const queue: number[] = [0];
  const visited = new Set<number>([0]);

      while (queue.length > 0) {
          const start = queue.shift()!;
          for (const word of wordDict) {
              const end = start + word.length;
              if (end <= n && !visited.has(end) && s.slice(start, end) === word) {
                  if (end === n) return true;
                  queue.push(end);
                  visited.add(end);
              }
          }
      }

      return false;

  }

/\*\*

- Bottom-Up DP — recommended for interviews.
- dp[i] = true if s[0..i-1] can be segmented using wordDict.
- Transition: dp[i] = true if ∃ word such that dp[i-word.length] && s matches word.
- Time O(n · |wordDict| · m), Space O(n)
  \*/
  function wordBreak(s: string, wordDict: string[]): boolean {
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true; // empty prefix is always valid

      for (let i = 1; i <= n; i++) {
          for (const word of wordDict) {
              const w = word.length;
              if (i >= w && dp[i - w] && s.slice(i - w, i) === word) {
                  dp[i] = true;
                  break; // no need to check other words for this position
              }
          }
      }

      return dp[n];

  }

// Inline checks
console.log(wordBreak("leetcode", ["leet", "code"])); // true
console.log(wordBreak("applepenapple", ["apple", "pen"])); // true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false
console.log(wordBreakBFS("cars", ["car", "ca", "rs"])); // true
{% endraw %}

## 🔗 Related Problems

- [140. Word Break II](https://leetcode.com/problems/word-break-ii/) — return all valid segmentations; backtracking + memo, much harder
- [322. Coin Change](https://leetcode.com/problems/coin-change/) — same DP pattern: can we reach exactly amount N using denominations?
- [91. Decode Ways](./21-decode-ways.md) — same DP structure; segmenting digit string with validity rules
- [472. Concatenated Words](https://leetcode.com/problems/concatenated-words/) — word break applied to an entire dictionary
- [139 variants](https://leetcode.com/problems/word-break/) — word reuse, no reuse, minimum words — all map to this DP skeleton
