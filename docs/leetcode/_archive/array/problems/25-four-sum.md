---
layout: page
title: "4Sum"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/4sum/"
---

# 4Sum / Tổng Bốn Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers (nested)
> **Frequency**: 📘 Tier 3 — Gặp ở interview để test khả năng generalize k-Sum pattern
> **See also**: [3Sum](./12-3sum.md) | [3Sum Closest](./24-three-sum-closest.md) | [Two Sum](./04-two-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** 3Sum đã fix một phần tử rồi dùng two pointers. 4Sum chỉ cần thêm một vòng lặp ngoài nữa — fix hai phần tử đầu, rồi two pointers cho hai phần tử còn lại. Cùng pattern, thêm một lớp.

**Pattern Recognition:**

- Signal: "4 phần tử", "unique quadruplets" → **Sort + 2 nested loops + Two Pointers**
- Cùng cấu trúc với 3Sum: thêm một `for j` bên ngoài `for i`, skip duplicates ở mỗi level
- **k-Sum generalization**: đệ quy, mỗi lần fix một phần tử, gọi lại với k-1; base case là 2Sum

**Visual:**

```
nums = [1,0,-1,0,-2,2], target = 0
sorted: [-2,-1,0,0,1,2]

Fix i=0(-2), j=1(-1): need 3 from rest [0,0,1,2]
  L=2(0) R=5(2): 0+2=2 < 3 → L++
  L=3(0) R=5(2): 0+2=2 < 3 → L++
  L=4(1) R=5(2): 1+2=3 == 3 → [-2,-1,1,2] ✓

Fix i=0(-2), j=2(0): need 2 from rest [0,1,2]
  L=3(0) R=5(2): 0+2=2 == 2 → [-2,0,0,2] ✓

Fix i=1(-1), j=2(0): need 1 from rest [0,1,2]
  L=3(0) R=5(2): 0+2=2 > 1 → R--
  L=3(0) R=4(1): 0+1=1 == 1 → [-1,0,0,1] ✓
```

---

## Problem Description

**LeetCode #18.** Return all unique quadruplets `[a,b,c,d]` from `nums` such that `a+b+c+d == target`.

```
Example 1: nums=[1,0,-1,0,-2,2], target=0  →  [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
Example 2: nums=[2,2,2,2,2],     target=8  →  [[2,2,2,2]]
```

Constraints: `1 <= n <= 200`, `-10^9 <= nums[i] <= 10^9`, `-10^9 <= target <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Có thể dùng cùng index hai lần không?" — No, distinct indices required
2. **Brute force**: 4 vòng lặp lồng O(n⁴) + Set deduplicate → mention nhưng không code
3. **Optimize**: Sort + fix 2 pointers outer + two pointers inner = O(n³). Skip dups ở cả 4 level
4. **Integer overflow**: `nums[i]` đến 10⁹, tổng 4 số = 4×10⁹ > 32-bit int → TypeScript dùng 64-bit float, OK; Java/C++ cần `long`
5. **Generalize ngay**: "k-Sum?" → đệ quy, base case là 2Sum with two pointers — interviewer thích nghe điều này
6. **Early exit**: Nếu `minPossible > target` → break; `maxPossible < target` → continue (skip i/j iterations)

---

## Solutions

```typescript
/**

- Solution 1: Sort + Two Pointers (Standard)
-
- Fix i and j with nested loops (skip duplicates at each level).
- Two pointers on remaining subarray for the last two elements.
-
- Time: O(n³) — O(n log n) sort + O(n³) triple sweep
- Space: O(1) excluding result
  */
  function fourSum(nums: number[], target: number): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  const n = nums.length;

for (let i = 0; i < n - 3; i++) {
if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dup i
// Early exit: min/max possible sums for this i
if (nums[i] + nums[i+1] + nums[i+2] + nums[i+3] > target) break;
if (nums[i] + nums[n-3] + nums[n-2] + nums[n-1] < target) continue;

    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;  // skip dup j
      if (nums[i] + nums[j] + nums[j+1] + nums[j+2] > target) break;
      if (nums[i] + nums[j] + nums[n-2] + nums[n-1] < target) continue;

      let left = j + 1, right = n - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++; right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }

}

return result;
}

/**

- Solution 2: Recursive k-Sum (Generalizable pattern)
-
- Reduces any k-Sum to (k-1)-Sum. Base case: 2Sum with two pointers.
- Demonstrates the pattern clearly for follow-up questions.
-
- Time: O(n^(k-1)) = O(n³) for k=4, Space: O(k) recursion depth
  */
  function fourSumGeneral(nums: number[], target: number): number[][] {
  nums.sort((a, b) => a - b);
  return kSum(nums, target, 4, 0);
  }

function kSum(nums: number[], target: number, k: number, start: number): number[][] {
const result: number[][] = [];
if (k === 2) { // base case: two pointers
let left = start, right = nums.length - 1;
while (left < right) {
const sum = nums[left] + nums[right];
if (sum === target) {
result.push([nums[left], nums[right]]);
while (left < right && nums[left] === nums[left + 1]) left++;
while (left < right && nums[right] === nums[right - 1]) right--;
left++; right--;
} else if (sum < target) left++;
else right--;
}
return result;
}
for (let i = start; i <= nums.length - k; i++) {
if (i > start && nums[i] === nums[i - 1]) continue;
for (const sub of kSum(nums, target - nums[i], k - 1, i + 1)) {
result.push([nums[i], ...sub]);
}
}
return result;
}

// === Test Cases ===
console.log(JSON.stringify(fourSum([1, 0, -1, 0, -2, 2], 0)));
// [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
console.log(JSON.stringify(fourSum([2, 2, 2, 2, 2], 8)));
// [[2,2,2,2]]
console.log(JSON.stringify(fourSum([], 0)));
// []
```

---

## 🔗 Related Problems

- [3Sum](./12-3sum.md) — bản 3 phần tử, cùng Sort + Two Pointers pattern
- [3Sum Closest](./24-three-sum-closest.md) — biến thể tìm gần nhất thay vì chính xác
- [Two Sum](./04-two-sum.md) — base case của k-Sum với HashMap
- [4Sum II (LC 454)](https://leetcode.com/problems/4sum-ii/) — 4 mảng riêng biệt, dùng HashMap O(n²)
