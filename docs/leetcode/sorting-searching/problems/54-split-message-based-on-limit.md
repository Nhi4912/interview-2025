---
layout: page
title: "Split Message Based on Limit"
difficulty: Hard
category: Sorting-Searching
tags: [String, Binary Search, Enumeration]
leetcode_url: "https://leetcode.com/problems/split-message-based-on-limit"
---

# Split Message Based on Limit / Chia Tin Nhắn Theo Giới Hạn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search on Answer
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn cần chia tin nhắn SMS dài thành các phần nhỏ. Mỗi phần có suffix `<k/n>`. Thay vì thử từng n từ nhỏ đến lớn, hãy **binary search** trên số phần n — nếu n đủ lớn thì luôn fit, nếu n quá nhỏ thì không fit.

**Pattern Recognition:**

- Signal: "find minimum n such that condition holds" → **Binary Search on Answer**
- Feasibility function: tổng dung lượng content của n phần >= message.length
- Key insight: `suffix(i, n) = "<i/n>"` dài `digits(i) + digits(n) + 3`

**Visual — Suffix overhead per part:**

```
message = "hello world",  limit = 9,  n = 3 parts

Part 1: "<1/3>" = 5 chars,  content space = 9-5 = 4  → "hell<1/3>"
Part 2: "<2/3>" = 5 chars,  content space = 9-5 = 4  → "o wo<2/3>"
Part 3: "<3/3>" = 5 chars,  content space = 9-5 = 4  → "rld<3/3>"

Total capacity = 4+4+4 = 12 >= 11 = message.length  ✅

Binary search: canFit(2)? → space=9-5=4 per part, 4+4=8 < 11 ❌
              canFit(3)? ✅  → answer = 3
```

---

## Problem Description

Chia chuỗi `message` thành các phần, mỗi phần có suffix `<k/n>` (k là số thứ tự, n là tổng số phần), và độ dài mỗi phần không vượt `limit`. Trả về mảng các phần hoặc `[]` nếu không thể. ([LeetCode 2468](https://leetcode.com/problems/split-message-based-on-limit))

- Example 1: `message="this is really a very awesome message", limit=9` → 14 parts
- Example 2: `message="short", limit=15` → `["short<1/1>"]`
- Example 3: `message="aaa", limit=2` → `[]`

Constraints: `1 ≤ message.length ≤ 10⁴`, `1 ≤ limit ≤ 10⁴`

---

## 📝 Interview Tips

1. **Clarify**: "Suffix format chính xác là gì? `<k/n>` hay định dạng khác?" / Confirm exact suffix format including brackets
2. **Suffix length**: "suffix `<i/n>` dài = digits(i) + digits(n) + 3" / Don't forget `<`, `/`, `>`
3. **Brute force**: "Thử n từ 1 tăng dần O(n²)" → binary search O(n log n) / Linear enumeration vs binary search
4. **Feasibility**: "Content space mỗi phần = limit - len(suffix_i), tổng >= msg.length" / Sum of content spaces
5. **Edge case**: "Nếu space <= 0 cho bất kỳ phần nào → không hợp lệ" / Any non-positive space = infeasible n
6. **Construction**: "Sau khi tìm n tối thiểu, build từng phần theo offset" / Build left-to-right after finding n

---

## Solutions

```typescript
/**
 * Solution 1: Linear Enumeration (Brute Force)
 * Time: O(n²) — try each n from 1 upward, check feasibility O(n) each
 * Space: O(n) — result array
 */
function splitMessageBruteForce(message: string, limit: number): string[] {
  const dLen = (x: number) => String(x).length;

  for (let n = 1; n <= message.length; n++) {
    const nLen = dLen(n);
    let capacity = 0,
      valid = true;
    for (let i = 1; i <= n; i++) {
      const space = limit - dLen(i) - nLen - 3; // <i/n>
      if (space <= 0) {
        valid = false;
        break;
      }
      capacity += space;
    }
    if (!valid) continue;
    if (capacity >= message.length) {
      const result: string[] = [];
      let idx = 0;
      for (let i = 1; i <= n && idx < message.length; i++) {
        const suffix = `<${i}/${n}>`;
        const space = limit - suffix.length;
        result.push(message.slice(idx, idx + space) + suffix);
        idx += space;
      }
      return result;
    }
  }
  return [];
}

/**
 * Solution 2: Binary Search on Total Parts (Optimal)
 * Time: O(n log n) — binary search O(log n), feasibility check O(n) each
 * Space: O(n) — result array
 */
function splitMessageBasedOnLimit(message: string, limit: number): string[] {
  const dLen = (x: number) => String(x).length;

  // Returns true if message fits in exactly n parts
  function canFit(n: number): boolean {
    const nLen = dLen(n);
    let capacity = 0;
    for (let i = 1; i <= n; i++) {
      const space = limit - dLen(i) - nLen - 3;
      if (space <= 0) return false;
      capacity += space;
      if (capacity >= message.length) return true;
    }
    return capacity >= message.length;
  }

  // Binary search for minimum feasible n
  let lo = 1,
    hi = message.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canFit(mid)) hi = mid;
    else lo = mid + 1;
  }

  if (!canFit(lo)) return [];

  // Construct result with minimum n parts
  const n = lo;
  const result: string[] = [];
  let idx = 0;
  for (let i = 1; i <= n && idx < message.length; i++) {
    const suffix = `<${i}/${n}>`;
    const space = limit - suffix.length;
    result.push(message.slice(idx, idx + space) + suffix);
    idx += space;
  }
  return result;
}

// === Test Cases ===
console.log(splitMessageBasedOnLimit("short", 15)); // ["short<1/1>"]
console.log(splitMessageBasedOnLimit("aaa", 2)); // []
console.log(splitMessageBasedOnLimit("ab", 5)); // ["ab<1/1>"]
console.log(splitMessageBasedOnLimit("a".repeat(10), 5)).length; // multiple parts
```

---

## 🔗 Related Problems

- [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) — binary search on sorted timestamps
- [Minimize Result by Adding Parentheses to Expression](https://leetcode.com/problems/minimize-result-by-adding-parentheses-to-expression) — string enumeration
- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) — binary search on answer with feasibility check
- [Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets) — same binary search pattern
- [Split Message Based on Limit — LeetCode](https://leetcode.com/problems/split-message-based-on-limit) — problem page
