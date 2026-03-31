---
layout: page
title: "Distribute Elements Into Two Arrays I"
difficulty: Easy
category: Array
tags: [Array, Simulation]
leetcode_url: "https://leetcode.com/problems/distribute-elements-into-two-arrays-i"
---

# Distribute Elements Into Two Arrays I / Phân Phối Phần Tử Vào Hai Mảng I

🟢 Easy | 🏷️ Array, Simulation | 🔗 [LeetCode](https://leetcode.com/problems/distribute-elements-into-two-arrays-i)

## 🧠 Intuition / Trực Giác

**Tiếng Việt:** Hãy tưởng tượng hai hàng bài trên bàn. Quy tắc: nếu lá cuối hàng 1 lớn hơn lá cuối hàng 2, bỏ lá mới vào hàng 1; ngược lại thì vào hàng 2. Đơn giản như chia bài!

**English:** Start with arr1=[nums[0]], arr2=[nums[1]]. For each remaining element, compare the last elements: if last(arr1) > last(arr2), append to arr1, otherwise to arr2.

```
nums = [2, 1, 3, 3, 4, 2, 1]
arr1=[2]  arr2=[1]
  2>1 → arr1=[2,3]
  3>1 → arr1=[2,3,3]
  3>1 → arr1=[2,3,3,4]
  4>1 → arr1=[2,3,3,4,2]  ... wait 4>2
         arr2=[1,...]
Result: arr1 + arr2 concatenated
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Initialize arr1=[nums[0]], arr2=[nums[1]] before the loop | **VI:** Luôn khởi tạo 2 phần tử đầu tiên trước vòng lặp
- 🔑 **EN:** "Strictly greater" — equal values go to arr2 | **VI:** "Lớn hơn nghiêm ngặt" — bằng nhau thì vào arr2
- 🔑 **EN:** Result is arr1 concatenated with arr2 in order | **VI:** Kết quả là nối arr1 và arr2 theo thứ tự
- 🔑 **EN:** All elements in nums are distinct (problem guarantee) | **VI:** Mọi phần tử trong nums là khác nhau (đề bảo đảm)
- 🔑 **EN:** Only compare last elements of each array at each step | **VI:** Chỉ so sánh phần tử cuối của mỗi mảng tại mỗi bước
- 🔑 **EN:** O(n) time and O(n) space — can't do better | **VI:** O(n) thời gian và không gian là tối ưu

## Solutions

### Solution 1: Greedy Simulation (Optimal)

```typescript
/**
 * Distribute Elements Into Two Arrays I — Greedy
 * Time: O(n) — single pass through nums
 * Space: O(n) — output arrays arr1 + arr2
 */
function distributeElements(nums: number[]): number[] {
  const arr1: number[] = [nums[0]];
  const arr2: number[] = [nums[1]];

  for (let i = 2; i < nums.length; i++) {
    if (arr1[arr1.length - 1] > arr2[arr2.length - 1]) {
      arr1.push(nums[i]);
    } else {
      arr2.push(nums[i]);
    }
  }

  return [...arr1, ...arr2];
}

console.log(distributeElements([2, 1, 3, 3])); // [2,3,3,1]
console.log(distributeElements([5, 14, 3, 1, 2])); // [5,3,1,14,2]
console.log(distributeElements([3, 1])); // [3,1]
```

### Solution 2: Ternary Operator Variant

```typescript
/**
 * Same logic using ternary for conciseness
 * Time: O(n) | Space: O(n)
 */
function distributeElements2(nums: number[]): number[] {
  const arr1: number[] = [nums[0]];
  const arr2: number[] = [nums[1]];

  for (let i = 2; i < nums.length; i++) {
    const target = arr1[arr1.length - 1] > arr2[arr2.length - 1] ? arr1 : arr2;
    target.push(nums[i]);
  }

  return arr1.concat(arr2);
}

console.log(distributeElements2([2, 1, 3, 3])); // [2,3,3,1]
console.log(distributeElements2([5, 14, 3, 1, 2])); // [5,3,1,14,2]
```

### Solution 3: Reduce Approach

```typescript
/**
 * Using reduce for functional style
 * Time: O(n) | Space: O(n)
 */
function distributeElements3(nums: number[]): number[] {
  const [arr1, arr2] = nums.slice(2).reduce(
    ([a1, a2], v) => {
      if (a1[a1.length - 1] > a2[a2.length - 1]) {
        return [[...a1, v], a2];
      }
      return [a1, [...a2, v]];
    },
    [[nums[0]], [nums[1]]] as [number[], number[]],
  );

  return arr1.concat(arr2);
}

console.log(distributeElements3([2, 1, 3, 3])); // [2,3,3,1]
```

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Pattern      |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Distribute Elements Into Two Arrays II](./161-distribute-elements-into-two-arrays-ii.md)                         | 🔴 Hard    | BIT + Greedy |
| [Partition Array into Disjoint Intervals](https://leetcode.com/problems/partition-array-into-disjoint-intervals/) | 🟡 Medium  | Greedy       |
| [Partition Array for Maximum Sum](https://leetcode.com/problems/partition-array-for-maximum-sum/)                 | 🟡 Medium  | DP           |
