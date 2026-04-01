---
layout: page
title: "Minimum Penalty for a Shop"
difficulty: Medium
category: String
tags: [String, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-penalty-for-a-shop"
---

# Minimum Penalty for a Shop / Hình Phạt Tối Thiểu Cho Cửa Hàng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Divisible Substrings](https://leetcode.com/problems/number-of-divisible-substrings) | [Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn là chủ tiệm bánh mì. Mỗi giờ có khách ('Y') hoặc không ('N'). Đóng cửa quá sớm? Phạt vì bỏ lỡ khách. Đóng cửa quá muộn? Phạt vì mở cửa vô ích. Kéo "giờ đóng cửa" từ trái sang phải: gặp 'Y' → giảm phạt 1 (phục vụ thêm được khách); gặp 'N' → tăng phạt 1 (mở vô ích thêm 1 giờ).

**Pattern Recognition:**

- Signal: "scan through and track changing cost as boundary slides" → **Prefix Sum / Running Score**
- Key insight: Khởi tạo penalty = tổng 'Y' (đóng lúc 0 = bỏ hết khách). Di chuyển giờ đóng cửa sang phải: nếu 'Y' penalty--, nếu 'N' penalty++. Track min.

**Visual — customers = "YYNY":**

```
Initial (close at hour 0): penalty = 3  (miss all Y's)

Move close time right:
  hour 0→1: 'Y' served → penalty = 3-1 = 2
  hour 1→2: 'Y' served → penalty = 2-1 = 1  ← min at hour 2
  hour 2→3: 'N' wasted → penalty = 1+1 = 2
  hour 3→4: 'Y' served → penalty = 2-1 = 1  ← tied min, keep earlier

Best closing hour = 2 → answer: 2
```

---

## 📝 Problem Description

Given string `customers` ('Y' = customer arrived, 'N' = no customer). Closing at hour `j` costs: +1 per 'Y' after j (missed) + 1 per 'N' at or before j (open for nothing). Return the earliest hour that minimizes penalty.

- **Example 1:** customers="YYNY" → `2`
- **Example 2:** customers="NNNNN" → `0`

Constraints: `1 ≤ n ≤ 10^5`, string contains only 'Y' and 'N'.

---

## 🎯 Interview Tips

1. **Define penalty formula** / Định nghĩa hình phạt: penalty(j) = #Y[j..n-1] + #N[0..j-1].
2. **Running update trick** / Mẹo cập nhật liên tục: Start at j=0, slide right — 'Y' decrements, 'N' increments.
3. **Why it works** / Tại sao đúng: Moving close time right by 1 captures/releases exactly one character's cost.
4. **Valid range** / Phạm vi hợp lệ: Closing hour ranges from 0 (before open) to n (after all hours).
5. **Tie-breaking** / Phá vỡ bằng nhau: Return the _earliest_ hour with minimum penalty (use strict `<`).
6. **Initialize correctly** / Khởi tạo đúng: penalty at hour 0 = total count of 'Y' (all customers missed).

---

## 💡 Solutions

### Approach 1: Brute Force — O(n²)

/\*_ @complexity Time: O(n²) | Space: O(1) _/

```typescript
function minPenaltyBrute(customers: string): number {
  const n = customers.length;
  let bestHour = 0,
    minPenalty = Infinity;
  for (let j = 0; j <= n; j++) {
    let penalty = 0;
    for (let i = 0; i < j; i++) if (customers[i] === "N") penalty++;
    for (let i = j; i < n; i++) if (customers[i] === "Y") penalty++;
    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestHour = j;
    }
  }
  return bestHour;
}
```

### Approach 2: Running Score — O(n)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function minPenalty(customers: string): number {
  const n = customers.length;
  // Start: close at hour 0 → miss every 'Y'
  let penalty = 0;
  for (const c of customers) if (c === "Y") penalty++;

  let minPenalty = penalty;
  let bestHour = 0;

  for (let i = 0; i < n; i++) {
    // Extend close time past index i:
    if (customers[i] === "Y")
      penalty--; // now serving this Y → saves 1
    else penalty++; // open during this N → costs 1
    if (penalty < minPenalty) {
      minPenalty = penalty;
      bestHour = i + 1;
    }
  }
  return bestHour;
}
```

---

## 🧪 Test Cases

```typescript
console.log(minPenalty("YYNY")); // → 2
console.log(minPenalty("NNNNN")); // → 0
console.log(minPenalty("YYYY")); // → 4
console.log(minPenalty("NYYN")); // → 2
console.log(minPenalty("Y")); // → 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                        | Difficulty | Pattern    |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------- |
| [Number of Divisible Substrings](https://leetcode.com/problems/number-of-divisible-substrings)                                 | Medium     | Prefix Sum |
| [Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges)                                   | Medium     | Prefix Sum |
| [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)                         | Medium     | Prefix Sum |
| [Minimum Value to Get Positive Step by Step Sum](https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum) | Easy       | Prefix Sum |
