---
layout: page
title: "Count Number of Texts"
difficulty: Medium
category: Dynamic Programming
tags: [Hash Table, Math, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-number-of-texts"
---

# Count Number of Texts / Đếm Số Cách Gõ Tin Nhắn

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Giống bài "Decode Ways": với mỗi chữ số, ta có thể tạo nhóm 1, 2, hoặc 3 (hoặc 4
với phím 7/9) chữ số liên tiếp giống nhau để biểu diễn một ký tự.

**EN:** Like Decode Ways: group 1–3 (or 1–4 for `7`/`9`) identical consecutive digits to
represent one letter. `dp[i]` = number of valid messages for `pressedKeys[0..i-1]`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Number of Texts example:**

```
pressedKeys = "22233"
digit 2 maps to abc (max 3 per letter)
digit 3 maps to def (max 3 per letter)

dp[0]=1
dp[1]= dp[0]               = 1   ("2")
dp[2]= dp[1]+dp[0]         = 2   ("2","22")
dp[3]= dp[2]+dp[1]+dp[0]   = 4   ("2","2","2") or "22","2" etc.
dp[4]= dp[3]               = 4   (switch to digit 3, can't extend back)
dp[5]= dp[4]+dp[3]         = 8
```

---

## Problem Description

| Problem                                                                             | Difficulty | Key Idea           |
| ----------------------------------------------------------------------------------- | ---------- | ------------------ |
| [91. Decode Ways](https://leetcode.com/problems/decode-ways/)                       | 🟡 Medium  | Group digits DP    |
| [639. Decode Ways II](https://leetcode.com/problems/decode-ways-ii/)                | 🔴 Hard    | Wildcard decode DP |
| [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)               | 🟢 Easy    | Fibonacci DP       |
| [2266. Count Number of Texts](https://leetcode.com/problems/count-number-of-texts/) | 🟡 Medium  | This problem       |

---

## 📝 Interview Tips

- 🔑 **EN:** Max group size is 3 for digits 2,3,4,5,6,8 and 4 for 7,9.
  **VI:** Nhóm tối đa là 3 cho chữ số 2,3,4,5,6,8 và 4 cho 7,9.
- 🔑 **EN:** Only extend group if all digits in the window are identical.
  **VI:** Chỉ mở rộng nhóm nếu tất cả chữ số trong cửa sổ giống nhau.
- 🔑 **EN:** `dp[i] += dp[i-k]` for k=1..maxGroup if pressedKeys[i-k..i-1] all same.
  **VI:** `dp[i] += dp[i-k]` với k=1..maxGroup nếu pressedKeys[i-k..i-1] đều giống.
- 🔑 **EN:** Apply MOD=10^9+7 at every step.
  **VI:** Áp dụng MOD=10^9+7 tại mỗi bước.
- 🔑 **EN:** Similar to Decode Ways but the "alphabet" size per digit is variable.
  **VI:** Tương tự Decode Ways nhưng kích thước bảng chữ cái mỗi chữ số khác nhau.
- 🔑 **EN:** Single pass O(n) — inner loop at most 4 iterations (constant time).
  **VI:** Một vòng O(n) — vòng trong tối đa 4 lần lặp (thời gian hằng số).

---

## Solutions

```typescript
/**
 * Count Number of Texts
 * dp[i] = number of valid messages for first i characters
 * Time: O(n)  Space: O(n)
 */
function countTexts(pressedKeys: string): number {
  const MOD = 1_000_000_007;
  const n = pressedKeys.length;
  const maxGroup = (d: string) => (d === "7" || d === "9" ? 4 : 3);
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= n; i++) {
    const cur = pressedKeys[i - 1];
    const limit = maxGroup(cur);
    for (let k = 1; k <= limit && i - k >= 0; k++) {
      // all digits in pressedKeys[i-k .. i-1] must equal cur
      if (pressedKeys[i - k] !== cur) break;
      dp[i] = (dp[i] + dp[i - k]) % MOD;
    }
  }

  return dp[n];
}

console.log(countTexts("22233")); // 8
console.log(countTexts("222222222222222222222222222222222222")); // large
console.log(countTexts("9999")); // 8 (4^groups for digit 9)

/**
 * Keep only last 4 dp values — max group size is 4.
 * Time: O(n)  Space: O(1)
 */
function countTexts2(pressedKeys: string): number {
  const MOD = 1_000_000_007;
  const n = pressedKeys.length;
  // dp window: d[0]=dp[i-4], d[1]=dp[i-3], d[2]=dp[i-2], d[3]=dp[i-1], result=dp[i]
  const win: number[] = [0, 0, 0, 1]; // dp[-3..0]

  for (let i = 1; i <= n; i++) {
    const cur = pressedKeys[i - 1];
    const limit = cur === "7" || cur === "9" ? 4 : 3;
    let val = 0;
    for (let k = 1; k <= limit; k++) {
      if (i - k < 0) break;
      if (pressedKeys[i - k] !== cur) break;
      val = (val + win[4 - k]) % MOD;
    }
    win.shift();
    win.push(val);
  }

  return win[3];
}

console.log(countTexts2("22233")); // 8
console.log(countTexts2("9999")); // 8
```

---

## 🔗 Related Problems

| Problem                                                                             | Difficulty | Key Idea           |
| ----------------------------------------------------------------------------------- | ---------- | ------------------ |
| [91. Decode Ways](https://leetcode.com/problems/decode-ways/)                       | 🟡 Medium  | Group digits DP    |
| [639. Decode Ways II](https://leetcode.com/problems/decode-ways-ii/)                | 🔴 Hard    | Wildcard decode DP |
| [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)               | 🟢 Easy    | Fibonacci DP       |
| [2266. Count Number of Texts](https://leetcode.com/problems/count-number-of-texts/) | 🟡 Medium  | This problem       |
