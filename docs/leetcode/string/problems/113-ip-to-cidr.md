---
layout: page
title: "IP to CIDR"
difficulty: Medium
category: String
tags: [String, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/ip-to-cidr"
---

# IP to CIDR / IP sang CIDR

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Add Binary](https://leetcode.com/problems/add-binary) | [Palindrome Permutation](https://leetcode.com/problems/palindrome-permutation)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia vùng đất thành các miếng lớn nhất có thể mà không vượt ranh giới. Mỗi CIDR block `/k` là một miếng đất kích thước 2^(32-k), phải căn chỉnh đúng ranh giới tự nhiên (alignment).

**Pattern Recognition:**

- Signal: "consecutive IP blocks" + "minimize blocks" → **Greedy + Bit Manipulation**
- Key insight: `ip & (-ip)` cho lowest set bit — đây là kích thước alignment tối đa của IP hiện tại.
- Chọn block lớn nhất = `min(alignment, largest_power_of_2 ≤ remaining_n)`.

**Visual:**

```
ip = "255.0.0.7", n = 10
                   └─ 0xFF000007

Step 1: 0xFF000007 → lowest bit = 1 (odd) → block=1 → /32
        covers [7],      n=9,  next=0xFF000008

Step 2: 0xFF000008 → lowest bit = 8 → 8 ≤ 9 → block=8 → /29
        covers [8..15],  n=1,  next=0xFF000010

Step 3: 0xFF000010 → lowest bit = 16 → 16 > 1 → block=1 → /32
        covers [16],     n=0   DONE ✓
Result: ["255.0.0.7/32", "255.0.0.8/29", "255.0.0.16/32"]
```

---

## Problem Description

Given a start IP address `ip` and integer `n`, return the **minimum** list of CIDR blocks (each a `/prefix` string) that cover exactly `n` consecutive IPs starting from `ip`. ([LeetCode](https://leetcode.com/problems/ip-to-cidr))

Difficulty: Medium | Acceptance: ~52%

```
Example 1: ip = "255.0.0.7", n = 10
  → ["255.0.0.7/32","255.0.0.8/29","255.0.0.16/32"]

Example 2: ip = "117.145.102.62", n = 8
  → ["117.145.102.62/31","117.145.102.64/30","117.145.102.68/31"]
```

Constraints:

- `7 <= ip.length <= 15`, valid IPv4
- `1 <= n <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "CIDR /k bao gồm 2^(32-k) địa chỉ, căn chỉnh theo boundary?" / Confirm /k = 2^(32-k) addresses, boundary-aligned.
2. **Brute force**: "Dùng /32 mỗi IP — đúng nhưng tối đa n blocks" / /32 for each IP is correct but gives n blocks.
3. **Optimize**: "Greedy: dùng block lớn nhất hợp lệ mỗi bước" / Greedy: pick largest valid block each step.
4. **Bit trick**: "`ip & (-ip >>> 0)` gives alignment; 32 - log2(blockSize) = prefix" / Key bit manipulation pattern.
5. **Edge cases**: "n=1 → /32; IP=0.0.0.0 → có thể /0; IP cuối octet lẻ → /32 đầu tiên" / Odd IP starts with /32.
6. **Follow-up**: "Minimum vs minimum-length notation? Greedy luôn cho số blocks tối thiểu" / Greedy always optimal here.

---

## Solutions

```typescript
/** Convert IPv4 string → 32-bit unsigned integer */
function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, o) => ((acc << 8) | parseInt(o)) >>> 0, 0);
}

/** Convert 32-bit unsigned integer → IPv4 string */
function intToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

/**
 * Solution 1: Greedy — Lowest-Set-Bit alignment
 * Time: O(log n) — at most log2(n) CIDR blocks
 * Space: O(log n) — result array
 */
function ipToCIDR(ip: string, n: number): string[] {
  const result: string[] = [];
  let cur = ipToInt(ip);
  let rem = n;

  while (rem > 0) {
    // Alignment: max block size this IP supports
    const align = cur === 0 ? Math.pow(2, 32) : cur & (-cur >>> 0);

    // Largest power of 2 ≤ remaining, and ≤ alignment
    let blockSize = 1;
    while (blockSize * 2 <= rem && blockSize * 2 <= align) {
      blockSize *= 2;
    }

    const prefix = 32 - Math.log2(blockSize);
    result.push(`${intToIp(cur)}/${prefix}`);
    cur = (cur + blockSize) >>> 0;
    rem -= blockSize;
  }

  return result;
}

/**
 * Solution 2: Bit-shift variant — count trailing zeros
 * Time: O(log n)
 * Space: O(log n)
 */
function ipToCIDRv2(ip: string, n: number): string[] {
  const result: string[] = [];
  let cur = ipToInt(ip);
  let rem = n;

  while (rem > 0) {
    // Count trailing zeros for alignment
    let tz = 0;
    let tmp = cur;
    if (tmp === 0) {
      tz = 32;
    } else {
      while ((tmp & 1) === 0) {
        tz++;
        tmp >>>= 1;
      }
    }

    // Max shift constrained by remaining count
    let shift = 0;
    while (shift < tz && 1 << (shift + 1) <= rem) shift++;

    const blockSize = 1 << shift;
    result.push(`${intToIp(cur)}/${32 - shift}`);
    cur = (cur + blockSize) >>> 0;
    rem -= blockSize;
  }

  return result;
}

// === Test Cases ===
console.log(ipToCIDR("255.0.0.7", 10));
// ["255.0.0.7/32","255.0.0.8/29","255.0.0.16/32"]

console.log(ipToCIDR("117.145.102.62", 8));
// ["117.145.102.62/31","117.145.102.64/30","117.145.102.68/31"]

console.log(ipToCIDR("0.0.0.0", 1)); // ["0.0.0.0/32"]
console.log(ipToCIDR("192.168.1.0", 4)); // ["192.168.1.0/30"]

console.log(ipToCIDRv2("255.0.0.7", 10));
// ["255.0.0.7/32","255.0.0.8/29","255.0.0.16/32"]
```

---

## 🔗 Related Problems

| Problem                                                            | Pattern                   | Difficulty |
| ------------------------------------------------------------------ | ------------------------- | ---------- |
| [Add Binary](https://leetcode.com/problems/add-binary)             | Bit Manipulation + String | Easy       |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) | Bit Manipulation          | Easy       |
| [Subsets](https://leetcode.com/problems/subsets)                   | Bit Masking               | Medium     |
| [Counting Bits](https://leetcode.com/problems/counting-bits)       | Bit Manipulation + DP     | Easy       |
