---
layout: page
title: "Rotated Digits"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/rotated-digits"
---

# Rotated Digits / Chữ Số Xoay — Đếm Số Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Digit DP / Simple Scan
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhìn số trên máy tính bỏ túi ngược xuống — quay 180° và số phải vẫn đọc được nhưng khác với số gốc. Chữ số hợp lệ: 0,1,2,5,6,8,9 (0→0,1→1,2→5,5→2,6→9,8→8,9→6). Không hợp lệ: 3,4,7.

**Pattern Recognition:**

- Một số là "good" nếu: (1) không có chữ số 3,4,7 và (2) có ít nhất một chữ số trong {2,5,6,9}
- Phương pháp 1: Quét đơn giản O(n × chữ số) — đủ với n ≤ 10000
- Phương pháp 2: Digit DP O(log n) — tổng quát hơn cho n rất lớn

```
n = 10:
Kiểm tra 1-10:
  2: 2→5, khác gốc, hợp lệ ✓
  5: 5→2, khác gốc, hợp lệ ✓
  6: 6→9, khác gốc, hợp lệ ✓
  8: 8→8, giống gốc, KHÔNG hợp lệ ✗
  9: 9→6, khác gốc, hợp lệ ✓

Rotated map: 0→0, 1→1, 2→5, 5→2, 6→9, 8→8, 9→6
Answer = 4 (2, 5, 6, 9)
```

---

## Problem Description / Mô Tả Bài Toán

Một số là "good" nếu sau khi xoay 180° mỗi chữ số, kết quả vẫn là số hợp lệ và **khác** với số gốc. Cho số nguyên `n`, đếm số "good" trong khoảng `[1, n]`.

**Rotation rules:** 0→0, 1→1, 2→5, 5→2, 6→9, 8→8, 9→6. Digits 3,4,7 are invalid after rotation.

**Example 1:** `n=10` → `4` (2, 5, 6, 9)
**Example 2:** `n=1` → `0`
**Example 3:** `n=2` → `1` (only 2)

**Constraints:** `1 ≤ n ≤ 10⁴`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Two conditions: no invalid digit (3,4,7) AND at least one "changing" digit (2,5,6,9).
   **VI:** Hai điều kiện: không có chữ số xấu (3,4,7) VÀ có ít nhất một chữ số "thay đổi" (2,5,6,9).

2. **EN:** For n ≤ 10000, simple O(n × digit_length) scan is fast enough.
   **VI:** n ≤ 10000, quét O(n × số chữ số) đủ nhanh.

3. **EN:** The `isGood` check: iterate each digit, track `hasInvalid` and `hasChange`.
   **VI:** Hàm `isGood`: duyệt từng chữ số, theo dõi `hasInvalid` và `hasChange`.

4. **EN:** Digit DP approach: state = (position, tight, hasChange) — generalizes to n up to 10^18.
   **VI:** Digit DP: state = (vị trí, tight, hasChange) — tổng quát đến n lên đến 10^18.

5. **EN:** Precompute `[invalid, same, change]` for each digit 0-9.
   **VI:** Tính trước `[invalid, same, change]` cho mỗi chữ số 0-9.

6. **EN:** Edge: 8 is "same" after rotation (8→8), so numbers containing only 0,1,8 are NOT good (no change).
   **VI:** Số 8 xoay thành chính nó, nên số chỉ có {0,1,8} không đổi → không "good".

---

## Solutions / Giải Pháp

```typescript
// Rotation lookup: -1 = invalid, 0 = same, 1 = changes to different valid digit
const ROTATE: number[] = [0, 0, 1, -1, -1, 1, 1, -1, 0, 1];
// 0→0(same), 1→1(same), 2→5(change), 3→invalid, 4→invalid,
// 5→2(change), 6→9(change), 7→invalid, 8→8(same), 9→6(change)

// ─── Solution 1: Simple Linear Scan — O(n × log₁₀n) ─────────────────────────
function rotatedDigits_scan(n: number): number {
  let count = 0;
  for (let num = 1; num <= n; num++) {
    if (isGood(num)) count++;
  }
  return count;
}

function isGood(num: number): boolean {
  let hasChange = false;
  while (num > 0) {
    const d = num % 10;
    if (ROTATE[d] === -1) return false; // invalid digit
    if (ROTATE[d] === 1) hasChange = true;
    num = Math.floor(num / 10);
  }
  return hasChange; // must have at least one changing digit
}

// ─── Solution 2: Digit DP — O(log n × states) ────────────────────────────────
// Count "good" numbers from 1 to n using digit DP.
// State: (pos, tight, hasChange) where tight = still bounded by n's digits
function rotatedDigits(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;
  const memo = new Map<string, number>();

  // Returns count of valid numbers from position pos to end
  // tight: are we still constrained by n's digits?
  // hasChange: does current number have at least one "changing" digit?
  function dp(pos: number, tight: boolean, hasChange: boolean): number {
    if (pos === len) return hasChange ? 1 : 0;

    const key = `${pos},${tight ? 1 : 0},${hasChange ? 1 : 0}`;
    if (memo.has(key)) return memo.get(key)!;

    const limit = tight ? digits[pos] : 9;
    let total = 0;

    for (let d = 0; d <= limit; d++) {
      if (ROTATE[d] === -1) continue; // skip invalid digits
      const newTight = tight && d === limit;
      const newHasChange = hasChange || ROTATE[d] === 1;
      total += dp(pos + 1, newTight, newHasChange);
    }

    memo.set(key, total);
    return total;
  }

  // We must handle leading zeros: start dp, but leading zeros don't count as "same"
  // Redefine: dp counts numbers from 0 to n. Subtract the case num=0.
  // Actually, allow leading zeros and handle naturally — numbers starting with 0 are treated as shorter.
  // Simpler: just start from pos=0, tight=true. Numbers with leading zeros auto-handled
  // because we allow digit 0 (same) and check hasChange at the end.

  // But we need to avoid counting 0 itself. Subtract dp result for "0".
  // dp(0, true, false) counts all from 0..n. Subtract 1 if 0 is "good" (it's not, no change for 0).
  return dp(0, true, false);
}

// ─── Solution 3: Precomputed classification array ─────────────────────────────
// Classify each number 1..n: 0=invalid, 1=same, 2=good
function rotatedDigits_precompute(n: number): number {
  const valid = new Array(n + 1).fill(0); // 0=invalid,1=same,2=good
  let count = 0;

  for (let i = 0; i <= n; i++) {
    const d = i % 10;
    const hi = Math.floor(i / 10);

    if (ROTATE[d] === -1 || (hi > 0 && valid[hi] === 0)) {
      valid[i] = 0; // invalid
    } else if (ROTATE[d] === 1 || (hi > 0 && valid[hi] === 2)) {
      valid[i] = 2; // good (changes)
      if (i > 0) count++;
    } else {
      valid[i] = 1; // same
    }
  }
  return count;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(rotatedDigits(10)); // 4
console.log(rotatedDigits(1)); // 0
console.log(rotatedDigits(2)); // 1
console.log(rotatedDigits(857)); // 247
console.log(rotatedDigits_scan(10)); // 4
console.log(rotatedDigits_precompute(10)); // 4
console.log(rotatedDigits_scan(857)); // 247
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                              | Difficulty | Pattern         |
| --- | ---------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| 357 | [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits)   | 🟡 Medium  | Digit DP / Math |
| 233 | [Number of Digit One](https://leetcode.com/problems/number-of-digit-one)                             | 🔴 Hard    | Digit DP        |
| 902 | [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set) | 🔴 Hard    | Digit DP        |
