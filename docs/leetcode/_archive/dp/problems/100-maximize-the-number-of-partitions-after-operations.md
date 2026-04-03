---
layout: page
title: "Maximize the Number of Partitions After Operations"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/maximize-the-number-of-partitions-after-operations"
---

# Maximize the Number of Partitions After Operations / Tối Đa Số Phân Đoạn Sau Thao Tác

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như chia lớp học thành nhóm — mỗi nhóm tối đa k học sinh khác nhau. Bạn được phép đổi chỗ ngồi của đúng 1 học sinh để tạo ra nhiều nhóm nhất có thể.

**Pattern Recognition:**

- Signal: "at most one change + maximize count" → DP with boolean `changed` flag
- Track current-partition distinct chars as a bitmask (26 bits)
- State: `(index, currentMask, usedChange)` → max partitions from here

**Visual:**

```
s = "abac", k = 2
No change:    [ab][ac]       = 2 partitions
Change s[1]b→a: [aa][ac]? → [a][a][ac] = 3 partitions ✓
mask for 'a'=1, 'b'=2, 'c'=4
After split, mask resets to just the new char's bit
```

## Problem Description

Given string `s` and integer `k`, you may change **at most one** character. Split `s` into maximum partitions where each segment has ≤ k distinct characters.

- Example 1: `s = "abac"`, `k = 2` → `3`
- Example 2: `s = "ssss"`, `k = 3` → `1`
- Constraints: `1 ≤ s.length ≤ 10^4`, `1 ≤ k ≤ 26`

## 📝 Interview Tips

1. **Clarify**: Thay đổi 1 ký tự ở bất kỳ vị trí nào? / Can we change any single position to any character?
2. **Approach**: Bitmask DP — track distinct chars in current segment as bitmask / memoize (i, mask, changed)
3. **Edge cases**: k ≥ 26 → always 1 partition; single character → always 1
4. **Optimize**: Số mask hợp lệ bị giới hạn bởi popcount ≤ k / valid masks bounded by C(26,k)
5. **Test**: Verify greedy no-change, then a change that splits one segment into two
6. **Follow-up**: At most 2 changes? → add dimension to DP state

## Solutions

```typescript
/** Solution 1: Memoized Bitmask DP with change flag
 * Time: O(n * C(26,k) * 26) | Space: O(n * C(26,k))
 */
function maxPartitionsAfterOperations(s: string, k: number): number {
  const n = s.length;
  const memo = new Map<string, number>();

  function popcount(x: number): number {
    let c = 0;
    while (x) {
      c += x & 1;
      x >>>= 1;
    }
    return c;
  }

  function dp(i: number, mask: number, changed: number): number {
    if (i === n) return 1;
    const key = `${i},${mask},${changed}`;
    if (memo.has(key)) return memo.get(key)!;

    const bit = 1 << (s.charCodeAt(i) - 97);
    let res = 0;

    // Option A: keep s[i] as-is
    const newMask = mask | bit;
    if (popcount(newMask) <= k) {
      res = Math.max(res, dp(i + 1, newMask, changed));
    } else {
      res = Math.max(res, 1 + dp(i + 1, bit, changed));
    }

    // Option B: change s[i] to best character (only if not yet changed)
    if (changed === 0) {
      for (let d = 0; d < 26; d++) {
        const nb = 1 << d;
        const nm = mask | nb;
        if (popcount(nm) <= k) {
          res = Math.max(res, dp(i + 1, nm, 1));
        } else {
          res = Math.max(res, 1 + dp(i + 1, nb, 1));
        }
      }
    }

    memo.set(key, res);
    return res;
  }

  return dp(0, 0, 0);
}

/** Solution 2: Greedy baseline + brute-force single change (O(n^2))
 * Time: O(26 * n^2) | Space: O(n)
 * Good for interviewing to show brute-force first
 */
function maxPartitionsAfterOperations2(s: string, k: number): number {
  function countPartitions(arr: string[]): number {
    let parts = 1;
    const cur = new Set<string>();
    for (const c of arr) {
      if (!cur.has(c) && cur.size === k) {
        parts++;
        cur.clear();
      }
      cur.add(c);
    }
    return parts;
  }

  const arr = s.split("");
  let best = countPartitions(arr);

  for (let i = 0; i < s.length; i++) {
    const orig = arr[i];
    for (let d = 0; d < 26; d++) {
      const nc = String.fromCharCode(97 + d);
      if (nc === orig) continue;
      arr[i] = nc;
      best = Math.max(best, countPartitions(arr));
    }
    arr[i] = orig;
  }
  return best;
}

// Tests
console.log(maxPartitionsAfterOperations("abac", 2)); // 3
console.log(maxPartitionsAfterOperations("ssss", 3)); // 1
console.log(maxPartitionsAfterOperations("aa", 1)); // 2
console.log(maxPartitionsAfterOperations2("abac", 2)); // 3
console.log(maxPartitionsAfterOperations2("ssss", 3)); // 1
```

## 🔗 Related Problems

| Problem                                                                                      | Relationship                |
| -------------------------------------------------------------------------------------------- | --------------------------- |
| [Partition Labels](https://leetcode.com/problems/partition-labels)                           | Greedy string partitioning  |
| [Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring) | Bitmask DP on strings       |
| [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word)               | Bitmask over character sets |
