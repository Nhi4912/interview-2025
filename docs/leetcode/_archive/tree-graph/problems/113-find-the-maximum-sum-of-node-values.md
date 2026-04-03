---
layout: page
title: "Find the Maximum Sum of Node Values"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Greedy, Bit Manipulation, Tree]
leetcode_url: "https://leetcode.com/problems/find-the-maximum-sum-of-node-values"
---

# Find the Maximum Sum of Node Values / Tổng Giá Trị Node Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy + XOR Parity
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có thể hoán đổi trạng thái hai node trên cùng một cạnh bằng cách XOR cả hai với k. Điểm mấu chốt: khi áp dụng XOR dọc một đường đi từ u đến v, tất cả node trung gian bị XOR hai lần (= không đổi). Kết quả là: **mỗi thao tác chỉ XOR đúng 2 node bất kỳ** trong cây. Vì vậy ta chỉ cần tìm tập con kích thước **chẵn** của các node sao cho tổng `gain[i] = (nums[i] ^ k) - nums[i]` lớn nhất.

**Pattern Recognition:**

- Signal: "XOR on tree edges, maximize sum" → **Greedy với XOR parity**
- Key insight: XOR dọc path triệt tiêu trung gian → chọn bất kỳ số chẵn node
- Sắp xếp gains giảm dần, lấy các cặp dương là xong

**Visual — XOR Parity on Tree:**

```
nums=[1,2,1], k=3, edges=[[0,1],[0,2]]

gains = [(1^3)-1, (2^3)-2, (1^3)-1]
       = [3-1,    1-2,     3-1    ]
       = [2,      -1,       2     ]

sorted desc: [2, 2, -1]
Take pair (2,2): sum=4 > 0 ✓
Skip -1 (odd, can't take alone)

result = (1+2+1) + 4 = 8? Wait: 1+2+1=4, gains_taken=4, answer=4+4=8
Hmm: XOR nodes 0 and 2 → [1^3, 2, 1^3] = [2, 2, 2] → sum=6 ✓

Wait let me recheck: gains=[2,-1,2], take pair (2,2)=4
result = original_sum + taken_gains = 4 + 4 = 8? But max sum = 6.
Ah: gain means DELTA. original_sum=4, taking gains 2+2=4 → new_sum=4+4=8?
But nums after XOR = [2,2,2]=6. Something off.

Actually: gain[i]=(nums[i]^k)-nums[i]. gain[0]=(1^3)-1=2, gain[2]=(1^3)-1=2
new_sum = 1+2+(1^3)=1+2+2=5? No: we XOR nodes 0 AND 2.
new nums = [1^3, 2, 1^3] = [2,2,2], sum=6.
original=4, delta=+2, but gains[0]+gains[2]=2+2=4. 4+4=8 ≠ 6.

BUG IN MY EXAMPLE — let me recheck gains:
nums[0]=1, k=3: 1^3 = 1 XOR 3 = 01 XOR 11 = 10 = 2. gain[0]=2-1=1.
nums[1]=2, k=3: 2^3 = 10 XOR 11 = 01 = 1. gain[1]=1-2=-1.
nums[2]=1, k=3: same as nums[0]. gain[2]=1.
gains=[1,-1,1], sorted=[1,1,-1].
Take pair(1,1)=2>0. result=4+2=6 ✓ Correct!
```

---

## Problem Description

Tree with `n` nodes and values `nums`. Integer `k`. Operation: pick any edge `(u,v)`, XOR both `nums[u]` and `nums[v]` with `k`. Perform **any number of operations** to **maximize the total sum** of all node values.

- `2 ≤ n ≤ 2×10^4`, `1 ≤ nums[i] ≤ 10^9`, `1 ≤ k ≤ 10^9`

```
Example 1: nums=[1,2,1], k=3, edges=[[0,1],[0,2]] → 6
  XOR nodes 0 and 2 → [2,2,2], sum=6

Example 2: nums=[2,3], k=7, edges=[[0,1]] → 9
  gains=[3,4], take pair → 2+3+3+4=12? No: 2^7=5,3^7=4 → 5+4=9 ✓

Example 3: nums=[7,7,7,7,7], k=3 → 35  (all gains negative, keep original)
```

---

## 📝 Interview Tips

1. **Key XOR insight** — "XOR dọc path → 2 đầu bị ảnh hưởng" → chọn bất kỳ 2 node, không cần edge trực tiếp / _XOR along path affects only 2 endpoints — pick ANY pair of nodes_
2. **Parity constraint** — Phải XOR số chẵn node; nếu số positive gains lẻ, bỏ gain nhỏ nhất / _Must XOR even count — if odd count of positive gains, skip the smallest_
3. **Greedy correctness** — Sắp gains giảm dần, lấy cặp liên tiếp khi cặp đó > 0 là tối ưu / _Sorting and taking pairs in order is globally optimal (exchange argument)_
4. **DP alternative** — `dp[parity]` = max sum khi đã XOR lẻ/chẵn nodes: `dp0, dp1` cập nhật qua từng node / _DP with parity state also works in O(n)_
5. **Watch overflow** — Giá trị lên đến 10^9 × 2×10^4 = 2×10^13, dùng `number` JS đủ (safe integer) / _Values up to ~2×10^13, within JS safe integer range_
6. **Edge case** — Tất cả gains âm → không XOR gì, trả original sum / _All gains negative → return original sum unchanged_

---

## Solutions

```typescript
/**
 * Solution 1: Greedy — Sort Gains, Take Even-Count Positive Pairs
 * Time: O(n log n) — sorting dominates
 * Space: O(n) — gains array
 *
 * Core insight: applying XOR on any path affects exactly 2 endpoint nodes.
 * So we can effectively XOR any even-sized subset of nodes.
 * gain[i] = (nums[i] ^ k) - nums[i]. Take max even-count gains.
 */
function maximumValueSum(nums: number[], k: number, _edges: number[][]): number {
  const gains = nums.map((v) => (v ^ k) - v).sort((a, b) => b - a);
  let result = nums.reduce((s, v) => s + v, 0);

  for (let i = 0; i + 1 < gains.length; i += 2) {
    const pairGain = gains[i] + gains[i + 1];
    if (pairGain <= 0) break; // remaining pairs only worse
    result += pairGain;
  }
  return result;
}

/**
 * Solution 2: DP with Parity State (O(n) time)
 * Time: O(n) — single pass
 * Space: O(1) — two rolling variables
 *
 * dp0 = max sum when we've XOR'd an EVEN count of nodes so far
 * dp1 = max sum when we've XOR'd an ODD count of nodes so far
 * For each node: choose to keep (v) or XOR (v^k), update both states.
 */
function maximumValueSumDP(nums: number[], k: number, _edges: number[][]): number {
  let dp0 = 0; // even XOR count (start: 0 nodes processed, even = 0)
  let dp1 = -Infinity; // odd XOR count (impossible initially)

  for (const v of nums) {
    const xv = v ^ k;
    const next0 = Math.max(dp0 + v, dp1 + xv); // keep v (even stays even) or XOR (odd becomes even)
    const next1 = Math.max(dp1 + v, dp0 + xv); // keep v (odd stays odd) or XOR (even becomes odd)
    dp0 = next0;
    dp1 = next1;
  }
  return dp0; // must end with even count of XOR'd nodes
}

// === Test Cases ===
const e1 = [
  [0, 1],
  [0, 2],
];
console.log(maximumValueSum([1, 2, 1], 3, e1)); // 6
console.log(maximumValueSum([2, 3], 7, [[0, 1]])); // 9
console.log(maximumValueSum([7, 7, 7, 7, 7], 3, [])); // 35 (no XOR helps)
console.log(maximumValueSum([24, 78, 1, 97, 44], 6, [])); // 260

console.log(maximumValueSumDP([1, 2, 1], 3, e1)); // 6
console.log(maximumValueSumDP([2, 3], 7, [[0, 1]])); // 9
console.log(maximumValueSumDP([7, 7, 7, 7, 7], 3, [])); // 35
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern              | Difficulty |
| ---------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Greatest Sum Divisible by Three](https://leetcode.com/problems/greatest-sum-divisible-by-three)                 | DP with modulo state | Medium     |
| [Maximize Sum Of Array After K Negations](https://leetcode.com/problems/maximize-sum-of-array-after-k-negations) | Greedy               | Easy       |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)                             | Greedy Sort          | Medium     |
| [Closest Subsequence Sum](https://leetcode.com/problems/closest-subsequence-sum)                                 | Meet in the Middle   | Hard       |
