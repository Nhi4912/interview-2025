---
layout: page
title: "Smallest Missing Non-negative Integer After Operations"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations"
---

# Smallest Missing Non-negative Integer After Operations / Số Nguyên Không Âm Nhỏ Nhất Bị Thiếu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy + Modular Arithmetic
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống phân loại học sinh vào lớp theo số thứ tự — mỗi học sinh có thể đứng ở vị trí mod value của mình. Tham lam gán từ vị trí nhỏ nhất trước: nếu đủ người cho vị trí 0, 1, 2, ... thì MEX mới lớn hơn.

**Pattern Recognition:**

- Signal: "add/subtract value repeatedly", "find MEX" → **Modular Arithmetic + Greedy**
- nums[i] ± k\*value: phần dư `nums[i] % value` không đổi. Mỗi phần tử có thể đạt mọi số ≥ 0 có cùng remainder
- Key insight: count[r] = số phần tử có remainder r. Duyệt target 0,1,2,...: target % value có đủ count không?

**Visual — nums=[1,-10,7,13,6], value=4:**

```
Remainders (mod 4, non-negative): 1%4=1, (-10+12)%4=2, 7%4=3, 13%4=1, 6%4=2
count = {1:2, 2:2, 3:1}

target=0: 0%4=0 → count[0]=0 → MEX=0? No wait count[0]=0 → can't cover 0
Answer = 0

Another: nums=[1,2,3,4], value=1 → all remainders=0 → count[0]=4
target=0: 0%1=0, count[0]-- →3; target=1: 1%1=0, count[0]-- →2; ...→ MEX=4
```

---

## Problem Description

Given an integer array `nums` and a positive integer `value`. In one operation, add or subtract `value` from any `nums[i]`. You can apply any number of operations to each element. Return the **smallest non-negative integer** not present in `nums` after operations.

- Example 1: `nums=[1,-10,7,13,6], value=4` → `4`
- Example 2: `nums=[1,2,3,4], value=1` → `5`

Constraints: `1 <= nums.length <= 10^5`, `-10^9 <= nums[i] <= 10^9`, `1 <= value <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Số lần operation không giới hạn? Có thể âm?" / Unlimited ops, values can be negative
2. **Key insight**: "nums[i] ± k\*value → remainder (mod value) không thay đổi!" / Remainder is invariant
3. **Normalize**: "Remainder có thể âm trong JS/TS → dùng ((x % v) + v) % v" / Handle negative modulo
4. **Greedy scan**: "Duyệt target 0,1,2,...: cần count[target%value] > 0, rồi giảm count đi 1" / Greedy MEX scan
5. **Edge cases**: "value=1 → tất cả elements có thể là bất kỳ số nào → MEX = nums.length + số phủ" / All remainders 0
6. **Follow-up**: "Nếu cần k MEX values?" / Find k-th missing — extend the greedy loop

---

## Solutions

```typescript
/**
 * Solution 1: Count remainders, greedy MEX scan
 * Time: O(n + MEX) — MEX ≤ n so effectively O(n)
 * Space: O(value) — count map bounded by value distinct remainders
 */
function findSmallestInteger(nums: number[], value: number): number {
  // Count how many elements have each remainder (0..value-1)
  const count = new Map<number, number>();
  for (const x of nums) {
    const r = ((x % value) + value) % value; // handle negative modulo
    count.set(r, (count.get(r) ?? 0) + 1);
  }

  // Greedily assign targets 0, 1, 2, ... using available elements
  let mex = 0;
  while (true) {
    const r = mex % value;
    const cnt = count.get(r) ?? 0;
    if (cnt === 0) break; // can't cover this target → it's the MEX
    count.set(r, cnt - 1);
    mex++;
  }
  return mex;
}

/**
 * Solution 2: Array-based counting (faster for small value)
 * Time: O(n) — fixed-size array for counting
 * Space: O(value) — array of size value
 */
function findSmallestIntegerArray(nums: number[], value: number): number {
  const count = new Array(value).fill(0);
  for (const x of nums) {
    count[((x % value) + value) % value]++;
  }

  let mex = 0;
  while (count[mex % value] > 0) {
    count[mex % value]--;
    mex++;
  }
  return mex;
}

// === Test Cases ===
console.log(findSmallestInteger([1, -10, 7, 13, 6], 4)); // 4
console.log(findSmallestInteger([1, 2, 3, 4], 1)); // 5
console.log(findSmallestInteger([0], 1)); // 1
console.log(findSmallestInteger([-5, -3, -1], 2)); // 2
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — find smallest missing in [0..n]
- [First Missing Positive](https://leetcode.com/problems/first-missing-positive) — MEX for positive integers
- [Smallest Missing Non-negative Integer](https://leetcode.com/problems/smallest-missing-non-negative-integer) — direct MEX without operations
- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — greedy grouping by remainder
