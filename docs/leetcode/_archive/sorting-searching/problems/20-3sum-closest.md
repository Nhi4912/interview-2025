---
layout: page
title: "3Sum Closest"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/3sum-closest"
---

# 3Sum Closest / Tổng Ba Số Gần Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [4Sum](https://leetcode.com/problems/4sum) | [3Sum](https://leetcode.com/problems/3sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cố định một quả cân, rồi dùng hai tay điều chỉnh hai quả còn lại — tay trái tịnh tiến vào nếu tổng quá nhỏ, tay phải lùi ra nếu tổng quá lớn. Sort trước để đảm bảo mỗi bước di chuyển con trỏ là đúng hướng.

**Pattern:** Fix one element + two pointers on sorted array. Không cần dedup vì bài hỏi tổng, không hỏi bộ ba unique.

```
nums = [-4, -1, 1, 2], target = 1

i=0 (-4): lo=1(-1), hi=3(2)
  sum = -4 + (-1) + 2 = -3, |diff|=4 → closest=-3 → lo++
  sum = -4 +  1  + 2 = -1, |diff|=2 → closest=-1 → lo++
  lo >= hi → break

i=1 (-1): lo=2(1), hi=3(2)
  sum = -1 + 1 + 2 = 2, |diff|=1 → closest=2 → hi--
  lo >= hi → break

Result = 2 ✅
```

---

Cho mảng số nguyên `nums` và số nguyên `target`, tìm **ba số** trong `nums` sao cho tổng gần với `target` nhất. Trả về tổng đó. Đảm bảo có đúng một đáp án.

- `nums = [-1,2,1,-4], target = 1` → `2` (tổng -1+2+1=2, |2-1|=1)
- `nums = [0,0,0], target = 1` → `0`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Sort trước**: biến O(n³) brute force thành O(n²) nhờ two-pointer
- 🇺🇸 **Early exit**: if `sum === target`, return immediately — perfect match found
- 🇻🇳 **Di chuyển con trỏ**: `sum < target → lo++` (cần lớn hơn); `sum > target → hi--`
- 🇺🇸 **Track closest**: compare `|sum - target| < |closest - target|` each iteration
- 🇻🇳 **Không cần dedup** (khác 3Sum): bài hỏi giá trị tổng, không hỏi bộ ba phân biệt
- 🇺🇸 **Space**: O(log n) for sort only; no hash maps or extra arrays needed

---

## Solutions

### Solution 1: Sort + Fix One + Two Pointers — O(n²) time, O(log n) space ✅ Optimal

```typescript
/**
 * Sort, then for each fixed element use two pointers on the rest
 * Time: O(n²) | Space: O(log n) for sort
 */
function threeSumClosest(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2]; // initial estimate

  for (let i = 0; i < nums.length - 2; i++) {
    let lo = i + 1,
      hi = nums.length - 1;

    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];

      if (Math.abs(sum - target) < Math.abs(closest - target)) {
        closest = sum;
      }

      if (sum === target)
        return sum; // exact match, can't improve
      else if (sum < target)
        lo++; // need larger sum
      else hi--; // need smaller sum
    }
  }

  return closest;
}

// Tests
console.log(threeSumClosest([-1, 2, 1, -4], 1)); // 2
console.log(threeSumClosest([0, 0, 0], 1)); // 0
console.log(threeSumClosest([1, 1, 1, 0], 100)); // 3
console.log(threeSumClosest([-1, 0, 1, 1, 55], 3)); // 2
console.log(threeSumClosest([1, 2, 5, 10, 11], 12)); // 12
```

### Solution 2: Brute Force — O(n³) time, O(1) space

```typescript
/**
 * Check all possible triplets — useful as baseline / interview warmup
 * Time: O(n³) | Space: O(1)
 */
function threeSumClosestBrute(nums: number[], target: number): number {
  let closest = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    for (let j = i + 1; j < nums.length - 1; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(closest - target)) {
          closest = sum;
        }
        if (closest === target) return closest;
      }
    }
  }

  return closest;
}

console.log(threeSumClosestBrute([-1, 2, 1, -4], 1)); // 2
console.log(threeSumClosestBrute([0, 0, 0], 1)); // 0
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                      | Difficulty | Pattern                            |
| ---------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| [3Sum](https://leetcode.com/problems/3sum)                                   | 🟡 Medium  | Sort + Two Pointers (exact, dedup) |
| [4Sum](https://leetcode.com/problems/4sum)                                   | 🟡 Medium  | Extend to 4 elements               |
| [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted) | 🟢 Easy    | Two pointers foundation            |
