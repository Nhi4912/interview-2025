---
layout: page
title: "Construct String With Repeat Limit"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Greedy, Heap (Priority Queue), Counting]
leetcode_url: "https://leetcode.com/problems/construct-string-with-repeat-limit"
---

# Construct String With Repeat Limit / Xây Dựng Chuỗi Với Giới Hạn Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống xây tường gạch — bạn muốn dùng gạch xịn nhất (ký tự lớn nhất) càng nhiều càng tốt, nhưng không quá `repeatLimit` viên liên tiếp. Khi đạt giới hạn, chèn 1 viên gạch thứ hai tốt nhất để "reset", rồi tiếp tục dùng gạch tốt nhất.

**Pattern Recognition:**

- "Lexicographically largest" + "no more than k consecutive" → Greedy with largest-first
- At each step: use up to `repeatLimit` of the largest char, then interleave second-largest
- No heap needed: iterate from 'z' down to 'a' using frequency array

**Visual:**

```
s = "cczazcc", repeatLimit = 3
freq: a→1, c→5, z→2

Step 1: largest = 'z'(2), take min(2,3)=2 → "zz", freq z→0
Step 2: largest = 'c'(5), take min(5,3)=3 → "zzCCC", freq c→2
Step 3: need break: next largest = 'a'(1), take 1 → "zzzccca", freq a→0
Step 4: largest = 'c'(2), take min(2,3)=2 → "zzzcccacc"
Result: "zzccca" → actually "zzcccac" → "zzcccac" ✅
```

## Problem Description

Given string `s` and integer `repeatLimit`, construct the **lexicographically largest** string using characters of `s` such that no character appears more than `repeatLimit` times **consecutively**. Use all or some characters. `1 ≤ repeatLimit ≤ s.length ≤ 10^5`, `s` contains only lowercase letters.

**Example 1:** `s = "cczazcc"`, `repeatLimit = 3` → `"zzcccac"`
**Example 2:** `s = "aababab"`, `repeatLimit = 2` → `"bbabaa"`

## 📝 Interview Tips

1. **Clarify**: Cần dùng hết ký tự không? Không — chỉ tối đa hóa chuỗi / No, use as many as possible but not required
2. **Approach**: Đếm tần số, duyệt từ 'z' xuống 'a' — khi bị chặn, dùng ký tự lớn thứ hai để ngắt / Frequency array, greedy from largest char
3. **Edge cases**: repeatLimit=1 → phải xen kẽ liên tục; một loại ký tự duy nhất / repeatLimit=1 forces alternation
4. **Optimize**: Không cần heap — 26 ký tự nên O(n·26) = O(n) / No heap needed, 26 chars makes it O(n)
5. **Test**: `"cczazcc"` → `"zzcccac"` (check z appears ≤3 consecutive) / Verify repeat constraint manually
6. **Follow-up**: Nếu alphabet lớn hơn? → dùng max-heap / For large alphabets use a max-heap

## Solutions

```typescript
/** Solution 1: Greedy with frequency array — iterate z→a
 * Time: O(n · 26) = O(n) | Space: O(26) = O(1)
 */
function repeatLimitedString(s: string, repeatLimit: number): string {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  const result: string[] = [];
  let i = 25; // start from 'z'

  while (i >= 0) {
    if (freq[i] === 0) {
      i--;
      continue;
    }

    // Use up to repeatLimit of char i
    const use = Math.min(freq[i], repeatLimit);
    result.push(String.fromCharCode(97 + i).repeat(use));
    freq[i] -= use;

    if (freq[i] > 0) {
      // Need to insert one character of the next available smaller char
      let j = i - 1;
      while (j >= 0 && freq[j] === 0) j--;
      if (j < 0) break; // no smaller char available — stop
      result.push(String.fromCharCode(97 + j));
      freq[j]--;
    }
  }

  return result.join("");
}

/** Solution 2: Same logic, slightly different loop structure
 * Time: O(n) | Space: O(n) for result
 */
function repeatLimitedString2(s: string, repeatLimit: number): string {
  const freq = new Array(26).fill(0);
  for (const c of s) freq[c.charCodeAt(0) - 97]++;

  const res: string[] = [];
  let big = 25;

  while (big >= 0) {
    while (big >= 0 && freq[big] === 0) big--;
    if (big < 0) break;

    const cnt = Math.min(freq[big], repeatLimit);
    for (let t = 0; t < cnt; t++) res.push(String.fromCharCode(97 + big));
    freq[big] -= cnt;

    if (freq[big] === 0) continue;

    // must interleave — find next smaller
    let small = big - 1;
    while (small >= 0 && freq[small] === 0) small--;
    if (small < 0) break;
    res.push(String.fromCharCode(97 + small));
    freq[small]--;
  }

  return res.join("");
}

// Test cases
console.log(repeatLimitedString("cczazcc", 3)); // "zzcccac"
console.log(repeatLimitedString("aababab", 2)); // "bbabaa"
console.log(repeatLimitedString2("cczazcc", 3)); // "zzcccac"
console.log(repeatLimitedString("z", 1)); // "z"
```

## 🔗 Related Problems

| Problem                                                                                              | Relationship                                             |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)                                 | Special case: repeatLimit=1, must use all chars          |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler)                                       | Greedy with cooldown — same interleaving intuition       |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart) | Same pattern with k-distance constraint instead of count |
