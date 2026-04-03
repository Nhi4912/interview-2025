---
layout: page
title: "Find the K-Beauty of a Number"
difficulty: Easy
category: String
tags: [Math, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-the-k-beauty-of-a-number"
---

# Find the K-Beauty of a Number / Tìm Độ Đẹp K Của Một Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese analogy**: Chuyển số thành chuỗi, rồi trượt cửa sổ kích thước `k` từ trái sang phải. Mỗi cửa sổ là một số con — kiểm tra có chia hết `num` không và khác 0.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find the K-Beauty of a Number example:**

```
num=240, k=2   →  s="240"
Window [0..1] = "24" → 24 ≠ 0, 240 % 24 = 0  ✅
Window [1..2] = "40" → 40 ≠ 0, 240 % 40 = 0  ✅
Window [2..3] (j=2): only if s.length=4, skip
Answer = 2
```

**Key insight**: Convert `num` to string → slide fixed-size window of `k` chars → `parseInt` each → check divisibility (skip 0s).

---

## Problem Description

| #    | Problem                                                   | Difficulty | Pattern        |
| ---- | --------------------------------------------------------- | ---------- | -------------- |
| 1876 | Substrings of Size Three with Distinct Characters         | 🟢 Easy    | Sliding Window |
| 567  | Permutation in String                                     | 🟡 Medium  | Sliding Window |
| 2269 | Find the K-Beauty of a Number                             | 🟢 Easy    | Sliding Window |
| 1984 | Minimum Difference Between Highest and Lowest of K Scores | 🟢 Easy    | Sliding Window |

---

## 📝 Interview Tips

- 🔑 **EN**: Convert number to string for easy character access
  **VI**: Chuyển số thành chuỗi để truy cập từng ký tự dễ dàng
- 🔑 **EN**: Number of windows = `s.length - k + 1`; indices `i` from `0` to `s.length - k`
  **VI**: Số cửa sổ = `s.length - k + 1`; `i` từ 0 đến `s.length - k`
- 🔑 **EN**: A substring divisor of 0 is invalid — guard with `sub !== 0`
  **VI**: Ước số bằng 0 không hợp lệ — kiểm tra `sub !== 0` trước khi chia
- 🔑 **EN**: Leading zeros make `parseInt` smaller — that's fine, just check divisibility
  **VI**: Số 0 đứng đầu làm `parseInt` nhỏ hơn — không sao, chỉ cần kiểm tra chia hết
- 🔑 **EN**: Sliding window here is fixed-size — no expand/shrink needed
  **VI**: Cửa sổ trượt ở đây là kích thước cố định — không cần mở rộng/thu hẹp
- 🔑 **EN**: Time O(n·k) brute; O(n) optimal treating substring parsing as O(k)
  **VI**: Brute O(n·k); tối ưu O(n) nếu coi parse chuỗi như O(k) nhỏ

---

```typescript
// ─── Solution 1: Brute Force — O(n·k) time, O(n) space ──────────────────────
function divisorSubstrings(num: number, k: number): number {
  const s = String(num);
  let count = 0;

  for (let i = 0; i <= s.length - k; i++) {
    const sub = parseInt(s.slice(i, i + k), 10);
    if (sub !== 0 && num % sub === 0) count++;
  }

  return count;
}

// Tests
console.log(divisorSubstrings(240, 2)); // 2
console.log(divisorSubstrings(430043, 2)); // 2
console.log(divisorSubstrings(5, 1)); // 1
console.log(divisorSubstrings(100, 1)); // 1  (only "1" divides; "0" is skipped)
```

```typescript
// ─── Solution 2: Sliding Window — O(n) character scan ────────────────────────
// Optimization: avoid repeated slice+parseInt with a rolling numeric window
function divisorSubstrings2(num: number, k: number): number {
  const s = String(num);
  const n = s.length;
  if (k > n) return 0;

  let count = 0;

  // Use modular arithmetic to maintain the k-digit window value
  // window = window*10 + newDigit - oldDigit*10^k
  const pow10k = Math.pow(10, k - 1);
  let window = parseInt(s.slice(0, k), 10);

  if (window !== 0 && num % window === 0) count++;

  for (let i = 1; i <= n - k; i++) {
    // Remove leftmost digit, add rightmost digit
    window = (window - (s.charCodeAt(i - 1) - 48) * pow10k) * 10 + (s.charCodeAt(i + k - 1) - 48);
    if (window !== 0 && num % window === 0) count++;
  }

  return count;
}

// Tests
console.log(divisorSubstrings2(240, 2)); // 2
console.log(divisorSubstrings2(430043, 2)); // 2
console.log(divisorSubstrings2(5, 1)); // 1
```

---

---

## Solutions


---

## 🔗 Related Problems

| #    | Problem                                                   | Difficulty | Pattern        |
| ---- | --------------------------------------------------------- | ---------- | -------------- |
| 1876 | Substrings of Size Three with Distinct Characters         | 🟢 Easy    | Sliding Window |
| 567  | Permutation in String                                     | 🟡 Medium  | Sliding Window |
| 2269 | Find the K-Beauty of a Number                             | 🟢 Easy    | Sliding Window |
| 1984 | Minimum Difference Between Highest and Lowest of K Scores | 🟢 Easy    | Sliding Window |
