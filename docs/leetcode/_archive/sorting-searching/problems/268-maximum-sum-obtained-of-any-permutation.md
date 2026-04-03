---
layout: page
title: "Maximum Sum Obtained of Any Permutation"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-sum-obtained-of-any-permutation"
---

# Maximum Sum Obtained of Any Permutation / Tổng Lớn Nhất Từ Bất Kỳ Hoán Vị Nào

> **Track**: Sorting-Searching | **Difficulty**: 🟡 Medium | **Pattern**: Difference Array + Greedy Sort
> **Frequency**: ★★★ Common — difference array trick, gặp ở các bài về request frequency
> **See also**: [Car Pooling](https://leetcode.com/problems/car-pooling/) | [My Calendar II](https://leetcode.com/problems/my-calendar-ii/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một đội nhân viên và nhiều dự án, mỗi dự án cần một nhân viên tại vị trí [start, end]. Nhân viên được xếp vào nhiều dự án sẽ được trả lương nhiều hơn. Để tối đa tổng lương, hãy phân công nhân viên giỏi nhất (lương cao nhất) vào vị trí được nhiều dự án yêu cầu nhất. Đếm tần suất yêu cầu bằng **difference array** (kỹ thuật O(1) update range), sau đó sort cả hai và ghép lại.

**Pattern Recognition:**

- Signal: "sum over requests" + "assign values to maximize sum" → **Difference Array + Sort and Pair**
- Bài này thuộc dạng: đếm tần suất bằng difference array, sort và ghép greedy
- Key insight: vị trí được nhiều query hơn → cần giá trị lớn hơn; ghép sorted frequency với sorted nums

**Visual — Difference array + greedy pairing:**

```
nums=[1,2,3,4,5], requests=[[1,3],[0,1]]
n=5, diff=[0,0,0,0,0,0]

Request [1,3]: diff[1]++ diff[4]-- → diff=[0,1,0,0,-1,0]
Request [0,1]: diff[0]++ diff[2]-- → diff=[1,1,-1,0,-1,0]

Prefix sum: freq=[1,2,1,1,0]  (index 0→1, 1→2, 2→1, 3→1, 4→0)

Sort freq desc: [2,1,1,1,0]
Sort nums desc: [5,4,3,2,1]

Sum = 5*2 + 4*1 + 3*1 + 2*1 + 1*0 = 10+4+3+2+0 = 19
```

---

## Problem Description

Given array `nums` and `requests[i] = [start_i, end_i]`, for each request the sum of `nums[start_i..end_i]` is calculated. Arrange `nums` in any permutation to **maximize the total sum of all requests**. Return answer modulo `10^9 + 7`. ([LeetCode](https://leetcode.com/problems/maximum-sum-obtained-of-any-permutation))

```
Example 1: nums=[1,2,3,4,5], requests=[[1,3],[0,1]]  → 19
Example 2: nums=[1,2,3,4,5,6], requests=[[0,1]]       → 11
```

Constraints: `n == nums.length`, `1 <= n <= 10^5`, `1 <= requests.length <= 10^5`, `0 <= start_i <= end_i < n`

---

## 📝 Interview Tips

1. **Difference array for range frequency in O(1) per update** — _diff[start]++, diff[end+1]-- sau đó prefix sum cho tần suất_
2. **Frequency = how many requests include that index** — _Sau prefix sum, freq[i] = số lần vị trí i được yêu cầu_
3. **Greedy: pair largest nums with highest frequency** — _Sort cả hai giảm dần, nhân từng cặp_
4. **Modulo only at the final sum** — _Chỉ cần modulo kết quả cuối, không cần trong từng phép nhân (JS safe integer)_
5. **Indices with freq=0 don't contribute** — _Vị trí không được query nào bao phủ → không cần đặt số lớn_
6. **Time O(n log n + q), Space O(n)** — _Difference array O(q), sort O(n log n), pairing O(n)_

---

## Solutions

```typescript
/** Solution 1: Brute Force — try positions @complexity Time: O(n! * q) | Space: O(1) — impractical */
// (Skip — truly exponential, not useful)

/** Solution 2: Difference Array + Greedy Sort @complexity Time: O((n+q) log n) | Space: O(n) */
function maxSumRangeQuery(nums: number[], requests: number[][]): number {
  const MOD = 1_000_000_007n;
  const n = nums.length;

  // Step 1: Build frequency using difference array
  const diff = new Int32Array(n + 1);
  for (const [start, end] of requests) {
    diff[start]++;
    diff[end + 1]--;
  }

  // Step 2: Convert to frequency via prefix sum
  const freq = new Int32Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];
    freq[i] = running;
  }

  // Step 3: Sort both descending and pair greedily
  nums.sort((a, b) => b - a);
  freq.sort().reverse(); // Int32Array has different sort semantics

  // Actually sort freq as number[]
  const freqArr = Array.from(freq).sort((a, b) => b - a);

  let ans = 0n;
  for (let i = 0; i < n; i++) {
    if (freqArr[i] === 0) break; // remaining pairs contribute 0
    ans = (ans + BigInt(nums[i]) * BigInt(freqArr[i])) % MOD;
  }
  return Number(ans);
}

/** Solution 3: Same logic, cleaner @complexity Time: O(n log n) | Space: O(n) */
function maxSumRangeQuery2(nums: number[], requests: number[][]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  const diff = new Array(n + 1).fill(0);

  for (const [s, e] of requests) {
    diff[s]++;
    diff[e + 1]--;
  }

  const freq: number[] = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += diff[i];
    freq.push(sum);
  }

  nums.sort((a, b) => b - a);
  freq.sort((a, b) => b - a);

  let ans = 0;
  for (let i = 0; i < n && freq[i] > 0; i++) {
    ans = (ans + nums[i] * freq[i]) % MOD;
  }
  return ans;
}

// === Test Cases ===
console.log(
  maxSumRangeQuery2(
    [1, 2, 3, 4, 5],
    [
      [1, 3],
      [0, 1],
    ],
  ),
); // 19
console.log(maxSumRangeQuery2([1, 2, 3, 4, 5, 6], [[0, 1]])); // 11
console.log(
  maxSumRangeQuery2(
    [1, 2, 3],
    [
      [0, 2],
      [1, 2],
    ],
  ),
); // 12
```

---

## 🔗 Related Problems

| #   | Problem                                                                                             | Difficulty | Pattern              |
| --- | --------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| 1   | [Car Pooling](https://leetcode.com/problems/car-pooling/)                                           | Medium     | Difference Array     |
| 2   | [My Calendar I](https://leetcode.com/problems/my-calendar-i/)                                       | Medium     | Sweep Line           |
| 3   | [Range Addition](https://leetcode.com/problems/range-addition/)                                     | Medium     | Difference Array     |
| 4   | [Rearrange Array Elements by Sign](https://leetcode.com/problems/rearrange-array-elements-by-sign/) | Medium     | Greedy / Two Pointer |
