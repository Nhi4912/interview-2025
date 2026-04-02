---
layout: page
title: "Number of Unequal Triplets in Array"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/number-of-unequal-triplets-in-array"
---

# Number of Unequal Triplets in Array / Số Bộ Ba Không Bằng Nhau Trong Mảng

> **Track**: Sorting-Searching | **Difficulty**: 🟢 Easy | **Pattern**: Combinatorics on Value Groups
> **Frequency**: ★★☆ Common — câu warmup về đếm tổ hợp
> **See also**: [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts/) | [Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang chia lớp học thành các nhóm màu áo. Bạn muốn đếm số cách chọn 3 bạn mặc ba màu khác nhau. Thay vì thử từng bộ ba O(n³), hãy nghĩ theo nhóm: khi bạn đứng ở ranh giới giữa nhóm j và nhóm j+1, số bộ ba hợp lệ = (số người nhóm j) × (tổng người các nhóm trước j) × (tổng người các nhóm sau j).

**Pattern Recognition:**

- Signal: "count triplets (i,j,k) with all different values" + "indices i<j<k" → **Sort + Group Counting**
- Bài này thuộc dạng tổ hợp: đếm theo nhóm giá trị, không phải từng phần tử
- Key insight: Sort → group by value → với mỗi nhóm, count = group_size × left_count × right_count

**Visual — Group counting:**

```
nums = [4, 4, 2, 4, 3]
Sorted: [2, 3, 4, 4, 4]
Groups: {2:1, 3:1, 4:3}

Process groups left to right:
left=0, g={2:1}: triplets += 1 * 0 * (5-1-0) = 0;  left+=1=1
left=1, g={3:1}: triplets += 1 * 1 * (5-1-1) = 3;  left+=1=2
left=2, g={4:3}: triplets += 3 * 2 * (5-3-2) = 0;  left+=3=5

Total = 0 + 3 + 0 = 3
```

---

## Problem Description

Given array `nums`, return the number of triplets `(i, j, k)` (0-indexed, `i < j < k`) such that `nums[i]`, `nums[j]`, `nums[k]` are **pairwise unequal** (all three values different). ([LeetCode](https://leetcode.com/problems/number-of-unequal-triplets-in-array))

```
Example 1: nums=[4,4,2,4,3]  → 3
Example 2: nums=[1,1,1,1,1]  → 0
```

Constraints: `3 <= nums.length <= 100`, `1 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Brute force O(n³) is acceptable for n ≤ 100** — _Với n ≤ 100, vòng for ba lớp là ổn trong interview_
2. **Optimal: sort + group by value, combinatorics** — _Nhóm theo giá trị rồi tính tổ hợp O(n log n)_
3. **Formula: for each group, count = size × left × right** — _left = tổng phần tử trước nhóm này, right = tổng phần tử sau_
4. **Using freq map: iterate groups, track prefix count** — _Dùng map đếm tần suất, duyệt và tích luỹ_
5. **n small → clarity over optimization** — _Với n nhỏ, brute force có thể là câu trả lời kỳ vọng_
6. **Time O(n log n), Space O(n) for optimal; O(n³) for brute** — _Cả hai đều chấp nhận được với constraints nhỏ_

---

## Solutions

```typescript
/** Solution 1: Brute Force @complexity Time: O(n³) | Space: O(1) */
function unequalTripletsBrute(nums: number[]): number {
  let count = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) continue;
      for (let k = j + 1; k < n; k++) {
        if (nums[k] !== nums[i] && nums[k] !== nums[j]) count++;
      }
    }
  }
  return count;
}

/** Solution 2: Hash Map + Combinatorics @complexity Time: O(n) | Space: O(n) */
function unequalTriplets(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const v of nums) freq.set(v, (freq.get(v) ?? 0) + 1);

  const n = nums.length;
  let ans = 0,
    left = 0;
  for (const cnt of freq.values()) {
    const right = n - left - cnt;
    ans += left * cnt * right;
    left += cnt;
  }
  return ans;
}

/** Solution 3: Sort + group scan @complexity Time: O(n log n) | Space: O(1) */
function unequalTripletsSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let ans = 0,
    i = 0;

  while (i < n) {
    let j = i;
    while (j < n && nums[j] === nums[i]) j++;
    const groupSize = j - i;
    const leftCount = i;
    const rightCount = n - j;
    ans += groupSize * leftCount * rightCount;
    i = j;
  }
  return ans;
}

// === Test Cases ===
console.log(unequalTriplets([4, 4, 2, 4, 3])); // 3
console.log(unequalTriplets([1, 1, 1, 1, 1])); // 0
console.log(unequalTriplets([1, 2, 3])); // 1
console.log(unequalTriplets([1, 2, 2, 3, 3])); // 8
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                                             | Difficulty | Pattern      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| 1   | [Number of Good Pairs](https://leetcode.com/problems/number-of-good-pairs/)                                                         | Easy       | Hash Map     |
| 2   | [Count Good Triplets](https://leetcode.com/problems/count-good-triplets/)                                                           | Easy       | Brute Force  |
| 3   | [Count Number of Pairs With Absolute Difference K](https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k/) | Easy       | Hash Map     |
| 4   | [3Sum](https://leetcode.com/problems/3sum/)                                                                                         | Medium     | Two Pointers |
