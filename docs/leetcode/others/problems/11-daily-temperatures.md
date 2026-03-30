---
layout: page
title: "Daily Temperatures"
difficulty: Medium
category: Stack
tags: [Stack, Array, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/daily-temperatures/"
---

# Daily Temperatures / Nhiệt Độ Hàng Ngày

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 🔥 Tier 1 — Key for "next greater element" pattern family
> **See also**: [Min Stack](../../design/problems/01-min-stack.md) | [Valid Parentheses](./01-valid-parentheses.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đứng xếp hàng chờ vé. Mỗi người muốn biết "phải chờ bao nhiêu ngày mới có ngày ấm hơn hôm nay?" Cách naive: mỗi ngày nhìn về tương lai (O(n²)). Cách thông minh: dùng **stack lưu những ngày đang chờ** — khi ngày mới ấm hơn ngày trên stack → ngày đó đã chờ xong.

**Pattern Recognition:**
- Signal: "next greater element", "next warmer day", "how long to wait" → **Monotonic Stack**
- Stack stores indices of days still "waiting for warmer"
- When we find a warmer day → pop and record wait time

**Visual — Step by step:**
```
temps = [73, 74, 75, 71, 69, 72, 76, 73]
         0    1   2   3   4   5   6   7

Stack (stores indices of unresolved days):

i=0: temp=73. Stack empty → push 0.        stack=[0]
i=1: temp=74 > temps[0]=73 → pop 0: ans[0]=1-0=1. push 1.  stack=[1]
i=2: temp=75 > temps[1]=74 → pop 1: ans[1]=2-1=1. push 2.  stack=[2]
i=3: temp=71 < temps[2]=75 → push 3.       stack=[2,3]
i=4: temp=69 < temps[3]=71 → push 4.       stack=[2,3,4]
i=5: temp=72 > temps[4]=69 → pop 4: ans[4]=5-4=1
              > temps[3]=71 → pop 3: ans[3]=5-3=2
              < temps[2]=75 → push 5.       stack=[2,5]
i=6: temp=76 > temps[5]=72 → pop 5: ans[5]=6-5=1
              > temps[2]=75 → pop 2: ans[2]=6-2=4
              Stack empty → push 6.         stack=[6]
i=7: temp=73 < temps[6]=76 → push 7.       stack=[6,7]

Remaining in stack: ans[6]=0, ans[7]=0

Result: [1,1,4,2,1,1,0,0] ✅
```

---

## Problem Description

Given an array of integers `temperatures` representing daily temperatures, return an array `answer` where `answer[i]` is the number of days after day `i` until a warmer temperature. If no future warmer day, `answer[i] = 0`.

```
Example 1: temperatures = [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]
Example 2: temperatures = [30,40,50,60] → [1,1,1,0]
Example 3: temperatures = [30,60,90] → [1,1,0]
```

---

## 📝 Interview Tips

1. **Pattern**: "next greater element" family → always think Monotonic Stack first
2. **Stack lưu gì**: index (not value) — vì cần tính khoảng cách
3. **Stack direction**: decreasing stack (pop when current > top)
4. **Family problems**: Next Greater Element I/II, Largest Rectangle in Histogram, Trapping Rain Water variant
5. **Edge case**: temperatures all decreasing → entire array stays in stack → answer all 0

---

## Solutions

{% raw %}

/**
 * Solution 1: Brute Force
 * Time: O(n²), Space: O(1) excluding output
 */
function dailyTemperatures_brute(temperatures: number[]): number[] {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        ans[i] = j - i;
        break;
      }
    }
  }
  return ans;
}

/**
 * Solution 2: Monotonic Stack (Optimal)
 *
 * Maintain a decreasing stack of indices.
 * When current temp > stack top temp → we found the answer for stack top.
 *
 * Time: O(n) — each index pushed and popped at most once
 * Space: O(n) — stack size
 */
function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  const stack: number[] = []; // indices of days waiting for warmer temp

  for (let i = 0; i < n; i++) {
    // Pop all indices whose temperature < current temperature
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      ans[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }
  // Remaining indices in stack → no warmer day → ans stays 0
  return ans;
}

// === Test Cases ===
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30,40,50,60]));              // [1,1,1,0]
console.log(dailyTemperatures([30,60,90]));                 // [1,1,0]
console.log(dailyTemperatures([90,80,70,60]));              // [0,0,0,0] — all decreasing

{% endraw %}

---

## 🔗 Related Problems

- [Min Stack](../../design/problems/01-min-stack.md) — stack design
- [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) — circular array variant
- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) — hard stack classic
- [Trapping Rain Water](../../array/problems/20-trapping-rain-water.md) — monotonic stack variant
