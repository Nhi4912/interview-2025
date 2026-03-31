---
layout: page
title: "Construct the Longest New String"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Greedy, Brainteaser]
leetcode_url: "https://leetcode.com/problems/construct-the-longest-new-string"
---

# Construct the Longest New String / Xây Dựng Chuỗi Dài Nhất

## Tương tự thực tế (Vietnamese Analogy)

> Bạn có x tấm biển "AA", y tấm "BB", z tấm "AB". Ghép chúng sao cho không xuất hiện "AAA" hay "BBB".  
> Giống xếp gạch: mỗi cặp AA+BB ghép được "AABB" (4 ô an toàn), tấm "AB" luôn chèn được thoải mái.

## ASCII Visualization

```
x=2, y=3, z=1 → pair up min(2,3)=2 → AABB AABB
               y>x → 1 extra BB
               z=1 → AB
  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
  │A │A │B │B │A │A │B │B │B │B │A │B │
  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
  (min*2 + extra + z) * 2 = (2*2 + 1 + 1)*2 = 12
```

## Problem

Given integers `x`, `y`, `z` (counts of `"aa"`, `"bb"`, `"ab"`), return the **maximum** length of a string
you can construct using those substrings such that it contains **no** `"aaa"` or `"bbb"` as substring.

**Constraints:** `1 <= x, y, z <= 50`

## Interview Tips

1. **"ab" is always safe** — it never creates triple runs; insert all z copies freely.
2. **Pairing rule** — `"aa" + "bb" = "aabb"` (4 chars, no triples). Use `min(x,y)` such pairs.
3. **Leftover** — if `x ≠ y`, one extra `"aa"` or `"bb"` can be placed as a bookend (+2 chars).
4. **Formula** — `(min(x,y) * 2 + (x !== y ? 1 : 0) + z) * 2` — each unit is 2 chars.
5. **Why not both extras?** `...AABB + AA + BB` ends in "AABBBB" → "bbb" violation.
6. **Edge case** — `x=0,y=0` → only z AB strings; result = `z * 2`.

## Solutions

### Solution 1: Math / Greedy — O(1)

```typescript
function longestString(x: number, y: number, z: number): number {
  // min(x,y) AABB blocks + optional 1 extra AA or BB + all AB strings
  const pairs = Math.min(x, y);
  const hasExtra = x !== y ? 1 : 0;
  return (pairs * 2 + hasExtra + z) * 2;
}

console.log(longestString(2, 5, 1)); // 14: (2*2+1+1)*2=14
console.log(longestString(3, 3, 2)); // 16: (3*2+0+2)*2=16
console.log(longestString(1, 2, 3)); // 12: (1*2+1+3)*2=12
console.log(longestString(0, 0, 5)); // 10: (0+0+5)*2=10
console.log(longestString(1, 1, 1)); //  6: (1*2+0+1)*2=6
```

### Solution 2: Explicit Block Count — O(1)

```typescript
function longestStringV2(x: number, y: number, z: number): number {
  // Each "AABB" block uses 1 AA + 1 BB = 4 chars
  // If one side has extras (x≠y), take one more = 2 chars
  // All AB strings = z * 2 chars
  const sharedBlocks = Math.min(x, y) * 4;
  const soloBlock = x !== y ? 2 : 0;
  const abBlocks = z * 2;
  return sharedBlocks + soloBlock + abBlocks;
}

console.log(longestStringV2(2, 5, 1)); // 14
console.log(longestStringV2(3, 3, 2)); // 16
console.log(longestStringV2(0, 0, 0)); //  0
```

### Solution 3: Brute-Force DFS Verification (Small Inputs)

```typescript
function longestStringBrute(x: number, y: number, z: number): number {
  let best = 0;
  function dfs(rx: number, ry: number, rz: number, cur: string): void {
    if (cur.length > best) best = cur.length;
    if (rx > 0) {
      const s = cur + "aa";
      if (!s.includes("aaa") && !s.includes("bbb")) dfs(rx - 1, ry, rz, s);
    }
    if (ry > 0) {
      const s = cur + "bb";
      if (!s.includes("aaa") && !s.includes("bbb")) dfs(rx, ry - 1, rz, s);
    }
    if (rz > 0) {
      const s = cur + "ab";
      if (!s.includes("aaa") && !s.includes("bbb")) dfs(rx, ry, rz - 1, s);
    }
  }
  dfs(x, y, z, "");
  return best;
}

// Cross-verify math formula against brute force
console.log(longestStringBrute(1, 1, 1)); // 6
console.log(longestString(1, 1, 1)); // 6 ✓
console.log(longestStringBrute(2, 1, 0)); // 6
console.log(longestString(2, 1, 0)); // 6: (1*2+1+0)*2=6 ✓
console.log(longestStringBrute(1, 1, 2)); // 8
console.log(longestString(1, 1, 2)); // 8: (1*2+0+2)*2=8 ✓
```

## Related Problems

| Problem                                                                               | Difficulty | Key Concept             |
| ------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [String Without AAA or BBB](https://leetcode.com/problems/string-without-aaa-or-bbb/) | Medium     | Greedy construction     |
| [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array/)           | Medium     | Greedy with constraints |
| [Wiggle Subsequence](https://leetcode.com/problems/wiggle-subsequence/)               | Medium     | Greedy/DP               |
