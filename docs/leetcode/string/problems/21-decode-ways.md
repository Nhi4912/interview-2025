---
layout: page
title: "Decode Ways"
difficulty: Medium
category: String
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/decode-ways/"
---

# Decode Ways / Số Cách Giải Mã

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Common DP string problem
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Word Break](./20-word-break.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn nhận được một băng mã morse và phải đọc từng đoạn để giải mã thành chữ cái. Tại mỗi bước, bạn có thể đọc 1 ký hiệu hoặc 2 ký hiệu liên tiếp — nhưng chỉ khi chúng tạo thành mã hợp lệ (1–26, không có số "0" đứng đầu). Số cách đọc toàn bộ băng chính là đáp án.

- **Pattern Recognition:**
  - "Count number of ways to decode a string" → **Counting DP** (subproblem = prefix count)
  - Two choices at each position (1-digit or 2-digit) with validity constraints → same skeleton as **Climbing Stairs**
  - `dp[i]` only depends on `dp[i-1]` and `dp[i-2]` → space-optimizable to O(1)

- **Visual — s="226":**

```
dp index: 0    1    2    3
          [1]  [1]  [?]  [?]

i=2: s[1]='2' (≠'0') → dp[2] += dp[1] = 1
     s[0..1]="22" → 10≤22≤26 → dp[2] += dp[0] = 1
     dp[2] = 2

i=3: s[2]='6' (≠'0') → dp[3] += dp[2] = 2
     s[1..2]="26" → 10≤26≤26 → dp[3] += dp[1] = 1
     dp[3] = 3

Return dp[3] = 3  ✓  ("BBF", "BZ", "VF")
```

## Problem Description

Given a string `s` of digits, where `'A'→"1"`, `'B'→"2"`, ..., `'Z'→"26"`, return the **number of ways** to decode it. Leading zeros are always invalid.

```
Input: s = "12"   → 2   ("AB" or "L")
Input: s = "226"  → 3   ("BBF", "BZ", "VF")
Input: s = "06"   → 0   (leading zero — invalid)
```

## 📝 Interview Tips

1. **This is Climbing Stairs with conditions** / **Leo cầu thang có điều kiện**: mỗi bước có thể bước 1 hoặc 2 bậc, nhưng chỉ khi ký tự tạo thành mã hợp lệ (1–26, không có zero đứng đầu).
2. **Handle '0' carefully** / **Xử lý '0' cẩn thận**: `s[i]='0'` → không thể decode 1 ký tự; `s[i-1]='0'` → `twoDigit < 10` → không thể decode 2 ký tự. Cả hai fail → `dp[i] = 0` lan truyền qua mảng.
3. **Base case dp[0]=1** / **Base case dp[0]=1**: chuỗi rỗng = 1 cách (nền để tích lũy) — quy ước DP đếm, không phải cách giải thực tế.
4. **Two-digit range is 10–26** / **Phạm vi hợp lệ là 10–26**: `"01"` → parseInt=1 < 10 → invalid; `"27"` → 27 > 26 → invalid. Luôn check `10 ≤ two ≤ 26`.
5. **Space-optimize in interviews** / **Tối ưu bộ nhớ trong phỏng vấn**: chỉ cần 2 biến `prev1`, `prev2` thay vì mảng O(n) — giống Fibonacci rolling.
6. **Edge cases to mention** / **Edge case cần nêu**: `"0"→0`, `"10"→1` ("J" only), `"100"→0` (đuôi "0" không decode được), `"30"→0` (30>26).

## Solutions

{% raw %}
/\*\* \* 91. Decode Ways — Recursive + Memoization (Top-Down DP) \* At each index, try decoding 1 digit then 2 digits; cache results. \* Time O(n), Space O(n) — memo map + call stack
\*/
function numDecodingsMemo(s: string): number {
const memo = new Map<number, number>();

    function dp(i: number): number {
        if (i === s.length) return 1;
        if (s[i] === '0') return 0;
        if (memo.has(i)) return memo.get(i)!;

        let ways = dp(i + 1);
        if (i + 1 < s.length) {
            const two = parseInt(s.slice(i, i + 2));
            if (two >= 10 && two <= 26) ways += dp(i + 2);
        }

        memo.set(i, ways);
        return ways;
    }

    return dp(0);

}

/\*\* \* Bottom-Up DP — space-optimized, recommended for interviews. \* dp[i] = ways to decode s[0..i-1]; only prev1/prev2 needed at each step. \* Transition: if s[i-1]≠'0' → curr += prev1; if 10≤two≤26 → curr += prev2. \* Time O(n), Space O(1)
\*/
function numDecodings(s: string): number {
if (s[0] === '0') return 0;
const n = s.length;
let prev2 = 1; // dp[i-2]: base dp[0]
let prev1 = 1; // dp[i-1]: base dp[1]

    for (let i = 2; i <= n; i++) {
        let curr = 0;
        if (s[i - 1] !== '0') curr += prev1;           // valid 1-digit decode
        const two = parseInt(s.slice(i - 2, i));
        if (two >= 10 && two <= 26) curr += prev2;      // valid 2-digit decode
        prev2 = prev1;
        prev1 = curr;
    }

    return prev1;

}

// Inline checks
console.log(numDecodings("12")); // 2 ("AB" or "L")
console.log(numDecodings("226")); // 3 ("BBF", "BZ", "VF")
console.log(numDecodings("06")); // 0 (leading zero)
console.log(numDecodings("10")); // 1 ("J" only, "0" alone invalid)
{% endraw %}

## 🔗 Related Problems

- [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) — same DP skeleton without validity conditions
- [139. Word Break](./20-word-break.md) — segmentation counting DP, same position-based structure
- [639. Decode Ways II](https://leetcode.com/problems/decode-ways-ii/) — adds `*` wildcard, significantly harder variant
- [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) — same two-variable rolling space optimization
- [198. House Robber](https://leetcode.com/problems/house-robber/) — same dp[i] = f(dp[i-1], dp[i-2]) recurrence pattern
