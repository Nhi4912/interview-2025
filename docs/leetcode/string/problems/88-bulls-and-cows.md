---
layout: page
title: "Bulls and Cows"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/bulls-and-cows"
---

# Bulls and Cows / Trò Chơi Đoán Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Frequency Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Ransom Note](https://leetcode.com/problems/ransom-note) | [Find the Difference](https://leetcode.com/problems/find-the-difference)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi đoán số bí mật — Bulls là số đúng vị trí (chính xác hoàn toàn), Cows là số đúng nhưng sai vị trí. Đếm Bulls dễ (so sánh từng vị trí), còn Cows = tổng min(freq_secret[d], freq_guess[d]) cho mỗi chữ số d, trừ đi Bulls.

**Pattern Recognition:**

- Signal: "count exact matches + wrong-position matches" → **Two-pass or single-pass with frequency tracking**
- Key insight: Cows = overlap của tần suất không tính Bulls

**Visual — Count with frequency:**

```
secret = "1807", guess = "7810"

Pass 1 - Bulls:
pos 0: '1' vs '7' → miss
pos 1: '8' vs '8' → BULL ✅
pos 2: '0' vs '1' → miss
pos 3: '7' vs '0' → miss
bulls = 1

Pass 2 - Cows from non-bull positions:
secret non-bull digits: 1, 0, 7
guess  non-bull digits: 7, 1, 0

freq_s: {1:1, 0:1, 7:1}
freq_g: {7:1, 1:1, 0:1}
min overlap: 1+0+1+1 = 3... wait
  '7': min(1,1)=1, '1': min(1,1)=1, '0': min(1,1)=1 → cows = 3 → "1A3B" ✅
```

---

## Problem Description

You are playing Bulls and Cows. Given `secret` and `guess` (both digit strings of equal length), return a hint string `"xAyB"` where `x` = bulls (correct digit, correct position) and `y` = cows (correct digit, wrong position). ([LeetCode 299](https://leetcode.com/problems/bulls-and-cows))

**Example 1:** `secret="1807", guess="7810"` → `"1A3B"`
**Example 2:** `secret="1123", guess="0111"` → `"1A1B"`

Constraints: `1 <= secret.length == guess.length <= 1000`, both contain only digits

---

## 📝 Interview Tips

1. **Clarify**: "Một chữ số đã tính là bull thì không tính là cow nữa" / A digit counted as bull cannot also be a cow
2. **Brute force**: "Count bulls first, then count cows from remaining — two separate passes" / Natural two-pass approach
3. **Single pass**: "Dùng hai counter array; non-bull s[i] tăng freq_s, non-bull g[i] tăng freq_g; cow += min overlaps" / Track simultaneously
4. **Clever single pass**: "Khi s[i]≠g[i]: nếu freq_s[g[i]]>0 → cow++; nếu freq_g[s[i]]>0 → cow++; cập nhật counters" / Increment cow when complementary seen
5. **Edge cases**: "Tất cả đúng vị trí → nAoB; không có số chung → 0A0B" / All bulls or no matches
6. **Complexity**: "O(n) time, O(1) space — array 10 phần tử cho digits 0-9" / Linear, constant space

---

## Solutions

```typescript
/**
 * Solution 1: Two-pass frequency counting
 * Time: O(n) — two linear scans
 * Space: O(1) — fixed-size digit frequency arrays
 */
function getHint(secret: string, guess: string): string {
  let bulls = 0,
    cows = 0;
  const freqS = new Array(10).fill(0);
  const freqG = new Array(10).fill(0);

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      bulls++;
    } else {
      freqS[Number(secret[i])]++;
      freqG[Number(guess[i])]++;
    }
  }

  for (let d = 0; d < 10; d++) {
    cows += Math.min(freqS[d], freqG[d]);
  }

  return `${bulls}A${cows}B`;
}

/**
 * Solution 2: Single-pass with complementary tracking
 * Time: O(n) — one scan + O(10) final sum
 * Space: O(1)
 */
function getHintSinglePass(secret: string, guess: string): string {
  let bulls = 0,
    cows = 0;
  const freq = new Array(10).fill(0); // +ve for secret, -ve for guess

  for (let i = 0; i < secret.length; i++) {
    const s = Number(secret[i]);
    const g = Number(guess[i]);

    if (s === g) {
      bulls++;
    } else {
      // If we've seen this secret digit as a previous guess → it's a cow
      if (freq[s] < 0) cows++;
      // If we've seen this guess digit as a previous secret → it's a cow
      if (freq[g] > 0) cows++;
      freq[s]++;
      freq[g]--;
    }
  }

  return `${bulls}A${cows}B`;
}

// === Test Cases ===
console.log(getHint("1807", "7810")); // → "1A3B"
console.log(getHint("1123", "0111")); // → "1A1B"
console.log(getHint("1", "1")); // → "1A0B"
console.log(getHintSinglePass("1807", "7810")); // → "1A3B"
console.log(getHintSinglePass("1123", "0111")); // → "1A1B"
```
