---
layout: page
title: "Stickers to Spell Word"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Hash Table, String, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/stickers-to-spell-word"
---

# Stickers to Spell Word / Dán Nhãn Để Đánh Vần Từ

🔴 Hard | Bitmask DP on target character subsets

## 🧠 Intuition

**VI:** Biểu diễn tập con ký tự cần đánh vần bằng bitmask (target tối đa 15 ký tự).
`dp[mask]` = số nhãn tối thiểu để đánh vần các ký tự trong `mask`.

**EN:** Represent which target characters are still needed as a bitmask. `dp[mask]` =
minimum stickers to cover all characters in `mask`. Transition: for each sticker,
reduce the mask by characters the sticker provides.

```
target = "thehat"  (6 chars → 2^6 = 64 states)
stickers = ["with","example","..."
]
dp[0b000000] = 0  (nothing needed)
For each mask, try each sticker:
  new_mask = mask, remove chars that sticker provides
  dp[mask] = min(dp[mask], 1 + dp[new_mask])
```

## 📝 Interview Tips

- 🔑 **EN:** Bitmask DP — target length ≤ 15, so at most 2^15 = 32768 states.
  **VI:** DP bitmask — độ dài target ≤ 15, tối đa 2^15 = 32768 trạng thái.
- 🔑 **EN:** `dp[0] = 0`; all other states start at Infinity.
  **VI:** `dp[0] = 0`; các trạng thái khác bắt đầu bằng Infinity.
- 🔑 **EN:** Key insight: only process stickers that cover bit 0 of the mask (smallest unset needed character) to avoid redundant orderings.
  **VI:** Chỉ xử lý nhãn bao phủ bit thấp nhất của mask để tránh thứ tự thừa.
- 🔑 **EN:** Precompute how each sticker reduces each possible target-char mask.
  **VI:** Tính trước cách mỗi nhãn giảm mask ký tự mục tiêu.
- 🔑 **EN:** Iterate masks from 1 to `(1<<n)-1`; for each, try all stickers.
  **VI:** Lặp mask từ 1 đến `(1<<n)-1`; với mỗi mask, thử tất cả nhãn.
- 🔑 **EN:** Return `-1` if `dp[(1<<n)-1] === Infinity`.
  **VI:** Trả `-1` nếu `dp[(1<<n)-1] === Infinity`.

## Solutions

### Solution 1: Bitmask DP (bottom-up)

```typescript
/**
 * Stickers to Spell Word — bitmask DP
 * dp[mask] = min stickers to cover characters indicated by mask
 * Time: O(2^t * s * t)  where t=target.length, s=stickers.length
 * Space: O(2^t)
 */
function minStickers(stickers: string[], target: string): number {
  const t = target.length;
  const total = 1 << t;
  const dp = new Array(total).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask < total; mask++) {
    if (dp[mask] === Infinity) continue;
    // find first needed character (lowest set bit)
    let firstBit = -1;
    for (let i = 0; i < t; i++) {
      if (mask & (1 << i)) {
        firstBit = i;
        break;
      }
    }
    // Only use stickers that contain target[firstBit] — avoids duplicates
    for (const sticker of stickers) {
      if (!sticker.includes(target[firstBit])) continue;
      let nextMask = mask;
      const freq = new Array(26).fill(0);
      for (const ch of sticker) freq[ch.charCodeAt(0) - 97]++;
      for (let i = 0; i < t; i++) {
        if (nextMask & (1 << i)) {
          const c = target.charCodeAt(i) - 97;
          if (freq[c] > 0) {
            freq[c]--;
            nextMask ^= 1 << i;
          }
        }
      }
      dp[nextMask] = Math.min(dp[nextMask], dp[mask] + 1);
    }
  }

  return dp[total - 1] === Infinity ? -1 : dp[total - 1];
}

console.log(minStickers(["with", "example", "science"], "thehat")); // 3
console.log(minStickers(["notice", "possible"], "basicbasic")); // -1
console.log(minStickers(["ab", "bc", "cd"], "abcd")); // 2
```

### Solution 2: Top-Down Memoisation

```typescript
/**
 * Top-down with string-keyed memo (bitmask as string key)
 * Time: O(2^t * s * t)  Space: O(2^t)
 */
function minStickers2(stickers: string[], target: string): number {
  const t = target.length;
  const memo = new Map<number, number>();

  // Precompute sticker freq arrays
  const sFreq = stickers.map((s) => {
    const f = new Array(26).fill(0);
    for (const ch of s) f[ch.charCodeAt(0) - 97]++;
    return f;
  });

  function dp(mask: number): number {
    if (mask === 0) return 0;
    if (memo.has(mask)) return memo.get(mask)!;

    // find first set bit character
    let firstBit = 0;
    while (!(mask & (1 << firstBit))) firstBit++;
    const need = target.charCodeAt(firstBit) - 97;

    let best = Infinity;
    for (let si = 0; si < stickers.length; si++) {
      if (sFreq[si][need] === 0) continue;
      const freq = [...sFreq[si]];
      let next = mask;
      for (let i = 0; i < t; i++) {
        if (next & (1 << i)) {
          const c = target.charCodeAt(i) - 97;
          if (freq[c] > 0) {
            freq[c]--;
            next ^= 1 << i;
          }
        }
      }
      const sub = dp(next);
      if (sub !== -1) best = Math.min(best, 1 + sub);
    }

    const res = best === Infinity ? -1 : best;
    memo.set(mask, res);
    return res;
  }

  return dp((1 << t) - 1);
}

console.log(minStickers2(["with", "example", "science"], "thehat")); // 3
console.log(minStickers2(["notice", "possible"], "basicbasic")); // -1
```

## 🔗 Related Problems

| Problem                                                                                                                     | Difficulty | Key Idea           |
| --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [691. Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word/)                                        | 🔴 Hard    | This problem       |
| [473. Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)                                          | 🟡 Medium  | Bitmask subset DP  |
| [698. Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)                    | 🟡 Medium  | Bitmask DP         |
| [1986. Minimum Number of Work Sessions](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/) | 🟡 Medium  | Bitmask scheduling |
