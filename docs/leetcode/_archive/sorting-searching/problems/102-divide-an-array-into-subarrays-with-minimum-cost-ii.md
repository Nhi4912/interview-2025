---
layout: page
title: "Divide an Array Into Subarrays With Minimum Cost II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Sliding Window, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-ii"
---

# Divide an Array Into Subarrays With Minimum Cost II / Chia Mảng Thành Các Mảng Con Với Chi Phí Tối Thiểu II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Two Sorted Sets
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Hãy tưởng tượng bạn di chuyển một cửa sổ qua dãy phần tử. Bạn cần luôn biết **(k-1) phần tử nhỏ nhất** trong cửa sổ đó. Dùng hai heap (lower/upper) giống Sliding Window Median — lower giữ k-1 phần tử nhỏ nhất, upper giữ phần còn lại.

**Pattern Recognition:**

- Fixed window [i, i+dist] sliding across array[1..n-1]
- Need sum of (k-1) smallest in window → two SortedSets (lower/upper heap)
- "Maintain k smallest in sliding window" → classic two-set pattern

**Visual:**

```
nums=[1,3,2,4,5], k=2, dist=3
Window over nums[1..]: [3,2,4], [2,4,5]

Window [3,2,4]: k-1=1 smallest = {2}, cost = nums[0]+2 = 1+2 = 3
Window [2,4,5]: k-1=1 smallest = {2}, cost = 1+2 = 3
Answer = min costs = 3 ✅
```

## Problem Description

Given `nums[0..n-1]`, split into exactly `k` non-empty subarrays. The **cost** is the sum of the first elements of each subarray. The subarrays must each have length at most `dist` (i.e., split points are within distance `dist` of each other). Return minimum total cost. Constraints: `3 ≤ k ≤ n ≤ 10^5`, `k-1 ≤ dist ≤ n-1`, `1 ≤ nums[i] ≤ 10^9`.

**Example 1:** `nums=[1,3,2,4,5]`, `k=2`, `dist=3` → `4`
**Example 2:** `nums=[10,1,2,2,2,1]`, `k=4`, `dist=3` → `15`

## 📝 Interview Tips

1. **Clarify**: "dist" là khoảng cách tối đa giữa hai điểm chia liên tiếp? / dist is max gap between consecutive split points?
2. **Approach**: nums[0] luôn là phần tử đầu tiên; cần chọn k-1 split trong window size dist / nums[0] always included; pick k-1 splits in window
3. **Edge cases**: k=2 chỉ cần 1 split; dist=n-1 nghĩa là không giới hạn / k=2 needs just 1 split
4. **Optimize**: Two sorted structures (lower/upper multiset) để track k-1 smallest in O(log n) per slide / Two heaps for O(log n)
5. **Test**: Trace manually với example nhỏ để kiểm tra sliding boundary / Trace small examples for boundary
6. **Follow-up**: Nếu không có dist constraint? → chỉ cần k-1 smallest trong toàn bộ nums[1..] / Without dist → global k-1 smallest

## Solutions

```typescript
/** Solution 1: Sliding Window + Two Sorted Maps (simulate multiset)
 * Time: O(n log k) | Space: O(n)
 */
function minimumCost(nums: number[], k: number, dist: number): number {
  // We need sum of (k-1) smallest in sliding window nums[1..dist] → nums[1..dist+1]
  // Window of size dist over indices [1, n-1]
  const n = nums.length;

  // Simulate sorted multiset with two maps: lower (k-1 smallest), upper (rest)
  const lower = new Map<number, number>(); // k-1 smallest, sorted desc by key
  const upper = new Map<number, number>(); // rest, sorted asc by key

  let lowerSum = 0;
  let lowerSize = 0;

  const addToMap = (map: Map<number, number>, val: number) => {
    map.set(val, (map.get(val) ?? 0) + 1);
  };
  const removeFromMap = (map: Map<number, number>, val: number) => {
    const cnt = map.get(val)!;
    if (cnt === 1) map.delete(val);
    else map.set(val, cnt - 1);
  };
  const lowerMax = () => Math.max(...lower.keys());
  const upperMin = () => Math.min(...upper.keys());

  const addLower = (val: number) => {
    addToMap(lower, val);
    lowerSum += val;
    lowerSize++;
  };
  const addUpper = (val: number) => addToMap(upper, val);

  const balance = () => {
    // ensure lower has exactly k-1 elements, lower.max <= upper.min
    while (lowerSize > k - 1) {
      const mx = lowerMax();
      removeFromMap(lower, mx);
      lowerSum -= mx;
      lowerSize--;
      addToMap(upper, mx);
    }
    while (lowerSize < k - 1 && upper.size > 0) {
      const mn = upperMin();
      removeFromMap(upper, mn);
      addToMap(lower, mn);
      lowerSum += mn;
      lowerSize++;
    }
    // fix ordering
    if (lower.size > 0 && upper.size > 0) {
      const lmax = lowerMax(),
        umin = upperMin();
      if (lmax > umin) {
        removeFromMap(lower, lmax);
        lowerSum -= lmax;
        lowerSize--;
        removeFromMap(upper, umin);
        addToMap(lower, umin);
        lowerSum += umin;
        lowerSize++;
        addToMap(upper, lmax);
      }
    }
  };

  // Initialize window nums[1..dist]
  for (let i = 1; i <= dist; i++) {
    addLower(nums[i]);
    balance();
  }

  let ans = nums[0] + lowerSum;

  for (let i = dist + 1; i < n; i++) {
    // Add nums[i], remove nums[i - dist]
    const incoming = nums[i];
    const outgoing = nums[i - dist];

    addLower(incoming);
    balance();

    // Remove outgoing
    if (lower.has(outgoing)) {
      removeFromMap(lower, outgoing);
      lowerSum -= outgoing;
      lowerSize--;
    } else {
      removeFromMap(upper, outgoing);
    }
    balance();

    ans = Math.min(ans, nums[0] + lowerSum);
  }

  return ans;
}

/** Solution 2: Brute Force (small inputs only)
 * Time: O(n^k) | Space: O(k)
 */
function minimumCostBrute(nums: number[], k: number, dist: number): number {
  const n = nums.length;
  let ans = Infinity;

  const dfs = (idx: number, splits: number, cost: number, lastSplit: number) => {
    if (splits === k - 1) {
      ans = Math.min(ans, cost);
      return;
    }
    for (let i = idx; i < n && i <= lastSplit + dist; i++) {
      dfs(i + 1, splits + 1, cost + nums[i], i);
    }
  };

  dfs(1, 0, nums[0], 0);
  return ans;
}

// Test cases
console.log(minimumCost([1, 3, 2, 4, 5], 2, 3)); // 4
console.log(minimumCost([10, 1, 2, 2, 2, 1], 4, 3)); // 15
console.log(minimumCostBrute([1, 3, 2, 4, 5], 2, 3)); // 4
```

## 🔗 Related Problems

| Problem                                                                                                                      | Relationship                                       |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Sliding Window Median](https://leetcode.com/problems/sliding-window-median)                                                 | Same two-heap pattern to maintain sorted window    |
| [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) | Sliding window over multiple arrays with heap      |
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream)                                   | Two-heap (lower/upper) to track median dynamically |
