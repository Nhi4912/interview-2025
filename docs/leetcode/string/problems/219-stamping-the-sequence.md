---
layout: page
title: "Stamping The Sequence"
difficulty: Hard
category: String
tags: [String, Stack, Greedy, Queue]
leetcode_url: "https://leetcode.com/problems/stamping-the-sequence"
---

# Stamping The Sequence / Đóng Dấu Chuỗi

> **Difficulty**: 🔴 Hard | **Category**: String | **Pattern**: Greedy Reverse Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như xóa dần dấu con bằng tẩy — thay vì đóng dấu tiến, ta làm ngược lại: tìm vị trí nào trong target còn khớp với stamp (hoặc đã bị 'xóa' thành `*`), rồi tẩy ngược về `*****`. Lặp đến khi toàn bộ là `*`.

**Pattern Recognition:**

- Work **backwards**: instead of stamping, un-stamp positions to `*`
- At each pass, find a window that matches stamp (ignoring already-`*` positions)
- Reverse the collected stamp positions for the answer

**Visual:**

```
stamp="abc", target="ababc"

Pass 1: try each window of length 3:
  pos 0: "aba" vs "abc" → a?a matches if pos1='b'=stamp[1]? No 'b'='b' but 'a'≠'c' → 1 mismatch OK as * (no, 'a' is real)
  Actually: a window matches if EVERY non-star char matches stamp at same offset
  pos 2: "abc" == "abc" → match! stamp pos 2, target → "ab***"

Pass 2:
  pos 0: "ab*" → a=a✓, b=b✓, *=? → all non-stars match → match! stamp pos 0, → "*****"

Answer reversed: [2, 0]  → [0, 2]
```

## Problem Description

Given strings `stamp` and `target`, starting from `"??...?"` (all `?`), repeatedly stamp `stamp` over any position to replace those chars. Find a sequence of at most `10 * target.length` stamps to turn the `?` string into `target`. Return any valid sequence (reversed greedy works).

**Example 1:** `stamp="abc", target="ababc"` → `[0,2]`
**Example 2:** `stamp="abca", target="aabcaca"` → `[3,0,1]`

**Constraints:** `1 <= stamp.length <= target.length <= 1000`, both lowercase

## 📝 Interview Tips

1. **Clarify**: Multiple valid answers exist; any sequence within 10\*n stamps is accepted
2. **Approach**: Reverse greedy — repeatedly find windows in target that match stamp (treating `*` as wildcard), un-stamp them to `*`, collect positions, reverse at end
3. **Edge cases**: Stamp length equals target length; no solution possible (return [])
4. **Optimize**: Keep a "changed" flag per pass; stop when all `*` or no progress
5. **Follow-up**: Minimum stamps? (NP-hard in general)
6. **Complexity**: Time O(n² × m), Space O(n)

## Solutions

```typescript
// Solution 1: Greedy Reverse Un-stamping — Time: O(n^2*m) | Space: O(n)
function movesToStamp(stamp: string, target: string): number[] {
  const m = stamp.length;
  const n = target.length;
  const t = target.split("");
  const result: number[] = [];
  let totalReplaced = 0;

  function tryStamp(pos: number): number {
    let replaced = 0;
    for (let i = 0; i < m; i++) {
      if (t[pos + i] === "*") continue; // already wildcarded
      if (t[pos + i] !== stamp[i]) return 0; // mismatch
      replaced++;
    }
    // At least one real char gets wildcarded
    if (replaced > 0) {
      for (let i = 0; i < m; i++) t[pos + i] = "*";
    }
    return replaced;
  }

  while (totalReplaced < n) {
    let madeProgress = false;
    for (let pos = 0; pos <= n - m; pos++) {
      const replaced = tryStamp(pos);
      if (replaced > 0) {
        totalReplaced += replaced;
        result.push(pos);
        madeProgress = true;
        if (totalReplaced === n) break;
      }
    }
    if (!madeProgress) return []; // impossible
  }

  return result.reverse();
}

// Solution 2: Queue-based optimized — Time: O(n*m) | Space: O(n*m)
function movesToStamp2(stamp: string, target: string): number[] {
  const m = stamp.length;
  const n = target.length;

  // For each window position, track how many chars match stamp
  const windowMatch = new Array(n - m + 1).fill(0);
  const windowSize = n - m + 1;

  // For each target position, which windows cover it
  const targetToWindows: number[][] = Array.from({ length: n }, () => []);

  // Pre-check each (window, offset) pair
  const t = target.split("");
  const starCount = new Array(windowSize).fill(0); // already wildcarded in window

  // Initialize match counts
  for (let w = 0; w < windowSize; w++) {
    for (let j = 0; j < m; j++) {
      if (t[w + j] === stamp[j]) {
        windowMatch[w]++;
        targetToWindows[w + j].push(w);
      } else if (t[w + j] !== "*") {
        // mismatch — window w can't be used
        windowMatch[w] = -1; // invalid
        break;
      }
    }
  }

  const result: number[] = [];
  const queue: number[] = [];
  let totalStarred = 0;

  // Windows where all non-star chars match → can un-stamp
  for (let w = 0; w < windowSize; w++) {
    if (windowMatch[w] > 0) queue.push(w);
  }

  const used = new Array(windowSize).fill(false);

  while (queue.length > 0) {
    const w = queue.shift()!;
    if (used[w]) continue;
    used[w] = true;
    result.push(w);

    for (let j = 0; j < m; j++) {
      const pos = w + j;
      if (t[pos] === "*") continue;
      t[pos] = "*";
      totalStarred++;
      // Update windows covering this position
      for (const w2 of targetToWindows[pos]) {
        if (!used[w2] && windowMatch[w2] !== -1) {
          windowMatch[w2]--;
          starCount[w2]++;
          if (windowMatch[w2] === 0 && starCount[w2] < m) {
            // All non-star chars matched, and at least one was real
            queue.push(w2);
          }
        }
      }
    }
  }

  return totalStarred === n ? result.reverse() : [];
}

// Tests
console.log(movesToStamp("abc", "ababc")); // [0,2] or similar valid sequence
console.log(movesToStamp("abca", "aabcaca")); // [3,0,1] or similar
console.log(movesToStamp("a", "a")); // [0]
console.log(movesToStamp("aa", "aaaa")); // valid sequence
```

## 🔗 Related Problems

| Problem                                                           | Relationship                       |
| ----------------------------------------------------------------- | ---------------------------------- |
| [Zuma Game](https://leetcode.com/problems/zuma-game/)             | Greedy reverse sequence simulation |
| [Remove Boxes](https://leetcode.com/problems/remove-boxes/)       | String reduction via moves         |
| [Strange Printer](https://leetcode.com/problems/strange-printer/) | DP on string generation sequences  |
