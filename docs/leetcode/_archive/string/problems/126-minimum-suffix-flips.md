---
layout: page
title: "Minimum Suffix Flips"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-suffix-flips"
---

# Minimum Suffix Flips / Số Lần Lật Suffix Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy / String Traversal
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Hãy tưởng tượng bạn đang kẻ vạch sơn trên một hàng đèn (ban đầu tắt hết). Mỗi lần bạn chỉ được bật/tắt từ vị trí i đến cuối. Greedy: đi từ trái sang phải, hễ thấy đèn không đúng trạng thái thì lật một lần tại chỗ đó.

**Pattern Recognition:**

- Mỗi flip ở vị trí i ảnh hưởng suffix `[i..n-1]` → flip sau có thể cancel flip trước
- Chỉ cần flip khi `target[i] != current_state` → greedy, mỗi vị trí tối đa 1 flip
- Đếm số lần trạng thái thay đổi khi đi qua `target`

**Visual:**

```
target = "10111"  (start = "00000")

i=0: target='1', cur=0 → mismatch → FLIP [0..] → cur=1, ops=1
     state: "11111"
i=1: target='0', cur=1 → mismatch → FLIP [1..] → cur=0, ops=2
     state: "10000"
i=2: target='1', cur=0 → mismatch → FLIP [2..] → cur=1, ops=3
     state: "10111" ✓
i=3: target='1', cur=1 → match    → no flip
i=4: target='1', cur=1 → match    → no flip

Answer = 3 ops
```

## Problem Description

You have a binary string of `n` zeros. In one operation choose index `k`, flip all characters from `k` to end. Given a `target` string, return the **minimum number of operations** to reach it.

Examples: `"10111"` → 3 | `"101"` → 3 | `"00000"` → 0 | `"1"` → 1.

## 📝 Interview Tips

1. **Clarify**: Chuỗi target chỉ gồm '0' và '1'? / Only binary characters, always valid
2. **Approach**: Greedy — chỉ flip khi cần, đi từ trái sang phải / Scan left-to-right, flip on mismatch
3. **Edge cases**: Target toàn '0' → 0 ops; target[0]='1' → at least 1 op / All zeros = no ops needed
4. **Optimize**: Đếm số lần target[i] != target[i-1] + check target[0] / Count transitions in target
5. **Follow-up**: Nếu flip bất kỳ range [i..j]? → Different problem (harder) / General range flips is harder
6. **Complexity**: O(n) time, O(1) space / Linear scan, constant space

## Solutions

```typescript
/** Solution 1: Greedy Scan (Optimal)
 * Time: O(n) | Space: O(1)
 */
function minFlips(target: string): number {
  let ops = 0;
  let cur = 0; // current state of all positions (0 or 1)

  for (let i = 0; i < target.length; i++) {
    const t = parseInt(target[i]);
    if (t !== cur) {
      ops++;
      cur = t; // after flip at i, suffix becomes t
    }
  }
  return ops;
}

/** Solution 2: Count Transitions
 * Time: O(n) | Space: O(1)
 * Key insight: answer = number of 0→1 or 1→0 transitions + (target[0]=='1' ? 1 : 0)
 */
function minFlipsTransitions(target: string): number {
  let ops = target[0] === "1" ? 1 : 0;
  for (let i = 1; i < target.length; i++) {
    if (target[i] !== target[i - 1]) ops++;
  }
  return ops;
}

/** Solution 3: Simulation with Array (Illustrative)
 * Time: O(n^2) | Space: O(n)
 */
function minFlipsSim(target: string): number {
  const arr = new Array(target.length).fill(0);
  let ops = 0;

  for (let i = 0; i < target.length; i++) {
    if (arr[i] !== parseInt(target[i])) {
      // Flip suffix starting at i
      for (let j = i; j < arr.length; j++) {
        arr[j] ^= 1;
      }
      ops++;
    }
  }
  return ops;
}

// Tests
console.log(minFlips("10111")); // 3
console.log(minFlips("101")); // 3
console.log(minFlips("00000")); // 0
console.log(minFlips("1")); // 1
console.log(minFlipsTransitions("10111")); // 3
console.log(minFlipsSim("101")); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Flip String to Monotone Increasing](https://leetcode.com/problems/flip-string-to-monotone-increasing)                             | Greedy on binary string flips |
| [Minimum Number of Flips to Convert Binary Matrix](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix) | Greedy flip operations        |
| [Bulb Switcher](https://leetcode.com/problems/bulb-switcher)                                                                       | Toggle / flip state problems  |
