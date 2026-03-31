---
layout: page
title: "Count Pairs in Two Arrays"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/count-pairs-in-two-arrays"
---

# Count Pairs in Two Arrays / Đếm Cặp Trong Hai Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count the Number of Fair Pairs](https://leetcode.com/problems/count-the-number-of-fair-pairs) | [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Điều kiện nums1[i]+nums1[j] > nums2[i]+nums2[j] tương đương (nums1[i]-nums2[i]) + (nums1[j]-nums2[j]) > 0. Đặt diff[i] = nums1[i]-nums2[i], bài toán thành: đếm cặp (i<j) với diff[i]+diff[j] > 0. Sort diff, dùng two pointers.

```
nums1 = [2,1,2,1], nums2 = [1,2,1,2]
diff  = [1,-1,1,-1]
Sort diff: [-1,-1,1,1]

Two pointers: l=0, r=3
  diff[0]+diff[3] = -1+1 = 0 ≤ 0 → l++
  diff[1]+diff[3] = -1+1 = 0 ≤ 0 → l++
  diff[2]+diff[3] = 1+1 = 2 > 0 → count += r-l = 1, r--
  l=r=2, stop

Count = 1 ✓
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Transform phép so sánh** — nums1[i]+nums1[j] > nums2[i]+nums2[j] ⟺ diff[i]+diff[j] > 0 / algebraic transformation reduces to single-array problem
- 🇻🇳 **Sort + two pointers** — sau sort diff, nếu diff[l]+diff[r] > 0 thì tất cả l' trong [l,r-1] cũng cho sum > 0 / if diff[l]+diff[r] > 0, all pairs (l'<r) with l'≥l are valid
- 🇻🇳 **Count += r-l** — khi diff[l]+diff[r] > 0, có r-l cặp hợp lệ kết thúc tại r / r-l pairs all end at r and start anywhere in [l,r-1]
- 🇻🇳 **Khi sum ≤ 0 → l++** — cần phần tử lớn hơn ở bên trái / need larger left element
- 🇻🇳 **Large answer** — kết quả có thể lên đến n²/2, dùng number (JS safe ~9e15) / answer fits in JS number for reasonable n
- 🇻🇳 **i ≠ j, i < j** — không đếm cặp lặp; two pointers tự đảm bảo i<j vì l<r / two pointers guarantee l < r naturally

---

## Solutions

### Solution 1: Transform + Sort + Two Pointers — O(n log n)

```typescript
/**
 * Reduce to: count pairs where diff[i]+diff[j] > 0
 * Sort diff, two-pointer from both ends
 * Time: O(n log n)  Space: O(n)
 */
function countPairs(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  const diff = nums1.map((v, i) => v - nums2[i]);
  diff.sort((a, b) => a - b);

  let count = 0;
  let l = 0,
    r = n - 1;

  while (l < r) {
    if (diff[l] + diff[r] > 0) {
      // diff[l..r-1] + diff[r] all > 0
      count += r - l;
      r--;
    } else {
      l++;
    }
  }
  return count;
}

console.log(countPairs([2, 1, 2, 1], [1, 2, 1, 2])); // 1
console.log(countPairs([1, 10, 6, 2], [1, 4, 1, 2])); // 5
console.log(countPairs([1, 2, 3, 4], [4, 3, 2, 1])); // 6
```

### Solution 2: Transform + Sort + Binary Search — O(n log n)

```typescript
/**
 * For each i from left, binary search for first j > i where diff[i]+diff[j] > 0
 * Time: O(n log n)  Space: O(n)
 */
function countPairs2(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  const diff = nums1.map((v, i) => v - nums2[i]);
  diff.sort((a, b) => a - b);

  let count = 0;
  for (let i = 0; i < n - 1; i++) {
    // Find first j > i where diff[j] > -diff[i]
    // i.e., first j where diff[j] >= -diff[i] + 1
    const target = -diff[i]; // need diff[j] > target
    let lo = i + 1,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (diff[mid] > target) hi = mid;
      else lo = mid + 1;
    }
    count += n - lo;
  }
  return count;
}

console.log(countPairs2([2, 1, 2, 1], [1, 2, 1, 2])); // 1
console.log(countPairs2([1, 10, 6, 2], [1, 4, 1, 2])); // 5
```

### Solution 3: Brute Force (for validation) — O(n²)

```typescript
/**
 * O(n²) brute force — use for small inputs or verification
 * Time: O(n²)  Space: O(1)
 */
function countPairsBrute(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  let count = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums1[i] + nums1[j] > nums2[i] + nums2[j]) count++;
    }
  }
  return count;
}

console.log(countPairsBrute([2, 1, 2, 1], [1, 2, 1, 2])); // 1
console.log(countPairsBrute([1, 10, 6, 2], [1, 4, 1, 2])); // 5
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Difficulty | Pattern             |
| -------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Count the Number of Fair Pairs](https://leetcode.com/problems/count-the-number-of-fair-pairs)                       | 🟡 Medium  | Sort + Two Pointers |
| [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)                                         | 🟢 Easy    | Two Pointers        |
| [3Sum](https://leetcode.com/problems/3sum)                                                                           | 🟡 Medium  | Sort + Two Pointers |
| [Count Pairs Whose Sum is Less Than Target](https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target) | 🟢 Easy    | Sort + Two Pointers |
