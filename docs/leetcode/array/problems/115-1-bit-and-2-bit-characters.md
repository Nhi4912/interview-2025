---
layout: page
title: "1-bit and 2-bit Characters"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/1-bit-and-2-bit-characters"
---

# 1-bit and 2-bit Characters / Ký Tự 1-bit và 2-bit

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **đọc mã Morse** — ký tự 1-bit chiếm `[0]`, ký tự 2-bit chiếm `[1,0]` hoặc `[1,1]`. Quét từ trái: gặp `1` → nhảy 2 bước (2-bit char), gặp `0` → nhảy 1 bước (1-bit char). Nếu con trỏ **dừng đúng ở chỉ số cuối** → ký tự cuối là 1-bit.

```
bits = [1, 0, 0]
i=0: bits[0]=1 → 2-bit char → i=2
i=2: bits[2]=0 → 1-bit char → i=3 (= length)
Stopped at index 2 (last) before consuming → YES ✅

bits = [1, 1, 1, 0]
i=0 → i=2 (2-bit)
i=2 → i=4 (overshoot, last char was part of 2-bit) → NO ❌
```

---

## Problem Description / Mô Tả Bài Toán

Hai loại ký tự: **1-bit** = `[0]`, **2-bit** = `[1,0]` hoặc `[1,1]`. Mảng `bits` luôn kết thúc bằng `0`. Kiểm tra xem ký tự **cuối cùng** có thể là **ký tự 1-bit** không.

- **Input:** `bits = [1,0,0]` → **Output:** `true`
- **Input:** `bits = [1,1,1,0]` → **Output:** `false`

**Constraints:** `1 <= bits.length <= 1000`, `bits[i] ∈ {0,1}`, `bits[last] === 0`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Greedy left-to-right: bits[i]=1 → skip 2, bits[i]=0 → skip 1. **VI:** Quét tham lam trái-phải: 1 → nhảy 2, 0 → nhảy 1.
2. **EN:** Stop loop before last element; check if pointer lands exactly there. **VI:** Dừng vòng lặp trước phần tử cuối; kiểm tra con trỏ có dừng đúng đó không.
3. **EN:** Math insight: last 0 is standalone iff count of consecutive 1s before it is even. **VI:** Toán học: 0 cuối là 1-bit iff số 1 liên tiếp trước nó là chẵn.
4. **EN:** No ambiguity: a 1 always starts a 2-bit char (first bit of two-bit codes is always 1). **VI:** Không nhập nhằng: `1` luôn bắt đầu char 2-bit.
5. **EN:** Edge case: bits=[0] → single 1-bit char → return true. **VI:** bits=[0] → true.
6. **EN:** Time O(n), Space O(1). **VI:** O(n) thời gian, O(1) không gian.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Greedy Scan  O(n) time, O(1) space ─────────────────────────
function isOneBitCharacter(bits: number[]): boolean {
  let i = 0;
  // Stop at last element (bits.length - 1); we want to see if we land on it
  while (i < bits.length - 1) {
    i += bits[i] === 1 ? 2 : 1;
  }
  return i === bits.length - 1; // landed exactly on last 0 → 1-bit char
}

// ─── Solution 2: Count Trailing 1s (Math)  O(n) time, O(1) space ─────────────
// Last 0 is standalone iff the number of consecutive 1s before it is even.
function isOneBitCharacterMath(bits: number[]): boolean {
  let count = 0;
  let i = bits.length - 2; // start just before the guaranteed last 0
  while (i >= 0 && bits[i] === 1) {
    count++;
    i--;
  }
  return count % 2 === 0; // even # of preceding 1s → last 0 is 1-bit
}

// ─── Solution 3: Recursive  O(n) time (educational) ─────────────────────────
function isOneBitCharacterRec(bits: number[], i = 0): boolean {
  if (i === bits.length - 1) return true;
  if (i >= bits.length) return false;
  return isOneBitCharacterRec(bits, i + (bits[i] === 1 ? 2 : 1));
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(isOneBitCharacter([1, 0, 0])); // true
console.log(isOneBitCharacter([1, 1, 1, 0])); // false
console.log(isOneBitCharacter([0])); // true
console.log(isOneBitCharacterMath([1, 0, 0])); // true
console.log(isOneBitCharacterMath([1, 1, 1, 0])); // false
console.log(isOneBitCharacterRec([1, 0, 0])); // true
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                        | Difficulty | Pattern          |
| --- | -------------------------------------------------------------- | ---------- | ---------------- |
| 91  | [Decode Ways](https://leetcode.com/problems/decode-ways)       | 🟡 Medium  | DP               |
| 639 | [Decode Ways II](https://leetcode.com/problems/decode-ways-ii) | 🔴 Hard    | DP               |
| 89  | [Gray Code](https://leetcode.com/problems/gray-code)           | 🟡 Medium  | Bit Manipulation |
