---
layout: page
title: "Maximum Product Subarray"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/maximum-product-subarray/"
---

# Maximum Product Subarray / Tích Lớn Nhất Của Mảng Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Kadane's Variant (Track Min + Max)
> **Frequency**: 📘 Tier 2 — Classic DP twist; frequently asked at FAANG alongside Maximum Subarray
> **See also**: [Regular Expression Matching](./11-regular-expression-matching.md) | [Maximum Subarray LC #53](https://leetcode.com/problems/maximum-subarray/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Như chọn loạt sản phẩm bán hàng liên tiếp — mỗi sản phẩm nhân vào doanh thu hiện tại. Có sản phẩm "lỗ" (số âm) nhưng hai sản phẩm lỗ liên tiếp lại tạo lãi lớn (âm × âm = dương). Vì vậy luôn phải ghi nhớ cả giá trị LỖ NHẤT (min) lẫn LÃI NHẤT (max) — min hôm nay có thể là max vàng ngày mai.

- **Pattern Recognition:**
  - Signal: subarray + product + negative numbers → track both max AND min at each position
  - Khác với Maximum Subarray: tại mỗi `num`, max_new có thể từ `maxProd*num`, `minProd*num`, hoặc `num` itself
  - Khi gặp 0: cả max và min đều reset về `num` (= 0)

- **Visual — nums = [2, 3, -2, 4]:**

```
        num   maxProd  minProd  result
Start:   —      2        2       2    (init with nums[0])
i=1:     3      6        3       6    max(3, 2×3, 2×3)=6, min(…)=3
i=2:    -2     -2      -12       6    max(-2, 6×-2=-12, 3×-2=-6) = -2
                                      min(-2, -12, -6) = -12
i=3:     4      4      -48       6    max(4, -2×4=-8, -12×4=-48) = 4
                                      result stays 6

Answer: 6  (subarray [2,3])

nums = [-2, 3, -4]:
Start:   —     -2       -2      -2
i=1:     3      3       -6       3    max(3, -2×3=-6, -2×3=-6)=3
i=2:    -4     24      -12      24    max(-4, 3×-4=-12, -6×-4=24)=24  ← neg×neg!
Answer: 24  (subarray [-2,3,-4])
```

## Problem Description

Find the contiguous subarray with the largest product (at least one element).

```
nums = [2,3,-2,4]   → 6       ([2,3])
nums = [-2,0,-1]    → 0       (zero resets the product)
nums = [-2,3,-4]    → 24      ([-2,3,-4]: two negatives flip to positive)
```

## 📝 Interview Tips

1. **Luôn lưu `tempMax = maxProd` TRƯỚC khi tính maxProd mới — cả max và min dùng OLD maxProd / Save tempMax before overwriting — both new max and min use the old maxProd**
2. **Ba ứng viên cho max: `num`, `maxProd*num`, `minProd*num` — không bao giờ bỏ qua `num` itself / Three candidates for max: num itself, maxProd×num, minProd×num**
3. **Mảng một phần tử âm: `[-5]` → -5; không được trả về 0 / Single negative: [-5] → -5; never return 0**
4. **Nếu có 0 trong mảng: product reset, nhưng prefix/suffix approach tự xử lý / Zero resets product; prefix/suffix approach handles it naturally**
5. **Follow-up overflow: dùng BigInt hoặc logarithm (sum of logs) / For overflow: use logarithm (sum of logs = log of product)**

## Solutions

```typescript
/**

- Solution 1 — Brute Force O(n²)
- Check all subarrays explicitly
- Time: O(n²) | Space: O(1)
  _/
  function maxProductBrute(nums: number[]): number {
  let result = nums[0];
  for (let i = 0; i < nums.length; i++) {
  let prod = 1;
  for (let j = i; j < nums.length; j++) {
  prod _= nums[j];
  result = Math.max(result, prod);
  }
  }
  return result;
  }

/**

- Solution 2 — Kadane's Variant: Track Min & Max ✅ Recommended
- At each position, new max might come from flipping the minimum (neg×neg)
- Time: O(n) | Space: O(1)
  */
  function maxProduct(nums: number[]): number {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];

for (let i = 1; i < nums.length; i++) {
const num = nums[i];
const tempMax = maxProd; // save before overwrite!

    maxProd = Math.max(num, tempMax * num, minProd * num);
    minProd = Math.min(num, tempMax * num, minProd * num);
    result  = Math.max(result, maxProd);

}

return result;
}

// ── inline tests ──
// maxProduct([2,3,-2,4]) → 6
// maxProduct([-2,0,-1]) → 0
// maxProduct([-2,3,-4]) → 24
// maxProduct([-2]) → -2 (must return element even if negative)
```

## 🔗 Related Problems

- [LC #53 Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) — Kadane's without min tracking (sum version)
- [LC #152 Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) — this problem
- [LC #238 Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) — prefix/suffix products technique
- [LC #713 Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) — counting subarrays by product constraint
- [LC #628 Maximum Product of Three Numbers](https://leetcode.com/problems/maximum-product-of-three-numbers/) — simplified product optimization
