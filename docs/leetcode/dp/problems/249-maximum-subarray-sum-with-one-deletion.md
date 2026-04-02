---
layout: page
title: "Maximum Subarray Sum with One Deletion"
difficulty: Medium
category: DP
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion"
---

# Maximum Subarray Sum with One Deletion / Tổng Mảng Con Lớn Nhất Với Một Lần Xóa

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: State Machine DP
> **Frequency**: 📗 Tier 2 — Gặp ở nhiều companies
> **See also**: [Maximum Subarray](https://leetcode.com/problems/maximum-subarray) | [Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray)

---

## Vietnamese Analogy (Ví dụ thực tế)

Bạn đang chạy xe qua một con đường với các đoạn "lời" (dương) và "lỗ" (âm). Bạn được phép bỏ qua tối đa một đoạn đường xấu nhất. Chiến lược tối ưu: dùng hai trạng thái DP — "chưa dùng quyền xóa" và "đã dùng quyền xóa". Tại mỗi vị trí, bạn quyết định: giữ nguyên đoạn này, hay dùng quyền đặc biệt để bỏ qua nó. Đây là dạng "State Machine DP" kinh điển với 2 trạng thái.

## Visual (Minh họa trực quan)

```
arr = [1, -2, 0, 3]

keep[i] = max subarray ending at i, no deletion used
del[i]  = max subarray ending at i, one deletion used (deleted one element)

i=0: arr[0]=1
  keep[0] = max(1, 1) = 1
  del[0]  = 0  (delete element 0, empty subarray so far)

i=1: arr[1]=-2
  keep[1] = max(-2, keep[0]-2) = max(-2, -1) = -1
  del[1]  = max(del[0]-2, keep[0]) = max(-2, 1) = 1  ← delete this -2

i=2: arr[2]=0
  keep[2] = max(0, keep[1]+0) = max(0, -1) = 0
  del[2]  = max(del[1]+0, keep[1]) = max(1, -1) = 1

i=3: arr[3]=3
  keep[3] = max(3, keep[2]+3) = max(3, 3) = 3
  del[3]  = max(del[2]+3, keep[2]) = max(4, 0) = 4

Answer: max over all keep[i] and del[i] = 4 ✓  (delete -2, subarray [1,0,3]=4)
```

## Problem (Bài toán)

Given an integer array `arr`, return the **maximum sum** of a non-empty subarray with **at most one element deleted**. The subarray must be non-empty after deletion.

**Example 1:** `arr = [1,-2,0,3]` → `4` (delete `-2`, subarray `[1,0,3]`)

**Example 2:** `arr = [1,-2,-2,3]` → `3` (subarray `[3]`)

**Example 3:** `arr = [-1,-1,-1,-1]` → `-1` (must keep at least one element)

**Constraints:** `1 ≤ arr.length ≤ 10^5`, `-10^4 ≤ arr[i] ≤ 10^4`

## Tips (Mẹo phỏng vấn)

- **Two-state DP** / DP hai trạng thái: `keep[i]` (chưa xóa) và `del[i]` (đã xóa 1 phần tử)
- **del[i] transition** / Chuyển trạng thái del: `max(del[i-1] + arr[i], keep[i-1])` — xóa hiện tại hoặc đã xóa trước
- **Base case del** / Cơ sở del: `del[0] = 0` (xóa phần tử đầu tiên → mảng rỗng)
- **Answer** / Kết quả: `max(max(keep), max(del))` — nhưng loại bỏ trường hợp del = 0 chọn mảng rỗng
- **Kadane variant** / Biến thể Kadane: Đây là Kadane mở rộng với state cho phép bỏ 1 phần tử
- **Edge case** / Trường hợp đặc biệt: Mảng toàn âm → phải trả phần tử âm lớn nhất (không xóa hết)

## Solution 1 - O(n) with Extra Arrays

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * keep[i] = max subarray ending at i without deletion
 * del[i]  = max subarray ending at i with exactly one deletion used
 */
function maximumSumBasic(arr: number[]): number {
  const n = arr.length;
  const keep = new Array(n).fill(0);
  const del = new Array(n).fill(0);

  keep[0] = arr[0];
  del[0] = 0; // delete element 0, but must have non-empty result later

  let ans = arr[0];

  for (let i = 1; i < n; i++) {
    keep[i] = Math.max(arr[i], keep[i - 1] + arr[i]);
    del[i] = Math.max(del[i - 1] + arr[i], keep[i - 1]);
    ans = Math.max(ans, keep[i], del[i]);
  }

  return ans;
}
```

## Solution 2 - O(1) Space State Machine (Optimal)

```typescript
/**
 * @complexity Time: O(n) | Space: O(1)
 * Rolling variables: keep = current max subarray sum, del = with one deletion
 */
function maximumSum(arr: number[]): number {
  let keep = arr[0]; // max subarray ending here, no deletion
  let del = 0; // max subarray ending here, one deletion used
  let ans = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const x = arr[i];
    // Order matters: compute del before updating keep
    del = Math.max(del + x, keep); // extend with deletion, or delete x (use keep as prefix)
    keep = Math.max(keep + x, x); // standard Kadane
    ans = Math.max(ans, keep, del);
  }

  return ans;
}
```

## Solution 3 - Prefix + Suffix Max

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * preMax[i] = max subarray ending at i, sufMax[i] = max subarray starting at i
 * For deletion at index k: preMax[k-1] + sufMax[k+1]
 */
function maximumSumPreSuf(arr: number[]): number {
  const n = arr.length;
  const preMax = new Array(n).fill(0);
  const sufMax = new Array(n).fill(0);

  preMax[0] = arr[0];
  for (let i = 1; i < n; i++) preMax[i] = Math.max(arr[i], preMax[i - 1] + arr[i]);

  sufMax[n - 1] = arr[n - 1];
  for (let i = n - 2; i >= 0; i--) sufMax[i] = Math.max(arr[i], sufMax[i + 1] + arr[i]);

  let ans = Math.max(...preMax); // no deletion
  for (let k = 1; k < n - 1; k++) ans = Math.max(ans, preMax[k - 1] + sufMax[k + 1]);
  return ans;
}
```

## Test Cases

```typescript
console.log(maximumSum([1, -2, 0, 3])); // → 4
console.log(maximumSum([1, -2, -2, 3])); // → 3
console.log(maximumSum([-1, -1, -1, -1])); // → -1
console.log(maximumSumBasic([1, -2, 0, 3])); // → 4
console.log(maximumSumPreSuf([1, -2, 0, 3])); // → 4
```

## Related Problems

| Problem                       | Difficulty | Link                                                                  |
| ----------------------------- | ---------- | --------------------------------------------------------------------- |
| Maximum Subarray              | Easy       | [LC 53](https://leetcode.com/problems/maximum-subarray)               |
| Maximum Sum Circular Subarray | Medium     | [LC 918](https://leetcode.com/problems/maximum-sum-circular-subarray) |
| Maximum Subarray Min-Product  | Medium     | [LC 1856](https://leetcode.com/problems/maximum-subarray-min-product) |
