---
layout: page
title: "Count Alternating Subarrays"
difficulty: Medium
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/count-alternating-subarrays"
---

# Count Alternating Subarrays / Đếm Mảng Con Xen Kẽ

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Một mảng con là "xen kẽ" nếu các phần tử liên tiếp có tính chẵn-lẻ khác nhau. Tại mỗi vị trí i, nếu nums[i] và nums[i-1] có tính chẵn-lẻ khác nhau thì kéo dài chuỗi; ngược lại reset về 1. Số mảng con xen kẽ kết thúc tại i = chiều dài chuỗi hiện tại.

**English:** Track the current alternating run length. At each position i: if parity differs from prev, extend run by 1; else reset to 1. Subarrays ending at i = run length. Sum all run lengths.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Alternating Subarrays example:**

```
nums = [0, 1, 1, 0]

i=0: run=1  → subarrays ending here: [0]           total=1
i=1: 0≠1 → run=2  → [0,1],[1]                     total=3
i=2: 1==1 → run=1  → [1]                           total=4
i=3: 1≠0 → run=2  → [1,0],[0]                     total=6

Answer: 6
```

---

## Problem Description

| Problem                                                                                               | Difficulty | Pattern        |
| ----------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Longest Alternating Subarray](https://leetcode.com/problems/longest-alternating-subarray/)           | 🟢 Easy    | Run Length     |
| [Number of Alternating Groups](https://leetcode.com/problems/number-of-alternating-groups/)           | 🟢 Easy    | Sliding Window |
| [Count Subarrays with Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) | 🔴 Hard    | Two Pointer    |

---

## 📝 Interview Tips

- 🔑 **EN:** Key insight: number of alternating subarrays ending at i = current run length | **VI:** Nhận xét chính: số mảng con xen kẽ kết thúc tại i = độ dài chuỗi hiện tại
- 🔑 **EN:** "Different parity" = nums[i] % 2 !== nums[i-1] % 2 | **VI:** "Khác chẵn lẻ" = nums[i] % 2 !== nums[i-1] % 2
- 🔑 **EN:** Reset run to 1 (not 0) when parity matches — single element always alternates | **VI:** Reset về 1 (không phải 0) khi cùng chẵn lẻ — đơn phần tử luôn là xen kẽ
- 🔑 **EN:** Answer can exceed 32-bit int — use BigInt or verify max value fits | **VI:** Đáp án có thể vượt 32-bit int — dùng BigInt hoặc kiểm tra giá trị tối đa
- 🔑 **EN:** O(n) time and O(1) space — optimal | **VI:** O(n) thời gian và O(1) không gian — tối ưu
- 🔑 **EN:** Subarrays of length 1 are always alternating (all single elements count) | **VI:** Mảng con độ dài 1 luôn là xen kẽ (mọi phần tử đơn đều tính)

---

## Solutions

```typescript
/**
 * Count Alternating Subarrays via run-length tracking
 * Time: O(n) — single pass
 * Space: O(1) — only track current run length
 */
function countAlternatingSubarrays(nums: number[]): number {
  let result = 0;
  let run = 1; // every single element is an alternating subarray

  result += run;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] % 2 !== nums[i - 1] % 2) {
      run++; // extend alternating run
    } else {
      run = 1; // reset: new run starts at i
    }
    result += run;
  }

  return result;
}

console.log(countAlternatingSubarrays([0, 1, 1, 0])); // 6
console.log(countAlternatingSubarrays([1, 0, 1, 0])); // 10
console.log(countAlternatingSubarrays([1, 1, 1])); // 3
console.log(countAlternatingSubarrays([0])); // 1

/**
 * Identify full runs, then use sum formula n*(n+1)/2 per run
 * Time: O(n) | Space: O(1)
 */
function countAlternatingSubarrays2(nums: number[]): number {
  let total = 0;
  let runLen = 1;

  for (let i = 1; i <= nums.length; i++) {
    const continues = i < nums.length && nums[i] % 2 !== nums[i - 1] % 2;
    if (continues) {
      runLen++;
    } else {
      // Sum of 1+2+...+runLen = runLen*(runLen+1)/2
      total += (runLen * (runLen + 1)) / 2;
      runLen = 1;
    }
  }

  return total;
}

console.log(countAlternatingSubarrays2([0, 1, 1, 0])); // 6
console.log(countAlternatingSubarrays2([1, 0, 1, 0])); // 10
console.log(countAlternatingSubarrays2([1, 1, 1])); // 3

/**
 * Use XOR to check parity change: (a ^ b) & 1 === 1 means different parity
 * Time: O(n) | Space: O(1)
 */
function countAlternatingSubarrays3(nums: number[]): number {
  let ans = 1;
  let run = 1;

  for (let i = 1; i < nums.length; i++) {
    // XOR of two numbers is odd iff they have different parity
    if ((nums[i] ^ nums[i - 1]) & 1) {
      run++;
    } else {
      run = 1;
    }
    ans += run;
  }

  return ans;
}

console.log(countAlternatingSubarrays3([0, 1, 1, 0])); // 6
console.log(countAlternatingSubarrays3([1, 0, 1, 0])); // 10
```

---

## 🔗 Related Problems

| Problem                                                                                               | Difficulty | Pattern        |
| ----------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Longest Alternating Subarray](https://leetcode.com/problems/longest-alternating-subarray/)           | 🟢 Easy    | Run Length     |
| [Number of Alternating Groups](https://leetcode.com/problems/number-of-alternating-groups/)           | 🟢 Easy    | Sliding Window |
| [Count Subarrays with Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) | 🔴 Hard    | Two Pointer    |
