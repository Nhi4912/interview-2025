# Decode Ways / Số cách giải mã

> **Track**: Shared | **Difficulty**: 🟡 Medium
> **LeetCode**: #91 | **Pattern**: Dynamic Programming
> **Category**: String, DP

## Problem / Đề bài

**English**: A message containing letters A–Z is encoded as numbers using the mapping `'A' → "1"`, `'B' → "2"`, ..., `'Z' → "26"`. Given a string `s` of digits, return the **number of ways** to decode it. If there are no valid decodings, return 0.

**Vietnamese**: Một thông điệp gồm các chữ cái A–Z được mã hóa thành số theo ánh xạ `'A' → "1"`, `'B' → "2"`, ..., `'Z' → "26"`. Cho chuỗi số `s`, trả về **số cách giải mã** hợp lệ. Nếu không có cách nào, trả về 0.

**Example**:
```
Input: s = "12"
Output: 2
Explanation: "12" → "AB" (1,2) OR "L" (12) — 2 ways

Input: s = "226"
Output: 3
Explanation: "BZ"(2,26), "VF"(22,6), "BBF"(2,2,6) — 3 ways

Input: s = "06"
Output: 0
Explanation: "06" cannot be decoded — "06" ≠ "6", leading zero is invalid
```

**Constraints**:
- 1 <= s.length <= 100
- `s` contains only digits
- `s` may contain leading zeros

---

## Approach / Hướng giải

### Pattern nhận dạng / Pattern recognition

Khi bài hỏi **"đếm số cách"** để phân tách / giải mã một chuỗi, đây là DP đếm (counting DP). Subproblem: "có bao nhiêu cách giải mã `s[0..i-1]`?" — đây là dạng tương tự **Climbing Stairs** (DP bước 1 hoặc bước 2) nhưng có điều kiện validity cho mỗi bước.

### Key Insight / Ý tưởng chính

Tại mỗi vị trí `i`, bạn có thể:
1. Decode **1 chữ số** `s[i]` (hợp lệ nếu `s[i] != '0'`) → kế thừa `dp[i-1]` cách
2. Decode **2 chữ số** `s[i-1..i]` (hợp lệ nếu tạo thành số từ 10–26) → kế thừa `dp[i-2]` cách

`dp[i]` = tổng các trường hợp hợp lệ từ bước 1 và bước 2.

---

## Solutions / Các cách giải

### Solution 1: Bottom-Up DP — O(n) time, O(n) space ✅ Recommended

**Idea**: Define `dp[i]` = number of ways to decode the first `i` characters of `s`. Fill the array left to right using the 1-digit and 2-digit transition rules.

**Ý tưởng**: Định nghĩa `dp[i]` = số cách giải mã `i` ký tự đầu tiên của `s`. Điền mảng từ trái sang phải, mỗi ô xét 2 khả năng: lấy 1 ký tự hoặc lấy 2 ký tự liền trước.

**Algorithm**:
1. If `s[0] == '0'`: return 0 (can't decode leading zero)
2. Create `dp[0..n]`, set `dp[0] = 1` (empty string = 1 way), `dp[1] = 1`
3. For `i` from 2 to n:
   - **One-digit**: if `s[i-1] != '0'`: `dp[i] += dp[i-1]`
   - **Two-digit**: let `two = s[i-2..i-1]` as integer; if `10 <= two <= 26`: `dp[i] += dp[i-2]`
4. Return `dp[n]`

**Pseudocode**:
```
function numDecodings(s):
    n = length(s)
    if s[0] == '0': return 0

    dp = array of (n+1) integers, all 0
    dp[0] = 1    // base: empty string
    dp[1] = 1    // base: first char (already checked != '0')

    for i from 2 to n:
        oneDigit = s[i-1]           // current character
        twoDigit = s[i-2..i-1]      // last two characters as number

        if oneDigit != '0':
            dp[i] += dp[i-1]

        if 10 <= twoDigit <= 26:
            dp[i] += dp[i-2]

    return dp[n]
```

**Visual**:
```
s = "2 2 6"
     0 1 2   (0-indexed chars)

dp index: 0   1   2   3
          [1] [1] [?] [?]

i=2: s[1]='2' (≠'0') → dp[2] += dp[1] = 1
     s[0..1]="22" → 22 is 10-26 → dp[2] += dp[0] = 1
     dp[2] = 2

i=3: s[2]='6' (≠'0') → dp[3] += dp[2] = 2
     s[1..2]="26" → 26 is 10-26 → dp[3] += dp[1] = 1
     dp[3] = 3

Answer: dp[3] = 3 ✓  ("BBF", "BZ", "VF")

---
s = "0 6"

s[0]='0' → return 0 immediately ✓

---
s = "1 0 6"

dp: [1][1][?][?]

i=2: s[1]='0' → skip one-digit
     s[0..1]="10" → 10-26 → dp[2] += dp[0] = 1
     dp[2] = 1   ("J" only, not "1","0" separately)

i=3: s[2]='6' → dp[3] += dp[2] = 1
     s[1..2]="06" → 6 < 10 → skip
     dp[3] = 1   ("JF" only)
```

**Complexity**:
- Time: O(n) — single pass through the string
- Space: O(n) — dp array of size n+1

---

### Solution 2: Space-Optimized DP — O(n) time, O(1) space

**Idea**: Notice that `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`. Use two variables instead of an array — identical to the space-optimized Fibonacci pattern.

**Algorithm**:
1. Handle `s[0] == '0'` edge case → return 0
2. `prev2 = 1` (represents dp[i-2]), `prev1 = 1` (represents dp[i-1])
3. For `i` from 2 to n:
   - `curr = 0`
   - If `s[i-1] != '0'`: `curr += prev1`
   - If `10 <= int(s[i-2..i-1]) <= 26`: `curr += prev2`
   - `prev2 = prev1`, `prev1 = curr`
4. Return `prev1`

**Pseudocode**:
```
function numDecodings(s):
    if s[0] == '0': return 0
    n = length(s)
    prev2 = 1
    prev1 = 1

    for i from 2 to n:
        curr = 0
        if s[i-1] != '0':
            curr += prev1
        twoDigit = integer value of s[i-2..i-1]
        if 10 <= twoDigit <= 26:
            curr += prev2
        prev2 = prev1
        prev1 = curr

    return prev1
```

**Complexity**:
- Time: O(n)
- Space: O(1) — only two variables

---

## Comparison / So sánh

| Solution | Time | Space | Notes |
|----------|------|-------|-------|
| Bottom-Up DP | O(n) | O(n) | Easier to understand and debug |
| Space-Optimized DP | O(n) | O(1) | Optimal — preferred in interviews |

---

## Interview Tips / Mẹo phỏng vấn

- **Key point**: This is "Climbing Stairs with conditions." At each step, you can take 1 or 2 steps, but only if the corresponding digit(s) form a valid letter (1-26, no leading zeros).
- **Edge cases**:
  - `s = "0"` → 0 (invalid)
  - `s = "10"` → 1 (only "J", not "1"+"0")
  - `s = "100"` → 0 ("10"+"0" — the trailing 0 can't be decoded alone)
  - `s = "30"` → 0 ("30" > 26, and "0" alone is invalid)
  - `s = "27"` → 1 ("BG" only, 27 > 26 so can't be one letter)
- **Follow-up**: LC 639 — Decode Ways II with `*` wildcards (much harder).
- **Tricky**: "06" is NOT valid for two-digit decode because it represents 6, not a two-digit number. Always check `twoDigit >= 10`.

---

## Related Problems / Bài liên quan

- LC 70 — Climbing Stairs (same DP skeleton without conditions)
- LC 139 — Word Break (segmentation counting DP)
- LC 639 — Decode Ways II (with wildcards)
- LC 509 — Fibonacci Number (pure recurrence, same space optimization)
