---
layout: page
title: "Minimum Time to Type Word Using Special Typewriter"
difficulty: Easy
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-type-word-using-special-typewriter"
---

# Minimum Time to Type Word Using Special Typewriter / Thời Gian Gõ Tối Thiểu Trên Máy Chữ Đặc Biệt

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy / Circular Distance
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Giống như mặt đồng hồ — kim đang ở số 3, bạn cần đến số 9. Đi thuận chiều mất 6 bước, ngược chiều mất 6 bước — chọn cái nào cũng bằng nhau. Nhưng từ số 1 đến số 11, đi ngược chiều (2 bước) nhanh hơn đi xuôi (10 bước).

**Pattern Recognition:**

- Circular distance giữa 'a' và 'z' = 1 bước (z→a hoặc a→z)
- Mỗi bước: di chuyển `min(clockwise, counterclockwise)` + 1 bước để gõ
- Greedy: mỗi ký tự độc lập, chọn hướng ngắn hơn

**Visual:**

```
word = "abc"  (pointer starts at 'a' = 0)

'a': dist from 'a'(0) to 'a'(0) = 0, type: 0+1 = 1 step
'b': dist from 'a'(0) to 'b'(1):
     clockwise = 1, counter = 25 → min = 1
     total: 1+1 = 2 steps
'c': dist from 'b'(1) to 'c'(2):
     clockwise = 1, counter = 25 → min = 1
     total: 1+1 = 2 steps

Total = 1+2+2 = 5

word = "bza"  (pointer starts at 'a')
'b': |b-a| = 1, 26-1=25 → min=1 → 1+1=2
'z': |z-b| = 24, 26-24=2 → min=2 → 2+1=3
'a': |a-z| = 25, 26-25=1 → min=1 → 1+1=2
Total = 2+3+2 = 7
```

## Problem Description

A special typewriter has a wheel of 26 lowercase letters arranged in a circle. A pointer starts at `'a'`. Each second you can rotate the wheel one position (either direction). Typing a character takes 1 second. Return the **minimum time** to type `word`.

Examples: `"abc"` → 5 | `"bza"` → 7 | `"zjpc"` → 34.

## 📝 Interview Tips

1. **Clarify**: Con trỏ bắt đầu ở 'a'? Có thể quay hai chiều? / Yes, starts at 'a', both directions allowed
2. **Approach**: Tính circular distance mỗi bước, +1 để gõ / For each char: min(diff, 26-diff) + 1
3. **Edge cases**: Ký tự giống ký tự trước → 0 moves, just type (1 second) / Same char = 0 move cost
4. **Optimize**: Already O(n) one pass / No optimization needed
5. **Follow-up**: Nếu có nhiều con trỏ? → More complex optimization / Multiple pointers changes the problem
6. **Complexity**: O(n) time, O(1) space / Perfectly optimal

## Solutions

```typescript
/** Solution 1: Greedy - Min Circular Distance (Optimal)
 * Time: O(n) | Space: O(1)
 */
function minTimeToType(word: string): number {
  let time = 0;
  let cur = 0; // 'a' = 0

  for (const ch of word) {
    const target = ch.charCodeAt(0) - 97;
    const diff = Math.abs(target - cur);
    const move = Math.min(diff, 26 - diff); // clockwise vs counterclockwise
    time += move + 1; // +1 to type
    cur = target;
  }

  return time;
}

/** Solution 2: Explicit clockwise/counterclockwise calculation
 * Time: O(n) | Space: O(1)
 */
function minTimeToTypeVerbose(word: string): number {
  let total = 0;
  let prev = 0;

  for (const ch of word) {
    const curr = ch.charCodeAt(0) - 97;
    const clockwise = (curr - prev + 26) % 26;
    const counterclockwise = (prev - curr + 26) % 26;
    total += Math.min(clockwise, counterclockwise) + 1;
    prev = curr;
  }

  return total;
}

/** Solution 3: Reduce-based functional style
 * Time: O(n) | Space: O(1)
 */
function minTimeToTypeReduce(word: string): number {
  return [...word].reduce(
    (acc, ch) => {
      const target = ch.charCodeAt(0) - 97;
      const diff = Math.abs(target - acc.pos);
      const move = Math.min(diff, 26 - diff);
      return { time: acc.time + move + 1, pos: target };
    },
    { time: 0, pos: 0 },
  ).time;
}

// Tests
console.log(minTimeToType("abc")); // 5
console.log(minTimeToType("bza")); // 7
console.log(minTimeToType("zjpc")); // 34
console.log(minTimeToType("a")); // 1
console.log(minTimeToTypeVerbose("bza")); // 7
console.log(minTimeToTypeReduce("abc")); // 5
```

## 🔗 Related Problems

| Problem                                                                                                | Relationship                      |
| ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| [Circular Sentence](https://leetcode.com/problems/circular-sentence)                                   | Circular/ring structure reasoning |
| [Minimum Distance Between BST Nodes](https://leetcode.com/problems/minimum-distance-between-bst-nodes) | Minimum distance tracking         |
| [Rotary Combination Lock](https://leetcode.com/problems/open-the-lock)                                 | Circular movement on dial         |
