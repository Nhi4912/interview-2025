---
layout: page
title: "Maximum Segment Sum After Removals"
difficulty: Hard
category: Array
tags: [Array, Union Find, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/maximum-segment-sum-after-removals"
---

# Maximum Segment Sum After Removals / Tổng Đoạn Lớn Nhất Sau Khi Xóa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find (Reverse Processing)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) | [Number of Islands II](https://leetcode.com/problems/number-of-islands-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như dọn dẹp phòng theo thứ tự ngược — xóa cuối trước, thêm trước sau. Mỗi lần "thêm" một phần tử mới, ta gộp nó với các phần tử liền kề đã tồn tại. Union Find giúp theo dõi tổng từng nhóm liền kề.

**Pattern Recognition:**

- Removals are hard to handle forward (splitting segments); **reverse** them to additions
- When adding an element, merge with alive left/right neighbors using Union Find
- Track sum of each component; answer[i] = max segment sum just BEFORE removal at step i

**Visual — Reverse insertion + Union Find:**

```
nums=[1,2,3,4,5], removeQueries=[3,1,0,2,4]

Process in reverse (add 4→2→0→1→3):
add idx=4: alive={4}, seg={4:5},           maxSeg=5
add idx=2: alive={2,4}, seg={2:3,4:5},     maxSeg=5
add idx=0: alive={0,2,4}, seg={0:1},        maxSeg=5
add idx=1: alive={0,1,2,4}, union(0,1),(1,2) → seg={0:6,4:5}, maxSeg=6
add idx=3: union(2,3),(3,4) → seg={0:6,0+4:?} → max=6+5=11?
  Actually root(2)=0 (sum=6), root(4)=4 (sum=5), merge → sum=11
  But answer[0] (before adding 3) = maxSeg at that point

answers filled in reverse: ans[4]=0, ans[3]=5, ans[2]=5, ans[1]=5, ans[0]=6 → [6,5,5,5,0]
```

---

## Problem Description

Given integer array `nums` and `removeQueries` (a permutation of `[0..n-1]`), after each `removeQueries[i]`, record the maximum sum of any remaining contiguous segment. Return the `answers` array. ([LeetCode 2382](https://leetcode.com/problems/maximum-segment-sum-after-removals))

Difficulty: Hard | Acceptance: 48.4%

```
Example 1: nums=[1,2,3,4,5], removeQueries=[3,1,0,2,4] → [14,7,2,2,0]
Example 2: nums=[3,2,1],     removeQueries=[0,2,1]       → [5,1,0]
```

Constraints:

- `n == nums.length == removeQueries.length`
- `1 <= n <= 10^5`
- `1 <= nums[i] <= 10^9`
- `removeQueries` is a permutation of `[0..n-1]`

---

## 📝 Interview Tips

1. **Key reversal**: "Xóa khó, thêm dễ → xử lý ngược" / Deletions split segments; insertions merge them — reverse the order
2. **Union Find with sum**: "Lưu tổng theo root của component" / Augment Union Find to track segment sum per root
3. **Neighbor check**: "Khi thêm i, kiểm tra i-1 và i+1 có tồn tại không" / Check alive[i-1] and alive[i+1] before merging
4. **Max tracking**: "Cập nhật maxSeg sau mỗi merge" / Update global max after each union operation
5. **Fill answers backward**: "ans[q[n-1-i]] = max trước khi add" / Fill answer array in reverse order of queries
6. **Follow-up**: "Prefix sum approach works for O(n log n) with sorted set" / Ordered set of active segments is alternative

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — recompute max segment after each removal
 * Time: O(n²) — scan all remaining elements for each query
 * Space: O(n) — alive set
 */
function maximumSegmentSumAfterRemovalsBrute(nums: number[], removeQueries: number[]): number[] {
  const n = nums.length;
  const alive = new Array(n).fill(true);
  const ans: number[] = [];

  for (const q of removeQueries) {
    alive[q] = false;
    let curSum = 0;
    let maxSum = 0;
    for (let i = 0; i < n; i++) {
      if (alive[i]) {
        curSum += nums[i];
        maxSum = Math.max(maxSum, curSum);
      } else {
        curSum = 0;
      }
    }
    ans.push(maxSum);
  }
  return ans;
}

/**
 * Solution 2: Reverse Processing + Union Find
 * Time: O(n · α(n)) — nearly O(n) with path compression
 * Space: O(n) — union find arrays + alive set
 */
function maximumSegmentSumAfterRemovals(nums: number[], removeQueries: number[]): number[] {
  const n = nums.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const segSum = [...nums.map(BigInt)]; // use BigInt for large sums
  const alive = new Array(n).fill(false);
  const ans = new Array(n).fill(0);
  let globalMax = BigInt(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    // Merge smaller into larger (by index for determinism)
    parent[rb] = ra;
    segSum[ra] += segSum[rb];
    if (segSum[ra] > globalMax) globalMax = segSum[ra];
  }

  // Process removals in reverse → additions
  for (let i = n - 1; i >= 0; i--) {
    const idx = removeQueries[i];
    alive[idx] = true;
    // The segment containing idx starts as just nums[idx]
    if (segSum[idx] > globalMax) globalMax = segSum[idx];

    // Merge with left neighbor if alive
    if (idx > 0 && alive[idx - 1]) union(idx, idx - 1);
    // Merge with right neighbor if alive
    if (idx < n - 1 && alive[idx + 1]) union(idx, idx + 1);

    // ans[i] = maxSeg just AFTER adding removeQueries[i] (which is BEFORE the i-th removal)
    ans[i] = Number(globalMax);
  }

  // ans[0] = state after 0 removals... wait, we need ans[i] = state AFTER removal i
  // ans[n-1] = 0 (all removed), ans[i] is AFTER removeQueries[0..i] removed
  // Our loop fills ans[i] as "max when removeQueries[i] was just added back"
  // That means: ans[i] is max JUST BEFORE removeQueries[i] was removed in forward direction
  // Shift: result[i] = ans[i+1], result[n-1] = 0
  const result = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) result[i] = ans[i + 1];
  result[n - 1] = 0;
  return result;
}

// === Test Cases ===
console.log(maximumSegmentSumAfterRemovals([1, 2, 3, 4, 5], [3, 1, 0, 2, 4])); // [14,7,2,2,0]
console.log(maximumSegmentSumAfterRemovals([3, 2, 1], [0, 2, 1])); // [5,1,0]
console.log(maximumSegmentSumAfterRemovals([1], [0])); // [0]
```

---

## 🔗 Related Problems

- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — same pattern: Union Find
- [Number of Islands II](https://leetcode.com/problems/number-of-islands-ii) — same pattern: Online Union Find
- [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) — Prefix Sum
- [Maximum Segment Sum After Removals — LeetCode](https://leetcode.com/problems/maximum-segment-sum-after-removals) — problem page
