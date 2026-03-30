---
layout: page
title: "3Sum Closest"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/3sum-closest/"
---

# 3Sum Closest / Tổng Ba Số Gần Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers
> **Frequency**: 📘 Tier 3 — Ít gặp hơn 3Sum nhưng hay xuất hiện ở vòng phone screen
> **See also**: [3Sum](./12-3sum.md) | [4Sum](./25-four-sum.md) | [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như chỉnh đài FM — bạn xoay núm chỉnh tần số để đến gần nhất với đài mong muốn. Fix một số, dùng hai con trỏ ở hai đầu để "xoay" tổng lại gần `target`.

**Pattern Recognition:**

- Signal: "3 phần tử", "closest to target" → **Sort + Two Pointers + track min diff**
- Khác 3Sum: không cần tìm exact match, chỉ cần minimize `|sum - target|`
- Khi `sum < target` → tăng tổng → `left++`; khi `sum > target` → giảm tổng → `right--`

**Visual:**

```
nums = [-1, 2, 1, -4], target = 1
sorted: [-4, -1, 1, 2]

Fix i=0 (-4):
  L=1(-1) R=3(2): sum = -4 + -1 + 2 = -3,  diff=4
  L=2(1)  R=3(2): sum = -4 +  1 + 2 = -1,  diff=2

Fix i=1 (-1):
  L=2(1)  R=3(2): sum = -1 +  1 + 2 =  2,  diff=1 ← closest!
  sum > target → R--. L≥R, done.

Answer: 2
```

---

## Problem Description

**LeetCode #16.** Given integer array `nums` and integer `target`, find three integers whose sum is closest to `target`. Return that sum (guaranteed exactly one answer).

```
Example 1: nums = [-1,2,1,-4], target = 1  →  2   (= -1+2+1)
Example 2: nums = [0,0,0],     target = 1  →  0
```

Constraints: `3 <= nums.length <= 500`, `-1000 <= nums[i] <= 1000`, `-10^4 <= target <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Có phải luôn có đúng một đáp án không?" — Yes, guaranteed exactly one.
2. **Brute force**: 3 vòng lặp lồng O(n³) → track `minDiff` và `closestSum` — mention but don't code
3. **Optimize**: Sort + two pointers → O(n²). Key: thay vì check exact match, track `Math.abs(sum - target)`
4. **Exact match shortcut**: Khi `sum === target` → return ngay, không thể làm tốt hơn
5. **Khác 3Sum**: Không cần skip duplicates hay collect results — chỉ cần update `closest` mỗi bước
6. **Follow-up**: "k-Sum Closest?" → Generalize với đệ quy, base case là 2-pointer sweep

---

## Solutions

{% raw %}
/\*\*

- Solution 1: Two Pointers (Optimal)
-
- Sort → fix i → two pointers on the rest.
- At each step update closest if current diff is smaller.
-
- Time: O(n²) — O(n log n) sort + O(n²) two-pointer sweep
- Space: O(1)
  \*/
  function threeSumClosest(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];

for (let i = 0; i < nums.length - 2; i++) {
let left = i + 1;
let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (Math.abs(sum - target) < Math.abs(closest - target)) {
        closest = sum;
      }

      if (sum === target) return sum;    // exact match: can't do better
      else if (sum < target) left++;     // need larger sum
      else right--;                      // need smaller sum
    }

}

return closest;
}

/\*\*

- Solution 2: Two Pointers with Early Termination
-
- Same O(n²) but prunes outer-loop iterations:
- - If min possible sum for this i > target and diff ≥ current best → break
- - If max possible sum for this i < target and diff ≥ current best → continue
-
- Time: O(n²), Space: O(1)
  \*/
  function threeSumClosestOpt(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let closest = nums[0] + nums[1] + nums[2];

for (let i = 0; i < n - 2; i++) {
const minSum = nums[i] + nums[i + 1] + nums[i + 2];
if (minSum > target) {
if (Math.abs(minSum - target) < Math.abs(closest - target)) closest = minSum;
break; // further i only increases minSum
}

    const maxSum = nums[i] + nums[n - 2] + nums[n - 1];
    if (maxSum < target) {
      if (Math.abs(maxSum - target) < Math.abs(closest - target)) closest = maxSum;
      continue;  // this i can't beat current closest on its max side
    }

    let left = i + 1, right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
      if (sum === target) return sum;
      else if (sum < target) left++;
      else right--;
    }

}

return closest;
}

// === Test Cases ===
console.log(threeSumClosest([-1, 2, 1, -4], 1)); // 2
console.log(threeSumClosest([0, 0, 0], 1)); // 0
console.log(threeSumClosest([1, 1, 1, 0], -100)); // 2
console.log(threeSumClosest([1, 2, 3], 6)); // 6
console.log(threeSumClosest([1, 6, 9, 14, 16, 70], 81)); // 80
{% endraw %}

---

## 🔗 Related Problems

- [3Sum](./12-3sum.md) — tìm exact triplets = 0, cùng Sort + Two Pointers
- [4Sum](./25-four-sum.md) — mở rộng thêm một vòng lặp ngoài
- [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) — base case two pointers trên sorted array
- [3Sum Smaller](https://leetcode.com/problems/3sum-smaller/) — đếm triplets có sum < target (premium)
