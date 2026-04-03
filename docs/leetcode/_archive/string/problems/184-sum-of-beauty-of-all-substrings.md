---
layout: page
title: "Sum of Beauty of All Substrings"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/sum-of-beauty-of-all-substrings"
---

# Sum of Beauty of All Substrings / Tổng Vẻ Đẹp Của Tất Cả Chuỗi Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) | [Reorganize String](https://leetcode.com/problems/reorganize-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** "Vẻ đẹp" của chuỗi con = hiệu giữa ký tự xuất hiện nhiều nhất và ít nhất. Với mỗi điểm bắt đầu `i`, mở rộng cửa sổ sang phải, cập nhật frequency map, và cộng `max_freq - min_freq` vào tổng.

```
s = "aabcb"
Substrings of length ≥ 2:
  "aa"    → {a:2}          → max=2, min=2 → beauty=0
  "aab"   → {a:2,b:1}      → max=2, min=1 → beauty=1
  "aabc"  → {a:2,b:1,c:1}  → max=2, min=1 → beauty=1
  "aabcb" → {a:2,b:2,c:1}  → max=2, min=1 → beauty=1
  "ab"    → {a:1,b:1}      → beauty=0
  ...
Total beauty = 5
```

---

## Problem Description

The **beauty** of a substring is defined as the difference between the highest and lowest frequency of any character in it. Return the **sum of beauty** of all substrings of `s`.

**Example 1:** `s="aabcb"` → `5`
**Example 2:** `s="aab"` → `1`

Constraints: `1 ≤ s.length ≤ 500`, `s` consists of lowercase letters.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Chuỗi con có độ dài 1 không tính không?" / Single-char substrings have beauty 0, still counted
2. **Brute force / Vét cạn**: O(n³) — enumerate all substrings and recount frequencies each time
3. **Optimize / Tối ưu**: Fix left boundary, extend right → O(n²) with incremental frequency update
4. **Key state / Trạng thái**: freq array[26] + tracking current max/min is the key optimization
5. **Edge cases / Trường hợp đặc biệt**: All same chars → all beauties = 0; length 1 → 0
6. **Follow-up / Hỏi thêm**: "Chỉ tính chuỗi con dài ≥ k?" / Same approach, skip when right-left+1 < k

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n³) — recount frequencies for each substring
 * Time: O(n³)
 * Space: O(26) = O(1)
 */
function beautyOfSubstringsBrute(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const sub = s.substring(i, j);
      const freq = new Array(26).fill(0);
      for (const ch of sub) freq[ch.charCodeAt(0) - 97]++;
      const active = freq.filter((f) => f > 0);
      total += Math.max(...active) - Math.min(...active);
    }
  }
  return total;
}
console.log(beautyOfSubstringsBrute("aabcb")); // 5
console.log(beautyOfSubstringsBrute("aab")); // 1

/**
 * Solution 2: Optimized O(n²) — fix left, extend right with incremental updates
 * Time: O(n²) — n² iterations, each O(26) to find max/min
 * Space: O(26) = O(1)
 */
function beautyOfSubstrings(s: string): number {
  let total = 0;
  const n = s.length;

  for (let i = 0; i < n; i++) {
    const freq = new Array(26).fill(0);

    for (let j = i; j < n; j++) {
      freq[s.charCodeAt(j) - 97]++;

      // Find max and min among non-zero frequencies
      let maxF = 0,
        minF = Infinity;
      for (const f of freq) {
        if (f > 0) {
          if (f > maxF) maxF = f;
          if (f < minF) minF = f;
        }
      }
      total += maxF - minF;
    }
  }
  return total;
}

console.log(beautyOfSubstrings("aabcb")); // 5
console.log(beautyOfSubstrings("aab")); // 1
console.log(beautyOfSubstrings("a")); // 0
console.log(beautyOfSubstrings("abcd")); // 0  (all freq = 1 in each substring)
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Ransom Note](https://leetcode.com/problems/ransom-note)                                                       | Hash Map       | Easy       |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                           | Heap           | Medium     |
| [Number of Divisible Substrings](https://leetcode.com/problems/number-of-divisible-substrings)                 | Prefix Sum     | Medium     |
| [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) | Sliding Window | Medium     |
