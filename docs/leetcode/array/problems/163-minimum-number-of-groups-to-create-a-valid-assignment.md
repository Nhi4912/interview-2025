---
layout: page
title: "Minimum Number of Groups to Create a Valid Assignment"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-groups-to-create-a-valid-assignment"
---

# Minimum Number of Groups to Create a Valid Assignment / Số Nhóm Tối Thiểu Để Phân Công Hợp Lệ

🟡 Medium | 🏷️ Array, Hash Table, Greedy | 🔗 [LeetCode](https://leetcode.com/problems/minimum-number-of-groups-to-create-a-valid-assignment)

## 🧠 Intuition / Trực Giác

**Tiếng Việt:** Đếm tần suất xuất hiện của mỗi nhãn. Thử kích thước nhóm k từ min_freq xuống 1. Với mỗi k, kiểm tra xem có thể chia tất cả tần suất thành các nhóm kích thước k hoặc k+1 không. Kích thước k lớn hơn = ít nhóm hơn.

**English:** Count frequency of each label. Try group size k from minFreq down to 1. A frequency f can be split into groups of size k or k+1 iff ceil(f/(k+1))\*k ≤ f. Return minimum total groups.

```
nums = [1,1,1,2,2,3]  →  freq = {1:3, 2:2, 3:1}
minFreq = 1

Try k=1: each freq splits into groups of 1 or 2
  freq=3: ceil(3/2)=2 groups, 2*1=2≤3 ✓
  freq=2: ceil(2/2)=1 group,  1*1=1≤2 ✓
  freq=1: ceil(1/2)=1 group,  1*1=1≤1 ✓
  total = 2+1+1 = 4 groups ← answer
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Iterate k from minFreq downward — larger k gives fewer groups | **VI:** Duyệt k từ minFreq xuống — k lớn hơn cho ít nhóm hơn
- 🔑 **EN:** Feasibility check: ceil(f/(k+1)) _ k ≤ f for every frequency | **VI:** Kiểm tra tính khả thi: ceil(f/(k+1)) _ k ≤ f với mọi tần suất
- 🔑 **EN:** Minimum groups for freq f with size k = ceil(f/(k+1)) | **VI:** Số nhóm tối thiểu cho tần suất f với kích thước k = ceil(f/(k+1))
- 🔑 **EN:** The first valid k (largest) found gives the optimal answer | **VI:** k hợp lệ đầu tiên (lớn nhất) tìm được chính là đáp án tối ưu
- 🔑 **EN:** Edge case: if all elements distinct, minFreq=1, answer = n | **VI:** Trường hợp biên: nếu tất cả phần tử khác nhau, minFreq=1, đáp án = n
- 🔑 **EN:** O(n + minFreq _ distinct) ≈ O(n) time overall | **VI:** O(n + minFreq _ distinct) ≈ O(n) thời gian tổng cộng

## Solutions

### Solution 1: Greedy — Try Group Sizes from minFreq Down

```typescript
/**
 * Minimum Number of Groups to Create a Valid Assignment
 * Time: O(n + minFreq * D) where D = number of distinct values
 * Space: O(D) — frequency map
 */
function minGroupsForValidAssignment(nums: number[]): number {
  // Count frequencies
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const counts = [...freq.values()];
  const minFreq = Math.min(...counts);

  // Try group sizes from largest (minFreq) down to 1
  for (let k = minFreq; k >= 1; k--) {
    let totalGroups = 0;
    let valid = true;

    for (const f of counts) {
      // Minimum groups needed: ceil(f / (k+1))
      const groups = Math.ceil(f / (k + 1));
      // Check feasibility: groups * k <= f (we can fill each group to at least k)
      if (groups * k > f) {
        valid = false;
        break;
      }
      totalGroups += groups;
    }

    if (valid) return totalGroups;
  }

  return nums.length; // k=1: each element its own group (fallback)
}

console.log(minGroupsForValidAssignment([1, 1, 1, 2, 2, 3])); // 4
console.log(minGroupsForValidAssignment([3, 2, 3, 2, 3])); // 2
console.log(minGroupsForValidAssignment([10, 10, 10, 3, 1, 1])); // 4
```

### Solution 2: Explicit Feasibility with Modulo

```typescript
/**
 * Alternative: check if f % k <= floor(f / k)
 * This is equivalent to ceil(f/(k+1))*k <= f
 * Time: O(n + minFreq * D) | Space: O(D)
 */
function minGroupsForValidAssignment2(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
  const counts = [...freq.values()];
  const minFreq = Math.min(...counts);

  const canSplit = (f: number, k: number): number | null => {
    // Split f into groups of k or k+1; return group count or null if impossible
    const g = Math.ceil(f / (k + 1));
    return g * k <= f ? g : null;
  };

  for (let k = minFreq; k >= 1; k--) {
    let total = 0;
    let valid = true;
    for (const f of counts) {
      const g = canSplit(f, k);
      if (g === null) {
        valid = false;
        break;
      }
      total += g;
    }
    if (valid) return total;
  }

  return nums.length;
}

console.log(minGroupsForValidAssignment2([1, 1, 1, 2, 2, 3])); // 4
console.log(minGroupsForValidAssignment2([3, 2, 3, 2, 3])); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                       | Difficulty | Pattern            |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Divide Array in Sets of K Consecutive Numbers](https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/) | 🟡 Medium  | Greedy             |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/)                                                               | 🟡 Medium  | Greedy + Frequency |
| [Rearrange String k Distance Apart](https://leetcode.com/problems/rearrange-string-k-distance-apart/)                         | 🔴 Hard    | Greedy             |
