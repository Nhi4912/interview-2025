---
layout: page
title: "Last Visited Integers"
difficulty: Easy
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/last-visited-integers"
---

# Last Visited Integers / Số Nguyên Được Ghé Thăm Gần Nhất

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Simulation / Stack Lookback

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Giống như đọc danh sách mua sắm — khi gặp từ "lấy lại cái vừa mua lần trước k", bạn quay lại nhìn k mặt hàng gần nhất mà bạn đã bỏ vào giỏ.

**Pattern Recognition:**

- Maintain a running list of seen integers; "prev" resets a counter k
- Each consecutive "prev" increments k to look further back
- If k > seen integers so far → return -1

**Visual:**

```
words = ["1","2","prev","prev","prev"]
seen  = []
"1"    → seen=[1]
"2"    → seen=[1,2]
"prev" → k=1, ans=seen[len-1]=2,  result=[2]
"prev" → k=2, ans=seen[len-2]=1,  result=[2,1]
"prev" → k=3, out of bounds,      result=[2,1,-1]
```

## Problem Description

Given a mixed list of strings (integers as strings or `"prev"`), process left to right. When you see `"prev"`, look back to the k-th most recent integer seen (where k increments for each consecutive `"prev"`). Return all answers for `"prev"` entries.

**Example 1:** `["1","2","prev","prev","prev"]` → `[2, 1, -1]`
**Example 2:** `["1","prev","2","prev","prev"]` → `[1, 2, 1]`

**Constraints:** `1 ≤ words.length ≤ 100`, each word is a valid integer string or `"prev"`

## 📝 Interview Tips

1. **Clarify**: Does k reset after a non-"prev" token? (Yes — only consecutive "prev"s share k)
2. **Approach**: Track `seen[]` integers and `prevCount` that resets on each integer
3. **Edge cases**: "prev" before any integer, many consecutive "prev"s
4. **Optimize**: Already O(n); no further optimization needed
5. **Follow-up**: What if "prev" could look back in a linked-list structure?
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: Linear Scan with Counter Reset — Time: O(n) | Space: O(n)
function lastVisitedIntegers(words: string[]): number[] {
  const seen: number[] = [];
  const result: number[] = [];
  let prevCount = 0;

  for (const word of words) {
    if (word === "prev") {
      prevCount++;
      const idx = seen.length - prevCount;
      result.push(idx >= 0 ? seen[idx] : -1);
    } else {
      seen.push(Number(word));
      prevCount = 0; // reset consecutive counter
    }
  }

  return result;
}

// Solution 2: Functional approach — Time: O(n) | Space: O(n)
function lastVisitedIntegers2(words: string[]): number[] {
  const result: number[] = [];
  const seen: number[] = [];
  let k = 0;

  for (const w of words) {
    if (w !== "prev") {
      seen.push(parseInt(w, 10));
      k = 0;
    } else {
      k++;
      result.push(k <= seen.length ? seen[seen.length - k] : -1);
    }
  }

  return result;
}

// Solution 3: With explicit index tracking — Time: O(n) | Space: O(n)
function lastVisitedIntegers3(words: string[]): number[] {
  const nums: number[] = [];
  const ans: number[] = [];
  let streak = 0;

  for (const word of words) {
    if (word === "prev") {
      streak++;
      ans.push(nums.length >= streak ? nums[nums.length - streak] : -1);
    } else {
      streak = 0;
      nums.push(+word);
    }
  }
  return ans;
}

// Tests
console.log(lastVisitedIntegers(["1", "2", "prev", "prev", "prev"])); // [2, 1, -1]
console.log(lastVisitedIntegers(["1", "prev", "2", "prev", "prev"])); // [1, 2, 1]
console.log(lastVisitedIntegers(["prev"])); // [-1]
console.log(lastVisitedIntegers2(["1", "2", "3", "prev", "prev"])); // [3, 2]
console.log(lastVisitedIntegers3(["prev", "1", "prev"])); // [-1, 1]
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship                        |
| -------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Design Browser History (LeetCode 1472)](https://leetcode.com/problems/design-browser-history/)    | Back-navigation with history stack  |
| [Crawler Log Folder (LeetCode 1598)](https://leetcode.com/problems/crawler-log-folder/)            | Process commands on a stack         |
| [Backspace String Compare (LeetCode 844)](https://leetcode.com/problems/backspace-string-compare/) | Process "undo" commands in sequence |
