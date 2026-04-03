---
layout: page
title: "The Number of Beautiful Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Math, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/the-number-of-beautiful-subsets"
---

# The Number of Beautiful Subsets / Số Tập Con Đẹp

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Group numbers by `value % k` — only numbers in the same group can violate the "no pair differs by k" rule. Within each group (sorted), apply **house robber DP**: you can't pick two adjacent elements (they differ by exactly k). Multiply results across groups, subtract 1 for empty subset.

**VI:** Nhóm số theo `value % k` — chỉ các số trong cùng nhóm mới vi phạm điều kiện "không có cặp cách nhau k". Trong mỗi nhóm (đã sắp xếp), áp dụng **DP house robber**: không chọn hai phần tử kề nhau (cách nhau đúng k). Nhân kết quả các nhóm, trừ 1 cho tập rỗng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — The Number of Beautiful Subsets example:**

```
nums=[2,4,6], k=2  →  group 0%2=0: [2,4,6]
  sorted: 2, 4, 6  (each consecutive pair differs by k=2)
  House robber on counts: c=[1,1,1]
    take=1 (pick), skip=0 (not pick)
    dp: [take=1,skip=0] → [take=max(1+skip_prev)=1, skip=max(take,skip)=1] → ...
  Ways per group: (2^cnt - 1) if no conflicts, else house robber result

Groups are independent → multiply ways per group
Final answer = product - 1  (remove empty subset)
```

---

---

## Problem Description

| Problem                                                                 | Difficulty | Pattern         |
| ----------------------------------------------------------------------- | ---------- | --------------- |
| [House Robber](https://leetcode.com/problems/house-robber/)             | 🟡 Medium  | DP Non-adjacent |
| [Subsets](https://leetcode.com/problems/subsets/)                       | 🟡 Medium  | Backtracking    |
| [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) | 🟡 Medium  | Backtracking    |

---

## 📝 Interview Tips

- 🔑 **EN:** Group by `val % k`: numbers in different groups never form a forbidden pair. **VI:** Nhóm theo val%k: số ở nhóm khác nhau không tạo cặp bị cấm.
- 🔑 **EN:** Within a sorted group, consecutive elements may differ by `k`. Use house robber. **VI:** Trong nhóm đã sắp xếp, phần tử liên tiếp có thể cách nhau đúng k → dùng house robber.
- 🔑 **EN:** House robber state: `(withLast, withoutLast)`. Transition based on count of each value. **VI:** Trạng thái house robber: (có chọn cuối, không chọn cuối). Chuyển tiếp theo số lần xuất hiện.
- 🔑 **EN:** For a value with count `c`: can include 1..c elements → `c` ways; excluding: 1 way. **VI:** Giá trị xuất hiện c lần: có thể chọn 1..c phần tử (c cách); không chọn: 1 cách.
- 🔑 **EN:** Backtracking solution O(2^n) also valid for small n (≤20). **VI:** Backtracking O(2^n) cũng hợp lệ với n nhỏ ≤ 20.
- 🔑 **EN:** Subtract 1 at the end to exclude the empty subset. **VI:** Trừ 1 ở cuối để loại tập rỗng.

---

---

## Solutions

```typescript
/**
 * Group by mod k, then House Robber per group
 * Time: O(n log n)  Space: O(n)
 */
function beautifulSubsets(nums: number[], k: number): number {
  // Group by value % k
  const groups = new Map<number, Map<number, number>>();
  for (const v of nums) {
    const mod = v % k;
    if (!groups.has(mod)) groups.set(mod, new Map());
    const g = groups.get(mod)!;
    g.set(v, (g.get(v) ?? 0) + 1);
  }

  let result = 1;

  for (const group of groups.values()) {
    // Sort values in this group
    const sorted = [...group.keys()].sort((a, b) => a - b);
    // House robber: withLast = ways including last value, withoutLast = ways excluding
    let withLast = 0;
    let withoutLast = 1; // empty subset of this group

    for (let i = 0; i < sorted.length; i++) {
      const cnt = group.get(sorted[i])!;
      const waysToInclude = (1 << cnt) - 1; // 2^cnt - 1: choose 1..cnt elements

      const prevWithLast = withLast;
      const prevWithoutLast = withoutLast;

      if (i > 0 && sorted[i] - sorted[i - 1] === k) {
        // Adjacent in value (differ by k): can't combine withLast from prev
        withLast = prevWithoutLast * waysToInclude;
        withoutLast = prevWithLast + prevWithoutLast;
      } else {
        // No conflict: can combine freely
        withLast = (prevWithLast + prevWithoutLast) * waysToInclude;
        withoutLast = prevWithLast + prevWithoutLast;
      }
    }

    result *= withLast + withoutLast;
  }

  return result - 1; // subtract empty subset
}

/**
 * Backtracking approach (cleaner, O(2^n))
 * Time: O(2^n)  Space: O(n)
 */
function beautifulSubsetsBacktrack(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const freq = new Map<number, number>();
  let count = 0;

  function bt(idx: number): void {
    if (idx === nums.length) {
      count++;
      return;
    }
    // Skip current element
    bt(idx + 1);
    // Include current element if not forbidden
    if (!freq.get(nums[idx] - k)) {
      freq.set(nums[idx], (freq.get(nums[idx]) ?? 0) + 1);
      bt(idx + 1);
      freq.set(nums[idx], freq.get(nums[idx])! - 1);
    }
  }

  bt(0);
  return count - 1; // subtract empty subset
}

// Tests
console.log(beautifulSubsets([2, 4, 6], 2)); // 4
console.log(beautifulSubsets([1], 1)); // 1
console.log(beautifulSubsets([1, 2, 3, 4], 1)); // should be > 0
console.log(beautifulSubsetsBacktrack([2, 4, 6], 2)); // 4
```

---

## 🔗 Related Problems

| Problem                                                                 | Difficulty | Pattern         |
| ----------------------------------------------------------------------- | ---------- | --------------- |
| [House Robber](https://leetcode.com/problems/house-robber/)             | 🟡 Medium  | DP Non-adjacent |
| [Subsets](https://leetcode.com/problems/subsets/)                       | 🟡 Medium  | Backtracking    |
| [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) | 🟡 Medium  | Backtracking    |
