---
layout: page
title: "Find the Longest Valid Obstacle Course at Each Position"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Binary Indexed Tree]
leetcode_url: "https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position"
---

# Find the Longest Valid Obstacle Course at Each Position / Đường Đua Chướng Ngại Vật Dài Nhất Tại Mỗi Vị Trí

> **Track**: Sorting-Searching | **Difficulty**: 🔴 Hard | **Pattern**: LIS + Binary Search
> **Frequency**: ★★☆ Occasional — LIS variant, gặp ở Google, Amazon
> **See also**: [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang xây dựng một đường đua chướng ngại vật. Mỗi chướng ngại vật có độ cao khác nhau, và quy tắc là mỗi chướng ngại vật sau phải cao bằng hoặc cao hơn cái trước. Tại mỗi vị trí i, bạn muốn biết đường đua dài nhất kết thúc tại vị trí đó. Đây là LIS (Longest Increasing Subsequence) variant với điều kiện non-decreasing — và ta dùng binary search trên mảng "tails" để tìm vị trí chèn tối ưu trong O(log n).

**Pattern Recognition:**

- Signal: "for each position, longest subsequence ending here" + "non-decreasing" → **LIS + Binary Search (upper_bound)**
- Bài này thuộc dạng LIS variant — thay vì strictly increasing, dùng non-decreasing (upper_bound thay vì lower_bound)
- Key insight: Duy trì mảng `tails[]` — `tails[i]` là phần tử nhỏ nhất kết thúc LIS độ dài `i+1`

**Visual — Binary search on tails example:**

```
obstacles = [3, 1, 5, 6, 4, 2]

i=0: val=3, tails=[]    → append 3   → tails=[3],     ans[0]=1
i=1: val=1, tails=[3]   → replace 3  → tails=[1],     ans[1]=1
i=2: val=5, tails=[1]   → append 5   → tails=[1,5],   ans[2]=2
i=3: val=6, tails=[1,5] → append 6   → tails=[1,5,6], ans[3]=3
i=4: val=4, tails=[1,5,6]→ replace 5 → tails=[1,4,6], ans[4]=2
i=5: val=2, tails=[1,4,6]→ replace 4 → tails=[1,2,6], ans[5]=2

Result: [1,1,2,3,2,2]
```

---

## Problem Description

You want to run the obstacle course at the local park. The `i-th` obstacle has a height of `obstacles[i]`. For every index `i`, find the length of the longest obstacle course such that obstacles are non-decreasing and the last obstacle is `obstacles[i]`. ([LeetCode](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position))

```
Example 1: obstacles=[1,2,3,2]  → [1,2,3,3]
Example 2: obstacles=[2,2,1]    → [1,2,1]
```

Constraints: `1 <= obstacles.length <= 10^5`, `1 <= obstacles[i] <= 10^7`

---

## 📝 Interview Tips

1. **Recognize as LIS variant with non-decreasing** — _Đây là LIS nhưng không cần strictly increasing, dùng upper_bound thay lower_bound_
2. **Tails array: tails[i] = smallest tail of LIS with length i+1** — _Mảng tails giúp binary search để chèn/cập nhật_
3. **Use upper bound (rightmost insertion) for ≤ condition** — _Non-decreasing dùng upper_bound: tìm vị trí đầu tiên > val_
4. **Answer for index i = insertion position + 1** — _Vị trí chèn trong tails chính là độ dài LIS kết thúc tại i_
5. **Don't confuse with strictly increasing LIS** — _Strictly increasing dùng lower_bound (first ≥ val), non-decreasing dùng upper_bound (first > val)_
6. **Time O(n log n), Space O(n)** — _Mảng tails tối đa n phần tử, mỗi phần tử binary search O(log n)_

---

## Solutions

```typescript
/** Solution 1: Brute Force O(n²) @complexity Time: O(n²) | Space: O(n) */
function longestObstacleCourseAtEachPositionBrute(obstacles: number[]): number[] {
  const n = obstacles.length;
  const ans = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (obstacles[j] <= obstacles[i]) {
        ans[i] = Math.max(ans[i], ans[j] + 1);
      }
    }
  }
  return ans;
}

/** Solution 2: LIS + Binary Search (patience sort variant) @complexity Time: O(n log n) | Space: O(n) */
function longestObstacleCourseAtEachPosition(obstacles: number[]): number[] {
  const n = obstacles.length;
  const ans = new Array(n).fill(0);
  const tails: number[] = []; // tails[i] = smallest tail of non-decreasing subseq of length i+1

  // Upper bound: find first index in tails where tails[idx] > val
  const upperBound = (val: number): number => {
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] <= val) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  for (let i = 0; i < n; i++) {
    const pos = upperBound(obstacles[i]);
    ans[i] = pos + 1; // length of longest course ending at i
    if (pos === tails.length) tails.push(obstacles[i]);
    else tails[pos] = obstacles[i];
  }

  return ans;
}

// === Test Cases ===
console.log(longestObstacleCourseAtEachPosition([1, 2, 3, 2]).toString()); // "1,2,3,3"
console.log(longestObstacleCourseAtEachPosition([2, 2, 1]).toString()); // "1,2,1"
console.log(longestObstacleCourseAtEachPosition([3, 1, 5, 6, 4, 2]).toString()); // "1,1,2,3,2,2"
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                             | Difficulty | Pattern            |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| 1   | [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)                     | Medium     | Binary Search / DP |
| 2   | [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)           | Hard       | BIT / Merge Sort   |
| 3   | [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                                     | Hard       | LIS                |
| 4   | [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/) | Hard       | BIT                |
