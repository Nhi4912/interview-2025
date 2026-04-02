---
layout: page
title: "Check if There is a Valid Partition For The Array"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/check-if-there-is-a-valid-partition-for-the-array"
---

# Check if There is a Valid Partition For The Array / Kiểm Tra Phân Hoạch Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Boolean DP (look-back 2 or 3)

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Giống bài leo cầu thang nhưng kiểm tra xem ta có thể "đặt chân" tại vị trí `i` hay không. Từ vị trí `i`, nhìn lại 2 hoặc 3 bước và kiểm tra điều kiện phân đoạn.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Check if There is a Valid Partition For The Array example:**

```
nums = [4, 4, 4, 5, 6]
         0  1  2  3  4

dp[i] = can we partition nums[0..i-1] validly?
dp[0] = true  (empty prefix — base case)

dp[2]: check pair   nums[0..1] = [4,4] → equal pair ✓
       dp[2] |= dp[0] && (4==4)  → true

dp[3]: check pair   nums[1..2] = [4,4] → equal pair ✓
       dp[3] |= dp[1] && (4==4) → dp[1]=false
       check triple nums[0..2] = [4,4,4] → three equal ✓
       dp[3] |= dp[0] && (4==4==4) → true

dp[4]: check pair   nums[2..3] = [4,5] → not equal ✗
       check triple nums[1..3] = [4,4,5] → not all equal, not consecutive ✗
       dp[4] remains false

dp[5]: check pair   nums[3..4] = [5,6] → not equal ✗
       check triple nums[2..4] = [4,5,6] → consecutive ✓
       dp[5] |= dp[2] && true → true  ← ANSWER
```

---

## Problem Description

| #    | Title                      | Difficulty | Connection                               |
| ---- | -------------------------- | ---------- | ---------------------------------------- |
| 91   | Decode Ways                | 🟡 Medium  | Boolean DP looking back 1 or 2 positions |
| 132  | Palindrome Partitioning II | 🔴 Hard    | Partition into valid segments DP         |
| 1105 | Filling Bookcase Shelves   | 🟡 Medium  | Partition rows with constraint           |
| 279  | Perfect Squares            | 🟡 Medium  | Partition into valid subsets             |

---

## 📝 Interview Tips

- 🔑 **EN:** `dp[i]` = can we partition `nums[0..i-1]`; `dp[0] = true` (empty) | **VI:** `dp[0] = true` là trường hợp cơ sở: mảng rỗng luôn hợp lệ
- 🔑 **EN:** Three ways to extend: pair of equal, triple of equal, triple of consecutive | **VI:** 3 quy tắc: 2 bằng nhau, 3 bằng nhau, 3 liên tiếp tăng dần
- 🔑 **EN:** Only look back 2 or 3 positions → O(n) time, O(n) space (or O(1) with 3 booleans) | **VI:** Chỉ cần lưu `dp[i-2]` và `dp[i-3]`, không cần mảng đầy đủ
- 🔑 **EN:** Consecutive means `a+1==b && b+1==c` — strictly increasing by 1 | **VI:** Liên tiếp nghĩa là tăng đúng 1 đơn vị mỗi bước
- 🔑 **EN:** Early termination: if `dp[n]` becomes true, can return immediately | **VI:** Dừng sớm khi `dp[n]` đã `true`
- 🔑 **EN:** Space-optimise: only 3 previous boolean values needed | **VI:** Chỉ cần 3 giá trị boolean trước đó — tối ưu O(1) space

---

## Solutions

```typescript
// ─── Solution 1: Boolean DP Array — O(n) time, O(n) space ─────────────────
function validPartitionArray(nums: number[]): boolean {
  const n = nums.length;
  // dp[i] = true if nums[0..i-1] can be validly partitioned
  const dp = new Array(n + 1).fill(false);
  dp[0] = true; // empty prefix is valid

  for (let i = 2; i <= n; i++) {
    const a = nums[i - 2],
      b = nums[i - 1];

    // Rule 1: pair of two equal elements
    if (dp[i - 2] && a === b) {
      dp[i] = true;
    }

    if (i >= 3) {
      const c = nums[i - 3];
      // Rule 2: triple of three equal elements
      if (dp[i - 3] && c === a && a === b) dp[i] = true;
      // Rule 3: triple of three consecutive elements
      if (dp[i - 3] && c + 1 === a && a + 1 === b) dp[i] = true;
    }
  }

  return dp[n];
}

// ─── Solution 2: O(1) Space — rolling 3 booleans ──────────────────────────
function validPartition(nums: number[]): boolean {
  const n = nums.length;
  if (n < 2) return false;

  // p0 = dp[i-3], p1 = dp[i-2], p2 = dp[i-1], cur = dp[i]
  let p0 = false,
    p1 = false,
    p2 = true; // p2 = dp[0] = true

  for (let i = 2; i <= n; i++) {
    const a = nums[i - 3] ?? 0;
    const b = nums[i - 2];
    const c = nums[i - 1];

    let cur = false;
    // Rule 1: pair [b, c]
    if (p1 && b === c) cur = true;
    // Rule 2: triple [a, b, c] all equal
    if (i >= 3 && p0 && a === b && b === c) cur = true;
    // Rule 3: triple [a, b, c] consecutive
    if (i >= 3 && p0 && a + 1 === b && b + 1 === c) cur = true;

    p0 = p1;
    p1 = p2;
    p2 = cur;
  }

  return p2;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(validPartition([4, 4, 4, 5, 6])); // true  ([4,4],[4,5,6])
console.log(validPartition([1, 1, 1, 2])); // false
console.log(validPartition([1, 1, 2, 2, 3, 3])); // true  ([1,1],[2,2],[3,3])
console.log(validPartitionArray([4, 4, 4, 5, 6])); // true
console.log(validPartitionArray([1, 1, 1, 2])); // false
```

---

## 🔗 Related Problems

| #    | Title                      | Difficulty | Connection                               |
| ---- | -------------------------- | ---------- | ---------------------------------------- |
| 91   | Decode Ways                | 🟡 Medium  | Boolean DP looking back 1 or 2 positions |
| 132  | Palindrome Partitioning II | 🔴 Hard    | Partition into valid segments DP         |
| 1105 | Filling Bookcase Shelves   | 🟡 Medium  | Partition rows with constraint           |
| 279  | Perfect Squares            | 🟡 Medium  | Partition into valid subsets             |
