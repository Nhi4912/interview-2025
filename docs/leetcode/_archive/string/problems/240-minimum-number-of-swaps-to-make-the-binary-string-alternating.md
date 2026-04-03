---
layout: page
title: "Minimum Number of Swaps to Make the Binary String Alternating"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-binary-string-alternating"
---

# Minimum Number of Swaps to Make the Binary String Alternating / Minimum Number of Swaps to Make the Binary String Alternating

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Number of Swaps to Make the String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như sắp xếp hàng đen-trắng xen kẽ trên bàn cờ — chỉ có 2 mẫu mục tiêu "010101..." hoặc "101010...". Đếm số ô sai vị trí, mỗi lần hoán đổi sửa được 2 ô sai (đổi một '0' sai vị trí với '1' sai vị trí), nên số hoán đổi = số sai / 2.

**Visual — Count mismatches for each target pattern:**

```
s = "111000"  (ones=3, zeros=3, n=6 even → both patterns possible)

Target "010101":  positions where target='0': 0,2,4  target='1': 1,3,5
  s:  1 1 1 0 0 0
  t:  0 1 0 1 0 1
mis:  X   X   X     ← 3 mismatches at even (should be '0', got '1')
         X   X X    ← 3 mismatches at odd  (should be '1', got '0')
  swaps = 3/2 ... wait 3 is odd? → invalid pattern? 
  But zeros=3=ceil(6/2)=3 ✓ ones=3=ceil(6/2)=3 → both patterns valid
  count '1' in even positions: pos 0,2,4 → s='1','1','0' → 2 wrong
  swaps for "010101" = 2

Target "101010":
  count '0' in even positions: pos 0,2,4 → s='1','1','0' → 1 wrong at pos 4
  swaps for "101010" = 1

Answer = min(2, 1) = 1 ✅
```

---

## Problem Description

Given a binary string `s`, return the **minimum number of swaps** (swap any two characters) to make `s` alternating (`'0'` and `'1'` alternate with no two adjacent equal). Return `-1` if impossible.

**Example 1:** `s = "111000"` → `1`
**Example 2:** `s = "010"` → `0` (already alternating)
**Example 3:** `s = "1110"` → `-1`

Constraints: `1 <= s.length <= 1000`.

---

## 📝 Interview Tips

1. **Feasibility**: "Đếm 0 và 1 — chênh lệch > 1 là impossible" / Count 0s and 1s: if |count0 - count1| > 1, return -1
2. **Two targets**: "Chỉ có 2 mẫu mục tiêu: bắt đầu bằng '0' hoặc '1'" / Only 2 target patterns: starting with '0' or '1'
3. **Which patterns valid**: "n lẻ → chỉ 1 mẫu hợp lệ (số nhiều hơn phải ở vị trí chẵn); n chẵn → cả 2" / Odd n: only one pattern valid; even n: both possible
4. **Count mismatches**: "Số hoán đổi = số vị trí sai / 2 (mỗi hoán đổi sửa 2 vị trí sai)" / Swaps = mismatches_in_even_positions (each swap fixes one '1'-at-even and one '0'-at-odd)
5. **Edge cases**: "Chuỗi đã alternating → 0; độ dài 1 → 0; toàn '0' hoặc '1' → -1 nếu dài > 1" / Already alternating → 0; length 1 → 0; all same char → -1
6. **Follow-up**: "Nếu cho phép reverse một substring? → bài toán khác hẳn" / If reversal allowed instead of swap? → different problem

---

## Solutions

```typescript
/**
 * Solution 1: Brute force — try all possible swaps (for small n)
 * Time: O(n³) — O(n²) swaps × O(n) check
 * Space: O(n) — copy of string
 */
function minSwapsBrute(s: string): number {
  const isAlternating = (arr: string[]): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1]) return false;
    }
    return true;
  };

  const arr = s.split('');
  if (isAlternating(arr)) return 0;

  for (let swaps = 1; swaps <= arr.length / 2; swaps++) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== arr[j]) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          if (isAlternating(arr)) return swaps;
          [arr[i], arr[j]] = [arr[j], arr[i]]; // restore
        }
      }
    }
  }
  return -1;
}

/**
 * Solution 2: Greedy — count mismatches for each valid target pattern
 * For each valid target pattern, count positions where s[i] ≠ target[i].
 * Since each swap fixes exactly 2 mismatches, swaps = mismatches_at_even_pos.
 * Time: O(n) — two passes over string
 * Space: O(1) — only counters
 */
function minSwaps(s: string): number {
  const n = s.length;
  const ones = [...s].filter(c => c === '1').length;
  const zeros = n - ones;

  // Quick feasibility check
  if (Math.abs(ones - zeros) > 1) return -1;

  // Count swaps needed to make s match target pattern starting with `start`
  const countSwaps = (start: '0' | '1'): number => {
    let mismatch = 0;
    for (let i = 0; i < n; i++) {
      const expected = (i % 2 === 0) === (start === '0') ? '0' : '1';
      if (s[i] !== expected) mismatch++;
    }
    // mismatch is always even (equal mismatches at even/odd positions)
    return mismatch / 2;
  };

  const results: number[] = [];

  // Pattern starting with '0': needs ceil(n/2) zeros and floor(n/2) ones
  if (zeros === Math.ceil(n / 2) && ones === Math.floor(n / 2)) {
    results.push(countSwaps('0'));
  }
  // Pattern starting with '1': needs ceil(n/2) ones and floor(n/2) zeros
  if (ones === Math.ceil(n / 2) && zeros === Math.floor(n / 2)) {
    results.push(countSwaps('1'));
  }

  return results.length === 0 ? -1 : Math.min(...results);
}

// === Test Cases ===
console.log(minSwaps('111000'));   // 1
console.log(minSwaps('010'));      // 0  (already alternating)
console.log(minSwaps('1110'));     // -1 (impossible)
console.log(minSwaps('0'));        // 0
console.log(minSwaps('01'));       // 0
console.log(minSwaps('10'));       // 0
console.log(minSwaps('110'));      // 1
```

---

## 🔗 Related Problems

| Problem | Pattern | Difficulty |
|---------|---------|-----------|
| [Minimum Swaps to Make String Balanced](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced) | Two Pointers | Medium |
| [Reorganize String](https://leetcode.com/problems/reorganize-string) | Greedy + Heap | Medium |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler) | Greedy | Medium |
| [Largest Number](https://leetcode.com/problems/largest-number) | Greedy | Medium |
