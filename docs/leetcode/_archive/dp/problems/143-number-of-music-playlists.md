---
layout: page
title: "Number of Music Playlists"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/number-of-music-playlists"
---

# Number of Music Playlists / Số Danh Sách Phát Nhạc

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 2D Combinatorial DP

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** `dp[i][j]` = số playlist dài `i` bài dùng đúng `j` bài khác nhau. Thêm bài thứ `i+1` theo 2 cách: (1) bài mới hoàn toàn → nhân với `(n-j)` lựa chọn; (2) bài đã dùng nhưng đủ khoảng cách `k` → nhân với `max(j-k, 0)` lựa chọn.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Music Playlists example:**

```
n=3 songs, goal=3, k=1

dp[i][j] = playlists of length i using exactly j distinct songs

       j=0  j=1  j=2  j=3
i=0     1    0    0    0    (empty playlist)
i=1     0    3    0    0    (3 choices for first song)
i=2     0    0    6    0    (choose new song: 3→2 ways;  repeat: max(1-1,0)=0)
i=3     0    0    0    6    (choose new song: 3→1 way;   repeat: max(2-1,0)=1 * 6 = 6)
                                                                  + new: 1*6 = 6
                                                   total dp[3][3] = 6

Answer: dp[goal][n] = 6
```

---

## Problem Description

| #    | Title                                       | Difficulty | Connection                                   |
| ---- | ------------------------------------------- | ---------- | -------------------------------------------- |
| 920  | Number of Music Playlists                   | 🔴 Hard    | This problem                                 |
| 552  | Student Attendance Record II                | 🔴 Hard    | Count sequences with forbidden substrings    |
| 629  | K Inverse Pairs Array                       | 🔴 Hard    | Combinatorial DP with structured transitions |
| 1359 | Count All Valid Pickup and Delivery Options | 🔴 Hard    | Combinatorics with ordering constraints      |

---

## 📝 Interview Tips

- 🔑 **EN:** State `dp[i][j]` = playlists of length `i` with exactly `j` unique songs | **VI:** Cẩn thận "exactly j" — không phải "at most j"
- 🔑 **EN:** Adding a **new** song: `dp[i][j] += dp[i-1][j-1] * (n - (j-1))` | **VI:** Bài mới: nhân với số bài chưa xuất hiện = `n - (j-1)`
- 🔑 **EN:** Adding an **old** song: `dp[i][j] += dp[i-1][j] * max(j-k, 0)` | **VI:** Bài cũ: phải cách ít nhất `k` bài → có `max(j-k, 0)` lựa chọn hợp lệ
- 🔑 **EN:** Answer is `dp[goal][n]` — exactly `n` unique songs used | **VI:** Đáp án là `dp[goal][n]` — phải dùng đủ tất cả `n` bài
- 🔑 **EN:** Always reduce modulo `1e9+7` to prevent overflow | **VI:** Nhớ mod sau mỗi bước — số cách rất lớn
- 🔑 **EN:** Space can be reduced to O(n) by only keeping previous row | **VI:** Tối ưu không gian: chỉ cần hàng trước — nhưng cần cẩn thận thứ tự cập nhật

---

## Solutions

```typescript
const MOD_143 = 1_000_000_007n;

// ─── Solution 1: 2D DP — O(goal·n) time, O(goal·n) space ─────────────────
function numMusicPlaylists2D(goal: number, n: number, k: number): number {
  // dp[i][j] = number of playlists of length i using exactly j unique songs
  const dp: bigint[][] = Array.from({ length: goal + 1 }, () => new Array(n + 1).fill(0n));
  dp[0][0] = 1n;

  for (let i = 1; i <= goal; i++) {
    for (let j = 1; j <= n; j++) {
      // Option 1: add a brand-new song (was j-1 distinct, now j)
      dp[i][j] = (dp[i][j] + dp[i - 1][j - 1] * BigInt(n - j + 1)) % MOD_143;
      // Option 2: replay an old song (must have j-k valid choices)
      if (j > k) {
        dp[i][j] = (dp[i][j] + dp[i - 1][j] * BigInt(j - k)) % MOD_143;
      }
    }
  }

  return Number(dp[goal][n]);
}

// ─── Solution 2: Space-Optimised 1D (reverse inner loop) ─────────────────
function numMusicPlaylists(goal: number, n: number, k: number): number {
  // dp[j] = number of playlists using exactly j distinct songs (for current length i)
  let dp = new Array(n + 1).fill(0n);
  dp[0] = 1n;

  for (let i = 1; i <= goal; i++) {
    const next = new Array(n + 1).fill(0n);
    for (let j = 1; j <= n; j++) {
      // Add new song
      next[j] = (next[j] + dp[j - 1] * BigInt(n - j + 1)) % MOD_143;
      // Replay old song (if enough gap)
      if (j > k) {
        next[j] = (next[j] + dp[j] * BigInt(j - k)) % MOD_143;
      }
    }
    dp = next;
  }

  return Number(dp[n]);
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(numMusicPlaylists(3, 3, 1)); // 6
console.log(numMusicPlaylists(2, 2, 0)); // 2  ([1,2] or [2,1])
console.log(numMusicPlaylists(2, 2, 1)); // 2
console.log(numMusicPlaylists2D(3, 3, 1)); // 6
console.log(numMusicPlaylists(6, 3, 1)); // 6 * ... (larger case)
```

---

## 🔗 Related Problems

| #    | Title                                       | Difficulty | Connection                                   |
| ---- | ------------------------------------------- | ---------- | -------------------------------------------- |
| 920  | Number of Music Playlists                   | 🔴 Hard    | This problem                                 |
| 552  | Student Attendance Record II                | 🔴 Hard    | Count sequences with forbidden substrings    |
| 629  | K Inverse Pairs Array                       | 🔴 Hard    | Combinatorial DP with structured transitions |
| 1359 | Count All Valid Pickup and Delivery Options | 🔴 Hard    | Combinatorics with ordering constraints      |
