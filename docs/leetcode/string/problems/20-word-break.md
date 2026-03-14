# Word Break / Phân tách từ

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **LeetCode**: #139 | **Pattern**: Dynamic Programming / BFS
> **Category**: String, DP, Graph

## Problem / Đề bài

**English**: Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. The same word in the dictionary may be reused multiple times.

**Vietnamese**: Cho một chuỗi `s` và một danh sách từ điển `wordDict`, trả về `true` nếu `s` có thể được phân tách thành một chuỗi các từ trong từ điển (mỗi từ có thể dùng nhiều lần).

**Example**:
```
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leetcode" can be segmented as "leet code"

Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: "apple pen apple" — "apple" is reused

Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
```

**Constraints**:
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20
- All strings consist of lowercase English letters
- All words in wordDict are unique

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Khi bạn thấy: "có thể phân tách / chia chuỗi thành các phần thỏa mãn điều kiện?" — đây là dấu hiệu của **DP on strings**. Subproblem tự nhiên là: "có thể phân tách substring `s[0..i]` không?" Mỗi quyết định (chọn từ nào kết thúc tại vị trí `i`) phụ thuộc vào kết quả của subproblem nhỏ hơn → DP.

Alternatively, bài này có thể mô hình hóa như **BFS trên graph** — mỗi index là một node, có edge từ `i` đến `j` nếu `s[i..j-1]` là từ trong dict.

### Key Insight / Ý tưởng chính

Define `dp[i]` = "chuỗi con `s[0..i-1]` (độ dài `i`) có thể phân tách được không?"
Base case: `dp[0] = true` (chuỗi rỗng luôn hợp lệ).
Transition: `dp[i] = true` nếu tồn tại `j < i` sao cho `dp[j] == true` **VÀ** `s[j..i-1]` có trong từ điển.

---

## Solutions / Các cách giải

### Solution 1: Bottom-Up DP — O(n² · m) time, O(n) space ✅ Recommended

**Idea**: Build a boolean DP array where `dp[i]` represents whether the first `i` characters of `s` can be segmented using words from the dictionary.

**Ý tưởng**: Xây dựng mảng DP boolean trong đó `dp[i]` biểu thị liệu `i` ký tự đầu của `s` có thể phân tách hợp lệ không. Duyệt từng vị trí, kiểm tra mọi từ trong dict kết thúc tại vị trí đó.

**Algorithm**:
1. Create boolean array `dp` of size `n+1`, set `dp[0] = true`
2. For each index `i` from 1 to n:
   a. For each word in `wordDict`:
      - Let `w = len(word)`
      - If `i >= w` and `dp[i - w] == true` and `s[i-w .. i-1] == word`: set `dp[i] = true`
3. Return `dp[n]`

**Pseudocode**:
```
function wordBreak(s, wordDict):
    n = length(s)
    dp = array of (n+1) booleans, all false
    dp[0] = true
    wordSet = set(wordDict)

    for i from 1 to n:
        for each word in wordDict:
            w = length(word)
            if i >= w and dp[i - w] == true:
                if s[i-w .. i-1] == word:
                    dp[i] = true
                    break   // no need to check more words for this i

    return dp[n]
```

**Visual**:
```
s = "leetcode",  wordDict = ["leet", "code"]

Index:  0   1   2   3   4   5   6   7   8
Char:       l   e   e   t   c   o   d   e

dp:    [T] [F] [F] [F] [F] [F] [F] [F] [F]
                               ^
dp[0]=T, check i=4:
  word="leet" (len=4): dp[4-4]=dp[0]=T, s[0..3]="leet" ✓ → dp[4]=T

dp:    [T] [F] [F] [F] [T] [F] [F] [F] [F]

check i=8:
  word="code" (len=4): dp[8-4]=dp[4]=T, s[4..7]="code" ✓ → dp[8]=T

dp:    [T] [F] [F] [F] [T] [F] [F] [F] [T]

Return dp[8] = true ✓
```

**Complexity**:
- Time: O(n · |wordDict| · m) — n positions × number of words × average word length for string comparison; often written O(n²) when word lengths are bounded
- Space: O(n) — for the dp array

---

### Solution 2: BFS (Breadth-First Search) — O(n²) time, O(n) space

**Idea**: Treat each index in `s` as a graph node. Start BFS from index 0. From each reachable index `i`, try all words in the dictionary — if `s[i .. i+len(word)-1]` matches, add `i + len(word)` to the BFS queue. If we reach index `n`, return true.

**Algorithm**:
1. Initialize queue with index 0, visited set = {0}
2. While queue is not empty:
   a. Dequeue index `start`
   b. For each word in wordDict:
      - `end = start + len(word)`
      - If `end <= n` and `s[start..end-1] == word` and `end` not visited:
        - If `end == n`: return true
        - Add `end` to queue and visited
3. Return false

**Complexity**:
- Time: O(n · |wordDict| · m) — similar to DP approach
- Space: O(n) — queue and visited set

---

### Solution 3: Top-Down DP with Memoization — O(n²) time, O(n) space

**Idea**: Recursive solution — can we break `s[start..n-1]`? Try each word as prefix; recurse on remaining suffix. Cache results by `start` index to avoid recomputation.

**Pseudocode**:
```
memo = {}

function canBreak(s, start, wordDict):
    if start == length(s): return true
    if start in memo: return memo[start]

    for each word in wordDict:
        end = start + length(word)
        if end <= length(s) and s[start..end-1] == word:
            if canBreak(s, end, wordDict):
                memo[start] = true
                return true

    memo[start] = false
    return false
```

**Complexity**:
- Time: O(n · |wordDict| · m)
- Space: O(n) — recursion stack + memo

---

## Comparison / So sánh

| Solution | Time | Space | Notes |
|----------|------|-------|-------|
| Bottom-Up DP | O(n · W · m) | O(n) | Recommended — iterative, no stack overflow |
| BFS | O(n · W · m) | O(n) | Intuitive as graph traversal |
| Top-Down Memo | O(n · W · m) | O(n) | Good if you prefer recursion |

W = number of words, m = average word length

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: The DP definition `dp[i]` = "can we segment first `i` characters" is the natural subproblem. Always start by defining what your DP state represents.
- **Edge cases**: Empty string → return true. Word longer than `s` → skip safely. All words in dict but no valid segmentation (e.g., "catsandog") — DP handles this naturally.
- **Follow-up**: LC 140 — Word Break II asks for **all** valid segmentations. Use backtracking + memoization. Much harder — O(2^n) worst case for output size alone.
- **Optimization**: Convert `wordDict` to a hash set for O(1) lookups, then iterate over all possible substrings ending at `i` instead of iterating over all words. This is better when `s` is short and dict is large.

---

## Related Problems / Bài liên quan

- LC 140 — Word Break II (return all segmentations, backtracking)
- LC 139 variants — different dictionary sizes, repeated words allowed/not
- LC 322 — Coin Change (same DP pattern: can we reach exactly amount N?)
- LC 91 — Decode Ways (similar DP on string positions)
