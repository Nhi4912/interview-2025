---
layout: page
title: "Count Nice Pairs in an Array"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Counting]
leetcode_url: "https://leetcode.com/problems/count-nice-pairs-in-an-array"
---

# Count Nice Pairs in an Array / Đếm Các Cặp Đẹp Trong Mảng

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Một cặp (i, j) là đẹp nếu nums[i] + rev(nums[j]) == nums[j] + rev(nums[i]). Đặt lại: nums[i] - rev(nums[i]) == nums[j] - rev(nums[j]). Tính diff[i] = nums[i] - rev(nums[i]) cho mỗi i, rồi đếm cặp có cùng diff.

**English:** Rearrange the nice pair condition: nums[i] - rev(nums[i]) == nums[j] - rev(nums[j]). Compute diff[i] = nums[i] - rev(nums[i]) for each element, then count pairs with equal diffs using C(n,2) = n\*(n-1)/2.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Nice Pairs in an Array example:**

```
nums = [42, 11, 1, 97]

rev(42)=24, diff[0]=42-24=18
rev(11)=11, diff[1]=11-11=0
rev(1)=1,   diff[2]=1-1=0
rev(97)=79, diff[3]=97-79=18

Groups: {18:[0,3], 0:[1,2]}
Pairs: C(2,2)=1 + C(2,2)=1 = 2
```

---

## Problem Description

| Problem                                                                                             | Difficulty | Pattern             |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Finding Pairs with a Certain Sum](https://leetcode.com/problems/finding-pairs-with-a-certain-sum/) | 🟡 Medium  | Hash Map            |
| [Count Number of Bad Pairs](https://leetcode.com/problems/count-number-of-bad-pairs/)               | 🟡 Medium  | Complement Counting |
| [Two Sum](https://leetcode.com/problems/two-sum/)                                                   | 🟢 Easy    | Hash Map            |

---

## 📝 Interview Tips

- 🔑 **EN:** Algebraic key: nums[i]-rev(i) == nums[j]-rev(j) ↔ nice pair | **VI:** Chìa khóa đại số: nums[i]-rev(i) == nums[j]-rev(j) ↔ cặp đẹp
- 🔑 **EN:** Count pairs per group: C(n,2) = n*(n-1)/2 | **VI:** Đếm cặp trong nhóm: C(n,2) = n*(n-1)/2
- 🔑 **EN:** MOD = 10^9+7 — add before final return | **VI:** MOD = 10^9+7 — áp dụng trước khi trả kết quả
- 🔑 **EN:** Rev function: reverse digits of the number | **VI:** Hàm rev: đảo chữ số của số đó
- 🔑 **EN:** Use a Map to group indices by their diff value | **VI:** Dùng Map để nhóm chỉ số theo giá trị diff
- 🔑 **EN:** Diff can be negative — that's fine for Map keys | **VI:** Diff có thể âm — vẫn dùng được làm khóa Map

---

## Solutions

```typescript
/**
 * Count Nice Pairs using algebraic transformation
 * Time: O(n * log10(max)) — log factor for digit reversal
 * Space: O(n) — map of diff counts
 */
function countNicePairs(nums: number[]): number {
  const MOD = 1_000_000_007n;

  const rev = (n: number): number => {
    let r = 0;
    while (n > 0) {
      r = r * 10 + (n % 10);
      n = Math.floor(n / 10);
    }
    return r;
  };

  const diffCount = new Map<number, number>();
  for (const n of nums) {
    const d = n - rev(n);
    diffCount.set(d, (diffCount.get(d) ?? 0) + 1);
  }

  let result = 0n;
  for (const cnt of diffCount.values()) {
    const c = BigInt(cnt);
    result = (result + (c * (c - 1n)) / 2n) % MOD;
  }

  return Number(result);
}

console.log(countNicePairs([42, 11, 1, 97])); // 2
console.log(countNicePairs([13, 10, 35, 24, 76])); // 4
console.log(countNicePairs([1])); // 0

/**
 * Count new pairs as we process each element
 * Time: O(n log maxNum) | Space: O(n)
 */
function countNicePairs2(nums: number[]): number {
  const MOD = 1_000_000_007;

  const rev = (n: number): number => {
    let r = 0;
    while (n > 0) {
      r = r * 10 + (n % 10);
      n = Math.floor(n / 10);
    }
    return r;
  };

  const seen = new Map<number, number>();
  let result = 0;

  for (const n of nums) {
    const d = n - rev(n);
    const prev = seen.get(d) ?? 0;
    result = (result + prev) % MOD; // each previous element with same diff forms a new pair
    seen.set(d, prev + 1);
  }

  return result;
}

console.log(countNicePairs2([42, 11, 1, 97])); // 2
console.log(countNicePairs2([13, 10, 35, 24, 76])); // 4

/**
 * Compact version using map + reduce
 * Time: O(n log maxNum) | Space: O(n)
 */
function countNicePairs3(nums: number[]): number {
  const MOD = 1_000_000_007;
  const rev = (n: number) => Number(String(n).split("").reverse().join(""));
  const diffs = nums.map((n) => n - rev(n));

  const freq = new Map<number, number>();
  diffs.forEach((d) => freq.set(d, (freq.get(d) ?? 0) + 1));

  let ans = 0;
  for (const c of freq.values()) {
    ans = (ans + Math.floor((c * (c - 1)) / 2)) % MOD;
  }
  return ans;
}

console.log(countNicePairs3([42, 11, 1, 97])); // 2
console.log(countNicePairs3([13, 10, 35, 24, 76])); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Pattern             |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Finding Pairs with a Certain Sum](https://leetcode.com/problems/finding-pairs-with-a-certain-sum/) | 🟡 Medium  | Hash Map            |
| [Count Number of Bad Pairs](https://leetcode.com/problems/count-number-of-bad-pairs/)               | 🟡 Medium  | Complement Counting |
| [Two Sum](https://leetcode.com/problems/two-sum/)                                                   | 🟢 Easy    | Hash Map            |
