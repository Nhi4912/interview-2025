---
layout: page
title: "Max Number of K-Sum Pairs"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/max-number-of-k-sum-pairs"
---

# Max Number of K-Sum Pairs / Số Cặp Tổng K Tối Đa

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Find the maximum number of pairs (i, j) where nums[i] + nums[j] = k and each element used at most once. **Two approaches:** Sort + two pointers (O(n log n)) or HashMap complement counting (O(n)).

**VI:** Tìm số cặp (i, j) tối đa sao cho nums[i] + nums[j] = k, mỗi phần tử dùng tối đa một lần. **Hai cách:** Sắp xếp + hai con trỏ O(n log n) hoặc HashMap đếm bổ sung O(n).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Max Number of K-Sum Pairs example:**

```
nums = [1, 2, 3, 4]  k = 5

Two-pointer after sort:
  [1, 2, 3, 4]
   lo        hi   → 1+4=5 ✓ pair! lo++, hi--, count=1
      lo   hi     → 2+3=5 ✓ pair! lo++, hi--, count=2
  lo > hi → done
  Answer: 2

HashMap approach:
  Process 1: need 4, freq={1:1}
  Process 2: need 3, freq={1:1,2:1}
  Process 3: need 2, freq has 2! pair! count=1, freq={1:1}
  Process 4: need 1, freq has 1! pair! count=2, freq={}
  Answer: 2
```

---

---

## Problem Description

| #   | Problem                                          | Difficulty | Pattern               |
| --- | ------------------------------------------------ | ---------- | --------------------- |
| 1   | Two Sum                                          | 🟢 Easy    | hashmap complement    |
| 2   | 3Sum                                             | 🟡 Medium  | two-pointer extension |
| 3   | Count Number of Pairs With Absolute Difference K | 🟢 Easy    | frequency counting    |

---

## 📝 Interview Tips

- 🔍 **EN:** Two-pointer approach: sort first, then lo pointer from left, hi from right. Sum > k → hi--; Sum < k → lo++; Sum = k → count++, move both. **VI:** Two-pointer: sắp xếp, lo từ trái, hi từ phải. Tổng > k → hi--; tổng < k → lo++; tổng = k → đếm, di chuyển cả hai.
- 🗺️ **EN:** HashMap approach: for each number, check if complement (k - num) exists in map. If yes, decrement and count. If no, add to map. **VI:** HashMap: với mỗi số, kiểm tra bổ sung (k-num) trong map. Nếu có → giảm đếm và tăng count. Nếu không → thêm vào map.
- ⚡ **EN:** HashMap is O(n) time vs O(n log n) for sort+two-pointer — but two-pointer uses O(1) extra space. **VI:** HashMap O(n) so với O(n log n) sắp xếp — nhưng two-pointer dùng O(1) không gian.
- ✅ **EN:** Each element can only be used once — HashMap naturally handles this with frequency counts. **VI:** Mỗi phần tử chỉ dùng một lần — HashMap xử lý tự nhiên bằng đếm tần suất.
- ⚠️ **EN:** Edge case: k is even and nums contains duplicates of k/2. HashMap correctly counts pairs: floor(count/2). **VI:** Trường hợp k chẵn với nhiều k/2 giống nhau: HashMap đếm đúng floor(count/2) cặp.
- 🧮 **EN:** Sort approach modifies the array in-place — if that's undesired, sort a copy. **VI:** Cách sắp xếp thay đổi mảng gốc — nếu không muốn, sắp xếp bản sao.

---

---

## Solutions

```typescript
/**
 * Sort array, then use two pointers to find pairs summing to k.
 * Time: O(n log n)  Space: O(1)
 */
function maxOperations(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  let lo = 0,
    hi = nums.length - 1,
    count = 0;

  while (lo < hi) {
    const sum = nums[lo] + nums[hi];
    if (sum === k) {
      count++;
      lo++;
      hi--;
    } else if (sum < k) {
      lo++;
    } else {
      hi--;
    }
  }
  return count;
}

// Tests
console.log(maxOperations([1, 2, 3, 4], 5)); // 2
console.log(maxOperations([3, 1, 3, 4, 3], 6)); // 1
console.log(maxOperations([1, 1, 1, 1], 2)); // 2  (two pairs of 1+1)
console.log(maxOperations([2, 5, 4, 4, 1, 3, 4, 4, 1, 4, 4, 1, 2], 3)); // 3

/**
 * For each element, check if complement (k - num) is in frequency map.
 * Time: O(n)  Space: O(n)
 */
function maxOperations2(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  let count = 0;

  for (const num of nums) {
    const complement = k - num;
    const compFreq = freq.get(complement) ?? 0;
    if (compFreq > 0) {
      count++;
      // "consume" the complement
      if (compFreq === 1) freq.delete(complement);
      else freq.set(complement, compFreq - 1);
    } else {
      freq.set(num, (freq.get(num) ?? 0) + 1);
    }
  }
  return count;
}

// Tests
console.log(maxOperations2([1, 2, 3, 4], 5)); // 2
console.log(maxOperations2([3, 1, 3, 4, 3], 6)); // 1
console.log(maxOperations2([1, 1, 1, 1], 2)); // 2

/**
 * Count all frequencies first, then compute pairs per value.
 * Time: O(n)  Space: O(n)
 */
function maxOperations3(nums: number[], k: number): number {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

  let count = 0;
  const visited = new Set<number>();

  for (const [v, f] of freq) {
    if (visited.has(v)) continue;
    const comp = k - v;
    if (comp === v) {
      // Pair of same value: floor(f/2) pairs
      count += Math.floor(f / 2);
    } else if (freq.has(comp)) {
      count += Math.min(f, freq.get(comp)!);
      visited.add(comp);
    }
    visited.add(v);
  }
  return count;
}

// Tests
console.log(maxOperations3([1, 2, 3, 4], 5)); // 2
console.log(maxOperations3([1, 1, 1, 1], 2)); // 2
console.log(maxOperations3([3, 1, 3, 4, 3], 6)); // 1

// Cross-verify all three solutions
const arr = [2, 5, 4, 4, 1, 3, 4, 4, 1, 4, 4, 1, 2];
const kk = 3;
console.log(
  maxOperations([...arr], kk),
  maxOperations2([...arr], kk),
  maxOperations3([...arr], kk),
); // 3 3 3
```

---

## 🔗 Related Problems

| #   | Problem                                          | Difficulty | Pattern               |
| --- | ------------------------------------------------ | ---------- | --------------------- |
| 1   | Two Sum                                          | 🟢 Easy    | hashmap complement    |
| 2   | 3Sum                                             | 🟡 Medium  | two-pointer extension |
| 3   | Count Number of Pairs With Absolute Difference K | 🟢 Easy    | frequency counting    |
