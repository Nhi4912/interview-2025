---
layout: page
title: "Minimum Cost Tree From Leaf Values"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Stack, Greedy, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/minimum-cost-tree-from-leaf-values"
---

# Minimum Cost Tree From Leaf Values / Cây Chi Phí Tối Thiểu Từ Giá Trị Lá

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack / Interval DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống như ghép cặp học sinh vào nhóm — học sinh nhỏ nhất trong dãy phải "hy sinh" (tạo node cha), và nên ghép với người nhỏ hơn trong hai hàng xóm. Stack đơn điệu giảm giúp biết ngay khi nào cần ghép.

**Pattern Recognition:**

- Signal: "binary tree internal node = max(left)\*max(right), minimize total" → Monotonic stack greedy
- The smallest leaf should be paired with the smaller of its two neighbors to minimize cost
- Decreasing monotonic stack: pop when we find a larger element

**Visual:**

```
arr = [6, 2, 4]
stack = [Inf]
push 6: [Inf, 6]
push 2: 6 > 2, push: [Inf, 6, 2]
see 4: pop 2 (smaller), cost += 2*min(6,4) = 2*4 = 8. [Inf, 6]
        6 > 4, push: [Inf, 6, 4]
end: pop 4, cost += 4*6 = 24. Total = 32 ✓
```

## Problem Description

Given `arr` of leaf values, build a binary tree with minimum sum of all internal nodes, where each internal node = `max(left subtree) * max(right subtree)`.

- Example 1: `arr = [6,2,4]` → `32`
- Example 2: `arr = [4,11]` → `44`
- Constraints: `2 ≤ arr.length ≤ 40`, `1 ≤ arr[i] ≤ 15`

## 📝 Interview Tips

1. **Clarify**: Cây phải đúng thứ tự in-order như arr? / Must the leaves appear in order (yes — in-order traversal gives arr)
2. **Approach**: Monotonic stack O(n) hoặc interval DP O(n³) / Start with DP then optimize to stack
3. **Edge cases**: arr.length = 2 → one internal node = arr[0] \* arr[1]; all equal values
4. **Optimize**: Stack greedy: always eliminate the smallest element by pairing with min neighbor
5. **Test**: [6,2,4] → 32; [4,11] → 44
6. **Follow-up**: What if internal node = min(left)\*min(right)?

## Solutions

```typescript
/** Solution 1: Greedy with Monotonic Decreasing Stack
 * Time: O(n) | Space: O(n)
 * Key: always merge the smallest value with its smaller neighbor
 */
function mctFromLeafValues(arr: number[]): number {
  const stack: number[] = [Infinity]; // sentinel
  let res = 0;

  for (const x of arr) {
    // While top of stack is ≤ x, we must merge it (it's surrounded by larger values)
    while (stack[stack.length - 1] <= x) {
      const mid = stack.pop()!;
      // Pair 'mid' with the smaller of its two neighbors
      res += mid * Math.min(stack[stack.length - 1], x);
    }
    stack.push(x);
  }

  // Clean up remaining stack (each needs to merge with its right neighbor)
  while (stack.length > 2) {
    res += stack.pop()! * stack[stack.length - 1];
  }

  return res;
}

/** Solution 2: Interval DP
 * Time: O(n^3) | Space: O(n^2)
 * dp[i][j] = min cost to merge arr[i..j] into one node
 * maxLeaf[i][j] = max leaf value in arr[i..j]
 */
function mctFromLeafValues2(arr: number[]): number {
  const n = arr.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const maxLeaf: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Precompute max leaf in each range
  for (let i = 0; i < n; i++) {
    maxLeaf[i][i] = arr[i];
    for (let j = i + 1; j < n; j++) {
      maxLeaf[i][j] = Math.max(maxLeaf[i][j - 1], arr[j]);
    }
  }

  // Fill DP by increasing interval length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid++) {
        const cost = dp[i][mid] + dp[mid + 1][j] + maxLeaf[i][mid] * maxLeaf[mid + 1][j];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }

  return dp[0][n - 1];
}

// Tests
console.log(mctFromLeafValues([6, 2, 4])); // 32
console.log(mctFromLeafValues([4, 11])); // 44
console.log(mctFromLeafValues([1, 1])); // 1
console.log(mctFromLeafValues2([6, 2, 4])); // 32
console.log(mctFromLeafValues2([4, 11])); // 44
```

## 🔗 Related Problems

| Problem                                                                                                                                     | Relationship                  |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons)                                                                              | Interval DP with product cost |
| [Remove Boxes](https://leetcode.com/problems/remove-boxes)                                                                                  | Interval DP variant           |
| [Minimum Number of Increments on Subarrays](https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array) | Monotonic stack on array      |
