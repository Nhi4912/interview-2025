---
layout: page
title: "Minimum Operations to Collect Elements"
difficulty: Easy
category: Array
tags: [Array, Hash Table, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-collect-elements"
---

# Minimum Operations to Collect Elements / Số Thao Tác Tối Thiểu Để Thu Thập Phần Tử

🟢 Easy | Array · Hash Table · Bit Manipulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn cần thu thập tất cả các số từ 1 đến k. Bạn chỉ có thể lấy từ **cuối mảng** (pop từ đuôi). Hỏi cần pop tối thiểu bao nhiêu lần? Quét từ phải sang trái, đánh dấu những gì đã thu thập được.

```
nums = [3,1,5,2,4], k=4
Collect from end:
  pop 4 → {4} missing {1,2,3}
  pop 2 → {4,2} missing {1,3}
  pop 5 → {4,2} skip (>k)
  pop 1 → {4,2,1} missing {3}
  pop 3 → {4,2,1,3} ✓ all collected!
Ops = 5 (popped 5 times)
```

## Problem Description

Given array `nums` and integer `k`, remove elements from the **end** one at a time. Return the minimum number of operations needed to collect all values `1, 2, ..., k`.

- **Example 1**: `nums = [3,1,5,2,4], k = 4` → `5`
- **Example 2**: `nums = [1,3,2], k = 2` → `3` (need to get 1 and 2, 1 is at index 0)

## 📝 Interview Tips

- 💡 **Scan from end / Quét từ cuối**: We always pop from end — scan right to left / luôn lấy từ đuôi, quét từ phải sang trái
- 🔍 **Skip >k values / Bỏ qua >k**: Elements greater than k don't help, but still cost an operation / lớn hơn k không giúp nhưng vẫn tốn thao tác
- ⚠️ **Bit mask trick / Trick bit mask**: Use bitmask to track collected {1..k} → done when mask === (1<<k)-1 / dùng bitmask để kiểm tra hoàn thành
- 🧮 **O(n) scan / Quét O(n)**: Single right-to-left pass / một lượt từ phải sang trái
- 📊 **Set alternative / Dùng Set**: Set<number> also works, check size === k / Set cũng được
- 🎯 **Early termination / Dừng sớm**: Stop as soon as all 1..k are in set / dừng ngay khi đủ

## Solutions

### Solution 1: Set + Right-to-Left Scan (Clear)

```typescript
/**
 * Collect elements from end until {1..k} is complete
 * Time: O(n) | Space: O(k)
 */
function minOperations(nums: number[], k: number): number {
  const collected = new Set<number>();
  for (let i = nums.length - 1; i >= 0; i--) {
    const val = nums[i];
    if (val <= k) collected.add(val);
    if (collected.size === k) {
      return nums.length - i; // number of elements removed from end
    }
  }
  return nums.length; // should always find all in valid input
}

// Tests
console.log(minOperations([3, 1, 5, 2, 4], 4)); // 5
console.log(minOperations([1, 3, 2], 2)); // 3
console.log(minOperations([1], 1)); // 1
console.log(minOperations([2, 1, 5, 3, 6], 3)); // 4
```

### Solution 2: Bitmask Approach

```typescript
/**
 * Use bitmask for O(1) complete-check
 * Time: O(n) | Space: O(1)
 */
function minOperationsBitmask(nums: number[], k: number): number {
  const target = (1 << k) - 1; // bits 1..k set
  let mask = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    const val = nums[i];
    if (val <= k) mask |= 1 << (val - 1);
    if (mask === target) {
      return nums.length - i;
    }
  }
  return nums.length;
}

// Tests
console.log(minOperationsBitmask([3, 1, 5, 2, 4], 4)); // 5
console.log(minOperationsBitmask([1, 3, 2], 2)); // 3
console.log(minOperationsBitmask([1], 1)); // 1
```

### Solution 3: Explicit pop simulation

```typescript
/**
 * Simulate popping from end explicitly
 * Time: O(n) | Space: O(k)
 */
function minOperationsSimulate(nums: number[], k: number): number {
  const arr = [...nums];
  const needed = new Set(Array.from({ length: k }, (_, i) => i + 1));
  let ops = 0;
  while (needed.size > 0) {
    const val = arr.pop()!;
    ops++;
    needed.delete(val);
  }
  return ops;
}

// Tests
console.log(minOperationsSimulate([3, 1, 5, 2, 4], 4)); // 5
console.log(minOperationsSimulate([1, 3, 2], 2)); // 3
```

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Tags       |
| ---- | -------------------------------------- | ---------- | ---------- |
| 1832 | Check if the Sentence Is Pangram       | Easy       | Hash Table |
| 2554 | Maximum Number of Integers to Choose   | Medium     | Hash Table |
| 2574 | Left and Right Sum Differences         | Easy       | Array      |
| 2869 | Minimum Operations to Collect Elements | Easy       | Array      |
