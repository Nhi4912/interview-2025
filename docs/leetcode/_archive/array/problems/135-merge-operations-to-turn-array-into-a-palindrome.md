---
layout: page
title: "Merge Operations to Turn Array Into a Palindrome"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Greedy]
leetcode_url: "https://leetcode.com/problems/merge-operations-to-turn-array-into-a-palindrome"
---

# Merge Operations to Turn Array Into a Palindrome / Gộp Phần Tử Để Tạo Mảng Palindrome

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers + Greedy
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng hai người đứng ở hai đầu một chiếc cầu, bước vào giữa. Nếu hai người có cùng "trọng lượng" thì cả hai bước vào. Nếu người bên trái nhẹ hơn, họ kéo người kề bên trái vào nhóm (merge) cho đến khi bằng bên phải. Greedy: luôn "gộp" phía nhẹ hơn — đây là cách tối thiểu số thao tác.

**Pattern Recognition:**

- "Make palindrome by merging adjacent" → Two pointers from both ends
- Always merge the smaller side to match the larger → Greedy
- `arr[l] < arr[r]` → merge left with next; `arr[l] > arr[r]` → merge right with prev

**Visual:**

```
nums = [4, 3, 2, 1, 2, 3, 1]
  L=0(4) R=6(1): 4 > 1 → merge right: R stays at 6, arr[6]=1+3=4...
  wait, merge means add arr[r-1] to arr[r]? No — merge adjacent toward center.

  arr = [4, 3, 2, 1, 2, 3, 1], l=0, r=6
  arr[0]=4, arr[6]=1 → 4>1 → merge arr[5]+arr[6]=3+1=4, ops++ → r=5
  arr = [4, 3, 2, 1, 2, 4], l=0, r=5
  arr[0]=4, arr[5]=4 → equal → l=1, r=4
  arr[1]=3, arr[4]=2 → 3>2 → merge arr[3]+arr[4]=1+2=3, ops++ → r=3
  arr = [4, 3, 2, 3, 4], l=1, r=3
  arr[1]=3, arr[3]=3 → equal → l=2, r=2 → done
→ ops = 2
```

## Problem Description

Given `nums`, in one operation you can merge two **adjacent** elements (replace with their sum). Return the **minimum** number of operations to make `nums` a palindrome.

- `[4,3,2,1,2,3,1]` → `2`
- `[1,2,3,4]` → `3`
- `[1]` → `0`

## 📝 Interview Tips

1. **Clarify**: Merging replaces two adjacent with their sum — array gets shorter / gộp 2 kề thành 1 phần tử
2. **Approach**: Two pointers, always merge the smaller side to match larger / hai con trỏ, gộp bên nhỏ hơn
3. **Edge cases**: Already palindrome → 0 ops / single element → 0 / đã palindrome rồi → 0 thao tác
4. **Optimize**: Greedy proof: merging smaller side never increases operations needed / chứng minh greedy tối ưu
5. **Follow-up**: What if cost of merge is proportional to sum? → DP approach / nếu chi phí tỉ lệ với tổng
6. **Complexity**: Time O(n), Space O(n) for working copy / thời gian O(n), không gian O(n)

## Solutions

```typescript
/** Solution 1: Two Pointers + Greedy — merge smaller side
 * Time: O(n) | Space: O(n) for working array
 */
function minimumOperations(nums: number[]): number {
  const arr = [...nums];
  let l = 0,
    r = arr.length - 1;
  let ops = 0;

  while (l < r) {
    if (arr[l] === arr[r]) {
      l++;
      r--;
    } else if (arr[l] < arr[r]) {
      // Merge arr[l] with arr[l+1]
      arr[l + 1] += arr[l];
      l++;
      ops++;
    } else {
      // arr[l] > arr[r]: merge arr[r] with arr[r-1]
      arr[r - 1] += arr[r];
      r--;
      ops++;
    }
  }
  return ops;
}

/** Solution 2: Two Pointers without modifying array — use accumulator vars
 * Time: O(n) | Space: O(1)
 */
function minimumOperationsO1(nums: number[]): number {
  let l = 0,
    r = nums.length - 1;
  let left = nums[l],
    right = nums[r];
  let ops = 0;

  while (l < r) {
    if (left === right) {
      l++;
      r--;
      if (l < r) {
        left = nums[l];
        right = nums[r];
      }
    } else if (left < right) {
      l++;
      left += nums[l]; // absorb next left element
      ops++;
    } else {
      r--;
      right += nums[r]; // absorb next right element
      ops++;
    }
  }
  return ops;
}

/** Solution 3: Recursive (conceptual clarity)
 * Time: O(n) | Space: O(n) call stack
 */
function minimumOperationsRecursive(nums: number[]): number {
  const solve = (arr: number[], l: number, r: number): number => {
    if (l >= r) return 0;
    if (arr[l] === arr[r]) return solve(arr, l + 1, r - 1);
    if (arr[l] < arr[r]) {
      arr[l + 1] += arr[l];
      return 1 + solve(arr, l + 1, r);
    } else {
      arr[r - 1] += arr[r];
      return 1 + solve(arr, l, r - 1);
    }
  };
  return solve([...nums], 0, nums.length - 1);
}

// Test cases
console.log(minimumOperations([4, 3, 2, 1, 2, 3, 1])); // 2
console.log(minimumOperations([1, 2, 3, 4])); // 3
console.log(minimumOperations([1])); // 0
console.log(minimumOperations([1, 2, 1])); // 0
console.log(minimumOperationsO1([4, 3, 2, 1, 2, 3, 1])); // 2
console.log(minimumOperationsRecursive([1, 2, 3, 4])); // 3
```

## 🔗 Related Problems

| Problem                                                                                                                           | Relationship                               |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Boats to Save People](https://leetcode.com/problems/boats-to-save-people)                                                        | Two pointers greedy on sorted array        |
| [Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii)                                                          | Check palindrome with one deletion allowed |
| [Minimum Insertions to Make String Palindrome](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome) | Same goal, string version uses DP          |
