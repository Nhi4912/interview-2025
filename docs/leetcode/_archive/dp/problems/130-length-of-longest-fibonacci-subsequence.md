---
layout: page
title: "Length of Longest Fibonacci Subsequence"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/length-of-longest-fibonacci-subsequence"
---

# Length of Longest Fibonacci Subsequence / Dãy Con Fibonacci Dài Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Amazon

## 🧠 Intuition / Tư Duy

**Analogy:** Như xây dây chuyền kho báu — mỗi viên đá mới phải có giá trị bằng tổng hai viên trước đó. Dùng cặp chỉ số (j,k) để chỉ "dãy dài nhất kết thúc bằng arr[j], arr[k]" và tra cứu phần tử trước trong hash map.

**Pattern Recognition:**

- "Fibonacci-like subsequence in sorted array" → DP[j][k] = length ending at (arr[j], arr[k])
- For each pair (j,k), predecessor is arr[k]-arr[j] — look it up in an index map O(1)
- Array is strictly increasing → predecessor < arr[j] is guaranteed when arr[j] < arr[k]

**Visual:**

```
arr = [1, 2, 3, 4, 5, 6, 7, 8]   indexMap: {1→0, 2→1, 3→2, 4→3, 5→4, 6→5, 7→6, 8→7}

dp[j][k] = length of Fibonacci ending with arr[j], arr[k]:
dp[0][1]=2, dp[1][2]=3(1,2,3), dp[2][4]=4(1,2,3,5), dp[4][7]=5(1,2,3,5,8) ← answer
```

## Problem Description

Given a **strictly increasing** array `arr`, return the length of the longest Fibonacci-like subsequence. A Fibonacci-like subsequence has each element equal to the sum of the previous two elements, and length ≥ 3. Return 0 if none exists.

Examples: [1,2,3,4,5,6,7,8] → 5 (1,2,3,5,8); [1,3,7,11,12,14,18] → 3.

## 📝 Interview Tips

1. **Clarify**: Subsequence (không liên tiếp) chứ không phải subarray / confirm non-contiguous subsequence.
2. **Approach**: dp[j][k] = length ending at (arr[j],arr[k]); tra arr[k]-arr[j] trong indexMap; nếu có ở index i thì dp[j][k]=dp[i][j]+1.
3. **Edge cases**: Không cặp nào thỏa → return 0; cặp chỉ dài 2 không tính (phải ≥ 3).
4. **Optimize**: Dùng 2D Map hoặc mảng 2D (n ≤ 1000 → n² ≤ 10⁶ OK).
5. **Follow-up**: Khôi phục dãy Fibonacci thực tế — backtrack qua bảng dp.
6. **Complexity**: Time O(n²), Space O(n²).

## Solutions

```typescript
/** Solution 1: DP with index map
 * Time: O(n²) | Space: O(n²)
 */
function lenLongestFibSubseq(arr: number[]): number {
  const n = arr.length;
  const indexMap = new Map<number, number>();
  for (let i = 0; i < n; i++) indexMap.set(arr[i], i);

  // dp[j][k] = length of longest Fibonacci ending with arr[j], arr[k]
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(2));
  let ans = 0;

  for (let k = 2; k < n; k++) {
    for (let j = 1; j < k; j++) {
      const need = arr[k] - arr[j];
      if (need >= arr[j]) break; // need < arr[j] for strictly increasing fib
      const i = indexMap.get(need);
      if (i !== undefined) {
        dp[j][k] = dp[i][j] + 1;
        ans = Math.max(ans, dp[j][k]);
      }
    }
  }
  return ans >= 3 ? ans : 0;
}

/** Solution 2: Hash set with greedy extension (simpler, same complexity)
 * For each starting pair (arr[i], arr[j]), greedily extend the Fibonacci sequence
 * Time: O(n² log M) | Space: O(n)  M = max element
 */
function lenLongestFibSubseq2(arr: number[]): number {
  const n = arr.length;
  const numSet = new Set(arr);
  let ans = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let a = arr[i],
        b = arr[j];
      let len = 2;
      while (numSet.has(a + b)) {
        const c = a + b;
        a = b;
        b = c;
        len++;
      }
      if (len >= 3) ans = Math.max(ans, len);
    }
  }
  return ans;
}

// Tests
console.log(lenLongestFibSubseq([1, 2, 3, 4, 5, 6, 7, 8])); // 5
console.log(lenLongestFibSubseq([1, 3, 7, 11, 12, 14, 18])); // 3
console.log(lenLongestFibSubseq([1, 2, 3])); // 3
console.log(lenLongestFibSubseq2([1, 2, 3, 4, 5, 6, 7, 8])); // 5
console.log(lenLongestFibSubseq2([1, 3, 7, 11, 12, 14, 18])); // 3
console.log(lenLongestFibSubseq([2, 4, 7, 8, 9, 10, 14, 15, 18, 23, 32])); // 5
```

## 🔗 Related Problems

| Problem                                                                                        | Relationship                                   |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Longest String Chain](https://leetcode.com/problems/longest-string-chain)                     | DP on pair — length of chain ending at element |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence) | DP keyed on difference instead of pair sum     |
| [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)                             | Classic Fibonacci base problem                 |
