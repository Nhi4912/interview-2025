---
layout: page
title: "Find the Longest Balanced Substring of a Binary String"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/find-the-longest-balanced-substring-of-a-binary-string"
---

# Find the Longest Balanced Substring of a Binary String / Chuỗi Con Cân Bằng Dài Nhất Trong Chuỗi Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến cây cân hai đĩa — một đĩa đặt những khối '0', đĩa kia đặt những khối '1'. Chuỗi "cân bằng" là khi số '0' bên trái bằng số '1' bên phải, và tất cả số '0' đứng trước tất cả số '1' (dạng "000...111..."). Như chiếc cân phải đặt đúng vật nặng vào đúng đĩa theo đúng thứ tự.

**Pattern Recognition:**

- Signal: "balanced = equal 0s and 1s" + "form 000...111..." → **String Processing / Two Counters**
- Key insight: Quét chuỗi, đếm số '0' liên tiếp rồi số '1' liên tiếp theo sau. Kết quả = 2 × min(zeros, ones). Reset khi thấy '0' sau '1'.

**Visual — s = "01000111":**

```
Scan left to right, track zeros and ones runs:

i=0: '0' → zeros=1, ones=0
i=1: '1' → ones=1    (transitioning 0→1)
i=2: '0' → RESET: zeros=1, ones=0  (new run starts)
i=3: '0' → zeros=2
i=4: '0' → zeros=3
i=5: '1' → ones=1
i=6: '1' → ones=2
i=7: '1' → ones=3, balanced=2*min(3,3)=6  ← best!

Result: 6  (substring "000111")
```

---

## 📝 Problem Description

A "balanced" substring has the form `0...01...1` (some 0s followed by equal number of 1s). Return the length of the longest balanced substring in the given binary string `s`.

- **Example 1:** s="01000111" → `6` (substring "000111")
- **Example 2:** s="00111" → `4` (substring "0011")

Constraints: `1 ≤ n ≤ 50`, string contains only '0' and '1'.

---

## 🎯 Interview Tips

1. **Pattern shape** / Dạng mẫu: Balanced = all 0s come before all 1s, equal count.
2. **Reset on 0-after-1** / Reset khi '0' sau '1': Seeing a '0' after '1' means current run ended — start fresh.
3. **min(zeros, ones)** / min(zeros, ones): The balanced portion is limited by the smaller side.
4. **Multiply by 2** / Nhân 2: Length = 2 × min since we need equal counts.
5. **Edge: all same** / Trường hợp toàn một loại: "0000" or "1111" → no balanced substring → 0.
6. **Small constraints** / Ràng buộc nhỏ: n≤50 allows O(n²) brute force too.

---

## 💡 Solutions

### Approach 1: Brute Force — Check All Substrings

/\*_ @complexity Time: O(n²) | Space: O(1) _/

```typescript
function findTheLongestBalancedSubstringBrute(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    let zeros = 0,
      ones = 0;
    let valid = true;
    for (let j = i; j < s.length; j++) {
      if (s[j] === "0") {
        if (ones > 0) {
          valid = false;
          break;
        } // '0' after '1'
        zeros++;
      } else {
        ones++;
      }
      if (valid && zeros === ones) best = Math.max(best, zeros + ones);
    }
  }
  return best;
}
```

### Approach 2: Two Counters — Single Pass (Optimal)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function findTheLongestBalancedSubstring(s: string): number {
  let best = 0;
  let zeros = 0,
    ones = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === "0") {
      if (ones > 0) {
        // A '0' appeared after '1's: reset the run
        zeros = 0;
        ones = 0;
      }
      zeros++;
    } else {
      // s[i] === '1'
      ones++;
      // balanced portion = 2 * min(zeros, ones)
      best = Math.max(best, 2 * Math.min(zeros, ones));
    }
  }
  return best;
}
```

---

## 🧪 Test Cases

```typescript
console.log(findTheLongestBalancedSubstring("01000111")); // → 6
console.log(findTheLongestBalancedSubstring("00111")); // → 4
console.log(findTheLongestBalancedSubstring("111")); // → 0
console.log(findTheLongestBalancedSubstring("01")); // → 2
console.log(findTheLongestBalancedSubstring("0011")); // → 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                              | Difficulty | Pattern |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------- |
| [Minimum Changes to Make Alternating Binary String](https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string) | Easy       | String  |
| [Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing)                               | Medium     | DP      |
| [Decode String](https://leetcode.com/problems/decode-string)                                                                         | Medium     | Stack   |
| [Simplify Path](https://leetcode.com/problems/simplify-path)                                                                         | Medium     | Stack   |
