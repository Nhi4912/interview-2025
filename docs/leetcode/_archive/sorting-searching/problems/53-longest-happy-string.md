---
layout: page
title: "Longest Happy String"
difficulty: Medium
category: Sorting-Searching
tags: [String, Greedy, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/longest-happy-string"
---

# Longest Happy String / Chuỗi Vui Nhất Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Heap
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang xây chuỗi ký tự từng bước. Mỗi bước, hãy **chọn ký tự xuất hiện nhiều nhất** mà không tạo ra 3 liên tiếp. Nếu ký tự phổ biến nhất không được dùng, dùng ký tự phổ biến nhì để "phá vỡ chuỗi".

**Pattern Recognition:**

- Signal: "at most 2 consecutive" + "maximize length" → **Greedy + Sorted counts**
- Luôn chọn phần tử có count cao nhất (không vi phạm quy tắc) → greedy optimal
- Key insight: chỉ 3 ký tự, sort O(1), nên thuật toán là O((a+b+c))

**Visual — Greedy step-by-step with a=4, b=1, c=0:**

```
Counts: [a=4, b=1, c=0]  → sort desc each step

Step 1: [a=4,b=1] → pick 'a' (most), no rule break → "a"   [a=3,b=1]
Step 2: [a=3,b=1] → pick 'a' → "aa"                        [a=2,b=1]
Step 3: [a=2,b=1] → 'a' would make "aaa" ❌ → pick 'b'
        → "aab"                                             [a=2,b=0]
Step 4: [a=2,b=0] → pick 'a' → "aaba"                      [a=1,b=0]
Step 5: [a=1,b=0] → pick 'a' → "aabaa"                     [a=0]
Result: "aabaa"  ✅  (length 5)
```

---

## Problem Description

Cho ba số nguyên `a`, `b`, `c` là số ký tự 'a', 'b', 'c'. Tạo chuỗi dài nhất chỉ chứa các ký tự này mà không có **3 ký tự giống nhau liên tiếp**. ([LeetCode 1405](https://leetcode.com/problems/longest-happy-string))

- Example 1: `a=1, b=1, c=7` → `"ccbccacc"` (length 8)
- Example 2: `a=2, b=2, c=1` → `"aabbc"` or `"aabbca"` (length 6 or so)
- Example 3: `a=4, b=1, c=0` → `"aabaa"` (length 5)

Constraints: `0 ≤ a, b, c ≤ 100`

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ có 3 ký tự? Không có ký tự khác?" / Confirm only 'a', 'b', 'c' are used
2. **Greedy intuition**: "Luôn dùng ký tự nhiều nhất có thể — greedy tối ưu vì không có lợi ích trì hoãn" / Always use most frequent
3. **Rule check**: "Nếu ký tự phổ biến nhất sẽ tạo 3 liên tiếp, chuyển sang ký tự phổ biến nhì" / Switch to 2nd most frequent
4. **Termination**: "Dừng khi không còn ký tự hợp lệ nào" / Stop when no valid character can be appended
5. **Complexity**: "Chỉ 3 ký tự → sort O(1), tổng O(a+b+c)" / Only 3 chars makes sort O(1) per step
6. **Edge case**: "a=0, b=0 → chỉ 'c' tối đa 2; một count = 0 xử lý tự nhiên" / Zero counts handled naturally

---

## Solutions

```typescript
/**
 * Solution 1: Greedy (counts array, sort each step)
 * Time: O((a + b + c) × 3) = O(a + b + c) — sort 3 elements per step is O(1)
 * Space: O(a + b + c) — result string
 */
function longestHappyStringGreedy(a: number, b: number, c: number): string {
  const counts: [number, string][] = [
    [a, "a"],
    [b, "b"],
    [c, "c"],
  ];
  const result: string[] = [];

  while (true) {
    // Always sort to put most frequent first: O(1) since 3 elements
    counts.sort((x, y) => y[0] - x[0]);

    const last = result[result.length - 1];
    const secondLast = result[result.length - 2];

    let placed = false;
    for (const entry of counts) {
      const [cnt, ch] = entry;
      if (cnt === 0) break;
      // Skip if adding ch would create 3 consecutive
      if (last === ch && secondLast === ch) continue;
      result.push(ch);
      entry[0]--;
      placed = true;
      break;
    }

    if (!placed) break; // No valid char can be placed
  }

  return result.join("");
}

/**
 * Solution 2: Greedy — Explicit two-at-a-time logic
 * Time: O(a + b + c) — each iteration places 1 or 2 characters
 * Space: O(a + b + c) — result string
 */
function longestHappyString(a: number, b: number, c: number): string {
  const result: string[] = [];
  let counts: [number, string][] = [
    [a, "a"],
    [b, "b"],
    [c, "c"],
  ];

  while (true) {
    counts.sort((x, y) => y[0] - x[0]);
    const [[cnt1, ch1], [cnt2, ch2]] = counts;

    if (cnt1 === 0) break;

    const n = result.length;
    const tail2Same = n >= 2 && result[n - 1] === ch1 && result[n - 2] === ch1;

    if (tail2Same) {
      // Most frequent would create triple; use second most
      if (cnt2 === 0) break;
      result.push(ch2);
      counts[1][0]--;
    } else {
      // Use most frequent, add two if count allows
      const take = cnt1 > cnt2 ? Math.min(2, cnt1) : 1;
      for (let i = 0; i < take; i++) result.push(ch1);
      counts[0][0] -= take;
    }
  }

  return result.join("");
}

// === Test Cases ===
console.log(longestHappyString(1, 1, 7)); // "ccbccacc" or similar, length 8
console.log(longestHappyString(4, 1, 0)); // "aabaa", length 5
console.log(longestHappyString(0, 0, 3)); // "cc", length 2
console.log(longestHappyString(2, 2, 1)); // e.g. "aabbc", length 5+
```

---

## 🔗 Related Problems

- [Reorganize String](https://leetcode.com/problems/reorganize-string) — no 2 adjacent same chars, same greedy idea
- [Construct String With Repeat Limit](https://leetcode.com/problems/construct-string-with-repeat-limit) — greedy with repeat limit > 2
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy scheduling with cooldown
- [Lexicographically Minimum String After Removing Stars](https://leetcode.com/problems/lexicographically-minimum-string-after-removing-stars) — greedy + heap on characters
- [Longest Happy String — LeetCode](https://leetcode.com/problems/longest-happy-string) — problem page
