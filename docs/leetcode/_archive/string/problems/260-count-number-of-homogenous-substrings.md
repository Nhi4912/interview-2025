---
layout: page
title: "Count Number of Homogenous Substrings"
difficulty: Medium
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/count-number-of-homogenous-substrings"
---

# Count Number of Homogenous Substrings / Đếm Chuỗi Con Đồng Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Run-Length Encoding
> **Frequency**: 📘 Tier 2 — Gặp ở 3 companies
> **See also**: [Count Substrings with Only One Distinct Letter](https://leetcode.com/problems/count-substrings-with-only-one-distinct-letter) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ về dây chuyền sản xuất kẹo: mỗi màu sắc liên tiếp tạo thành một "lô hàng đồng nhất". Nếu lô có `k` viên kẹo cùng màu, ta có thể cắt ra bao nhiêu đoạn con cùng màu? Câu trả lời là `k*(k+1)/2` — tổng từ 1 đến k. Ví dụ lô 3 viên "aaa": ta có "a"×3, "aa"×2, "aaa"×1 = 6 đoạn. Với chuỗi "abbccc", ta cộng lô "a" (k=1: 1) + lô "bb" (k=2: 3) + lô "ccc" (k=3: 6) = 10, rồi modulo 10⁹+7 vì kết quả có thể rất lớn.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Number of Homogenous Substrings example:**

```
s = "abbccc"

Run-length groups:
  'a' × 1  →  k=1  →  1*(1+1)/2 = 1   substrings: "a"
  'b' × 2  →  k=2  →  2*(2+1)/2 = 3   substrings: "b","b","bb"
  'c' × 3  →  k=3  →  3*(3+1)/2 = 6   substrings: "c","c","c","cc","cc","ccc"
                                         ─────────────────────────────────
  Total = 1 + 3 + 6 = 10

Formula derivation for run of length k:
  Length-1 substrings: k
  Length-2 substrings: k-1
  ...
  Length-k substrings: 1
  Sum = k + (k-1) + ... + 1 = k*(k+1)/2
```

---

## Problem Description

Given string `s`, return the number of **homogenous substrings** (substrings where all characters are the same) modulo `10⁹ + 7`.

**Example 1:** `s = "abbccc"` → `10`
**Example 2:** `s = "xy"` → `2` (two single-char substrings)
**Example 3:** `s = "zzzzz"` → `15` (5\*6/2 = 15)

**Constraints:** `1 ≤ s.length ≤ 10⁵`, `s` consists of lowercase English letters

---

## 📝 Interview Tips

- **Run-length decomposition** / Phân tách RLE: Chia chuỗi thành các "lô" ký tự giống nhau liên tiếp, mỗi lô độc lập
- **k\*(k+1)/2 formula** / Công thức tổ hợp: Lô độ dài k đóng góp đúng k\*(k+1)/2 chuỗi con — nhớ ngay, không cần giải thích lại
- **Modulo sau mỗi lô** / Apply mod per group: Cộng kết quả modulo sau mỗi lô để tránh tràn số
- **One-pass streaming** / Một lần duyệt: Dùng biến `run` đếm độ dài lô hiện tại, reset khi ký tự thay đổi
- **Thêm sentinel** / Sentinel trick: Duyệt đến `i <= s.length` và kiểm tra `s[i] !== s[i-1]` — xử lý lô cuối tự nhiên hơn
- **Edge: all same** / Toàn ký tự giống: s = "aaaa" → k=4 → 10, kiểm tra không vượt MOD

---

## Solutions

```typescript
/**
 * @complexity Time: O(n) | Space: O(g) where g = number of groups
 * Collect run-lengths, then sum k*(k+1)/2 for each
 */
function countHomogenousBrute(s: string): number {
  const MOD = 1_000_000_007n;
  const groups: number[] = [];
  let run = 1;
  for (let i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] === s[i - 1]) {
      run++;
    } else {
      groups.push(run);
      run = 1;
    }
  }
  let ans = 0n;
  for (const k of groups) {
    ans = (ans + (BigInt(k) * BigInt(k + 1)) / 2n) % MOD;
  }
  return Number(ans);
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * Stream through runs, accumulate result without storing groups
 */
function countHomogenous(s: string): number {
  const MOD = 1_000_000_007;
  let ans = 0,
    run = 1;
  for (let i = 1; i <= s.length; i++) {
    if (i < s.length && s[i] === s[i - 1]) {
      run++;
    } else {
      // run = k: contributes k*(k+1)/2 but we add incrementally
      ans = (ans + Math.floor((run * (run + 1)) / 2)) % MOD;
      run = 1;
    }
  }
  return ans;
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * Add 'run' to ans at each step: avoids multiplication entirely.
 * For a run a,aa,aaa,...: on k-th char in run, we add k new substrings.
 */
function countHomogenousIncremental(s: string): number {
  const MOD = 1_000_000_007;
  let ans = 0,
    run = 0;
  for (let i = 0; i < s.length; i++) {
    run = i > 0 && s[i] === s[i - 1] ? run + 1 : 1;
    ans = (ans + run) % MOD;
  }
  return ans;
}

// === Test Cases ===
console.log(countHomogenousBrute("abbccc")); // → 10
console.log(countHomogenous("abbccc")); // → 10
console.log(countHomogenousIncremental("abbccc")); // → 10
console.log(countHomogenous("xy")); // → 2
console.log(countHomogenous("zzzzz")); // → 15
console.log(countHomogenous("a")); // → 1
console.log(countHomogenous("aababab")); // → 10
```

---

## 🔗 Related Problems

| Problem                                        | Difficulty | Link                                                                                    |
| ---------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| Count Substrings with Only One Distinct Letter | Easy       | [LC 1180](https://leetcode.com/problems/count-substrings-with-only-one-distinct-letter) |
| String Compression                             | Medium     | [LC 443](https://leetcode.com/problems/string-compression)                              |
| Count Vowel Substrings of a String             | Easy       | [LC 2062](https://leetcode.com/problems/count-vowel-substrings-of-a-string)             |
