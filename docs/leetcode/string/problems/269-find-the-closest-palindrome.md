---
layout: page
title: "Find the Closest Palindrome"
difficulty: Hard
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/find-the-closest-palindrome"
---

# Find the Closest Palindrome / Tìm Số Palindrome Gần Nhất

> **Track**: String | **Difficulty**: 🔴 Hard | **Pattern**: Candidate Generation
> **Frequency**: Medium — FAANG số học nâng cao, thường xuất hiện ở vòng onsite
> **See also**: [Palindrome Number](https://leetcode.com/problems/palindrome-number) | [Prime Palindrome](https://leetcode.com/problems/prime-palindrome)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là thợ chỉnh gương tại một tiệm gương đặc biệt — mỗi tấm gương phải hoàn toàn đối xứng (palindrome). Khách mang vào tấm gương lệch (số n không phải palindrome), nhờ bạn chỉnh sang tấm gần nhất. Bạn không cần thử từng số từ 1 đến 10^18 — thay vào đó, bạn biết rằng chỉ cần thử **5 kiểu chỉnh**: gương nửa đầu hiện tại, nửa đầu +1, nửa đầu -1, dạng 9...9 ngắn hơn, và dạng 10...01 dài hơn. Rồi chọn tấm gương gần n nhất trong 5 ứng viên đó.

**Pattern Recognition:**

- Signal: "find nearest palindrome not equal to n" → **Candidate Generation + Math**
- Bài này thuộc dạng sinh ứng viên hữu hạn rồi so sánh, không cần tìm kiếm toàn bộ không gian số
- Key insight: palindrome gần nhất **chắc chắn** nằm trong 5 ứng viên: mirror(half+δ) với δ∈{-1,0,+1}, 10^(len-1)-1, 10^len+1

**Visual — n = "12321" example:**

```
n = "12321"  (len=5, odd)  →  half = n[0..2] = "123"

Candidate 1: 10^(5-1)-1  = 9999     |12321 - 9999|  = 2322
Candidate 2: 10^5+1       = 100001   |12321 - 100001|= 87680

Mirror from half (odd: mirror = half + rev(half[0..-2])):
  delta=-1: "122" → "122" + rev("12") = "12221"   |12321-12221| = 100
  delta= 0: "123" → "12321"  ← equals n, SKIP
  delta=+1: "124" → "12421"                        |12321-12421| = 100

Tie between "12221" and "12421" (both Δ=100)
→ tie-break: pick the smaller → "12221" ✅
```

---

## Problem Description

Given a string `n` representing a positive integer, return the closest integer **not equal to `n`** that is a palindrome. If two palindromes are equally close, return the **smaller** one. ([LeetCode](https://leetcode.com/problems/find-the-closest-palindrome))

```
Example 1: n = "123"  → "121"    (|123-121|=2, next is |123-131|=8)
Example 2: n = "1"    → "0"      (|1-0|=1 = |1-2|=1 → pick smaller: 0)
Example 3: n = "9999" → "10001"  (|9999-10001|=2 < |9999-9889|=110)
```

Constraints: `1 <= n.length <= 18`, n has no leading zeros, `1 <= n <= 10^18`.

---

## 📝 Interview Tips

1. **"Why exactly 5 candidates?"** — _Palindrome gần nhất chỉ đến từ việc thay nửa đầu ±1, hoặc bước qua ngưỡng số chữ số — không thể là trường hợp khác._
2. **"Use BigInt — n up to 10^18 overflows Number"** — _Number.MAX_SAFE_INTEGER ≈ 9×10^15 < 10^18; dùng BigInt để giữ độ chính xác._
3. **"Skip mirror candidate when it equals n"** — _delta=0 tạo ra mirror của chính n; nếu n đã là palindrome, ứng viên đó phải bị loại._
4. **"Filter candidates starting with '0'"** — _"00" không hợp lệ với BigInt; những trường hợp này đã có 10^(len-1)-1 bao phủ._
5. **"Tie-break: always return the smaller palindrome"** — _Khi hai ứng viên cùng khoảng cách, đề bài yêu cầu trả về số bé hơn._
6. **"10^len+1 handles overflow digit count upward"** — _Ví dụ n≈9999: palindrome ngắn nhất dài hơn là 10001, không phải 100001._

---

## Solutions

```typescript
/** Solution 1: 5-Candidate Generation  @complexity Time: O(len) | Space: O(len) */
function nearestPalindromic(n: string): string {
  const len = n.length;
  const num = BigInt(n);
  const candidates: bigint[] = [];

  // All-9s with one fewer digit  (e.g. 999 for len=4)
  candidates.push(BigInt(10) ** BigInt(len - 1) - 1n);
  // 10...01 with one more digit  (e.g. 10001 for len=4)
  candidates.push(BigInt(10) ** BigInt(len) + 1n);

  // Mirror first ceil(len/2) digits with delta in {-1, 0, +1}
  const halfLen = Math.ceil(len / 2);
  const halfNum = BigInt(n.substring(0, halfLen));

  for (const delta of [-1n, 0n, 1n]) {
    const newHalf = (halfNum + delta).toString();
    if (newHalf.startsWith("-")) continue;
    let candidate: string;
    if (len % 2 === 0) {
      // even length: "12" → "1221"
      candidate = newHalf + [...newHalf].reverse().join("");
    } else {
      // odd length: "123" → "12321" (middle char not repeated)
      candidate = newHalf + [...newHalf.slice(0, -1)].reverse().join("");
    }
    if (!candidate.startsWith("0")) {
      candidates.push(BigInt(candidate));
    }
  }

  let result = -1n;
  let minDiff = -1n;

  for (const c of candidates) {
    if (c === num) continue;
    const diff = c > num ? c - num : num - c;
    if (minDiff < 0n || diff < minDiff || (diff === minDiff && c < result)) {
      minDiff = diff;
      result = c;
    }
  }

  return result.toString();
}

/** Solution 2: Extracted helper, functional style  @complexity Time: O(len) | Space: O(len) */
function nearestPalindromic2(n: string): string {
  const mirrorOf = (half: string, isOdd: boolean): bigint => {
    if (half.startsWith("-") || half.startsWith("0")) return -1n;
    const rev = [...(isOdd ? half.slice(0, -1) : half)].reverse().join("");
    return BigInt(half + rev);
  };

  const len = n.length;
  const num = BigInt(n);
  const halfLen = Math.ceil(len / 2);
  const half = BigInt(n.substring(0, halfLen));
  const isOdd = len % 2 === 1;

  const pool: bigint[] = [
    BigInt(10) ** BigInt(len - 1) - 1n,
    BigInt(10) ** BigInt(len) + 1n,
    ...[-1n, 0n, 1n]
      .map((d) => half + d)
      .filter((h) => h > 0n)
      .map((h) => mirrorOf(h.toString(), isOdd))
      .filter((c) => c > 0n),
  ].filter((c) => c !== num);

  return pool
    .reduce((best, c) => {
      const dC = c > num ? c - num : num - c;
      const dB = best > num ? best - num : num - best;
      return dC < dB || (dC === dB && c < best) ? c : best;
    })
    .toString();
}

// === Test Cases ===
console.log(nearestPalindromic("123")); // "121"
console.log(nearestPalindromic("1")); // "0"
console.log(nearestPalindromic("9999")); // "10001"
console.log(nearestPalindromic("1234")); // "1221"
console.log(nearestPalindromic("12321")); // "12221"
console.log(nearestPalindromic2("999999999999999999")); // "1000000000000000001"
console.log(nearestPalindromic2("10")); // "9"
console.log(nearestPalindromic2("11")); // "9"
```

---

## 🔗 Related Problems

| #   | Problem                       | Difficulty | Pattern              |
| --- | ----------------------------- | ---------- | -------------------- |
| 9   | Palindrome Number             | Easy       | Math                 |
| 5   | Longest Palindromic Substring | Medium     | DP / Expand Center   |
| 866 | Prime Palindrome              | Hard       | Math + Palindrome    |
| 906 | Super Palindromes             | Hard       | Candidate Generation |
