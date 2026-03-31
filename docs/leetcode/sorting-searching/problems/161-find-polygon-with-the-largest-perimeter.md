---
layout: page
title: "Find Polygon With the Largest Perimeter"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-polygon-with-the-largest-perimeter"
---

# Find Polygon With the Largest Perimeter / Tìm Đa Giác Có Chu Vi Lớn Nhất

🟡 Medium | 🏷️ Array, Greedy, Sorting, Prefix Sum | [LeetCode](https://leetcode.com/problems/find-polygon-with-the-largest-perimeter)

---

## 🧠 Intuition

**Vietnamese:** Một đa giác hợp lệ cần: cạnh lớn nhất < tổng các cạnh còn lại. Sau khi sắp xếp tăng dần, với mỗi phần tử `nums[i]` làm cạnh lớn nhất, điều kiện là `prefixSum[i-1] > nums[i]`. Để có chu vi lớn nhất, duyệt từ phải sang trái và dừng ở phần tử đầu tiên thỏa mãn.

**Analogy:** Bạn dựng lều bằng những cây gậy — cây dài nhất phải ngắn hơn tổng tất cả cây còn lại, nếu không lều sẽ không khép kín.

```
nums = [5, 5, 5]  sorted → [5,5,5]
prefix = [5, 10, 15]

i=2: nums[2]=5 < prefix[1]=10 ✅ → perimeter = prefix[2] = 15

nums = [1, 12, 1, 2, 5, 3]  sorted → [1,1,2,3,5,12]
prefix = [1, 2, 4, 7, 12, 24]

i=5: nums[5]=12 < prefix[4]=12? NO ❌
i=4: nums[4]=5  < prefix[3]=7? YES ✅ → perimeter = prefix[4] = 12
```

---

## 📝 Interview Tips

- **EN:** A polygon with k sides is valid if longest side < sum of all others / **VI:** Đa giác hợp lệ: cạnh dài nhất < tổng các cạnh còn lại
- **EN:** Sort ascending; prefix sums enable O(1) check per index / **VI:** Sắp xếp, dùng prefix sum kiểm tra O(1) mỗi index
- **EN:** Scan from right: first index where `prefix[i-1] > nums[i]` gives answer / **VI:** Duyệt từ phải sang trái, index đầu tiên thỏa điều kiện là đáp án
- **EN:** Perimeter = prefix[i] (sum of all sides in polygon) / **VI:** Chu vi = prefix[i] = tổng tất cả cạnh đã chọn
- **EN:** Minimum polygon is a triangle (3 sides), so i must be ≥ 2 / **VI:** Đa giác tối thiểu 3 cạnh, nên i ≥ 2
- **EN:** If no valid polygon found, return -1 / **VI:** Nếu không tìm được đa giác hợp lệ, trả -1

---

## Solutions

### Solution 1: Sort + Prefix Sum + Right Scan

```typescript
/**
 * Sort, build prefix sums, scan right-to-left for largest valid polygon.
 * Time: O(n log n)  Space: O(n)
 */
function largestPerimeter(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // prefix[i] = sum of nums[0..i]
  const prefix = new Array(n).fill(0);
  prefix[0] = nums[0];
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] + nums[i];

  // Scan from right: largest side = nums[i], other sides sum = prefix[i-1]
  for (let i = n - 1; i >= 2; i--) {
    if (prefix[i - 1] > nums[i]) {
      return prefix[i]; // perimeter = sum of all chosen sides
    }
  }
  return -1;
}

// Tests
console.log(largestPerimeter([5, 5, 5])); // 15
console.log(largestPerimeter([1, 12, 1, 2, 5, 3])); // 12
console.log(largestPerimeter([1, 2, 3])); // 6  (1+2>3? no, 2<3, but 3-sided: 1+2=3 not >3) → -1? Actually 1+2=3 not strictly > 3 → -1
console.log(largestPerimeter([3, 6, 2, 3])); // 12
```

### Solution 2: Running Prefix Sum (Space Optimized)

```typescript
/**
 * No extra array — maintain running prefix as we scan.
 * Time: O(n log n)  Space: O(1) extra
 */
function largestPerimeter2(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  let total = nums.reduce((s, v) => s + v, 0);

  // From right to left: remove current element from total to get prefix[i-1]
  for (let i = n - 1; i >= 2; i--) {
    total -= nums[i]; // total is now sum of nums[0..i-1]
    if (total > nums[i]) {
      return total + nums[i]; // prefix[i]
    }
  }
  return -1;
}

// Tests
console.log(largestPerimeter2([5, 5, 5])); // 15
console.log(largestPerimeter2([1, 12, 1, 2, 5, 3])); // 12
console.log(largestPerimeter2([3, 6, 2, 3])); // 12
console.log(largestPerimeter2([1, 1, 1])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Connection               |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [Largest Perimeter Triangle](https://leetcode.com/problems/largest-perimeter-triangle)                             | 🟢 Easy    | Same idea, triangle only |
| [Rearrange Array to Maximize Prefix Score](https://leetcode.com/problems/rearrange-array-to-maximize-prefix-score) | 🟡 Medium  | Prefix sum after sort    |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)                 | 🔴 Hard    | Prefix sum optimization  |
