---
layout: page
title: "Sum of Distances"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/sum-of-distances"
---

# Sum of Distances / Tổng Khoảng Cách

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Nhóm các chỉ số theo giá trị. Với mỗi nhóm [p0, p1, p2, ...], tính tổng khoảng cách từ pi đến tất cả pj khác. Dùng prefix sum để tính trong O(k) thay vì O(k²).

**English:** Group indices by their value. For each group, use prefix sums to compute sum of distances in O(k): left distances = k*pos - prefixLeft; right distances = suffixRight - (total-k-1)*pos.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Sum of Distances example:**

```
nums = [1, 3, 1, 1, 2]
Indices for value 1: [0, 2, 3]

For index 0 (k=0): right = (2+3) - 2*0 = 5 → result[0]=5
For index 2 (k=1): left = 1*2-0=2, right = 3-1*2=1 → result[2]=3
For index 3 (k=2): left = 2*3-(0+2)=4 → result[3]=4
```

---

## Problem Description

| Problem                                                                                                             | Difficulty | Pattern    |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)                                 | 🔴 Hard    | Tree DP    |
| [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/) | 🟡 Medium  | Prefix Sum |
| [Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/)                   | 🔴 Hard    | BIT        |

---

## 📝 Interview Tips

- 🔑 **EN:** Group same-value indices using a Map before computing | **VI:** Nhóm chỉ số cùng giá trị bằng Map trước khi tính
- 🔑 **EN:** Positions within a group are already in sorted order (left to right) | **VI:** Các chỉ số trong nhóm đã có thứ tự tăng dần
- 🔑 **EN:** Left contribution at index k: k*pos[k] - prefixSum[0..k-1] | **VI:** Đóng góp trái tại k: k*pos[k] - tổng trước k
- 🔑 **EN:** Right contribution: suffixSum[k+1..] - (total-k-1)_pos[k] | **VI:** Đóng góp phải: tổng sau k - số còn lại _ pos[k]
- 🔑 **EN:** Maintain running prefixSum as you iterate | **VI:** Duy trì prefix sum trong khi duyệt
- 🔑 **EN:** O(n) overall — each index is processed exactly once | **VI:** O(n) tổng cộng — mỗi chỉ số xử lý đúng một lần

---

## Solutions

```typescript
/**
 * Sum of Distances using prefix sums on grouped indices
 * Time: O(n) — one pass to group, one pass to compute
 * Space: O(n) — index groups + result array
 */
function distance(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n).fill(0);
  const groups = new Map<number, number[]>();

  for (let i = 0; i < n; i++) {
    if (!groups.has(nums[i])) groups.set(nums[i], []);
    groups.get(nums[i])!.push(i);
  }

  for (const positions of groups.values()) {
    const m = positions.length;
    const totalSum = positions.reduce((a, b) => a + b, 0);
    let prefixSum = 0;
    let remaining = totalSum;

    for (let k = 0; k < m; k++) {
      const pos = positions[k];
      remaining -= pos; // sum of positions[k+1..m-1]
      // left distances: k elements each at positions[0..k-1]
      const leftDist = k * pos - prefixSum;
      // right distances: (m-1-k) elements at positions[k+1..m-1]
      const rightDist = remaining - (m - 1 - k) * pos;
      result[pos] = leftDist + rightDist;
      prefixSum += pos;
    }
  }

  return result;
}

console.log(distance([1, 3, 1, 1, 2])); // [5,0,3,4,0]
console.log(distance([0, 5, 3])); // [0,0,0]
console.log(distance([1, 1, 1, 1])); // [6,4,4,6]

/**
 * Naive O(n²) — useful for small inputs and verification
 * Time: O(n²) | Space: O(n)
 */
function distanceBrute(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && nums[i] === nums[j]) {
        result[i] += Math.abs(i - j);
      }
    }
  }

  return result;
}

console.log(distanceBrute([1, 3, 1, 1, 2])); // [5,0,3,4,0]

/**
 * Two explicit passes: left contribution, then right contribution
 * Time: O(n) | Space: O(n)
 */
function distance3(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n).fill(0);
  const groups = new Map<number, number[]>();

  for (let i = 0; i < n; i++) {
    if (!groups.has(nums[i])) groups.set(nums[i], []);
    groups.get(nums[i])!.push(i);
  }

  for (const positions of groups.values()) {
    let prefix = 0;
    // Left pass: accumulate distances from left indices
    for (let k = 0; k < positions.length; k++) {
      result[positions[k]] += k * positions[k] - prefix;
      prefix += positions[k];
    }
    let suffix = 0;
    // Right pass: accumulate distances from right indices
    for (let k = positions.length - 1; k >= 0; k--) {
      const rightCount = positions.length - 1 - k;
      result[positions[k]] += suffix - rightCount * positions[k];
      suffix += positions[k];
    }
  }

  return result;
}

console.log(distance3([1, 3, 1, 1, 2])); // [5,0,3,4,0]
```

---

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Pattern    |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)                                 | 🔴 Hard    | Tree DP    |
| [Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/) | 🟡 Medium  | Prefix Sum |
| [Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/)                   | 🔴 Hard    | BIT        |
