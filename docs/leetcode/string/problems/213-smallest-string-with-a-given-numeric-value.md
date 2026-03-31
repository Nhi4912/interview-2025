---
layout: page
title: "Smallest String With A Given Numeric Value"
difficulty: Medium
category: String
tags: [String, Greedy]
leetcode_url: "https://leetcode.com/problems/smallest-string-with-a-given-numeric-value"
---

# Smallest String With A Given Numeric Value / Chuỗi Nhỏ Nhất Với Giá Trị Số Cho Trước

> **Difficulty**: 🟡 Medium | **Category**: String | **Pattern**: Greedy (build from right)

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như đổi tiền — để có số tiền k bằng ít tờ tiền lớn nhất mà vẫn đảm bảo số lượng tờ bằng n, ta để cuối cùng dùng tờ lớn (z=26), đầu tiên dùng tờ nhỏ nhất ('a'=1).

**Pattern Recognition:**

- Build from **right to left** to make lexicographically smallest
- Greedily assign 'z' (26) to rightmost positions when possible
- Leave leftmost positions 'a' (1) to minimize lexicographic value

**Visual:**

```
n=3, k=27
Right to left:
  pos 2: remaining=27, positions_left=3
         can put 'z'? 27 - 26 = 1 ≥ remaining_positions-1=2? 1≥2? No
         actually: put 'z' if k - 26 >= (positions_left - 1) * 1
         27 - 26 = 1, 2*1=2 → 1 < 2, so put 'z'? Yes since 1 leaves 1 for 2 positions?
         Wait: k-val >= positions_remaining-1 means rest can be filled with 'a'(1)
         pos 2: val = min(26, k - (n-1)*1) = min(26, 27-2) = min(26,25) = 25 → 'y'
  pos 1: k=2, n=2: val=min(26,2-1)=1 → 'a'
  pos 0: k=1: val=1 → 'a'
Result: "aay"
```

## Problem Description

The **numeric value** of a string is the sum of its character values (a=1, b=2, ..., z=26). Given `n` (length) and `k` (target numeric value), return the **lexicographically smallest** string of length `n` with numeric value `k`.

**Example 1:** `n=3, k=27` → `"aay"` (1+1+25=27)
**Example 2:** `n=5, k=73` → `"aaszz"` (1+1+19+26+26=73)

**Constraints:** `1 <= n <= 10^5`, `n <= k <= 26*n`

## 📝 Interview Tips

1. **Clarify**: Lexicographically smallest → 'a's at front, large chars at back
2. **Approach**: Build from right; each position gets min(26, k - remaining_positions_left)
3. **Edge cases**: k = n (all 'a'), k = 26\*n (all 'z')
4. **Optimize**: O(n) greedy, no backtracking needed
5. **Follow-up**: What if character values are arbitrary (not a=1..z=26)?
6. **Complexity**: Time O(n), Space O(n)

## Solutions

```typescript
// Solution 1: Greedy Right-to-Left — Time: O(n) | Space: O(n)
function getSmallestString(n: number, k: number): string {
  const result = new Array<string>(n);

  for (let i = n - 1; i >= 0; i--) {
    // Remaining positions before this one (i positions: 0..i-1)
    // Each of those needs at least 1 (='a')
    const minForRest = i; // i positions each needing at least 1
    const val = Math.min(26, k - minForRest);
    result[i] = String.fromCharCode(96 + val); // 'a'=97, val=1..26
    k -= val;
  }

  return result.join("");
}

// Solution 2: Fill Array Greedily — Time: O(n) | Space: O(n)
function getSmallestString2(n: number, k: number): string {
  const chars: string[] = new Array(n).fill("a");
  // Start with all 'a' (total = n), need to distribute (k - n) more
  let remaining = k - n;

  for (let i = n - 1; i >= 0 && remaining > 0; i--) {
    const add = Math.min(25, remaining); // max we can add to 'a' to get up to 'z'
    chars[i] = String.fromCharCode(97 + add);
    remaining -= add;
  }

  return chars.join("");
}

// Solution 3: Math-based chunked fill — Time: O(n) | Space: O(n)
function getSmallestString3(n: number, k: number): string {
  // How many 'z's at the end?
  const zCount = Math.floor((k - n) / 25); // each z contributes 25 extra over 'a'
  const remainder = (k - n) % 25;
  const aCount = n - zCount - (remainder > 0 ? 1 : 0);

  let result = "a".repeat(aCount);
  if (remainder > 0) result += String.fromCharCode(97 + remainder);
  result += "z".repeat(zCount);
  return result;
}

// Tests
console.log(getSmallestString(3, 27)); // "aay"
console.log(getSmallestString(5, 73)); // "aaszz"
console.log(getSmallestString(1, 26)); // "z"
console.log(getSmallestString(3, 3)); // "aaa"
console.log(getSmallestString(2, 52)); // "zz"
```

## 🔗 Related Problems

| Problem                                                                                                                                                   | Relationship                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Lexicographically Smallest String After Applying Operations](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations/) | Greedy lex-order string building |
| [Construct K Palindrome Strings](https://leetcode.com/problems/construct-k-palindrome-strings/)                                                           | Distribute characters greedily   |
| [Minimum Number of Operations to Make String Sorted](https://leetcode.com/problems/minimum-number-of-operations-to-make-string-sorted/)                   | String value optimization        |
