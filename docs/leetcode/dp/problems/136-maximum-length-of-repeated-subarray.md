---
layout: page
title: "Maximum Length of Repeated Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Sliding Window, Rolling Hash]
leetcode_url: "https://leetcode.com/problems/maximum-length-of-repeated-subarray"
---

# Maximum Length of Repeated Subarray / Độ Dài Lớn Nhất Của Mảng Con Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP / Common Subarray

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Hãy tưởng tượng hai con đường song song. Bạn duyệt từng cặp bước `(i, j)`. Nếu bước `i` của đường 1 khớp bước `j` của đường 2, đoạn đường chung kéo dài thêm 1. Nếu không khớp, đoạn chung bị đứt → reset 0.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Length of Repeated Subarray example:**

```
nums1 = [1, 2, 3, 2, 1]
nums2 = [3, 2, 1, 4, 7]

dp[i][j] = length of longest common subarray ending at nums1[i-1], nums2[j-1]

     ""  3   2   1   4   7
""    0   0   0   0   0   0
 1    0   0   0   1   0   0
 2    0   0   1   0   0   0
 3    0   1   0   0   0   0
 2    0   0   2   0   0   0
 1    0   0   0   3   0   0   ← ans = 3  ([3,2,1])
```

---

## Problem Description

| #    | Title                         | Difficulty | Connection                                |
| ---- | ----------------------------- | ---------- | ----------------------------------------- |
| 1143 | Longest Common Subsequence    | 🟡 Medium  | LCS allows gaps; this requires contiguous |
| 1044 | Longest Duplicate Substring   | 🔴 Hard    | Same idea but within one string           |
| 5    | Longest Palindromic Substring | 🟡 Medium  | "Longest contiguous" DP pattern           |
| 187  | Repeated DNA Sequences        | 🟡 Medium  | Rolling hash on fixed-length windows      |

---

## 📝 Interview Tips

- 🔑 **EN:** `dp[i][j]` = common subarray length ending at `nums1[i-1]` & `nums2[j-1]`; only increment when equal | **VI:** Chỉ cộng 1 khi hai phần tử bằng nhau, không thì để 0 (bắt buộc liên tục)
- 🔑 **EN:** Space-optimise to 1D: iterate inner loop **right-to-left** to avoid clobbering values | **VI:** Duyệt phải→trái để tránh ghi đè giá trị `dp[j-1]` vẫn cần dùng
- 🔑 **EN:** Track global `ans` **inside** the loop, not after | **VI:** Cập nhật `ans` ngay khi cập nhật `dp[i][j]`
- 🔑 **EN:** This is NOT LCS — subarrays must be contiguous, LCS allows gaps | **VI:** Khác LCS: phải liên tục, không bỏ phần tử giữa
- 🔑 **EN:** Binary search + rolling hash gets O((m+n) log(min(m,n))) — mention as follow-up | **VI:** Hỏi thêm: binary search + hash nếu yêu cầu tốt hơn O(mn)
- 🔑 **EN:** Time O(m·n), Space O(min(m,n)) with 1D rolling | **VI:** Dùng mảng 1D tiết kiệm bộ nhớ xuống O(n)

---

## Solutions

```typescript
// ─── Solution 1: 2D DP — O(m·n) time, O(m·n) space ───────────────────────
function findLength2D(nums1: number[], nums2: number[]): number {
  const m = nums1.length,
    n = nums2.length;
  // dp[i][j] = longest common subarray ending at nums1[i-1] and nums2[j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let ans = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
      // else stays 0 — subarray must be contiguous
    }
  }
  return ans;
}

// ─── Solution 2: 1D Rolling Array — O(m·n) time, O(n) space ──────────────
function findLength(nums1: number[], nums2: number[]): number {
  const m = nums1.length,
    n = nums2.length;
  const dp = new Array(n + 1).fill(0);
  let ans = 0;
  for (let i = 1; i <= m; i++) {
    // RIGHT-TO-LEFT so dp[j-1] still holds the value from row i-1
    for (let j = n; j >= 1; j--) {
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[j] = dp[j - 1] + 1;
        ans = Math.max(ans, dp[j]);
      } else {
        dp[j] = 0; // must reset for contiguous requirement
      }
    }
  }
  return ans;
}

// ─── Solution 3: Binary Search + Rolling Hash — O((m+n)·log(min(m,n))) ───
function findLengthBinarySearch(nums1: number[], nums2: number[]): number {
  const MOD = 1_000_000_007n,
    BASE = 113n;
  const m = nums1.length,
    n = nums2.length;

  function hasCommonSubarray(len: number): boolean {
    // Build hashes for all windows of length `len` in nums1
    let h = 0n,
      pow = 1n;
    for (let i = 0; i < len; i++) {
      h = (h * BASE + BigInt(nums1[i] + 1)) % MOD;
      if (i > 0) pow = (pow * BASE) % MOD;
    }
    const seen = new Set<bigint>([h]);
    for (let i = len; i < m; i++) {
      h = (h - ((BigInt(nums1[i - len] + 1) * pow) % MOD) + MOD) % MOD;
      h = (h * BASE + BigInt(nums1[i] + 1)) % MOD;
      seen.add(h);
    }
    // Slide over nums2 and check membership
    h = 0n;
    for (let i = 0; i < len; i++) h = (h * BASE + BigInt(nums2[i] + 1)) % MOD;
    if (seen.has(h)) return true;
    for (let i = len; i < n; i++) {
      h = (h - ((BigInt(nums2[i - len] + 1) * pow) % MOD) + MOD) % MOD;
      h = (h * BASE + BigInt(nums2[i] + 1)) % MOD;
      if (seen.has(h)) return true;
    }
    return false;
  }

  let lo = 0,
    hi = Math.min(m, n);
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (hasCommonSubarray(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3
console.log(findLength([0, 0, 0, 0, 0], [0, 0, 0, 0, 0])); // 5
console.log(findLength([1, 2, 3], [4, 5, 6])); // 0
console.log(findLength2D([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3
console.log(findLengthBinarySearch([1, 2, 3, 2, 1], [3, 2, 1, 4, 7])); // 3
```

---

## 🔗 Related Problems

| #    | Title                         | Difficulty | Connection                                |
| ---- | ----------------------------- | ---------- | ----------------------------------------- |
| 1143 | Longest Common Subsequence    | 🟡 Medium  | LCS allows gaps; this requires contiguous |
| 1044 | Longest Duplicate Substring   | 🔴 Hard    | Same idea but within one string           |
| 5    | Longest Palindromic Substring | 🟡 Medium  | "Longest contiguous" DP pattern           |
| 187  | Repeated DNA Sequences        | 🟡 Medium  | Rolling hash on fixed-length windows      |
