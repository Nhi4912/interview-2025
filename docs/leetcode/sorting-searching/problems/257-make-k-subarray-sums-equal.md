---
layout: page
title: "Make K-Subarray Sums Equal"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Greedy, Sorting, Number Theory]
leetcode_url: "https://leetcode.com/problems/make-k-subarray-sums-equal"
---

# Make K-Subarray Sums Equal / Làm Tổng K Mảng Con Bằng Nhau

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Number Theory + Median Minimization
> **Frequency**: ★★☆ Occasional — kết hợp GCD và tối ưu hoá chi phí
> **See also**: [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một vòng quay chia theo múi giờ. Nếu mảng có chu kỳ k trên vòng tròn, những phần tử ở cùng "múi giờ" (cách nhau GCD(n,k) vị trí) phải bằng nhau để tổng mọi cửa sổ k phần tử liên tiếp bằng nhau. Trong từng nhóm vị trí đồng dư, chi phí tối thiểu để làm tất cả giá trị bằng nhau chính là tổng độ lệch tuyệt đối so với **trung vị** — đây là định lý nổi tiếng trong tối ưu hoá L1.

**Pattern Recognition:**

- Signal: "circular array" + "all k-length subarray sums equal" → **GCD grouping + Median minimization**
- Bài này thuộc dạng Number Theory: các phần tử index đồng dư mod GCD(n,k) phải có giá trị bằng nhau
- Key insight: Nếu sum của mọi cửa sổ độ dài k bằng nhau → arr[i] == arr[(i+k) % n] → chu kỳ là GCD(n, k)

**Visual — GCD cycle grouping:**

```
arr=[1,4,2,3], k=2, n=4, g=GCD(4,2)=2

Group 0 (i mod g = 0): indices [0,2] → values [1,2]
Group 1 (i mod g = 1): indices [1,3] → values [4,3]

Group 0 sorted: [1,2] → median=1 (or 2), cost = |1-1|+|2-1| = 1
               or median=2 cost = |1-2|+|2-2| = 1
Group 1 sorted: [3,4] → median=3, cost = |4-3|+|3-3| = 1

Total = 1 + 1 = 2
```

---

## Problem Description

Given a circular integer array `arr` and integer `k`, return the **minimum number of operations** to make the sum of every subarray of length `k` equal. In one operation you can increase or decrease an element by 1. ([LeetCode](https://leetcode.com/problems/make-k-subarray-sums-equal))

```
Example 1: arr=[1,4,2,3], k=2  → 1
Example 2: arr=[2,5,5,7], k=3  → 5
```

Constraints: `1 <= arr.length <= 10^5`, `1 <= arr[i] <= 10^9`, `1 <= k <= arr.length`

---

## 📝 Interview Tips

1. **Key equation: arr[i] == arr[(i+k)%n]** — _Nếu mọi cửa sổ k bằng nhau thì arr[i] phải bằng arr[(i+k)%n]_
2. **Group indices by (i mod GCD(n, k))** — _Các phần tử cùng nhóm GCD phải có cùng giá trị cuối cùng_
3. **Median minimizes L1 cost** — _Trong mỗi nhóm, chọn giá trị mục tiêu là trung vị để tối thiểu tổng |diff|_
4. **Sort each group separately** — _Sắp xếp từng nhóm để tìm trung vị dễ dàng_
5. **Don't forget circular indexing** — _Mảng vòng tròn: dùng % n khi duyệt các chu kỳ_
6. **Time O(n log n), Space O(n)** — _Phần tốn kém nhất là sắp xếp các nhóm_

---

## Solutions

```typescript
/** Solution 1: GCD + Median @complexity Time: O(n log n) | Space: O(n) */
function makeSubKSumEqual(arr: number[], k: number): number {
  const n = arr.length;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(n, k);

  let totalCost = 0;

  // Each group has indices: start, start+g, start+2g, ... (mod n)
  const visited = new Uint8Array(n);
  for (let start = 0; start < g; start++) {
    if (visited[start]) continue;
    const group: number[] = [];
    let idx = start;
    while (!visited[idx]) {
      visited[idx] = 1;
      group.push(arr[idx]);
      idx = (idx + k) % n;
    }
    group.sort((a, b) => a - b);
    const median = group[Math.floor(group.length / 2)];
    for (const v of group) totalCost += Math.abs(v - median);
  }

  return totalCost;
}

/** Solution 2: Same logic, cleaner group building @complexity Time: O(n log n) | Space: O(n) */
function makeSubKSumEqual2(arr: number[], k: number): number {
  const n = arr.length;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(n, k);

  let cost = 0;
  for (let r = 0; r < g; r++) {
    // Collect all elements in this residue class under step k
    const group: number[] = [];
    for (let i = r; i < n; i += g) group.push(arr[i]);
    group.sort((a, b) => a - b);
    const med = group[group.length >> 1];
    for (const v of group) cost += Math.abs(v - med);
  }
  return cost;
}

// === Test Cases ===
console.log(makeSubKSumEqual([1, 4, 2, 3], 2)); // 1
console.log(makeSubKSumEqual([2, 5, 5, 7], 3)); // 5
console.log(makeSubKSumEqual([1, 1, 1], 1)); // 0
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                                       | Difficulty | Pattern                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| 1   | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/)                                           | Hard       | Median / Ternary Search |
| 2   | [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/)                           | Medium     | Median                  |
| 3   | [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array/)                                                         | Medium     | Binary Search           |
| 4   | [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | Hard       | Sliding Window          |
