---
layout: page
title: "Minimum Number of Food Buckets to Feed the Hamsters"
difficulty: Medium
category: Dynamic Programming
tags: [String, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-food-buckets-to-feed-the-hamsters"
---

# Minimum Number of Food Buckets to Feed the Hamsters / Số Xô Thức Ăn Tối Thiểu Để Nuôi Chuột Hamster

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) | [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hàng xóm (H) cần nước, còn ô trống (E) là chỗ để đặt xô. Mỗi con chuột cần ít nhất một xô nằm bên cạnh (trái hoặc phải). Chiến lược tham lam: ưu tiên đặt xô **bên phải** (i+1) của con chuột — để xô đó có thể phục vụ cả con tiếp theo nếu cần.

**Pattern Recognition:**

- Greedy: duyệt từ trái qua phải, mỗi 'H' chưa được phục vụ → ưu tiên đặt xô bên phải
- Nếu bên phải không trống thì dùng bên trái
- Nếu cả hai đều không trống → không thể nuôi → trả về -1

**Visual — Greedy Scan:**

```
hamsters = "H..H.H"
             0123456

i=0 'H': right=1 (empty) → bucket[1], count=1, i+=2 → i=2
i=2 '.': skip
i=3 'H': right=4 (empty) → bucket[4], count=2, i+=2 → i=5
i=5 'H': right=6? out of bounds. left=4 (bucket placed) → served!
Answer: 2
```

---

## Problem Description

Given a 0-indexed string `hamsters` where `'H'` is a hamster and `'.'` is an empty space, place the minimum number of food buckets in empty spaces such that each hamster has at least one adjacent bucket. Return the minimum count, or `-1` if impossible. ([LeetCode #2086](https://leetcode.com/problems/minimum-number-of-food-buckets-to-feed-the-hamsters))

**Example 1:** `"H..H"` → `2` (place at index 1 and 2)
**Example 2:** `"HH"` → `-1` (two adjacent hamsters, no space between them)

Constraints: `1 <= hamsters.length <= 10^5`, only `'H'` and `'.'` characters

---

## 📝 Interview Tips

1. **Clarify**: "Một xô có thể phục vụ hai con chuột hai bên không? Có / One bucket can serve two hamsters on both sides"
2. **Greedy key**: "Ưu tiên bên phải trước — xô có thể dùng chung với con chuột kế tiếp / Right-first maximizes sharing"
3. **Edge case HH**: "Hai con chuột liền kề không có ô trống giữa → -1 / Adjacent HH without space = impossible"
4. **Mark visited**: "Dùng array hoặc modify string để đánh dấu xô đã đặt / Track placed buckets"
5. **Left fallback**: "Nếu right không khả dụng và left cũng không → return -1 ngay / Fail fast"
6. **Follow-up**: "Nếu một xô phục vụ tối đa k con? → DP/Greedy tổng quát hơn / Generalize to k capacity"

---

## Solutions

```typescript
/**
 * Solution 1: Greedy Scan (Optimal)
 * Time: O(n) — single pass
 * Space: O(n) — copy string to array for mutation
 *
 * Strategy: for each unserved hamster, prefer placing bucket to the RIGHT
 * so it may also serve the next hamster. Fallback to LEFT if right is blocked.
 */
function minimumBuckets(hamsters: string): number {
  const s = hamsters.split("");
  let count = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "H") continue;

    // Try placing bucket to the right first (greedy: share with next hamster)
    if (i + 1 < s.length && s[i + 1] === ".") {
      s[i + 1] = "B"; // mark bucket placed
      count++;
      i++; // skip next cell (just placed bucket there)
    } else if (i - 1 >= 0 && s[i - 1] === ".") {
      // Fallback: place bucket to the left
      s[i - 1] = "B";
      count++;
    } else {
      // No adjacent empty cell — impossible
      return -1;
    }
  }
  return count;
}

/**
 * Solution 2: DP Approach (for completeness)
 * Time: O(n)
 * Space: O(n) — dp array
 *
 * dp[i] = min buckets to serve hamsters in hamsters[0..i]
 */
function minimumBucketsDP(hamsters: string): number {
  const n = hamsters.length;
  // served[i] = true if hamster at i is already served by a bucket at i-1
  const served = new Array(n).fill(false);
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (hamsters[i] !== "H") continue;
    if (served[i]) continue; // already served by a left-placed bucket

    if (i + 1 < n && hamsters[i + 1] === ".") {
      count++;
      served[i] = true;
      if (i + 2 < n) served[i + 2] = true; // next hamster served by same bucket
      i++; // skip i+1 (bucket placed there)
    } else if (i - 1 >= 0 && hamsters[i - 1] === ".") {
      count++;
    } else {
      return -1;
    }
  }
  return count;
}

// === Test Cases ===
console.log(minimumBuckets("H..H")); // 2
console.log(minimumBuckets(".H.H.")); // 2
console.log(minimumBuckets("HH")); // -1
console.log(minimumBuckets("H")); // -1 (no adjacent empty space)
console.log(minimumBuckets(".H.")); // 1
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern        | Difficulty |
| ---------------------------------------------------------------------------------- | -------------- | ---------- |
| [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)               | DP             | Hard       |
| [Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string) | Greedy / DP    | Medium     |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) | Sliding Window | Medium     |
| [Jump Game](https://leetcode.com/problems/jump-game)                               | Greedy         | Medium     |
